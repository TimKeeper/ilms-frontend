import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/home',
    component: () => import('#/views/home/index.vue'),
    meta: {
      affixTab: true,
      icon: 'lucide:home',
      order: -1,
      title: $t('page.home.title'),
    },
  },
];

export default routes;
