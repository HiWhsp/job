<template>
  <div class="page">
    <div class="service-img">
      <h1>服务中心</h1>
      <p>Service Center</p>
    </div>
    <pageBreadcrumb :option="nav_option" />
    <div class="inner">
      <div class="page-ctx">
        <div class="consult-form-container">
          <el-form
            ref="consultForm"
            :model="formData"
            :rules="formRules"
            label-width="120px"
            class="consult-form"
          >
            <!-- 第一行：联系方式和反馈产品 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="您的联系方式:" prop="contact">
                  <el-input
                    v-model="formData.contact"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="反馈产品:">
                  <el-select
                    v-model="formData.product"
                    placeholder="请选择"
                    clearable
                    style="width: 100%"
                  >
                    <el-option label="产品A" value="product1" />
                    <el-option label="产品B" value="product2" />
                    <el-option label="产品C" value="product3" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第二行：是否联系我 -->
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="是否联系我:" style="text-align: left">
                  <el-checkbox v-model="formData.contactMe">是</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="反馈类型:">
                  <el-radio-group v-model="formData.feedbackType">
                    <el-radio label="new-product">新品需求</el-radio>
                    <el-radio label="improvement">改进建议</el-radio>
                    <el-radio label="consultation">产品咨询</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 反馈内容 -->
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="反馈内容:" prop="content">
                  <el-input
                    v-model="formData.content"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 提交按钮 -->
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm"
                :loading="submitLoading"
              >
                提交
              </el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";
export default {
  components: {
    pageBreadcrumb,
  },
  data() {
    return {
      nav_option: [
        { title: "服务中心" },
        { title: "产品咨询与反馈", route: "/product-consult" },
      ],
      formData: {
        contact: "", // 联系方式
        product: "", // 反馈产品
        contactMe: true, // 是否联系我
        feedbackType: "improvement", // 反馈类型，默认选择"改进建议"
        content: "", // 反馈内容
      },
      submitLoading: false, // 提交按钮加载状态
      formRules: {
        contact: [
          { required: true, message: "请输入您的联系方式", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "联系方式长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
        content: [
          { required: true, message: "请输入反馈内容", trigger: "blur" },
          {
            min: 10,
            max: 500,
            message: "反馈内容长度在 10 到 500 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.consultForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true;

          // 模拟异步提交
          setTimeout(() => {
            // 这里可以添加提交到后端的逻辑
            console.log("提交的表单数据:", this.formData);

            // 模拟提交成功
            this.$message.success("提交成功，我们会尽快处理您的反馈");

            // 重置表单
            this.resetForm();
            this.submitLoading = false;
          }, 1500);
        } else {
          this.$message.error("请检查表单填写是否正确");
          return false;
        }
      });
    },

    resetForm() {
      this.$refs.consultForm.resetFields();
      this.formData = {
        contact: "",
        product: "",
        contactMe: true,
        feedbackType: "improvement",
        content: "",
      };
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  background: #f5f5f5;
  text-align: left;
  min-height: 100vh;

  .inner {
    padding-top: 0px;
    padding-bottom: 100px;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
  }
}

.service-img {
  background-image: url("../../assets/img/banner/service.png");
  height: 560px;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 56px;
    color: #fff;
  }
  p {
    font-size: 24px;
    color: #fff;
  }
}

// Element UI 表单样式优化
.consult-form-container {
  padding: 40px;
  border-radius: 8px;
}

.consult-form {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  // 自定义Element UI组件样式
  .el-form-item {
    margin-bottom: 24px;

    .el-form-item__label {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }

    .el-form-item__content {
      .el-input__inner,
      .el-textarea__inner {
        border-radius: 4px;
        border-color: #ddd;

        &:focus {
          border-color: #2e4c87;
        }
      }

      .el-select {
        width: 100%;
      }
    }
  }

  // 单选按钮组样式
  .el-radio-group {
    .el-radio {
      margin-right: 24px;

      .el-radio__label {
        font-size: 16px;
        color: #333;
      }
    }
  }

  // 复选框样式
  .el-checkbox {
    .el-checkbox__label {
      font-size: 16px;
      color: #333;
    }
  }

  // 按钮组样式
  .el-form-item:last-child {
    text-align: center;
    margin-bottom: 0;

    .el-button {
      margin: 0 10px;
      padding: 12px 30px;
      font-size: 16px;

      &.el-button--primary {
        background-color: #2e4c87;
        border-color: #2e4c87;

        &:hover {
          background-color: #1e3a6b;
          border-color: #1e3a6b;
        }
      }
    }
  }
}

.bread-box {
  background: #ffffff;
  padding: 16px 0;
  border-bottom: 1px solid #e4e4e4;

  .bread-inner {
    margin: 0 auto;
    a {
      display: inline-flex;
      align-items: center;

      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;

      img {
        margin-right: 10px;
      }
    }

    .link {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;
    }

    .route-link {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;
    }

    .arrow {
      margin: 0 6px;
      color: #aeaeae;
    }

    > *:last-child {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #000000;
    }

    .search-item {
      color: #aeaeae;
    }
    .search-keyword {
      color: #2e4c87;
    }
  }
}
</style>
