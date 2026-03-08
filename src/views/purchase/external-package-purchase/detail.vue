<template>
  <div class="view-wrap requisition-detail-page">
    <h1 class="page-title">订单详情</h1>

    <!-- 订单基础信息 -->
    <div class="section-block">
      <div class="section-title-bar">
        <span class="title-line" />
        <h2 class="section-title">订单基础信息</h2>
      </div>
      <div class="info-grid">
        <div class="info-col">
          <div class="info-item">
            <span class="info-label">外购请购单单号:</span>
            <span class="info-value">{{ detail.requisitionNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">下单时间:</span>
            <span class="info-value">{{ detail.orderTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">采购金额:</span>
            <span class="info-value">{{ detail.purchaseAmount }}</span>
          </div>
        </div>
        <div class="info-col">
          <div class="info-item">
            <span class="info-label">所属订单号:</span>
            <span class="info-value">{{ detail.orderNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">订单状态:</span>
            <span class="info-value">
              <el-tag v-if="detail.status === '待审核'" type="info" size="small" effect="plain">待审核</el-tag>
              <el-tag
                v-else-if="detail.status === '审核通过'"
                type="success"
                size="small"
                effect="plain"
              >审核通过</el-tag>
              <span v-else>{{ detail.status }}</span>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">预计到货期:</span>
            <span class="info-value">{{ detail.arrivalDate }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 外购产品信息 -->
    <div class="section-block">
      <div class="section-title-bar">
        <span class="title-line" />
        <h2 class="section-title">外购产品信息</h2>
      </div>
      <div class="table-box">
        <el-table
          :data="productList"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" label="序号" width="70" align="center">
            <template slot-scope="scope">{{ String(scope.$index + 1).padStart(3, '0') }}</template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
          <el-table-column prop="unitPrice" label="单价" min-width="110" align="right" />
          <el-table-column prop="quantity" label="数量" width="90" align="center" />
          <el-table-column prop="totalPrice" label="总价" min-width="110" align="right" />
          <el-table-column prop="unit" label="单位" width="80" align="center" />
        </el-table>
      </div>
    </div>

    <!-- 审核流程 -->
    <div class="section-block">
      <div class="section-title-bar">
        <span class="title-line" />
        <h2 class="section-title">审核流程</h2>
      </div>
      <div class="table-box">
        <el-table
          :data="approvalList"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="approver" label="审核人" min-width="120" />
          <el-table-column prop="approvalTime" label="审核时间" min-width="160" />
          <el-table-column prop="approvalStatus" label="审核状态" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag
                v-if="row.approvalStatus === '审核通过'"
                type="success"
                size="small"
                effect="plain"
              >审核通过</el-tag>
              <span v-else>{{ row.approvalStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="approvalRemark"
            label="审核备注"
            min-width="120"
            show-overflow-tooltip
          />
        </el-table>
      </div>
    </div>

    <!-- 付款记录 -->
    <div class="section-block">
      <div class="section-title-bar">
        <span class="title-line" />
        <h2 class="section-title">付款记录</h2>
      </div>
      <div class="table-box">
        <el-table
          :data="paymentList"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="amount" label="付款金额" width="120" align="left" />
          <el-table-column prop="paymentTime" label="付款时间" width="160" />
          <el-table-column label="付款凭证" align="center">
            <template slot-scope="{ row }">
              <a v-if="row.voucherUrl" href="javascript:;" class="link" @click="handleViewVoucher(row)">查看</a>
              <span v-else class="voucher-placeholder">—</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 入库记录 -->
    <div class="section-block">
      <div class="section-title-bar">
        <span class="title-line" />
        <h2 class="section-title">入库记录</h2>
      </div>
      <div class="table-box">
        <el-table
          :data="inboundList"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="inboundNo" label="入库单号" min-width="120" />
          <el-table-column prop="inboundTime" label="入库时间" min-width="160" />
          <el-table-column label="质检报告" min-width="140" align="center">
            <template slot-scope="{ row }">
              <a v-if="row.reportUrl" href="javascript:;" class="link" @click="handleViewReport(row)">查看</a>
              <span v-else class="voucher-placeholder">—</span>
            </template>
          </el-table-column>
          <el-table-column prop="qcRemark" label="质检备注" min-width="120" show-overflow-tooltip />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExternalPackageRequisitionDetail",
  data() {
    return {
      detail: {
        requisitionNo: "2026001-999",
        orderNo: "2026001-999",
        orderTime: "2006-01-01",
        purchaseAmount: "2545.00",
        status: "待审核",
        arrivalDate: "2006-01-01"
      },
      productList: [
        {
          productName: "单层牙齿盘",
          spec: "98,A1,10mm",
          unitPrice: "2000.00",
          quantity: 20,
          totalPrice: "40000.00",
          unit: "盒"
        },
        {
          productName: "单层牙齿盘",
          spec: "98,A1,10mm",
          unitPrice: "2000.00",
          quantity: 20,
          totalPrice: "40000.00",
          unit: "盒"
        },
        {
          productName: "单层牙齿盘",
          spec: "98,A1,10mm",
          unitPrice: "2000.00",
          quantity: 20,
          totalPrice: "40000.00",
          unit: "盒"
        },
        {
          productName: "单层牙齿盘",
          spec: "98,A1,10mm",
          unitPrice: "2000.00",
          quantity: 20,
          totalPrice: "40000.00",
          unit: "盒"
        }
      ],
      approvalList: [
        {
          approver: "总经理",
          approvalTime: "2026-3-23 15:23:24",
          approvalStatus: "审核通过",
          approvalRemark: "审核通过"
        }
      ],
      paymentList: [
        { amount: "5000.00", paymentTime: "2026-3-23 15:23:24", voucherUrl: "" }
      ],
      inboundList: [
        { inboundNo: "78974556", inboundTime: "2026-3-23 15:23:24", reportUrl: "", qcRemark: "质检入库" }
      ]
    };
  },
  created() {
    const id = this.$route.query.id;
    if (id) {
      // TODO: 根据 id 请求外采包装订单详情，赋值 detail、productList、approvalList、paymentList、inboundList
    }
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    handleViewVoucher(row) {
      // TODO: 查看付款凭证
      this.$message.info("查看付款凭证");
    },
    handleViewReport(row) {
      // TODO: 查看质检报告
      this.$message.info("查看质检报告");
    }
  }
};
</script>

<style lang="less" scoped>
.requisition-detail-page {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  min-height: 100%;
  padding: 24px 27px 40px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 24px;
  text-align: left;
}

.section-block {
  margin-bottom: 32px;
}

.section-title-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e6e6e6;
  .title-line {
    width: 8px;
    height: 21px;
    background: #2373c8;
    border-radius: 2px;
    margin-right: 8px;
  }
  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #2373c8;
    margin: 0;
  }
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 23px;
  flex-wrap: wrap;
  padding: 16px 0;
}

.info-col {
  display: flex;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  flex: 1;
  .info-label {
    color: #606266;
    width: 120px;
    text-align: left;
  }
  .info-value {
    color: #303133;
    text-align: left;
  }
}

.table-box {
  ::v-deep .el-table {
    font-size: 14px;
    .table-header-cell {
      background: #f5f7fa;
      color: #303133;
      font-weight: 500;
    }
    .el-table__body tr.row-even td {
      background: #f3f7fa;
    }
    .el-table__body tr:hover > td {
      background: #f5f7fa !important;
    }
  }
  ::v-deep .el-tag--info.el-tag--plain {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
  }
  ::v-deep .el-tag--success.el-tag--plain {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
  }
  .link {
    color: #3377fe;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .voucher-placeholder {
    color: #c0c4cc;
  }
}
</style>
