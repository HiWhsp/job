<template>
  <div class="order-list-wrap">
    <div class="info-item" v-for="(item, index) in list" :key="index">
      <div class="info-title">
        <div class="date">{{ item.createdTime }}</div>
        <div class="order-code">
          订单号：
          <span>{{ item.orderNo }}</span>
        </div>
        <div class="order-state" :class="'state-' + item.orderStatus">
          {{ item.statusInfo }}
        </div>
      </div>
      <div class="info-good">
        <div class="list-good">
          <div class="item-good flex" v-for="(product_item, product_index) in item.products" :key="product_index">
            <div class="box-image cover" @click="mix_to_product(product_item)">
              <!-- <img :src="good.img" alt /> -->
              <el-image :src="product_item.image">
                <div slot="error" class="image-slot">
                  <img :src="product_item.image" />
                </div>
              </el-image>
            </div>

            <div class="box-title">
              <div class="goods-title" @click="mix_to_product(product_item)">{{ product_item.title }}</div>
              <div class="goods-sku">型号：{{ product_item.keyVals }}</div>
            </div>
            <div class="box-sku">
              <div class="goods-sku">{{ product_item.keyVals }}</div>
            </div>
            <div class="box-num">
              {{ product_item.num }}
            </div>
            <div class="box-price">{{ vuex_huobi }} {{ product_item.priceSale }}</div>
          </div>
        </div>
      </div>
      <div class="info-heji">
        <div class="heji">
          <div class="heji-num">
            共 <b>{{ item.count_goods }}</b> 个商品
          </div>
          <div class="heji-money">
            合计金额： <b>{{ item.price }} 元</b>
          </div>
        </div>

        <div class="btn-actions">
          <button class="btn-ripple fit-text " @click="toDetail(item)">
            订单详情
          </button>
          <button v-if="item.ifCancel == 1" class="btn-ripple fit-text btn-bg" @click="doCancel(item)">
            取消订单
          </button>
          <button v-if="item.ifPay == 1" class="btn-ripple fit-text btn-bg" @click="doPay(item)">
            去支付
          </button>
          <button v-if="item.ifDel == 1" class="btn-ripple fit-text btn-bg" @click="doDelete(item)">
            删除订单
          </button>
          <button v-if="item.ifReceive == 1" class="btn-ripple fit-text btn-bg" @click="doReceive(item)">
            确认收货
          </button>
          <button v-if="item.ifComment == 1" class="btn-ripple fit-text btn-bg" @click="doReview(item)">
            去评价
          </button>
          <button v-if="item.orderStatus >= 5" class="btn-ripple fit-text btn-bg" @click="doRefund(item)">
            售后
          </button>
          <!-- <button v-if="item.is_aa == 1" class="btn-ripple fit-text btn-bg" @click="toDetail(item)">
            查看物流
          </button> -->
        </div>
      </div>
    </div>

    <order_cancel_modal ref="order_cancel_modal" @confirm="emitConfirm" data-type="取消" />
    <order_delete_modal ref="order_delete_modal" @confirm="emitConfirm" data-type="删除" />
    <order_receive_modal ref="order_receive_modal" @confirm="emitConfirm" data-type="收货" />
    <order_refund_modal ref="order_refund_modal" @confirm="emitConfirm" data-type="售后"/>

  </div>
</template>

<script>
import order from "@/shop-actions/order";

import order_cancel_modal from "@/components/order/order_cancel_modal.vue"; //取消
import order_delete_modal from "@/components/order/order_delete_modal.vue"; //删除
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //收货
import order_refund_modal from "@/components/order/order_refund_modal.vue"; //售后

import { mapState } from "vuex";

