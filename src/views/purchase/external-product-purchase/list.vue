<template>
  <div class="view-wrap requisition-page">
    <!-- 搜索筛选 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="订单号/客户名称"
              clearable
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择"
              clearable
              style="width: 180px"
            >
              <el-option label="待生成采购单" value="4" />
              <el-option label="已生成采购单" value="7" />
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
    <div class="list-title">外采产品请购单</div>

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
          <el-table-column prop="id" label="序号" width="70" align="center"></el-table-column>
          <el-table-column prop="orderNo" label="订单号" show-overflow-tooltip />
          <el-table-column prop="customerName" label="客户名称" show-overflow-tooltip />
          <el-table-column prop="orderTime" label="订单时间" align="center" />
          <el-table-column prop="orderAmount" label="订单金额" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="String(row.orderStatus) === '4'" type="info" size="small" effect="plain">待生成采购单</el-tag>
              <el-tag v-else-if="String(row.orderStatus) === '7'" type="success" size="small" effect="plain">已生成采购单</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" align="center" />
          <el-table-column label="操作" min-width="180" align="center">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span v-if="String(row.orderStatus) === '4'" class="row-act" @click="handleGenerate(row)">生成采购单</span>
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
const LIST_API = "/getStaffOrderList";

export default {
  name: "ExternalProductRequisitionList",
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
        this.tableHeight = Math.max(window.innerHeight - tableOffsetTop - 80, 200);
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
      const [start_time = "", end_time = ""] = this.queryParams.dateRange || [];
      const params = {
        limit: String(this.queryParams.pageSize),
        page: String(this.queryParams.pageNum),
        // orderStatus 为采购流程状态：4 可创建/生成采购单，6 已生成采购单
        orderStatus: this.queryParams.status ? String(this.queryParams.status) : "4,7",
        keyword: this.queryParams.keyword || "",
        start_time: start_time || "",
        end_time: end_time || "",
        // 接口必传，页面不按付款状态过滤时传空
        isPay: "",
        isForeignProduct: 1
      };
      this.$api({
        url: LIST_API,
        method: "post",
        data: params
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list.map(it => ({
              ...it,
              orderNo: it.orderNo || "",
              customerName: it.customerTitle || "",
              orderTime: it.created_at || "",
              // 页面字段叫“订单金额”，后端当前示例未返回 staffOrderAmount，先用采购单金额兜底
              orderAmount: it.orderPrice || "",
              // 兼容旧字段（状态列/按钮权限已改为 orderStatus 判断）
              submitTime: it.updated_at || ""
            }));
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
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleView(row) {
      this.$router.push({
        path: "/purchase/external-product-purchase/detail",
        query: { id: row.id }
      });
    },
    handleGenerate(row) {
      this.$router.push({
        path: "/purchase/external-product-purchase/generate-purchase-order",
        query: { id: row.id }
      });
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
.requisition-page {
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
    padding: 0 24px;
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
