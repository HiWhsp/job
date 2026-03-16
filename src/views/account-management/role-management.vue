<template>
  <div class="view-wrap role-management-page">
    <!-- 搜索区 -->
    <div class="search-section">
      <el-form ref="queryForm" :model="queryParams" inline class="search-form" label-width="auto">
        <div class="search-row">
          <el-form-item label="关键词">
            <el-input
              v-model="queryParams.keyword"
              placeholder="请输入关键词"
              clearable
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
        <div class="search-actions">
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table-view">
      <div class="table-box">
        <el-table
          ref="tableRef"
          :height="tableHeight"
          :data="tableData"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="title" label="角色名称" min-width="200" show-overflow-tooltip />
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
            :current-page="queryParams.pageNum"
            :page-sizes="[10, 20, 50]"
            :page-size="queryParams.pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <role-form-dialog ref="roleFormDialog" @success="onRoleSuccess" />
  </div>
</template>

<script>
import RoleFormDialog from "./components/role-form-dialog.vue";

export default {
  name: "RoleManagement",

  components: { RoleFormDialog },

  data() {
    return {
      queryParams: {
        keyword: "",
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableHeight: 400,
      tableData: []
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
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        keyword: this.queryParams.keyword || ""
      };
      this.$api({
        url: "/getSysUserRoleList",
        method: "post",
        data: params
      })
        .then(res => {
          if (res && res.data) {
            this.tableData = res.data.list || res.data.rows || [];
            this.total = res.data.count ?? res.data.total ?? this.tableData.length;
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
      this.queryParams.keyword = "";
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.loadList();
    },
    handleAdd() {
      this.$refs.roleFormDialog.open();
    },
    handleEdit(row) {
      this.$refs.roleFormDialog.open(row.id, row.title);
    },
    handleDelete(row) {
      this.$confirm("确定删除该角色吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api({
            url: "/delSysUserRole",
            method: "post",
            data: { id: String(row.id) }
          })
            .then(() => {
              this.$message.success("删除成功");
              this.loadList();
              this.$store.dispatch("getDepartList");
            })
            .catch(err => {
              this.$message.error((err && err.msg) || "删除失败");
            });
        })
        .catch(() => {});
    },
    onRoleSuccess() {
      this.loadList();
      this.$store.dispatch("getDepartList");
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
.role-management-page {
  background: #fff;
  border-radius: 8px;
}

.search-section {
  padding: 20px 24px;
  margin-bottom: 20px;
  width: 100%;
}

.search-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;

  .search-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .search-actions {
    flex-shrink: 0;
  }

  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}

.table-view {
  overflow: hidden;
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
      content: "|";
      color: #dcdfe6;
      margin: 0 8px;
      pointer-events: none;
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
