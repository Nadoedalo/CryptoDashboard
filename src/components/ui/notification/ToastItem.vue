<template>
  <div
    class="notificationItem"
    :class="{
      error: props.type === NOTIFICATION_TYPES.ERROR,
      success: props.type === NOTIFICATION_TYPES.SUCCESS,
      warning: props.type === NOTIFICATION_TYPES.WARNING,
    }"
  >
    {{ props.text }}
  </div>
</template>

<script lang="ts" setup>
import { type IToastNotification, NOTIFICATION_TYPES, useToastNotificationStore } from '@stores/ToastNotificationStore';
import { onMounted } from 'vue';
import { mainConfig } from '~/config/main';

const props = defineProps<IToastNotification>();
const toastNotificationStore = useToastNotificationStore();
onMounted(() => {
  /* this is not the best solution & prone to errors.
  But the fastest to deliver the notification that only disappears after they become visible */
  setTimeout(() => {
    toastNotificationStore.removeToast(props);
  }, mainConfig.notification.timeout);
});
</script>

<style lang="scss">
@use "@imports/colors.module";
.notificationItem {
  margin: 0 1em;
  padding: 0.5em;
  border-radius: 0.5em;
  &.error {
    background: colors.$red-dark;
    color: colors.$white;
  }
  &.success {
    background: colors.$teal-dark;
  }
  &.warning {
    background: colors.$gold;
  }
}
</style>
