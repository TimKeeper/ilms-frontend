import { requestClient } from '#/api/request';

export interface WorkstationAlarmListParams {
  name?: string;
  index?: number;
  x?: number;
  showTagStatus?: number;
  page: number;
  pageSize: number;
}

export interface WorkstationAlarmItem {
  id: number;
  workstationName: string;
  workstationAlarmStatus: number;
  workstationAlarmA: number;
  workstationAlarmB: number;
  workstationAlarmC: number;
  workstationShowTagStatus: number;
  inputTime: number;
  updateTime: number;
}

export interface WorkstationAlarmListResult {
  total: number;
  items: WorkstationAlarmItem[];
}

export interface WorkstationAlarmUpdateParams {
  alarmStatus: number;
  alarmA: number;
  alarmB: number;
  alarmC: number;
  showTagStatus: number;
}

export function getWorkstationAlarmListApi(params: WorkstationAlarmListParams) {
  return requestClient.get<WorkstationAlarmListResult>(
    '/api/workstation/v1/alarm/list',
    { params },
  );
}

export function updateWorkstationAlarmApi(
  id: number,
  data: WorkstationAlarmUpdateParams,
) {
  return requestClient.put(`/api/workstation/v1/alarm/${id}`, data);
}
