<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
} from 'ant-design-vue';

import {
  getSystemConfigApi,
  type SystemConfigUpdateParams,
  updateSystemConfigApi,
} from '#/api/config';
import { $t } from '#/locales';

// Form model
const formState = ref<SystemConfigUpdateParams>({
  DATA_THINNING: '10',
  STORAGE_CYCLE: '30',
  SYSTEM_TITLE: '',
});

const loading = ref(false);
const submitting = ref(false);

// Load config
const loadConfig = async () => {
  loading.value = true;
  try {
    const res = await getSystemConfigApi();
    if (res) {
      formState.value = {
        DATA_THINNING: String(res.DATA_THINNING),
        STORAGE_CYCLE: String(res.STORAGE_CYCLE),
        SYSTEM_TITLE: res.SYSTEM_TITLE || '',
      };
    }
  } catch (error) {
    console.error('Failed to load system config:', error);
  } finally {
    loading.value = false;
  }
};

// Save config
const handleSave = async () => {
  // Simple validation
  const thinning = Number(formState.value.DATA_THINNING);
  if (Number.isNaN(thinning) || thinning < 1 || thinning > 100) {
    message.error('数据抽稀指数必须为1-100之间的整数');
    return;
  }

  const cycle = Number(formState.value.STORAGE_CYCLE);
  if (Number.isNaN(cycle) || cycle < 7 || cycle > 90) {
    message.error('数据存储周期必须为7-90之间的整数');
    return;
  }

  if (formState.value.SYSTEM_TITLE && formState.value.SYSTEM_TITLE.length > 50) {
    message.error('系统标题不能超过50个字符');
    return;
  }

  submitting.value = true;
  try {
    // Ensure we send strings as per API spec
    const payload: SystemConfigUpdateParams = {
      DATA_THINNING: String(thinning),
      STORAGE_CYCLE: String(cycle),
      SYSTEM_TITLE: formState.value.SYSTEM_TITLE,
    };
    
    await updateSystemConfigApi(payload);
    message.success('系统配置保存成功');
    // Reload to verify
    await loadConfig();
  } catch (error) {
    console.error('Failed to save system config:', error);
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadConfig();
});
</script>

<template>
  <Page :title="$t('ilms.config.system')">
    <div class="p-4">
      <Card :loading="loading" class="mx-auto max-w-3xl" title="基础配置">
        <Form :model="formState" layout="vertical">
          <Form.Item help="不超过50个字符" label="系统展示标题">
            <Input
              v-model:value="formState.SYSTEM_TITLE"
              :maxlength="50"
              placeholder="请输入系统标题"
            />
          </Form.Item>

          <Form.Item
            help="1代表不抽稀，100代表抽稀100倍 (范围: 1-100)"
            label="数据抽稀指数"
          >
            <InputNumber
              v-model:value="formState.DATA_THINNING"
              :max="100"
              :min="1"
              string-mode
              style="width: 100%"
            />
          </Form.Item>

          <Form.Item
            help="7代表存储7天，90代表存储90天 (范围: 7-90)"
            label="数据存储周期 (天)"
          >
            <InputNumber
              v-model:value="formState.STORAGE_CYCLE"
              :max="90"
              :min="7"
              string-mode
              style="width: 100%"
            />
          </Form.Item>

          <Form.Item class="mb-0 text-right">
            <Button :loading="submitting" type="primary" @click="handleSave">
              保存配置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  </Page>
</template>
