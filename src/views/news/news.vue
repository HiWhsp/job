<template>
  <div class="page">
    <news_banner />
    <page_breadcrumb :option="nav_option" />
    <div class="inner">
      <div class="page-ctx w-1400">
        <div class="ctx-news">
          <div class="ctx-left">
            <div class="news-wrap" v-if="count">
              <div class="news-list">
                <router-link
                  v-for="(item, index) in list_news"
                  :key="index"
                  :to="`/news-detail?id=${item.id}`"
                >
                  <div class="news-card">
                    <div class="news-image">
                      <img :src="item.thumb" :alt="`新闻${index + 1}`" />
                    </div>
                    <div class="news-info">
                      <h3 class="news-title ellipsis-2">
                        {{ item.title }}
                      </h3>
                      <div class="news-meta">
                        <span class="news-date">{{ item.dtTime }}</span>
                        <button class="news-action-btn">
                          <i class="el-icon-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
              <div class="pagination-box" style="margin-top: 40px">
                <el-pagination
                  background
                  layout="total,prev, pager, next"
                  :total="count"
                  :current-page="pagination.page"
                  :page-size="pagination.pageNum"
                  @current-change="on_current_change"
                >
                </el-pagination>
              </div>
            </div>
            <div class="empty-box" v-else>
              <el-empty description="没有查询到相关信息..."></el-empty>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import news_banner from "./components/news_banner.vue";
import page_breadcrumb from "@/components/page/page-breadcrumb.vue";

export default {
  name: "news",
  components: {
    news_banner,
    page_breadcrumb,
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
      first_suggest: {},
      //
      keyword: "",
    };
  },
  computed: {
    nav_option() {
      let option = [
        {
          route: "",
          title: this.$route.meta.title,
        },
        {
          route: "/news",
          title: "新闻动态",
        },
      ];
      return option;
    },
  },
  watch: {
    $route(to, from) {
      this.initParams();
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
          channelId: 49,
          keyword: "",
          ...this.pagination,
          isIndex: 0, //类型：0-全部 1-推荐
          contentLen: "100", //
          orderType: 0, //排序情况：0-自然排序 1-最新
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
          isIndex: 1, //类型：0-全部 1-推荐
          contentLen: "100", //
          orderType: 0, //排序情况：0-自然排序 1-最新
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.suggest_news = data.list;
          this.first_suggest = data.list[0];
          // this.count = data.count;
        }
      });
    },

    on_current_change(value) {
      this.pagination.page = value;
      this.setView();
    },
  },
};
</script>

<style scoped lang="less">
.page {
  .inner {
    background: #f3f3f3;
    padding: 24px 0;
  }
}
.bread-box {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e4e4e4;
  background: #fff;
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

    .cate-title {
      font-weight: normal;
      font-size: 32px;
      color: #333333;
    }

    .news-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      .news-card {
        display: flex;
        background: #fff;
        border: 1px solid #e4e4e4;
        overflow: hidden;
        width: 785px;
        height: 200px;
        cursor: pointer;

        .news-image {
          width: 300px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .news-info {
          padding: 20px;
          flex: 1;
          background: #fff;
          .news-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            line-height: 1.4;
            margin: 0 0 40px 0;
          }

          .news-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .news-date {
              font-size: 16px;
              color: #666;
            }

            .news-action-btn {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: none;
              background: #fff;
              border: 1px solid #dedede;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.3s ease;
              font-size: 16px;
            }
          }
        }

        &:hover {
          .news-info {
            .news-title {
              color: #2e4c87;
            }
            .news-date {
              color: #2e4c87;
            }
            .news-action-btn {
              border-color: #2e4c87;
              background: #2e4c87;
              .el-icon-right {
                color: #fff;
              }
              transform: rotate(-45deg);
            }
          }
        }
      }
    }
  }
}
</style>
