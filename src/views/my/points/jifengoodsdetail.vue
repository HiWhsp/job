<template>
  <div class="container">
    <div class="detail-container">
      <div class="content">
        <div class="main-content">
          <div class="content-top">
            <div class="left">
              <!-- 商品预览 -->
              <carouselComponent :swiperImgs="swiperImgs" />
            </div>

            <div class="center">
              <h2>{{ goods.title }}</h2>

              <div class="info">
                <div class="info-1">
                  <div class="left">
                    <span>价格：</span>
                    <span class="price"
                      ><span class="currency">积分</span>
                      {{ jifen || 0 }}
                    </span>
                  </div>
                  <div class="right">已兑：{{ order }}</div>
                </div>
              </div>

              <div class="btn-box">
                <button class="btn-add-cart" @click="goods_exchange">确认兑换</button>
              </div>
            </div>
          </div>

          <div class="content-bottom-container">
            <div class="content-bottom">
              <div class="detail-nav">
                <div @click="togglePanel('详情')" :class="showPanel == '详情' ? 'active' : ''">商品详情</div>
              </div>

              <div class="detail-content-box" v-show="showPanel == '详情'">
                <div v-html="goods.content"></div>
                <div v-html="goods.cont2"></div>
                <div v-html="goods.cont3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import goods from "@/shop-actions/goods";
import order from "@/shop-actions/order";
import shopcart from "@/shop-actions/shopcart";

import { mapState } from "vuex";
import { Loading } from "element-ui";

import modalYaoqing from "@/components/goods/modalYaoqing.vue"; //折上折邀请好友
import product_add_cart_success_modal from "@/components/product/product_add_cart_success_modal.vue"; //购物车添加成功
import carouselComponent from "@/components/goods/carouselComponent.vue"; //左侧轮播
import goodsCouponList from "@/components/goods/goodsCouponList.vue"; //商品关联的优惠券
import review_list from "@/components/review/review_list.vue"; //评论列表

