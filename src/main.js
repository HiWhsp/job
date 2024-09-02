import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 全局组件注册
import pageTop from "@/components/page/pageTop.vue";
Vue.component("pageTop", pageTop); //
import pageBread from "@/components/common/pageBread.vue";
Vue.component("pageBread", pageBread); //

// import VConsole from "vconsole";
// if (VConsole) {
//   new VConsole();
// }

// import "lib-flexible";//网页适配


import "@/css/css-reset.css"; // css reset
import "@/plugin/request.js"; 
import "@/plugin/message.js"; 
import "@/plugin/log.js"; 
import '@/lib/lib-flexible.js';


import Directives from "./directives"; //全局指令
Vue.use(Directives);

import * as filters from "@/filters/index"; //全局过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});


// 加载
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { Loading } from "element-ui";

// import "@/css/index.css"; // 自定义主题
Vue.use(ElementUI);

// 混入
import _mixin from "@/mixins/index.js";
Vue.mixin(_mixin);

Vue.prototype.$load = {
  loading: null,
  open: function () {
    this.loading = Loading.service({
      fullscreen: true,
    });
  },
  close: function () {
    if (!this.loading) return false;
    this.loading.close();
  },
};


store.dispatch("appInit"); //重新初始化

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
