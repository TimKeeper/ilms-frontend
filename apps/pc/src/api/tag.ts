import { requestClient } from '#/api/request';

/**
 * 标识器状态 API
 */

export interface TagStatusParams {
  stationId: number;
  tagType?: 0 | 1; // 0-高温标识器（铁包）/ 1-常温标识器（车架）
}

export interface TagStatusItem {
  boundName: string; // 绑定名称，如"铁包1号"
  tagSn: number; // 标识器序列号
  tagType: number; // 标识器类型
  tagLastPulse: number; // 最后脉冲值
  tagLastRecordTime: number; // 最后记录时间（毫秒时间戳）
}

export interface TagStatusRangeGroup {
  rangeType: 'A' | 'B' | 'C' | 'D'; // 范围类型
  rangeValue: string; // 范围值描述，如">360"
  rangeData: TagStatusItem[]; // 该范围内的标识器列表
}

export interface TagStatusResult {
  items: TagStatusRangeGroup[];
}

/**
 * 获取标识器状态
 */
export function getTagStatusApi(params: TagStatusParams) {
  return requestClient.get<TagStatusResult>('/api/tag/v1/status', {
    params,
  });
}
