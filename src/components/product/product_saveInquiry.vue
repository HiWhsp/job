<template>
  <div class="modal-container">
    <el-dialog
      title="Large Order Inquiry"
      width="920px"
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
              <el-input v-model="form.productName" readonly placeholder="Product Name" />
            </div>
          </div>

          <div class="form-item">
            <label class="form-label">serial number</label>
            <div class="form-input">
              <el-input v-model="form.productCode" readonly placeholder="serial number" />
            </div>
          </div>
        </div>

        <!-- 所需规格 -->
        <div class="form-section">
          <div class="form-item">
            <label class="form-label">
              Specifications
              <!-- <i style="color: red">*</i> -->
            </label>
            <!-- 使用skuLists展示规格选择器 -->
            <div class="spec-selectors" v-if="skuLists && skuLists.length > 0">
              <div
                class="spec-selector-group"
                v-for="(skuGroup, groupIndex) in skuLists"
                :key="groupIndex"
              >
                <div
                  class="spec-selector-label"
                >{{ skuGroup.key }}: {{ getSelectedOptionTitle(skuGroup) }}</div>
                <div class="spec-selector-options">
                  <!-- 颜色选择器（图片） -->
                  <template v-if="skuGroup.key.toLowerCase() === 'color'">
                    <div
                      class="spec-option-item spec-option-color"
                      :class="{
                        active: isOptionSelected(skuGroup.id, child.id),
                        disabled: !isOptionAvailable(skuGroup.id, child.id)
                      }"
                      v-for="child in skuGroup.child"
                      :key="child.id"
                      @click="selectSpecOption(skuGroup.id, child.id)"
                    >
                      <el-image v-if="child.image" :src="child.image" class="color-image"></el-image>
                      <span v-else>{{ child.title }}</span>
                    </div>
                  </template>
                  <!-- 其他选择器（按钮） -->
                  <template v-else>
                    <div
                      class="spec-option-item spec-option-button"
                      :class="{
                        active: isOptionSelected(skuGroup.id, child.id),
                        disabled: !isOptionAvailable(skuGroup.id, child.id)
                      }"
                      v-for="child in skuGroup.child"
                      :key="child.id"
                      @click="selectSpecOption(skuGroup.id, child.id)"
                    >{{ child.title }}</div>
                  </template>
                </div>
              </div>
              <!-- 数量输入 -->
            </div>
            <!-- 兼容旧版：如果没有skuLists，使用旧的列表方式 -->
            <div class="spec-list" v-else>
              <div class="spec-item" v-for="(spec, index) in form.spec" :key="index">
                <el-checkbox
                  v-model="spec.selected"
                  @change="onSpecChange(spec)"
                >{{ spec.specName }}</el-checkbox>
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
        <div class="form-section">
          <div class="form-item">
            <label class="form-label">Quantity</label>
            <div class="spec-quantity-input" v-if="currentSelectedInventory">
              <el-input-number
                v-model="form.quantity"
                :min="0"
                :max="999999"
                size="small"
                style="width: 150px; margin: 0 8px"
              />
            </div>
          </div>
        </div>

        <!-- 需求描述 -->
        <div class="form-section">
          <div class="form-item">
            <label class="form-label">
              Describe the
              <br />requirements
            </label>
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
            <label class="form-label">
              <i style="color: red">*</i>Company Name
            </label>
            <div class="form-input">
              <el-input v-model="form.companyName" placeholder="Enter your company name" clearable />
            </div>
          </div>

          <div class="form-item">
            <label class="form-label">
              <i style="color: red">*</i>Contact Person Name
            </label>
            <div class="form-input">
              <el-input v-model="form.contact" placeholder="Enter your name" clearable />
            </div>
          </div>

          <div class="form-item">
            <label class="form-label">
              <i style="color: red">*</i> Telephone
            </label>
            <div class="form-input">
              <el-input v-model="form.mobile" placeholder="Enter your phone number" clearable />
            </div>
          </div>

          <div class="form-item">
            <label class="form-label">
              <i style="color: red">*</i> Email
            </label>
            <div class="form-input">
              <el-input v-model="form.email" placeholder="Enter your email" clearable />
            </div>
          </div>

          <div class="form-item">
            <label class="form-label">
              <!-- <i style="color: red">*</i> Email -->
            </label>
            <div class="form-input">
              <el-checkbox v-model="form.is_agree">REQUEST A SAMPLE</el-checkbox>
            </div>
          </div>

          <div class="form-item">
            <label class="form-label">
              <i style="color: red">*</i>Mail Address
            </label>
            <div class="form-input">
              <el-input v-model="form.mail" placeholder="Enter your mail address" clearable />
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
            >SUBMIT</el-button>
          </div>
          <div class="contact-service">
            <div class="flex-center">
              <span>Contact Us</span>
              <span class="phone-number">400-888-888</span>
            </div>
            <img src="@img/product/detail-service.png" alt />
          </div>
        </div>
      </span>
    </el-dialog>

    <!-- 成功提示弹窗 -->
    <product_saveInquiry_success_modal ref="product_saveInquiry_success_modal" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import product_saveInquiry_success_modal from "@/components/product/product_saveInquiry_success_modal.vue";

