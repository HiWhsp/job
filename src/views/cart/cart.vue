<template>
  <div class="page">
    <div class="inner w-1400">
      <pageBreadcrumb />
      <!-- 商品列表 -->
      <div class="empty-wrap column-flex-center" v-if="!list_shopcart.length">
        <div class="empty-pic-box">
          <img src="@img/cart/cart-empty.png" alt="" />
        </div>
        <div class="empty-text">购物车为空，快去选购商品吧～</div>
        <div class="empty-btn">
          <div class="btn flex-center btn-ripple" @click="toRoute('/product-cates')">
            去购物
          </div>
        </div>
      </div>
      <div class="ctx-box" v-else>
        <div class="list cart-list">
          <div class="cart-list-inner">
            <!-- 标题 -->
            <div class="list-title">
              <div class="title-1">选择</div>
              <!-- <div class="title-3">货号</div> -->
              <div class="title-2" style="text-align: left; padding-left: 0px">
                产品名称
              </div>
              <div class="title-4">单价</div>
              <div class="title-5">数量</div>
              <div class="title-6">小计</div>
              <!-- <div class="title-8">需求描述</div> -->
              <div class="title-7">操作</div>
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
                <!-- <div class="box-sku" @click="mix_to_product(item)">{{ item.skuId }}</div> -->

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
                    规格：{{ item.keyVals || '--' }}
                  </div>
                </div>
                <div class="box-unit-price">
                  {{ vuex_huobi }} {{ item.priceSale }}
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
                <!-- <div class="box-desc">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入需求描述"
                    v-model="item.remark"
                  ></el-input>
                </div> -->
                <div class="box-act">
                  <div class="goods-action-box">
                    <span
                      class="goods-action"
                      data-fn="do_cart_delete_row"
                      @click="do_cart_delete_row_tip(item.inventoryId)"
                    >
                      删除</span
                    >
                  </div>
                  <div class="goods-action-box">
                    <span class="goods-action" @click.stop="favouriteAdd(item)">
                      {{ item.ifShoucang ? "取消收藏" : "加入收藏夹" }}</span
                    >
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
              >{{ checked_all ? "反选" : "全选" }}</el-checkbox
            >
          </div>
          <div class="delete-box">
            <span
              data-fn="do_cart_remove_select"
              @click="do_cart_remove_select_tip()"
              >删除选中</span
            >
          </div>
          <div class="clear-box">
            <span data-fn="do_cart_clear" @click="do_cart_clear_tip()"
              >清空购物车</span
            >
          </div>

          <div class="total-number">
            已选择
            <b>{{ count_shopcart_checked }}</b>
            件商品
          </div>
          <div class="total-price">
            合计：
            <b>{{ vuex_huobi }} {{ shopcart_money }}</b>
          </div>
          <button
            :disabled="jiesuanDisabled"
            class="btn-ripple btn-order"
            @click="to_pay()"
          >
            去下单
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
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";
import cart_action_modal from "@/components/cart/cart_action_modal.vue";

import { mapState } from "vuex";

