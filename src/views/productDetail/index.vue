<template>
  <div class="page">
    <div class="main">
      <breadcrumb :list="['首页', '光学元件', '透镜', '平凸透镜']">
      </breadcrumb>
      <div class="con">
        <div class="shop-wrap">
          <div class="shop-left-wrap">
            <div class="left-img-wrap">
              <img class="bigImg" src="@/assets/img/productDetail/img1.png" alt="img1" />
              <img class="collect" src="@/assets/img/productDetail/collect.png" alt="collect" />
            </div>
            <div class="left-list">
              <div class="list-icon">
                <img src="@/assets/img/productDetail/left.png" alt="icon1" />
              </div>
              <div class="list">
                <div class="list-item" v-for="i in 4" :key="i">
                  <img src="@/assets/img/productDetail/img2.png" alt="" />
                </div>
              </div>
              <div class="list-icon">
                <img src="@/assets/img/productDetail/right.png" alt="icon2" />
              </div>
            </div>
            <div class="desc-wrap">
              <div class="first-row">
                <div class="row-item" v-for="i in 3" :key="i">
                  <img src="@/assets/img/productDetail/download.png" alt="" />
                  <span>产品说明书</span>
                </div>
              </div>
              <div class="second-row">
                <div class="row-item" v-for="i in 3" :key="i">
                  <img src="@/assets/img/productDetail/download.png" alt="" />
                  <span>产品说明书</span>
                </div>
              </div>
            </div>
          </div>
          <div class="shop-right-wrap">
            <div class="title">激光平面窗口 Φ5.0mm 厚度=2.0mm
              V532 精退火K9光学玻璃</div>
            <div class="tag-wrap">
              <div class="tag" v-for="tag in tagList" :key="tag.text">
                <div class="tag-img-wrap">
                  <img class="tag-img" :src="tag.tagImg" alt="">
                </div>
                <div class="tag-text">{{ tag.tagText }}</div>
              </div>
            </div>
            <div class="number-wrap">
              商品编码：45645641456456
            </div>
            <div class="price-wrap">
              <div class="original-price-wrap">
                <div class="original-label">原价</div>
                <div class="original-price">￥5999.00</div>
              </div>
              <div class="promotional-price-wrap">
                <div class="promotional-label">促销价</div>
                <div class="promotional-price">{{promotionalPrice}}</div>
              </div>
              <div class="total-sales-wrap">
                <div class="total-label">总销量</div>
                <div class="total-text">300</div>
              </div>
            </div>
            <div class="specifications-wrap">
              <div class="specifications-label">选择规格</div>
              <div class="specifications-item" v-for="i in 4" :key="i" :class="{ active: i === 1 }">GCL-010158</div>
            </div>
            <div class="count-wrap">
              <div class="count-label">数量</div>
              <el-input-number class="count-input-number" v-model="num" @change="handleChange" :min="1" :max="10"
                label="描述文字"></el-input-number>
              <div class="count-text">库存 30000</div>
            </div>
            <div class="btn-wrap">
              <div class="btn buy-btn">
                <div class="buy-text">立即购买</div>
              </div>
              <div class="btn add-btn" @click="addCart">
                <div class="cart-wrap">
                  <img class="cart-img" src="@/assets/img/productDetail/cart.png" alt="">
                </div>
                <div class="add-text">加入购物车</div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-wrap">
          <div class="tab-item active">
            <div class="tab-text">详情描述</div>
          </div>
          <div class="tab-item">
            <div class="tab-text">技术参数</div>
          </div>
          <div class="tab-item">
            <div class="tab-text">相关资讯</div>
          </div>
        </div>

        <div class="detail-description">详情描述</div>

        <div class="detail-textarea">
          激光平面窗口片（Laser Flat Windows）是一种平行平面板，可在不阻挡视线的情况下保护电子传感器或检测器。窗口片不会更改系统的放大倍率。</br>
          联合光科提供各种尺寸范围为Φ5mm至Φ50.8mm，基底材料为精退火K9光学玻璃以及紫外熔融石英，波长范围覆盖266nm至1064nm，面型为λ/10，平行度＜5″的激光平面窗口片。激光平面窗口片除了起到保护的作用，同时还要保证高的透过率和优良的透射波前。</br>
          激光平面窗口片在性能方面跟普通光学窗口片存在较大差异，激光平面窗口片主要应用于：激光切割头保护、光学观察
        </div>

        <div class="technical-parameters">技术参数</div>

        <div class="descriptions-wrap">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="尺寸">o5.0mm</el-descriptions-item>
            <el-descriptions-item label="厚度">18100000000</el-descriptions-item>
            <el-descriptions-item label="镀膜">苏州市</el-descriptions-item>
            <el-descriptions-item label="材料">苏州市</el-descriptions-item>
            <el-descriptions-item label="表面面型">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
            <el-descriptions-item label="平行差">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
            <el-descriptions-item label="表面光洁度">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
            <el-descriptions-item label="直径误差">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
            <el-descriptions-item label="厚度公差">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
            <el-descriptions-item label="侧边">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="related-news">相关新闻</div>
        <div class="sub-related-news">用激光工具改变生活</div>

        <div class="list-wrap">
          <div class="card-item" v-for="(item, index) in cardList" :key="index">
            <div class="card-img-wrap">
              <img :src="item.cardImg" alt="" class="card-img">
            </div>
            <div class="card-text">{{ item.cardText }}</div>
            <div class="card-bottom">
              <div class="bottom-left">
                <div class="time-img-wrap">
                  <img class="time" src="@/assets/img/productDetail/time.png" alt="">
                </div>
                <div class="time-text">2024-05-07</div>
              </div>
              <div class="bottom-right">
                <div class="arrow-text" :class="{ active: index === 0 }">了解详情</div>
                <div class="arrow-wrap">
                  <img class="arrow" src="@/assets/img/productDetail/arrow.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-btn-wrap">
          <div class="left-arrow">
            <img src="@/assets/img/productDetail/left-arrow.png" alt="">
          </div>
          <div class="right-arrow">
            <img src="@/assets/img/productDetail/right-arrow.png" alt="">
          </div>
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
      promotionalPrice: "￥5999.00",
    };
  },
  created() {
    this.tagList = [
      {
        tagImg: tag1,
        tagText: "新品",
      },
      {
        tagImg: tag2,
        tagText: "促销",
      },
      {
        tagImg: tag3,
        tagText: "满减",
      },
    ];
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
      console.log(value);
    },
    addCart() {
      const h = this.$createElement;
      this.$msgbox({
        title: "1件商品加入购物车",
        customClass: "product-detail-model-warp",
        message: h("div", null, [
          h("div", { class: "model-success-btn-wrap" }, [
            h("div", {
              class: "model-success-img",
            }),
          ]),
          h("div", { class: "model-text-wrap" }, ["该商品已成功加入购物车！"]),
          h("div", { class: "model-sub-text-wrap" }, [
            "购物车共",
            h("span", { style: { color: "#E6170B" } }, " 2 "),
            "件商品",
          ]),
          h("div", { class: "model-btn-wrap" }, [
            h(
              "div",
              {
                class: "check-btn",
                on: {
                  click: this.viewCart,
                },
              },
              "查看购物车"
            ),
            h("div", { class: "continue-btn" }, "继续购物"),
          ]),
        ]),
        showCancelButton: false,
        showConfirmButton: false,
      });
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
      height: 142px;
      // padding: 20px 0 0 32px;
      background: #ffffff;
      border-radius: 8px;
      background-image: url("../../assets/img/productDetail/backgroundImg.png");
      background-size: 100% 100%;

      .original-price-wrap {
        display: flex;
        padding: 20px 0 0 32px;

        .original-label {
          margin-right: 37px;
          font-size: 14px;
          color: #6a6a6a;
          line-height: 20px;
        }

        .original-price {
          font-size: 18px;
          color: #333333;
          line-height: 22px;
          text-decoration-line: line-through;
        }
      }

      .promotional-price-wrap {
        padding: 20px 0 23px 32px;
        display: flex;

        .promotional-label {
          margin-right: 22px;
          font-size: 14px;
          color: #6a6a6a;
          line-height: 20px;
        }

        .promotional-price {
          font-weight: bold;
          font-size: 24px;
          color: #e1251b;
          line-height: 22px;
        }
      }

      .total-sales-wrap {
        width: 888px;
        height: 45px;
        display: flex;
        padding: 13px 0 0 32px;
        background: #f8f8f8;

        .total-label {
          margin-right: 6px;
          font-size: 14px;
          color: #6a6a6a;
          line-height: 20px;
        }

        .total-text {
          font-weight: bold;
          font-size: 16px;
          color: #e1251b;
          line-height: 22px;
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

    .count-wrap {
      height: 24px;
      display: flex;
      align-items: center;
      margin-top: 30px;

      .count-label {
        margin-left: 27px;
        margin-right: 19px;
        font-size: 14px;
        color: #999999;
        line-height: 20px;
      }

      .count-input-number {
        margin-right: 17px;
      }

      .count-text {
        font-size: 13px;
        color: #999999;
        line-height: 20px;
      }
    }

    .btn-wrap {
      display: flex;
      margin-top: 44px;

      .btn {
        width: 164px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff1e8;
        cursor: pointer;
      }

      .buy-btn {
        margin: 0 21px 0 101px;
        border: 1px solid #ff7b23;

        .buy-text {
          font-weight: bold;
          font-size: 16px;
          color: #ff7b23;
          line-height: 20px;
        }
      }

      .add-btn {
        background: #ff7b23;

        .cart-wrap {
          width: 20px;
          height: 20px;
          margin-right: 8px;

          .cart-img {
            width: 100%;
            height: 100%;
          }
        }

        .add-text {
          font-weight: bold;
          font-size: 16px;
          color: #ffffff;
          line-height: 20px;
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

.detail-description {
  margin: 20px 0 21px 0;
  font-weight: bold;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
}

.detail-textarea {
  width: 1326px;
  height: 103px;
  font-size: 14px;
  color: #333333;
  line-height: 28px;
}

.technical-parameters {
  margin: 29px 0 15px 0;
  font-weight: bold;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
}

.descriptions-wrap {
  width: 1187px;
}

.related-news {
  margin-top: 55px;
  text-align: center;
  font-weight: bold;
  font-size: 36px;
  color: #333333;
}

.sub-related-news {
  margin-top: 14px;
  font-size: 16px;
  color: #52565a;
  text-align: center;
}

.list-wrap {
  display: flex;
  gap: 44px;
  margin-top: 26px;

  .card-item {
    width: 416px;
    height: 417px;
    background: #ffffff;
    border-radius: 10px 0px 10px 10px;
    border: 1px solid #e4e4e4;

    .card-img-wrap {
      width: 416px;
      height: 279px;

      .card-img {
        width: 100%;
        height: 100%;
      }
    }

    .card-text {
      height: 80px;
      font-weight: 400;
      font-size: 18px;
      color: #333333;
      line-height: 36px;
      padding: 28px 12px 28px 20px;
    }

    .card-bottom {
      height: 58px;
      display: flex;
      align-items: center;
      border-top: 1px solid #e5e5e5;

      .bottom-left {
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 158px;

        .time-img-wrap {
          width: 15px;
          height: 15px;
          margin: 0 9px 0 20px;

          .time {
            width: 100%;
            height: 100%;
          }
        }

        .time-text {
          font-size: 16px;
          color: #757575;
          line-height: 37px;
        }
      }

      .bottom-right {
        height: 100%;
        display: flex;
        align-items: center;

        .arrow-text {
          margin-right: 14px;
          font-size: 18px;
          color: #757575;
          line-height: 25px;

          &.active {
            color: #27417c;
          }
        }

        .arrow-wrap {
          width: 20px;
          height: 16px;

          .arrow {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.bottom-btn-wrap {
  display: flex;
  justify-content: center;
  margin: 33px 0 0 0;
  padding-bottom: 42px;

  .left-arrow {
    width: 41px;
    height: 41px;
    margin-right: 13px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .right-arrow {
    width: 41px;
    height: 41px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.model-success-btn-wrap {
  display: flex;
  justify-content: center;
}

.model-success-img {
  width: 44px;
  height: 44px;
  background-image: url("../../assets/img/productDetail/success.png");
}

.model-text-wrap {
  margin-top: 19px;
  font-weight: bold;
  font-size: 20px;
  color: #ff7b23;
  line-height: 20px;
  text-align: center;
}

.model-sub-text-wrap {
  margin-top: 15px;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  text-align: center;
}

.model-btn-wrap {
  display: flex;
  justify-content: center;
  margin-top: 29px;
  .check-btn {
    width: 133px;
    height: 40px;
    margin-right: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #27417c;
    font-size: 14px;
    color: #ffffff;
    line-height: 20px;
    border-radius: 4px;
    cursor: pointer;
  }

  .continue-btn {
    width: 133px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    background: linear-gradient(180deg, #fffefe 0%, #e8e8e8 100%);
    border-radius: 4px;
    border: 1px solid #e5e5e5;
    cursor: pointer;
  }
}
</style>

<style>
.product-detail-model-warp {
  width: 568px;
  height: 334px;
  padding-bottom: 0;
}
</style>