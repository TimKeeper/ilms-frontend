<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { BellOutlined, WarningOutlined } from '@ant-design/icons-vue';
import { Badge, Button } from 'ant-design-vue';

import { useAlarmStore } from '#/store/alarm';

const emit = defineEmits<{
  openHistory: [];
}>();

const alarmStore = useAlarmStore();

// Current visible alarm index for carousel
const currentIndex = ref(0);
let carouselInterval: any = null;

const alarms = computed(() => alarmStore.sortedAlarms);
const alarmCount = computed(() => alarmStore.alarmCount);
const currentAlarm = computed(() =>
  alarms.value.length > 0 ? alarms.value[currentIndex.value] : null,
);

// Auto-scroll through alarms every 3 seconds
const startCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }

  if (alarms.value.length > 1) {
    carouselInterval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % alarms.value.length;
    }, 3000);
  }
};

const stopCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
};

// Restart carousel when alarms change
const resetCarousel = () => {
  currentIndex.value = 0;
  stopCarousel();
  startCarousel();
};

// Watch for alarm changes
const unwatchAlarms = alarmStore.$subscribe(() => {
  resetCarousel();
});

onMounted(() => {
  startCarousel();
});

onBeforeUnmount(() => {
  stopCarousel();
  unwatchAlarms();
});

const handleOpenHistory = () => {
  emit('openHistory');
};

const getAlarmTypeColor = (type: 'radar' | 'tag') => {
  return type === 'radar'
    ? 'bg-orange-50 text-orange-600 border-orange-200'
    : 'bg-red-50 text-red-600 border-red-200';
};
</script>

<template>
  <div
    v-if="currentAlarm"
    class="alarm-ticker flex w-full items-center gap-3 rounded-lg border px-4 py-3 transition-all"
    :class="getAlarmTypeColor(currentAlarm.type)"
    @mouseenter="stopCarousel"
    @mouseleave="startCarousel"
  >
    <!-- Warning Icon -->
    <div class="flex-shrink-0">
      <WarningOutlined :style="{ fontSize: '18px' }" />
    </div>

    <!-- Alarm Message with Vertical Slide Transition -->
    <div class="relative flex-1 overflow-hidden" style="height: 24px">
      <TransitionGroup name="slide-up">
        <div
          :key="currentAlarm.id"
          class="alarm-message absolute left-0 top-0 w-full"
        >
          <span class="text-sm font-medium">
            [{{ currentAlarm.type === 'radar' ? '雷达' : '标签' }}]
            {{ currentAlarm.message }}
          </span>
        </div>
      </TransitionGroup>
    </div>

    <!-- Alarm Count & View All Button -->
    <div class="flex flex-shrink-0 items-center gap-2">
      <Badge :count="alarmCount" :overflow-count="99">
        <Button
          size="small"
          type="text"
          class="flex items-center gap-1"
          @click="handleOpenHistory"
        >
          <BellOutlined />
          <span class="text-xs">查看全部</span>
        </Button>
      </Badge>
    </div>
  </div>
</template>

<style scoped>
.alarm-ticker {
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}

.alarm-message {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Vertical slide up transition */
.slide-up-enter-active {
  transition: all 0.5s ease;
}

.slide-up-leave-active {
  position: absolute;
  transition: all 0.5s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
