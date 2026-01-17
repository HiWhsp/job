<template>
  <div class="page">
    <div class="page-top">
      <div class="page-bread w-1400">
        <div class="bread-box">
          <router-link to="/">Home</router-link>
          <span class="arrow">/</span>
          <a class="link">Cart</a>
        </div>
      </div>
    </div>
    <div class="inner w-1400">
      <!-- 商品列表 -->
      <div class="empty-wrap column-flex-center" v-if="!list_shopcart.length">
        <div class="empty-pic-box">
          <img src="@img/cart/cart-empty.png" alt="" />
        </div>
        <div class="empty-text">Your cart is empty, go and purchase some items~</div>
        <div class="empty-btn">
          <div class="btn flex-center btn-ripple" @click="toRoute('/')">
            Go Shopping
          </div>
        </div>
      </div>

      <div class="ctx-box" v-else>
        <div class="list cart-list">
          <div class="cart-list-inner">
            <!-- 标题 -->
            <div class="list-title">
              <div class="title-1"></div>
              <div class="title-2" style="text-align: left; padding-left: 0px">
                Product
              </div>
              <!-- <div class="title-3">规格</div> -->
              <div class="title-4">price</div>
              <div class="title-5">quantity</div>
              <div class="title-6">TOTAL</div>
              <div class="title-7"></div>
            </div>

            <!-- 商品列表 -->
            <div
              class="item"
              v-for="(item, index) in list_shopcart"
              :key="index"
            >
              <div class="item-detail flex">
                <div class="box-select">
                  <el-checkbox
                    v-model="item.checked"
                    @change="on_change_checked_item"
                  ></el-checkbox>
                </div>

                <div class="box-image cover">
                  <!-- <img :src="item.image" @click="mix_to_product(item)" /> -->
                  <el-image :src="item.image" @click="mix_to_product(item)">
                    <div slot="error" class="image-slot">
                      <img :src="item.default_img" />
                    </div>
                  </el-image>
                </div>
                <div class="box-title">
                  <div class="goods-title" @click="mix_to_product(item)">
                    {{ item.title }}
                  </div>
                  <div class="sku-info">
                    {{ item.keyVals }}
                  </div>
                </div>
                <!-- <div class="box-sku">
                  {{ item.keyVals }}
                </div> -->
                <div class="box-unit-price">
                  {{ vuex_huobi }} {{ item.priceSale }} / pack
                </div>
                <div class="box-number">
                  <button @click="do_number_minus(item)">-</button>
                  <input
                    type="number"
                    min="1"
                    v-model="item.num"
                    @blur="on_blur_input(item)"
                  />
                  <button @click="do_number_plus(item)">+</button>
                </div>
                <div class="box-subtotal">
                  {{ vuex_huobi }} {{ (item.priceSale * item.num).toFixed(2) }}
                </div>
                <div class="box-act">
                  <!-- <div class="goods-action-box" v-if="false">
                    <span class="goods-action" v-if="item.if_collect" @click="favouriteDelete(item)">
                      <img src="@img/other/shopcart-goods-yishoucang.png" alt="" />
                      取消
                    </span>
                    <span class="goods-action" v-else @click="favouriteAdd(item)">
                      <img src="@img/other/shopcart-goods-weishoucang.png" alt="" />
                      收藏</span>
                  </div> -->
                  <div class="goods-action-box">
                    <span
                      class="goods-action"
                      data-fn="do_cart_delete_row"
                      @click="do_cart_delete_row_tip(item.inventoryId)"
                    >
                      <img src="@img/other/shopcart-goods-delete.png" alt="" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <el-empty
              v-if="!list_shopcart.length"
              description="购物车为空，快去选购商品吧～"
            ></el-empty>
            <!-- <div class="empty" v-if="!list_shopcart.length">暂无数据...</div> -->
          </div>
        </div>

        <!-- 底部操作 -->
        <div class="bottom-action-box">
          <div class="all-select">
            <el-checkbox
              v-model="checked_all"
              @change="on_change_checked_all"
              >{{ checked_all ? "Unselect All" : "Select All" }}</el-checkbox
            >
          </div>
          <div class="delete-box">
            <span
              data-fn="do_cart_remove_select"
              @click="do_cart_remove_select_tip()"
              >Delete selected</span
            >
          </div>
          <div class="clear-box">
            <span data-fn="do_cart_clear" @click="do_cart_clear_tip()"
              >Clear cart</span
            >
          </div>

          <div class="total-number">
            Selected
            <b>{{ count_shopcart_checked }}</b>
            Item
          </div>
          <div class="total-price">
            Total Amount
            <b>{{ vuex_huobi }} {{ shopcart_money }}</b>
          </div>
          <button
            :disabled="jiesuanDisabled"
            class="btn-ripple btn-order"
            @click="to_pay()"
          >
            Check out
          </button>
        </div>
      </div>
    </div>

    <cart_action_modal
      data-title="删除提示"
      ref="cart_action_modal"
      @confirm="do_confirm_delete"
    />
  </div>
