<template>
  <div class="page">
    <div class="page-top">
      <div class="banner-box">
        <div class="banner-img-box" v-if="banners.length == 1">
          <img :src="banners[0].image" alt="" />
        </div>
        <pageBanner v-if="banners.length > 1" />

        <div class="banner-content-wrap">
          <div class="banner-content">
            <div class="banner-title">
              Contact Us
            </div>
            <div class="banner-line">

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="inner">
      <div class="page-ctx">
        <pageBreadcrumb :option="nav_option" />

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
    ...mapState(['map_banners', 'configInfo']),
    banners() {
      return this.map_banners['联系我们'] || []
    },
    nav_option() {
      let option = [
        { route: '/contact', title: '联系我们', title: 'Contact Us' }
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
.page-top {
  position: relative;

  .banner-box {
    position: relative;

    .banner-img-box {
      img {
        width: 100%;
        height: 700px;
        object-fit: cover;
      }
    }

    .banner-content-wrap {
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding-top: 173px;

      .banner-content {
        width: 1520px;
        margin: 0 auto;
        text-align: left;

        .banner-title {
          font-family: Poppins, Poppins;
          font-weight: bold;
          font-size: 60px;
          line-height: 80px;
          color: #FFFFFF;
        }

        .banner-line {
          margin-top: 30px;
          width: 180px;
          height: 13px;
          background: #FFFFFF;
        }
      }
    }
  }
}

.page {
  .inner {}
}

.page-ctx {
  width: 1520px;
  margin: 0 auto;


  padding-top: 35px;
  padding-bottom: 90px;

  .contact-info {
    padding-top: 70px;
    background: #fff;
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