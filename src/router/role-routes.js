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
      requireAuth: true
    },
    children: [
      // 客户管理
      {
        path: "customer",
        name: "customer",
        component: () => import("@/views/manager/customer/index.vue"),
        redirect: '/manager/customer/list',
        meta: {
          title: "客户管理",
          requireAuth: true
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
              hidden: false
            }
          },
          // 新增客户
          {
            path: "add",
            name: "customer-add",
            component: () => import("@/views/manager/customer/add.vue"),
            meta: {
              title: "新增客户",
              requireAuth: true,
              hidden: false
            }
          }
        ]
      },
      // 客户管理审核
      {
        path: 'audit',
        name: 'customer-audit',
        component: () => import("@/views/manager/customer/audit.vue"),
        meta: {
          title: "客户管理审核",
          requireAuth: true,
          hidden: true
        }
      },
      // 产品管理
      {
        path: 'product',
        name: 'product',
        component: () => import("@/views/manager/product/index.vue"),
        meta: {
          title: "产品管理",
          requireAuth: true,
          hidden: true
        },
        children: [
          // 产品分类管理
          {
            path: 'category',
            name: 'product-category',
            component: () => import("@/views/manager/product/category.vue"),
            meta: {
              title: "产品分类管理",
              requireAuth: true,
              hidden: true
            }
          },
          // 产品管理
          {
            path: 'list',
            name: 'product-list',
            component: () => import("@/views/manager/product/list.vue"),
            meta: {
              title: "产品管理",
              requireAuth: true,
              hidden: true
            }
          },
          // 产品新增
          {
            path: 'add',
            name: 'product-add',
            component: () => import("@/views/manager/product/add.vue"),
            meta: {
              title: "产品新增",
              requireAuth: true,
              hidden: false
            }
          }
        ]
      },
      // 产品指导价格
      {
        path: 'price',
        name: 'product-price',
        component: () => import("@/views/manager/product/price.vue"),
        meta: {
          title: "产品指导价格",
          requireAuth: true,
          hidden: true
        }
      },
      // 内部原料管理
      {
        path: 'internal-material',
        name: 'internal-material',
        component: () => import("@/views/manager/internal-material/index.vue"),
        meta: {
          title: "内部原料管理",
          requireAuth: true,
          hidden: true
        },
        children: [
          // 原料分类管理
          {
            path: 'category',
            name: 'internal-material-category',
            component: () => import("@/views/manager/internal-material/category.vue"),
            meta: {
              title: "原料分类管理",
              requireAuth: true,
              hidden: true
            }
          },
          {
            path: 'list',
            name: 'internal-material-list',
            component: () => import("@/views/manager/internal-material/list.vue"),
            meta: {
              title: "原料管理",
              requireAuth: true,
              hidden: true
            }
          },
          // 新增原料
          {
            path: 'add',
            name: 'internal-material-add',
            component: () => import("@/views/manager/internal-material/add.vue"),
            meta: {
              title: "新增原料",
              requireAuth: true,
              hidden: false
            }
          }
        ]
      },
      // 客户外来包装
      {
        path: 'external-package',
        name: 'external-package',
        component: () => import("@/views/manager/external-package/index.vue"),
        redirect: '/manager/external-package/list',
        meta: {
          title: "客户外来包装",
          requireAuth: true,
          hidden: true
        },
        children: [ 
          // 客户外来包装管理
          {
            path: 'list',
            name: 'external-package-list',
            component: () => import("@/views/manager/external-package/list.vue"),
            meta: {
              title: "客户外来包装管理",
              requireAuth: true,
              hidden: false
            }
          },
          // 新增客户外来包装
          {
            path: 'add',
            name: 'external-package-add',
            component: () => import("@/views/manager/external-package/add.vue"),
            meta: {
              title: "新增客户外来包装",
              requireAuth: true,
              hidden: false
            }
          }
        ]
      },
      // 外购产品管理
      {
        path: 'external-product',
        name: 'external-product',
        component: () => import("@/views/manager/external-product/index.vue"),
        redirect: '/manager/external-product/list',
        meta: {
          title: "外购产品管理",
          requireAuth: true,
          hidden: true
        },
        children: [
          // 外购产品管理
          {
            path: 'list',
            name: 'external-product-list',
            component: () => import("@/views/manager/external-product/list.vue"),
            meta: {
              title: "外购产品管理",
              requireAuth: true,
              hidden: false
            }
          },
          // 新增外购产品
          {
            path: 'add',
            name: 'external-product-add',
            component: () => import("@/views/manager/external-product/add.vue"),
            meta: {
              title: "新增外购产品",
              requireAuth: true,
              hidden: false
            }
          }
        ]
      }
    ]
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
      requireAuth: true
    },
    children: [
      // {
      //   path: "dashboard",
      //   name: "sales-dashboard",
      //   component: () => import("@/views/sales/dashboard.vue"),
      //   meta: {
      //     title: "业务员首页"
      //   }
      // }
    ]
  }
];

