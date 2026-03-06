<template>
  <div class="product-list flex">
    <div
      class="product-item hover"
      v-for="(item, index) in list"
      :key="index"
      @click="to_product(item)"
    >
      <div class="poster-box scale-box">
        <img class="scale-img" :src="item.thumb" alt="" />
        <div class="hover-actions">
          <div class="action-btn favorite-btn" @click.stop="do_add_fav(item)">
          </div>
          <div class="action-btn cart-btn" @click.stop="addToCart(item)">
          </div>
        </div>
      </div>
      <div class="info-box">
        <div class="title-box">
          <div class="title">
            {{ item.title }}
          </div>
        </div>
        <div class="price-box">
          <div class="price">
            <div class="pirce-num">￥{{ item.priceSale }}</div>
          </div>
          <div class="market-price">
            ￥{{ item.priceMarket }}
          </div>
        </div>
        <div class="btn-box">
          <div class="btn" @click.stop="openQuickBuy(item)">
            FDA
          </div>
          <div class="btn" @click.stop="openQuickBuy(item)">
            ISO13485
          </div>
        </div>
      </div>
      <!-- <el-tooltip
        class="item"
        effect="dark"
        content="仅限企业用户购买"
        placement="top"
      > -->
        <el-tag
          class="tag-dom"
          type="warning"
          effect="dark"
          v-if="item.isThird == 1"
          >510K</el-tag
        >
      <!-- </el-tooltip> -->
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

    // 添加收藏
    do_add_fav(item) {
      if (!this.mix_get_login_status()) {
        return;
      }
      const productId = item.productId || item.id;
      if (!productId) {
        alertErr("商品信息不完整");
        return;
      }
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_operate",
          productId: productId,
          operateType: 1, //1-关注 2-足迹
          operateSence: 0 //0-关注（添加记录） 1-取消关注（删除记录）
        }
      }).then(res => {
        alert(res);
        if (res.code == 200) {
          // 可以在这里更新UI状态
        }
      });
    },

    // 加入购物车
    addToCart(item) {
      if (typeof this.mix_get_login_status === "function") {
        if (!this.mix_get_login_status()) return;
      }
      const inventoryId = item.inventoryId || item.id;
      if (!inventoryId) {
        alertErr("商品信息不完整，无法加入购物车");
        return;
      }
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_add",
          inventoryId,
          num: 1
        }
      }).then(res => {
        if (res.code == 200) {
          const totalCount = (res.data && res.data.count) || 0;
          if (this.$store && this.$store.commit) {
            this.$store.commit("set_vuex_cart_number", totalCount);
          }
          alertSucc("Added to cart");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.product-list {
  flex-wrap: wrap;
  gap: 36px;

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
    position: relative;

    .tag-dom {
      position: absolute;
      left: 0;
      top: 0;
      text-align: center;
      font-size: 22px;
      line-height: 37px;
      width: 82px;
      height: 37px;
      background: linear-gradient(90deg, #ec6a2b 0%, #ff9524 100%);
      border-radius: 24px 0px 24px 0px;
    }

    .poster-box {
      margin: 0 auto;
      width: 373px;
      height: 373px;
      border-radius: 24px;
      position: relative;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 24px;
      }

      .hover-actions {
        position: absolute;
        right: 15px;
        bottom: 15px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 10;
      }

      &:hover .hover-actions {
        opacity: 1;
      }

      .action-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

        &:hover {
          transform: scale(1.1);
        }
      }

      .favorite-btn {
        background-image: url("~@img/my-index/favorite.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      .cart-btn {
        background-image: url("~@img/my-index/cart.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }

    .info-box {
      text-align: left;
      padding-top: 4px;
      width: 373px;

      .price-box {
        display: flex;
        align-items: end;
        gap: 10px;
        .price {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 30px;
          color: #ec6a2b;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
        }

        .market-price {
          color: #5e5e5e;
          font-size: 20px;
          text-decoration: line-through;
        }
      }

      .title-box {
        height: 85px;

        .title {
          height: 80px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: MicrosoftYaHei, MicrosoftYaHei;
          font-weight: bold;
          font-size: 20px;
          color: #1e262e;
          line-height: 26px;
        }
      }
      .btn-box {
        margin-top: 22px;
        display: flex;
        gap: 12px;
        .btn {
          height: 30px;
          text-align: center;
          border-radius: 5px;
          border: 1px solid #00306b;
          padding: 0 10px;
          font-family: Poppins, Poppins;
          font-weight: 600;
          font-size: 22px;
          color: #00306b;
          line-height: 31px;
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

<style scoped lang="less" src="@/assets/h5css/page/shipei.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei.less"></style>