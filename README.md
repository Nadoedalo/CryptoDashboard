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
Overall, the architecture of the project is fairly standard to a Nuxt 4 application.

All the initial information about the project is available in the [Design Doc.md](./documentation/Design_Document.md);
As for the `Application` aka `src/` folder structure, it goes as follows:
- `components/` - contains all the Vue components used throughout the app, notably:
- - `ui/` - global UI components like sidebars and notifications
- - `shared/` - abstract components that implement common logic
- - All other components implement features for a specific module
- `config` - contains the main configuration for the app
- - <strong>Needs `COINGECKO_API_KEY` to be filled, otherwise the app won't work</strong>
- `lang/` contains the translations, currently only English is supported
- `utils/` - contains helper functions, in particular a fetchHelper that wraps the native fetch API

In terms of coupling, the UI is loosely coupled to the data layer through the use of Pinia to gather the data flow in one module, increase performance and maintainability.
Main entities that play a role are the `portfolio` and `coin` modules.
- `coin` module provides raw data about the top 250 coins from the CoinGecko API and auto-updates it every minute
- `portfolio` module aggregates the data from the `coin` module and provides the portfolio management capabilities


# Any known limitations or future improvements
- "cold" start could result in an error and just needs a refresh, seems to be a quirk of SSR in Nuxt 4
- ESLint is of version 9 because version 10 just released a couple of days ago, other packages need to be updated before we use latest
- I don't like warnings and deprecated packages used as a peer dependency, hence I've overwritten some to the proper version
- There are some warnings due to SSR mismatches, at components install due to amCharts 5 using outdated / deprecated libraries and in tests – those are minor but are annoying
- The app only nominally has responsiveness
- The "light" theme color schema honestly could use some work
- App is responsive but doesn't have state-of-the-art transitions to tablet / mobile