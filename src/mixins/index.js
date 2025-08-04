// import router from "@/router";
import { mapState } from "vuex";
import { API_ROOT, UPLOAD_PARAMS_ACTION } from '@/config/env.js'
import {
	Loading
} from "element-ui";

export default {
  data() {
    return {
      // 上传
      mix_upload_name: "img",
      demo: require('@/assets/demo.jpg'),
      mix_upload_action:
        process.env.NODE_ENV !== "production"
          ? "/api/service.php"
          : API_ROOT + "/service.php",
    };
  },
  computed: {
    ...mapState([
      "vuex_user",
      "vuex_config",
      "vuex_is_login",
      "vuex_huobi",
      "vuex_avatar_default",
      "vuex_cart_number",
      //
      "vuex_h5",
      "lang",
      "vuex_category_tree",
      "vuex_category_flat",
      //
      "vuex_news_cates",
      "bannerMap",
    ]),

    mix_upload_data() {
      let data = {
        action: "index_localUpload",
        userId: localStorage.getItem("userId") || "",
        token: localStorage.getItem("token") || "",
      };
      return data;
    },
    //
    mix_is_set_phone() { //是否绑定手机号
      return this.vuex_user.ifNeedBindPhone != 1;
    },
    mix_is_set_avatar_nick() { //是否完善头像昵称
      return !!this.vuex_user.image;
    },

    //用户资料
    mix_user_phone() {
      return this.vuex_user.phone || "";
    },
    mix_user_mobile() {
      return this.vuex_user.phone || "";
    },
    mix_user_avatar() {
      return this.vuex_user.image || this.vuex_avatar_default;
    },
    mix_user_origin_avatar() {
      return this.vuex_user.image;
    },
    mix_user_name() {
      return this.vuex_user.realName || "";
    },
    mix_user_nick() {
      return this.vuex_user.nickname || "";
    },
  },
  filters: {

  },
  methods: {
    	showLoading(is_hide) {
			if (is_hide) {
				this.loadingInstance = Loading.service({
					lock: true,
					text: "Loading...",
					spinner: "el-icon-loading",
					background: "rgba(255, 255, 255, .95)",
				});
			} else {
				this.loadingInstance = Loading.service({
					lock: true,
					text: "Loading...",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)",
				});
			}
		},
		hideLoading() {
			if (this.loadingInstance) {
				this.loadingInstance.close();
			}
		},
    // if(!this.mix_get_login_status()){
    //   return
    // }
    mix_get_login_status() {
      let loginStatus = true;
      if (!this.vuex_is_login) {
        alertErr("请您先登录");
        setTimeout(() => {
          this.toRoute("/login");
        }, 1000);

        loginStatus = false;
      }
      return loginStatus;
    },

    mix_toRoute(option) {
      // this.mix_toRoute({
      //   path: '/refund-type',
      //   query: {
      //     orderId: item.orderId,
      //     inventoryId: item.inventoryId,
      //   }
      // })
      this.toRoute(option)
    },

    toRoute(option) {
      let paramstype = typeof option;
      let path = "";
      let query = "";
      let mode = "";

      if (paramstype == "string") {
        path = option;
        let info = this.handleRoutePathQuery(path);
        path = info.path;
        query = info.query;
      } else if (paramstype == "object") {
        path = option.path || "";
        query = option.query || {};
        mode = option.mode || "";
      }

      this.$router.push({
        path: path,
        query: query || {},
      });
    },

    // 处理路由跳转参数
    handleRoutePathQuery(path) {
      let new_path = "";
      let new_query = "";
      let query = {};

      // debugger

      if (path.includes("?")) {
        let path_arr = path.split("?");
        new_path = path_arr[0];
        let queryStr = path_arr[1];

        if (queryStr) {
          var group_arr = queryStr.split("&");
          group_arr.forEach((key_and_val) => {
            var key_val_arr = key_and_val.split("=");
            var key = key_val_arr[0];
            var val = key_val_arr[1];
            query[key] = val;
          });
        }
      } else {
        new_path = path;
      }

      if (new_path.includes("/")) {
        let new_path_arr = new_path.split("/");
        new_path = new_path_arr[new_path_arr.length - 1];
      }

      return {
        path: new_path,
        query: query,
      };
    },


    toBack() {
      this.$router.back();
    },

    // 全局函数节流 - 例如 点击按钮提交表单
    // this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000)
    // this.throttle_do_submit();
    mix_throttle(fun, delay = 1500) {
      let last, deferTimer;
      return function (args) {
        let that = this;
        let _args = arguments;
        let now = +new Date();
        if (last && now < last + delay) {
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fun.apply(that, _args);
          }, delay);
        } else {
          last = now;
          fun.apply(that, _args);
        }
      };
    },

    // 全局函数防抖 - 例如 输入内容时搜索
    mix_debounce(func, wait) {
      console.log("防抖函数");
      let timeout;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      };
    },
    // 使用示例
    //  window.addEventListener('resize', debounce(function() {
    //   console.log('Window resized!');
    // }, 250));

    checkLogin() {
      if (!this.vuex_is_login) {
        alertErr("请您先登录");
        this.$router.push("/login");
        return false;
      }
      return true;
    },

    mix_current_change(value) {
      if (this.pagination && this.pagination.page) {
        this.pagination.page = value;
        this.setView();
        document.documentElement.scrollTop = 0;
      }
    },


    mix_logout() {
      this.$store.commit("remove_vuex_user");
      alertSucc("已退出登录");
      this.$router.push("/");
    },


    toLink(item) {
      if (item.url) {
        location.href = item.url;
      }
    },

    toRoute(route) {
      this.$router.push(route);
    },

    //商品详情页
    mix_to_product(item) {
      let { inventoryId, id } = item;
      if (inventoryId) {
        this.$router.push(`/product-detail?id=${inventoryId}`);
      } else if (id) {
        this.$router.push(`/product-detail?id=${id}`);
      }
    },
    
    //banner 跳转
    mix_banner_click(item) {
      //console.log(" do_banner_click item", { ...item });
      let { url, inventoryId, channel_id } = item;
      // return
      if (url) {
        location.href = url;
      } else if (inventoryId) {
        this.toRoute(`/product-detail?id=${inventoryId}`);
      } else if (channel_id) {
        this.toRoute(`/category?id=${channel_id}`);
      }
    },

  },
};
