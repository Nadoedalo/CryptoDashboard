# Project description
This is a Crypto Dashboard that provides cryptocurrency market data and analysis. It allows users to track their portfolio value and gain insights into market trends.

It also serves as a showcase for my Nuxt 4 skills.

# Tech stack used
- [Nuxt 4](https://nuxt.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vuetify](https://vuetifyjs.com/)
- [Vite](https://vitejs.dev/)
- [Vitest & Nuxt Test Utils](https://nuxt.com/docs/test-utils)
- [ESLint & Stylistic](https://eslint.org/)
- [SCSS](https://sass-lang.com/)
- [i18n](https://nuxt.com/modules/i18n)

# Prerequisites
- Node.js ^24.13.0
- yarn ^1.22.22 (optional but recommended)

# Installation
- Clone the repository
- Run `yarn install`
- Create `.env` file and add your [CoinGecko Demo API key](https://www.coingecko.com/en/api/pricing) to VITE_COINGECKO_API_KEY variable

# Running the development server
- Run `yarn run dev` or simply `yarn dev`
- Access the app at http://localhost:3000
- Use the Vue dev tools or the Nuxt dev tools to inspect the app thoroughly, although the standard Dev Console is also fine

# Running the test and linting
- Run `yarn test` to run the tests
- Run `yarn run lint` or simply `yarn lint` to run the linting, optionally with `--fix` argument to automatically fix any issues
  - For convenience enable "run eslint --fix on save" in your editor's settings

# Build and deployment for production
- Run `yarn build` to build the app for production
- Run `yarn run preview` or simply `yarn preview` to preview the production build locally
- Access the app at http://localhost:3000
  - Verify that the app works as expected
- Run `yarn run generate` or simply `yarn generate` to generate a static version of the app in the `dist/` folder
  - TODO: Deploy the contents of the `dist/` folder to the production

# Architecture overview
- TODO

# Any known limitations or future improvements
- ESLint is of version 9 because version 10 just released a couple of days ago, other packages need to be updated before we use latest
- I don't like warnings and deprecated packages used as a peer dependency, hence I've overwritten some to the proper version