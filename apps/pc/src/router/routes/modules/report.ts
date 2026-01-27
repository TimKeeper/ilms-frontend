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
        name: 'RadarRecognitionReportHistory',
        path: '/report/radar-recognition-history',
        component: () =>
          import('#/views/report/radar-recognition-history/index.vue'),
        meta: {
          icon: 'lucide:history',
          title: '(历史)雷达识别报表',
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
      {
        name: 'ExportRecords',
        path: '/report/export-records',
        component: () => import('#/views/report/export-records/index.vue'),
        meta: {
          icon: 'lucide:download',
          title: '数据导出',
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
