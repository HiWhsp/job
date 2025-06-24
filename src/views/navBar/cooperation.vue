<template>
  <div class="help-center">
    <!-- 顶部横幅 -->
    <div class="header-banner">
      <div class="banner-content">
        <h1 class="title">商务合作</h1>
        <p class="subtitle">BUSINESS COLLABORATION</p>
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
            广告投放
          </li>
          <li
            class="nav-item"
            :class="{ active: activeMenu === 'order' }"
            @click="setActiveMenu('order')"
          >
            区域服务商合作
          </li>
        </ul>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-area">
        <div v-if="activeMenu === 'platform'" class="content-section">
          <h2 class="section-title">广告投放</h2>
          <div class="content">
            <div class="content-item">
              <div class="content-item-title">姓名：</div>
              <el-input v-model="form.name" placeholder="请输入内容" />
            </div>
            <div class="content-item">
              <div class="content-item-title">手机号：</div>
              <el-input v-model="form.name" placeholder="请输入内容" />
            </div>
            <div class="content-item">
              <div class="content-item-title">公司名称：</div>
              <el-input v-model="form.name" placeholder="请输入内容" />
            </div>
          </div>
          <div class="submit-btn">
            <el-button type="primary">预约咨询</el-button>
          </div>
        </div>

        <div v-if="activeMenu === 'order'" class="content-section">
          <h2 class="section-title">下单指引</h2>
          <p class="section-text">
            这里是下单指引的详细说明，包括如何选择商品、如何下单、支付方式等相关信息。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "cooperation",
  data() {
    return {
      activeMenu: "platform", // 默认选中平台介绍
      form: {
        name: "",
        phone: "",
        company: "",
      },
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
@import "./cooperation.less";
</style>
