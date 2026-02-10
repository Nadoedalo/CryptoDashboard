// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import { createResolver } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);
// noinspection JSUnusedGlobalSymbols
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxt/test-utils/module',
    '@pinia/nuxt',
  ],
  devtools: { enabled: true },
  srcDir: 'src/',
  alias: {
    '@': resolve('./src'),
    '@styles': resolve('./src/assets/design/styles'),
    '@imports': resolve('./src/assets/design/styles/components/imports'),
    '@stores': resolve('./src/stores'),
    '@types': resolve('./src/stores/sharedTypes'),
  },
  build: {
    transpile: ['vuetify'],
  },
  compatibilityDate: '2026-02-07',
  vite: {
    plugins: [
      // @ts-expect-error vuetify doesn't seem to support a proper configuration & this is in the official docs
      vuetify({
        autoImport: true,
        styles: {
          configFile: './assets/design/styles/vuetifyTheme.scss',
        },
      }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  i18n: {
    defaultLocale: 'en',
    defaultDirection: 'ltr',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.js' },
    ],
    langDir: '../src/lang/',
  },
  pinia: {
    storesDirs: ['./src/stores/**'], // Scans all subdirectories
  },
});