export default {
  name: "cart",
  components: {
    cart_action_modal,
    pageBreadcrumb,
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
            v.checked = false;
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
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_operate",
          productId: item.productId,
          operateType: 1,
          operateSence: item.ifShoucang ? 1 : 0,
        },
      }).then((res) => {
        let { code, message } = res;

        if (code == 200) {
          this.setView();
        }
      });
    },

    do_cart_remove_select_tip() {
      if (!this.list_shopcart_checked.length) {
        alertErr("请先选择要删除的商品");
        return;
      }

      this.$refs.cart_action_modal.init({
        type: "批量",
        inventoryId: "",
        tip: "确定删除所选商品吗？",
      });
    },

    //购物车 删除选中
    do_cart_remove_select() {
      if (!this.list_shopcart_checked.length) {
        alertErr("请先选择要删除的商品");
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
        tip: "确定删除该商品吗？",
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
        alertErr("购物车是空的！");
        return;
      }

      this.$refs.cart_action_modal.init({
        type: "全部",
        inventoryId: "",
        tip: "确定清空购物车吗？",
      });
    },

    //清空购物车
    do_cart_clear() {
      if (!this.list_shopcart.length) {
        alertErr("购物车是空的！");
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
/deep/ .order-list-wrap {
  margin-top: 30px;
}
.page {
  background: #f3f3f3;
  text-align: center;
  font-size: 14px;
  padding-top: 20px;

  .inner {
    min-height: 50vh;
    margin: 0 auto;
    padding: 0 0 80px;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
  }

  .search-wrap {
    text-align: left;

    .search-tip {
      font-size: 14px;
      font-family: sans-serif;
      font-weight: 400;
      color: #999999;
    }

    .search-box {
      margin-top: 20px;
      margin-bottom: 40px;
      display: flex;
      align-items: center;

      .text-1 {
        font-size: 14px;
        font-family: sans-serif;
        font-weight: 400;
        color: #666666;
      }

      .input-box {
        input {
          padding: 0 15px;
          display: inline-block;
          width: 256px;
          height: 36px;
          background: #ffffff;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #d5d8de;
        }
      }

      button {
        margin-left: 10px;
        display: inline-block;
        width: 128px;
        height: 36px;
        background: #2E4C87;
        border-radius: 4px 4px 4px 4px;
        font-size: 14px;
        font-family: sans-serif;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }

  .ctx-box {
    background: #fff;
    margin-top: 20px;
    padding: 20px;

    .list {
      border: 1px solid #eee;

      .list-title {
        text-align: center;
        height: 48px;
        background: #f9f9f9;
        background: #f5f5f5;
        padding: 15px 0;

        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;

        .title-1 {
          width: 100px;
          text-align: center;
        }

        .title-2 {
          // width: 150px;
          flex: 2;
        }

        .title-3 {
          width: 120px;
        }

        .title-4 {
          width: 120px;
        }

        .title-5 {
          width: 120px;
        }

        .title-6 {
          width: 120px;
        }

        .title-7 {
          width: 120px;
        }
        .title-8 {
          width: 200px;
        }
      }

      .item {
        border-bottom: 1px solid #eee;

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
          color: #666666;
        }

        .item-detail {
          padding: 15px 0;
          font-family: OPPOSans, OPPOSans;
          // font-weight: bold;
          font-size: 14px;
          color: #666666;

          .box-select {
            width: 58px;
            width: 100px;
          }

          .box-image {
            img {
              width: 70px;
              height: 70px;
              margin-right: 10px;
              cursor: pointer;
            }

            /deep/ img {
              width: 70px;
              height: 70px;
              margin-right: 10px;
              cursor: pointer;
            }
          }

          .box-title {
            flex: 2;
            text-align: left;

            div {
              &:hover {
                color: #2E4C87;
              }
            }

            .goods-title {
              width: fit-content;
              cursor: pointer;
              // height: 40px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-line-clamp: 2;
            }

            .sku-info {
              width: fit-content;
              cursor: pointer;
              margin-top: 10px;
            }
          }

          .box-sku {
            width: 200px;
          }

          .box-unit-price {
            width: 120px;
            color: #2E4C87;
          }

          .box-number {
            width: 120px;
            display: flex;
            justify-content: center;
            align-items: center;

            input {
              width: 48px;
              height: 30px;
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
              width: 30px;
              height: 30px;
              border: 1px solid #d5d8de;
            }
          }

          .box-subtotal {
            width: 120px;
            color: #fc0d1b;
          }

          .box-desc {
            width: 200px;
          }

          .box-act {
            width: 120px;
            font-size: 16px;
            padding-left: 30px;

            div {
              & + div {
                margin-top: 10px;
              }

              span {
                cursor: pointer;

                &:hover {
                  color: #2E4C87;
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
  text-align: left;
  font-size: 14px;
  font-weight: normal;
  color: #666666;

  .goods-action {
    display: flex;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;

    img {
      width: 20px;
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
    font-size: 14px;
    color: #666666;
  }

  .delete-box {
    cursor: pointer;
    width: fit-content;

    span {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;

      &:hover {
        color: #2E4C87;
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
      font-size: 14px;
      color: #666666;

      &:hover {
        color: #2E4C87;
      }
    }
  }

  .total-number {
    width: fit-content;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;

    b {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #f13f17;
    }
  }

  .total-price {
    margin-left: 60px;
    margin-right: 60px;
    width: fit-content;

    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;

    b {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #f13f17;
    }
  }

  .btn-order {
    cursor: pointer;
    width: 191px;
    height: 46px;
    background: #2E4C87;

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
  color: #999999;

  b {
    color: #e6170b;
  }
}

.empty-wrap {
  margin-top: 80px;
  .empty-pic-box {
    img {
      width: 161px;
    }
  }
  .empty-text {
    margin: 39px 0 33px 0;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 16px;
    color: #333333;
  }
  .empty-btn {
    .btn {
      width: 191px;
      height: 46px;
      background: #2E4C87;
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
