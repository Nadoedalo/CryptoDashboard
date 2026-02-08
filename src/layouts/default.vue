<template>
  <div class="d-flex w-100 h-100 overflow-hidden">
    <DashboardSidebar />
    <v-container class="flex-grow-1 mainContent h-100 w-100">
      <slot />
    </v-container>
  </div>
</template>

<script setup lang="ts">
/*
* Here we can do basic stuff like checking for authorization
* */
import DashboardSidebar from '~/components/ui/DashboardSidebar.vue';
</script>

<style>

</style>
