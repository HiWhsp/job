<template>
  <div class="about-page">
    <div class="about-header">
      <h2>关于我们</h2>
      <p>为企业提供优质有效的服务，赢得企业认可</p>
    </div>
    <!-- 顶部关于我们区域 -->
    <div class="about-section">
      <div class="about-content">
        <div class="title">
          <h3>致力于现代化企业体系服务</h3>
          <p>
            四川响梵信息科技有限公司成立于2023年，是一家致力于现代企业体系制度服务的企业，主要对企业制度体系建设、科技创新、政策咨询、科技成果积累、专项资金申报、会议展览、招投标代理、人力资源等内容进行服务。
          </p>
        </div>
        <img
          class="about-img"
          src="@/assets/img/company/about-img1.png"
          alt=""
        />
        <div class="info">
          <div class="info-item">
            <div class="info-value"><span>{{ vuex_config.establish_year }}</span>年</div>
            <div class="info-label">{{ vuex_config.establish_year }}年成立</div>
          </div>
          <div class="info-item">
            <div class="info-value"><span>{{ vuex_config.reg_capital }}</span>万元</div>
            <div class="info-label">注册资本{{ vuex_config.reg_capital }}万元</div>
          </div>
          <div class="info-item">
            <div class="info-value"><span>{{ vuex_config.team_num }}</span>人</div>
            <div class="info-label">员工团队</div>
          </div>
          <div class="info-item">
            <div class="info-value"><span>{{ vuex_config.serve_num }}+</span></div>
            <div class="info-label">服务客户</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 合作伙伴 -->
    <div class="partner-section">
      <div class="partner-content">
        <h3>合作伙伴</h3>
        <p>
          {{ vuex_config.friend_word }}
        </p>
        <div class="partner-list">
          <div class="partner-item">
            <img src="@/assets/img/company/partner-img1.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      activeTab: 0,
    };
  },
  mounted() {
    // this.$api({
    //   url: "setting",
    // })
  },
  methods: {
    setActiveTab(index) {
      this.activeTab = index;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./about.less";
</style>
