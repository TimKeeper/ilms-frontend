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
  createFrameApi,
  deleteFrameApi,
  type FrameItem,
  getFrameListApi,
  updateFrameApi,
} from '#/api';

const dataSource = ref<FrameItem[]>([]);
const loading = ref(false);
const total = ref(0);
const pagination = ref({
  current: 1,
  pageSize: 10,
});

const searchForm = ref({
  frameName: '',
  tagSn: undefined as number | undefined,
});

const columns: ColumnsType<FrameItem> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '车架名称',
    dataIndex: 'frameName',
    key: 'frameName',
    width: 150,
  },
  {
    title: '标识器ID1',
    dataIndex: 'tagSn1',
    key: 'tagSn1',
    width: 100,
  },
  {
    title: '标识器ID2',
    dataIndex: 'tagSn2',
    key: 'tagSn2',
    width: 100,
  },
  {
    title: '标识器ID3',
    dataIndex: 'tagSn3',
    key: 'tagSn3',
    width: 100,
  },
  {
    title: '标识器ID4',
    dataIndex: 'tagSn4',
    key: 'tagSn4',
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
const editingRecord = ref<FrameItem | null>(null);
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
        placeholder: '请输入车架名称',
      },
      fieldName: 'frameName',
      label: '车架名称',
      rules: z.string().min(1, { message: '请输入车架名称' }),
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
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入标识器ID3',
        min: 1,
        class: 'w-full',
      },
      fieldName: 'tagSn3',
      label: '标识器ID3',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入标识器ID4',
        min: 1,
        class: 'w-full',
      },
      fieldName: 'tagSn4',
      label: '标识器ID4',
    },
  ],
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getFrameListApi({
      page: pagination.value.current,
      pageSize: pagination.value.pageSize,
      frameName: searchForm.value.frameName || undefined,
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
    frameName: '',
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

const handleEdit = (record: FrameItem) => {
  isEditMode.value = true;
  editingRecord.value = record;
  formApi.setValues({
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
    title: '确认删除',
    content: `确定要删除车架"${record.frameName}"吗？`,
    async onOk() {
      try {
        await deleteFrameApi([record.id]);
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
      await updateFrameApi(editingRecord.value.id, {
        frameName: values.frameName as string,
        tagSn1: values.tagSn1 as number | undefined,
        tagSn2: values.tagSn2 as number | undefined,
        tagSn3: values.tagSn3 as number | undefined,
        tagSn4: values.tagSn4 as number | undefined,
      });
      message.success('更新成功');
    } else {
      await createFrameApi({
        frameName: values.frameName as string,
        tagSn1: values.tagSn1 as number | undefined,
        tagSn2: values.tagSn2 as number | undefined,
        tagSn3: values.tagSn3 as number | undefined,
        tagSn4: values.tagSn4 as number | undefined,
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
  <Page title="车架配置管理" description="管理车架的基本信息、常温标识器绑定等">
    <Card :bordered="false">
      <div class="mb-4">
        <Space class="mb-2">
          <Input
            v-model:value="searchForm.frameName"
            placeholder="车架名称"
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
        <Button type="primary" @click="handleAdd">新增车架</Button>
      </div>

      <Table
        :columns="columns"
        :data-source="dataSource"
        :row-key="(record: FrameItem) => record.id"
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
      :title="isEditMode ? '编辑车架' : '新增车架'"
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
