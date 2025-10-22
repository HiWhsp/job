<template>
  <div class="robot-configuration-page">
    <!-- 左侧展示区域 -->
    <div
      class="left-display-section"
      :style="{ backgroundImage: `url(${require('@/assets/img/common/back-bg.png')})` }"
    >
      <div class="robot-display">
        <!-- 顶部Logo区域 -->
        <div class="display-header">
          <div class="logo-section">
            <img src="@/assets/img/common/logo.png" alt="logo" />
          </div>
        </div>
      </div>

      <!-- 全屏 -->
      <div class="full-screen-btn" @click="handleFullScreen">
        <img src="@/assets/img/common/full-screen.png" alt="full-screen" />
      </div>
      <div class="backImg">
        <img v-if="currentBackgroundImage" :src="currentBackgroundImage" alt="">
      </div>
      <!-- 全屏查看组件 -->
      <FullScreenViewer
        :visible="isFullScreenVisible"
        :imageUrl="currentBackgroundImage"
        :imageAlt="'机器人配置预览'"
        @close="closeFullScreen"
      />
      <RobotThumbnails v-if="ImgList.length > 0" :list="ImgList" @thumbnail-change="handleThumbnailChange" />
    </div>

    <!-- 右侧配置区域 -->
    <div class="right-config-section">
      <RobotConfigPanel :id="id" :info="info" :title="info.info.title" :price="info.info.price" :detail="detail" @navigate-to-ai="handleNavigateToAI" />
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
      id: "",
      currentBackgroundImage: '', // 默认使用第一张图片
      isFullScreenVisible: false, // 控制全屏组件显示
      ImgList: [],
      detail: [],
      info: {
        info: {
          title: "",
        },
      },
    };
  },
  mounted() {
    this.id = this.$route.query.id || "2";
    this.getRobotConfig();
  },
  methods: {
    getRobotConfig() {
      this.$api({
        url: "getProductSetting",
        method: "get",
        data: {
          id: this.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.info = res.data;
          this.ImgList = res.data.info.images.split(",");
          this.detail = res.data.lists;
        }
      });
    },
    handleThumbnailChange(thumbnail) {
      console.log(thumbnail);
      if (thumbnail && thumbnail.includes("http")) {
        this.currentBackgroundImage = thumbnail;
      } else {
        this.currentBackgroundImage = "https://yifei.dx.hdapp.com.cn/uploads/" + thumbnail;
      }
      // 处理缩略图切换，更新背景图
    },
    handleFullScreen() {
      this.isFullScreenVisible = true;
    },
    closeFullScreen() {
      this.isFullScreenVisible = false;
    },
    handleNavigateToAI() {
      // 处理AI推荐跳转
      console.log("父组件接收到AI推荐跳转事件");
      // 这里可以实现具体的跳转逻辑
      // 例如：跳转到外部链接、显示AI推荐页面等
      this.$message({
        message: "AI推荐功能正在开发中，敬请期待！",
        type: "info",
        duration: 3000,
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
