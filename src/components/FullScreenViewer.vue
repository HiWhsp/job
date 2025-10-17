<template>
  <div v-if="visible" class="fullscreen-viewer" @click="handleBackdropClick">
    <!-- 全屏背景遮罩 -->
    <div class="fullscreen-backdrop"></div>

    <!-- 左上角Logo -->
    <div class="logo-container">
      <img src="@/assets/img/common/logo.png" alt="logo" class="logo" />
    </div>

    <!-- 右下角取消全屏按钮 -->
    <div class="close-button" @click="closeFullScreen">
      <img
        src="@/assets/img/common/no-full-screen.png"
        alt="close"
        class="close-icon"
      />
    </div>

    <!-- 图片展示区域 - 作为背景图 -->
    <div class="image-background" @click.stop>
      <img v-if="imageUrl" :src="imageUrl" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: "FullScreenViewer",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imageAlt: {
      type: String,
      default: "全屏图片",
    },
  },
  data() {
    return {
      // 移除图片加载状态，因为使用背景图
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // 全屏时禁止页面滚动
        document.body.style.overflow = "hidden";
        // 监听ESC键关闭全屏
        document.addEventListener("keydown", this.handleKeydown);
      } else {
        // 恢复页面滚动
        document.body.style.overflow = "";
        // 移除ESC键监听
        document.removeEventListener("keydown", this.handleKeydown);
      }
    },
  },
  beforeDestroy() {
    // 组件销毁时清理
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    closeFullScreen() {
      this.$emit("close");
    },
    handleBackdropClick() {
      // 点击背景关闭全屏
      this.closeFullScreen();
    },
    handleKeydown(event) {
      // ESC键关闭全屏
      if (event.key === "Escape") {
        this.closeFullScreen();
      }
    },
    // 移除图片加载相关方法，因为使用背景图
  },
};
</script>

<style lang="less" scoped>
.fullscreen-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(5px);
}

.logo-container {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 10001;

  .logo {
    height: 80px;
    width: 164px;
    object-fit: contain;
  }
}

.close-button {
  position: absolute;
  bottom: 80px;
  right: 40px;
  z-index: 10001;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .close-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
}

.image-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
  background-image: url('~@/assets/img/common/back-bg.png');
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .logo-container {
    top: 15px;
    left: 15px;

    .logo {
      height: 30px;
      max-width: 100px;
    }
  }

  .close-button {
    bottom: 15px;
    right: 15px;
    padding: 8px;

    .close-icon {
      width: 20px;
      height: 20px;
    }
  }

  .image-background {
    background-attachment: scroll; // 移动端不支持fixed
  }
}

// 加载动画
.image-background {
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
