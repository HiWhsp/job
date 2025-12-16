<template>
  <div class="page">
    <div class="page-ctx">
      <div class="inner">
        <div class="banner-box">
          <div class="lunbo-wrap">
            <div class="lunbo-box">
              <el-carousel trigger="click" :autoplay="true">
                <el-carousel-item
                  v-for="(item, index) in vuex_index_banners"
                  :key="index"
                  @click.native="do_banner_click(item)"
                >
                  <img :src="item.image" alt="" />
                </el-carousel-item>
              </el-carousel>
              <div class="lunbo-icon">
                <img src="@img/index/lunbo-icon.png" alt="" />
              </div>
            </div>
          </div>
        </div>

        <div class="content-box w-1400">
          <!-- 产品中心 -->
          <div class="product-center" v-if="vuex_config.proCenterMold == 1">
            <div class="product-center-left">
              <div class="sub-title">
                <h2 class="product-title-text">产品中心</h2>
                <p class="product-subtitle">PRODUCT CENTER</p>
              </div>
              <p class="product-desc">
                了解我们如何更好地 <br />为客户创造价值
              </p>
              <button
                class="learn-more-btn"
                @click="toRouter('/product-cates')"
              >
                了解更多
              </button>
            </div>
            <div class="product-center-right">
              <div class="product-grid">
                <div
                  class="product-item"
                  v-for="(item, index) in productChannelList"
                  :key="index"
                  @click="toRouter(`/product-classes?id=${item.id}`)"
                >
                  <div class="product-image">
                    <img :src="item.thumb" alt="光学元件" />
                  </div>
                  <div class="product-category">{{ item.title }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 产品推荐 -->
          <div class="product-recommendation" v-if="vuex_config.proRecMold == 1">
            <div class="product-grid-container">
              <div class="product-grid-8" v-if="productList.length > 0">
                <div
                  class="product-item"
                  v-for="(item, index) in productList.slice(0, 8)"
                  :key="index"
                  @click="toRouter(`/product-detail?brandId=${item.brand.id}`)"
                >
                  <div class="product-image">
                    <img :src="item.thumb" :alt="`产品${index + 1}`" />
                  </div>
                  <div class="product-category ellipsis-1">
                    {{ item.title }}
                  </div>
                  <button class="view-details-btn">查看详情</button>
                </div>
              </div>
              <el-empty
                v-if="productList.length === 0"
                description="暂无数据"
              />
            </div>
            <div class="recommendation-sidebar">
              <div class="sub-title">
                <h2 class="product-title-text">产品推荐</h2>
                <p class="product-subtitle">RECOMMENDATION</p>
              </div>
              <p class="recommendation-desc">优质好物为您推荐</p>
              <button
                class="learn-more-btn"
                @click="toRouter('/product-cates')"
              >
                了解更多
              </button>
            </div>
          </div>
          <!-- 新闻动态 -->
          <div class="news-section" v-if="vuex_config.newsMold == 1">
            <div class="sub-title">
              <h2 class="product-title-text">新闻动态</h2>
              <p class="product-subtitle">NEWS UPDATES</p>
            </div>
            <div class="news-content" v-if="newsList.length > 0">
              <div class="news-left">
                <div
                  class="news-card"
                  v-for="(item, index) in newsList.slice(0, 2)"
                  :key="index"
                  @click="toRouter(`/news-detail?id=${item.id}`)"
                >
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
              </div>
              <div class="news-right">
                <div class="news-list">
                  <div
                    class="news-item"
                    v-for="(item, index) in newsList.slice(2)"
                    :key="index"
                    @click="toRouter(`/news-detail?id=${item.id}`)"
                  >
                    <h4 class="news-item-title ellipsis-2">
                      {{ item.title }}
                    </h4>
                    <div class="news-item-meta">
                      <span class="news-item-date">{{ item.dtTime }}</span>
                      <button class="news-item-action-btn">
                        <i class="el-icon-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <button class="learn-more-btn" @click="toRouter('/news')">
                  了解更多
                </button>
              </div>
            </div>
            <el-empty v-if="newsList.length === 0" description="暂无数据" />
          </div>
          <!-- 服务中心 -->
          <div class="service-center" v-if="vuex_config.serveMold == 1">
            <div class="sub-title">
              <h2 class="product-title-text">服务中心</h2>
              <p class="product-subtitle">SERVICE CENTER</p>
            </div>
            <div class="service-grid">
              <div
                class="service-card1"
                v-for="item in serviceList[0]"
                :key="item.titletitle"
                @click="toRouter(item.path)"
              >
                <div class="service-content" :style="{ backgroundImage: `url(${item.image})` }">
                  <h3 class="service-title">{{ item.title }}</h3>
                  <p class="service-subtitle">{{ item.subtitle }}</p>
                </div>
              </div>
              <div
                class="service-card"
                v-for="item in serviceList[1]"
                :key="item.title"
              >
                <div class="service-content" :style="{ backgroundImage: `url(${item.image})` }">
                  <!-- <h3 class="service-title">{{ item.title }}</h3> -->
                  <!-- <p class="service-subtitle">{{ item.subtitle }}</p> -->
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
import { mapState } from "vuex";

export default {
  name: "index",
  data() {
    return {
      productList: [],
      productChannelList: [],
      newsList: [],
      serviceList: [
        [
          {
            title: "非标定制",
            subtitle: "根据需求,专属定制",
            image: require("@img/index/custom-order.png"),
            path: "/custom-order",
          },
          {
            title: "快速购物",
            subtitle: "指定产品型号,快速下单",
            image: require("@img/index/quick-buy.png"),
            path: "/quick-buy",
          },
          {
            title: "产品咨询与反馈",
            subtitle: "专业团队无忧售后",
            image: require("@img/index/product-consult.png"),
            path: "/product-consult",
          },
        ],
        [
          {
            title: "空气隙零级波片",
            subtitle: "变倍、定倍定制产品",
            image: require("@img/index/ad1.png"),
          },
          {
            title: "激光聚焦镜",
            subtitle: "紫外、绿光和红外全波",
            image: require("@img/index/ad2.png"),
          },
          {
            title: "同轴视觉玻璃",
            subtitle: "紫外/绿光/红外",
            image: require("@img/index/ad3.png"),
          },
        ],
      ],
    };
  },
  computed: {
    ...mapState([
      //
      "vuex_index_banners",
      "index_full_ani",
      "hotSearchWords",
    ]),
  },

  created() {
    this.setView();
  },
  mounted() {},
  methods: {
    setView() {
      this.query_product_list();
      this.query_product();
      this.query_news();
    },
    // 点击banner
    do_banner_click(item) {
      window.open(item.url, "_blank");
    },
    query_product_list() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_channel",
          // isIndex: 1
        },
      }).then((res) => {
        if (res.code == 200) {
          this.productChannelList = res.data.slice(0, 4);
        }
      });
    },
    query_product() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          rec: 1,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.productList = res.data.list;
        }
      });
    },
    query_news() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          channelId: 49
        },
      }).then((res) => {
        if (res.code == 200) {
          this.newsList = res.data.list;
        }
      });
    },
    toRouter(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="less">
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #2e4c87;
  color: #fff !important;
}

