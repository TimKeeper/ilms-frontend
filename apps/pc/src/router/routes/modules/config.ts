import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:settings',
      order: 2,
      title: $t('ilms.config.title'),
    },
    name: 'Config',
    path: '/config',
    children: [
      {
        name: 'StationConfig',
        path: '/config/station',
        component: () => import('#/views/config/station/index.vue'),
        meta: {
          icon: 'lucide:map-pin',
          title: $t('ilms.config.station'),
        },
      },
      {
        name: 'RadarConfig',
        path: '/config/radar',
        component: () => import('#/views/config/radar/index.vue'),
        meta: {
          icon: 'lucide:radar',
          title: $t('ilms.config.radar'),
        },
      },
      {
        name: 'LadleConfig',
        path: '/config/ladle',
        component: () => import('#/views/config/ladle/index.vue'),
        meta: {
          icon: 'lucide:container',
          title: $t('ilms.config.ladle'),
        },
      },
      {
        name: 'CarriageConfig',
        path: '/config/carriage',
        component: () => import('#/views/config/carriage/index.vue'),
        meta: {
          icon: 'lucide:truck',
          title: $t('ilms.config.carriage'),
        },
      },
      {
        name: 'AlarmConfig',
        path: '/config/alarm',
        component: () => import('#/views/config/alarm/index.vue'),
        meta: {
          icon: 'lucide:bell',
          title: $t('ilms.config.alarm'),
        },
      },
    ],
  },
];

export default routes;
