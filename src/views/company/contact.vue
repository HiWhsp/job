<template>
  <div class="about-page">
    <div class="about-header">
      <h2>联系我们</h2>
      <p>为企业提供优质有效的服务，赢得企业认可</p>
    </div>

    <div class="contact-section">
      <div class="contact-content">
        <div class="contact-item">
          <div class="contact-item-title">
            <h3>联系电话</h3>
          </div>
          <img src="@/assets/img/company/contact-mobile.png" alt="" />
          <div class="value">18628267502</div>
          <div class="tip">如有意见建议请在工作日9:00- 18:00致电我们</div>
        </div>
        <div class="contact-item">
          <div class="contact-item-title">
            <h3>联系电话</h3>
          </div>
          <img src="@/assets/img/company/contact-mobile.png" alt="" />
          <div class="value">18628267502</div>
          <div class="tip">如有意见建议请在工作日9:00- 18:00致电我们</div>
        </div>
        <div class="contact-item">
          <div class="contact-item-title">
            <h3>邮箱</h3>
          </div>
          <img src="@/assets/img/company/contact-email.png" alt="" />
          <div class="value">446426404@qq.com</div>
          <div class="tip">如有意见建议请发送邮件至我们的邮箱</div>
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
@import "./contact.less";
</style>
<style lang="less" scoped src="./style/h5-about.less"></style>
