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
                <el-form-item label="您的联系方式:" prop="phone">
                  <el-input
                    v-model="formData.phone"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="反馈产品:" prop="proId">
                  <el-select
                    v-model="formData.proId"
                    placeholder="请选择"
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    style="width: 100%"
                    :remote-method="fetchProductOptions"
                    :loading="productLoading"
                    @visible-change="handleProductDropdown"
                  >
                    <el-option
                      v-for="item in productOptions"
                      :key="item.id"
                      :label="
                        item.name ||
                        item.title ||
                        item.productName ||
                        '未命名产品'
                      "
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第二行：是否联系我 -->
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="是否联系我:" style="text-align: left">
                  <el-checkbox v-model="formData.tell">是</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="反馈类型:">
                  <el-radio-group v-model="formData.bType">
                    <el-radio :label="1">新品需求</el-radio>
                    <el-radio :label="2">改进建议</el-radio>
                    <el-radio :label="3">产品咨询</el-radio>
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
        phone: "", // 联系方式
        proId: "", // 反馈产品
        tell: true, // 是否联系我
        bType: 1, // 反馈类型
        content: "", // 反馈内容
      },
      productOptions: [], // 反馈产品选项
      productLoading: false, // 产品加载状态
      submitLoading: false, // 提交按钮加载状态
      formRules: {
        phone: [
          { required: true, message: "请输入您的联系方式", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号格式",
            trigger: "blur",
          },
        ],
        content: [
          { required: true, message: "请输入反馈内容", trigger: "blur" },
        ],
        proId: [
          { required: true, message: "请选择反馈产品", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getProductList();
  },
  methods: {
    // 获取产品列表，支持关键字搜索
    getProductList(keyword = "") {
      this.productLoading = true;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          keyword,
          page: 1,
          pageNum: 10,
        },
      })
        .then((res) => {
          if (res.code === 200) {
            const list = (res.data && res.data.list) || [];
            this.productOptions = list;
          }
        })
        .catch((err) => {
          console.error("获取产品列表失败:", err);
        })
        .finally(() => {
          this.productLoading = false;
        });
    },
    // 远程搜索回调
    fetchProductOptions(keyword) {
      this.getProductList(keyword);
    },
    // 下拉展开时默认加载
    handleProductDropdown(visible) {
      if (visible && this.productOptions.length === 0 && !this.productLoading) {
        this.getProductList();
      }
    },
    submitForm() {
      this.$refs.consultForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true;

          this.$api({
            url: "/service.php",
            method: "post",
            data: {
              action: "serve_proSeek",
              phone: this.formData.phone,
              proId: this.formData.proId,
              tell: this.formData.tell ? 1 : 0,
              bType: this.formData.bType,
              content: this.formData.content,
            },
          })
            .then((res) => {
              if (res.code === 200) {
                this.$message.success("提交成功！我们会尽快与您联系");
                this.$refs.consultForm.resetFields();
                this.formData = {
                  phone: "",
                  proId: "",
                  tell: true,
                  bType: 1,
                  content: "",
                };
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.$message.error(err.msg);
            })
            .finally(() => {
              this.submitLoading = false;
            });
        } else {
          this.$message.error("请检查表单填写是否正确");
          return false;
        }
      });
    },

    resetForm() {
      this.$refs.consultForm.resetFields();
      this.formData = {
        phone: "",
        proId: "",
        tell: true,
        bType: 1,
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
