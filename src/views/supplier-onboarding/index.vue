<template>
  <div class="page">
    <div class="page-ctx w-1400">
      <div class="main-title flex">
        <span>BECOME MEDOOO'S SUPPLIER</span>
      </div>

      <!-- 认证表单页面 -->
      <el-form v-if="showFormPage" :model="form" :rules="rules" ref="supplierForm" label-width="0">
        <!-- 证件上传部分 - 暂时隐藏 -->
        <div class="certification-list" v-if="false">
          <!-- 营业执照 -->
          <div class="cert-item">
            <div class="cert-title">
              <span class="title-text">营业执照</span>
              <span class="required">*</span>
            </div>
            <div class="cert-content">
              <div class="upload-area">
                <el-upload
                  class="upload-demo"
                  accept="image/*"
                  :name="UPLOAD_NAME"
                  :action="UPLOAD_ACTION"
                  :data="mix_upload_data"
                  :on-success="(res) => upload_on_success(res, 'license1')"
                  :before-upload="upload_before_upload"
                >
                  <div class="upload-box" v-if="!form.license1">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license1" alt="已上传图片" />
                    <div class="image-overlay">
                      <span class="reupload-text">重新上传</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="sample-area">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample1.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div>
              <div class="instructions">
                <div class="instruction-item">支持JPG/PNG格式图片</div>
                <div class="instruction-item">不大于5M</div>
                <div class="instruction-item">彩色扫描件</div>
              </div>
            </div>
          </div>

          <!-- 医疗器械生产许可证 -->
          <div class="cert-item">
            <div class="cert-title">
              <span class="title-text">医疗器械生产许可证</span>
            </div>
            <div class="cert-content">
              <div class="upload-area">
                <el-upload
                  class="upload-demo"
                  accept="image/*"
                  :name="UPLOAD_NAME"
                  :action="UPLOAD_ACTION"
                  :data="mix_upload_data"
                  :on-success="(res) => upload_on_success(res, 'license2')"
                  :before-upload="upload_before_upload"
                >
                  <div class="upload-box" v-if="!form.license2">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license2" alt="已上传图片" />
                    <div class="image-overlay">
                      <span class="reupload-text">重新上传</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="sample-area">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample2.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div>
              <div class="instructions">
                <div class="instruction-item">支持JPG/PNG格式图片</div>
                <div class="instruction-item">不大于5M</div>
                <div class="instruction-item">彩色扫描件</div>
              </div>
            </div>
          </div>

          <!-- 医疗器械经营许可证 -->
          <div class="cert-item">
            <div class="cert-title">
              <span class="title-text">医疗器械经营许可证</span>
            </div>
            <div class="cert-content">
              <div class="upload-area">
                <el-upload
                  class="upload-demo"
                  accept="image/*"
                  :name="UPLOAD_NAME"
                  :action="UPLOAD_ACTION"
                  :data="mix_upload_data"
                  :on-success="(res) => upload_on_success(res, 'license3')"
                  :before-upload="upload_before_upload"
                >
                  <div class="upload-box" v-if="!form.license3">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license3" alt="已上传图片" />
                    <div class="image-overlay">
                      <span class="reupload-text">重新上传</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="sample-area">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample3.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div>
              <div class="instructions">
                <div class="instruction-item">支持JPG/PNG格式图片</div>
                <div class="instruction-item">不大于5M</div>
                <div class="instruction-item">彩色扫描件</div>
              </div>
            </div>
          </div>

          <!-- 第二类医疗器械经营备案凭证 -->
          <div class="cert-item">
            <div class="cert-title">
              <span class="title-text">第二类医疗器械经营备案凭证</span>
            </div>
            <div class="cert-content">
              <div class="upload-area">
                <el-upload
                  class="upload-demo"
                  accept="image/*"
                  :name="UPLOAD_NAME"
                  :action="UPLOAD_ACTION"
                  :data="mix_upload_data"
                  :on-success="(res) => upload_on_success(res, 'license4')"
                  :before-upload="upload_before_upload"
                >
                  <div class="upload-box" v-if="!form.license4">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license4" alt="已上传图片" />
                    <div class="image-overlay">
                      <span class="reupload-text">重新上传</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="sample-area">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample4.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div>
              <div class="instructions">
                <div class="instruction-item">支持JPG/PNG格式图片</div>
                <div class="instruction-item">不大于5M</div>
                <div class="instruction-item">彩色扫描件</div>
              </div>
            </div>
          </div>

          <!-- 医疗器械注册证 -->
          <div class="cert-item">
            <div class="cert-title">
              <span class="title-text">医疗器械注册证</span>
            </div>
            <div class="cert-content">
              <div class="upload-area">
                <el-upload
                  class="upload-demo"
                  accept="image/*"
                  :name="UPLOAD_NAME"
                  :action="UPLOAD_ACTION"
                  :data="mix_upload_data"
                  :on-success="(res) => upload_on_success(res, 'license5')"
                  :before-upload="upload_before_upload"
                >
                  <div class="upload-box" v-if="!form.license5">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license5" alt="已上传图片" />
                    <div class="image-overlay">
                      <span class="reupload-text">重新上传</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="sample-area">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample5.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div>
              <div class="instructions">
                <div class="instruction-item">支持JPG/PNG格式图片</div>
                <div class="instruction-item">不大于5M</div>
                <div class="instruction-item">彩色扫描件</div>
              </div>
            </div>
          </div>

          <!-- 其他证件 -->
          <div class="cert-item">
            <div class="cert-title">
              <span class="title-text">其他证件</span>
            </div>
            <div class="cert-content">
              <div class="upload-area">
                <el-upload
                  class="upload-demo"
                  accept="image/*"
                  :name="UPLOAD_NAME"
                  :action="UPLOAD_ACTION"
                  :data="mix_upload_data"
                  :on-success="(res) => upload_on_success(res, 'license6')"
                  :before-upload="upload_before_upload"
                >
                  <div class="upload-box" v-if="!form.license6">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license6" alt="已上传图片" />
                    <div class="image-overlay">
                      <span class="reupload-text">重新上传</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="instructions">
                <div class="instruction-item">支持JPG/PNG格式图片</div>
                <div class="instruction-item">不大于5M</div>
                <div class="instruction-item">彩色扫描件</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 表单字段 -->
        <div class="form-fields">
          <div class="form-columns">
            <!-- 左侧列：公司信息 -->
            <div class="form-column left-column">
              <div class="field-row">
                <div class="field-item">
                  <div class="field-label">Company Name:</div>
                  <el-form-item prop="companyName">
                    <el-input v-model="form.companyName" placeholder="Please enter" clearable></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="field-row">
                <div class="field-item">
                  <div class="field-label">Business Number:</div>
                  <el-form-item prop="bankAccount">
                    <el-input v-model="form.bankAccount" placeholder="Please enter" clearable></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="field-row">
                <div class="field-item">
                  <div class="field-label">Phone Number:</div>
                  <el-form-item prop="mobile">
                    <el-input v-model="form.mobile" placeholder="Please enter" clearable></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="field-row">
                <div class="field-item">
                  <div class="field-label">Email:</div>
                  <el-form-item prop="wechat">
                    <el-input v-model="form.wechat" placeholder="Please enter" clearable></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="field-row">
                <div class="field-item textarea-field">
                  <div class="field-label">Company Address:</div>
                  <el-form-item prop="bankName">
                    <el-input
                      v-model="form.bankName"
                      type="textarea"
                      :rows="3"
                      placeholder="Please enter"
                      clearable
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>

            <!-- 右侧列：产品信息 -->
            <div class="form-column right-column">
              <div class="field-row">
                <div class="field-item">
                  <div class="field-label">Product Name:</div>
                  <el-form-item prop="productName">
                    <el-input v-model="form.productName" placeholder="Please enter" clearable></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="field-row">
                <div class="field-item textarea-field">
                  <div class="field-label">Specification Description:</div>
                  <el-form-item prop="specDesc">
                    <el-input
                      v-model="form.specDesc"
                      type="textarea"
                      :rows="3"
                      placeholder="Please enter"
                      clearable
                    ></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="field-row">
                <div class="field-item">
                  <div class="field-label">Supply Price:</div>
                  <el-form-item prop="supplyPrice">
                    <el-upload
                      class="upload-demo"
                      :name="UPLOAD_NAME"
                      :action="UPLOAD_ACTION"
                      :data="mix_upload_data"
                      :on-preview="handlePreview"
                      :before-upload="beforeAvatarUpload"
                      :on-remove="on_remove_supplyPrice"
                      multiple
                      :on-success="on_success_supplyPrice"
                      :file-list="supplyPrice"
                    >
                      <img src="@img/common/upload.png" alt />
                      <div
                        slot="tip"
                        class="el-upload__tip"
                      >Can upload Word, Excel, PDF (PDF can be previewed)</div>
                    </el-upload>
                  </el-form-item>
                </div>
              </div>

              <div class="field-row">
                <div class="field-item">
                  <div class="field-label">Suggested Retail Price:</div>
                  <el-form-item prop="salePrice">
                    <el-upload
                      class="upload-demo"
                      :name="UPLOAD_NAME"
                      :action="UPLOAD_ACTION"
                      :data="mix_upload_data"
                      :on-preview="handlePreview"
                      :before-upload="beforeAvatarUpload"
                      :on-remove="on_remove_salePrice"
                      multiple
                      :on-success="on_success_salePrice"
                      :file-list="salePrice"
                    >
                      <img src="@img/common/upload.png" alt />
                      <div
                        slot="tip"
                        class="el-upload__tip"
                      >Can upload Word, Excel, PDF (PDF can be previewed)</div>
                    </el-upload>
                  </el-form-item>
                </div>
              </div>

              <div class="field-row">
                <div class="field-item">
                  <div class="field-label">Is it possible to ship products to customers directly?</div>
                  <el-form-item prop="dropshipping">
                    <el-radio-group v-model="form.dropshipping">
                      <el-radio :label="1">YES</el-radio>
                      <el-radio :label="0">NO</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>

          <!-- 注释掉的字段 -->
          <!-- <div class="field-row">
             <div class="field-item">
               <div class="field-label">开户银行全称</div>
               <el-form-item prop="bankName">
                 <el-input
                   v-model="form.bankName"
                   placeholder="请输入开户银行全称"
                   clearable
                 ></el-input>
               </el-form-item>
             </div>
          </div>-->
        </div>

        <!-- 提交按钮 -->
        <div class="submit-section">
          <el-button class="btn-submit" @click="throttle_do_submit()" :loading="loading">SUBMIT</el-button>
        </div>
      </el-form>
      <!-- 审核状态页面 -->
      <div v-else class="review-status">
        <div class="status-icon">
          <img src="@img/product/product-add-success.png" alt="审核中" />
        </div>
        <div class="status-text">
          Your application has been successfully submitted!
          <br />Please wait for MEDOOO review...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env.js";

