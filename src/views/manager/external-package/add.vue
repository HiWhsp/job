<template>
  <div class="view-wrap external-package-add-page">
    <div class="form-card">
      <div class="page-title">{{ editId ? '编辑客户外来包装' : '新增客户外来包装' }}</div>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" class="package-form">
        <el-form-item label="包装名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="对应产品" prop="productId">
          <el-select v-model="form.productId" placeholder="请选择" clearable style="width: 100%">
            <el-option
              v-for="item in productOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerId">
          <el-select v-model="form.customerId" placeholder="请选择" clearable style="width: 100%">
            <el-option
              v-for="item in customerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
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
import { adminPath } from "@/utils/adminRoutePrefix.js";

export default {
  name: "ExternalPackageAdd",

  data() {
    return {
      editId: "",
      form: {
        title: "",
        productId: "",
        customerId: "",
        unit: ""
      },
      productOptions: [],
      customerOptions: [],
      formRules: {
        title: [{ required: true, message: "请输入包装名称", trigger: "blur" }],
        productId: [{ required: true, message: "请选择对应产品", trigger: "change" }],
        customerId: [{ required: true, message: "请选择客户名称", trigger: "change" }],
        unit: [{ required: true, message: "请输入单位", trigger: "blur" }]
      }
    };
  },

  mounted() {
    this.loadProductOptions();
    this.loadCustomerOptions();
    const id = this.$route.query.id;
    if (id) {
      this.editId = String(id);
      this.loadDetail();
    }
  },

  methods: {
    loadProductOptions() {
      const params = { page: "1", limit: "1000", keyword: "" };
      this.$api({
        url: "/getProductList",
        method: "post",
        data: params
      })
        .then((res) => {
          if (res && res.data) {
            const list = res.data.list || res.data.rows || [];
            this.productOptions = list.map(item => ({
              value: String(item.id),
              label: item.title || item.productNo || ""
            }));
          } else {
            this.productOptions = [];
          }
        })
        .catch(() => {
          this.productOptions = [];
        });
    },
    loadCustomerOptions() {
      const params = {
        page: "1",
        limit: "1000",
        keyword: "",
        territory: "",
        region: "",
        attributeA: "",
        attributeB: ""
      };
      this.$api({
        url: "/getCustomerList",
        method: "post",
        data: params
      })
        .then((res) => {
          if (res && res.data) {
            const list = res.data.list || res.data.rows || [];
            this.customerOptions = list.map(item => ({
              value: String(item.id),
              label: item.title || item.customerNo || ""
            }));
          } else {
            this.customerOptions = [];
          }
        })
        .catch(() => {
          this.customerOptions = [];
        });
    },
    loadDetail() {
      if (!this.editId) return;
      this.$api({
        url: "/getForeignPack",
        method: "post",
        data: { id: this.editId }
      })
        .then((res) => {
          if (!res || !res.data) return;
          const data = res.data;
          this.form = {
            title: data.title || "",
            productId: data.productId != null ? String(data.productId) : "",
            customerId: data.customerId != null ? String(data.customerId) : "",
            unit: data.unit || ""
          };
        })
        .catch(() => {
          this.$message.error("获取包装详情失败");
        });
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        const params = {
          id: this.editId || "",
          title: this.form.title || "",
          productId: this.form.productId != null ? String(this.form.productId) : "0",
          customerId: this.form.customerId != null ? String(this.form.customerId) : "",
          unit: this.form.unit || ""
        };
        this.$api({
          url: "/addForeignPack",
          method: "post",
          data: params
        })
          .then(() => {
            this.$message.success(this.editId ? "修改成功" : "新增成功");
            this.$router.push(adminPath(this, "/external-package/list"));
          })
          .catch((err) => {
            this.$message.error(err && err.msg ? err.msg : "提交失败");
          });
      });
    },
    handleCancel() {
      this.$router.push(adminPath(this, "/external-package/list"));
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
