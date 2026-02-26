<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { TagLifeChartParams, TagLifeChartResult } from '#/api/tag';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
} from 'ant-design-vue';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

import { getTagLifeChartApi } from '#/api/tag';
import { getBoundListApi } from '#/api/util';

// Form state
const formState = reactive<{
  dateRange?: [Dayjs, Dayjs];
  stationLabel?: string;
  tagBoundName?: string;
  tagSn?: number;
  tagType?: 0 | 1;
}>({
  dateRange: [dayjs().subtract(7, 'day'), dayjs()],
  tagType: 1, // 默认选中车架
});

const loading = ref(false);
const chartData = ref<null | TagLifeChartResult>(null);

// Check if chart has data
const hasData = computed(() => {
  return (
    chartData.value?.series?.some((s) => s.data.some((d) => d !== null)) ??
    false
  );
});

// Chart instance
let chartInstance: echarts.ECharts | null = null;
const chartRef = ref<HTMLElement>();

// 铁包/车架选项列表
const boundNameOptions = ref<{ label: string; value: string }[]>([]);
const boundNameLoading = ref(false);

// 获取铁包/车架列表
const fetchBoundNameOptions = async () => {
  // 如果没有选择标识器类型，清空选项列表
  if (formState.tagType === undefined) {
    boundNameOptions.value = [];
    formState.tagBoundName = undefined;
    return;
  }

  try {
    boundNameLoading.value = true;

    // 使用统一的 boundList 接口
    const result = await getBoundListApi({
      type: formState.tagType,
    });

    boundNameOptions.value = result.boundList.map((item) => ({
      label: item.boundName,
      value: item.boundName,
    }));

    // 默认选中第一项
    formState.tagBoundName =
      boundNameOptions.value.length > 0
        ? boundNameOptions.value[0]?.value
        : undefined;
  } catch (error) {
    console.error('Failed to fetch bound name options:', error);
    boundNameOptions.value = [];
    formState.tagBoundName = undefined;
  } finally {
    boundNameLoading.value = false;
  }
};

// 监听标识器类型变化
watch(
  () => formState.tagType,
  () => {
    formState.tagBoundName = undefined; // 清空之前的选择
    fetchBoundNameOptions();
  },
);

// Fetch chart data
const fetchChartData = async () => {
  try {
    loading.value = true;

    const params: TagLifeChartParams = {
      stationLabel: formState.stationLabel,
      tagType: formState.tagType,
      tagSn: formState.tagSn,
      tagBoundName: formState.tagBoundName,
    };

    // Convert date range to timestamps (start of day to end of day)
    if (formState.dateRange?.[0] && formState.dateRange?.[1]) {
      params.startTime = formState.dateRange[0].startOf('day').valueOf();
      params.endTime = formState.dateRange[1].endOf('day').valueOf();
    }

    const result = await getTagLifeChartApi(params);
    chartData.value = result;
    renderChart(result);
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
  } finally {
    loading.value = false;
  }
};

// Render ECharts
const renderChart = (data: TagLifeChartResult) => {
  if (!chartRef.value || !data) return;

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }

  const dataLength = data.xaxis.length;
  // 智能显隐策略：数据点少于15个时隐藏滑动条
  const showSlider = dataLength > 15;

  const option: echarts.EChartsOption = {
    title: {
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (!Array.isArray(params)) return '';

        let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;

        for (const param of params) {
          const seriesData = data.series[param.seriesIndex];
          if (seriesData) {
            result += `
              <div style="margin: 4px 0;">
                ${param.marker}
                <span style="font-weight: 500;">${param.seriesName}</span><br/>
                <span style="margin-left: 20px; color: #666;">标签SN: ${seriesData.tagSn}</span><br/>
                <span style="margin-left: 20px; color: #666;">工位: ${seriesData.stationLabel}</span><br/>
                <span style="margin-left: 20px; color: #666;">类型: ${seriesData.tagType === 0 ? '高温标识器（铁包）' : '常温标识器（车架）'}</span><br/>
                <span style="margin-left: 20px; color: #1890ff; font-weight: 600;">Pulse值: ${param.value ?? 'N/A'}</span>
              </div>
            `;
          }
        }

        return result;
      },
    },
    legend: {
      type: 'scroll',
      top: 0,
      data: data.series.map(
        (s) => `${s.tagBoundName} @ ${s.stationLabel} (SN: ${s.tagSn})`,
      ),
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '50px',
      bottom: showSlider ? '50px' : '20px',
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'slider',
        show: showSlider,
        xAxisIndex: 0,
        start: 0,
        end: 100,
        height: 12,
        bottom: 10,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        fillerColor: 'rgba(24, 144, 255, 0.05)',
        handleIcon: 'rect',
        handleSize: '80%',
        handleStyle: {
          color: '#1890ff',
          borderWidth: 0,
        },
        moveHandleSize: 0,
        textStyle: {
          color: '#999',
          fontSize: 10,
        },
        dataBackground: {
          lineStyle: {
            color: '#ddd',
            opacity: 0.3,
            width: 0.5,
          },
          areaStyle: {
            color: 'rgba(24, 144, 255, 0.03)',
          },
        },
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
    ],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.xaxis,
      axisLabel: {
        rotate: 0,
        hideOverlap: true,
        formatter: (value: string) => {
          // 尝试格式化日期显示（如果是日期格式）
          if (value && value.includes('-')) {
            const parts = value.split(' ');
            if (parts[0]) {
              const dateParts = parts[0].split('-');
              // 返回 MM-DD 格式
              if (dateParts.length >= 3) {
                return `${dateParts[1]}-${dateParts[2]}`;
              }
            }
          }
          return value;
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'Pulse值',
      axisLabel: {
        formatter: '{value}',
      },
    },
    series: data.series.map((item) => ({
      name: `${item.tagBoundName} @ ${item.stationLabel} (SN: ${item.tagSn})`,
      type: 'line',
      data: item.data,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      emphasis: {
        focus: 'series',
      },
    })),
  };

  chartInstance.setOption(option, { notMerge: true });
};

