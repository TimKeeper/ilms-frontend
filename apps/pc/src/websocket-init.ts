import type { Ref } from 'vue';

import type { NotificationItem } from '@vben/layouts';

import { websocketService } from '#/services/websocket';

/**
 * Build WebSocket URL
 */
function getWebSocketUrl(): string {
  const envUrl = import.meta.env.VITE_GLOB_WS_URL || '/ws';

  // If it's a relative path, construct full WebSocket URL
  if (envUrl.startsWith('/')) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}${envUrl}`;
  }

  return envUrl.replaceAll('{HOSTNAME}', window.location.hostname);
}

// Global notifications storage
let notificationsList: null | Ref<NotificationItem[]> = null;

/**
 * Set notifications reference
 */
export function setNotifications(notifications: Ref<NotificationItem[]>) {
  notificationsList = notifications;
}

/**
 * Handle alarm notification callback
 * If alarm ID already exists, update the content and move to top
 * Otherwise, add as new notification
 */
function handleAlarmNotification(notification: NotificationItem) {
  if (!notificationsList || !notificationsList.value) return;

  const list = notificationsList.value;

  // Find existing notification with the same ID
  const existingIndex = list.findIndex((item) => item.id === notification.id);

  // If notification with same ID exists, update and move to top
  if (existingIndex !== -1) {
    // Get the existing item
    const existingItem = list[existingIndex];
    if (existingItem) {
      // Update existing notification's content
      Object.assign(existingItem, notification);

      // Move to top if not already at index 0
      if (existingIndex !== 0) {
        list.splice(existingIndex, 1);
        list.unshift(existingItem);
      }
    }
    return;
  }

  // Add new notification at the top
  list.unshift(notification);
}

/**
 * Initialize WebSocket service
 * Called during application bootstrap
 */
export function initWebSocket() {
  const wsUrl = getWebSocketUrl();

  // Initialize WebSocket service
  websocketService.initialize(wsUrl);
  websocketService.setNotificationsCallback(handleAlarmNotification);
  websocketService.connect();
}

/**
 * Cleanup WebSocket on app unmount
 */
export function cleanupWebSocket() {
  websocketService.disconnect();
}
