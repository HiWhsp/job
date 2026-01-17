<template>
  <div class="modal-container">
    <el-dialog
      title="Large Order Inquiry"
      width="800px"
      custom-class="inquiry-modal-wrap"
      :close-on-click-modal="false"
      :visible.sync="show_modal"
      :before-close="onBeforeClose"
    >
      <div class="modal-inner">
        <!-- 产品信息 -->
        <div class="form-section">
          <div class="form-item">
            <label class="form-label">Product Name</label>
            <div class="form-input">
              <el-input
                v-model="form.productName"
                readonly
                placeholder="Product Name"
              />
            </div>
          </div>

          <div class="form-item">
            <label class="form-label">serial number</label>
            <div class="form-input">
              <el-input
                v-model="form.productCode"
                readonly
                placeholder="serial number"
              />
            </div>
          </div>
        </div>

        <!-- 所需规格 -->
        <div class="form-section">
          <div class="form-item">
            <label class="form-label"
              >Specifications
              <!-- <i style="color: red">*</i> -->
            </label>
            <div class="spec-list">
              <div
                class="spec-item"
                v-for="(spec, index) in form.spec"
                :key="index"
              >
                <el-checkbox
                  v-model="spec.selected"
                  @change="onSpecChange(spec)"
                >
                  {{ spec.specName }}
                </el-checkbox>
                <!-- v-if="spec.selected" -->
                <div class="spec-quantity">
                  <label>数量</label>
                  <el-input-number
                    v-model="spec.num"
                    :min="0"
                    :max="999999"
                    size="small"
                    style="width: 150px; margin: 0 8px"
                  />
                  <span>箱</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 需求描述 -->
        <div class="form-section">
          <div class="form-item">
            <label class="form-label"> Describe the requirements</label>
            <div class="form-input">
              <el-input
                v-model="form.note"
                type="textarea"
                :rows="4"
                placeholder="Describe the requirements"
                maxlength="300"
                show-word-limit
              />
            </div>
          </div>
        </div>

        <!-- 联系信息 -->
        <div class="form-section">
          <div class="form-item">
            <label class="form-label"
              ><i style="color: red">*</i>Company Name</label
            >
            <div class="form-input">
              <el-input
                v-model="form.companyName"
                placeholder="Enter your company name"
                clearable
              />
            </div>
          </div>

          <div class="form-item">
            <label class="form-label"
              ><i style="color: red">*</i> Telephone</label
            >
            <div class="form-input">
              <el-input
                v-model="form.mobile"
                placeholder="Enter your phone number"
                clearable
              />
            </div>
          </div>

          <div class="form-item">
            <label class="form-label"
              ><i style="color: red">*</i>Contact Person Name</label
            >
            <div class="form-input">
              <el-input
                v-model="form.contact"
                placeholder="Enter your name"
                clearable
              />
            </div>
          </div>
          <div class="form-item">
            <label class="form-label"
              ><i style="color: red">*</i>Mail Address</label
            >
            <div class="form-input">
              <el-input
                v-model="form.mail"
                placeholder="Enter your mail address"
                clearable
              />
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <div class="footer-content column-flex-center">
          <div class="submit-btn">
            <el-button
              type="primary"
              @click="submitInquiry"
              :loading="submitting"
              size="medium"
            >
              SUBMIT
            </el-button>
          </div>
          <div class="contact-service">
            <div class="flex-center">
              <span>Contact Us</span>
              <span class="phone-number">400-888-888</span>
            </div>
            <img src="@img/product/detail-service.png" alt="" />
          </div>
        </div>
      </span>
    </el-dialog>

    <!-- 成功提示弹窗 -->
    <product_saveInquiry_success_modal
      ref="product_saveInquiry_success_modal"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import product_saveInquiry_success_modal from "@/components/product/product_saveInquiry_success_modal.vue";

