<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { ExportRecordItem } from '#/api';

import { Page } from '@vben/common-ui';

import { Button, message, Modal, Space, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteExportRecordsApi,
  downloadExportFileApi,
  getExportRecordListApi,
} from '#/api';

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '雷达原始数据', value: 0 },
          { label: '雷达数据组', value: 1 },
        ],
        placeholder: '导出类型',
      },
      fieldName: 'type',
      label: '导出类型',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '处理中', value: 0 },
          { label: '成功', value: 1 },
          { label: '失败', value: 2 },
        ],
        placeholder: '状态',
      },
      fieldName: 'status',
      label: '状态',
    },
  ],
  showCollapseButton: true,
  submitOnChange: false,
  submitOnEnter: false,
};

const getTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
    '0': '雷达原始数据',
    '1': '雷达数据组',
  };
  return typeMap[type] || '未知';
};

const getTypeColor = (type: number) => {
  const colorMap: Record<number, string> = {
    '0': 'blue',
    '1': 'cyan',
  };
  return colorMap[type] || 'default';
};

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    '0': '处理中',
    '1': '成功',
    '2': '失败',
  };
  return statusMap[status] || '未知';
};

const getStatusColor = (status: number) => {
  const colorMap: Record<number, string> = {
    '0': 'processing',
    '1': 'success',
    '2': 'error',
  };
  return colorMap[status] || 'default';
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN');
};

const gridOptions: VxeGridProps<ExportRecordItem> = {
  checkboxConfig: {
    highlight: true,
    reserve: true,
  },
  rowConfig: {
    keyField: 'id',
  },
  columns: [
    { type: 'checkbox', width: 50 },
    { field: 'id', minWidth: 80, title: 'ID' },
    {
      field: 'type',
      minWidth: 150,
      slots: { default: 'type' },
      title: '导出类型',
    },
    {
      field: 'status',
      minWidth: 100,
      slots: { default: 'status' },
      title: '状态',
    },
    { field: 'progress', minWidth: 100, title: '进度' },
    { field: 'fileName', minWidth: 300, title: '文件名' },
    {
      field: 'fileSize',
      minWidth: 120,
      slots: { default: 'fileSize' },
      title: '文件大小',
    },
    {
      field: 'createTime',
      minWidth: 180,
      slots: { default: 'createTime' },
      title: '创建时间',
    },
    {
      field: 'updateTime',
      minWidth: 180,
      slots: { default: 'updateTime' },
      title: '更新时间',
    },
    {
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 150,
    },
  ],
  height: '100%',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getExportRecordListApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          type: formValues?.type,
          status: formValues?.status,
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

const handleDownload = async (record: ExportRecordItem) => {
  try {
    const blob = await downloadExportFileApi(record.id);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = record.fileName || `export_${record.id}.xlsx`;
    document.body.append(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    message.success('下载成功');
  } catch (error: any) {
    message.error(error.message || '下载失败');
  }
};

const handleDelete = (record: ExportRecordItem) => {
  Modal.confirm({
    content: `确定要删除该导出记录吗？`,
    title: '确认删除',
    async onOk() {
      try {
        await deleteExportRecordsApi([record.id]);
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
    content: `确定要删除选中的 ${selectedRecords.length} 条导出记录吗？`,
    title: '确认批量删除',
    async onOk() {
      try {
        const ids = selectedRecords.map((record) => record.id);
        await deleteExportRecordsApi(ids);
        message.success('批量删除成功');
        gridApi.grid.commitProxy('query');
      } catch (error: any) {
        message.error(error.message || '批量删除失败');
      }
    },
  });
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar_buttons>
        <Space>
          <Button danger type="primary" @click="handleBatchDelete">
            批量删除
          </Button>
        </Space>
      </template>

      <template #type="{ row }">
        <Tag :color="getTypeColor(row.type)">
          {{ getTypeText(row.type) }}
        </Tag>
      </template>

      <template #status="{ row }">
        <Tag :color="getStatusColor(row.status)">
          {{ getStatusText(row.status) }}
        </Tag>
      </template>

      <template #fileSize="{ row }">
        {{ formatFileSize(row.fileSize) }}
      </template>

      <template #createTime="{ row }">
        {{ formatTime(row.createTime) }}
      </template>

      <template #updateTime="{ row }">
        {{ formatTime(row.updateTime) }}
      </template>

      <template #action="{ row }">
        <Space>
          <Button
            :disabled="row.status !== 1"
            size="small"
            type="link"
            @click="handleDownload(row)"
          >
            下载
          </Button>
          <Button danger size="small" type="link" @click="handleDelete(row)">
            删除
          </Button>
        </Space>
      </template>
    </Grid>
  </Page>
</template>
