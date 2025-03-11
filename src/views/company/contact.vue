<template>
  <div class="page">
    <div class="inner">
      <div class="page-ctx">
        <div class="contact-info">
          <div>
            <div class="info-list">
              <div class="title">关于合作</div>
              <div class="desc">如果您有任何问题，可以通过以下方式找到我们</div>
            </div>
            <div class="info-list">
              <div class="title">联系我们</div>
              <div class="desc">如果您有任何问题，可以通过以下方式找到我们</div>
              <div class="info-item" v-html="infoList.content"></div>
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
        action: 'news_detail',
        id: 114
      }
    }).then(res=>{
      if (res.code == 200) {
        this.infoList = res.data.info
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

<style scoped lang="less">
.page {
  background-color: #fff;

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
  width: 1400px;
  margin: 0 auto;


  padding-bottom: 90px;

  .contact-info {
    padding-top: 70px;
    display: flex;
    justify-content: space-between;
  }
}

.info-list {
  width: 700px;
  .title {
    font-weight: bold;
    font-size: 26px;
    color: #1A212A;
    margin-bottom: 30px;
    padding-bottom: 18px;
    border-bottom: 1px solid #EAEAEA;
  }

  .desc {
    font-weight: 400;
    font-size: 18px;
    color: #414851;
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

    .title_tip {
      font-weight: 400;
      font-size: 16px;
      color: #000;
      margin-bottom: 0;
    }

    .desc {
      font-family: OPPOSans, OPPOSans;
      // font-weight: bold;
      font-size: 16px;
      color: #000;
    }
  }
}

.contact-form-box {
}
</style>


<style scoped lang="less" src="@/assets/h5css/mobile/contact.less"></style>
