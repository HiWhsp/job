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

const pages = () => import("@/views/test/pages.vue");
const layout = () => import("@/views/layout.vue");
const login = () => import("@/views/login/login.vue"); //登录

//奕诚需要页面
const student = () => import("@/views/student/student.vue");
const teacher = () => import("@/views/teacher/teacher.vue");
const statistics = () => import("@/views/statistics/statistics.vue");
const question = () => import("@/views/question/question.vue");
const setting = () => import("@/views/setting/setting.vue");

const routes = [
  {
    path: "/pages",
    name: "pages",
    component: pages,
    meta: {
      title: "pages",
    },
  },
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
  // {
  // 	path: "/",
  // 	name: "index",
  // 	component: index,
  // 	meta: {
  // 		title: '概览'
  // 	},
  // },
  {
    path: "/layout",
    name: "layout",
    component: layout,
    meta: {
      title: "内页",
    },
    children: [
      {
        path: "/student",
        name: "student",
        component: student,
        meta: {
          title: "学生中心",
        },
      },
      {
        path: "/teacher",
        name: "teacher",
        component: teacher,
        meta: {
          title: "老师中心",
        },
      },
      {
        path: "/statistics",
        name: "statistics",
        component: statistics,
        meta: {
          title: "数据汇总",
        },
      },
      {
        path: "/question",
        name: "question",
        component: question,
        meta: {
          title: "问题汇总",
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
