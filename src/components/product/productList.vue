<template>
  <div class="product-list flex">
    <div
      class="product-item hover"
      v-for="(item, index) in list"
      :key="index"
      @click="to_product(item)"
    >
      <el-tooltip
        class="item"
        effect="dark"
        content="仅限企业用户购买"
        placement="top"
      >
        <el-tag
          class="tag-dom"
          type="warning"
          effect="dark"
          v-if="item.isThird == 1"
          >三类</el-tag
        >
      </el-tooltip>
      <div class="poster-box scale-box">
        <img class="scale-img" :src="item.thumb" alt="" />
      </div>
      <div class="info-box">
        <div class="title-box">
          <div class="title ellipsis-1">
            {{ item.title }}
          </div>
        </div>
        <!-- <div class="price flex">
                      <div class="pirce-num">￥ {{ item.priceSale }}</div>
                    </div> -->
        <div class="flex-between">
          <div>
            <div class="price">
              <div class="pirce-num">￥{{ item.priceSale }}</div>
            </div>
            <div class="market-price">
              {{ item.priceMarket }}
            </div>
          </div>
          <div class="flex-center">
            <div class="btn" @click.stop="openQuickBuy(item)">
              <img src="@img/index/order.png" />
            </div>
            <div class="btn" @click.stop="openQuickBuy(item)">
              <img src="@img/index/cart.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="product-item" v-for="(item, index) in list" :key="index">
      <div class="product-item-info" @click="to_product(item)">
        <div class="img-box">
          <img :src="item.thumb" class="product-img" />
          <shouqing :kucun="goods.kucun" />
        </div>
        <div class="info-box">
          <div class="title-box">
            <div class="title ellipsis-2">
              {{ item.title }}
            </div>
          </div>

          <div class="price-box flex-between">
            <div class="sale">
              <span class="huobi"> {{ vuex_huobi }} </span>
              <span class="value"> {{ item.priceSale }} </span>
            </div>
            <div class="cart-box">
              <img
                src="@img/common/cart.png"
                alt=""
                class="img-check check-1"
              />
            </div>
            <div class="market">
              <span class="huobi"> {{ vuex_huobi }} </span>
              <span class="value"> {{ item.priceSale }} </span>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <EnterpriseUserModal :visible="showEnterpriseModal" @close="closeEnterpriseModal"
      @confirm="confirmEnterpriseModal" />

    <product_quick_buy_modal ref="product_quick_buy_modal" />

    <product_renzheng_tip ref="product_renzheng_tip" />


  </div>
</template>

<script>
// import shouqing from "@/components/common/shouqing.vue";
import product_quick_buy_modal from "@/components/product/product_quick_buy_modal.vue";
import EnterpriseUserModal from "@/components/modals/enterpriseUserModal.vue";
import { mapState } from "vuex";
import product_renzheng_tip from "@/components/product/product_renzheng_tip.vue";
export default {
  name: "product-list",
  components: {
    // shouqing,
     EnterpriseUserModal,
    product_quick_buy_modal,
    product_renzheng_tip,
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
    return {
      showEnterpriseModal:false,
    };
  },
  computed: {
    title1() {
      return this.arrTitle[0] || "";
    },
    title2() {
      return this.arrTitle[1] || "";
    },
     ...mapState([
      //
      "vuex_index_banners",
      "index_full_ani",
      "hotSearchWords",
      "vuex_map_banners",
      "vuex_is_login",
      "vuex_user",
      "vuex_news_cates",
      "vuex_config",
    ]),
  },
  methods: {
    to_product(item) {
      // this.$router.push({
      //   path: "/product-detail",
      //   query: {
      //     id: item.inventoryId,
      //   },
      // });
      window.open('/product-detail?id='+item.inventoryId, '_blank','',false)

    },
    do_toggle_check(item) {
      this.$emit("toggle_check", item);
    },

    openQuickBuy(item) {
      console.log('this.vuex_user.userType',this.vuex_user.userType)
      if (item.isThird == 1) {
        if (this.vuex_user.userType != 1) {
          this.$refs.product_renzheng_tip.init();
          return
        } else if (this.vuex_user.userType == 1) {
          if (this.vuex_user.license2 || this.vuex_user.license3 || this.vuex_user.license4 | this.vuex_user.license6) {
            console.log('可以购买三类')
          } else {
            this.$refs.product_renzheng_tip.init();
            return
          }
        }
      }






      const inventoryId = item.inventoryId || item.id;
      if (inventoryId && this.$refs.product_quick_buy_modal) {
        this.$refs.product_quick_buy_modal.init(inventoryId);
      }
    },

    // 关闭企业用户认证弹窗
    closeEnterpriseModal() {
      this.showEnterpriseModal = false;
    },

    // 确认企业用户认证弹窗
    confirmEnterpriseModal() {
      // 可以在这里添加跳转到会员中心的逻辑
      this.$router.push(
        this.vuex_user.userType == 2 ? "/part-time-sales" : "/enterprise-cert"
      );
    },
  },
};
</script>

