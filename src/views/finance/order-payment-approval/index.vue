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
          <el-form-item label="回款状态" prop="paymentStatus">
            <el-select
              v-model="queryParams.paymentStatus"
              placeholder="请选择"
              clearable
              style="width: 140px"
            >
              <el-option label="未回款" value="未回款" />
              <el-option label="部分回款" value="部分回款" />
              <el-option label="全部回款" value="全部回款" />
            </el-select>
          </el-form-item>
        </div>
        <div class="search-row">
          <el-form-item label="订单类型" prop="orderType">
            <el-select
              v-model="queryParams.orderType"
              placeholder="请选择"
              clearable
              style="width: 140px"
            >
              <el-option label="样品订单" value="样品订单" />
              <el-option label="辅销订单" value="辅销订单" />
              <el-option label="耗材订单" value="耗材订单" />
              <el-option label="赊销订单" value="赊销订单" />
              <el-option label="标研订单" value="标研订单" />
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
          >
            {{ tab.label }}
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
          <el-table-column type="index" label="序号" width="70" align="center">
            <template slot-scope="scope">{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="orderNo" label="订单编号" min-width="130" show-overflow-tooltip />
          <el-table-column prop="customerName" label="客户名称" min-width="180" show-overflow-tooltip />
          <el-table-column prop="location" label="属地" min-width="80" align="center" show-overflow-tooltip />
          <el-table-column prop="address" label="收货地址" min-width="220" show-overflow-tooltip />
          <el-table-column prop="orderAmount" label="订单金额" min-width="100" align="right" />
          <el-table-column prop="orderType" label="订单类型" min-width="100" show-overflow-tooltip />
          <el-table-column prop="orderStatus" label="订单状态" width="100" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.orderStatus === '待审批'" type="info" size="small">待审批</el-tag>
              <el-tag v-else-if="row.orderStatus === '待发货'" type="warning" size="small">待发货</el-tag>
              <el-tag v-else-if="row.orderStatus === '已发货'" type="success" size="small">已发货</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="deliveryPlanTime" label="预计发货时间" min-width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="payMethod" label="支付方式" min-width="100" show-overflow-tooltip />
          <el-table-column prop="accountPeriod" label="账期时间" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="payDueDate" label="应付款日期" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="paymentStatus" label="回款状态" width="100" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.paymentStatus === '未回款'" type="info" size="small">未回款</el-tag>
              <el-tag v-else-if="row.paymentStatus === '部分回款'" type="warning" size="small">部分回款</el-tag>
              <el-tag v-else-if="row.paymentStatus === '全部回款'" type="success" size="small">全部回款</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderTime" label="下单时间" width="120" align="center" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span class="row-act" @click="handleAddPayment(row)">添加回款</span>
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

    <!-- 提交回款 弹框（参考 list.vue） -->
    <el-dialog
      title="提交回款"
      :visible.sync="paymentDialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @close="closePaymentDialog"
    >
      <el-form ref="paymentForm" :model="paymentForm" :rules="paymentRules" label-width="120px">
        <el-form-item label="订单金额:">
          <p class="payment-amount">{{ paymentOrderAmount }}</p>
        </el-form-item>
        <el-form-item label="已回款金额:">
          <p class="payment-amount">{{ paymentPaidAmount }}</p>
        </el-form-item>
        <el-form-item label="未回款金额:">
          <p class="payment-amount amount-unpaid">{{ paymentUnpaidAmount }}</p>
        </el-form-item>
        <el-form-item label="本次回款金额:" prop="currentAmount">
          <el-input v-model="paymentForm.currentAmount" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="回款凭证:">
          <el-upload
            class="payment-upload"
            action="#"
            :auto-upload="false"
            :on-change="handlePaymentFileChange"
            :file-list="paymentForm.voucherList"
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
        <el-button type="primary" @click="submitPayment">提交</el-button>
        <el-button @click="closePaymentDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "OrderPaymentApproval",
  data() {
    return {
      queryParams: {
        keyword: "",
        status: "pending",
        orderStatus: "",
        payMethod: "",
        paymentStatus: "",
        orderType: "",
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [
        {
          id: 1,
          orderNo: "2026001-999",
          customerName: "浙江求实医疗科技有限公司",
          location: "国内",
          address: "浙江省嘉兴市嘉善县天天提大道666号",
          orderAmount: "2545.00",
          orderType: "样品订单",
          orderStatus: "待发货",
          deliveryPlanTime: "-",
          payMethod: "账期",
          accountPeriod: "-",
          payDueDate: "-",
          paymentStatus: "未回款",
          paidAmount: "0.00",
          orderTime: "2026-01-05"
        },
        {
          id: 2,
          orderNo: "2026001-999",
          customerName: "浙江求实医疗科技有限公司",
          location: "国外",
          address: "国外地址",
          orderAmount: "2545.00",
          orderType: "辅销订单",
          orderStatus: "待发货",
          deliveryPlanTime: "-",
          payMethod: "账期",
          accountPeriod: "2个月",
          payDueDate: "2026-01-05",
          paymentStatus: "未回款",
          paidAmount: "0.00",
          orderTime: "2026-01-05"
        },
        {
          id: 3,
          orderNo: "2026001-999",
          customerName: "浙江求实医疗科技有限公司",
          location: "国内",
          address: "浙江省嘉兴市嘉善县天天提大道666号",
          orderAmount: "2545.00",
          orderType: "耗材订单",
          orderStatus: "待发货",
          deliveryPlanTime: "-",
          payMethod: "分期付款",
          accountPeriod: "-",
          payDueDate: "-",
          paymentStatus: "未回款",
          paidAmount: "0.00",
          orderTime: "2026-01-05"
        },
        {
          id: 4,
          orderNo: "2026001-999",
          customerName: "浙江求实医疗科技有限公司",
          location: "国内",
          address: "浙江省嘉兴市嘉善县天天提大道666号",
          orderAmount: "2545.00",
          orderType: "赊销订单",
          orderStatus: "待发货",
          deliveryPlanTime: "-",
          payMethod: "账期",
          accountPeriod: "2个月",
          payDueDate: "2026-01-05",
          paymentStatus: "部分回款",
          paidAmount: "1000.00",
          orderTime: "2026-01-05"
        }
      ],
      /** 提交回款弹框（与 list.vue 一致） */
      paymentDialogVisible: false,
      rowToPayment: null,
      paymentForm: {
        currentAmount: "",
        voucherList: []
      },
      paymentRules: {
        currentAmount: [
          { required: true, message: "请输入本次回款金额", trigger: "blur" },
          { pattern: /^\d+(\.\d{1,2})?$/, message: "请输入有效金额（最多两位小数）", trigger: "blur" }
        ]
      },
      statusTab: "pending",
      statusTabs: [
        { label: "待审核", value: "pending" },
        { label: "已通过", value: "approved" },
        { label: "已驳回", value: "rejected" }
      ]
    };
  },
  computed: {
    /** 提交回款弹框 - 订单金额 */
    paymentOrderAmount() {
      if (!this.rowToPayment) return "0.00";
      return this.rowToPayment.orderAmount || "0.00";
    },
    /** 提交回款弹框 - 已回款金额 */
    paymentPaidAmount() {
      if (!this.rowToPayment) return "0.00";
      return this.rowToPayment.paidAmount != null ? String(this.rowToPayment.paidAmount) : "0.00";
    },
    /** 提交回款弹框 - 未回款金额（红色） */
    paymentUnpaidAmount() {
      if (!this.rowToPayment) return "0.00";
      const order = parseFloat(String(this.rowToPayment.orderAmount).replace(/,/g, "")) || 0;
      const paid = parseFloat(String(this.paymentPaidAmount).replace(/,/g, "")) || 0;
      const unpaid = (order - paid).toFixed(2);
      return unpaid;
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
      // TODO: 调用订单付款审核列表接口
      this.total = this.tableData.length;
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams.status = this.statusTab;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleTabChange(value) {
      this.statusTab = value;
      this.queryParams.status = value;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleExport() {
      // TODO: 导出
      this.$message.info("导出");
    },
    handleView(row) {
      // TODO: 跳转订单详情
    },
    /** 打开提交回款弹框（与 list.vue 一致） */
    handleAddPayment(row) {
      this.rowToPayment = row;
      this.paymentForm.currentAmount = "";
      this.paymentForm.voucherList = [];
      this.paymentDialogVisible = true;
    },
    /** 关闭提交回款弹框 */
    closePaymentDialog() {
      this.paymentDialogVisible = false;
      this.rowToPayment = null;
      this.paymentForm.currentAmount = "";
      this.paymentForm.voucherList = [];
      this.$refs.paymentForm && this.$refs.paymentForm.resetFields();
    },
    /** 回款凭证文件变更 */
    handlePaymentFileChange(file, fileList) {
      this.paymentForm.voucherList = fileList;
    },
    /** 提交回款 */
    submitPayment() {
      this.$refs.paymentForm.validate(valid => {
        if (!valid) return;
        if (!this.rowToPayment) return;
        const unpaid = parseFloat(String(this.paymentUnpaidAmount).replace(/,/g, "")) || 0;
        const current = parseFloat(this.paymentForm.currentAmount) || 0;
        if (current > unpaid) {
          this.$message.warning("本次回款金额不能大于未回款金额");
          return;
        }
        // TODO: 调用提交回款接口，上传凭证
        this.$message.success("提交成功");
        this.closePaymentDialog();
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

/* 提交回款弹框（与 list.vue 一致） */
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
</style>
