<template>
  <div class="view-wrap user-list-page">
    <!-- 搜索区：状态、关键词、搜索/重置、新增 -->
    <div class="search-section">
            <el-form ref="queryForm" :model="queryParams" inline class="search-form" label-width="auto">
                <div class="search-row">
                    <el-form-item label="状态">
                        <el-select v-model="queryParams.status" placeholder="全部状态" clearable style="width: 140px">
                            <el-option label="全部状态" value="" />
                            <el-option label="启用" :value="1" />
                            <el-option label="禁用" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键词">
                        <el-input v-model="queryParams.keyword" placeholder="请输入关键词" clearable style="width: 260px" />
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
                <el-table ref="tableRef" :height="tableHeight" :data="tableData"
                    header-cell-class-name="table-header-cell" :row-class-name="tableRowClassName">
                    <el-table-column prop="id" label="ID" width="70" align="center" />
                    <el-table-column prop="username" label="昵称" min-width="120" show-overflow-tooltip />
                    <el-table-column prop="name" label="姓名" min-width="120" show-overflow-tooltip />
                    <el-table-column label="角色" min-width="120" show-overflow-tooltip>
                        <template slot-scope="{ row }">
                            {{ roleNameMap[row.roleId] || row.roleId || "—" }}
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号" min-width="120" show-overflow-tooltip>
                        <template slot-scope="{ row }">
                            {{ row.mobile || row.username || "—" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="created_at" label="时间" width="170" show-overflow-tooltip />
                    <el-table-column label="操作" width="200" align="center" fixed="right">
                        <template slot-scope="{ row }">
                            <span class="row-acts">
                                <span class="row-act" @click="handleEdit(row)">编辑</span>
                                <span class="row-act" @click="handleDelete(row)">删除</span>
                                <span class="row-act" @click="handleResetPwd(row)">修改密码</span>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-wrap">
                    <el-pagination :current-page="queryParams.pageNum" :page-sizes="[10, 20, 50]"
                        :page-size="queryParams.pageSize" :total="total"
                        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </div>
        </div>

    <user-form-dialog ref="userFormDialog" @success="loadList" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import UserFormDialog from "./components/user-form-dialog.vue";

export default {
  name: "UserList",
  components: { UserFormDialog },
  computed: {
    ...mapState(["vuex_depart_list"]),
    roleNameMap() {
      const map = {};
      (this.vuex_depart_list || []).forEach(item => {
        map[item.id] = item.title;
      });
      return map;
    }
  },

  data() {
    return {
      queryParams: {
        keyword: "",
        status: "",
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
            if (this.queryParams.status !== "" && this.queryParams.status !== undefined) {
                params.status = this.queryParams.status;
            }
            this.$api({
                url: "/getSysUserList",
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
            this.queryParams.status = "";
            this.queryParams.pageNum = 1;
            this.queryParams.pageSize = 10;
            this.loadList();
        },
        handleAdd() {
          this.$refs.userFormDialog.open();
        },
        handleEdit(row) {
          this.$refs.userFormDialog.open(row.id);
        },
        handleDelete(row) {
          this.$confirm("确定删除该用户吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$api({
                url: "/delSysUser",
                method: "post",
                data: { id: String(row.id) }
              })
                .then(() => {
                  this.$message.success("删除成功");
                  this.loadList();
                })
                .catch(err => {
                  this.$message.error((err && err.msg) || "删除失败");
                });
            })
            .catch(() => {});
        },
        handleResetPwd(row) {
            this.$message.info("修改密码：" + (row.name || row.username));
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
.user-list-page {
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

        &+.row-act::before {
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
