import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { IToastNotification } from '@/stores/ToastNotificationStore/ToastNotificationStore.types.ts';
import { mainConfig } from '@/config/main';

export const useToastNotificationStore = defineStore('ToastNotificationStore', () => {
  /**
   * State section
   * */
  const toastsArr = ref<IToastNotification[]>([]);
  const toastId = ref<number>(0);
  /**
   * Startup section
   * */

  /**
   * Watchers section
   * */

  /**
   * Getters section
   * */

  const getActiveToastArr = computed((): IToastNotification[] => {
    const res: IToastNotification[] = [];
    if (toastsArr.value.length) {
      for (let i = 0; i <= mainConfig.notification.maxNotifications && i < toastsArr.value.length; i++) {
        const toast = toastsArr.value[i];
        if (toast) {
          res.push(toast);
        }
      }
    }
    return res;
  });

  /**
   * Actions section
   * */

  function addToast({ text, type = 'error'}: { text: IToastNotification['text']; type?: IToastNotification['type']; }) {
    // we can also de-dupe or group some toasts
    if (!text) {
      throw new Error(`[addNotification] Text is required`);
    }
    toastsArr.value.push({ text, type, id: nextId() });
  }

  function removeToast(toast: IToastNotification) {
    toastsArr.value = toastsArr.value.filter(item => item.id !== toast.id);
  }

  function nextId() {
    toastId.value += 1;
    return toastId.value;
  }

  return {
    toastsArr,
    getActiveToastArr,
    addToast,
    removeToast,
  };
});
