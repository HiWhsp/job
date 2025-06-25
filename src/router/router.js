const router = [
  // 注册
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/account/register.vue"),
  },
  // 帮助
  {
    path: "/help",
    name: "help",
    component: () => import("@/views/navBar/help.vue"),
  },
  // 反馈
  {
    path: "/feedback",
    name: "feedback",
    component: () => import("@/views/navBar/feedback.vue"),
  },
  // 合作
  {
    path: "/cooperation",
    name: "cooperation",
    component: () => import("@/views/navBar/cooperation.vue"),
  },
  // 搜索列表
  {
    path: "/searchList",
    name: "searchList",
    component: () => import("@/views/search/searchList.vue"),
    meta: {
      title: "搜索列表",
    },
  },
  // 文章详情
  {
    path: "/article-detail",
    name: "article-detail",
    component: () => import("@/views/product/article-detail.vue"),
    meta: {
      title: "文章详情",
    },
  },
  // 系统制造商列表
  {
    path: "/system-manufacturer-list",
    name: "system-manufacturer-list",
    component: () => import("@/views/product/system-manufacturer-list.vue"),
    meta: {
      title: "系统制造商列表",
    },
  },
  {
    path: "/manufacturer-detail",
    name: "manufacturer-detail",
    component: () => import("@/views/product/manufacturer-detail.vue"),
    meta: {
      title: "系统制造商详情",
    },
  },
];

export default router;