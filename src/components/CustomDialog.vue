<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose"
    custom-class="custom-dialog"
  >
    <!-- 文本输入区域 -->
    <div class="dialog-content">
      <div class="input-section">
        <!-- <div class="form-item">
          <label class="form-label">品牌/型号：</label>
          <el-input
            v-model="formData.brand"
            placeholder="请输入品牌或型号"
            class="text-input"
          ></el-input>
        </div> -->
        <div class="form-item">
          <label class="form-label">备注说明：</label>
          <el-input
            v-model="formData.notes"
            type="textarea"
            :rows="4"
            placeholder="请输入文字"
            class="text-input"
          ></el-input>
        </div>
      </div>

      <!-- 图片上传区域 -->
      <div class="upload-section">
        <el-upload
          ref="upload"
          action="https://yifei.dx.hdapp.com.cn/api/upload"
          :data="uploadData"
          name="file"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-remove="handleRemove"
          list-type="picture-card"
          class="custom-upload"
          accept="image/*"
        >
          <div class="upload-button">
            <!-- <div class="upload-icon">
              <i class="el-icon-plus"></i>
            </div> -->
            <div class="upload-text">上传文件</div>
          </div>
        </el-upload>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "CustomDialog",
  props: {
    title: {
      type: String,
      default: "弹窗标题",
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        notes: "",
        brand: "",
      },
      fileList: [],
      uploadedImages: [],
      isUploading: false, // 标记是否有图片正在上传
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    // 上传参数
    uploadData() {
      return {
        userId: localStorage.getItem("userId") || "",
        token: localStorage.getItem("token") || "",
      };
    },
  },
  methods: {
    handleClose() {
      this.visible = false;
      this.resetForm();
    },
    handleUploadSuccess(response, file) {
      this.isUploading = false; // 上传完成（成功或失败），重置上传状态
      if (response.code === 200 && response.data && response.data.path) {
        this.uploadedImages.push({
          file: response.data.path,
          url: response.data.path,
        });
      } else {
        this.fileList = [];
        this.uploadedImages = [];
        this.$message.error(response.msg || "上传失败");
      }
    },
    // 上传失败的处理
    handleUploadError(err, file, fileList) {
      this.isUploading = false; // 上传失败，重置上传状态
      this.$message.error("图片上传失败，请重试");
      // 移除上传失败的文件
      const index = this.fileList.findIndex((item) => item.uid === file.uid);
      if (index > -1) {
        this.fileList.splice(index, 1);
      }
    },
    // 设置表单数据（用于回显）
    setFormData(data) {
      console.log(data);
      this.formData.notes = data.notes || "";
      this.formData.brand = data.brand || "";
      if (data.image) {
        this.fileList = [
          {
            name: "image",
            url: data.image,
            status: "success",
          },
        ];
        this.uploadedImages = [
          {
            file: data.image,
            url: data.image,
          },
        ];
      }
    },
    // 文件上传前的处理
    beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        this.$message.error("只能上传图片文件!");
        return false;
      }
      if (this.uploadedImages.length >= 1) {
        this.$message.error("只能上传一张图片!");
        return false;
      }
      // 验证通过，设置上传状态
      this.isUploading = true;
      return true;
    },
    // 文件选择变化时的处理
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },
    // 移除文件
    handleRemove(file, fileList) {
      this.fileList = fileList;
      // 从uploadedImages中移除对应的文件
      const index = this.uploadedImages.findIndex(
        (img) => img.url === file.url
      );
      if (index > -1) {
        this.uploadedImages.splice(index, 1);
      }
    },
    handleSubmit() {
      // 如果正在上传图片，阻止提交
      if (this.isUploading) {
        this.$message.warning("图片正在上传中，请等待上传完成后再提交");
        return;
      }

      const submitData = {
        notes: this.formData.notes,
        brand: this.formData.brand,
        images: this.uploadedImages.map((img) => ({
          file: img.file, // 现在存储的是二进制数据
          url: img.url,
        })),
      };

      this.$emit("submit", submitData);
      this.handleClose();
    },
    resetForm() {
      this.formData.notes = "";
      this.formData.brand = "";
      this.fileList = [];
      this.uploadedImages = [];
      this.isUploading = false; // 重置表单时，也重置上传状态
    },
  },
};
</script>

<style lang="less" scoped>
.custom-dialog {
  .dialog-content {
    .input-section {
      margin-bottom: 20px;

      .form-item {
        margin-bottom: 15px;

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #fff;
          font-weight: 500;
        }
      }

      .text-input {
        .el-textarea__inner {
          border-radius: 8px;
          border: 1px solid #dcdfe6;
          font-size: 14px;
          line-height: 1.5;
        }

        .el-input__inner {
          border-radius: 8px;
          border: 1px solid #dcdfe6;
          font-size: 14px;
        }
      }
    }

    .upload-section {
      .custom-upload {
        display: flex;
        gap: 10px;
        :deep(.el-upload-list) {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
        }

        :deep(.el-upload-list__item) {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #dcdfe6;
          margin: 0;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .el-upload-list__item-delete {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: #f56c6c;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            font-size: 12px;
            border: none;

            &:hover {
              background: #f78989;
            }
          }
        }

        :deep(.el-upload--picture-card) {
          width: 80px;
          height: 80px;
          border: 2px solid #ff6600;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          background: transparent;

          &:hover {
            border-color: #ff6600;
            background-color: #fff5f2;
          }
        }

        .upload-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;

          .upload-icon {
            font-size: 24px;
            color: #ff6600;
            margin-bottom: 5px;
          }

          .upload-text {
            font-size: 12px;
            color: #ff6600;
            text-align: center;
          }
        }
      }
    }
  }

  .dialog-footer {
    text-align: center;

    .el-button {
      padding: 10px 30px;
      border-radius: 6px;
      font-size: 14px;
      &:hover {
        background-color: #fff;
        border-color: #fff;
        color: #37b182;
      }
    }

    .el-button--primary {
      background-color: #37b182;
      border-color: #37b182;
      &:hover {
        background-color: #37b182;
        border-color: #37b182;
        color: #fff;
      }
    }
  }
}

// 全局样式覆盖
:deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background-color: #303030;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
}
</style>
