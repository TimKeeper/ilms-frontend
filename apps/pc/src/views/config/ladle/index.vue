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
  Space,
  Table,
} from 'ant-design-vue';
import { z } from 'zod';

import { useVbenForm } from '#/adapter/form';
import {
  createIronApi,
  deleteIronApi,
  getIronListApi,
  type IronItem,
  updateIronApi,
} from '#/api';

const dataSource = ref<IronItem[]>([]);
const loading = ref(false);
const total = ref(0);
const pagination = ref({
  current: 1,
  pageSize: 10,
});

const searchForm = ref({
  ironName: '',
  tagSn: undefined as number | undefined,
});

const columns: ColumnsType<IronItem> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '铁包名称',
    dataIndex: 'ironName',
    key: 'ironName',
    width: 150,
  },
  {
    title: '标识器ID1',
    dataIndex: 'tagSn1',
    key: 'tagSn1',
    width: 120,
  },
  {
    title: '标识器ID2',
    dataIndex: 'tagSn2',
    key: 'tagSn2',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
];

const drawerVisible = ref(false);
const editingRecord = ref<IronItem | null>(null);
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
        placeholder: '请输入铁包名称',
      },
      fieldName: 'ironName',
      label: '铁包名称',
      rules: z.string().min(1, { message: '请输入铁包名称' }),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入标识器ID1',
        min: 1,
        class: 'w-full',
      },
      fieldName: 'tagSn1',
      label: '标识器ID1',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入标识器ID2',
        min: 1,
        class: 'w-full',
      },
      fieldName: 'tagSn2',
      label: '标识器ID2',
    },
  ],
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getIronListApi({
      page: pagination.value.current,
      pageSize: pagination.value.pageSize,
      ironName: searchForm.value.ironName || undefined,
      tagSn: searchForm.value.tagSn,
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
    ironName: '',
    tagSn: undefined,
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

const handleEdit = (record: IronItem) => {
  isEditMode.value = true;
  editingRecord.value = record;
  formApi.setValues({
    ironName: record.ironName,
    tagSn1: record.tagSn1 || undefined,
    tagSn2: record.tagSn2 || undefined,
  });
  drawerVisible.value = true;
};

const handleDelete = (record: IronItem) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除铁包"${record.ironName}"吗？`,
    async onOk() {
      try {
        await deleteIronApi([record.id]);
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
      await updateIronApi(editingRecord.value.id, {
        ironName: values.ironName as string,
        tagSn1: values.tagSn1 as number | undefined,
        tagSn2: values.tagSn2 as number | undefined,
      });
      message.success('更新成功');
    } else {
      await createIronApi({
        ironName: values.ironName as string,
        tagSn1: values.tagSn1 as number | undefined,
        tagSn2: values.tagSn2 as number | undefined,
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

onMounted(() => {
  fetchData();
});
</script>

<template>
  <Page title="铁包配置管理" description="管理铁包的基本信息、高温标识器绑定等">
    <Card :bordered="false">
      <div class="mb-4">
        <Space class="mb-2">
          <Input
            v-model:value="searchForm.ironName"
            placeholder="铁包名称"
            style="width: 200px"
            allow-clear
          />
          <InputNumber
            v-model:value="searchForm.tagSn"
            placeholder="标识器ID"
            style="width: 200px"
            :min="1"
          />
          <Button type="primary" @click="handleSearch">查询</Button>
          <Button @click="handleReset">重置</Button>
        </Space>
      </div>

      <div class="mb-4">
        <Button type="primary" @click="handleAdd">新增铁包</Button>
      </div>

      <Table
        :columns="columns"
        :data-source="dataSource"
        :row-key="(record: IronItem) => record.id"
        :loading="loading"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
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
      :title="isEditMode ? '编辑铁包' : '新增铁包'"
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
