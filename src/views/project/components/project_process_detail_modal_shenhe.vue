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

        <!-- 操作按钮 -->
        <div class="action-section" v-if="statusText == '待审核'">
          <el-button type="danger" @click="handleReject">驳回</el-button>
          <el-button type="success" @click="handlePass">通过</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 驳回原因弹框 -->
    <project-reject-modal
      ref="project_reject_modal"
      @confirm="handleRejectConfirm"
    ></project-reject-modal>
    <!-- 通过确认弹框 -->
    <project-confirm-modal
      ref="project_confirm_modal"
      @confirm="handlePassConfirm"
    ></project-confirm-modal>
  </div>
</template>

<script>
import ProjectContentModal from "./project_content_modal.vue";
import ProjectConfirmModal from "./project_confirm_modal.vue";
import ProjectRejectModal from "./project_reject_modal.vue";

export default {
  name: "project-process-detail-modal",
  components: {
    ProjectContentModal,
    ProjectConfirmModal,
    ProjectRejectModal,
  },
  data() {
    return {
      show_modal: false,
      processName: "",
      infoText: "",
      fileList: [],
      imageList: [],
      previewImageList: [],
      statusText: "",
      index: 0,
      id: null,
    };
  },
  methods: {
    init(processItem, name, statusText, index, id) {
      this.index = index;
      this.id = id;
      if (processItem) {
        this.processName = name || "流程详情";
        this.statusText = statusText || "";
        // 从流程项或行数据中获取资料信息
        this.infoText = processItem.content || "暂无录入信息";
        this.fileList = processItem.files || [];
        this.imageList = processItem.imgs || [];

        // 处理图片预览列表
        this.previewImageList = this.imageList.map((img) => img.url || img);
      }
      this.show_modal = true;
    },

    handleReject() {
      this.$refs.project_reject_modal.init("驳回原因", this.index, this.id);
    },
    handlePass() {
      // 通过操作
      this.$refs.project_confirm_modal.init(
        "是否确认通过当前录入信息",
        this.index,
        this.id
      );
    },
    handleRejectConfirm(reason) {
      // 处理驳回确认，可以在这里调用API提交驳回原因
      this.show_modal = false;
      this.$emit("confirm", reason);
    },
    handlePassConfirm() {
      // 处理通过确认
      this.$emit("confirm");
      this.show_modal = false;
    },

    // 处理文件点击
    handleFileClick(file) {
      const fileUrl = file.path || file.fileUrl || file;
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
    getStatusClass(statusText) {
      if (statusText == "未录入") {
        return "status-text-inactive";
      } else if (statusText == "已通过") {
        return "status-text-active";
      } else if (statusText == "已驳回") {
        return "status-text-reject";
      }
      return "status-text-inactive";
    },
  },
};
</script>

<style scoped lang="less">
.modal-content {
  padding: 20px;
  max-height: 600px;
  overflow-y: auto;

  .status-section {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .status-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
    .status-content {
      .status-text {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: #000000;
        &.status-text-active {
          color: #1fb168;
        }
        &.status-text-reject {
          color: #ff0000;
        }
        &.status-text-inactive {
          color: #909399;
        }
      }
    }
  }

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

  .action-section {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 40px;
    button {
      width: 100px;
      height: 40px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }
    .el-button--danger {
      background-color: #ff0000;
      border-color: #ff0000;
    }
    .el-button--success {
      background-color: #1fb168;
      border-color: #1fb168;
    }
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