</template>

<script>
import cart_action_modal from "@/components/cart/cart_action_modal.vue";

import { mapState } from "vuex";

export default {
  name: "cart",
  components: {
    cart_action_modal,
  },
  data() {
    return {
      address: "", //选择的地址
      checked_all: false, //是否全选
      list_shopcart: [], //购物车商品列表
      list_address: [], //地址列表
      keyword: "",
    };
  },
  computed: {
    ...mapState([""]),

    canSubmit() {
      return this.form.name;
    },

    //购物车商品总金额
    shopcart_money() {
      let money = 0;
      this.list_shopcart
        .filter((v) => v.checked)
        .forEach((v) => {
          money += v.num * v.priceSale;
        });
      return money.toFixed(2);
    },

    //购物车被选择的商品
    list_shopcart_checked() {
      return this.list_shopcart.filter((v) => v.checked);
    },
    //购物车被选择的商品
    count_shopcart_checked() {
      let count = 0;
      if (this.list_shopcart_checked.length) {
        this.list_shopcart_checked.forEach((v) => {
          count += +v.num;
        });
      }
      return count;
    },

    jiesuanDisabled() {
      return !this.list_shopcart_checked.length;
    },
  },
  watch: {
    address(val) {
      //console.log("当前地址", val);
    },
  },
  created() {
    this.setView();
  },
  methods: {
    do_update_vuex_cart_number() {
      let count = 0;
      this.list_shopcart.forEach((v) => {
        count += v.num * 1;
      });

      this.$store.commit("set_vuex_cart_number", count);
    },

    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_lists",
        },
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          data.forEach((v) => {
            v.checked = true;
          });
          this.list_shopcart = data;
          if (data.length) {
            this.checked_all = true;
          }

          this.do_update_vuex_cart_number();
        }
      });
    },

    favouriteDelete(item) {
      this.$api("product_collect", {
        inventoryId: item.inventoryId,
        collect_type: 1,
      }).then((res) => {
        let { code, message } = res;

        if (code == 200) {
          this.setView();
        }
      });
    },
    favouriteAdd(item) {
      this.$api("product_collect", {
        inventoryId: item.inventoryId,
        collect_type: 0,
      }).then((res) => {
        let { code, message } = res;

        if (code == 200) {
          this.setView();
        }
      });
    },

    do_cart_remove_select_tip() {
      if (!this.list_shopcart_checked.length) {
        alertErr("Please select the products to delete");
        return;
      }

      this.$refs.cart_action_modal.init({
        type: "批量",
        inventoryId: "",
        tip: "Are you sure to delete the selected products?",
      });
    },

    //购物车 删除选中
    do_cart_remove_select() {
      if (!this.list_shopcart_checked.length) {
        alertErr("Please select the products to delete");
        return;
      }
      let ids = this.list_shopcart_checked.map((v) => v.inventoryId);
      //console.log("要删除的商品id", ids);
      let id = ids.join();
      this.do_cart_delete_row(id);
    },

    do_cart_delete_row_tip(inventoryId) {
      this.$refs.cart_action_modal.init({
        type: "单个",
        inventoryId: inventoryId,
        tip: "Are you sure to delete this product?",
      });
    },

    do_confirm_delete(option) {
      if (option.type == "单个") {
        this.do_cart_delete_row(option.inventoryId);
      } else if (option.type == "全部") {
        this.do_cart_clear();
      } else if (option.type == "批量") {
        this.do_cart_remove_select();
      }
    },

    //购车车 删除商品
    do_cart_delete_row(inventoryId) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_del",
          inventoryId: inventoryId,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = this.list_shopcart;
          let ids = (inventoryId + "").split(",");
          //可能删除多项商品
          ids.forEach((inventoryId) => {
            let index = list.findIndex((v) => v.inventoryId == inventoryId);
            list.splice(index, 1);
          });

          this.do_update_vuex_cart_number();
        }
      });
    },

    //购物车商品数量减少
    do_number_minus(item) {
      if (item.num == 1) {
        return;
      }
      item.num = --item.num;
      this.do_updateNum(item);
    },

    //购物车商品数量增加
    do_number_plus(item) {
      item.num = ++item.num;
      this.do_updateNum(item);
    },
    //购物车修改数量
    do_updateNum(item) {
      let { inventoryId, num } = item;

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_updateNum",
          inventoryId: inventoryId,
          num: num,
        },
      }).then((res) => {
        if (res.code == 200) {
          let index = this.list_shopcart.findIndex(
            (v) => v.inventoryId == inventoryId
          );
          this.list_shopcart.splice(index, 1, item);

          this.do_update_vuex_cart_number();
        }
      });
    },

    // 购物车商品更新数量

    do_cart_clear_tip() {
      if (!this.list_shopcart.length) {
        alertErr("The shopping cart is empty!");
        return;
      }

      this.$refs.cart_action_modal.init({
        type: "全部",
        inventoryId: "",
        tip: "Are you sure to clear the shopping cart?",
      });
    },

    //清空购物车
    do_cart_clear() {
      if (!this.list_shopcart.length) {
        alertErr("The shopping cart is empty!");
        return;
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_delAll",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.list_shopcart = [];
          this.do_update_vuex_cart_number();
        }
      });
    },

    //商品勾选 全选与取消
    on_change_checked_all(val) {
      //console.log("更新后的值", val);
      this.list_shopcart.forEach((v) => {
        v.checked = val;
      });
    },

    //商品勾选 单项选择
    on_change_checked_item() {
      // //console.log('监视单项选择', item)
      let checkLength = this.list_shopcart_checked.length;
      if (checkLength == this.list_shopcart.length) {
        this.checked_all = true;
      } else {
        this.checked_all = false;
      }
    },

    //去结算
    to_pay() {
      if (!this.list_shopcart.length) {
        alertErr("您的购物车是空的，快去选购商品吧！");
        return;
      }

      if (!this.list_shopcart_checked.length) {
        alertErr("请选择要结算的商品");
        return;
      }

      let data_format = this.list_shopcart_checked.map((v) => ({
        title: v.title,
        image: v.image,
        inventoryId: v.inventoryId,
        productId: v.productId,
        keyVals: v.keyVals,
        num: v.num,
        priceSale: v.priceSale,
        priceMarket: v.priceMarket,
      }));

      this.$store.commit(
        "set_cache_payment_products",
        JSON.stringify(data_format)
      );

      this.$router.push({
        path: "/order-submit",
        query: {
          from: "cart",
        },
      });
    },

    on_blur_input(item) {
      if (item.num < 1) {
        item.num = 1;
      }
      this.shopcart_updateNum(item);
    },
  },
};
</script>

