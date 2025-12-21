<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Badge,
  Card,
  Col,
  List,
  Progress,
  Row,
  Statistic,
  Tag,
} from 'ant-design-vue';

interface DeviceStatus {
  total: number;
  online: number;
  offline: number;
  warning: number;
}

interface AlarmItem {
  id: string;
  type: 'error' | 'warning';
  message: string;
  time: number;
  device: string;
}

interface RealtimeData {
  recognitionCount: number;
  successRate: number;
  ladleCount: number;
  carriageCount: number;
}

const radarStatus = ref<DeviceStatus>({
  total: 12,
  online: 10,
  offline: 1,
  warning: 1,
});

const identifierStatus = ref<DeviceStatus>({
  total: 48,
  online: 45,
  offline: 2,
  warning: 1,
});

const realtimeData = ref<RealtimeData>({
  recognitionCount: 1254,
  successRate: 98.5,
  ladleCount: 24,
  carriageCount: 18,
});

const alarmList = ref<AlarmItem[]>([
  {
    id: '1',
    type: 'warning',
    message: '雷达设备-3 信号强度低于阈值',
    time: Date.now() - 120000,
    device: '雷达设备-3',
  },
  {
    id: '2',
    type: 'warning',
    message: '标识器-25 电量低于20%',
    time: Date.now() - 180000,
    device: '标识器-25',
  },
  {
    id: '3',
    type: 'error',
    message: '雷达设备-7 离线超过5分钟',
    time: Date.now() - 300000,
    device: '雷达设备-7',
  },
  {
    id: '4',
    type: 'warning',
    message: '高温标识器-12 温度超过阈值',
    time: Date.now() - 420000,
    device: '高温标识器-12',
  },
]);

const radarOnlineRate = computed(
  () => (radarStatus.value.online / radarStatus.value.total) * 100,
);
const identifierOnlineRate = computed(
  () => (identifierStatus.value.online / identifierStatus.value.total) * 100,
);

const formatTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  return '刚刚';
};

let wsInterval: NodeJS.Timeout | null = null;

onMounted(() => {
  wsInterval = setInterval(() => {
    realtimeData.value.recognitionCount += Math.floor(Math.random() * 5);
    realtimeData.value.successRate = Number(
      (98 + Math.random() * 2).toFixed(1),
    );
  }, 5000);
});

onUnmounted(() => {
  if (wsInterval) {
    clearInterval(wsInterval);
  }
});

const quickLinks = [
  { title: '雷达设备状态', icon: 'lucide:radar', path: '/status/radar' },
  { title: '标识器状态', icon: 'lucide:tag', path: '/status/identifier' },
  { title: '雷达设备配置', icon: 'lucide:radar', path: '/config/radar' },
  { title: '标识器配置', icon: 'lucide:tag', path: '/config/identifier' },
  { title: '工位列表', icon: 'lucide:map-pin', path: '/config/station' },
  { title: '报警配置', icon: 'lucide:bell', path: '/config/alarm' },
];
</script>

