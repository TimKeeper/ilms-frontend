<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { RadarItem } from '#/api';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Drawer,
  message,
  Modal,
  Space,
  Tag,
  Upload,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createRadarApi,
  deleteRadarApi,
  downloadRadarTemplateApi,
  exportRadarApi,
  getRadarListApi,
  importRadarApi,
  updateRadarApi,
} from '#/api';
import { getStationListApi } from '#/api/util';

const drawerVisible = ref(false);
const editingRecord = ref<null | RadarItem>(null);
const isEditMode = ref(false);

const stationOptions = ref<{ label: string; value: number }[]>([]);

const loadStationOptions = async () => {
  try {
    const res = await getStationListApi();
    stationOptions.value = (res.stationList || []).map((item) => ({
      label: item.label,
      value: item.id,
    }));
  } catch (error) {
    console.error('Failed to load station list', error);
  }
};

onMounted(() => {
  loadStationOptions();
});

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '雷达IP',
      },
      fieldName: 'radarHost',
      label: '雷达IP',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '工位名称',
      },
      fieldName: 'stationLabel',
      label: '工位名称',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '工位代号',
      },
      fieldName: 'stationCode',
      label: '工位代号',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: '工序顺序',
      },
      fieldName: 'processOrder',
      label: '工序顺序',
    },
  ],
  showCollapseButton: true,
  submitOnChange: false,
  submitOnEnter: false,
};

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    '-1': 'offline',
    '0': 'connecting',
    '1': 'online',
    '2': 'warn',
    '3': 'readTimeout',
    '4': 'connectError',
  };
  return statusMap[status] || '未知';
};

const getStatusColor = (status: number) => {
  const colorMap: Record<number, string> = {
    '-1': 'default',
    '0': 'processing',
    '1': 'success',
    '2': 'warning',
    '3': 'error',
    '4': 'error',
  };
  return colorMap[status] || 'default';
};

const gridOptions: VxeGridProps<RadarItem> = {
  checkboxConfig: {
    highlight: true,
    reserve: true,
  },
  rowConfig: {
    keyField: 'id',
  },
  columns: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', minWidth: 80, title: '序号' },
    { field: 'radarHost', minWidth: 150, title: '雷达IP' },
    { field: 'radarPort', minWidth: 100, title: '端口' },
    { field: 'radarAddress', minWidth: 100, title: '地址' },
    {
      field: 'radarAntenna1StationLabel',
      minWidth: 180,
      title: '天线1工位',
    },
    {
      field: 'radarAntenna2StationLabel',
      minWidth: 180,
      title: '天线2工位',
    },
    {
      field: 'radarStatus',
      minWidth: 100,
      slots: { default: 'status' },
      title: '状态',
    },
    {
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 200,
    },
  ],
  height: '100%',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getRadarListApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          radarHost: formValues?.radarHost || undefined,
          stationLabel: formValues?.stationLabel || undefined,
          stationCode: formValues?.stationCode || undefined,
          processOrder: formValues?.processOrder,
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

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const [EditForm, editFormApi] = useVbenForm({
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
      fieldName: 'radarHost',
      label: '雷达IP',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        max: 65_535,
        min: 1,
        placeholder: '请输入端口',
      },
      fieldName: 'radarPort',
      label: '端口',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 1,
        placeholder: '请输入地址',
      },
      fieldName: 'radarAddress',
      label: '地址',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        placeholder: '请选择天线1工位',
        options: stationOptions,
        allowClear: true,
        showSearch: true,
      },
      fieldName: 'radarAntenna1StationId',
      label: '天线1工位ID',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        placeholder: '请选择天线2工位',
        options: stationOptions,
        allowClear: true,
        showSearch: true,
      },
      fieldName: 'radarAntenna2StationId',
      label: '天线2工位ID',
    },
  ],
  showDefaultActions: false,
});

const handleAdd = () => {
  isEditMode.value = false;
  editingRecord.value = null;
  editFormApi.resetForm();
  drawerVisible.value = true;
};

const handleEdit = (record: RadarItem) => {
  isEditMode.value = true;
  editingRecord.value = record;
  editFormApi.setValues({
    radarAddress: record.radarAddress,
    radarAntenna1StationId: record.radarAntenna1StationId || undefined,
    radarAntenna2StationId: record.radarAntenna2StationId || undefined,
    radarHost: record.radarHost,
    radarPort: record.radarPort,
  });
  drawerVisible.value = true;
};

const handleDelete = (record: RadarItem) => {
  Modal.confirm({
    content: `确定要删除该雷达吗？`,
    title: '确认删除',
    async onOk() {
      try {
        await deleteRadarApi([record.id]);
        message.success('删除成功');
        gridApi.grid.commitProxy('query');
      } catch (error: any) {
        message.error(error.message || '删除失败');
      }
    },
  });
};

