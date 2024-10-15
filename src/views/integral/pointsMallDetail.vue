<template>
  <div class="page">
    <div class="main">
      <breadcrumb :list="['首页', '积分商城']"> </breadcrumb>
      <div class="con">
        <div class="shop-wrap">
          <div class="shop-left-wrap">
            <div class="left-img-wrap">
              <img
                class="bigImg"
                src="@/assets/img/productDetail/img1.png"
                alt="img1"
              />
              <img
                class="collect"
                src="@/assets/img/productDetail/collect.png"
                alt="collect"
              />
            </div>
            <div class="left-list">
              <div class="list-icon">
                <img src="@/assets/img/productDetail/left.png" alt="icon1" />
              </div>
              <div class="list">
                <div
                  class="list-item"
                  @click="handleChange(index)"
                  :class="{ active: index === selectIndex }"
                  v-for="(i, index) in 4"
                  :key="i"
                >
                  <img src="@/assets/img/productDetail/img2.png" alt="" />
                </div>
              </div>
              <div class="list-icon">
                <img src="@/assets/img/productDetail/right.png" alt="icon2" />
              </div>
            </div>
          </div>
          <div class="shop-right-wrap">
            <div class="title">
              激光平面窗口 Φ5.0mm 厚度=2.0mm V532 精退火K9光学玻璃
            </div>
            <div class="number-wrap">商品编码：45645641456456</div>
            <div class="price-wrap">
              <div class="price-text">
                <div class="price-text-1">积分价格</div>
                <div class="price-text-2">3990.00 积分</div>
              </div>
            </div>
            <div class="btn-wrap">
              <div class="img-wrap">
                <img src="@/assets/img/productDetail/btn-icon.png" alt="" />
              </div>
              立即兑换
            </div>
          </div>
        </div>

        <div class="tab-wrap">
          <div class="tab-item active">
            <div class="tab-text">产品详情</div>
          </div>
        </div>

        <div class="product-detail-desc-wrap">
          激光平面窗口片（Laser Flat
          Windows）是一种平行平面板，可在不阻挡视线的情况下保护电子传感器或检测器。窗口片不会更改系统的放大倍率。
          联合光科提供各种尺寸范围为Φ5mm至Φ50.8mm，基底材料为精退火K9光学玻璃以及紫外熔融石英，波长范围覆盖266nm至1064nm，面型为λ/10，平行度＜5″的激光平面窗口片。激光平面窗口片除了起到保护的作用，同时还要保证高的透过率和优良的透射波前。
          激光平面窗口片在性能方面跟普通光学窗口片存在较大差异，激光平面窗口片主要应用于：激光切割头保护、光学观察窗口、激光器保护窗口等。
          激光平面窗口片（Laser Flat
          Windows）是一种平行平面板，可在不阻挡视线的情况下保护电子传感器或检测器。窗口片不会更改系统的放大倍率。
          联合光科提供各种尺寸范围为Φ5mm至Φ50.8mm，基底材料为精退火K9光学玻璃以及紫外熔融石英，波长范围覆盖266nm至1064nm，面型为λ/10，平行度＜5″的激光平面窗口片。激光平面窗口片除了起到保护的作用，同时还要保证高的透过率和优良的透射波前。
          激光平面窗口片在性能方面跟普通光学窗口片存在较大差异，激光平面窗口片主要应用于：激光切割头保护、光学观察窗口、激光器保护窗口等。
          激光平面窗口片（Laser Flat
          Windows）是一种平行平面板，可在不阻挡视线的情况下保护电子传感器或检测器。窗口片不会更改系统的放大倍率。
          联合光科提供各种尺寸范围为Φ5mm至Φ50.8mm，基底材料为精退火K9光学玻璃以及紫外熔融石英，波长范围覆盖266nm至1064nm，面型为λ/10，平行度＜5″的激光平面窗口片。激光平面窗口片除了起到保护的作用，同时还要保证高的透过率和优良的透射波前。
          激光平面窗口片在性能方面跟普通光学窗口片存在较大差异，激光平面窗口片主要应用于：激光切割头保护、光学观察窗口、激光器保护窗口等。
          激光平面窗口片（Laser Flat
          Windows）是一种平行平面板，可在不阻挡视线的情况下保护电子传感器或检测器。窗口片不会更改系统的放大倍率。
          联合光科提供各种尺寸范围为Φ5mm至Φ50.8mm，基底材料为精退火K9光学玻璃以及紫外熔融石英，波长范围覆盖266nm至1064nm，面型为λ/10，平行度＜5″的激光平面窗口片。激光平面窗口片除了起到保护的作用，同时还要保证高的透过率和优良的透射波前。
          激光平面窗口片在性能方面跟普通光学窗口片存在较大差异，激光平面窗口片主要应用于：激光切割头保护、光学观察窗口、激光器保护窗口等。
          激光平面窗口片（Laser Flat
          Windows）是一种平行平面板，可在不阻挡视线的情况下保护电子传感器或检测器。窗口片不会更改系统的放大倍率。
          联合光科提供各种尺寸范围为Φ5mm至Φ50.8mm，基底材料为精退火K9光学玻璃以及紫外熔融石英，波长范围覆盖266nm至1064nm，面型为λ/10，平行度＜5″的激光平面窗口片。激光平面窗口片除了起到保护的作用，同时还要保证高的透过率和优良的透射波前。
          激光平面窗口片在性能方面跟普通光学窗口片存在较大差异，激光平面窗口片主要应用于：激光切割头保护、光学观察窗口、激光器保护窗口等。
          激光平面窗口片（Laser Flat
          Windows）是一种平行平面板，可在不阻挡视线的情况下保护电子传感器或检测器。窗口片不会更改系统的放大倍率。
          联合光科提供各种尺寸范围为Φ5mm至Φ50.8mm，基底材料为精退火K9光学玻璃以及紫外熔融石英，波长范围覆盖266nm至1064nm，面型为λ/10，平行度＜5″的激光平面窗口片。激光平面窗口片除了起到保护的作用，同时还要保证高的透过率和优良的透射波前。
          激光平面窗口片在性能方面跟普通光学窗口片存在较大差异，激光平面窗口片主要应用于：激光切割头保护、光学观察窗口、激光器保护窗口等。
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import breadcrumb from "@/components/breadcrumb";
import tag1 from "@/assets/img/productDetail/tag1.png";
import tag2 from "@/assets/img/productDetail/tag2.png";
import tag3 from "@/assets/img/productDetail/tag3.png";
import card1 from "@/assets/img/productDetail/card1.png";
import card2 from "@/assets/img/productDetail/card2.png";
import card3 from "@/assets/img/productDetail/card3.png";

