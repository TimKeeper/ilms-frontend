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

/**
 * 标识器寿命图表 API
 */

export interface TagLifeChartParams {
  stationLabel?: string; // 工位名称
  tagType?: 0 | 1; // 标识器类型，0-高温标识器（铁包）/1-常温标识器（车架）
  tagSn?: number; // 标识器id
  tagBoundName?: string; // 铁包/车架名称
  startTime?: number; // 开始时间（毫秒时间戳，但只需要到日）
  endTime?: number; // 结束时间（毫秒时间戳，但只需要到日）
}

export interface TagLifeChartSeriesItem {
  tagBoundName: string; // 铁包/车架名
  data: (null | number)[]; // 对应日期pulse数值
  tagSn: number; // 标签id
  stationLabel: string; // 工位名称
  tagType: 0 | 1; // 标签类型 0-高温标识器（铁包）/1-常温标识器（车架）
  type: string; // echarts节点类型，固定line
}

export interface TagLifeChartResult {
  xaxis: string[]; // 日期列表（注意：后端返回的是小写 xaxis）
  series: TagLifeChartSeriesItem[]; // 数据列表
}

/**
 * 获取标识器寿命图表数据
 */
export function getTagLifeChartApi(params: TagLifeChartParams) {
  return requestClient.get<TagLifeChartResult>('/api/view/v1/tag/lifeChart', {
    params,
  });
}
