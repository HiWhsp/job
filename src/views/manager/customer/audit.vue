<template>
  <div class="view-wrap customer-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词">
            <el-input v-model="queryParams.keyword" placeholder="客户编码/客户名称/联系人/电话" clearable style="width: 260px" />
          </el-form-item>
          <el-form-item label="客户属地">
            <el-select v-model="queryParams.belong" placeholder="请选择" clearable style="width: 140px">
              <el-option v-for="item in customerBelongOptions" :key="item.value" :label="item.name"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="客户区域">
            <el-select v-model="queryParams.region" placeholder="客户区域" clearable style="width: 140px">
              <el-option v-for="item in customerRegionOptions" :key="item.value" :label="item.name"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="客户属性A">
            <el-select v-model="queryParams.attrA" placeholder="客户属性A" clearable style="width: 140px">
              <el-option v-for="item in customerAttrAOptions" :key="item.value" :label="item.name"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </div>
        <div class="search-row">
          <el-form-item label="客户属性B">
            <el-select v-model="queryParams.attrB" placeholder="客户属性B" clearable style="width: 140px">
              <el-option v-for="item in customerAttrBOptions" :key="item.value" :label="item.name"
                :value="item.value" />
            </el-select>
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
        </div>
      </div>
      <div class="table-box">
        <el-table ref="tableH" :height="tableHeight" :data="tableData" header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="customerNo" label="客户编码" min-width="100" show-overflow-tooltip />
          <el-table-column prop="title" label="客户名称" min-width="180" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleView(row)">{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="territory" label="客户属地" min-width="90" show-overflow-tooltip />
          <el-table-column prop="region" label="客户区域" min-width="90" show-overflow-tooltip />
          <el-table-column prop="attributeA" label="客户属性A" min-width="100" show-overflow-tooltip />
          <el-table-column prop="attributeB" label="客户属性B" min-width="100" show-overflow-tooltip />
          <el-table-column prop="contact" label="客户直接联系人" min-width="120" show-overflow-tooltip />
          <el-table-column prop="phone" label="客户联系电话" min-width="120" show-overflow-tooltip />
          <el-table-column prop="companyPhone" label="公司电话" min-width="120" show-overflow-tooltip />
          <el-table-column prop="address" label="收货地址" min-width="200" show-overflow-tooltip />
          <el-table-column prop="receiver" label="收货人" min-width="90" show-overflow-tooltip />
          <el-table-column prop="receiverPhone" label="收货人联系方式" min-width="120" show-overflow-tooltip />
          <el-table-column prop="introducer" label="客户引入人" min-width="100" show-overflow-tooltip />
          <el-table-column prop="manager" label="客户负责人" min-width="100" show-overflow-tooltip />
          <el-table-column prop="other" label="其他" min-width="120" show-overflow-tooltip />
          <el-table-column prop="status" label="审核状态" width="100" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.status == '1'" type="info" size="small">待审核</el-tag>
              <el-tag v-else-if="row.status == '2'" type="danger" size="small">审核未通过</el-tag>
              <el-tag v-else-if="row.status == '-1'" type="success" size="small">已审核</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="180" align="center" />
          <el-table-column label="操作" width="180" align="left" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span class="row-act" v-if="row.status == '1'" @click="handleAudit(row)">审核</span>
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

    <!-- 查看详情 Drawer（从右往左展开，审核页展示审核数据） -->
    <detail-drawer :visible.sync="detailDrawerVisible" :detail-row="detailRow" :show-audit-section="true" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DetailDrawer from '../components/detail-drawer.vue';
import AuditDialog from '../components/audit-dialog.vue';

