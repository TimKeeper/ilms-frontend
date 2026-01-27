import { requestClient } from '#/api/request';

/**
 * 通用查询 API
 */

export interface BoundItem {
  id: number;
  type: 0 | 1; // 0-铁包 1-车架
  boundName: string;
}

export interface BoundListResult {
  boundList: BoundItem[];
}

export interface BoundListParams {
  type?: 0 | 1; // 0-铁包/1-车架
}

/**
 * 获取所有铁包或车架名称列表
 */
export function getBoundListApi(params?: BoundListParams) {
  return requestClient.get<BoundListResult>('/api/util/v1/boundList', {
    params,
  });
}

export interface StationItem {
  id: number;
  label: string;
  code: string;
}

export interface StationListResult {
  stationList: StationItem[];
}

/**
 * 获取所有工位
 */
export function getStationListApi() {
  return requestClient.get<StationListResult>('/api/util/v1/stationList');
}

export interface TagItem {
  tagSn: number;
  tagType: 0 | 1; // 0-高温标识器 1-常温标识器
  tagBoundName: string;
}

export interface TagListResult {
  tagList: TagItem[];
}

export interface TagListParams {
  type?: 0 | 1; // 0-高温标签器/1-常温标签器
}

/**
 * 获取所有标识器
 */
export function getTagListApi(params?: TagListParams) {
  return requestClient.get<TagListResult>('/api/util/v1/tagList', { params });
}

export interface UtilRadarItem {
  id: number;
  radarHost: string;
  radarPort: number;
  radarAddress: number;
  radarStatus: number;
  inputTime: number;
  updateTime: number;
  station: string;
}

export interface AllRadarResult {
  radarList: UtilRadarItem[];
}

/**
 * 获取所有雷达
 */
export function getAllRadarApi() {
  return requestClient.get<AllRadarResult>('/api/util/v1/allRadar');
}
