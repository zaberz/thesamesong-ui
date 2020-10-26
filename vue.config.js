module.exports = {
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/api": {
        // target: "http://127.0.0.1:8889",
        target: "http://www.alang.run:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        },
        ws: true
      }
    }
  }
};
