<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Space,
  Tooltip,
} from 'ant-design-vue';

import {
  getStationFlowConfigApi,
  saveStationFlowConfigApi,
} from '#/api/station-flow';

// 工序容器类型
interface ProcessGroup {
  color?: string;
  height: number;
  id: number;
  label: string;
  order?: number;
  width: number;
  x: number;
  y: number;
}

// 工位节点类型
interface Station {
  code?: string;
  id: number;
  label: string;
  processId: number;
  type?: number;
  x: number;
  y: number;
}

// 连接线类型
interface Link {
  from: number;
  to: number;
}

// 画布配置
interface CanvasConfig {
  center?: {
    x: number;
    y: number;
  };
  height?: number;
  width?: number;
}

// 拖拽状态类型
interface DragState {
  id: number;
  offsetX: number;
  offsetY: number;
  type: 'process' | 'station';
}

// 连线状态类型
interface ConnectState {
  currentX: number;
  currentY: number;
  fromId: number;
  startX: number;
  startY: number;
}

// --- 数据状态 ---
const processes = ref<ProcessGroup[]>([]);
const stations = ref<Station[]>([]);
const links = ref<Link[]>([]);

// 画布配置
const canvas = ref<CanvasConfig>({
  center: { x: 600, y: 400 },
  height: 800,
  width: 1200,
});

// --- 交互状态 ---
const dragging = ref<DragState | null>(null);
const connecting = ref<ConnectState | null>(null);
const selectedId = ref<null | number>(null);
const svgRef = ref<null | SVGSVGElement>(null);
const loading = ref(false);

// --- 工位编辑弹窗状态 ---
const stationModalVisible = ref(false);
const editingStation = ref<null | Station>(null);
const stationFormData = ref({
  code: '',
  label: '',
});

// --- 工序编辑弹窗状态 ---
const processModalVisible = ref(false);
const editingProcess = ref<null | ProcessGroup>(null);
const processFormData = ref({
  label: '',
});

// --- 双击编辑工序 ---
const handleProcessDblClick = (e: MouseEvent, process: ProcessGroup) => {
  e.stopPropagation();
  editingProcess.value = process;
  processFormData.value = {
    label: process.label,
  };
  processModalVisible.value = true;
};

// --- 提交工序编辑 ---
const handleProcessSubmit = () => {
  if (!editingProcess.value) return;

  const trimmedLabel = processFormData.value.label.trim();

  // 验证名称不能为空
  if (!trimmedLabel) {
    message.warning('工序名称不能为空');
    return;
  }

  // 验证名称唯一性（排除当前编辑的工序）
  const labelExists = processes.value.some(
    (p) => p.id !== editingProcess.value?.id && p.label === trimmedLabel,
  );
  if (labelExists) {
    message.warning('工序名称已存在，请使用其他名称');
    return;
  }

  // 更新工序信息
  processes.value = processes.value.map((p) =>
    p.id === editingProcess.value?.id
      ? {
          ...p,
          label: trimmedLabel,
        }
      : p,
  );

  processModalVisible.value = false;
  editingProcess.value = null;
  message.success('工序更新成功');
};

// --- 取消工序编辑 ---
const handleProcessCancel = () => {
  processModalVisible.value = false;
  editingProcess.value = null;
};

// --- 画布缩放和平移状态 ---
const scale = ref(1); // 缩放比例
const translateX = ref(0); // X轴平移
const translateY = ref(0); // Y轴平移
const isPanning = ref(false); // 是否正在平移
const panStartX = ref(0); // 平移开始时的X坐标
const panStartY = ref(0); // 平移开始时的Y坐标

// --- SVG 坐标转换 ---
const getMousePos = (e: MouseEvent): { x: number; y: number } => {
  if (!svgRef.value) return { x: 0, y: 0 };
  const CTM = svgRef.value.getScreenCTM();
  if (!CTM) return { x: 0, y: 0 };
  return {
    x: (e.clientX - CTM.e) / CTM.a,
    y: (e.clientY - CTM.f) / CTM.d,
  };
};

