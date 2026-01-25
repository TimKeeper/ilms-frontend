<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type {
  RadarDataGroupItem,
  RadarDataItem,
  RadarDataParams,
} from '#/api/radar';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { message, Radio, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getRadarDataApi, getRadarDataGroupApi } from '#/api/radar';
import { getBoundListApi, getStationListApi, getTagListApi } from '#/api/util';

const activeType = ref<'data' | 'dataGroup'>('data');

// ===== Constants & Helpers =====
const tagTypeOptions = [
  { label: '铁包', value: 0 },
  { label: '车架', value: 1 },
];

const formatTime = (timestamp: number) => {
  return timestamp ? dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss') : '-';
};

const getTagTypeColor = (type: number | undefined) => {
  // eslint-disable-next-line unicorn/no-nested-ternary
  return type === 0 ? 'orange' : type === 1 ? 'blue' : 'default';
};

const getTagTypeText = (type: number | undefined) => {
  // eslint-disable-next-line unicorn/no-nested-ternary
  return type === 0 ? '铁包' : type === 1 ? '车架' : '-';
};

// ===== Data Source: Options =====
const stationOptions = ref<{ label: string; value: string }[]>([]);
const tagSnOptions = ref<{ label: string; value: number }[]>([]);
const boundOptions = ref<{ label: string; value: string }[]>([]);

const loadStationOptions = async () => {
  try {
    const res = await getStationListApi();
    // stationLabel is used in query, so value acts as the label string
    stationOptions.value = (res.stationList || []).map((item) => ({
      label: item.label,
      value: item.label,
    }));
  } catch (error) {
    console.error('Failed to load station list', error);
  }
};

const fetchTagOptions = async (type?: number) => {
  try {
    const res = await getTagListApi({ type: type as 0 | 1 });
    tagSnOptions.value = (res.tagList || []).map((t) => ({
      label: `${t.tagSn} (${t.tagBoundName || '-'})`,
      value: t.tagSn,
    }));
  } catch (error) {
    console.error('Failed to load tag list', error);
  }
};

const fetchBoundOptions = async (type?: number) => {
  try {
    const res = await getBoundListApi({ type: type as 0 | 1 });
    boundOptions.value = (res.boundList || []).map((b) => ({
      label: b.boundName,
      value: b.boundName,
    }));
  } catch (error) {
    console.error('Failed to load bound list', error);
  }
};

// ===== Original Data (Raw Data) =====
const cursorMap = ref<Record<number, number | undefined>>({});
const lastQueryParams = ref<string>('');

const dataFormOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      fieldName: 'radarHost',
      label: '雷达IP',
      component: 'Input',
      componentProps: {
        placeholder: '请输入雷达IP',
      },
      rules: 'required',
    },
    {
      fieldName: 'radarPort',
      label: '雷达端口',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入端口',
      },
      rules: 'required',
    },
    {
      fieldName: 'radarAddress',
      label: '雷达地址',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入地址',
      },
      rules: 'required',
    },
    {
      fieldName: 'stationLabel',
      label: '工位名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择工位',
        options: stationOptions,
        allowClear: true,
        showSearch: true,
      },
    },
    {
      fieldName: 'tagType',
      label: '标识器类型',
      component: 'Select',
      componentProps: (api: any) => {
        return {
          options: tagTypeOptions,
          placeholder: '请选择类型',
          allowClear: true,
          onChange: (val: any) => {
            fetchTagOptions(val);
            fetchBoundOptions(val);
            if (api?.formModel) {
              api.formModel.tagSn = undefined;
              api.formModel.tagBoundName = undefined;
            }
          },
        };
      },
    },
    {
      fieldName: 'tagSn',
      label: '标识器ID',
      component: 'Select',
      componentProps: {
        placeholder: '请选择ID',
        options: tagSnOptions,
        allowClear: true,
        showSearch: true,
      },
    },
    {
      fieldName: 'tagBoundName',
      label: '绑定对象',
      component: 'Select',
      componentProps: {
        placeholder: '请选择绑定对象',
        options: boundOptions,
        allowClear: true,
        showSearch: true,
      },
    },
    {
      fieldName: 'timeRange',
      label: '时间范围',
      component: 'RangePicker',
      componentProps: {
        showTime: true,
        allowClear: true,
      },
    },
  ],
  showCollapseButton: true,
  submitOnChange: false,
  submitOnEnter: false, // Wait for manuals submit
};

