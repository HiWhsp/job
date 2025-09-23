<template>
  <div class="robot-configuration-page">
    <!-- 左侧展示区域 -->
    <div class="left-display-section" :style="{ backgroundImage: `url(${currentBackgroundImage})` }">
      <div class="robot-display">
        <!-- 顶部Logo区域 -->
        <div class="display-header">
          <div class="logo-section">
            <img src="@/assets/img/common/logo.png" alt="logo" />
          </div>
        </div>
      </div>
      <RobotThumbnails @thumbnail-change="handleThumbnailChange" />
    </div>

    <!-- 右侧配置区域 -->
    <div class="right-config-section">
      <RobotConfigPanel />
    </div>
  </div>
</template>

<script>
import RobotThumbnails from "@/components/RobotThumbnails.vue";
import RobotConfigPanel from "@/components/RobotConfigPanel.vue";

export default {
  name: "RobotConfiguration",
  components: {
    RobotThumbnails,
    RobotConfigPanel,
  },
  data() {
    return {
      currentBackgroundImage: require("@/assets/img/common/22-全屏.png"), // 默认使用第一张图片
    };
  },
  methods: {
    handleThumbnailChange(thumbnail) {
      // 处理缩略图切换，更新背景图
      this.currentBackgroundImage = thumbnail.image;
      console.log("Thumbnail changed:", thumbnail);
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