// --- 拖拽处理 ---
const handleMouseDown = (
  e: MouseEvent,
  type: 'process' | 'station',
  item: ProcessGroup | Station,
) => {
  e.stopPropagation();
  const pos = getMousePos(e);
  dragging.value = {
    id: item.id,
    offsetX: pos.x - item.x,
    offsetY: pos.y - item.y,
    type,
  };
  selectedId.value = item.id;
};

// --- 连线开始 ---
const handleLinkStart = (e: MouseEvent, station: Station) => {
  e.stopPropagation();
  const pos = getMousePos(e);
  connecting.value = {
    currentX: pos.x,
    currentY: pos.y,
    fromId: station.id,
    startX: station.x + 100, // 工位宽度
    startY: station.y + 20, // 工位高度的一半
  };
};

// --- 鼠标移动 ---
const handleMouseMove = (e: MouseEvent) => {
  const pos = getMousePos(e);

  if (dragging.value) {
    if (dragging.value.type === 'station') {
      // 查找工位所属的工序
      const station = stations.value.find((s) => s.id === dragging.value?.id);
      if (station) {
        const parentProcess = processes.value.find(
          (p) => p.id === station.processId,
        );

        if (parentProcess) {
          const STATION_WIDTH = 100;
          const STATION_HEIGHT = 40;
          const HEADER_HEIGHT = 30; // 工序标题高度

          // 计算边界
          const minX = parentProcess.x;
          const maxX = parentProcess.x + parentProcess.width - STATION_WIDTH;
          const minY = parentProcess.y + HEADER_HEIGHT;
          const maxY = parentProcess.y + parentProcess.height - STATION_HEIGHT;

          // 计算新位置并限制在边界内
          const newX = Math.max(
            minX,
            Math.min(maxX, pos.x - dragging.value.offsetX),
          );
          const newY = Math.max(
            minY,
            Math.min(maxY, pos.y - dragging.value.offsetY),
          );

          stations.value = stations.value.map((s) =>
            s.id === dragging.value?.id
              ? {
                  ...s,
                  x: newX,
                  y: newY,
                }
              : s,
          );
        } else {
          // 如果没有父工序，允许自由移动
          stations.value = stations.value.map((s) =>
            s.id === dragging.value?.id
              ? {
                  ...s,
                  x: pos.x - dragging.value.offsetX,
                  y: pos.y - dragging.value.offsetY,
                }
              : s,
          );
        }
      }
    } else if (dragging.value.type === 'process') {
      processes.value = processes.value.map((p) => {
        if (p.id === dragging.value?.id) {
          const dx = pos.x - dragging.value.offsetX - p.x;
          const dy = pos.y - dragging.value.offsetY - p.y;
          // 同步移动该工序内的所有工位
          stations.value = stations.value.map((s) =>
            s.processId === p.id ? { ...s, x: s.x + dx, y: s.y + dy } : s,
          );
          return {
            ...p,
            x: pos.x - dragging.value.offsetX,
            y: pos.y - dragging.value.offsetY,
          };
        }
        return p;
      });
    }
  }

  if (connecting.value) {
    connecting.value = {
      ...connecting.value,
      currentX: pos.x,
      currentY: pos.y,
    };
  }
};

// --- 鼠标释放 ---
const handleMouseUp = () => {
  dragging.value = null;
  connecting.value = null;
};

// --- 工位上释放鼠标（完成连线）---
const handleStationMouseUp = (e: MouseEvent, targetStation: Station) => {
  e.stopPropagation();
  if (connecting.value && connecting.value.fromId !== targetStation.id) {
    // 检查是否已存在该连线
    const exists = links.value.find(
      (l) => l.from === connecting.value?.fromId && l.to === targetStation.id,
    );
    if (!exists) {
      links.value.push({ from: connecting.value.fromId, to: targetStation.id });
      message.success('连线创建成功');
    }
  }
  // 清除所有状态，包括拖拽状态
  connecting.value = null;
  dragging.value = null;
};

