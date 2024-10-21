import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store"; // 导入 store 实例
import logoImgSrc1 from "@/assets/img/head/logo1.png";
import logoImgSrc2 from "@/assets/img/head/logo2.jpg";
import searchImgSrc from "@/assets/img/head/search.png";
import searchImgSrcDark from "@/assets/img/head/search-dark.png";
import cartImgSrc from "@/assets/img/head/cart.png";
import cartImgSrcDark from "@/assets/img/head/cart-dark.png";
import personImgSrc from "@/assets/img/head/person.png";
import personImgSrcDark from "@/assets/img/head/person-dark.png";

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

const routes = [
  // 首页
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "index",
    component: () =>
      import(/* webpackChunkName: "index" */ "@/views/index.vue"),
    meta: {},
  },
  // 服务支持
  {
    path: "/service-support",
    name: "service-support",
    component: () => import("@/views/service/index.vue"),
    redirect: "/download-materials",
    children: [
      {
        path: "/download-materials",
        name: "download-materials",
        component: () => import("@/views/service/download-materials.vue"),
      },
      {
        path: "/merchant-cooperation",
        name: "merchant-cooperation",
        component: () => import("@/views/service/merchant-cooperation.vue"),
      },
      {
        path: "/member-benefits",
        name: "member-benefits",
        component: () => import("@/views/service/member-benefits.vue"),
      },
      {
        path: "/technical-article",
        name: "technical-article",
        component: () => import("@/views/service/technical-article.vue"),
      },
      {
        path: "/complaints-suggestions",
        name: "complaints-suggestions",
        component: () => import("@/views/service/complaints-suggestions.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "index" */ "@/views/login/index.vue"),
    meta: {},
  },
  // 全部商品
  {
    path: "/allCommodities",
    name: "allCommodities",
    component: () =>
      import(
        /* webpackChunkName: "index" */ "@/views/allCommodities/index.vue"
        ),
  },

  // 光电实验室
  {
    path: "/laboratory",
    name: "laboratory",
    component: () =>
      import(
        /* webpackChunkName: "index" */ "@/views/laboratory/index.vue"
        ),
  },

  // 一键选型
  {
    path: "/oneClickSelection",
    name: "oneClickSelection",
    component: () =>
      import(
        /* webpackChunkName: "index" */ "@/views/oneClickSelection/index.vue"
        ),
  },

  // 产品详情
  {
    path: "/productDetail",
    name: "productDetail",
    component: () => import("@/views/productDetail/index.vue"),
  },
  // 产品购物车
  {
    path: "/productCart",
    name: "productCart",
    component: () => import("@/views/productDetail/cart.vue"),
  },
  // 产品下单
  {
    path: "/order",
    name: "order",
    component: () => import("@/views/productDetail/order.vue"),
  },
  // 下单成功
  {
    path: "/orderCompleted",
    name: "orderCompleted",
    component: () => import("@/views/productDetail/order-completed.vue"),
  },
  // 产品对比
  {
    path: "/productComparison",
    name: "productComparison",
    component: () => import("@/views/productComparison/index.vue"),
  },

  //积分换购赢好礼
  {
    path: "/integralWinGoods",
    name: "integralWinGoods",
    component: () => import("@/views/integral/integral-win-goods.vue"),
  },
  // 积分详情
  {
    path: "/pointsMallDetail",
    name: "pointsMallDetail",
    component: () => import("@/views/integral/pointsMallDetail.vue"),
  },

  //促销活动
  {
    path: "/salesPromotion",
    name: "salesPromotion",
    component: () => import("@/views/integral/sales-promotion.vue"),
  },


  /** 个人中心 **/
  {
    path: "/my",
    name: "my",
    component: () => import("@/views/my/my.vue"),
    redirect: "/member-center",
    meta: {
      requireAuth: true,
    },
    children: [
      // 会员中心
      {
        path: "/member-center",
        name: "member-center",
        component: () => import("@/views/my/member/member-center.vue"),
        meta: {
          title: "会员中心",
          requireAuth: true,
        },
      },
      {
        path: "/order-list",
        name: "order-list",
        component: () => import("@/views/my/order/order-list.vue"),
        meta: {
          title: "订单列表",
          requireAuth: true,
        },
      },
      {
        path: "/order-logistics",
        name: "order-logistics",
        component: () => import("@/views/my/order/order-logistics.vue"),
        meta: {
          title: "物流信息",
          requireAuth: true,
        },
      },
      {
        path: "/order-detail",
        name: "order-detail",
        component: () => import("@/views/my/order/order-detail.vue"),
        meta: {
          title: "订单详情",
          requireAuth: true,
        },
      },
      {
        path: "/refund-list",
        name: "refund-list",
        component: () => import('@/views/my/refund/myRefund.vue'),
        meta: {
          title: "售后订单",
          requireAuth: true,
        },
      },
      {
        path: '/refundType',
        name: 'refundType',
        component: () => import('@/views/my/refund/refundType.vue'),
        meta: {
          title: "售后类型",
          requireAuth: true,
        }
      },
      {
        path: '/refundSubmit',
        name: 'refundSubmit',
        component: () => import('@/views/my/refund/refundSubmit.vue'),
        meta: {
          title: "售后提交",
          requireAuth: true,
        }
      },
      {
        path: "/refund-detail",
        name: "refund-detail",
        component: () => import('@/views/my/refund/refundServiceDetail.vue'),
        meta: {
          title: "售后详情",
          requireAuth: true,
        },
      },
      {
        path: "/invoice-info",
        name: "invoice-info",
        component: () => import("@/views/my/invoice/invoice-info.vue"),
        meta: {
          title: "发票信息",
          requireAuth: true,
        },
      },
      {
        path: "/invoice-details",
        name: "invoice-details",
        component: () => import("@/views/my/invoice/invoice-details.vue"),
        meta: {
          title: "开票详情",
          requireAuth: true,
        },
      },
      {
        path: "/laser-order",
        name: "laser-order",
        component: () => import("@/views/my/laser/laser-order.vue"),
        meta: {
          title: "激光加工订单",
          requireAuth: true,
        },
      },
      {
        path: "/laser-detail",
        name: "laser-detail",
        component: () => import("@/views/my/laser/laser-detail.vue"),
        meta: {
          title: "激光加工订单详情",
          requireAuth: true,
        },
      },
      {
        path: "/coupon-list",
        name: "coupon-list",
        component: () => import("@/views/my/coupon/myCoupon.vue"),
        meta: {
          title: "我的优惠券",
          requireAuth: true,
        },
      },
      {
        path: "/couponCenter",
        name: "couponCenter",
        component: () => import("@/views/my/coupon/couponCenter.vue"),
        meta: {
          title: "领券中心",
          requireAuth: true,
        },
      },
      {
        path: "/pointsDetail",
        name: "pointsDetail",
        component: () => import("@/views/my/points/pointsDetail.vue"),
        meta: {
          title: "我的积分",
          requireAuth: true,
        },
      },
      {
        path: "/feedback",
        name: "feedback",
        component: () => import("@/views/my/feedback/feedback.vue"),
        meta: {
          title: "积分商城",
          requireAuth: true,
        },
      },
      {
        path: "/address-list",
        name: "address-list",
        component: () => import("@/views/my/address/address-list.vue"),
        meta: {
          title: "我的地址",
          requireAuth: true,
        },
      },
      {
        path: "/my-collection",
        name: "my-collection",
        component: () => import("@/views/my/collection/my-collection.vue"),
        meta: {
          title: "我的收藏",
          requireAuth: true,
        },
      },
      {
        path: "/my-info",
        name: "my-info",
        component: () => import("@/views/my/my-info.vue"),
        meta: {
          title: "个人信息",
          requireAuth: true,
        },
      },
      {
        path: "/change-password",
        name: "change-password",
        component: () => import("@/views/my/change-password.vue"),
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
  if (to.name == "technologyCenter") {
    let scrollTop = document.documentElement.scrollTop;
    return {x: 0, y: scrollTop};
  }
  return {x: 0, y: 0};
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

  // if (!user_is_login && to.meta.requireAuth) {
  //   alertErr("请先登录");
  //   next("/login");
  //   next();
  // } else {
  // }
  if (to.path === "/index") {
    store.dispatch("setPageHeaderBackground", "transparent");
    store.dispatch("setIconImgSrc", logoImgSrc1);
    store.dispatch("setColor", "#fff");
    store.dispatch("setSearchImgSrc", searchImgSrc);
    store.dispatch("setCartImgSrc", cartImgSrc);
    store.dispatch("setPersonImgSrc", personImgSrc);
  } else {
    store.dispatch("setPageHeaderBackground", "#fff");
    store.dispatch("setIconImgSrc", logoImgSrc2);
    store.dispatch("setColor", "#27417C");
    store.dispatch("setSearchImgSrc", searchImgSrcDark);
    store.dispatch("setCartImgSrc", cartImgSrcDark);
    store.dispatch("setPersonImgSrc", personImgSrcDark);
  }
  next();
});

export default router;
