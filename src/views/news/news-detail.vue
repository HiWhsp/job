<template>
  <div class="page">
    <!-- <news_banner /> -->

    <div class="inner">
      <div class="page-ctx w-1400">
        <div class="ctx-box ">
          <div class="ctx-left">
            <div class="news-ctx">
              <div class="news-title">
                {{ detail.title }}
              </div>
              <div class="news-desc">
                发布时间： {{ detail.dtTime && detail.dtTime.substr(0, 10) }}
              </div>
              <div class="news-line"></div>
              <div class="news-content">
                <div class="html-box">
                  <div class="news-html html-frag" v-html="detail.content"></div>
                </div>
              </div>
              <div class="nav-box">
                <div class="nav-item">
                  上一条：<router-link v-if="last_news.id" :to="'news-detail?id=' + last_news.id">{{ last_news.title
                    }}</router-link>
                  <span v-else>无</span>
                </div>
                <div class="nav-item">
                  下一条：<router-link v-if="next_news.id" :to="'news-detail?id=' + next_news.id">{{ next_news.title
                    }}</router-link>
                  <span v-else>无</span>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="ctx-right">
            <news_right :current_cid="detail.channelId"/>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import news_banner from './components/news_banner.vue'
import news_right from './components/news_right.vue'

import { mapState } from "vuex";

export default {
  name: "news-detail",
  components: {
    news_banner,
    news_right
  },
  data() {
    return {
      id: this.$route.query.id,
      detail: {},
      last_news: {},
      next_news: {},
    };
  },
  computed: {
    // ...mapState([]),
  },
  watch: {
    $route() {
      this.initParams()
      this.setView();
    }
  },
  created() {
    this.setView();
  },
  methods: {
    initParams() {
      this.id = this.$route.query.id;
    },
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_detail",
          id: this.id
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.detail = data.info;
          this.last_news = data.last_news || {};
          this.next_news = data.next_news || {};
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
    padding-top: 24px;
    padding-bottom: 30px;
  }
}

.page-ctx {
  margin: 0 auto;
}

.ctx-box {
  display: flex;
  align-items: flex-start;

  .ctx-left {
    flex: 1;
    margin-right: 24px;
    background: #fff;
  }
}


.news-ctx {
  padding: 36px;

  .news-title {
    text-align: center;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 28px;
    color: #000000;
    line-height: 48px;
  }

  .news-desc {
    margin-top: 30px;
    text-align: center;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 10px;
    color: #333333;
  }

  .news-line {
    margin: 24px 0;
    height: 1px;
    background: #ccc;
  }

  .news-html {
    padding: 10px 0;

    /deep/ img {
      max-width: 100%;
      display: block;
      // margin: 10px auto;
      margin: 0 auto;
      vertical-align: bottom;
    }
  }

  .nav-box {
    border-top: 1px solid #ccc;
    padding-top: 40px;
    margin-top: 40px;
    .nav-item {
      margin-bottom: 26px;
      cursor: pointer;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #000000;

      a {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #000000;
      }

      &:hover {
        a {
          color: #f00;
        }
      }
    }
  }

}
</style>

<style scoped lang="less" src="@/assets/h5css/page/newsDetail.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/newsDetail.less"></style>