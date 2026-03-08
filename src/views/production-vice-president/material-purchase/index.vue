<template>
  <div class="view-wrap purchase-page">
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
            <template slot-scope="scope">
              {{ String((queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1).padStart(3, '0') }}
            </template>
          </el-table-column>
          <el-table-column prop="purchaseNo" label="采购单号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="purchaseName" label="采购单名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="orderAmount" label="订单金额" min-width="110" align="right" />
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.status === '待审核'" type="info" size="small" effect="plain">待审核</el-tag>
              <el-tag v-else-if="row.status === '审核未通过'" type="danger" size="small" effect="plain">审核未通过</el-tag>
              <el-tag v-else-if="row.status === '待采购'" type="info" size="small" effect="plain">待采购</el-tag>
              <el-tag v-else-if="row.status === '采购完成'" type="success" size="small" effect="plain">采购完成</el-tag>
              <el-tag v-else-if="row.status === '质检入库中'" type="success" size="small" effect="plain">质检入库中</el-tag>
              <el-tag v-else-if="row.status === '已完成'" type="success" size="small" effect="plain">已完成</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="120" align="center" />
          <el-table-column label="操作" min-width="200" align="center" fixed="right">
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
      width="520px"
      :close-on-click-modal="false"
      @close="closeAuditDialog"
    >
      <el-form ref="auditForm" :model="auditForm" label-width="100px" class="audit-form">
        <el-form-item label="审核:">
          <el-radio-group v-model="auditForm.result">
            <el-radio label="pass">通过</el-radio>
            <el-radio label="reject">未通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注:">
          <el-input
            v-model="auditForm.remark"
            placeholder="请输入"
            clearable
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit">提交</el-button>
        <el-button @click="auditDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ProductionVicePresidentMaterialPurchase",
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
      statusTab: "pending",
      statusTabs: [
        { label: "待审核", value: "pending" },
        { label: "待采购", value: "to_purchase" },
        { label: "采购完成", value: "purchase_done" },
        { label: "质检入库中", value: "qc_ing" },
        { label: "已完成", value: "completed" },
        { label: "审核未通过", value: "rejected" }
      ],
      tableData: [
        { id: 1, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "待审核", submitTime: "2026-01-05" },
        { id: 2, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "待审核", submitTime: "2026-01-05" },
        { id: 3, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "审核未通过", submitTime: "2026-01-05" },
        { id: 4, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "待采购", submitTime: "2026-01-05" },
        { id: 5, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "采购完成", submitTime: "2026-01-05" },
        { id: 6, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "质检入库中", submitTime: "2026-01-05" },
        { id: 7, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "已完成", submitTime: "2026-01-05" },
        { id: 8, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "已完成", submitTime: "2026-01-05" },
        { id: 9, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "已完成", submitTime: "2026-01-05" },
        { id: 10, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "已完成", submitTime: "2026-01-05" }
      ],
      // 审核弹框
      auditDialogVisible: false,
      auditRow: null,
      auditForm: {
        result: "reject",
        remark: ""
      }
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
      // TODO: 调用原料采购列表接口（生产副总端）
      // this.total = 295;
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
    handleTabChange(value) {
      this.statusTab = value;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleView(row) {
      this.$router.push({
        path: "/production-vice-president/material-purchase/detail",
        query: { id: row.id }
      });
    },
    handleAudit(row) {
      this.auditRow = row;
      this.auditForm.result = "reject";
      this.auditForm.remark = "";
      this.auditDialogVisible = true;
    },
    closeAuditDialog() {
      this.auditRow = null;
      this.auditForm.result = "reject";
      this.auditForm.remark = "";
    },
    submitAudit() {
      if (this.auditForm.result === "reject" && !this.auditForm.remark.trim()) {
        this.$message.warning("审核未通过时请填写审核备注");
        return;
      }
      // TODO: 调用审核接口，传入 this.auditRow.id、this.auditForm.result、this.auditForm.remark
      this.$message.success("审核成功");
      this.auditDialogVisible = false;
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
.purchase-page {
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
  ::v-deep .el-input__inner {
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
  /* 状态标签：待审核/待采购-灰，审核未通过-红，采购完成/质检入库中/已完成-绿 */
  ::v-deep .el-tag--info.el-tag--plain {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
  }
  ::v-deep .el-tag--danger.el-tag--plain {
    background-color: #fef0f0;
    border-color: #fde2e2;
    color: #f56c6c;
  }
  ::v-deep .el-tag--success.el-tag--plain {
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
}

/* 审核弹框 */
.audit-form {
  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }
  ::v-deep .el-input__inner {
    border-radius: 4px;
  }

  ::v-deep .el-radio-group {
    height: 38px;
    width: 100%;
    display: flex;
    align-items: center;
  }

  ::v-deep .el-radio {
    margin-right: 12px;
  }
}
::v-deep .el-dialog__footer {
  text-align: center;
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
