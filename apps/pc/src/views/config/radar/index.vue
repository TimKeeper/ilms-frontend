<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Drawer,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';
import { z } from 'zod';

import { useVbenForm } from '#/adapter/form';
import {
  createRadarApi,
  deleteRadarApi,
  getRadarListApi,
  type RadarItem,
  updateRadarApi,
} from '#/api';

const dataSource = ref<RadarItem[]>([]);
const loading = ref(false);
const total = ref(0);
const pagination = ref({
  current: 1,
  pageSize: 10,
});

const searchForm = ref({
  host: '',
  workstationName: '',
  workstationIndex: undefined as number | undefined,
  workstationProcess: undefined as number | undefined,
});

const columns: ColumnsType<RadarItem> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '雷达IP',
    dataIndex: 'radarHost',
    key: 'radarHost',
    width: 150,
  },
  {
    title: '端口',
    dataIndex: 'radarPort',
    key: 'radarPort',
    width: 100,
  },
  {
    title: '地址',
    dataIndex: 'radarAddress',
    key: 'radarAddress',
    width: 100,
  },
  {
    title: '天线1工位',
    dataIndex: 'radarAntenna1WorkstationName',
    key: 'radarAntenna1WorkstationName',
    width: 120,
  },
  {
    title: '天线2工位',
    dataIndex: 'radarAntenna2WorkstationName',
    key: 'radarAntenna2WorkstationName',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'radarStatus',
    key: 'radarStatus',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
];

const drawerVisible = ref(false);
const editingRecord = ref<null | RadarItem>(null);
const isEditMode = ref(false);

const [BaseForm, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'vertical',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入雷达IP',
      },
      fieldName: 'host',
      label: '雷达IP',
      rules: z.string().min(1, { message: '请输入雷达IP' }),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入端口',
        min: 1,
        max: 65_535,
        class: 'w-full',
      },
      fieldName: 'port',
      label: '端口',
      rules: z.number().min(1).max(65_535),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入地址',
        min: 1,
        class: 'w-full',
      },
      fieldName: 'address',
      label: '地址',
      rules: z.number().min(1, { message: '请输入地址' }),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入天线1工位ID',
        min: 1,
        class: 'w-full',
      },
      fieldName: 'antenna1WorkstationId',
      label: '天线1工位ID',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入天线2工位ID',
        min: 1,
        class: 'w-full',
      },
      fieldName: 'antenna2WorkstationId',
      label: '天线2工位ID',
    },
  ],
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getRadarListApi({
      page: pagination.value.current,
      pageSize: pagination.value.pageSize,
      host: searchForm.value.host || undefined,
      workstationName: searchForm.value.workstationName || undefined,
      workstationIndex: searchForm.value.workstationIndex,
      workstationProcess: searchForm.value.workstationProcess,
    });
    dataSource.value = res.items;
    total.value = res.total;
  } catch (error: any) {
    message.error(error.message || '加载数据失败');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchData();
};

const handleSearch = () => {
  pagination.value.current = 1;
  fetchData();
};

const handleReset = () => {
  searchForm.value = {
    host: '',
    workstationName: '',
    workstationIndex: undefined,
    workstationProcess: undefined,
  };
  pagination.value.current = 1;
  fetchData();
};

const handleAdd = () => {
  isEditMode.value = false;
  editingRecord.value = null;
  formApi.resetForm();
  drawerVisible.value = true;
};

const handleEdit = (record: RadarItem) => {
  isEditMode.value = true;
  editingRecord.value = record;
  formApi.setValues({
    host: record.radarHost,
    port: record.radarPort,
    address: record.radarAddress,
    antenna1WorkstationId: record.radarAntenna1WorkstationId || undefined,
    antenna2WorkstationId: record.radarAntenna2WorkstationId || undefined,
  });
  drawerVisible.value = true;
};

const handleDelete = (record: RadarItem) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除该雷达吗？`,
    async onOk() {
      try {
        await deleteRadarApi([record.id]);
        message.success('删除成功');
        fetchData();
      } catch (error: any) {
        message.error(error.message || '删除失败');
      }
    },
  });
};

const handleSubmit = async () => {
  try {
    const values = await formApi.validate();

    if (isEditMode.value && editingRecord.value) {
      await updateRadarApi(editingRecord.value.id, {
        host: values.host,
        port: values.port,
        antenna1WorkstationId: values.antenna1WorkstationId,
        antenna2WorkstationId: values.antenna2WorkstationId,
      });
      message.success('更新成功');
    } else {
      await createRadarApi({
        host: values.host,
        port: values.port,
        address: values.address,
        antenna1WorkstationId: values.antenna1WorkstationId,
        antenna2WorkstationId: values.antenna2WorkstationId,
      });
      message.success('添加成功');
    }

    drawerVisible.value = false;
    formApi.resetForm();
    fetchData();
  } catch (error: any) {
    message.error(error.message || '操作失败');
  }
};

const handleCancel = () => {
  drawerVisible.value = false;
  formApi.resetForm();
};

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    '-1': 'offline',
    '0': 'connecting',
    '1': 'online',
    '2': 'warn',
  };
  return statusMap[status] || '未知';
};

const getStatusColor = (status: number) => {
  const colorMap: Record<number, string> = {
    '-1': 'default',
    '0': 'processing',
    '1': 'success',
    '2': 'warning',
  };
  return colorMap[status] || 'default';
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <Page title="雷达管理" description="管理雷达设备信息">
    <Card :bordered="false">
      <div class="mb-4">
        <Space class="mb-2">
          <Input
            v-model:value="searchForm.host"
            placeholder="雷达IP"
            style="width: 200px"
            allow-clear
          />
          <Input
            v-model:value="searchForm.workstationName"
            placeholder="工位名称"
            style="width: 200px"
            allow-clear
          />
          <InputNumber
            v-model:value="searchForm.workstationIndex"
            placeholder="工位代号"
            style="width: 200px"
            :min="1"
          />
          <InputNumber
            v-model:value="searchForm.workstationProcess"
            placeholder="工序"
            style="width: 200px"
            :min="1"
          />
          <Button type="primary" @click="handleSearch">查询</Button>
          <Button @click="handleReset">重置</Button>
        </Space>
      </div>

      <div class="mb-4">
        <Button type="primary" @click="handleAdd">新增雷达</Button>
      </div>

      <Table
        :columns="columns"
        :data-source="dataSource"
        :row-key="(record: RadarItem) => record.id"
        :loading="loading"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'radarStatus'">
            <Tag :color="getStatusColor(record.radarStatus)">
              {{ getStatusText(record.radarStatus) }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="handleEdit(record)">
                编辑
              </Button>
              <Button
                type="link"
                size="small"
                danger
                @click="handleDelete(record)"
              >
                删除
              </Button>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <Drawer
      :title="isEditMode ? '编辑雷达' : '新增雷达'"
      :open="drawerVisible"
      :width="600"
      @close="handleCancel"
    >
      <BaseForm />
      <template #footer>
        <Space>
          <Button @click="handleCancel">取消</Button>
          <Button type="primary" @click="handleSubmit">提交</Button>
        </Space>
      </template>
    </Drawer>
  </Page>
</template>
