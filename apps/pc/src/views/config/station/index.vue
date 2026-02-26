<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { Handle, Position, useVueFlow, VueFlow } from '@vue-flow/core';
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

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';

// --- State ---
const nodes = ref<any[]>([]);
const edges = ref<any[]>([]);
const loading = ref(false);

const { addEdges, getSelectedNodes, getSelectedEdges, removeSelectedElements } =
  useVueFlow();

// --- Modals State ---
const stationModalVisible = ref(false);
const editingStation = ref<any>(null);
const stationFormData = ref({ code: '', label: '' });

const processModalVisible = ref(false);
const editingProcess = ref<any>(null);
const processFormData = ref({ label: '' });

// --- Modals Logic ---
const handleProcessDblClick = (data: any) => {
  editingProcess.value = data;
  processFormData.value = { label: data.label };
  processModalVisible.value = true;
};

const handleProcessSubmit = () => {
  const trimmedLabel = processFormData.value.label.trim();
  if (!trimmedLabel) {
    message.warning('工序名称不能为空');
    return;
  }

  const labelExists = nodes.value.some(
    (n) =>
      n.type === 'process' &&
      n.data.rawId !== editingProcess.value.rawId &&
      n.data.label === trimmedLabel,
  );
  if (labelExists) {
    message.warning('工序名称已存在，请使用其他名称');
    return;
  }

  const n = nodes.value.find(
    (p) => p.type === 'process' && p.data.rawId === editingProcess.value.rawId,
  );
  if (n) {
    n.data.label = trimmedLabel;
  }
  processModalVisible.value = false;
  message.success('工序更新成功');
};

const handleProcessCancel = () => {
  processModalVisible.value = false;
};

const handleStationDblClick = (data: any) => {
  editingStation.value = data;
  stationFormData.value = { label: data.label, code: data.code || '' };
  stationModalVisible.value = true;
};

const handleStationSubmit = () => {
  const trimmedLabel = stationFormData.value.label.trim();
  const trimmedCode = stationFormData.value.code.trim();

  if (!trimmedLabel) {
    message.warning('工位名称不能为空');
    return;
  }
  if (!trimmedCode) {
    message.warning('工位代号不能为空');
    return;
  }

  const labelExists = nodes.value.some(
    (s) =>
      s.type === 'station' &&
      s.data.rawId !== editingStation.value.rawId &&
      s.data.label === trimmedLabel,
  );
  if (labelExists) {
    message.warning('工位名称已存在');
    return;
  }

  const codeExists = nodes.value.some(
    (s) =>
      s.type === 'station' &&
      s.data.rawId !== editingStation.value.rawId &&
      s.data.code === trimmedCode,
  );
  if (codeExists) {
    message.warning('工位代号已存在');
    return;
  }

  const n = nodes.value.find(
    (s) => s.type === 'station' && s.data.rawId === editingStation.value.rawId,
  );
  if (n) {
    n.data.label = trimmedLabel;
    n.data.code = trimmedCode;
  }
  stationModalVisible.value = false;
  message.success('工位更新成功');
};

const handleStationCancel = () => {
  stationModalVisible.value = false;
};

// --- Actions ---
const addProcess = () => {
  const processNodes = nodes.value.filter((n) => n.type === 'process');
  let maxOrder = 0;
  if (processNodes.length > 0) {
    maxOrder = Math.max(...processNodes.map((p) => p.data.order || 0));
  }

  const tempId = -Date.now();
  const suffix = Date.now().toString().slice(-4);
  const uniqueLabel = `新工序 ${suffix}`;

  let newX = 100;
  let newY = 100;
  if (processNodes.length > 0) {
    // eslint-disable-next-line unicorn/no-array-reduce
    const rightmost = processNodes.reduce((prev, curr) =>
      prev.position.x + (Number.parseInt(prev.style?.width) || 250) >
      curr.position.x + (Number.parseInt(curr.style?.width) || 250)
        ? prev
        : curr,
    );
    newX =
      rightmost.position.x +
      (Number.parseInt(rightmost.style?.width) || 250) +
      100;
    newY = rightmost.position.y;
  }

  nodes.value.push({
    id: `process_${tempId}`,
    type: 'process',
    position: { x: newX, y: newY },
    data: {
      rawId: tempId,
      label: uniqueLabel,
      order: maxOrder + 1,
    },
    style: { width: '300px', height: '260px', zIndex: -1 },
    dragHandle: '.custom-drag-handle',
  });
  message.success('工序添加成功');
};

