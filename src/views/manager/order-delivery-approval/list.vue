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
            <el-select v-model="auditTab" placeholder="请选择" clearable style="width: 140px">
              <el-option
                v-for="item in orderStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式">
            <el-select v-model="queryParams.payType" placeholder="请选择" clearable style="width: 140px">
              <el-option
                v-for="item in payTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="回款状态">
            <el-select v-model="queryParams.payStatus" placeholder="请选择" clearable style="width: 140px">
              <el-option
                v-for="item in payStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="search-row">
          <el-form-item label="订单类型">
            <el-select v-model="queryParams.orderType" placeholder="请选择" clearable style="width: 140px">
              <el-option
                v-for="item in orderTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- 时间筛选 -->
          <el-form-item label="时间筛选">
            <el-date-picker v-model="queryParams.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" clearable style="width: 236px" />
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
          <!-- <el-button type="primary" size="small" @click="handleImport">客户导入</el-button> -->
          <el-button type="primary" size="small" @click="handleExport">导出</el-button>
          <!-- <el-button type="primary" size="small" @click="handleAdd">新增客户</el-button> -->
        </div>
      </div>
      <div class="table-box">
        <el-table ref="tableH" :height="tableHeight" :data="tableData" header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName">
          <el-table-column type="index" label="序号" width="70" align="center" />
          <el-table-column prop="orderNo" label="订单编号" min-width="130" show-overflow-tooltip />
          <el-table-column prop="customerTitle" label="客户名称" min-width="180" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleView(row)">{{ row.customerTitle }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerTerritory" label="属地" min-width="80" show-overflow-tooltip />
          <el-table-column label="收货地址" min-width="240" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span>{{ row.customerAddress && row.customerAddress.address ? row.customerAddress.address : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderPrice" label="订单金额" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.orderPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderTypeTitle" label="订单类型" min-width="110" show-overflow-tooltip />
          <el-table-column prop="orderStatusTitle" label="订单状态" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag
                v-if="row.orderStatus != null"
                :type="orderStatusTagType(row.orderStatus)"
                size="small"
              >
                {{ orderStatusText(row.orderStatus) || '-' }}
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
              <el-tag
                v-if="row.payStatus != null"
                :type="payStatusTagType(row.payStatus)"
                size="small"
              >
                {{ payStatusText(row.payStatus) }}
              </el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="下单时间" width="160" align="center" />
          <el-table-column label="操作" width="280" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span class="row-act" v-if="row.orderStatus == 3" @click="handleDelivery(row)">审批</span>
                <span class="row-act" v-if="row.orderStatus == 4" @click="handleOutboundShip(row)">发货</span>
                <!-- <span class="row-act" v-if="row.orderStatus == 4 || row.orderStatus == 7" @click="handleAudit(row)">打印电子订单</span> -->
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

    <!-- 审核弹框 -->
    <audit-dialog :visible.sync="auditDialogVisible" @confirm="handleAuditConfirm" />

    <!-- 审批发货弹框（与详情页一致） -->
    <el-dialog
      title="审批发货"
      :visible.sync="deliveryDialogVisible"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="deliveryForm"
        label-width="110px"
        label-position="right"
      >
        <el-form-item label="审批：">
          <el-radio-group v-model="deliveryForm.approveType">
            <el-radio label="batch">审批发货</el-radio>
            <el-radio label="lack">库存不足</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预计发货时间：">
          <el-date-picker
            v-model="deliveryForm.estimateTime"
            type="date"
            placeholder="请设置"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submitDelivery">提交</el-button>
        <el-button @click="deliveryDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AuditDialog from '../components/audit-dialog.vue';
import { adminPath } from '@/utils/adminRoutePrefix.js';

export default {
  name: 'OrderDeliveryApprovalList',

  components: {
    AuditDialog
  },
  data() {
    return {
      queryParams: {
        keyword: '',
        orderStatus: '',
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
      rowToDelete: null,
      auditDialogVisible: false,
      rowToAudit: null,
      deliveryDialogVisible: false,
      rowToDelivery: null,
      deliveryForm: {
        approveType: 'batch', // batch: 审批发货 -> status=1, lack: 库存不足 -> status=-1
        estimateTime: ''
      },
      auditTab: '3',
      auditTabs: [
        { label: '发货审批', value: '3' },
        { label: '待发货', value: '4' },
        { label: '已发货', value: '7' }
      ],
      orderStatusOptions: [
        // { label: '待营销总监审核', value: '1' },
        // { label: '待总经理审核', value: '2' },
        { label: '发货审批', value: '3' },
        { label: '待发货', value: '4' },
        // { label: '缺货', value: '5' },
        // { label: '暂停', value: '6' },
        { label: '已发货', value: '7' },
        // { label: '驳回', value: '-1' }
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
    // POST getStaffOrderList，Body 参数：page, limit, keyword, orderStatus, orderType, payType, payStatus（均为 string）；返回 data: { count, list }
    loadList() {
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        keyword: this.queryParams.keyword || '',
        orderStatus: this.auditTab || '',
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
        orderStatus: '',
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
      this.$router.push({
        path: adminPath(this, '/order-delivery-approval/detail'),
        query: { id }
      });
    },
    handleAudit(row) {
      this.rowToAudit = row;
      this.auditDialogVisible = true;
    },
    /** 发货审批（缺货审核等）：打开弹框提交 qhReviewStaffOrder */
    handleDelivery(row) {
      this.rowToDelivery = row;
      this.deliveryForm = {
        approveType: 'batch',
        estimateTime: ''
      };
      this.deliveryDialogVisible = true;
    },
    /** 列表/详情里 productJson、foreignProductJson 可能是数组，也可能是 JSON 字符串（甚至再包一层字符串） */
    normalizeOrderLineArray(val) {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string' && val.trim()) {
        try {
          let a = JSON.parse(val);
          if (typeof a === 'string' && a.trim().startsWith('[')) {
            try {
              a = JSON.parse(a);
            } catch (_) {
              return [];
            }
          }
          return Array.isArray(a) ? a : [];
        } catch (e) {
          return [];
        }
      }
      return [];
    },
    /** 出库行 id：优先 id，列表常见仅有 inventoryId */
    outboundLineId(it) {
      if (!it) return '';
      const raw =
        it.id != null && String(it.id).trim() !== ''
          ? it.id
          : it.inventoryId != null && String(it.inventoryId).trim() !== ''
            ? it.inventoryId
            : '';
      return raw != null ? String(raw).trim() : '';
    },
    buildOutboundIdsPayload(arr) {
      return this.normalizeOrderLineArray(arr)
        .map((it) => {
          const id = this.outboundLineId(it);
          return id ? { id } : null;
        })
        .filter(Boolean);
    },
    /** 待发货：用列表行上的 productJson / foreignProductJson 直接申请出库，不再请求详情 */
    handleOutboundShip(row) {
      if (!row) return;
      const staffOrderId = row.id != null ? String(row.id) : '';
      if (!staffOrderId) {
        this.$message.warning('缺少订单 id');
        return;
      }
      const productJsonSrc =
        row.productJson != null ? row.productJson : row.product_json;
      const foreignJsonSrc =
        row.foreignProductJson != null
          ? row.foreignProductJson
          : row.foreign_product_json;
      const productPayload = this.buildOutboundIdsPayload(productJsonSrc);
      const productRows = this.normalizeOrderLineArray(productJsonSrc);
      if (!productPayload.length && productRows.length > 0) {
        this.$message.warning('订单产品明细缺少可出库行 id，无法申请出库');
        return;
      }
      const foreignPayload = this.buildOutboundIdsPayload(foreignJsonSrc);
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: '申请出库中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.35)'
      });
      this.$api({
        url: '/addStaffOutboundOrder',
        method: 'post',
        data: {
          staffOrderId,
          productJson: JSON.stringify(productPayload),
          foreignProductJson: JSON.stringify(foreignPayload)
        }
      })
        .then((res) => {
          if (res && res.code === 200) {
            this.$message.success('申请出库成功');
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || '申请出库失败');
          }
        })
        .catch((err) => {
          this.$message.error((err && err.msg) ? err.msg : '申请出库失败');
        })
        .finally(() => {
          loading.close();
        });
    },
    /** 提交审批发货：调用缺货审核接口 qhReviewStaffOrder，id + status(1发货/-1缺货) + estimateTime */
    submitDelivery() {
      if (!this.rowToDelivery) return;
      if (!this.deliveryForm.estimateTime) {
        this.$message.error('请选择预计发货时间');
        return;
      }
      const id = this.rowToDelivery.id != null ? String(this.rowToDelivery.id) : '';
      if (!id) {
        this.$message.warning('缺少订单id');
        return;
      }
      const status = this.deliveryForm.approveType === 'lack' ? '-1' : '1'; // 1发货, -1缺货
      const estimateTime = this.deliveryForm.estimateTime || '';

      this.$api({
        url: '/qhReviewStaffOrder',
        method: 'post',
        data: {
          id,
          status,
          estimateTime
        }
      })
        .then((res) => {
          if (res && res.code === 200) {
            this.$message.success('提交成功');
            this.deliveryDialogVisible = false;
            this.rowToDelivery = null;
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || '提交失败');
          }
        })
        .catch((err) => {
          this.$message.error((err && err.msg) ? err.msg : '提交失败');
        });
    },
    /** 发货前审批：POST reviewStaffOrder，id、status(1通过/-1驳回)、cont（必填）；token 由 request 自动带 */
    handleAuditConfirm({ auditStatus, auditRemark }) {
      if (!this.rowToAudit) return;
      const remark = (auditRemark || '').trim();
      if (auditStatus !== 'approve' && !remark) {
        this.$message.warning('审核未通过时请填写审核备注');
        return;
      }
      const id = this.rowToAudit.id != null ? String(this.rowToAudit.id) : '';
      if (!id) {
        this.$message.warning('缺少订单id');
        return;
      }
      const status = auditStatus === 'approve' ? '1' : '-1';
      // 接口要求 cont 必填；空串会被 request 删掉，通过且无备注时用占位文案
      const cont = remark || (auditStatus === 'approve' ? '同意' : ' ');
      this.$api({
        url: '/reviewStaffOrder',
        method: 'post',
        data: {
          id,
          status,
          cont
        }
      })
        .then((res) => {
          if (res && res.code === 200) {
            this.$message.success(auditStatus === 'approve' ? '审核已通过' : '已拒绝');
            this.rowToAudit = null;
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || '审核失败');
          }
        })
        .catch((err) => {
          this.$message.error((err && err.msg) ? err.msg : '审核失败');
        });
    },
    handleEdit(row) {
      // TODO: 编辑
      this.$message.info('编辑：' + row.name);
    },
    handleAdd() {
      this.$router.push(adminPath(this, '/customer/add'));
    },
    handleImport() {
      // TODO: 客户导入
      this.$message.info('客户导入');
    },
    handleExport() {
      // TODO: 导出
      this.$message.info('导出');
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.loadList();
    },
    orderStatusTagType(status) {
      const s = Number(status);
      if (s === 7) return 'success';
      if (s === 4) return 'warning';
      return 'info';
    },
    payStatusText(status) {
      const s = Number(status);
      if (s === 1) return '未回款';
      if (s === 2) return '部分回款';
      if (s === 3) return '全部回款';
      return '';
    },
    payStatusTagType(status) {
      const s = Number(status);
      if (s === 1) return 'info';
      if (s === 2) return 'warning';
      if (s === 3) return 'success';
      return 'info';
    },
    orderStatusText(status) {
      const s = Number(status);
      if (s === 3) return '待审批';
      if (s === 4) return '待发货';
      if (s === 7) return '已发货';
      return '';
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

    &:hover {
      text-decoration: underline;
    }

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

.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}

/* 审批发货弹框与详情页一致 */
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
</style>
