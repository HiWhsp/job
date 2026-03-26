// 角色路由映射配置
// 根据用户角色返回对应的路由配置
// 路由 meta 支持 hidden：为 true 或未设置时在侧边栏菜单展示，为 false 时不在菜单展示（路由仍会注册，可通过 this.$router.push 跳转）

// 管理端路由
const managerRoutes = [
  {
    path: "/manager",
    name: "manager",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "管理端",
      requireAuth: true,
    },
    children: [
      // 数据统计
      {
        path: "data-statistics",
        name: "data-statistics",
        component: () => import("@/views/manager/data-statistics/index.vue"),
        meta: {
          title: "数据统计",
          requireAuth: true,
          hidden: true,
        },
      },
      // 客户管理
      {
        path: "customer",
        name: "customer",
        component: () => import("@/views/manager/customer/index.vue"),
        redirect: "/manager/customer/list",
        meta: {
          title: "客户管理",
          requireAuth: true,
        },
        children: [
          // 客户列表
          {
            path: "list",
            name: "customer-list",
            component: () => import("@/views/manager/customer/list.vue"),
            meta: {
              title: "客户列表",
              requireAuth: true,
              hidden: false,
            },
          },
          // 新增客户
          {
            path: "add",
            name: "customer-add",
            component: () => import("@/views/manager/customer/add.vue"),
            meta: {
              title: "新增客户",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 客户管理审核
      {
        path: "audit",
        name: "customer-audit",
        component: () => import("@/views/manager/customer/audit.vue"),
        meta: {
          title: "客户管理审核",
          requireAuth: true,
          hidden: true,
        },
      },
      // 产品管理
      {
        path: "product",
        name: "product",
        component: () => import("@/views/manager/product/index.vue"),
        meta: {
          title: "产品管理",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 产品分类管理
          {
            path: "category",
            name: "product-category",
            component: () => import("@/views/manager/product/category.vue"),
            meta: {
              title: "产品分类管理",
              requireAuth: true,
              hidden: true,
            },
          },
          // 产品管理
          {
            path: "list",
            name: "product-list",
            component: () => import("@/views/manager/product/list.vue"),
            meta: {
              title: "产品管理",
              requireAuth: true,
              hidden: true,
            },
          },
          // 产品新增
          {
            path: "add",
            name: "product-add",
            component: () => import("@/views/manager/product/add.vue"),
            meta: {
              title: "产品新增",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 产品指导价格
      {
        path: "price",
        name: "product-price",
        component: () => import("@/views/manager/product/price.vue"),
        meta: {
          title: "产品指导价格",
          requireAuth: true,
          hidden: true,
        },
      },
      // 内部原料管理
      {
        path: "internal-material",
        name: "internal-material",
        component: () => import("@/views/manager/internal-material/index.vue"),
        meta: {
          title: "内部原料管理",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 原料分类管理
          {
            path: "category",
            name: "internal-material-category",
            component: () =>
              import("@/views/manager/internal-material/category.vue"),
            meta: {
              title: "原料分类管理",
              requireAuth: true,
              hidden: true,
            },
          },
          {
            path: "list",
            name: "internal-material-list",
            component: () =>
              import("@/views/manager/internal-material/list.vue"),
            meta: {
              title: "原料管理",
              requireAuth: true,
              hidden: true,
            },
          },
          // 新增原料
          {
            path: "add",
            name: "internal-material-add",
            component: () =>
              import("@/views/manager/internal-material/add.vue"),
            meta: {
              title: "新增原料",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 客户外来包装
      {
        path: "external-package",
        name: "external-package",
        component: () => import("@/views/manager/external-package/index.vue"),
        redirect: "/manager/external-package/list",
        meta: {
          title: "客户外来包装",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 客户外来包装管理
          {
            path: "list",
            name: "external-package-list",
            component: () =>
              import("@/views/manager/external-package/list.vue"),
            meta: {
              title: "客户外来包装管理",
              requireAuth: true,
              hidden: false,
            },
          },
          // 新增客户外来包装
          {
            path: "add",
            name: "external-package-add",
            component: () => import("@/views/manager/external-package/add.vue"),
            meta: {
              title: "新增客户外来包装",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 外购产品管理
      {
        path: "external-product",
        name: "external-product",
        component: () => import("@/views/manager/external-product/index.vue"),
        redirect: "/manager/external-product/list",
        meta: {
          title: "外购产品管理",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 外购产品管理
          {
            path: "list",
            name: "external-product-list",
            component: () =>
              import("@/views/manager/external-product/list.vue"),
            meta: {
              title: "外购产品管理",
              requireAuth: true,
              hidden: false,
            },
          },
          // 新增外购产品
          {
            path: "add",
            name: "external-product-add",
            component: () => import("@/views/manager/external-product/add.vue"),
            meta: {
              title: "新增外购产品",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 订单发货审批
      {
        path: "order-delivery-approval",
        name: "order-delivery-approval",
        component: () =>
          import("@/views/manager/order-delivery-approval/index.vue"),
        redirect: "/manager/order-delivery-approval/list",
        meta: {
          title: "订单发货审批",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 订单发货审批列表
          {
            path: "list",
            name: "order-delivery-approval-list",
            component: () =>
              import("@/views/manager/order-delivery-approval/list.vue"),
            meta: {
              title: "订单发货审批列表",
              requireAuth: true,
              hidden: false,
            },
          },
          // 订单发货审批详情
          {
            path: "detail",
            name: "order-delivery-approval-detail",
            component: () =>
              import("@/views/manager/order-delivery-approval/detail.vue"),
            meta: {
              title: "订单发货审批详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 询盘数据
      {
        path: "inquiry-data",
        name: "inquiry-data",
        component: () => import("@/views/manager/inquiry-data/index.vue"),
        meta: {
          title: "询盘数据",
          requireAuth: true,
          hidden: true,
        },
      },
      // 账号管理
      {
        path: "/account-management",
        name: "account-management",
        component: () => import("@/views/account-management/index.vue"),
        meta: {
          title: "账号管理",
        },
        children: [
          {
            path: "/account-management/list",
            name: "account-management-list",
            component: () => import("@/views/account-management/list.vue"),
            meta: {
              title: "账号列表",
            },
          },
          {
            path: "/account-management/role-management",
            name: "account-management-add",
            component: () =>
              import("@/views/account-management/role-management.vue"),
            meta: {
              title: "角色管理",
            },
          },
        ],
      },
    ],
  },
];

// 业务员端路由
const salesRoutes = [
  {
    path: "/sales",
    name: "sales",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "业务员端",
      requireAuth: true,
    },
    children: [
      // 订单管理
      {
        path: "order",
        name: "order",
        component: () => import("@/views/sales/order/index.vue"),
        redirect: "/sales/order/list",
        meta: {
          title: "订单管理",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 订单列表
          {
            path: "list",
            name: "order-list",
            component: () => import("@/views/sales/order/list.vue"),
            meta: {
              title: "订单管理",
              requireAuth: true,
              hidden: true,
            },
          },
          // 新增订单
          {
            path: "add",
            name: "order-add",
            component: () => import("@/views/sales/order/add.vue"),
            meta: {
              title: "新增订单",
              requireAuth: true,
              hidden: true,
            },
          },
          // 订单详情
          {
            path: "detail",
            name: "order-detail",
            component: () => import("@/views/sales/order/detail.vue"),
            meta: {
              title: "订单详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 订单回款记录
      {
        path: "payment-record",
        name: "order-payment-record",
        component: () => import("@/views/sales/payment-record/index.vue"),
        meta: {
          title: "订单回款记录",
          requireAuth: true,
          hidden: true,
        },
      },
      // 询盘数据
      {
        path: "inquiry-data",
        name: "inquiry-data",
        component: () => import("@/views/sales/inquiry-data/index.vue"),
        meta: {
          title: "询盘数据",
          requireAuth: true,
          hidden: true,
        },
      },
      // 客户管理
      {
        path: "sales-customer",
        name: "sales-customer",
        component: () => import("@/views/sales/sales-customer/index.vue"),
        redirect: "/sales/sales-customer/list",
        meta: {
          title: "客户管理",
          requireAuth: true,
        },
        children: [
          // 客户列表
          {
            path: "list",
            name: "customer-list",
            component: () => import("@/views/sales/sales-customer/list.vue"),
            meta: {
              title: "客户列表",
              requireAuth: true,
              hidden: false,
            },
          },
          // 新增客户
          {
            path: "add",
            name: "customer-add",
            component: () => import("@/views/sales/sales-customer/add.vue"),
            meta: {
              title: "新增客户",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
    ],
  },
];

// 营销端路由
const marketingRoutes = [
  {
    path: "/marketing",
    name: "marketing",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "营销端",
      requireAuth: true,
    },
    children: [
      // 订单审核列表
      {
        path: "order-audit-list",
        name: "order-audit-list",
        component: () => import("@/views/marketing/order-audit-list/index.vue"),
        meta: {
          title: "订单审核",
          requireAuth: true,
          hidden: true,
        },
      },
      // 订单审核详情
      {
        path: "order-audit-detail",
        name: "order-audit-detail",
        component: () => import("@/views/marketing/order-audit-list/detail.vue"),
        meta: {
          title: "订单审核详情",
          requireAuth: true,
          hidden: false,
        },
      },

      // 订单管理
      {
        path: "order",
        name: "order",
        component: () => import("@/views/marketing/order/index.vue"),
        redirect: "/marketing/order/list",
        meta: {
          title: "订单管理",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 订单列表
          {
            path: "list",
            name: "order-list",
            component: () => import("@/views/marketing/order/list.vue"),
            meta: {
              title: "订单列表",
              requireAuth: true,
              hidden: false,
            },
          },
          // 订单详情
          {
            path: "detail",
            name: "order-detail",
            component: () => import("@/views/marketing/order/detail.vue"),
            meta: {
              title: "订单详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },

      // 数据统计
      {
        path: "data-statistics",
        name: "data-statistics",
        component: () => import("@/views/marketing/data-statistics/index.vue"),
        meta: {
          title: "数据统计",
          requireAuth: true,
          hidden: true,
        },
      },
    ],
  },
];

// 总经理路由
const generalManagerRoutes = [
  {
    path: "/general-manager",
    name: "general-manager",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "总经理",
      requireAuth: true,
    },
    children: [
      // 原料采购
      {
        path: "material-purchase",
        name: "material-purchase",
        component: () =>
          import("@/views/general-manager/material-purchase/index.vue"),
        redirect: "/general-manager/material-purchase/list",
        meta: {
          title: "原料采购",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 列表
          {
            path: "list",
            name: "material-purchase-list",
            component: () =>
              import("@/views/general-manager/material-purchase/list.vue"),
            meta: {
              title: "原料采购列表",
              requireAuth: true,
              hidden: false,
            },
          },
          // 详情
          {
            path: "detail",
            name: "material-purchase-detail",
            component: () =>
              import("@/views/general-manager/material-purchase/detail.vue"),
            meta: {
              title: "原料采购详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 外采产品采购
      {
        path: "external-product-purchase",
        name: "external-product-purchase",
        component: () =>
          import("@/views/general-manager/external-product-purchase/index.vue"),
        redirect: "/general-manager/external-product-purchase/list",
        meta: {
          title: "外采产品采购",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 列表
          {
            path: "list",
            name: "external-product-purchase-list",
            component: () =>
              import(
                "@/views/general-manager/external-product-purchase/list.vue"
              ),
            meta: {
              title: "外采产品采购列表",
              requireAuth: true,
              hidden: false,
            },
          },
          // 详情
          {
            path: "detail",
            name: "external-product-purchase-detail",
            component: () =>
              import(
                "@/views/general-manager/external-product-purchase/detail.vue"
              ),
            meta: {
              title: "外采产品采购详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 外采包装
      {
        path: "external-package-purchase",
        name: "external-package-purchase",
        component: () =>
          import("@/views/general-manager/external-package-purchase/index.vue"),
        redirect: "/general-manager/external-package-purchase/list",
        meta: {
          title: "外采包装采购",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 列表
          {
            path: "list",
            name: "external-package-purchase-list",
            component: () =>
              import(
                "@/views/general-manager/external-package-purchase/list.vue"
              ),
            meta: {
              title: "外采包装采购列表",
              requireAuth: true,
              hidden: false,
            },
          },
          // 详情
          {
            path: "detail",
            name: "external-package-purchase-detail",
            component: () =>
              import(
                "@/views/general-manager/external-package-purchase/detail.vue"
              ),
            meta: {
              title: "外采包装采购详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 设备采购
      {
        path: "device-purchase",
        name: "device-purchase",
        component: () =>
          import("@/views/general-manager/device-purchase/index.vue"),
        redirect: "/general-manager/device-purchase/list",
        meta: {
          title: "设备采购",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 列表
          {
            path: "list",
            name: "device-purchase-list",
            component: () =>
              import("@/views/general-manager/device-purchase/list.vue"),
            meta: {
              title: "设备采购列表",
              requireAuth: true,
              hidden: false,
            },
          },
          // 详情
          {
            path: "detail",
            name: "device-purchase-detail",
            component: () =>
              import("@/views/general-manager/device-purchase/detail.vue"),
            meta: {
              title: "设备采购详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 其他采购
      {
        path: "other-purchase",
        name: "other-purchase",
        component: () =>
          import("@/views/general-manager/other-purchase/index.vue"),
        redirect: "/general-manager/other-purchase/list",
        meta: {
          title: "其他采购",
          requireAuth: true,
          hidden: true,
        },
        children: [
          // 列表
          {
            path: "list",
            name: "other-purchase-list",
            component: () =>
              import("@/views/general-manager/other-purchase/list.vue"),
            meta: {
              title: "其他采购列表",
              requireAuth: true,
              hidden: false,
            },
          },
          // 详情
          {
            path: "detail",
            name: "other-purchase-detail",
            component: () =>
              import("@/views/general-manager/other-purchase/detail.vue"),
            meta: {
              title: "其他采购详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
    ],
  },
];

// 财务端路由
const financeRoutes = [
  {
    path: "/finance",
    name: "finance",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "财务端",
      requireAuth: true,
    },
    children: [
      // 订单付款审核
      {
        path: "order-payment-approval",
        name: "order-payment-approval",
        component: () =>
          import("@/views/finance/order-payment-approval/index.vue"),
        redirect: "/finance/order-payment-approval/list",
        meta: {
          title: "订单管理",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "order-payment-approval-list",
            component: () =>
              import("@/views/finance/order-payment-approval/list.vue"),
            meta: {
              title: "订单管理列表",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "detail",
            name: "order-payment-approval-detail",
            component: () =>
              import("@/views/finance/order-payment-approval/detail.vue"),
            meta: {
              title: "订单管理详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 订单回款审核
      {
        path: "order-payment-receipt-approval",
        name: "order-payment-receipt-approval",
        component: () =>
          import("@/views/finance/order-payment-receipt-approval/index.vue"),
        meta: {
          title: "订单回款审核",
          requireAuth: true,
          hidden: true,
        },
      },
      // 原材料采购单付款
      {
        path: "material-purchase-payment",
        name: "material-purchase-payment",
        component: () =>
          import("@/views/finance/material-purchase-payment/index.vue"),
        meta: {
          title: "原料采购单",
          requireAuth: true,
          hidden: true,
        },
      },
      // 外采产品付款
      {
        path: "external-product-payment",
        name: "external-product-payment",
        component: () =>
          import("@/views/finance/external-product-payment/index.vue"),
        meta: {
          title: "外购产品采购单",
          requireAuth: true,
          hidden: true,
        },
      },
      // 外采包装付款
      {
        path: "external-package-payment",
        name: "external-package-payment",
        component: () =>
          import("@/views/finance/external-package-payment/index.vue"),
        meta: {
          title: "外采包装",
          requireAuth: true,
          hidden: true,
        },
      },
      // 设备采购付款
      {
        path: "device-purchase-payment",
        name: "device-purchase-payment",
        component: () =>
          import("@/views/finance/device-purchase-payment/index.vue"),
        meta: {
          title: "设备采购",
          requireAuth: true,
          hidden: true,
        },
      },
      // 其他采购付款
      {
        path: "other-purchase-payment",
        name: "other-purchase-payment",
        component: () =>
          import("@/views/finance/other-purchase-payment/index.vue"),
        meta: {
          title: "其他采购",
          requireAuth: true,
          hidden: true,
        },
      },
    ],
  },
];

// 采购端路由
const purchaseRoutes = [
  {
    path: "/purchase",
    name: "purchase",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "采购端",
      requireAuth: true,
    },
    children: [
      // 原料采购
      {
        path: "material-purchase",
        name: "material-purchase",
        component: () => import("@/views/purchase/material-purchase/index.vue"),
        redirect: "/purchase/material-purchase/list",
        meta: {
          title: "原料采购",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "material-purchase-list",
            component: () =>
              import("@/views/purchase/material-purchase/list.vue"),
            meta: {
              title: "原料采购列表",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "detail",
            name: "material-purchase-detail",
            component: () =>
              import("@/views/purchase/material-purchase/detail.vue"),
            meta: {
              title: "原料采购详情",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "add",
            name: "material-purchase-add",
            component: () =>
              import("@/views/purchase/material-purchase/add.vue"),
            meta: {
              title: "新增原料采购单",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 外采产品采购
      {
        path: "external-product-purchase",
        name: "external-product-purchase",
        component: () =>
          import("@/views/purchase/external-product-purchase/index.vue"),
        redirect: "/purchase/external-product-purchase/list",
        meta: {
          title: "外采产品采购",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "external-product-purchase-list",
            component: () =>
              import("@/views/purchase/external-product-purchase/list.vue"),
            meta: {
              title: "外采产品请购单",
              requireAuth: true,
              hidden: true,
            },
          },
          // 外购采购单列表
          {
            path: "purchase-order-list",
            name: "external-product-purchase-purchase-order-list",
            component: () =>
              import(
                "@/views/purchase/external-product-purchase/purchase-order-list.vue"
              ),
            meta: {
              title: "外购采购单列表",
              requireAuth: true,
              hidden: true,
            },
          },
          // 详情
          {
            path: "detail",
            name: "external-product-purchase-detail",
            component: () =>
              import("@/views/purchase/external-product-purchase/detail.vue"),
            meta: {
              title: "外采产品请购单详情",
              requireAuth: true,
              hidden: false,
            },
          },
          // 生成采购单
          {
            path: "generate-purchase-order",
            name: "external-product-purchase-generate-purchase-order",
            component: () =>
              import(
                "@/views/purchase/external-product-purchase/generate-purchase-order.vue"
              ),
            meta: {
              title: "生成采购单",
              requireAuth: true,
              hidden: false,
            },
          },
          // 采购单详情
          {
            path: "purchase-order-detail",
            name: "external-product-purchase-purchase-order-detail",
            component: () =>
              import(
                "@/views/purchase/external-product-purchase/purchase-order-detail.vue"
              ),
            meta: {
              title: "采购单详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 外采包装
      {
        path: "external-package-purchase",
        name: "external-package-purchase",
        component: () =>
          import("@/views/purchase/external-package-purchase/index.vue"),
        redirect: "/purchase/external-package-purchase/list",
        meta: {
          title: "外采包装采购",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "external-package-purchase-list",
            component: () =>
              import("@/views/purchase/external-package-purchase/list.vue"),
            meta: {
              title: "外采包装订单",
              requireAuth: true,
              hidden: true,
            },
          },
          // 详情
          {
            path: "detail",
            name: "external-package-purchase-detail",
            component: () =>
              import("@/views/purchase/external-package-purchase/detail.vue"),
            meta: {
              title: "外购包装详情",
              requireAuth: true,
              hidden: true,
            },
          },
          // 采购单
          {
            path: "purchase-order-list",
            name: "external-package-purchase-purchase-order-list",
            component: () =>
              import(
                "@/views/purchase/external-package-purchase/purchase-order-list.vue"
              ),
            meta: {
              title: "采购单列表",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 设备采购
      {
        path: "device-purchase",
        name: "device-purchase",
        component: () => import("@/views/purchase/device-purchase/index.vue"),
        redirect: "/purchase/device-purchase/list",
        meta: {
          title: "设备采购",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "device-purchase-list",
            component: () =>
              import("@/views/purchase/device-purchase/list.vue"),
            meta: {
              title: "设备采购列表",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "detail",
            name: "device-purchase-detail",
            component: () =>
              import("@/views/purchase/device-purchase/detail.vue"),
            meta: {
              title: "设备采购详情",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "add",
            name: "device-purchase-add",
            component: () => import("@/views/purchase/device-purchase/add.vue"),
            meta: {
              title: "新增设备采购单",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 其他采购
      {
        path: "other-purchase",
        name: "other-purchase",
        component: () => import("@/views/purchase/other-purchase/index.vue"),
        redirect: "/purchase/other-purchase/list",
        meta: {
          title: "其他采购",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "other-purchase-list",
            component: () => import("@/views/purchase/other-purchase/list.vue"),
            meta: {
              title: "其他采购列表",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "detail",
            name: "other-purchase-detail",
            component: () =>
              import("@/views/purchase/other-purchase/detail.vue"),
            meta: {
              title: "其他采购详情",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "add",
            name: "other-purchase-add",
            component: () => import("@/views/purchase/other-purchase/add.vue"),
            meta: {
              title: "新增其他采购单",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
    ],
  },
];

// 生产副总路由
const productionVicePresidentRoutes = [
  {
    path: "/production-vice-president",
    name: "production-vice-president",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "生产副总",
      requireAuth: true,
    },
    children: [
      // 原料采购
      {
        path: "material-purchase",
        name: "material-purchase",
        component: () =>
          import(
            "@/views/production-vice-president/material-purchase/index.vue"
          ),
        meta: {
          title: "原料采购",
          requireAuth: true,
          hidden: true,
        },
      },
      {
        path: "material-purchase/detail",
        name: "production-vice-president-material-purchase-detail",
        component: () =>
          import("@/views/production-vice-president/material-purchase/detail.vue"),
        meta: {
          title: "原料采购详情",
          requireAuth: true,
          hidden: false,
        },
      },
      // 外采产品采购
      {
        path: "external-product-purchase",
        name: "external-product-purchase",
        component: () =>
          import(
            "@/views/production-vice-president/external-product-purchase/index.vue"
          ),
        meta: {
          title: "外采产品采购",
          requireAuth: true,
          hidden: true,
        },
      },
      {
        path: "external-product-purchase/detail",
        name: "production-vice-president-external-product-purchase-detail",
        component: () =>
          import(
            "@/views/production-vice-president/external-product-purchase/detail.vue"
          ),
        meta: {
          title: "外采产品采购详情",
          requireAuth: true,
          hidden: false,
        },
      },
      // 外采包装
      {
        path: "external-package-purchase",
        name: "external-package-purchase",
        component: () =>
          import("@/views/production-vice-president/external-package-purchase/index.vue"),
        meta: {
          title: "外采包装",
          requireAuth: true,
          hidden: true,
        },
      },
      {
        path: "external-package-purchase/detail",
        name: "production-vice-president-external-package-purchase-detail",
        component: () =>
          import("@/views/production-vice-president/external-package-purchase/detail.vue"),
        meta: {
          title: "外采包装采购详情",
          requireAuth: true,
          hidden: false,
        },
      },
      // 设备采购
      {
        path: "device-purchase",
        name: "device-purchase",
        component: () =>
          import("@/views/production-vice-president/device-purchase/index.vue"),
        meta: {
          title: "设备采购",
          requireAuth: true,
          hidden: true,
        },
      },
      {
        path: "device-purchase/detail",
        name: "production-vice-president-device-purchase-detail",
        component: () =>
          import("@/views/production-vice-president/device-purchase/detail.vue"),
        meta: {
          title: "设备采购详情",
          requireAuth: true,
          hidden: false,
        },
      },
      // 其他采购
      {
        path: "other-purchase",
        name: "other-purchase",
        component: () =>
          import("@/views/production-vice-president/other-purchase/index.vue"),
        meta: {
          title: "其他采购",
          requireAuth: true,
          hidden: true,
        },
      },
      {
        path: "other-purchase/detail",
        name: "production-vice-president-other-purchase-detail",
        component: () =>
          import("@/views/production-vice-president/other-purchase/detail.vue"),
        meta: {
          title: "其他采购详情",
          requireAuth: true,
          hidden: false,
        },
      },
    ],
  },
];

// 库管理端路由 - 产品库管
const warehouseRoutes = [
  {
    path: "/warehouse",
    name: "warehouse",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "产品库管",
      requireAuth: true,
    },
    children: [
      // 产品库存管理
      {
        path: "product-inventory-management",
        name: "product-inventory-management",
        component: () =>
          import("@/views/warehouse/product-inventory-management/index.vue"),
        redirect: "/warehouse/product-inventory-management/list",
        meta: {
          title: "产品库存管理",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "product-inventory-management-list",
            component: () =>
              import("@/views/warehouse/product-inventory-management/list.vue"),
            meta: {
              title: "产品库存管理列表",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "detail",
            name: "product-inventory-management-detail",
            component: () =>
              import(
                "@/views/warehouse/product-inventory-management/detail.vue"
              ),
            meta: {
              title: "产品库存管理详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 产品库存盘点
      {
        path: "product-inventory-check",
        name: "product-inventory-check",
        component: () =>
          import("@/views/warehouse/product-inventory-check/index.vue"),
        meta: {
          title: "产品库存盘点",
          requireAuth: true,
          hidden: true,
        },
      },
      // 产品出库申请
      {
        path: "product-out-apply",
        name: "product-out-apply",
        component: () =>
          import("@/views/warehouse/product-out-apply/index.vue"),
        meta: {
          title: "产品出库申请",
          requireAuth: true,
          hidden: true,
        },
      },
      // 产品出库记录
      {
        path: "product-out-record",
        name: "product-out-record",
        component: () =>
          import("@/views/warehouse/product-out-record/index.vue"),
        meta: {
          title: "产品出库记录",
          requireAuth: true,
          hidden: true,
        },
      },
      // 客户外来包装
      {
        path: "external-package-from-customer",
        name: "external-package-from-customer",
        component: () =>
          import("@/views/warehouse/external-package-from-customer/index.vue"),
        redirect: "/warehouse/external-package-from-customer/list",
        meta: {
          title: "客户外来包装",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "external-package-from-customer-list",
            component: () =>
              import(
                "@/views/warehouse/external-package-from-customer/list.vue"
              ),
            meta: {
              title: "客户外来包装列表",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "detail",
            name: "external-package-from-customer-detail",
            component: () =>
              import(
                "@/views/warehouse/external-package-from-customer/detail.vue"
              ),
            meta: {
              title: "客户外来包装详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 外购产品库存
      {
        path: "external-product-inventory",
        name: "external-product-inventory",
        component: () =>
          import("@/views/warehouse/external-product-inventory/index.vue"),
        redirect: "/warehouse/external-product-inventory/list",
        meta: {
          title: "外购产品库存",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "external-product-inventory-list",
            component: () =>
              import("@/views/warehouse/external-product-inventory/list.vue"),
            meta: {
              title: "外购产品库存列表",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "detail",
            name: "external-product-inventory-detail",
            component: () =>
              import("@/views/warehouse/external-product-inventory/detail.vue"),
            meta: {
              title: "外购产品库存详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 外购采购单入库
      {
        path: "external-purchase-single-in-storage",
        name: "external-purchase-single-in-storage",
        component: () =>
          import(
            "@/views/warehouse/external-purchase-single-in-storage/index.vue"
          ),
        redirect: "/warehouse/external-purchase-single-in-storage/list",
        meta: {
          title: "外购采购单入库",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "external-purchase-single-in-storage-list",
            component: () =>
              import(
                "@/views/warehouse/external-purchase-single-in-storage/list.vue"
              ),
            meta: {
              title: "外购采购单入库列表",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "detail",
            name: "external-purchase-single-in-storage-detail",
            component: () =>
              import(
                "@/views/warehouse/external-purchase-single-in-storage/detail.vue"
              ),
            meta: {
              title: "外购采购单入库详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
    ],
  },
];

// 库管理员路由 - 原料库管
const warehouseManagerRoutes = [
  {
    path: "/warehouse",
    name: "warehouse",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "原料库管",
      requireAuth: true,
    },
    children: [
      // 原料库管理
      {
        path: "material-warehouse-management",
        name: "material-warehouse-management",
        component: () =>
          import("@/views/warehouse/material-warehouse-management/index.vue"),
        redirect: "/warehouse/material-warehouse-management/list",
        meta: {
          title: "原料库管理",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "material-warehouse-management-list",
            component: () =>
              import(
                "@/views/warehouse/material-warehouse-management/list.vue"
              ),
            meta: {
              title: "原料库管理列表",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "detail",
            name: "material-warehouse-management-detail",
            component: () =>
              import(
                "@/views/warehouse/material-warehouse-management/detail.vue"
              ),
            meta: {
              title: "原料库管理详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 原料库存盘点
      {
        path: "material-inventory-check",
        name: "material-inventory-check",
        component: () =>
          import("@/views/warehouse/material-inventory-check/index.vue"),
        meta: {
          title: "原料库存盘点",
          requireAuth: true,
          hidden: true,
        },
      },
      // 原料出库管理
      {
        path: "material-out-management",
        name: "material-out-management",
        component: () =>
          import("@/views/warehouse/material-out-management/index.vue"),
        redirect: "/warehouse/material-out-management/list",
        meta: {
          title: "原料出库管理",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "material-out-management-list",
            component: () =>
              import("@/views/warehouse/material-out-management/list.vue"),
            meta: {
              title: "原料出库管理列表",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "detail",
            name: "material-out-management-detail",
            component: () =>
              import("@/views/warehouse/material-out-management/detail.vue"),
            meta: {
              title: "原料出库管理详情",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "add",
            name: "material-out-management-add",
            component: () =>
              import("@/views/warehouse/material-out-management/add.vue"),
            meta: {
              title: "新增原料出库管理",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
      // 原料采购单入库
      {
        path: "material-purchase-single-in-storage",
        name: "material-purchase-single-in-storage",
        component: () =>
          import(
            "@/views/warehouse/material-purchase-single-in-storage/index.vue"
          ),
        redirect: "/warehouse/material-purchase-single-in-storage/list",
        meta: {
          title: "原料采购单入库",
          requireAuth: true,
          hidden: true,
        },
        children: [
          {
            path: "list",
            name: "material-purchase-single-in-storage-list",
            component: () =>
              import(
                "@/views/warehouse/material-purchase-single-in-storage/list.vue"
              ),
            meta: {
              title: "原料采购单入库列表",
              requireAuth: true,
              hidden: false,
            },
          },
          {
            path: "detail",
            name: "material-purchase-single-in-storage-detail",
            component: () =>
              import(
                "@/views/warehouse/material-purchase-single-in-storage/detail.vue"
              ),
            meta: {
              title: "原料采购单入库详情",
              requireAuth: true,
              hidden: false,
            },
          },
        ],
      },
    ],
  },
];

// 角色路由映射表
// key: 角色标识（从后端返回的 opRole）
// value: 对应的路由配置数组
const roleRouteMap = {
  // 测试用
  // 9: warehouseManagerRoutes, // 管理员
  // '9': warehouseManagerRoutes, // 管理员


  // 正式用 需要解除注释
  9: managerRoutes, // 管理员
  9: managerRoutes, // 管理员

  1: salesRoutes, // 业务员
  1: salesRoutes, // 业务员

  2: marketingRoutes, // 营销员
  2: marketingRoutes, // 营销员

  5: generalManagerRoutes, // 总经理
  5: generalManagerRoutes, // 总经理

  6: financeRoutes, // 财务
  6: financeRoutes, // 财务

  3: purchaseRoutes, // 采购
  3: purchaseRoutes, // 采购

  4: productionVicePresidentRoutes, // 生产副总
  4: productionVicePresidentRoutes, // 生产副总

  7: warehouseRoutes, // 产品库管
  7: warehouseRoutes, // 产品库管

  8: warehouseManagerRoutes, // 原料库管
  8: warehouseManagerRoutes, // 原料库管
};

/**
 * 根据角色获取对应的路由配置
 * @param {string} role - 用户角色
 * @returns {Array} 路由配置数组
 */
export function getRoutesByRole(role) {
  if (!role) {
    return [];
  }

  // 如果角色是字符串，直接查找
  if (typeof role === "string" || typeof role === "number") {
    return roleRouteMap[role] || [];
  }

  // 如果角色是数组，返回所有匹配的路由
  if (Array.isArray(role)) {
    const routes = [];
    role.forEach((r) => {
      if (roleRouteMap[r]) {
        routes.push(...roleRouteMap[r]);
      }
    });
    return routes;
  }

  return [];
}

/**
 * 获取所有角色路由（用于开发调试）
 */
export function getAllRoleRoutes() {
  return Object.values(roleRouteMap).flat();
}

export default {
  getRoutesByRole,
  getAllRoleRoutes,
  roleRouteMap,
};
