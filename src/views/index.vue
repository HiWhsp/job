<template>
  <div class="page">
    <div class="container">
      <div class="main-content">
        <!-- 左侧导航 -->
        <div class="left-nav">
          <div class="nav-item">
            <i class="icon"></i>
            售后运维需求表
            <span class="arrow">></span>
          </div>
          <div class="nav-item">
            <i class="icon"></i>
            项目产品需求表
            <span class="arrow">></span>
          </div>
          <div class="nav-item">
            <i class="icon"></i>
            项目融资表
            <span class="arrow">></span>
          </div>
          <div class="nav-item">
            <i class="icon"></i>
            项目转让表
            <span class="arrow">></span>
          </div>
          <div class="nav-item">
            <i class="icon"></i>
            产品回收利用表
            <span class="arrow">></span>
          </div>
        </div>

        <!-- 中间横幅区域 -->
        <div class="center-content">
          <div class="banner-area">
            <div class="banner-content">
              <div class="banner-text">
                <div class="subtitle">筑梦想·创新篇·共未来</div>
                <div class="main-title">2025新能源投资高峰论坛</div>
                <div class="organizer">
                  <span>主办方：XX网科技有限公司</span>
                  <span>协办方：XX网科技有限公司</span>
                </div>
                <div class="date-location">
                  <span>2025.05.20</span>
                  <span>中国·上海</span>
                </div>
              </div>
              <div class="banner-illustration">
                <!-- 这里放置绿色山丘和新能源元素的插图 -->
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧登录区域 -->
        <div class="right-login">
          <div class="greeting">您好，请登录注册</div>
          <div class="login-box">
            <div class="login-btn">登录</div>
            <div class="register-btn">注册</div>
          </div>
          <!-- 通知公告区域 -->
          <div class="notice-area">
            <div class="notice-title">
              <i class="notice-icon"></i>
              <span>通知公告</span>
              <span class="more">查看更多></span>
            </div>
            <div class="notice-list">
              <div class="notice-item">通知公告展示文字内容通知公告展示...</div>
              <div class="notice-item">通知公告展示文字内容通知公告展示...</div>
              <div class="notice-item">通知公告展示文字内容通知公告展示...</div>
              <div class="notice-item">通知公告展示文字内容通知公告展示...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部功能区 -->
      <div class="bottom-section">
        <div class="function-buttons">
          <div class="func-btn">
            <span class="btn-icon">📚</span>
            <span>能源堂</span>
          </div>
          <div class="func-btn highlight">
            <span>众筹行动 点亮世界</span>
          </div>
          <div class="func-btn special">
            <span>"光伏科普" 系列公开课</span>
          </div>
          <div class="stats">
            <div class="stat-item">
              <div class="number">14</div>
              <div class="label">年</div>
            </div>
            <div class="stat-item">
              <div class="number">24</div>
              <div class="label">万</div>
            </div>
            <div class="stat-item">
              <div class="number">130</div>
              <div class="label">万</div>
            </div>
          </div>
          <div class="free-learning">
            <span>免费学习</span>
            <span>权威科普</span>
          </div>
          <div class="qr-codes">
            <div class="qr-code">
              <div class="qr-placeholder"></div>
              <span>官方微信</span>
            </div>
            <div class="qr-code">
              <div class="qr-placeholder"></div>
              <span>官方微博</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "index",
  data() {
    return {};
  },
  computed: {},

  watch: {},
  created() {
    this.setView();
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.showButton = window.scrollY > 200;
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    setView() {},
  },
};
</script>

<style lang="less">
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #009f39;
  color: #fff !important;
}

.el-select-dropdown__item.selected {
  color: #009f39;
}
</style>
<style scoped lang="less" src="./index.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/index.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/index.less"></style>
