<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { FrameItem } from '#/api';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Drawer, message, Modal, Space, Upload } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createFrameApi,
  deleteFrameApi,
  downloadFrameTemplateApi,
  exportFrameApi,
  getFrameListApi,
  importFrameApi,
  updateFrameApi,
} from '#/api';

const drawerVisible = ref(false);
const editingRecord = ref<FrameItem | null>(null);
const isEditMode = ref(false);

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '车架名称',
      },
      fieldName: 'frameName',
      label: '车架名称',
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

const gridOptions: VxeGridProps<FrameItem> = {
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
    { field: 'frameName', minWidth: 180, title: '车架名称' },
    { field: 'tagSn1', minWidth: 120, title: '标识器ID1' },
    { field: 'tagSn2', minWidth: 120, title: '标识器ID2' },
    { field: 'tagSn3', minWidth: 120, title: '标识器ID3' },
    { field: 'tagSn4', minWidth: 120, title: '标识器ID4' },
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
        return await getFrameListApi({
          frameName: formValues?.frameName || undefined,
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
        placeholder: '请输入车架名称',
      },
      fieldName: 'frameName',
      label: '车架名称',
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
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 1,
        placeholder: '请输入标识器ID3',
      },
      fieldName: 'tagSn3',
      label: '标识器ID3',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 1,
        placeholder: '请输入标识器ID4',
      },
      fieldName: 'tagSn4',
      label: '标识器ID4',
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

const handleEdit = (record: FrameItem) => {
  isEditMode.value = true;
  editingRecord.value = record;
  editFormApi.setValues({
    frameName: record.frameName,
    tagSn1: record.tagSn1 || undefined,
    tagSn2: record.tagSn2 || undefined,
    tagSn3: record.tagSn3 || undefined,
    tagSn4: record.tagSn4 || undefined,
  });
  drawerVisible.value = true;
};

const handleDelete = (record: FrameItem) => {
  Modal.confirm({
    content: `确定要删除车架"${record.frameName}"吗？`,
    title: '确认删除',
    async onOk() {
      try {
        await deleteFrameApi([record.id]);
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
    content: `确定要删除选中的 ${selectedRecords.length} 条车架数据吗？`,
    title: '确认批量删除',
    async onOk() {
      try {
        const ids = selectedRecords.map((record) => record.id);
        await deleteFrameApi(ids);
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
      await updateFrameApi(editingRecord.value.id, {
        frameName: values.frameName,
        tagSn1: values.tagSn1,
        tagSn2: values.tagSn2,
        tagSn3: values.tagSn3,
        tagSn4: values.tagSn4,
      });
      message.success('更新成功');
    } else {
      await createFrameApi({
        frameName: values.frameName,
        tagSn1: values.tagSn1,
        tagSn2: values.tagSn2,
        tagSn3: values.tagSn3,
        tagSn4: values.tagSn4,
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
    const blob = await downloadFrameTemplateApi();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '车架导入模板.xlsx';
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
    const result = await importFrameApi(file);
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
    const blob = await exportFrameApi({
      frameName: formValues?.frameName || undefined,
      tagSn: formValues?.tagSn,
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `车架数据_${Date.now()}.xlsx`;
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
          <Button type="primary" @click="handleAdd">新增车架</Button>
          <Button danger type="primary" @click="handleBatchDelete">
            批量删除
          </Button>
          <Button @click="handleDownloadTemplate">下载导入模板</Button>
          <Upload
            :before-upload="handleImport"
            :show-upload-list="false"
            accept=".xls,.xlsx"
          >
            <Button>导入车架</Button>
          </Upload>
          <Button @click="handleExport">导出车架</Button>
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
      :title="isEditMode ? '编辑车架' : '新增车架'"
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
