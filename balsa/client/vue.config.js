// eslint-disable-next-line @typescript-eslint/no-var-requires
const DartSass = require('dart-sass');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SvgStore = require('webpack-svgstore-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const process = require('process');

const MODE = process.env.NODE_ENV;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
const SERVER_PORT = process.env.SERVER_PORT;
const IS_SECURE = process.env.SSL;
const HTML_SCHEMA = IS_SECURE ? 'https' : 'http';
const SERVER_URL = `${HTML_SCHEMA}://${SERVER_DOMAIN}${SERVER_PORT === 80 ? '' : ':' + SERVER_PORT}`;

process.env.VUE_APP_MODE = MODE;
process.env.VUE_APP_SERVER_URL = SERVER_URL;
process.env.VUE_APP_IS_SECURE = IS_SECURE;

module.exports = {
  runtimeCompiler: true,
  css: {
    sourceMap: true,
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        data: `@import "~@/assets/sass/variables.scss";`,
        implementation: DartSass,
      },
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 3001,
    disableHostCheck: true,
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: true,
      analyzerMode: 'static',
    },
  },
  configureWebpack: {
    plugins: [
      new SvgStore({
        prefix: 'icon--',
        svgoOptions: {
          plugins: [{ cleanupIDs: false }, { collapseGroups: false }, { removeTitle: true }],
        },
      }),
    ],
  },
  chainWebpack: config => {
    // remove vue-cli-service's progress output
    config.plugins.delete('progress');
    // optionally replace with another progress output plugin
    // `npm i -D simple-progress-webpack-plugin` to use
    config.plugin('simple-progress-webpack-plugin').use(require.resolve('simple-progress-webpack-plugin'), [
      {
        format: 'minimal', // options are minimal, compact, expanded, verbose
      },
    ]);
  },
};
