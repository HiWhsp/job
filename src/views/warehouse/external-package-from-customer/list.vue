<template>
  <div class="view-wrap material-warehouse-management-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="包装编码/包装名称/客户" clearable style="width: 260px" />
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
        <div class="table-title">客户外来包装</div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleAddIn">新增入库</el-button>
          <el-button type="primary" size="small" @click="handleAddOut">新增出库</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table ref="tableRef" :height="tableHeight" :data="tableData" header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName">
          <el-table-column prop="code" label="包装编码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="name" label="包装名称" min-width="140" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleViewDetail(row)">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productTitle" label="对应产品" min-width="120" show-overflow-tooltip />
          <el-table-column prop="customerName" label="客户名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="unit" label="单位" min-width="80" show-overflow-tooltip />
          <el-table-column prop="stockQuantity" label="库存数量" min-width="100" align="center" show-overflow-tooltip />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleViewDetail(row)">查看详情</span>
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

    <el-drawer :title="editInDrawerTitle" :visible.sync="editInDrawerVisible" direction="rtl" size="800px"
      append-to-body :close-on-click-modal="false" :before-close="closeEditInDrawer">
      <div class="add-in-drawer">
        <div class="add-in-form-head">
          <el-form label-width="90px" class="add-in-form">
            <el-form-item :label="editInType === 'in' ? '入库时间：' : '出库时间：'">
              <el-date-picker v-model="editInForm.inTime" type="date" placeholder="默认今天" value-format="yyyy-MM-dd"
                style="width: 100%" />
            </el-form-item>
          </el-form>
          <el-button type="primary" class="add-product-btn" @click="openAddPackDialog">添加包装</el-button>
        </div>
        <div class="add-in-table-wrap">
          <el-table :data="editInProductList" border header-cell-class-name="table-header-cell">
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="{ $index }">{{ String($index + 1).padStart(3, '0') }}</template>
            </el-table-column>
            <el-table-column prop="packNo" label="包装编码" min-width="120" show-overflow-tooltip />
            <el-table-column prop="packName" label="包装名称" min-width="130" show-overflow-tooltip />
            <el-table-column prop="productTitle" label="对应产品" min-width="100" show-overflow-tooltip />
            <el-table-column prop="customerTitle" label="客户名称" min-width="100" show-overflow-tooltip />
            <el-table-column prop="unit" label="单位" width="70" align="center" />
            <el-table-column :label="editInType === 'in' ? '本次入库数量' : '本次出库数量'" width="130" align="center">
              <template slot-scope="{ row }">
                <el-input v-if="row.isEditing" v-model="row.quantity" placeholder="请输入" size="small" />
                <span v-else>{{ row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" align="center" fixed="right">
              <template slot-scope="{ row, $index }">
                <span class="row-acts">
                  <template v-if="row.isEditing">
                    <span class="row-act" @click="saveEditInProduct($index)">保存</span>
                  </template>
                  <template v-else>
                    <span class="row-act" @click="editEditInProduct($index)">编辑</span>
                    <span class="row-act" @click="deleteEditInProduct($index)">删除</span>
                  </template>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="in-detail-footer">
          <el-button type="primary" :loading="changeSubmitLoading" @click="confirmEditIn">确定</el-button>
          <el-button @click="closeEditInDrawer">取消</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 添加包装：与库存等「添加产品」弹框一致 -->
    <el-dialog title="添加包装" :visible.sync="addPackDialogVisible" width="820px" custom-class="add-pack-dialog"
      :close-on-click-modal="false" append-to-body @close="closeAddPackDialog">
      <div class="dialog-search">
        <el-form :model="addPackQuery" ref="addPackQueryForm" inline label-width="80px">
          <el-form-item label="关键词" prop="keyword">
            <el-input v-model="addPackQuery.keyword" placeholder="包装名称/包装编码" clearable style="width: 220px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchAddPack">搜索</el-button>
            <el-button @click="resetAddPackQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-table-wrap">
        <el-table ref="addPackTable" :data="addPackList" max-height="380" header-cell-class-name="table-header-cell"
          @selection-change="handleAddPackSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="packNo" label="包装编码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="title" label="包装名称" min-width="130" show-overflow-tooltip />
          <el-table-column prop="productTitle" label="对应产品" min-width="120" show-overflow-tooltip />
          <el-table-column prop="customerTitle" label="客户名称" min-width="120" show-overflow-tooltip />
          <el-table-column :label="editInType === 'in' ? '本次入库数量' : '本次出库数量'" width="130" align="center">
            <template slot-scope="{ row }">
              <el-input v-model="row.quantity" placeholder="请输入" size="small" style="width: 90px" />
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="70" align="center" />
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPackDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddPack">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const LIST_API = '/getForeignPackKuCunList';
const CHANGE_API = '/changeForeignPackKuCun';
const PACK_LIST_API = '/getForeignPackList';

export default {
  name: 'ExternalPackageFromCustomerList',

  data() {
    return {
      queryParams: {
        keyword: '',
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      editInDrawerVisible: false,
      editInDrawerTitle: '新增入库',
      editInType: 'in',
      editInRecordId: null,
      editInForm: {
        inTime: ''
      },
      editInProductList: [],
      editInRowId: 0,
      changeSubmitLoading: false,
      addPackDialogVisible: false,
      addPackQuery: {
        keyword: '',
        pageNum: 1,
        pageSize: 50
      },
      addPackList: [],
      addPackSelected: []
    };
  },

  mounted() {
    this.setView();
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
    loadList() {
      this.$api({
        url: LIST_API,
        method: 'post',
        data: {
          page: String(this.queryParams.pageNum),
          limit: String(this.queryParams.pageSize),
          keyword: this.queryParams.keyword || ''
        }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list.map(it => {
              const fp = it.foreign_pack || {};
              const pt = it.productTitle;
              return {
                id: it.id,
                foreignPackId: it.foreignPackId,
                code: fp.packNo || '',
                name: fp.title || '',
                productTitle: pt != null && pt !== '' ? String(pt) : '—',
                customerName: it.customerTitle || '—',
                unit: fp.unit || '',
                stockQuantity: it.num != null ? String(it.num) : '0'
              };
            });
            this.total = res.data.count != null ? res.data.count : list.length;
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
      this.queryParams.keyword = '';
      this.queryParams.pageNum = 1;
      this.$refs.queryForm && this.$refs.queryForm.resetFields();
      this.loadList();
    },
    handleViewDetail(row) {
      this.$router.push({
        path: '/warehouse/external-package-from-customer/detail',
        query: { id: row.id }
      });
    },
    handleAddIn() {
      this.openEditInDrawer('in', '新增入库');
    },
    handleAddOut() {
      this.openEditInDrawer('out', '新增出库');
    },
    openEditInDrawer(type, title) {
      this.editInType = type;
      this.editInDrawerTitle = title;
      this.editInRecordId = null;
      this.editInRowId = 0;
      this.editInForm.inTime = this.getTodayStr();
      this.editInProductList = [];
      this.editInDrawerVisible = true;
    },
    getTodayStr() {
      const d = new Date();
      return (
        d.getFullYear() +
        '-' +
        String(d.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(d.getDate()).padStart(2, '0')
      );
    },
    closeEditInDrawer(done) {
      if (typeof done === 'function') {
        done();
      } else {
        this.editInDrawerVisible = false;
      }
      this.editInRecordId = null;
      this.editInForm.inTime = '';
      this.editInProductList = [];
      this.editInRowId = 0;
      this.changeSubmitLoading = false;
    },
    confirmEditIn() {
      if (!this.editInProductList.length) {
        this.$message.warning('请添加包装');
        return;
      }
      if (this.editInProductList.some(r => r.isEditing)) {
        this.$message.warning('请先保存正在编辑的行');
        return;
      }
      const productJson = [];
      for (let i = 0; i < this.editInProductList.length; i++) {
        const r = this.editInProductList[i];
        const q = String(r.quantity != null ? r.quantity : '').trim();
        const num = Number(q);
        if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
          this.$message.warning('请为每行填写有效的正整数数量');
          return;
        }
        if (!r.foreignPackId) {
          this.$message.warning('缺少包装 id');
          return;
        }
        productJson.push({
          foreignPackId: String(r.foreignPackId),
          num
        });
      }
      this.changeSubmitLoading = true;
      this.$api({
        url: CHANGE_API,
        method: 'post',
        data: {
          type: this.editInType === 'in' ? '1' : '2',
          productJson: JSON.stringify(productJson)
        }
      })
        .then(res => {
          this.changeSubmitLoading = false;
          if (res && res.code === 200) {
            this.$message.success('提交成功');
            this.editInDrawerVisible = false;
            this.editInRecordId = null;
            this.editInForm.inTime = '';
            this.editInProductList = [];
            this.editInRowId = 0;
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || '提交失败');
          }
        })
        .catch(() => {
          this.changeSubmitLoading = false;
          this.$message.error('提交失败');
        });
    },
    openAddPackDialog() {
      this.addPackDialogVisible = true;
      this.$nextTick(() => {
        this.searchAddPack();
      });
    },
    closeAddPackDialog() {
      this.addPackQuery.keyword = '';
      this.addPackQuery.pageNum = 1;
      this.addPackSelected = [];
      this.$nextTick(() => {
        this.$refs.addPackTable && this.$refs.addPackTable.clearSelection();
      });
    },
    searchAddPack() {
      this.$api({
        url: PACK_LIST_API,
        method: 'post',
        data: {
          page: String(this.addPackQuery.pageNum),
          limit: String(this.addPackQuery.pageSize),
          keyword: this.addPackQuery.keyword || ''
        }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.addPackList = list.map(it => ({
              id: it.id != null ? String(it.id) : '',
              packNo: it.packNo || '',
              title: it.title || '',
              productTitle: it.productTitle || '',
              customerTitle: it.customerTitle || '',
              unit: it.unit || '',
              quantity: ''
            }));
          } else {
            this.addPackList = [];
          }
        })
        .catch(() => {
          this.addPackList = [];
        });
    },
    resetAddPackQuery() {
      this.$refs.addPackQueryForm && this.$refs.addPackQueryForm.resetFields();
      this.addPackQuery.pageNum = 1;
      this.searchAddPack();
    },
    handleAddPackSelectionChange(selection) {
      this.addPackSelected = selection || [];
    },
    confirmAddPack() {
      const sel = this.addPackSelected || [];
      if (!sel.length) {
        this.$message.warning('请先勾选要添加的包装');
        return;
      }
      for (let i = 0; i < sel.length; i++) {
        const p = sel[i];
        const q = String(p.quantity || '').trim();
        if (!q) {
          this.$message.warning('请为勾选的包装填写数量');
          return;
        }
        const num = Number(q);
        if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
          this.$message.warning('数量须为正整数');
          return;
        }
        if (!p.id) {
          this.$message.warning('包装数据缺少 id');
          return;
        }
      }
      sel.forEach(p => {
        const num = Number(String(p.quantity).trim());
        const existing = this.editInProductList.find(r => String(r.foreignPackId) === String(p.id));
        if (existing) {
          existing.quantity = String((Number(existing.quantity) || 0) + num);
        } else {
          this.editInRowId += 1;
          this.editInProductList.push({
            _key: this.editInRowId,
            foreignPackId: p.id,
            packNo: p.packNo,
            packName: p.title,
            productTitle: p.productTitle || '—',
            customerTitle: p.customerTitle || '—',
            unit: p.unit || '',
            quantity: String(num),
            isEditing: false
          });
        }
      });
      this.addPackDialogVisible = false;
      this.$message.success('添加成功');
    },
    saveEditInProduct(index) {
      const row = this.editInProductList[index];
      const q = String(row.quantity != null ? row.quantity : '').trim();
      if (!q) {
        this.$message.warning('请输入数量');
        return;
      }
      const num = Number(q);
      if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
        this.$message.warning('数量须为正整数');
        return;
      }
      row.quantity = String(num);
      this.$set(row, 'isEditing', false);
    },
    editEditInProduct(index) {
      const hasEditing = this.editInProductList.some(r => r.isEditing);
      if (hasEditing) {
        this.$message.warning('请先保存当前编辑行');
        return;
      }
      this.$set(this.editInProductList[index], 'isEditing', true);
    },
    deleteEditInProduct(index) {
      this.editInProductList.splice(index, 1);
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

    .el-table__body tr:hover>td {
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
}

::v-deep .el-dialog__footer {
  text-align: center;
}

::v-deep .el-drawer__header {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    color: #333;
    font-weight: bold;
    text-align: left;
    padding-left: 30px;
    border-bottom: 1px solid #EEEEEE;
    padding: 0 16px;
}

/* 编辑入库/新增入库抽屉 */
.add-in-drawer {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 4px;
}

.add-in-form-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 0 20px 0 0;

    .add-in-form {
        flex: 1;

        ::v-deep .el-form-item {
            margin-bottom: 0;
        }

        ::v-deep .el-form-item__label {
            color: #333;
        }
    }

    .add-product-btn {
        flex-shrink: 0;
        margin-left: 16px;
    }
}

.add-in-table-wrap {
    flex: 1;
    overflow: auto;
    padding: 0 0 16px;

    ::v-deep .el-table {
        font-size: 14px;

        .table-header-cell {
            background: #f5f7fa;
            color: #303133;
            font-weight: 500;
        }
    }
}

.in-detail-footer {
  margin-top: 16px;
  padding: 16px 20px 0;
  text-align: right;
  border-top: 1px solid #edf0f6;

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
}

.dialog-search {
  margin-bottom: 12px;
}

.dialog-table-wrap {
  margin-bottom: 8px;
}
</style>
