<!-- TODO: UDPATE README -->

# Everlution Create React App

Fork of an official [Create React App](https://github.com/facebook/create-react-app)!

## Quick start

```sh
npm -g --registry https://npm.everlution.sk install @everlutionsk/create-react-app && everlutionsk-create-react-app my-app --typescript
```

## What’s Included in this fork?

- Monorepo support
- Improved [styled-components](https://github.com/styled-components/babel-plugin-styled-components) support
- [React hot loader](https://github.com/gaearon/react-hot-loader)
- [Optimized AntD styles](https://ant.design/docs/react/use-with-create-react-app#Use-babel-plugin-import)
- [Safe environment loader](https://github.com/deftomat/safe-environment-loader) for `environment.ts` files.
- [Bundle analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) - usage: `yarn build --analyze-bundle`
- support for `html.config.js` - usage: see below
- Randomized `BUILD_ID` env variable

## 🔥🔥🔥 Hot reload 🔥🔥🔥

To enable full hot-reload experience, the `@hot-loader/react-dom` must be installed as a dev dependency.

## Internet Destroyer support

Babel is already trying to include all necessary polyfills for the not dead browsers.
However, to support IE, you need to include additional polyfills as described [here](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill).

## HTML template parameters

In order to dynamically inject parameters to `index.html` template you can create `html.config.js` in the root of your React Application. This file should export async function which will return an object where keys are names of used parameters and values are string values to be rendered as HTML code.

Example:

```
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <%= csp %>
    <!-- ... -->
  </head>

  <body>
    <!-- ... -->
  </body>
</html>
```

```
<!-- html.config.js -->

module.exports = async function({ args: { stage } }) {
  stage = stage || 'dev';
  const isProd = stage === 'prod';

  const imgSrc = isProd ? 'https://cdn.example.com' : `https://cdn-${stage}.example.com`

  return {
    csp: `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' ${imgSrc}">`
  };
};

```

Above example will render different CSP meta tag based on provided stage.
