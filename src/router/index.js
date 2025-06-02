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
const login = () => import("@/views/pages/account/login.vue"); //登录
const retireve = () => import("@/views/pages/account/retrieve.vue"); //登录
const my_info = () => import("@/views/pages/account/my-info.vue"); //登录
const my_password = () => import("@/views/pages/account/my-password.vue"); //登录

const baojiadan_list = () => import("@/views/pages/baojiadan/baojiadan-list.vue"); //
const baojiadan_form = () => import("@/views/pages/baojiadan/baojiadan-form.vue"); //
const baojiadan_success = () => import("@/views/pages/baojiadan/baojiadan-success.vue"); //
const baojiadan_preview = () => import("@/views/pages/baojiadan/baojiadan-preview.vue"); //

const routes = [
    {
        path: "/",
        name: "index",
        redirect: "/my-info",
        meta: {
            title: "网站概览",
            deep: 1,
            requireAuth: true
        },
    },
    {
        path: "/login",
        name: "login",
        component: login,
        meta: {
            title: '登录'
        },
    },
    {
        path: "/retireve",
        name: "retireve",
        component: retireve,
        meta: {
            title: '忘记密码',
        },
    },

    {
        path: "/layout",
        name: "layout",
        component: layout,
        meta: {
            title: '内页',
        },
        children: [
            {
                path: "/my-info",
                name: "my-info",
                component: my_info,
                meta: {
                    root: "我的资料",
                    title: "我的资料",
                    requireAuth: true
                },
            },
            {
                path: "/my-password",
                name: "my-password",
                component: my_password,
                meta: {
                    root: "我的密码",
                    title: "我的密码",
                    requireAuth: true
                },
            },
            // 合计报价单
            {
                path: "/baojiadan-list",
                name: "baojiadan-list",
                component: baojiadan_list,
                meta: {
                    root: "合计报价单列表",
                    title: "合计报价单列表",
                    requireAuth: true
                },
            },
            {
                path: "/baojiadan-form",
                name: "baojiadan-form",
                component: baojiadan_form,
                meta: {
                    root: "合计报价单新增",
                    title: "合计报价单新增",
                    requireAuth: true
                },
            },
            {
                path: "/baojiadan-success",
                name: "baojiadan-success",
                component: baojiadan_success,
                meta: {
                    root: "合计报价单提交成功",
                    title: "合计报价单提交成功",
                    requireAuth: true
                },
            },
            {
                path: "/baojiadan-preview",
                name: "baojiadan-preview",
                component: baojiadan_preview,
                meta: {
                    root: "合计报价单预览",
                    title: "合计报价单预览",
                    requireAuth: true
                },
            },
            // 	阶梯报价单
            {
                path: "/jietibaojiadan-list",
                name: "jietibaojiadan-list",
                component: () => import("@/views/pages/jietibaojiadan/jietibaojiadan-list.vue"),
                meta: {
                    root: "阶梯报价单列表",
                    title: "阶梯报价单列表",
                    requireAuth: true
                },
            },
            {
                path: "/jietibaojiadan-form",
                name: "jietibaojiadan-form",
                component: () => import("@/views/pages/jietibaojiadan/jietibaojiadan-form.vue"),
                meta: {
                    root: "阶梯报价单新增",
                    title: "阶梯报价单新增",
                    requireAuth: true
                },
            },
            {
                path: "/jietibaojiadan-success",
                name: "jietibaojiadan-success",
                component: () => import("@/views/pages/jietibaojiadan/jietibaojiadan-success.vue"),
                meta: {
                    root: "阶梯报价单提交成功",
                    title: "阶梯报价单提交成功",
                    requireAuth: true
                },
            },
            {
                path: "/jietibaojiadan-preview",
                name: "jietibaojiadan-preview",
                component: () => import("@/views/pages/jietibaojiadan/jietibaojiadan-preview.vue"),
                meta: {
                    root: "阶梯报价单预览",
                    title: "阶梯报价单预览",
                    requireAuth: true
                },
            },
            // 销售合同
            {
                path: "/xiaoshouhetong-list",
                name: "xiaoshouhetong-list",
                component: () => import("@/views/pages/xiaoshouhetong/xiaoshouhetong-list.vue"),
                meta: {
                    root: "销售合同列表",
                    title: "销售合同列表",
                    requireAuth: true
                },
            },
            {
                path: "/xiaoshouhetong-form",
                name: "xiaoshouhetong-form",
                component: () => import("@/views/pages/xiaoshouhetong/xiaoshouhetong-form.vue"),
                meta: {
                    root: "销售合同新增",
                    title: "销售合同新增",
                    requireAuth: true
                },
            },
            {
                path: "/xiaoshouhetong-success",
                name: "xiaoshouhetong-success",
                component: () => import("@/views/pages/xiaoshouhetong/xiaoshouhetong-success.vue"),
                meta: {
                    root: "销售合同提交成功",
                    title: "销售合同提交成功",
                    requireAuth: true
                },
            },
            {
                path: "/xiaoshouhetong-preview",
                name: "xiaoshouhetong-preview",
                component: () => import("@/views/pages/xiaoshouhetong/xiaoshouhetong-preview.vue"),
                meta: {
                    root: "销售合同预览",
                    title: "销售合同预览",
                    requireAuth: true
                },
            },
            //  采购合同
            {
                path: "/caigouhetong-list",
                name: "caigouhetong-list",
                component: () => import("@/views/pages/caigouhetong/caigouhetong-list.vue"),
                meta: {
                    root: "销售合同列表",
                    title: "销售合同列表",
                    requireAuth: true
                },
            },
            {
                path: "/caigouhetong-form",
                name: "caigouhetong-form",
                component: () => import("@/views/pages/caigouhetong/caigouhetong-form.vue"),
                meta: {
                    root: "销售合同新增",
                    title: "销售合同新增",
                    requireAuth: true
                },
            },
            {
                path: "/caigouhetong-success",
                name: "caigouhetong-success",
                component: () => import("@/views/pages/caigouhetong/caigouhetong-success.vue"),
                meta: {
                    root: "销售合同提交成功",
                    title: "销售合同提交成功",
                    requireAuth: true
                },
            },
            {
                path: "/caigouhetong-preview",
                name: "caigouhetong-preview",
                component: () => import("@/views/pages/caigouhetong/caigouhetong-preview.vue"),
                meta: {
                    root: "销售合同预览",
                    title: "销售合同预览",
                    requireAuth: true
                },
            },
            //  未税销售合同
            {
                path: "/weishuixiaoshouhetong-list",
                name: "weishuixiaoshouhetong-list",
                component: () => import("@/views/pages/weishuixiaoshouhetong/weishuixiaoshouhetong-list.vue"),
                meta: {
                    root: "未税销售合同列表",
                    title: "未税销售合同列表",
                    requireAuth: true
                },
            },
            {
                path: "/weishuixiaoshouhetong-form",
                name: "weishuixiaoshouhetong-form",
                component: () => import("@/views/pages/weishuixiaoshouhetong/weishuixiaoshouhetong-form.vue"),
                meta: {
                    root: "未税销售合同新增",
                    title: "未税销售合同新增",
                    requireAuth: true
                },
            },
            {
                path: "/weishuixiaoshouhetong-success",
                name: "weishuixiaoshouhetong-success",
                component: () => import("@/views/pages/weishuixiaoshouhetong/weishuixiaoshouhetong-success.vue"),
                meta: {
                    root: "未税销售合同提交成功",
                    title: "未税销售合同提交成功",
                    requireAuth: true
                },
            },
            {
                path: "/weishuixiaoshouhetong-preview",
                name: "weishuixiaoshouhetong-preview",
                component: () => import("@/views/pages/weishuixiaoshouhetong/weishuixiaoshouhetong-preview.vue"),
                meta: {
                    root: "未税销售合同预览",
                    title: "未税销售合同预览",
                    requireAuth: true
                },
            },
            //  未税采购合同
            {
                path: "/weishuicaigouhetong-list",
                name: "weishuicaigouhetong-list",
                component: () => import("@/views/pages/weishuicaigouhetong/weishuicaigouhetong-list.vue"),
                meta: {
                    root: "未税采购合同列表",
                    title: "未税采购合同列表",
                    requireAuth: true
                },
            },
            {
                path: "/weishuicaigouhetong-form",
                name: "weishuicaigouhetong-form",
                component: () => import("@/views/pages/weishuicaigouhetong/weishuicaigouhetong-form.vue"),
                meta: {
                    root: "未税采购合同新增",
                    title: "未税采购合同新增",
                    requireAuth: true
                }
            },
            {
                path: "/weishuicaigouhetong-success",
                name: "weishuicaigouhetong-success",
                component: () => import("@/views/pages/weishuicaigouhetong/weishuicaigouhetong-success.vue"),
                meta: {
                    root: "未税销售合同提交成功",
                    title: "未税销售合同提交成功",
                    requireAuth: true
                },
            },
            {
                path: "/weishuicaigouhetong-preview",
                name: "weishuicaigouhetong-preview",
                component: () => import("@/views/pages/weishuicaigouhetong/weishuicaigouhetong-preview.vue"),
                meta: {
                    root: "未税销售合同预览",
                    title: "未税销售合同预览",
                    requireAuth: true
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
        y: 0
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
    if (!is_login_curr && to.meta.requireAuth) {
        // debugger
        alertErr("请先登录");
        next("/login");
    } else {
        next();
    }
    next();

});

router.afterEach((to, from) => {
    // console.log("切换导航, 重新配置微信分享");
    // wxShare.getSign();
});

export default router;