export default {
  name: "product-save-inquiry",
  components: {
    product_saveInquiry_success_modal,
  },
  data() {
    return {
      show_modal: false,
      submitting: false,
      productInfo: null, // 产品信息
      form: {
        productId: "", // 产品ID
        productName: "", // 产品名称
        productCode: "", // 产品编号
        spec: [], // 规格所需规格（spec：规格名，num：数量）
        note: "", // 需求描述
        companyName: "", // 公司名称
        mobile: "", // 联系电话
        contact: "", // 联系人
      },
      rules: {
        // companyName: [
        //   { required: true, message: "请输入企业名称", trigger: "blur" },
        // ],
        // contact: [
        //   { required: true, message: "请输入联系人姓名", trigger: "blur" },
        // ],
        // mobile: [
        //   { required: true, message: "请输入联系电话", trigger: "blur" },
        //   {
        //     pattern: /^1[3-9]\d{9}$/,
        //     message: "请输入正确的手机号码",
        //     trigger: "blur",
        //   },
        // ],
        note: [{ required: true, message: "请输入需求描述", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(["vuex_cart_number"]),
  },
  watch: {},
  methods: {
    // 初始化组件，接收产品信息
    init(productInfo) {
      this.productInfo = productInfo;
      // 预填充产品信息
      this.form.productId = productInfo.productId || "";
      this.form.productName = productInfo.title || "";
      this.form.productCode = productInfo.productNo || "";

      // 初始化规格数据
      this.initSpecData(productInfo);

      // 重置表单
      this.resetForm();
      this.show_modal = true;
    },

    // 初始化规格数据
    initSpecData(productInfo) {
      // 如果有选中的规格，使用选中的规格
      if (productInfo.selectedSpecs && productInfo.selectedSpecs.length > 0) {
        this.form.spec = productInfo.selectedSpecs.map((spec) => ({
          specName: spec.spec,
          num: spec.quantity,
          selected: true,
        }));
      } else {
        // 否则使用产品详情页的规格列表
        this.form.spec = productInfo.skuList
          ? productInfo.skuList.map((sku) => ({
              specName: sku.keyVals || "默认规格",
              num: 0,
              selected: false,
            }))
          : [
              {
                specName: "默认规格",
                num: 0,
                selected: false,
              },
            ];
      }
    },

    // 规格选择变化
    onSpecChange(spec) {
      if (!spec.selected) {
        spec.num = 0;
      } else if (spec.num === 0) {
        spec.num = 1;
      }
    },

    // 重置表单
    resetForm() {
      this.form.companyName = "";
      this.form.contact = "";
      this.form.mobile = "";
      this.form.note = "";

      // 重置规格选择
      this.form.spec.forEach((spec) => {
        spec.selected = false;
        spec.num = 0;
      });
    },

    // 提交咨询
    submitInquiry() {
      // 验证必填字段
      // if (!this.form.companyName) {
      //   this.$message.warning("请输入企业名称");
      //   return;
      // }
      // if (!this.form.contact) {
      //   this.$message.warning("请输入联系人");
      //   return;
      // }
      // if (!this.form.mobile) {
      //   this.$message.warning("请输入联系电话");
      //   return;
      // }
      if (!this.form.note) {
        this.$message.warning("请输入需求描述");
        return;
      }

      // 检查是否选择了规格
      const selectedSpecs = this.form.spec.filter(
        (spec) => spec.selected && spec.num > 0
      );
      if (selectedSpecs.length === 0) {
        this.$message.warning("请至少选择一个规格并填写数量");
        return;
      }

      this.submitting = true;

      // 构建提交数据
      const submitData = {
        action: "users_saveInquiry",
        productId: this.form.productId,
        productName: this.form.productName,
        productCode: this.form.productCode,
        spec: JSON.stringify(selectedSpecs),
        note: this.form.note,
        companyName: this.form.companyName,
        mobile: this.form.mobile,
        contact: this.form.contact,
      };

      this.$api({
        url: "/service.php",
        method: "post",
        data: submitData,
      })
        .then((res) => {
          this.submitting = false;
          if (res.code === 200) {
            // 关闭咨询弹窗
            this.show_modal = false;
            // 显示成功提示弹窗
            this.$refs.product_saveInquiry_success_modal.init();
          } else {
            this.$message.error(res.message || "提交失败，请重试");
          }
        })
        .catch((error) => {
          this.submitting = false;
          this.$message.error("网络错误，请重试");
          console.error("咨询提交失败:", error);
        });
    },

    onBeforeClose() {
      this.show_modal = false;
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-dialog__header {
  padding: 16px 24px;
  background: #fff;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 20px 30px;
}

/deep/ .el-dialog__footer {
  padding: 0px 30px 20px 30px;
}

.inquiry-modal-wrap {
  .modal-inner {
    .form-section {
      margin-bottom: 24px;

      .form-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 16px;

        .form-label {
          font-family: Poppins, Poppins;
          width: 155px;
          font-size: 18px;
          color: #1e262e;
          margin-right: 12px;
          text-align: right;

          i {
            margin-right: 5px;
          }
        }

        .form-input {
          flex: 1;

          .el-input,
          .el-textarea {
            width: 100%;
          }

          /deep/ .el-input__inner {
            height: 50px;
          }

          .el-textarea__inner {
            resize: vertical;
          }
        }

        .spec-list {
          flex: 1;

          .spec-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            // border-bottom: 1px dotted #ddd;

            &:last-child {
              border-bottom: none;
            }

            .el-checkbox {
              margin-right: 12px;
              flex-shrink: 0;

              /deep/ .el-checkbox__label {
                font-size: 14px;
                color: #333;
              }
            }

            .spec-quantity {
              display: flex;
              align-items: center;
              margin-left: auto;

              label {
                font-size: 14px;
                color: #666;
                margin-right: 8px;
              }

              .el-input-number {
                margin: 0 8px;
              }

              span {
                font-size: 14px;
                color: #666;
              }
            }
          }
        }
      }
    }
  }

  .footer-content {
    .contact-service {
      width: 100%;
      margin-top: 40px;
      display: flex;
      justify-content: space-between;

      font-family: Poppins, Poppins;
      font-weight: 600;
      font-size: 20px;
      color: #00306b;

      .phone-number {
        font-family: Poppins, Poppins;
        font-weight: 600;
        font-size: 30px;
        color: #ec6a2b;
        margin-left: 10px;
      }
      img {
        width: 57px;
        height: 57px;
      }
    }

    .submit-btn {
      .el-button {
        width: 150px;
        height: 46px;
        border-radius: 4px 4px 4px 4px;
        background: #ec6a2b;
        border-color: #ec6a2b;

        &:hover {
          background: #ec6a2b;
          border-color: #ec6a2b;
        }
      }
    }
  }
}
</style>

<style
  scoped
  lang="less"
  src="@/assets/h5css/modals/product_add_cart_success_modal.less"
></style>
