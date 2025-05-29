import Vue from "vue";
import VueRouter from "vue-router";

// 解决报错
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};
// replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);

// 官网页面1
const index = () => import(/* webpackChunkName: "index" */ "@/views/index.vue");
const news = () =>
  import(/* webpackChunkName: "news" */ "@/views/news/news.vue");
const news_detail = () =>
  import(/* webpackChunkName: "news" */ "@/views/news/news-detail.vue");
const product_brand = () =>
  import(
    /* webpackChunkName: "product_brand" */ "@/views/product/product-brand.vue"
  );

// 账号相关
const register = () =>
  import(/* webpackChunkName: "register" */ "@/views/account/register.vue");
const login = () =>
  import(/* webpackChunkName: "login" */ "@/views/account/login.vue");
const retrieve = () =>
  import(/* webpackChunkName: "retrieve" */ "@/views/account/retrieve.vue");

const about = () =>
  import(/* webpackChunkName: "about" */ "@/views/company/about.vue");

const contact = () =>
  import(/* webpackChunkName: "contact" */ "@/views/company/contact.vue");

const terms = () =>
  import(/* webpackChunkName: "terms" */ "@/views/article/terms.vue");
const help = () =>
  import(/* webpackChunkName: "help" */ "@/views/article/help.vue");

const demand = () =>
  import(/* webpackChunkName: "demand" */ "@/views/company/demand.vue");

//产品
const product_cates = () =>
  import(
    /* webpackChunkName: "product-cates" */ "@/views/product/product-cates.vue"
  );
const product_remai = () =>
  import(
    /* webpackChunkName: "product-remai" */ "@/views/product/product-remai.vue"
  );
const product_youxuan = () =>
  import(
    /* webpackChunkName: "product-youxuan" */ "@/views/product/product-youxuan.vue"
  );
const product_search = () =>
  import(
    /* webpackChunkName: "product-search" */ "@/views/product/product-search.vue"
  );
const product_detail = () =>
  import(
    /* webpackChunkName: "product-detail" */ "@/views/product/product-detail.vue"
  );
const batch_search = () =>
  import(
    /* webpackChunkName: "batch-xiadan" */ "@/views/batch/batch-xiadan.vue"
  );
const batch_xunjia = () =>
  import(
    /* webpackChunkName: "batch-xunjia" */ "@/views/batch/batch-xunjia.vue"
  );
const batch_xunjia_match = () =>
  import(
    /* webpackChunkName: "batch-xunjia" */ "@/views/batch/batch-xunjia-match.vue"
  );
const batch_xunjia_result = () =>
  import(
    /* webpackChunkName: "batch-xunjia" */ "@/views/batch/batch-xunjia-result.vue"
  );
const product_xieyi = () =>
  import(
    /* webpackChunkName: "product-xieyi" */ "@/views/product/product-xieyi.vue"
  );
const product_zhenxuan = () =>
  import(
    /* webpackChunkName: "product-zhenxuan" */ "@/views/product/product-zhenxuan.vue"
  );
const scene = () =>
  import(
    /* webpackChunkName: "scene" */ "@/views/product/scene.vue"
  );
const balance = () =>
  import(
    /* webpackChunkName: "balance" */ "@/views/balance/balance.vue"
  );
const balance_list = () =>
  import(
    /* webpackChunkName: "balance" */ "@/views/balance/balance-list.vue"
  );
const card = () =>
  import(
    /* webpackChunkName: "card" */ "@/views/card/card.vue"
  );
const card_list = () =>
  import(
    /* webpackChunkName: "card" */ "@/views/card/card-list.vue"
  );
const card_goods = () =>
  import(
    /* webpackChunkName: "card" */ "@/views/card/card-goods.vue"
  );
const card_records = () =>
  import(
    /* webpackChunkName: "card" */ "@/views/card/card-records.vue"
  );
const order_logistics = () =>
  import(/* webpackChunkName: "order-logistics" */ "@/views/order/order-logistics.vue");
// const memberCenter = () => import(/* webpackChunkName: "memberCenter" */ "@/views/my/member/memberCenter.vue");

// 个人中心
const my_layout = () => import("@/views/my/my-layout.vue");
const my_index = () => import("@/views/my/my-index.vue");

// 订单
// 下单
const cart = () =>
  import(/* webpackChunkName: "cart" */ "@/views/cart/cart.vue");
