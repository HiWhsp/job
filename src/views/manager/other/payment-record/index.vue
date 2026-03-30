<template>
  <div class="view-wrap customer-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词">
            <el-input
              v-model="queryParams.keyword"
              placeholder="订单编号/客户名称"
              clearable
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item label="回款状态">
            <el-select
              v-model="queryParams.orderStatus"
              placeholder="请选择"
              clearable
              style="width: 140px"
            >
              <el-option label="待审核" value="1" />
              <el-option label="已回款" value="2" />
              <el-option label="驳回" value="-1" />
            </el-select>
          </el-form-item>
        </div>
        <div class="search-row">
          <!-- 时间筛选 -->
          <el-form-item label="时间筛选">
            <el-date-picker
              v-model="queryParams.date"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              style="width: 236px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-tabs">
          <div
            v-for="(tab, index) in auditTabs"
            :key="index"
            class="tab-item"
            :class="{ active: auditTab === tab.value }"
            @click="handleAuditTabChange(tab.value)"
          >
            {{
            tab.label }}
          </div>
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
          <el-table-column type="index" label="序号" width="70" align="center" />
          <el-table-column prop="payOrderNo" label="回款单号" min-width="140" show-overflow-tooltip />
          <el-table-column prop="payPrice" label="回款金额" min-width="100" align="right" />
          <el-table-column prop="remainPrice" label="剩余金额" min-width="100" align="right" />
          <el-table-column prop="staffOrderNo" label="所属订单" min-width="140" show-overflow-tooltip />
          <el-table-column prop="customerTitle" label="客户名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="orderStatusTitle" label="回款状态" width="100" align="center" />
          <el-table-column label="回款凭证" width="100" align="center">
            <template slot-scope="{ row }">
              <el-image
                v-if="row.payImage"
                :src="row.payImage"
                fit="cover"
                style="width: 48px; height: 48px; border-radius: 4px; cursor: pointer;"
                :preview-src-list="[row.payImage]"
              />
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="提交时间" width="160" align="center" show-overflow-tooltip />
          <el-table-column label="操作" width="280" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
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

    <!-- 回款详情 抽屉（从右向左 800px） -->
    <el-drawer
      title="回款详情"
      :visible.sync="detailDrawerVisible"
      direction="rtl"
      size="800px"
      :before-close="closeDetailDrawer"
    >
      <div class="payment-detail-body" v-if="detailRow">
        <div class="detail-grid">
          <div class="detail-col">
            <div class="detail-item">
              <span class="detail-label">回款单号：</span>
              <span class="detail-value">{{ detailRow.payOrderNo || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">回款金额：</span>
              <span class="detail-value amount-value">{{ detailRow.payPrice || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">剩余金额：</span>
              <span class="detail-value amount-value">{{ detailRow.remainPrice || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">所属订单：</span>
              <span class="detail-value">{{ detailRow.staffOrderNo || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">回款状态：</span>
              <el-tag size="small" type="info">{{ detailRow.orderStatusTitle || '待审核' }}</el-tag>
            </div>
            <div class="detail-item">
              <span class="detail-label">回款凭证：</span>
              <div class="voucher-placeholder">
                <img
                  v-if="detailRow.payImage"
                  :src="detailRow.payImage"
                  class="voucher-img"
                  alt="回款凭证"
                />
                <span v-else class="voucher-empty">暂无凭证</span>
              </div>
            </div>
          </div>
          <div class="detail-col">
            <div class="detail-item">
              <span class="detail-label">客户名称：</span>
              <span class="detail-value">{{ detailRow.customerTitle || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">提交时间：</span>
              <span class="detail-value">{{ detailRow.created_at || '—' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="payment-detail-footer">
        <el-button @click="closeDetailDrawer">取消</el-button>
        <el-button type="primary" @click="confirmDetailDrawer">确定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "PaymentRecordIndex",
  data() {
    return {
      queryParams: {
        keyword: "",
        orderStatus: "1",
        date: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      rowToDelete: null,
      auditDialogVisible: false,
      rowToAudit: null,
      /** 是否继续：continue-继续，pause-暂停，cancel-取消，默认暂停 */
      auditContinueChoice: "pause",
      /** 提交回款弹框 */
      paymentDialogVisible: false,
      rowToPayment: null,
      paymentForm: {
        currentAmount: "",
        voucherList: []
      },
      paymentRules: {
        currentAmount: [
          { required: true, message: "请输入本次回款金额", trigger: "blur" },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: "请输入有效金额（最多两位小数）",
            trigger: "blur"
          }
        ]
      },
      auditTab: "pending",
      auditTabs: [
        { label: "待审核", value: "pending" },
        { label: "已回款", value: "delivered" },
        { label: "审核未通过", value: "rejected" }
      ],
      /** 回款详情抽屉 */
      detailDrawerVisible: false,
      detailRow: null
    };
  },

  mounted() {
    this.setView();
    this.loadList();
  },

  methods: {
    /** 设置表格高度（与 mtOrder 一致：可视区高度 - 表格顶部距离 - 头部 - 分页） */
    setView() {
      this.$nextTick(() => {
        const refTable = this.$refs.tableH;
        if (!refTable) return;
        const tableEl = refTable.$el ? refTable.$el : refTable;
        // 84 为头部高度，80 为分页高度
        const tableOffsetTop = tableEl.offsetTop + 85;
        const windowHeight = window.innerHeight;
        this.tableHeight = Math.max(windowHeight - tableOffsetTop, 200);
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
        orderStatus: this.queryParams.orderStatus || ""
      };
      this.$api({
        url: "/getStaffOrderPayList",
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
    handleAuditTabChange(value) {
      this.auditTab = value;
      this.queryParams.orderStatus = value === "pending" ? "1" : value === "delivered" ? "2" : value === "rejected" ? "-1" : "";
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams.keyword = "";
      this.queryParams.orderStatus = this.auditTab === "pending" ? "1" : this.auditTab === "delivered" ? "2" : this.auditTab === "rejected" ? "-1" : "";
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    /** 查看回款详情（打开抽屉） */
    handleView(row) {
      this.detailRow = row;
      this.detailDrawerVisible = true;
    },
    /** 关闭回款详情抽屉 */
    closeDetailDrawer() {
      this.detailDrawerVisible = false;
      this.detailRow = null;
    },
    /** 确定（关闭抽屉） */
    confirmDetailDrawer() {
      this.closeDetailDrawer();
    },
    handleExport() {
      // TODO: 导出
      this.$message.info("导出");
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
.customer-page {
  background: #fff;
  // border: 1px solid #E6E6E6;
  border-radius: 8px;
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

  .table-acts {
    display: flex;
    align-items: center;
    gap: 10px;

    .el-button {
      background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    }
  }
}

.table-box {
  width: 100%;
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

.link-name {
  color: #2373c8;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.status-enable {
  color: #67c23a;
}

.status-disable {
  color: #909399;
}

.row-acts {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  .row-act {
    color: #3377fe;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
  }
}

.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}

/* 提交回款弹框 */

.payment-amount {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  text-align: left;
}

.amount-unpaid {
  color: #f56c6c;
  font-weight: 500;
}

.payment-upload {
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .upload-inner {
    display: flex;
    flex-direction: column;
    align-items: center;

    .el-icon-plus {
      font-size: 28px;
      margin-bottom: 8px;
      color: #8c939d;
    }
  }

  .upload-tip {
    font-size: 12px;
    color: #909399;
  }
}

/* 回款详情抽屉 */
.payment-detail-body {
  padding: 0 16px 80px;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 40px;
}
.detail-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.detail-item {
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  .detail-label {
    color: #333;
    width: 100px;
    text-align: left;
  }
  .detail-value {
    color: #333;
  }
  .amount-value {
    font-weight: bold;
  }
}
.voucher-placeholder {
  width: 120px;
  height: 120px;
  background: #e4e7ed;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  .voucher-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .voucher-empty {
    font-size: 12px;
    color: #909399;
  }
}
.payment-detail-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 24px;
  border-top: 1px solid #ebeef5;
  background: #fff;
  text-align: right;
  .el-button {
    margin-left: 12px;
  }
}

::v-deep .el-drawer__header {
  height: 57px;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  text-align: left;
  padding: 0 24px;
  border-bottom: 1px solid #EDF0F6;
}
</style>