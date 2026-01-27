import { requestClient } from '#/api/request';

export interface ExportRecordListParams {
  type?: number;
  status?: number;
  page: number;
  pageSize: number;
}

export interface ExportRecordItem {
  id: number;
  type: number;
  status: number;
  progress?: string;
  fileName?: string;
  fileSize?: number;
  createTime: number;
  updateTime: number;
}

export interface ExportRecordListResult {
  total: number;
  items: ExportRecordItem[];
}

export function getExportRecordListApi(params: ExportRecordListParams) {
  return requestClient.get<ExportRecordListResult>('/api/export/v1/records', {
    params,
  });
}

export function deleteExportRecordsApi(ids: number[]) {
  return requestClient.delete('/api/export/v1/records', { data: { ids } });
}

export interface ExportRadarDataParams {
  radarHost: string;
  radarPort: number;
  radarAddress: number;
  startTime: number;
  endTime: number;
  stationLabel?: string;
  tagType?: number;
  tagSn?: number;
  tagBoundName?: string;
}

export function exportRadarDataApi(data: ExportRadarDataParams) {
  return requestClient.post('/api/export/v1/radar-data', data);
}

export interface ExportRadarDataGroupParams {
  startTime: number;
  endTime: number;
  stationLabel?: string;
  tagType?: number;
  tagSn?: number;
  tagBoundName?: string;
}

export function exportRadarDataGroupApi(data: ExportRadarDataGroupParams) {
  return requestClient.post('/api/export/v1/radar-data-group', data);
}

export function downloadExportFileApi(id: number) {
  return requestClient.get(`/api/export/v1/download/${id}`, {
    responseType: 'blob',
  });
}
