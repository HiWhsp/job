<template>
  <div class="robot-configuration-page">
    <!-- 左侧展示区域 -->
    <div class="left-display-section">
      <RobotDisplay @toggle-fullscreen="handleFullscreen" />
      <RobotThumbnails @thumbnail-change="handleThumbnailChange" />
    </div>

    <!-- 右侧配置区域 -->
    <div class="right-config-section">
      <RobotConfigPanel />
    </div>
  </div>
</template>

<script>
import RobotDisplay from "@/components/RobotDisplay.vue";
import RobotThumbnails from "@/components/RobotThumbnails.vue";
import RobotConfigPanel from "@/components/RobotConfigPanel.vue";

export default {
  name: "RobotConfiguration",
  components: {
    RobotDisplay,
    RobotThumbnails,
    RobotConfigPanel,
  },
  methods: {
    handleFullscreen() {
      // 处理全屏查看
      console.log("Toggle fullscreen");
    },
    handleThumbnailChange(thumbnail) {
      // 处理缩略图切换
      console.log("Thumbnail changed:", thumbnail);
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
