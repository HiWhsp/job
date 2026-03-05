<template>
  <div class="page">
    <div class="page-top">
      <div class="page-bread w-1400">
        <div class="bread-box">
          <router-link to="/">Home</router-link>
          <span class="arrow">/</span>
          <a class="link">{{ activeTabName }}</a>
        </div>
      </div>
    </div>
    <div class="inner">
      <div class="page-ctx w-1400">
        <div class="ctx-news">
          <div class="ctx-left">
            <div
              class="news-title"
            >{{ activeTabName }}</div>
            <div class="news-wrap" v-if="count">
              <div class="news-list">
                <div v-for="(item, index) in list_news" :key="index" class="news-item">
                  <!-- 左侧图片 -->
                  <div class="card-image">
                    <el-image :src="item.thumb" fit="cover"></el-image>
                  </div>

                  <!-- 中间内容区域 -->
                  <div class="card-content">
                    <div class="card-title" @click="handle_detial(item)">{{ item.title }}</div>
                    <div class="card-description">{{ item.content }}</div>
                  </div>

                  <!-- 右侧操作按钮 -->
                  <div class="card-action">
                    <!-- <div class="detail-link" @click="handle_detial(item)">查看详情 ></div> -->

                    <!-- <router-link
                        :to="`/news-detail?id=${item.id}`"
                        class="card-link"
                      >
                        查看详情 >
                    </router-link>-->
                  </div>
                </div>
              </div>
              <div class="pagination-box">
                <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pagination.page"
                  :page-size="pagination.pageNum"
                  layout="prev, pager, next"
                  :total="count"
                ></el-pagination>
              </div>
            </div>
            <div class="empty-box" v-else>
              <el-empty description="no data..."></el-empty>
            </div>
          </div>

          <div class="ctx-right">
            <!-- 更多服务标题 -->
            <!-- <div class="more-services-title">
              <img src="@img/other/news-tit.png" class="marker-img" alt />
              相关服务
            </div>-->

            <!-- 服务卡片列表 -->
            <div class="service-cards-list">
              <!-- 服务卡片1 -->
              <div
                class="recommend-card service-card"
                v-for="(item, index) in otherCategories_list"
                :key="item.id"
                :class="{ 'active': index == 0 }"
                @click="handleTabClick(item, index)"
              >
                <div class="card-content">
                  <h3 class="card-title">{{ item.title }}</h3>
                  <div class="card-desc">{{ item.description || '--'}}</div>
                </div>
                <div class="card-icon">
                  <div class="card-more">
                    <span>MORE</span>
                    <!-- <i class="el-icon-right"></i> -->
                  </div>
                  <div class="icon-placeholder" v-if="index != 0">
                    <el-image :src="item.thumb" fit="cover"></el-image>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import news_banner from "./components/news_banner.vue";
import { mapState } from "vuex";

export default {
  name: "news",
  components: {
    news_banner
    // news_right,
  },
  data() {
    return {
      cid: this.$route.query.id, //当前主页分类id
      pagination: {
        page: 1,
        pageNum: 10
      },
      count: 0, //总数
      activeTab: null, 
      activeTabName: "0", // el-tabs需要的字符串类型

      list_news: [], //新闻列表
      tabList: [], //分类列表
      otherCategories_list: []
    };
  },
  computed: {
    ...mapState(["vuex_news_cates"]),
  },
  watch: {
    $route(to, from) {
      this.get_tab_list();
    }
  },
  mounted() {
    // this.query_suggest();
    this.get_tab_list();
  },

  methods: {
    //跳转详情
    handle_detial(item) {
      this.$router.push({
        path: "/news-detail",
        query: {
          id: item.id
        }
      });
    },
    //获取顶部列表
    get_tab_list() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_channel",
          channelId: this.$route.query.id || 66
        }
      }).then(res => {
        if (res.code == 200) {
          this.tab = res.data;
          this.tabList = res.data; // 将API数据赋值给tabList
          if (res.data.length) {
            this.activeTab = res.data[0].id + ""; // 同步activeTabName
            this.activeTabName = res.data[0].title + "";
          }
          this.otherCategories_list = [res.data[1]];
          this.otherCategories_list.push(...this.vuex_news_cates.filter(item => item.id != this.$route.query.id));
          this.get_lsit();
        }
      });
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.get_lsit();
    },
    handleSizeChange(val) {
      this.pagination.pageNum = val;
      this.get_lsit();
    },
    //获取新闻列表
    get_lsit() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          channelId: this.activeTab, // 使用当前选中tab的id
          keyword: "",
          ...this.pagination,
          isIndex: 0, //类型：0-全部 1-推荐
          contentLen: "100", //
          orderType: 0 //排序情况：0-自然排序 1-最新
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data;

          this.list_news = data.list;
          this.count = data.count;
        }
      });
    },

    // el-tabs点击事件处理
    handleTabClick(tab, index) {
      this.activeTab = tab.id + "";
      this.activeTabName = tab.title + "";
      this.pagination.page = 1; // 重置页码
      if (index == 0) {
        const list = this.tabList.filter(item => item.id != this.activeTab);
        this.otherCategories_list = [...list];
        this.otherCategories_list.push(...this.vuex_news_cates.filter(item => item.id != this.$route.query.id));
      } else {
        this.$router.push({
          path: "/news",
          query: {
            id: tab.id
          }
        });
      }
      this.get_lsit(); // 重新获取数据
    },
  }
};
</script>

