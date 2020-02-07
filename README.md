# Everlution Create React App

Fork of an official [Create React App](https://github.com/facebook/create-react-app)!

## Quick start

```sh
npm -g --registry https://npm.everlution.sk install @everlutionsk/create-react-app && everlutionsk-create-react-app my-app --typescript
```

If you've previously installed `create-react-app` globally via `npm install -g create-react-app`, we recommend you uninstall the package using `npm uninstall -g create-react-app` to ensure that npx always uses the latest version.

## What’s Included in this fork?

- Monorepo support
- Improved [styled-components](https://github.com/styled-components/babel-plugin-styled-components) support
- [React hot loader](https://github.com/gaearon/react-hot-loader)
- [Automatic per-component CSS import for AntD](https://ant.design/docs/react/use-with-create-react-app#Use-babel-plugin-import)
- [Optimize Material-UI imports to reduce bundle size in dev mode](https://material-ui.com/guides/minimizing-bundle-size/)
- [Optimize lodash imports to reduce bundle size in dev mode](https://github.com/lodash/babel-plugin-lodash)
- [Safe environment loader](https://github.com/deftomat/safe-environment-loader) for `environment.ts` files.
- [Bundle analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) - usage: `react-scripts build --analyze-bundle`
- Alias `lodash` to `lodash-es` if possible to reduce bundle size
- support for `project.config.js` - usage: see below
- customized ESLint rules
- Build ID available as `BUILD_ID` env variable and as `build-id` meta in `index.html`
- Support hot-reload for linked packages. See [`link-with`](https://github.com/deftomat/link-with) for more details.
- Disable inline-runtime-chunk by default in production
- Reduce default IMAGE_INLINE_SIZE_LIMIT to 3000 (from 10000)
- Simplified source maps: always use `cheap-module-source-map` and ignore source maps from `node_modules`
- build configuration support (see below)

## ⚙️ Project configuration support

Build process supports `project.config.js` as a source of ENV values, CSP configuration, etc.

The following code is supported:

```js
module.exports = {
  environmentValues: {
    STAGE: 'dev',
  },
  contentSecurityPolicy: {
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", 'data:'],
  },
  htmlParameters: {
    title: 'App title',
  },
};
```

**Config will allow you to:**

- access `process.env.STAGE` in any `environment.ts` file
- inject Content Security Policy into `index.html`
- use `<%= title %>` placeholder in `index.html`

For more info about `project.config.js`, please see [@everlutionsk/project-config](https://github.com/everlutionsk/packages/tree/master/packages/project-config).

## ⚙️ Build configuration support

Build process supports `cra.config.js` as a source of custom webpack plugins which will be used during compilation.

The following code is supported:

```js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function() {
  return {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['json', 'javascript', 'typescript'],
        features: ['!snippets'],
      }),
    ],
  };
};
```

## 🔥 Hot reload

To enable full hot-reload experience, the `@hot-loader/react-dom` must be installed as a dev dependency.

## 🚀 Performance tips

### Use `paths` in `tsconfig.base.json`

If you are using monorepo setup, then make sure that you have a correct `paths` setting in `tsconfig.base.json`.
Otherwise, TypeScript can suffer from performance issues in watch mode.

For example, for a namespace `@project`, you need to add the following:

```json
{
  "compilerOptions": {
    "paths": {
      "@project/*": ["packages/*"]
    }
  }
}
```

## Internet Destroyer support

Babel is already trying to include all necessary polyfills for the not dead browsers.
However, to support IE, you need to include additional polyfills.

We recommend to use [polyfill.io](https://polyfill.io/v3/url-builder/) with the `nomodule` attribute to ignore it in moder browsers.

**Example:**

```html
<!-- public/index.html -->

<head>
  <script
    nomodule
    crossorigin="anonymous"
    src="https://polyfill.io/v3/polyfill.min.js?features=fetch%2CArray.prototype.find%2CArray.prototype.findIndex%2CArray.prototype.includes%2CString.prototype.includes%2CObject.assign%2CObject.entries%2CSymbol"
  ></script>
</head>
```

This will load the necessary polyfills for IE11. However, every blocking dependency on an external service could be harmfull, so please **make sure you include `nomodule` attribute**, which will inform the modern browsers that they need to ignore it completelly.

A provided _polyfill.io_ link includes only the basic polyfills. To fully support IE11, you need to go trough the every page/functionality and check if there is no missing polyfill.
