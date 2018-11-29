# Everlution Create React App

Fork of an official [Create React App](https://github.com/facebook/create-react-app)!

## Create React application

```sh
npm -g --registry https://npm.everlution.sk install @everlutionsk/create-react-app && everlutionsk-create-react-app my-app --typescript
```

## What’s Included in this fork?

- Monorepo support
- Improved TypeScript support
- TSLint support
- Improved [styled-components](https://github.com/styled-components/babel-plugin-styled-components) support
- [React hot loader](https://github.com/gaearon/react-hot-loader)
- [Optimized AntD styles](https://ant.design/docs/react/use-with-create-react-app#Use-babel-plugin-import)
- [Safe environment loader](https://github.com/deftomat/safe-environment-loader) for `environment.ts` files.
- [Bundle analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) - usage: `ANALYZE_BUNDLE=true yarn build`
- [Babel polyfills](https://babeljs.io/docs/en/babel-polyfill) based on usage (`useBuiltIns: 'usage'`)
- Randomized `BUILD_ID` env variable