// 营销端路由
const marketingRoutes = [
  {
    path: "/marketing",
    name: "marketing",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "营销端",
      requireAuth: true
    },
    children: [
      // {
      //   path: "dashboard",
      //   name: "marketing-dashboard",
      //   component: () => import("@/views/marketing/dashboard.vue"),
      //   meta: {
      //     title: "营销端首页"
      //   }
      // }
    ]
  }
];

// 总经理路由
const generalManagerRoutes = [
  {
    path: "/general-manager",
    name: "general-manager",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "总经理",
      requireAuth: true
    },
    children: [
      // {
      //   path: "dashboard",
      //   name: "general-manager-dashboard",
      //   component: () => import("@/views/general-manager/dashboard.vue"),
      //   meta: {
      //     title: "总经理首页"
      //   }
      // }
    ]
  }
];

// 财务端路由
const financeRoutes = [
  {
    path: "/finance",
    name: "finance",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "财务端",
      requireAuth: true
    },
    children: [
      // {
      //   path: "dashboard",
      //   name: "finance-dashboard",
      //   component: () => import("@/views/finance/dashboard.vue"),
      //   meta: {
      //     title: "财务端首页"
      //   }
      // }
    ]
  }
];

// 采购端路由
const purchaseRoutes = [
  {
    path: "/purchase",
    name: "purchase",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "采购端",
      requireAuth: true
    },
    children: [
      // {
      //   path: "dashboard",
      //   name: "purchase-dashboard",
      //   component: () => import("@/views/purchase/dashboard.vue"),
      //   meta: {
      //     title: "采购端首页"
      //   }
      // }
    ]
  }
];

// 生产副总路由
const productionVicePresidentRoutes = [
  {
    path: "/production-vice-president",
    name: "production-vice-president",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "生产副总",
      requireAuth: true
    },
    children: [
      // {
      //   path: "dashboard",
      //   name: "production-vice-president-dashboard",
      //   component: () => import("@/views/production-vice-president/dashboard.vue"),
      //   meta: {
      //     title: "生产副总首页"
      //   }
      // }
    ]
  }
];

// 库管理端路由
const warehouseRoutes = [
  {
    path: "/warehouse",
    name: "warehouse",
    component: () => import("@/views/layout.vue"),
    meta: {
      title: "库管理端",
      requireAuth: true
    },
    children: [
      // {
      //   path: "dashboard",
      //   name: "warehouse-dashboard",
      //   component: () => import("@/views/warehouse/dashboard.vue"),
      //   meta: {
      //     title: "库管理端首页"
      //   }
      // }
    ]
  }
];

// 角色路由映射表
// key: 角色标识（从后端返回的 opRole）
// value: 对应的路由配置数组
const roleRouteMap = {
  // manager: managerRoutes,
  do: managerRoutes,
  sales: salesRoutes,
  marketing: marketingRoutes,
  generalManager: generalManagerRoutes,
  finance: financeRoutes,
  purchase: purchaseRoutes,
  productionVicePresident: productionVicePresidentRoutes,
  warehouse: warehouseRoutes
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
  if (typeof role === 'string') {
    return roleRouteMap[role] || [];
  }

  // 如果角色是数组，返回所有匹配的路由
  if (Array.isArray(role)) {
    const routes = [];
    role.forEach(r => {
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
  roleRouteMap
};
