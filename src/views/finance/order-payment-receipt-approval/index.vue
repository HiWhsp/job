<template>
  <div class="view-wrap finance-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="订单编号/客户名称"
              clearable
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item label="订单状态" prop="orderStatus">
            <el-select
              v-model="queryParams.orderStatus"
              placeholder="请选择"
              clearable
              style="width: 140px"
            >
              <el-option label="待审批" value="待审批" />
              <el-option label="待发货" value="待发货" />
              <el-option label="已发货" value="已发货" />
              <el-option label="已取消" value="已取消" />
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式" prop="payMethod">
            <el-select
              v-model="queryParams.payMethod"
              placeholder="请选择"
              clearable
              style="width: 140px"
            >
              <el-option label="现结" value="现结" />
              <el-option label="账期" value="账期" />
              <el-option label="分期付款" value="分期付款" />
            </el-select>
          </el-form-item>
          <el-form-item label="回款状态" prop="receiptStatus">
            <el-select
              v-model="queryParams.receiptStatus"
              placeholder="请选择"
              clearable
              style="width: 140px"
            >
              <el-option label="待审核" value="待审核" />
              <el-option label="已回款" value="已回款" />
              <el-option label="审核未通过" value="审核未通过" />
            </el-select>
          </el-form-item>
        </div>
        <div class="search-row">
          <el-form-item label="时间筛选" prop="dateRange">
            <el-date-picker
              v-model="queryParams.dateRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              clearable
              style="width: 236px"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 表格区域：标签页 + 导出 -->
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-tabs">
          <div
            v-for="(tab, index) in statusTabs"
            :key="index"
            class="tab-item"
            :class="{ active: statusTab === tab.value }"
            @click="handleTabChange(tab.value)"
          >{{ tab.label }}</div>
        </div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleExport">导出</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="tableH"
          :height="tableHeight"
          :data="tableData"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" label="序号" width="70" align="center">
            <template
              slot-scope="scope"
            >{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column
            prop="receiptNo"
            label="回款单号"
            min-width="120"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column prop="receiptAmount" label="回款金额" min-width="100" align="right" />
          <el-table-column prop="orderNo" label="所属订单" min-width="130" show-overflow-tooltip />
          <el-table-column prop="customerName" label="客户名称" min-width="180" show-overflow-tooltip />
          <el-table-column prop="orderTime" label="订单时间" width="120" align="center" />
          <el-table-column label="回款凭证" width="100" align="center">
            <template slot-scope="{ row }">
              <div v-if="row.voucherUrl" class="voucher-thumb" @click="handlePreviewVoucher(row)">
                <img :src="row.voucherUrl" alt="凭证" class="voucher-img" />
              </div>
              <span v-else class="voucher-placeholder">—</span>
            </template>
          </el-table-column>
          <el-table-column prop="receiptStatus" label="回款状态" width="100" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.receiptStatus === '待审核'" type="info" size="small">待审核</el-tag>
              <el-tag v-else-if="row.receiptStatus === '审核未通过'" type="danger" size="small">审核未通过</el-tag>
              <el-tag v-else-if="row.receiptStatus === '已回款'" type="success" size="small">已回款</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="120" align="center" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span
                  v-if="row.receiptStatus === '待审核'"
                  class="row-act"
                  @click="handleAudit(row)"
                >审核回款</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryParams.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="queryParams.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          />
        </div>
      </div>
    </div>

    <!-- 回款详情：从右到左打开的抽屉，宽度 800px -->
    <el-drawer
      title="回款详情"
      :visible.sync="detailVisible"
      direction="rtl"
      size="800px"
      :before-close="closeDetailDrawer"
      custom-class="receipt-detail-drawer"
    >
      <div v-if="detailRow" class="detail-body">
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">回款单号:</span>
            <span class="detail-value">{{ detailRow.receiptNo || "—" }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">回款金额:</span>
            <span class="detail-value detail-amount">{{ detailRow.receiptAmount || "—" }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">所属订单:</span>
            <span class="detail-value">{{ detailRow.orderNo || "—" }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">提交时间:</span>
            <span class="detail-value">{{ detailRow.submitTime || "—" }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">客户名称:</span>
            <span class="detail-value">{{ detailRow.customerName || "—" }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">订单时间:</span>
            <span class="detail-value">{{ detailRow.orderTime || "—" }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">回款状态:</span>
            <span class="detail-value">
              <el-tag v-if="detailRow.receiptStatus === '待审核'" type="info" size="small">待审核</el-tag>
              <el-tag
                v-else-if="detailRow.receiptStatus === '审核未通过'"
                type="danger"
                size="small"
              >审核未通过</el-tag>
              <el-tag v-else-if="detailRow.receiptStatus === '已回款'" type="success" size="small">已回款</el-tag>
              <span v-else>—</span>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">审核备注:</span>
            <span
              class="detail-value"
            >{{ detailRow.auditRemark != null ? detailRow.auditRemark : "—" }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item detail-item-full">
            <span class="detail-label">回款凭证:</span>
            <div class="detail-voucher">
              <el-image
                v-if="detailRow.voucherUrl"
                :src="detailRow.voucherUrl"
                fit="contain"
                class="voucher-preview"
                :preview-src-list="[detailRow.voucherUrl]"
              />
              <div v-else class="voucher-placeholder-box" />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 审核回款弹框 -->
    <el-dialog
      title="审核回款"
      :visible.sync="auditDialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @close="closeAuditDialog"
    >
      <el-form ref="auditForm" :model="auditForm" label-width="100px" class="audit-form">
        <el-form-item label="回款金额:">
          <span class="audit-amount">{{ auditReceiptAmount }}</span>
        </el-form-item>
        <el-form-item label="审批:">
          <el-radio-group v-model="auditForm.approval">
            <el-radio label="已回款">已回款</el-radio>
            <el-radio label="未回款">未回款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注:">
          <el-input
            v-model="auditForm.auditRemark"
            placeholder="请输入"
            clearable
            maxlength="200"
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
export default {
  name: "OrderPaymentReceiptApproval",
  data() {
    return {
      queryParams: {
        keyword: "",
        orderStatus: "",
        payMethod: "",
        receiptStatus: "待审核",
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [
        {
          id: 1,
          receiptNo: "2026001",
          receiptAmount: "500.00",
          orderNo: "2026001-999",
          customerName: "浙江求实医疗科技有限公司",
          orderTime: "2026-01-05",
          voucherUrl: "",
          receiptStatus: "待审核",
          submitTime: "2026-01-05"
        },
        {
          id: 2,
          receiptNo: "2026001",
          receiptAmount: "500.00",
          orderNo: "2026001-999",
          customerName: "浙江求实医疗科技有限公司",
          orderTime: "2026-01-05",
          voucherUrl: "",
          receiptStatus: "审核未通过",
          submitTime: "2026-01-05"
        },
        {
          id: 3,
          receiptNo: "2026001",
          receiptAmount: "500.00",
          orderNo: "2026001-999",
          customerName: "浙江求实医疗科技有限公司",
          orderTime: "2026-01-05",
          voucherUrl: "",
          receiptStatus: "已回款",
          submitTime: "2026-01-05"
        }
      ],
      statusTab: "pending",
      statusTabs: [
        { label: "待审核", value: "pending" },
        { label: "已回款", value: "received" },
        { label: "审核未通过", value: "rejected" }
      ],
      detailVisible: false,
      detailRow: null,
      auditDialogVisible: false,
      rowToAudit: null,
      auditForm: {
        approval: "未回款",
        auditRemark: ""
      }
    };
  },
  computed: {
    auditReceiptAmount() {
      return this.rowToAudit ? this.rowToAudit.receiptAmount || "—" : "—";
    }
  },
  mounted() {
    this.setView();
    this.loadList();
  },
  methods: {
    setView() {
      this.$nextTick(() => {
        const refTable = this.$refs.tableH;
        if (!refTable) return;
        const tableEl = refTable.$el || refTable;
        const tableOffsetTop = tableEl.offsetTop + 85;
        this.tableHeight = Math.max(
          window.innerHeight - tableOffsetTop - 80,
          200
        );
        const that = this;
        window.onresize = function() {
          const top = tableEl.offsetTop + 84 + 80;
          that.tableHeight = Math.max(window.innerHeight - top, 200);
        };
      });
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    loadList() {
      // TODO: 调用订单回款审核列表接口
      this.total = this.tableData.length;
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams.receiptStatus = this.getReceiptStatusByTab(
        this.statusTab
      );
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    getReceiptStatusByTab(tab) {
      const map = {
        pending: "待审核",
        received: "已回款",
        rejected: "审核未通过"
      };
      return map[tab] || "";
    },
    handleTabChange(value) {
      this.statusTab = value;
      this.queryParams.receiptStatus = this.getReceiptStatusByTab(value);
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleExport() {
      this.$message.info("导出");
    },
    handleView(row) {
      this.detailRow = row;
      this.detailVisible = true;
    },
    closeDetailDrawer(done) {
      this.detailRow = null;
      done();
    },
    handleAudit(row) {
      this.rowToAudit = row;
      this.auditForm.approval = "未回款";
      this.auditForm.auditRemark = "";
      this.auditDialogVisible = true;
    },
    closeAuditDialog() {
      this.auditDialogVisible = false;
      this.rowToAudit = null;
      this.auditForm.approval = "未回款";
      this.auditForm.auditRemark = "";
    },
    submitAudit() {
      if (!this.rowToAudit) return;
      // TODO: 调用审核回款接口，传 approval、auditRemark
      const statusText =
        this.auditForm.approval === "已回款" ? "已回款" : "审核未通过";
      this.$message.success("审核提交成功");
      this.closeAuditDialog();
      this.loadList();
    },
    handlePreviewVoucher(row) {
      if (row.voucherUrl) {
        // TODO: 预览大图或新窗口打开
        this.$message.info("预览回款凭证");
      }
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.loadList();
    }
  }
};
</script>

<style lang="less" scoped>
.finance-page {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  height: 100%;
}
.search-section {
  padding: 20px 24px;
  margin-bottom: 20px;
}
.search-form {
  .search-row {
    margin-bottom: 16px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0 24px;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }
  ::v-deep .el-input,
  ::v-deep .el-select {
    width: 236px !important;
  }

  ::v-deep .el-input__inner,
  ::v-deep .el-select .el-input__inner {
    padding-right: 15px;
    width: 236px;
    border-radius: 4px;
    border-color: #dcdfe6;
  }
  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
  }
}
.table-view {
  overflow: hidden;
}
.table-util-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0;
  margin: 0 27px 25px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  .table-tabs {
    display: flex;
    align-items: center;
    gap: 32px;
    height: 44px;
    position: relative;
    .tab-item {
      font-size: 15px;
      color: #909399;
      cursor: pointer;
      padding: 0 4px 16px;
      position: relative;
      transition: color 0.2s;
      &:hover {
        color: #606266;
      }
      &.active {
        color: #3377fe;
        font-weight: 500;
        &::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -4px;
          height: 2px;
          background: #3377fe;
          border-radius: 1px;
        }
      }
    }
  }
  .table-acts .el-button {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
  }
}
.table-box {
  margin: 0 27px;
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
}
.voucher-thumb {
  width: 48px;
  height: 48px;
  margin: 0 auto;
  background: #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  .voucher-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.voucher-placeholder {
  color: #909399;
}
.row-acts {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0 12px;
  .row-act {
    color: #3377fe;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
}
.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}

/* 回款详情抽屉（从右到左 800px） */
.detail-body {
  padding: 0 8px;
}
.detail-row {
  display: flex;
  margin-bottom: 24px;
  align-items: flex-start;
}
.detail-item {
  flex: 1;
  text-align: left;
  display: flex;
}
.detail-label {
  display: inline-block;
  color: #333;
  font-size: 14px;
  margin-right: 8px;
  width: 100px;
  text-align: left;
}
.detail-value {
  color: #333;
  font-size: 14px;
}
.detail-amount {
  font-weight: 600;
}
.detail-voucher {
  margin-top: 8px;
}
.voucher-preview {
  width: 160px;
  height: 160px;
  border-radius: 4px;
  background: #f5f7fa;
}
.voucher-placeholder-box {
  width: 82px;
  height: 82px;
  background: #4a4a4a;
}

/* 审核回款弹框 */
.audit-form .audit-amount {
  display: inline-block;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  width: 100%;
}
.audit-form ::v-deep .el-radio-group {
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
}
</style>

<style lang="less">
/* 抽屉宽度 800px，需非 scoped 以作用到 el-drawer 根节点 */
.receipt-detail-drawer.el-drawer.rtl {
  width: 800px !important;
}
.receipt-detail-drawer .el-drawer__header {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  text-align: left;
}
.receipt-detail-drawer .el-drawer__body {
  padding: 0 24px 24px;
}
</style>