export default {
  components: {
    breadcrumb,
  },
  data() {
    return {
      num: 1,
      selectIndex: 0,
      promotionalPrice: "￥5999.00",
    };
  },
  created() {
    this.cardList = [
      {
        cardImg: card1,
        cardText: "现场直击 | 华日激光亮相上海慕尼黑光博会！",
      },
      {
        cardImg: card2,
        cardText: "现场直击 | 华日激光亮相上海慕尼黑光博会！",
      },
      {
        cardImg: card3,
        cardText: "现场直击 | 华日激光亮相上海慕尼黑光博会！",
      },
    ];
    this.promotionalPrice = Math.random() > 0.5 ? "￥5999.00" : "面议";
  },
  methods: {
    handleChange(value) {
      this.selectIndex = value;
      console.log(value);
    },
    viewCart() {
      this.$msgbox.close();
      this.$router.push({ name: "productCart" });
    },
  },
};
</script>
  
  <style lang="less" scoped>
.page {
  background: #f4f4f6;
  padding-bottom: 51px;
}

.main {
  margin: 0 260px;
}

.con {
  border-radius: 8px;
  background: #ffffff;
  padding-left: 30px;
  padding-bottom: 49px;
}

.shop-wrap {
  display: flex;

  .shop-left-wrap {
    width: 400px;
    margin: 30px 38px 0 0;

    .left-img-wrap {
      position: relative;
      width: 400px;
      height: 400px;
      border: 1px dashed #f4f4f6;
      border-radius: 8px;

      .bigImg {
        width: 100%;
        height: 100%;
      }

      .collect {
        position: absolute;
        top: 13px;
        left: 12px;
        width: 33px;
        height: 33px;
        cursor: pointer;
      }
    }

    .left-list {
      display: flex;
      align-items: center;
      padding-top: 9px;

      .list-icon {
        width: 29px;
        height: 29px;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .list {
        flex: 1;
        display: flex;
        gap: 5px;

        .list-item {
          width: 76px;
          height: 76px;
          cursor: pointer;

          &.active {
            border: 1px solid #27417c;
          }

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .desc-wrap {
      padding: 17px 20px 0;

      .first-row {
        display: flex;
        gap: 17px;
        margin-bottom: 14px;
      }

      .second-row {
        display: flex;
        gap: 17px;
      }

      .row-item {
        display: flex;
        align-items: center;
        width: 109px;
        height: 30px;
        background: #ffffff;
        border-radius: 2px;
        border: 1px solid #d6d6d6;
        opacity: 0.7;
        font-size: 14px;

        img {
          width: 15px;
          height: 15px;
          margin: 0 3px 0 9px;
        }
      }
    }
  }

  .shop-right-wrap {
    padding-top: 32px;

    .title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      line-height: 20px;
    }

    .tag-wrap {
      display: flex;
      gap: 16px;
      margin-top: 23px;

      .tag {
        display: flex;
        padding: 4px 0;
        border-radius: 2px;
        border: 1px solid #fbb98d;
        background: #fffcfb;

        .tag-img-wrap {
          width: 14.5px;
          height: 17px;
          margin: 0 9px 0 7px;

          .tag-img {
            width: 100%;
            height: 100%;
          }
        }

        .tag-text {
          margin-right: 7px;
          font-size: 14px;
          color: #ff7b23;
          line-height: 18px;
        }
      }
    }

    .number-wrap {
      margin: 22px 0 31px;
      font-size: 16px;
      color: #747474;
      line-height: 20px;
    }

    .price-wrap {
      width: 888px;
      height: 95px;
      // padding: 20px 0 0 32px;
      background: #ffffff;
      border-radius: 8px;
      background-image: url("../../assets/img/productDetail/backgroundImg.png");
      background-size: 100% 100%;
      display: flex;
      align-items: center;

      .price-text {
        display: flex;
        gap: 28px;
        padding-left: 32px;
        .price-text-1 {
          font-size: 14px;
          color: #6a6a6a;
          line-height: 20px;
        }
        .price-text-2 {
          font-size: 24px;
          color: #e1251b;
          line-height: 22px;
          font-weight: bold;
        }
      }
    }

    .specifications-wrap {
      display: flex;
      align-items: center;
      margin-top: 37px;

      .specifications-label {
        margin-left: 27px;
        margin-right: 19px;
        font-size: 14px;
        color: #999999;
        line-height: 20px;
      }

      .specifications-item {
        width: 111px;
        height: 37px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 15px;
        background: #f9f9f9;
        font-size: 12px;
        color: #333333;
        line-height: 18px;
        border: 1px solid #cccccc;
        cursor: pointer;

        &.active {
          border: 2px solid #27417c;
        }
      }
    }

    .btn-wrap {
      margin-top: 159px;
      width: 177px;
      height: 48px;
      background: #27417c;
      border-radius: 4px 4px 4px 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      color: #ffffff;
      font-size: 14px;
      line-height: 20px;
      .img-wrap {
        width: 22px;
        height: 24px;
        margin-right: 11px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.tab-wrap {
  width: 1326px;
  height: 48px;
  display: flex;
  margin-top: 39px;
  background: #f9f9f9;
  border: 1px solid #cccccc;

  .tab-item {
    width: 127px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333333;
    font-size: 14px;
    cursor: pointer;

    &.active {
      color: #ffffff;
      background: #27417c;
    }

    .tab-text {
      font-weight: bold;
      font-size: 14px;
      line-height: 20px;
    }
  }
}

.product-detail-desc-wrap {
  width: 1326px;
  font-size: 14px;
  color: #333333;
  line-height: 28px;
  margin-top: 42px;
}
</style>
  