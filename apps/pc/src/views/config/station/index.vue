<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Modal, Space } from 'ant-design-vue';

// 工序容器类型
interface ProcessGroup {
  height: number;
  id: string;
  label: string;
  width: number;
  x: number;
  y: number;
}

// 工位节点类型
interface Station {
  id: string;
  label: string;
  processId: string;
  x: number;
  y: number;
}

// 连接线类型
interface Link {
  from: string;
  to: string;
}

// 拖拽状态类型
interface DragState {
  id: string;
  offsetX: number;
  offsetY: number;
  type: 'process' | 'station';
}

// 连线状态类型
interface ConnectState {
  currentX: number;
  currentY: number;
  fromId: string;
  startX: number;
  startY: number;
}

// --- 数据状态 ---
const processes = ref<ProcessGroup[]>([
  { id: 'p1', label: '机加工序', x: 50, y: 80, width: 320, height: 240 },
  { id: 'p2', label: '组装工序', x: 450, y: 80, width: 280, height: 240 },
]);

const stations = ref<Station[]>([
  { id: 's1', label: '工位 A-1', x: 80, y: 130, processId: 'p1' },
  { id: 's2', label: '工位 A-2', x: 230, y: 200, processId: 'p1' },
  { id: 's3', label: '工位 B-1', x: 500, y: 150, processId: 'p2' },
]);

const links = ref<Link[]>([
  { from: 's1', to: 's2' },
  { from: 's2', to: 's3' },
]);

// --- 交互状态 ---
const dragging = ref<DragState | null>(null);
const connecting = ref<ConnectState | null>(null);
const selectedId = ref<null | string>(null);
const svgRef = ref<null | SVGSVGElement>(null);

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
      stations.value = stations.value.map((s) =>
        s.id === dragging.value?.id
          ? {
              ...s,
              x: pos.x - dragging.value.offsetX,
              y: pos.y - dragging.value.offsetY,
            }
          : s,
      );
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
  connecting.value = null;
};

// --- 添加工序 ---
const addProcess = () => {
  const id = `p${Date.now()}`;
  processes.value.push({
    height: 200,
    id,
    label: '新工序',
    width: 250,
    x: 100,
    y: 100,
  });
  message.success('工序添加成功');
};

// --- 添加工位 ---
const addStation = (processId: string) => {
  const proc = processes.value.find((p) => p.id === processId);
  if (!proc) return;

  const id = `s${Date.now()}`;
  stations.value.push({
    id,
    label: '新工位',
    processId,
    x: proc.x + 20,
    y: proc.y + 40,
  });
  message.success('工位添加成功');
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

// --- 保存数据 ---
const saveData = () => {
  const data = {
    links: links.value,
    processes: processes.value,
    stations: stations.value,
  };
  // 这里可以调用 API 保存数据
  // eslint-disable-next-line no-console
  console.log('保存数据:', data);
  message.success('数据已保存（查看控制台）');
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
</script>

<template>
  <Page
    title="工位工序编辑器"
    description="通过拖拽方式自由编排工序和工位，支持工序分组和工位连线"
  >
    <div class="flex h-[calc(100vh-200px)] flex-col overflow-hidden bg-gray-50">
      <!-- 工具栏 -->
      <Card class="mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h2 class="text-lg font-bold">工位工序编辑器</h2>
            <span class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-400">
              原生引擎
            </span>
          </div>
          <Space>
            <Button type="primary" @click="addProcess">添加工序</Button>
            <Button danger @click="deleteSelected">删除选中</Button>
            <Button @click="saveData">保存数据</Button>
          </Space>
        </div>
      </Card>

      <!-- SVG 画布 -->
      <Card class="flex-1 overflow-hidden p-0">
        <svg
          ref="svgRef"
          class="h-full w-full cursor-crosshair"
          @mouseleave="handleMouseUp"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
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

          <!-- 1. 渲染工序容器 -->
          <g v-for="proc in processes" :key="proc.id">
            <rect
              :fill="selectedId === proc.id ? '#eff6ff' : '#f8fafc'"
              :height="proc.height"
              :stroke="selectedId === proc.id ? '#3b82f6' : '#cbd5e1'"
              :width="proc.width"
              :x="proc.x"
              :y="proc.y"
              class="cursor-move"
              rx="8"
              stroke-dasharray="5,5"
              stroke-width="2"
              @mousedown="(e) => handleMouseDown(e, 'process', proc)"
            />
            <text
              :x="proc.x + 10"
              :y="proc.y - 10"
              class="select-none text-xs font-bold uppercase tracking-wider"
              fill="#64748b"
            >
              工序: {{ proc.label }}
            </text>

            <!-- 添加工位按钮 -->
            <foreignObject
              :height="24"
              :width="24"
              :x="proc.x + proc.width - 30"
              :y="proc.y + 5"
            >
              <button
                class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition hover:bg-blue-200"
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
            class="cursor-move"
            @mousedown="(e) => handleMouseDown(e, 'station', station)"
            @mouseup="(e) => handleStationMouseUp(e, station)"
          >
            <rect
              :fill="selectedId === station.id ? '#dbeafe' : 'white'"
              :height="40"
              :stroke="selectedId === station.id ? '#3b82f6' : '#64748b'"
              :width="100"
              :x="station.x"
              :y="station.y"
              class="drop-shadow-sm"
              rx="4"
              stroke-width="2"
            />
            <text
              :x="station.x + 50"
              :y="station.y + 25"
              class="select-none text-xs font-medium"
              fill="#374151"
              text-anchor="middle"
            >
              {{ station.label }}
            </text>

            <!-- 右侧连接点 (Source) -->
            <circle
              :cx="station.x + 100"
              :cy="station.y + 20"
              :r="5"
              class="hover:r-7 cursor-crosshair transition-all"
              fill="#3b82f6"
              @mousedown.stop="(e) => handleLinkStart(e, station)"
            />

            <!-- 左侧连接点 (Target) -->
            <circle
              :cx="station.x"
              :cy="station.y + 20"
              :r="5"
              class="hover:fill-blue-400"
              fill="#9ca3af"
            />
          </g>
        </svg>

        <!-- 操作提示 -->
        <div
          class="pointer-events-none absolute bottom-4 left-4 rounded-lg border bg-white/90 p-3 text-xs text-gray-600 shadow-md"
        >
          <p class="mb-2 font-bold">操作说明：</p>
          <ul class="ml-4 list-disc space-y-1">
            <li>拖拽工序标题区域可移动整个工序及工位</li>
            <li>点击工序右上角 "+" 添加新工位</li>
            <li>从工位右侧蓝点拖拽至另一工位可连线</li>
            <li>双击连线可删除</li>
            <li>选中元素后点击顶部 "删除选中" 即可移除</li>
          </ul>
        </div>
      </Card>
    </div>
  </Page>
</template>

<style scoped>
svg text {
  pointer-events: none;
}
</style>
