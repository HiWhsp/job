import Vue from "vue";
import VueRouter from "vue-router";
import ellsennRouter from "./router";

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
// 个人中心
const my_layout = () => import("@/views/my/my-layout.vue");

const my_info = () =>
  import(/* webpackChunkName: "my-info" */ "@/views/my/my-info.vue");
const my_vip = () =>
  import(/* webpackChunkName: "my-vip" */ "@/views/my/my-vip.vue");
const my_company_info = () =>
  import(/* webpackChunkName: "my-company-info" */ "@/views/my/my-company-info.vue");
const my_collection = () =>
  import(/* webpackChunkName: "my-collection" */ "@/views/my/my-collection.vue");
const my_comment = () =>
  import(/* webpackChunkName: "my-comment" */ "@/views/my/my-comment.vue");
const my_message = () =>
  import(/* webpackChunkName: "my-message" */ "@/views/my/my-message.vue");
const edit_password = () =>
  import(/* webpackChunkName: "edit-password" */ "@/views/my/edit-password.vue");

const routes = [
  ...ellsennRouter,
  // 首页
  {
    path: "/",
    name: "index",
    component: index,
    meta: {},
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
        path: "/my-info",
        name: "my-info",
        component: my_info,
        meta: {
          title: "个人信息",
          requireAuth: true,
        },
      },
      {
        path: "/my-vip",
        name: "my-vip",
        component: my_vip,
        meta: {
          title: "会员中心",
          requireAuth: true,
        },
      },
      {
        path: "/my-company-info",
        name: "my-company-info",
        component: my_company_info,
        meta: {
          title: "企业信息",
          requireAuth: true,
        },
      },
      {
        path: "/my-collection",
        name: "my-collection",
        component: my_collection,
        meta: {
          title: "我的收藏",
          requireAuth: true,
        },
      },
      {
        path: "/my-comment",
        name: "my-comment",
        component: my_comment,
        meta: {
          title: "我的评论",
          requireAuth: true,
        },
      },
      {
        path: "/my-message",
        name: "my-message",
        component: my_message,
        meta: {
          title: "消息中心",
          requireAuth: true,
        },
      },
      {
        path: "/edit-password",
        name: "edit-password",
        component: edit_password,
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
  // let userId = localStorage.getItem("userId");
  let user_is_login = token;

  // debugger
  if (!user_is_login && to.meta.requireAuth) {
    // debugger
    alertErr("请先登录");
    Vue.prototype.$showLogin({
      onLoginSuccess: (data) => {
        console.log('登录成功:', data)
        // 处理登录成功逻辑
      },
      onRegisterSuccess: (data) => {
        console.log('注册成功:', data)
      },
      onGetCode: ({ type, account }) => {
        console.log('获取验证码:', type, account)
        // 调用实际的验证码接口
      }
    });
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  // //console.log("切换导航, 重新配置微信分享");
  // wxShare.getSign();
});

export default router;
