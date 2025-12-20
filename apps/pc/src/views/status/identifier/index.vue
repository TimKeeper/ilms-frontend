<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table';

import { onMounted, onUnmounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Badge,
  Card,
  Col,
  Progress,
  Row,
  Statistic,
  Table,
  Tag,
} from 'ant-design-vue';

interface Identifier {
  identifierId: string;
  identifierType: 'high_temp' | 'normal_temp';
  status: 'active' | 'error' | 'inactive' | 'low_battery';
  battery: number;
  temperature: number;
  recognitionCount: number;
  bindingType: 'carriage' | 'ladle' | 'none';
  bindingTarget?: string;
  lastRecognition: number;
  signalQuality: number;
}

// 模拟数据
const identifiers = ref<Identifier[]>([
  {
    identifierId: 'HT-001',
    identifierType: 'high_temp',
    status: 'active',
    battery: 85,
    temperature: 650,
    recognitionCount: 3256,
    bindingType: 'ladle',
    bindingTarget: '铁包-001',
    lastRecognition: Date.now() - 30_000,
    signalQuality: 92,
  },
  {
    identifierId: 'HT-002',
    identifierType: 'high_temp',
    status: 'active',
    battery: 72,
    temperature: 680,
    recognitionCount: 2845,
    bindingType: 'ladle',
    bindingTarget: '铁包-002',
    lastRecognition: Date.now() - 45_000,
    signalQuality: 88,
  },
  {
    identifierId: 'HT-003',
    identifierType: 'high_temp',
    status: 'low_battery',
    battery: 15,
    temperature: 620,
    recognitionCount: 4512,
    bindingType: 'ladle',
    bindingTarget: '铁包-003',
    lastRecognition: Date.now() - 60_000,
    signalQuality: 75,
  },
  {
    identifierId: 'NT-001',
    identifierType: 'normal_temp',
    status: 'active',
    battery: 90,
    temperature: 25,
    recognitionCount: 1856,
    bindingType: 'carriage',
    bindingTarget: '车架-001',
    lastRecognition: Date.now() - 20_000,
    signalQuality: 95,
  },
  {
    identifierId: 'NT-002',
    identifierType: 'normal_temp',
    status: 'active',
    battery: 78,
    temperature: 28,
    recognitionCount: 2145,
    bindingType: 'carriage',
    bindingTarget: '车架-002',
    lastRecognition: Date.now() - 35_000,
    signalQuality: 90,
  },
  {
    identifierId: 'NT-003',
    identifierType: 'normal_temp',
    status: 'inactive',
    battery: 55,
    temperature: 22,
    recognitionCount: 856,
    bindingType: 'none',
    lastRecognition: Date.now() - 300_000,
    signalQuality: 0,
  },
]);

// 统计数据
const totalIdentifiers = ref(6);
const highTempCount = ref(3);
const normalTempCount = ref(3);
const lowBatteryCount = ref(1);

// 表格列定义
const columns: ColumnsType<Identifier> = [
  {
    title: '标识器编号',
    dataIndex: 'identifierId',
    key: 'identifierId',
    width: 120,
  },
  {
    title: '类型',
    dataIndex: 'identifierType',
    key: 'identifierType',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '电量',
    dataIndex: 'battery',
    key: 'battery',
    width: 120,
  },
  {
    title: '温度(℃)',
    dataIndex: 'temperature',
    key: 'temperature',
    width: 100,
  },
  {
    title: '识别次数',
    dataIndex: 'recognitionCount',
    key: 'recognitionCount',
    width: 100,
  },
  {
    title: '绑定类型',
    dataIndex: 'bindingType',
    key: 'bindingType',
    width: 100,
  },
  {
    title: '绑定目标',
    dataIndex: 'bindingTarget',
    key: 'bindingTarget',
    width: 120,
  },
  {
    title: '信号质量',
    dataIndex: 'signalQuality',
    key: 'signalQuality',
    width: 100,
  },
];

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    low_battery: 'warning',
    error: 'error',
  };
  return colorMap[status] || 'default';
};

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '活跃',
    inactive: '不活跃',
    low_battery: '低电量',
    error: '错误',
  };
  return textMap[status] || '未知';
};

