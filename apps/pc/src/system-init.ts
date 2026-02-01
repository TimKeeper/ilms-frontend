import { updatePreferences } from '@vben/preferences';

import { useTitle } from '@vueuse/core';

import { getSystemConfigApi } from '#/api/config';

/**
 * Initialize system configuration
 * Fetches system title and other settings from backend
 */
export async function initSystemConfig() {
  try {
    const config = await getSystemConfigApi();
    if (config && config.SYSTEM_TITLE) {
      const title = config.SYSTEM_TITLE;

      // Update preferences (this will persist to localStorage and update UI components like Logo)
      updatePreferences({
        app: {
          name: title,
        },
      });

      // Update browser tab title
      const pageTitle = useTitle();
      pageTitle.value = title;
    }
  } catch (error) {
    console.error('Failed to initialize system config:', error);
  }
}
