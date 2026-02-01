import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'SystemConfig',
    path: '/system',
    component: () => import('#/views/config/system/index.vue'),
    meta: {
      icon: 'lucide:settings-2',
      order: 99,
      title: $t('ilms.config.system'),
    },
  },
];

export default routes;
