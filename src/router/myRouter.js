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
      }
    ]
  }
]