// --- 添加工序 ---
const addProcess = () => {
  const maxOrder = Math.max(0, ...processes.value.map((p) => p.order || 0));
  // 使用负数作为临时ID，避免与现有ID冲突，后端会生成真实ID
  const tempId = -Date.now();

  // 生成唯一的工序名称（使用时间戳后4位）
  const uniqueSuffix = Date.now().toString().slice(-4);
  const uniqueLabel = `新工序 ${uniqueSuffix}`;

  // 计算新工序的位置：放在最后一个工序的后面
  let newX = 100;
  let newY = 100;
  if (processes.value.length > 0) {
    // 找到最右侧的工序
    // eslint-disable-next-line unicorn/no-array-reduce
    const rightmostProcess = processes.value.reduce((prev, current) => {
      return prev.x + prev.width > current.x + current.width ? prev : current;
    });
    newX = rightmostProcess.x + rightmostProcess.width + 100; // 间距 100
    newY = rightmostProcess.y; // 保持 Y 轴对齐
  }

  processes.value.push({
    height: 200,
    id: tempId,
    label: uniqueLabel,
    order: maxOrder + 1,
    width: 250,
    x: newX,
    y: newY,
  });
  message.success('工序添加成功');
};

// --- 添加工位 ---
const addStation = (processId: number) => {
  const proc = processes.value.find((p) => p.id === processId);
  if (!proc) return;

  // 使用负数作为临时ID，避免与现有ID冲突，后端会生成真实ID
  const tempId = -Date.now();

  // 生成唯一的工位名称和代号（使用时间戳后4位）
  const uniqueSuffix = Date.now().toString().slice(-4);
  let uniqueLabel = `新工位 ${uniqueSuffix}`;
  let uniqueCode = uniqueSuffix;

  // 确保名称唯一
  while (stations.value.some((s) => s.label === uniqueLabel)) {
    const newSuffix = Date.now().toString().slice(-4);
    uniqueLabel = `新工位 ${newSuffix}`;
  }

  // 确保代号唯一
  while (stations.value.some((s) => s.code === uniqueCode)) {
    uniqueCode = Date.now().toString().slice(-4);
  }

  stations.value.push({
    code: uniqueCode,
    id: tempId,
    label: uniqueLabel,
    processId,
    type: 0,
    x: proc.x + 20,
    y: proc.y + 40,
  });
  message.success('工位添加成功');
};

// --- 双击编辑工位 ---
const handleStationDblClick = (e: MouseEvent, station: Station) => {
  e.stopPropagation();
  editingStation.value = station;
  stationFormData.value = {
    code: station.code || '',
    label: station.label,
  };
  stationModalVisible.value = true;
};

// --- 提交工位编辑 ---
const handleStationSubmit = () => {
  if (!editingStation.value) return;

  const trimmedLabel = stationFormData.value.label.trim();
  const trimmedCode = stationFormData.value.code.trim();

  // 验证名称不能为空
  if (!trimmedLabel) {
    message.warning('工位名称不能为空');
    return;
  }

  // 验证代号不能为空
  if (!trimmedCode) {
    message.warning('工位代号不能为空');
    return;
  }

  // 验证名称唯一性（排除当前编辑的工位）
  const labelExists = stations.value.some(
    (s) => s.id !== editingStation.value?.id && s.label === trimmedLabel,
  );
  if (labelExists) {
    message.warning('工位名称已存在，请使用其他名称');
    return;
  }

  // 验证代号唯一性（排除当前编辑的工位）
  const codeExists = stations.value.some(
    (s) => s.id !== editingStation.value?.id && s.code === trimmedCode,
  );
  if (codeExists) {
    message.warning('工位代号已存在，请使用其他代号');
    return;
  }

  // 更新工位信息
  stations.value = stations.value.map((s) =>
    s.id === editingStation.value?.id
      ? {
          ...s,
          code: trimmedCode,
          label: trimmedLabel,
        }
      : s,
  );

  stationModalVisible.value = false;
  editingStation.value = null;
  message.success('工位更新成功');
};

