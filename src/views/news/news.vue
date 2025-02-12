<template>
  <div class="page">
    <!-- <pageTop :config="pageConfig" /> -->
     <news_banner />


    <div class="inner">
      <div class="page-ctx w-1400">
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

            <div class="news-wrap" v-if="count">
              <div class="news-list">
                <router-link v-for="(item, index) in list_news" :key="index" :to="`/news-detail?id=${item.id}`"
                  class="news-item flex">
                  <div class="img-box scale-box">
                    <img :src="item.thumb" alt="" class="scale-img" />
                  </div>
                  <div class="info-box">
                    <div class="news-title">
                      <div class="title-text">
                        {{ item.title }}
                      </div>
                    </div>
                    <div class="news-desc">
                      <div class="desc-text">
                        {{ item.content }}
                      </div>
                    </div>
                    <div class="news-date">{{ item.dtTime?.substr(0, 10) }}</div>
                  </div>
                </router-link>
              </div>
              <div class="pagination-box" style="margin-top: 40px">
                <el-pagination background layout="total,prev, pager, next" :total="count"
                  :current-page="pagination.page" :page-size="pagination.pageNum" @current-change="on_current_change">
                </el-pagination>
              </div>
            </div>
            <div class="empty-box" v-else>
              <el-empty description="没有查询到相关信息..."></el-empty>
            </div>
          </div>

          <news_right />
          <!-- <div class="ctx-right">
            <div class="right-title flex">
              <span class="marker"></span>
              最新资讯
            </div>
            <div class="suggest-poster scale-box" v-if="first_suggest.thumb">
              <img class="scale-img" :src="first_suggest.thumb" alt="">
            </div>
            <div class="suggest-list">
              <div class="suggest-item flex" v-for="(item, index) in suggest_news" :key="index">
                <span class="dot"></span>
                <router-link class="ellipsis-1" :to="'/news-detail?id=' + item.id"> {{ item.title }} </router-link>
              </div>
            </div>
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
  name: "news",
  components: {
    news_banner,
    news_right
  },
  data() {
    return {
      cid: this.$route.query.cid,
      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      list_news: [],
      suggest_news: [],
      first_suggest:{},
      //
      keyword: "",
    };
  },
  computed: {
    ...mapState([""]),

  },
  watch: {
    $route(to, from) {
      this.initParams()
      this.setView();
    },
  },
  created() {
    this.query_suggest();
    this.setView();
  },

  methods: {
    initParams() {
      this.cid = this.$route.query.cid;
      this.pagination.page = 1;
    },
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          channelId: this.cid,
          keyword: '',
          ...this.pagination,
          isIndex: 0,//类型：0-全部 1-推荐
          contentLen: '100',//
          orderType: 0,//排序情况：0-自然排序 1-最新
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;

          this.list_news = data.list;
          this.count = data.count;
        }
      });
    },

    query_suggest() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          ...this.pagination,
          isIndex: 1,//类型：0-全部 1-推荐
          contentLen: '100',//
          orderType: 0,//排序情况：0-自然排序 1-最新
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.suggest_news = data.list;
          this.first_suggest = data.list[0]
          // this.count = data.count;
        }
      });
    },

    on_current_change(value) {
      this.pagination.page = value
      this.setView()
    }
  },
};
</script>

<style scoped lang="less">
.page {
  .inner {
    background: #F3F3F3;
    padding: 24px 0;
  }
}

.page-ctx {
  margin: 0 auto;
  padding-top: 0;
  padding-bottom: 20px;
  text-align: left;
}

.ctx-news {
  display: flex;
  align-items: flex-start;


  .ctx-left {
    flex: 1;
    overflow: hidden;
    margin-right: 24px;


    .cate-title {
      font-weight: normal;
      font-size: 32px;
      color: #333333;
    }

    .news-list {
      .news-item {
        margin-bottom: 12px;
        padding: 20px;
        background: #FFFFFF;
        border-radius: 4px 4px 4px 4px;

        &:hover {
          .title-text {
            color: #F74747 !important;
          }
        }

        .img-box {
          width: 200px;
          height: 140px;
          border-radius: 4px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .info-box {
          flex: 1;
          padding-left: 32px;

          .news-title {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;

            .title-text {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: bold;
              font-size: 20px;
              color: #282828;
            }
          }

          .news-desc {
            margin-top: 20px;
            height: 50px;

            .desc-text {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-line-clamp: 2;
              font-weight: 400;
              font-size: 14px;
              color: #777777;
              line-height: 24px;
            }
          }

          .news-date {
            margin-top: 16px;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 14px;
            color: #5E5E5E;
          }
        }
      }
    }
  }

  .ctx-right {

  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/news.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/news.less"></style>