<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table';

import type { RadarInfo } from '#/composables/useRadarSocket';

import { computed, onMounted, onUnmounted } from 'vue';

import { Page } from '@vben/common-ui';

import { Badge, Card, Col, Row, Statistic, Table, Tag } from 'ant-design-vue';

import { RadarStatus, useRadarSocket } from '#/composables/useRadarSocket';

// WebSocket URL
const WS_URL = 'ws://nas.bigjin.cc:34090/ws';

// Initialize WebSocket connection
const { radars, isConnected, isReconnecting, connectionError, connect } =
  useRadarSocket(WS_URL);

// Computed statistics
const totalCount = computed(() => radars.value.length);
const onlineCount = computed(
  () => radars.value.filter((r) => r.radarStatus === RadarStatus.ONLINE).length,
);
const offlineCount = computed(
  () =>
    radars.value.filter((r) => r.radarStatus === RadarStatus.OFFLINE).length,
);
const warningCount = computed(
  () =>
    radars.value.filter(
      (r) =>
        r.radarStatus === RadarStatus.WARN_SIGNAL ||
        r.radarStatus === RadarStatus.READ_ERROR,
    ).length,
);

// Table columns definition
const columns: ColumnsType<RadarInfo> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '雷达IP',
    dataIndex: 'radarHost',
    key: 'radarHost',
    width: 150,
  },
  {
    title: '端口',
    dataIndex: 'radarPort',
    key: 'radarPort',
    width: 100,
  },
  {
    title: '地址',
    dataIndex: 'radarAddress',
    key: 'radarAddress',
    width: 100,
  },
  {
    title: '天线1工位',
    dataIndex: 'radarAntenna1StationLabel',
    key: 'radarAntenna1StationLabel',
    width: 120,
  },
  {
    title: '天线1工位代号',
    dataIndex: 'radarAntenna1StationCode',
    key: 'radarAntenna1StationCode',
    width: 120,
  },
  {
    title: '天线2工位',
    dataIndex: 'radarAntenna2StationLabel',
    key: 'radarAntenna2StationLabel',
    width: 120,
  },
  {
    title: '天线2工位代号',
    dataIndex: 'radarAntenna2StationCode',
    key: 'radarAntenna2StationCode',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'radarStatus',
    key: 'radarStatus',
    width: 100,
    fixed: 'right',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 180,
    fixed: 'right',
  },
];

const getStatusColor = (status: number) => {
  const colorMap: Record<number, string> = {
    '-1': 'default',
    '0': 'processing',
    '1': 'success',
    '2': 'warning',
    '3': 'error',
  };
  return colorMap[status] || 'default';
};

const getStatusText = (status: number) => {
  const textMap: Record<number, string> = {
    '-1': '离线',
    '0': '连接中',
    '1': '在线',
    '2': '信号警告',
    '3': '读取错误',
  };
  return textMap[status] || '未知';
};

const formatTimestamp = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  } catch {
    return timestamp;
  }
};

// Connect on mount
onMounted(() => {
  connect();
});

// Cleanup on unmount
onUnmounted(() => {
  // WebSocket cleanup is handled by the composable
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
            <Statistic title="设备总数" :value="totalCount">
              <template #prefix>
                <Badge status="processing" />
              </template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="6">
          <Card>
            <Statistic title="在线设备" :value="onlineCount">
              <template #prefix>
                <Badge status="success" />
              </template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="6">
          <Card>
            <Statistic title="离线设备" :value="offlineCount">
              <template #prefix>
                <Badge status="default" />
              </template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="6">
          <Card>
            <Statistic title="警告设备" :value="warningCount">
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
            :status="isConnected ? 'success' : 'error'"
            :text="
              isConnected
                ? 'WebSocket 已连接'
                : isReconnecting
                  ? 'WebSocket 重连中...'
                  : 'WebSocket 未连接'
            "
          />
          <span v-if="connectionError" class="ml-3 text-sm text-red-500">
            {{ connectionError }}
          </span>
        </div>
      </Card>
    </div>

    <!-- 设备列表 -->
    <Card title="雷达设备列表" :bordered="false">
      <Table
        :columns="columns"
        :data-source="radars"
        :row-key="(record: RadarInfo) => record.id"
        :pagination="{ pageSize: 10 }"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'radarStatus'">
            <Tag :color="getStatusColor(record.radarStatus)">
              {{ getStatusText(record.radarStatus) }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'updateTime'">
            <span>{{ formatTimestamp(record.updateTime) }}</span>
          </template>
          <template v-else-if="column.key === 'radarAntenna1StationLabel'">
            <span>{{ record.radarAntenna1StationLabel || '-' }}</span>
          </template>
          <template v-else-if="column.key === 'radarAntenna1StationCode'">
            <span>{{ record.radarAntenna1StationCode || '-' }}</span>
          </template>
          <template v-else-if="column.key === 'radarAntenna2StationLabel'">
            <span>{{ record.radarAntenna2StationLabel || '-' }}</span>
          </template>
          <template v-else-if="column.key === 'radarAntenna2StationCode'">
            <span>{{ record.radarAntenna2StationCode || '-' }}</span>
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
