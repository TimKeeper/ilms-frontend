<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table';

import { onMounted, onUnmounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Badge, Card, Col, Row, Statistic, Table, Tag } from 'ant-design-vue';

interface RadarDevice {
  deviceId: string;
  deviceName: string;
  status: 'error' | 'offline' | 'online' | 'warning';
  ip: string;
  port: number;
  location: string;
  signalStrength: number;
  recognitionCount: number;
  errorRate: number;
  lastHeartbeat: number;
  lastRecognition: number;
  temperature?: number;
  voltage?: number;
}

// 模拟数据
const radarDevices = ref<RadarDevice[]>([
  {
    deviceId: '1',
    deviceName: '雷达设备-1',
    status: 'online',
    ip: '192.168.1.101',
    port: 8080,
    location: '一号工位',
    signalStrength: 85,
    recognitionCount: 1254,
    errorRate: 0.02,
    lastHeartbeat: Date.now(),
    lastRecognition: Date.now() - 30_000,
    temperature: 45,
    voltage: 220,
  },
  {
    deviceId: '2',
    deviceName: '雷达设备-2',
    status: 'online',
    ip: '192.168.1.102',
    port: 8080,
    location: '二号工位',
    signalStrength: 92,
    recognitionCount: 2156,
    errorRate: 0.01,
    lastHeartbeat: Date.now(),
    lastRecognition: Date.now() - 60_000,
    temperature: 42,
    voltage: 220,
  },
  {
    deviceId: '3',
    deviceName: '雷达设备-3',
    status: 'warning',
    ip: '192.168.1.103',
    port: 8080,
    location: '三号工位',
    signalStrength: 65,
    recognitionCount: 856,
    errorRate: 0.05,
    lastHeartbeat: Date.now() - 45_000,
    lastRecognition: Date.now() - 120_000,
    temperature: 55,
    voltage: 215,
  },
  {
    deviceId: '4',
    deviceName: '雷达设备-4',
    status: 'offline',
    ip: '192.168.1.104',
    port: 8080,
    location: '四号工位',
    signalStrength: 0,
    recognitionCount: 0,
    errorRate: 1,
    lastHeartbeat: Date.now() - 300_000,
    lastRecognition: Date.now() - 300_000,
    temperature: 0,
    voltage: 0,
  },
]);

// 统计数据
const totalDevices = ref(4);
const onlineDevices = ref(2);
const offlineDevices = ref(1);
const warningDevices = ref(1);

// 表格列定义
const columns: ColumnsType<RadarDevice> = [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    width: 130,
  },
  {
    title: '端口',
    dataIndex: 'port',
    key: 'port',
    width: 80,
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
    width: 120,
  },
  {
    title: '信号强度',
    dataIndex: 'signalStrength',
    key: 'signalStrength',
    width: 100,
  },
  {
    title: '识别次数',
    dataIndex: 'recognitionCount',
    key: 'recognitionCount',
    width: 100,
  },
  {
    title: '错误率',
    dataIndex: 'errorRate',
    key: 'errorRate',
    width: 100,
  },
  {
    title: '温度(℃)',
    dataIndex: 'temperature',
    key: 'temperature',
    width: 100,
  },
  {
    title: '电压(V)',
    dataIndex: 'voltage',
    key: 'voltage',
    width: 100,
  },
];

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    online: 'success',
    offline: 'default',
    warning: 'warning',
    error: 'error',
  };
  return colorMap[status] || 'default';
};

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    online: '在线',
    offline: '离线',
    warning: '警告',
    error: '错误',
  };
  return textMap[status] || '未知';
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN');
};

// WebSocket 连接管理（占位）
const wsConnected = ref(false);
let ws: null | WebSocket = null;

const connectWebSocket = () => {
  // TODO: 实际项目中连接 WebSocket
  // ws = new WebSocket('ws://localhost:8080/ws/radar-status');
  // ws.onmessage = (event) => {
  //   const data = JSON.parse(event.data);
  //   updateRadarStatus(data);
  // };
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
    title="雷达设备状态监控"
    description="实时监控雷达设备运行状态、信号强度、识别精度等关键指标"
  >
    <!-- 统计卡片 -->
    <div class="mb-4">
      <Row :gutter="16">
        <Col :span="6">
          <Card>
            <Statistic title="设备总数" :value="totalDevices">
              <template #prefix>
                <Badge status="processing" />
              </template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="6">
          <Card>
            <Statistic title="在线设备" :value="onlineDevices">
              <template #prefix>
                <Badge status="success" />
              </template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="6">
          <Card>
            <Statistic title="离线设备" :value="offlineDevices">
              <template #prefix>
                <Badge status="default" />
              </template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="6">
          <Card>
            <Statistic title="警告设备" :value="warningDevices">
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

    <!-- 设备列表 -->
    <Card title="雷达设备列表" :bordered="false">
      <Table
        :columns="columns"
        :data-source="radarDevices"
        :row-key="(record: RadarDevice) => record.deviceId"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'signalStrength'">
            <span
              :class="{
                'text-green-500': record.signalStrength >= 80,
                'text-yellow-500':
                  record.signalStrength >= 50 && record.signalStrength < 80,
                'text-red-500': record.signalStrength < 50,
              }"
            >
              {{ record.signalStrength }}%
            </span>
          </template>
          <template v-else-if="column.key === 'errorRate'">
            <span
              :class="{
                'text-green-500': record.errorRate <= 0.02,
                'text-yellow-500':
                  record.errorRate > 0.02 && record.errorRate <= 0.05,
                'text-red-500': record.errorRate > 0.05,
              }"
            >
              {{ (record.errorRate * 100).toFixed(2) }}%
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
