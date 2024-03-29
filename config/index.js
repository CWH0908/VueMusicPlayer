'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    proxyTable: {
      '/QQMusicAPI': {
        target: 'https://c.y.qq.com/', //访问QQ音乐地址
        changeOrigin: true,
        pathRewrite: {
          '^/QQMusicAPI': '/'
        }
      },
      '/KugouMusicAPI': {
        target: 'http://m.kugou.com/', //访问酷狗音乐地址
        changeOrigin: true,
        pathRewrite: {
          '^/KugouMusicAPI': '/'
        }
      },
      '/KugouMusicPlayAPI': {
        target: 'http://www.kugou.com/', //访问酷狗音乐播放地址
        changeOrigin: true,
        pathRewrite: {
          '^/KugouMusicPlayAPI': '/'
        }
      },
      '/KugouHotKeywordsAPI':{
        target:"http://mobilecdn.kugou.com/api/",//访问酷狗热门关键词
        changeOrigin: true,
        pathRewrite: {
          '^/KugouHotKeywordsAPI': '/'
        }
      },
      // '/BAPI':{
      //   target:"https://api.bilibili.com/x/web-show/",//访问B站轮播图
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/BAPI': '/'
      //   }
      // },
    },
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
