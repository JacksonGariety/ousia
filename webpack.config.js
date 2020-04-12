const child_process = require('child_process');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function () {
  const isEnvDevelopment = process.env.NODE_ENV === 'development';
  const isEnvProduction = process.env.NODE_ENV === 'production';
  const publicPath = path.resolve(__dirname, 'public');
  const buildPath = path.resolve(__dirname, 'build');
  const port = parseInt(process.env.PORT, 10) | 3000;
  const host = process.env.HOST || '0.0.0.0';

  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    bail: isEnvProduction,
    // devTool: isEnvProduction ? 'source-map' : 'cheap-module-source-map',
    entry: path.resolve(__dirname, 'src', 'Main.purs'),
    devServer: {
      disableHostCheck: true,
      compress: true,
      // contentBase: '/',
      watchContentBase: true,
      hot: false,
      // publicPath: path.resolve(__dirname, '/'),
      port: 3000,
      host: host,
      stats: 'errors-only',
      overlay: false,
      historyApiFallback: {
        // Paths with dots should still use the history fallback.
        // See https://github.com/facebook/create-react-app/issues/387.
        disableDotRule: true,
      },
    },
    output: {
      path: isEnvProduction ? buildPath : undefined,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/bundle.js',
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',
      // publicPath: publicPath,
      globalObject: 'this'
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          // Added for profiling in devtools
          // keep_classnames: isEnvProductionProfile,
          // keep_fnames: isEnvProductionProfile,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      }),
    ]
    },
    // splitChunks: {
    //   chunks: 'all',
    //   name: false
    // },
    // runtimeChunk: {
    //   name: entrypoint => `runtime-${entrypoint.name}`
    // },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.purs', '.js']
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.purs$/,
          loader: 'purs-loader',
          exclude: /node_modules/,
          query: {
            psc: 'psa',
            warnings: true,
            bundle: isEnvProduction,
            spago: true,
            src: [
              path.join('src', '**', '*.purs'),
            ]
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: path.resolve(publicPath, 'index.html'),
          },
          isEnvProduction
            ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined
        )
      ),
      {
        apply: compiler => {
          compiler.hooks.done.tap('notify', results => {
            if (!(results.hasErrors())) {
              child_process.exec('mpg123 ~/.sounds/open-up.mp3');
              child_process.exec('notify-send "Compiled outsia"');
            }
          });
        }
      }
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
};
