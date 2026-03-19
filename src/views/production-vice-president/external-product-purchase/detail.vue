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
            <span class="info-label">销售金额:</span>
            <span class="info-value">{{ detail.salesAmount }}</span>
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
          <div class="info-item"></div>
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
          <el-table-column type="index" label="序号" align="center">
            <template slot-scope="scope">{{ String(scope.$index + 1).padStart(3, '0') }}</template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格" show-overflow-tooltip />
          <el-table-column prop="unitPrice" label="单价" align="center" />
          <el-table-column prop="quantity" label="数量" align="center" />
          <el-table-column prop="totalPrice" label="总价" align="center" />
          <el-table-column prop="unit" label="单位" align="center" />
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
          <el-table-column prop="approver" label="审核人" />
          <el-table-column prop="approvalTime" label="审核时间" />
          <el-table-column prop="approvalStatus" label="审核状态" align="center">
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
          <el-table-column prop="amount" label="付款金额" align="left" />
          <el-table-column prop="paymentTime" label="付款时间" align="left" />
          <el-table-column label="付款凭证" align="left">
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
          <el-table-column prop="inboundNo" label="入库单号" align="left" />
          <el-table-column prop="inboundTime" label="入库时间" align="left" />
          <el-table-column label="质检报告" align="left">
            <template slot-scope="{ row }">
              <a v-if="row.reportUrl" href="javascript:;" class="link" @click="handleViewReport(row)">查看</a>
              <span v-else class="voucher-placeholder">—</span>
            </template>
          </el-table-column>
          <el-table-column prop="qcRemark" label="质检备注" show-overflow-tooltip align="left" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
const DETAIL_API = "/getPurchaseForeignProductOrder";

export default {
  name: "ProductionVicePresidentExternalProductPurchaseDetail",
  data() {
    return {
      detail: {
        requisitionNo: "",
        orderNo: "",
        orderTime: "",
        status: "",
        salesAmount: ""
      },
      productList: [],
      approvalList: [],
      paymentList: [],
      inboundList: []
    };
  },
  created() {
    const id = this.$route.query.id;
    if (id) {
      this.loadDetail(String(id));
    }
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    _parseJson(val) {
      if (val == null || val === "") return null;
      if (typeof val === "object") return val;
      try {
        return typeof val === "string" ? JSON.parse(val) : val;
      } catch (e) {
        return null;
      }
    },
    _orderStatusText(v) {
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
    loadDetail(id) {
      this.$api({ url: DETAIL_API, method: "post", data: { id } })
        .then(res => {
          if (!res || res.code !== 200 || !res.data) {
            this.$message.error("获取采购单详情失败");
            return;
          }
          const d = res.data;

          this.detail.requisitionNo = d.purchaseNo || "";
          this.detail.orderNo = d.staffOrderNo || "";
          this.detail.orderTime = d.staffOrderTime || "";
          this.detail.salesAmount = d.price || "";
          this.detail.status = this._orderStatusText(d.orderStatus);

          const products = Array.isArray(d.productJson) ? d.productJson : (this._parseJson(d.productJson) || []);
          const productRows = Array.isArray(products) ? products : [];
          this.productList = productRows.map(it => {
            const info = it && it.info ? it.info : {};
            return {
              productName: info.title || "",
              spec: info.keyVals || "",
              unitPrice: it && it.price != null ? it.price : "",
              quantity: it && it.num != null ? it.num : "",
              totalPrice: it && it.totalPrice != null ? it.totalPrice : "",
              unit: info.unit || ""
            };
          });

          const reviewArr = Array.isArray(d.reviewJson) ? d.reviewJson : (this._parseJson(d.reviewJson) || []);
          const reviews = Array.isArray(reviewArr) ? reviewArr : [];
          this.approvalList = reviews.map(it => ({
            approver: it && it.name ? it.name : "",
            approvalTime: it && it.created_at ? it.created_at : "",
            approvalStatus: it && (it.statusTxt || it.status) ? (it.statusTxt || it.status) : "",
            approvalRemark: it && it.cont ? it.cont : ""
          }));

          const payObj = this._parseJson(d.payJson) || {};
          this.paymentList = payObj && (payObj.created_at || payObj.price || payObj.image) ? [{
            amount: payObj.price || "",
            paymentTime: payObj.created_at || "",
            voucherUrl: payObj.image || ""
          }] : [];

          const ruKuObj = this._parseJson(d.ruKuJson) || {};
          const ruKuNo = d.ruKuNo || "";
          this.inboundList = (ruKuNo || (ruKuObj && (ruKuObj.created_at || ruKuObj.image))) ? [{
            inboundNo: ruKuNo,
            inboundTime: ruKuObj.created_at || "",
            reportUrl: ruKuObj.image || "",
            qcRemark: ruKuObj.cont || ""
          }] : [];
        })
        .catch(() => {});
    },
    handleViewVoucher(row) {
      if (!row || !row.voucherUrl) return;
      window.open(row.voucherUrl);
    },
    handleViewReport(row) {
      if (!row || !row.reportUrl) return;
      window.open(row.reportUrl);
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
</style>
