<template>
  <div class="page">
    <div class="main-title flex">
      <img src="@img/my/nav-6.png" alt="" />
      <span>企业认证</span>
    </div>

    <div class="page-ctx">
      <!-- 审核状态页面 -->
      <div v-if="showReviewStatus" class="review-status">
        <div class="status-icon">
          <img src="@img/enterprise-cert/shenhe.png" alt="审核中" />
        </div>
        <div class="status-text">提交成功，审核中...</div>
      </div>

      <!-- 认证失败状态页面 -->
      <div v-if="showFailedStatus" class="failed-status">
        <div class="status-icon">
          <img src="@img/enterprise-cert/shibai.png" alt="认证失败" />
        </div>
        <div class="status-text">{{ userInfo.renzhengMsg }}</div>
        <div class="retry-section">
          <button class="retry-btn" @click="retryCertification">
            重新填写
          </button>
        </div>
      </div>
      <template v-if="isUploadDisabled">
        <div style="padding-bottom: 27px;border-bottom: 1px solid #d9d9d9;margin-bottom: 37px;">

          <p style="color: #1F1F1F; font-weight: bold; font-size: 22px">
            认证成功<img
            style="width: 22px; margin-left: 5px"
            src="@img/enterprise-cert/rz.png"
            alt=""
          />
        </p>
        <p style="color: #1F1F1F;margin-top: 10px;"v-if="isCategoryThree">
          您已通过企业认证，可购买三类医疗器械产品
        </p>
      </div>
      </template>
      <!-- 认证表单页面 -->
      <el-form
       v-if="showFormPage"
        :model="form"
        :rules="rules"
        ref="enterpriseForm"
        label-width="140px"
      >
        <div class="certification-list">
          <el-form-item label="公司类别" prop="companyType" >
            <el-select v-model="form.companyType" placeholder="请选择" :disabled="!showSubmitButton">
              <el-option
                v-for="(item,index) in companyTypeOpts"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司名称" prop="company">
            <el-input v-model="form.company" :disabled="!showSubmitButton"></el-input>
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="unified_code">
            <el-input v-model="form.unified_code" :disabled="!showSubmitButton"></el-input>
          </el-form-item>
          <!-- 营业执照 -->
          <div class="cert-item">
            <div class="cert-title">
              <span class="title-text">营业执照</span>
              <span class="required">*</span>
            </div>
            <div class="cert-content">
              <!--  -->
              <div class="upload-area">
                <el-upload
                  class="upload-demo"
                  accept="image/*"
                  :name="UPLOAD_NAME"
                  :action="UPLOAD_ACTION"
                  :data="mix_upload_data"
                  :on-success="(res) => upload_on_success(res, 'license1')"
                  :before-upload="upload_before_upload"
                  :disabled="isUploadDisabled"
                  :show-file-list="false"
                >
                  <div class="upload-box" v-if="!form.license1">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license1" alt="已上传图片" />
                    <div class="image-overlay">
                      <span class="reupload-text" v-if="!isUploadDisabled">重新上传</span>
                      <span class="reupload-text" v-if="isUploadDisabled" @click="handlePictureCardPreview(form.license1)">查看</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="sample-area" v-if="showSampleAndInstructions">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample1.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div>
              <div class="instructions" v-if="showSampleAndInstructions">
                <div class="instruction-item">支持JPG/PNG格式图片</div>
                <div class="instruction-item">不大于5M</div>
                <div class="instruction-item">彩色扫描件</div>
              </div>
            </div>
          </div>

          <!-- 医疗机构执业许可证 -->
          <div class="cert-item">
            <div class="cert-title">
              <span class="title-text">医疗机构执业许可证</span>
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
                  :disabled="isUploadDisabled"
                  :show-file-list="false"
                >
                  <div class="upload-box" v-if="!form.license2">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license2" alt="已上传图片" />
                    <div class="image-overlay">
                      <!-- <span class="reupload-text">重新上传</span> -->
                      <span class="reupload-text" v-if="!isUploadDisabled">重新上传</span>
                      <span class="reupload-text" v-if="isUploadDisabled" @click="handlePictureCardPreview(form.license2)">查看</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="sample-area" v-if="showSampleAndInstructions">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample2.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div>
              <div class="instructions" v-if="showSampleAndInstructions">
                <div class="instruction-item">支持JPG/PNG格式图片</div>
                <div class="instruction-item">不大于5M</div>
                <div class="instruction-item">彩色扫描件</div>
              </div>
            </div>
          </div>

          <!-- 诊所备案凭证 -->
          <div class="cert-item">
            <div class="cert-title">
              <span class="title-text">诊所备案凭证</span>
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
                  :disabled="isUploadDisabled"
                  :show-file-list="false"
                >
                  <div class="upload-box" v-if="!form.license3">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license3" alt="已上传图片" />
                    <div class="image-overlay">
                      <!-- <span class="reupload-text">重新上传</span> -->
                      <span class="reupload-text" v-if="!isUploadDisabled">重新上传</span>
                      <span class="reupload-text" v-if="isUploadDisabled" @click="handlePictureCardPreview(form.license3)">查看</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="sample-area" v-if="showSampleAndInstructions">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample3.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div>
              <div class="instructions" v-if="showSampleAndInstructions">
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
                  :on-success="(res) => upload_on_success(res, 'license4')"
                  :before-upload="upload_before_upload"
                  :disabled="isUploadDisabled"
                  :show-file-list="false"
                >
                  <div class="upload-box" v-if="!form.license4">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license4" alt="已上传图片" />
                    <div class="image-overlay">
                      <!-- <span class="reupload-text">重新上传</span> -->
                      <span class="reupload-text" v-if="!isUploadDisabled">重新上传</span>
                      <span class="reupload-text" v-if="isUploadDisabled" @click="handlePictureCardPreview(form.license4)">查看</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="sample-area" v-if="showSampleAndInstructions">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample4.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div>
              <div class="instructions" v-if="showSampleAndInstructions">
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
                  :on-success="(res) => upload_on_success(res, 'license5')"
                  :before-upload="upload_before_upload"
                  :disabled="isUploadDisabled"
                  :show-file-list="false"
                >
                  <div class="upload-box" v-if="!form.license5">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license5" alt="已上传图片" />
                    <div class="image-overlay">
                      <!-- <span class="reupload-text">重新上传</span> -->
                      <span class="reupload-text" v-if="!isUploadDisabled">重新上传</span>
                      <span class="reupload-text" v-if="isUploadDisabled" @click="handlePictureCardPreview(form.license5)">查看</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="sample-area" v-if="showSampleAndInstructions">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample5.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div>
              <div class="instructions" v-if="showSampleAndInstructions">
                <div class="instruction-item">支持JPG/PNG格式图片</div>
                <div class="instruction-item">不大于5M</div>
                <div class="instruction-item">彩色扫描件</div>
              </div>
            </div>
          </div>

          <!-- 动物诊疗许可证 -->
          <div class="cert-item">
            <div class="cert-title">
              <span class="title-text">动物诊疗许可证</span>
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
                  :disabled="isUploadDisabled"
                  :show-file-list="false"
                >
                  <div class="upload-box" v-if="!form.license6">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license6" alt="已上传图片" />
                    <div class="image-overlay">
                      <!-- <span class="reupload-text">重新上传</span> -->
                      <span class="reupload-text" v-if="!isUploadDisabled">重新上传</span>
                      <span class="reupload-text" v-if="isUploadDisabled" @click="handlePictureCardPreview(form.license6)">查看</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <div class="sample-area" v-if="showSampleAndInstructions">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample6.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div>
              <div class="instructions" v-if="showSampleAndInstructions">
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
                  :on-success="(res) => upload_on_success(res, 'license7')"
                  :before-upload="upload_before_upload"
                  :disabled="isUploadDisabled"
                  :show-file-list="false"
                >
                  <div class="upload-box" v-if="!form.license7">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传图片</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.license7" alt="已上传图片" />
                    <div class="image-overlay">
                      <!-- <span class="reupload-text">重新上传</span> -->
                      <span class="reupload-text" v-if="!isUploadDisabled">重新上传</span>
                      <span class="reupload-text" v-if="isUploadDisabled" @click="handlePictureCardPreview(form.license7)">查看</span>
                    </div>
                  </div>
                </el-upload>
              </div>
              <!-- <div class="sample-area">
                <div class="sample-image">
                  <img src="@img/enterprise-cert/sample7.png" alt="示例图" />
                </div>
                <div class="sample-text">示例图</div>
              </div> -->
              <div class="instructions" v-if="showSampleAndInstructions">
                <div class="instruction-item">支持JPG/PNG格式图片</div>
                <div class="instruction-item">不大于5M</div>
                <div class="instruction-item">彩色扫描件</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-section" v-if="showSubmitButton">
          <el-button
            class="btn-submit"
            @click="throttle_do_submit()"
            :loading="loading"
          >
            提交
          </el-button>
        </div>
      </el-form>
    </div>


    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env.js";

