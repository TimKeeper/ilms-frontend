<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';

import { computed } from 'vue';

import {
  BellOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';
import { Avatar, Button, Empty, Modal, Timeline } from 'ant-design-vue';

const props = defineProps<{
  notifications: NotificationItem[];
  open: boolean;
}>();

const emit = defineEmits<{
  clearAll: [];
  'update:open': [value: boolean];
}>();

const notificationCount = computed(() => props.notifications.length);

const handleClose = () => {
  emit('update:open', false);
};

const handleClearAll = () => {
  Modal.confirm({
    title: '确认清空',
    content: '确定要清空所有消息吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      emit('clearAll');
    },
  });
};

const getTimelineDotColor = (notification: NotificationItem) => {
  if (notification.title?.includes('雷达')) return 'orange';
  if (notification.title?.includes('标签')) return 'red';
  return 'blue';
};
</script>

<template>
  <Modal
    :open="props.open"
    title="所有消息"
    :width="800"
    :footer="null"
    @cancel="handleClose"
  >
    <template #extra>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">共 {{ notificationCount }} 条</span>
        <Button
          v-if="notificationCount > 0"
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

    <div class="notification-history-content">
      <!-- Empty State -->
      <Empty
        v-if="notifications.length === 0"
        description="暂无消息"
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
      />

      <!-- Timeline List -->
      <Timeline v-else mode="left" class="mt-4">
        <Timeline.Item
          v-for="notification in notifications"
          :key="notification.id"
          :color="getTimelineDotColor(notification)"
        >
          <template #dot>
            <BellOutlined :size="18" />
          </template>

          <div class="notification-item">
            <!-- Header -->
            <div class="mb-2 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Avatar
                  v-if="notification.avatar"
                  :src="notification.avatar"
                  :size="32"
                />
                <div class="flex flex-col">
                  <span class="font-medium text-gray-800">
                    {{ notification.title }}
                  </span>
                  <div class="flex items-center gap-1 text-xs text-gray-500">
                    <ClockCircleOutlined />
                    <span>{{ notification.date }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message -->
            <div class="notification-message text-sm">
              {{ notification.message }}
            </div>
          </div>
        </Timeline.Item>
      </Timeline>
    </div>
  </Modal>
</template>

<style scoped>
.notification-history-content {
  max-height: 600px;
  padding: 0 16px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px;
  background: rgb(250 250 250);
  border-radius: 8px;
  transition: all 0.2s;
}

.notification-item:hover {
  background: rgb(245 245 245);
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

.notification-message {
  line-height: 1.6;
  color: rgb(64 64 64);
  overflow-wrap: break-word;
}

:deep(.ant-timeline-item-head) {
  background: transparent;
}
</style>
