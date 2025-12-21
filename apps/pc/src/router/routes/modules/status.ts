import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:activity',
      order: 1,
      title: $t('ilms.status.title'),
    },
    name: 'Status',
    path: '/status',
    children: [
      {
        name: 'RadarStatus',
        path: '/status/radar',
        component: () => import('#/views/status/radar/index.vue'),
        meta: {
          icon: 'lucide:radar',
          title: $t('ilms.status.radar'),
        },
      },
      {
        name: 'IdentifierStatus',
        path: '/status/identifier',
        component: () => import('#/views/status/identifier/index.vue'),
        meta: {
          icon: 'lucide:tag',
          title: $t('ilms.status.identifier'),
        },
      },
    ],
  },
];

export default routes;
