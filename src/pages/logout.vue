<template>
  <div class="d-flex flex-column align-center justify-center ga-4">
    <h3>Logging out...</h3>

    <div>
      It is safe to close this tab, all data has been erased.
    </div>

    <v-btn
      to="/"
      @click.prevent.stop="goBack"
    >
      Go back to home
    </v-btn>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'unauthenticated',
});
window?.localStorage.clear();
function goBack() {
  window.location.href = '/CryptoDashboard';
}
</script>
