<template>
  <div class="order-list-wrap">
    <div v-for="(item, index) in list" :key="index" class="info-item">
      <div class="info-title">
        <div class="date">{{ item.created_at }}</div>
        <div class="order-code">
          订单号：
          <span>{{ item.order_no }}</span>
        </div>
        <div class="order-payType">
          {{
            item.jiesuan_type == 1 ? `货到付款 ${(item.jiesuan_days)}` : item.jiesuan_type == 2 ? `款到发货 ${(item.jiesuan_end_time)}` : ''
          }}
        </div>
        <div :class="'state-' + item.order_status" class="order-state">
          {{ orderStatusInfo(item.order_status) }}
        </div>
      </div>
      <div class="info-good">
        <div class="list-good">
          <div v-for="(product_item, product_index) in item.order_detail" :key="product_index" class="item-good flex">
            <div class="box-image cover" @click="mix_to_product(product_item)">
              <!-- <img :src="good.img" alt /> -->
              <el-image :src="product_item.material_coverurl_full">
                <div slot="error" class="image-slot">
                  <img :src="product_item.material_coverurl_full"/>
                </div>
              </el-image>
            </div>

            <div class="box-title">
              <div class="goods-title" @click="mix_to_product(product_item)">{{ product_item.material_name }}</div>
              <div class="goods-sku">规格：{{ product_item.guige }}</div>
            </div>
            <!--            <div class="box-sku">-->
            <!--              <div class="goods-sku">{{ product_item.keyVals }}</div>-->
            <!--            </div>-->
            <div class="box-num">
              {{ product_item.num }}
            </div>
            <div class="box-price">{{ vuex_huobi }} {{ product_item.single_price }}</div>
            <div class="box-price">{{ vuex_huobi }} {{ product_item.subtotal }}</div>
          </div>
        </div>
      </div>
      <div class="info-heji">
        <div class="heji">
          <div class="heji-num">
            共 <b>{{ item.count_goods }}</b> 个商品
          </div>
          <div class="heji-money">
            合计金额： <b>{{ item.all_price }} 元</b>
          </div>
        </div>

        <div class="btn-actions">
          <button class="btn-ripple fit-text " @click="toDetail(item)">
            订单详情
          </button>
          <button v-if="item.ifCancel == 1" class="btn-ripple fit-text btn-bg" @click="doCancel(item)">
            取消订单
          </button>
          <button v-if="item.order_status == 2" class="btn-ripple fit-text btn-bg" @click="doReceive(item)">
            发货
          </button>
          <!--          <button v-if="item.ifPay == 1" class="btn-ripple fit-text btn-bg" @click="doPay(item)">-->
          <!--            去支付-->
          <!--          </button>-->
          <button v-if="item.ifDel == 1" class="btn-ripple fit-text btn-bg" @click="doDelete(item)">
            删除订单
          </button>

          <button v-if="item.ifComment == 1" class="btn-ripple fit-text btn-bg" @click="doReview(item)">
            去评价
          </button>
          <button v-if="item.orderStatus >= 5 && item.ifComment != 1" class="btn-ripple fit-text btn-bg"
                  @click="doRefund(item)">
            售后
          </button>
          <!-- <button v-if="item.is_aa == 1" class="btn-ripple fit-text btn-bg" @click="toDetail(item)">
            查看物流
          </button> -->
        </div>
      </div>
    </div>

    <order_cancel_modal ref="order_cancel_modal" data-type="取消" @confirm="emitConfirm"/>
    <order_delete_modal ref="order_delete_modal" data-type="删除" @confirm="emitConfirm"/>
    <order_receive_modal ref="order_receive_modal" data-type="收货" @confirm="emitConfirm"/>
    <order_refund_modal ref="order_refund_modal" data-type="售后" @confirm="emitConfirm"/>

  </div>
</template>

<script>
import order from "@/shop-actions/order";

import order_cancel_modal from "@/components/order/order_cancel_modal.vue"; //取消
import order_delete_modal from "@/components/order/order_delete_modal.vue"; //删除
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //收货
import order_refund_modal from "@/components/order/order_refund_modal.vue"; //售后

import {mapState} from "vuex";

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
  computed: {
    orderStatusInfo() {
      return (status) => {
        switch (status) {
          case -1:
            return "取消";
          case 0:
            return "已下单"
          case 1:
            return "待支付";
          case 2:
            return "待发货";
          case 3:
            return "待收货";
          case 4:
            return "已支付";
          case 5:
            return "已完成(确认收货)";
        }
      }
    }
  },
  methods: {
    emitConfirm() {
      this.$emit('confirm')
    },

    toDetail(item) {
      // this.$router.push(`/order-detail?id=${item.id}`);
      this.toRoute({
        path: '/G_order_detail',
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
        path: '/orderSubmit',
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
    doReview(item) {
      this.$router.push({
        path: '/review-submit',
        query: {
          orderId: item.id,
          inventoryId: item.products[0].id
        }
      });
    },
    doRefund(item) {
      // this.$refs.order_refund_modal.init(item);

      this.toRoute({
        path: '/refundType',
        query: {
          orderId: item.id,
          invoiceType: item.id
        },
      })
    },


    updateView() {
      this.$parent.updateView();
    },

    //取消订单
    orders_qxOrder(orderId) {
      let order = this.list.find((v) => v.id == orderId);


      // order.orders_qxOrder({
      //   params: { orderId },
      //   success: () => {
      //     this.updateView();
      //   }
      // });
    },
    //删除订单
    orders_del(orderId) {
      order.orders_del({
        params: {orderId},
        success: () => {
          this.updateView();
        },
      });
    },
    //订单支付
    order_payment(orderId) {
      this.$router.push(`/orderSubmit?orderId=${orderId}`);
    },

    //订单确认收货
    order_qianshou(orderId) {
      let order = this.list.find((v) => v.id == orderId);
      this.$refs.order_receive_modal.showModal = true;
      this.$refs.order_receive_modal.order = order;
      //console.log("订单信息", { ...order });
    },

    //订单评价
    jump_pingjia(orderId) {
      this.$router.push(`/order-review-submit?orderId=${orderId}`);
    },
    //订单售后申请
    jump_shouhou(orderId) {
      this.$router.push(`/orderRefund?orderId=${orderId}`);
    },
    jump_order_detail(order) {

    },

    open_link(link) {
      window.open(link, "_blank");
    },
  },
};
</script>

<style lang="less" scoped>
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

    .order-name {
      font-weight: 500;
      font-size: 16px;
      color: #000000;

      img {
        width: 56px;
        height: 20px;
        margin-right: 10px;
      }
    }

    .order-payType {
      font-weight: 400;
      font-size: 14px;
      color: #FF0000;
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
        color: @theme;
        border-color: @theme;
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
        border: 1px solid @theme;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: @theme;

        & + button {
          margin-left: 20px;
        }

        &:hover {
          opacity: 0.7;
        }

        &.btn-bg {
          background: @theme;
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>

<style lang="less" scoped src="@/assets/h5css/shop/orderList.less"></style>
