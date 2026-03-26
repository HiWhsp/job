<template>
  <div class="view-wrap customer-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词">
            <el-input v-model="queryParams.keyword" placeholder="订单编号/客户名称" clearable style="width: 260px" />
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="queryParams.orderStatus" placeholder="请选择" clearable style="width: 140px">
              <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式">
            <el-select v-model="queryParams.payType" placeholder="请选择" clearable style="width: 140px">
              <el-option v-for="item in payTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="回款状态">
            <el-select v-model="queryParams.payStatus" placeholder="请选择" clearable style="width: 140px">
              <el-option v-for="item in payStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </div>
        <div class="search-row">
          <el-form-item label="订单类型">
            <el-select v-model="queryParams.orderType" placeholder="请选择" clearable style="width: 140px">
              <el-option v-for="item in orderTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- 时间筛选 -->
          <el-form-item label="时间筛选">
            <el-date-picker v-model="queryParams.date" type="daterange" range-separator="-" start-placeholder="开始日期"
              end-placeholder="结束日期" clearable style="width: 236px" />
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
          <div v-for="(tab, index) in auditTabs" :key="index" class="tab-item"
            :class="{ active: auditTab === tab.value }" @click="handleAuditTabChange(tab.value)">
            {{ tab.label }}
          </div>
        </div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleExport">导出</el-button>
          <!-- <el-button type="primary" size="small" @click="handleAdd">新增订单</el-button> -->
        </div>
      </div>
      <div class="table-box">
        <el-table ref="tableH" :height="tableHeight" :data="tableData" header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName">
          <el-table-column type="index" label="序号" width="70" align="center" />
          <el-table-column prop="orderNo" label="订单编号" min-width="130" show-overflow-tooltip />
          <el-table-column prop="customerTitle" label="客户名称" min-width="180" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleView(row)">{{ row.customerTitle || row.customerName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerTerritory" label="属地" min-width="80" show-overflow-tooltip />
          <el-table-column label="收货地址" min-width="240" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span>{{ (row.customerAddress && row.customerAddress.address) ? row.customerAddress.address : (row.address
                || '') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderPrice" label="订单金额" align="center" min-width="100">
            <template slot-scope="{ row }">
              <span>{{ row.orderPrice != null ? row.orderPrice : row.orderAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderTypeTitle" label="订单类型" min-width="110" show-overflow-tooltip />
          <el-table-column prop="orderStatusTitle" label="订单状态" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.orderStatus != null" :type="orderStatusTagType(row.orderStatus)" size="small">
                {{ orderStatusText(row.orderStatus) }}
              </el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="estimateTime" label="预计发货时间" min-width="140" show-overflow-tooltip />
          <el-table-column prop="payTypeTitle" label="支付方式" min-width="110" show-overflow-tooltip />
          <el-table-column prop="paymentTerm" label="账期时间" width="120" align="center" />
          <el-table-column prop="paymentTermTime" label="应付款时间" width="120" align="center" />
          <el-table-column prop="payStatus" label="回款状态" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.payStatus != null" :type="payStatusTagType(row.payStatus)" size="small">
                {{ payStatusText(row.payStatus) }}
              </el-tag>
              <span v-else>{{ row.paymentStatus || '—' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="下单时间" width="160" align="center" />
          <el-table-column label="操作" width="280" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span class="row-act" v-if="[1, -1].includes(row.orderStatus)" @click="handleAudit(row)">审核</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryParams.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="queryParams.pageSize"
            layout="total, prev, pager, next, jumper" :total="total" />
        </div>
      </div>
    </div>

    <!-- 是否继续 弹框 -->
    <el-dialog title="审核" :visible.sync="auditDialogVisible" width="480px" :close-on-click-modal="false"
      @close="closeAuditDialog">
      <el-form label-width="100px">
        <el-form-item label="审核状态:" style="text-align: left;">
          <el-radio-group v-model="auditContinueChoice">
            <el-radio label="continue">批准</el-radio>
            <el-radio label="pause">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注:">
          <el-input v-model="auditRemark" placeholder="请输入" clearable maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="auditSubmitLoading"
          :disabled="auditSubmitLoading"
          @click="submitAuditChoice"
        >提交</el-button>
        <el-button :disabled="auditSubmitLoading" @click="closeAuditDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrderDeliveryApprovalList',
  data() {
    return {
      // 接口 getStaffOrderList 请求参数：page, limit, keyword, orderStatus, orderType, payType, payStatus（均为 string，必填传空串表示不限）
      queryParams: {
        keyword: '',
        orderStatus: '1',
        orderType: '',
        payType: '',
        payStatus: '',
        date: [],
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      auditDialogVisible: false,
      auditSubmitLoading: false,
      rowToAudit: null,
      auditContinueChoice: 'pause',
      auditRemark: '',
      auditTab: '1',
      auditTabs: [
        { label: '待审核', value: '1' },
      ],
      orderStatusOptions: [
        { label: '待审核', value: '1' },
        { label: '待发货', value: '4' },
        { label: '已发货', value: '7' },
        { label: '审核未通过', value: '-1' },
        { label: '缺货审核', value: '3' },
        { label: '已取消', value: '-2' },
        { label: '暂停', value: '6' }
      ],
      orderTypeOptions: [
        { label: '销售订单', value: '1' },
        { label: '样品订单', value: '2' }
      ],
      payTypeOptions: [
        { label: '现结', value: '1' },
        { label: '账期', value: '2' },
        { label: '分期付款', value: '3' }
      ],
      payStatusOptions: [
        { label: '未回款', value: '1' },
        { label: '部分回款', value: '2' },
        { label: '全部回款', value: '3' }
      ]
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
        window.onresize = function () {
          const top = tableEl.offsetTop + 84 + 80;
          that.tableHeight = Math.max(window.innerHeight - top, 200);
        };
      });
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? 'row-even' : '';
    },
    // POST getStaffOrderList，返回 data: { count, list }，list 项含 orderNo/customerTitle/customerAddress/orderPrice/orderStatusTitle 等
    loadList() {
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        keyword: this.queryParams.keyword || '',
        orderStatus: this.queryParams.orderStatus || this.auditTab || '',
        orderType: this.queryParams.orderType || '',
        payType: this.queryParams.payType || '',
        payStatus: this.queryParams.payStatus || ''
      };
      this.$api({
        url: '/getStaffOrderList',
        method: 'post',
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
      this.queryParams.orderStatus = value;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams = {
        keyword: '',
        orderStatus: '1',
        orderType: '',
        payType: '',
        payStatus: '',
        date: [],
        pageNum: 1,
        pageSize: this.queryParams.pageSize
      };
      this.loadList();
    },
    handleView(row) {
      const id = row && row.id != null ? String(row.id) : '';
      if (!id) {
        this.$message.warning('缺少订单id');
        return;
      }
      this.$router.push({ path: '/marketing/order-audit-detail', query: { id } });
    },
    orderStatusTagType(status) {
      const s = Number(status);
      if (s === 7) return 'success';
      if (s === 4) return 'warning';
      if (s === -1 || s === -2 || s === 6) return 'danger';
      return 'info';
    },
    orderStatusText(status) {
      const s = Number(status);
      if (s === 1 || s === 2) return '待审核';
      if (s === 4) return '待发货';
      if (s === 7) return '已发货';
      if (s === -1) return '审核未通过';
      if (s === 3) return '缺货';
      if (s === -2) return '取消';
      if (s === 6) return '暂停';
      return '-';
    },
    payStatusText(status) {
      const s = Number(status);
      if (s === 1) return '未回款';
      if (s === 2) return '部分回款';
      if (s === 3) return '全部回款';
      return status != null ? String(status) : '';
    },
    payStatusTagType(status) {
      const s = Number(status);
      if (s === 1) return 'info';
      if (s === 2) return 'warning';
      if (s === 3) return 'success';
      return 'info';
    },
    handleAudit(row) {
      this.rowToAudit = row;
      this.auditContinueChoice = 'pause';
      this.auditDialogVisible = true;
    },
    /** 关闭是否继续弹框 */
    closeAuditDialog() {
      this.auditSubmitLoading = false;
      this.auditDialogVisible = false;
      this.rowToAudit = null;
      this.auditContinueChoice = 'pause';
      this.auditRemark = '';
    },
    /** 审核：POST reviewStaffOrder，参数 id、status（1通过, -1驳回）、cont（必填）；token 由 request 自动带 */
    submitAuditChoice() {
      if (this.auditSubmitLoading) return;
      if (!this.rowToAudit) return;
      const id = this.rowToAudit.id != null ? String(this.rowToAudit.id) : '';
      if (!id) {
        this.$message.warning('缺少订单id');
        return;
      }

      const pass = this.auditContinueChoice === 'continue';
      const remark = (this.auditRemark || '').trim();
      const cont =
        remark || (pass ? '同意' : '驳回');

      this.auditSubmitLoading = true;
      this.$api({
        url: '/reviewStaffOrder',
        method: 'post',
        data: {
          id,
          status: pass ? '1' : '-1',
          cont
        }
      })
        .then(res => {
          if (res && res.code === 200) {
            this.$message.success(this.auditContinueChoice === 'continue' ? '审核通过' : '审核驳回');
            this.closeAuditDialog();
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || '提交失败');
          }
        })
        .catch(err => {
          this.$message.error((err && err.msg) ? err.msg : '提交失败');
        })
        .finally(() => {
          this.auditSubmitLoading = false;
        });
    },
    handleExport() {
      // TODO: 导出
      this.$message.info('导出');
    },
    handleAdd() {
      this.$router.push('/sales/order/add');
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
    background: linear-gradient(90deg, #157DE9 0%, #3697FD 100%) !important;
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
          content: '';
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
      background: linear-gradient(90deg, #157DE9 0%, #3697FD 100%) !important;
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

    .el-table__body tr:hover>td {
      background: #f5f7fa !important;
    }
  }
}

.link-name {
  color: #2373C8;
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

    &+.row-act::before {
      content: '';
      display: inline-block;
      width: 1px;
      height: 12px;
      background: #dcdfe6;
      margin: 0 8px;
      vertical-align: middle;
    }
  }
}

:deep(.el-dialog__header) {
  height: 60px;
  padding: 0 24px 0;
  background: #F7F7F7;
  text-align: left;

  .el-dialog__title {
    line-height: 60px;
    font-size: 18px;
    font-weight: 500;
    color: #333333;
  }
}

:deep(.el-dialog__body) {
  padding: 30px 80px;
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
  display: flex;

  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 120px;
    border: 1px solid #c0ccda;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .el-icon-plus {
      font-size: 28px;
      color: #909399;
      margin-bottom: 4px;
    }
  }

  ::v-deep .el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 120px;
    border-radius: 4px;
  }

  ::v-deep .el-upload-list__item-thumbnail {
    object-fit: fill;
  }

  .upload-tip {
    font-size: 14px;
    color: #878787;
    line-height: 20px;
  }
}
</style>
