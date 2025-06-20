<template>
  <div class="page">
    <div class="container">
      <!-- 顶部导航 -->
      <div class="top-nav">
        <!-- 左侧导航菜单 -->
        <div class="top-nav-left">
          <div class="nav-item">
            <i class="icon"></i>
            售后运维需求表
            <span class="el-icon-arrow-right"></span>
          </div>
          <div class="nav-item">
            <i class="icon"></i>
            项目产品需求表
            <span class="el-icon-arrow-right"></span>
          </div>
          <div class="nav-item">
            <i class="icon"></i>
            项目融资表
            <span class="el-icon-arrow-right"></span>
          </div>
          <div class="nav-item">
            <i class="icon"></i>
            项目转让表
            <span class="el-icon-arrow-right"></span>
          </div>
          <div class="nav-item">
            <i class="icon"></i>
            产品回收利用表
            <span class="el-icon-arrow-right"></span>
          </div>
        </div>

        <!-- 中间横幅区域 -->
        <div class="top-nav-center">
          <div class="banner-area">
            <div class="banner-content"></div>
          </div>
        </div>

        <!-- 右侧登录区域 -->
        <div class="top-nav-right">
          <div class="top-nav-right-top">
            <div class="greeting">您好，请登录/注册</div>
            <div class="login-box">
              <div class="login-btn">登录</div>
              <div class="register-btn">注册</div>
            </div>
          </div>

          <!-- 通知公告区域 -->
          <div class="notice-area">
            <div class="notice-title">
              <div class="notice-title-left">
                <i class="notice-icon"></i>
                <span>通知公告</span>
              </div>
              <span class="more">查看更多 <i class="el-icon-arrow-right"></i></span>
            </div>
            <div class="notice-list">
              <div class="notice-item ellipsis">
                通知公告展示文字内容通知公告展示通知公告展示文字内容通知公告展示
              </div>
              <div class="notice-item ellipsis">
                通知公告展示文字内容通知公告展示通知公告展示文字内容通知公告展示
              </div>
              <div class="notice-item ellipsis">
                通知公告展示文字内容通知公告展示通知公告展示文字内容通知公告展示
              </div>
              <div class="notice-item ellipsis">
                通知公告展示文字内容通知公告展示通知公告展示文字内容通知公告展示
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="top-nav-right-bottom"></div>

      <!-- 系统厂商区域 -->
      <div class="system-ads-section">
        <div class="section-header">
          <h2>系统厂商</h2>
          <span class="more-link">查看更多 <i class="el-icon-arrow-right"></i></span>
        </div>
        <div class="ads-grid">
          <div class="ad-card" v-for="i in 6" :key="'system-' + i">
            <div class="ad-logo-placeholder"></div>
            <div class="ad-content">
              <h3 class="ellipsis">旭飒新能源</h3>
              <p>
                协鑫集成科技股份有限公司成立于2006年，是一家专业从事太阳能电池组件研发、生产和销售的高新技术企业。公司拥有完整的太阳能电池组件产业链，产品广泛应用于分布式光伏发电系统。
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 配置广告区域 -->
      <div class="config-ads-section">
        <div class="section-header">
          <h2>配置广告</h2>
          <span class="more-link">查看更多 <i class="el-icon-arrow-right"></i></span>
        </div>
        <div class="ads-grid">
          <div class="ad-card" v-for="i in 9" :key="'config-' + i">
            <div class="ad-logo-placeholder"></div>
            <div class="ad-content">
              <h3 class="ellipsis">旭飒新能源</h3>
              <p>
                协鑫集成科技股份有限公司成立于2006年，是一家专业从事太阳能电池组件研发、生产和销售的高新技术企业。公司拥有完整的太阳能电池组件产业链，产品广泛应用于分布式光伏发电系统。
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 线上线下服务网络区域 -->
      <div class="service-network-section">
        <div class="section-header">
          <h2>线上线下服务网络</h2>
        </div>
        <div class="network-content">
          <div class="network-content-left">
            <div class="service-points">
              <div class="service-category">
                <h3>全球售后服务网络</h3>
                <div class="service-locations">
                  <div class="location-group">
                    <h4>中国</h4>
                    <div class="location-item" v-for="i in 3" :key="'location-' + i">
                      <img class="flag" />
                      <div class="location-item-content">
                        <p class="location-item-title ellipsis-1">XXXXX售后服务网点</p>
                        <p class="location-item-address ellipsis-1">
                          山西省大同市云州区XXX号
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="world-map">
              <div class="map-container">
                <div class="map-placeholder">
                  <!-- 世界地图区域 -->
                  <div class="continent asia">亚洲</div>
                  <div class="continent europe">欧洲</div>
                  <div class="continent africa">非洲</div>
                  <div class="continent north-america">北美洲</div>
                  <div class="continent south-america">南美洲</div>
                  <div class="continent oceania">大洋洲</div>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-section">
            <div class="service-stats">
              <h3>专属服务团队</h3>
              <h4>千人级服务天团精准护航</h4>
              <div class="stats-list">
                <div class="stat-item">
                  <span class="icon">🌍</span>
                  <span>服务人员1对1专业报价</span>
                </div>
                <div class="stat-item">
                  <span class="icon">⚡</span>
                  <span>销售员上门对接业务</span>
                </div>
                <div class="stat-item">
                  <span class="icon">📞</span>
                  <span>认证工程师技术保障</span>
                </div>
              </div>
              <div class="contact-btn">
                <span>提交服务需求</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 合作品牌区域 -->
      <div class="partner-brands-section">
        <div class="section-header">
          <h2>合作品牌</h2>
        </div>
        <div class="brands-grid">
          <div class="brand-item" v-for="i in 6" :key="'brand-' + i">
            <div class="brand-logo"></div>
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
