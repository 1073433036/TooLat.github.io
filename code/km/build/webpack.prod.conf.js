const path              = require('path');
const webpack           = require('webpack');
const config            = require('../config');
const merge             = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
// const QiniuPlugin       = require('qiniu-webpack-plugin');

const {
  SRC_PATH,
  DIST_PATH,
  ASSETS_DIR
}                       = require('../config/conf');

const webpackConfig = merge(baseWebpackConfig, {

  // module: {
  //   rules: utils.styleLoaders({
  //     sourceMap: config.build.productionSourceMap,
  //     extract: true
  //   })
  // },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    publicPath: 'https://cdn.kamengjinfu.com/',
    path: config.build.assetsRoot,
    filename: path.posix.join(`${ASSETS_DIR}/js/[name].[chunkhash:8].js`),
    chunkFilename: path.posix.join(`${ASSETS_DIR}/js/[id].[chunkhash:8].js`)
  },
  plugins: [
    // 七牛cdn
    // new QiniuPlugin({
    //   ACCESS_KEY: '9EuTD5Pbt_5hWLDdlilsFGxOw_FOEC-uaIMgIcrR',
    //   SECRET_KEY: 'TfC5P4QwMP1zUVSpBr1Yb5_6bhWVHrvyn-C9IEbg',
    //   bucket: 'cdnkameng',
    //   path: '[hash]'
    // }),

    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: path.posix.join(`${ASSETS_DIR}/[name].[contenthash:8].css`),
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        );
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),

    /**
     * 复制assets文件
     */
    new CopyWebpackPlugin([
      {
        from    : `${SRC_PATH}/assets/*`,
        to      : `${DIST_PATH}/assets/[name].[ext]`,
        flatten : true,
      }
    ], {
      copyUnmodified: true,
    }),

    /**
     * 复制emoji文件
     */
    new CopyWebpackPlugin([
      {
        from    : `${SRC_PATH}/assets/emoji/**/*`,
        to      : `${DIST_PATH}/assets/emoji/[name].[ext]`,
        flatten : true,
      }
    ], {
      copyUnmodified: true,
    }),

    /**
     * 复制assets下audio文件夹
     */
    new CopyWebpackPlugin([
      {
        from    : `${SRC_PATH}/assets/audio/**/*`,
        to      : `${DIST_PATH}/assets/audio/[name].[ext]`,
        flatten : true,
      }
    ], {
      copyUnmodified: true,
    }),

    /**
     * 复制assets下messageAudio文件夹
     */
    new CopyWebpackPlugin([
      {
        from    : `${SRC_PATH}/assets/messageAudio/**/*`,
        to      : `${DIST_PATH}/assets/messageAudio/[name].[ext]`,
        flatten : true,
      }
    ], {
      copyUnmodified: true,
    }),

     /**
     * 复制assets下loan文件夹crk
     */
    new CopyWebpackPlugin([
      {
        from    : `${SRC_PATH}/assets/loan/crk/**/*`,
        to      : `${DIST_PATH}/assets/loan/crk/[name].[ext]`,
        flatten : true,
      }
    ], {
      copyUnmodified: true,
    }),

    /**
     * 复制assets下loan文件夹nwd
     */
    new CopyWebpackPlugin([
      {
        from    : `${SRC_PATH}/assets/loan/nwd/**/*`,
        to      : `${DIST_PATH}/assets/loan/nwd/[name].[ext]`,
        flatten : true,
      }
    ], {
      copyUnmodified: true,
    }),

    /**
     * 复制assets下loan文件夹rxf
     */
    new CopyWebpackPlugin([
      {
        from    : `${SRC_PATH}/assets/loan/rxf/**/*`,
        to      : `${DIST_PATH}/assets/loan/rxf/[name].[ext]`,
        flatten : true,
      }
    ], {
      copyUnmodified: true,
    }),

    /**
     * 复制assets images文件夹
     */
    new CopyWebpackPlugin([
      {
        from    : `${SRC_PATH}/assets/images/**/*`,
        to      : `${DIST_PATH}/assets/images/[name].[hash:8].[ext]`,
        flatten : true,
      }
    ], {
      copyUnmodified: true,
    }),
  ]
});

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
