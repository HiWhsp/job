<template>
  <div class="view-wrap external-package-add-page">
    <div class="form-card">
      <div class="page-title">{{ editId ? '编辑外购产品' : '新增外购产品' }}</div>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" class="package-form">
        <el-form-item label="产品名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="规格名称" prop="keyVals">
          <el-input v-model="form.keyVals" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入" clearable />
        </el-form-item>
        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { adminPath } from "@/utils/adminRoutePrefix.js";

export default {
  name: "ExternalProductAdd",

  data() {
    return {
      editId: "",
      form: {
        title: "",
        keyVals: "",
        unit: ""
      },
      formRules: {
        title: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        keyVals: [{ required: true, message: "请输入规格名称", trigger: "blur" }],
        unit: [{ required: true, message: "请输入单位", trigger: "blur" }]
      }
    };
  },

  mounted() {
    const id = this.$route.query.id;
    if (id) {
      this.editId = String(id);
      this.loadDetail();
    }
  },

  methods: {
    loadDetail() {
      if (!this.editId) return;
      this.$api({
        url: "/getForeignProduct",
        method: "post",
        data: { id: this.editId }
      })
        .then((res) => {
          if (!res || !res.data) return;
          const data = res.data;
          this.form = {
            title: data.title || "",
            keyVals: data.keyVals || "",
            unit: data.unit || ""
          };
        })
        .catch(() => {
          this.$message.error("获取外购产品详情失败");
        });
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        const params = {
          id: this.editId || "",
          title: this.form.title || "",
          keyVals: this.form.keyVals || "",
          unit: this.form.unit || ""
        };
        this.$api({
          url: "/addForeignProduct",
          method: "post",
          data: params
        })
          .then(() => {
            this.$message.success(this.editId ? "修改成功" : "新增成功");
            this.$router.push(adminPath(this, "/external-product/list"));
          })
          .catch((err) => {
            this.$message.error(err && err.msg ? err.msg : "提交失败");
          });
      });
    },
    handleCancel() {
      this.$router.push(adminPath(this, "/external-product/list"));
    }
  }
};
</script>

<style lang="less" scoped>
.external-package-add-page {
  background: #fff;
  min-height: 100%;
}

.form-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px 32px 32px;
  max-width: 600px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 24px;
  text-align: left;
}

.package-form {
  ::v-deep .el-form-item {
    margin-bottom: 20px;
  }

  ::v-deep .el-form-item__label {
    color: #606266;
    text-align: right;
  }

  ::v-deep .el-input__inner,
  ::v-deep .el-select .el-input__inner {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #606266;
  }

  ::v-deep .el-input,
  ::v-deep .el-select {
    width: 100%;
    max-width: 400px;
  }
}

.form-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;

  .el-button {
    min-width: 90px;

    &--primary {
      background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
      border: none;
    }
  }
}
</style>
