<template>
  <div class="view-wrap product-page">
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
            <el-option label="树脂盘" value="1" />
            <el-option label="硅橡胶" value="2" />
            <el-option label="其他产品" value="3" />
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
          <el-button type="primary" size="small" @click="handleImport">批量导入</el-button>
          <el-button type="primary" size="small" @click="handleAdd">新增产品</el-button>
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
              <span class="link-name" @click="handleView(row)">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
          <el-table-column prop="categoryName" label="所属分类" min-width="100" show-overflow-tooltip />
          <el-table-column prop="unit" label="单位" min-width="80" show-overflow-tooltip />
          <el-table-column prop="updateTime" label="更新时间" min-width="110" show-overflow-tooltip />
          <el-table-column label="操作" width="140" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleEdit(row)">编辑</span>
                <span class="row-act row-act-danger" @click="handleDelete(row)">删除</span>
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
export default {
  name: 'ProductList',

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
          updateTime: '2025-10-10'
        },
        {
          id: 2,
          code: '4578786955',
          name: '示例产品B',
          spec: '—',
          categoryName: '树脂盘',
          unit: '个',
          updateTime: '2025-10-09'
        },
        {
          id: 3,
          code: '4578786956',
          name: '示例产品C',
          spec: '—',
          categoryName: '硅橡胶',
          unit: '盒',
          updateTime: '2025-10-08'
        }
      ]
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
      // TODO: 调用接口获取产品列表，如 getProductList(this.queryParams)
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
    handleView(row) {
      // TODO: 查看产品详情（弹框或跳转）
      this.$message.info('查看：' + row.name);
    },
    handleEdit(row) {
      // TODO: 编辑产品，如 this.$router.push('/manager/product-edit?id=' + row.id)
      this.$message.info('编辑：' + row.name);
    },
    handleDelete(row) {
      this.$confirm('确定要删除该产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // TODO: 调用删除接口
          this.$message.success('删除成功');
          this.loadList();
        })
        .catch(() => {});
    },
    handleAdd() {
      this.$router.push('/manager/product/add');
    },
    handleImport() {
      // TODO: 批量导入
      this.$message.info('批量导入');
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
.product-page {
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

    &.row-act-danger {
      color: #f56c6c;
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
