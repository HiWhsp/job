<template>
  <div class="view-wrap external-package-add-page">
    <div class="form-card">
      <div class="page-title">新增外购包装</div>
      <el-form ref="formRef" :model="form" label-width="100px" class="package-form">
        <el-form-item label="包装名称" prop="packageName">
          <el-input v-model="form.packageName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="对应产品" prop="productId">
          <el-select v-model="form.productId" placeholder="请选择" clearable style="width: 100%">
            <el-option label="产品A" value="1" />
            <el-option label="产品B" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerId">
          <el-select v-model="form.customerId" placeholder="请选择" clearable style="width: 100%">
            <el-option label="客户A" value="1" />
            <el-option label="客户B" value="2" />
          </el-select>
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
export default {
  name: "ExternalPackageAdd",

  data() {
    return {
      form: {
        packageName: "",
        productId: "",
        customerId: "",
        unit: ""
      },
    };
  },

  methods: {
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        // TODO: 调用新增接口
        this.$message.success("提交成功");
        this.$router.push("/manager/external-package/list");
      });
    },
    handleCancel() {
      this.$router.push("/manager/external-package/list");
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
    text-align: left;
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
