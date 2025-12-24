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
      scrollPosition: 0, // 滚动位置
      scrollTimer: null, // 滚动防抖定时器
      isRestored: false, // 是否已恢复滚动位置
    };
  },
  computed: {
    nav_option() {
      let option = [
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
      // 路由变化时重置恢复标志
      this.isRestored = false;
      this.initParams();
      this.setView();
    },
  },
  beforeRouteLeave(to, from, next) {
    // 离开页面时保存滚动位置
    this.saveScrollPosition();
    next();
  },
  created() {
    this.query_suggest();
    this.setView();
  },
  mounted() {
    // 监听滚动事件
    window.addEventListener("scroll", this.handleScroll, { passive: true });
  },
  beforeDestroy() {
    // 组件销毁前保存滚动位置
    this.saveScrollPosition();
    // 移除滚动监听
    window.removeEventListener("scroll", this.handleScroll);
    // 清除定时器
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
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

          // 等待 DOM 更新和所有图片加载完成后再恢复滚动位置
          this.$nextTick(() => {
            this.waitForImagesLoad().then(() => {
              // 再等待一下确保页面完全渲染
              setTimeout(() => {
                this.restoreScrollPosition();
              }, 100);
            });
          });
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

    // 保存滚动位置
    saveScrollPosition() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      sessionStorage.setItem("news_scroll_position", scrollTop.toString());
    },

    // 等待所有图片加载完成
    waitForImagesLoad() {
      return new Promise((resolve) => {
        // 确保 $el 存在
        if (!this.$el) {
          setTimeout(() => {
            resolve();
          }, 100);
          return;
        }
        
        const images = this.$el.querySelectorAll("img");
        if (images.length === 0) {
          // 如果没有图片，等待一小段时间确保 DOM 完全渲染
          setTimeout(() => {
            resolve();
          }, 100);
          return;
        }

        let loadedCount = 0;
        const totalImages = images.length;

        // 检查图片是否已经加载完成
        const checkImageLoad = (img) => {
          if (img.complete && img.naturalHeight !== 0) {
            loadedCount++;
            if (loadedCount === totalImages) {
              resolve();
            }
          } else {
            img.onload = () => {
              loadedCount++;
              if (loadedCount === totalImages) {
                resolve();
              }
            };
            img.onerror = () => {
              // 图片加载失败也计入已加载
              loadedCount++;
              if (loadedCount === totalImages) {
                resolve();
              }
            };
          }
        };

        // 遍历所有图片
        images.forEach((img) => {
          checkImageLoad(img);
        });

        // 设置超时，防止某些图片一直不加载
        setTimeout(() => {
          if (loadedCount < totalImages) {
            resolve();
          }
        }, 3000);
      });
    },

    // 恢复滚动位置
    restoreScrollPosition() {
      // 防止重复恢复
      if (this.isRestored) {
        return;
      }

      const savedPosition = sessionStorage.getItem("news_scroll_position");
      if (savedPosition) {
        const scrollTop = parseInt(savedPosition, 10);
        if (scrollTop > 0) {
          // 使用多次尝试确保滚动成功
          const tryScroll = (attempts = 0) => {
            if (attempts > 20) {
              // 最多尝试20次
              this.isRestored = true;
              return;
            }
            
            // 确保页面高度足够
            const pageHeight = Math.max(
              document.body.scrollHeight,
              document.body.offsetHeight,
              document.documentElement.clientHeight,
              document.documentElement.scrollHeight,
              document.documentElement.offsetHeight
            );
            
            if (pageHeight < scrollTop && attempts < 5) {
              // 如果页面高度不够，等待一下再试
              setTimeout(() => {
                tryScroll(attempts + 1);
              }, 100);
              return;
            }
            
            requestAnimationFrame(() => {
              window.scrollTo({
                top: scrollTop,
                behavior: "auto",
              });
              
              // 检查是否滚动成功，如果没成功则重试
              setTimeout(() => {
                const newScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if (Math.abs(newScroll - scrollTop) > 10 && attempts < 20) {
                  // 如果滚动位置差距大于10px，继续尝试
                  tryScroll(attempts + 1);
                } else {
                  this.isRestored = true;
                }
              }, 100);
            });
          };
          
          tryScroll();
        } else {
          this.isRestored = true;
        }
      } else {
        this.isRestored = true;
      }
    },

    // 处理滚动事件（防抖）
    handleScroll() {
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.scrollTimer = setTimeout(() => {
        this.saveScrollPosition();
      }, 150); // 150ms 防抖
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
            transition: transform 0.3s ease;
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
          .news-image img {
            transform: scale(1.1);
          }
        }
      }
    }
  }
}
</style>
