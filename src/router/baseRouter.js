export const baseRouter = [
    {
        path: "/invite", // 邀请
        name: "invite",
        meta: {},
        component: () => import("@/views/base/invite/index.vue"),
    },
];