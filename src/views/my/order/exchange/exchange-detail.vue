<template>
  <div class="page">
    <div class="main-title">
      <span>查看订单详情</span>
    </div>

    <div class="page-ctx">
      <div class="step-box">
        <div class="step-item active">
          <div class="step-number">
            <div class="step-line step-line-1"></div>
            <div class="step-num">1</div>
            <div class="step-line step-line-2"></div>
          </div>
          <div class="step-title">下单时间</div>
          <div class="step-date">{{ info.created_at }}</div>
        </div>
        <div class="step-item" :class="{ active: info.status >= 30 }">
          <div class="step-number">
            <div class="step-line step-line-3"></div>
            <div class="step-num">2</div>
            <div class="step-line step-line-4"></div>
          </div>
          <div class="step-title">商品发货</div>
          <div class="step-date" style="visibility: hidden">-</div>
        </div>
        <div class="step-item" :class="{ active: info.status >= 40 }">
          <div class="step-number">
            <div class="step-line step-line-5"></div>
            <div class="step-num">3</div>
            <div class="step-line step-line-6"></div>
          </div>
          <div class="step-title">订单收货</div>
          <div class="step-date" style="visibility: hidden">-</div>
        </div>
      </div>

      <div class="order-other">
        <div class="title">订单信息</div>
        <div class="other">
          <div class="item">
            <div class="item-title">收货人信息</div>
            <div class="item-content">
              <div class="name">
                <span>收货人：</span>
                {{ info.address_info ? info.address_info.receive_name : '' }}
              </div>
              <div class="phone">
                <span>手机号码：</span>
                {{ info.address_info ? info.address_info.receive_phone : '' }}
              </div>
              <div class="address">
                <span>详细地址：</span>
                {{ full_receive_address }}
              </div>
            </div>
          </div>

          <div class="item">
            <div class="item-title">支付信息</div>
            <div class="item-content">
              <div class="date">
                <span>支付方式：</span>
                <span class="val">{{ info.pay_type || '积分支付' }}</span>
              </div>

              <div class="date">
                <span>下单时间：</span>
                {{ info.created_at }}
              </div>
            </div>
          </div>

          <!-- 物流信息 -->
          <div class="item">
            <div class="item-title">物流信息</div>
            <div class="item-content">
              <div class="wuliu-name">
                <span>快递公司：</span>
                {{ info.fahuo_json.length ? info.fahuo_json.kuaidi_company : '无' }}
              </div>
              <div class="wuliu-code">
                <span>物流单号：</span>
                {{ info.fahuo_json.length ? info.fahuo_json.kuaidi_code : '无' }}
              </div>
              <div class="wuliu-code">
                <span>邮寄时间：</span>
                {{ info.updated_at || '无' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单商品信息 -->
      <div class="order-product order-info">
        <div class="order-list-wrap">
          <!-- 商品信息 -->
          <div class="info-item">
            <div class="info-title">
              <div class="date">{{ info.created_at }}</div>
              <div class="order-code">
                订单号：
                <span>{{ info.order_sn }}</span>
              </div>
            </div>
            <div class="info-good">
              <div class="list-good">
                <div class="item" v-for="(product_item, index) in info.orderdetail" :key="index">
                  <div class="item-good flex">
                    <div class="box-image cover">
                      <el-image :src="product_item.pdt_info.image">
                        <div slot="error" class="image-slot">
                          <img :src="product_item.pdt_info.image"/>
                        </div>
                      </el-image>
                    </div>

                    <div class="box-title">
                      <div class="title">
                        {{ product_item.pdt_info.title }}
                      </div>
                    </div>
                    <div class="box-price">{{ product_item.unit_jifen }}积分</div>
                    <div class="box-num">{{ product_item.num }}</div>
                    <div class="box-price">{{ product_item.jifenPrice }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="info-heji">
              <div class="money-box">
                <div class="money-item">
                  <div class="label"></div>
                  <div class="value">共 <b class="count">{{ info.orderdetail.length }}</b> 件</div>
                </div>
                <div class="money-item">
                  <span class="label">商品总价：</span>
                  <div class="value">
                    <span class="money-num">{{ vuex_huobi }}{{ 0 }}</span>
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">满减：</span>
                  <div class="value">
                    <span class="money-num">{{ vuex_huobi }}{{ 0 }}</span>
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">运费：</span>
                  <div class="value">
                    <span class="money-num">{{ vuex_huobi }}{{ info.yunfei }}</span>
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">总计：</span>
                  <div class="value">
                    <span class="money-num money-total">{{ vuex_huobi }}{{ info.price }}</span>
                  </div>
                </div>

                <div class="zhifufangshi-wrap" v-if="is_finish_pay">
                  <span>支付方式：</span>
                  <div class="zhifufangshi">
                    <div class="pay-item" v-if="payInfo.balance">
                      <span class="pay-title">余额支付</span>
                      <span class="pay-money"> -{{ vuex_huobi }}{{ payInfo.balance }}</span>
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
              <button v-if="info.ifCancel == 1" class="btn-ripple fit-text " @click="doCancel(info)">
                取消订单
              </button>
              <button v-if="info.ifPay == 1" class="btn-ripple fit-text btn-bg" @click="doPay(info)">
                去支付
              </button>
              <button v-if="info.ifDel == 1" class="btn-ripple fit-text btn-bg" @click="doDelete(info)">
                删除订单
              </button>
              <button v-if="info.ifReceive == 1" class="btn-ripple fit-text btn-bg" @click="doReceive(info)">
                确认收货
              </button>
              <button v-if="info.orderStatus >= 5" class="btn-ripple fit-text btn-bg" @click="doRefund(info)">
                售后
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// import orderInfo from "@/components/order/orderInfo.vue"; //
import {mapState} from "vuex";

export default {
  name: "exchangeDetail",
  data() {
    return {
      id: this.$route.query.id,
      order_id: this.$route.query.orderno,
      info: {},
      payInfo: {},
      shouhuoInfo: {}, //收货人信息
      fahuoInfo: {}, //发货信息
      total_product_number: 0,
      products: [],
      full_receive_address: '',
      //
      is_finish_pay: false,//
      //
      is_jifen_goods: false,

      orderObj: {}, //订单信息
      detail: {}, //订单信息

      pay_info: {}, //支付信息
      fahuo_info: {}, //发货信息
      peisong_info: {}, //门店配送信息
      peisong_type_text: "",
      peisong_type: "",

      is_payed: false, //是否已支付
      is_fahuo: false, //是否已发货
      is_mendian_peisong: false, //是否门店配送

      shequ: {},

      xianxia_imgs: [], //线下凭证信息
      is_xianxia: false, //是否线下转款
      pay_type: "", //支付方式
    };
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.query_order()
    },
    query_order() {
      this.$api({
        url: 'point_order_detail',
        method: 'post',
        data: {
          orderno: this.order_id
        },
      }).then((res) => {
        let {code, data, msg} = res;
        if (code == 200) {
          this.info = data;
          this.full_receive_address = `${this.info.address_info.province}-${this.info.address_info.city}-${this.info.address_info.dist}`
        }
      });
    },
    to_review(item) {
      this.$router.push({
        path: '/order-review-submit',
        query: {
          orderId: this.order_id,
          inventoryId: item.id
        }
      });
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
    doRefund(item) {
      this.$refs.order_refund_modal.init(item);
    },

    emitConfirmDelete() {
      this.$router.back()
    },

  },
};
</script>

<style scoped lang="less">
.page {


  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #00479D;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 24px;
  padding: 24px 32px;
  background: #fff;
}

.step-box {
  .flex-center();
  align-items: start;
  padding: 55px 0;

  .step-item {
    text-align: center;

    &.active {
      .step-number {
        .step-num {
          background: #00479D;
          color: #fff;
        }

        .step-line {
          background: #00479D;
        }
      }
    }

    .step-number {
      margin: 0 auto;
      .flex();

      .step-line {
        width: 147px;
        height: 2px;
        background: #f5f5f5;

        &.step-line-1 {
          visibility: hidden;
        }

        &.step-line-6 {
          visibility: hidden;
        }
      }

      .step-num {
        width: 44px;
        height: 44px;
        line-height: 44px;
        background: #EDF6FD;
        border-radius: 50%;

        font-size: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #999999;
      }
    }

    .step-title {
      margin-top: 14px;
      margin-bottom: 10px;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
    }

    .step-date {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 12px;
      color: #808080;
    }
  }
}

.order-other {
  margin-bottom: 24px;
  min-height: 156px;
  background: #ffffff;
  border: 1px solid #F5F5F5;

  .title {
    text-align: left;
    padding-left: 24px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    border-bottom: 1px solid #F5F5F5;

    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;

    color: #333333;
  }

  .other {
    // .flex-between();
    display: flex;
    flex-wrap: wrap;
    padding: 20px 25px;

    .item {
      flex: 1;
      width: 50%;
      margin-bottom: 10px;
      text-align: left;
      padding-right: 40px;

      // flex: 1;
      .item-title {
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #999999;
        color: #333;
        margin-bottom: 10px;
      }

      .item-content {
        min-height: 20px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #666;

        > div {
          margin-bottom: 5px;

          span {
            display: inline-block;
            // min-width: 80px;
          }
        }
      }
    }
  }
}

.order-product {
}

.pingzheng-box {
  .flex();
  flex-wrap: wrap;

  .pingzheng-item {
    border: 1px solid #eee;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}


.order-info {


  .money-yh {
    span {
      color: #04be02;
      font-weight: bold;
    }
  }

  .money-heji {
    span {
      color: #00479D;
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
        color: #00479D;

        .pay-title {
          margin-right: 5px;
        }

        .pay-money {
        }
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

      .date {
      }

      .order-code {
        flex: 2;
        text-align: left;
        padding-left: 20px;

        span {
        }
      }

      .order-state {
        // min-width: 96px;
        height: 30px;
        line-height: 30px;
        // background: #00479D;
        color: #00479D;
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
                color: #00479D;
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

          button {
          }

          .btn-goods-action {
            padding-left: 10px;
            padding-right: 10px;
            margin-left: 10px;
            min-width: 96px;
            height: 30px;
            background: #00479D;
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
        color: #00479D;
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

    .btn-box {
      // margin-top: 10px;

      button {
        transition: 0.3s;
        min-width: 120px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 50px 50px 50px 50px;
        border: 1px solid #00479D;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #00479D;

        & + button {
          margin-left: 20px;
        }

        &.btn-bg {
          background: #00479D;
          color: #FFF;
        }

        &:hover {
          opacity: 0.7;
        }
      }


    }
  }
}
</style>
