<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table';

import type { RadarInfo } from '#/services/websocket';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Badge, Card, Col, Row, Statistic, Table, Tag } from 'ant-design-vue';

import AlarmHistoryModal from '#/components/AlarmHistoryModal.vue';
import AlarmTicker from '#/components/AlarmTicker.vue';
import { RadarStatus, websocketService } from '#/services/websocket';

// Use global WebSocket service
const radars = websocketService.radars;
const isConnected = websocketService.isConnected;
const isReconnecting = websocketService.isReconnecting;
const connectionError = websocketService.connectionError;

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
        r.radarStatus === RadarStatus.READ_ERROR ||
        r.radarStatus === RadarStatus.CONNECT_ERROR,
    ).length,
);

// Table columns definition
const columns: ColumnsType<RadarInfo> = [
  {
    dataIndex: 'id',
    key: 'id',
    title: 'ID',
    width: 80,
  },
  {
    dataIndex: 'radarHost',
    key: 'radarHost',
    title: '雷达IP',
    width: 180,
  },
  {
    dataIndex: 'radarPort',
    key: 'radarPort',
    title: '端口',
    width: 100,
  },
  {
    dataIndex: 'radarAddress',
    key: 'radarAddress',
    title: '地址',
    width: 100,
  },
  {
    dataIndex: 'radarAntenna1StationLabel',
    ellipsis: true,
    key: 'radarAntenna1StationLabel',
    title: '天线1工位',
    width: 160,
  },
  {
    dataIndex: 'radarAntenna1StationCode',
    key: 'radarAntenna1StationCode',
    title: '天线1工位代号',
    width: 180,
  },
  {
    dataIndex: 'radarAntenna2StationLabel',
    ellipsis: true,
    key: 'radarAntenna2StationLabel',
    title: '天线2工位',
    width: 160,
  },
  {
    dataIndex: 'radarAntenna2StationCode',
    key: 'radarAntenna2StationCode',
    title: '天线2工位代号',
    width: 180,
  },
  {
    dataIndex: 'radarStatus',
    fixed: 'right',
    key: 'radarStatus',
    title: '状态',
    width: 120,
  },
  {
    dataIndex: 'updateTime',
    fixed: 'right',
    key: 'updateTime',
    title: '更新时间',
    width: 200,
  },
];

const getStatusColor = (status: number) => {
  const colorMap: Record<number, string> = {
    '-1': 'default',
    '0': 'processing',
    '1': 'success',
    '2': 'warning',
    '3': 'error',
    '4': 'error',
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
    '4': '连接异常',
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

// Alarm History Modal
const isAlarmHistoryOpen = ref(false);

const handleOpenAlarmHistory = () => {
  isAlarmHistoryOpen.value = true;
};
</script>

<template>
  <Page title="雷达设备状态监控">
    <template #description>
      <div class="flex w-full flex-col gap-3">
        <!-- Connection Status Row -->
        <div class="flex items-center gap-4">
          <span>实时监控雷达设备运行状态、信号强度、识别精度等关键指标</span>
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
          <span v-if="connectionError" class="text-sm text-red-500">
            {{ connectionError }}
          </span>
        </div>

        <!-- Alarm Ticker - Full Width -->
        <AlarmTicker @open-history="handleOpenAlarmHistory" />
      </div>
    </template>

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

    <!-- 设备列表 -->
    <Card title="雷达设备列表" :bordered="false" class="radar-table-card">
      <Table
        :columns="columns"
        :data-source="radars"
        :row-key="(record: RadarInfo) => record.id"
        :pagination="false"
        :scroll="{ x: 1460, y: 'calc(100vh - 480px)' }"
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

    <!-- Alarm History Modal -->
    <AlarmHistoryModal v-model:open="isAlarmHistoryOpen" />
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
