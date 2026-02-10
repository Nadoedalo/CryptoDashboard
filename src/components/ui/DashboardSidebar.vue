<template>
  <!-- expand-on-hover can be a computed to disable on mobile resolutions -->
  <client-only>
    <v-navigation-drawer
      class="dashboardSidebar overflow-auto"
      expand-on-hover
      permanent
      rail
      color="primary"
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
              <span>Crypto Dashboard</span>
            </NuxtLink>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list class="flex-grow-1 dynamicLinksContent">
          <v-list-item
            v-for="link in links"
            :key="link.link"
            :prepend-icon="link.icon"
            :to="link.link"
            :title="link.title"
          />
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

interface ILink {
  title: string;
  icon: string;
  link: string;
}

const { t } = useI18n();

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
    title: t('dashboardSidebar.add'),
    icon: 'mdi-plus',
    link: '/portfolio/add',
  },
  {
    title: t('dashboardSidebar.edit'),
    icon: 'mdi-pencil',
    link: '/portfolio/edit',
  },
  {
    title: t('dashboardSidebar.settings'),
    icon: 'mdi-cog',
    link: '/settings',
  },
];
</script>

<style lang="scss">
@use "@imports/colors.module";
</style>
