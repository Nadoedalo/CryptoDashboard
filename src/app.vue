<template>
  <v-app>
    <Head>
      <Title>{{ $t('app.title') }}</Title>
      <Meta charset="utf-8" />
      <Meta
        content="IE=edge"
        http-equiv="x-ua-compatible"
      />
      <Meta
        content="width=device-width,initial-scale=1.0"
        name="viewport"
      />
      <link
        href="/favicon.png"
        rel="icon"
        type="image/png"
      >
    </Head>
    <NuxtLayout class="w-100 h-100">
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script lang="ts" setup>
import { useLocaleHead } from '#imports';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';

const { t, locale } = useI18n();
const theme = useTheme();

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && savedTheme !== theme.global.name.value) {
    theme.change(savedTheme);
  }
});

const localeHead = useLocaleHead({
  dir: true,
  lang: true,
  seo: true,
});

useHead(() => ({
  title: t('app.title'),
  htmlAttrs: {
    lang: localeHead.value.htmlAttrs?.lang || locale.value || 'en',
    dir: (localeHead.value.htmlAttrs?.dir as 'ltr' | 'rtl' | 'auto') || 'ltr',
  },
  meta: [
    ...(localeHead.value.meta || []),
    { name: 'description', content: t('app.description') },
    { name: 'keywords', content: t('app.keywords') },
  ],
  link: [
    ...(localeHead.value.link || []),
  ],
}));
</script>

<style lang="scss">
@use "@styles/main";
</style>
