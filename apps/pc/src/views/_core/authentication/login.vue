<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
  ];
});

async function onSubmit(params: Recordable<any>) {
  await authStore.authLogin(params, async () => {
    // 登录成功后，检查是否有 redirect 参数
    const redirect = route.query.redirect as string;
    // 有重定向地址则跳转到原页面，否则跳转到雷达设备状态页面
    await router.replace(
      redirect ? decodeURIComponent(redirect) : '/status/radar',
    );
  });
}
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="onSubmit"
  />
</template>
