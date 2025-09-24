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
        <el-input
          v-model="formData.text"
          type="textarea"
          :rows="4"
          placeholder="请输入文字"
          class="text-input"
        ></el-input>
      </div>

      <!-- 图片上传区域 -->
      <div class="upload-section">
        <div class="uploaded-images" v-if="uploadedImages.length > 0">
          <div
            v-for="(image, index) in uploadedImages"
            :key="index"
            class="image-item"
          >
            <img :src="image.url" :alt="`上传图片${index + 1}`" />
            <div class="image-remove" @click="removeImage(index)">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </div>

        <div class="upload-button" @click="triggerUpload">
          <div class="upload-icon">
            <i class="el-icon-plus"></i>
          </div>
          <div class="upload-text">上传文件</div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      style="display: none"
      @change="handleFileChange"
    />

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
      default: "弹窗标题"
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        text: ""
      },
      uploadedImages: []
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    handleClose() {
      this.visible = false;
      this.resetForm();
    },
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const files = event.target.files;
      if (files.length > 0) {
        Array.from(files).forEach(file => {
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = e => {
              this.uploadedImages.push({
                file: file,
                url: e.target.result
              });
            };
            reader.readAsDataURL(file);
          }
        });
      }
      // 清空input值，允许重复选择同一文件
      event.target.value = "";
    },
    removeImage(index) {
      this.uploadedImages.splice(index, 1);
    },
    handleSubmit() {
      const submitData = {
        text: this.formData.text,
        images: this.uploadedImages.map(img => ({
          file: img.file,
          url: img.url
        }))
      };
      
      this.$emit("submit", submitData);
      this.handleClose();
    },
    resetForm() {
      this.formData.text = "";
      this.uploadedImages = [];
    }
  }
};
</script>

<style lang="less" scoped>
.custom-dialog {
  .dialog-content {
    .input-section {
      margin-bottom: 20px;
      
      .text-input {
        .el-textarea__inner {
          border-radius: 8px;
          border: 1px solid #dcdfe6;
          font-size: 14px;
          line-height: 1.5;
        }
      }
    }

    .upload-section {
      .uploaded-images {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 15px;

        .image-item {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #dcdfe6;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .image-remove {
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

            &:hover {
              background: #f78989;
            }
          }
        }
      }

      .upload-button {
        width: 80px;
        height: 80px;
        border: 2px solid #FF6600;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: #FF6600;
          background-color: #fff5f2;
        }

        .upload-icon {
          font-size: 24px;
          color: #FF6600;
          margin-bottom: 5px;
        }

        .upload-text {
          font-size: 12px;
          color: #FF6600;
          text-align: center;
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
        color: #37B182;
      }
    }

    .el-button--primary {
      background-color: #37B182;;
      border-color: #37B182;
      &:hover {
        background-color: #37B182;
        border-color: #37B182;
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
