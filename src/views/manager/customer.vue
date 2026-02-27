<template>
  <div class="customer-page">
    <div class="page-content">
      <!-- 搜索筛选区域 -->
      <div class="search-section">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="客户名称">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入客户名称"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input
              v-model="searchForm.phone"
              placeholder="请输入联系电话"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              clearable
              style="width: 150px"
            >
              <el-option label="全部" value></el-option>
              <el-option label="正常" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="action-section">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增客户</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
        >批量删除</el-button>
        <el-button icon="el-icon-download" @click="handleExport">导出</el-button>
      </div>

      <!-- 表格区域 -->
      <div class="table-section">
        <el-table
          :data="tableData"
          v-loading="loading"
          border
          stripe
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="name" label="客户名称" min-width="120"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
          <el-table-column prop="company" label="公司名称" min-width="150"></el-table-column>
          <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status == 1 ? 'success' : 'danger'"
              >{{ scope.row.status == 1 ? '正常' : '禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
              <el-button
                type="text"
                size="small"
                style="color: #f56c6c"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-section">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="formData.company" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" type="textarea" :rows="3" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "customer",
  data() {
    return {
      loading: false,
      submitLoading: false,
      searchForm: {
        name: "",
        phone: "",
        status: ""
      },
      tableData: [],
      selectedRows: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: "新增客户",
      formData: {
        id: null,
        name: "",
        phone: "",
        email: "",
        company: "",
        address: "",
        status: 1
      },
      formRules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        email: [
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取数据
    fetchData() {
      this.loading = true;
      // TODO: 调用实际的API
      // this.$api({
      //   url: "/service.php",
      //   method: "get",
      //   data: {
      //     action: "customer_list",
      //     page: this.pagination.page,
      //     pageSize: this.pagination.pageSize,
      //     ...this.searchForm
      //   }
      // }).then(res => {
      //   if (res.code == 200) {
      //     this.tableData = res.data.list || [];
      //     this.pagination.total = res.data.total || 0;
      //   }
      //   this.loading = false;
      // });

      // 模拟数据
      setTimeout(() => {
        this.tableData = [
          {
            id: 1,
            name: "张三",
            phone: "13800138000",
            email: "zhangsan@example.com",
            company: "测试公司",
            address: "北京市朝阳区测试街道123号",
            status: 1,
            createTime: "2024-01-01 10:00:00"
          },
          {
            id: 2,
            name: "李四",
            phone: "13900139000",
            email: "lisi@example.com",
            company: "示例公司",
            address: "上海市浦东新区示例路456号",
            status: 1,
            createTime: "2024-01-02 11:00:00"
          }
        ];
        this.pagination.total = 2;
        this.loading = false;
      }, 500);
    },

    // 搜索
    handleSearch() {
      this.pagination.page = 1;
      this.fetchData();
    },

    // 重置
    handleReset() {
      this.searchForm = {
        name: "",
        phone: "",
        status: ""
      };
      this.handleSearch();
    },

    // 新增
    handleAdd() {
      this.dialogTitle = "新增客户";
      this.formData = {
        id: null,
        name: "",
        phone: "",
        email: "",
        company: "",
        address: "",
        status: 1
      };
      this.dialogVisible = true;
    },

    // 编辑
    handleEdit(row) {
      this.dialogTitle = "编辑客户";
      this.formData = { ...row };
      this.dialogVisible = true;
    },

    // 查看
    handleView(row) {
      // TODO: 实现查看详情功能
      this.$message.info("查看功能待实现");
    },

    // 删除
    handleDelete(row) {
      this.$confirm("确定要删除该客户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // TODO: 调用删除API
          // this.$api({
          //   url: "/service.php",
          //   method: "post",
          //   data: {
          //     action: "customer_delete",
          //     id: row.id
          //   }
          // }).then(res => {
          //   if (res.code == 200) {
          //     this.$message.success("删除成功");
          //     this.fetchData();
          //   }
          // });
          this.$message.success("删除成功");
          this.fetchData();
        })
        .catch(() => {});
    },

    // 批量删除
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请选择要删除的客户");
        return;
      }
      this.$confirm(
        `确定要删除选中的 ${this.selectedRows.length} 个客户吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // TODO: 调用批量删除API
          this.$message.success("批量删除成功");
          this.fetchData();
        })
        .catch(() => {});
    },

    // 导出
    handleExport() {
      // TODO: 实现导出功能
      this.$message.info("导出功能待实现");
    },

    // 提交表单
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          // TODO: 调用保存API
          // const action = this.formData.id ? "customer_update" : "customer_add";
          // this.$api({
          //   url: "/service.php",
          //   method: "post",
          //   data: {
          //     action: action,
          //     ...this.formData
          //   }
          // }).then(res => {
          //   if (res.code == 200) {
          //     this.$message.success(this.formData.id ? "更新成功" : "新增成功");
          //     this.dialogVisible = false;
          //     this.fetchData();
          //   }
          //   this.submitLoading = false;
          // });

          // 模拟提交
          setTimeout(() => {
            this.$message.success(this.formData.id ? "更新成功" : "新增成功");
            this.dialogVisible = false;
            this.fetchData();
            this.submitLoading = false;
          }, 500);
        }
      });
    },

    // 对话框关闭
    handleDialogClose() {
      this.$refs.formRef && this.$refs.formRef.resetFields();
    },

    // 表格选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },

    // 分页大小变化
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.page = 1;
      this.fetchData();
    },

    // 当前页变化
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.fetchData();
    }
  }
};
</script>

<style lang="less" scoped>
.customer-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: calc(100vh - 100px);

  .page-header {
    background: #fff;
    padding: 20px 24px;
    margin-bottom: 20px;
    border-radius: 4px;

    .page-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
  }

  .page-content {
    background: #fff;
    padding: 24px;
    border-radius: 4px;

    .search-section {
      margin-bottom: 20px;
      padding: 20px;
      background: #fafafa;
      border-radius: 6px;
      border: 1px solid #e8e8e8;
      transition: all 0.3s ease;

      &:hover {
        border-color: #d0d0d0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }

      .search-form {
        margin: 0;

        /deep/ .el-form-item {
          margin-bottom: 16px;
          margin-right: 20px;

          .el-form-item__label {
            font-weight: 500;
            color: #333;
            padding-right: 12px;
          }

          .el-input__inner,
          .el-select .el-input__inner {
            border-radius: 4px;
            transition: all 0.3s ease;

            &:focus {
              border-color: #409eff;
              box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
            }
          }
        }

        /deep/ .el-button {
          border-radius: 4px;
          padding: 10px 20px;
          font-weight: 500;
          transition: all 0.3s ease;

          &.el-button--primary {
            background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
            border: none;
            box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);

            &:hover {
              background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
              box-shadow: 0 4px 8px rgba(64, 158, 255, 0.4);
              transform: translateY(-1px);
            }

            &:active {
              transform: translateY(0);
            }
          }

          &:not(.el-button--primary) {
            &:hover {
              border-color: #409eff;
              color: #409eff;
              background: #ecf5ff;
            }
          }
        }
      }
    }

    .action-section {
      margin-bottom: 20px;
      display: flex;
      gap: 12px;
    }

    .table-section {
      margin-bottom: 20px;
    }

    .pagination-section {
      display: flex;
      justify-content: flex-end;
      padding-top: 20px;
    }
  }
}

/deep/ .el-table {
  .el-table__header {
    th {
      background: #fafafa;
      color: #333;
      font-weight: 600;
    }
  }
}
</style>
