import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import plugins_request from "@/plugin/request.js"
let api = plugins_request.api;

// 处理产品分类数据
function handle_product_cate_data(category_tree) {
  let root_route = "/product-cates?ids="; //配件产品

  let category_flat = [];
  category_tree.forEach((level1) => {
    level1.level = "1";
    level1.idlist = [level1.id];
    level1.ids = level1.idlist.join("-");
    level1.route = root_route + level1.ids;

    category_flat.push({
      ...level1,
    });

    let list_cates_level2 = level1.channels; //.filter(v => v.is_show || 1);
    if (list_cates_level2.length) {
      list_cates_level2.forEach((level2) => {
        level2.level = "2";
        level2.idlist = [level1.id, level2.id];
        level2.ids = level2.idlist.join("-");
        level2.route = root_route + level2.ids;

        category_flat.push({
          ...level2,
        });

        let list_cates_level3 = level2.channels; //.filter(v => v.is_show || 1);
        if (list_cates_level3.length) {
          list_cates_level3.forEach((level3) => {
            level3.level = "3";
            level3.idlist = [level1.id, level2.id, level3.id];
            level3.ids = level3.idlist.join("-");
            level3.route = root_route + level3.ids;

            category_flat.push({
              ...level3,
            });
          });
        }
      });
    }
  });

  return {
    category_flat: category_flat,
    category_tree: category_tree,
  };
}

//
export default new Vuex.Store({
  state: {
    vuex_h5: !!navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    ),
    vuex_avatar_default: require("@img/common/avatar.png"),
    vuex_user: {},
    //
    vuex_config: {},
    vuex_news_cates: [],
    //
    vuex_is_login: false, //是否登录
    //
    vuex_cart_number: 0,
    vuex_huobi: "￥",
    //
    vuex_category_tree: [],
    vuex_category_flat: [],
    //
    default_address: {}, //默认收货地址
    //
    vuex_index_banners: [],
    //
  },

  getters: {},

  mutations: {
    //设置数据
    set_vuex_data(state, obj) {
      let key = obj.key;
      let val = obj.val;
      state[key] = val;
    },
    set_vuex_config(state, data) {
      state.vuex_config = data;
    },

    //设置基本信息
    set_vuex_user(state, data) {
      // //console.log("vuex set_vuex_user 设置用户信息", { ...data });

      let token = data.token;
      let userId = data.userId || data.id;

      state.vuex_is_login = true;
      state.token = token;
      state.userId = userId;
      state.vuex_user = data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("vuex_user", JSON.stringify(data));
      // let cookieVal = {
      //   "token": token,
      //   "userId": userId,
      //   "vuex_user": data,
      // }
      // document.cookie = `jiuzhouuser=${JSON.stringify(cookieVal)}`
    },

    //设置购物车商品数量
    set_vuex_cart_number(state, value) {
      state.vuex_cart_number = value;
    },

    set_cache_payment_products(state, str_products) {
      console.log('vuex 缓存商品信息', str_products)
      sessionStorage.setItem("cache_payment_products", str_products);
    },
    // 首页轮播
    set_vuex_banner(state, data) {
      state.vuex_index_banners = data;
    },
    // 产品分类树
    set_vuex_product_cate(state, data) {
      let category_flat = data;
      let category_tree = data;

      state.vuex_category_tree = category_tree;
      state.vuex_category_flat = category_flat;
    },

    set_vuex_login_status(state, value) {
      // //console.log("--------------- 用户是否登录 ---------------", value);
      state.vuex_is_login = value;
    },
    //清空登录信息
    remove_vuex_user(state) {
      state.vuex_cart_number = "0";
      state.token = "";
      state.userId = "";
      state.vuex_user = {};
      state.vuex_is_login = false;
      localStorage.clear();
      document.cookie = ''
    },

  },

  actions: {
    async appInit({ commit, state, dispatch }, data) {
      dispatch("query_assets");

      let token = localStorage.getItem("token");
      let userId = localStorage.getItem("userId");
      console.log(userId);
      if (token && userId) {
        let cache_user = JSON.parse(localStorage.getItem("vuex_user"));
        console.log(cache_user);
        commit("set_vuex_user", cache_user);
        dispatch("query_user_auth_info");
      } else {
        commit("remove_vuex_user");
      }
    },

    //获取登录后的信息
    async query_user_auth_info({ commit, state, dispatch }, data) {
      dispatch("query_user");
    },

    // 获取用户信息
    async query_user({ commit, state, dispatch }) {
      api({
        url: "getUserInfo",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          commit("set_vuex_user", res.data);
        } else {
          commit("remove_vuex_user");
        }
      });
    },

    //初始化资源
    async query_assets({ commit, state, dispatch }, data) {
      dispatch('query_config')
      dispatch('query_banner')
      dispatch('query_category')
    },

    // 查询配置
    async query_config({ commit, state, dispatch }) {
      api({
        url: "indexSetting",
        method: "get",
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          commit("set_vuex_config", data);
        }
      });
    },
    // 查询
    async query_banner({ commit, state, dispatch }) {
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
    },
    // 查询
    async query_category({ commit, state, dispatch }) {
      api({
        url: "indexSetting",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          // let catesInfo = handle_product_cate_data(res.data);
          commit("set_vuex_product_cate", res.data.categoryList);
        }
      });
    },
  },
});
