<template>
  <v-container class="cryptoDashboard d-flex flex-column overflow-auto h-100">
    TODO
    {{ JSON.stringify(coinStore.coinArr) }}
  </v-container>
</template>

<script setup lang="ts">
import { useCoinStore } from '@/stores/CoinStore';

definePageMeta({
  alias: ['/dashboard'],
  middleware: [
    (to) => {
      if (to.path === '/') {
        return navigateTo('/dashboard', { replace: true });
      }
    },
  ],
});

const coinStore = useCoinStore();
</script>

<style lang="scss">
@use "@imports/colors.module";
</style>
