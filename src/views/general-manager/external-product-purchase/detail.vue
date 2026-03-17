<template>
  <div class="purchase-detail-page">
    <div class="page-title">采购单详情</div>

    <!-- 订单基础信息 -->
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
            <span class="field-value">{{ detail.title || detail.purchaseName }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="field-row">
          <el-col :span="12" class="field-item">
            <span class="field-label">提交时间：</span>
            <span class="field-value">{{ detail.updated_at || detail.submitTime }}</span>
          </el-col>
          <el-col :span="12" class="field-item">
            <span class="field-label">订单状态：</span>
            <el-tag :type="statusTagType" size="small" effect="plain">{{ orderStatusText(detail.orderStatus) }}</el-tag>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="field-row">
          <el-col :span="12" class="field-item">
            <span class="field-label">采购金额：</span>
            <span class="field-value">{{ detail.price || detail.orderAmount }}</span>
          </el-col>
          <el-col :span="12" class="field-item">
            <span class="field-label">客户名称：</span>
            <span class="field-value">{{ detail.customerTitle || '--' }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="field-row">
          <el-col :span="12" class="field-item">
            <span class="field-label">订单号：</span>
            <span class="field-value">{{ detail.staffOrderNo || '--' }}</span>
          </el-col>
          <el-col :span="12" class="field-item">
            <span class="field-label">订单时间：</span>
            <span class="field-value">{{ formatTime(detail.staffOrderTime) }}</span>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 外购产品信息 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">外购产品信息</span>
      </div>
      <div class="section-body">
        <el-table :data="productList" class="material-table" :row-class-name="tableRowClassName">
          <el-table-column prop="info.productNo" label="产品编号" min-width="140" show-overflow-tooltip />
          <el-table-column prop="info.title" label="产品名称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="info.keyVals" label="规格" min-width="180" show-overflow-tooltip />
          <el-table-column prop="info.unit" label="单位" width="90" align="center" />
          <el-table-column prop="num" label="采购数量" width="110" align="right" />
          <el-table-column prop="rkNum" label="入库数量" width="110" align="right" />
          <el-table-column prop="price" label="单价" width="110" align="right" />
          <el-table-column prop="totalPrice" label="小计" width="110" align="right" />
        </el-table>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="form-footer">
      <el-button type="primary" @click="handleAudit">审核</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
const DETAIL_API = "/getPurchaseForeignProductOrder";

export default {
  name: 'ExternalProductPurchaseDetail',
  data() {
    return {
      detail: {
        purchaseNo: "",
        title: "",
        price: "",
        orderStatus: "",
        pdfUrl: "",
        created_at: "",
        updated_at: "",
        isPay: 0,
        payJson: null,
        reviewJson: [],
        staffOrderNo: "",
        staffOrderTime: "",
        customerTitle: "",
        ruKuNo: "",
        ruKuJson: null,
        productJson: []
      }
    }
  },
  computed: {
    statusTagType() {
      const s = Number(this.detail.orderStatus);
      if (s === -1) return "danger";
      if (s === 6) return "success";
      if (s === 3) return "warning";
      return "info";
    },
    productList() {
      const list = Array.isArray(this.detail.productJson) ? this.detail.productJson : [];
      return list.map(item => ({
        ...item,
        info: item && item.info ? item.info : {}
      }));
    },
    reviewList() {
      return Array.isArray(this.detail.reviewJson) ? this.detail.reviewJson : [];
    },
    payInfo() {
      return (this.detail && this.detail.payJson) ? this.detail.payJson : {};
    },
    ruKuInfo() {
      return (this.detail && this.detail.ruKuJson) ? this.detail.ruKuJson : {};
    }
  },
  mounted() {
    const id = this.$route.query.id || this.$route.params.id
    if (id) {
      // TODO: 根据 id 请求详情接口
      this.loadDetail(id)
    }
  },
  methods: {
    loadDetail(id) {
      this.$api({
        url: DETAIL_API,
        method: "post",
        data: { id: String(id) }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const d = res.data || {};
            const normalized = {
              ...d,
              payJson: this.safeJson(d.payJson, {}),
              reviewJson: this.safeJson(d.reviewJson, []),
              ruKuJson: this.safeJson(d.ruKuJson, {}),
              productJson: this.safeJson(d.productJson, [])
            };
            this.detail = normalized;
          } else {
            this.$message.error((res && res.msg) || "获取详情失败");
          }
        })
        .catch(err => {
          this.$message.error((err && err.msg) ? err.msg : "获取详情失败");
        });
    },
    safeJson(val, fallback) {
      if (val == null) return fallback;
      if (typeof val === "string") {
        const s = val.trim();
        if (!s) return fallback;
        try {
          return JSON.parse(s);
        } catch (e) {
          return fallback;
        }
      }
      return val;
    },
    formatTime(v) {
      if (!v) return "--";
      const s = String(v);
      if (s.includes("T")) {
        const d = new Date(s);
        if (!isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          const hh = String(d.getHours()).padStart(2, "0");
          const mi = String(d.getMinutes()).padStart(2, "0");
          const ss = String(d.getSeconds()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
        }
      }
      return s;
    },
    orderStatusText(v) {
      const s = Number(v);
      const map = {
        1: "生产副总审核",
        2: "总经理审核",
        3: "待财务付款",
        4: "待采购",
        5: "质检入库",
        6: "已完成",
        [-1]: "审核未通过"
      };
      return map[s] != null ? map[s] : (v != null ? String(v) : "—");
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? 'row-even' : ''
    },
    handleAudit() {
      // TODO: 跳转审核或打开审核弹框
      this.$message.info('审核')
    },
    handleCancel() {
      this.$router.go(-1)
    }
  }
}
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

.section-body {
  .field-row {
    margin-bottom: 16px;
  }
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

.material-table {
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

.empty-tip {
  margin-top: 12px;
  color: #909399;
  font-size: 13px;
  text-align: left;
}

.img-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.preview-img {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  border: 1px solid #ebeef5;
  background: #fff;
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
