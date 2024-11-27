export const supplierRouter = [
    {
        path: "/supplier", //
        name: "supplier",
        meta: {},
        component: () => import("@/views/supplier/index.vue"),
        redirect: "/supplier-home",
        children: [
            {
                path: "/supplier-home", // 个人首页
                name: "supplier-home",
                meta: {},
                component: () => import("@/views/supplier/home.vue")
            },
            {
                path: "/message-list", // 消息列表
                name: "message-list",
                meta: {},
                component: () => import("@/views/supplier/message/message.vue")
            },
            {
                path: "/supplier-order", // 供应商订单
                name: "supplier-order",
                meta: {},
                component: () => import("@/views/supplier/order/index.vue")
            },
            {
                path: "/assign-order", // 分配订单
                name: "assign-order",
                meta: {},
                component: () => import("@/views/supplier/order/assign.vue")
            },
            {
                path: "/supplier-order-detail", // 订单详情
                name: "supplier-order-detail",
                meta: {},
                component: () => import("@/views/supplier/order/detail.vue")
            },
            {
                path: "/transit-order", //  运输订单
                name: "transit-order",
                meta: {},
                component: () => import("@/views/supplier/order/transit.vue")
            },
            {
                path: "/waitUploadResult-order", // 待上传结果订单
                name: "waitUploadResult-order",
                meta: {},
                component: () => import("@/views/supplier/order/uploadResult.vue")
            }
        ]
    }
]
