<template>
  <div class="order-list-wrap">
    <!-- 确认收货 -->
    <order_receive_modal ref="order_receive_modal" />

    <!-- 商品信息 -->
    <div class="info-item">
      <div class="info-title">
        <div class="date">{{ order.dtTime }}</div>
        <div class="order-code">
          订单号：
          <span>{{ order.order_id }}</span>
        </div>
        <div class="order-state">{{ order.status_info }}</div>
      </div>
      <div class="info-good">
        <div class="list-good">
          <div class="item" v-for="(product_item, index) in order.products" :key="index">
            <div class="item-good flex">
              <div class="box-image cover" @click="mix_to_product(product_item)">
                <!-- <img :src="item.image" alt /> -->
                <el-image :src="product_item.image">
                  <div slot="error" class="image-slot">
                    <img :src="product_item.image" />
                  </div>
                </el-image>
              </div>
              <div class="box-title">
                <div class="title" @click="mix_to_product(product_item)">
                  {{ product_item.title }}
                </div>
                <!-- <div class="guige" @click="mix_to_product(product_item)">
                  {{ product_item.key_vals }}
                </div> -->
              </div>
              <div class="box-sku">
                <div class="goods-sku">{{ product_item.keyVals }}</div>
              </div>
              <div class="box-num">x {{ product_item.num }}</div>
              <div class="box-price">{{vuex_huobi}} {{ product_item.priceSale }}</div>
            </div>

            <div class="goods-action" v-if="
              product_item.allow_actions.allow_logistics ||
              product_item.allow_actions.allow_review ||
              (!is_jifen_goods && product_item.allow_actions.allow_refund) ||
              product_item.ifshouhou
            ">
              <!-- <button v-if="!is_jifen_goods && item.allow_actions.allow_refund" class="btn-goods-action" @click="refundApply(item)">申请售后</button> -->
              <!-- <button v-if="item.ifshouhou" class="btn-goods-action disabled">已售后</button> -->
              <!-- <button v-if="item.allow_actions.allow_logistics" class="btn-goods-action" @click="toRoute(`/orderLogistics?order_id=${order_id}&logistics_id=${fahuo_id}`)">查看物流</button> -->
              <button v-if="product_item.allow_actions.allow_review" class="btn-goods-action"
                @click="to_review(product_item)">
                商品评价
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="info-heji">
        <!-- <div class="heji">合计： {{vuex_huobi}} {{ order.price }} 元</div> -->

        <div class="money-box">
          <div class="money-item">
            <div class="label"></div>
            <div class="value">共 <b class="count">{{ count_goods }}</b> 件</div>
          </div>
          <div class="money-item">
            <span class="label">商品总价：</span>
            <div class="value">
              <span class="money-num">{{vuex_huobi}}{{ money_goods }}</span>
            </div>
          </div>
          <div class="money-item">
            <span class="label">满减：</span>
            <div class="value">
              <span class="money-num">{{vuex_huobi}}{{ money_yunfei }}</span>
            </div>
          </div>
          <div class="money-item">
            <span class="label">运费：</span>
            <div class="value">
              <span class="money-num">{{vuex_huobi}}{{ money_yunfei }}</span>
            </div>
          </div>
          <div class="money-item">
            <span class="label">总计：</span>
            <div class="value">
              <span class="money-num money-total">{{vuex_huobi}}{{ money_order }}</span>
            </div>
          </div>

          <div class="zhifufangshi-wrap" v-if="shiji_list_pay_info.length">
            <span>支付方式：</span>
            <div class="zhifufangshi">
              <div class="pay-item" v-for="(pay, index) in shiji_list_pay_info" :key="index">
                <span class="pay-title">{{ pay.title }} </span>
                <span class="pay-money"> -{{vuex_huobi}}{{ pay.money }}</span>
              </div>
            </div>
          </div>

          <!-- <div class="money-item">
            <span class="label">优惠券： </span>
            <span class="money-num">- {{vuex_huobi}}{{ money_coupon }}</span>
          </div>
          <div class="money-item">
            <span class="label">积分抵扣： </span>
            <span class="money-num">- {{vuex_huobi}}{{ money_jifen_dixian }}</span>
          </div>
          <div class="money-item">
            <span class="label">佣金： </span>
            <span class="money-num">- {{vuex_huobi}}{{ money_yongjin_dixian }}</span>
          </div> -->

          <!-- <div class="zhifufangshi-wrap" v-if="isPayed">
            <span>支付方式：</span>
            <div class="zhifufangshi">
              <div class="pay-item" v-for="(pay, index) in shiji_list_pay_info" :key="index">
                <span class="pay-title">{{ pay.title }} </span>
                <span class="pay-money">{{vuex_huobi}}{{ pay.money }}</span>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- 订单操作 -->
    <div class="order-action-box">
      <div class="btn-box">
        <!-- <button class="order-action" @click="addGoodsToCart()">
              添加所有到购物车
            </button> -->
        <button class="order-action btn-ripple" :class="action.type" v-for="(action, index) in order.actions"
          :key="index" @click="handleOrderAction(action)">
          {{ action.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import order from "@/shop-actions/order";
import { mapState } from "vuex";
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //确认收货

export default {
  name: "order-info",
  components: {
    order_receive_modal,
  },
  props: ["order"],
  data() {
    return {
      order_id: this.$route.query.order_id,
    };
  },
  computed: {
    fahuo_id() {
      return this.order.fahuo_info?.fahuo_id || "";
    },

    pay_info() {
      return this.order.pay_info || {};
    },

    count_goods() {
      let count = 0;
      if (this.order.products?.length) {
        this.order.products.forEach((v) => {
          count += +v.num;
        });
      }

      return count;
    },

    //是否已支付
    isPayed() {
      // 订单状态码(-5待支付 -3售后处理中 -1无效 0待成团 2待发货 3待收货 4已收货)  只有-1 4 可以删除
      return this.order.status > 0;
    },

    //订单总金额
    money_order() {
      // return this.order.price || 0
      return (+(+this.money_goods + +this.money_yunfei)).toFixed(2);
    },

    //商品 金额
    money_goods() {
      let ret = 0;
      if (this.order && this.order.products) {
        this.order.products.forEach((v) => {
          if (this.currency == "积分") {
            ret += v.jifen;
          } else {
            ret += v.priceSale * v.num;
          }
        });
      }
      return (+ret).toFixed(2);
    },

    //运费 金额
    money_yunfei() {
      return this.order.yunfei || 0;
    },

    //合计 金额
    // money_heji() {
    //   let money_plus = +this.money_goods + +this.money_yunfei;
    //   let money_minus = +this.money_coupon + +this.money_yhm;

    //   debugger
    //   return (money_plus - money_minus).toFixed(2);
    // },

    //订单实付
    money_shifu() {
      return +this.order.price || 0;
    },

    //订单总计
    money_heji() {
      let total =
        +this.order.price -
        (+this.money_coupon || 0) -
        (+this.money_jifen_dixian || 0) -
        (+this.money_yongjin_dixian || 0);

      return total.toFixed(2);
    },

    //微信
    money_wx() {
      return this.pay_info.weixin || 0;
    },
    //支付宝
    money_zfb() {
      return this.pay_info.alipay || 0;
    },
    //优惠券
    money_coupon() {
      return this.pay_info.yhq || 0;
    },
    //积分抵扣
    money_jifen_dixian() {
      return this.pay_info.jifen || 0;
    },
    //佣金抵扣
    money_yongjin_dixian() {
      return this.pay_info.yue || 0;
    },
    //余额
    money_yue() {
      return this.pay_info.yue || 0;
    },

    //优惠码
    money_yhm() {
      return this.pay_info.yh_code || 0;
    },
    //货到付款
    money_daofu() {
      return this.pay_info.cashOnDelivery || 0;
    },
    //线下转款
    money_xianxia() {
      return this.pay_info.offlinePay || 0;
    },
    //信用卡
    money_visa() {
      return this.pay_info.stripe || 0;
    },

    //支付方式
    list_pay_info() {
      let ret = [
        { title: "优惠券", money: this.money_coupon },
        { title: "积分抵现", money: this.money_jifen_dixian },
        { title: "余额", money: this.money_yongjin_dixian },
        { title: "微信", money: this.money_wx },

        // { title: "支付宝", money: this.money_zfb },
        // { title: "余额", money: this.money_yue },

        // { title: "优惠码", money: this.money_yhm },
        // { title: "货到付款", money: this.money_daofu },
        // { title: "线下转款", money: this.money_xianxia },
        // { title: "信用卡", money: this.money_visa },
      ];
      return ret;
    },

    //实际支付方式
    shiji_list_pay_info() {
      return this.list_pay_info.filter((v) => v.money);
    },

    //是否积分商品
    is_jifen_goods() {
      return this.order.if_jifen == 1;
    },

    //商品是否可以售后
    enable_shouhou() {
      // 2待发货 3待收货 4已收货
      return this.order.status == 2 || this.order.status == 3 || this.order.status == 4;
    },
  },
  methods: {
    updateView() {
      this.$parent.setView();
    },

    //处理订单行为
    handleOrderAction(action) {
      let order_id = this.order_id;

      //console.log({ ...action });
      let name = action.name;
      if (name == "取消订单") {
        this.orders_qxOrder(order_id);
      } else if (name == "删除订单") {
        this.orders_del(order_id);
      } else if (name == "立即支付") {
        this.order_payment(order_id);
      } else if (name == "确认收货") {
        this.order_qianshou(order_id);
      } else if (name == "评价订单" || name == "评价") {
        this.jump_pingjia(order_id);
      } else if (name == "申请售后" || name == "售后") {
        this.jump_shouhou(order_id);
      } else if (name == "查看物流") {
        this.$router.push(
          `/orderLogistics?order_id=${order_id}&logistics_id=${this.fahuo_id}`
        );

        // window.open('https://www.kuaidi100.com/', '_blank')
      }
    },

    //取消订单
    orders_qxOrder(order_id) {
      order.orders_qxOrder({
        params: { order_id },
        success: () => {
          this.updateView();
        },
      });
    },
    //删除订单
    orders_del(order_id) {
      order.orders_del({
        params: { order_id },
        success: () => {
          this.updateView();
        },
      });
    },
    //订单支付
    order_payment(order_id) {
      this.$router.push(`/payment-methods?order_id=${order_id}`);
    },

    //订单确认收货
    order_qianshou(order_id) {
      // debugger
      // let order = this.list.find((v) => v.id == order_id);
      let order = this.order;
      order.id = order_id;
      this.$refs.order_receive_modal.showModal = true;
      this.$refs.order_receive_modal.order = order;
      // debugger
      //console.log("订单信息", { ...order });
    },

    //订单评价
    jump_pingjia(order_id) {
      this.$router.push(`/order-review-submit?order_id=${order_id}`);
    },
    //订单评价
    jump_shouhou(order_id) {
      // this.$router.push(`/orderRefund?order_id=${order_id}`);

      this.$router.push("/refundFeedback");
    },

    refundApply(item) {
      let order_id = this.$route.query.order_id;
      let inventoryId = item.id;

      this.$router.push(`/refundType?order_id=${order_id}&inventoryId=${inventoryId}`);
    },

    to_review(item) {
      //console.log("评价", { ...item });
      let order_id = this.$route.query.order_id;
      this.$router.push(`/order-review-submit?order_id=${order_id}&inventoryId=${item.id}`);
    },

    //单个商品添加到购物车
    singleGoodsToCart(item) {
      this.$api("gouwuche_add", {
        inventoryId: item.id,
        num: item.num,
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
        }
      });
    },

    //所有商品添加到购物车
    addGoodsToCart() {
      //console.log("添加");
      let promise_arr = [];
      this.order.products.forEach((v) => {
        let p = this.$api("gouwuche_add", {
          inventoryId: v.id,
          num: v.num,
        });

        promise_arr.push(p);
      });

      Promise.all(promise_arr).then((res) => {
        alertSucc("操作成功!");
      });
    },
  },
};
</script>

<style scoped lang="less">
.money-yh {
  span {
    color: #04be02;
    font-weight: bold;
  }
}

.money-heji {
  span {
    color: @theme;
    font-weight: bold;
  }
}

.zhifufangshi-wrap {
  margin-bottom: 0 !important;
  padding: 10px 0;
  width: 100%;
  border-top: 1px dashed #e5e5e5;
  .flex();
  justify-content: flex-end;

  .zhifufangshi {
    .flex();

    .pay-item {
      .flex();
      margin-left: 10px;

      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 24px;
      color: @theme;

      .pay-title {
        margin-right: 5px;
      }

      .pay-money {}
    }
  }
}

.order-list-wrap {
  .info-item {
    border: 1px solid #F5F5F5;
    margin-bottom: 30px;
  }

  .info-title {
    .flex-between();
    height: 48px;
    padding: 0 24px;
    background: #f9f9f9;
    border-bottom: 1px solid #F5F5F5;

    font-size: 14px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    .date {}

    .order-code {
      flex: 2;
      text-align: left;
      padding-left: 20px;

      span {}
    }

    .order-state {
      // min-width: 96px;
      height: 30px;
      line-height: 30px;
      // background: @theme;
      color: @theme;
      // color: #fff;
      font-size: 14px;
    }
  }

  .info-good {
    .list-good {
      .item {
        border-bottom: 1px solid #F5F5F5;

        &:last-child {
          border-bottom: none;
        }
      }

      .item-good {
        padding: 20px;
        border-bottom: 1px dashed #F5F5F5;

        &:last-child {
          border: none;
        }


        .box-image {
          width: 100px;
          height: 100px;
          cursor: pointer;
          border: 1px solid #F5F5F5;


          /deep/ img {
            width: 100px;
            height: 100px;
            object-fit: contain;
            object-fit: cover;
          }

          img {
            width: 100px;
            height: 100px;
            object-fit: contain;
            object-fit: cover;
          }
        }

        .box-title {
          flex: 1;
          text-align: left;
          padding-left: 40px;


          .title {
            width: fit-content;
            cursor: pointer;

            &:hover {
              color: @theme;
            }
          }
        }

        .box-sku {
          text-align: center;
          min-width: 200px;
        }

        .box-num {
          text-align: center;
          min-width: 200px;
        }

        .box-price {
          text-align: center;
          min-width: 200px;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #FF0000;
        }
      }

      .goods-action {
        .flex();
        justify-content: flex-end;
        padding: 10px;

        button {}

        .btn-goods-action {
          padding-left: 10px;
          padding-right: 10px;
          margin-left: 10px;
          min-width: 96px;
          height: 30px;
          background: @theme;
          font-size: 14px;
          font-family: Microsoft YaHei;
          color: #ffffff;
          // border-radius: 14px;
          transition: 0.3s;
          border-radius: 4px;

          &:hover {
            opacity: 0.8;
          }

          &.disabled {
            background: #e5e5e5;
          }
        }
      }
    }
  }
}

// 商品信息汇总和订单操作

.info-heji {
  background: #fafafa;
  padding: 24px 40px;
  border-top: 1px solid #F5F5F5;
  // .flex-between();
  align-items: flex-start;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 20px;
  color: #666;


  .money-box {
    text-align: right;

    .count {
      font-weight: bold;
      color: @theme;
    }

    .money-item {
      margin-bottom: 16px;
      display: flex;
      justify-content: flex-end;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
      }

      .value {
        min-width: 180px;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
      }

      .money-num {

        &.money-total {
          font-family: Arial, Arial;
          font-weight: bold;
          font-size: 20px;
          color: #FF0000;
        }
      }
    }
  }
}

.order-action-box {
  display: flex;
  justify-content: flex-end;
}

.btn-box {
  // margin-top: 10px;

  button {
    transition: 0.3s;
    margin-left: 15px;
    width: 104px;
    height: 32px;
    border-radius: 4px;

    &:hover {
      opacity: 0.7;
    }
  }

  .order-detail {
    background: #fff;
    border: 1px solid #cccccc;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;

    border: 1px solid #A66600;
    color: #A66600;
  }

  .order-action {
    background: #fff;
    border: 1px solid #cccccc;
    font-size: 14px;
    color: #7d7d7d;

    border: 1px solid @theme;
    color: @theme;

    &:hover {
      opacity: 0.8;
    }

    &.zhifu {
      background: @theme;
      border-color: @theme;
      color: #fff;
    }

    &.shanchu {
      background: @theme;
      border-color: @theme;
      color: #fff;
    }

    &.shouhuo {
      background: @theme;
      border-color: @theme;
      color: #fff;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/orderInfo.less"></style>
