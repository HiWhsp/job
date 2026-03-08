<template>
  <div class="view-wrap finance-page">
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
    <!-- 表格区域：标签页 -->
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-tabs">
          <div
            v-for="(tab, index) in statusTabs"
            :key="index"
            class="tab-item"
            :class="{ active: statusTab === tab.value }"
            @click="handleTabChange(tab.value)"
          >
            {{ tab.label }}
          </div>
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
            <template slot-scope="scope">{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="requestNo" label="采购单号" align="center" show-overflow-tooltip />
          <el-table-column prop="purchaseName" label="采购名称" align="center" show-overflow-tooltip />
          <el-table-column prop="purchaseAmount" label="金额" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.status === '待付款'" type="warning" size="small">待付款</el-tag>
              <el-tag v-else-if="row.status === '已付款'" type="success" size="small">已付款</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" align="center" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span v-if="row.status === '待付款'" class="row-act" @click="handlePay(row)">立即付款</span>
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

    <!-- 付款弹框（与物料采购付款一致） -->
    <el-dialog
      title="付款"
      :visible.sync="payDialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @close="closePayDialog"
    >
      <el-form ref="payForm" :model="payForm" :rules="payRules" label-width="100px">
        <el-form-item label="付款金额:" prop="amount">
          <el-input v-model="payForm.amount" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="付款凭证:">
          <el-upload
            class="pay-upload"
            action="#"
            :auto-upload="false"
            :on-change="handlePayFileChange"
            :file-list="payForm.voucherList"
            list-type="picture-card"
            accept="image/*"
          >
            <div class="upload-inner">
              <i class="el-icon-plus" />
              <span class="upload-tip">添加图片</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPay">提交</el-button>
        <el-button @click="closePayDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "OtherPurchasePayment",
  data() {
    return {
      queryParams: {
        keyword: "",
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [
        {
          id: 1,
          requestNo: "4521414",
          purchaseName: "采购单名称",
          orderNo: "78456456",
          customerName: "浙江求实医疗科技有限公司",
          orderTime: "2026-01-05",
          purchaseAmount: "5000.00",
          status: "待付款",
          submitTime: "2026-01-05"
        },
        {
          id: 2,
          requestNo: "4521414",
          purchaseName: "采购单名称",
          orderNo: "78456456",
          customerName: "浙江求实医疗科技有限公司",
          orderTime: "2026-01-05",
          purchaseAmount: "5000.00",
          status: "待付款",
          submitTime: "2026-01-05"
        },
        {
          id: 3,
          requestNo: "4521414",
          purchaseName: "采购单名称",
          orderNo: "4521414",
          customerName: "浙江求实医疗科技有限公司",
          orderTime: "2026-01-05",
          purchaseAmount: "5000.00",
          status: "已付款",
          submitTime: "2026-01-05"
        }
      ],
      statusTab: "pending",
      statusTabs: [
        { label: "待付款", value: "pending" },
        { label: "已付款", value: "paid" }
      ],
      payDialogVisible: false,
      rowToPay: null,
      payForm: {
        amount: "",
        voucherList: []
      },
      payRules: {
        amount: [
          { required: true, message: "请输入付款金额", trigger: "blur" },
          { pattern: /^\d+(\.\d{1,2})?$/, message: "请输入有效金额（最多两位小数）", trigger: "blur" }
        ]
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
      // TODO: 根据 statusTab 调用外采产品付款列表接口
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
    handleTabChange(value) {
      this.statusTab = value;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleView(row) {
      // TODO: 跳转详情或弹窗
    },
    handlePay(row) {
      this.rowToPay = row;
      this.payForm.amount = "";
      this.payForm.voucherList = [];
      this.payDialogVisible = true;
    },
    closePayDialog() {
      this.payDialogVisible = false;
      this.rowToPay = null;
      this.payForm.amount = "";
      this.payForm.voucherList = [];
      this.$refs.payForm && this.$refs.payForm.resetFields();
    },
    handlePayFileChange(file, fileList) {
      this.payForm.voucherList = fileList;
    },
    submitPay() {
      this.$refs.payForm.validate(valid => {
        if (!valid) return;
        if (!this.rowToPay) return;
        // TODO: 调用外采产品付款接口，上传凭证
        this.$message.success("提交成功");
        this.closePayDialog();
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
    margin-bottom: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px 24px;
  }
  ::v-deep .el-form-item { margin-bottom: 0; }
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
      &:hover { color: #606266; }
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
    .el-table__body tr.row-even td { background: #f3f7fa; }
    .el-table__body tr:hover > td { background: #f5f7fa !important; }
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
    &:hover { text-decoration: underline; }
  }
}
.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}

::v-deep .el-dialog__footer {
  text-align: center;
}

/* 付款弹框 - 凭证上传 */
.pay-upload {
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
</style>