.el-select-dropdown__item.selected {
  color: #2e4c87;
}
</style>

<style scoped lang="less">
.page {
  padding-bottom: 95px;
  background: #fff;

  .inner {
    padding-top: 0;
    margin: 0 auto;
    position: relative;
  }
}

.banner-box {
  position: relative;

  .lunbo-box {
    position: relative;
    width: 100%;
    height: 1080px;

    /deep/ .el-carousel__container {
      height: 1080px;
    }

    /deep/ img {
      width: 100%;
      height: 1080px;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    // /deep/ .el-carousel__item:hover img {
    //   transform: scale(1.05);
    // }

    /deep/ .el-carousel__button {
      border-radius: 50%;
      width: 12px;
      height: 12px;
      background: #fff;
      opacity: 0.58;
    }

    /deep/ .el-carousel__indicators {
      bottom: 80px;
    }

    /deep/ .el-carousel__indicator button {
      width: 80px;
      height: 4px;
      background: #ffffff;
      border-radius: 2px 2px 2px 2px;
    }

    /deep/ .el-carousel__indicator.is-active button {
      background: #2d6ff2;
    }

    .lunbo-icon {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 530px;
      height: 115px;
      z-index: 10;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.content-box {
  margin: 0 auto;
  padding-top: 35px;
  display: flex;
  flex-direction: column;
  gap: 120px;
}

// 公共标题样式
.sub-title {
  &::before {
    content: "";
    display: block;
    width: 80px;
    height: 10px;
    background: #2e4c87;
    margin-bottom: 20px;
  }
  .product-title-text {
    font-size: 48px;
    font-weight: bold;
    color: #242728;
    margin: 0 0 10px 0;
    line-height: 1.2;
  }

  .product-subtitle {
    font-size: 16px;
    color: #242728;
    margin: 0 0 20px 0;
    letter-spacing: 2px;
  }
}

// 产品中心样式
.product-center {
  display: flex;
  overflow: hidden;

  &-left {
    flex: 1;
    background: #fff;
    display: flex;
    flex-direction: column;

    .product-desc {
      font-size: 18px;
      color: #666;
      line-height: 1.6;
      margin: 0 0 40px 0;
    }

    .learn-more-btn {
      width: 140px;
      height: 45px;
      border: 2px solid #073090;
      background: transparent;
      color: #073090;
      font-size: 16px;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }

  &-right {
    flex: 2;

    .product-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      height: 100%;
    }
  }

  .product-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;

    .product-image {
      width: 584px;
      height: 348px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        // object-fit: cover;
        transition: transform 0.3s ease;
      }
    }

    .product-category {
      width: 100%;
      height: 68px;
      line-height: 68px;
      font-size: 20px;
      font-weight: bold;
      color: #000;
      text-align: center;
      background: #fdfdfd;
      border: 1px solid #e4e4e4;
    }

    &:hover {
      .product-image img {
        transform: scale(1.1);
      }
    }
  }
}

// 产品推荐样式
.product-recommendation {
  display: flex;
  margin-bottom: 40px;
  gap: 10px;

  .product-grid-container {
    flex: 1;

    .product-grid-8 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, 1fr);
    }
  }

  .product-item {
    width: 292px;
    height: 408px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    cursor: pointer;
    border: 1px solid #e4e4e4;
    overflow: hidden;

    .product-image {
      width: 100%;
      height: 268px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      overflow: hidden;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }

    .product-category {
      width: 100%;
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      font-weight: bold;
      color: #333;
      text-align: center;
      background: #fdfdfd;
      border-top: 1px solid #e4e4e4;
      padding: 0 15px;
      box-sizing: border-box;
    }

    &:hover {
      .product-image img {
        transform: scale(1.1);
      }
    }

    .view-details-btn {
      width: 120px;
      height: 40px;
      color: #666;
      border: none;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 30px;
      border: 1px solid #c4c4c4;
    }
  }

  .recommendation-sidebar {
    width: 432px;
    background: #fafafa;
    border-radius: 0 250px 0 0;
    padding: 40px 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      right: -20px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 20px solid #fff;
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
    }

    .recommendation-desc {
      font-size: 18px;
      color: #666;
      line-height: 1.6;
      margin: 20px 0 40px 0;
    }

    .learn-more-btn {
      width: 120px;
      height: 45px;
      border: 2px solid #073090;
      background: transparent;
      color: #073090;
      font-size: 16px;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }
}