export default {
  name: "supplier-onboarding",
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,
      loading: false,
      userInfo: null,
      showForm: false, // 控制是否显示表单
      supplyPrice: [],
      salePrice: [],
      // 表单数据
      form: {
        // 证件上传
        license1: "", // 营业执照
        license2: "", // 医疗器械生产许可证
        license3: "", // 医疗器械经营许可证
        license4: "", // 第二类医疗器械经营备案凭证
        license5: "", // 医疗器械注册证
        license6: "", // 其他证件

        // 基本信息
        companyName: "", // 公司名称
        productName: "", // 产品品名
        specDesc: "", // 规格描述
        supplyPrice: "", // 供应价
        salePrice: "", // 建议售价
        dropshipping: 0, // 可否一件代发：1=是，0=否
        bankName: "", // 开户银行全称
        bankAccount: "", // 开户银行账户
        mobile: "", // 联系电话
        wechat: "" // 微信号
      },

      // 表单验证规则
      rules: {
        license1: [
          { required: true, message: "请上传营业执照", trigger: "change" }
        ],
        companyName: [
          {
            required: true,
            message: "Please enter company name",
            trigger: "blur"
          }
        ],
        productName: [
          {
            required: true,
            message: "Please enter product name",
            trigger: "blur"
          }
        ],
        specDesc: [
          {
            required: true,
            message: "Please enter specification description",
            trigger: "blur"
          }
        ],
        supplyPrice: [
          {
            required: true,
            message: "Please upload supply price",
            trigger: "blur"
          }
        ],
        salePrice: [
          {
            required: true,
            message: "Please upload suggested retail price",
            trigger: "blur"
          }
        ],
        bankName: [
          {
            required: true,
            message: "Please enter company address",
            trigger: "blur"
          }
        ],
        bankAccount: [
          {
            required: true,
            message: "Please enter business number",
            trigger: "blur"
          }
        ],
        // mobile: [
        //   {
        //     required: true,
        //     message: "Please enter phone number",
        //     trigger: "blur"
        //   },
        //   {
        //     pattern: /^1[3-9]\d{9}$/,
        //     message: "Please enter a valid phone number",
        //     trigger: "blur"
        //   }
        // ],
        wechat: [
          { required: true, message: "Please enter email", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    // 判断是否显示审核状态页面
    showReviewStatus() {
      return (
        this.userInfo &&
        this.userInfo.userType == 1 &&
        this.userInfo.renzheng == 1 &&
        !this.showForm
      );
    },

    // 判断是否显示表单页面
    showFormPage() {
      return (
        this.showForm ||
        (this.userInfo &&
          this.userInfo.userType == 1 &&
          this.userInfo.renzheng != 1 &&
          this.userInfo.renzheng != -1)
      );
    }
  },
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    // this.setView();
    this.showForm = true;
  },
  methods: {
    //通用的文件点击
    handlePreview(file) {
      console.log(file);
      if ((file.response || {}).data) {
        window.open(file.response.data);
      } else {
      }
    },
    //通用上传前的回调
    beforeAvatarUpload(file) {
      let type = file.name.split(".");
      let name = type[type.length - 1];
      console.log("name", name);
      let show_up = false;
      if (
        name == "docx" ||
        name == "doc" ||
        name == "pdf" ||
        name == "xlsx" ||
        name == "cvs"
      ) {
        show_up = true;
      } else {
        this.$message.error(
          "Uploaded files can only be word/excel/pdf format!"
        );
      }
      return show_up;
    },
    on_success_supplyPrice(res, file, fileList) {
      console.log("fileList", fileList);
      let supplyPrice = [];
      fileList.forEach(e => {
        if (e.response) {
          supplyPrice.push(e.response.data);
        } else {
        }
      });
      this.form.supplyPrice = supplyPrice.join(",");
    },
    on_remove_supplyPrice(file, fileList) {
      console.log(file, fileList);
      let supplyPrice = [];
      fileList.forEach(e => {
        if (e.response) {
          supplyPrice.push(e.response.data);
        } else {
        }
      });
      this.form.supplyPrice = supplyPrice.join(",");
    },

    on_success_salePrice(res, file, fileList) {
      console.log("fileList", fileList);
      let salePrice = [];
      fileList.forEach(e => {
        if (e.response) {
          salePrice.push(e.response.data);
        } else {
        }
      });
      this.form.salePrice = salePrice.join(",");
    },
    on_remove_salePrice(file, fileList) {
      console.log(file, fileList);
      let salePrice = [];
      fileList.forEach(e => {
        if (e.response) {
          salePrice.push(e.response.data);
        } else {
        }
      });
      this.form.salePrice = salePrice.join(",");
    },

    throttle_do_submit() {},

    setView() {
      // 获取已上传的证件信息
      this.query_certification_data();
    },

    // query_certification_data() {
    //   this.$api({
    //     url: "/service.php",
    //     method: "get",
    //     data: {
    //       action: "users_userInfo",
    //     },
    //   }).then((res) => {
    //     if (res.code == 200) {
    //       let data = res.data;
    //       this.userInfo = data;
    //       this.form = {
    //         license1: data.license1 || "",
    //         license2: data.license2 || "",
    //         license3: data.license3 || "",
    //         license4: data.license4 || "",
    //         license5: data.license5 || "",
    //         license6: data.license6 || "",
    //         companyName: data.companyName || "",
    //         productName: data.productName || "",
    //         specDesc: data.specDesc || "",
    //         supplyPrice: data.supplyPrice || "",
    //         salePrice: data.salePrice || "",
    //         dropshipping: data.dropshipping || 0,
    //         bankName: data.bankName || "",
    //         bankAccount: data.bankAccount || "",
    //         mobile: data.mobile || "",
    //         wechat: data.wechat || "",
    //       };
    //       this.showForm = data.renzheng == 2;
    //     }
    //   });
    // },

    do_submit() {
      // 使用el-form验证
      this.$refs.supplierForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$api({
            url: "/service.php",
            method: "post",
            data: {
              action: "users_saveSupplier",
              ...this.form
            }
          }).then(res => {
            let { code, msg, data } = res;
            alert(res).then(() => {
              this.loading = false;
            });
            if (code == 200) {
              this.showForm = false;
              // this.setView();
            }
          });
        } else {
          return false;
        }
      });
    },

    // 上传相关
    upload_on_success(res, field) {
      let { code, data, msg } = res;
      alert(res);
      if (code == 200) {
        this.form[field] = res.data;
        // 触发表单验证
        this.$nextTick(() => {
          this.$refs.supplierForm.validateField(field);
        });
      }
    },

    upload_before_upload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5; // 文件大小限制5M
      if (!isLt5M) {
        alertErr("The uploaded file size cannot exceed 5MB!");
        return false;
      }

      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        alertErr("The uploaded file can only be JPG/PNG format!");
        return false;
      }

      return true;
    },

    // 重新填写认证信息
    retryCertification() {
      // 清空表单数据
      this.form = {
        license1: "",
        license2: "",
        license3: "",
        license4: "",
        license5: "",
        license6: "",
        companyName: "",
        productName: "",
        specDesc: "",
        supplyPrice: "",
        salePrice: "",
        dropshipping: 0,
        bankName: "",
        bankAccount: "",
        mobile: "",
        wechat: ""
      };

      // 显示表单页面
      this.showForm = true;
    }
  }
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;
  padding-top: 20px;
  background: #f5f5f5;
  min-height: 100vh;

  .main-title {
    justify-content: center;
    padding: 20px 0;
    background: transparent;
    font-family: Poppins, Poppins;
    font-size: 40px;
    font-weight: 600;
    border-bottom: none;
    margin-bottom: 40px;
    color: #1e262e;
  }

  .page-ctx {
    padding: 40px 60px;
    background: #fff;
    border-radius: 0;
    box-shadow: none;
  }
}

