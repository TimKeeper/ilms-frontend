import type { Ref } from 'vue';

import { onUnmounted, ref } from 'vue';

import { useAccessStore } from '@vben/stores';

import { notification } from 'ant-design-vue';

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

export function useRadarSocket(wsUrl: string) {
  // State
  const radars: Ref<RadarInfo[]> = ref([]);
  const isConnected = ref(false);
  const isReconnecting = ref(false);
  const connectionError = ref<null | string>(null);

  // WebSocket & Internals
  let ws: null | WebSocket = null;
  let heartbeatInterval: any = null;
  let reconnectTimeout: any = null;
  const sender = generateUUID(); // Persistent session ID
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;
  const HEARTBEAT_INTERVAL = 10_000; // 10 seconds

  /**
   * Send a message to WebSocket
   */
  const sendMessage = (message: WebSocketRequest) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  };

  /**
   * Send handshake (REGISTER) message
   */
  const sendRegister = () => {
    sendMessage({
      type: 'REGISTER',
      sender,
      token: getToken(),
    });
  };

  /**
   * Send heartbeat message
   */
  const sendHeartbeat = () => {
    sendMessage({
      type: 'HEARTBEAT',
      sender,
      token: getToken(),
    });
  };

  /**
   * Start heartbeat interval
   */
  const startHeartbeat = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    heartbeatInterval = setInterval(() => {
      sendHeartbeat();
    }, HEARTBEAT_INTERVAL);
  };

  /**
   * Stop heartbeat interval
   */
  const stopHeartbeat = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  };

  /**
   * Handle incoming WebSocket messages
   */
  const handleMessage = (event: MessageEvent) => {
    try {
      const response: WebSocketResponse = JSON.parse(event.data);

      // 检查响应状态
      if (response.status !== 0) {
        console.error(`[WebSocket] Server error: ${response.resMsg}`, response);
        return;
      }

      switch (response.type) {
        case 'ALARM': {
          // data 是 AlarmData 对象
          const alarmData = response.data as AlarmData;
          const alarmMessage = alarmData.message || 'Radar alarm triggered!';
          notification.error({
            message: '雷达报警',
            description: `[${alarmData.type}] ${alarmMessage}`,
            duration: 5,
          });
          console.warn('[WebSocket] ALARM received:', alarmData);
          break;
        }
        case 'ALL_RADAR_STATUS': {
          // data 是 RadarInfo[] 数组
          const radarList = response.data as RadarInfo[];
          if (Array.isArray(radarList)) {
            radars.value = radarList;
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
            const index = radars.value.findIndex((r) => r.id === radarInfo.id);
            if (index === -1) {
              // If radar not found, add it
              radars.value.push(radarInfo);
            } else {
              // Update existing radar
              radars.value[index] = {
                ...radars.value[index],
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
  const reconnect = () => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[WebSocket] Max reconnect attempts reached. Giving up.');
      connectionError.value = '无法连接到服务器，请稍后重试';
      isReconnecting.value = false;
      return;
    }

    isReconnecting.value = true;
    reconnectAttempts++;

    reconnectTimeout = setTimeout(() => {
      connect();
    }, RECONNECT_DELAY);
  };

  /**
   * Connect to WebSocket
   */
  const connect = () => {
    try {
      // Close existing connection if any
      if (ws) {
        ws.close();
      }

      ws = new WebSocket(wsUrl);

      ws.addEventListener('open', () => {
        isConnected.value = true;
        isReconnecting.value = false;
        connectionError.value = null;
        reconnectAttempts = 0;

        // Send register message immediately
        sendRegister();

        // Start heartbeat
        startHeartbeat();
      });

      ws.addEventListener('message', handleMessage);

      ws.addEventListener('error', (error) => {
        console.error('[WebSocket] Connection error:', error);
        connectionError.value = 'WebSocket 连接错误';
      });

      ws.addEventListener('close', (event) => {
        console.warn('[WebSocket] Connection closed:', event.reason);
        isConnected.value = false;
        stopHeartbeat();

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000) {
          reconnect();
        }
      });
    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error);
      connectionError.value = '无法创建 WebSocket 连接';
    }
  };

  /**
   * Disconnect from WebSocket
   */
  const disconnect = () => {
    stopHeartbeat();

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    if (ws) {
      ws.close(1000, 'Client disconnecting');
      ws = null;
    }

    isConnected.value = false;
    isReconnecting.value = false;
    connectionError.value = null;
    reconnectAttempts = 0;
  };

  /**
   * Cleanup on component unmount
   */
  onUnmounted(() => {
    disconnect();
  });

  return {
    radars,
    isConnected,
    isReconnecting,
    connectionError,
    connect,
    disconnect,
  };
}
