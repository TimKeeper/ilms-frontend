<script lang="ts" setup>
import { computed } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { preferences } from '@vben/preferences';

import { Card } from 'ant-design-vue';

const appName = computed(() => preferences.app.name || '电磁微声平台');

const primaryLinks = [
  {
    description: '查看雷达、标识器等设备的当前状态。',
    icon: 'lucide:activity',
    path: '/status/radar',
    title: '状态监控',
  },
  {
    description: '维护设备、工位、铁包、车架和报警规则。',
    icon: 'lucide:settings',
    path: '/config/radar',
    title: '配置管理',
  },
  {
    description: '回看铁包流转过程和关键识别节点。',
    icon: 'lucide:route',
    path: '/track/trajectory',
    title: '轨迹追踪',
  },
  {
    description: '查询识别记录、导出记录和统计报表。',
    icon: 'lucide:file-bar-chart',
    path: '/report/radar-recognition',
    title: '报表分析',
  },
];

const setupSteps = [
  '先维护工位与基础设备配置。',
  '确认雷达、标识器与报警规则已按现场要求启用。',
  '进入状态监控或轨迹追踪，查看现场业务运行情况。',
];

const supportNotes = [
  '顶部搜索可快速定位菜单与页面。',
  '左侧导航已按业务场景分组，日常操作从对应模块进入。',
  '页面标签会保留常用工作页，便于在多个模块之间切换。',
];
</script>

<template>
  <Page
    title="首页"
    :description="`欢迎使用${appName}，请选择左侧菜单或下方入口继续工作。`"
  >
    <div class="home-page">
      <Card :bordered="false" class="home-card">
        <div class="welcome-row">
          <div class="welcome-copy">
            <div class="welcome-title">{{ appName }}</div>
            <p>
              系统面向铁包流转、设备状态、识别记录与轨迹追踪等日常工作，
              首页仅保留必要入口，不展示演示数据。
            </p>
          </div>

          <div class="welcome-actions">
            <RouterLink class="primary-action" to="/status/radar">
              进入状态监控
            </RouterLink>
            <RouterLink class="secondary-action" to="/config/radar">
              设备配置
            </RouterLink>
          </div>
        </div>
      </Card>

      <div class="content-grid">
        <Card title="常用入口" :bordered="false" class="home-card">
          <div class="module-list">
            <RouterLink
              v-for="item in primaryLinks"
              :key="item.path"
              class="module-item"
              :to="item.path"
            >
              <IconifyIcon :icon="item.icon" class="module-icon" />
              <span class="module-text">
                <span class="module-title">{{ item.title }}</span>
                <span class="module-description">{{ item.description }}</span>
              </span>
            </RouterLink>
          </div>
        </Card>

        <Card title="使用顺序" :bordered="false" class="home-card">
          <ol class="ordered-list">
            <li v-for="(step, index) in setupSteps" :key="step">
              <span class="order-index">{{ index + 1 }}</span>
              <span>{{ step }}</span>
            </li>
          </ol>
        </Card>
      </div>

      <Card title="操作提示" :bordered="false" class="home-card">
        <ul class="note-list">
          <li v-for="note in supportNotes" :key="note">{{ note }}</li>
        </ul>
      </Card>
    </div>
  </Page>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1180px;
}

.home-card {
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  box-shadow: 0 1px 2px rgb(15 23 42 / 4%);
}

.welcome-row {
  display: flex;
  gap: 24px;
  justify-content: space-between;
}

.welcome-copy {
  max-width: 680px;
}

.welcome-title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  color: hsl(var(--foreground));
}

.welcome-copy p {
  margin: 10px 0 0;
  line-height: 1.8;
  color: hsl(var(--muted-foreground));
}

.welcome-actions {
  display: flex;
  flex-shrink: 0;
  gap: 10px;
  align-items: flex-start;
}

.primary-action,
.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 14px;
  font-size: 14px;
  border-radius: 8px;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.primary-action {
  color: hsl(var(--primary-foreground));
  background: hsl(var(--primary));
}

.primary-action:hover {
  color: hsl(var(--primary-foreground));
  background: hsl(var(--primary) / 88%);
}

.secondary-action {
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}

.secondary-action:hover {
  color: hsl(var(--primary));
  border-color: hsl(var(--primary));
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 16px;
}

.module-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.module-item {
  display: flex;
  gap: 12px;
  min-height: 84px;
  padding: 14px;
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  transition:
    background-color 160ms ease,
    border-color 160ms ease;
}

.module-item:hover {
  color: hsl(var(--foreground));
  background: hsl(var(--muted) / 45%);
  border-color: hsl(var(--primary));
}

.module-icon {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  color: hsl(var(--muted-foreground));
}

.module-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.module-title {
  font-weight: 500;
}

.module-description {
  font-size: 13px;
  line-height: 1.6;
  color: hsl(var(--muted-foreground));
}

.ordered-list,
.note-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.ordered-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ordered-list li {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 10px;
  line-height: 1.7;
  color: hsl(var(--foreground));
}

.order-index {
  font-variant-numeric: tabular-nums;
  color: hsl(var(--muted-foreground));
}

.note-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.note-list li {
  padding-left: 12px;
  line-height: 1.7;
  color: hsl(var(--muted-foreground));
  border-left: 2px solid hsl(var(--border));
}

@media (max-width: 1024px) {
  .content-grid,
  .note-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .welcome-row,
  .welcome-actions {
    flex-direction: column;
  }

  .module-list {
    grid-template-columns: 1fr;
  }
}
</style>
