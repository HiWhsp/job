<template>
  <div class="view-wrap material-warehouse-management-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="原料名称/原料编码"
            clearable
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item label="原料分类">
          <el-select
            v-model="queryParams.categoryId"
            placeholder="请选择"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="opt in cateOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-title">原料库管理</div>
        <div class="table-acts">
          <el-button size="small" @click="handleExport">导出</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="tableRef"
          :height="tableHeight"
          :data="tableData"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="code" label="原料编码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="name" label="原料名称" min-width="140" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleViewDetail(row)">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
          <el-table-column prop="batchNo" label="批次" min-width="120" show-overflow-tooltip />
          <el-table-column prop="categoryName" label="所属分类" min-width="100" show-overflow-tooltip />
          <el-table-column prop="unit" label="单位" min-width="80" show-overflow-tooltip />
          <el-table-column prop="stockQuantity" label="库存数量" min-width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="warnQuantity" label="库存预警数量" min-width="120" align="center" show-overflow-tooltip />
          <el-table-column label="库存预警" min-width="100" align="center">
            <template slot-scope="{ row }">
              <span :class="row.isWarn ? 'warn-status' : 'normal-status'">
                {{ row.isWarn ? '预警中' : '正常' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleViewDetail(row)">查看详情</span>
                <span class="row-act" @click="handleSetWarn(row)">设置库存预警</span>
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

    <!-- 设置库存预警数量弹框 -->
    <el-dialog
      title="设置库存预警数量"
      :visible.sync="warnDialogVisible"
      width="480px"
      :close-on-click-modal="false"
      @close="handleWarnDialogClose"
    >
      <el-form ref="warnForm" :model="warnForm" label-width="120px">
        <el-form-item label="库存预警数量：">
          <el-input
            v-model="warnForm.warnQuantity"
            placeholder="请输入"
            clearable
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="warnSubmitLoading" @click="handleWarnSubmit">提交</el-button>
        <el-button @click="warnDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const LIST_API = '/getMaterialKuCunList';
const CATE_API = '/getMaterialCateList';
const SET_WARN_API = '/setMaYuJing';

export default {
  name: 'MaterialWarehouseManagementList',

  data() {
    return {
      queryParams: {
        keyword: '',
        categoryId: '',
        pageNum: 1,
        pageSize: 20
      },
      cateOptions: [],
      total: 0,
      tableHeight: 0,
      warnDialogVisible: false,
      currentWarnRow: null,
      warnForm: {
        warnQuantity: ''
      },
      warnSubmitLoading: false,
      tableData: []
    };
  },

  mounted() {
    this.setView();
    this.loadCategoryOptions();
    this.loadList();
  },

  methods: {
    setView() {
      this.$nextTick(() => {
        const refTable = this.$refs.tableRef;
        if (!refTable) return;
        const tableEl = refTable.$el ? refTable.$el : refTable;
        const tableOffsetTop = tableEl.offsetTop + 85;
        const windowHeight = window.innerHeight;
        this.tableHeight = Math.max(windowHeight - tableOffsetTop - 80, 200);
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
    _walkCateTree(list, acc = []) {
      if (!Array.isArray(list)) return acc;
      list.forEach(node => {
        if (!node || node.id == null) return;
        acc.push({
          value: String(node.id),
          label: node.title || String(node.id)
        });
        if (Array.isArray(node.child) && node.child.length) {
          this._walkCateTree(node.child, acc);
        }
      });
      return acc;
    },
    loadCategoryOptions() {
      this.$api({
        url: CATE_API,
        method: 'post',
        data: {}
      })
        .then(res => {
          const data = res && res.data;
          this.cateOptions = this._walkCateTree(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          this.cateOptions = [];
        });
    },
    loadList() {
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        keyword: this.queryParams.keyword || '',
        cateId: this.queryParams.categoryId ? String(this.queryParams.categoryId) : ''
      };
      this.$api({
        url: LIST_API,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list.map(it => {
              const material = it && (it.material || it.product) ? (it.material || it.product) : {};
              const inventory = it && it.inventory ? it.inventory : {};
              const stockQuantity = it.num != null ? it.num : '';
              const warnQuantity = it.yjNum != null ? it.yjNum : '';
              return {
                ...it,
                code: material.materialNo || material.productNo || '',
                name: material.title || '',
                spec: inventory.keyVals || '',
                batchNo: inventory.batchNo || '',
                categoryName: it.cateTitle || '',
                unit: material.unit || '',
                stockQuantity,
                warnQuantity,
                isWarn: Number(it.yjStatus) === 1
              };
            });
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
      this.$refs.queryForm && this.$refs.queryForm.resetFields();
      this.queryParams.keyword = '';
      this.queryParams.categoryId = '';
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleViewDetail(row) {
      this.$router.push({
        path: '/warehouse/material-warehouse-management/detail',
        query: { id: row.id != null ? String(row.id) : '' }
      });
    },
    handleSetWarn(row) {
      this.currentWarnRow = row;
      this.warnForm.warnQuantity = row.warnQuantity != null ? String(row.warnQuantity) : '';
      this.warnDialogVisible = true;
    },
    handleWarnDialogClose() {
      this.currentWarnRow = null;
      this.warnForm.warnQuantity = '';
      this.$refs.warnForm && this.$refs.warnForm.resetFields();
    },
    handleWarnSubmit() {
      if (!this.currentWarnRow || this.currentWarnRow.id == null) {
        this.$message.warning('数据异常');
        return;
      }
      const val = this.warnForm.warnQuantity;
      if (val === '' || val === undefined || val === null) {
        this.$message.warning('请输入库存预警数量');
        return;
      }
      const num = Number(val);
      if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
        this.$message.warning('请输入有效的非负整数');
        return;
      }
      this.warnSubmitLoading = true;
      this.$api({
        url: SET_WARN_API,
        method: 'post',
        data: {
          id: String(this.currentWarnRow.id),
          yjNum: String(num)
        }
      })
        .then(res => {
          this.warnSubmitLoading = false;
          if (res && res.code === 200) {
            this.$message.success('设置成功');
            this.warnDialogVisible = false;
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || '设置失败');
          }
        })
        .catch(() => {
          this.warnSubmitLoading = false;
          this.$message.error('设置失败');
        });
    },
    handleAddIn() {
      // TODO: 新增入库
      this.$message.info('新增入库');
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
.material-warehouse-management-page {
  background: #fff;
  border-radius: 8px;
}

.search-section {
  text-align: left;
  padding: 20px 24px;
  margin-bottom: 20px;
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
  ::v-deep .el-select .el-input__inner {
    border-radius: 4px;
    border-color: #dcdfe6;
  }

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
}

.table-view {
  overflow: hidden;
}

.table-util-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  margin: 0 27px 25px;
  background: #fff;
  border-bottom: 1px solid #edf0f6;

  .table-title {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
  }

  .table-acts {
    display: flex;
    align-items: center;
    gap: 10px;

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

.link-name {
  color: #2373c8;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.normal-status {
  color: #303133;
}

.warn-status {
  color: #f56c6c;
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
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-dialog__footer {
  text-align: center;
}
</style>
