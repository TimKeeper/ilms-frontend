import { defineStore } from 'pinia';

export interface Alarm {
  id: string; // Unique ID
  type: 'radar' | 'tag'; // Alarm source
  message: string; // The content
  time: number; // Timestamp (ms)
}

interface AlarmState {
  alarmList: Alarm[];
}

export const useAlarmStore = defineStore('alarm', {
  state: (): AlarmState => ({
    alarmList: [],
  }),

  getters: {
    /**
     * Get the latest alarm
     */
    latestAlarm(state): Alarm | null {
      return state.alarmList.length > 0 ? (state.alarmList[0] ?? null) : null;
    },

    /**
     * Get total alarm count
     */
    alarmCount(state): number {
      return state.alarmList.length;
    },

    /**
     * Get alarms sorted by time (newest first)
     */
    sortedAlarms(state): Alarm[] {
      return [...state.alarmList].toSorted((a, b) => b.time - a.time);
    },
  },

  actions: {
    /**
     * Add or update an alarm
     * - If alarm with same id exists: update message & time, move to top
     * - If new: add to top
     */
    addOrUpdateAlarm(alarm: Alarm) {
      const existingIndex = this.alarmList.findIndex((a) => a.id === alarm.id);

      if (existingIndex === -1) {
        // Add new alarm to top
        this.alarmList.unshift(alarm);
      } else {
        // Update existing alarm
        const existingAlarm = this.alarmList[existingIndex];
        if (existingAlarm) {
          this.alarmList[existingIndex] = {
            ...existingAlarm,
            message: alarm.message,
            time: alarm.time,
          };

          // Move to top if not already at top
          if (existingIndex !== 0) {
            const updatedAlarm = this.alarmList.splice(existingIndex, 1)[0];
            if (updatedAlarm) {
              this.alarmList.unshift(updatedAlarm);
            }
          }
        }
      }
    },

    /**
     * Clear all alarms
     */
    clearAllAlarms() {
      this.alarmList = [];
    },

    /**
     * Remove a specific alarm by id
     */
    removeAlarm(id: string) {
      const index = this.alarmList.findIndex((a) => a.id === id);
      if (index !== -1) {
        this.alarmList.splice(index, 1);
      }
    },
  },
});
