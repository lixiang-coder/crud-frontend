const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 7000,
    client: {
      overlay: false    //避免 Uncaught runtime errors:
    },
    proxy: {
      '/api': { // 获取路径中包含的/api请求
        target: 'http://localhost:8080', //后台服务器所在的源
        changeOrigin: true,  //修改源
        pathRewrite: { '^/api': '' }
      }
    }
  },
})
