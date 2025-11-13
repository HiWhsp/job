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

const layout = () => import("@/views/layout.vue");
const login = () => import("@/views/login/login.vue"); //登录

const project = () => import("@/views/project/project.vue");
const setting = () => import("@/views/setting/setting.vue");
const audit_record = () => import("@/views/audit_record/audit_record.vue");
const view_permission = () => import("@/views/view_permission/view_permission.vue");

const routes = [
  {
    path: "/",
    name: "index",
    component: login,
    meta: {
      title: "网站概览",
      deep: 1,
    },
  },
  {
    path: "/login",
    name: "login",
    component: login,
    meta: {
      title: "登录",
    },
  },
  {
    path: "/layout",
    name: "layout",
    component: layout,
    meta: {
      title: "内页",
    },
    children: [
      {
        path: "/project",
        name: "project",
        component: project,
        meta: {
          title: "项目管理",
        },
      },
      {
        path: "/audit-record",
        name: "audit-record",
        component: audit_record,
        meta: {
          title: "审核记录",
        },
      },
      {
        path: "/view-permission",
        name: "view-permission",
        component: view_permission,
        meta: {
          title: "查看权限",
        },
      },
      {
        path: "/setting",
        name: "setting",
        component: setting,
        meta: {
          title: "设置",
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
  // console.log('滚动行为', to, from, savedPosition)
  return {
    x: 0,
    y: 0,
  };
};

const router = new VueRouter({
  routes,
  base: "/",
  // base: "/admin",
  mode: "history",
  scrollBehavior,
});

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token");
  let userId = localStorage.getItem("userId");
  let is_login_curr = token && userId;

  // debugger
  // if (!is_login_curr && to.meta.requireAuth) {
  // 	// debugger
  // 	alertErr("请先登录");
  // 	next("/login");
  // } else {
  // 	next();
  // }

  next();
});

router.afterEach((to, from) => {
  // console.log("切换导航, 重新配置微信分享");
  // wxShare.getSign();
});

export default router;
