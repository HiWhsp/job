<template>
  <div class="page">
    <pageTop :config="pageConfig" />

    <div class="inner">
      <div class="page-ctx">
        <div class="news-ctx">
          <div class="news-title">{{ detail.title }}
            <div class="news-desc">
              {{ detail.dtTime && detail.dtTime.substr(0, 10) }}
            </div>
          </div>
          <div class="news-line"></div>
          <div class="news-html html-frag" v-html="detail.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "index",
  components: {},
  data() {
    return {
      detail: {}
    };
  },
  computed: {
    ...mapState([]),
    pageConfig() {
      return {
        banner: this.bannerMap['新闻中心'],
        title: '新闻中心',
        title_en: 'NEWS',
        list_bread: [
          {
            title: '新闻中心',
            route: '',
          }
        ],
     
      };
    },
  },

  watch: {
    $route() {
      this.setView();
    }
  },
  created() {
    this.setView();
  },
  methods: {

    setView() {
      this.$api("index_newsDetail", {
        id: this.$route.query.id,
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {

          this.detail = data.info;
          // this.last_news = data.last_news || {};
          // this.next_news = data.next_news || {};
          // this.$store.commit("set_vuex_data", {
          //   key: "active_news_right_id",
          //   val: data.info.channel_id,
          // });
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  .inner {
    min-height: 700px;
    padding-top: 50px;
    padding-bottom: 50px;

    background: #FFFFFF url('~@img/company/culture-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}


.page-ctx {
  width: 1520px;
  margin: 0 auto;
  padding-top: 40px;
  padding-bottom: 50px;
  background: #fff;
}



.news-ctx {

  .news-title {
    position: relative;
    font-weight: bold;
    font-size: 24px;
    color: #333333;
    line-height: 24px;
    text-align: center;
    width: 1520px;
    padding: 0 100px;
    margin: 0 auto;
  }

  .news-desc {
    position: absolute;
    top: 0;
    right: 40px;
    font-weight: 400;
    font-size: 14px;
    color: #242424;
  }

  .news-line {
    margin: 20px 0;
    height: 1px;
    background: #F0E9E4;
  }

  .news-html {
    padding: 50px 50px;


    /deep/ img {
      max-width: 100%;
      display: block;
      // margin: 10px auto;
      margin: 0 auto;
      vertical-align: bottom;
    }

  }

}
</style>

<style scoped lang="less" src="@/assets/h5css/page/newsDetail.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/newsDetail.less"></style>