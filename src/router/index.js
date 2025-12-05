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
const otherLogin = () => import(/* webpackChunkName: "otherLogin" */ "@/views/account/other-login.vue");
const register = () => import(/* webpackChunkName: "register" */ "@/views/account/register.vue");
const retrieve = () => import(/* webpackChunkName: "passwordReset" */ "@/views/account/retrieve.vue");
const contractList = () => import(/* webpackChunkName: "contractList" */ "@/views/contractList.vue");
const contractDetail = () => import(/* webpackChunkName: "contractDetail" */ "@/views/contractDetail.vue");
const paySuccess = () => import(/* webpackChunkName: "paySuccess" */ "@/views/pay-success.vue");

const myIndex = () => import(/* webpackChunkName: "myIndex" */ "@/views/my/myIndex.vue");
const myOrders = () => import(/* webpackChunkName: "myOrders" */ "@/views/my/orders.vue");
const myOrderDetail = () => import(/* webpackChunkName: "myOrderDetail" */ "@/views/my/orderDetail.vue");
const myDownloads = () => import(/* webpackChunkName: "myDownloads" */ "@/views/my/downloads.vue");
const myProfile = () => import(/* webpackChunkName: "myProfile" */ "@/views/my/profile.vue");
const myPassword = () => import(/* webpackChunkName: "myPassword" */ "@/views/my/password.vue");
const about = () => import(/* webpackChunkName: "about" */ "@/views/company/about.vue");
const contact = () => import(/* webpackChunkName: "contact" */ "@/views/company/contact.vue");
const help = () => import(/* webpackChunkName: "help" */ "@/views/company/help.vue");
const protocol = () => import(/* webpackChunkName: "protocol" */ "@/views/company/protocol.vue");
const news = () => import(/* webpackChunkName: "news" */ "@/views/company/news.vue");
const newsDetail = () => import(/* webpackChunkName: "newsDetail" */ "@/views/company/newsDetail.vue");

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
  {
    path: "/otherLogin",
    name: "otherLogin",
    component: otherLogin,
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

  // 合同列表
  {
    path: "/contractList",
    name: "文档中心",
    component: contractList,
    meta: {},
  },

  // 合同详情
  {
    path: "/contractDetail",
    name: "合同详情",
    component: contractDetail,
    meta: {},
  },

  // 支付成功
  {
    path: "/pay-success",
    name: "支付成功",
    component: paySuccess,
    meta: {},
  },

  {
    path: "/news",
    name: "新闻资讯",
    component: news,
    meta: {},
  },
  {
    path: "/newsDetail",
    name: "新闻详情",
    component: newsDetail,
    meta: {},
  },
  // 我的 - 会员中心
  {
    path: "/my",
    name: "个人中心",
    component: myIndex,
    redirect: "/orders",
    meta: {},
    children: [
      {
        path: "orders",
        name: "我的订单",
        component: myOrders,
        meta: {},
      },
      {
        path: "order-detail",
        name: "订单详情",
        component: myOrderDetail,
        meta: {},
      },
      {
        path: "downloads",
        name: "下载记录",
        component: myDownloads,
        meta: {},
      },
      {
        path: "profile",
        name: "个人资料",
        component: myProfile,
        meta: {},
      },
      {
        path: "password",
        name: "修改密码",
        component: myPassword,
        meta: {},
      },
    ],
  },

  // 关于我们
  {
    path: "/about",
    name: "关于我们",
    component: about,
    meta: {},
  },
  // 联系我们
  {
    path: "/contact",
    name: "联系我们",
    component: contact,
    meta: {},
  },
  // 帮助中心
  {
    path: "/help",
    name: "帮助中心",
    component: help,
    meta: {},
  },
  // 平台协议
  {
    path: "/protocol",
    name: "平台协议",
    component: protocol,
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