export default {
  name: "product-save-inquiry",
  components: {
    product_saveInquiry_success_modal
  },
  data() {
    return {
      show_modal: false,
      submitting: false,
      productInfo: null, // 产品信息
      skuLists: [], // SKU列表配置
      skuList: [], // 库存列表
      selectedSkuOptions: {}, // 已选择的SKU选项
      currentSelectedInventory: null, // 当前选中的库存项
      form: {
        productId: "", // 产品ID
        productName: "", // 产品名称
        productCode: "", // 产品编号
        spec: [], // 规格所需规格（spec：规格名，num：数量）
        quantity: 0, // 数量（使用skuLists时）
        note: "", // 需求描述
        companyName: "", // 公司名称
        mobile: "", // 联系电话
        contact: "" // 联系人
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
        note: [{ required: true, message: "please enter the requirements description", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["vuex_cart_number"])
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

      // 保存skuLists和skuList
      this.skuLists = productInfo.skuLists || [];
      this.skuList = productInfo.skuList || [];

      // 初始化规格数据
      this.initSpecData(productInfo);

      // 重置表单
      this.resetForm();
      this.show_modal = true;
    },

    // 初始化规格数据
    initSpecData(productInfo) {
      // 如果有skuLists，使用skuLists方式
      if (this.skuLists && this.skuLists.length > 0) {
        // 初始化选中的选项
        this.selectedSkuOptions = {};
        this.skuLists.forEach(skuGroup => {
          // 优先选择is_selected为1的选项，否则选择第一个
          const selectedOption =
            skuGroup.child.find(child => child.is_selected === 1) ||
            (skuGroup.child.length > 0 ? skuGroup.child[0] : null);
          if (selectedOption) {
            this.$set(this.selectedSkuOptions, skuGroup.id, selectedOption.id);
          }
        });

        // 等待Vue更新后，尝试匹配对应的库存
        this.$nextTick(() => {
          this.updateCurrentSelectedInventory();
        });
      } else {
        // 兼容旧版：如果没有选中的规格，使用产品详情页的规格列表
        if (productInfo.selectedSpecs && productInfo.selectedSpecs.length > 0) {
          this.form.spec = productInfo.selectedSpecs.map(spec => ({
            specName: spec.spec,
            num: spec.quantity,
            selected: true
          }));
        } else {
          // 否则使用产品详情页的规格列表
          this.form.spec = productInfo.skuList
            ? productInfo.skuList.map(sku => ({
                specName: sku.keyVals || "默认规格",
                num: 0,
                selected: false
              }))
            : [
                {
                  specName: "默认规格",
                  num: 0,
                  selected: false
                }
              ];
        }
      }
    },

    // 更新当前选中的库存项
    updateCurrentSelectedInventory() {
      if (!this.skuLists || this.skuLists.length === 0) {
        this.currentSelectedInventory = null;
        return;
      }

      // 根据选择的选项组合匹配对应的库存
      const selectedIds = this.getSelectedOptionIds();
      if (selectedIds.length === 0) {
        this.currentSelectedInventory = null;
        return;
      }

      // 将选中的ID排序后拼接，匹配keyIds
      const keyIdsStr = selectedIds.sort((a, b) => a - b).join("-");

      // 查找匹配的库存项
      const matchedInventory = this.skuList.find(item => {
        if (!item.keyIds) return false;
        const itemKeyIds = item.keyIds
          .split("-")
          .map(id => parseInt(id))
          .sort((a, b) => a - b)
          .join("-");
        return itemKeyIds === keyIdsStr;
      });

      this.currentSelectedInventory = matchedInventory || null;
    },

    // 选择SKU选项
    selectSpecOption(groupId, optionId) {
      // 检查选项是否可用
      if (!this.isOptionAvailable(groupId, optionId)) {
        return;
      }

      // 更新选中的选项
      this.$set(this.selectedSkuOptions, groupId, optionId);

      // 等待Vue更新后，更新当前选中的库存
      this.$nextTick(() => {
        this.updateCurrentSelectedInventory();
      });
    },

    // 判断选项是否被选中
    isOptionSelected(groupId, optionId) {
      return this.selectedSkuOptions[groupId] === optionId;
    },

    // 判断选项是否可用（是否有对应的库存）
    isOptionAvailable(groupId, optionId) {
      // 构建临时选择（将当前选项替换为要检查的选项）
      const tempSelected = { ...this.selectedSkuOptions };
      tempSelected[groupId] = optionId;

      // 获取所有已选择的组ID
      const selectedGroupIds = Object.keys(tempSelected).filter(
        key => tempSelected[key] !== undefined && tempSelected[key] !== null
      );

      // 如果还没有选择所有必需的选项，检查是否有任何库存项包含这个选项
      if (selectedGroupIds.length < this.skuLists.length) {
        // 检查是否有任何库存项的keyIds包含这个选项ID
        return this.skuList.some(item => {
          if (!item.keyIds) return false;
          const itemKeyIds = item.keyIds.split("-").map(id => parseInt(id));
          return itemKeyIds.includes(parseInt(optionId)) && item.kucun > 0;
        });
      }

      // 如果所有选项都已选择，检查完整组合是否有库存
      const selectedIds = Object.values(tempSelected).filter(
        id => id !== undefined && id !== null
      );
      if (selectedIds.length === 0) {
        return true;
      }

      // 检查是否有匹配的库存
      const keyIdsStr = selectedIds
        .map(id => parseInt(id))
        .sort((a, b) => a - b)
        .join("-");
      const hasMatch = this.skuList.some(item => {
        if (!item.keyIds) return false;
        const itemKeyIds = item.keyIds
          .split("-")
          .map(id => parseInt(id))
          .sort((a, b) => a - b)
          .join("-");
        return itemKeyIds === keyIdsStr && item.kucun > 0;
      });

      return hasMatch;
    },

    // 获取已选择的选项ID列表
    getSelectedOptionIds() {
      return Object.values(this.selectedSkuOptions).filter(
        id => id !== undefined && id !== null
      );
    },

    // 获取选中选项的标题
    getSelectedOptionTitle(skuGroup) {
      const selectedId = this.selectedSkuOptions[skuGroup.id];
      if (!selectedId) {
        return "";
      }
      const selectedOption = skuGroup.child.find(
        child => child.id === selectedId
      );
      return selectedOption ? selectedOption.title : "";
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
      this.form.quantity = 0;

      // 重置规格选择
      if (this.form.spec && this.form.spec.length > 0) {
        this.form.spec.forEach(spec => {
          spec.selected = false;
          spec.num = 0;
        });
      }

      // 重置skuLists选择
      if (this.skuLists && this.skuLists.length > 0) {
        this.selectedSkuOptions = {};
        this.skuLists.forEach(skuGroup => {
          const selectedOption =
            skuGroup.child.find(child => child.is_selected === 1) ||
            (skuGroup.child.length > 0 ? skuGroup.child[0] : null);
          if (selectedOption) {
            this.$set(this.selectedSkuOptions, skuGroup.id, selectedOption.id);
          }
        });
        this.$nextTick(() => {
          this.updateCurrentSelectedInventory();
        });
      }
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
        this.$message.warning("please enter the requirements description");
        return;
      }

      // 检查是否选择了规格
      let selectedSpecs = [];
      if (this.skuLists && this.skuLists.length > 0) {
        // 使用skuLists方式
        if (!this.currentSelectedInventory || this.form.quantity <= 0) {
          this.$message.warning("please select the specification and fill in the quantity");
          return;
        }
        selectedSpecs = [
          {
            spec: this.currentSelectedInventory.keyVals || "默认规格",
            num: this.form.quantity,
            selected: true
          }
        ];
      } else {
        // 兼容旧版
        selectedSpecs = this.form.spec.filter(
          spec => spec.selected && spec.num > 0
        );
        if (selectedSpecs.length === 0) {
          this.$message.warning("please select at least one specification and fill in the quantity");
          return;
        }
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
        email: this.form.email,
        is_agree: this.form.is_agree
      };

      this.$api({
        url: "/service.php",
        method: "post",
        data: submitData
      })
        .then(res => {
          this.submitting = false;
          if (res.code === 200) {
            // 关闭咨询弹窗
            this.show_modal = false;
            // 显示成功提示弹窗
            this.$refs.product_saveInquiry_success_modal.init();
          } else {
            this.$message.error(res.message || "submission failed, please try again");
          }
        })
        .catch(error => {
          this.submitting = false;
          this.$message.error("network error, please try again");
          console.error("inquiry submission failed:", error);
        });
    },

    onBeforeClose() {
      this.show_modal = false;
    }
  }
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

          /deep/ .el-checkbox__inner {
            background-color: #ec6a2b !important;
            border-color: #ec6a2b !important;
          }
          /deep/ .el-checkbox__label {
            color: #1E262E !important;
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

        // SKU选择器样式（与product-detail.vue保持一致）
        .spec-selectors {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;

          .spec-selector-group {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .spec-selector-label {
              font-family: Poppins, Poppins;
              font-weight: 600;
              font-size: 18px;
              color: #242424;
            }

            .spec-selector-options {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;

              .spec-option-item {
                cursor: pointer;
                transition: all 0.3s;
                border-radius: 6px;
                border: 2px solid #707070;
                background: #ffffff;

                &.spec-option-color {
                  width: 80px;
                  height: 80px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;

                  .color-image {
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;

                    img {
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    }
                  }

                  span {
                    font-size: 14px;
                    color: #242424;
                  }

                  &.active {
                    border: 2px solid #ec6a2b;
                  }

                  &.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    border-color: #ccc;
                  }
                }

                &.spec-option-button {
                  padding: 10px 20px;
                  min-width: 60px;
                  text-align: center;
                  font-family: Poppins, Poppins;
                  font-weight: 400;
                  font-size: 18px;
                  color: #242424;
                  line-height: 1.5;

                  &.active {
                    background: #fff8f5;
                    border: 2px solid #ec6a2b;
                    color: #ec6a2b;
                    font-weight: bold;
                  }

                  &.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    border-color: #ccc;
                    color: #999;
                  }

                  &:hover:not(.disabled) {
                    border-color: #ec6a2b;
                  }
                }
              }
            }
          }

          .spec-quantity-input {
            display: flex;
            align-items: center;
            margin-top: 10px;

            label {
              font-size: 18px;
              color: #505050;
              margin-right: 8px;
            }

            .el-input-number {
              margin: 0 8px;
            }

            span {
              font-size: 18px;
              color: #666;
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