const handleBatchDelete = () => {
  const selectedRecords = gridApi.grid.getCheckboxRecords();
  if (selectedRecords.length === 0) {
    message.warning('请至少选择一条数据');
    return;
  }

  Modal.confirm({
    content: `确定要删除选中的 ${selectedRecords.length} 条雷达数据吗？`,
    title: '确认批量删除',
    async onOk() {
      try {
        const ids = selectedRecords.map((record) => record.id);
        await deleteRadarApi(ids);
        message.success('批量删除成功');
        gridApi.grid.commitProxy('query');
      } catch (error: any) {
        message.error(error.message || '批量删除失败');
      }
    },
  });
};

const handleSubmit = async () => {
  try {
    await editFormApi.validate();
    const values = await editFormApi.getValues();

    if (isEditMode.value && editingRecord.value) {
      await updateRadarApi(editingRecord.value.id, {
        radarAddress: values.radarAddress,
        radarAntenna1StationId: values.radarAntenna1StationId,
        radarAntenna2StationId: values.radarAntenna2StationId,
        radarHost: values.radarHost,
        radarPort: values.radarPort,
      });
      message.success('更新成功');
    } else {
      await createRadarApi({
        radarAddress: values.radarAddress,
        radarAntenna1StationId: values.radarAntenna1StationId,
        radarAntenna2StationId: values.radarAntenna2StationId,
        radarHost: values.radarHost,
        radarPort: values.radarPort,
      });
      message.success('添加成功');
    }

    drawerVisible.value = false;
    editFormApi.resetForm();
    gridApi.grid.commitProxy('query');
  } catch (error: any) {
    message.error(error.message || '操作失败');
  }
};

const handleCancel = () => {
  drawerVisible.value = false;
  editFormApi.resetForm();
};

const handleDownloadTemplate = async () => {
  try {
    const blob = await downloadRadarTemplateApi();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '雷达导入模板.xlsx';
    document.body.append(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    message.success('下载成功');
  } catch (error: any) {
    message.error(error.message || '下载失败');
  }
};

const handleImport = async (file: File) => {
  try {
    const result = await importRadarApi(file);
    if (result.success) {
      message.success(
        `导入成功：共${result.totalRows}条，成功${result.successCount}条`,
      );
      gridApi.grid.commitProxy('query');
    } else {
      Modal.error({
        title: '导入失败',
        content: result.errors.join('\n'),
        width: 600,
      });
    }
  } catch (error: any) {
    message.error(error.message || '导入失败');
  }
  return false;
};

const handleExport = async () => {
  try {
    const formValues = (await gridApi.formApi?.getValues()) || {};
    const blob = await exportRadarApi({
      radarHost: formValues?.radarHost || undefined,
      stationLabel: formValues?.stationLabel || undefined,
      stationCode: formValues?.stationCode || undefined,
      processOrder: formValues?.processOrder,
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `雷达数据_${Date.now()}.xlsx`;
    document.body.append(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    message.success('导出成功');
  } catch (error: any) {
    message.error(error.message || '导出失败');
  }
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar_buttons>
        <Space>
          <Button type="primary" @click="handleAdd">新增雷达</Button>
          <Button danger type="primary" @click="handleBatchDelete">
            批量删除
          </Button>
          <Button @click="handleDownloadTemplate">下载导入模板</Button>
          <Upload
            :before-upload="handleImport"
            :show-upload-list="false"
            accept=".xls,.xlsx"
          >
            <Button>导入雷达</Button>
          </Upload>
          <Button @click="handleExport">导出雷达</Button>
        </Space>
      </template>

      <template #status="{ row }">
        <Tag :color="getStatusColor(row.radarStatus)">
          {{ getStatusText(row.radarStatus) }}
        </Tag>
      </template>

      <template #action="{ row }">
        <Space>
          <Button size="small" type="link" @click="handleEdit(row)">
            编辑
          </Button>
          <Button danger size="small" type="link" @click="handleDelete(row)">
            删除
          </Button>
        </Space>
      </template>
    </Grid>

    <Drawer
      :open="drawerVisible"
      :title="isEditMode ? '编辑雷达' : '新增雷达'"
      :width="600"
      @close="handleCancel"
    >
      <EditForm />
      <template #footer>
        <Space>
          <Button @click="handleCancel">取消</Button>
          <Button type="primary" @click="handleSubmit">提交</Button>
        </Space>
      </template>
    </Drawer>
  </Page>
</template>
