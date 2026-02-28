<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { IronItem } from '#/api';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Drawer, message, Modal, Space, Upload } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createIronApi,
  deleteIronApi,
  downloadIronTemplateApi,
  exportIronApi,
  getIronListApi,
  importIronApi,
  updateIronApi,
} from '#/api';

const drawerVisible = ref(false);
const editingRecord = ref<IronItem | null>(null);
const isEditMode = ref(false);

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '铁包名称',
      },
      fieldName: 'ironName',
      label: '铁包名称',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: '标识器ID',
      },
      fieldName: 'tagSn',
      label: '标识器ID',
    },
  ],
  showCollapseButton: true,
  submitOnChange: false,
  submitOnEnter: false,
};

const gridOptions: VxeGridProps<IronItem> = {
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
    { field: 'ironName', minWidth: 180, title: '铁包名称' },
    { field: 'tagSn1', minWidth: 120, title: '标识器ID1' },
    { field: 'tagSn2', minWidth: 120, title: '标识器ID2' },
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
        return await getIronListApi({
          ironName: formValues?.ironName || undefined,
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
        placeholder: '请输入铁包名称',
      },
      fieldName: 'ironName',
      label: '铁包名称',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 1,
        placeholder: '请输入标识器ID1',
      },
      fieldName: 'tagSn1',
      label: '标识器ID1',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 1,
        placeholder: '请输入标识器ID2',
      },
      fieldName: 'tagSn2',
      label: '标识器ID2',
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

const handleEdit = (record: IronItem) => {
  isEditMode.value = true;
  editingRecord.value = record;
  editFormApi.setValues({
    ironName: record.ironName,
    tagSn1: record.tagSn1 || undefined,
    tagSn2: record.tagSn2 || undefined,
  });
  drawerVisible.value = true;
};

const handleDelete = (record: IronItem) => {
  Modal.confirm({
    content: `确定要删除铁包"${record.ironName}"吗？`,
    title: '确认删除',
    async onOk() {
      try {
        await deleteIronApi([record.id]);
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
    content: `确定要删除选中的 ${selectedRecords.length} 条铁包数据吗？`,
    title: '确认批量删除',
    async onOk() {
      try {
        const ids = selectedRecords.map((record) => record.id);
        await deleteIronApi(ids);
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
      await updateIronApi(editingRecord.value.id, {
        ironName: values.ironName,
        tagSn1: values.tagSn1,
        tagSn2: values.tagSn2,
      });
      message.success('更新成功');
    } else {
      await createIronApi({
        ironName: values.ironName,
        tagSn1: values.tagSn1,
        tagSn2: values.tagSn2,
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
    const blob = await downloadIronTemplateApi();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '铁包导入模板.xlsx';
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
    const result = await importIronApi(file);
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
    const blob = await exportIronApi({
      ironName: formValues?.ironName || undefined,
      tagSn: formValues?.tagSn,
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `铁包数据_${Date.now()}.xlsx`;
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
          <Button type="primary" @click="handleAdd">新增铁包</Button>
          <Button danger type="primary" @click="handleBatchDelete">
            批量删除
          </Button>
          <Button @click="handleDownloadTemplate">下载导入模板</Button>
          <Upload
            :before-upload="handleImport"
            :show-upload-list="false"
            accept=".xls,.xlsx"
          >
            <Button>导入铁包</Button>
          </Upload>
          <Button @click="handleExport">导出铁包</Button>
        </Space>
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
      :title="isEditMode ? '编辑铁包' : '新增铁包'"
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
