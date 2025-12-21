import { requestClient } from '#/api/request';

export interface RadarCreateParams {
  host: string;
  port: number;
  address: number;
  antenna1WorkstationId?: number;
  antenna2WorkstationId?: number;
}

export interface RadarUpdateParams {
  host: string;
  port: number;
  address: number;
  antenna1WorkstationId?: number;
  antenna2WorkstationId?: number;
}

export interface RadarListParams {
  host?: string;
  workstationName?: string;
  workstationIndex?: number;
  workstationProcess?: number;
  page: number;
  pageSize: number;
}

export interface RadarItem {
  id: number;
  radarHost: string;
  radarPort: number;
  radarAddress: number;
  radarAntenna1WorkstationId?: number | null;
  radarAntenna1WorkstationName?: string | null;
  radarAntenna1WorkstationIndex?: number | null;
  radarAntenna1WorkstationProcess?: number | null;
  radarAntenna2WorkstationId?: number | null;
  radarAntenna2WorkstationName?: string | null;
  radarAntenna2WorkstationIndex?: number | null;
  radarAntenna2WorkstationProcess?: number | null;
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
