const path = require("path");
var apiServe = require('./src/request/apiServe');

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devtool: 'source-map'
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/global.less")]
    }
  },
  // 移除map文件
  productionSourceMap: false,

  devServer: {
    port:8000, 
    open:true,
    proxy: {
      '/dev': {
        target: apiServe.devServe , //目标地址
        ws: false, //// 是否启用websockets
        changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/dev': ''  //这里重写路径
        } 
      }
    }
  }
}