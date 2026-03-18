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
            <el-tag :type="statusTagType" size="small" effect="plain">{{ orderStatusText(detail.orderStatus) }}</el-tag>
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
          <el-table-column prop="title" label="设备名称" align="center" show-overflow-tooltip />
          <el-table-column prop="price" label="单价" align="center" />
          <el-table-column prop="num" label="数量" align="center" />
          <el-table-column prop="unit" label="单位" align="center" />
          <el-table-column prop="totalPrice" label="总价" align="center" />
        </el-table>
      </div>
    </div>
    <div class="form-footer">
      <el-button type="primary" v-if="String(detail.orderStatus) === '2'" @click="handleAudit">审核</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
    <el-dialog
      title="审核"
      :visible.sync="auditDialogVisible"
      width="480px"
      :close-on-click-modal="false"
      @close="closeAuditDialog"
    >
      <el-form label-width="100px">
        <el-form-item label="审核状态:" style="text-align: left;">
          <el-radio-group v-model="auditChoice">
            <el-radio label="pass">通过</el-radio>
            <el-radio label="reject">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注:">
          <el-input
            v-model="auditRemark"
            placeholder="请输入"
            clearable
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit">提交</el-button>
        <el-button @click="closeAuditDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const REVIEW_API = "/reviewPurchaseEquipmentOrder";

export default {
  name: "DevicePurchaseDetail",
  data() {
    return {
      detail: {
        id: null,
        purchaseNo: "",
        purchaseName: "",
        submitTime: "",
        orderStatus: "",
        orderAmount: "",
        auditRemark: "",
        itemList: []
      },
      auditDialogVisible: false,
      auditChoice: "pass",
      auditRemark: ""
    };
  },
  computed: {
    statusTagType() {
      const s = Number(this.detail.orderStatus);
      if (s === -1) return "danger";
      if (s === 5) return "success";
      if (s === 3) return "warning";
      return "info";
    }
  },
  mounted() {
    const id = this.$route.query.id || this.$route.params.id;
    if (id) {
      this.loadDetail(id);
    } else {
      this.$message.warning("缺少采购单id");
    }
  },
  methods: {
    orderStatusText(v) {
      const s = Number(v);
      const map = {
        1: "生产副总审核",
        2: "总经理审核",
        3: "待财务付款",
        4: "待采购",
        5: "已采购",
        [-1]: "审核未通过"
      };
      return map[s] != null ? map[s] : (v != null ? String(v) : "—");
    },
    loadDetail(id) {
      this.$api({
        url: "/getPurchaseEquipmentOrder",
        method: "post",
        data: { id: String(id) }
      })
        .then((res) => {
          if (!res || res.code !== 200 || !res.data) {
            this.$message.error("获取设备采购单详情失败");
            return;
          }
          const d = res.data;
          const productJson = Array.isArray(d.productJson) ? d.productJson : [];
          this.detail = {
            id: d.id,
            purchaseNo: d.purchaseNo || "",
            purchaseName: d.title || "",
            submitTime: d.created_at || "",
            orderStatus: d.orderStatus != null ? d.orderStatus : "",
            orderAmount: d.price != null ? d.price : "",
            auditRemark: (Array.isArray(d.reviewJson) && d.reviewJson.length)
              ? (d.reviewJson[d.reviewJson.length - 1].cont || "")
              : "",
            itemList: productJson
          };
        })
        .catch(() => {
          this.$message.error("获取设备采购单详情失败");
        });
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    handleAudit() {
      this.auditChoice = "pass";
      this.auditRemark = "";
      this.auditDialogVisible = true;
    },
    closeAuditDialog() {
      this.auditDialogVisible = false;
      this.auditChoice = "pass";
      this.auditRemark = "";
    },
    submitAudit() {
      const id = this.detail.id;
      if (id == null || id === "") {
        this.$message.warning("缺少采购单id");
        return;
      }
      const status = this.auditChoice === "pass" ? "1" : "-1";
      const cont = (this.auditRemark || "").trim();
      if (status === "-1" && !cont) {
        this.$message.warning("驳回时请填写审核原因");
        return;
      }
      this.$api({
        url: REVIEW_API,
        method: "post",
        data: { id: String(id), status, cont }
      })
        .then(res => {
          if (res && res.code === 200) {
            this.$message.success(status === "1" ? "审核通过" : "审核驳回");
            this.closeAuditDialog();
            this.loadDetail(id);
          } else {
            this.$message.error((res && res.msg) || "提交失败");
          }
        })
        .catch(err => {
          this.$message.error((err && err.msg) ? err.msg : "提交失败");
        });
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