export default {
  name: "Detail",
  components: {
    modalYaoqing,
    product_add_cart_success_modal,
    carouselComponent,
    goodsCouponList,
    commentList,
  },
  data() {
    return {
      goods: {},
      swiperImgs: [],
      current: 0, //轮播图指示器

      jifen: this.$route.query.jifen,
      order: this.$route.query.order,

      showPanel: "详情", //详情
    };
  },

  // beforeRouteUpdate(to, from, next) {
  //   //console.log("组件复用");
  //   //console.log(to, from);

  //   let inventoryId = sessionStorage.getItem("inventoryId");
  //   let productId = sessionStorage.getItem("productId");

  //   this.setView(inventoryId, productId);
  // },

  watch: {
    selected_num(newVal, oldVal) {
      if (newVal) {
        this.guige_info_text = "规格：" + this.selected_guige.name + " x " + this.selected_num;
      }
    },
    selected_guige(newVal, oldVal) {
      if (newVal) {
        this.guige_info_text = "规格：" + this.selected_guige.name + " x " + this.selected_num;
      }
    },

    cutId(id) {
      //console.log("监视砍刀数据", id);
      sessionStorage.setItem("cutId", id);

      this.show_zheshangzhe = true;

      this.lunxun_cut();
    },
  },

  computed: {
    ...mapState(["kefu_qq", "kefu_weixin", "kefu_phone", "webConfig"]),
  },

  beforeRouteUpdate(to, from, next) {
    //console.log("组件复用");
    //console.log(to, from);

    let inventoryId = sessionStorage.getItem("inventoryId");
    let productId = sessionStorage.getItem("productId");

    this.setView(inventoryId, productId);
  },

  created() {
    this.setView();
  },

  methods: {
    goods_exchange() {
      var item = this.goods;

      let { productId, images, key_vals, title, priceSale, priceMarket, inventoryId } = item;

      var payment_products = [
        {
          productId: productId,
          image: images && images[0],
          key_vals: key_vals,
          title: title,
          num: 1, //数量
          inventoryId: inventoryId, //规格

          priceSale: this.jifen,
        },
      ];

      sessionStorage.setItem("payment_products", JSON.stringify(payment_products));

      this.$router.push({
        path: "/jifenorder-submit",
      });
    },

    setView() {
      this.showLoading();
      //查询商品信息
      this.query_detail();
    },

    //立即购买
    query_detail() {
      this.$api("product_detail", { inventoryId: this.$route.query.id }).then((res) => {
        this.hideLoading();
        //console.log("商品详情", res);
        let { code, data, msg} = res;
        if (code == 200) {
          this.goods = data;

          this.swiperImgs = data.images;
        }
      });
    },

    showLoading() {
      this.openFullScreen2();
    },
    hideLoading() {
      // Toast.clear();
    },

    openFullScreen2() {
      const loadingInstance = Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      setTimeout(() => {
        loadingInstance.close();
      }, 1000);
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .ziying .aside-search {
  display: none;
}
/deep/ .ziying .aside-sort {
  display: none;
}

/deep/ .ant-carousel {
  margin-top: 0.3rem;
}

.container {
  font-size: 14px;
  .content {
    overflow: hidden;
    max-width: @width;
    margin: 0 auto;
    margin-top: 50px;
    margin-bottom: 50px;

    .main-content {
      background-color: #fff;

      .content-top {
        display: flex;
        justify-content: space-between;

        .left {
          width: 400px;
          position: relative;
          .promotion-box {
            position: absolute;
            bottom: 0;
            width: 100%;
            .limit-end-box {
              font-size: 0.3rem;
              color: #4CA5E4;
              font-weight: bold;
              text-align: center;
              padding-bottom: 0.5rem;
            }
          }

          .shoucang-box {
            margin-top: 20px;
            .flex-between();
            width: 100%;

            .yes {
              color: #f00;
            }
            .no {
              color: #000;
            }

            .shoucang-left {
              cursor: pointer;
              .flex();

              img {
                width: 20px;
                margin-right: 15px;
              }
              span {
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 400;
                line-height: 36px;
                color: #333333;
              }
            }
            .shoucang-right {
              cursor: pointer;
              .flex();

              img {
                width: 20px;
                margin-right: 15px;
              }
              span {
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 400;
                line-height: 36px;
                color: #333333;
              }
            }
          }
        }
        .center {
          flex: 2;
          padding-left: 40px; /*no*/
          text-align: left;
          padding-bottom: 20px;
          color: #999;

          h2 {
            font-size: 18px; /*no*/
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #333333;
          }

          .remark {
            font-size: 12px; /*no*/
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333;
            margin-top: 10px; /*no*/
          }

          .info {
            margin-top: 20px; /*no*/
            margin-bottom: 20px; /*no*/
            background: #f9f9f9;
            padding: 15px;

            > div {
              margin-bottom: 10px;

              &:last-child {
                margin-bottom: 0;
              }
            }

            .info-1 {
              .flex-between();
              .left {
              }
              .right {
              }

              .currency {
                font-size: 16px;
              }
            }
            .info-2 {
              .flex();
              .left {
              }
              button {
                margin-right: 20px;
                min-width: 68px;
                padding: 0 8px;
                height: 19px;
                line-height: 19px;
                background: url("~@img/other/goods-coupon-bg.png") no-repeat;
                background-position: center;
                background-size: cover;

                font-size: 10px;
                font-family: PingFang SC;
                font-weight: 400;
                color: #f13f17;
              }
            }

            .price {
              color: #f00;
              font-size: 20px;
              padding-left: 10px;
              font-weight: bold;
            }
          }

          .baozhiqi {
            .flex();
            .text {
              min-width: 100px;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #999999;
            }
            .text-2 {
            }
          }

          .shuliang-box {
            margin-top: 20px;
            .flex();
            .sel-num-title {
              min-width: 100px;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #999999;
            }

            .shuliang {
              min-width: 105px;
              .flex();
              div {
                width: 30px;
                height: 30px;
                cursor: pointer;
                user-select: none;
                &:hover {
                  opacity: 0.8;
                }

                img {
                  width: 30px;
                  height: 30px;
                  vertical-align: bottom;
                }
              }
              .minus {
              }
              input {
                outline: none;
                margin: 0 10px;
                display: inline-block;
                border: 1px solid #ccc;

                width: 40px;
                height: 30px;
                line-height: 30px;
                text-align: center;

                font-size: 20px;
                font-family: Arial;
                font-weight: 400;
                color: #4a4a4a;
              }

              input::-webkit-outer-spin-button,
              input::-webkit-inner-spin-button {
                -webkit-appearance: none !important;
              }
              /* chrome */
              input[type="number"] {
                -moz-appearance: textfield; /* firefox */
              }
              .plus {
              }
            }
          }

          .params {
            margin-top: 20px;
            .flex();
            .params-title {
              min-width: 100px;
            }

            .params-list {
              display: flex;
              flex-wrap: wrap;
              justify-content: flex-start;

              button {
                width: 124px;
                height: 40px;
                background: #f9f9f9;
                margin-right: 20px;
              }

              .el-tag {
                min-width: 124px;
                height: 40px;
                line-height: 40px;
                background: #f9f9f9;
                border: 2px solid #ff9312;
                text-align: center;
                cursor: pointer;

                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #333333;
                border-radius: 0;
              }
            }
          }

          .sel-num-title {
            margin: 20px 0;
          }
          .coupon-box {
            margin: 0.2rem 0;

            .coupon-title {
              margin-bottom: 0.2rem;
            }
            .coupon-list {
              padding: 0.1rem;
              .coupon-item {
                display: flex;
                align-items: center;
                padding: 0.1rem;
                border: 1px dashed #ffe4d0;
                background: #ffe4d0;
                color: coral;
                border-radius: 10px;
                cursor: pointer;
                font-size: 12px;

                &:hover {
                  border-color: #4CA5E4;
                }

                .coupon-info {
                  width: 80%;
                }
                .coupon-btn-box {
                  margin-left: 0.2rem;
                }
              }
            }
          }

          .btn-box {
            margin-top: 40px;
            button {
              margin-right: 20px;
              font-size: 16px;
              transition: 0.3s;

              &:hover {
                opacity: 0.8;
              }
            }

            .btn-buy {
              min-width: 142px;
              height: 48px;
              background: #fff7f2;
              border: 1px solid #ff9312;
              border-radius: 24px;
              color: #ff9312;
            }
            .btn-add-cart {
              width: 200px;
              height: 40px;
              background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);

              border: 1px solid #ff9312;
              border-radius: 24px;
              color: #fff;
            }
          }
        }
      }

      .content-bottom-container {
        margin-top: 80px;
      }

      .content-bottom {
        width: 100%;
        .detail-nav {
          position: relative;
          border-bottom: 2px solid #4CA5E4;
          display: flex;

          height: 48px; /*no */
          line-height: 48px; /*no */
          background: #f9f9f9;
          border: 1px solid #cccccc;

          div {
            cursor: pointer;
            min-width: 100px; /*no */
          }
          .active {
            background-color: #4CA5E4;
            color: #fff;
          }

          button {
            position: absolute;
            right: 0;
            top: 8px; /*no */
            right: 8px; /*no */
            min-width: 126px; /*no */
            height: 32px; /*no */

            &.contact {
              background: #4CA5E4;
              .flex-center();
              right: 20px;

              &:hover {
                opacity: 0.8;
              }
              img {
                width: 20px;
                margin-right: 10px;
                vertical-align: bottom;
              }
              span {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                line-height: 20px;
                color: #ffffff;
              }
            }
          }
        }

        .detail-content-box {
          min-height: 50vh;
          padding: 20px;
          text-align: left;
          /deep/ img {
            display: block;
            max-width: 100%;
            margin: 0 auto;
          }
        }

        .detail-content {
          margin-top: 30px;
          .big-img-list {
            .big-img-item {
              margin-bottom: 10px;
              padding: 30px;
              margin: 10px auto;

              img {
                width: 400px;
                height: 300px;
              }
            }
          }
        }

        .detail-content-sort-info {
          text-align: left;
          margin-top: 20px;
          margin-bottom: 20px;
          background: #eee;

          .sort-info-title {
            display: inline-block;
            background-color: #4CA5E4;
            color: #fff;
            padding: 0.1rem 0.2rem;
          }
          .sort-info-content {
            padding: 10px;
            background-color: #fff;
            min-height: 2rem;
          }
        }

        .comment-box {
          min-height: 50vh;
          margin-top: 20px;

          .comment-title {
            display: flex;
            background-color: #eee;
            align-items: center;
            color: #fff;
            width: 100%;

            color: #000;

            .comment-title-text {
              padding: 5px 30px;
              margin-right: 20px;
              background-color: #4CA5E4;
              color: #fff;
            }
          }
          label {
            width: 70px;

            input {
              margin-right: 10px;
            }
          }

          .comment-list {
            margin-top: 20px;
            font-size: 14px;
            color: #000;
            text-align: left;

            .comment-item {
              background-color: #eee;
              padding: 20px;
              min-height: 50px;
              margin-bottom: 20px;

              .comment-bottom {
                margin-top: 10px;
                display: flex;
                align-items: center;

                .left {
                  flex: 3;

                  .img-list {
                    display: flex;

                    .img-item {
                      padding: 10px;
                    }

                    img {
                      width: 80px;
                      height: 80px;
                      padding: 10px;
                      background-color: #fff;
                      margin-right: 10px;
                    }
                  }
                }
                .right {
                  flex: 1;
                }
              }
            }
          }
        }
      }
    }
  }

  .pagation-box {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

.ant-carousel /deep/ .slick-dots {
  height: auto;
  border: 1px solid #eee;
}

.ant-carousel /deep/ .slick-dots li {
  border: 1px solid #ccc;
}

.ant-carousel /deep/ .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
  border: 1px solid #ddd;
}
.ant-carousel /deep/ .slick-thumb .slick-active img {
  border: 1px solid #f00;
}
.ant-carousel /deep/ .slick-thumb {
  bottom: -120px;
}
.ant-carousel /deep/ .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel /deep/ .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel /deep/ .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}

.ant-carousel /deep/ .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 1;
  border-radius: 50%;
}
.ant-carousel /deep/ .custom-slick-arrow:before {
  display: none;
}
.ant-carousel /deep/ .custom-slick-arrow:hover {
  opacity: 1;
}
.kefu-box {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  top: 40%;
  .kitem {
    cursor: pointer;
    position: relative;
    // height: 60px;
    // width: 60px;
    // border: 1px solid;
    // background: #f9f9f9;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // color: #ccc;
    // margin-top: 3px;

    img {
    }
  }
  .kitem2 {
    // height: 68px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: 15px;
    box-shadow: 0px 2px 8px #ccc;
    position: absolute;
    bottom: 0px;
    right: 0px;
    z-index: 9;
    background: #f9f9f9;
    opacity: 0;
    padding: 22px 0;
    span {
      font-size: 16px;
      color: #999;
      font-weight: bold;
      margin-left: 8px;
    }
    img {
      width: 25px;
      display: none;
    }
    .weixin_img {
      width: 128px;
    }
    .close {
      width: 16px;
      margin-left: 20px;
    }
  }
  .weixin {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    span {
      font-size: 12px;
      margin-top: 10px;
    }
  }
  .kitem:hover {
    .kitem2 {
      opacity: 1;
      // display: flex;
      transition: 0.5s;
    }
    .kitem2 {
      img {
        display: block;
      }
    }
  }
}
</style>
