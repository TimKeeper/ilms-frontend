import { requestClient } from '#/api/request';

export interface StationAlarmListParams {
  label?: string;
  code?: string;
  processId?: number;
  showTagStatus?: number;
  page: number;
  pageSize: number;
}

export interface StationAlarmItem {
  id: number;
  label: string;
  code: string;
  processId: number;
  x: number;
  y: number;
  type: number;
  alarmStatus: number;
  alarmA: number;
  alarmB: number;
  alarmC: number;
  showTagStatus: number;
  inputTime: number;
}

export interface StationAlarmListResult {
  total: number;
  items: StationAlarmItem[];
}

export interface StationAlarmUpdateParams {
  alarmStatus: number;
  alarmA: number;
  alarmB: number;
  alarmC: number;
  showTagStatus: number;
}

export function getStationAlarmListApi(params: StationAlarmListParams) {
  return requestClient.get<StationAlarmListResult>(
    '/api/station/v1/alarm/list',
    { params },
  );
}

export function updateStationAlarmApi(
  id: number,
  data: StationAlarmUpdateParams,
) {
  return requestClient.put(`/api/station/v1/alarm/${id}`, data);
}