const dataGridOptions: VxeGridProps<RadarDataItem> = {
  rowConfig: {
    keyField: 'id',
  },
  columns: [
    { field: 'radarHost', minWidth: 140, title: '雷达IP' },
    { field: 'radarPort', minWidth: 100, title: '端口' },
    { field: 'radarAddress', minWidth: 80, title: '地址' },
    { field: 'stationLabel', minWidth: 120, title: '工位名称' },
    {
      field: 'tagType',
      minWidth: 100,
      title: '类型',
      slots: { default: 'tagType' },
    },
    { field: 'tagBoundName', minWidth: 120, title: '绑定对象' },
    { field: 'tagSn', minWidth: 100, title: '标签号' },
    { field: 'functionCode', minWidth: 80, title: '功能码' },
    { field: 'dataLength', minWidth: 80, title: '长度' },
    { field: 'pulse1', minWidth: 80, title: 'Pulse1' },
    { field: 'pulse2', minWidth: 80, title: 'Pulse2' },
    { field: 'pulse3', minWidth: 80, title: 'Pulse3' },
    { field: 'pulse4', minWidth: 80, title: 'Pulse4' },
    { field: 'pulse5', minWidth: 80, title: 'Pulse5' },
    { field: 'baseLine', minWidth: 80, title: '基线' },
    { field: 'pulseFrequency', minWidth: 80, title: '频率' },
    { field: 'antennaNumber', minWidth: 80, title: '天线号' },
    { field: 'crc16', minWidth: 80, title: 'CRC16' },
    {
      field: 'inputTime',
      minWidth: 160,
      title: '时间',
      slots: { default: 'inputTime' },
    },
  ],
  height: 'auto',
  maxHeight: 700,
  pagerConfig: {
    autoHidden: false,
  },
  proxyConfig: {
    autoLoad: false, // Do not load automatically
    ajax: {
      query: async ({ page }, formValues) => {
        const { currentPage, pageSize } = page;

        // Manual input check for required fields
        if (
          !formValues.radarHost ||
          !formValues.radarPort ||
          !formValues.radarAddress
        ) {
          // If not trigger by submit button (e.g. initial load if autoLoad was true), return empty.
          // Since we use proxyConfig.autoLoad: false, this should only run on submit or pager.
          // However, if the user clicks query without filling, we should probably return empty or handle validation.
          // Vben form handles validation before submit, usually. IF validation passes, query runs.
          // If validation fails, query should not run.
          // But just in case:
          return { items: [], total: 0 };
        }

        // 1. Check for resets (filter or pageSize change)
        let startTime: number | undefined;
        let endTime: number | undefined;
        if (formValues.timeRange && formValues.timeRange.length === 2) {
          startTime = formValues.timeRange[0].valueOf();
          endTime = formValues.timeRange[1].valueOf();
        }

        const paramsForCheck = {
          ...formValues,
          pageSize,
          startTime,
          endTime,
          timeRange: undefined,
        };

        const currentParamsStr = JSON.stringify(paramsForCheck);

        if (currentPage === 1 || currentParamsStr !== lastQueryParams.value) {
          cursorMap.value = {};
          lastQueryParams.value = currentParamsStr;
        }

        let cursor: number | undefined;
        if (currentPage > 1) {
          cursor = cursorMap.value[currentPage];
        }

        const params: RadarDataParams = {
          radarHost: formValues.radarHost,
          radarPort: formValues.radarPort,
          radarAddress: formValues.radarAddress,
          stationLabel: formValues.stationLabel,
          tagType: formValues.tagType,
          tagSn: formValues.tagSn,
          tagBoundName: formValues.tagBoundName,
          startTime,
          endTime,
          cursor,
          pageSize,
        };

        const res = await getRadarDataApi(params);
        const items = res.items || [];
        let total = 0;

        if (items.length === 0 && currentPage > 1) {
          message.warning('已经是最后一页了');
          total = (currentPage - 1) * pageSize;
        } else {
          if (
            res.cursor !== undefined &&
            res.cursor !== null &&
            currentPage < 100
          ) {
            cursorMap.value[currentPage + 1] = res.cursor;
            total = (currentPage + 1) * pageSize;
          } else {
            total = currentPage * pageSize;
          }
        }
        return { items, total };
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

const [DataGrid] = useVbenVxeGrid({
  formOptions: dataFormOptions,
  gridOptions: dataGridOptions,
});

// ===== Merged Data (Group Data) =====

const dataGroupFormOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      fieldName: 'radarHost',
      label: '雷达IP',
      component: 'Input',
      componentProps: {
        placeholder: '请输入雷达IP',
      },
    },
    {
      fieldName: 'stationLabel',
      label: '工位名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择工位',
        options: stationOptions,
        allowClear: true,
        showSearch: true,
      },
    },
    {
      fieldName: 'tagType',
      label: '标识器类型',
      component: 'Select',
      componentProps: (api: any) => {
        return {
          options: tagTypeOptions,
          placeholder: '请选择类型',
          allowClear: true,
          onChange: (val: any) => {
            fetchTagOptions(val);
            fetchBoundOptions(val);
            if (api?.formModel) {
              api.formModel.tagSn = undefined;
              api.formModel.tagBoundName = undefined;
            }
          },
        };
      },
    },
    {
      fieldName: 'tagSn',
      label: '标识器ID',
      component: 'Select',
      componentProps: {
        placeholder: '请选择ID',
        options: tagSnOptions,
        allowClear: true,
        showSearch: true,
      },
    },
    {
      fieldName: 'tagBoundName',
      label: '绑定对象',
      component: 'Select',
      componentProps: {
        placeholder: '请选择绑定对象',
        options: boundOptions,
        allowClear: true,
        showSearch: true,
      },
    },
    {
      fieldName: 'timeRange',
      label: '时间范围',
      component: 'RangePicker',
      componentProps: {
        showTime: true,
        allowClear: false,
      },
      defaultValue: [dayjs().startOf('day'), dayjs().endOf('day')],
      rules: 'required',
    },
  ],
  showCollapseButton: true,
  submitOnChange: false,
  submitOnEnter: false,
};

