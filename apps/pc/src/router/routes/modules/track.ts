import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:map',
      order: 4,
      title: $t('ilms.track.title'),
    },
    name: 'Track',
    path: '/track',
    children: [
      {
        name: 'TrackTrajectory',
        path: '/track/trajectory',
        component: () => import('#/views/track/trajectory/index.vue'),
        meta: {
          icon: 'lucide:route',
          title: $t('ilms.track.trajectory'),
        },
      },
      {
        name: 'TrackCheckpoint',
        path: '/track/checkpoint',
        component: () => import('#/views/track/checkpoint/index.vue'),
        meta: {
          icon: 'lucide:map-pin-check',
          title: $t('ilms.track.checkpoint'),
        },
      },
      {
        name: 'TrackRecognitionRate',
        path: '/track/recognition-rate',
        component: () => import('#/views/track/recognition-rate/index.vue'),
        meta: {
          icon: 'lucide:percent',
          title: $t('ilms.track.recognitionRate'),
        },
      },
    ],
  },
];

export default routes;
