<template>
  <div class="view-wrap material-purchase-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="采购单号/采购单名称"
              clearable
              style="width: 260px"
            />
          </el-form-item>
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

    <!-- 表格区域 -->
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-tabs">
          <div
            v-for="(tab, index) in statusTabs"
            :key="index"
            class="tab-item"
            :class="{ active: statusTab === tab.value }"
            @click="handleStatusTabChange(tab.value)"
          >{{ tab.label }}</div>
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
          <el-table-column prop="purchaseNo" label="采购单号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="purchaseName" label="采购单名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="orderAmount" label="订单金额" min-width="120" align="right">
            <template slot-scope="{ row }">{{ row.orderAmount }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.status === '待审核'" type="primary" size="small" effect="light">待审核</el-tag>
              <el-tag
                v-else-if="row.status === '审核未通过'"
                type="danger"
                size="small"
                effect="light"
              >审核未通过</el-tag>
              <el-tag v-else type="success" size="small" effect="light">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="120" align="center" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span v-if="row.status === '待审核'" class="row-act" @click="handleAudit(row)">立即审核</span>
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

    <!-- 审核弹框 -->
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
export default {
  name: "MaterialPurchaseList",
  data() {
    return {
      queryParams: {
        keyword: "",
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 295,
      tableHeight: 0,
      statusTab: "pending", // pending | to_purchase | purchased | qc_ing | completed | rejected
      statusTabs: [
        { label: "待审核", value: "pending" },
        { label: "待采购", value: "to_purchase" },
        { label: "采购完成", value: "purchased" },
        { label: "质检入库中", value: "qc_ing" },
        { label: "已完成", value: "completed" },
        { label: "审核未通过", value: "rejected" }
      ],
      tableData: [
        {
          id: 1,
          purchaseNo: "4521414",
          purchaseName: "采购单名称",
          orderAmount: "5000.00",
          status: "待审核",
          submitTime: "2026-01-05"
        },
        {
          id: 2,
          purchaseNo: "4521415",
          purchaseName: "采购单名称",
          orderAmount: "3200.00",
          status: "待审核",
          submitTime: "2026-01-05"
        },
        {
          id: 3,
          purchaseNo: "4521416",
          purchaseName: "采购单名称",
          orderAmount: "8000.00",
          status: "审核未通过",
          submitTime: "2026-01-04"
        }
      ],
      auditDialogVisible: false,
      rowToAudit: null,
      auditChoice: "pass",
      auditRemark: ""
    };
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
      // TODO: 根据 statusTab、queryParams 调用接口
      this.total = 295;
    },
    handleStatusTabChange(value) {
      this.statusTab = value;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleView(row) {
      // TODO: 跳转详情
      this.$message.info("查看详情：" + row.purchaseNo);
      this.$router.push({
        path: "/general-manager/material-purchase/detail",
        query: {
          id: row.id
        }
      });
    },
    handleAudit(row) {
      this.rowToAudit = row;
      this.auditChoice = "pass";
      this.auditRemark = "";
      this.auditDialogVisible = true;
    },
    closeAuditDialog() {
      this.auditDialogVisible = false;
      this.rowToAudit = null;
      this.auditChoice = "pass";
      this.auditRemark = "";
    },
    submitAudit() {
      if (!this.rowToAudit) return;
      // TODO: 调用审核接口
      this.$message.success(
        this.auditChoice === "pass" ? "审核通过" : "审核未通过"
      );
      this.closeAuditDialog();
      this.loadList();
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
.material-purchase-page {
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
    margin-bottom: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px 24px;
  }

  ::v-deep .el-form-item {
    margin-bottom: 0;
  }

  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }

  ::v-deep .el-input__inner,
  ::v-deep .el-select .el-input__inner {
    border-radius: 4px;
    border-color: #dcdfe6;
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

  /* 状态标签：待审核-蓝，审核未通过-红，其他-绿 */
  ::v-deep .el-tag--primary.el-tag--light {
    background-color: #ecf5ff;
    border-color: #d9ecff;
    color: #3377fe;
  }
  ::v-deep .el-tag--danger.el-tag--light {
    background-color: #fef0f0;
    border-color: #fde2e2;
    color: #f56c6c;
  }
  ::v-deep .el-tag--success.el-tag--light {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
  }
}

.row-acts {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0 8px;

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
  justify-content: right;
  border-top: 1px solid #ebeef5;
}

::v-deep .el-dialog__footer {
  text-align: center;
}
</style>
  