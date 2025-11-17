<template>
  <div class="page">
    <div class="service-img">
      <h1>服务中心</h1>
      <p>Service Center</p>
    </div>
    <pageBreadcrumb :option="nav_option" />
    <div class="inner">
      <div class="page-ctx">
        <div class="custom-order-form">
          <el-form
            ref="customForm"
            :model="formData"
            :rules="formRules"
            label-width="120px"
            class="custom-form"
          >
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item prop="company" label="您的单位">
                  <el-input
                    v-model="formData.company"
                    placeholder="请输入"
                    class="form-input"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="title" label="您的称呼">
                  <el-input
                    v-model="formData.title"
                    placeholder="请输入"
                    class="form-input"
                  >
                  </el-input></el-form-item
              ></el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item prop="region" label="您的地域">
                  <el-select
                    v-model="formData.region"
                    placeholder="请选择所在地区"
                    class="form-input"
                  >
                    <el-option label="北京" value="beijing"></el-option>
                    <el-option label="上海" value="shanghai"></el-option>
                    <el-option label="广州" value="guangzhou"></el-option>
                    <el-option label="深圳" value="shenzhen"></el-option>
                    <el-option label="其他" value="other"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="phone" label="您的电话">
                  <el-input
                    v-model="formData.phone"
                    placeholder="请输入手机号"
                    class="form-input"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item prop="email" label="您的邮箱">
                  <el-input
                    v-model="formData.email"
                    placeholder="请输入"
                    class="form-input"
                  >
                  </el-input> </el-form-item
              ></el-col>
              <el-col :span="12">
                <el-form-item prop="requirements" label="您的需求">
                  <el-input
                    v-model="formData.requirements"
                    placeholder="请输入"
                    class="form-input"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="上传文件">
              <div class="upload-section">
                <div
                  class="upload-area"
                  @click="triggerFileUpload"
                  @drop="handleFileDrop"
                  @dragover.prevent
                  @dragenter.prevent
                >
                  <div class="upload-icon">
                    <i class="el-icon-upload2"></i>
                  </div>
                  <el-button type="primary" class="upload-btn"
                    >点击上传</el-button
                  >
                  <p class="upload-text">或直接拖到这里</p>
                  <p class="upload-tip">
                    可添加JPG、PNG、PDF文件,大小限制10M以内
                  </p>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  style="display: none"
                  @change="handleFileSelect"
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <div v-if="uploadedFiles.length > 0" class="file-list">
                  <div
                    v-for="(file, index) in uploadedFiles"
                    :key="index"
                    class="file-item"
                  >
                    <i class="el-icon-document"></i>
                    <span class="file-name">{{ file.name }}</span>
                    <i class="el-icon-close" @click="removeFile(index)"></i>
                  </div>
                </div>
              </div>
            </el-form-item>

            <div class="form-actions">
              <el-button type="primary" @click="submitForm" class="submit-btn"
                >提交</el-button
              >
            </div>
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
        { title: "非标定制", route: "/custom-order" },
      ],
      formData: {
        company: "",
        region: "",
        email: "",
        title: "",
        phone: "",
        requirements: "",
      },
      formRules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号格式",
            trigger: "blur",
          },
        ],
        email: [
          { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
        ],
      },
      uploadedFiles: [],
    };
  },
  methods: {
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const files = Array.from(event.target.files);
      this.processFiles(files);
    },
    handleFileDrop(event) {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);
      this.processFiles(files);
    },
    processFiles(files) {
      files.forEach((file) => {
        // 检查文件类型
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "application/pdf",
        ];
        if (!allowedTypes.includes(file.type)) {
          this.$message.error("只支持JPG、PNG、PDF格式的文件");
          return;
        }

        // 检查文件大小 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          this.$message.error("文件大小不能超过10MB");
          return;
        }

        this.uploadedFiles.push(file);
      });
    },
    removeFile(index) {
      this.uploadedFiles.splice(index, 1);
    },
    submitForm() {
      this.$refs.customForm.validate((valid) => {
        if (valid) {
          // 这里可以添加提交逻辑
          console.log("表单数据:", this.formData);
          console.log("上传文件:", this.uploadedFiles);
          this.$message.success("提交成功！我们会尽快与您联系");
        } else {
          this.$message.error("请检查表单信息");
        }
      });
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

.custom-order-form {
  margin-top: 80px;

  .custom-form {
    .form-row {
      display: flex;
      gap: 40px;
      margin-bottom: 30px;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 20px;
      }
    }

    .form-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-input {
      width: 100%;

      .el-input__inner {
        height: 50px;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        font-size: 14px;
        padding: 0 15px;
        transition: all 0.3s ease;

        &:focus {
          border-color: #409eff;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
        }
      }

      .el-select {
        width: 100%;

        .el-input__inner {
          height: 50px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          font-size: 14px;
          padding: 0 15px;
        }
      }
    }

    // Element UI 表单标签样式
    .el-form-item__label {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      line-height: 50px;
      padding: 0;
      text-align: left;

      &::before {
        content: "";
        display: none;
      }
    }

    .el-form-item {
      margin-bottom: 20px;

      .el-form-item__content {
        line-height: 50px;
      }
    }

    .upload-section {
      .upload-area {
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        padding: 40px 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background: #fafafa;

        &:hover {
          border-color: #409eff;
          background: #f0f9ff;
        }

        .upload-icon {
          font-size: 48px;
          color: #c0c4cc;
          margin-bottom: 20px;

          i {
            font-size: 48px;
          }
        }

        .upload-btn {
          margin-bottom: 15px;
          padding: 10px 30px;
          border-radius: 6px;
          background: #96a5c3;
          border-color: #96a5c3;
        }

        .upload-text {
          font-size: 14px;
          color: #666;
          margin: 0 0 10px 0;
        }

        .upload-tip {
          font-size: 12px;
          color: #999;
          margin: 0;
        }
      }

      .file-list {
        margin-top: 15px;

        .file-item {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          background: #f8f9fa;
          border-radius: 6px;
          margin-bottom: 8px;
          border: 1px solid #e9ecef;

          .el-icon-document {
            color: #409eff;
            margin-right: 10px;
            font-size: 16px;
          }

          .file-name {
            flex: 1;
            font-size: 14px;
            color: #333;
            margin-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .el-icon-close {
            color: #f56c6c;
            cursor: pointer;
            font-size: 16px;

            &:hover {
              color: #f56c6c;
            }
          }
        }
      }
    }

    .form-actions {
      text-align: center;
      margin-top: 40px;
      margin-left: 120px;

      .submit-btn {
        padding: 15px 50px;
        font-size: 16px;
        border-radius: 6px;
        background: #2e4c87;
        border: none;
        font-weight: 500;
        min-width: 120px;

        &:hover {
          background: #2e4c87;
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
