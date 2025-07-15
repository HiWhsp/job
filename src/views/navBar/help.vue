<template>
  <div class="help-center">
    <!-- 顶部横幅 -->
    <div class="header-banner">
      <div class="banner-content">
        <h1 class="title">Help Center</h1>
        <p class="subtitle">SUPPORT CENTER</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧导航菜单 -->
      <div class="sidebar">
        <ul class="nav-menu">
          <li
            class="nav-item ellipsis-1"
            :class="{ active: activeMenu.id === item.id }"
            v-for="item in helpList"
            :key="item.id"
            @click="setActiveMenu(item)"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-area">
        <div class="content-section">
          <h2 class="section-title">{{ activeMenu.title }}</h2>
          <p class="section-text" v-html="activeMenu.content"></p>
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
      activeMenu: "", // 默认选中平台介绍
      helpList: [],
    };
  },
  watch: {
    "$route.query.type": {
      handler(newVal) {
        this.activeMenu = this.helpList.find((item) =>
          item.title.includes(localStorage.getItem("help_type"))
        );
      },
    },
  },
  mounted() {
    this.$api({
      url: "helpCenter",
      method: "get",
    }).then((res) => {
      if (res.code == 200) {
        this.helpList = res.data.list;
        if (this.$route.query.type) {
          this.activeMenu = this.helpList.find((item) =>
            item.title.includes(localStorage.getItem("help_type"))
          );
        } else {
          this.activeMenu = this.helpList[0];
        }
      }
    });
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
