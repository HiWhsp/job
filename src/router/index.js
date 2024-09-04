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


  // 登录相关
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