<style scoped lang="less">
.page {
  .inner {
    padding-top: 32px;
    background: #fff;
  }
}

.page-top {
  height: 83px;
  line-height: 83px;
  background: #fbfbfb;
  border-top: 1px solid #d5d8de;
  .bread-box {
    display: flex;
    align-items: flex-start;
    a {
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 16px;
      color: #5e5e5e;
    }
    .arrow {
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 18px;
      color: #5e5e5e;
      margin: 0 6px;
    }
    .link {
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 18px;
      color: #5e5e5e;
    }
  }
}

.page-ctx {
  margin: 0 auto;
  padding-top: 0;
  padding-bottom: 100px;
  text-align: left;
}
/deep/.is-top {
  margin: 0 !important;
  line-height: 60px;
  &::after {
    background: none;
  }
}
.ctx-news {
  display: flex;
  align-items: flex-start;

  .ctx-left {
    flex: 1;
    overflow: hidden;
    margin-right: 24px;

    .news-title {
      font-weight: bold;
      font-size: 30px;
      color: #1e262e;
      margin-bottom: 43px;
    }

    .news-list {
      background: #ffffff;
      border-radius: 0 0 4px 4px;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 20px;

      // 卡片布局样式
      &.card-layout {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .news-item {
        display: flex;
        align-items: flex-start;
        padding: 24px;
        position: relative;
        transition: background-color 0.3s ease;
        background: #FBFBFB;
        border-radius: 20px;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          .company-title {
            color: #EC6A2B;
          }
        }

        // 卡片项样式
        &.card-item {
          flex-direction: row;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
          background: #ffffff;
          border-radius: 8px;
          // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            background-color: #ffffff;
          }
        }

        .shield-icon {
          width: 60px;
          height: 60px;
          flex-shrink: 0;
          margin-right: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #00306b;
          border-radius: 8px;
          position: relative;

          img {
            width: 40px;
            height: 40px;
            object-fit: contain;
          }

          // 如果没有图片，使用CSS创建盾牌图标
          &:not(:has(img))::before {
            content: "✚";
            color: #ffffff;
            font-size: 28px;
            font-weight: bold;
          }
        }

        .item-content {
          flex: 1;

          .company-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f1f1f;
            margin-bottom: 12px;
            line-height: 1.5;
            cursor: pointer;
            transition: color 0.3s ease;
            font-family: Microsoft YaHei, Microsoft YaHei;

            &:hover {
              color: #EC6A2B;
            }
          }

          .item-description {
            font-size: 14px;
            color: #666666;
            line-height: 1.8;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            overflow: hidden;
            text-overflow: ellipsis;
            font-family: Microsoft YaHei, Microsoft YaHei;
          }
        }
        // 卡片图片
        .card-image {
          width: 280px;
          height: 167px;
          flex-shrink: 0;
          margin-right: 50px;
          border-radius: 4px;
          overflow: hidden;

          .el-image {
            width: 100%;
            height: 100%;
          }
        }

        // 卡片内容
        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-right: 20px;

          .card-title {
            font-size: 24px;
            font-weight: bold;
            color: #282828;
            margin-bottom: 54px;
            line-height: 1.4;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
              color: #EC6A2B;
            }
          }

          .card-description {
            font-size: 20px;
            color: #777777;
            line-height: 35px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 63px;
          }
        }

        // 卡片操作按钮
        .card-action {
          flex-shrink: 0;
          display: flex;
          align-items: center;

          .card-link {
            color: #00306B;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s ease;
            padding: 8px 16px;
            // border: 1px solid #00306B;
            border-radius: 4px;
            display: inline-block;

            &:hover {
              color: #ffffff;
              background-color: #00306B;
              text-decoration: none;
            }
          }
        }
      }
    }
  }

  .ctx-right {
    .more-services-title {
      display: flex;
      align-items: center;
      padding: 26px;
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      background: #fff;
      border-bottom: 1px solid #d5d8de;
      .marker-img {
        margin-right: 10px;
        width: 20px;
      }
    }

    .service-cards-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      // padding: 20px;
      background: #fff;

      .recommend-card {
        border-radius: 12px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
      }

      // 服务卡片样式
      .service-card {
        padding: 30px 20px;
        width: 354px;
        height: 330px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: #feeedd; // 浅橙色

        &.active {
          background: #fbfbfb;
        }

        &:hover {
          .card-content .card-title {
            color: #ec6a2b;
          }
        }

        .card-content {
          flex: 1;

          .card-title {
            margin: 0 0 16px 0;
            position: relative;
            padding-bottom: 12px;
            font-family: Poppins, Poppins;
            font-weight: bold;
            font-size: 24px;
            color: #1e262e;
            line-height: 34px;

            &::after {
              content: "";
              position: absolute;
              bottom: 0;
              left: 0;
              width: 40px;
              height: 3px;
              background: #ec6a2b;
            }
          }

          .card-desc {
            font-family: Poppins, Poppins;
            font-weight: 400;
            font-size: 18px;
            color: #1e262e;
            line-height: 30px;
            height: 115px;
          }
        }

        .card-icon {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .card-more {
            font-family: Poppins, Poppins;
            font-weight: bold;
            font-size: 18px;
            color: #ec6a2b;
            line-height: 25px;
            display: flex;
            align-items: center;
            gap: 8px;

            i {
              font-size: 18px;
              color: #ec6a2b;
            }
          }

          .icon-placeholder {
            width: 70px;
            height: 70px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}

.pagination-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 74px;
  background: #ffffff;
  border-radius: 0 0 4px 4px;
  gap: 20px;

  .pagination-info {
    font-size: 14px;
    color: #1f1f1f;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;

    .page-arrow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      color: #1f1f1f;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(.disabled) {
        border-color: #00306B;
        color: #00306B;
      }

      &.disabled {
        color: #ccc;
        cursor: not-allowed;
        border-color: #f0f0f0;
      }
    }

    .page-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      color: #1f1f1f;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(.dots) {
        border-color: #00306B;
        color: #00306B;
      }

      &.active {
        background: #00306B;
        border-color: #00306B;
        color: #ffffff;
      }

      &.dots {
        border: none;
        cursor: default;
        color: #505050;
        font-size: 14px;
        padding: 0 4px;
      }
    }
  }

  .goto-page {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #1f1f1f;

    .page-input {
      width: 50px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      outline: none;

      &:focus {
        border-color: #00306B;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/news.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/news.less"></style>

<!-- 全局样式覆盖Element UI的tab颜色 -->
<style lang="less">
.custom-tabs {
  border-bottom: 1px solid #d5d8de;
  padding: 23px 63px;
  .el-tabs__item {
    color: #1f1f1f !important;
    font-size: 16px;
    font-weight: bold;

    &:hover {
      color: #00306B !important;
    }

    &.is-active {
      color: #00306B !important;
    }
  }

  .el-tabs__active-bar {
    background-color: #00306B !important;
  }
}

/* 使用深度选择器确保样式穿透 */
.custom-tabs ::v-deep .el-tabs__item {
  color: #1f1f1f !important;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    color: #00306B !important;
  }

  &.is-active {
    color: #00306B !important;
  }
}

.custom-tabs ::v-deep .el-tabs__active-bar {
  background-color: #00306B !important;
}
</style>