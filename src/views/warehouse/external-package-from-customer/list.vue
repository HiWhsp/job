<template>
  <div class="view-wrap material-warehouse-management-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="产品名称/产品编码" clearable style="width: 260px" />
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
          <el-table-column prop="code" label="原料编码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="name" label="包装名称" min-width="140" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleViewDetail(row)">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="categoryName" label="对应产品" min-width="100" show-overflow-tooltip />
          <el-table-column prop="categoryName" label="客户名称" min-width="100" show-overflow-tooltip />
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
      :before-close="closeEditInDrawer">
      <div class="add-in-drawer">
        <div class="add-in-form-head">
          <el-form label-width="90px" class="add-in-form">
            <el-form-item label="入库时间：">
              <el-date-picker v-model="editInForm.inTime" type="date" placeholder="默认今天" value-format="yyyy-MM-dd"
                style="width: 100%" />
            </el-form-item>
          </el-form>
          <el-button type="primary" class="add-product-btn" @click="addEditInProduct">添加产品</el-button>
        </div>
        <div class="add-in-table-wrap">
          <el-table :data="editInProductList" border header-cell-class-name="table-header-cell">
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="{ $index }">{{ String($index + 1).padStart(3, '0') }}</template>
            </el-table-column>
            <el-table-column label="产品名称" min-width="140">
              <template slot-scope="{ row }">
                <el-input v-if="row.isEditing" v-model="row.productName" placeholder="搜索选择" size="small" />
                <span v-else>{{ row.productName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格" min-width="120">
              <template slot-scope="{ row }">
                <el-input v-if="row.isEditing" v-model="row.spec" placeholder="搜索选择" size="small" />
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
                <el-input v-if="row.isEditing" v-model.number="row.quantity" placeholder="请输入" size="small" />
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
          <el-button type="primary" @click="confirmEditIn">确定</el-button>
          <el-button @click="closeEditInDrawer">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
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
      total: 295,
      tableHeight: 0,
      tableData: [
        {
          id: 1,
          code: '4578786954',
          name: '单层牙齿盘',
          spec: '98,A1,10mm',
          categoryName: '树脂盘',
          unit: '盒',
          stockQuantity: 200,
          warnQuantity: 10,
          isWarn: false
        },
        {
          id: 2,
          code: '4578786955',
          name: '示例产品B',
          spec: '—',
          categoryName: '树脂盘',
          unit: '个',
          stockQuantity: 200,
          warnQuantity: 10,
          isWarn: false
        }
      ],
      editInDrawerVisible: false,
      editInDrawerTitle: '新增入库',
      editInType: 'in',
      editInRecordId: null,
      editInForm: {
        inTime: ''
      },
      editInProductList: []
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
      // TODO: 调用接口获取产品库存列表
      // this.total = res.total;
      // this.tableData = res.list;
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
    },
    confirmEditIn() {
      // TODO: 提交新增入库/出库接口
      this.$message.success('保存成功');
      this.editInDrawerVisible = false;
      this.editInRecordId = null;
      this.editInForm.inTime = '';
      this.editInProductList = [];
      this.loadList();
    },
    addEditInProduct() {
      this.editInProductList.push({
        productName: '',
        spec: '',
        unit: '盒',
        quantity: '',
        isEditing: true
      });
    },
    saveEditInProduct(index) {
      const row = this.editInProductList[index];
      if (!row.productName || row.quantity === '' || row.quantity === undefined) {
        this.$message.warning('请填写产品名称和数量');
        return;
      }
      this.$set(row, 'isEditing', false);
    },
    editEditInProduct(index) {
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
</style>
