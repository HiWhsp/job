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
          <el-button type="primary" size="small" @click="handleExport">导出</el-button>
          <el-button type="primary" size="small" @click="handleAdd">新增订单</el-button>
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
              <span>{{ (row.customerAddress && row.customerAddress.address) ? row.customerAddress.address : (row.address || '') }}</span>
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
              <el-tag
                v-if="row.orderStatus != null"
                :type="orderStatusTagType(row.orderStatus)"
                size="small"
              >
                {{ row.orderStatusTitle || row.orderStatus || '-' }}
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
              <span v-else>{{ row.paymentStatus || '—' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="下单时间" width="160" align="center" />
          <el-table-column label="操作" width="280" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span class="row-act" @click="handleSubmitPayment(row)">提交回款</span>
                <span class="row-act" v-if="row.orderStatusTitle && row.orderStatusTitle.includes('审核')" @click="handleAudit(row)">审核</span>
                <span class="row-act" v-if="row.orderStatus == 4" @click="handleDelivery(row)">发货</span>
                <span class="row-act" @click="handleAudit(row)">继续</span>
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

    <!-- 提交回款 弹框 -->
    <el-dialog title="提交回款" :visible.sync="paymentDialogVisible" width="520px" :close-on-click-modal="false"
      @close="closePaymentDialog">
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
            list-type="picture-card"
            :action="uploadAction"
            name="file"
            :file-list="paymentForm.voucherList"
            :on-success="(res, file, list) => handlePaymentUploadSuccess(res, file, list)"
            :on-remove="(file, list) => handlePaymentUploadRemove(file, list)"
            :http-request="handlePaymentUploadRequest"
          >
            <i class="el-icon-plus" />
            <span class="upload-tip">添加图片</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPayment">提交</el-button>
        <el-button @click="closePaymentDialog">取消</el-button>
      </span>
    </el-dialog>

    <!-- 审批发货弹框 -->
    <el-dialog
      title="审批发货"
      :visible.sync="deliveryDialogVisible"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form :model="deliveryForm" label-width="100px" label-position="right">
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

    <!-- 是否继续 弹框 -->
    <el-dialog title="是否继续" :visible.sync="auditDialogVisible" width="480px" :close-on-click-modal="false"
      @close="closeAuditDialog">
      <el-form label-width="100px">
        <el-form-item label="是否继续:">
          <el-radio-group v-model="auditContinueChoice">
            <el-radio label="continue">继续</el-radio>
            <el-radio label="pause">暂停</el-radio>
            <el-radio label="cancel">取消</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAuditChoice">提交</el-button>
        <el-button @click="closeAuditDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { UPLOAD_ROOT } from '@/config/env.js';

export default {
  name: 'OrderDeliveryApprovalList',
  data() {
    return {
      uploadAction: UPLOAD_ROOT,
      // 接口 getStaffOrderList 请求参数：page, limit, keyword, orderStatus, orderType, payType, payStatus（均为 string，必填传空串表示不限）
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
      auditContinueChoice: 'pause',
      deliveryDialogVisible: false,
      rowToDelivery: null,
      deliveryForm: { approveType: 'batch', estimateTime: '' },
      paymentDialogVisible: false,
      rowToPayment: null,
      paymentForm: { currentAmount: '', voucherList: [] },
      paymentRules: {
        currentAmount: [
          { required: true, message: '请输入本次回款金额', trigger: 'blur' },
          { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效金额（最多两位小数）', trigger: 'blur' }
        ]
      },
      auditTab: '1',
      auditTabs: [
        { label: '待审核', value: '1' },
        { label: '待发货', value: '4' },
        { label: '已发货', value: '7' },
        { label: '审核未通过', value: '-1' },
        { label: '缺货审核', value: '3' },
        { label: '已取消', value: '6' }
      ],
      orderStatusOptions: [
        { label: '待营销总监审核', value: '1' },
        { label: '待总经理审核', value: '2' },
        { label: '缺货审核', value: '3' },
        { label: '待发货', value: '4' },
        { label: '缺货', value: '5' },
        { label: '暂停', value: '6' },
        { label: '已发货', value: '7' },
        { label: '驳回', value: '-1' }
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

  computed: {
    paymentOrderAmount() {
      if (!this.rowToPayment) return '0.00';
      return this.rowToPayment.orderPrice != null ? String(this.rowToPayment.orderPrice) : (this.rowToPayment.orderAmount || '0.00');
    },
    paymentPaidAmount() {
      if (!this.rowToPayment) return '0.00';
      const v = this.rowToPayment.payPrice != null ? this.rowToPayment.payPrice : this.rowToPayment.paidAmount;
      return v != null ? String(v) : '0.00';
    },
    paymentUnpaidAmount() {
      if (!this.rowToPayment) return '0.00';
      const order = parseFloat(String(this.paymentOrderAmount).replace(/,/g, '')) || 0;
      const paid = parseFloat(String(this.paymentPaidAmount).replace(/,/g, '')) || 0;
      const unpaid = (order - paid).toFixed(2);
      return unpaid;
    }
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
        orderStatus: this.queryParams.orderStatus || '',
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
      this.$router.push({ path: '/sales/order/detail', query: { id } });
    },
    orderStatusTagType(status) {
      const s = Number(status);
      if (s === 7) return 'success';
      if (s === 4) return 'success';
      if (s === 5 || s === -1) return 'danger';
      if (s === 6) return 'warning';
      return 'info';
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
    handleDelivery(row) {
      this.rowToDelivery = row;
      this.deliveryForm = { approveType: 'batch', estimateTime: '' };
      this.deliveryDialogVisible = true;
    },
    submitDelivery() {
      if (!this.rowToDelivery) return;
      if (!this.deliveryForm.estimateTime) {
        this.$message.error('请选择预计发货时间');
        return;
      }
      const id = String(this.rowToDelivery.id);
      const status = this.deliveryForm.approveType === 'lack' ? '-1' : '1';
      const estimateTime = this.deliveryForm.estimateTime || '';
      this.$api({
        url: '/qhReviewStaffOrder',
        method: 'post',
        data: { id, status, estimateTime }
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
    handlePrintOrder(row) {
      this.$message.info('打印电子订单：' + (row.orderNo || ''));
    },
    /** 打开提交回款弹框 */
    handleSubmitPayment(row) {
      this.rowToPayment = row;
      this.paymentForm.currentAmount = '';
      this.paymentForm.voucherList = [];
      this.paymentDialogVisible = true;
    },
    /** 关闭提交回款弹框 */
    closePaymentDialog() {
      this.paymentDialogVisible = false;
      this.rowToPayment = null;
      this.paymentForm.currentAmount = '';
      this.paymentForm.voucherList = [];
      this.$refs.paymentForm && this.$refs.paymentForm.resetFields();
    },
    /** 回款凭证：自定义上传，与订单新增等图片上传一致 */
    handlePaymentUploadRequest(option) {
      const formData = new FormData();
      formData.append('file', option.file);
      const token = localStorage.getItem('token');
      axios
        .post(UPLOAD_ROOT, formData, {
          headers: { Authorization: 'Bearer ' + token },
          timeout: 60000
        })
        .then(res => {
          const data = res.data || res;
          const payload = (data && data.data) ? data.data : data;
          const url = (payload && (payload.path || payload.url)) || (data && data.path) || '';
          option.onSuccess({ url });
        })
        .catch(err => {
          this.$message.error(
            (err.response && err.response.data && err.response.data.msg) || '上传失败'
          );
          option.onError(err);
        });
    },
    handlePaymentUploadSuccess(res, file, fileList) {
      this.paymentForm.voucherList = fileList;
      const r = res || (file && file.response);
      const payload = (r && r.data) ? r.data : r;
      const url = (payload && (payload.path || payload.url)) || (r && r.path) || (file && file.url) || '';
      if (url && file) file.url = url;
    },
    handlePaymentUploadRemove(file, fileList) {
      this.paymentForm.voucherList = fileList || [];
    },
    /** 回款凭证 URL 拼接为逗号字符串（与 addStaffOrderPay 的 payImage 一致） */
    getPaymentVoucherUrls() {
      const list = this.paymentForm.voucherList || [];
      const urls = list.map(f => f.url || (f.response && f.response.url)).filter(Boolean);
      return urls.join(',');
    },
    /** 提交回款：POST addStaffOrderPay，参数 orderId、payImage、payPrice */
    submitPayment() {
      this.$refs.paymentForm.validate(valid => {
        if (!valid) return;
        if (!this.rowToPayment) return;
        const unpaid = parseFloat(String(this.paymentUnpaidAmount).replace(/,/g, '')) || 0;
        const current = parseFloat(this.paymentForm.currentAmount) || 0;
        if (current > unpaid) {
          this.$message.warning('本次回款金额不能大于未回款金额');
          return;
        }
        const orderId = this.rowToPayment.id != null ? String(this.rowToPayment.id) : '';
        if (!orderId) {
          this.$message.warning('缺少订单id');
          return;
        }
        const payImage = this.getPaymentVoucherUrls();
        if (!payImage) {
          this.$message.warning('请上传回款凭证');
          return;
        }
        const payPrice = String(this.paymentForm.currentAmount || '0');

        this.$api({
          url: '/addStaffOrderPay',
          method: 'post',
          data: { orderId, payImage, payPrice }
        })
          .then(res => {
            if (res && res.code === 200) {
              this.$message.success('提交成功');
              this.closePaymentDialog();
              this.loadList();
            } else {
              this.$message.error((res && res.msg) || '提交失败');
            }
          })
          .catch(err => {
            this.$message.error((err && err.msg) ? err.msg : '提交失败');
          });
      });
    },
    handleAudit(row) {
      this.rowToAudit = row;
      this.auditContinueChoice = 'pause';
      this.auditDialogVisible = true;
    },
    /** 关闭是否继续弹框 */
    closeAuditDialog() {
      this.auditDialogVisible = false;
      this.rowToAudit = null;
      this.auditContinueChoice = 'pause';
    },
    /** 提交是否继续：POST jxStaffOrder，参数 id、status（1继续 2暂停 3取消） */
    submitAuditChoice() {
      if (!this.rowToAudit) return;
      const id = this.rowToAudit.id != null ? String(this.rowToAudit.id) : '';
      if (!id) {
        this.$message.warning('缺少订单id');
        return;
      }
      const statusMap = { continue: '1', pause: '2', cancel: '3' };
      const status = statusMap[this.auditContinueChoice] || '2';

      this.$api({
        url: '/jxStaffOrder',
        method: 'post',
        data: { id, status }
      })
        .then(res => {
          if (res && res.code === 200) {
            const actionMap = { continue: '继续', pause: '暂停', cancel: '取消' };
            this.$message.success(`已选择${actionMap[this.auditContinueChoice]}`);
            this.closeAuditDialog();
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || '提交失败');
          }
        })
        .catch(err => {
          this.$message.error((err && err.msg) ? err.msg : '提交失败');
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

    & + .row-act::before {
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
