// const PrerenderSPAPlugin = require("prerender-spa-plugin"); // 引入插件
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const path = require("path");

module.exports = {
  // 部署应用包时的基本 URL,从 Vue CLI 3.3 起已弃用baseUrl
  // publicPath: process.env.NODE_ENV !== "production" ? "./" : '/',
  // publicPath: process.env.NODE_ENV !== "production" ? "/" : "/", //本地开发用
  publicPath: process.env.NODE_ENV !== "production" ? "/" : "/dist_pc", //本地开发用
  outputDir: "dist_pc",
  // assetsDir: "dist_pc_hemeixin",
  assetsDir: "",
  indexPath: "index.html",
  filenameHashing: true,
  lintOnSave: process.env.NODE_ENV !== "production",
  runtimeCompiler: false,
  transpileDependencies: [],
  productionSourceMap: false,
  crossorigin: undefined,
  integrity: false,

  configureWebpack: (config) => {
    return {
      name: "标准商城",
      resolve: {
        // 配置解析别名
        extensions: [".js", ".vue", ".json"],
        alias: {
          "@": path.resolve(__dirname, "./src"),
          "@img": path.resolve(__dirname, "./src/assets/img"),
          "@pro": path.resolve(__dirname, "./src/assets/pro"),
          "@ying": path.resolve(__dirname, "./src/assets/ying"),
          vue$: "vue/dist/vue.esm.js",
          api: path.resolve(__dirname, "../src/api"),
        },
      },
      optimization: {
        splitChunks: {
          chunks: "all",
        },
      },
      externals: {
        // 'echarts': 'echarts',
      },

      plugins: process.env.NODE_ENV !== "production" ? [] : [],
      // || [
      //     new PrerenderSPAPlugin({
      //       // 生成文件的路径，也可以与webpakc打包的一致。
      //       // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
      //       // staticDir: path.join(__dirname, "dist_jinsu_pc"),
      //       staticDir: path.join(__dirname, "dist_pc_beiyinlai"),
      //       // 对应自己的路由文件，比如about有参数，就需要写成 /about/param1。
      //       routes: [
      //         "/",
      //         // "/goodsDetail",
      //         // "/register",
      //         // "/login",
      //       ],

      //       server: {
      //         // 跨域请求
      //         proxy: {
      //           "/api": {
      //             target: "",
      //             secure: false,
      //             changeOrigin: true,
      //             pathRewrite: {
      //               "/api": "",
      //             },
      //           },
      //         },
      //       },

      //       // 必须配置不然不会进行预编译
      //       renderer: new Renderer({
      //         inject: {
      //           foo: "bar",
      //         },
      //         headless: false,
      //         renderAfterTime: 10000,
      //         captureAfterTime: 600000,
      //       }),
      //     }),
      //   ],
    };
  },

  devServer: {
    // host: 'localhost',
    disableHostCheck: true,
    port: 80,
    https: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      "/api": {
        target: 'https://lidong.dx.hdapp.com.cn',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },

  css: {},

  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/config/base.less")], // 引入全局样式变量
    },
  },

  chainWebpack: (config) => {
    //设置图片不转base64格式  图片少 且对图片质量要求高
    const imagesRule = config.module.rule("images");
    imagesRule.uses.clear(); //清除原本的images loader配置
    imagesRule
      .test(/\.(jpg|gif|png|svg)$/)
      .exclude.add(path.join(__dirname, "../node_modules")) //去除node_modules里的图片转base64配置
      .end()
      .use("url-loader")
      .loader("url-loader")
      .options({ name: "img/[name].[hash:8].[ext]", limit: 1 });
  },
};