// 新闻动态样式
.news-section {
  margin-bottom: 40px;

  .news-content {
    display: flex;
    margin-top: 40px;
  }

  .news-left {
    flex: 1;
    display: flex;
    gap: 24px;
    position: relative;

    .news-card {
      background: #fff;
      border: 1px solid #e4e4e4;
      overflow: hidden;
      width: 512px;
      height: 560px;
      cursor: pointer;

      .news-image {
        width: 100%;
        height: 340px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          transition: transform 0.3s ease;
        }
      }

      .news-info {
        padding: 32px;

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
        .news-image img {
          transform: scale(1.1);
        }
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
    &::before {
      content: "";
      position: absolute;
      right: 0;
      top: -171px;
      width: 731px;
      height: 170px;
      background: #f5f5f5;
      border-radius: 250px 0px 0px 0px;
    }
  }

  .news-right {
    width: 552px;
    background: #fafafa;
    padding: 0 0 35px 35px;
    display: flex;
    flex-direction: column;
    position: relative;

    .news-list {
      flex: 1;
      max-height: 460px;
      overflow-y: auto;
      margin-bottom: 20px;
      padding-right: 35px;

      // 自定义滚动条样式
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #fff;
        border-radius: 3px;
        border: 1px solid #dedede;
      }

      &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;

        &:hover {
          background: #a8a8a8;
        }
      }

      .news-item {
        height: 107px;
        border-bottom: 1px solid #f0f0f0;
        transition: all 0.3s ease;
        cursor: pointer;
        margin-bottom: 20px;

        &:last-child {
          border-bottom: none;
        }

        .news-item-title {
          height: 54px;
          font-size: 16px;
          font-weight: bold;
          color: #333;
          line-height: 30px;
        }

        .news-item-meta {
          height: 54px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .news-item-date {
            font-size: 16px;
            color: #999;
          }

          .news-item-action-btn {
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

      .news-item:hover {
        .news-item-title {
          color: #2e4c87;
        }
        .news-item-date {
          color: #2e4c87;
        }
        .news-item-action-btn {
          border-color: #2e4c87;
          background: #2e4c87;
          .el-icon-right {
            color: #fff;
          }
          transform: rotate(-45deg);
        }
      }
    }

    .learn-more-btn {
      width: 120px;
      height: 45px;
      border: 2px solid #666;
      background: transparent;
      color: #666;
      font-size: 16px;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.3s ease;
      align-self: flex-start;

      &:hover {
        transform: translateY(-2px);
      }
    }

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: -171px;
      width: 100%;
      height: 171px;
      background: #fafafa;
      border-radius: 0 250px 0 0;
    }
  }
}

// 服务中心样式
.service-center {
  margin-bottom: 40px;

  .service-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: 40px;
  }
  .service-card1 {
    position: relative;
    height: 160px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #073090;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .service-content {
      width: 100%;
      height: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 0 50px;
      background-size: 100% 100%;
      background-repeat: no-repeat;

      .service-title {
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        margin: 0 0 8px 0;
        line-height: 1.2;
      }

      .service-subtitle {
        font-size: 16px;
        color: #fff;
        margin: 0;
        line-height: 1.4;
      }
    }
  }

  .service-card {
    position: relative;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .service-content {
      width: 100%;
      height: 100%;
      color: #000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      background-size: 100% 100%;
      background-repeat: no-repeat;

    }
  }
}

// 文字省略样式
.ellipsis-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
