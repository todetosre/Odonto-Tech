# Odonto-Tech

This template should help get you started developing with Vue 3 in Vite.

## Instalações necessárias

//Geral
- npm install vite chart.js axios cors jspdf - npm install cypress --save-dev -> npx cypress open

//Backend
- npm install express pg dotenv bcrypt jsonwebtoken

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```