// --- 取消工位编辑 ---
const handleStationCancel = () => {
  stationModalVisible.value = false;
  editingStation.value = null;
};

// --- 删除选中 ---
const deleteSelected = () => {
  if (!selectedId.value) {
    message.warning('请先选中要删除的元素');
    return;
  }

  Modal.confirm({
    content: '确定要删除选中的元素吗？',
    title: '确认删除',
    onOk: () => {
      stations.value = stations.value.filter((s) => s.id !== selectedId.value);
      processes.value = processes.value.filter(
        (p) => p.id !== selectedId.value,
      );
      links.value = links.value.filter(
        (l) => l.from !== selectedId.value && l.to !== selectedId.value,
      );
      selectedId.value = null;
      message.success('删除成功');
    },
  });
};

// --- 加载数据 ---
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getStationFlowConfigApi();
    if (res) {
      // 加载工序数据
      processes.value = res.processes.map((p) => ({
        color: p.color,
        height: p.height,
        id: p.id || Date.now(),
        label: p.label,
        order: p.order,
        width: p.width,
        x: p.x,
        y: p.y,
      }));

      // 加载工位数据（API返回的是processId，直接使用）
      stations.value = res.stations.map((s) => ({
        code: s.code,
        id: s.id || Date.now(),
        label: s.label,
        processId: s.processId || 0,
        type: s.type,
        x: s.x,
        y: s.y,
      }));

      // 加载连线数据（API返回的是ID）
      links.value = res.links as Link[];

      // 加载画布配置
      if (res.canvas) {
        canvas.value = res.canvas;
      }

      message.success('数据加载成功');
    }
  } catch (error) {
    console.error('加载失败:', error);
  } finally {
    loading.value = false;
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});

// --- 保存数据 ---
const saveData = async () => {
  loading.value = true;
  try {
    // 转换数据格式：将ID转换为名称
    const processMap = new Map(processes.value.map((p) => [p.id, p.label]));
    const stationMap = new Map(stations.value.map((s) => [s.id, s.label]));

    const saveParams = {
      canvas: {
        center: canvas.value.center || { x: 600, y: 400 },
        height: canvas.value.height || 800,
        width: canvas.value.width || 1200,
      },
      links: links.value.map((link) => ({
        from: stationMap.get(link.from) || '',
        to: stationMap.get(link.to) || '',
      })),
      processes: processes.value.map((p) => {
        const processData: any = {
          color: p.color,
          height: p.height,
          label: p.label,
          order: p.order || 0,
          width: p.width,
          x: p.x,
          y: p.y,
        };
        // 只有正数ID才是后端已生成的，负数ID是新增项，不发送id字段
        if (p.id > 0) {
          processData.id = p.id;
        }
        return processData;
      }),
      stations: stations.value.map((s) => {
        const stationData: any = {
          code: s.code || '',
          label: s.label,
          process: processMap.get(s.processId) || '',
          type: 1, // 硬编码为1
          x: s.x,
          y: s.y,
        };
        // 只有正数ID才是后端已生成的，负数ID是新增项，不发送id字段
        if (s.id > 0) {
          stationData.id = s.id;
        }
        return stationData;
      }),
    };

    await saveStationFlowConfigApi(saveParams);
    message.success('数据保存成功');
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    loading.value = false;
  }
};

// --- 渲染贝塞尔曲线连线 ---
const getLinkPath = (link: Link): string => {
  const fromNode = stations.value.find((s) => s.id === link.from);
  const toNode = stations.value.find((s) => s.id === link.to);
  if (!fromNode || !toNode) return '';

  const x1 = fromNode.x + 100; // 右侧连接点
  const y1 = fromNode.y + 20;
  const x2 = toNode.x; // 左侧连接点
  const y2 = toNode.y + 20;

  // 贝塞尔曲线控制点
  const controlX = (x1 + x2) / 2;

  return `M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}`;
};

