<template>
  <div class="d-flex align-center ga-2">
    <client-only>
      <v-img
        v-if="imageSrc"
        :src="imageSrc"
        :alt="altText"
        eager
        height="2em"
        width="2em"
        class="flex-grow-0"
      />
    </client-only>
    <span>{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
interface ICoinWithLogoProps {
  imageSrc: string;
  altText: string;
  title: string;
}
defineProps<ICoinWithLogoProps>();
</script>
