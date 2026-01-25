import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:bar-chart',
      order: 3,
      title: $t('ilms.report.title'),
    },
    name: 'Report',
    path: '/report',
    children: [
      {
        name: 'RadarRecognitionReport',
        path: '/report/radar-recognition',
        component: () => import('#/views/report/radar-recognition/index.vue'),
        meta: {
          icon: 'lucide:file-bar-chart',
          title: $t('ilms.report.radarRecognition'),
        },
      },
      {
        name: 'IdentifierLifespanReport',
        path: '/report/identifier-lifespan',
        component: () => import('#/views/report/identifier-lifespan/index.vue'),
        meta: {
          icon: 'lucide:battery',
          title: $t('ilms.report.identifierLifespan'),
        },
      },
      // {
      //   name: 'RawDataReport',
      //   path: '/report/raw-data',
      //   component: () => import('#/views/report/raw-data/index.vue'),
      //   meta: {
      //     icon: 'lucide:database',
      //     title: $t('ilms.report.rawData'),
      //   },
      // },
    ],
  },
];

export default routes;
