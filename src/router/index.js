import Vue from "vue";
import store from "../store/index";
import VueRouter from "vue-router";
// import { component } from "vue/types/umd";

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
const aiRecommendation = () => import(/* webpackChunkName: "aiRecommendation" */ "@/views/aiRecommendation.vue");
const rebotPreview = () => import(/* webpackChunkName: "rebotPreview" */ "@/views/rebotPreview.vue");
const h5rebotPreview = () => import(/* webpackChunkName: "h5rebotPreview" */ "@/views/h5rebotPreview.vue");

// 翼菲后台管理页面
const admin = () => import(/* webpackChunkName: "admin" */ "@/views/admin/index.vue");
const adminOrder = () => import(/* webpackChunkName: "adminOrder" */ "@/views/admin/adminOrder.vue");
const adminOrderDetail = () => import(/* webpackChunkName: "adminOrderDetail" */ "@/views/admin/adminOrderDetail.vue");
const routes = [
  // 首页
  {
    path: "/",
    name: "首页",
    component: index,
    meta: {},
  },
  {
    path: "/aiRecommendation",
    name: "AI推荐",
    component: aiRecommendation,
    meta: {},
  },
  {
    path: "/rebotPreview",
    name: "机器人预览",
    component: rebotPreview,
    meta: {},
  },
  {
    path: "/myAdmin",
    name: "翼菲后台管理",
    component: admin,
    meta: {},
  },
  {
    path: "/myAdminOrder",
    name: "翼非官网后台管理系统",
    component: adminOrder,
    meta: {},
  },
  {
    path: "/myAdminOrderDetail",
    name: "翼非官网后台管理系统详情",
    component: adminOrderDetail,
    meta: {},
  },
  {
    path: "/h5rebotPreview",
    name: "h5机器人预览",
    component: h5rebotPreview,
    meta: {},
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
