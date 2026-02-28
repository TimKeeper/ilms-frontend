<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type {
  BindFailedListItem,
  BoundItem,
  ChaosListItem,
  MissListItem,
  StationInfo,
  TagItem,
} from '#/api';

import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Popover, Radio, Space, Table, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getBindFailedListApi,
  getBoundListApi,
  getChaosListApi,
  getMissListApi,
  getTagListApi,
} from '#/api';

const activeType = ref('miss');

// ===== 漏读列表相关 =====
const boundTypeOptions = [
  { label: '铁包', value: 0 },
  { label: '车架', value: 1 },
];

const boundOptions = ref<BoundItem[]>([]);

// 当绑定类型改变时，加载对应的铁包/车架列表
const handleBoundTypeChange = async (value: number | undefined) => {
  if (value === undefined) {
    boundOptions.value = [];
    return;
  }

  const result = await getBoundListApi({ type: value as 0 | 1 });
  boundOptions.value = result.boundList;
};

const missFormOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: boundTypeOptions,
        placeholder: '铁包/车架类型',
        onChange: handleBoundTypeChange,
      },
      fieldName: 'boundType',
      label: '类型',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        fieldNames: { label: 'boundName', value: 'id' },
        options: computed(() => boundOptions.value),
        placeholder: '请先选择类型',
      },
      fieldName: 'boundId',
      label: '绑定对象',
    },
  ],
  showCollapseButton: true,
  submitOnChange: false,
  submitOnEnter: false,
};

const missGridOptions: VxeGridProps<MissListItem> = {
  rowConfig: {
    keyField: 'id',
  },
  columns: [
    {
      field: 'boundType',
      minWidth: 100,
      slots: { default: 'boundType' },
      title: '类型',
    },
    { field: 'boundName', minWidth: 150, title: '绑定对象' },
    { field: 'preStationLabel', minWidth: 120, title: '上一工位' },
    {
      field: 'preStartTime',
      minWidth: 180,
      slots: { default: 'preStartTime' },
      title: '上一工位时间',
    },
    { field: 'afterStationLabel', minWidth: 120, title: '下一工位' },
    {
      field: 'afterStartTime',
      minWidth: 180,
      slots: { default: 'afterStartTime' },
      title: '下一工位时间',
    },
    {
      field: 'missPathsStations',
      minWidth: 200,
      slots: { default: 'missStations' },
      title: '可能漏读工位',
    },
    {
      field: 'missPaths',
      minWidth: 300,
      slots: { default: 'missPaths' },
      title: '漏读路径',
    },
  ],
  height: 'auto',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getMissListApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          boundType: formValues?.boundType,
          boundId: formValues?.boundId,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    refresh: true,
    slots: { buttons: 'toolbar_buttons' },
    zoom: true,
  },
};

const [MissGrid] = useVbenVxeGrid({
  formOptions: missFormOptions,
  gridOptions: missGridOptions,
});

// ===== 串读列表相关 =====
const tagOptions = ref<TagItem[]>([]);

const loadTagOptions = async () => {
  const result = await getTagListApi();
  tagOptions.value = result.tagList;
};

const chaosFormOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        fieldNames: { label: 'tagSn', value: 'tagSn' },
        options: computed(() => tagOptions.value),
        placeholder: '标识器ID',
        showSearch: true,
      },
      fieldName: 'tagSn',
      label: '标识器ID',
    },
  ],
  showCollapseButton: true,
  submitOnChange: false,
  submitOnEnter: false,
};

const chaosGridOptions: VxeGridProps<ChaosListItem> = {
  rowConfig: {
    keyField: 'id',
  },
  columns: [
    { field: 'tagSn', minWidth: 120, title: '标识器ID' },
    {
      field: 'tagType',
      minWidth: 100,
      slots: { default: 'tagType' },
      title: '标识器类型',
    },
    { field: 'tagBoundName', minWidth: 150, title: '绑定对象' },
    { field: 'normalStationLabel', minWidth: 120, title: '应读工位' },
    {
      field: 'normalStartTime',
      minWidth: 180,
      slots: { default: 'normalStartTime' },
      title: '应读开始时间',
    },
    {
      field: 'normalEndTime',
      minWidth: 180,
      slots: { default: 'normalEndTime' },
      title: '应读结束时间',
    },
    { field: 'chaosStationLabel', minWidth: 120, title: '串读工位' },
    {
      field: 'chaosPoint',
      minWidth: 180,
      slots: { default: 'chaosPoint' },
      title: '串读时间点',
    },
  ],
  height: 'auto',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getChaosListApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          tagSn: formValues?.tagSn,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    refresh: true,
    slots: { buttons: 'toolbar_buttons' },
    zoom: true,
  },
};

