<template>
  <div class="contact-page">
    <div class="contact-header">
      <p>联系我们</p>
    </div>

    <div class="contact-content">
      <div class="contact-info">
        <h1 class="contact-title">
          <span class="contact-title-bg">CONTACT US</span>
          <span class="contact-title-main">重庆法焰科技有限公司</span>
        </h1>

        <div class="info-item">
          <div class="info-icon">
            <img
              src="@/assets/img/company/contact/组 43857@2x.png"
              alt="地址图标"
            />
          </div>
          <div class="info-text">
            <h3>公司地址</h3>
            <p>{{ contactInfo.site_address }}</p>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <img
              src="@/assets/img/company/contact/组 43858@2x.png"
              alt="电话图标"
            />
          </div>
          <div class="info-text">
            <h3>公司电话</h3>
            <p>{{ contactInfo.company_phone }}</p>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <img
              src="@/assets/img/company/contact/组 43859@2x.png"
              alt="邮箱图标"
            />
          </div>
          <div class="info-text">
            <h3>邮箱</h3>
            <p>{{ contactInfo.company_email }}</p>
          </div>
        </div>
      </div>

      <div class="consultation-info">
        <div class="consultation-item">
          <div class="consultation-left">
            <div class="red-bar"></div>
            <div class="consultation-text">
              <h3>律师咨询电话</h3>
              <p class="phone-number">{{ contactInfo.ask_lawer_phone }}</p>
            </div>
          </div>
          <div class="consultation-icon">
            <img
              src="@/assets/img/company/contact/组 43896@2x.png"
              alt="咨询图标"
            />
          </div>
        </div>

        <div class="consultation-item">
          <div class="consultation-left">
            <div class="red-bar"></div>
            <div class="consultation-text">
              <h3>微信咨询律师</h3>
              <p class="phone-number">{{ contactInfo.wechat_lawer_phone }}</p>
            </div>
          </div>
          <div class="consultation-icon">
            <img
              src="@/assets/img/company/contact/组 43897@2x.png"
              alt="微信图标"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Contact",
  data() {
    return {
      contactInfo: {},
    };
  },
  mounted() {
    this.$api({
      url: "contactUs",
    }).then((res) => {
      this.contactInfo = res.data;
    });
  },
};
</script>

<style lang="less" scoped>
@import "./contact.less";
</style>
