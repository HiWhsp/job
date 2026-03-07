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
          <el-form-item label="订单状态">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择"
              clearable
              style="width: 140px"
            >
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式">
            <el-select
              v-model="queryParams.region"
              placeholder="客户区域"
              clearable
              style="width: 140px"
            >
              <el-option label="国内" value="国内" />
              <el-option label="国外" value="国外" />
              <el-option label="中国" value="中国" />
              <el-option label="北京" value="北京" />
              <el-option label="英国" value="英国" />
            </el-select>
          </el-form-item>
          <el-form-item label="回款状态">
            <el-select v-model="queryParams.attr" placeholder="客户属性" clearable style="width: 140px">
              <el-option label="企业" value="企业" />
              <el-option label="个人" value="个人" />
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
          <el-table-column prop="orderNo" label="回款单号" min-width="130" />
          <el-table-column prop="customerName" label="回款金额" min-width="200" />
          <el-table-column prop="dosageForm" label="所属订单" min-width="80" />
          <el-table-column prop="address" label="客户名称" min-width="260" />
          <el-table-column prop="orderAmount" label="订单总金额" min-width="100" align="right" />
          <el-table-column prop="orderType" label="订单时间" min-width="110" />
          <el-table-column prop="orderStatus" label="回款凭证" width="100" align="center" />
          <el-table-column prop="paymentStatus" label="回款状态" width="100" align="center" />
          <el-table-column prop="orderTime" label="提交时间" width="120" align="center" />
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
              <span
                class="detail-value"
              >{{ detailRow.paymentNo || detailRow.orderNo || detailRow.id }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">订单总金额：</span>
              <span class="detail-value amount-value">{{ detailRow.orderAmount || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">所属订单：</span>
              <span class="detail-value">{{ detailRow.orderNo || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">回款状态：</span>
              <el-tag size="small" type="info">{{ detailRow.paymentStatus || '待审核' }}</el-tag>
            </div>
            <div class="detail-item">
              <span class="detail-label">回款凭证：</span>
              <div class="voucher-placeholder">
                <img
                  v-if="detailRow.voucherUrl"
                  :src="detailRow.voucherUrl"
                  class="voucher-img"
                  alt="回款凭证"
                />
                <span v-else class="voucher-empty">暂无凭证</span>
              </div>
            </div>
          </div>
          <div class="detail-col">
            <div class="detail-item">
              <span class="detail-label">回款金额：</span>
              <span
                class="detail-value amount-value"
              >{{ detailRow.paymentAmount || detailRow.paidAmount || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">提交时间：</span>
              <span class="detail-value">{{ detailRow.orderTime || detailRow.submitTime || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">客户名称：</span>
              <span class="detail-value">{{ detailRow.customerName || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">审核备注：</span>
              <span class="detail-value">{{ detailRow.auditRemark || '—' }}</span>
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
        status: "",
        region: "",
        attr: "",
        type: "",
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [
        {
          id: 1,
          orderNo: "2020001-959",
          customerName: "浙江立汇医疗科技有限公司",
          dosageForm: "颗粒",
          address: "浙江立汇医疗科技有限公司天目大道566号",
          orderAmount: "2564.00",
          orderType: "标研订单",
          orderStatus: "待审批",
          deliveryPlanTime: "2026-01-08",
          payMethod: "预付款",
          deliveryMethod: "快递",
          accountPeriod: "1个月",
          accountDate: "2026-01-05",
          payDueDate: "2026-02-05",
          paymentStatus: "待回款",
          paidAmount: "0.00",
          auditStatus: "pending",
          orderTime: "2026-01-05"
        },
        {
          id: 2,
          orderNo: "2020001-965",
          customerName: "浙江中汇医疗科技有限公司",
          dosageForm: "颗粒",
          address: "浙江中汇医疗科技有限公司天目大道566号",
          orderAmount: "2564.00",
          orderType: "标研订单",
          orderStatus: "待发货",
          deliveryPlanTime: "2026-01-10",
          payMethod: "预付款",
          deliveryMethod: "快递",
          accountPeriod: "2个月",
          accountDate: "2026-01-05",
          payDueDate: "2026-03-05",
          paymentStatus: "部分回款",
          paidAmount: "2000.00",
          auditStatus: "pending",
          orderTime: "2026-01-05"
        },
        {
          id: 3,
          orderNo: "2020001-978",
          customerName: "示例客户C",
          dosageForm: "颗粒",
          address: "示例客户C的收货地址",
          orderAmount: "1280.00",
          orderType: "标研订单",
          orderStatus: "已发货",
          deliveryPlanTime: "2026-01-06",
          payMethod: "预付款",
          deliveryMethod: "快递",
          accountPeriod: "1个月",
          accountDate: "2026-01-06",
          payDueDate: "2026-02-06",
          paymentStatus: "全部回款",
          paidAmount: "1280.00",
          auditStatus: "audited",
          orderTime: "2026-01-06"
        }
      ],
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
      // TODO: 根据 auditTab 调用接口获取列表
      this.total = this.tableData.length;
    },
    handleAuditTabChange(value) {
      this.auditTab = value;
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