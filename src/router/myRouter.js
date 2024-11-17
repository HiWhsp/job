export const myRouter = [
    {
        path: "/my", // 活动专区
        name: "my",
        meta: {},
        component: () => import("@/views/my/index.vue"),
        redirect: "/my-home",
        children: [
            {
                path: "/my-home", // 活动专区
                name: "my-home",
                meta: {},
                component: () => import("@/views/my/home.vue"),
            }
        ]
    }
]