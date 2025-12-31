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
  radarAntenna2StationLabel: string; // Antenna 2 Location
  radarStatus: RadarStatus;
  updateTime: string; // Date string
}

interface WebSocketMessage {
  type:
    | 'ALARM'
    | 'ALL_RADAR_STATUS'
    | 'HEARTBEAT'
    | 'REGISTER'
    | 'UPDATE_RADAR_STATUS';
  sender?: string;
  token?: string;
  data?: any;
  radars?: RadarInfo[];
  radar?: RadarInfo;
  message?: string;
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
  const sendMessage = (message: WebSocketMessage) => {
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
      const message: WebSocketMessage = JSON.parse(event.data);

      switch (message.type) {
        case 'ALARM': {
          // Show alarm notification
          const alarmMessage = message.message || 'Radar alarm triggered!';
          notification.error({
            message: '雷达报警',
            description: alarmMessage,
            duration: 5,
          });
          console.warn('[WebSocket] ALARM received:', alarmMessage);
          break;
        }
        case 'ALL_RADAR_STATUS': {
          // Replace the entire radar list
          if (message.radars) {
            radars.value = message.radars;
          }
          break;
        }
        case 'HEARTBEAT': {
          // Server heartbeat response (optional)
          break;
        }
        case 'UPDATE_RADAR_STATUS': {
          // Update a single radar by ID
          if (message.radar) {
            const index = radars.value.findIndex(
              (r) => r.id === message.radar?.id,
            );
            if (index === -1) {
              // If radar not found, add it
              radars.value.push(message.radar);
            } else {
              radars.value[index] = {
                ...radars.value[index],
                ...message.radar,
              };
            }
          }
          break;
        }
        default: {
          console.warn('[WebSocket] Unknown message type:', message.type);
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