const getTypeText = (type: string) => {
  return type === 'high_temp' ? '高温' : '常温';
};

const getTypeColor = (type: string) => {
  return type === 'high_temp' ? 'red' : 'blue';
};

const getBindingTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    ladle: '铁包',
    carriage: '车架',
    none: '未绑定',
  };
  return textMap[type] || '未知';
};

const getBatteryStatus = (battery: number) => {
  if (battery >= 80) return 'success';
  if (battery >= 50) return 'normal';
  if (battery >= 20) return 'warning';
  return 'exception';
};

// WebSocket 连接管理（占位）
const wsConnected = ref(false);
let ws: null | WebSocket = null;

const connectWebSocket = () => {
  // TODO: 实际项目中连接 WebSocket
  console.log('WebSocket 连接已建立（模拟）');
  wsConnected.value = true;
};

const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
  wsConnected.value = false;
  console.log('WebSocket 连接已断开');
};

onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  disconnectWebSocket();
});
</script>

<template>
  <Page
    title="标识器状态监控"
    description="实时监控高温标识器和常温标识器的电量、温度、识别次数等信息"
  >
    <!-- 统计卡片 -->
    <div class="mb-4">
      <Row :gutter="16">
        <Col :span="6">
          <Card>
            <Statistic title="标识器总数" :value="totalIdentifiers">
              <template #prefix>
                <Badge status="processing" />
              </template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="6">
          <Card>
            <Statistic title="高温标识器" :value="highTempCount">
              <template #prefix>
                <Badge status="error" />
              </template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="6">
          <Card>
            <Statistic title="常温标识器" :value="normalTempCount">
              <template #prefix>
                <Badge status="success" />
              </template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="6">
          <Card>
            <Statistic title="低电量标识器" :value="lowBatteryCount">
              <template #prefix>
                <Badge status="warning" />
              </template>
            </Statistic>
          </Card>
        </Col>
      </Row>
    </div>

    <!-- WebSocket 连接状态 -->
    <div class="mb-4">
      <Card size="small">
        <div class="flex items-center">
          <Badge
            :status="wsConnected ? 'success' : 'error'"
            :text="wsConnected ? 'WebSocket 已连接' : 'WebSocket 未连接'"
          />
        </div>
      </Card>
    </div>

    <!-- 标识器列表 -->
    <Card title="标识器列表" :bordered="false">
      <Table
        :columns="columns"
        :data-source="identifiers"
        :row-key="(record: Identifier) => record.identifierId"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'identifierType'">
            <Tag :color="getTypeColor(record.identifierType)">
              {{ getTypeText(record.identifierType) }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'battery'">
            <Progress
              :percent="record.battery"
              :status="getBatteryStatus(record.battery)"
              :stroke-width="8"
              style="width: 100px"
            />
          </template>
          <template v-else-if="column.key === 'bindingType'">
            <span>{{ getBindingTypeText(record.bindingType) }}</span>
          </template>
          <template v-else-if="column.key === 'bindingTarget'">
            <span>{{ record.bindingTarget || '-' }}</span>
          </template>
          <template v-else-if="column.key === 'signalQuality'">
            <span
              :class="{
                'text-green-500': record.signalQuality >= 80,
                'text-yellow-500':
                  record.signalQuality >= 50 && record.signalQuality < 80,
                'text-red-500': record.signalQuality < 50,
              }"
            >
              {{ record.signalQuality }}%
            </span>
          </template>
        </template>
      </Table>
    </Card>
  </Page>
</template>

<style scoped>
:deep(.ant-statistic-title) {
  font-size: 14px;
  color: rgb(0 0 0 / 65%);
}

:deep(.ant-statistic-content) {
  font-size: 24px;
  font-weight: 600;
}
</style>
