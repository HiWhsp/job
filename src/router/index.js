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

const login = () => import(/* webpackChunkName: "login" */ "@/views/account/login.vue");
const register = () => import(/* webpackChunkName: "register" */ "@/views/account/register.vue");
const retrieve = () => import(/* webpackChunkName: "passwordReset" */ "@/views/account/retrieve.vue");
const contractDetail = () => import(/* webpackChunkName: "contractDetail" */ "@/views/contractDetail.vue");

const myIndex = () => import(/* webpackChunkName: "myIndex" */ "@/views/my/myIndex.vue");
const about = () => import(/* webpackChunkName: "about" */ "@/views/company/about.vue");
const business = () => import(/* webpackChunkName: "business" */ "@/views/company/business.vue");
const contact = () => import(/* webpackChunkName: "contact" */ "@/views/company/contact.vue");

const routes = [
  // 首页
  {
    path: "/",
    name: "首页",
    component: index,
    meta: {},
  },
  // 登录
  {
    path: "/login",
    name: "login",
    component: login,
    meta: {},
  },
  // 注册
  {
    path: "/register",
    name: "register",
    component: register,
    meta: {},
  },
  // 找回密码
  {
    path: "/retrieve",
    name: "retrieve",
    component: retrieve,
    meta: {},
  },

  // 合同详情
  {
    path: "/contractDetail",
    name: "contractDetail",
    component: contractDetail,
    meta: {},
  },

  // 我的
  {
    path: "/my",
    name: "my",
    component: myIndex,
    meta: {},
  },

  // 关于我们
  {
    path: "/about",
    name: "关于我们",
    component: about,
    meta: {},
  },
  // 业务范围
  {
    path: "/business",
    name: "业务范围",
    component: business,
    meta: {},
  },
  // 联系我们
  {
    path: "/contact",
    name: "联系我们",
    component: contact,
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