// --- 删除连线 ---
const deleteLink = (link: Link) => {
  links.value = links.value.filter(
    (l) => !(l.from === link.from && l.to === link.to),
  );
  message.success('连线已删除');
};

// --- 自动布局 ---
// 已移除自动布局功能，新元素添加在默认位置，后续由用户手动调整

// --- 画布缩放控制 ---
const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 3); // 最大放大到3倍
};

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.2, 0.3); // 最小缩小到0.3倍
};

const resetZoom = () => {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
};

// --- 画布平移控制 ---
const handleCanvasMouseDown = (e: MouseEvent) => {
  // 只有在按住空格键或中键时才启用平移
  if (
    (e.button === 1 || e.button === 0) && // 中键或左键 + 没有其他拖拽操作
    !dragging.value &&
    !connecting.value
  ) {
    isPanning.value = true;
    panStartX.value = e.clientX - translateX.value;
    panStartY.value = e.clientY - translateY.value;
    e.preventDefault();
  }
};

const handleCanvasMouseMove = (e: MouseEvent) => {
  if (isPanning.value) {
    translateX.value = e.clientX - panStartX.value;
    translateY.value = e.clientY - panStartY.value;
    e.preventDefault();
  }
};

const handleCanvasMouseUp = () => {
  isPanning.value = false;
};

// --- 画布滚轮缩放 ---
const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  scale.value = Math.max(0.3, Math.min(3, scale.value * delta));
};
</script>