export default {
  name: 'Customer',

  components: {
    DetailDrawer,
    AuditDialog
  },

  computed: {
    ...mapState([
      'customerBelongOptions',
      'customerRegionOptions',
      'customerAttrAOptions',
      'customerAttrBOptions'
    ])
  },

  data() {
    return {
      queryParams: {
        keyword: '',
        belong: '',
        region: '',
        attrA: '',
        attrB: '',
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      selectedRows: [],
      rowToDelete: null,
      detailDrawerVisible: false,
      detailRow: null,
      auditDialogVisible: false,
      rowToAudit: null,
      auditTab: 'pending',
      auditTabs: [
        { label: '待审核', value: 'pending' },
        { label: '已审核', value: 'audited' },
        { label: '审核未通过', value: 'rejected' }
      ]
    };
  },

  mounted() {
    this.setView();
    this.loadList();
  },

  methods: {
    _parseJsonField(val) {
      if (val == null) return {};
      if (typeof val === 'object') return val;
      try {
        return typeof val === 'string' ? JSON.parse(val || '{}') : {};
      } catch (e) {
        return {};
      }
    },
    /** 将列表接口数据映射到表格行（仅处理需特殊转换：territory 转文案、addressJson/otherJson 解析、审核状态与时间） */
    mapApiRowToTableRow(item) {
      const addressObj = this._parseJsonField(item.addressJson);
      const otherObj = this._parseJsonField(item.otherJson);
      const territoryText =
        item.territory === 1 ? '国内' : item.territory === 2 ? '国外' : (item.territory ?? '');
      return {
        ...item,
        territory: territoryText,
        address: addressObj.address ?? '',
        receiver: addressObj.name ?? '',
        receiverPhone: addressObj.phone ?? '',
        introducer: otherObj.introducer ?? '',
        manager: otherObj.superintendent ?? '',
        other: otherObj.other ?? '',
        updateTime: item.updated_at || item.updateTime || ''
      };
    },
    /** 将详情接口返回的数据映射为详情抽屉展示（仅处理需特殊转换 + 审核字段） */
    mapDetailApiToDrawer(data) {
      const payment = this._parseJsonField(data.paymentJson);
      const address = this._parseJsonField(data.addressJson);
      const other = this._parseJsonField(data.otherJson);
      const territoryText =
        data.territory === 1 ? '国内' : data.territory === 2 ? '国外' : (data.territory ?? '');
      const statusNum = data.status;
      let auditStatus = '';
      if (statusNum === 1) auditStatus = 'pending';
      else if (statusNum === -1) auditStatus = 'audited';
      else if (statusNum === 2) auditStatus = 'rejected';
      return {
        ...data,
        territory: territoryText,
        termMonth: data.paymentTerm ?? data.termMonth ?? '',
        accountName: payment.account ?? '',
        accountNo: payment.code ?? '',
        bankName: payment.bank ?? '',
        address: address.address ?? '',
        receiver: address.name ?? '',
        receiverPhone: address.phone ?? '',
        introducer: other.introducer ?? '',
        manager: other.superintendent ?? '',
        other: other.other ?? '',
        auditStatus,
        updateTime: data.updated_at || data.updateTime || ''
      };
    },
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
    loadList() {
      const statusMap = {
        pending: '1',
        audited: '-1',
        rejected: '2'
      };
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        keyword: this.queryParams.keyword || '',
        territory: this.queryParams.belong || '',
        region: this.queryParams.region || '',
        attributeA: this.queryParams.attrA || '',
        attributeB: this.queryParams.attrB || '',
        status: statusMap[this.auditTab] || ''
      };
      this.$api({
        url: '/getCustomerList',
        method: 'post',
        data: params
      })
        .then(res => {
          if (res && res.data) {
            const list = res.data.list || res.data.rows || [];
            this.tableData = list.map(row => this.mapApiRowToTableRow(row));
            this.total = res.data.count ?? res.data.total ?? this.tableData.length;
          }
        })
        .catch(() => {
          this.tableData = [];
          this.total = 0;
        });
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
      this.$refs["queryForm"].resetFields();
      this.queryParams = {
        keyword: '',
        belong: '',
        region: '',
        attributeA: '',
        attributeB: '',
        pageNum: 1,
        pageSize: 20
      };
      this.loadList();
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    /** 调用详情接口并打开抽屉（与客户列表 list.vue 保持一致） */
    handleView(row) {
      const id = row && row.id;
      if (id == null || id === '') {
        this.$message.warning('缺少客户 id');
        return;
      }
      this.detailRow = null;
      this.detailDrawerVisible = true;
      this.$api({
        url: '/getCustomer',
        method: 'post',
        data: { id }
      })
        .then(res => {
          if (res && res.data) {
            this.detailRow = this.mapDetailApiToDrawer(res.data);
          } else {
            this.$message.error('获取详情失败');
            this.detailDrawerVisible = false;
          }
        })
        .catch(() => {
          this.$message.error('获取客户详情失败');
          this.detailDrawerVisible = false;
        });
    },
    handleAudit(row) {
      this.rowToAudit = row;
      this.auditDialogVisible = true;
    },
    handleAuditConfirm({ auditStatus, auditRemark }) {
      if (!this.rowToAudit) return;
      const id = this.rowToAudit.id;
      if (id == null || id === '') {
        this.$message.warning('缺少客户 id');
        return;
      }
      // 接口：status 2通过 -1驳回，reCont 审核原因
      const status = auditStatus === 'approve' ? '2' : '-1';
      this.$api({
        url: '/reviewCustomer',
        method: 'post',
        data: {
          id: String(id),
          status,
          reCont: auditRemark || ''
        }
      })
        .then(() => {
          this.$message.success(auditStatus === 'approve' ? '审核已通过' : '已驳回');
          this.rowToAudit = null;
          this.auditDialogVisible = false;
          this.loadList();
        })
        .catch(err => {
          this.$message.error((err && err.msg) ? err.msg : '审核失败');
        });
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
  justify-content: start;
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
</style>
