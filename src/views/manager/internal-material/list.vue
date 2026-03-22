<template>
  <div class="view-wrap customer-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词">
            <el-input v-model="queryParams.keyword" placeholder="原料编码/原料名称" clearable style="width: 260px" />
          </el-form-item>
          <el-form-item label="原料分类">
            <el-cascader ref="cascaderRef" v-model="queryParams.categoryIds" :options="internalMaterialCateCascaderOptions"
              :props="{
                value: 'value',
                label: 'label',
                children: 'children',
                checkStrictly: true
              }" placeholder="请选择原料分类" clearable style="width: 260px" show-all-levels
              @visible-change="onCascaderVisibleChange" />
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
        <div class="table-title">原料管理</div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleImport">批量导入</el-button>
          <el-button type="primary" size="small" @click="handleAdd">新增原料</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table ref="tableH" :height="tableHeight" :data="tableData" header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName">
          <el-table-column prop="materialNo" label="原料编码" min-width="120" show-overflow-tooltip align="center" />
          <el-table-column prop="title" label="原料名称" min-width="120" show-overflow-tooltip align="center">
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleView(row)">{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="规格" min-width="100" show-overflow-tooltip align="center" />
          <el-table-column prop="storageConditions" label="储存条件" min-width="100" show-overflow-tooltip
            align="center" />
          <el-table-column prop="batchNo" label="批次" min-width="110" show-overflow-tooltip align="center" />
          <el-table-column prop="unit" label="单位" min-width="70" show-overflow-tooltip align="center" />
          <el-table-column prop="cateTitle" label="所属管理类别" min-width="120" show-overflow-tooltip
            align="center" />
          <el-table-column prop="productCateTitle" label="用于产品分类" min-width="160" show-overflow-tooltip
            align="center" />
          <el-table-column prop="updated_at" label="更新时间" min-width="110" show-overflow-tooltip align="center" />
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
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryParams.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="queryParams.pageSize"
            layout="total, prev, pager, next, jumper" :total="total" />
        </div>
      </div>
    </div>

    <!-- 查看详情：原料专用抽屉，拉取 getMaterialInfo 展示富文本与规格库存 -->
    <material-detail-drawer
      :visible.sync="detailDrawerVisible"
      :material-id="detailMaterialId"
      :row-summary="detailRowSummary"
    />

    <!-- 删除确认弹框 -->
    <delete-dialog
      :visible.sync="deleteDialogVisible"
      main-text="确定要删除这个原料吗？"
      tip-text="删除后将无法恢复"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import MaterialDetailDrawer from "./components/material-detail-drawer.vue";
import DeleteDialog from "../components/delete-dialog.vue";

export default {
  name: "InternalMaterialList",

  components: {
    MaterialDetailDrawer,
    DeleteDialog
  },
  data() {
    return {
      queryParams: {
        keyword: "",
        categoryIds: [], // 原料分类级联选中的路径，接口需要时取最后一级 id
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      detailDrawerVisible: false,
      detailMaterialId: null,
      detailRowSummary: null,
      deleteDialogVisible: false,
      rowToDelete: null
    };
  },
  computed: {
    ...mapState(["vuex_internal_material_cate_list"]),
    /** 将 Vuex 原料分类树转为 Cascader 所需格式 { value, label, children } */
    internalMaterialCateCascaderOptions() {
      const list = this.vuex_internal_material_cate_list || [];
      const mapTree = (nodes) => {
        if (!Array.isArray(nodes)) return [];
        return nodes.map((node) => {
          const item = {
            value: node.id,
            label: node.title || ""
          };
          const children = node.child;
          if (Array.isArray(children) && children.length) {
            item.children = mapTree(children);
          }
          return item;
        });
      };
      return mapTree(list);
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
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    loadList() {
      const ids = this.queryParams.categoryIds || [];
      const cateld = ids.length ? String(ids[ids.length - 1]) : "";
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        keyword: this.queryParams.keyword || "",
        cateld
      };
      this.$api({
        url: "/getMaterialList",
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
      this.queryParams.categoryIds = [];
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    /** 级联收起时把焦点移出下拉层，避免 aria-hidden 与焦点冲突的控制台警告 */
    onCascaderVisibleChange(visible) {
      if (!visible) {
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            const active = document.activeElement;
            const cascaderEl = this.$refs.cascaderRef?.$el;
            if (cascaderEl && active && cascaderEl.contains(active)) {
              active.blur();
            }
          });
        });
      }
    },
    handleView(row) {
      this.detailMaterialId = row && row.id != null ? row.id : null;
      this.detailRowSummary = row || null;
      this.detailDrawerVisible = true;
    },
    handleEdit(row) {
      // TODO: 跳转或打开编辑页
      this.$router.push(`/manager/internal-material/add?id=${row.id}`);
    },
    handleDelete(row) {
      this.rowToDelete = row;
      this.deleteDialogVisible = true;
    },
    handleDeleteConfirm() {
      if (!this.rowToDelete) return;
      const id = this.rowToDelete && this.rowToDelete.id != null ? String(this.rowToDelete.id) : "";
      if (!id) return;
      this.$api({ url: "/delMaterial", method: "post", data: { id } })
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
      // TODO: 新增原料
      this.$router.push('/manager/internal-material/add');
    },
    handleImport() {
      // TODO: 批量导入
      this.$message.info("批量导入");
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

    &+.row-act::before {
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
}
</style>