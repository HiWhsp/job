<template>
  <div class="contact-us">
    <div class="content">
      <h2>联系我们</h2>
      <div class="contact-us-content">
        <div class="map-container">
          <CommonMap />
        </div>
        <div class="contact-info-section">
          <div class="section-title">
            携程信息咨询客服供产业咨询、商务合作、招聘求职等服务，可通过以下方式与我们联系
          </div>
          <div class="contact-options">
            <div class="contact-option">
              <div class="option-title">商务合作</div>
              <div class="option-content">
                <div class="contact-person">
                  <img
                    src="@/assets/img/contact/wx.png"
                    alt="联系人"
                    class="contact-icon"
                  />
                  {{ vuex_config.sw_contact_us.wx }}
                </div>
                <div class="contact-email">
                  <img
                    src="@/assets/img/contact/email.png"
                    alt="邮箱"
                    class="contact-icon"
                  />
                  {{ vuex_config.sw_contact_us.email }}
                </div>
                <div class="contact-phone">
                  <img
                    src="@/assets/img/contact/phone.png"
                    alt="电话"
                    class="contact-icon"
                  />
                  {{ vuex_config.sw_contact_us.mibile }}
                </div>
              </div>
            </div>
            <div class="contact-option">
              <div class="option-title">产业咨询</div>
              <div class="option-content">
                <div class="contact-person">
                  <img
                    src="@/assets/img/contact/wx.png"
                    alt="联系人"
                    class="contact-icon"
                  />
                  {{ vuex_config.product_contact_us.wx }}
                </div>
                <div class="contact-email">
                  <img
                    src="@/assets/img/contact/email.png"
                    alt="邮箱"
                    class="contact-icon"
                  />
                  {{ vuex_config.product_contact_us.email }}
                </div>
                <div class="contact-phone">
                  <img
                    src="@/assets/img/contact/phone.png"
                    alt="电话"
                    class="contact-icon"
                  />
                  {{ vuex_config.product_contact_us.mibile }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonMap from "@/components/map/commonMap.vue";
export default {
  name: "ContactUs",
  components: {
    CommonMap,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="less" src="./ContactUs.less"></style>
