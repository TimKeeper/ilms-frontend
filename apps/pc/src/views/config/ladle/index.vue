<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { IronItem } from '#/api';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { SettingOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Space,
  Tooltip,
  Upload,
} from 'ant-design-vue';

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

const TERM_STORAGE_KEY = 'ilms:config:ladle:term';
const DEFAULT_TERM = '铁包';
const MAX_TERM_LENGTH = 12;
const PRESET_TERMS = ['铁包', '钢包'] as const;

type PresetTerm = (typeof PRESET_TERMS)[number];
type TermOption = PresetTerm | 'custom';

const normalizeTerm = (value: unknown) => {
  const term = typeof value === 'string' ? value.trim() : '';
  return term ? term.slice(0, MAX_TERM_LENGTH) : DEFAULT_TERM;
};

const readStoredTerm = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_TERM;
  }
  return normalizeTerm(window.localStorage.getItem(TERM_STORAGE_KEY));
};

const isPresetTerm = (term: string): term is PresetTerm => {
  return PRESET_TERMS.includes(term as PresetTerm);
};

const ladleTerm = ref(readStoredTerm());
const termModalVisible = ref(false);
const termSettingOption = ref<TermOption>(
  isPresetTerm(ladleTerm.value) ? ladleTerm.value : 'custom',
);
const customTerm = ref(isPresetTerm(ladleTerm.value) ? '' : ladleTerm.value);

const createSearchSchema = (term: string): VbenFormProps['schema'] => [
  {
    component: 'Input',
    componentProps: {
      placeholder: `${term}名称`,
    },
    fieldName: 'ironName',
    label: `${term}名称`,
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
];

const createColumns = (term: string): VxeGridProps<IronItem>['columns'] => [
  { type: 'checkbox', width: 50 },
  { type: 'seq', minWidth: 80, title: '序号' },
  { field: 'ironName', minWidth: 180, title: `${term}名称` },
  { field: 'tagSn1', minWidth: 120, title: '标识器ID1' },
  { field: 'tagSn2', minWidth: 120, title: '标识器ID2' },
  {
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    width: 200,
  },
];

const createEditSchema = (term: string): VbenFormProps['schema'] => [
  {
    component: 'Input',
    componentProps: {
      placeholder: `请输入${term}名称`,
    },
    fieldName: 'ironName',
    label: `${term}名称`,
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
];

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: createSearchSchema(ladleTerm.value),
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
  columns: createColumns(ladleTerm.value),
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
  schema: createEditSchema(ladleTerm.value),
  showDefaultActions: false,
});

const syncTermLabels = (term: string) => {
  gridApi.setState({
    formOptions: {
      schema: createSearchSchema(term),
    },
    gridOptions: {
      columns: createColumns(term),
    },
  });
  editFormApi.setState({
    schema: createEditSchema(term),
  });
};

const handleOpenTermSetting = () => {
  termSettingOption.value = isPresetTerm(ladleTerm.value)
    ? ladleTerm.value
    : 'custom';
  customTerm.value = isPresetTerm(ladleTerm.value) ? '' : ladleTerm.value;
  termModalVisible.value = true;
};

const handleTermSubmit = () => {
  const nextTerm =
    termSettingOption.value === 'custom'
      ? customTerm.value.trim()
      : termSettingOption.value;

  if (!nextTerm) {
    message.warning('自定义文案不能为空');
    return;
  }

  if (nextTerm.length > MAX_TERM_LENGTH) {
    message.warning(`自定义文案最多 ${MAX_TERM_LENGTH} 个字符`);
    return;
  }

  ladleTerm.value = nextTerm;
  syncTermLabels(nextTerm);
  window.localStorage.setItem(TERM_STORAGE_KEY, nextTerm);
  termModalVisible.value = false;
  message.success('文案设置已保存');
};

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
    content: `确定要删除${ladleTerm.value}"${record.ironName}"吗？`,
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
    content: `确定要删除选中的 ${selectedRecords.length} 条${ladleTerm.value}数据吗？`,
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
    a.download = `${ladleTerm.value}导入模板.xlsx`;
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
    a.download = `${ladleTerm.value}数据_${Date.now()}.xlsx`;
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
          <Button type="primary" @click="handleAdd">
            新增{{ ladleTerm }}
          </Button>
          <Button danger type="primary" @click="handleBatchDelete">
            批量删除
          </Button>
          <Button @click="handleDownloadTemplate">下载导入模板</Button>
          <Upload
            :before-upload="handleImport"
            :show-upload-list="false"
            accept=".xls,.xlsx"
          >
            <Button>导入{{ ladleTerm }}</Button>
          </Upload>
          <Button @click="handleExport">导出{{ ladleTerm }}</Button>
          <Tooltip title="文案设置">
            <Button
              aria-label="文案设置"
              size="small"
              type="text"
              @click="handleOpenTermSetting"
            >
              <template #icon>
                <SettingOutlined />
              </template>
            </Button>
          </Tooltip>
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
      :title="isEditMode ? `编辑${ladleTerm}` : `新增${ladleTerm}`"
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

    <Modal
      v-model:open="termModalVisible"
      ok-text="保存"
      title="文案设置"
      @cancel="termModalVisible = false"
      @ok="handleTermSubmit"
    >
      <Form layout="vertical">
        <Form.Item label="对象名称">
          <Radio.Group v-model:value="termSettingOption">
            <Radio value="铁包">铁包</Radio>
            <Radio value="钢包">钢包</Radio>
            <Radio value="custom">自定义</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item v-if="termSettingOption === 'custom'" label="自定义文案">
          <Input
            v-model:value="customTerm"
            :maxlength="12"
            placeholder="例如：钢包"
            @press-enter="handleTermSubmit"
          />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
