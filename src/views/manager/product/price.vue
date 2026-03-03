<template>
  <div class="view-wrap customer-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词">
            <el-input
              v-model="queryParams.keyword"
              placeholder="产品编码/产品名称"
              clearable
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item label="产品分类">
            <el-select
              v-model="queryParams.category"
              placeholder="请选择"
              clearable
              style="width: 140px"
            >
              <el-option label="树脂盘" value="树脂盘" />
              <el-option label="其他分类" value="其他" />
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
        <div class="table-title">产品指导价格</div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleImport">导出产品模板</el-button>
          <el-button type="primary" size="small" @click="handleExport">导入价格</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="tableH"
          :height="tableHeight"
          :data="tableData"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="productCode" label="产品编码" min-width="120" show-overflow-tooltip align="center" />
          <el-table-column prop="productName" label="产品名称" min-width="140" show-overflow-tooltip align="center">
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleViewProduct(row)">{{ row.productName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip align="center" />
          <el-table-column prop="category" label="所属分类" min-width="100" show-overflow-tooltip align="center" />
          <el-table-column prop="unit" label="单位" min-width="70" show-overflow-tooltip align="center" />
          <el-table-column prop="dealerPrice" label="经销商指导价格" min-width="130" align="center">
            <template slot-scope="{ row }">
              {{ row.dealerPrice != null && row.dealerPrice !== '' ? row.dealerPrice : '—' }}
            </template>
          </el-table-column>
          <el-table-column prop="terminalPrice" label="终端指导价格" min-width="130" align="center">
            <template slot-scope="{ row }">
              {{ row.terminalPrice != null && row.terminalPrice !== '' ? row.terminalPrice : '—' }}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="110" show-overflow-tooltip align="center" />
          <el-table-column label="操作" width="340" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleEditAllSpec(row)">编辑所有规格价格</span>
                <span class="row-act" @click="handleEditCurrentSpec(row)">编辑当前规格价格</span>
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

    <!-- 查看详情 Drawer（从右往左展开） -->
    <detail-drawer :visible.sync="detailDrawerVisible" :detail-row="detailRow" />

    <!-- 编辑规格价格弹框 -->
    <edit-price-dialog
      :visible.sync="editPriceVisible"
      :product-row="editPriceProductRow"
      :current-spec-only="editPriceCurrentSpecOnly"
      @submit="handleEditPriceSubmit"
    />
  </div>
</template>
  
  <script>
import DetailDrawer from "../components/detail-drawer.vue";
import EditPriceDialog from "../components/edit-price-dialog.vue";

export default {
  name: "ProductPrice",

  components: {
    DetailDrawer,
    EditPriceDialog
  },
  data() {
    return {
      queryParams: {
        keyword: "",
        category: "",
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [
        {
          id: 1,
          productCode: "4578786954",
          productName: "单层牙齿盘",
          spec: "98,A1,10mm",
          category: "树脂盘",
          unit: "盒",
          dealerPrice: null,
          terminalPrice: null,
          updateTime: "2025-10-10"
        },
        {
          id: 2,
          productCode: "4578786954",
          productName: "单层牙齿盘",
          spec: "98,A1,10mm",
          category: "树脂盘",
          unit: "盒",
          dealerPrice: "60.00",
          terminalPrice: "60.00",
          updateTime: "2025-10-10"
        }
      ],
      detailDrawerVisible: false,
      detailRow: null,
      editPriceVisible: false,
      editPriceProductRow: null,
      editPriceCurrentSpecOnly: false
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
        window.onresize = function() {
          const top = tableEl.offsetTop + 84 + 80;
          that.tableHeight = Math.max(window.innerHeight - top, 200);
        };
      });
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    loadList() {
      // TODO: 调用接口获取列表
      this.total = this.tableData.length;
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
    handleViewProduct(row) {
      this.detailRow = row;
      this.detailDrawerVisible = true;
    },
    handleEditAllSpec(row) {
      this.editPriceProductRow = row;
      this.editPriceCurrentSpecOnly = false;
      this.editPriceVisible = true;
    },
    handleEditCurrentSpec(row) {
      this.editPriceProductRow = row;
      this.editPriceCurrentSpecOnly = true;
      this.editPriceVisible = true;
    },
    handleEditPriceSubmit(specList) {
      // TODO: 调用接口保存 specList 中的价格
      this.loadList();
    },
    handleImport() {
      // TODO: 导出产品模板
      this.$message.info("导出产品模板");
    },
    handleExport() {
      // TODO: 导入价格
      this.$message.info("导入价格");
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
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
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

    .el-button {
      background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
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

    & + .row-act::before {
      content: "";
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
  