<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { TrackChartParams, TrackChartResult, TrackPoint } from '#/api/tag';

import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
} from 'ant-design-vue';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

import { getTrackChartApi } from '#/api/tag';

// Form state
const formState = reactive<{
  boundName?: string;
  dateRange?: [Dayjs, Dayjs];
  trackType: 0 | 1; // 0-铁包 1-车架
}>({
  boundName: undefined,
  dateRange: [dayjs().subtract(1, 'day'), dayjs()],
  trackType: 1, // 默认车架
});

const loading = ref(false);
const chartData = ref<null | TrackChartResult>(null);

// Chart instance
let chartInstance: echarts.ECharts | null = null;
const chartRef = ref<HTMLElement>();

// Fetch chart data
const fetchChartData = async () => {
  try {
    loading.value = true;

    const params: TrackChartParams = {
      boundName: formState.boundName,
    };

    // Convert date range to timestamps (precision to second)
    if (formState.dateRange?.[0] && formState.dateRange?.[1]) {
      params.startTime = formState.dateRange[0].startOf('second').valueOf();
      params.endTime = formState.dateRange[1].endOf('second').valueOf();
    }

    // 调用真实API
    const result = await getTrackChartApi(formState.trackType, params);

    chartData.value = result;
    renderChart(result);
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
  } finally {
    loading.value = false;
  }
};

// Render ECharts
const renderChart = (data: TrackChartResult) => {
  if (!chartRef.value || !data) return;

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }

  // 计算数据点总数
  const totalDataPoints = data.series.reduce(
    (sum, s) => sum + s.data.length,
    0,
  );
  // 智能显隐策略：数据点少于15个时隐藏滑动条
  const showSlider = totalDataPoints > 15;

  const option: echarts.EChartsOption = {
    title: {
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (!params.data?.tooltipData) return '';

        const data = params.data.tooltipData;
        return `
          <div style="padding: 4px;">
            <div style="font-weight: bold; margin-bottom: 8px;">${params.seriesName}</div>
            <div style="margin: 2px 0; color: #666;">工位: ${data.stationLabel} (${data.stationCode})</div>
            <div style="margin: 2px 0; color: #666;">标签SN: ${data.tagSn}</div>
            <div style="margin: 2px 0; color: #666;">开始时间: ${data.startTime}</div>
            <div style="margin: 2px 0; color: #666;">结束时间: ${data.endTime}</div>
            <div style="margin: 2px 0; color: #666;">读取次数: ${data.readCount}</div>
            <div style="margin: 2px 0; color: #1890ff; font-weight: 600;">信号值: ${data.pulseValue}</div>
          </div>
        `;
      },
    },
    legend: {
      type: 'scroll',
      top: 30,
      data: data.series.map((s) => s.name),
    },
    grid: {
      left: '80px',
      right: '40px',
      top: '80px',
      bottom: showSlider ? '60px' : '40px',
      containLabel: false,
    },
    dataZoom: [
      {
        type: 'slider',
        show: showSlider,
        xAxisIndex: 0,
        start: 0,
        end: 100,
        height: 12,
        bottom: 15,
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
      type: 'time',
      name: '时间',
      nameLocation: 'middle',
      nameGap: 25,
      axisLabel: {
        formatter: (value: number) => {
          return dayjs(value).format('HH:mm:ss');
        },
        rotate: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: '工位',
      nameLocation: 'middle',
      nameGap: 50,
      axisLabel: {
        formatter: (value: number) => {
          // 使用 yAxis 数据映射工位名称
          // 标签器轨迹点 = 工位代号 + 100
          // 铁包/车架整体轨迹点 = 工位代号 + 110
          const station = data.yaxis.find(
            (s) =>
              Math.abs(s.value - (value - 100)) < 0.1 ||
              Math.abs(s.value - (value - 110)) < 0.1,
          );
          return station ? station.label : value.toString();
        },
      },
    },
    series: data.series.map((s) => ({
      name: s.name,
      type: s.type,
      data: s.data.map((d: TrackPoint) => ({
        value: [d.timestamp, d.value],
        tooltipData: d.tooltipData,
      })),
      smooth: s.smooth,
      symbol: s.symbol,
      symbolSize: s.symbolSize,
      lineStyle: {
        width: 2,
      },
      // 在数据点上显示工位代号
      label: {
        show: true,
        formatter: (params: any) => {
          return params.data?.tooltipData?.stationCode || '';
        },
        position: 'top',
        fontSize: 10,
        color: '#666',
      },
      emphasis: {
        focus: 'series',
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
    })),
  };

  chartInstance.setOption(option, true);
};

// Reset form
const handleReset = () => {
  formState.boundName = undefined;
  formState.trackType = 1;
  formState.dateRange = [dayjs().subtract(1, 'day'), dayjs()];
};

// Resize chart on window resize
const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
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
  <Page
    title="铁包及车架轨迹"
    description="实时追踪铁包和车架的位置和移动轨迹，支持历史轨迹回放"
  >
    <!-- Filter Form -->
    <Card :bordered="false" class="mb-4">
      <Form layout="vertical">
        <Row :gutter="16">
          <Col :span="6">
            <Form.Item label="轨迹类型">
              <Select
                v-model:value="formState.trackType"
                placeholder="请选择类型"
              >
                <Select.Option :value="0">铁包轨迹</Select.Option>
                <Select.Option :value="1">车架轨迹</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col :span="6">
            <Form.Item
              :label="formState.trackType === 0 ? '铁包名称' : '车架名称'"
            >
              <Input
                v-model:value="formState.boundName"
                :placeholder="`请输入${formState.trackType === 0 ? '铁包' : '车架'}名称`"
                allow-clear
              />
            </Form.Item>
          </Col>
          <Col :span="12">
            <Form.Item label="时间范围">
              <DatePicker.RangePicker
                v-model:value="formState.dateRange"
                show-time
                class="w-full"
                :disabled-date="
                  (current: Dayjs) => current && current > dayjs().endOf('day')
                "
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col :span="24">
            <Form.Item>
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
    <Card
      :bordered="false"
      :title="formState.trackType === 0 ? '铁包运行轨迹图' : '车架运行轨迹图'"
    >
      <Spin :spinning="loading">
        <div
          ref="chartRef"
          class="w-full"
          style="height: 600px; min-height: 600px"
        ></div>
      </Spin>
    </Card>
  </Page>
</template>

<style scoped>
:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