<style scoped lang="less">
page {
  background: #fff;
}
.page {
  text-align: center;
  font-size: 14px;
  padding-top: 45px;

  .page-top {
    height: 83px;
    line-height: 83px;
    background: #fbfbfb;
    border-top: 1px solid #d5d8de;
    .bread-box {
      display: flex;
      align-items: flex-start;
      a {
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 16px;
        color: #5e5e5e;
      }
      .arrow {
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 18px;
        color: #5e5e5e;
        margin: 0 6px;
      }
      .link {
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 18px;
        color: #5e5e5e;
      }
    }
  }

  .inner {
    background: #ffffff;
    min-height: 50vh;
    margin: 0 auto;
    padding: 0 0 80px;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
  }

  .ctx-box {
    background: #fff;
    margin-top: 30px;

    .list {
      .list-title {
        text-align: center;
        height: 50px;
        background: #fbfbfb;
        padding: 15px 0;

        display: flex;
        align-items: center;

        .title-1 {
          width: 100px;
          text-align: center;
        }

        .title-2 {
          // width: 150px;
          flex: 2;
        }

        .title-3 {
          width: 200px;
        }

        .title-4 {
          width: 200px;
        }

        .title-5 {
          width: 200px;
        }

        .title-6 {
          width: 200px;
        }

        .title-7 {
          width: 200px;
        }
      }

      .item {
        border-bottom: 1px solid #dedede;

        &:last-child {
          border-bottom: none;
        }

        .item-title {
          display: flex;
          align-items: center;
          text-align: left;
          padding: 12px 40px;
          border-bottom: 1px solid #eee;

          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 14px;
          color: #1f1f1f;
        }

        .item-detail {
          padding: 40px 0;
          font-family: OPPOSans, OPPOSans;
          // font-weight: bold;
          font-size: 14px;
          color: #1f1f1f;

          .box-select {
            width: 58px;
            width: 100px;
          }

          .box-image {
            img {
              width: 120px;
              height: 120px;
              margin-right: 10px;
              cursor: pointer;
            }

            /deep/ img {
              width: 120px;
              height: 120px;
              margin-right: 10px;
              cursor: pointer;
            }
          }

          .box-title {
            flex: 2;
            text-align: left;

            div {
              &:hover {
                color: #7853b2;
              }
            }

            .goods-title {
              font-size: 24px;
              color: #1e262e;
              width: fit-content;
              cursor: pointer;
              height: 63px;
              line-height: 30px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-line-clamp: 2;
            }

            .sku-info {
              width: fit-content;
              cursor: pointer;
              margin-top: 15px;
              color: #5e5e5e;
              font-size: 20px;
            }
          }

          .box-sku {
            width: 200px;
          }

          .box-unit-price {
            width: 200px;
            font-size: 20px;
            font-weight: 600;
            color: #ec6a2b;
          }

          .box-number {
            width: 200px;
            display: flex;
            justify-content: center;
            align-items: center;

            input {
              width: 48px;
              height: 48px;
              border: 1px solid #d5d8de;
              text-align: center;
              border-left: 0;
              border-right: 0;

              &::-webkit-outer-spin-button,
              &::-webkit-inner-spin-button {
                -webkit-appearance: none;
              }
            }

            button {
              width: 48px;
              height: 48px;
              border: 1px solid #d5d8de;
            }
          }

          .box-subtotal {
            width: 200px;
            color: #ec6a2b;
            font-size: 20px;
            font-weight: bold;
          }

          .box-act {
            width: 200px;
            font-size: 16px;

            div {
              & + div {
                margin-top: 10px;
              }

              span {
                cursor: pointer;

                &:hover {
                  color: #7853b2;
                }
              }
            }
          }
        }
      }
    }
  }
}

