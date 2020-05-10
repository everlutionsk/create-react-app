// @ts-check

const { createConfigFinder } = require('@everlutionsk/project-config');
const { generateBuildId } = require('@everlutionsk/helpers-tools');
const minimist = require('minimist');
const path = require('path');
const paths = require('./paths');

module.exports = async function customConfig({
  isEnvDevelopment,
  isEnvProduction,
}) {
  const args = minimist(process.argv.slice(2));
  const analyzeBundle = args['analyze-bundle'] || false;
  const findProjectConfig = createConfigFinder({ cwd: paths.appPath });
  const buildId = generateBuildId();
  const craConfig = resolveCraConfig({ isEnvDevelopment, isEnvProduction });

  const shouldInlineRuntimeChunk =
    process.env.INLINE_RUNTIME_CHUNK === 'true' ||
    (process.env.INLINE_RUNTIME_CHUNK == null && isEnvDevelopment);

  const styledComponentsPlugin = [
    require.resolve('babel-plugin-styled-components'),
    {
      pure: isEnvProduction,
      displayName: isEnvDevelopment,
      minify: isEnvProduction,
      ssr: false,
      transpileTemplateLiterals: true,
    },
  ];

  const appBabelPlugins = [
    require.resolve('react-hot-loader/babel'),
    require.resolve('babel-plugin-lodash'),
    // We are using `babel-plugin-import` to change imports like
    // `import { Button } from 'antd'` into `import Button from `antd/es/Button`.
    // Webpack already supports the tree-shaking for a production builds but
    // development builds can be quite massive as Webpack will include the whole
    // library. This could increase the memory usage and parse time for build tool
    // and also for browser itself. To avoid this issue, we need to reduce
    // the imported code for a large UI libraries like ANTD and Material-UI.
    [
      // Optimize ANTD imports for dev builds & automatic per-component CSS import
      require.resolve('babel-plugin-import'),
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
      'antd',
    ],
    [
      // Optimize MATERIAL-UI imports for dev builds
      require.resolve('babel-plugin-import'),
      {
        libraryName: '@material-ui/core',
        libraryDirectory: 'esm',
        camel2DashComponentName: false,
      },
      'materialui-core',
    ],
    [
      // Optimize MATERIAL-UI ICON imports for dev builds
      require.resolve('babel-plugin-import'),
      {
        libraryName: '@material-ui/icons',
        libraryDirectory: 'esm',
        camel2DashComponentName: false,
      },
      'materialui-icons',
    ],
    styledComponentsPlugin,
  ];

  const dependencyBabelPlugins = [styledComponentsPlugin];

  const safeEnvironmentLoader = {
    enforce: 'post',
    test: /environment\.(js|jsx|ts|tsx)/,
    loader: require.resolve('safe-environment-loader'),
    options: {
      envResolver: async () => {
        const config = await findProjectConfig();
        if (config == null) return { values: { BUILD_ID: buildId } };

        try {
          const value = await config.resolve();
          return {
            values: { ...value.environmentValues, BUILD_ID: buildId },
            files: config.files,
          };
        } catch (error) {
          return { error, files: config.files };
        }
      },
    },
  };

  const moduleAliases = {
    lodash: moduleExists('lodash-es') ? 'lodash-es' : 'lodash',
  };

  const additionalPlugins = [
    analyzeBundle &&
      new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)(),
    ...craConfig.plugins,
  ].filter(Boolean);

  return {
    shouldInlineRuntimeChunk,
    appBabelPlugins,
    dependencyBabelPlugins,
    safeEnvironmentLoader,
    htmlWebpackPluginOptions: await generateHtmlWebpackPluginOptions({
      buildId,
      findProjectConfig,
    }),
    moduleAliases,
    additionalPlugins,
  };
};

function resolveCraConfig(resolverParams) {
  try {
    const resolver = require(path.resolve(paths.appPath, 'cra.config.js'));
    return resolver(resolverParams);
  } catch (e) {
    return { plugins: [] };
  }
}

async function generateHtmlWebpackPluginOptions({
  buildId,
  findProjectConfig,
}) {
  const params = {
    templateParameters: {},
    meta: { 'build-id': buildId },
  };

  const config = await findProjectConfig();
  if (config == null) return params;

  const { contentSecurityPolicy, htmlParameters = {} } = await config.resolve();

  params.templateParameters = {
    ...params.templateParameters,
    ...htmlParameters,
  };

  if (contentSecurityPolicy != null) {
    const content = stringifyCSP(contentSecurityPolicy);
    if (content !== '') {
      params.meta['Content-Security-Policy'] = {
        'http-equiv': 'Content-Security-Policy',
        content,
      };
    }
  }

  return params;
}

function stringifyCSP(csp) {
  const join = strings => strings.filter(i => i != null).join(' ');
  const toKebabCase = string =>
    string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

  if (typeof csp === 'string') return csp;
  return Object.entries(csp)
    .map(([key, value]) => `${toKebabCase(key)} ${join(value)}`)
    .join(';');
}

function moduleExists(name) {
  try {
    return require.resolve(name);
  } catch (e) {
    return false;
  }
}
