<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { StationAlarmItem } from '#/api';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Drawer, message, Space, Switch } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getStationAlarmListApi, updateStationAlarmApi } from '#/api';

const drawerVisible = ref(false);
const editingRecord = ref<null | StationAlarmItem>(null);

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '工位名称',
      },
      fieldName: 'label',
      label: '工位名称',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '工位代号',
      },
      fieldName: 'code',
      label: '工位代号',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: '工序ID',
      },
      fieldName: 'processId',
      label: '工序ID',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '全部', value: undefined },
          { label: '显示', value: 1 },
          { label: '隐藏', value: 0 },
        ],
        placeholder: '标签显示状态',
      },
      fieldName: 'showTagStatus',
      label: '标签显示状态',
    },
  ],
  showCollapseButton: true,
  submitOnChange: false,
  submitOnEnter: false,
};

const gridOptions: VxeGridProps<StationAlarmItem> = {
  checkboxConfig: {
    highlight: true,
  },
  columns: [
    { field: 'id', minWidth: 80, title: 'ID' },
    { field: 'label', minWidth: 180, title: '工位名称' },
    { field: 'code', minWidth: 120, title: '工位代号' },
    { field: 'processId', minWidth: 100, title: '工序ID' },
    { field: 'type', minWidth: 100, title: '类型' },
    { field: 'alarmA', minWidth: 100, title: '报警A' },
    { field: 'alarmB', minWidth: 100, title: '报警B' },
    { field: 'alarmC', minWidth: 100, title: '报警C' },
    {
      field: 'inputTime',
      formatter: ({ cellValue }) => {
        return cellValue ? new Date(cellValue).toLocaleString('zh-CN') : '';
      },
      minWidth: 180,
      title: '录入时间',
    },
    {
      field: 'alarmStatus',
      fixed: 'right',
      slots: { default: 'alarmStatus' },
      title: '报警状态',
      width: 120,
    },
    {
      field: 'showTagStatus',
      fixed: 'right',
      slots: { default: 'showTagStatus' },
      title: '标签显示',
      width: 120,
    },
    {
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 100,
    },
  ],
  height: '100%',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getStationAlarmListApi({
          code: formValues?.code || undefined,
          label: formValues?.label || undefined,
          page: page.currentPage,
          pageSize: page.pageSize,
          processId: formValues?.processId,
          showTagStatus: formValues?.showTagStatus,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    refresh: true,
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
      component: 'Switch',
      componentProps: {
        checkedChildren: '启用',
        checkedValue: 1,
        class: 'w-auto',
        unCheckedChildren: '禁用',
        unCheckedValue: 0,
      },
      fieldName: 'alarmStatus',
      label: '报警状态',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 0,
        placeholder: '请输入报警A值',
      },
      fieldName: 'alarmA',
      label: '报警A',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 0,
        placeholder: '请输入报警B值',
      },
      fieldName: 'alarmB',
      label: '报警B',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 0,
        placeholder: '请输入报警C值',
      },
      fieldName: 'alarmC',
      label: '报警C',
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        checkedChildren: '显示',
        checkedValue: 1,
        class: 'w-auto',
        unCheckedChildren: '隐藏',
        unCheckedValue: 0,
      },
      fieldName: 'showTagStatus',
      label: '标签显示状态',
    },
  ],
  showDefaultActions: false,
});

const handleEdit = (record: StationAlarmItem) => {
  editingRecord.value = record;
  editFormApi.setValues({
    alarmA: record.alarmA,
    alarmB: record.alarmB,
    alarmC: record.alarmC,
    alarmStatus: record.alarmStatus,
    showTagStatus: record.showTagStatus,
  });
  drawerVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await editFormApi.validate();
    const values = await editFormApi.getValues();

    if (editingRecord.value) {
      await updateStationAlarmApi(editingRecord.value.id, {
        alarmA: values.alarmA,
        alarmB: values.alarmB,
        alarmC: values.alarmC,
        alarmStatus: values.alarmStatus,
        showTagStatus: values.showTagStatus,
      });
      message.success('更新成功');
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

// 处理开关状态变化
const handleSwitchChange = async (
  record: StationAlarmItem,
  field: 'alarmStatus' | 'showTagStatus',
  value: boolean,
) => {
  try {
    const newValue = value ? 1 : 0;
    await updateStationAlarmApi(record.id, {
      alarmA: record.alarmA,
      alarmB: record.alarmB,
      alarmC: record.alarmC,
      alarmStatus: field === 'alarmStatus' ? newValue : record.alarmStatus,
      showTagStatus:
        field === 'showTagStatus' ? newValue : record.showTagStatus,
    });
    message.success('更新成功');
    gridApi.grid.commitProxy('query');
  } catch (error: any) {
    message.error(error.message || '更新失败');
    // 刷新数据以恢复原状态
    gridApi.grid.commitProxy('query');
  }
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #alarmStatus="{ row }">
        <Switch
          :checked="row.alarmStatus === 1"
          checked-children="启用"
          un-checked-children="禁用"
          @change="
            (checked) => handleSwitchChange(row, 'alarmStatus', !!checked)
          "
        />
      </template>

      <template #showTagStatus="{ row }">
        <Switch
          :checked="row.showTagStatus === 1"
          checked-children="显示"
          un-checked-children="隐藏"
          @change="
            (checked) => handleSwitchChange(row, 'showTagStatus', !!checked)
          "
        />
      </template>

      <template #action="{ row }">
        <Button size="small" type="link" @click="handleEdit(row)">
          编辑
        </Button>
      </template>
    </Grid>

    <Drawer
      :open="drawerVisible"
      title="编辑报警配置"
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
