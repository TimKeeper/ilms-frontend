import { requestClient } from '#/api/request';

export interface WorkstationGraphNode {
  workstationId?: number;
  workstationIndex: number;
  workstationName: string;
  workstationType: number;
  workstationX: number;
  workstationY: number;
  routerIndexs?: number[];
}

export interface WorkstationGraphParams {
  graph: WorkstationGraphNode[];
}

export interface WorkstationGraphResult {
  graph: WorkstationGraphNode[];
}

export function saveWorkstationGraphApi(data: WorkstationGraphParams) {
  return requestClient.post('/api/workstation/v1/graph', data);
}

export function getWorkstationGraphApi() {
  return requestClient.get<WorkstationGraphResult>('/api/workstation/v1/graph');
}
