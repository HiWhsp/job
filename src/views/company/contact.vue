<template>
  <div class="page">
    <div class="top-banner">
      <div class="title">联系我们</div>
    </div>
    <div class="inner">
      <pageBreadcrumb :option="nav_option" />

      <div class="page-ctx">
        <div class="contact-info">
          <div class="info-list flex-between">
            <div class="info-item">
              <div class="icon-box">
                <img src="@/static/contact/addr.png" alt="">
              </div>
              <div class="title">
                Address
              </div>
              <div class="desc">
                {{ vuex_config.comAddress }}
              </div>
            </div>
            <div class="info-item">
              <div class="icon-box">
                <img src="@/static/contact/phone.png" alt="">
              </div>
              <div class="title">
                Phone
              </div>
              <div class="desc">
                {{ vuex_config.comPhone }}
              </div>
            </div>
            <div class="info-item">
              <div class="icon-box">
                <img src="@/static/contact/email.png" alt="">
              </div>
              <div class="title">
                E-mail
              </div>
              <div class="desc">
                {{ vuex_config.comEmail }}
              </div>
            </div>
          </div>

          <div class="contact-form-box">
            <contactForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageBanner from '@/components/page/page-banner.vue'
import pageBreadcrumb from '@/components/page/page-breadcrumb.vue'

import { mapState } from "vuex";
import contactForm from '@/components/contact/contact-form.vue';

export default {
  name: "index",
  components: {
    pageBanner,
    pageBreadcrumb,
    contactForm,
  },
  data() {
    return {
      form: {
        feed_type: '',
        content: '',
      }
    };
  },
  computed: {
    ...mapState(['map_banners']),
    banners() {
      return this.map_banners['联系我们'] || []
    },
    nav_option() {
      let option = [
        { route: '/contact', title: '联系我们' }
      ]
      return option
    }
  },

  watch: {},

  created() {
    this.setView();
  },
  mounted() {
    if (this.$route.query.apply == 1) {
      this.$nextTick(() => {
        this.scrollToTarget(".contact-form-box .detail-title");
      })
    }
  },
  methods: {
    //滚动到指定位置
    scrollToTarget(clsName) {
      // var element = document.querySelector(".wenxian-box");
      var element = document.querySelector(clsName);
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    },

    setView() {

    },
  },
};
</script>

<style scoped lang="less">
.page {
  background-color: #000;

  .top-banner {
    background-image: url("~@/assets/image/contact.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 100%;
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 36px 0;
    .title {
      font-weight: bold;
      font-size: 64px;
      color: #FFFFFF;
      letter-spacing: 10px;
      text-stroke: 1px rgba(0,0,0,0);
      text-align: center;
    }
  }
}

.page-ctx {
  width: 1200px;
  margin: 0 auto;


  padding-bottom: 90px;

  .contact-info {
    padding-top: 70px;
    background: #fff;
    display: flex;

  }
}

.info-list {
  .info-item {
    flex: 1;
    padding: 0 10px;
    text-align: center;

    .icon-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 80px;
      margin: 0 auto;

      img {
        width: 60px;
      }
    }

    .title {
      margin-top: 30px;
      margin-bottom: 30px;
      font-family: Poppins, Poppins;
      font-weight: bold;
      font-size: 25px;
      color: #0D398A;
    }

    .desc {
      font-family: OPPOSans, OPPOSans;
      // font-weight: bold;
      font-size: 16px;
      color: #555555;
    }
  }
}

.contact-form-box {
  margin-top: 123px;
}
</style>


<style scoped lang="less" src="@/assets/h5css/mobile/contact.less"></style>
