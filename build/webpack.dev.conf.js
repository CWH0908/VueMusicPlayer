'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

//引入axios
const axios = require('../node_modules/axios')

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
      }, ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    //配置跨域请求伪造referer
    before(apiRoutes) {
      //歌单列表
      apiRoutes.get('/QQMusicAPI/songList', function (req, res) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((respond) => {
          // 将数据返回给前端
          res.json(respond.data)
        }).catch((e) => {
          console.log(e)
        })
      })

      //歌手列表
      apiRoutes.get('/QQMusicAPI/singerList', function (req, res) {
        var url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
        axios.get(url, {
          params: req.query
        }).then((respond) => {
          // 将数据返回给前端
          res.json(respond.data)
        }).catch((e) => {
          // console.log(e) ;//304报错，屏蔽
        })
      })

      // 歌曲列表
      apiRoutes.get('/QQMusicAPI/singerDetail', function (req, res) {
        var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
        axios.get(url, {
          params: req.query
        }).then((respond) => {
          // 将数据返回给前端
          res.json(respond.data)
        }).catch((e) => {
          console.log(e)
        })
      })

      //请求歌曲
      apiRoutes.get('/QQMusicAPI/getSongVkey', function (req, res) {
        var url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
        axios.get(url, {
          headers: {
            origin: 'https://y.qq.com/',
            referer: 'https://y.qq.com/portal/player.html'
          },
          params: req.query
        }).then((respond) => {
          // 将数据返回给前端
          res.json(respond.data)
        }).catch((e) => {
          console.log(e)
        })
      })

      //酷狗音乐请求歌曲详情
      apiRoutes.get('/kugouMusicAPI/getSongInfo', function (req, res) {
        var url = 'http://www.kugou.com/yy/index.php?r=play/getdata'
        axios.get(url, {
          headers: {
            Cookie: "kg_mid=bbbd01eb4d89517f78a82335ab0aec58; kg_dfid=2B054t0bTXp10XkJEz1QDSOQ; kg_dfid_collect=d41d8cd98f00b204e9800998ecf8427e; Hm_lvt_aedee6983d4cfc62f509129360d6bb3d=1572510353,1572868917,1572868957,1572869876"
          },
          params: req.query
        }).then((respond) => {
          // 将数据返回给前端
          res.json(respond.data)
        }).catch((e) => {
          console.log(e)
        })
      })

      //请求B站轮播图
      apiRoutes.get('/BAPI/getBSlider', function (req, res) {
        var url = 'https://api.bilibili.com/x/web-show/res/loc?pf=7&id=1695'
        axios.get(url, {
          params: req.query
        }).then((respond) => {
          // 将数据返回给前端
          res.json(respond.data)
        }).catch((e) => {
          console.log(e)
        })
      })


    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }])
  ],
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors ?
          utils.createNotifierCallback() : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
