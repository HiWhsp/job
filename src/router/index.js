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
    // 商品详情
    {
        path: '/productDetail',
        name: "productCategories",
        component: () => import('@/views/product/detail.vue')
    },

    /** 导航路由 **/
    // 特惠商城
    {
        path: '/discountShop',
        name: 'discountShop',
        component: () => import('@/views/nav/discountShop.vue')
    },
    // 低价商城
    {
        path: '/lowPriceShop',
        name: 'lowPriceShop',
        component: () => import('@/views/nav/lowPriceShop.vue')
    },
    // 每月新款
    {
        path: '/newMonthShop',
        name: 'newMonthShop',
        component: () => import('@/views/nav/newMonthShop.vue')
    },
    // 非标定制
    {
        path: '/nonstandard',
        name: 'nonstandard',
        component: () => import('@/views/nav/nonstandard.vue')
    },
    // 非标定制提交成功页面
    {
        path: '/nonstandard_success',
        name: 'nonstandard_success',
        component: () => import('@/views/nav/nonstandard_success.vue')
    },
    // 快速报价
    {
        path: '/fastQuotation',
        name: 'fastQuotation',
        component: () => import('@/views/nav/fastQuotation.vue')
    },
    /** 积分商城相关 **/
    {
        path: '/pointsMall',
        name: 'pointsMall',
        component: () => import('@/views/my/points/pointsMall.vue'),
        meta: {
            title: "积分商城",
            requireAuth: true
        }
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

    /** 帮助中心 **/
    {
        path: '/help',
        name: 'help',
        component: () => import('@/views/service/helpCenter.vue')
    },

    /** 关于 **/
    {
        path: '/about',
        name: 'about',
        component: () => import('@/views/company/companyProfile.vue')
    },
    {
        path: '/xinhun-detail',
        name: 'xinhun-detail',
        component: () => import('@/views/company/xinwen_detail.vue')
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
                path: "/order-quotation-list",
                name: "order-quotation-list",
                component: () => import('@/views/my/order/order-quotation-list.vue'),
                meta: {
                    title: "报价单列表",
                    requireAuth: true,
                },
            },
            {
                path: "/order-quotation-detail",
                name: "order-quotation-detail",
                component: () => import('@/views/my/order/order-quotation-detail.vue'),
                meta: {
                    title: "报价单详情",
                    requireAuth: true,
                },
            },
            {
                path: "/refund-list",
                name: "refund-list",
                component: () => import('@/views/my/refund/myRefund.vue'),
                meta: {
                    title: "售后订单",
                    requireAuth: true,
                },
            },
            {
                path: "/refund-detail",
                name: "refund-detail",
                component: () => import('@/views/my/refund/refundServiceDetail.vue'),
                meta: {
                    title: "售后详情",
                    requireAuth: true,
                },
            },
            {
                path: "/invoice-list",
                name: "invoice-list",
                component: () => import('@/views/my/invoice-list.vue'),
                meta: {
                    title: "发票信息",
                    requireAuth: true,
                }
            },
            {
                path: "/invoice-detail",
                name: "invoice-detail",
                component: () => import('@/views/my/invoice-detail.vue'),
                meta: {
                    title: "发票信息",
                    requireAuth: true,
                }
            },
            {
                path: '/review-list',
                name: 'review-list',
                component: () => import('@/views/my/order/my-review-list.vue'),
                meta: {
                    title: "评价列表",
                    requireAuth: true,
                },
            },
            {
                path: '/review-submit',
                name: 'review-submit',
                component: () => import('@/views/my/order/order-review-submit.vue'),
                meta: {
                    title: "评价提交",
                    requireAuth: true,
                },
            },
            {
                path: '/coupon-list',
                name: 'coupon-list',
                component: () => import('@/views/my/coupon/myCoupon.vue'),
                meta: {
                    title: "我的优惠券",
                    requireAuth: true,
                },
            },
            {
                path: '/couponCenter',
                name: 'couponCenter',
                component: () => import('@/views/my/coupon/couponCenter.vue'),
                meta: {
                    title: "领券中心",
                    requireAuth: true,
                },
            },
            {
                path: '/pointsDetail',
                name: 'pointsDetail',
                component: () => import('@/views/my/points/pointsDetail.vue'),
                meta: {
                    title: "我的积分",
                    requireAuth: true
                }
            },
            {
                path: '/feedback',
                name: 'feedback',
                component: () => import('@/views/my/feedback/feedback.vue'),
                meta: {
                    title: "积分商城",
                    requireAuth: true
                }
            },
            {
                path: '/my-feedback',
                name: 'my-feedback',
                component: () => import('@/views/my/feedback/my-feedback.vue'),
                meta: {
                    title: "积分商城",
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
