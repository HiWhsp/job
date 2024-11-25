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
      }
    ]
  }
]