// 审核状态页面样式
.review-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;

  .status-icon {
    margin-bottom: 30px;

    img {
      width: 70px;
      height: 70px;
      object-fit: contain;
    }
  }

  .status-text {
    font-family: Poppins, Poppins;
    font-weight: 600;
    font-size: 22px;
    color: #1e262e;
    text-align: center;
    line-height: 35px;
  }
}

// 认证失败状态页面样式
.failed-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;

  .status-icon {
    margin-bottom: 30px;

    img {
      width: 70px;
      height: 70px;
      object-fit: contain;
    }
  }

  .status-text {
    font-family: Poppins, Poppins;
    font-weight: 600;
    font-size: 22px;
    color: #1e262e;
    text-align: center;
  }

  .retry-section {
    .retry-btn {
      width: 150px;
      height: 46px;
      background: #00306b;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background: #6a4a9e;
      }

      &:active {
        background: #5d4190;
      }
    }
  }
}

.certification-list {
  .cert-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .cert-title {
      width: 100%;
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .title-text {
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        line-height: 1.4;
      }

      .required {
        color: #ff4d4f;
        margin-left: 4px;
        font-size: 16px;
      }
    }

    .cert-content {
      display: flex;
      align-items: flex-start;
      gap: 30px;
    }

    .upload-area {
      width: 200px;
      flex-shrink: 0;

      .upload-box {
        width: 200px;
        height: 200px;
        border: 2px dashed #be9bdf;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background: #fff;

        &:hover {
          border-color: #00306b;
          background: #f7efff;
        }

        .upload-icon {
          font-size: 40px;
          color: #be9bdf;
          margin-bottom: 12px;
        }

        .upload-text {
          font-size: 14px;
          color: #1f1f1f;
        }
      }

      .uploaded-image {
        position: relative;
        width: 200px;
        height: 200px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;

          .reupload-text {
            color: #ffffff;
            font-size: 14px;
            font-weight: 500;
          }
        }

        &:hover .image-overlay {
          opacity: 1;
        }
      }
    }

    .sample-area {
      width: 200px;
      flex-shrink: 0;

      .sample-image {
        width: 200px;
        height: 200px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        overflow: hidden;
        background: #f9f9f9;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 177px;
        }
      }

      .sample-text {
        font-size: 14px;
        color: #505050;
        text-align: center;
        margin-top: 12px;
      }
    }

    .instructions {
      flex: 1;
      padding-top: 10px;

      .instruction-item {
        font-size: 14px;
        color: #1f1f1f;
        line-height: 1.6;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// 表单字段样式
.form-fields {
  margin-top: 0;
  padding-top: 0;

  .form-columns {
    display: flex;
    gap: 60px;
    align-items: flex-start;
  }

  .form-column {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .field-row {
    display: flex;
    margin-bottom: 30px;

    .field-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .field-label {
        font-size: 20px;
        color: #1e262e;
        font-weight: 400;
        line-height: 18px;
        margin-bottom: 4px;
        &::before {
          content: "*";
          color: #ff0000;
          margin-right: 4px;
        }
      }

      /deep/ .el-input__inner {
        font-size: 20px;
      }

      &.textarea-field {
        align-items: flex-start;

        .field-label {
          margin-top: 0;
        }
      }

      .el-form-item {
        margin-bottom: 0;
        flex: 1;
        width: 100%;

        .el-form-item__content {
          line-height: normal;
        }

        .el-input,
        .el-textarea {
          width: 100%;
          /deep/ .el-input__inner,
          /deep/ .el-textarea__inner {
            font-size: 20px;

            &::placeholder {
              color: #999;
            }

            &:focus {
              border-color: #ff6b35;
            }
          }

          .el-textarea__inner {
            height: auto;
            line-height: 1.5;
            padding: 12px 16px;
            min-height: 100px;
            resize: vertical;
          }
        }

        .el-upload {
          width: 100%;
        }

        .el-upload-dragger {
          width: 100%;
          height: 140px;
          border: 1px dashed #d4d4d4;
          border-radius: 6px;
          background: #fbfbfb;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #ff6b35;
            background: #fff5f2;
          }
        }

        .el-upload__tip {
          font-size: 20px;
          color: #999;
          margin-top: 8px;
          text-align: left;
        }

        .el-button--small {
          padding: 8px 20px;
          font-size: 20px;
          border-radius: 4px;
        }

        .el-button--primary {
          background-color: #ff6b35;
          border-color: #ff6b35;

          &:hover {
            background-color: #e55a2b;
            border-color: #e55a2b;
          }
        }

        .el-input-group__append {
          background-color: #f5f7fa;
          color: #909399;
          border: 1px solid #dcdfe6;
          border-left: 0;
        }

        .el-radio-group {
          .el-radio {
            margin-right: 40px;
            margin-bottom: 0;

            /deep/ .el-radio__label {
              font-size: 20px;
              color: #1e262e;
              padding-left: 8px;
            }

            .el-radio__input.is-checked .el-radio__inner {
              background-color: #ff6b35;
              border-color: #ff6b35;
            }

            .el-radio__input.is-checked + .el-radio__label {
              color: #ff6b35;
            }
          }
        }
      }
    }
  }
}

.submit-section {
  margin-top: 50px;
  text-align: center;
  padding-bottom: 40px;

  .btn-submit {
    width: 200px;
    height: 50px;
    background: #ff6b35;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
    text-align: center;
    text-transform: uppercase;
    font-family: Poppins, Poppins;

    &:hover:not(:disabled) {
      background: #e55a2b;
    }

    &:active:not(:disabled) {
      background: #cc4f24;
    }

    &:disabled {
      background: #cccccc;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}

.upload-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  img {
    width: 115px;
    height: 115px;
  }
}
</style>
