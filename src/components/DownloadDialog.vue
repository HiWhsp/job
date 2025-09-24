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
        <div class="qr-code" ref="qrCodeRef"></div>
      </div>
    </div>

    <!-- 配置单号 -->
    <div class="config-number">
      配置单号: {{ configNumber }}
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
import QRCode from 'qrcode'

export default {
  name: "DownloadDialog",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    configData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      configNumber: ''
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
  watch: {
    visible(newVal) {
      if (newVal) {
        this.generateConfigNumber();
        this.$nextTick(() => {
          this.generateQRCode();
        });
      }
    }
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
    generateConfigNumber() {
      // 生成配置单号，格式：YYMMDD-XXXX
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      
      this.configNumber = `${year}${month}${day}-${random}`;
    },
    async generateQRCode() {
      try {
        // 生成二维码内容（可以是配置单的查看链接）
        const qrContent = `https://yifei.com/config/${this.configNumber}`;
        
        // 生成二维码
        const canvas = await QRCode.toCanvas(this.$refs.qrCodeRef, qrContent, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        // 设置二维码容器的样式
        this.$refs.qrCodeRef.style.width = '200px';
        this.$refs.qrCodeRef.style.height = '200px';
        this.$refs.qrCodeRef.style.borderRadius = '8px';
      } catch (error) {
        console.error('生成二维码失败:', error);
        // 如果二维码生成失败，显示占位符
        this.$refs.qrCodeRef.innerHTML = `
          <div style="
            width: 200px;
            height: 200px;
            background: #f5f5f5;
            border: 2px dashed #ccc;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 14px;
          ">
            二维码生成中...
          </div>
        `;
      }
    },
    handleDownload() {
      // 这里可以调用实际的下载API
      // 或者生成PDF并下载
      setTimeout(() => {
        this.$message.success('配置单下载完成');
      }, 2000);
      
      // 触发下载事件，让父组件处理
      this.$emit('download', {
        configNumber: this.configNumber,
        configData: this.configData
      });
    }
  }
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
      background-color: #37B182;
      border-color: #37B182;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;

      &:hover {
        background-color: #2a9d73;
        border-color: #2a9d73;
      }

      &:focus {
        background-color: #37B182;
        border-color: #37B182;
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
