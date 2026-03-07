<template>
  <div class="purchase-detail-page">
    <div class="page-title">采购单详情</div>
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">订单基础信息</span>
      </div>
      <div class="section-body">
        <el-row :gutter="24" class="field-row">
          <el-col :span="12" class="field-item">
            <span class="field-label">采购单号：</span>
            <span class="field-value">{{ detail.purchaseNo }}</span>
          </el-col>
          <el-col :span="12" class="field-item">
            <span class="field-label">采购单名称：</span>
            <span class="field-value">{{ detail.purchaseName }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="field-row">
          <el-col :span="12" class="field-item">
            <span class="field-label">提交时间：</span>
            <span class="field-value">{{ detail.submitTime }}</span>
          </el-col>
          <el-col :span="12" class="field-item">
            <span class="field-label">订单状态：</span>
            <el-tag :type="statusTagType" size="small" effect="plain">{{ detail.orderStatus }}</el-tag>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="field-row">
          <el-col :span="12" class="field-item">
            <span class="field-label">订单金额：</span>
            <span class="field-value">{{ detail.orderAmount }}</span>
          </el-col>
          <el-col :span="12" class="field-item">
            <span class="field-label">审核备注：</span>
            <span class="field-value">{{ detail.auditRemark || '--' }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">设备信息</span>
      </div>
      <div class="section-body">
        <el-table :data="detail.itemList" class="data-table" :row-class-name="tableRowClassName">
          <el-table-column prop="itemCode" label="设备编码" min-width="140" />
          <el-table-column prop="itemName" label="设备名称" min-width="140" />
          <el-table-column prop="spec" label="规格" min-width="140" />
          <el-table-column prop="quantity" label="数量" width="100" align="center" />
          <el-table-column prop="category" label="所属分类" min-width="120" />
          <el-table-column prop="unit" label="单位" width="80" align="center" />
        </el-table>
      </div>
    </div>
    <div class="form-footer">
      <el-button type="primary" @click="handleAudit">审核</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DevicePurchaseDetail",
  data() {
    return {
      detail: {
        purchaseNo: "",
        purchaseName: "",
        submitTime: "",
        orderStatus: "待审核",
        orderAmount: "",
        auditRemark: "",
        itemList: []
      }
    };
  },
  computed: {
    statusTagType() {
      const s = this.detail.orderStatus;
      if (s === "待审核") return "info";
      if (s === "审核未通过") return "danger";
      return "success";
    }
  },
  mounted() {
    const id = this.$route.query.id || this.$route.params.id;
    if (id) this.loadDetail(id);
  },
  methods: {
    loadDetail(id) {
      // TODO: 接口
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    handleAudit() {
      this.$message.info("审核");
    },
    handleCancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.purchase-detail-page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  padding-bottom: 32px;
}
.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 24px;
  text-align: left;
}
.section-card {
  margin-bottom: 24px;
}
.section-header {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
}
.section-title {
  position: relative;
  padding-left: 15px;
  font-size: 16px;
  font-weight: 500;
  color: #2373c8;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 2px;
    bottom: 2px;
    width: 4px;
    height: 20px;
    background: #2373c8;
    border-radius: 2px;
  }
}
.section-body .field-row {
  margin-bottom: 16px;
}
.field-item {
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.field-label {
  min-width: 100px;
  text-align: left;
  color: #333;
}
.field-value {
  color: #333;
}
.data-table {
  ::v-deep .el-table__header th {
    background: #f5f7fa;
    color: #303133;
    font-weight: 500;
  }
  ::v-deep .el-table__body tr.row-even td {
    background: #fafafa;
  }
  ::v-deep .el-tag--plain {
    border: 1px solid #dcdfe6;
    background: #fff;
    color: #606266;
  }
}
.form-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f1f1;
  text-align: left;
  .el-button {
    min-width: 112px;
    height: 38px;
    padding: 10px 24px;
  }
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