export default {
  name: "enterprise-cert",
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,
      loading: false,
      userInfo: null,
      showForm: false, // 控制是否显示表单
      companyTypeOpts:[],//公司类别

      // 证件上传数据
      form: {
        license1: "", // 营业执照
        license2: "", // 医疗机构执业许可证
        license3: "", // 诊所备案凭证
        license4: "", // 医疗器械经营许可证
        license5: "", // 第二类医疗器械经营备案凭证
        license6: "", // 动物诊疗许可证
        license7: "", // 其他证件
        companyType: "", //公司类别
      },

      // 表单验证规则
      rules: {
        companyType: [
          { required: true, message: "请选择公司类别", trigger: "change" },
        ],
         company: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
         unified_code: [
          { required: true, message: "请输入统一社会信用代码", trigger: "blur" },
        ],
        license1: [
          { required: true, message: "请上传营业执照", trigger: "change" },
        ],
      },
      dialogImageUrl: '',
      dialogVisible: false,
    };
  },
  computed: {
    // 判断是否显示审核状态页面
    showReviewStatus() {
      return (
        // this.userInfo.userType == 1 &&
        this.userInfo &&
        this.userInfo.renzheng == 1 &&
        !this.showForm
      );
    },
    // 判断是否显示认证失败状态页面
    showFailedStatus() {
        // this.userInfo.userType == 1 &&
      return (
        this.userInfo &&
        this.userInfo.renzheng == -1 &&
        !this.showForm
      );
    },
    // 判断是否显示表单页面
    showFormPage() {
      // return (
      //   this.showForm ||
      //   (this.userInfo &&
      //     this.userInfo.userType == 1 &&
      //     this.userInfo.renzheng != 1 &&
      //     this.userInfo.renzheng != -1)
      // );
       return (
        this.showForm ||
        (this.userInfo &&
          (this.userInfo.userType == 1||this.userInfo.userType == 0) &&
          this.userInfo.renzheng != 1 &&
          this.userInfo.renzheng != -1)
      );
    },
    // 判断是否显示示例区域和说明
    showSampleAndInstructions() {
      return this.userInfo && this.userInfo.renzheng != 2;
    },
    // 判断是否禁用上传功能
    isUploadDisabled() {
      return this.userInfo && this.userInfo.renzheng == 2;
    },
    // 判断是否显示提交按钮
    showSubmitButton() {
      return !(this.userInfo && this.userInfo.renzheng == 2);
    },

    isCategoryThree(){
      let show=false
      // 医疗机构执业许可证/诊所备案凭证/医疗器械经营许可证/动物诊疗许可证
      if(this.form.license1&&(this.form.license2||this.form.license3||this.form.license4|this.form.license6)){
        show=true
      }
      return show
    },
  },
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.setView();
  },
  methods: {
     handlePictureCardPreview(url) {
        this.dialogImageUrl = url;
        this.dialogVisible = true;
      },
    throttle_do_submit() {},

    setView() {
       this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "index_getCompanyType",
        },
      }).then((res) => {
        if (res.code == 200) { 
         this.companyTypeOpts=res.data
        }
      });
      // 获取已上传的证件信息
      this.query_certification_data();
     
    },

    query_certification_data() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo",
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.userInfo = data;
          this.form = {
            license1: data.license1 || "",
            license2: data.license2 || "",
            license3: data.license3 || "",
            license4: data.license4 || "",
            license5: data.license5 || "",
            license6: data.license6 || "",
            license7: data.license7 || "",
            companyType:data.companyType||"",
            company:data.company||"",
            unified_code:data.unified_code||"",
          };
          this.showForm = data.renzheng == 2;
        }
      });
    },

    do_submit() {
      // 使用el-form验证
      this.$refs.enterpriseForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$api({
            url: "/service.php",
            method: "post",
            data: {
              action: "users_renzheng",
              ...this.form,
              userType:1,
            },
          }).then((res) => {
            let { code, msg, data } = res;
            alert(res).then(() => {
              this.loading = false;
            });
            if (code == 200) {
              this.showForm = false;
              this.setView();
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
          this.$refs.enterpriseForm.validateField(field);
        });
      }
    },

    upload_before_upload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5; // 文件大小限制5M
      if (!isLt5M) {
        alertErr("上传文件大小不能超过 5MB!");
        return false;
      }

      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        alertErr("上传文件只能是 JPG/PNG 格式!");
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
        license7: "",
      };

      // 显示表单页面
      this.showForm = true;
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    img {
      width: 22px;
      margin-right: 10px;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 40px 32px;
    background: #fff;
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
      width: 120px;
      height: 120px;
      object-fit: contain;
    }
  }

  .status-text {
    font-size: 18px;
    font-weight: 500;
    color: #1F1F1F;
    line-height: 1.4;
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
      width: 120px;
      height: 120px;
      object-fit: contain;
    }
  }

  .status-text {
    font-size: 18px;
    font-weight: 500;
    color: #1F1F1F;
    line-height: 1.4;
    margin-bottom: 30px;
    max-width: 500px;
    word-wrap: break-word;
  }

  .retry-section {
    .retry-btn {
      width: 150px;
      height: 46px;
      background: #7853b2;
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
    margin-bottom: 30px;
    padding-bottom: 20px;
    //  border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .cert-title {
      width: 100%;
      margin-bottom: 15px;
      display: flex;
      align-items: center;

      .title-text {
        font-size: 14px;
        font-weight: 500;
        color: #1F1F1F;
        line-height: 1.4;
      }

      .required {
        color: #ff4d4f;
        margin-left: 4px;
        font-size: 14px;
      }
    }

    .cert-content {
      display: flex;
      align-items: flex-start;
    }

    .upload-area {
      width: 200px;
      margin-right: 20px;
      flex-shrink: 0;

      .upload-box {
        width: 200px;
        height: 200px;
        border: 2px dashed #be9bdf;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background: #fff;

        &:hover {
          border-color: #7853b2;
          background: #f7efff;
        }

        .upload-icon {
          font-size: 32px;
          color: #505050;
          margin-bottom: 8px;
        }

        .upload-text {
          font-size: 12px;
          color: #1F1F1F;
        }
      }

      .uploaded-image {
        position: relative;
        width: 200px;
        height: 200px;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
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
            font-size: 12px;
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
      margin-right: 20px;
      flex-shrink: 0;

      .sample-image {
        width: 200px;
        height: 200px;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
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
        font-size: 12px;
        color: #505050;
        text-align: center;
        margin-top: 8px;
      }
    }

    .instructions {
      flex: 1;
      padding-top: 5px;

      .instruction-item {
        font-size: 12px;
        color: #1F1F1F;
        line-height: 1.5;
        margin-bottom: 3px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

.submit-section {
  margin-top: 60px;
  // text-align: center;

  .btn-submit {
    width: 200px;
    height: 48px;
    background: #7853b2;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      background: #6b46a3;
    }

    &:disabled {
      background: #cccccc;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
</style>
