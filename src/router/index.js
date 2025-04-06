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

    /** 商品相关 **/
    // 商品分类
    {
        path: '/productCategories',
        name: "productCategories",
        component: () => import('@/views/product/classify.vue')
    },
    {
        path: "/product-all",
        name: 'product-all',
        component: () => import('@/views/product/classify-all.vue')
    },
    // 商品详情
    {
        path: '/productDetail',
        name: "productCategories",
        component: () => import('@/views/product/detail.vue')
    },

    /** 导航路由 **/
    // 意见反馈
    {
        path: '/feedback',
        name: 'feedback',
        component: () => import('@/views/nav/feedback.vue'),
        meta: {
            title: "意见反馈",
            requireAuth: true
        }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('@/views/nav/about.vue'),
        meta: {
            title: "关于我们",
            requireAuth: true
        }
    },

    {
        path: '/policy',
        name: 'Policy',
        component: () => import('@/views/company/policy.vue'),
    },

    /** 登录相关 **/
    {
        path: '/register',
        name: "register",
        component: () => import('@/views/account/register.vue')
    },
    {
        path: '/login',
        name: "login",
        component: () => import('@/views/account/login.vue')
    },
    {
        path: '/retrieve',
        name: "retrieve",
        component: () => import('@/views/account/retrieve.vue')
    },

    /** 购物车相关 **/
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/views/cart/cart.vue')
    },

    /** 订单相关 **/
    {
        path: '/orderSubmit',
        name: 'orderSubmit',
        component: () => import('@/views/order/order-submit.vue')
    },
    {
        path: '/payment-success',
        name: 'payment-success',
        component: () => import('@/views/order/payment-success.vue')
    },


    /** 个人中心 **/
    {
        path: "/my",
        name: "my",
        component: () => import('@/views/my/my.vue'),
        redirect: '/my-index',
        meta: {
            requireAuth: true,
        },
        children: [
            {
                path: "/my-index",
                name: "my-index",
                component: () => import('@/views/my/my-index.vue'),
                meta: {
                    title: "会员中心",
                    requireAuth: true,
                }
            },
            {
                path: "/order-list",
                name: "order-list",
                component: () => import('@/views/my/order/order-list.vue'),
                meta: {
                    title: "订单列表",
                    requireAuth: true,
                }
            },
            {
                path: "/order-detail",
                name: "order-detail",
                component: () => import('@/views/my/order/order-detail.vue'),
                meta: {
                    title: "订单详情",
                    requireAuth: true,
                },
            },
            {
                path: '/collect',
                name: 'collect',
                component: () => import('@/views/my/collect.vue'),
                meta: {
                    title: "我的收藏",
                    requireAuth: true
                }
            },
            {
                path: "/address-list",
                name: "address-list",
                component: () => import('@/views/my/address/address-list.vue'),
                meta: {
                    title: "我的地址",
                    requireAuth: true,
                },
            },
            {
                path: "/my-info",
                name: "my-info",
                component: () => import('@/views/my/my-info.vue'),
                meta: {
                    title: "个人信息",
                    requireAuth: true,
                },
            },
            {
                path: "/change-password",
                name: "change-password",
                component: () => import('@/views/my/change-password.vue'),
                meta: {
                    title: "修改密码",
                    requireAuth: true,
                },
            },
            {
                path: "/purchase-count",
                name: "purchase-count",
                component: () => import('@/views/my/purchase-count.vue'),
                meta: {
                    title: "采购统计",
                    requireAuth: true,
                }
            }
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
    if (!user_is_login && to.meta.requireAuth) {
        // debugger
        alertErr("请先登录");
        next("/login");
    } else {
        next();
    }
});

export default router;
