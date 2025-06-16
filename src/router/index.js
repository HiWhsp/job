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
// 个人中心
const my_layout = () => import("@/views/my/my-layout.vue");

const my_info = () =>
  import(/* webpackChunkName: "my-info" */ "@/views/my/my-info.vue");
const member_center = () =>
  import(/* webpackChunkName: "member-center" */ "@/views/my/member-center.vue");
const my_collection = () =>
  import(/* webpackChunkName: "my-collection" */ "@/views/my/my-collection.vue");
const my_comment = () =>
  import(/* webpackChunkName: "my-comment" */ "@/views/my/my-comment.vue");
const my_activity_registration = () =>
  import(/* webpackChunkName: "my-activity-registration" */ "@/views/my/my-activity-registration.vue");
const my_message = () =>
  import(/* webpackChunkName: "my-message" */ "@/views/my/my-message.vue");
const account_settings = () =>
  import(/* webpackChunkName: "account-settings" */ "@/views/my/account-settings.vue");

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

// 会议报名
const meetingRegistration = () => import("@/views/ellsennProduct/meetingRegistration/index.vue"); // 会议报名
const pay = () => import("@/views/ellsennProduct/meetingRegistration/pay.vue"); // 支付
const paySuccess = () => import("@/views/ellsennProduct/meetingRegistration/pay-success.vue"); // 支付成功
const about = () => import("@/views/ellsennProduct/about/index.vue"); // 关于我们
const externalCommitteeDetail = () => import("@/views/ellsennProduct/about/components/ExternalCommitteeDetail.vue"); // 外部专业委员详情

// 排行榜
const rankings = () => import("@/views/ellsennProduct/rankings/index.vue"); // 排行榜

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
      title: "新闻详情",
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
  // 会议报名
  {
    path: "/meetingRegistration",
    name: "meetingRegistration",
    component: meetingRegistration,
    meta: {
      title: "会议报名",
    },
  },
  {
    path: "/pay",
    name: "pay",
    component: pay,
    meta: {
      title: "支付",
    },
  },
  {
    path: "/paySuccess",
    name: "paySuccess",
    component: paySuccess,
    meta: {
      title: "支付成功",
    },
  },
  // 排行榜
  {
    path: "/rankings",
    name: "rankings",
    component: rankings,
    meta: {
      title: "排行榜",
    },
  },
  // 关于我们
  {
    path: "/about",
    name: "about",
    component: about,
    meta: {
      title: "关于我们",
    },
  },
  // 外部专业委员详情
  {
    path: "/externalCommitteeDetail",
    name: "externalCommitteeDetail",
    component: externalCommitteeDetail,
    meta: {
      title: "外部专业委员详情",
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
        path: "/member-center",
        name: "member-center",
        component: member_center,
        meta: {
          title: "会员中心",
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
        path: "/my-activity-registration",
        name: "my-activity-registration",
        component: my_activity_registration,
        meta: {
          title: "我的活动报名",
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
        path: "/account-settings",
        name: "account-settings",
        component: account_settings,
        meta: {
          title: "账号设置",
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
