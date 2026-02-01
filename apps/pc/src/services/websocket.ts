import type { Ref } from 'vue';

import type { NotificationItem } from '@vben/layouts';

import { ref } from 'vue';

import { useAccessStore } from '@vben/stores';

// Radar Status Codes
export enum RadarStatus {
  CONNECTING = 0,
  OFFLINE = -1,
  ONLINE = 1,
  READ_ERROR = 3, // Connected but data abnormal
  WARN_SIGNAL = 2, // 6W Signal Alarm
}

export interface RadarInfo {
  id: number;
  radarHost: string; // IP
  radarPort: number;
  radarAddress: number;
  // Visual Display Info:
  radarAntenna1StationLabel: string; // Antenna 1 Location
  radarAntenna1StationCode: string; // Antenna 1 Station Code
  radarAntenna2StationLabel: string; // Antenna 2 Location
  radarAntenna2StationCode: string; // Antenna 2 Station Code
  radarStatus: RadarStatus;
  updateTime: string; // Date string
}

// 服务端响应的标准结构体
interface WebSocketResponse {
  status: number; // 响应状态码
  resMsg: string; // 响应状态描述
  type:
    | 'ALARM'
    | 'ALL_RADAR_STATUS'
    | 'HEARTBEAT'
    | 'RESPONSE'
    | 'UPDATE_RADAR_STATUS';
  data: any; // 响应体对象，随type不同而不同
  timestamp: string; // 响应时间戳
}

// 客户端请求结构体
interface WebSocketRequest {
  type: 'HEARTBEAT' | 'REGISTER';
  sender: string;
  token: string;
}

// 告警数据结构
interface AlarmData {
  id: string; // 告警id
  type: string; // 告警类型：radar（雷达告警）/tag（标签告警）
  message: string; // 告警信息
  time: number; // 告警时间戳（毫秒）
}

/**
 * Generate a random UUID for WebSocket session
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, (c) => {
    const r = Math.trunc(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get authentication token
 */
function getToken(): string {
  const accessStore = useAccessStore();
  return accessStore.accessToken || '';
}

/**
 * Format timestamp to locale string
 */
function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Generate avatar URL for alarm notifications
 */
function getAlarmAvatar(alarmType: string, alarmId: string): string {
  const text = alarmType === 'radar' ? '雷达' : '标签';
  // Use alarm ID as seed for consistent avatar per alarm
  return `https://avatar.vercel.sh/${alarmId}.svg?text=${encodeURIComponent(text)}`;
}

/**
 * Global WebSocket Service
 * Manages single WebSocket connection for the entire application
 */
class WebSocketService {
  public connectionError: Ref<null | string> = ref(null);
  public isConnected: Ref<boolean> = ref(false);
  public isReconnecting: Ref<boolean> = ref(false);
  // State
  public radars: Ref<RadarInfo[]> = ref([]);

  private readonly HEARTBEAT_INTERVAL = 10_000; // 10 seconds

  private heartbeatInterval: any = null;
  private isManualClose: boolean = false;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  // Notifications callback
  private notificationsCallback:
    | ((notification: NotificationItem) => void)
    | null = null;
  private readonly RECONNECT_DELAY = 3000;
  private reconnectAttempts: number = 0;

  private reconnectTimeout: any = null;
  private sender: string = generateUUID(); // Persistent session ID
  // WebSocket & Internals
  private ws: null | WebSocket = null;
  private wsUrl: string = '';

