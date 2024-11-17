export const baseRouter = [
    {
        path: "/invite", // 邀请
        name: "invite",
        meta: {},
        component: () => import("@/views/base/invite/index.vue"),
    },
    {
        path: "/sunPay", // 阳光预付
        name: "sunPay",
        meta: {},
        component: () => import("@/views/base/sunPay/index.vue"),
    },
    {
        path: "/thesis", // 论文致谢
        name: "thesis",
        meta: {},
        component: () => import("@/views/base/thesis/index.vue"),
    },
    {
        path: "/couponCenter", // 领券中心
        name: "couponCenter",
        meta: {},
        component: () => import("@/views/base/coupon/index.vue"),
    },
    {
        path: "/activity", // 活动专区
        name: "activity",
        meta: {},
        component: () => import("@/views/member/activity.vue"),
    },
    {
        path: "/appointment", // 预约流程
        name: "appointment",
        meta: {},
        component: () => import("@/views/base/appointment/index.vue"),
    },
    {
        path: "/appointment-info", // 预约流程 详情
        name: "appointment-info",
        meta: {},
        component: () => import("@/views/base/appointment/info.vue"),
    },
    {
        path: "/appointment-invoice", // 预约流程 发票
        name: "appointment-invoice",
        meta: {},
        component: () => import("@/views/base/appointment/invoice.vue"),
    },
    {
        path: "/appointment-pay", // 预约流程 支付方式
        name: "appointment-pay",
        meta: {},
        component: () => import("@/views/base/appointment/pay.vue"),
    },
    {
        path: "/appointment-status", // 预约流程 状态
        name: "appointment-status",
        meta: {},
        component: () => import("@/views/base/appointment/status.vue"),
    },
    {
        path: "/appointment-payment", // 预约流程 其他支付
        name: "appointment-payment",
        meta: {},
        component: () => import("@/views/base/appointment/payment.vue"),
    },
];
