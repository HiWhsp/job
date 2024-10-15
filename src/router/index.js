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
import personImgSrcDark from "@/assets/img/head/person.png";

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

  // 一键选型
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
  // 商品分类
  {
    path: "/productCategories",
    name: "productCategories",
    component: () => import("@/views/product/classify.vue"),
  },

  /** 导航路由 **/
  // 特惠商城
  {
    path: "/discountShop",
    name: "discountShop",
    component: () => import("@/views/nav/discountShop.vue"),
  },
  // 低价商城
  {
    path: "/lowPriceShop",
    name: "lowPriceShop",
    component: () => import("@/views/nav/lowPriceShop.vue"),
  },
  // 每月新款
  {
    path: "/newMonthShop",
    name: "newMonthShop",
    component: () => import("@/views/nav/newMonthShop.vue"),
  },
  // 非标定制
  {
    path: "/nonstandard",
    name: "nonstandard",
    component: () => import("@/views/nav/nonstandard.vue"),
  },
  // 非标定制提交成功页面
  {
    path: "/nonstandard_success",
    name: "nonstandard_success",
    component: () => import("@/views/nav/nonstandard_success.vue"),
  },
  // 快速报价
  {
    path: "/fastQuotation",
    name: "fastQuotation",
    component: () => import("@/views/nav/fastQuotation.vue"),
  },

  /** 登录相关 **/
  {
    path: "/retrieve",
    name: "retrieve",
    component: () => import("@/views/account/retrieve.vue"),
  },

  // 积分换购
  // {
  //   path: "/retrieve",
  //   name: "retrieve",
  //   component: () => import("@/views/account/retrieve.vue"),
  // }

  /** 订单相关 **/
  {
    path: "/orderSubmit",
    name: "orderSubmit",
    component: () => import("@/views/my/order/order-submit.vue"),
  },

  //积分换购赢好礼
  {
    path: "/integralWinGoods",
    name: "integralWinGoods",
    component: () => import("@/views/integral/integral-win-goods.vue"),
  },
  //积分商城详情
  {
    path: "/integralShopDetail",
    name: "integralShopDetail",
    component: () => import("@/views/integral/integral-shop-detail.vue"),
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
      // {
      //   path: "/my-index",
      //   name: "my-index",
      //   component: () => import("@/views/my/my-index.vue"),
      //   meta: {
      //     title: "会员中心",
      //     requireAuth: true,
      //   },
      // },
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
        path: "/order-quotation-list",
        name: "order-quotation-list",
        component: () => import("@/views/my/order/order-quotation-list.vue"),
        meta: {
          title: "报价单列表",
          requireAuth: true,
        },
      },
      {
        path: "/order-quotation-detail",
        name: "order-quotation-detail",
        component: () => import("@/views/my/order/order-quotation-detail.vue"),
        meta: {
          title: "报价单详情",
          requireAuth: true,
        },
      },
      {
        path: "/refund-list",
        name: "refund-list",
        component: () => import("@/views/my/refund/myRefund.vue"),
        meta: {
          title: "售后订单",
          requireAuth: true,
        },
      },
      {
        path: "/after-sales-order",
        name: "after-sales-order",
        component: () => import("@/views/my/refund/after-sales-order.vue"),
        meta: {
          title: "售后订单",
          requireAuth: true,
        },
      },
      {
        path: "/apply-after-sales",
        name: "apply-after-sales",
        component: () => import("@/views/my/refund/apply-after-sales.vue"),
        meta: {
          title: "申请售后",
          requireAuth: true,
        },
      },
      {
        path: "/after-sale-exchange-goods",
        name: "after-sale-exchange-goods",
        component: () => import("@/views/my/refund/after-sale-exchange-goods.vue"),
        meta: {
          title: "申请换货",
          requireAuth: true,
        },
      },
      {
        path: "/exchange-goods-result",
        name: "exchange-goods-result",
        component: () => import("@/views/my/refund/exchange-goods-result.vue"),
        meta: {
          title: "换货结果",
          requireAuth: true,
        },
      },
      {
        path: "/apply-result",
        name: "apply-result",
        component: () => import("@/views/my/refund/apply-result.vue"),
        meta: {
          title: "申请结果",
          requireAuth: true,
        },
      },
      {
        path: "/after-sale-order",
        name: "after-sale-order",
        component: () => import("@/views/my/refund/after-sale-order.vue"),
        meta: {
          title: "售后订单",
          requireAuth: true,
        },
      },
      {
        path: "/after-sale-refund-return",
        name: "after-sale-refund-return",
        component: () =>
          import("@/views/my/refund/after-sale-refund-return.vue"),
        meta: {
          title: "售后订单",
          requireAuth: true,
        },
      },
      {
        path: "/after-sale-refund-detail",
        name: "after-sale-refund-detail",
        component: () =>
          import("@/views/my/refund/after-sale-refund-detail.vue"),
        meta: {
          title: "售后订单",
          requireAuth: true,
        },
      },
      {
        path: "/refund-detail",
        name: "refund-detail",
        component: () => import("@/views/my/refund/refundServiceDetail.vue"),
        meta: {
          title: "售后详情",
          requireAuth: true,
        },
      },
      {
        path: "/cart",
        name: "cart",
        component: () => import("@/views/my/cart/cart.vue"),
        meta: {
          title: "购物车",
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
        path: "/invoice-list",
        name: "invoice-list",
        component: () => import("@/views/my/invoice-list.vue"),
        meta: {
          title: "发票信息",
          requireAuth: true,
        },
      },
      {
        path: "/invoice-detail",
        name: "invoice-detail",
        component: () => import("@/views/my/invoice-detail.vue"),
        meta: {
          title: "发票信息",
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
        path: "/review-list",
        name: "review-list",
        component: () => import("@/views/my/order/my-review-list.vue"),
        meta: {
          title: "评价列表",
          requireAuth: true,
        },
      },
      {
        path: "/review-submit",
        name: "review-submit",
        component: () => import("@/views/my/order/order-review-submit.vue"),
        meta: {
          title: "评价提交",
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
        path: "/pointsMall",
        name: "pointsMall",
        component: () => import("@/views/my/points/pointsMall.vue"),
        //component: () => import("@/views/integral/integral-win-goods.vue"),
        meta: {
          title: "积分商城",
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
  let userId = localStorage.getItem("user_id");
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
    // store.dispatch("setPersonImgSrc", personImgSrcDark);
    store.dispatch("setPersonImgSrc", cartImgSrcDark);
  }
  next();
});

export default router;
