<template>
  <div class="product-list flex">
    <div class="product-item" v-for="(item, index) in list" :key="index">
      <div class="product-item-info" @click="to_product(item)">
        <div class="img-box">
          <img :src="item.thumb" class="product-img" />
          <!-- <shouqing :kucun="goods.kucun" /> -->
        </div>
        <div class="info-box">
          <div class="brand ellipsis-1">
            {{ item.brand && item.brand.title }}
          </div>
          <div class="title-box">
            <div class="title ellipsis-2">
              {{ item.title }}
            </div>
          </div>

          <div class="price-box flex-between">
            <div class="sale">
              <span class="huobi"> {{ vuex_huobi }} </span>
              <span class="value"> {{ item.priceSale }} </span>
              <span class="unit" v-if="item.unit"> {{ item.unit }} </span>
            </div>
            <div class="cart-box">
              <img
                src="@img/common/cart.png"
                alt=""
                class="img-check check-1"
              />
            </div>
            <!-- <div class="market">
              <span class="huobi"> {{ vuex_huobi }} </span>
              <span class="value"> {{ item.priceSale }} </span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import shouqing from "@/components/common/shouqing.vue";

export default {
  name: "product-list",
  components: {
    // shouqing,
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      },
    },
    is_show_check: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    title1() {
      return this.arrTitle[0] || "";
    },
    title2() {
      return this.arrTitle[1] || "";
    },
  },
  methods: {
    to_product(item) {
      this.$router.push({
        path: "/product-detail",
        query: {
          id: item.inventoryId,
        },
      });
    },
    do_toggle_check(item) {
      this.$emit("toggle_check", item);
    },
  },
};
</script>

<style scoped lang="less">
.product-list {
  flex-wrap: wrap;

  .product-item {
    position: relative;
    width: 264px;
    height: 385px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
    border: 1px solid #cbcbcb;
    padding: 24px;
    margin-right: 20px;
    margin-top: 32px;
    text-align: center;
    border: 1px solid #e5e5e5;
    overflow: hidden;
    cursor: pointer;

    &:nth-child(5n) {
      margin-right: 0;
    }

    &:nth-child(-n + 5) {
      margin-top: 0;
    }

    &:hover {
      .img-box {
        img {
          transform: scale(1.1);
        }
      }
    }

    .img-box {
      width: 224px;
      height: 224px;
      padding-bottom: 23px;
      margin: 0 auto;
      overflow: hidden;
      position: relative;

      img {
        width: 224px;
        height: 224px;
        object-fit: cover;
        transition: 0.3s;
      }
    }

    .info-box {
      width: 100%;
      background: #fff;
      // border: 1px solid #e5e5e5;
      // border-top: none;
      padding: 15px 0px;

      .brand {
        height: 16px;
        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: normal;
        font-size: 13px;
        color: #656565;
      }
      .title-box {
        height: 44px;
      }
      .title {
        margin-top: 10px;
        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: normal;
        font-size: 14px;
        color: #3d4248;
        line-height: 22px;
      }

      .price-box {
        margin-top: 5px;

        .sale {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #eb0f19;
          .value {
            font-size: 18px;
          }
        }

        .market {
          // text-decoration: line-through;
          margin-left: 17px;
          color: #bfbfbf;

          span {
            text-decoration: line-through;
            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 12px;
            color: #bfbfbf;
          }
        }

        .cart-box {
          img {
            width: 32px;
            height: 32px;
          }
        }
      }

      .sku-box {
        min-height: 50px;
        margin-top: 8px;
        flex-wrap: wrap;

        .sku-item {
          position: relative;
          padding: 4px 0;
          width: 50%;
          text-align: center;
          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 12px;
          color: #444444;

          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0px;
            height: 1px;
            transform: translate(-50%);
            background: #ccc;
          }

          &:hover {
            &::after {
              width: 40px;
            }
          }
        }
      }

      .btn-box {
        margin-top: 20px;

        .btn-cart {
          width: 226px;
          width: 100%;
          height: 27px;
          border-radius: 0px 0px 0px 0px;
          border: 1px solid #3b64fc;
          font-family: OPPOSans, OPPOSans;
          font-weight: bold;
          font-size: 12px;
          color: #3b64fc;

          &:hover {
            background: #3b64fc;
            color: #fff;
          }
        }
      }
    }
  }
}

.img-check-box {
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;
  width: 65px;
  height: 65px;
  cursor: pointer;

  .img-check {
    width: 14px;
  }
}
</style>

<style scoped lang="less">
@media screen and (max-width: 1199px) {
  .product-list {
    .flex();
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      width: calc((100% - 15px) / 2);
      margin: 0;
      margin-right: 0;
      margin-top: 0;
      margin-bottom: 15px;

      text-align: center;
      border: 1px solid #e5e5e5;
      overflow: hidden;

      &:nth-child(4n) {
        margin-right: 0;
      }

      &:nth-child(-n + 4) {
        margin-top: 0;
      }

      &:hover {
        .img-box {
          img {
            transform: scale(1.1);
          }
        }
      }

      .img-box {
        // width: 228px;
        // height: 228px;
        overflow: hidden;
        position: relative;

        img {
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: 0.3s;
        }
      }

      .info-box {
        width: 100%;
        background: #fff;
        // border: 1px solid #e5e5e5;
        // border-top: none;
        padding: 10px;
      }

      .title {
        text-align: left;
        width: 100%;
        .ellipsis-2();

        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #222222;
        white-space: normal;
      }

      .baozhiqi {
        margin-top: 10px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ea5959;
      }

      .price-box {
        margin-top: 5px;

        .sale {
          span {
            font-family: OPPOSans, OPPOSans;
            font-weight: bold;
            font-size: 12px;
            color: #ff0000;
          }
        }

        .market {
          text-decoration: line-through;
          margin-left: 17px;

          span {
            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 12px;
            color: #bfbfbf;
          }
        }
      }
    }
  }
}
</style>
