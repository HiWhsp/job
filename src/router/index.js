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

// 官网页面1
const index = () => import(/* webpackChunkName: "index" */ "@/views/index.vue");

const about = () =>
  import(/* webpackChunkName: "about" */ "@/views/company/about.vue");

const contact = () =>
  import(/* webpackChunkName: "contact" */ "@/views/company/contact.vue");

const order_logistics = () =>
  import(/* webpackChunkName: "order-logistics" */ "@/views/order/order-logistics.vue");
// const memberCenter = () => import(/* webpackChunkName: "memberCenter" */ "@/views/my/member/memberCenter.vue");

// 个人中心
const my_layout = () => import("@/views/my/my-layout.vue");
const my_index = () => import("@/views/my/my-index.vue");

const order_submit = () =>
  import(
    /* webpackChunkName: "order-submit" */ "@/views/order/order-submit.vue"
  );
const payment_methods = () =>
  import(
    /* webpackChunkName: "payment-methods" */ "@/views/payment/payment-methods.vue"
  );
// 支付
// const zfbPay = () => import(/* webpackChunkName: "zfbPay" */ "@/views/pay/zfbPay.vue");
const payment_success = () =>
  import(
    /* webpackChunkName: "payment-success" */ "@/views/payment/payment-success.vue"
  );
const order_list = () =>
  import(/* webpackChunkName: "order-list" */ "@/views/order/order-list.vue");
const order_detail = () =>
  import(
    /* webpackChunkName: "order-detail" */ "@/views/order/order-detail.vue"
  );
// const points-order-detail = () => import(/* webpackChunkName: "points-order-detail" */ "@/views/order/points-order-detail.vue");
const order_review_submit = () =>
  import(
    /* webpackChunkName: "order-review-submit" */ "@/views/review/order-review-submit.vue"
  );

//
const address_list = () =>
  import(
    /* webpackChunkName: "address-list" */ "@/views/address/address-list.vue"
  );
const foreign_address_list = () =>
  import(
    /* webpackChunkName: "foreign-address-list" */ "@/views/address/foreign-address-list.vue"
  );
const my_info = () =>
  import(/* webpackChunkName: "my-info" */ "@/views/my/my-info.vue");

const my_review_list = () => import("@/views/review/my-review-list.vue");
const change_password = () => import("@/views/my/change-password.vue");

// 维深信息
const researchReport = () => import("@/views/ellsennProduct/researchReport/index.vue"); // 研究报告
const reportDetails = () => import("@/views/ellsennProduct/researchReport/reportDetails/index.vue"); // 研究报告详情
const newsInsights = () => import("@/views/ellsennProduct/newsInsights/index.vue"); // 新闻洞察
const newsInsightsDetail = () => import("@/views/ellsennProduct/newsInsights/newsInsightsDetail/index.vue"); // 新闻洞察详情
const deepEvaluation = () => import("@/views/ellsennProduct/deepEvaluation/index.vue"); // 维深测评
const deepEvaluationDetail = () => import("@/views/ellsennProduct/deepEvaluation/deepEvaluationDetail/index.vue"); // 维深测评详情
const industrialActivities = () => import("@/views/ellsennProduct/industrialActivities/index.vue"); // 产业活动
const industrialActivitiesDetail = () => import("@/views/ellsennProduct/industrialActivities/industrialActivitiesDetail/index.vue"); // 产业活动详情
const searchList = () => import("@/views/ellsennProduct/searchList/index.vue"); // 搜索列表

const routes = [
  // 首页
  {
    path: "/",
    name: "index",
    component: index,
    meta: {},
  },
  // 研究报告
  {
    path: "/researchReport",
    name: "researchReport",
    component: researchReport,
    meta: {
      title: "研究报告",
    },
  },
  {
    path: "/reportDetails",
    name: "reportDetails",
    component: reportDetails,
    meta: {
      title: "报告详情",
    },
  },
  {
    path: "/newsInsights",
    name: "newsInsights",
    component: newsInsights,
    meta: {
      title: "新闻洞察",
    },
  },
  {
    path: "/newsInsightsDetail",
    name: "newsInsightsDetail",
    component: newsInsightsDetail,
    meta: {
      title: "新闻洞察详情",
    },
  },
  {
    path: "/deepEvaluation",
    name: "deepEvaluation",
    component: deepEvaluation,
    meta: {
      title: "维深测评",
    },
  },
  {
    path: "/deepEvaluationDetail",
    name: "deepEvaluationDetail",
    component: deepEvaluationDetail,
    meta: {
      title: "维深测评详情",
    },
  },
  {
    path: "/industrialActivities",
    name: "industrialActivities",
    component: industrialActivities,
    meta: {
      title: "产业活动",
    },
  },
  {
    path: "/industrialActivitiesDetail",
    name: "industrialActivitiesDetail",
    component: industrialActivitiesDetail,
    meta: {
      title: "产业活动详情",
    },
  },
  {
    path: "/searchList",
    name: "searchList",
    component: searchList,
    meta: {
      title: "搜索列表",
    },
  },


  // 历史路由
  {
    path: "/about",
    name: "about",
    component: about,
    meta: {},
  },
  {
    path: "/contact",
    name: "contact",
    component: contact,
    meta: {},
  },
  {
    path: "/order-submit",
    name: "order-submit",
    component: order_submit,
    meta: {
      title: "结算",
      requireAuth: true,
    },
  },
  {
    path: "/payment-methods",
    name: "payment-methods",
    component: payment_methods,
    meta: {
      title: "订单支付",
      requireAuth: true,
    },
  },

  {
    path: "/payment-success",
    name: "payment-success",
    component: payment_success,
    meta: {
      title: "支付结果",
      requireAuth: true,
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
        path: "/my-index",
        name: "my-index",
        component: my_index,
        meta: {
          title: "会员中心",
          requireAuth: true,
        },
      },

      {
        path: "/order-list",
        name: "order-list",
        component: order_list,
        meta: {
          title: "我的订单",
          requireAuth: true,
        },
      },

      {
        path: "/order-detail",
        name: "order-detail",
        component: order_detail,
        meta: {
          title: "订单详情",
          requireAuth: true,
        },
      },
      {
        path: "/order-logistics",
        name: "order-logistics",
        component: order_logistics,
        meta: {
          title: "订单物流",
          requireAuth: true,

        },
      },
      {
        path: "/order-review-submit",
        name: "order-review-submit",
        component: order_review_submit,
        meta: {
          title: "订单评价",
          requireAuth: true,
        },
      },

      {
        path: "/my-review-list",
        name: "my-review-list",
        component: my_review_list,
        meta: {
          title: "我的评价",
          requireAuth: true,
        },
      },
      {
        path: "/address-list",
        name: "address-list",
        component: address_list,
        meta: {
          title: "我的地址",
          requireAuth: true,
        },
      },
      {
        path: "/foreign-address-list",
        name: "foreign-address-list",
        component: foreign_address_list,
        meta: {
          title: "我的地址",
          requireAuth: true,
        },
      },
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
        path: "/change-password",
        name: "change-password",
        component: change_password,
        meta: {
          title: "修改密码",
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
