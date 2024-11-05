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
    }
];
