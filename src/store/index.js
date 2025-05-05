import Vue from "vue";
import Vuex from "vuex";

import ajax from "@/plugin/request.js"; //导入 axios 配置
const api = ajax.api; //请求方法

// debugger
//console.log("========== store location ==========", location);

// 处理产品分类数据
function handle_product_cate_data(cateTreeList) {

  return {
    cateFlatList: cateTreeList.all_material_type,
    cateTreeList: cateTreeList.all_supply,
  };
}

//

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    vuex_h5: !!navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    ),

    //
    vuex_config: {},
    configInfo: {}, //
    //
    vuex_user: {},
    userInfo: {}, //
    baseInfo: {}, //
    //
    vuex_is_login: false, //是否登录
    isLogin: false,
    defaultAvatar: require("@/static/common/head-user-login.png"),
    //
    //
    //商城部分
    vuex_cart_number: 0,

    //
    vuex_huobi: "￥",
    index_banners: [],
    map_banners: {
      关于我们: [],
      联系我们: [],
    },
    //
    vuexTreeCates: [],
    vuexFlatCates: [],

    //
    //
    //
    webConfig: {}, //站点设置

    shopcart_count: 0,
    if_calc_yunfei: false, //是否需要计算运费
    default_address: {}, //默认收货地址
    store_keyword: {},
  },

  getters: {},

  mutations: {
    //设置数据
    set_vuex_data(state, obj) {
      let key = obj.key;
      let val = obj.val;
      state[key] = val;
    },
    set_vuex_configInfo(state, data) {
      state.configInfo = data;
      state.webConfig = data;
      state.vuex_config = data;
    },

    //设置基本信息
    set_userInfo(state, data) {
      console.log("vuex set_userInfo 用户信息", {
        ...data,
      });

      // debugger
      let {token, userId, id} = data;

      state.vuex_is_login = true;
      state.isLogin = true;
      state.userInfo = data;
      state.vuex_user = data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId || id);
      localStorage.setItem("userInfo", JSON.stringify(data));
    },

    set_vuex_banner(state, data) {
      let [pos_0, pos_1, pos_2] = data;
      state.index_banners = data;

      // state.map_banners = {
      //   关于我们: pos_1.images,
      //   联系我们: pos_2.images,
      //   客服: data[3].images
      // };
    },

    set_vuex_product_cate(state, data) {
      let {cateFlatList, cateTreeList} = data;

      state.vuexTreeCates = cateTreeList;
      state.vuexFlatCates = cateFlatList;
    },

    //设置购物车商品数量
    set_vuex_cart_number(state, value) {
      //console.log("设置购物车商品数量", value);
      state.shopcart_count = value;
      state.vuex_cart_number = value;
    },

    set_cache_payment_products(state, str_products) {
      sessionStorage.setItem("cache_payment_products", str_products);
    },

    //设置基本信息
    set_baseInfo(state, data) {
      // //console.log("设置用户信息", { ...data });
      let {token, user_id, id, level, levelRules} = data;

      state.vuex_is_login = true;
      state.token = token;
      state.user_id = user_id || id;

      // localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id || id);

      state.baseInfo = data;
      state.userInfo = data;
      state.vuex_user = data;
      localStorage.setItem("baseInfo", JSON.stringify(data));
      localStorage.setItem("userInfo", JSON.stringify(data));
    },

    set_vuex_login_status(state, value) {
      // //console.log("--------------- 用户是否登录 ---------------", value);
      state.vuex_is_login = value;
    },
    //清空登录信息
    clear_loginInfo(state) {
      state.shopcart_count = "0";
      state.token = "";
      state.userId = "";
      state.baseInfo = {};
      state.vuex_is_login = false;
      localStorage.removeItem('user_id');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('baseInfo');
      localStorage.removeItem('token');
      location.reload();
    },

    change_store_keyword(state, val) {
      state.store_keyword = {
        time: new Date().getTime(),
        keyword: val,
      };
    },

    set_list_channel(state, value) {
      value.forEach((v) => {
        if (v.id == 628) {
          v.is_youhuiqu = true;
        }
      });
      state.list_channel = value;
    },
  },

  actions: {
    async appInit({commit, state, dispatch}, data) {
      dispatch("appInitGetAssets");


      let token = localStorage.getItem("token");
      let userId = localStorage.getItem("userId");

      if (token && userId) {
        commit("set_vuex_login_status", true);
        dispatch("getUserloginedInfo");
      } else {
        commit("set_vuex_login_status", false);
      }
    },

    //获取登录后的信息
    async getUserloginedInfo({commit, state, dispatch}, data) {
      dispatch("query_user");
      dispatch("query_cart");
    },

    // 获取用户信息
    async query_user({commit, state, dispatch}) {
      api({
        url: "userInfo",
        method: "get",
        data: {},
      }).then((res) => {
        if (res.code == 200) {
          commit("set_vuex_login_status", true);
          commit("set_baseInfo", res.data.user_info);
        } else {
          commit("set_vuex_login_status", false);
        }
      });
    },
    // 获取用户信息
    async query_cart({commit, state, dispatch}) {
      api({
        url: "getCart",
        method: "post",
      })
        .then((res) => {
          let {code, data} = res;
          if (code == 200) {
            let count = 0;
            data.forEach((v) => {
              count += v.num * 1;
            });

            commit("set_vuex_cart_number", count);
          }
        });
    },


    //初始化资源
    async appInitGetAssets({commit, state, dispatch}, data) {
      dispatch("query_user");

      api({
        url: "setting",
        method: "get",
      }).then((res) => {
        let {code, data} = res;
        if (code === 200) {
          commit("set_vuex_configInfo", data);
        }
      });

      //首页数据接口
      api({
        url: "getBanner",
        method: "get",
        data: {
          position: 1, //服务端：0-全部 1-通用 2-PC 3-H5 4-小程序 5-APP
        },
      }).then((res) => {
        if (res.code == 200) {
          commit("set_vuex_banner", res.data);
        }
      });

      //产品分类
      api({
        url: "basicList",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          let catesInfo = handle_product_cate_data(res.data);
          commit("set_vuex_product_cate", catesInfo);
        }
      });

      //新闻分类
      // api({
      //   url: "/service.php",
      //   method: "get",
      //   data: {
      //     action: "news_channel",
      //   },
      // }).then((res) => {
      //   let { code, data } = res;
      //   if (code == 200) {
      //     res.data.forEach((v) => {
      //       v.route = "/news?id=" + v.id;
      //     });
      //     commit("set_vuex_data", {
      //       key: "vuexNewsCates",
      //       val: res.data,
      //     });
      //   }
      // });
    },
  },
});
