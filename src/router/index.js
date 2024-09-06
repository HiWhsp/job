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

const routes = [
  // 首页
  {
    path: "/",
    name: "index",
    component: () => import(/* webpackChunkName: "index" */ "@/views/index.vue"),
    meta: {},
  },

  /** 商品相关 **/
  // 商品分类
  {
    path: '/productCategories',
    name: "productCategories",
    component: () => import('@/views/product/classify.vue')
  },
  // 商品详情
  {
    path: '/productDetail',
    name: "productCategories",
    component: () => import('@/views/product/detail.vue')
  },

  /** 导航路由 **/
  // 特惠商城
  {
    path: '/discountShop',
    name: 'discountShop',
    component: () => import('@/views/nav/discountShop.vue')
  },
  // 低价商城
  {
    path: '/lowPriceShop',
    name: 'lowPriceShop',
    component: () => import('@/views/nav/lowPriceShop.vue')
  },
  // 每月新款
  {
    path: '/newMonthShop',
    name: 'newMonthShop',
    component: () => import('@/views/nav/newMonthShop.vue')
  },
  // 非标定制
  {
    path: '/nonstandard',
    name: 'nonstandard',
    component: () => import('@/views/nav/nonstandard.vue')
  },
  // 非标定制提交成功页面
  {
    path: '/nonstandard_success',
    name: 'nonstandard_success',
    component: () => import('@/views/nav/nonstandard_success.vue')
  },
  // 快速报价
  {
    path: '/fastQuotation',
    name: 'fastQuotation',
    component: () => import('@/views/nav/fastQuotation.vue')
  },


  /** 登录相关 **/
  {
    path: '/register',
    name: "register",
    component: () => import('@/views/account/register.vue')
  },
  {
    path: '/login',
    name: "login",
    component: () => import('@/views/account/login.vue')
  },
  {
    path: '/retrieve',
    name: "retrieve",
    component: () => import('@/views/account/retrieve.vue')
  },

  // 购物车
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/cart/cart.vue')
  },

  /** 订单相关 **/
  {
    path: '/orderSubmit',
    name: 'orderSubmit',
    component: () => import('@/views/order/order-submit.vue')
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

  // debugger
  if (!user_is_login && to.meta.requireAuth) {
    // debugger
    alertErr("请先登录");
    next("/login");
  } else {
    next();
  }
});

export default router;