const order_submit = () =>
  import(
    /* webpackChunkName: "order-submit" */ "@/views/order/order-submit.vue"
  );
const payment_methods = () =>
  import(
    /* webpackChunkName: "payment-methods" */ "@/views/payment/payment-methods.vue"
  );
// 支付
// const zfbPay = () => import(/* webpackChunkName: "zfbPay" */ "@/views/pay/zfbPay.vue");
const payment_success = () =>
  import(
    /* webpackChunkName: "payment-success" */ "@/views/payment/payment-success.vue"
  );
const order_list = () =>
  import(/* webpackChunkName: "order-list" */ "@/views/order/order-list.vue");
const order_detail = () =>
  import(
    /* webpackChunkName: "order-detail" */ "@/views/order/order-detail.vue"
  );
// const points-order-detail = () => import(/* webpackChunkName: "points-order-detail" */ "@/views/order/points-order-detail.vue");
const order_review_submit = () =>
  import(
    /* webpackChunkName: "order-review-submit" */ "@/views/review/order-review-submit.vue"
  );

// 发票
const invoice_list = () =>
  import(
    /* webpackChunkName: "invoice-list" */ "@/views/invoice/invoice-list.vue"
  );
const invoice_detail = () =>
  import(
    /* webpackChunkName: "invoice-detail" */ "@/views/invoice/invoice-detail.vue"
  );

// 售后
const refund_list = () => import("@/views/refund/refund-list.vue");
const refund_type = () => import("@/views/refund/refund-type.vue");
const refund_submit = () => import("@/views/refund/refund-submit.vue");
const refund_service_detail = () =>
  import("@/views/refund/refund-service-detail.vue");
//
const address_list = () =>
  import(
    /* webpackChunkName: "address-list" */ "@/views/address/address-list.vue"
  );
const foreign_address_list = () =>
  import(
    /* webpackChunkName: "foreign-address-list" */ "@/views/address/foreign-address-list.vue"
  );
const my_info = () =>
  import(/* webpackChunkName: "my-info" */ "@/views/my/my-info.vue");

const my_review_list = () => import("@/views/review/my-review-list.vue");
const change_password = () => import("@/views/my/change-password.vue");

const browse_history = () =>
  import(
    /* webpackChunkName: "browse-history" */ "@/views/browse/browse-history.vue"
  );
const favorite_list = () =>
  import(
    /* webpackChunkName: "favorite-list" */ "@/views/favorite/favorite-list.vue"
  );

//
const points_record = () => import("@/views/points/points-record.vue");
const couponList = () => import("@/views/coupon/coupon-list.vue");
const couponCenter = () => import("@/views/coupon/coupon-center.vue");
const researchReport = () => import("@/views/ellsennProduct/researchReport/index.vue");
const reportDetails = () => import("@/views/ellsennProduct/researchReport/reportDetails/index.vue");
const newsInsights = () => import("@/views/ellsennProduct/newsInsights/index.vue");
const deepEvaluation = () => import("@/views/ellsennProduct/deepEvaluation/index.vue");

const industrialActivities = () => import("@/views/ellsennProduct/industrialActivities/index.vue");

