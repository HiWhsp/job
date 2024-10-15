<template>
  <div class="page">
    <el-carousel class="banner">
      <el-carousel-item v-for="item in 3" :key="item">
        <div class="banner-img-wrap">
          <img :src="bannerList[item - 1]" alt="banner" />
        </div>
      </el-carousel-item>
    </el-carousel>

    <div class="activity-area">
      <div class="img-wrap-left">
        <img src="../static/home/activity-area/left.png" alt="activity-img" />
      </div>
      <div class="img-wrap">
        <img src="../static/home/activity-area/mid.png" alt="activity-img" />
      </div>
      <div class="img-wrap">
        <img src="../static/home/activity-area/right.png" alt="activity-img" />
      </div>
    </div>

    <div class="featuredRecommendations">
      <div class="title-wrap">
        <div class="title">
          <span class="main-title"
            >精品<span style="color: #27417c">推荐</span></span
          >
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
        <div class="product-wrap" v-for="item in productList" :key="item.src">
          <div class="img-wrap">
            <img :src="item.img" alt="" />
          </div>
          <div class="desc-wrap">
            <div class="desc">{{ item.desc }}</div>
            <div class="price-wrap">
              <div class="price">
                <span style="font-size: 14px">￥</span>{{ item.price }}
              </div>
              <div class="cart">
                <img
                  src="../static/home/featuredRecommendations/cart.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 仪器查看更多 -->
    <div class="pic">
      <div class="pic-row-1">
        <div class="img-wrap-1">
          <img src="../static/home/pic/pic_01.png" alt="" />
          <span class="pic-title">光源</span>
          <div class="pic-content">
            概要文字概要文字概要文字概要文字概要文字概要文字
          </div>
          <div class="pic-readmore">
            <div class="readmore">查看更多</div>
            <div class="arrow">
              <img src="../static/home/pic/right_arrow.png" />
            </div>
          </div>
        </div>
        <div class="img-wrap-2">
          <img src="../static/home/pic/pic_02.png" alt="" />
          <span class="pic-title">实验室解决方案</span>
          <div class="pic-content">
            概要文字概要文字概要文字概要文字概要文字概要文字
          </div>
        </div>
      </div>
      <div class="pic-row-2">
        <div class="img-wrap-3">
          <img src="../static/home/pic/pic_03.png" alt="" />
          <span class="pic-title">配件</span>
          <div class="pic-content">
            概要文字概要文字概要文字概要文字概要文字概要文字
          </div>
        </div>
        <div class="img-wrap-4">
          <img src="../static/home/pic/pic_04.png" alt="" />
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
      <div class="news-container">
        <div class="news-card" v-for="(item, index) in newsEvents" :key="index">
          <div class="time-icon">
            <img src="../static/home/new/time_icon.png" />
          </div>
          <p class="date">{{ item.date }}</p>
          <p class="category">{{ item.type }}</p>
          <div class="new-title">{{ item.title }}</div>
          <div class="detail-link">
            <div class="detail-text" @click="onViewMore">了解详情</div>
            <div class="detail-icon">
              <img src="../static/home/new/arrow.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="news-readmore-wrap">
        <div class="news-readmore">
          <div class="readmore">查看更多</div>
          <div class="arrow">
            <img src="../static/home/new/arrow_black.png" />
          </div>
        </div>
      </div>
    </section>
    <pageAside></pageAside>
  </div>
</template>

<script>
import pageAside from "@/components/page/page-aside.vue";
import product1 from "../static/home/featuredRecommendations/product1.png";
import product2 from "../static/home/featuredRecommendations/product2.png";
import product3 from "../static/home/featuredRecommendations/product3.png";
import product4 from "../static/home/featuredRecommendations/product4.png";
import product5 from "../static/home/featuredRecommendations/product5.png";
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
    const { data } = await this.$api({
      url: "/service.php",
      method: "get",
      data: {
        action: "banner_index",
        position: 0,
      },
    });
    this.bannerList = [banner1, banner2, banner3];
    this.productList = [
      {
        img: product1,
        desc: "激光平凸透镜 D=25.4mm F=100mm 1064nm",
        price: "21.115",
      },
      {
        img: product2,
        desc: "激光平凸透镜 D=25.4mm F=100mm 1064nm",
        price: "21.115",
      },
      {
        img: product3,
        desc: "激光平凸透镜 D=25.4mm F=100mm 1064nm",
        price: "21.115",
      },
      {
        img: product4,
        desc: "激光平凸透镜 D=25.4mm F=100mm 1064nm",
        price: "21.115",
      },
      {
        img: product5,
        desc: "激光平凸透镜 D=25.4mm F=100mm 1064nm",
        price: "21.115",
      },
      {
        img: product5,
        desc: "激光平凸透镜 D=25.4mm F=100mm 1064nm",
        price: "21.115",
      },
    ];
    this.newsEvents = [
      {
        date: "2024-05-07",
        title: "现场直击 | 华日激光亮相上海展光博会！",
        type: "展会",
      },
      {
        date: "2024-05-07",
        title: "【展会邀请】华日激光邀您共赴2023 CIOE中国光博会",
        type: "展会",
      },
      {
        date: "2024-05-07",
        title:
          "CCTV《经济半小时》深度报道：华日激光飞秒激光器技术创新，实现CCTV《经济半小时》深度报道：华日激光飞秒激光器技术创新，实现",
        type: "新闻",
      },
      {
        date: "2024-05-07",
        title: "现场直击 | 华日激光亮相上海展光博会！",
        type: "新闻",
      },
    ];
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
  },
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
      display: flex;
      box-sizing: border-box;
      gap: 17px;

      .product-wrap {
        background: #fff;

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
          }
        }

        .price-wrap {
          height: 69px;
          display: flex;
          justify-content: space-between;
          align-items: center;

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
          width: 64px;
          height: 64px;
          margin-left: 24px;
          box-sizing: border-box;
          /* 如果有边框或内边距，确保它们不会影响总尺寸 */
          position: relative;
          /* 如果需要绝对定位内部元素，可以使用相对定位 */
          cursor: pointer;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            /* 保持图片原始宽高比的同时填满整个容器 */
          }
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
