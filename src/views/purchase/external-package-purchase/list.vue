<template>
  <div class="view-wrap requisition-page">
    <!-- 搜索筛选 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="订单号"
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
              <el-option label="待生成采购单" value="pending" />
              <el-option label="已生成采购单" value="generated" />
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
    <div class="list-title">外采包装订单</div>

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
            <template slot-scope="scope">
              {{ String((queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1).padStart(3, '0') }}
            </template>
          </el-table-column>
          <el-table-column prop="orderNo" label="订单号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="packageSpec" label="包装规格" min-width="140" show-overflow-tooltip />
          <el-table-column prop="customerName" label="客户名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="orderTime" label="订单时间" width="120" align="center" />
          <el-table-column prop="status" label="状态" width="140" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.status === '待生成采购单'" type="info" size="small" effect="plain">待生成采购单</el-tag>
              <el-tag v-else-if="row.status === '已生成采购单'" type="success" size="small" effect="plain">已生成采购单</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="120" align="center" />
          <el-table-column label="操作" min-width="180" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span v-if="row.status === '待生成采购单'" class="row-act" @click="handleGenerate(row)">生成采购单</span>
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

    <!-- 生成采购单弹框 -->
    <el-dialog
      title="生成采购单"
      :visible.sync="generateOrderDialogVisible"
      width="480px"
      :close-on-click-modal="false"
      @close="closeGenerateOrderDialog"
    >
      <el-form ref="generateOrderForm" :model="generateOrderForm" :rules="generateOrderRules" label-width="100px" class="generate-order-form">
        <el-form-item label="采购数量:" prop="quantity">
          <el-input v-model="generateOrderForm.quantity" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="采购单价:" prop="unitPrice">
          <el-input v-model="generateOrderForm.unitPrice" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="采购总金额:">
          <span class="total-amount">{{ totalAmountDisplay }}</span>
        </el-form-item>
        <el-form-item label="预计到货期:" prop="arrivalDate">
          <el-date-picker
            v-model="generateOrderForm.arrivalDate"
            type="date"
            placeholder="请输入"
            clearable
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGenerateOrder">提交</el-button>
        <el-button @click="generateOrderDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ExternalPackageRequisitionList",
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
      tableData: [
        { id: 1, orderNo: "4521414", packageSpec: "客户定制包装", customerName: "浙江求实医疗科技有限公司", orderTime: "2026-01-05", status: "待生成采购单", submitTime: "2026-01-05" },
        { id: 2, orderNo: "4521414", packageSpec: "客户定制包装", customerName: "浙江求实医疗科技有限公司", orderTime: "2026-01-05", status: "待生成采购单", submitTime: "2026-01-05" },
        { id: 3, orderNo: "4521414", packageSpec: "客户定制包装", customerName: "浙江求实医疗科技有限公司", orderTime: "2026-01-05", status: "待生成采购单", submitTime: "2026-01-05" },
        { id: 4, orderNo: "4521414", packageSpec: "客户定制包装", customerName: "浙江求实医疗科技有限公司", orderTime: "2026-01-05", status: "已生成采购单", submitTime: "2026-01-05" },
        { id: 5, orderNo: "4521414", packageSpec: "客户定制包装", customerName: "浙江求实医疗科技有限公司", orderTime: "2026-01-05", status: "已生成采购单", submitTime: "2026-01-05" }
      ],
      generateOrderDialogVisible: false,
      generateOrderRow: null,
      generateOrderForm: {
        quantity: "",
        unitPrice: "",
        arrivalDate: ""
      },
      generateOrderRules: {
        quantity: [{ required: true, message: "请输入采购数量", trigger: "blur" }],
        unitPrice: [{ required: true, message: "请输入采购单价", trigger: "blur" }],
        arrivalDate: [{ required: true, message: "请选择预计到货期", trigger: "change" }]
      }
    };
  },
  computed: {
    totalAmountDisplay() {
      const qty = Number(this.generateOrderForm.quantity);
      const price = Number(this.generateOrderForm.unitPrice);
      if (isNaN(qty) || isNaN(price) || qty < 0 || price < 0) return "0.00";
      return (qty * price).toFixed(2);
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
      // TODO: 调用外采包装订单列表接口
      this.total = this.tableData.length;
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
        path: "/purchase/external-package-purchase/detail",
        query: { id: row.id }
      });
    },
    handleGenerate(row) {
      this.generateOrderRow = row;
      this.generateOrderForm.quantity = "";
      this.generateOrderForm.unitPrice = "";
      this.generateOrderForm.arrivalDate = "";
      this.generateOrderDialogVisible = true;
    },
    closeGenerateOrderDialog() {
      this.generateOrderRow = null;
      this.generateOrderForm.quantity = "";
      this.generateOrderForm.unitPrice = "";
      this.generateOrderForm.arrivalDate = "";
      this.$refs.generateOrderForm && this.$refs.generateOrderForm.resetFields();
    },
    submitGenerateOrder() {
      this.$refs.generateOrderForm.validate(valid => {
        if (!valid) return;
        // TODO: 调用生成采购单接口，传入 generateOrderRow.id 与 generateOrderForm
        this.$message.success("提交成功");
        this.generateOrderDialogVisible = false;
        this.closeGenerateOrderDialog();
        this.loadList();
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

/* 生成采购单弹框 */
.generate-order-form {
  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }
  ::v-deep .el-input__inner {
    border-radius: 4px;
    border-color: #dcdfe6;
  }
  .total-amount {
    width: 100%;
    display: inline-block;
    font-size: 16px;
    color: #333;
    font-weight: bold;
    text-align: left;
  }
}
::v-deep .el-dialog__footer {
  text-align: right;
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
