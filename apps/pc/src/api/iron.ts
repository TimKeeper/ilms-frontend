import { requestClient } from '#/api/request';

export interface IronCreateParams {
  ironName: string;
  tagSn1?: number;
  tagSn2?: number;
}

export interface IronUpdateParams {
  ironName: string;
  tagSn1?: number;
  tagSn2?: number;
}

export interface IronListParams {
  ironName?: string;
  tagSn?: number;
  page: number;
  pageSize: number;
}

export interface IronItem {
  id: number;
  tagSn1?: null | number;
  tagSn2?: null | number;
  ironName: string;
  inputTime: number;
  updateTime: number;
}

export interface IronListResult {
  total: number;
  items: IronItem[];
}

export function createIronApi(data: IronCreateParams) {
  return requestClient.post('/api/iron/v1/create', data);
}

export function getIronListApi(params: IronListParams) {
  return requestClient.get<IronListResult>('/api/iron/v1/list', { params });
}

export function updateIronApi(id: number, data: IronUpdateParams) {
  return requestClient.put(`/api/iron/v1/${id}`, data);
}

export function deleteIronApi(ids: number[]) {
  return requestClient.delete('/api/iron/v1/delete', { data: { ids } });
}
