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
