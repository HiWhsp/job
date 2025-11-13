<template>
  <div class="project-process-detail-modal">
    <el-dialog
      :title="processName"
      width="800px"
      custom-class="project-process-detail-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-content">
        <!-- 录入信息 -->
        <div class="info-section">
          <div class="section-title">录入信息</div>
          <div class="info-content">
            <div class="content-text">{{ infoText || "暂无录入信息" }}</div>
          </div>
        </div>

        <!-- 相关文件 -->
        <div class="file-section" v-if="fileList && fileList.length > 0">
          <div class="file-list">
            <div
              class="file-item"
              v-for="(file, index) in fileList"
              :key="index"
              @click="handleFileClick(file)"
            >
              <span class="file-name">{{
                file.name || file.fileName || file
              }}</span>
            </div>
          </div>
        </div>

        <!-- 相关图片 -->
        <div class="image-section" v-if="imageList && imageList.length > 0">
          <div class="image-list">
            <div
              class="image-item"
              v-for="(image, index) in imageList"
              :key="index"
              @click="handleImagePreview(image, index)"
            >
              <el-image
                :src="image.url || image"
                fit="cover"
                :preview-src-list="previewImageList"
                :initial-index="index"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div
          v-if="
            !infoText &&
            (!fileList || fileList.length === 0) &&
            (!imageList || imageList.length === 0)
          "
          class="empty-content"
        >
          <el-empty description="暂无资料信息"></el-empty>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "project-process-detail-modal",
  data() {
    return {
      show_modal: false,
      processName: "",
      infoText: "",
      fileList: [],
      imageList: [],
      previewImageList: [],
    };
  },
  methods: {
    init(name, processItem) {
      if (processItem) {
        this.processName = name || "流程详情";
        // 从流程项或行数据中获取资料信息
        this.infoText = processItem.content || "暂无录入信息";
        this.fileList = processItem.files || [{}];
        this.imageList = processItem.imgs || [{}];

        // 处理图片预览列表
        this.previewImageList = this.imageList.map((img) => img.url || img);
      }
      this.show_modal = true;
    },

    // 处理文件点击
    handleFileClick(file) {
      const fileUrl = file.url || file.fileUrl || file;
      if (fileUrl) {
        // 打开文件链接
        window.open(fileUrl, "_blank");
      }
    },

    // 处理图片预览
    handleImagePreview(image, index) {
      // ElementUI的el-image组件会自动处理预览
    },

    on_dialog_closed() {
      this.processName = "";
      this.infoText = "";
      this.fileList = [];
      this.imageList = [];
      this.previewImageList = [];
    },
  },
};
</script>

<style scoped lang="less">
.modal-content {
  padding: 20px;
  max-height: 600px;
  overflow-y: auto;

  .info-section {
    margin-bottom: 30px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 15px;
    }

    .info-content {
      .content-text {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #000000;
      }
    }
  }

  .file-section {
    margin-bottom: 30px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 15px;
    }

    .file-list {
      .file-item {
        display: flex;
        align-items: center;
        padding: 12px 15px;
        margin-bottom: 10px;
        background-color: #f5f7fa;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background-color: #ecf5ff;
        }

        i {
          font-size: 18px;
          color: #909399;
          margin-right: 10px;
        }

        .file-name {
          font-size: 14px;
          color: #333;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .image-section {
    margin-bottom: 20px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 15px;
    }

    .image-list {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;

      .image-item {
        width: 120px;
        height: 120px;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s;
        background-color: #f7f7f7;

        &:hover {
          border-color: #409eff;
        }

        .el-image {
          width: 100%;
          height: 100%;

          .image-slot {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background: #fafafa;
            color: #c0c4cc;
            font-size: 30px;
          }
        }
      }
    }
  }

  .empty-content {
    padding: 40px 0;
  }
}

// 全局样式，用于自定义dialog样式
::v-deep .project-process-detail-dialog {
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
</style>
