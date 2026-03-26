<template>
  <div class="view-wrap category-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form">
        <el-form-item label="分类名称">
          <el-input v-model="queryParams.keyword" placeholder="请输入" clearable style="width: 260px" />
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
        <div class="table-title">原料分类管理</div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleAdd">新增分类</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="tableRef"
          :data="tableData"
          row-key="id"
          :tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
          default-expand-all
          header-cell-class-name="table-header-cell"
          :height="tableHeight"
        >
          <el-table-column prop="title" label="分类名称" min-width="280" show-overflow-tooltip />
          <el-table-column prop="cateNo" label="分类编码" min-width="140" show-overflow-tooltip />
          <el-table-column label="操作" width="220" align="left" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span v-if="row.level < 3" class="row-act" @click="handleAddChild(row)">新增子分类</span>
                <span class="row-act" @click="handleEdit(row)">编辑</span>
                <span class="row-act row-act-danger" @click="handleDelete(row)">删除</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增/编辑分类弹框（占位，后续可接入表单） -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入分类名称" />
        </el-form-item>
        <!-- <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="9999" controls-position="right" style="width: 100%" />
        </el-form-item> -->
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
export default {
  name: "MaterialCategory",

  data() {
    return {
      queryParams: {
        keyword: ""
      },
      tableHeight: 400,
      tableData: [],
      dialogVisible: false,
      dialogTitle: "新增分类",
      isEdit: false,
      form: {
        title: "",
        parent_id: 0,
        sort: 0
      },
      formRules: {
        title: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
      }
    };
  },

  mounted() {
    this.setTableHeight();
    this.loadList();
    window.addEventListener("resize", this.setTableHeight);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.setTableHeight);
  },

  methods: {
    setTableHeight() {
      this.$nextTick(() => {
        const tableEl = this.$refs.tableRef && this.$refs.tableRef.$el;
        if (!tableEl) return;
        const offsetTop = tableEl.offsetTop + 85;
        this.tableHeight = Math.max(window.innerHeight - offsetTop - 20, 200);
      });
    },
    handleQuery() {
      // TODO: 调用接口，按 queryParams.name 筛选
      this.loadList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams = { keyword: "" };
      this.loadList();
    },
    /** 递归为树节点添加 level（1/2/3），便于操作列“新增子分类”判断 */
    normalizeTreeLevel(nodes, level = 1) {
      if (!Array.isArray(nodes)) return [];
      return nodes.map(node => {
        const item = { ...node, level };
        if (Array.isArray(item.child) && item.child.length) {
          item.child = this.normalizeTreeLevel(item.child, level + 1);
        }
        return item;
      });
    },
    loadList() {
      this.$api({
        url: "/getMaterialCateList",
        method: "post",
        data: { keyword: this.queryParams.keyword || "" }
      })
        .then(res => {
          if (res && res.code === 200 && Array.isArray(res.data)) {
            this.tableData = this.normalizeTreeLevel(res.data);
          } else {
            this.tableData = [];
          }
        })
        .catch(() => {
          this.tableData = [];
        });
    },
    handleAdd() {
      this.dialogTitle = "新增分类";
      this.isEdit = false;
      this.form = { title: "", parent_id: 0, sort: 0 };
      this.dialogVisible = true;
    },
    handleAddChild(row) {
      this.dialogTitle = "新增子分类";
      this.isEdit = false;
      this.form = { title: "", parent_id: row.id, sort: 0 };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = "编辑分类";
      this.isEdit = true;
      this.form = {
        title: row.title,
        id: row.id,
        parent_id: row.parent_id ?? 0,
        sort: row.sort ?? 0
      };
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm("确定要删除该分类吗？删除后其子分类可能受影响。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const ids = row && row.id != null ? String(row.id) : "";
          if (!ids) return;
          this.$api({ url: "/delMaterialCate", method: "post", data: { ids } })
            .then(res => {
              if (res && res.code === 200) {
                this.$message.success("删除成功");
                this.loadList();
              } else {
                this.$message.error((res && res.msg) || "删除失败");
              }
            })
            .catch(err => {
              this.$message.error((err && err.msg) ? err.msg : "删除失败");
            });
        })
        .catch(() => {});
    },
    handleDialogClose() {
      this.$refs.formRef && this.$refs.formRef.resetFields();
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        const params = {
          title: this.form.title,
          parent_id: String(this.form.parent_id ?? 0),
          sort: String(this.form.sort ?? 0)
        };
        if (this.isEdit && this.form.id != null && this.form.id !== "") {
          params.id = String(this.form.id);
        }
        this.$api({
          url: "/addMaterialCate",
          method: "post",
          data: params
        })
          .then(() => {
            this.$message.success(this.isEdit ? "修改成功" : "新增成功");
            this.dialogVisible = false;
            this.loadList();
          })
          .catch(err => {
            this.$message.error((err && err.msg) ? err.msg : "操作失败");
          });
      });
    }
  }
};
</script>
  
  <style lang="less" scoped>
.category-page {
  height: 100%;
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

  ::v-deep .el-input__inner {
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
    .el-button--primary {
      background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
      border: none;
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

    .el-table__body tr:hover > td {
      background: #f5f7fa !important;
    }
  }
}

.row-acts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;

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

    &.row-act-danger {
      color: #f56c6c;
    }
  }
}
</style>
  