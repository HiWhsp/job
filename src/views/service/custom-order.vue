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
                <el-form-item prop="name" label="您的称呼">
                  <el-input
                    v-model="formData.name"
                    placeholder="请输入"
                    class="form-input"
                  >
                  </el-input></el-form-item
              ></el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item prop="areaId" label="您的地域">
                  <el-cascader
                    v-model="formData.areaId"
                    :options="regionOptions"
                    :props="cascaderProps"
                    placeholder="请选择所在地区"
                    class="form-input"
                    clearable
                    filterable
                  ></el-cascader>
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
                <el-form-item prop="content" label="您的需求">
                  <el-input
                    v-model="formData.content"
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
                    <span v-if="file.status === 'uploading'" class="upload-status">
                      上传中...
                    </span>
                    <span v-else-if="file.status === 'success'" class="upload-status success">
                       上传成功
                    </span>
                    <span v-else-if="file.status === 'error'" class="upload-status error">
                       上传失败
                    </span>
                    <i class="el-icon-close" @click="removeFile(index)" v-if="file.status !== 'uploading'"></i>
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
import axios from "axios";
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
        areaId: [],
        email: "",
        name: "",
        phone: "",
        content: "",
      },
      regionOptions: [],
      cascaderProps: {
        value: "id",
        label: "name",
        children: "child",
        expandTrigger: "hover",
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
  mounted() {
    this.getAreaData();
  },
  methods: {
    // 获取地区数据
    getAreaData() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "index_getArea",
        },
      }).then((res) => {
        if (res.code === 200 && res.data) {
          // 将数据转换为级联选择器需要的格式
          this.regionOptions = this.formatAreaData(res.data);
        }
      }).catch((err) => {
        console.error("获取地区数据失败:", err);
      });
    },
    // 格式化地区数据为级联选择器格式
    formatAreaData(data) {
      if (!Array.isArray(data)) {
        return [];
      }
      return data.map((item) => {
        const formatted = {
          id: item.id,
          name: item.name,
          code: item.code,
        };
        if (item.child && Array.isArray(item.child) && item.child.length > 0) {
          formatted.child = this.formatAreaData(item.child);
        }
        return formatted;
      });
    },
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const files = Array.from(event.target.files);      this.processFiles(files);
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

        // 添加到上传列表，状态为上传中
        const fileItem = {
          name: file.name,
          file: file,
          url: "",
          status: "uploading",
        };
        this.uploadedFiles.push(fileItem);

        // 调用上传接口
        this.uploadFile(fileItem);
      });
    },
    // 上传文件到服务器
    uploadFile(fileItem) {
      const formData = new FormData();
      formData.append("img", fileItem.file);
      formData.append("action", "index_localUpload");
      
      const userId = localStorage.getItem("userId") || "";
      const token = localStorage.getItem("token") || "";
      if (userId) formData.append("userId", userId);
      if (token) formData.append("token", token);

      const uploadUrl = process.env.NODE_ENV !== "production"
        ? "/api/service.php"
        : "https://xintian.dx.hdapp.com.cn/service.php";

      axios({
        url: uploadUrl,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          // axios 响应拦截器已经处理了 code != 200 的情况，这里 res 已经是 response.data
          // 如果进入 then，说明 code === 200
          if (res.data) {
            fileItem.status = "success";
            fileItem.url = res.data;
            this.$message.success(`${fileItem.name} 上传成功`);
          } else {
            fileItem.status = "error";
            this.$message.error(`${fileItem.name} 上传失败：数据格式错误`);
          }
        })
        .catch((err) => {
          fileItem.status = "error";
          console.error("上传失败:", err);
          // 响应拦截器会在 code != 200 时 reject，err 就是 response.data
          const errorMsg = err.msg || err.message || err.response?.data?.msg || "网络错误";
          this.$message.error(`${fileItem.name} 上传失败：${errorMsg}`);
        });
    },
    removeFile(index) {
      this.uploadedFiles.splice(index, 1);
    },
    submitForm() {
      this.$refs.customForm.validate((valid) => {
        if (valid) {
          // 检查是否有文件正在上传
          const uploadingFiles = this.uploadedFiles.filter(
            (file) => file.status === "uploading"
          );
          if (uploadingFiles.length > 0) {
            this.$message.warning("请等待文件上传完成");
            return;
          }

          // 检查是否有上传失败的文件
          const errorFiles = this.uploadedFiles.filter(
            (file) => file.status === "error"
          );
          if (errorFiles.length > 0) {
            this.$message.warning("请先处理上传失败的文件");
            return;
          }

          // 获取上传成功的文件URL列表
          const fileUrls = this.uploadedFiles
            .filter((file) => file.status === "success" && file.url)
            .map((file) => file.url);

          // 准备提交数据
          const submitData = {
            ...this.formData,
            // 如果地区是数组，取最后一个值作为地区ID
            areaId: Array.isArray(this.formData.areaId)
              ? this.formData.areaId[this.formData.areaId.length - 1]
              : this.formData.areaId,
            file: fileUrls.join(","), // 文件URL用 | 分隔
          };

          // 这里可以添加提交逻辑
          console.log("表单数据:", submitData);
          this.$api({
            url: "/service.php",
            method: "post",
            data: {
              action: "serve_unStandard",
              ...submitData,
            },
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success("提交成功！我们会尽快与您联系");
              this.$refs.customForm.resetFields();
              this.uploadedFiles = [];
            } else {
              this.$message.error(res.msg);
            }
          }).catch((err) => {
            this.$message.error(err.msg);
          });
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

      .el-cascader {
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

          .upload-status {
            margin-left: 10px;
            margin-right: 10px;
            font-size: 12px;
            color: #409eff;

            &.success {
              color: #67c23a;
            }

            &.error {
              color: #f56c6c;
            }

            i {
              margin-right: 4px;
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
