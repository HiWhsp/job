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
          <el-form-item label="回款状态" prop="orderStatus">
            <el-select v-model="statusTab" placeholder="请选择" clearable style="width: 140px">
              <el-option label="待审核" value="1" />
              <el-option label="已回款" value="2" />
              <el-option label="驳回" value="-1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
        <!-- <div class="search-row">
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </div> -->
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
          <el-table-column prop="payOrderNo" label="回款单号" show-overflow-tooltip />
          <el-table-column prop="payPrice" label="回款金额" align="center" />
          <el-table-column prop="staffOrderNo" label="所属订单" align="center" show-overflow-tooltip />
          <el-table-column prop="customerTitle" label="客户名称" align="center" show-overflow-tooltip />
          <el-table-column prop="created_at" label="订单时间" align="center" />
          <el-table-column label="回款凭证" align="center">
            <template slot-scope="{ row }">
              <el-image v-if="row.payImage" :src="row.payImage" alt="凭证" class="voucher-img" :preview-src-list="[row.payImage]" />
              <span v-else class="voucher-placeholder">—</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderStatusTitle" label="回款状态" width="100" align="center">
            <template slot-scope="{ row }">
              <el-tag :type="receiptStatusTagType(row.orderStatus)" size="small">
                {{ receiptStatusText(row.orderStatus, row.orderStatusTitle) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="提交时间" width="160" align="center" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span
                  v-if="String(row.orderStatus) === '1'"
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
      <div v-loading="detailLoading" class="detail-body">
        <div v-if="!detailRow && !detailLoading" class="detail-empty">—</div>
        <div v-else-if="detailRow">
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">回款单号:</span>
            <span class="detail-value">{{ detailRow.payOrderNo || "—" }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">回款金额:</span>
            <span class="detail-value detail-amount">{{ detailRow.payPrice || "—" }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">所属订单:</span>
            <span class="detail-value">{{ detailRow.staffOrderNo || "—" }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">提交时间:</span>
            <span class="detail-value">{{ detailRow.created_at || "—" }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">客户名称:</span>
            <span class="detail-value">{{ detailRow.customerTitle || "—" }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">未回款金额:</span>
            <span class="detail-value">{{ detailRow.remainPrice || "—" }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">回款状态:</span>
            <span class="detail-value">
              <el-tag :type="receiptStatusTagType(detailRow.orderStatus)" size="small">
                {{ receiptStatusText(detailRow.orderStatus, detailRow.orderStatusTitle) }}
              </el-tag>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">所属订单号:</span>
            <span class="detail-value">{{ detailRow.staffOrderNo || "—" }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item detail-item-full">
            <span class="detail-label">回款凭证:</span>
            <div class="detail-voucher">
              <el-image
                v-if="payImageList(detailRow.payImage).length"
                :src="payImageList(detailRow.payImage)[0]"
                fit="contain"
                class="voucher-preview"
                :preview-src-list="payImageList(detailRow.payImage)"
              />
              <div v-else class="voucher-placeholder-box" />
            </div>
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
            <el-radio label="pass">通过</el-radio>
            <el-radio label="reject">驳回</el-radio>
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
const LIST_API = "/getStaffOrderPayList";
const DETAIL_API = "/getStaffOrderPay";

export default {
  name: "OrderPaymentReceiptApproval",
  data() {
    return {
      queryParams: {
        keyword: "",
        orderStatus: "1",
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      statusTab: "1",
      statusTabs: [
        { label: "待审核", value: "1" },
        { label: "已回款", value: "2" },
        { label: "审核未通过", value: "-1" }
      ],
      detailVisible: false,
      detailRow: null,
      detailLoading: false,
      auditDialogVisible: false,
      rowToAudit: null,
      auditForm: {
        approval: "pass",
        auditRemark: ""
      }
    };
  },
  computed: {
    auditReceiptAmount() {
      return this.rowToAudit ? this.rowToAudit.payPrice || "—" : "—";
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
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        keyword: this.queryParams.keyword || "",
        orderStatus: this.queryParams.orderStatus || this.statusTab || ""
      };
      this.$api({
        url: LIST_API,
        method: "post",
        data: params
      })
        .then((res) => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list;
            this.total = res.data.count ?? list.length;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        })
        .catch(() => {
          this.tableData = [];
          this.total = 0;
        });
    },
    handleQuery() {
      this.queryParams.orderStatus = this.statusTab;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams.keyword = "";
      this.queryParams.orderStatus = this.statusTab;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleTabChange(value) {
      this.statusTab = value;
      this.queryParams.orderStatus = value;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleExport() {
      this.$message.info("导出");
    },
    loadDetail(id) {
      if (!id) return Promise.resolve(null);
      this.detailLoading = true;
      return this.$api({
        url: DETAIL_API,
        method: "post",
        data: { id: String(id) }
      })
        .then((res) => {
          if (res && res.code === 200 && res.data) return res.data;
          return null;
        })
        .finally(() => {
          this.detailLoading = false;
        });
    },
    handleView(row) {
      const id = row && row.id != null ? String(row.id) : "";
      if (!id) {
        this.$message.warning("缺少回款单id");
        return;
      }
      this.detailVisible = true;
      this.detailRow = null;
      this.loadDetail(id).then((data) => {
        if (!this.detailVisible) return;
        if (!data) {
          this.$message.error("获取回款单详情失败");
          return;
        }
        this.detailRow = data;
      });
    },
    closeDetailDrawer(done) {
      this.detailRow = null;
      done();
    },
    handleAudit(row) {
      this.rowToAudit = row;
      this.auditForm.approval = "pass";
      this.auditForm.auditRemark = "";
      this.auditDialogVisible = true;
    },
    closeAuditDialog() {
      this.auditDialogVisible = false;
      this.rowToAudit = null;
      this.auditForm.approval = "pass";
      this.auditForm.auditRemark = "";
    },
    submitAudit() {
      if (!this.rowToAudit) return;
      const id =
        this.rowToAudit.id != null ? String(this.rowToAudit.id) : "";
      if (!id) {
        this.$message.warning("缺少回款单 id");
        return;
      }
      const status =
        this.auditForm.approval === "reject" ? "-1" : "1";
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: "提交审核中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.35)"
      });
      this.$api({
        url: "/reviewStaffOrderPay",
        method: "post",
        data: { id, status }
      })
        .then((res) => {
          if (res && res.code === 200) {
            this.$message.success("审核提交成功");
            this.closeAuditDialog();
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || "审核提交失败");
          }
        })
        .catch((err) => {
          this.$message.error((err && err.msg) || "审核提交失败");
        })
        .finally(() => {
          loading.close();
        });
    },
    handlePreviewVoucher(row) {
      if (row && row.payImage) this.$message.info("点击图片可预览");
    },
    payImageList(val) {
      if (Array.isArray(val)) return val;
      if (typeof val === "string" && val.trim()) {
        return val.split(",").map(s => s.trim()).filter(Boolean);
      }
      return [];
    },
    receiptStatusText(status, fallbackTitle) {
      const s = Number(status);
      if (s === 1) return "待审核";
      if (s === 2) return "已回款";
      if (s === -1) return "驳回";
      return fallbackTitle || (status != null ? String(status) : "—");
    },
    receiptStatusTagType(status) {
      const s = Number(status);
      if (s === 2) return "success";
      if (s === -1) return "danger";
      return "info";
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
