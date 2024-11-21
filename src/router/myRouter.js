export const myRouter = [
    {
        path: "/my", // 活动专区
        name: "my",
        meta: {},
        component: () => import("@/views/my/index.vue"),
        redirect: "/my-home",
        children: [
            {
                path: "/my-home", // 个人首页
                name: "my-home",
                meta: {},
                component: () => import("@/views/my/home.vue"),
            },
            {
                path: '/profile', // 个人中心
                name: "profile",
                meta: {},
                component: () => import("@/views/my/profile.vue"),
            },
            {
                path: "/joinGroup", // 加入团体
                name: "joinGroup",
                meta: {},
                component: () => import("@/views/my/joinGroup.vue"),
            },
            {
                path: "/createGroup", // 创建团体
                name: "createGroup",
                meta: {},
                component: () => import("@/views/my/createGroup.vue"),
            },
            {
                path: "/order", // 我的订单
                name: "order",
                meta: {},
                component: () => import("@/views/my/order/index.vue"),
            },
            {
                path: "/approvalOrder", // 审批订单
                name: "approvalOrder",
                meta: {},
                component: () => import("@/views/my/order/approval.vue"),
            },
            {
                path: "/exchangeOrder", // 积分兑换订单
                name: "exchangeOrder",
                meta: {},
                component: () => import("@/views/my/order/exchange.vue"),
            },
            {
                path: "/exchangeDetail", // 积分兑换详情
                name: "exchangeDetail",
                meta: {},
                component: () => import("@/views/my/order/exchange-detail.vue"),
            },
            {
                path: "/orderDetail", // 订单详情
                name: "orderDetail",
                meta: {},
                component: () => import("@/views/my/order/detail.vue"),
            },
            {
                path: "/afterSales", // 售后服务
                name: "afterSales",
                meta: {},
                component: () => import("@/views/my/order/afterSales.vue"),
            },
            {
                path: '/preSave', // 预存管理
                name: 'preSave',
                meta: {},
                component: () => import("@/views/my/order/preSave.vue"),
            }
        ]
    }
]