export default {
  name: "orderList",
  components: {
    order_cancel_modal,
    order_delete_modal,
    order_receive_modal,
    order_refund_modal,
  },
  props: ["list"],
  data() {
    return {};
  },
  computed: {},
  methods: {
    emitConfirm() {
      this.$emit('confirm')
    },

    toDetail(item) {
      // this.$router.push(`/order-detail?id=${item.id}`);
      this.toRoute({
        path: '/order-detail',
        query: {
          id: item.id
        },
      })
    },
    doCancel(item) {
      this.$refs.order_cancel_modal.init(item)
    },
    doPay(item) {
      this.$router.push({
        path: '/payment-methods',
        query: {
          id: item.id
        }
      })
    },
    doDelete(item) {
      this.$refs.order_delete_modal.init(item)
    },
    doReceive(item) {
      this.$refs.order_receive_modal.init(item);
    },
    doReview(item) { },
    doRefund(item) {
      this.$refs.order_refund_modal.init(item);
    },


    updateView() {
      this.$parent.updateView();
    },

    //处理订单行为
    handleOrderAction(action, order_id, order) {

      let fahuo_id = order.fahuo_id || "";
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
      } else if (name == "评价") {
        this.jump_pingjia(order_id);
      } else if (name == "申请售后") {
        this.jump_shouhou(order_id);
      } else if (name == "查看物流") {
        this.$router.push(
          `/orderLogistics?order_id=${order_id}&logistics_id=${fahuo_id}`
        );
      } else if (name == "售后") {
        this.$router.push(`/refundFeedback?order_id=${order_id}`);
      }
    },

    //取消订单
    orders_qxOrder(order_id) {
      let order = this.list.find((v) => v.id == order_id);


      // order.orders_qxOrder({
      //   params: { order_id },
      //   success: () => {
      //     this.updateView();
      //   }
      // });
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
      let order = this.list.find((v) => v.id == order_id);
      this.$refs.order_receive_modal.showModal = true;
      this.$refs.order_receive_modal.order = order;
      //console.log("订单信息", { ...order });
    },

    //订单评价
    jump_pingjia(order_id) {
      this.$router.push(`/order-review-submit?order_id=${order_id}`);
    },
    //订单售后申请
    jump_shouhou(order_id) {
      this.$router.push(`/orderRefund?order_id=${order_id}`);
    },
    jump_order_detail(order) {

    },

    open_link(link) {
      window.open(link, "_blank");
    },
  },
};
</script>

<style scoped lang="less">
.goods-sku {
  margin: 15px 0;
}

.check-url {
  // margin: 15px 0;

  span {
    cursor: pointer;
    display: inlin-block;
    padding: 2px 4px;
    background: coral;
    color: #fff;
  }
}

.order-list-wrap {
  .info-item {
    border: 1px solid #e5e5e5;
    margin-bottom: 30px;
  }

  .info-title {
    .flex-between();
    height: 48px;
    padding: 0 15px;
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;

    .date {
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }

    .order-code {
      flex: 2;
      text-align: left;
      padding-left: 20px;

      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;

      span {
        color: #333333;
      }
    }

    .order-state {
      padding: 3px 6px;
      // border: 1px solid #ccc;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;

      // 待付款
      &.state--5 {
        //background: #ff4c29;
        //border-color: #ff4c29;
        color: #EA3200;
      }

      &.state-2 {
        color: #A66600;
        border-color: #A66600;
      }
    }
  }

  .info-good {
    .list-good {
      .item-good {
        padding: 20px;
        border-bottom: 1px solid #e5e5e5;

        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 14px;
        color: #333333;

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


          .goods-title {
            width: fit-content;
            cursor: pointer;

            &:hover {
              color: #A66600;
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
          font-weight: bold;
          font-size: 14px;
          color: #333;
        }
      }
    }
  }

  .info-heji {
    padding: 15px;
    border-top: 1px solid #e5e5e5;
    .flex-between();
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;

    .heji {
      .flex();
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;

      .heji-num {
        margin-right: 30px;

        b {
          color: #EA3200;
        }
      }

      .heji-money {
        b {
          color: #EA3200;
        }
      }
    }

    .btn-actions {
      button {
        transition: 0.3s;
        min-width: 120px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #A66600;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #A66600;

        &+button {
          margin-left: 20px;
        }

        &:hover {
          opacity: 0.7;
        }

        &.btn-bg {
          background: #A66600;
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/orderList.less"></style>
