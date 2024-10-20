<template>
    <div class="page">
        <el-carousel class="banner" indicator-position="none" arrow="always">
            <el-carousel-item v-for="item in bannerList.length" :key="item">
                <div class="banner-img-wrap">
                    <img :src="bannerList[item - 1]" alt="banner"/>
                </div>
            </el-carousel-item>
        </el-carousel>

        <div class="activity-area">
            <div class="img-wrap-left">
                <img src="../static/home/activity-area/left.png" alt="activity-img"/>
            </div>
            <div class="img-wrap">
                <img src="../static/home/activity-area/mid.png" alt="activity-img"/>
            </div>
            <div class="img-wrap">
                <img src="../static/home/activity-area/right.png" alt="activity-img"/>
            </div>
        </div>

        <div class="featuredRecommendations">
            <div class="title-wrap">
                <div class="title">
                    <span class="main-title">精品<span style="color: #27417c">推荐</span></span>
                    <span class="sub-title">精挑细选 省心省力</span>
                </div>
                <div class="arrow-wrap">
                    <div class="img-wrap">
                        <img
                                src="../static/home/featuredRecommendations/left-arrow.png"
                                alt="arrow"
                        />
                    </div>
                    <div class="img-wrap">
                        <img
                                src="../static/home/featuredRecommendations/right-arrow.png"
                                alt="arrow"
                        />
                    </div>
                </div>
            </div>
            <div class="high-quality-products">
                <el-carousel indicator-position="none" arrow="never">
                    <el-carousel-item class="product-carousel" v-for="(item, index) in productList" :key="index">
                        <div class="product-wrap" v-for="it in item" :key="it.src">
                            <div class="img-wrap">
                                <img :src="it.images" alt=""/>
                            </div>
                            <div class="desc-wrap">
                                <div class="desc ellipsis-2">{{ it.title }}</div>
                                <div class="price-wrap">
                                    <div class="price">
                                        <span style="font-size: 14px">￥</span>{{ it.priceSale }}
                                    </div>
                                    <div class="cart pointer">
                                        <img src="../static/home/featuredRecommendations/cart.png" alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>

        <!-- 仪器查看更多 -->
        <div class="pic">
            <div class="pic-row-1">
                <div class="img-wrap-1">
                    <img src="../static/home/pic/pic_01.png" alt=""/>
                    <span class="pic-title">光源</span>
                    <div class="pic-content">
                        概要文字概要文字概要文字概要文字概要文字概要文字
                    </div>
                    <div class="pic-readmore">
                        <div class="readmore">查看更多</div>
                        <div class="arrow">
                            <img src="../static/home/pic/right_arrow.png"/>
                        </div>
                    </div>
                </div>
                <div class="img-wrap-2">
                    <img src="../static/home/pic/pic_02.png" alt=""/>
                    <span class="pic-title">实验室解决方案</span>
                    <div class="pic-content">
                        概要文字概要文字概要文字概要文字概要文字概要文字
                    </div>
                </div>
            </div>
            <div class="pic-row-2">
                <div class="img-wrap-3">
                    <img src="../static/home/pic/pic_03.png" alt=""/>
                    <span class="pic-title">配件</span>
                    <div class="pic-content">
                        概要文字概要文字概要文字概要文字概要文字概要文字
                    </div>
                </div>
                <div class="img-wrap-4">
                    <img src="../static/home/pic/pic_04.png" alt=""/>
                    <span class="pic-title">仪器</span>
                    <div class="pic-content">
                        概要文字概要文字概要文字概要文字概要文字概要文字
                    </div>
                </div>
            </div>
        </div>

        <!-- 新闻和活动 -->
        <section class="news-activity">
            <div class="news-header">
                <div class="header-left">
                    <div class="header-title">
                        <span style="color: #27417c">新闻</span>与活动
                    </div>
                    <div class="header-subtitle">我们从未停止探索</div>
                </div>
                <div class="header-right">
                    <div class="img-wrap">
                        <i class="el-icon-arrow-left"></i>
                    </div>
                    <div class="img-wrap">
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
            <div class="news-container">
                <div class="news-card" v-for="(item, index) in newsEvents" :key="index">
                    <div class="time-icon">
                        <img src="../static/home/new/time_icon.png"/>
                    </div>
                    <p class="date">{{ item.dtTime }}</p>
                    <p class="category">{{ '新闻' }}</p>
                    <div class="new-title">{{ item.title || '无' }}</div>
                    <div class="detail-link">
                        <div class="detail-text" @click="onViewMore">了解详情</div>
                        <div class="detail-icon">
                            <img src="../static/home/new/arrow.png"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="news-readmore-wrap">
                <div class="news-readmore">
                    <div class="readmore">查看更多</div>
                    <div class="arrow">
                        <img src="../static/home/new/arrow_black.png"/>
                    </div>
                </div>
            </div>
        </section>
        <pageAside></pageAside>
    </div>