<template>
  <Page
    auto-content-height
    title="工位工序编辑器"
    description="通过拖拽方式自由编排工序和工位，支持工序分组和工位连线"
  >
    <template #extra>
      <Space>
        <!-- 操作提示 -->
        <Tooltip placement="bottomRight">
          <template #title>
            <div class="text-xs">
              <p class="mb-2 font-bold">操作说明：</p>
              <ul class="ml-4 list-disc space-y-1">
                <li>双击工序名称可编辑工序</li>
                <li>拖拽工序标题区域可移动整个工序及工位</li>
                <li>点击工序右上角 "+" 添加新工位</li>
                <li>双击工位可编辑工位名称和代号</li>
                <li>从工位右侧蓝点拖拽至另一工位可连线</li>
                <li>双击连线可删除</li>
                <li>选中元素后点击 "删除选中" 即可移除</li>
              </ul>
            </div>
          </template>
          <Button :disabled="loading">
            <template #icon>
              <span class="text-base">?</span>
            </template>
          </Button>
        </Tooltip>

        <Button type="primary" :disabled="loading" @click="addProcess">
          添加工序
        </Button>
        <Button danger :disabled="loading" @click="deleteSelected">
          删除选中
        </Button>

        <!-- 缩放控制 -->
        <Space.Compact>
          <Button :disabled="loading" @click="zoomOut" title="缩小">
            <template #icon>
              <span class="text-base">-</span>
            </template>
          </Button>
          <Button :disabled="loading" @click="resetZoom" title="重置缩放">
            {{ Math.round(scale * 100) }}%
          </Button>
          <Button :disabled="loading" @click="zoomIn" title="放大">
            <template #icon>
              <span class="text-base">+</span>
            </template>
          </Button>
        </Space.Compact>

        <Button :loading="loading" type="primary" @click="saveData">
          保存数据
        </Button>
      </Space>
    </template>

    <!-- SVG 画布 -->
    <Card
      :body-style="{ padding: 0, height: '100%', display: 'flex' }"
      class="relative h-full overflow-hidden"
      style="height: 100%"
    >
      <svg
        ref="svgRef"
        class="flex-1"
        :class="isPanning ? 'cursor-grabbing' : 'cursor-crosshair'"
        @mousedown="handleCanvasMouseDown"
        @mouseleave="handleCanvasMouseUp"
        @mousemove="
          (e) => {
            handleCanvasMouseMove(e);
            handleMouseMove(e);
          }
        "
        @mouseup="
          () => {
            handleCanvasMouseUp();
            handleMouseUp();
          }
        "
        @wheel="handleWheel"
      >
        <defs>
          <!-- 箭头标记 -->
          <marker
            id="arrowhead"
            markerHeight="7"
            markerWidth="10"
            orient="auto"
            refX="9"
            refY="3.5"
          >
            <polygon fill="#3b82f6" points="0 0, 10 3.5, 0 7" />
          </marker>

          <!-- 网格背景 -->
          <pattern
            id="grid"
            height="40"
            patternUnits="userSpaceOnUse"
            width="40"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="1"
            />
          </pattern>
        </defs>

        <!-- 网格背景 -->
        <rect fill="url(#grid)" height="100%" width="100%" />

        <!-- 应用缩放和平移变换的主容器 -->
        <g
          :transform="`translate(${translateX}, ${translateY}) scale(${scale})`"
        >
          <!-- 1. 渲染工序容器 -->
          <g v-for="proc in processes" :key="proc.id" class="process-group">
            <!-- 工序容器阴影 -->
            <rect
              :height="proc.height"
              :width="proc.width"
              :x="proc.x + 2"
              :y="proc.y + 2"
              fill="#00000010"
              rx="8"
            />
            <!-- 工序容器主体 -->
            <rect
              :fill="selectedId === proc.id ? '#dbeafe' : '#fafafa'"
              :height="proc.height"
              :stroke="selectedId === proc.id ? '#2563eb' : '#d1d5db'"
              :width="proc.width"
              :x="proc.x"
              :y="proc.y"
              class="process-rect cursor-move transition-all"
              filter="url(#shadow)"
              rx="8"
              stroke-dasharray="8,4"
              stroke-width="2"
              @mousedown="(e) => handleMouseDown(e, 'process', proc)"
            />

            <!-- 工序名称 -->
            <foreignObject
              :height="30"
              :width="proc.width - 70"
              :x="proc.x + 10"
              :y="proc.y"
            >
              <div
                class="flex h-full cursor-pointer items-center px-2"
                @dblclick="(e) => handleProcessDblClick(e, proc)"
              >
                <span
                  class="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold"
                  :style="{
                    color: selectedId === proc.id ? '#2563eb' : '#374151',
                  }"
                  :title="proc.label"
                >
                  {{ proc.label }}
                </span>
              </div>
            </foreignObject>

            <!-- 添加工位按钮 -->
            <foreignObject
              :height="28"
              :width="28"
              :x="proc.x + proc.width - 34"
              :y="proc.y + 4"
            >
              <button
                class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white shadow-md transition-all hover:scale-110 hover:bg-blue-600 hover:shadow-lg active:scale-95"
                title="添加工位"
                @click="addStation(proc.id)"
              >
                +
              </button>
            </foreignObject>
          </g>

          <!-- 2. 渲染连线 -->
          <g v-for="(link, idx) in links" :key="idx">
            <path
              :d="getLinkPath(link)"
              class="cursor-pointer transition-all hover:stroke-[3]"
              fill="none"
              marker-end="url(#arrowhead)"
              stroke="#3b82f6"
              stroke-width="2"
              @dblclick="deleteLink(link)"
            />
          </g>

          <!-- 3. 正在创建的连线 -->
          <line
            v-if="connecting"
            :x1="connecting.startX"
            :x2="connecting.currentX"
            :y1="connecting.startY"
            :y2="connecting.currentY"
            stroke="#94a3b8"
            stroke-dasharray="4"
            stroke-width="2"
          />

          <!-- 4. 渲染工位节点 -->
          <g
            v-for="station in stations"
            :key="station.id"
            class="station-node cursor-move"
            @mousedown="(e) => handleMouseDown(e, 'station', station)"
            @mouseup="(e) => handleStationMouseUp(e, station)"
          >
            <!-- 工位阴影 -->
            <rect
              :height="40"
              :width="100"
              :x="station.x + 2"
              :y="station.y + 2"
              fill="#00000015"
              rx="6"
            />
            <!-- 工位主体 -->
            <rect
              :fill="selectedId === station.id ? '#dbeafe' : '#ffffff'"
              :height="40"
              :stroke="selectedId === station.id ? '#2563eb' : '#6b7280'"
              :width="100"
              :x="station.x"
              :y="station.y"
              class="station-rect transition-all"
              rx="6"
              stroke-width="2.5"
            />
            <!-- 工位顶部装饰条 -->
            <rect
              :fill="selectedId === station.id ? '#3b82f6' : '#9ca3af'"
              :height="4"
              :width="100"
              :x="station.x"
              :y="station.y"
              rx="6"
            />

            <!-- 工位信息显示 - 名称和代号 -->
            <foreignObject
              :height="32"
              :width="94"
              :x="station.x + 3"
              :y="station.y + 8"
            >
              <div
                class="station-info flex h-full w-full cursor-pointer flex-col items-center justify-center px-1"
                @dblclick="(e) => handleStationDblClick(e, station)"
              >
                <!-- 工位名称 -->
                <div
                  class="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-xs font-semibold leading-tight"
                  :style="{
                    color: selectedId === station.id ? '#1e40af' : '#374151',
                  }"
                  :title="station.label"
                >
                  {{ station.label }}
                </div>
                <!-- 工位代号 -->
                <div
                  class="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[10px] leading-tight"
                  :style="{
                    color: selectedId === station.id ? '#60a5fa' : '#9ca3af',
                  }"
                  :title="station.code"
                >
                  {{ station.code || '-' }}
                </div>
              </div>
            </foreignObject>

            <!-- 右侧连接点 (Source) - 输出端 -->
            <g class="connection-point">
              <circle
                :cx="station.x + 100"
                :cy="station.y + 20"
                :r="6"
                class="cursor-crosshair transition-all"
                fill="#3b82f6"
                @mousedown.stop="(e) => handleLinkStart(e, station)"
              />
              <circle
                :cx="station.x + 100"
                :cy="station.y + 20"
                :r="3"
                fill="white"
                opacity="0.6"
                pointer-events="none"
              />
            </g>

            <!-- 左侧连接点 (Target) - 输入端 -->
            <g class="connection-point">
              <circle
                :cx="station.x"
                :cy="station.y + 20"
                :r="6"
                class="transition-all"
                fill="#6b7280"
              />
              <circle
                :cx="station.x"
                :cy="station.y + 20"
                :r="3"
                fill="white"
                opacity="0.6"
                pointer-events="none"
              />
            </g>
          </g>
        </g>
      </svg>
    </Card>

    <!-- 工位编辑弹窗 -->
    <Modal
      v-model:open="stationModalVisible"
      title="编辑工位"
      :mask-closable="false"
      @ok="handleStationSubmit"
      @cancel="handleStationCancel"
    >
      <Form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <Form.Item label="工位名称" required>
          <Input
            v-model:value="stationFormData.label"
            placeholder="请输入工位名称"
            @press-enter="handleStationSubmit"
          />
        </Form.Item>
        <Form.Item label="工位代号" required>
          <Input
            v-model:value="stationFormData.code"
            placeholder="请输入工位代号"
            @press-enter="handleStationSubmit"
          />
        </Form.Item>
      </Form>
    </Modal>

    <!-- 工序编辑弹窗 -->
    <Modal
      v-model:open="processModalVisible"
      title="编辑工序"
      :mask-closable="false"
      @ok="handleProcessSubmit"
      @cancel="handleProcessCancel"
    >
      <Form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <Form.Item label="工序名称" required>
          <Input
            v-model:value="processFormData.label"
            placeholder="请输入工序名称"
            @press-enter="handleProcessSubmit"
          />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>

<style scoped>
/* 工序标题不响应鼠标事件 */
svg text.process-label {
  pointer-events: none;
}

/* 工位信息可以响应双击事件 */
.station-info {
  pointer-events: auto;
  user-select: none;
}
</style>
