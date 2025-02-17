<template>
  <div class="product-list flex">
    <div class="product-item" v-for="(item, index) in list" :key="index">
      <div class="product-item-info">
        <div class="img-box" @click="to_product(item)">
          <img :src="item.thumb" class="product-img" />
          <!-- <shouqing :kucun="goods.kucun" /> -->
        </div>
        <div class="info-box">
          <div class="title ellipsis-2">
            {{ item.title }}
            <div class="hot">限量50台</div>
            <div class="hot">限购2台</div>
          </div>

          <div class="price-box">
            <div class="sale">
              <span class="huobi">CN {{ vuex_huobi }} </span>
              <span class="value"> {{ item.priceSale }} </span>
            </div>
            <div class="market">
              <img src="@/assets/image/product/like.png" alt="">
              <img src="@/assets/image/product/cartAdd.png" alt="">
            </div>
          </div>
        </div>
        <div class="act-info" v-if="is_show_check">
          <div class="img-check-box flex-center" @click.stop="do_toggle_check(item)">
            <img v-if="item.checked" src="@/static/common/check1.png" alt="" class="img-check check-1" />
            <!-- <img v-else src="@/static/common/check0.png" alt="" class="img-check check-0" /> -->
            <img v-else src="@/static/common/check00.png" alt="" class="img-check check-0" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      default: false
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
      this.$emit('toggle_check', item)
    }
  },
};
</script>

<style scoped lang="less">
.product-list {
  flex-wrap: wrap;

  .product-item {
    position: relative;
    width: 322px;
    height: 346px;
    margin-right: 20px;
    margin-top: 20px;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(0,0,0,0.1);
    background: #FFFFFF;

    &:nth-child(3n) {
      margin-right: 0;
    }

    &:nth-child(-n + 3) {
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
      width: 100%;
      height: 217px;
      padding-bottom: 23px;
      margin: 0 auto;
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        height: 296px;
        object-fit: cover;
        transition: 0.3s;
      }
    }

    .info-box {
      width: 100%;
      height: 120px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        text-align: left;
        width: 100%;
        font-family: Poppins, Poppins;
        font-weight: 600;
        font-size: 16px;
        color: #000;

        .hot {
          text-align: center;
          background-image: url("~@/assets/image/product/hot.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 63px;
          height: 18px;
          line-height: 18px;
          display: inline-block;
          font-size: 12px;
          color: #fff;
          font-weight: 400;
        }
      }


      .price-box {
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        .sale {
          span {
            font-family: OPPOSans, OPPOSans;
            font-weight: bold;
            font-size: 18px;
            color: #000;
          }

        }

        .market {
          img {
            width: 21px;
          }
          img:first-child {
            margin-right: 30px;
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
            content: '';
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
          border: 1px solid #F74747;
          font-family: OPPOSans, OPPOSans;
          font-weight: bold;
          font-size: 12px;
          color: #F74747;

          &:hover {
            background: #F74747;
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
            color: #FF0000;
          }

        }

        .market {
          text-decoration: line-through;
          margin-left: 17px;

          span {
            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 12px;
            color: #BFBFBF;
          }

        }
      }
    }
  }
}
</style>