</template>

<script>
import pageAside from "@/components/page/page-aside.vue";
import banner1 from "@/static/home/banner/banner1.jpg";
import banner2 from "@/static/home/banner/banner2.png";
import banner3 from "@/static/home/banner/banner3.png";

export default {
    name: "index",
    components: {
        pageAside,
    },
    data() {
        return {
            bannerList: [],
            productList: [],
            newsEvents: [],
        };
    },
    async created() {
        this.bannerList = [banner1, banner2, banner3];
        this.getProductList();
        this.getNewsEvents();
    },
    methods: {
        onLearnMore(item) {
            console.log("查看详情: ", item);
            // 跳转或显示详情逻辑
        },
        onViewMore() {
            console.log("查看更多新闻与活动");
            // 跳转到更多新闻页面
        },
        // 获取产品列表
        async getProductList() {
            const {code, data} = await this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "product_plist",
                    channelId: 0,
                    page: 1,
                    pageSize: 12,
                },
            });

            if (code === 200) {
                const result = data.list;
                for (let i = 0, len = result.length; i < len; i += 6) {
                    this.productList.push(result.slice(i, i + 6));
                }
            }
        },
        // 获取新闻列表
        async getNewsEvents() {
            const {code, data} = await this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "news_lists",
                    channelId: 8,
                    page: 1,
                    pageSize: 4,
                },
            });

            if (code === 200) {
                this.newsEvents = data.list;
            }
        }
    }
};
</script>

