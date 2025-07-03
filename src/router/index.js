import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/index.js";

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
const my_follows = () =>
  import(/* webpackChunkName: "my-follows" */ "@/views/my/my-follows.vue");
const my_message = () =>
  import(/* webpackChunkName: "my-message" */ "@/views/my/my-message.vue");
const edit_password = () =>
  import(/* webpackChunkName: "edit-password" */ "@/views/my/edit-password.vue");
const demand_form = () =>
  import(/* webpackChunkName: "demand-form" */ "@/views/my/demand-form.vue");
const demand_list = () =>
  import(/* webpackChunkName: "demand-list" */ "@/views/my/demand-list.vue");
const demand_detail = () =>
  import(/* webpackChunkName: "demand-detail" */ "@/views/my/demand-detail.vue");
const service_list = () =>
  import(/* webpackChunkName: "service-list" */ "@/views/my/service-list.vue");
const service_detail = () =>
  import(/* webpackChunkName: "service-detail" */ "@/views/my/service-detail.vue");

const routes = [
  // 首页
  {
    path: "/",
    name: "index",
    component: index,
    meta: {},
  },
  // 注册
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/account/register.vue"),
  },
  // 帮助
  {
    path: "/help",
    name: "help",
    component: () => import("@/views/navBar/help.vue"),
  },
  // 反馈
  {
    path: "/feedback",
    name: "feedback",
    component: () => import("@/views/navBar/feedback.vue"),
  },
  // 合作
  {
    path: "/cooperation",
    name: "cooperation",
    component: () => import("@/views/navBar/cooperation.vue"),
  },
  // 搜索列表
  {
    path: "/searchList",
    name: "searchList",
    component: () => import("@/views/search/searchList.vue"),
    meta: {
      title: "搜索列表",
    },
  },
  // 文章详情
  {
    path: "/article-detail",
    name: "article-detail",
    component: () => import("@/views/product/article-detail.vue"),
    meta: {
      title: "文章详情",
    },
  },
  // 系统制造商列表
  {
    path: "/system-manufacturer-list",
    name: "system-manufacturer-list",
    component: () => import("@/views/product/system-manufacturer-list.vue"),
    meta: {
      title: "系统制造商列表",
    },
  },
  {
    path: "/manufacturer-detail",
    name: "manufacturer-detail",
    component: () => import("@/views/product/manufacturer-detail.vue"),
    meta: {
      title: "系统制造商详情",
    },
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
        path: "/my-follows",
        name: "my-follows",
        component: my_follows,
        meta: {
          title: "我的关注",
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
      {
        path: "/demand-form",
        name: "demand-form",
        component: demand_form,
        meta: {
          title: "填报需求",
          requireAuth: true,
        },
      },
      {
        path: "/demand-list",
        name: "demand-list",
        component: demand_list,
        meta: {
          title: "我的需求",
          requireAuth: true,
        },
      },
      {
        path: "/demand-detail",
        name: "demand-detail",
        component: demand_detail,
        meta: {
          title: "需求详情",
          requireAuth: true,
        },
      },
      {
        path: "/service-list",
        name: "service-list",
        component: service_list,
        meta: {
          title: "需求工单管理",
          requireAuth: true,
        },
      },
      {
        path: "/service-detail",
        name: "service-detail",
        component: service_detail,
        meta: {
          title: "需求工单详情",
          requireAuth: true,
        },
      },
    ],
  },
  // 服务商
  {
    path: "/service-provider",
    name: "service-provider",
    component: () => import("@/views/service/service_layout.vue"),
    meta: {
      title: "服务商",
    },
    children: [
      {
        path: "/service-provider-list",
        name: "service-provider-list",
        component: () => import("@/views/service/service_provider_list.vue"),
        meta: {
          title: "服务商工单管理",
          requireAuth: true,
        },
      },
      {
        path: "/service-provider-detail",
        name: "service-provider-detail",
        component: () => import("@/views/service/service_provider_detail.vue"),
        meta: {
          title: "服务商工单详情",
          requireAuth: true,
        },
      },
      {
        path: "/service-provider-message",
        name: "service-provider-message",
        component: () => import("@/views/service/service_provider_message.vue"),
        meta: {
          title: "服务商消息",
          requireAuth: true,
        },
      },
      {
        path: "/service-provider-follow",
        name: "service-provider-follow",
        component: () => import("@/views/service/service_provider_follow.vue"),
        meta: {
          title: "服务商关注",
          requireAuth: true,
        },
      },
      {
        path: "/service-provider-change-password",
        name: "service-provider-change-password",
        component: () => import("@/views/service/service_provider_change_password.vue"),
        meta: {
          title: "修改密码",
          requireAuth: true,
        },
      },
      {
        path: "/service-provider-vip",
        name: "service-provider-vip",
        component: () => import("@/views/service/service_provider_vip.vue"),
        meta: {
          title: "服务商会员中心",
          requireAuth: true,
        },
      },
      {
        path: "/service-provider_info",
        name: "service-provider_info",
        component: () => import("@/views/service/service_provider_info.vue"),
        meta: {
          title: "服务商个人中心",
          requireAuth: true,
        },
      }
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
        store.commit("set_baseInfo", data);
        next();
      }
    });
  } else {
    // "userType": 1, //1个人 2企业 3服务商
    // 当用户是服务商时，如果想跳转的是/my下的所有页面，则跳转到/service-provider-list
    if (store.state.baseInfo.userType == 3 && to.path.includes('/my')) {
      next({
        path: '/service-provider_info',
      });
    } else {
      next();
    }
  }
});

router.afterEach((to, from) => {
  // 有query参数，需要手动拼接
  if (JSON.parse(localStorage.getItem('userInfo')).userType == 3 && to.path.includes('/my')) {
    router.push('/service-provider_info');
  } else {
    if (to.query) {
      router.push({
        path: to.path,
        query: to.query,
      });
    } else {
      router.push(to.path);
    }
  }
});

export default router;
