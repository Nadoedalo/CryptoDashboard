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
            'surface': colors['teal'],
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
            'primary': colors['blue-light'],
            'secondary': colors['gray-light'],
            'tertiary': colors['gray-dark'],
            'success': colors.green,
            'error': colors.red,
            'warning': colors.yellow,
            'teal': colors.teal,
            'teal-light': colors['teal-light'],
            'teal-dark': colors['teal-dark'],
          },
        },
        dark: {
          dark: true,
          colors: {
            'surface': colors['blue-light'],
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
            'primary': colors.white,
            'secondary': colors['gray-light'],
            'tertiary': colors['gray-dark'],
            'success': colors.green,
            'error': colors.red,
            'warning': colors.yellow,
            'teal': colors.teal,
            'teal-light': colors['teal-light'],
            'teal-dark': colors['teal-dark'],
          },
        },
      },
    },

  });
  app.vueApp.use(vuetify);
});
