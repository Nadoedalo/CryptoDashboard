<template>
  <div class="noHoldings d-flex flex-column align-center justify-center pa-2">
    <h4 class="text-center mb-4">
      {{ title || $t('dashboard.noPortfolio') }}
    </h4>
    <v-btn
      to="/portfolio/add"
      color="primary"
    >
      {{ buttonText || $t('dashboard.addHolding') }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  buttonText?: string;
}

defineProps<Props>();
</script>