const [ChaosGrid] = useVbenVxeGrid({
  formOptions: chaosFormOptions,
  gridOptions: chaosGridOptions,
});

// ===== 绑定失败相关 =====
const bindFailTypeMap: Record<number, string> = {
  1: '未读取到车架前标签，先读到高温标签',
  2: '未读取到高温标签',
  3: '未读取到车架后标签',
  4: '车架未绑定完成，读取到其他车架标签',
  5: '未读取到车架后标签，读取到其他高温标签',
  6: '绑定判定车架前后标签相同，是否发生倒车？',
  7: '车架前标签与高温标签绑定时工位不连续',
  8: '高温标签与车架后标签绑定时工位不连续',
  9: '未读取到高温标签（未绑定到高温标签，该车架其他标签已出现在其他不连续的工位）',
  10: '未读取到车架后标签（未绑定到车架后标签，该车架其他标签已出现在其他不连续工位）',
  11: '未读取到车架后标签（该高温标签已出现在其他不连续工位）',
  99: '其他异常',
};

const getBindFailTypeText = (type: number) => {
  return bindFailTypeMap[type] || '未知异常';
};

const bindFailedFormOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'frameName',
      label: '车架名称',
      componentProps: {
        placeholder: '请输入车架名称',
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'ironName',
      label: '铁包名称',
      componentProps: {
        placeholder: '请输入铁包名称',
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'stationLabel',
      label: '工位名称',
      componentProps: {
        placeholder: '请输入工位名称',
        allowClear: true,
      },
    },
  ],
  showCollapseButton: true,
  submitOnChange: false,
  submitOnEnter: true,
};

const bindFailedGridOptions: VxeGridProps<BindFailedListItem> = {
  rowConfig: {
    keyField: 'id',
  },
  columns: [
    { field: 'stationLabel', minWidth: 120, title: '工位名称' },
    { field: 'frameName', minWidth: 120, title: '车架名称' },
    { field: 'ironName', minWidth: 120, title: '铁包名称' },
    {
      field: 'failType',
      minWidth: 200,
      slots: { default: 'failType' },
      title: '失败原因',
    },
    {
      field: 'bindingFailedTime',
      minWidth: 180,
      slots: { default: 'bindingFailedTime' },
      title: '绑定失败时间',
    },
    {
      field: 'preFrameTagSn',
      minWidth: 120,
      slots: { default: 'preFrameTagSn' },
      title: '车架前标签',
    },
    {
      field: 'postFrameTagSn',
      minWidth: 120,
      slots: { default: 'postFrameTagSn' },
      title: '车架后标签',
    },
    { field: 'ironTagSn', minWidth: 120, title: '铁包标签' },
  ],
  height: 'auto',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getBindFailedListApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          frameName: formValues?.frameName || undefined,
          ironName: formValues?.ironName || undefined,
          stationLabel: formValues?.stationLabel || undefined,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    refresh: true,
    slots: { buttons: 'toolbar_buttons' },
    zoom: true,
  },
};

const [BindFailedGrid] = useVbenVxeGrid({
  formOptions: bindFailedFormOptions,
  gridOptions: bindFailedGridOptions,
});

// 格式化时间戳
const formatTime = (timestamp: number) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
};

const formatTimeMs = (timestamp: number | undefined) => {
  if (!timestamp) return '-';
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss.SSS');
};

// 获取类型标签颜色
const getTypeColor = (type: number) => {
  return type === 0 ? 'orange' : 'blue';
};

// 获取类型文本
const getTypeText = (type: number) => {
  return type === 0 ? '铁包' : '车架';
};

// 格式化路径显示
const formatPath = (stations: StationInfo[]) => {
  return stations.map((s) => s.label).join(' → ');
};

// 路径表格列配置
const pathColumns = [
  {
    title: '路径',
    dataIndex: 'path',
    key: 'path',
  },
];

// 初始化
onMounted(() => {
  loadTagOptions();
});
</script>

