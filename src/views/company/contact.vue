<template>
  <div class="page">
    <div class="top-banner">
      <div class="title">联系我们</div>
    </div>
    <div class="inner">
      <pageBreadcrumb :option="nav_option"/>

      <div class="page-ctx">
        <div class="contact-info">
          <div class="info-list">
            <div class="title">联系方式</div>
            <div class="desc">如果您有任何问题，可以通过以下方式找到我们</div>
            <div v-for="(item, index) in infoList" :key="index" class="info-item" @click="goUrl(item.url)">
              <div class="icon-box">
                <img :src="item.thumb" alt="">
              </div>
              <div class="title">{{ item.title }}</div>
            </div>
          </div>

          <div class="contact-form-box">
            <contactForm/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageBanner from '@/components/page/page-banner.vue'
import pageBreadcrumb from '@/components/page/page-breadcrumb.vue'

import {mapState} from "vuex";
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
      infoList: [],
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
        {route: '/contact', title: '联系我们'}
      ]
      return option
    }
  },

  watch: {},

  created() {
    this.setView();
  },
  mounted() {
    this.$api({
      url: '/service.php',
      method: 'get',
      data: {
        action: 'news_lists',
        channelId: 52,
      }
    }).then(res => {
      if (res.code == 200) {
        this.infoList = res.data.list
      }
    })

    if (this.$route.query.apply == 1) {
      this.$nextTick(() => {
        this.scrollToTarget(".contact-form-box .detail-title");
      })
    }
  },
  methods: {
    goUrl(url) {
      window.open(url, '_blank');
    },
    //滚动到指定位置
    scrollToTarget(clsName) {
      // var element = document.querySelector(".wenxian-box");
      var element = document.querySelector(clsName);
      element.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    },

    setView() {

    },
  },
};
</script>

<style lang="less" scoped>
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
      text-stroke: 1px rgba(0, 0, 0, 0);
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
    display: flex;
    justify-content: space-between;
  }
}

.info-list {
  .title {
    font-weight: bold;
    font-size: 44px;
    color: #FFFFFF;
    margin-bottom: 30px;
  }

  .desc {
    font-weight: 400;
    font-size: 18px;
    color: #F2F2F2;
    margin-bottom: 22px;
  }

  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    cursor: pointer;

    .icon-box {
      width: 24px;
      height: 24px;
      margin-right: 5px;

      img {
        width: 24px;
      }
    }

    .title {
      font-weight: 400;
      font-size: 16px;
      color: #FFFFFF;
      margin-bottom: 0;
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
}
</style>


<style lang="less" scoped src="@/assets/h5css/mobile/contact.less"></style>
