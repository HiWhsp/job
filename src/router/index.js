import Vue from "vue";
import VueRouter from "vue-router";
import {baseRouter} from "@/router/baseRouter"; // 基础页面路由
import {myRouter} from "@/router/myRouter"; // 普通用户路由
import {supplierRouter} from "@/router/supplierRouter"; // 供应商路由
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
    {
        path: "/analyze", // 分析测试
        name: "analyze",
        component: () => import(/* webpackChunkName: "info" */ "@/views/nav/analyze/analyze.vue"),
        redirect: "/analyze_list",
        children: [
            {
                path: "/analyze_list",
                name: "list",
                component: () => import(/* webpackChunkName: "info" */ "@/views/nav/analyze/list.vue"),
                meta: {}
            },
            {
                path: "/analyze_detail",
                name: "detail",
                component: () => import(/* webpackChunkName: "info" */ "@/views/nav/analyze/detail.vue"),
                meta: {}
            },
        ]
    },
    {
        path: "/training", // 公司信息
        name: "training",
        component: () => import(/* webpackChunkName: "info" */ "@/views/nav/training/training.vue"),
        redirect: "/expertTeam",
        children: [
            {
                path: "/introduction", // 公司简介
                name: "introduction",
                component: () => import(/* webpackChunkName: "info" */ "@/views/nav/training/Introduction.vue"),
                meta: {}
            },
            {
                path: "/expertTeam", // 专家团队
                name: "expertTeam",
                component: () => import(/* webpackChunkName: "info" */ "@/views/nav/training/expertTeam.vue"),
                meta: {}
            },
            {
                path: '/expertDetail', // 专家详情
                name: 'expertDetail',
                component: () => import(/* webpackChunkName: "info" */ '@/views/nav/training/expertDetail.vue'),
                meta: {}
            },
            {
                path: '/news', // 新闻动态
                name: 'news',
                component: () => import(/* webpackChunkName: "info" */ '@/views/nav/training/news.vue'),
                meta: {}
            },
            {
                path: '/newsDetail', // 新闻详情
                name: 'newsDetail',
                component: () => import(/* webpackChunkName: "info" */ '@/views/nav/training/news-detail.vue'),
                meta: {}
            },
            {
                path: "/technologyExpress", // 技术快递
                name: "technologyExpress",
                component: () => import(/* webpackChunkName: "info" */ "@/views/nav/training/technologyExpress.vue"),
                meta: {}
            },
            {
                path: "/materialDownload", // 材料下载
                name: "materialDownload",
                component: () => import(/* webpackChunkName: "info" */ "@/views/nav/training/materialDownload.vue"),
                meta: {}
            },
            {
                path: "/materialDownload-detail", // 材料下载详情
                name: "technologyCenter-detail",
                component: () => import(/* webpackChunkName: "info" */ "@/views/nav/training/materialDownload-detail.vue"),
                meta: {}
            },
            {
                path: "/eventInfo", // 活动信息
                name: "eventInfo",
                component: () => import(/* webpackChunkName: "info" */ "@/views/nav/training/eventInfo.vue"),
                meta: {}
            },
            {
                path: "/eventInfoDetail", // 活动信息详情
                name: "eventInfoDetail",
                component: () => import(/* webpackChunkName: "info" */ "@/views/nav/training/eventInfo-detail.vue"),
                meta: {}
            },
            {
                path: "/contactUs", // 联系我们
                name: "contactUs",
                component: () => import(/* webpackChunkName: "info" */ "@/views/nav/training/contactUs.vue"),
                meta: {}
            }
        ]
    },
    {
        path: '/forum', // 论坛
        name: 'forum',
        component: () => import(/* webpackChunkName: "info" */ '@/views/nav/forum/index.vue'),
    },
    {
        path: '/forum-success', // 论坛
        name: 'forum-success',
        component: () => import(/* webpackChunkName: "info" */ '@/views/nav/forum/success.vue'),
    },
    {
        path: '/search', // 搜索产品
        name: 'search',
        component: () => import('@/views/nav/analyze/search.vue')
    },
    {
      path: '/release', // 发布需求
      name: 'release',
      component: () => import('@/views/base/release/index.vue')
    },

    /** 登录相关 **/
    {
        path: '/register', // 注册
        name: "register",
        component: () => import('@/views/account/register.vue')
    },
    {
        path: '/login', // 登录
        name: "login",
        component: () => import('@/views/account/login.vue')
    },
    {
        path: '/retrieve', // 找回
        name: "retrieve",
        component: () => import('@/views/account/retrieve.vue')
    },
    {
        path: "/supplier-login", // 供应商登录
        name: "supplier-login",
        component: () => import("@/views/account/supplier-login.vue"),
    },

    {
        path: '/orderPay', // 订单支付
        name: 'orderPay',
        meta: {},
        component: () => import("@/views/order/pay.vue"),
    },
    {
        path: '/pay-status', // 支付状态
        name: 'pay-status',
        meta: {},
        component: () => import("@/views/order/status.vue"),
    },
    {
        path: '/supplier-status', // 供应商入驻
        name: 'supplier-status',
        meta: {},
        component: () => import("@/views/supplier/status.vue"),
    },
    ...baseRouter,
    ...myRouter,
    ...supplierRouter,

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
    } else if (['/login', '/retrieve', '/register'].includes(to.path) && localStorage.getItem('isSupplier') === 'false') {
        next('/my-home');
    } else if (to.path === '/supplier-login' && localStorage.getItem('isSupplier') === 'true') {
        next('/supplier-home');
    } else {
        next();
    }
});

export default router;