const addStation = (processRawId: number) => {
  const parentNode = nodes.value.find(
    (n) => n.type === 'process' && n.data.rawId === processRawId,
  );
  if (!parentNode) return;

  const tempId = -Date.now();
  let uniqueSuffix = Date.now().toString().slice(-4);
  let uniqueLabel = `新工位 ${uniqueSuffix}`;
  let uniqueCode = uniqueSuffix;

  while (
    nodes.value.some(
      (s) => s.type === 'station' && s.data.label === uniqueLabel,
    )
  ) {
    uniqueSuffix = Date.now().toString().slice(-4);
    uniqueLabel = `新工位 ${uniqueSuffix}`;
  }

  while (
    nodes.value.some((s) => s.type === 'station' && s.data.code === uniqueCode)
  ) {
    uniqueCode = Date.now().toString().slice(-4);
  }

  nodes.value.push({
    id: `station_${tempId}`,
    type: 'station',
    position: { x: 20, y: 60 },
    parentNode: parentNode.id,
    extent: 'parent',
    data: {
      rawId: tempId,
      label: uniqueLabel,
      code: uniqueCode,
      processId: processRawId,
      type: 0,
    },
  });
  message.success('工位添加成功');
};

const onConnect = (params: any) => {
  const isExist = edges.value.some(
    (e) => e.source === params.source && e.target === params.target,
  );
  if (isExist) {
    message.warning('该连线已存在');
  } else {
    addEdges([
      {
        id: `edge_${Date.now()}`,
        source: params.source,
        target: params.target,
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      },
    ]);
    message.success('连线创建成功');
  }
};

const onEdgeDoubleClick = ({ edge }: any) => {
  edges.value = edges.value.filter((e) => e.id !== edge.id);
  message.success('连线已删除');
};

const deleteSelected = () => {
  const selectedNodes = getSelectedNodes.value;
  const selectedEdges = getSelectedEdges.value;

  if (selectedNodes.length === 0 && selectedEdges.length === 0) {
    message.warning('请先选中要删除的元素');
    return;
  }

  Modal.confirm({
    content: `确定要删除选中的元素吗？`,
    title: '确认删除',
    onOk: () => {
      removeSelectedElements();
      message.success('删除成功');
    },
  });
};

// --- Data Operations ---
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getStationFlowConfigApi();
    if (res) {
      const vfNodes: any[] = [];
      const vfEdges: any[] = [];

      res.processes.forEach((p) => {
        vfNodes.push({
          id: `process_${p.id || Date.now() + Math.random()}`,
          type: 'process',
          position: { x: p.x, y: p.y },
          data: {
            rawId: p.id || Date.now(),
            color: p.color,
            height: p.height,
            label: p.label,
            order: p.order,
            width: p.width,
            x: p.x,
            y: p.y,
          },
          style: {
            width: `${p.width || 300}px`,
            height: `${p.height || 260}px`,
            zIndex: -1,
          },
          dragHandle: '.custom-drag-handle',
        });
      });

      res.stations.forEach((s) => {
        const parent = vfNodes.find((pn) => pn.data.rawId === s.processId);
        const relX = parent ? s.x - parent.position.x : s.x;
        const relY = parent ? s.y - parent.position.y : s.y;

        vfNodes.push({
          id: `station_${s.id || Date.now() + Math.random()}`,
          type: 'station',
          position: { x: relX, y: relY },
          parentNode: parent ? parent.id : undefined,
          extent: 'parent',
          data: {
            rawId: s.id || Date.now(),
            code: s.code,
            label: s.label,
            processId: s.processId,
            type: s.type,
          },
        });
      });

      (res.links || []).forEach((l: any, index: number) => {
        vfEdges.push({
          id: `edge_${index}`,
          source: `station_${l.from}`,
          target: `station_${l.to}`,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        });
      });

      nodes.value = vfNodes;
      edges.value = vfEdges;

      message.success('数据加载成功');
    }
  } catch (error) {
    console.error('加载失败:', error);
  } finally {
    loading.value = false;
  }
};

