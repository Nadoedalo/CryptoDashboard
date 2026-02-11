<template>
  <div class="d-flex w-100 h-100 overflow-hidden">
    <UiNotificationToastWrapper />
    <UiDashboardSidebar />
    <div class="uiDashboardSidebarPlaceholder" />
    <v-container class="flex-grow-1 mainContent h-100 w-100 d-flex pa-0 overflow-auto">
      <div class="dashboardContent h-100 w-100">
        <slot />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
/*
* Here we can do basic stuff like checking for authorization
* */
</script>

<style>

</style>
