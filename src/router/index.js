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

const routes = [
    // 首页
    {
        path: "/",
        name: "index",
        component: () => import(/* webpackChunkName: "index" */ "@/views/index.vue"),
        meta: {},
    },

    /** 登录相关 **/
    {
        path: '/login',
        name: "login",
        meta: {
            title: "登录",
        },
        component: () => import('@/views/account/login.vue')
    },

    /** 课程相关 **/
    {
        path: '/course-list',
        name: 'course-list',
        meta: {
            title: "全部课程",
        },
        component: () => import('@/views/course/course-list.vue')
    },
    {
        path: '/course-detail',
        name: 'course-detail',
        meta: {
            title: "课程详情",
        },
        component: () => import('@/views/course/course-detail.vue')
    },
    {
        path: '/pdf-viewer',
        name: 'pdf-viewer',
        meta: {
            title: "PDF学习",
        },
        component: () => import('@/views/course/pdf-viewer.vue')
    },
    {
        path: '/video-viewer',
        name: 'video-viewer',
        meta: {
            title: "视频学习",
        },
        component: () => import('@/views/course/video-viewer.vue')
    },


    /** 采购中心 **/
    {
        path: "/my",
        name: "my",
        component: () => import('@/views/my/my.vue'),
        redirect: '/order-list',
        meta: {
            requireAuth: true,
        },
        children: [
            {
                path: "/my-info",
                name: "my-info",
                component: () => import('@/views/my/my-info.vue'),
                meta: {
                    title: "个人信息",
                    requireAuth: true,
                },
            },
        ]
    },

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
    let userId = localStorage.getItem("user_id");
    let user_is_login = token && userId;

    // debugger
    // if (!user_is_login && to.path !== '/login') {
    //     // debugger
    //     alertErr("请先登录");
    //     next("/login");
    // } else {
        next();
    // }
});

export default router;
