<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';

import type { StationAlarmItem } from '#/api/alarm';
import type { TagStatusRangeGroup } from '#/api/tag';

import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  FireOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  InboxOutlined,
} from '@ant-design/icons-vue';
import { Card, Empty, Spin, Tooltip, Tree } from 'ant-design-vue';

import { getStationAlarmListApi } from '#/api/alarm';
import { getTagStatusApi } from '#/api/tag';

// Tree node data structure
interface TreeNodeData {
  key: string;
  title: string;
  icon?: any;
  children?: TreeNodeData[];
  isLeaf?: boolean;
  stationId?: number;
  tagType?: 0 | 1;
}

// State
const stations = ref<StationAlarmItem[]>([]);
const tagStatusData = ref<TagStatusRangeGroup[]>([]);
const loadingStations = ref(false);
const loadingStatus = ref(false);

// Tree state
const selectedKeys = ref<string[]>([]);
const expandedKeys = ref<string[]>([]);

// Current selection
const currentStationId = ref<null | number>(null);
const currentTagType = ref<0 | 1>(0);

// Fetch stations
const fetchStations = async () => {
  try {
    loadingStations.value = true;
    const response = await getStationAlarmListApi({
      showTagStatus: 1,
      page: 1,
      pageSize: 100,
    });

    stations.value = response.items;

    // Auto-select first station's high-temp child
    if (stations.value.length > 0) {
      const firstStation = stations.value[0];
      if (firstStation) {
        const firstChildKey = `${firstStation.id}-0`;
        selectedKeys.value = [firstChildKey];
        expandedKeys.value = [`station-${firstStation.id}`];
        currentStationId.value = firstStation.id;
        currentTagType.value = 0;
        await fetchTagStatus();
      }
    }
  } catch (error) {
    console.error('[IdentifierStatus] Failed to fetch stations:', error);
  } finally {
    loadingStations.value = false;
  }
};

// Fetch tag status data
const fetchTagStatus = async () => {
  if (!currentStationId.value) return;

  try {
    loadingStatus.value = true;
    const response = await getTagStatusApi({
      stationId: currentStationId.value,
      tagType: currentTagType.value,
    });
    tagStatusData.value = response.items;
  } catch (error) {
    console.error('[IdentifierStatus] Failed to fetch tag status:', error);
    tagStatusData.value = [];
  } finally {
    loadingStatus.value = false;
  }
};

// Transform stations into tree data
const treeData = computed<TreeNodeData[]>(() => {
  return stations.value.map((station) => ({
    key: `station-${station.id}`,
    title: station.label,
    children: [
      {
        key: `${station.id}-0`,
        title: '高温标识器',
        isLeaf: true,
        stationId: station.id,
        tagType: 0,
      },
      {
        key: `${station.id}-1`,
        title: '常温标识器',
        isLeaf: true,
        stationId: station.id,
        tagType: 1,
      },
    ],
  }));
});

// Handle tree node selection
const handleSelect: TreeProps['onSelect'] = (keys, event) => {
  const node = event.node as any;

  // Only allow leaf node selection
  if (!node.isLeaf) {
    // If clicking a parent, toggle expansion
    const stationKey = node.key;
    expandedKeys.value = expandedKeys.value.includes(stationKey)
      ? expandedKeys.value.filter((k) => k !== stationKey)
      : [...expandedKeys.value, stationKey];
    return;
  }

  // Update selection
  selectedKeys.value = keys as string[];
  currentStationId.value = node.stationId;
  currentTagType.value = node.tagType;

  // Fetch data
  fetchTagStatus();
};

// Handle tree expansion
const handleExpand: TreeProps['onExpand'] = (keys) => {
  expandedKeys.value = keys as string[];
};

// Range type color mapping
const getRangeColorClasses = (rangeType: 'A' | 'B' | 'C' | 'D') => {
  const colorMap = {
    A: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200',
      cardBg: 'bg-green-50',
    },
    B: {
      bg: 'bg-cyan-100',
      text: 'text-cyan-600',
      border: 'border-cyan-200',
      cardBg: 'bg-cyan-50',
    },
    C: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      border: 'border-amber-200',
      cardBg: 'bg-amber-50',
    },
    D: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      border: 'border-red-200',
      cardBg: 'bg-red-50',
    },
  };
  return colorMap[rangeType];
};

// Format timestamp
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Check if all groups are empty
const isEmpty = computed(() => {
  if (!tagStatusData.value || tagStatusData.value.length === 0) {
    return true;
  }
  return tagStatusData.value.every((group) => group.rangeData?.length === 0);
});

// Mount
onMounted(() => {
  fetchStations();
});
</script>

