// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import colors from '@imports/_colors.module.scss';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: {
          dark: false,
          colors: {
            'on-background': colors['blue-dark'],
            'green': colors.green,
            'gray-white': colors['gray-white'],
            'gray-light': colors['gray-light'],
            'gray': colors.gray,
            'gray-dark': colors['gray-dark'],
            'yellow-dark': colors['yellow-dark'],
            'yellow': colors.yellow,
            'gold': colors.gold,
            'red-light': colors['red-light'],
            'red-dark': colors['red-dark'],
            'blue-dark': colors['blue-dark'],
            'blue-light': colors['blue-light'],
            'blue': colors.blue,
            'background': colors['gray-white'],
          },
        },
        dark: {
          dark: true,
          colors: {
            'on-background': colors.white,
            'green': colors.green,
            'gray-white': colors['gray-white'],
            'gray-light': colors['gray-light'],
            'gray': colors.gray,
            'gray-dark': colors['gray-dark'],
            'yellow-dark': colors['yellow-dark'],
            'yellow': colors.yellow,
            'gold': colors.gold,
            'red-light': colors['red-light'],
            'red-dark': colors['red-dark'],
            'blue-dark': colors['blue-dark'],
            'blue-light': colors['blue-light'],
            'blue': colors.blue,
            'background': colors.bgColor,
          },
        },
      },
    },
  });
  app.vueApp.use(vuetify);
});
