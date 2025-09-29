<template>
  <el-dialog
    title="感谢您对翼菲的支持"
    :visible.sync="visible"
    width="400px"
    :before-close="handleClose"
    custom-class="download-dialog"
  >
    <!-- 描述信息 -->
    <div class="dialog-description">
      您可以扫码在线查看配置单或下载保存配置单
    </div>

    <!-- 二维码区域 -->
    <div class="qr-code-section">
      <div class="qr-code-container">
        <div class="qr-code">
          <img :src="configData.url" alt="二维码" />
        </div>
      </div>
    </div>

    <!-- 配置单号 -->
    <div class="config-number">
      配置单号: {{ configData.order_no }}
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleDownload" class="download-button">
        配置单下载
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "DownloadDialog",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    configData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.visible = newVal;
      }
    },
    visible(newVal) {
      if (newVal) {
        this.visible = newVal;
      }
    },
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
    handleDownload() {
      // 下载图片
      window.open(this.configData.url, "_blank");
    },
  },
};
</script>

<style lang="less" scoped>
.download-dialog {
  .dialog-description {
    color: #fff;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 20px;
    text-align: center;
  }

  .qr-code-section {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    .qr-code-container {
      .qr-code {
        background: #fff;
        border-radius: 8px;
        padding: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .config-number {
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .dialog-footer {
    text-align: center;
    padding: 20px 0 0 0;

    .download-button {
      width: 100%;
      height: 50px;
      background-color: #37b182;
      border-color: #37b182;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;

      &:hover {
        background-color: #2a9d73;
        border-color: #2a9d73;
      }

      &:focus {
        background-color: #37b182;
        border-color: #37b182;
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
  border-bottom: none;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  text-align: center;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 0 20px 20px;
  border-top: none;
}

:deep(.el-dialog__headerbtn) {
  top: 15px;
  right: 15px;

  .el-dialog__close {
    color: #fff;
    font-size: 18px;

    &:hover {
      color: #c0c4cc;
    }
  }
}
</style>
