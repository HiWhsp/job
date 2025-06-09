<template>
  <div class="about-us">
    <div class="company-intro">
      <div class="company-intro-left">
        <!-- 左侧公司简介区域 -->
        <div class="profile-section">
          <div class="logo-container">
            <div class="large-c">C</div>
          </div>
          <div class="company-text">
            <h2 class="company-title">OMPANY PROFILE</h2>
            <div class="subtitle">公司介绍 <span class="arrow">→</span></div>
          </div>
        </div>

        <!-- 中间内容区域 -->
        <div class="content-section">
          <div class="description">
            <p>{{ data.title }}</p>

            <p>{{ data.info }}</p>
          </div>
        </div>
      </div>

      <!-- 右侧建筑图片区域 -->
      <div class="image-section">
        <div class="building-image">
          <img :src="data.thumb" alt="公司建筑" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutUs",
  data() {
    return {
      data: {},
    };
  },
  mounted() {
    this.getAboutUsData();
  },
  methods: {
    getAboutUsData() {
      this.$api({
        url: "getCompanyProfile",
      }).then((res) => {
        if (res.code === 200) {
          this.data = res.data;
        }
      });
    },
  },
};
</script>

<style scoped lang="less" src="./AboutUs.less"></style>
