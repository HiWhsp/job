const path = require("path");

module.exports = {
	publicPath: process.env.NODE_ENV !== "production" ? "/" : "/dist_pc", //本地开发用
	outputDir: "dist_pc",
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
			name: "后台管理端",
			resolve: {
				extensions: [".js", ".vue", ".json"],
				alias: {
					"@": path.resolve(__dirname, "./src"),
					"@imgs": path.resolve(__dirname, "./src/assets/imgs"),
					vue$: "vue/dist/vue.esm.js",
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
			plugins: [],
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
				target: 'https://vuesc.new.zhishangez.com',
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
			patterns: [
				path.resolve(__dirname, "./src/config/style/variable_unit.less"),
				path.resolve(__dirname, "./src/config/style/variable_base.less"),
				path.resolve(__dirname, "./src/config/style/variable_display.less"),
				path.resolve(__dirname, "./src/config/style/variable_box.less")
			]
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
			.options({
				name: "img/[name].[hash:8].[ext]",
				limit: 1
			});
	},
};