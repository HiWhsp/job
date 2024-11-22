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
      },
      {
        path: "/createGroup", // 创建团体
        name: "createGroup",
        meta: {},
        component: () => import("@/views/my/createGroup.vue"),
      },
      {
        path: "/order", // 我的订单
        name: "order",
        meta: {},
        component: () => import("@/views/my/order/index.vue"),
      },
      {
        path: "/approvalOrder", // 审批订单
        name: "approvalOrder",
        meta: {},
        component: () => import("@/views/my/order/approval.vue"),
      },
      {
        path: "/exchangeOrder", // 积分兑换订单
        name: "exchangeOrder",
        meta: {},
        component: () => import("@/views/my/order/exchange/exchange.vue"),
      },
      {
        path: "/exchangeDetail", // 积分兑换详情
        name: "exchangeDetail",
        meta: {},
        component: () => import("@/views/my/order/exchange/exchange-detail.vue"),
      },
      {
        path: "/orderDetail", // 订单详情
        name: "orderDetail",
        meta: {},
        component: () => import("@/views/my/order/detail.vue"),
      },
      {
        path: "/afterSales", // 售后服务
        name: "afterSales",
        meta: {},
        component: () => import("@/views/my/order/afterSales.vue"),
      },
      {
        path: '/preSave', // 预存管理
        name: 'preSave',
        meta: {},
        component: () => import("@/views/my/order/preSave/preSave.vue"),
      },
      {
        path: '/preSave-pay', // 预存管理支付
        name: 'preSave-pay',
        meta: {},
        component: () => import("@/views/my/order/preSave/preSave-pay.vue"),
      },
      {
        path: '/creditLine', // 信用额度
        name: 'creditLine',
        meta: {},
        component: () => import("@/views/my/order/creditLine.vue"),
      },
      {
        path: '/repayment', // 还款
        name: 'repayment',
        meta: {},
        component: () => import("@/views/my/order/repayment.vue"),
      },
      {
        path: '/point', // 积分
        name: 'point',
        meta: {},
        component: () => import("@/views/my/order/point/index.vue"),
      },
      {
        path: '/pointMall', // 积分商城
        name: 'pointMall',
        meta: {},
        component: () => import("@/views/my/order/point/pointMall.vue"),
      },
      {
        path: '/commission', // 佣金
        name: 'commission',
        meta: {},
        component: () => import("@/views/my/commission/index.vue"),
      },
      {
        path: '/myCoupon', // 我的优惠券
        name: 'myCoupon',
        meta: {},
        component: () => import("@/views/my/myCoupon.vue"),
      },
      {
        path: '/myPost', //我的帖子
        name: 'myPost',
        meta: {},
        component: () => import("@/views/my/myPost/index.vue"),
      }
    ]
  }
]
