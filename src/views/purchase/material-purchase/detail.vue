<template>
  <div class="view-wrap detail-purchase-page">
    <h1 class="page-title">采购单详情</h1>

    <!-- 订单基础信息 -->
    <div class="section-block">
      <div class="section-title-bar">
        <span class="title-line" />
        <h2 class="section-title">订单基础信息</h2>
      </div>
      <div class="info-grid">
        <div class="info-col">
          <div class="info-item">
            <span class="info-label">采购单号:</span>
            <span class="info-value">{{ detail.purchaseNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">采购单名称:</span>
            <span class="info-value">{{ detail.purchaseName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">采购合同:</span>
            <span class="info-value">
              <a v-if="detail.contractFile" href="javascript:;" class="link" @click="handleViewContract">{{ detail.contractFile }}</a>
              <span v-else>--</span>
            </span>
          </div>
        </div>
        <div class="info-col">
          <div class="info-item">
            <span class="info-label">提交时间:</span>
            <span class="info-value">{{ detail.submitTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">订单状态:</span>
            <span class="info-value">{{ detail.status }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">订单金额:</span>
            <span class="info-value">{{ detail.orderAmount }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核备注:</span>
            <span class="info-value">{{ detail.auditRemark || '--' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 原料信息 -->
    <div class="section-block">
      <div class="section-title-bar">
        <span class="title-line" />
        <h2 class="section-title">原料信息</h2>
      </div>
      <div class="table-box">
        <el-table
          :data="materialList"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="materialCode" label="原料编码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="materialName" label="原料名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格" min-width="100" show-overflow-tooltip />
          <el-table-column prop="quantity" label="数量" width="100" align="center" />
          <el-table-column prop="category" label="所属分类" min-width="100" show-overflow-tooltip />
          <el-table-column prop="productCategory" label="用于产品大类" min-width="140" show-overflow-tooltip />
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
              <el-tag v-if="row.approvalStatus === '审核通过'" type="success" size="small" effect="plain">审核通过</el-tag>
              <span v-else>{{ row.approvalStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="approvalRemark" label="审核备注" min-width="120" show-overflow-tooltip />
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
          <el-table-column prop="amount" label="付款金额"  align="left" />
          <el-table-column prop="paymentTime" label="付款时间" />
          <el-table-column label="付款凭证" >
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

    <!-- 底部操作 -->
    <div class="footer-actions">
      <el-button type="primary" @click="handleConfirm">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MaterialPurchaseDetail",
  data() {
    return {
      detail: {
        purchaseNo: "2026001-999",
        purchaseName: "采购单名称",
        contractFile: "采购合同.pdf",
        submitTime: "2006-01-01",
        status: "待审核",
        orderAmount: "2545.00",
        auditRemark: ""
      },
      materialList: [
        { materialCode: "4578786954", materialName: "原料名称", spec: "规格名称", quantity: 20, category: "原料分类", productCategory: "产品大类、产品大类", unit: "盒" },
        { materialCode: "4578786954", materialName: "原料名称", spec: "规格名称", quantity: 20, category: "原料分类", productCategory: "产品大类、产品大类", unit: "盒" },
        { materialCode: "4578786954", materialName: "原料名称", spec: "规格名称", quantity: 20, category: "原料分类", productCategory: "产品大类、产品大类", unit: "盒" },
        { materialCode: "4578786954", materialName: "原料名称", spec: "规格名称", quantity: 20, category: "原料分类", productCategory: "产品大类、产品大类", unit: "盒" },
        { materialCode: "4578786954", materialName: "原料名称", spec: "规格名称", quantity: 20, category: "原料分类", productCategory: "产品大类、产品大类", unit: "盒" },
        { materialCode: "4578786954", materialName: "原料名称", spec: "规格名称", quantity: 20, category: "原料分类", productCategory: "产品大类、产品大类", unit: "盒" },
        { materialCode: "4578786954", materialName: "原料名称", spec: "规格名称", quantity: 20, category: "原料分类", productCategory: "产品大类、产品大类", unit: "盒" },
        { materialCode: "4578786954", materialName: "原料名称", spec: "规格名称", quantity: 20, category: "原料分类", productCategory: "产品大类、产品大类", unit: "盒" },
        { materialCode: "4578786954", materialName: "原料名称", spec: "规格名称", quantity: 20, category: "原料分类", productCategory: "产品大类、产品大类", unit: "盒" },
        { materialCode: "4578786954", materialName: "原料名称", spec: "规格名称", quantity: 20, category: "原料分类", productCategory: "产品大类、产品大类", unit: "盒" }
      ],
      approvalList: [
        { approver: "总经理", approvalTime: "2026-3-23 15:23:24", approvalStatus: "审核通过", approvalRemark: "审核通过" },
        { approver: "生产部经理", approvalTime: "2026-3-23 15:23:24", approvalStatus: "审核通过", approvalRemark: "审核通过" }
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
      // TODO: 根据 id 请求详情接口，赋值 detail 和 materialList
    }
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    handleViewContract() {
      // TODO: 下载或预览采购合同
      this.$message.info("查看采购合同");
    },
    handleViewVoucher(row) {
      // TODO: 查看付款凭证
      this.$message.info("查看付款凭证");
    },
    handleViewReport(row) {
      // TODO: 查看质检报告
      this.$message.info("查看质检报告");
    },
    handleConfirm() {
      this.$router.push({ name: "material-purchase-list" });
    },
    handleCancel() {
      this.$router.push({ name: "material-purchase-list" });
    }
  }
};
</script>

<style lang="less" scoped>
.detail-purchase-page {
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
  justify-content: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E6E6E6;
  .title-line {
    width: 8px;
    height: 21px;
    background: #2373C8;
    border-radius: 2px;
    margin-right: 8px;
  }
  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #2373C8;
    margin: 0;
  }
}

.info-grid {
  display: flex;
  gap: 80px 120px;
  flex-wrap: wrap;
  padding: 16px 0;
}

.info-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  .info-label {
    color: #606266;
    min-width: 90px;
    flex-shrink: 0;
  }
  .info-value {
    color: #303133;
  }
  .link {
    color: #3377fe;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
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

/* 审核状态-通过：浅绿 */
.table-box ::v-deep .el-tag--success.el-tag--plain {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}

.footer-actions {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
  margin-top: 8px;
  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
  .el-button:not(.el-button--primary) {
    background: #fff;
    border-color: #dcdfe6;
    color: #606266;
  }
}
</style>