const saveData = async () => {
  loading.value = true;
  try {
    const processes: any[] = [];
    const stations: any[] = [];
    const processMap = new Map();
    const stationIdToLabelMap = new Map();

    nodes.value.forEach((n) => {
      if (n.type === 'process') {
        const pData: any = {
          color: n.data.color,
          height: Number.parseInt(n.style?.height as string) || 260,
          label: n.data.label,
          order: n.data.order || 0,
          width: Number.parseInt(n.style?.width as string) || 300,
          x: Math.round(n.position.x),
          y: Math.round(n.position.y),
        };
        if (n.data.rawId && n.data.rawId > 0) {
          pData.id = n.data.rawId;
        }
        processes.push(pData);
        processMap.set(n.data.rawId, n.data.label);
      }
    });

    nodes.value.forEach((n) => {
      if (n.type === 'station') {
        let absX = n.position.x;
        let absY = n.position.y;
        if (n.parentNode) {
          const parentNode = nodes.value.find((pn) => pn.id === n.parentNode);
          if (parentNode) {
            absX += parentNode.position.x;
            absY += parentNode.position.y;
          }
        }
        const sData: any = {
          code: n.data.code || '',
          label: n.data.label,
          process: processMap.get(n.data.processId) || '',
          type: n.data.type ?? 1,
          x: Math.round(absX),
          y: Math.round(absY),
        };
        if (n.data.rawId && n.data.rawId > 0) {
          sData.id = n.data.rawId;
        }
        stations.push(sData);
        stationIdToLabelMap.set(n.id, n.data.label);
      }
    });

    const links = edges.value.map((e) => ({
      from: stationIdToLabelMap.get(e.source) || '',
      to: stationIdToLabelMap.get(e.target) || '',
    }));

    const saveParams = {
      canvas: { center: { x: 600, y: 400 }, height: 800, width: 1200 },
      links,
      processes,
      stations,
    };

    await saveStationFlowConfigApi(saveParams as any);
    message.success('数据保存成功');
  } catch (error) {
    console.error('保存失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <Page
    auto-content-height
    title="工位工序编辑器"
    description="通过拖拽方式自由编排工序和工位，支持工序分组和工位连线 (Powered by Vue Flow)"
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
                <li>从工位右侧蓝点拖拽至另一工位左侧黑点可连线</li>
                <li>双击连线可直接删除</li>
                <li>支持框选、按选中节点按 Backspace 快捷键删除</li>
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
        <Button :loading="loading" type="primary" @click="saveData">
          保存数据
        </Button>
      </Space>
    </template>

    <!-- Vue Flow 画布 -->
    <Card
      :body-style="{ padding: 0, height: '100%', display: 'flex' }"
      class="relative h-full overflow-hidden"
      style="height: 100%"
    >
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        @connect="onConnect"
        @edge-double-click="onEdgeDoubleClick"
        :default-viewport="{ zoom: 1 }"
        :min-zoom="0.2"
        :max-zoom="4"
        class="h-full w-full"
      >
        <Background pattern-color="#e5e7eb" :gap="30" />
        <Controls position="bottom-left" />

        <!-- 自定义工序节点 -->
        <template #node-process="props">
          <div
            class="relative flex h-full w-full flex-col rounded-xl border-[2.5px] border-dashed transition-all"
            :class="[
              props.selected
                ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-100'
                : 'border-gray-300 bg-gray-50/40',
            ]"
          >
            <!-- header 拖拽把手 -->
            <div
              class="custom-drag-handle flex cursor-move items-center justify-between rounded-t-lg border-b border-gray-300 bg-gray-200/50 px-3 py-2"
            >
              <div
                class="flex-1 truncate text-sm font-semibold"
                :class="props.selected ? 'text-blue-700' : 'text-gray-700'"
                @dblclick="handleProcessDblClick(props.data)"
              >
                {{ props.data.label }}
                {{
                  props.data.order !== undefined ? `(${props.data.order})` : ''
                }}
              </div>
              <button
                class="z-10 flex h-6 w-6 items-center justify-center rounded bg-blue-500 text-sm font-bold text-white shadow transition-colors hover:bg-blue-600 active:scale-95"
                title="添加工位"
                @click.stop="addStation(props.data.rawId)"
              >
                +
              </button>
            </div>
          </div>
        </template>

        <!-- 自定义工位节点 -->
        <template #node-station="props">
          <div
            class="relative flex h-[50px] w-[120px] cursor-move flex-col items-center justify-center rounded border-2 bg-white px-2 shadow-sm transition-all"
            :class="[
              props.selected
                ? 'scale-105 border-blue-500 shadow-lg ring-2 ring-blue-100'
                : 'border-gray-400',
            ]"
            @dblclick="handleStationDblClick(props.data)"
          >
            <!-- 顶部装饰线 -->
            <div
              class="absolute left-0 right-0 top-0 h-1.5 rounded-t-[2px]"
              :class="[props.selected ? 'bg-blue-500' : 'bg-gray-400']"
            ></div>

            <div
              class="mt-[6px] w-full truncate text-center text-xs font-semibold leading-tight"
              :class="props.selected ? 'text-blue-800' : 'text-gray-800'"
              :title="props.data.label"
            >
              {{ props.data.label }}
            </div>
            <div
              class="w-full truncate text-center text-[10px] leading-tight"
              :class="props.selected ? 'text-blue-400' : 'text-gray-400'"
              :title="props.data.code"
            >
              {{ props.data.code || '-' }}
            </div>

            <!-- 节点连接把手 -->
            <Handle
              type="target"
              :position="Position.Left"
              class="!h-3 !w-3 !rounded-full !border-2 !border-white !bg-gray-400"
            />
            <Handle
              type="source"
              :position="Position.Right"
              class="!h-3 !w-3 !rounded-full !border-2 !border-white !bg-blue-500"
            />
          </div>
        </template>
      </VueFlow>
    </Card>

    <!-- 工位编辑弹窗 -->
    <Modal
      v-model:open="stationModalVisible"
      title="编辑工位"
      @ok="handleStationSubmit"
      @cancel="handleStationCancel"
    >
      <Form layout="vertical">
        <Form.Item label="工位名称" required>
          <Input
            v-model:value="stationFormData.label"
            placeholder="请输入工位名称"
          />
        </Form.Item>
        <Form.Item label="工位代号" required>
          <Input
            v-model:value="stationFormData.code"
            placeholder="请输入工位代号"
          />
        </Form.Item>
      </Form>
    </Modal>

    <!-- 工序编辑弹窗 -->
    <Modal
      v-model:open="processModalVisible"
      title="编辑工序"
      @ok="handleProcessSubmit"
      @cancel="handleProcessCancel"
    >
      <Form layout="vertical">
        <Form.Item label="工序名称" required>
          <Input
            v-model:value="processFormData.label"
            placeholder="请输入工序名称"
          />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>

<style scoped>
/* Ensure dragging via custom handle functions correctly in Vue Flow */
.custom-drag-handle {
  user-select: none;
}
</style>
