<template>
  <div class="project-process-input-modal">
    <el-dialog
      :title="dialogTitle"
      width="800px"
      custom-class="project-process-input-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-content">
        <!-- 文本输入 -->
        <div class="input-section">
          <el-input
            type="textarea"
            :rows="5"
            v-model="form.content"
            placeholder="请填写物资检验项目流程 内容"
            maxlength="5000"
            show-word-limit
          ></el-input>
        </div>

        <!-- 文件上传 -->
        <div class="upload-section-file">
          <el-upload
            class="file-upload"
            :action="mix_upload_action"
            :data="upload_file_data"
            :headers="mix_upload_headers"
            :name="mix_upload_name"
            :file-list="fileList"
            :on-success="handleFileSuccess"
            :on-remove="handleFileRemove"
            :before-upload="beforeFileUpload"
            :limit="10"
            multiple
          >
            <div class="upload-label">
              请上传相关文件
              <img src="@/assets/img/up-file.png" alt="" />
            </div>
          </el-upload>
        </div>

        <!-- 图片上传 -->
        <div class="upload-section-image">
          <el-upload
            class="image-upload"
            :action="mix_upload_action"
            :data="upload_image_data"
            :headers="mix_upload_headers"
            :name="mix_upload_name"
            list-type="picture-card"
            :file-list="imageList"
            :on-success="handleImageSuccess"
            :on-remove="handleImageRemove"
            :on-preview="handleImagePreview"
            :before-upload="beforeImageUpload"
            :limit="9"
            accept="image/*"
          >
            <img src="@/assets/img/up-img.png" alt="" />
          </el-upload>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm">
          确认
        </el-button>
      </span>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog :visible.sync="previewVisible" append-to-body>
      <img width="100%" :src="previewImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js";

export default {
  name: "project-process-input-modal",
  mixins: [mixins],
  data() {
    return {
      show_modal: false,
      loading: false,
      processName: "",
      processIndex: 0,
      projectId: null,
      form: {
        content: "",
      },
      fileList: [],
      imageList: [],
      previewVisible: false,
      previewImageUrl: "",
    };
  },
  computed: {
    dialogTitle() {
      return this.processName ? `${this.processName} 资料录入` : "资料录入";
    },
    upload_file_data() {
      return {
        action: "upload_uploadFile",
        token: this.mix_get_token(),
      };
    },
    upload_image_data() {
      return {
        action: "upload_uploadImg",
        token: this.mix_get_token(),
      };
    },
  },
  methods: {
    init(processName, processIndex, projectId) {
      this.processName = processName || "";
      this.processIndex = processIndex || 0;
      this.projectId = projectId;
      this.resetForm();
      this.show_modal = true;
    },

    resetForm() {
      this.form = {
        content: "",
      };
      this.fileList = [];
      this.imageList = [];
    },

    // 文件上传前验证
    beforeFileUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.error("上传文件大小不能超过 50MB!");
        return false;
      }
      return true;
    },

    // 图片上传前验证
    beforeImageUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
        return false;
      }
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过 5MB!");
        return false;
      }
      return true;
    },

    // 文件上传成功
    handleFileSuccess(res, file) {
      if (res.code == 200) {
        const fileItem = {
          name: file.name,
          url: res.data.path,
          uid: file.uid,
        };
        this.fileList.push(fileItem);
        this.$message.success("文件上传成功");
      } else {
        this.fileList.splice(this.fileList.indexOf(file), 1);
        this.$message.error(res.msg || "文件上传失败");
      }
    },

    // 文件移除
    handleFileRemove(file, fileList) {
      this.fileList = fileList;
    },

    // 图片上传成功
    handleImageSuccess(res, file) {
      if (res.code == 200) {
        const imageItem = {
          name: file.name,
          url: res.data.path,
          uid: file.uid,
        };
        this.imageList.push(imageItem);
        this.$message.success("图片上传成功");
      } else {  
        this.imageList.splice(this.imageList.indexOf(file), 1);
        this.$message.error(res.msg || "图片上传失败");
      }
    },

    // 图片移除
    handleImageRemove(file, fileList) {
      this.imageList = fileList;
    },

    // 图片预览
    handleImagePreview(file) {
      this.previewImageUrl = file.url;
      this.previewVisible = true;
    },

    // 取消
    handleCancel() {
      this.show_modal = false;
    },

    // 确认提交
    handleConfirm() {
      // 验证必填项
      if (
        !this.form.content &&
        this.fileList.length === 0 &&
        this.imageList.length === 0
      ) {
        this.$message.warning("请至少填写内容、上传文件或图片中的一项");
        return;
      }

      this.loading = true;

      const files = [];
      this.fileList.forEach((file) => {
        files.push({
          path: file.url,
          name: file.name,
        });
      });

      // 准备提交数据
      const submitData = {
        id: this.projectId,
        step: this.processIndex + 1,
        content: this.form.content,
        files: JSON.stringify(files),
        imgs: this.imageList.map((img) => img.url).join(','),
      };

      // 调用API提交数据
      this.$api({
        url: "/stepSub",
        method: "post",
        data: submitData,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            this.$message.success("资料录入成功");
            this.show_modal = false;
            this.$emit("confirm");
          } else {
            this.$message.error(res.msg || "资料录入失败");
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("资料录入失败");
        });
    },

    on_dialog_closed() {
      this.resetForm();
      this.processName = "";
      this.processIndex = 0;
      this.projectId = null;
    },
  },
};
</script>

<style scoped lang="less">
.modal-content {
  padding: 20px;

  .input-section {
    margin-bottom: 30px;
    ::v-deep .el-textarea__inner {
      background: #f8f8f8;
      border: none;
    }
  }

  .upload-section-file {
    margin-bottom: 30px;

    .file-upload {
      ::v-deep .el-upload {
        width: 100%;
        height: 44px;
        line-height: 44px;
        background: #f8f8f8;
        border-radius: 8px;
        padding: 0 12px;
      }
    }

    .upload-label {
      font-size: 14px;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  .upload-section-image {
    .image-upload {
      ::v-deep .el-upload {
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.3s;

        &:hover {
          border-color: #409eff;
        }
      }

      ::v-deep .el-upload-list--picture-card .el-upload-list__item {
        width: 120px;
        height: 120px;
      }

      ::v-deep .el-upload--picture-card {
        width: 120px;
        height: 120px;
        line-height: 120px;
      }

      .el-upload__tip {
        font-size: 12px;
        color: #909399;
        margin-top: 8px;
      }
      img {
        width: 120px;
        height: 120px;
      }
    }
  }
}

// 全局样式，用于自定义dialog样式
::v-deep .project-process-input-dialog {
  border-radius: 16px;

  .el-dialog__header {
    background-color: #3377fe;
    padding: 15px 20px;
    border-radius: 16px 16px 0 0;

    .el-dialog__title {
      color: #fff;
      font-size: 16px;
      font-weight: 500;
    }

    .el-dialog__close {
      color: #fff;
      font-size: 18px;

      &:hover {
        color: #fff;
      }
    }
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-dialog__footer {
    padding: 15px 20px;
    border-top: 1px solid #e4e7ed;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  ::v-deep .el-button {
    width: 120px;
    height: 40px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #3377fe;
    background: #fff;
  }
  ::v-deep .el-button--primary {
    background: #3377fe;
    color: #fff;
  }
}
</style>
