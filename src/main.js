import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";


import company_select from '@/components/company/company_select.vue'
Vue.component('company_select', company_select)
import product_category_select from '@/components/product/product_category_select.vue'
Vue.component('product_category_select', product_category_select)
import product_tag_select from '@/components/product/product_tag_select.vue'
Vue.component('product_tag_select', product_tag_select)


// console.warn("本项目菜单路由",window.admin_config);
//表格展示与筛选
// 富文本编辑器
// import CKEditor from "@ckeditor/ckeditor5-vue2";
// Vue.use(CKEditor);
// 富文本编辑器 开始
// import tinymce from "tinymce";
// import VueTinymce from "@packy-tang/vue-tinymce";
// Vue.prototype.$tinymce = tinymce; // 将全局tinymce对象指向给Vue作用域下
// Vue.use(VueTinymce); // 安装vue的tinymce组件
// 富文本编辑器 结束

import "@/config/style/css-reset.css"; // css reset

import ElementUI from "element-ui";
import {
	Loading
} from "element-ui";
import {
	Message
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// Vue.use(ElementUI, { size: "mini" });
Vue.use(ElementUI, {
	size: "small"
});

import * as dayjs from "dayjs";
Vue.prototype.$dayjs = dayjs; //

//axios
import request from "@/plugins/request.js";
Vue.prototype.$api = request.api;
Vue.prototype.$apiDownload = request.apiDownload;
Vue.prototype.$apiUploadFile = request.apiUploadFile;
Vue.prototype.$apiUploadFileBatch = request.apiUploadFileBatch;
Vue.prototype.$apiUploadFileReport = request.apiUploadFileReport;
//
Vue.prototype.$apiUploadImage = request.apiUploadImage;
Vue.prototype.$apiUploadVideo = request.apiUploadVideo;


import log from "@/plugins/log.js";
Vue.prototype.$logjson = log.logjson;
Vue.prototype.$log = log.logjson;

import "@/plugins/message.js"; 



// 混入
import _mixin from "@/mixins/index.js";
Vue.mixin(_mixin);

Vue.prototype.$load = {
	loading: null,
	open: function() {
		this.loading = Loading.service({
			fullscreen: true,
		});
	},
	close: function() {
		if (!this.loading) return false;
		this.loading.close();
	},
};


// Vue.prototype.$message = Message;
Vue.config.productionTip = false;

new Vue({
	router,
	store,

	render: (h) => h(App),
}).$mount("#app");