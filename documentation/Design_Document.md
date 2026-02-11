# Senior Frontend Developer \- Home Assignment

## Crypto Portfolio Dashboard

**Position:** Senior Frontend Developer **Candidate:** Ihor Shamrai **Assignment Duration:** 24-48 hours **Submission:** GitHub Repository

---

## Overview

Build a **Crypto Portfolio Dashboard** \- a single-page application that allows users to track their cryptocurrency holdings, view real-time prices, and visualize portfolio performance.

This assignment is designed to evaluate your expertise in modern frontend development, specifically focusing on the skills highlighted in your CV: Vue 3/Nuxt, TypeScript, state management, data visualization, and API integration.

---

## Functional Requirements

### 1\. Portfolio Management

* Add cryptocurrencies to portfolio (select coin, enter quantity, purchase price)

* Edit existing holdings

* Remove holdings from portfolio

* Persist portfolio data in localStorage

### 2\. Real-Time Price Display

* Fetch current prices from a public API (suggested: CoinGecko free API)

* Display current price, 24h change (%), and 24h high/low for each holding

* Auto-refresh prices every 60 seconds (with manual refresh option)

* Show loading and error states appropriately

### 3\. Portfolio Summary

* Total portfolio value (current)

* Total investment (sum of purchase prices × quantities)

* Total profit/loss (absolute and percentage)

* Best and worst performing assets

### 4\. Data Visualization

* **Portfolio Allocation Chart** \- Pie/Donut chart showing distribution by asset

* **Performance Chart** \- Line chart showing portfolio value over time (mock historical data acceptable, or use API if available)

* Charts should be interactive (hover states, tooltips)

### 5\. Search & Filter

* Search/filter holdings by coin name or symbol

* Sort by: name, value, profit/loss, 24h change

### 6\. Responsive Design

* Desktop-first approach with tablet and mobile breakpoints

* Usable on screens from 375px to 1920px+

---

## Technical Requirements

### Stack (Required)

* **Framework:** Vue 3 with Composition API (Nuxt 3 optional but appreciated)

* **Language:** TypeScript (strict mode)

* **State Management:** Pinia

* **Styling:** SCSS with BEM or similar methodology

* **Build Tool:** Vite

### Stack (Recommended)

* **Charts:** Any library (D3.js, Chart.js, ApexCharts, or similar)

* **HTTP Client:** Axios or native fetch with proper typing

* **Testing:** Jest or Vitest (minimum 3-5 unit tests for critical logic)

### Code Quality Expectations

* Clean, readable, and well-organized code structure

* Proper TypeScript types/interfaces (avoid any)

* Component composition and reusability

* Error handling and edge cases

* Performance considerations (memoization, computed properties, etc.)

---

## API Reference

**CoinGecko API (Free, No Auth Required):**

* Base URL: https://api.coingecko.com/api/v3

* Get coin list: GET /coins/markets?vs\_currency=usd\&order=market\_cap\_desc\&per\_page=100

* Get specific coins: GET /simple/price?ids=bitcoin,ethereum\&vs\_currencies=usd\&include\_24hr\_change=true

Documentation: https://www.coingecko.com/en/api/documentation

*Note: Rate limits apply. Implement appropriate caching/throttling.*

---

## Deliverables

### GitHub Repository Must Include:

**1\. Source Code**

* Clean folder structure

* All source files properly organized

**2\. README.md with:**

* Project description

* Tech stack used

* Prerequisites (Node version, etc.)

* Installation instructions

* How to run development server

* How to run tests

* How to build for production

* Any known limitations or future improvements

**3\. Architecture Documentation (brief, can be in README):**

* Folder structure explanation

* State management approach

* Key architectural decisions and why

**4\. Tests**

* Unit tests for portfolio calculations (profit/loss, totals)

* At least one component test

---

## Evaluation Criteria

| Criteria           | Weight | Description                                                   |
|:-------------------|:-------|:--------------------------------------------------------------|
| **Code Quality**   | 25%    | Clean code, TypeScript usage, proper typing, no anti-patterns |
| **Functionality**  | 25%    | All requirements implemented and working correctly            |
| **Architecture**   | 20%    | Project structure, component design, state management         |
| **UI/UX**          | 15%    | Visual design, responsiveness, user experience, error states  |
| **Testing & Docs** | 10%    | Test coverage, documentation quality, setup instructions      |
| **Bonus Points**   | 5%     | Extra features, performance optimizations, creative solutions |

---

## Bonus Points (Optional)

* Dark/Light theme toggle

* Skeleton loaders for better perceived performance

* Animations/transitions

* PWA capabilities

* E2E tests (Cypress/Playwright)

* Storybook for components

* CI/CD pipeline configuration

* Accessibility (WCAG 2.1 AA)

* Internationalization setup

---

## Submission Instructions

1. Create a **public GitHub repository**

2. Commit history should reflect your development process (avoid single commit)

3. Deploy to any free hosting (Vercel, Netlify, GitHub Pages) \- *optional but appreciated*

4. Reply to this email with:

   * GitHub repository URL

   * Live demo URL (if deployed)

   * Any notes or comments about your implementation

---

## Notes

* Focus on quality over quantity \- it’s better to have fewer features implemented well than many features implemented poorly

* If time-constrained, prioritize: core functionality \> code quality \> testing \> bonus features

* Feel free to use any UI component library (Vuetify, PrimeVue, etc.) or build custom components

* Ask questions if requirements are unclear \- this is encouraged

---

## Questions?

If you have any questions about the requirements or need clarification, please don’t hesitate to reach out before starting the assignment.

---

**Good luck\! We look forward to reviewing your submission.**