// Reset form
const handleReset = () => {
  formState.stationLabel = undefined;
  formState.tagType = 1; // 重置为默认车架
  formState.tagSn = undefined;
  formState.dateRange = [dayjs().subtract(7, 'day'), dayjs()];
  // 重新加载铁包/车架列表
  fetchBoundNameOptions();
};

// Resize chart on window resize
const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
  // 初始化时加载铁包/车架列表
  fetchBoundNameOptions();
  // 初始化图表数据
  fetchChartData();
  window.addEventListener('resize', handleResize);
});

// Cleanup
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});
</script>

<template>
  <Page auto-content-height>
    <!-- Filter Form -->
    <Card :bordered="false" class="mb-4">
      <Form layout="vertical">
        <Row :gutter="16">
          <Col :span="6">
            <Form.Item label="工位名称">
              <Input
                v-model:value="formState.stationLabel"
                placeholder="请输入工位名称"
                allow-clear
              />
            </Form.Item>
          </Col>
          <Col :span="6">
            <Form.Item label="标识器类型">
              <Select
                v-model:value="formState.tagType"
                placeholder="请选择类型"
                allow-clear
              >
                <Select.Option :value="0">高温标识器（铁包）</Select.Option>
                <Select.Option :value="1">常温标识器（车架）</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col :span="6">
            <Form.Item
              :label="
                formState.tagType === 0
                  ? '铁包名称'
                  : formState.tagType === 1
                    ? '车架名称'
                    : '铁包/车架名称'
              "
            >
              <!-- 当选择了标识器类型时，显示下拉框 -->
              <Select
                v-if="formState.tagType !== undefined"
                v-model:value="formState.tagBoundName"
                :placeholder="`请选择${formState.tagType === 0 ? '铁包' : '车架'}名称`"
                :loading="boundNameLoading"
                allow-clear
              >
                <Select.Option
                  v-for="option in boundNameOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select>
              <!-- 当未选择标识器类型时，显示输入框 -->
              <Input
                v-else
                v-model:value="formState.tagBoundName"
                placeholder="请输入铁包/车架名称"
                allow-clear
              />
            </Form.Item>
          </Col>
          <Col :span="6">
            <Form.Item label="标识器ID">
              <InputNumber
                v-model:value="formState.tagSn"
                placeholder="请输入标识器ID"
                :min="0"
                class="w-full"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="12">
            <Form.Item label="时间范围" required>
              <DatePicker.RangePicker
                v-model:value="formState.dateRange"
                class="w-full"
                :allow-clear="false"
                :disabled-date="
                  (current: Dayjs) => current && current > dayjs().endOf('day')
                "
              />
            </Form.Item>
          </Col>
          <Col :span="12">
            <Form.Item label=" ">
              <Space>
                <Button type="primary" @click="fetchChartData"> 查询 </Button>
                <Button @click="handleReset">重置</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>

    <!-- Chart -->
    <Card :bordered="false" title="标识器寿命趋势图">
      <Spin :spinning="loading">
        <div style="position: relative">
          <div
            ref="chartRef"
            class="w-full"
            style="height: 500px; min-height: 500px"
          ></div>
          <div
            v-if="!loading && !hasData"
            style="
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #fff;
            "
          >
            <Empty
              description="暂无数据，请调整查询条件"
              :image="Empty.PRESENTED_IMAGE_SIMPLE"
            />
          </div>
        </div>
      </Spin>
    </Card>
  </Page>
</template>

<style scoped>
:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
