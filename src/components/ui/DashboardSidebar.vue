<template>
  <client-only>
    <!-- expand-on-hover can be a computed to disable on mobile resolutions -->
    <v-navigation-drawer
      class="dashboardSidebar overflow-auto"
      expand-on-hover
      permanent
      rail
      color="teal-dark"
    >
      <v-container class="d-flex h-100 flex-column dashboardSidebarContent">
        <v-list>
          <!-- TODO for a better experience we could base64 or icon the logo here so it loads instantly with the sidebar -->
          <v-list-item class="cryptoDashboardLogo">
            <NuxtLink
              to="/"
              :active="false"
              class="d-flex align-center ga-6"
            >
              <img
                src="/logo.png"
                alt="Logo"
              >
              <span>{{ $t('dashboardSidebar.logoTitle') }}</span>
            </NuxtLink>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list class="dynamicLinksContent">
          <v-list-item
            v-for="link in links"
            :key="link.link"
            :prepend-icon="link.icon"
            :to="link.link"
            :title="link.title"
          />
        </v-list>
        <v-divider />
        <v-list class="flex-grow-1">
          <v-list-item
            :prepend-icon="coinStore.isCoinArrLoading ? 'mdi-loading mdi-spin' : 'mdi-refresh'"
            :active="false"
            @click.prevent="coinStore.fetchCoinList()"
          >
            <span
              v-if="!coinStore.isCoinArrLoading"
              class="text-no-wrap"
            >{{ $t('dashboardSidebar.refresh') }}</span>
          </v-list-item>
          <v-list-item
            :prepend-icon="theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
            @click.prevent.stop="toggleTheme"
          >
            <div
              class="d-flex align-center ga-2"
              tabindex="-1"
            >
              <span>{{ theme.global.current.value.dark ? $t('dashboardSidebar.darkMode') : $t('dashboardSidebar.lightMode') }}</span>
              <v-switch
                :model-value="theme.global.current.value.dark"
                color="black"
                hide-details
                density="compact"
                inset
                tabindex="-1"
                @click.prevent.stop="toggleTheme"
              />
            </div>
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item
            prepend-icon="mdi-logout"
            to="/logout"
            :title="t('dashboardSidebar.logout')"
          />
        </v-list>
      </v-container>
    </v-navigation-drawer>
  </client-only>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';
import { useCoinStore } from '@/stores/CoinStore';

interface ILink {
  title: string;
  icon: string;
  link: string;
}

const { t } = useI18n();
const theme = useTheme();

const toggleTheme = () => {
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark';
  theme.change(newTheme);
  localStorage.setItem('theme', newTheme);
};

const coinStore = useCoinStore();

const links: ILink[] = [
  {
    title: t('dashboardSidebar.dashboard'),
    icon: 'mdi-view-dashboard',
    link: '/dashboard',
  },
  {
    title: t('dashboardSidebar.portfolio'),
    icon: 'mdi-chart-timeline-variant',
    link: '/portfolio',
  },
  {
    title: t('dashboardSidebar.manage'),
    icon: 'mdi-monitor-dashboard',
    link: '/portfolio/manage',
  },
  {
    title: t('dashboardSidebar.add'),
    icon: 'mdi-plus',
    link: '/portfolio/add',
  },
  /*
  // not implemented due to lack of time
  // would have hosted such features as resetting localStorage, adding mocked portfolio etc
  {
    title: t('dashboardSidebar.settings'),
    icon: 'mdi-cog',
    link: '/settings',
  },
  */
];
</script>

<style lang="scss">
@use "@imports/colors.module";
</style>
