<template>
  <div class="view-wrap customer-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词">
            <el-input
              v-model="queryParams.keyword"
              placeholder="产品名称/编码"
              clearable
              style="width: 260px"
            />
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
        <div class="table-title">外购产品管理</div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleImport">批量导入</el-button>
          <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
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
          <el-table-column
            prop="productNo"
            label="产品编码"
            min-width="140"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="title"
            label="产品名称"
            min-width="140"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleView(row)">{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="keyVals"
            label="规格"
            min-width="140"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="unit"
            label="单位"
            min-width="80"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="updated_at"
            label="更新时间"
            min-width="160"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column label="操作" width="160" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleEdit(row)">编辑</span>
                <span class="row-act" @click="handleDelete(row)">删除</span>
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

    <!-- 查看详情：外购产品专用，拉取 getForeignProduct -->
    <external-product-detail-drawer
      :visible.sync="detailDrawerVisible"
      :product-id="detailProductId"
      :row-summary="detailRowSummary"
    />

    <!-- 删除确认弹框 -->
    <delete-dialog
      :visible.sync="deleteDialogVisible"
      main-text="确定要删除这个外购产品吗？"
      tip-text="删除后将无法恢复"
      @confirm="handleDeleteConfirm"
    />

    <import-modal ref="importModal" @confirm="handleImportConfirm" />
  </div>
</template>
    
<script>
import ExternalProductDetailDrawer from "./components/external-product-detail-drawer.vue";
import DeleteDialog from "../components/delete-dialog.vue";
import ImportModal from "@/components/upload/import_file_modal.vue";

export default {
  name: "ExternalProductList",

  components: {
    ExternalProductDetailDrawer,
    DeleteDialog,
    ImportModal
  },
  data() {
    return {
      queryParams: {
        keyword: "",
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      detailDrawerVisible: false,
      detailProductId: null,
      detailRowSummary: null,
      deleteDialogVisible: false,
      rowToDelete: null
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
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        keyword: this.queryParams.keyword || ""
      };
      this.$api({
        url: "/getForeignProductList",
        method: "post",
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
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.$refs['queryForm'].resetFields();
      this.queryParams.keyword = "";
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleView(row) {
      this.detailProductId = row && row.id != null ? row.id : null;
      this.detailRowSummary = row || null;
      this.detailDrawerVisible = true;
    },
    handleEdit(row) {
      const id = row && row.id != null ? String(row.id) : "";
      if (!id) return;
      this.$router.push(`/manager/external-product/add?id=${id}`);
    },
    handleDelete(row) {
      this.rowToDelete = row;
      this.deleteDialogVisible = true;
    },
    handleDeleteConfirm() {
      if (!this.rowToDelete) return;
      const id = this.rowToDelete && this.rowToDelete.id != null ? String(this.rowToDelete.id) : "";
      if (!id) return;
      this.$api({
        url: "/delForeignProduct",
        method: "post",
        data: { id }
      })
        .then(() => {
          this.$message.success("删除成功");
          this.rowToDelete = null;
          this.loadList();
        })
        .catch((err) => {
          this.$message.error(err && err.msg ? err.msg : "删除失败");
        });
    },
    handleAdd() {
      this.$router.push("/manager/external-product/add");
    },
    handleImport() {
      this.$refs.importModal.init("外购产品导入", "/importForeignProduct");
    },
    handleImportConfirm() {
      this.loadList();
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
    