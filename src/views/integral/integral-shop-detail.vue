<template>
  <div class="body">
    <div class="breadcrumb-wrap">
      <breadcrumb :list="['首页', '积分商城']"> </breadcrumb>
    </div>

    <div class="container">
      <div class="product-header">
        <div class="product-images">
          <img
            src="../../static/home/featuredRecommendations/product5.png"
            alt="产品主图"
            style="width: 100%"
          />
          <div class="thumbnail-images">
            <img
              class="thumbnail-icon"
              src="../../assets/img/productDetail/left.png"
              alt="icon1"
            />
            <div class="thumbnail-img-wrap">
              <img
                class="thumbnail-img"
                src="../../static/home/featuredRecommendations/product5.png"
                alt="缩略图1"
              />
              <img
                class="thumbnail-img"
                src="../../static/home/featuredRecommendations/product5.png"
                alt="缩略图2"
              />
              <img
                class="thumbnail-img"
                src="../../static/home/featuredRecommendations/product5.png"
                alt="缩略图3"
              />
              <img
                class="thumbnail-img"
                src="../../static/home/featuredRecommendations/product5.png"
                alt="缩略图4"
              />
            </div>
            <img
              class="thumbnail-icon"
              src="../../assets/img/productDetail/right.png"
              alt="icon2"
            />
          </div>
        </div>
        <div class="product-info">
          <div class="product-title">
            激光平面窗口 Φ5.0mm 厚度=2.0mm V532 精退火K9光学玻璃
          </div>
          <div class="product-code">商品编码：45645641456456</div>
          <div class="points">
            <div class="points-title">积分价格</div>
            <div class="points-price">3990.00</div>
            <div class="points-unit">积分</div>
          </div>

          <div class="exchange-btn">
            <!-- <img src="../../static/integral/integral_but.png"/>  -->
            立即兑换
          </div>
        </div>
      </div>
      <div class="product-description">
        <div class="product-description-title">
          <div class="product-description-title-text">产品详情</div>
        </div>

        <div class="product-description-content">
          <p>
            激光平面窗口片（Laser Flat
            Windows）是一种平行平面板，可在不扭曲或缩短激光下使光电子传感器或检测器，窗口片不会影响系统的放大倍率。
          </p>
          <p>
            联合光科提供各种尺寸范围从Φ5mm至Φ50.8mm，基底材料为精退火K9光学玻璃以及蓝宝石晶体，波长范围覆盖266nm至1064nm，能型为λ/10，平行度＜5"的激光平面窗口片，激光平面窗口片除了起到保护的作用，同时还要保证高的透过率和优良的波前质量。
          </p>
          <p>
            激光平面窗口片在能方面限度透光学窗口片存在较大差异，激光平面窗口片主要应用于：激光切割头保护、光学观察窗口、激光保护窗口等。
          </p>
        </div>
        <div class="product-description-content">
          <p>
            激光平面窗口片（Laser Flat
            Windows）是一种平行平面板，可在不扭曲或缩短激光下使光电子传感器或检测器，窗口片不会影响系统的放大倍率。
          </p>
          <p>
            联合光科提供各种尺寸范围从Φ5mm至Φ50.8mm，基底材料为精退火K9光学玻璃以及蓝宝石晶体，波长范围覆盖266nm至1064nm，能型为λ/10，平行度＜5"的激光平面窗口片，激光平面窗口片除了起到保护的作用，同时还要保证高的透过率和优良的波前质量。
          </p>
          <p>
            激光平面窗口片在能方面限度透光学窗口片存在较大差异，激光平面窗口片主要应用于：激光切割头保护、光学观察窗口、激光保护窗口等。
          </p>
        </div>
        <div class="product-description-content">
          <p>
            激光平面窗口片（Laser Flat
            Windows）是一种平行平面板，可在不扭曲或缩短激光下使光电子传感器或检测器，窗口片不会影响系统的放大倍率。
          </p>
          <p>
            联合光科提供各种尺寸范围从Φ5mm至Φ50.8mm，基底材料为精退火K9光学玻璃以及蓝宝石晶体，波长范围覆盖266nm至1064nm，能型为λ/10，平行度＜5"的激光平面窗口片，激光平面窗口片除了起到保护的作用，同时还要保证高的透过率和优良的波前质量。
          </p>
          <p>
            激光平面窗口片在能方面限度透光学窗口片存在较大差异，激光平面窗口片主要应用于：激光切割头保护、光学观察窗口、激光保护窗口等。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumb";

export default {
  components: {
    breadcrumb,
  },
};
</script>

<style lang="less" scoped>
.body {
  background: #f4f4f6;
  padding-bottom: 66px;

  .breadcrumb-wrap {
    margin-left: 260px;
  }

  .container {
    width: 1400px;
    //height: 1506px;
    background: #ffffff;
    border-radius: 8px 8px 8px 8px;

    margin: 0 auto;
    padding: 30px;
  }

  .product-header {
    display: flex;
    justify-content: space-between;
  }

  .product-images {
    width: 400px;
    height: 400px;
    border: 1px dashed #ddd;

    .thumbnail-images {
      width: 400px;
      height: 76px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 10px;

      .thumbnail-img-wrap {
        width: 340px;
        display: flex;
        justify-content: space-between;

        .thumbnail-img {
          width: 76px;
          height: 76px;
          border: 1px dashed #ddd;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }
    }

    .thumbnail-icon {
      width: 29px;
      height: 29px;
      border: 1px dashed #ddd;
    }
  }

  .product-info {
    width: 900px;
    .product-title {
      height: 31px;
      font-weight: bold;
      font-size: 24px;
      color: #333333;
      line-height: 20px;
    }
    .product-code {
      height: 21px;
      font-weight: 400;
      font-size: 16px;
      color: #747474;
      line-height: 20px;
      margin-top: 17px;
      margin-bottom: 34px;
    }
    .points {
      width: 888px;
      height: 95px;
      background: #d8d0d0;
      border-radius: 8px 8px 8px 8px;
      padding: 38px 32px;
      background-image: url("../../assets/img/productDetail/backgroundImg.png");
      background-size: 100% 100%;
      display: flex;

      .points-title {
        font-weight: 400;
        font-size: 14px;
        color: #6a6a6a;
        line-height: 20px;
      }
      .points-price {
        font-weight: bold;
        font-size: 24px;
        color: #e1251b;
        line-height: 22px;
        margin-left: 28px;
        margin-right: 5px;
      }
      .points-unit {
        font-weight: bold;
        font-size: 24px;
        color: #e1251b;
        line-height: 22px;
      }
    }
  }

  .exchange-btn {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    width: 177px;
    height: 48px;
    background: #27417c;
    border-radius: 4px 4px 4px 4px;
    font-weight: bold;
    font-size: 18px;
    color: #ffffff;
    line-height: 20px;
    margin-top: 159px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .product-description {
    width: 1326px;
    //height: 1000px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 120px;

    .product-description-title {
      width: 1326px;
      height: 48px;
      background: #f9f9f9;
      border: 1px solid #cccccc;

      .product-description-title-text {
        width: 127px;
        height: 48px;
        background: #27417c;
        font-weight: bold;
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;

        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .product-description-content {
      width: 1326px;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 28px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      // padding: 42px 43px 49px 31px;
      padding-top: 42px;
    }
  }
}
</style>