  /**
   * Connect to WebSocket
   */
  public connect() {
    if (!this.wsUrl) {
      console.error('[WebSocket] WebSocket URL not initialized');
      return;
    }

    this.isManualClose = false;

    try {
      // Close existing connection if any
      if (this.ws) {
        this.ws.close();
      }

      this.ws = new WebSocket(this.wsUrl);

      this.ws.addEventListener('open', () => {
        this.isConnected.value = true;
        this.isReconnecting.value = false;
        this.connectionError.value = null;
        this.reconnectAttempts = 0;

        // Send register message immediately
        this.sendRegister();

        // Start heartbeat
        this.startHeartbeat();
      });

      this.ws.addEventListener('message', this.handleMessage);

      this.ws.addEventListener('error', (error) => {
        console.error('[WebSocket] Connection error:', error);
        this.connectionError.value = 'WebSocket 连接错误';
      });

      this.ws.addEventListener('close', (event) => {
        console.warn('[WebSocket] Connection closed:', event.reason);
        this.isConnected.value = false;
        this.stopHeartbeat();

        // Attempt to reconnect if not a normal closure and not manually closed
        if (event.code !== 1000 && !this.isManualClose) {
          this.reconnect();
        }
      });
    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error);
      this.connectionError.value = '无法创建 WebSocket 连接';
    }
  }

  /**
   * Disconnect from WebSocket and destroy instance state
   */
  public disconnect() {
    this.isManualClose = true;
    this.stopHeartbeat();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }

    this.isConnected.value = false;
    this.isReconnecting.value = false;
    this.connectionError.value = null;
    this.reconnectAttempts = 0;

    // Clear state
    this.notificationsCallback = null;
    this.radars.value = [];
  }

  /**
   * Initialize WebSocket service with URL
   */
  public initialize(wsUrl: string) {
    this.wsUrl = wsUrl;
  }

  /**
   * Register notifications callback
   */
  public setNotificationsCallback(
    callback: (notification: NotificationItem) => void,
  ) {
    this.notificationsCallback = callback;
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage = (event: MessageEvent) => {
    try {
      const response: WebSocketResponse = JSON.parse(event.data);

      // 检查响应状态 - token 失效处理
      if (response.status === 9_000_007) {
        console.error('[WebSocket] Token expired, logging out...');
        // Disconnect immediately to prevent further processing or reconnects
        this.disconnect();

        // 导入动态导入避免循环依赖
        import('#/store').then(({ useAuthStore }) => {
          const authStore = useAuthStore();
          authStore.logout(true);
        });
        return;
      }

      // 检查其他错误状态
      if (response.status !== 0) {
        console.error(`[WebSocket] Server error: ${response.resMsg}`, response);
        return;
      }

      switch (response.type) {
        case 'ALARM': {
          // data 是 AlarmData 对象
          const alarmData = response.data as AlarmData;

          // Add alarm to notifications if callback is registered
          if (this.notificationsCallback) {
            const alarmTypeText =
              alarmData.type === 'radar' ? '雷达告警' : '标签告警';
            this.notificationsCallback({
              id: alarmData.id, // Use alarm ID only for deduplication
              avatar: getAlarmAvatar(alarmData.type, alarmData.id),
              date: formatTime(alarmData.time),
              isRead: false,
              message: alarmData.message,
              title: alarmTypeText,
            });
          }

          console.warn('[WebSocket] ALARM received:', alarmData);
          break;
        }
        case 'ALL_RADAR_STATUS': {
          // data 是 RadarInfo[] 数组
          const radarList = response.data as RadarInfo[];
          if (Array.isArray(radarList)) {
            this.radars.value = radarList;
          }
          break;
        }
        case 'RESPONSE': {
          // REGISTER 和 HEARTBEAT 的响应
          // 一般情况下无需关注
          break;
        }
        case 'UPDATE_RADAR_STATUS': {
          // data 是单个 RadarInfo 对象
          const radarInfo = response.data as RadarInfo;
          if (radarInfo && radarInfo.id) {
            const index = this.radars.value.findIndex(
              (r) => r.id === radarInfo.id,
            );
            if (index === -1) {
              // If radar not found, add it
              this.radars.value.push(radarInfo);
            } else {
              // Update existing radar
              this.radars.value[index] = {
                ...this.radars.value[index],
                ...radarInfo,
              };
            }
          }
          break;
        }
        default: {
          console.warn('[WebSocket] Unknown message type:', response.type);
        }
      }
    } catch (error) {
      console.error('[WebSocket] Failed to parse message:', error);
    }
  };

  /**
   * Attempt to reconnect
   */
  private reconnect() {
    if (
      this.isManualClose ||
      this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS
    ) {
      if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
        console.error('[WebSocket] Max reconnect attempts reached. Giving up.');
        this.connectionError.value = '无法连接到服务器，请稍后重试';
      }
      this.isReconnecting.value = false;
      return;
    }

    this.isReconnecting.value = true;
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, this.RECONNECT_DELAY);
  }

  /**
   * Send heartbeat message
   */
  private sendHeartbeat() {
    this.sendMessage({
      type: 'HEARTBEAT',
      sender: this.sender,
      token: getToken(),
    });
  }

  /**
   * Send a message to WebSocket
   */
  private sendMessage(message: WebSocketRequest) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Send handshake (REGISTER) message
   */
  private sendRegister() {
    this.sendMessage({
      type: 'REGISTER',
      sender: this.sender,
      token: getToken(),
    });
  }

  /**
   * Start heartbeat interval
   */
  private startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, this.HEARTBEAT_INTERVAL);
  }

  /**
   * Stop heartbeat interval
   */
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
