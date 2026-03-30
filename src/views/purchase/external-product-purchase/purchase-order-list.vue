<template>
  <div class="view-wrap purchase-order-list-page">
    <!-- 搜索筛选 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="请购单单号/订单号"
              clearable
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 180px">
              <el-option label="待审核" value="1,2" />
              <el-option label="待采购" value="4" />
              <el-option label="质检入库" value="5" />
              <el-option label="已完成" value="6" />
              <el-option label="审核未通过" value="-1" />
            </el-select>
          </el-form-item>
          <el-form-item label="付款状态" prop="isPay">
            <el-select v-model="queryParams.isPay" placeholder="全部" clearable style="width: 140px">
              <el-option label="未付款" value="99" />
              <el-option label="已付款" value="1" />
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

    <!-- 列表标题 -->
    <div class="list-title">外购产品采购单</div>

    <!-- 表格 -->
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
            >{{ String((queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1).padStart(3, '0') }}</template>
          </el-table-column>
          <el-table-column label="外购产品采购单单号" min-width="140" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ rowDisplay(row, 'purchaseNo') }}</template>
          </el-table-column>
          <el-table-column label="采购单名称" width="160" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ rowDisplay(row, 'title') }}</template>
          </el-table-column>
          <el-table-column label="所属订单号" min-width="120" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ rowDisplay(row, 'staffOrderNo') }}</template>
          </el-table-column>
          <el-table-column label="客户名称" width="120" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ rowDisplay(row, 'customerTitle') }}</template>
          </el-table-column>
          <el-table-column label="订单时间" width="160" align="center">
            <template slot-scope="{ row }">{{ rowDisplay(row, 'staffOrderTime') }}</template>
          </el-table-column>
          <el-table-column label="采购金额" min-width="110" align="right">
            <template slot-scope="{ row }">{{ rowDisplay(row, 'onePrice') }}</template>
          </el-table-column>
          <el-table-column label="状态" width="140" align="center">
            <template slot-scope="{ row }">
              <el-tag
                :type="purchaseOrderStatusTagType(row.orderStatus)"
                size="small"
                effect="plain"
              >{{ purchaseOrderStatusLabel(row.orderStatus) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" width="160" align="center">
            <template slot-scope="{ row }">{{ rowDisplay(row, 'updated_at') }}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="180" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span
                  v-if="isStatusPendingPurchase(row.orderStatus)"
                  class="row-act"
                  @click="handleComplete(row)"
                >采购完成</span>
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
const LIST_API = "/getPurchaseForeignProductOrderList";

/** 接口 status 与文案（与文档一致） */
const STATUS_LABEL_MAP = {
  1: "待审核",
  2: "待审核",
  4: "待采购",
  5: "质检入库",
  6: "已完成",
  "-1": "审核未通过"
};

export default {
  name: "ExternalProductPurchaseOrderList",
  data() {
    return {
      queryParams: {
        keyword: "",
        status: "",
        isPay: "",
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
    /** 列表行字段兼容多种后端命名 */
    rowDisplay(row, primary, fallbacks = []) {
      if (!row) return "—";
      const keys = [primary, ...fallbacks];
      for (let i = 0; i < keys.length; i++) {
        const v = row[keys[i]];
        if (v !== undefined && v !== null && v !== "") return v;
      }
      return "—";
    },
    purchaseOrderStatusLabel(code) {
      if (code === undefined || code === null || code === "") return "—";
      const k = String(code);
      return (
        STATUS_LABEL_MAP[k] || STATUS_LABEL_MAP[Number(code)] || String(code)
      );
    },
    purchaseOrderStatusTagType(code) {
      const n = Number(code);
      if (n === -1) return "danger";
      if (n === 1 || n === 2) return "info";
      return "success";
    },
    isStatusPendingPurchase(code) {
      return String(code) === "4" || Number(code) === 4;
    },
    loadList() {
      const qp = this.queryParams;
      const dr = qp.dateRange;
      const params = {
        page: String(qp.pageNum),
        limit: String(qp.pageSize),
        keyword: qp.keyword || "",
        orderStatus:
          qp.status !== "" && qp.status != null ? String(qp.status) : "",
        start_time: dr && dr[0] ? dr[0] : "",
        end_time: dr && dr[1] ? dr[1] : "",
        isPay: qp.isPay !== "" && qp.isPay != null ? String(qp.isPay) : ""
      };
      this.$api({
        url: LIST_API,
        method: "post",
        data: params
      })
        .then(res => {
          if (res && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list;
            this.total = res.data.count != null ? res.data.count : list.length;
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
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams.pageNum = 1;
      this.queryParams.keyword = "";
      this.queryParams.status = "";
      this.queryParams.isPay = "";
      this.queryParams.dateRange = null;
      this.loadList();
    },
    handleView(row) {
      this.$router.push({
        path: "/purchase/external-product-purchase/purchase-order-detail",
        query: { id: row.id }
      });
    },
    handleComplete(row) {
      this.$confirm("确定将该采购单标记为采购完成吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // TODO: 调用采购完成接口
          this.$message.success("操作成功");
          this.loadList();
        })
        .catch(() => {});
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
.purchase-order-list-page {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  height: 100%;
}
.search-section {
  padding: 20px 24px;
  margin-bottom: 16px;
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
.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding: 0 27px 16px;
  margin-bottom: 0;
  text-align: left;
}
.table-view {
  overflow: hidden;
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
</style>
