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
      },
      {
        path: "/message-list", // 消息列表
        name: "message-list",
        meta: {},
        component: () => import("@/views/supplier/message/message.vue")
      },
      {
        path: "/supplier-order", // 供应商订单
        name: "supplier-order",
        meta: {},
        component: () => import("@/views/supplier/order/index.vue")
      },
      {
        path: "/assign-order", // 分配订单
        name: "assign-order",
        meta: {},
        component: () => import("@/views/supplier/order/assign.vue")
      },
      {
        path: "/supplier-order-detail", // 订单详情
        name: "supplier-order-detail",
        meta: {},
        component: () => import("@/views/supplier/order/detail.vue")
      },
      {
        path: "/transit-order", //  运输订单
        name: "transit-order",
        meta: {},
        component: () => import("@/views/supplier/order/transit.vue")
      },
      {
        path: "/waitUploadResult-order", // 待上传结果订单
        name: "waitUploadResult-order",
        meta: {},
        component: () => import("@/views/supplier/order/uploadResult.vue")
      },
      {
        path: "/reportAudit-order", // 报告审核订单
        name: "reportAudit-order",
        meta: {},
        component: () => import("@/views/supplier/order/reportAudit.vue")
      },
      {
        path: "/finish-order", // 完成订单
        name: "finish-order",
        meta: {},
        component: () => import("@/views/supplier/order/finish.vue")
      },
      {
        path: "/retest-order", // 重新测试订单
        name: "retest-order",
        meta: {},
        component: () => import("@/views/supplier/order/retest.vue")
      },
      {
        path: "/waitSettlement-order", // 待结算订单
        name: "waitSettlement-order",
        meta: {},
        component: () => import("@/views/supplier/order/settlement.vue")
      },
      {
        path: "/sampleRecovery-order", // 样本回收订单
        name: "sampleRecovery-order",
        meta: {},
        component: () => import("@/views/supplier/order/sampleRecovery.vue")
      },
      {
        path: "/objection-order", // 异议订单
        name: "objection-order",
        meta: {},
        component: () => import("@/views/supplier/order/objection.vue")
      },
      {
        path: "/overdue-order", // 逾期订单
        name: "overdue-order",
        meta: {},
        component: () => import("@/views/supplier/order/overdue.vue")
      },
      {
        path: "/supplier-reportManage", // 报告管理
        name: "supplier-reportManage",
        meta: {},
        component: () => import("@/views/supplier/reportManage/index.vue")
      }
    ]
  }
]
