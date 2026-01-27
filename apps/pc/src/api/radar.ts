import { requestClient } from '#/api/request';

export interface RadarCreateParams {
  radarHost: string;
  radarPort: number;
  radarAddress: number;
  radarAntenna1StationId?: number;
  radarAntenna2StationId?: number;
}

export interface RadarUpdateParams {
  radarHost: string;
  radarPort: number;
  radarAddress: number;
  radarAntenna1StationId?: number;
  radarAntenna2StationId?: number;
}

export interface RadarListParams {
  radarHost?: string;
  stationLabel?: string;
  stationCode?: string;
  processOrder?: number;
  page: number;
  pageSize: number;
}

export interface RadarItem {
  id: number;
  radarHost: string;
  radarPort: number;
  radarAddress: number;
  radarAntenna1StationId?: null | number;
  radarAntenna1StationLabel?: null | string;
  radarAntenna1StationCode?: null | string;
  radarAntenna1ProcessOrder?: null | number;
  radarAntenna2StationId?: null | number;
  radarAntenna2StationLabel?: null | string;
  radarAntenna2StationCode?: null | string;
  radarAntenna2ProcessOrder?: null | number;
  radarStatus: number;
  inputTime: number;
  updateTime: number;
}

export interface RadarListResult {
  total: number;
  items: RadarItem[];
}

export function createRadarApi(data: RadarCreateParams) {
  return requestClient.post('/api/radar/v1/create', data);
}

export function getRadarListApi(params: RadarListParams) {
  return requestClient.get<RadarListResult>('/api/radar/v1/list', { params });
}

export function updateRadarApi(id: number, data: RadarUpdateParams) {
  return requestClient.put(`/api/radar/v1/${id}`, data);
}

export function deleteRadarApi(ids: number[]) {
  return requestClient.delete('/api/radar/v1/delete', { data: { ids } });
}

export function downloadRadarTemplateApi() {
  return requestClient.get('/api/radar/v1/template/download', {
    responseType: 'blob',
  });
}

export interface RadarImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  failCount: number;
  errors: string[];
}

export function importRadarApi(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post<RadarImportResult>(
    '/api/radar/v1/import',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

export interface RadarExportParams {
  radarHost?: string;
  stationLabel?: string;
  stationCode?: string;
  processOrder?: number;
}

export function exportRadarApi(params?: RadarExportParams) {
  return requestClient.get('/api/radar/v1/export', {
    params,
    responseType: 'blob',
  });
}

// ===== Original Data =====

export interface RadarDataParams {
  radarHost?: string;
  radarPort?: number;
  radarAddress?: number;
  stationLabel?: string;
  tagType?: number; // 0 | 1
  tagSn?: number;
  tagBoundName?: string;
  startTime?: number;
  endTime?: number;
  cursor?: number;
  pageSize: number;
}

export interface RadarDataItem {
  id: number;
  radarHost: string;
  radarPort: number;
  radarAddress: number;
  stationLabel?: string;
  tagType?: number;
  tagBoundName?: string;
  functionCode: number;
  dataLength: number;
  tagSn: number;
  pulse1: number;
  pulse2: number;
  pulse3: number;
  pulse4: number;
  pulse5: number;
  baseLine: number;
  pulseFrequency: number;
  antennaNumber: number;
  crc16: number;
  inputTime: number;
}

export interface RadarDataResult {
  cursor?: number;
  items: RadarDataItem[];
}

export function getRadarDataApi(params: RadarDataParams) {
  return requestClient.get<RadarDataResult>('/api/radar/v1/data', { params });
}

// ===== Merged Data =====

export interface RadarDataGroupParams {
  radarHost?: string;
  stationLabel?: string;
  tagType?: number;
  tagSn?: number;
  tagBoundName?: string;
  startTime?: number;
  endTime?: number;
  page: number;
  pageSize: number;
}

export interface RadarDataGroupItem {
  id: number;
  radarHost: string;
  radarPort: number;
  radarAntennaNum: number;
  radarAddress: number;
  stationLabel: string;
  tagType: number;
  tagSn: number;
  tagBoundName: string;
  tagMaxPulse: number;
  tagReadCount: number;
  startTime: number;
  endTime: number;
  updateTime: number;
  lastTime: number;
}

export interface RadarDataGroupResult {
  total: number;
  items: RadarDataGroupItem[];
}

export function getRadarDataGroupApi(params: RadarDataGroupParams) {
  return requestClient.get<RadarDataGroupResult>('/api/radar/v1/dataGroup', {
    params,
  });
}
