<script lang="ts" setup>
import type { Alarm } from '#/store/alarm';

import { computed } from 'vue';

import {
  ClockCircleOutlined,
  DeleteOutlined,
  RadarChartOutlined,
  TagOutlined,
} from '@ant-design/icons-vue';
import { Badge, Button, Empty, Modal, Tag, Timeline } from 'ant-design-vue';

import { useAlarmStore } from '#/store/alarm';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const alarmStore = useAlarmStore();

const alarms = computed(() => alarmStore.sortedAlarms);
const alarmCount = computed(() => alarmStore.alarmCount);

const handleClose = () => {
  emit('update:open', false);
};

const handleClearAll = () => {
  Modal.confirm({
    title: '确认清空',
    content: '确定要清空所有告警记录吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      alarmStore.clearAllAlarms();
    },
  });
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const getAlarmTypeColor = (type: 'radar' | 'tag') => {
  return type === 'radar' ? 'orange' : 'red';
};

const getAlarmIcon = (type: 'radar' | 'tag') => {
  return type === 'radar' ? RadarChartOutlined : TagOutlined;
};

const getTimelineDotColor = (alarm: Alarm) => {
  return alarm.type === 'radar' ? 'orange' : 'red';
};
</script>

<template>
  <Modal
    :open="props.open"
    title="告警历史记录"
    :width="800"
    :footer="null"
    @cancel="handleClose"
  >
    <template #extra>
      <div class="flex items-center gap-2">
        <Badge :count="alarmCount" :overflow-count="999" show-zero />
        <Button
          v-if="alarmCount > 0"
          danger
          size="small"
          type="text"
          @click="handleClearAll"
        >
          <template #icon>
            <DeleteOutlined />
          </template>
          清空全部
        </Button>
      </div>
    </template>

    <div class="alarm-history-content">
      <!-- Empty State -->
      <Empty
        v-if="alarms.length === 0"
        description="暂无告警记录"
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
      />

      <!-- Timeline List -->
      <Timeline v-else mode="left" class="mt-4">
        <Timeline.Item
          v-for="alarm in alarms"
          :key="alarm.id"
          :color="getTimelineDotColor(alarm)"
        >
          <template #dot>
            <component :is="getAlarmIcon(alarm.type)" :size="18" />
          </template>

          <div class="alarm-item">
            <!-- Header -->
            <div class="mb-2 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Tag :color="getAlarmTypeColor(alarm.type)">
                  {{ alarm.type === 'radar' ? '雷达告警' : '标签告警' }}
                </Tag>
                <span class="text-xs text-gray-500">ID: {{ alarm.id }}</span>
              </div>
              <div class="flex items-center gap-1 text-xs text-gray-500">
                <ClockCircleOutlined />
                <span>{{ formatTime(alarm.time) }}</span>
              </div>
            </div>

            <!-- Message -->
            <div class="alarm-message text-sm">
              {{ alarm.message }}
            </div>
          </div>
        </Timeline.Item>
      </Timeline>
    </div>
  </Modal>
</template>

<style scoped>
.alarm-history-content {
  max-height: 600px;
  padding: 0 16px;
  overflow-y: auto;
}

.alarm-item {
  padding: 12px;
  background: rgb(250 250 250);
  border-radius: 8px;
  transition: all 0.2s;
}

.alarm-item:hover {
  background: rgb(245 245 245);
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

.alarm-message {
  line-height: 1.6;
  color: rgb(64 64 64);
  overflow-wrap: break-word;
}

:deep(.ant-timeline-item-head) {
  background: transparent;
}
</style>