<template>
  <Page auto-content-height>
    <MissGrid v-if="activeType === 'miss'">
      <template #toolbar_buttons>
        <Radio.Group v-model:value="activeType" button-style="solid">
          <Radio.Button value="miss">漏读列表</Radio.Button>
          <Radio.Button value="chaos">串读列表</Radio.Button>
          <Radio.Button value="bindFailed">绑定失败</Radio.Button>
        </Radio.Group>
      </template>

      <template #boundType="{ row }">
        <Tag :color="getTypeColor(row.boundType)">
          {{ getTypeText(row.boundType) }}
        </Tag>
      </template>

      <template #preStartTime="{ row }">
        {{ formatTime(row.preStartTime) }}
      </template>

      <template #afterStartTime="{ row }">
        {{ formatTime(row.afterStartTime) }}
      </template>

      <template #missStations="{ row }">
        <Space v-if="row.missPathsStations?.length">
          <Tag color="red">
            {{ row.missPathsStations[0]?.label }} ({{
              row.missPathsStations[0]?.code
            }})
          </Tag>
          <Popover
            v-if="row.missPathsStations.length > 1"
            placement="top"
            title="可能漏读工位"
            trigger="hover"
          >
            <template #content>
              <div
                style="
                  display: flex;
                  flex-wrap: wrap;
                  gap: 8px;
                  max-width: 300px;
                "
              >
                <Tag
                  v-for="station in row.missPathsStations"
                  :key="station.id"
                  color="red"
                >
                  {{ station.label }} ({{ station.code }})
                </Tag>
              </div>
            </template>
            <Tag class="cursor-pointer" color="red">
              +{{ row.missPathsStations.length - 1 }}
            </Tag>
          </Popover>
        </Space>
        <span v-else class="text-gray-400">-</span>
      </template>

      <template #missPaths="{ row }">
        <Popover v-if="row.missPaths?.length" placement="left" trigger="click">
          <template #content>
            <div style="max-width: 600px">
              <Table
                :columns="pathColumns"
                :data-source="
                  row.missPaths.map((path: StationInfo[], index: number) => ({
                    key: index,
                    path: formatPath(path),
                  }))
                "
                :pagination="false"
                size="small"
              />
            </div>
          </template>
          <a>查看 {{ row.missPaths.length }} 条可能路径</a>
        </Popover>
        <span v-else class="text-gray-400">-</span>
      </template>
    </MissGrid>

    <ChaosGrid v-if="activeType === 'chaos'">
      <template #toolbar_buttons>
        <Radio.Group v-model:value="activeType" button-style="solid">
          <Radio.Button value="miss">漏读列表</Radio.Button>
          <Radio.Button value="chaos">串读列表</Radio.Button>
          <Radio.Button value="bindFailed">绑定失败</Radio.Button>
        </Radio.Group>
      </template>

      <template #tagType="{ row }">
        <Tag :color="getTypeColor(row.tagType)">
          {{ getTypeText(row.tagType) }}
        </Tag>
      </template>

      <template #normalStartTime="{ row }">
        {{ formatTime(row.normalStartTime) }}
      </template>

      <template #normalEndTime="{ row }">
        {{ formatTime(row.normalEndTime) }}
      </template>

      <template #chaosPoint="{ row }">
        <Tag color="red">{{ formatTime(row.chaosPoint) }}</Tag>
      </template>
    </ChaosGrid>

    <BindFailedGrid v-if="activeType === 'bindFailed'">
      <template #toolbar_buttons>
        <Radio.Group v-model:value="activeType" button-style="solid">
          <Radio.Button value="miss">漏读列表</Radio.Button>
          <Radio.Button value="chaos">串读列表</Radio.Button>
          <Radio.Button value="bindFailed">绑定失败</Radio.Button>
        </Radio.Group>
      </template>

      <template #failType="{ row }">
        <Tag color="red">
          {{ getBindFailTypeText(row.failType) }}
        </Tag>
      </template>

      <template #bindingFailedTime="{ row }">
        {{ formatTime(row.bindingFailedTime) }}
      </template>

      <template #preFrameTagSn="{ row }">
        <Popover v-if="row.preFrameTagSn" placement="top" trigger="hover">
          <template #content>
            <div>
              读取开始时间: {{ formatTimeMs(row.preFrameTagStartTime) }}
            </div>
            <div>读取结束时间: {{ formatTimeMs(row.preFrameTagEndTime) }}</div>
          </template>
          <Tag color="cyan">{{ row.preFrameTagSn }}</Tag>
        </Popover>
        <span v-else class="text-gray-400">-</span>
      </template>

      <template #postFrameTagSn="{ row }">
        <Popover v-if="row.postFrameTagSn" placement="top" trigger="hover">
          <template #content>
            <div>
              读取开始时间: {{ formatTimeMs(row.postFrameTagStartTime) }}
            </div>
            <div>读取结束时间: {{ formatTimeMs(row.postFrameTagEndTime) }}</div>
          </template>
          <Tag color="cyan">{{ row.postFrameTagSn }}</Tag>
        </Popover>
        <span v-else class="text-gray-400">-</span>
      </template>
    </BindFailedGrid>
  </Page>
</template>