<template>
  <Page
    title="铁包智能管控系统"
    description="实时监控铁包生命周期，精准识别，智能追踪"
  >
    <Row :gutter="[16, 16]">
      <Col :lg="6" :md="12" :sm="24" :xs="24">
        <Card :bordered="false" class="stat-card">
          <Statistic title="雷达设备" :value="radarStatus.total">
            <template #prefix>
              <Badge :status="radarStatus.offline > 0 ? 'error' : 'success'" />
            </template>
            <template #suffix>
              <span class="text-gray-500">台</span>
            </template>
          </Statistic>
          <div class="mt-4">
            <div class="flex justify-between text-sm mb-2">
              <span>在线率</span>
              <span class="font-medium">{{ radarOnlineRate.toFixed(1) }}%</span>
            </div>
            <Progress
              :percent="radarOnlineRate"
              :show-info="false"
              :stroke-color="
                radarOnlineRate > 90
                  ? '#52c41a'
                  : radarOnlineRate > 70
                    ? '#faad14'
                    : '#f5222d'
              "
            />
          </div>
        </Card>
      </Col>

      <Col :lg="6" :md="12" :sm="24" :xs="24">
        <Card :bordered="false" class="stat-card">
          <Statistic title="标识器" :value="identifierStatus.total">
            <template #prefix>
              <Badge
                :status="identifierStatus.offline > 0 ? 'error' : 'success'"
              />
            </template>
            <template #suffix>
              <span class="text-gray-500">个</span>
            </template>
          </Statistic>
          <div class="mt-4">
            <div class="flex justify-between text-sm mb-2">
              <span>在线率</span>
              <span class="font-medium">{{
                identifierOnlineRate.toFixed(1)
              }}%</span>
            </div>
            <Progress
              :percent="identifierOnlineRate"
              :show-info="false"
              :stroke-color="
                identifierOnlineRate > 90
                  ? '#52c41a'
                  : identifierOnlineRate > 70
                    ? '#faad14'
                    : '#f5222d'
              "
            />
          </div>
        </Card>
      </Col>

      <Col :lg="6" :md="12" :sm="24" :xs="24">
        <Card :bordered="false" class="stat-card">
          <Statistic title="识别次数" :value="realtimeData.recognitionCount">
            <template #prefix>
              <Badge status="processing" />
            </template>
            <template #suffix>
              <span class="text-gray-500">次</span>
            </template>
          </Statistic>
          <div class="mt-4 text-sm text-gray-500">今日累计识别</div>
        </Card>
      </Col>

      <Col :lg="6" :md="12" :sm="24" :xs="24">
        <Card :bordered="false" class="stat-card">
          <Statistic
            title="识别成功率"
            :value="realtimeData.successRate"
            :precision="1"
          >
            <template #prefix>
              <Badge status="success" />
            </template>
            <template #suffix>
              <span class="text-gray-500">%</span>
            </template>
          </Statistic>
          <div class="mt-4 text-sm text-gray-500">系统整体识别率</div>
        </Card>
      </Col>
    </Row>

    <Row :gutter="[16, 16]" class="mt-4">
      <Col :lg="8" :md="12" :sm="24" :xs="24">
        <Card title="设备状态概览" :bordered="false">
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm">雷达设备</span>
                <span class="text-sm font-medium">
                  {{ radarStatus.online }}/{{ radarStatus.total }}
                </span>
              </div>
              <div class="flex gap-2">
                <Tag color="success">在线: {{ radarStatus.online }}</Tag>
                <Tag color="warning">告警: {{ radarStatus.warning }}</Tag>
                <Tag color="error">离线: {{ radarStatus.offline }}</Tag>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm">标识器</span>
                <span class="text-sm font-medium">
                  {{ identifierStatus.online }}/{{ identifierStatus.total }}
                </span>
              </div>
              <div class="flex gap-2">
                <Tag color="success">在线: {{ identifierStatus.online }}</Tag>
                <Tag color="warning">告警: {{ identifierStatus.warning }}</Tag>
                <Tag color="error">离线: {{ identifierStatus.offline }}</Tag>
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <Col :lg="8" :md="12" :sm="24" :xs="24">
        <Card title="铁包与车架" :bordered="false">
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">铁包总数</span>
                <span class="text-2xl font-semibold">{{
                  realtimeData.ladleCount
                }}</span>
              </div>
              <div class="mt-2 text-xs text-gray-500">
                高温铁包：12 个 | 常温铁包：12 个
              </div>
            </div>

            <div class="border-t pt-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">车架总数</span>
                <span class="text-2xl font-semibold">{{
                  realtimeData.carriageCount
                }}</span>
              </div>
              <div class="mt-2 text-xs text-gray-500">
                在用：16 个 | 空闲：2 个
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <Col :lg="8" :md="24" :sm="24" :xs="24">
        <Card title="最近告警" :bordered="false">
          <List
            :data-source="alarmList.slice(0, 4)"
            size="small"
            :split="false"
          >
            <template #renderItem="{ item }">
              <List.Item class="px-0">
                <div class="w-full">
                  <div class="flex items-start gap-2">
                    <Badge
                      :status="item.type === 'error' ? 'error' : 'warning'"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="text-sm truncate">{{ item.message }}</div>
                      <div class="text-xs text-gray-500 mt-1">
                        {{ formatTime(item.time) }}
                      </div>
                    </div>
                  </div>
                </div>
              </List.Item>
            </template>
          </List>
        </Card>
      </Col>
    </Row>

    <Row :gutter="[16, 16]" class="mt-4">
      <Col :span="24">
        <Card title="快捷入口" :bordered="false">
          <Row :gutter="[16, 16]">
            <Col
              v-for="link in quickLinks"
              :key="link.path"
              :lg="4"
              :md="8"
              :sm="12"
              :xs="12"
            >
              <a
                :href="`#${link.path}`"
                class="block p-4 text-center rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
              >
                <div class="text-2xl mb-2">
                  <component :is="link.icon" />
                </div>
                <div class="text-sm">{{ link.title }}</div>
              </a>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </Page>
</template>

<style scoped>
.stat-card {
  height: 100%;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
