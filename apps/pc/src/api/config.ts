import { requestClient } from './request';

export interface SystemConfig {
  DATA_THINNING: string;
  STORAGE_CYCLE: string;
  SYSTEM_TITLE: string;
}

export interface SystemConfigUpdateParams {
  DATA_THINNING: string;
  STORAGE_CYCLE: string;
  SYSTEM_TITLE: string;
}

/**
 * Get system configuration
 */
export function getSystemConfigApi() {
  return requestClient.get<SystemConfig>('/api/config/v1/all');
}

/**
 * Update system configuration
 */
export function updateSystemConfigApi(data: SystemConfigUpdateParams) {
  return requestClient.put('/api/config/v1/all', data);
}
