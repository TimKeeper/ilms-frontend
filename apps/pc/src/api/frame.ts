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

export function downloadFrameTemplateApi() {
  return requestClient.get('/api/frame/v1/template/download', {
    responseType: 'blob',
  });
}

export interface FrameImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  failCount: number;
  errors: string[];
}

export function importFrameApi(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post<FrameImportResult>('/api/frame/v1/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export interface FrameExportParams {
  frameName?: string;
  tagSn?: number;
}

export function exportFrameApi(params?: FrameExportParams) {
  return requestClient.get('/api/frame/v1/export', {
    params,
    responseType: 'blob',
  });
}
