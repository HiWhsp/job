<template>
  <div class="view-wrap category-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form">
        <el-form-item label="分类名称">
          <el-input v-model="queryParams.name" placeholder="请输入" clearable style="width: 260px" />
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
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          default-expand-all
          header-cell-class-name="table-header-cell"
          :height="tableHeight"
        >
          <el-table-column prop="name" label="分类名称" min-width="280" show-overflow-tooltip />
          <el-table-column prop="code" label="分类编码" min-width="140" show-overflow-tooltip />
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
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <!-- <el-form-item label="分类编码" prop="code">
            <el-input v-model="form.code" placeholder="请输入分类编码" />
        </el-form-item>-->
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
  name: "ProductCategory",

  data() {
    return {
      queryParams: {
        name: ""
      },
      tableHeight: 400,
      tableData: [
        {
          id: 1,
          name: "树脂盘",
          code: "8951546",
          level: 1,
          children: [
            {
              id: 2,
              name: "二级分类",
              code: "8951546",
              level: 2,
              children: [
                { id: 4, name: "三级分类", code: "8951546", level: 3 },
                { id: 5, name: "三级分类", code: "8951546", level: 3 },
                { id: 6, name: "三级分类", code: "8951546", level: 3 }
              ]
            },
            {
              id: 3,
              name: "二级分类",
              code: "8951546",
              level: 2,
              children: []
            }
          ]
        },
        {
          id: 7,
          name: "硅橡胶",
          code: "8951546",
          level: 1,
          children: []
        },
        {
          id: 8,
          name: "其他产品",
          code: "8951546",
          level: 1,
          children: []
        }
      ],
      dialogVisible: false,
      dialogTitle: "新增分类",
      isEdit: false,
      form: {
        name: "",
        code: "",
        parentId: null
      },
      formRules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
      }
    };
  },

  mounted() {
    this.setTableHeight();
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
      this.loadList();
    },
    loadList() {
      // TODO: 调用接口获取树形分类列表
      // this.tableData = await getCategoryTree(this.queryParams);
    },
    handleAdd() {
      this.dialogTitle = "新增分类";
      this.isEdit = false;
      this.form = { name: "", code: "", parentId: null };
      this.dialogVisible = true;
    },
    handleAddChild(row) {
      this.dialogTitle = "新增子分类";
      this.isEdit = false;
      this.form = { name: "", code: "", parentId: row.id };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = "编辑分类";
      this.isEdit = true;
      this.form = {
        name: row.name,
        code: row.code,
        id: row.id,
        parentId: row.parentId
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
          // TODO: 调用删除接口
          this.$message.success("删除成功");
          this.loadList();
        })
        .catch(() => {});
    },
    handleDialogClose() {
      this.$refs.formRef && this.$refs.formRef.resetFields();
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        // TODO: 调用新增/编辑接口
        this.$message.success(this.isEdit ? "修改成功" : "新增成功");
        this.dialogVisible = false;
        this.loadList();
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
  