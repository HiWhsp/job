// import router from "@/router";
import { mapState } from "vuex";
import { UPLOAD_PARAMS_ACTION } from "@/config/env.js";

export default {
  data() {
    return {
      // 上传
      upload_name: "img",
      upload_action:
        process.env.NODE_ENV !== "production"
          ? "/api/service.php"
          : process.env.VUE_APP_API_ROOT + "/service.php",

      //函数节流和防抖
      firstTime_mix_throttle: true,
      timer_mix_throttle: null,
    };
  },
  computed: {
    ...mapState([
      //
      "vuex_user",
      "vuex_config",
      "vuex_is_login",
      "vuex_huobi",
      "vuex_avatar_default",
      "avatar_default",
      "vuex_cart_number",

      //
      //
      //
      "bannerMap",
      "activitiesCates",
      "child_about",
      "vuexTreeCates",
      "vuexFlatCates",
      "vuexNewsCates",

      //
      "vuex_h5",
      "lang",
      "webConfig",

      "baseInfo",
      "defaultAvatar",
      "shopcart_count",
    ]),

    mix_upload_data() {
      let data = {
        action: UPLOAD_PARAMS_ACTION,
      };
      return data;
    },
    mix_user_phone() {
      return this.vuex_user.phone || "";
    },
    mix_user_mobile() {
      return this.vuex_user.phone || "";
    },
    mix_user_avatar() {
      return this.vuex_user.image || this.avatar_default;
    },
    mix_user_name() {
      return this.vuex_user.realName || "";
    },
    //
    //
    //
    //
    uploadExtraData() {
      let data = {
        action: "index_upload",
        user_id: localStorage.getItem("user_id") || "",
        token: localStorage.getItem("token") || "",
      };
      return data;
    },
  },

  filters: {
    f_guige(str) {
      let ret = str;
      if (str == "" || str == "无" || str == "默认") {
        ret = "默认";
      }
      return ret;
    },
  },
  created() {},
  mounted() {},
  destroyed() {},

  methods: {
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

    changePage(page) {
      if (this.pagination && this.pagination.page) {
        this.pagination.page = page;
        this.setView();
        document.documentElement.scrollTop = 0;
      }
    },

    mix_logout() {
      this.$store.commit("clear_loginInfo");
      alertSucc("已退出登录");
      this.$router.push("/");
    },

    mix_userinfo_query() {
      this.$store.dispatch("query_user");
    },

    toProductSearchPage(option) {
      this.$router.push({
        path: "/product-search",
        query: {
          keyword: option.keyword,
          id: option.id,
        },
      });
    },

    //用户头像
    getAvatar() {
      return this.vuex_user.user_image || this.defaultAvatar;
    },

    toBack() {
      this.$router.back();
    },
    toLink(item) {
      if (item.url) {
        location.href = item.url;
      }
    },
    toRoute(route) {
      this.$router.push(route);
    },

    //打开弹窗
    mix_openModal(refName, data) {
      // debugger
      this.$refs[refName].init(data);
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

    userLogin() {
      let is_wx_auth = true; //是否微信授权登录项目
      if (!is_wx_auth) {
        this.toRoute("/login");
      } else {
        this.$store.commit("set_weixinReAuth", new Date().getTime());
      }
    },

    // 地址 —— 设置默认地址

    // 优惠券  展示信息格式化

    //优惠券领取
    coupon_pick(item) {
      this.$api("users_yhqLingqu", {
        id: item.id,
      }).then((res) => {
        let { code, message } = res;
        alert(res);
        if (this.$route.name == "product-detail") {
          this.show_coupon = false;
        }
      });
    },

    //订单
    //订单详情
    mix_order_detail(orderId, callback) {
      this.$api("orders_detail", {
        id: orderId,
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          data.actions = this.getOrderActionsByStatus({
            ...data,
          });

          if (callback) {
            callback(data);
          }
        }
      });
    },

    //订单取消
    mix_order_cancel(orderId, callback) {
      this.$api("orders_qxOrder", {
        orderId: orderId,
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          if (callback) {
            callback();
          }
        }
      });
    },

    //订单删除
    mix_order_delete(orderId, callback) {
      this.$api("orders_del", {
        orderId: orderId,
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          if (callback) {
            callback();
          }
        }
      });
    },

    //订单确认收货
    mix_order_qianshou(orderId, callback) {
      this.$api("orders_qrshouhuo", {
        orderId: orderId,
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          if (callback) {
            callback();
          }
        }
      });
    },

    //订单详情页
    mix_order_detail_link(orderId) {
      this.toRoute(`/order-detail?orderId=${orderId}`);
    },
    //订单去支付
    mix_order_payment_link(orderId) {
      this.toRoute(`/orderSubmit?orderId=${orderId}`);
    },
    //订单去评价
    mix_order_review_link(orderId) {
      this.toRoute(`/order-review-submit?orderId=${orderId}`);
    },
    //订单去售后
    mix_order_refund_link(orderId) {
      this.toRoute(`/orderRefund?orderId=${orderId}`);
    },

    //上传文件
    mix_fileUpload(params) {
      //console.log("文件上传 mix_uploadFileApi");
      const formData = new FormData();
      formData.append("action", "index_upload");
      formData.append("com_id", this.com_id);
      formData.append("userId", localStorage.getItem("userId"));
      formData.append("token", localStorage.getItem("token"));
      formData.append("img", params.file);
      formData.append("if_touxiang", params.if_touxiang || "");

      const uploaderConfig = {
        headers: {
          "Content-Type":
            "multipart/form-data;boundary=" + new Date().getTime(),
        },
      };
      return this.$api("index_upload", formData, "post", uploaderConfig);
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

    // 自定义导航跳转
    mix_cus_nav_click(item) {
      //console.log(" indexNavClick item", { ...item });
      let { url, inventoryId, channel_id } = item;

      // return
      if (url) {
        if (
          url.includes("http") ||
          url.includes(".cn") ||
          url.includes(".com")
        ) {
          location.href = url;
        } else {
          this.toRoute(url);
        }
      } else if (inventoryId) {
        this.toRoute(`/product-detail?id=${inventoryId}`);
      } else if (channel_id) {
        this.toRoute(`/category?id=${channel_id}`);
      }
    },

    //订单中的单个商品允许的操作类型
    mix_getOrderProductsAllowActions(order, product) {
      let { status } = order;

      let { ifpingjia, ifshouhou } = product;

      let allow_review = !ifpingjia && status == 4; //是否允许评价
      let allow_refund =
        !ifshouhou && (status == 2 || status == 3 || status == 4); //是否允许售后申请
      // let allow_logistics =  status >= 3 && order.fahuo_info?.fahuo_id; //是否允许查看物流

      // debugger

      let allow_actions = {
        allow_review,
        allow_refund,
        // allow_logistics,
      };

      return allow_actions;
    },

    //获取订单允许执行的操作
    mix_getOrderActionsByStatus(order) {
      return this.getOrderActionsByStatus(order);
    },

    //根据订单状态获取订单操作结果
    getOrderActionsByStatus(order) {
      let { status, statusInfo, ifpingjia } = order;
      let actions = [];
      // let actions = [
      //   { name: "取消订单",type: 'quxiao' },
      //   { name: "立即支付",type: 'zhifu' },
      //   { name: "确认收货",type: 'shouhuo' },
      //   { name: "评价订单",type: 'pingjia' },
      //   { name: "申请售后",type: 'shouhou' },
      //   { name: "删除订单",type: 'shanchu' },
      //   { name: "再次购买",type: 'goumai' },
      // ];

      if (status == -5) {
        //待支付
        if (statusInfo == "无效") {
          actions = [{ name: "取消订单", type: "quxiao" }];
        } else if (statusInfo == "待支付") {
          actions = [
            { name: "立即支付", type: "zhifu" },
            { name: "取消订单", type: "quxiao" },
          ];
        }
      } else if (status == -3) {
        //-3售后处理中
        actions = [{ name: "删除订单", type: "shanchu" }];
      } else if (status == -1) {
        //无效
        actions = [{ name: "删除订单", type: "shanchu" }];
      } else if (status == 0) {
        //0待成团
        actions = [{ name: "取消订单", type: "quxiao" }];
      } else if (status == 2) {
        //2待发货
        actions = [
          // { name: "取消订单", type: "quxiao" }
        ];
      } else if (status == 3) {
        //3待收货
        actions = [
          { name: "确认收货", type: "shouhuo" },
          { name: "查看物流", type: "wuliu" },
        ];
      } else if (status == 4) {
        //4已收货
        if (ifpingjia) {
          actions = [
            // { name: "删除订单", type: "shanchu" },
            // { name: "查看物流", type: "wuliu" },
            // { name: "售后", type: "shouhou" },
          ];
        } else {
          actions = [
            // { name: "删除订单", type: "shanchu" },
            // { name: "查看物流", type: "wuliu" },
            { name: "评价", type: "pingjia" },
            // { name: "售后", type: "shouhou" },
          ];
        }
      }
      return actions;
    },
  },
};