const routes = [
  // 首页
  {
    path: "/",
    name: "index",
    component: index,
    meta: {},
  },
  // 研究报告
  {
    path: "/researchReport",
    name: "researchReport",
    component: researchReport,
    meta: {
      title: "研究报告",
    },
  },
  {
    path: "/reportDetails",
    name: "reportDetails",
    component: reportDetails,
    meta: {
      title: "报告详情",
    },
  },
  {
    path: "/newsInsights",
    name: "newsInsights",
    component: newsInsights,
    meta: {
      title: "新闻洞察",
    },
  },
  {
    path: "/deepEvaluation",
    name: "deepEvaluation",
    component: deepEvaluation,
    meta: {
      title: "维深测评",
    },
  },{
    path: "/industrialActivities",
    name: "industrialActivities",
    component: industrialActivities,
    meta: {
      title: "产业活动",
    },
  },
  {
    path: "/news",
    name: "news",
    component: news,
    meta: {},
  },
  {
    path: "/news-detail",
    name: "news-detail",
    component: news_detail,
    meta: {},
  },
  {
    path: "/about",
    name: "about",
    component: about,
    meta: {},
  },
  {
    path: "/contact",
    name: "contact",
    component: contact,
    meta: {},
  },
  {
    path: "/demand",
    name: "demand",
    component: demand,
    meta: {},
  },
  {
    path: "/terms",
    name: "terms",
    component: terms,
    meta: {},
  },
  {
    path: "/help",
    name: "help",
    component: help,
    meta: {},
  },

  {
    path: "/register",
    name: "register",
    component: register,
    meta: {},
  },
  {
    path: "/login",
    name: "login",
    component: login,
    meta: {},
  },
  {
    path: "/retrieve",
    name: "retrieve",
    component: retrieve,
    meta: {},
  },
  {
    path: "/product-cates",
    name: "product-cates",
    component: product_cates,
    meta: {
      title: "产品分类",
    },
  },
  {
    path: "/product-remai",
    name: "product-remai",
    component: product_remai,
    meta: {
      title: "热卖产品",
    },
  },
  {
    path: "/product-youxuan",
    name: "product-youxuan",
    component: product_youxuan,
    meta: {
      title: "中科优选",
    },
  },
  {
    path: "/product-brand",
    name: "product-brand",
    component: product_brand,
    meta: {
      title: "产品分类",
    },
  },
  {
    path: "/product-search",
    name: "product-search",
    component: product_search,
    meta: {
      title: "产品搜索",
    },
  },
  {
    path: "/product-detail",
    name: "product-detail",
    component: product_detail,
    meta: {
      title: "产品详情",
    },
  },
  {
    path: "/batch-xiadan",
    name: "batch-xiadan",
    component: batch_search,
    meta: {
      title: "批量下单",
    },
  },
  {
    path: "/batch-xunjia",
    name: "batch-xunjia",
    component: batch_xunjia,
    meta: {
      title: "批量询价",
    },
  },
  {
    path: "/batch-xunjia-match",
    name: "batch-xunjia-match",
    component: batch_xunjia_match,
    meta: {
      title: "批量询价",
    },
  },
  {
    path: "/batch-xunjia-result",
    name: "batch-xunjia-result",
    component: batch_xunjia_result,
    meta: {
      title: "批量询价",
    },
  },
  {
    path: "/product-xieyi",
    name: "product-xieyi",
    component: product_xieyi,
    meta: {
      title: "协议商品",
    },
  },
  {
    path: "/product-zhenxuan",
    name: "product-zhenxuan",
    component: product_zhenxuan,
    meta: {
      title: "氿州甄选",
    },
  },
  {
    path: "/scene",
    name: "scene",
    component: scene,
    meta: {
      title: "场景专区",
    },
  },
  {
    path: "/balance",
    name: "balance",
    component: balance,
    meta: {
      title: "充值中心",
    },
  },
  {
    path: "/card",
    name: "card",
    component: card,
    meta: {
      title: "兑换卡",
    },
  },
  {
    path: "/cart",
    name: "cart",
    component: cart,
    meta: {
      title: "购物车",
      requireAuth: true,
    },
  },
  {
    path: "/order-submit",
    name: "order-submit",
    component: order_submit,
    meta: {
      title: "结算",
      requireAuth: true,
    },
  },
  {
    path: "/payment-methods",
    name: "payment-methods",
    component: payment_methods,
    meta: {
      title: "订单支付",
      requireAuth: true,
    },
  },

  {
    path: "/payment-success",
    name: "payment-success",
    component: payment_success,
    meta: {
      title: "支付结果",
      requireAuth: true,
    },
  },

  //用户中心
  {
    path: "/my",
    name: "my",
    component: my_layout,
    meta: {
      // requireAuth: true,
    },
    children: [
      {
        path: "/my-index",
        name: "my-index",
        component: my_index,
        meta: {
          title: "会员中心",
          requireAuth: true,
        },
      },

      {
        path: "/order-list",
        name: "order-list",
        component: order_list,
        meta: {
          title: "我的订单",
          requireAuth: true,
        },
      },

      {
        path: "/order-detail",
        name: "order-detail",
        component: order_detail,
        meta: {
          title: "订单详情",
          requireAuth: true,
        },
      },
      {
        path: "/order-logistics",
        name: "order-logistics",
        component: order_logistics,
        meta: {
          title: "订单物流",
          requireAuth: true,

        },
      },
      {
        path: "/order-review-submit",
        name: "order-review-submit",
        component: order_review_submit,
        meta: {
          title: "订单评价",
          requireAuth: true,
        },
      },

      {
        path: "/refund-list",
        name: "refund-list",
        component: refund_list,
        meta: {
          title: "我的售后",
          requireAuth: true,
        },
      },
      {
        path: "/refund-type",
        name: "refund-type",
        component: refund_type,
        meta: {
          title: "我的售后",
          requireAuth: true,
        },
      },
      {
        path: "/refund-submit",
        name: "refund-submit",
        component: refund_submit,
        meta: {
          title: "我的售后",
          requireAuth: true,
        },
      },
      {
        path: "/refund-service-detail",
        name: "refund-service-detail",
        component: refund_service_detail,
        meta: {
          title: "我的售后",
          requireAuth: true,
        },
      },
      // {
      //   path: "/orderRefundStep3",
      //   name: "orderRefundStep3",
      //   component: orderRefundStep3,
      //   meta: {
      //     title: "我的售后",
      //     requireAuth: true,
      //   },
      // },

      {
        path: "/my-review-list",
        name: "my-review-list",
        component: my_review_list,
        meta: {
          title: "我的评价",
          requireAuth: true,
        },
      },
      {
        path: "/balance-list",
        name: "balance-list",
        component: balance_list,
        meta: {
          title: "我的充值",
          requireAuth: true,
        },
      },
      {
        path: "/card-list",
        name: "card-list",
        component: card_list,
        meta: {
          title: "我的兑换卡",
          requireAuth: true,
        },
      },
      {
        path: "/card-goods",
        name: "card-goods",
        component: card_goods,
        meta: {
          title: "兑换商品",
          requireAuth: true,
        },
      },
      {
        path: "/card-records",
        name: "card-records",
        component: card_records,
        meta: {
          title: "兑换记录",
          requireAuth: true,
        },
      },
      {
        path: "/favorite-list",
        name: "favorite-list",
        component: favorite_list,
        meta: {
          title: "我的收藏",
          requireAuth: true,
        },
      },
      {
        path: "/browse-history",
        name: "browse-history",
        component: browse_history,
        meta: {
          title: "我的足迹",
          requireAuth: true,
        },
      },
      {
        path: "/address-list",
        name: "address-list",
        component: address_list,
        meta: {
          title: "我的地址",
          requireAuth: true,
        },
      },
      {
        path: "/foreign-address-list",
        name: "foreign-address-list",
        component: foreign_address_list,
        meta: {
          title: "我的地址",
          requireAuth: true,
        },
      },
      {
        path: "/invoice-list",
        name: "invoice-list",
        component: invoice_list,
        meta: {
          title: "我的发票",
          requireAuth: true,
        },
      },
      {
        path: "/invoice-detail",
        name: "invoice-detail",
        component: invoice_detail,
        meta: {
          title: "我的发票",
          requireAuth: true,
        },
      },
      {
        path: "/my-info",
        name: "my-info",
        component: my_info,
        meta: {
          title: "个人信息",
          requireAuth: true,
        },
      },
      {
        path: "/change-password",
        name: "change-password",
        component: change_password,
        meta: {
          title: "修改密码",
          requireAuth: true,
        },
      },
      {
        path: "/points-record",
        name: "points-record",
        component: points_record,
        meta: {
          title: "我的积分",
          requireAuth: true,
        },
      },
      {
        path: "/coupon-list",
        name: "coupon-list",
        component: couponList,
        meta: {
          title: "我的优惠券",
        },
      },
      {
        path: "/coupon-center",
        name: "coupon-center",
        component: couponCenter,
        meta: {
          title: "领券中心",
        },
      },
    ],
  },

  {
    path: "*",
    redirect: "/",
  },
];

const scrollBehavior = (to, from, savedPosition) => {
  // //console.log('滚动行为', to, from, savedPosition)
  // if(1) {
  //   return savedPosition;
  // }
  //console.log('router 处理滚动')
  if (to.name == "technologyCenter") {
    let scrollTop = document.documentElement.scrollTop;
    return { x: 0, y: scrollTop };
  }
  return { x: 0, y: 0 };
};

const router = new VueRouter({
  routes,
  base: "/",
  mode: "history",
  scrollBehavior,
});

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token");
  let userId = localStorage.getItem("userId");
  let user_is_login = token && userId;

  // debugger
  if (!user_is_login && to.meta.requireAuth) {
    // debugger
    alertErr("请先登录");
    next("/login");
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  // //console.log("切换导航, 重新配置微信分享");
  // wxShare.getSign();
});

export default router;
