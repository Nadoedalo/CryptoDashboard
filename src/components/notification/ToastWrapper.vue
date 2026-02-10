<template>
  <div
    v-if="toastNotificationStore.getActiveToastArr.length"
    class="notificationWrapper"
  >
    <NotificationToastItem
      v-for="toast in toastNotificationStore.getActiveToastArr"
      :key="toast.id"
      v-bind="toast"
    />
  </div>
</template>

<script lang="ts" setup>
import { useToastNotificationStore } from '@/stores/ToastNotificationStore';

const toastNotificationStore = useToastNotificationStore();
</script>

<style lang="scss">
.notificationWrapper {
  width: min(100%, 30em);
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  margin: 1em 0;
  z-index: 3000;
}
</style>