<template>
  <Page auto-content-height>
    <!-- Left-Right Split Layout -->
    <div class="flex h-[calc(100vh-200px)] gap-4">
      <!-- Left Sidebar: Tree Navigation -->
      <Card
        :loading="loadingStations"
        title="工位列表"
        class="w-64 flex-shrink-0"
        :bordered="false"
        :body-style="{
          padding: '12px',
          height: 'calc(100% - 57px)',
          overflowY: 'auto',
        }"
      >
        <template v-if="stations.length === 0 && !loadingStations">
          <Empty
            description="暂无工位数据"
            :image="Empty.PRESENTED_IMAGE_SIMPLE"
          />
        </template>

        <Tree
          v-else
          v-model:selected-keys="selectedKeys"
          v-model:expanded-keys="expandedKeys"
          :tree-data="treeData"
          :show-icon="true"
          :block-node="true"
          @select="handleSelect"
          @expand="handleExpand"
        >
          <template #icon="{ dataRef }">
            <FolderOpenOutlined
              v-if="!dataRef.isLeaf && expandedKeys.includes(dataRef.key)"
              :style="{ fontSize: '16px' }"
            />
            <FolderOutlined
              v-else-if="!dataRef.isLeaf"
              :style="{ fontSize: '16px' }"
            />
            <FireOutlined
              v-else-if="dataRef.tagType === 0"
              :style="{ fontSize: '16px' }"
            />
            <InboxOutlined v-else :style="{ fontSize: '16px' }" />
          </template>
        </Tree>
      </Card>

      <!-- Right Content Area -->
      <div class="flex-1 overflow-hidden">
        <Card
          :loading="loadingStatus"
          :bordered="false"
          class="h-full"
          :body-style="{
            height: '100%',
            overflowY: 'auto',
            background: '#f9fafb',
            padding: '0',
          }"
        >
          <!-- Loading State -->
          <div
            v-if="loadingStatus"
            class="flex h-full items-center justify-center"
          >
            <Spin size="large" tip="加载中..." />
          </div>

          <!-- Empty State -->
          <Empty
            v-else-if="isEmpty"
            description="该工位暂无标识器数据"
            :image="Empty.PRESENTED_IMAGE_SIMPLE"
            class="py-12"
          />

          <!-- Group List -->
          <div v-else class="space-y-6 p-6">
            <div
              v-for="group in tagStatusData"
              :key="group.rangeType"
              class="group-row"
            >
              <!-- Group Header -->
              <div class="flex items-start gap-4">
                <!-- Range Type Label (Large Letter Box) -->
                <div
                  class="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg border-2"
                  :class="[
                    getRangeColorClasses(group.rangeType).bg,
                    getRangeColorClasses(group.rangeType).border,
                  ]"
                >
                  <span
                    class="text-4xl font-bold"
                    :class="getRangeColorClasses(group.rangeType).text"
                  >
                    {{ group.rangeType }}
                  </span>
                </div>

                <!-- Range Data Cards Container -->
                <div class="flex-1">
                  <!-- Range Value Header -->
                  <div class="mb-3 flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-600">
                      温度范围:
                    </span>
                    <span
                      class="text-sm font-semibold"
                      :class="getRangeColorClasses(group.rangeType).text"
                    >
                      {{ group.rangeValue }}
                    </span>
                    <span class="text-xs text-gray-400">
                      ({{ group.rangeData?.length || 0 }} 个标识器)
                    </span>
                  </div>

                  <!-- Dashed Border Container -->
                  <div
                    v-if="group.rangeData && group.rangeData.length > 0"
                    class="grid grid-cols-2 gap-3 rounded-lg border-2 border-dashed p-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                    :class="getRangeColorClasses(group.rangeType).border"
                  >
                    <!-- Tag Cards -->
                    <Tooltip
                      v-for="(tag, index) in group.rangeData"
                      :key="index"
                      placement="top"
                    >
                      <template #title>
                        <div class="space-y-1 text-xs">
                          <div>脉冲值: {{ tag.tagLastPulse }}</div>
                          <div>
                            更新时间: {{ formatTime(tag.tagLastRecordTime) }}
                          </div>
                        </div>
                      </template>

                      <div
                        class="cursor-pointer rounded-lg border px-3 py-2 shadow-sm transition-all hover:shadow-md"
                        :class="[
                          getRangeColorClasses(group.rangeType).cardBg,
                          getRangeColorClasses(group.rangeType).border,
                        ]"
                      >
                        <div
                          class="text-sm font-semibold"
                          :class="getRangeColorClasses(group.rangeType).text"
                        >
                          {{ tag.boundName }}
                        </div>
                        <div class="mt-1 text-xs text-gray-600">
                          {{ tag.tagSn }}
                        </div>
                      </div>
                    </Tooltip>
                  </div>

                  <!-- Empty Group Message -->
                  <div
                    v-else
                    class="rounded-lg border-2 border-dashed p-4 text-center text-sm text-gray-400"
                    :class="getRangeColorClasses(group.rangeType).border"
                  >
                    该范围暂无数据
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </Page>
</template>

<style scoped>
.group-row {
  padding: 16px;
  background: white;
  border-radius: 8px;
  transition: all 0.2s;
}

.group-row:hover {
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

/* Custom tree styles */
:deep(.ant-tree) {
  background: transparent;
}

:deep(.ant-tree-node-content-wrapper) {
  border-radius: 4px;
  transition: all 0.2s;
}

:deep(.ant-tree-node-selected .ant-tree-node-content-wrapper) {
  color: rgb(37 99 235) !important;
  background-color: rgb(219 234 254) !important;
}

:deep(.ant-tree-node-content-wrapper:hover) {
  background-color: rgb(243 244 246);
}

:deep(.ant-tree-title) {
  font-size: 14px;
}

:deep(.ant-tree-switcher) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
