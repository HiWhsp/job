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

    // {
    //   path: '/register',
    //   name: "register",
    //   component: () => import('@/views/account/register.vue')
    // },
    // {
    //   path: '/retrieve',
    //   name: "retrieve",
    //   component: () => import('@/views/account/retrieve.vue')
    // },

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
        component: () => import('@/views/order/order-submit.vue'),
        meta: {
            title: "下单",
            requireAuth: true
        }
    },
    {
        path: '/payment-success',
        name: 'payment-success',
        component: () => import('@/views/order/payment-success.vue'),
        meta: {
            title: "支付成功",
            requireAuth: true
        }
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
    // 供应商
    {
        path: '/G_my',
        name: 'G_my',
        component: () => import('@/views/myG/my.vue'),
        redirect: '/G_product_list',
        meta: {
            requireAuth: true,
        },
        children: [
            {
                path: '/G_product_list',
                name: 'G_product_list',
                component: () => import('@/views/myG/G_product_list.vue'),
                meta: {
                    title: "供应商产品",
                    requireAuth: true,
                }
            },
            {
                path: '/G_product_add',
                name: 'G_product_add',
                component: () => import('@/views/myG/G_product_add.vue'),
                meta: {
                    title: "新增商品",
                    requireAuth: true,
                }
            },
            {
                path: '/G_order_list',
                name: 'G_order_list',
                component: () => import('@/views/myG/G_order_list.vue'),
                meta: {
                    title: "我的订单",
                    requireAuth: true,
                }
            },
            {
                path: '/G_order_detail',
                name: 'G_order_detail',
                component: () => import('@/views/myG/G_order_detail.vue'),
                meta: {
                    title: "我的订单",
                    requireAuth: true,
                }
            },
            {
                path: '/G_account_list',
                name: 'G_account_list',
                component: () => import('@/views/myG/G_account_list.vue'),
                meta: {
                    title: "收款账户管理",
                    requireAuth: true,
                }
            },
            {
                path: '/G_change_password',
                name: 'G_change_password',
                component: () => import('@/views/myG/G_change_password.vue'),
                meta: {
                    title: "修改密码",
                    requireAuth: true,
                }
            },
            {
                path: '/G_purchase_count',
                name: 'G_purchase_count',
                component: () => import('@/views/myG/G_purchase_count.vue'),
                meta: {
                    title: "商品销量统计",
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
    // if (!user_is_login && to.path !== '/login') {
    //     // debugger
    //     alertErr("请先登录");
    //     next("/login");
    // } else {
        next();
    // }
});

export default router;
