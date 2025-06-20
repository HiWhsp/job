<template>
  <div
    class="ad-banner-wrapper"
    v-if="isVisible"
    :class="{ expanded: isExpanded, collapsed: isCollapsed }"
  >
    <div class="ad-banner">
      <img alt="" />
    </div>
    <!-- 操作区域 -->
    <div class="shade">
      <div class="wrap">
        <div class="desc">
          文案描述内容文案描述内容文案描述内容文案描述内容文案描述内容文案描述内容文案描述内容文案描述内容文案描述内容
        </div>
        <div class="ad-close">
          <div class="show" @click="toggleBanner">
            <span v-if="isExpanded">收起</span>
            <span v-else>展开</span>
            <i class="el-icon-arrow-down" v-if="isExpanded"></i>
            <i class="el-icon-arrow-up" v-else></i>
          </div>
          <div class="close-icon" @click="closeBanner">
            <i class="el-icon-close"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdBanner",
  data() {
    return {
      isVisible: true,
      isExpanded: false,
      isCollapsed: false,
    };
  },
  mounted() {
    // 页面加载后缓慢展开
    setTimeout(() => {
      this.isExpanded = true;
    }, 1000);
  },
  methods: {
    closeBanner() {
      this.isExpanded = false;
      this.isCollapsed = false;
      // 等待收起动画完成后隐藏
      setTimeout(() => {
        this.isVisible = false;
      }, 1000);
    },
    toggleBanner() {
      if (this.isExpanded) {
        // 当前是展开状态，切换到收起状态（保留60px）
        this.isExpanded = false;
        this.isCollapsed = true;
      } else {
        // 当前是收起状态，切换到展开状态
        this.isCollapsed = false;
        this.isExpanded = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.ad-banner-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  transition: height 1s ease-in-out;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  &.expanded {
    height: 510px;
  }
  &.collapsed {
    height: 60px;
  }
}

.ad-banner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.shade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  .wrap {
    width: 1200px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .desc {
      font-family: Microsoft YaHei;
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #ffffff;
    }
    .ad-close {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      gap: 10px;
      .show {
        width: 58px;
        height: 30px;
        border-radius: 44px;
        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.62);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        span {
          font-family: Microsoft YaHei;
          font-size: 12px;
          color: #ffffff;
        }
        i {
          font-size: 12px;
          color: #ffffff;
        }
      }
      .close-icon {
        width: 30px;
        height: 30px;
        border-radius: 44px;
        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.62);
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          font-size: 12px;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