<style scoped lang="less">
.product-list {
  flex-wrap: wrap;

  // .product-item {
  //   position: relative;
  //   width: 264px;
  //   height: 336px;
  //   background: #ffffff;
  //   border-radius: 8px;
  //   border: 1px solid #cbcbcb;
  //   padding: 10px 20px 0;
  //   margin-right: 20px;
  //   margin-top: 20px;
  //   text-align: center;
  //   border: 1px solid #e5e5e5;
  //   overflow: hidden;
  //   cursor: pointer;

  //   &:nth-child(5n) {
  //     margin-right: 0;
  //   }

  //   &:nth-child(-n + 5) {
  //     margin-top: 0;
  //   }

  //   &:hover {
  //     .img-box {
  //       img {
  //         transform: scale(1.1);
  //       }
  //     }
  //   }

  //   .img-box {
  //     width: 224px;
  //     height: 224px;
  //     padding-bottom: 23px;
  //     margin: 0 auto;
  //     overflow: hidden;
  //     position: relative;

  //     img {
  //       width: 224px;
  //       height: 224px;
  //       object-fit: cover;
  //       transition: 0.3s;
  //     }
  //   }

  //   .info-box {
  //     width: 100%;
  //     background: #fff;
  //     // border: 1px solid #e5e5e5;
  //     // border-top: none;
  //     padding: 15px 0px;

  //     .title-box {
  //       height: 22px;
  //     }
  //     .title {
  //       font-family: MicrosoftYaHei, MicrosoftYaHei;
  //       font-weight: normal;
  //       font-size: 14px;
  //       color: #3d4248;
  //       line-height: 22px;
  //     }

  //     .price-box {
  //       margin-top: 15px;

  //       .sale {
  //         font-family: Microsoft YaHei, Microsoft YaHei;
  //         font-weight: bold;
  //         font-size: 14px;
  //         color: #f74747;
  //         .value {
  //           font-size: 18px;
  //         }
  //       }

  //       .market {
  //         // text-decoration: line-through;
  //         margin-left: 17px;
  //         color: #bfbfbf;

  //         span {
  //           text-decoration: line-through;
  //           font-family: OPPOSans, OPPOSans;
  //           font-weight: 400;
  //           font-size: 12px;
  //           color: #bfbfbf;
  //         }
  //       }

  //       .cart-box {
  //         img {
  //           width: 32px;
  //           height: 32px;
  //         }
  //       }
  //     }

  //     .sku-box {
  //       min-height: 50px;
  //       margin-top: 8px;
  //       flex-wrap: wrap;

  //       .sku-item {
  //         position: relative;
  //         padding: 4px 0;
  //         width: 50%;
  //         text-align: center;
  //         font-family: Arial, Arial;
  //         font-weight: 400;
  //         font-size: 12px;
  //         color: #444444;

  //         &::after {
  //           content: "";
  //           position: absolute;
  //           bottom: 0;
  //           left: 50%;
  //           width: 0px;
  //           height: 1px;
  //           transform: translate(-50%);
  //           background: #ccc;
  //         }

  //         &:hover {
  //           &::after {
  //             width: 40px;
  //           }
  //         }
  //       }
  //     }

  //     .btn-box {
  //       margin-top: 20px;

  //       .btn-cart {
  //         width: 226px;
  //         width: 100%;
  //         height: 27px;
  //         border-radius: 0px 0px 0px 0px;
  //         border: 1px solid #009f39;
  //         font-family: OPPOSans, OPPOSans;
  //         font-weight: bold;
  //         font-size: 12px;
  //         color: #009f39;

  //         &:hover {
  //           background: #009f39;
  //           color: #fff;
  //         }
  //       }
  //     }
  //   }
  // }
  .product-item {
    cursor: pointer;
    background: #fff;
    width: 254px;
    height: 360px;
    margin-bottom: 16px;
    padding: 17px 20px;
    margin-right: 15px;
    border-radius: 8px 8px 8px 8px;
    position: relative;
    .tag-dom {
      position: absolute;
      right: 0;
      top: 0;
      width: 40px;
      height: 25px;
      line-height: 25px;
    }

    &:nth-child(6n) {
      margin-right: 0;
    }

    .poster-box {
      margin: 0 auto;
      width: 215px;
      height: 215px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .info-box {
      text-align: left;
      padding-top: 14px;

      .title-box {
        height: 22px;
        margin-bottom: 16px;

        .title {
          font-family: MicrosoftYaHei, MicrosoftYaHei;
          font-weight: normal;
          font-size: 16px;
          color: #1F1F1F;
          line-height: 22px;
        }
      }
      .market-price {
        text-decoration-line: line-through;
        color: #505050;
        font-size: 14px;
      }
      .btn {
        width: 32px;
        height: 32px;
        text-align: center;
        border-radius: 50%;
        img {
          margin-top: 6px;
          width: 19px;
        }
        &:first-child {
          background: #7853b2;
        }
        &:last-child {
          background: #FCB000;
          margin-left: 7px;
        }
      }
      .price {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 20px;
        color: #7853b2;
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

<style scoped lang="less" src="@/assets/h5css/page/shipei.less"></style>