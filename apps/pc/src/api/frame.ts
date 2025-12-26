import { requestClient } from '#/api/request';

export interface FrameCreateParams {
  frameName: string;
  tagSn1?: number;
  tagSn2?: number;
  tagSn3?: number;
  tagSn4?: number;
}

export interface FrameUpdateParams {
  frameName: string;
  tagSn1?: number;
  tagSn2?: number;
  tagSn3?: number;
  tagSn4?: number;
}

export interface FrameListParams {
  frameName?: string;
  tagSn?: number;
  page: number;
  pageSize: number;
}

export interface FrameItem {
  id: number;
  tagSn1?: null | number;
  tagSn2?: null | number;
  tagSn3?: null | number;
  tagSn4?: null | number;
  frameName: string;
  inputTime: number;
  updateTime: number;
}

export interface FrameListResult {
  total: number;
  items: FrameItem[];
}

export function createFrameApi(data: FrameCreateParams) {
  return requestClient.post('/api/frame/v1/create', data);
}

export function getFrameListApi(params: FrameListParams) {
  return requestClient.get<FrameListResult>('/api/frame/v1/list', { params });
}

export function updateFrameApi(id: number, data: FrameUpdateParams) {
  return requestClient.put(`/api/frame/v1/${id}`, data);
}

export function deleteFrameApi(ids: number[]) {
  return requestClient.delete('/api/frame/v1/delete', { data: { ids } });
}
