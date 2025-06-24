<template>
  <div class="help-center">
    <!-- 顶部横幅 -->
    <div class="header-banner">
      <div class="banner-content">
        <h1 class="title">帮助中心</h1>
        <p class="subtitle">SUPPORT CENTER</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧导航菜单 -->
      <div class="sidebar">
        <ul class="nav-menu">
          <li
            class="nav-item"
            :class="{ active: activeMenu === 'platform' }"
            @click="setActiveMenu('platform')"
          >
            平台介绍
          </li>
          <li
            class="nav-item"
            :class="{ active: activeMenu === 'order' }"
            @click="setActiveMenu('order')"
          >
            下单指引
          </li>
          <li
            class="nav-item"
            :class="{ active: activeMenu === 'ticket' }"
            @click="setActiveMenu('ticket')"
          >
            工单受付
          </li>
        </ul>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-area">
        <div v-if="activeMenu === 'platform'" class="content-section">
          <h2 class="section-title">企业认证</h2>
          <p class="section-text">
            这里是企业文介绍这里是企业文介绍这里是企业文介绍这里是企业文介绍这里是企业文介绍这里是企业文介绍这里是企业文介绍
          </p>
        </div>

        <div v-if="activeMenu === 'order'" class="content-section">
          <h2 class="section-title">下单指引</h2>
          <p class="section-text">
            这里是下单指引的详细说明，包括如何选择商品、如何下单、支付方式等相关信息。
          </p>
        </div>

        <div v-if="activeMenu === 'ticket'" class="content-section">
          <h2 class="section-title">工单受付</h2>
          <p class="section-text">
            这里是工单受付的相关说明，包括如何提交工单、处理流程、联系方式等信息。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelpCenter",
  data() {
    return {
      activeMenu: "platform", // 默认选中平台介绍
    };
  },
  methods: {
    setActiveMenu(menu) {
      this.activeMenu = menu;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./help.less";
</style>
