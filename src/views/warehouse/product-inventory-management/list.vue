<template>
  <div class="view-wrap product-inventory-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="产品名称/产品编码"
            clearable
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item label="产品分类">
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
        <div class="table-title">产品管理</div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleAddIn">新增入库</el-button>
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
          <el-table-column prop="code" label="产品编码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="name" label="产品名称" min-width="140" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleViewDetail(row)">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
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
          <el-table-column label="操作" width="180" align="left">
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

    <!-- 新增入库：从右向左抽屉 -->
    <el-drawer
      title="新增入库"
      :visible.sync="addInDrawerVisible"
      direction="rtl"
      size="800px"
      :append-to-body="true"
      :close-on-click-modal="false"
      @closed="onAddInDrawerClosed"
      custom-class="add-in-stock-drawer"
    >
      <div class="add-in-drawer-body">
        <div class="add-in-form-head">
          <el-form label-width="90px" class="add-in-form">
            <el-form-item label="入库时间：">
              <el-date-picker
                v-model="addInForm.inTime"
                type="date"
                placeholder="默认今天"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              />
            </el-form-item>
          </el-form>
          <el-button type="primary" class="add-product-btn" @click="openAddProductDialog">添加产品</el-button>
        </div>
        <div class="add-in-table-wrap">
          <el-table
            :data="addInRows"
            border
            header-cell-class-name="table-header-cell"
            :row-class-name="tableRowClassName"
          >
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="{ $index }">{{ String($index + 1).padStart(3, '0') }}</template>
            </el-table-column>
            <el-table-column label="产品名称" min-width="140">
              <template slot-scope="{ row }">
                <el-input
                  v-if="row.isEditing"
                  v-model="row.productName"
                  placeholder="搜索选择"
                  size="small"
                  style="width: 100%"
                />
                <span v-else>{{ row.productName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格" min-width="120">
              <template slot-scope="{ row }">
                <el-input
                  v-if="row.isEditing"
                  v-model="row.spec"
                  placeholder="搜索选择"
                  size="small"
                  style="width: 100%"
                />
                <span v-else>{{ row.spec }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单位" width="80" align="center">
              <template slot-scope="{ row }">
                <el-input v-if="row.isEditing" v-model="row.unit" size="small" placeholder="单位" />
                <span v-else>{{ row.unit }}</span>
              </template>
            </el-table-column>
            <el-table-column label="本次入库数量" width="120" align="center">
              <template slot-scope="{ row }">
                <el-input
                  v-if="row.isEditing"
                  v-model="row.quantity"
                  placeholder="请输入"
                  size="small"
                  style="width: 100%"
                />
                <span v-else>{{ row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" align="center" fixed="right">
              <template slot-scope="{ row, $index }">
                <span class="row-acts">
                  <template v-if="row.isEditing">
                    <span class="row-act" @click="saveAddInRow($index)">保存</span>
                  </template>
                  <template v-else>
                    <span class="row-act" @click="editAddInRow($index)">编辑</span>
                    <span class="row-act" @click="removeAddInRow($index)">删除</span>
                  </template>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="add-in-drawer-footer">
          <el-button type="primary" @click="submitAddIn">确定</el-button>
          <el-button @click="addInDrawerVisible = false">取消</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 添加产品弹框（与设备采购等产品选择一致） -->
    <el-dialog
      title="添加产品"
      :visible.sync="addProductDialogVisible"
      width="820px"
      custom-class="add-product-dialog"
      :close-on-click-modal="false"
      append-to-body
      @close="closeAddProductDialog"
    >
      <div class="dialog-search">
        <el-form :model="addProductQuery" ref="addProductQueryForm" inline label-width="80px">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="addProductQuery.keyword"
              placeholder="产品名称/产品编码"
              clearable
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchAddProduct">搜索</el-button>
            <el-button @click="resetAddProductQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-table-wrap">
        <el-table
          ref="addProductTable"
          :data="addProductList"
          max-height="380"
          header-cell-class-name="table-header-cell"
          @selection-change="handleAddProductSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="productNo" label="产品编码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="title" label="产品名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格" min-width="140" show-overflow-tooltip />
          <el-table-column prop="cateTitle" label="所属分类" min-width="120" show-overflow-tooltip />
          <el-table-column label="本次入库数量" width="120" align="center">
            <template slot-scope="{ row }">
              <el-input v-model="row.quantity" placeholder="请输入" size="small" style="width: 90px" />
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="80" align="center" />
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addProductDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddProduct">确定</el-button>
      </span>
    </el-dialog>

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
        <el-button type="primary" @click="handleWarnSubmit">提交</el-button>
        <el-button @click="warnDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const LIST_API = '/getProductKuCunList';
const CATE_API = '/getProductCateList';
const SET_WARN_API = '/setPrYuJing';
const ADD_IN_API = '/addProductKuCunRu';
const PRODUCT_LIST_API = '/getProductInventoryList';

export default {
  name: 'ProductInventoryList',

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
      tableData: [],
      // 新增入库抽屉
      addInDrawerVisible: false,
      addInForm: {
        inTime: ''
      },
      addInRows: [],
      addInRowId: 0,
      // 添加产品弹框
      addProductDialogVisible: false,
      addProductQuery: {
        keyword: '',
        pageNum: 1,
        pageSize: 50
      },
      addProductList: [],
      addProductSelected: []
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
              const product = it && it.product ? it.product : {};
              const inventory = it && it.inventory ? it.inventory : {};
              const stockQuantity = Number(it && it.num != null ? it.num : 0);
              const warnQuantity = Number(it && it.yjNum != null ? it.yjNum : 0);
              return {
                ...it,
                code: product.productNo || '',
                name: product.title || '',
                spec: inventory.keyVals || inventory.sn || '',
                categoryName: it.cateTitle || '',
                unit: product.unit || '',
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
      this.$refs.queryForm.resetFields();
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleViewDetail(row) {
      this.$router.push({
        path: '/warehouse/product-inventory-management/detail',
        query: { id: row.id }
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
      const id = this.currentWarnRow && this.currentWarnRow.id != null ? String(this.currentWarnRow.id) : '';
      if (!id) {
        this.$message.warning('缺少库存记录id');
        return;
      }
      this.$api({
        url: SET_WARN_API,
        method: 'post',
        data: {
          id,
          yjNum: String(num)
        }
      })
        .then(res => {
          if (res && res.code === 200) {
            this.$message.success('设置成功');
            this.warnDialogVisible = false;
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || '设置失败');
          }
        })
        .catch(() => {
          this.$message.error('设置失败');
        });
    },
    getTodayStr() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    },
    handleAddIn() {
      this.addInForm.inTime = this.getTodayStr();
      this.addInRows = [];
      this.addInDrawerVisible = true;
    },
    onAddInDrawerClosed() {
      this.addInRows = [];
      this.addInForm.inTime = '';
    },
    openAddProductDialog() {
      this.addProductDialogVisible = true;
      this.$nextTick(() => {
        this.searchAddProduct();
      });
    },
    closeAddProductDialog() {
      this.addProductQuery.keyword = '';
      this.addProductQuery.pageNum = 1;
      this.addProductSelected = [];
      this.$nextTick(() => {
        this.$refs.addProductTable && this.$refs.addProductTable.clearSelection();
      });
    },
    searchAddProduct() {
      const params = {
        limit: String(this.addProductQuery.pageSize),
        page: String(this.addProductQuery.pageNum),
        keyword: this.addProductQuery.keyword || '',
        cateId: ''
      };
      this.$api({
        url: PRODUCT_LIST_API,
        method: 'post',
        data: params
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.addProductList = list.map(it => ({
              id: it.productId != null ? String(it.productId) : '',
              title: it.title || '',
              productNo: it.productNo || '',
              spec: it.keyVals || '',
              unit: it.unit || '',
              cateTitle: it.cateTitle || '',
              inventoryId: it.id != null ? String(it.id) : '',
              quantity: ''
            }));
          } else {
            this.addProductList = [];
          }
        })
        .catch(() => {
          this.addProductList = [];
        });
    },
    resetAddProductQuery() {
      this.$refs.addProductQueryForm && this.$refs.addProductQueryForm.resetFields();
      this.addProductQuery.pageNum = 1;
      this.searchAddProduct();
    },
    handleAddProductSelectionChange(selection) {
      this.addProductSelected = selection || [];
    },
    confirmAddProduct() {
      const sel = this.addProductSelected || [];
      if (!sel.length) {
        this.$message.warning('请先勾选要添加的产品');
        return;
      }
      for (let i = 0; i < sel.length; i++) {
        const p = sel[i];
        const q = String(p.quantity || '').trim();
        if (!q) {
          this.$message.warning('请为勾选的产品填写本次入库数量');
          return;
        }
        const num = Number(q);
        if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
          this.$message.warning('入库数量须为正整数');
          return;
        }
        if (!p.inventoryId) {
          this.$message.warning('所选产品缺少规格/库存记录，请确认产品已维护规格');
          return;
        }
      }
      sel.forEach(p => {
        const num = Number(String(p.quantity).trim());
        const existing = this.addInRows.find(
          r => r.productId === p.id && r.inventoryId === p.inventoryId
        );
        if (existing) {
          existing.quantity = String((Number(existing.quantity) || 0) + num);
        } else {
          this.addInRowId += 1;
          this.addInRows.push({
            _key: this.addInRowId,
            productName: p.title,
            spec: p.spec,
            unit: p.unit || '',
            quantity: String(num),
            productId: p.id,
            inventoryId: p.inventoryId,
            isEditing: false
          });
        }
      });
      this.addProductDialogVisible = false;
      this.$message.success('添加成功');
    },
    editAddInRow(index) {
      const hasEditing = this.addInRows.some(r => r.isEditing);
      if (hasEditing) {
        this.$message.warning('请先保存当前编辑行');
        return;
      }
      this.addInRows[index].isEditing = true;
    },
    saveAddInRow(index) {
      const row = this.addInRows[index];
      const q = String(row.quantity || '').trim();
      if (!q) {
        this.$message.warning('请输入本次入库数量');
        return;
      }
      const num = Number(q);
      if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
        this.$message.warning('入库数量须为正整数');
        return;
      }
      row.quantity = String(num);
      row.isEditing = false;
    },
    removeAddInRow(index) {
      this.addInRows.splice(index, 1);
    },
    submitAddIn() {
      if (!this.addInRows.length) {
        this.$message.warning('请添加产品');
        return;
      }
      if (this.addInRows.some(r => r.isEditing)) {
        this.$message.warning('请先保存正在编辑的行');
        return;
      }
      const kuInfos = [];
      for (let i = 0; i < this.addInRows.length; i++) {
        const r = this.addInRows[i];
        const q = String(r.quantity || '').trim();
        const num = Number(q);
        if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
          this.$message.warning('请为每行填写有效的正整数入库数量');
          return;
        }
        if (!r.inventoryId || !r.productId) {
          this.$message.warning('明细缺少产品或规格信息');
          return;
        }
        kuInfos.push({
          id: String(r.inventoryId),
          productId: String(r.productId),
          num: String(num)
        });
      }
      this.$api({
        url: ADD_IN_API,
        method: 'post',
        data: {
          kuInfos: JSON.stringify(kuInfos)
        }
      })
        .then(res => {
          if (res && res.code === 200) {
            this.$message.success('入库成功');
            this.addInDrawerVisible = false;
            this.addInRows = [];
            this.addInForm.inTime = '';
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || '入库失败');
          }
        })
        .catch(() => {
          this.$message.error('入库失败');
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
.product-inventory-page {
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

.add-in-drawer-body {
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px);
}

.add-in-form-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;

  .add-in-form {
    flex: 1;
    margin-bottom: 0;
  }

  .add-product-btn {
    flex-shrink: 0;
    margin-top: 4px;
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
}

.add-in-table-wrap {
  flex: 1;
  overflow: auto;
}

.add-in-drawer-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #edf0f6;
  text-align: right;

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
}

::v-deep .add-in-stock-drawer {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 20px 20px 10px;
    font-weight: bold;
    font-size: 16px;
  }

  .el-drawer__body {
    padding-top: 0;
  }
}

.dialog-search {
  margin-bottom: 12px;
}
</style>