.goods-action-box {
  text-align: center;
  font-size: 14px;
  font-weight: normal;
  color: #1f1f1f;

  .goods-action {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #1f1f1f;

    img {
      width: 44px;
    }
  }
}

.bottom-action-box {
  display: flex;
  align-items: center;
  padding-right: 40px;
  height: 86px;
  background: #fafbfc;
  // border: 1px solid #eeeeee;
  // box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
  opacity: 1;
  margin-top: 40px;

  .all-select {
    cursor: pointer;
    min-width: 120px;
    width: fit-content;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 22px;
    color: #1e262e;
    margin-right: 20px;
    /deep/ .el-checkbox__input + .el-checkbox__label {
      color: #1e262e !important;
      font-size: 22px !important;
    }
  }

  .delete-box {
    cursor: pointer;
    width: fit-content;

    span {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 22px;
      color: #ec6a2b;

      &:hover {
        color: #7853b2;
      }
    }
  }

  .clear-box {
    cursor: pointer;
    margin-left: 64px;
    flex: 2;
    text-align: left;

    span {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 22px;
      color: #1e262e;

      &:hover {
        color: #7853b2;
      }
    }
  }

  .total-number {
    width: fit-content;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 16px;
    color: #1f1f1f;

    b {
      font-size: 24px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #EC6A2B;
    }
  }

  .total-price {
    margin-left: 60px;
    margin-right: 60px;
    width: fit-content;

    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 16px;
    color: #1f1f1f;

    b {
      font-size: 24px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #EC6A2B;
    }
  }

  .btn-order {
    cursor: pointer;
    width: 191px;
    height: 46px;
    background: #7853b2;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #ffffff;
    transition: 0.3s;
    user-select: none;

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
}

.tip-box {
  margin-top: 30px;
  text-align: left;
  font-size: 14px;
  color: #505050;

  b {
    color: #e6170b;
  }
}

.empty-wrap {
  margin-top: 80px;
  .empty-pic-box {
    img {
      width: 199px;
    }
  }
  .empty-text {
    margin: 39px 0 33px 0;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 16px;
    color: #1f1f1f;
  }
  .empty-btn {
    .btn {
      width: 224px;
      height: 56px;
      border-radius: 8px 8px 8px 8px;
      background: #EC6A2B;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #ffffff;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/shoppingCart.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/shoppingCart.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei4.less"></style>
