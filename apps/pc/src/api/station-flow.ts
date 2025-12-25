import { requestClient } from '#/api/request';

// 工序类型
export interface ProcessGroup {
  color?: string;
  height: number;
  id?: number;
  label: string;
  order: number;
  width: number;
  x: number;
  y: number;
}

// 工位类型
export interface Station {
  code: string;
  id?: number;
  label: string;
  process: string; // 工序名称（保存时使用）
  processId?: number; // 工序ID（展示时使用）
  type: number;
  x: number;
  y: number;
}

// 连线类型
export interface Link {
  from: number | string; // 展示时是ID，保存时是工位名称
  to: number | string;
}

// 画布配置
export interface CanvasConfig {
  center: {
    x: number;
    y: number;
  };
  height: number;
  width: number;
}

// 获取流程配置返回类型
export interface FlowConfigResult {
  canvas: CanvasConfig;
  links: Link[];
  processes: ProcessGroup[];
  stations: Station[];
}

// 保存流程配置参数类型
export interface SaveFlowConfigParams {
  canvas: CanvasConfig;
  links: Array<{
    from: string;
    to: string;
  }>;
  processes: Array<{
    color?: string;
    height: number;
    id?: number;
    label: string;
    order: number;
    width: number;
    x: number;
    y: number;
  }>;
  stations: Array<{
    code: string;
    id?: number;
    label: string;
    process: string;
    type: number;
    x: number;
    y: number;
  }>;
}

/**
 * 获取工位工序流程配置
 */
export function getStationFlowConfigApi() {
  return requestClient.get<FlowConfigResult>('/api/station/v1/flow-config');
}

/**
 * 保存工位工序流程配置
 */
export function saveStationFlowConfigApi(data: SaveFlowConfigParams) {
  return requestClient.post('/api/station/v1/flow-config', data);
}
