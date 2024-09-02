import Vue from "vue";
import store from "../store/index";
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
const about = () =>
  import(/* webpackChunkName: "about" */ "@/views/company/about.vue");

const contact = () =>
  import(/* webpackChunkName: "contact" */ "@/views/company/contact.vue");

// 账号相关
const register = () =>
  import(/* webpackChunkName: "register" */ "@/views/account/register.vue");
const login = () =>
  import(/* webpackChunkName: "login" */ "@/views/account/login.vue");
const retrieve = () =>
  import(/* webpackChunkName: "retrieve" */ "@/views/account/retrieve.vue");

//产品
const product_cates = () =>
  import(
    /* webpackChunkName: "product-cates" */ "@/views/product/product-cates.vue"
  );
const product_search = () =>
  import(
    /* webpackChunkName: "product-search" */ "@/views/product/product-search.vue"
  );
const product_detail = () =>
  import(
    /* webpackChunkName: "product-detail" */ "@/views/product/product-detail.vue"
  );

// 下单
const cart = () =>
  import(/* webpackChunkName: "cart" */ "@/views/cart/cart.vue");
const order_submit = () =>
  import(
    /* webpackChunkName: "order-submit" */ "@/views/order/order-submit.vue"
  );
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

const browse_history = () =>
  import(
    /* webpackChunkName: "browse-history" */ "@/views/browse/browse-history.vue"
  );
const favorite_list = () =>
  import(
    /* webpackChunkName: "favorite-list" */ "@/views/favorite/favorite-list.vue"
  );

const payment_methods = () =>
  import(
    /* webpackChunkName: "payment-methods" */ "@/views/payment/payment-methods.vue"
  );
// 支付
// const zfbPay = () => import(/* webpackChunkName: "zfbPay" */ "@/views/pay/zfbPay.vue");
const payment_success = () =>
  import(/* webpackChunkName: "payment-success" */ "@/views/payment/payment-success.vue");

const order_list = () =>
  import(/* webpackChunkName: "order-list" */ "@/views/order/order-list.vue");
const order_detail = () =>
  import(
    /* webpackChunkName: "order-detail" */ "@/views/order/order-detail.vue"
  );
// const points-order-detail = () => import(/* webpackChunkName: "points-order-detail" */ "@/views/order/points-order-detail.vue");
const order_review_submit = () =>
  import(/* webpackChunkName: "order-review-submit" */ "@/views/review/order-review-submit.vue");
// const orderLogistics = () => import(/* webpackChunkName: "orderLogistics" */ "@/views/order/orderLogistics.vue");

// 用户中心
const my = () => import("@/views/my/my.vue");

const change_password = () =>
  import(
    /* webpackChunkName: "change-password" */ "@/views/my/change-password.vue"
  );


const my_index = () =>
  import(/* webpackChunkName: "my-index" */ "@/views/my/my-index.vue");
// const memberCenter = () => import(/* webpackChunkName: "memberCenter" */ "@/views/my/member/memberCenter.vue");
const my_review_list = () =>
  import(
    /* webpackChunkName: "my-review-list" */ "@/views/review/my-review-list.vue"
  );

// const myCoupon = () => import("@/views/my/coupon/myCoupon.vue");
// const couponCenter = () => import("@/views/my/coupon/couponCenter.vue");
// const feedback = () => import("@/views/service/feedback.vue");
// const helpCenter = () => import("@/views/service/helpCenter.vue");

// 售后
// const refundFeedback = () => import(/* webpackChunkName: "refundFeedback" */ "@/views/my/refundFeedback.vue");
// const myRefund = () => import("@/views/refund/myRefund.vue");
// const refundType = () => import("@/views/refund/refundType.vue");
// const refundSubmit = () => import("@/views/refund/refundSubmit.vue");
// const refundServiceDetail = () =>
//   import("@/views/refund/refundServiceDetail.vue");
// const orderRefundStep3 = () => import("@/views/refund/orderRefundStep3.vue");

const routes = [
  // 首页
  {
    path: "/",
    name: "index",
    component: index,
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
  // 修改密码
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

//
//
//
//
//
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
    component: my,
    meta: {
      requireAuth: true,
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
      // {
      //   path: "/orderLogistics",
      //   name: "orderLogistics",
      //   component: orderLogistics,
      //   meta: {
      //     title: "订单物流",
      //     requireAuth: true,
      //
      //   },
      // },
      {
        path: "/order-review-submit",
        name: "order-review-submit",
        component: order_review_submit,
        meta: {
          title: "订单评价",
          requireAuth: true,
        },
      },

      // {
      //   path: "/refundType",
      //   name: "refundType",
      //   component: refundType,
      //   meta: {
      //     title: "我的售后",
      //     requireAuth: true,
      //   },
      // },
      // {
      //   path: "/refundSubmit",
      //   name: "refundSubmit",
      //   component: refundSubmit,
      //   meta: {
      //     title: "我的售后",
      //     requireAuth: true,
      //   },
      // },
      // {
      //   path: "/refundServiceDetail",
      //   name: "refundServiceDetail",
      //   component: refundServiceDetail,
      //   meta: {
      //     title: "我的售后",
      //     requireAuth: true,
      //   },
      // },
      // {
      //   path: "/orderRefundStep3",
      //   name: "orderRefundStep3",
      //   component: orderRefundStep3,
      //   meta: {
      //     title: "我的售后",
      //     requireAuth: true,
      //   },
      // },
      // {
      //   path: "/myRefund",
      //   name: "myRefund",
      //   component: myRefund,
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
