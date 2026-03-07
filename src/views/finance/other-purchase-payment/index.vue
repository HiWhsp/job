<template>
  <div class="view-wrap finance-page">
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="订单号" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="订单号"
              clearable
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item label="回款状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择"
              clearable
              style="width: 140px"
            >
              <el-option label="待审核" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已驳回" value="rejected" />
            </el-select>
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
    <div class="page-title">订单回款审核</div>
    <div class="table-view">
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
          <el-table-column prop="orderNo" label="订单号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="customerName" label="客户名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="receiptAmount" label="回款金额" min-width="110" align="right" />
          <el-table-column prop="status" label="回款状态" width="100" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.status === '待审核'" type="info" size="small">待审核</el-tag>
              <el-tag v-else-if="row.status === '已驳回'" type="danger" size="small">已驳回</el-tag>
              <el-tag v-else type="success" size="small">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="160" align="center" />
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span v-if="row.status === '待审核'" class="row-act" @click="handleAudit(row)">审核</span>
                <span class="row-act" @click="handleView(row)">查看</span>
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
  </div>
</template>
  
  <script>
export default {
  name: "OtherPurchasePayment",
  data() {
    return {
      queryParams: {
        keyword: "",
        status: "",
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: []
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
      // TODO: 调用订单回款审核列表接口
      this.total = 0;
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
      // TODO: 跳转详情或弹窗
    },
    handleAudit(row) {
      // TODO: 打开审核弹窗
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
  margin-bottom: 12px;
}
.search-form .search-row {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px 24px;
}
.search-form ::v-deep .el-form-item {
  margin-bottom: 0;
}
.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding: 0 27px 16px;
  margin: 0;
  text-align: left;
}
.table-view {
  overflow: hidden;
}
.table-box {
  margin: 0 27px;
  ::v-deep .el-table .table-header-cell {
    background: #f5f7fa;
    color: #303133;
    font-weight: 500;
  }
  ::v-deep .el-table__body tr.row-even td {
    background: #f3f7fa;
  }
  ::v-deep .el-table__body tr:hover > td {
    background: #f5f7fa !important;
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
</style>
  