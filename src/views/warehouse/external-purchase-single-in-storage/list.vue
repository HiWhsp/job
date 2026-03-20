<template>
  <div class="view-wrap external-purchase-in-storage-page">
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
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
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="block-section">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="待入库" name="pending" />
        <el-tab-pane label="已入库" name="stored" />
        <el-tab-pane label="审核未通过" name="auditFailed" />
      </el-tabs>

      <div class="table-box">
        <el-table
          ref="tableRef"
          :height="tableHeight"
          :data="tableData"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="序号" width="70" align="center">
            <template slot-scope="scope">
              {{ String((queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1).padStart(3, '0') }}
            </template>
          </el-table-column>
          <el-table-column prop="ruKuNo" label="入库单号" min-width="140" show-overflow-tooltip />
          <el-table-column prop="purchaseNo" label="对应采购单号" min-width="140" show-overflow-tooltip />
          <el-table-column prop="purchaseName" label="采购单名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="orderAmount" label="订单金额" width="120" align="center" />
          <el-table-column label="状态" width="110" align="center">
            <template slot-scope="{ row }">
              <span :class="statusTagClass(row.orderStatus)">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="170" align="center" />
          <el-table-column label="操作" width="200" align="left">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleViewDetail(row)">查看详情</span>
                <span v-if="Number(row.orderStatus) === 5" class="row-act" @click="handleQcIn(row)">质检入库</span>
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
const LIST_API = '/getPurchaseForeignProductOrderList';

/** tab -> 接口 status：待入库5、已入库6、审核未通过-1 */
const TAB_STATUS = {
  pending: '5',
  stored: '6',
  auditFailed: '-1'
};

export default {
  name: 'ExternalPurchaseSingleInStorageList',
  data() {
    return {
      activeTab: 'pending',
      queryParams: {
        keyword: '',
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
    currentStatusParam() {
      return TAB_STATUS[this.activeTab] || '5';
    },
    statusText(orderStatus) {
      const s = Number(orderStatus);
      if (s === 5) return '待入库';
      if (s === 6) return '已入库';
      if (s === -1) return '审核未通过';
      return '—';
    },
    statusTagClass(orderStatus) {
      const s = Number(orderStatus);
      if (s === 6) return 'tag tag-success';
      if (s === -1) return 'tag tag-danger';
      return 'tag tag-gray';
    },
    setView() {
      this.$nextTick(() => {
        const refTable = this.$refs.tableRef;
        if (!refTable) return;
        const tableEl = refTable.$el || refTable;
        const tableOffsetTop = tableEl.offsetTop + 120;
        this.tableHeight = Math.max(window.innerHeight - tableOffsetTop - 80, 200);
        const that = this;
        window.onresize = function () {
          const top = tableEl.offsetTop + 120 + 80;
          that.tableHeight = Math.max(window.innerHeight - top, 200);
        };
      });
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? 'row-even' : '';
    },
    loadList() {
      const dr = this.queryParams.dateRange;
      const start_time = dr && dr[0] ? dr[0] : '';
      const end_time = dr && dr[1] ? dr[1] : '';
      this.$api({
        url: LIST_API,
        method: 'post',
        data: {
          page: String(this.queryParams.pageNum),
          limit: String(this.queryParams.pageSize),
          keyword: this.queryParams.keyword || '',
          start_time,
          end_time,
          /** 付款状态：99未付 1已付；空表示不限（若后端必填可改为固定值） */
          isPay: '',
          status: this.currentStatusParam()
        }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list.map(it => ({
              id: it.id,
              orderStatus: it.orderStatus,
              statusText: this.statusText(it.orderStatus),
              ruKuNo: it.ruKuNo || '—',
              purchaseNo: it.purchaseNo || '',
              purchaseName: it.title || '',
              orderAmount: it.price != null ? it.price : '',
              submitTime: it.created_at || ''
            }));
            this.total = res.data.count != null ? res.data.count : list.length;
          } else {
            this.tableData = [];
            this.total = 0;
            if (res && res.msg) this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.tableData = [];
          this.total = 0;
        });
    },
    handleTabClick() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.$refs.queryForm && this.$refs.queryForm.resetFields();
      this.queryParams.keyword = '';
      this.queryParams.dateRange = null;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.loadList();
    },
    handleViewDetail(row) {
      this.$router.push({
        path: '/warehouse/external-purchase-single-in-storage/detail',
        query: { id: row.id != null ? String(row.id) : '' }
      });
    },
    handleQcIn(row) {
      this.$router.push({
        path: '/warehouse/external-purchase-single-in-storage/detail',
        query: { id: row.id != null ? String(row.id) : '', focusQc: '1' }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.external-purchase-in-storage-page {
  background: #fff;
  border-radius: 8px;
}

.search-section {
  text-align: left;
  padding: 20px 24px;
  margin-bottom: 10px;
}

.search-form {
  ::v-deep .el-form-item {
    margin-bottom: 0;
    margin-right: 16px;
  }
  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }
  ::v-deep .el-input__inner,
  ::v-deep .el-date-editor {
    border-radius: 4px;
    border-color: #dcdfe6;
  }
  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
  .el-button:not(.el-button--primary) {
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
}

.block-section {
  padding: 0 27px 0;
}

::v-deep .el-tabs__header {
  margin: 0 0 12px;
}
::v-deep .el-tabs__item {
  font-size: 14px;
  color: #606266;
  &.is-active {
    color: #157de9;
    font-weight: 500;
  }
}
::v-deep .el-tabs__active-bar {
  background: linear-gradient(90deg, #157de9 0%, #3697fd 100%);
}
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}

.table-box {
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

.tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 18px;
}
.tag-gray {
  background: #f2f2f2;
  color: #666;
}
.tag-success {
  background: #dff6df;
  color: #2aa84a;
}
.tag-danger {
  background: #fde2e2;
  color: #f56c6c;
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

.pagination-wrap {
  padding: 16px 0 20px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
}
</style>