<style scoped lang="less">
.page {
  position: relative;
  top: -114px;
  background: #f2f3f7;

  .banner {
    height: 680px;


    ::v-deep .el-carousel__container {
      height: 100%;

      .el-carousel__arrow {
        background-color: transparent;
        border: 1px solid #fff;
      }
    }

    .banner-img-wrap {
      width: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .activity-area {
    padding: 0 260px;
    display: flex;
    gap: 20px;
    padding-top: 41px;
    padding-bottom: 44px;
    background: #fff;

    .img-wrap-left {
      width: 520px;
      height: 190px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .img-wrap {
      width: 420px;
      height: 190px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .featuredRecommendations {
    height: 510px;
    padding: 0 260px 55px;
    background: #f2f3f7;

    .title-wrap {
      height: 115px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-weight: bold;

        .main-title {
          font-size: 36px;
          margin-right: 13px;
        }

        .sub-title {
          font-size: 18px;
          color: #999;
        }
      }

      .arrow-wrap {
        display: flex;
        gap: 13px;

        .img-wrap {
          width: 41px;
          height: 41px;
          cursor: pointer;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .high-quality-products {
      height: 219px;
      height: 340px;

      /deep/ .el-carousel {
        width: 100%;
        height: 100%;
      }

      /deep/ .el-carousel__container {
        height: 100%;
      }

      .product-carousel {
        display: flex;
      }

      .product-wrap {
        width: 219px;
        height: 100%;
        flex-direction: column;
        background: #fff;
        margin-right: 17px;

        .img-wrap {
          height: 219px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .desc-wrap {
          height: 121px;
          padding: 4px 14px 0;

          .desc {
            font-size: 16px;
            color: #3d4248;
            line-height: 24px;
            height: 50px;
          }
        }

        .price-wrap {
          height: 69px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            font-size: 14px;
          }

          .price {
            color: #ff4000;
            font-size: 18px;
          }

          .cart {
            width: 25px;
            height: 24px;
            margin-right: 6px;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      .product-wrap:last-child {
        margin: 0;
      }
    }
  }

  .pic {
    padding: 48px 260px 51px;
    background: #fff;

    .pic-row-1 {
      display: flex;
      margin-bottom: 20px;

      .img-wrap-1 {
        width: 805px;
        height: 500px;
        margin-right: 20px;
        position: relative;
        display: inline-block;

        img {
          width: 100%;
          height: 100%;
        }

        .pic-title {
          position: absolute;
          top: 74px;
          left: 96px;
          color: white;
          font-size: 36px;
          font-weight: bold;
        }

        .pic-content {
          position: absolute;
          top: 139px;
          left: 96px;
          color: white;
          font-size: 18px;
          width: 324px;
          font-weight: lighter;
        }

        .pic-readmore {
          position: absolute;
          height: 56px;
          width: 187px;
          top: 242px;
          left: 96px;
          font-weight: lighter;
          color: white;
          font-size: 18px;
          background-color: #27417c;
          display: flex;
          border-top-right-radius: 20px;
          border-bottom-left-radius: 20px;
          cursor: pointer;

          .readmore {
            height: 24px;
            width: 72px;
            margin-right: 14px;
            margin: 16px 14px 16px 41px;
          }

          .arrow {
            height: 16.35px;
            width: 20.33px;
            margin: 20px 0px 20px 0px;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      .img-wrap-2 {
        width: 575px;
        height: 500px;
        position: relative;
        display: inline-block;

        img {
          width: 100%;
          height: 100%;
        }

        .pic-title {
          position: absolute;
          top: 178px;
          left: 89px;
          color: white;
          font-size: 36px;
          font-weight: bold;
        }

        .pic-content {
          position: absolute;
          top: 243px;
          left: 89px;
          color: white;
          font-size: 18px;
          width: 324px;
          font-weight: lighter;
        }
      }
    }

    .pic-row-2 {
      display: flex;

      .img-wrap-3 {
        width: 579px;
        height: 500px;
        margin-right: 19px;
        position: relative;
        display: inline-block;

        img {
          width: 100%;
          height: 100%;
        }

        .pic-title {
          position: absolute;
          top: 107px;
          left: 96px;
          color: white;
          font-size: 36px;
          font-weight: bold;
        }

        .pic-content {
          position: absolute;
          top: 176px;
          left: 96px;
          color: white;
          font-size: 18px;
          width: 324px;
          font-weight: lighter;
        }
      }

      .img-wrap-4 {
        width: 802px;
        height: 500px;
        position: relative;
        display: inline-block;

        img {
          width: 100%;
          height: 100%;
        }

        .pic-title {
          position: absolute;
          top: 97px;
          left: 79px;
          color: black;
          font-size: 36px;
          font-weight: bold;
        }

        .pic-content {
          position: absolute;
          top: 166px;
          left: 79px;
          color: black;
          font-size: 18px;
          width: 324px;
          font-weight: lighter;
        }
      }
    }
  }

  .news-activity {
    padding: 20px;
    height: 502px;
    background: #fff;
    padding: 49px 260px 51px;

    .news-header {
      //height: 100px;
      display: flex;
      justify-content: space-between;

      .header-left {
        width: 200px;

        .header-title {
          font-size: 36px;
          color: #333;
        }

        .header-subtitle {
          font-size: 18px;
          color: #666;
          margin-top: 15px;
        }
      }

      .header-right {
        display: flex;
        float: right;
        align-items: center;

        /* 垂直居中 */

        .img-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          margin-left: 24px;
          cursor: pointer;
          background-color: #27417C;
          border-radius: 50%;
          font-size: 18px;
          color: #fff;
        }
      }
    }

    .news-container {
      display: flex;
      margin-top: 42px;
      margin-bottom: 20px;
      overflow: auto;
      width: 100%;
      justify-content: space-between;
      /* 平均分配剩余空间 */

      .news-card {
        background-color: white;
        padding: 17px;
        width: 336px;
        height: 172px;
        border-radius: 8px;
        border: 1px solid #d7dadc;
        float: left;
        //margin-right: 10px;

        .time-icon {
          display: inline-block;
        }

        .date {
          font-size: 16px;
          color: #888;
          display: inline-block;
          margin-left: 7px;
        }

        .category {
          color: white;
          background-color: #27417c;
          padding: 5px;
          text-align: center;
          float: right;
          width: 63px;
          height: 30px;
          font-size: 14px;
          border-top-right-radius: 8px;
          border-bottom-left-radius: 8px;
        }

        .new-title {
          font-size: 18px;
          color: #333;
          margin-top: 24px;
          margin-bottom: 15px;
          width: 299px;
          height: 56px;
          line-height: 1.5;
          display: -webkit-box;
          /* 使用弹性盒子模型 */
          -webkit-box-orient: vertical;
          /* 垂直排列 */
          -webkit-line-clamp: 2;
          /* 显示两行文本 */
          overflow: hidden;
          /* 隐藏溢出的内容 */
          cursor: pointer;
        }

        .detail-link {
          color: #333;
          font-size: 14px;
          height: 19px;
          float: right;
          align-items: center;

          .detail-text {
            display: inline-block;
            margin-right: 11px;
            cursor: pointer;
          }

          .detail-icon {
            float: right;
            padding-top: 2px;
            cursor: pointer;
          }
        }
      }
    }

    .news-readmore-wrap {
      display: flex;
      justify-content: center;
      cursor: pointer;

      .news-readmore {
        height: 56px;
        width: 187px;
        font-weight: lighter;
        color: black;
        font-size: 18px;
        display: flex;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 20px;
        border: 1px solid #d7dadc;
        margin-top: 37px;

        .readmore {
          height: 24px;
          width: 72px;
          margin-right: 14px;
          margin: 16px 14px 16px 41px;
        }

        .arrow {
          height: 16.35px;
          width: 20.33px;
          margin: 20px 0px 20px 0px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