const dataGroupGridOptions: VxeGridProps<RadarDataGroupItem> = {
  rowConfig: {
    keyField: 'id',
  },
  columns: [
    { field: 'radarHost', minWidth: 140, title: '雷达IP' },
    { field: 'radarPort', minWidth: 80, title: '端口' },
    { field: 'radarAddress', minWidth: 80, title: '地址' },
    { field: 'radarAntennaNum', minWidth: 80, title: '天线' },
    { field: 'stationLabel', minWidth: 120, title: '工位名称' },
    {
      field: 'tagType',
      minWidth: 100,
      title: '类型',
      slots: { default: 'tagType' },
    },
    { field: 'tagBoundName', minWidth: 120, title: '绑定对象' },
    { field: 'tagSn', minWidth: 100, title: '标签号' },
    { field: 'tagMaxPulse', minWidth: 100, title: 'Max Pulse' },
    { field: 'tagReadCount', minWidth: 100, title: '读取次数' },
    {
      field: 'startTime',
      minWidth: 160,
      title: '开始时间',
      slots: { default: 'startTime' },
    },
    {
      field: 'endTime',
      minWidth: 160,
      title: '结束时间',
      slots: { default: 'endTime' },
    },
    {
      field: 'updateTime',
      minWidth: 160,
      title: '更新时间',
      slots: { default: 'updateTime' },
    },
    {
      field: 'lastTime',
      minWidth: 160,
      title: '最新时间',
      slots: { default: 'lastTime' },
    },
  ],
  height: 'auto',
  maxHeight: 700,
  pagerConfig: {},
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async ({ page }, formValues) => {
        let startTime: number | undefined;
        let endTime: number | undefined;
        if (formValues.timeRange && formValues.timeRange.length === 2) {
          startTime = formValues.timeRange[0].valueOf();
          endTime = formValues.timeRange[1].valueOf();
        }

        const res = await getRadarDataGroupApi({
          ...formValues,
          startTime,
          endTime,
          page: page.currentPage,
          pageSize: page.pageSize,
          timeRange: undefined,
        });

        return {
          items: res.items,
          total: res.total,
        };
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

const [DataGroupGrid] = useVbenVxeGrid({
  formOptions: dataGroupFormOptions,
  gridOptions: dataGroupGridOptions,
});

onMounted(() => {
  loadStationOptions();
  fetchTagOptions();
  fetchBoundOptions();
});
</script>

<template>
  <Page auto-content-height>
    <div class="h-full w-full">
      <DataGrid v-if="activeType === 'data'">
        <template #toolbar_buttons>
          <Radio.Group v-model:value="activeType" button-style="solid">
            <Radio.Button value="data">原始数据</Radio.Button>
            <Radio.Button value="dataGroup">合并数据</Radio.Button>
          </Radio.Group>
        </template>

        <template #tagType="{ row }">
          <Tag :color="getTagTypeColor(row.tagType)">
            {{ getTagTypeText(row.tagType) }}
          </Tag>
        </template>

        <template #inputTime="{ row }">
          {{ formatTime(row.inputTime) }}
        </template>
      </DataGrid>

      <DataGroupGrid v-else>
        <template #toolbar_buttons>
          <Radio.Group v-model:value="activeType" button-style="solid">
            <Radio.Button value="data">原始数据</Radio.Button>
            <Radio.Button value="dataGroup">合并数据</Radio.Button>
          </Radio.Group>
        </template>

        <template #tagType="{ row }">
          <Tag :color="getTagTypeColor(row.tagType)">
            {{ getTagTypeText(row.tagType) }}
          </Tag>
        </template>

        <template #startTime="{ row }">
          {{ formatTime(row.startTime) }}
        </template>
        <template #endTime="{ row }">
          {{ formatTime(row.endTime) }}
        </template>
        <template #updateTime="{ row }">
          {{ formatTime(row.updateTime) }}
        </template>
        <template #lastTime="{ row }">
          {{ formatTime(row.lastTime) }}
        </template>
      </DataGroupGrid>
    </div>
  </Page>
</template>
