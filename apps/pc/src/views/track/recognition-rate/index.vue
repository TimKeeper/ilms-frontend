<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { StationAccuracyResult } from '#/api/station-flow';

import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, DatePicker, Spin, Table } from 'ant-design-vue';
import dayjs from 'dayjs';

import { getStationAccuracyApi } from '#/api/station-flow';

const RangePicker = DatePicker.RangePicker;

const loading = ref(false);
const accuracyResult = ref<null | StationAccuracyResult>(null);

// Default to last 7 days (including today? or just 7 days span)
// Typically [today-7, today] or [today-6, today].
// "最近一周" usually means last 7 days.
const rangeValue = ref<[Dayjs, Dayjs]>([dayjs().subtract(6, 'day'), dayjs()]);

const fetchData = async () => {
  try {
    loading.value = true;
    const [startTime, endTime] = rangeValue.value
      ? [rangeValue.value[0].valueOf(), rangeValue.value[1].valueOf()]
      : [undefined, undefined];

    const accuracy = await getStationAccuracyApi({ endTime, startTime });
    accuracyResult.value = accuracy;
  } catch (error) {
    console.error('Failed to fetch data', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const formatRateDetailed = (rate: null | number | undefined) => {
  if (rate === null || rate === undefined) return '';
  const pct = rate * 100;
  return Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(2)}%`;
};

const tableColumns = computed(() => [
  {
    customRender: ({ index }: { index: number }) => index + 1,
    key: 'index',
    title: '序号',
    width: 80,
  },
  {
    dataIndex: 'stationLabel',
    key: 'stationLabel',
    title: '工位',
  },
  {
    customRender: ({ text }: { text: number }) => formatRateDetailed(text),
    dataIndex: 'rate',
    key: 'rate',
    title: '正确率',
  },
  {
    customCell: (_: any, index: number | undefined) => {
      if ((index || 0) === 0) {
        return {
          rowSpan: accuracyResult.value?.stationAccuracyList.length || 1,
        };
      }
      return { rowSpan: 0 };
    },
    customRender: () =>
      formatRateDetailed(accuracyResult.value?.overallAccuracy?.rate),
    key: 'averageRate',
    title: '平均识别率',
    width: 200,
  },
]);
</script>

<template>
  <Page
    description="统计和分析各个检查点位、工位的识别率，评估系统性能"
    title="识别率统计"
  >
    <Card>
      <div v-if="loading" class="flex h-[600px] items-center justify-center">
        <Spin size="large" />
      </div>

      <div v-else class="relative w-full overflow-auto p-4">
        <!-- Header -->
        <div class="mb-4 flex items-center justify-end">
          <RangePicker
            v-model:value="rangeValue"
            :allow-clear="false"
            @change="fetchData"
          />
        </div>

        <!-- Detail Table -->
        <div class="mt-4">
          <Table
            :columns="tableColumns"
            :data-source="accuracyResult?.stationAccuracyList || []"
            :pagination="false"
            bordered
            row-key="stationCode"
          />
        </div>
      </div>
    </Card>
  </Page>
</template>
