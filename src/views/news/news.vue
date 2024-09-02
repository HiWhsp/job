<template>
  <div class="page">
    <pageTop :config="pageConfig" />

    <div class="inner">
      <div class="page-ctx">
        <div class="ctx-news">
          <div class="ctx-left">
            <!-- <div class="search-box">
            <img class="img-search" src="@img/keyword-search.png" alt="" />
            <input
              v-model="keyword"
              type="text"
              placeholder="请输入要搜索的关键词"
              @keyup.enter="setView"
            />
            <button class="btn-ripple" @click="setView">搜索</button>
          </div> -->

            <div class="cate-title">
              {{ $route.query.id == 27 || !$route.query.id ? '新闻资讯': '通知公告'  }}
            </div>

            <template v-if="count">
              <div class="news-list">
                <router-link v-for="(item, index) in list_news" :key="index" :to="`/newsDetail?id=${item.id}`"
                  class="news-item">
                  <!-- <div class="img-box scale-box">
                  <img :src="item.originalPic" alt="" class="scale-img" />
                </div> -->
                  <div class="info-box">
                    <div class="news-title">
                      <div class="title-text">
                        {{ item.title }}
                      </div>
                      <p class="news-date">{{ item.dtTime?.substr(0, 10) }}</p>
                    </div>
                    <h2 class="desc">
                      {{ item.content }}
                    </h2>
                  </div>
                </router-link>
              </div>

              <div class="pagination-box" style="margin-top: 40px">
                <el-pagination background layout="total,prev, pager, next" :total="count"
                  :current-page="pagination.page" :page-size="pagination.page_num" @current-change="changePage">
                </el-pagination>
              </div>
            </template>
            <template v-else>
              <el-empty description="没有查询到相关信息..."></el-empty>
            </template>
          </div>

          <div class="ctx-right">
            <div class="right-title">
              最新公告
            </div>
            <div class="suggest-item" v-for="(item, index) in suggest_news" :key="index">
              <router-link :to="'/newsDetail?id=' + item.id"> {{ item.title }} </router-link>
              <div class="date">
                {{ item.dtTime.substr(0,10) }}
              </div>
            </div>
          </div>
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
      keyword: "",
      news_cate_id: this.$route.params.id || "", //当前新闻分类id
      count: 0,
      pagination: {
        page: 1,
        page_num: 10,
      },
      list_news: [],
      suggest_news: [],
    };
  },
  computed: {
    ...mapState([""]),

    pageConfig() {
      return {
        banner: this.bannerMap['新闻中心'],
        title: '新闻中心',
        title_en: 'News',
        list_bread: [
          {
            title: '新闻中心',
            route: '',
          }
        ]
      };
    },

  },

  watch: {
    $route(curr, prev) {
      this.setView();
    },
  },

  created() {
    this.querySuggest();
    this.setView();
  },

  methods: {
    // changePage(page) {
    //   this.pagination.page = page;
    //   this.setView();
    // },

    setView() {
      //console.log("setView");
      this.$api("index_newsList", {
        channel_id: this.$route.query.id,
        content_len: 150,
        ...this.pagination,
        keyword: this.keyword,
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          this.list_news = data.list;
          this.count = data.count;
        }
      });
    },

    querySuggest() {
      this.$api("index_newsList", {
        channel_id: 28,
        content_len: 150,
        page: 1,
        page_num: 6,
        keyword: this.keyword,
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          this.suggest_news = data.list;
          this.count = data.count;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  .inner {
    background: #FFFFFF;
    padding: 50px 0;
  }
}


.page-ctx {

  width: @width;
  margin: 0 auto;
  padding-top: 0;
  padding-bottom: 20px;
  text-align: left;

}

.ctx-news {
  display: flex;
  align-items: flex-start;


  .ctx-left {
    background: #fff;
    flex: 1;
    overflow: hidden;
    padding: 24px 30px;


    .cate-title {
      font-weight: normal;
      font-size: 32px;
      color: #333333;
    }

    .news-list {
      .news-item {
        display: block;
        padding: 24px 0;
        border-bottom: 1px solid #eee;

        &:hover {
          .news-title {
            color: #4CA5E4 !important;
          }
        }


        .news-title {
          .flex-between();
        }


        .info-box {



          .news-title {
            .flex-between();
            .ellipsis-1();
            font-size: 16px;
            color: #333333;
          }

          .desc {
            margin-top: 20px;
            .ellipsis-2();
            font-weight: 400;
            font-size: 14px;
            color: #777777;
            line-height: 24px;
          }

          .news-date {
            margin-top: 16px;
            font-size: 14px;
            font-family: MicrosoftYaHei-, MicrosoftYaHei;
            font-weight: normal;
            color: #999999;
          }
        }
      }
    }
  }

  .ctx-right {
    margin-left: 24px;
    width: 340px;
    padding: 24px 20px;
    background: #fff;

    .right-title {
      font-weight: normal;
      font-size: 32px;
      color: #333333;
    }

    .suggest-item {
      padding: 20px 0;
      border-bottom: 1px solid #ddd;

      a {
        display: block;
        .ellipsis-2();
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        line-height: 24px;

        &:hover {
          color: #4CA5E4;
        }
      }

      .date {
        margin-top: 15px;
        text-align: right;
        color: #999999;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/news.less"></style>


<style scoped lang="less" src="@/assets/h5css/mobile/news.less"></style>