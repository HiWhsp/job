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
    vuex_news_cates: [],//新闻分类首页使用
    vuex_top_title: [],//商品标签首页顶部使用
    //
    vuex_is_login: false, //是否登录
    //
    vuex_cart_number: 0,
    /** 购物车全部商品行金额合计 Σ(num×单价)，与 cart 列表每行 TOTAL 累加一致 */
    vuex_cart_total: "0.00",
    vuex_huobi: "US$",
    //
    vuex_category_tree: [],
    vuex_category_flat: [],
    //
    default_address: {}, //默认收货地址
    //
    vuex_index_banners: [],
    vuex_map_banners: {
      关于我们: [],
      联系我们: [],
      优惠券广告: [],
      首页推荐: [],
    },
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
      console.log(data, 'data')
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
      console.log(data, 1);

      // 修复：将对象序列化为JSON字符串存储
      localStorage.setItem("vuex_user", JSON.stringify(data));
    },

    //设置购物车商品数量
    set_vuex_cart_number(state, value) {
      state.vuex_cart_number = value;
    },

    set_vuex_cart_total(state, value) {
      state.vuex_cart_total =
        value != null && value !== "" ? String(value) : "0.00";
    },

    set_cache_payment_products(state, str_products) {
      console.log('vuex 缓存商品信息', str_products)
      sessionStorage.setItem("cache_payment_products", str_products);
    },

    set_vuex_banner(state, data) {
      let [pos_0, pos_1, pos_2, pos_3, pos_4, pos_5, pos_6, pos_7] = data;
      state.vuex_index_banners = pos_0.images;

      state.vuex_map_banners = {
        关于我们: pos_1.images,
        联系我们: pos_2.images,
        优惠券广告: pos_3.images,
        首页推荐: [pos_4.images, pos_6.images, pos_7.images]
      };

    },
    // 产品分类树
    set_vuex_product_cate(state, data) {
      let { category_flat, category_tree } = data;
      console.warn(
        "category_tree 产品分类数据",
        JSON.parse(JSON.stringify(category_tree))
      );

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
      state.vuex_cart_total = "0.00";
      state.token = "";
      state.userId = "";
      state.vuex_user = {};
      state.vuex_is_login = false;
      localStorage.clear();
    },

  },

  actions: {
    async appInit({ commit, state, dispatch }, data) {
      dispatch("query_assets");

      let token = localStorage.getItem("token");
      let userId = localStorage.getItem("userId");

      if (token && userId) {
        let cache_user = localStorage.getItem("vuex_user");
        if (cache_user) {
          try {
            // 修复：将JSON字符串解析为对象
            let userData = JSON.parse(cache_user);
            commit("set_vuex_user", userData);
            dispatch("query_user_auth_info");
          } catch (error) {
            console.error("解析用户数据失败:", error);
            // 如果解析失败，清除无效数据并重新获取用户信息
            localStorage.removeItem("vuex_user");
            commit("remove_vuex_user");
          }
        } else {
          // 如果没有缓存的用户数据，但有token，则重新获取用户信息
          dispatch("query_user_auth_info");
        }
      } else {
        commit("remove_vuex_user");
      }
    },

    //获取登录后的信息
    async query_user_auth_info({ commit, state, dispatch }, data) {
      dispatch("query_user");
      dispatch("query_cart");
    },

    // 获取用户信息
    async query_user({ commit, state, dispatch }) {
      api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo",
        },
      }).then((res) => {
        if (res.code == 200) {
          commit("set_vuex_user", res.data);
        } else {
          commit("remove_vuex_user");
        }
      });
    },
    // 购物车
    async query_cart({ commit, state, dispatch }) {
      api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_lists",
        },
      })
        .then((res) => {
          let { code, data } = res;
          if (code != 200) return;
          const list = Array.isArray(data) ? data : [];
          if (!list.length) {
            commit("set_vuex_cart_number", 0);
            commit("set_vuex_cart_total", "0.00");
            return;
          }
          let count = 0;
          let total = 0;
          list.forEach((v) => {
            const n = Number(v.num) || 0;
            count += n;
            const price =
              parseFloat(
                v.priceSale != null && v.priceSale !== ""
                  ? v.priceSale
                  : v.price != null && v.price !== ""
                    ? v.price
                    : v.yPrice
              ) || 0;
            total += n * price;
          });
          commit("set_vuex_cart_number", count);
          commit("set_vuex_cart_total", total.toFixed(2));
        });
    },

    //初始化资源
    async query_assets({ commit, state, dispatch }, data) {
      dispatch('query_config')
      dispatch('query_banner')
      dispatch('query_category')
      dispatch('query_news')
      dispatch('query_getCompanyType')

    },

    // 查询
    async query_config({ commit, state, dispatch }) {
      api({
        url: "/service.php",
        method: "get",
        data: {
          action: "index_config",
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          commit("set_vuex_config", data);

          if (data.comLogo && document) {
            document
              .querySelector('meta[property="og:image"]')
              .setAttribute("content", data.comLogo);
          }
        }
      });
    },
    // 查询
    async query_banner({ commit, state, dispatch }) {
      api({
        url: "/service.php",
        method: "get",
        data: {
          action: "banner_index",
          position: 0, //服务端：0-全部 1-通用 2-PC 3-H5 4-小程序 5-APP
          t: new Date().getTime()
        },
      }).then((res) => {
        if (res.code == 200) {
          console.log(res.data)
          commit("set_vuex_banner", res.data);
        }
      });
    },
    // 查询
    async query_category({ commit, state, dispatch }) {
      api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_channel",
          parentId: 0,
        },
      }).then((res) => {
        if (res.code == 200) {
          let catesInfo = handle_product_cate_data(res.data);
          commit("set_vuex_product_cate", catesInfo);
        }
      });
    },
    // 查询
    async query_news({ commit, state, dispatch }) {
      api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_channel",
          channelId: 65
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data
          data.forEach((v) => {
            v.route = `/product-cates?tags=${v.title}`;// v.id==66? `/news?id=${v.id}`:
          });
          commit("set_vuex_data", {
            key: "vuex_news_cates",
            val: data,
          });
        }
      });
    },
    // 查询
    async query_getCompanyType({ commit, state, dispatch }) {
      api({
        url: "/service.php",
        method: "get",
        data: {
          action: "index_getCompanyType",
        },
      }).then((res) => {
        if (res.code == 200) {
          console.log('标签', res)
          let data = []
          res.data.forEach((e) => {
            data.push({
              title: e,
              route: `/product-cates?tags=${e}`
            })
          })
          // let data = res.data
          // data.forEach((v) => {
          //   v.route =`/product-cates?tags=${v}`;// v.id==66? `/news?id=${v.id}`:
          // });
          commit("set_vuex_data", {
            key: "vuex_top_title",
            val: data,
          });
        }
      });
    },







  },
});
