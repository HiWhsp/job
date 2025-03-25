<template>
  <div class="page">
    <!-- 图片预览 -->
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->

    <div class="main-title">
      <span>订单详情</span>
      <button @click="$router.push('/order-list')">返回</button>
    </div>

    <div class="page-ctx">
      <div class="step-box">
        <div class="step-item active">
          <div class="step-number">
            <div class="step-line step-line-1"></div>
            <div class="step-num">1</div>
            <div class="step-line step-line-2"></div>
          </div>
          <div class="step-title">订购时间</div>
          <div class="step-date">{{ info.createdTime }}</div>
        </div>
        <div class="step-item" :class="{ active: info.orderStatus >= 3 }">
          <div class="step-number">
            <div class="step-line step-line-3"></div>
            <div class="step-num">2</div>
            <div class="step-line step-line-4"></div>
          </div>
          <div class="step-title">商品发货</div>
          <div class="step-date" style="visibility: hidden">-</div>
        </div>
        <div class="step-item" :class="{ active: info.orderStatus >= 5 }">
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
          <!--     3: "快递配送",
        4: "门店自取",
        5: "同城配送", -->

          <!-- v-if="peisong_type_text == '普通快递'" -->
          <div class="item">
            <div class="item-title">收货人信息</div>
            <div class="item-content">
              <div class="name">
                <span>收货人：</span>
                {{ shouhuoInfo.name || shouhuoInfo.firstName + ' ' + shouhuoInfo.lastName }}
              </div>
              <div class="phone">
                <span>手机号码：</span>
                {{ shouhuoInfo.phone }}
              </div>
              <div class="address">
                <span>详细地址：</span>
                {{ full_receive_address }}
              </div>
              <!-- <div class="address">
              <span>邮编：</span>
              {{ shouhuoInfo.postCode }}
            </div> -->
            </div>
          </div>

          <div class="item">
            <div class="item-title">支付及配送方式</div>
            <div class="item-content">
              <div class="date" v-if="is_finish_pay">
                <span>支付方式：</span>
                <span class="val"> Paypal </span>
              </div>

              <div class="date">
                <span>下单时间：</span>
                {{ orderObj.createdTime }}
              </div>

              <div class="pay-type">
                <span>配送方式：</span>
                {{ fahuoInfo.expressName || '' }} {{ fahuoInfo.expressOrder || '' }}
              </div>

              <!-- <div class="date" v-if="orderObj.peisong_time">
              <span>配送时间:</span>
              {{ orderObj.peisong_time }}
            </div> -->
            </div>
          </div>

          <div class="item" v-if="peisong_type_text == '上门自提'">
            <div class="item-title">取货人信息</div>
            <div class="item-content">
              <div class="name">
                <span>取货人：</span>
                {{ shouhuoInfo.name }}
              </div>
              <div class="phone">
                <span>手机号码：</span>
                {{ shouhuoInfo.phone }}
              </div>
            </div>
          </div>

          <div class="item" v-if="peisong_type_text == '上门自提'">
            <div class="item-title">厂家信息</div>
            <div class="item-content">
              <div class="phone">
                <span>联系方式：</span>
                {{ shequ.phone }}
              </div>
              <div class="address">
                <span>厂家地址：</span>
                {{ shequ.address }}
              </div>
            </div>
          </div>

          <!-- 转款凭证 -->
          <div class="item" v-if="is_xianxia">
            <div class="item-title">转账凭证</div>
            <div class="item-content">
              <div class="wuliu-name">
                <!-- <span>转账凭证：</span> -->

                <div class="pingzheng-box">
                  <div class="pingzheng-item" v-for="(item, index) in xianxia_imgs" :key="index">
                    <el-image style="width: 100px; height: 100px" :src="item" :preview-src-list="xianxia_imgs">
                    </el-image>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 物流信息 -->
          <div class="item" v-if="fahuo_info.company">
            <div class="item-title">发货信息</div>
            <div class="item-content">
              <div class="wuliu-name">
                <span>快递公司：</span>
                {{ fahuo_info.company }}
              </div>
              <div class="wuliu-code">
                <span>物流单号：</span>
                {{ fahuo_info.orderId }}
              </div>
            </div>
          </div>
          <!-- 物流信息 -->
          <div class="item" v-if="orderObj.remark">
            <div class="item-title">订单备注</div>
            <div class="item-content">
              <div class="wuliu-name">
                <span>备注：</span>
                {{ orderObj.remark }}
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
              <div class="date">{{ info.createdTime }}</div>
              <div class="order-code">
                订单号：
                <span>{{ info.orderNo }}</span>
              </div>
              <div class="order-state">{{ info.statusInfo }}</div>
            </div>
            <div class="info-good">
              <div class="list-good">
                <div class="item" v-for="(product_item, index) in info.products" :key="index">
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
                    </div>

                    <div class="box-sku">
                      <div class="goods-sku">{{ product_item.keyVals }}</div>
                    </div>
                    <div class="box-num">x {{ product_item.num }}</div>
                    <div class="box-price">{{ vuex_huobi }} {{ product_item.priceSale }}</div>
                  </div>

                  <div class="goods-action" v-if="info.orderStatus == 5">
                    <!-- <button v-if="!is_jifen_goods && item.allow_actions.allow_refund" class="btn-goods-action" @click="refundApply(item)">申请售后</button> -->
                    <!-- <button v-if="item.ifshouhou" class="btn-goods-action disabled">已售后</button> -->
                    <!-- <button v-if="item.allow_actions.allow_logistics" class="btn-goods-action" @click="toRoute(`/orderLogistics?orderId=${orderId}&logistics_id=${fahuo_id}`)">查看物流</button> -->
                    <button v-if="product_item.ifComment == 0" class="btn-goods-action"
                      @click="to_review(product_item)">
                      商品评价
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="info-heji">
              <!-- <div class="heji">合计： {{vuex_huobi}} {{ info.price }} 元</div> -->
              <div class="money-box">
                <div class="money-item">
                  <div class="label"></div>
                  <div class="value">共 <b class="count">{{ total_product_number }}</b> 件</div>
                </div>
                <div class="money-item">
                  <span class="label">商品总价：</span>
                  <div class="value">
                    <span class="money-num">{{ vuex_huobi }}{{ payInfo.goods }}</span>
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">满减：</span>
                  <div class="value">
                    <span class="money-num">{{ vuex_huobi }}{{ payInfo.foreignManjian }}</span>
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">运费：</span>
                  <div class="value">
                    <span class="money-num">{{ vuex_huobi }}{{ payInfo.foreignYunfei }}</span>
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


    <order_cancel_modal ref="order_cancel_modal" @confirm="emitConfirm" data-type="取消" />
    <order_delete_modal ref="order_delete_modal" @confirm="emitConfirm" data-type="删除" />
    <order_receive_modal ref="order_receive_modal" @confirm="emitConfirm" data-type="收货" />
    <order_refund_modal ref="order_refund_modal" @confirm="emitConfirm" data-type="售后" />

  </div>
</template>

<script>
import order_cancel_modal from "@/components/order/order_cancel_modal.vue"; //取消订单
import order_delete_modal from "@/components/order/order_delete_modal.vue"; //删除
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //收货
import order_refund_modal from "@/components/order/order_refund_modal.vue"; //售后

// import orderInfo from "@/components/order/orderInfo.vue"; //
import { mapState } from "vuex";

export default {
  name: "order-detail",
  components: {
    order_cancel_modal,
    order_delete_modal,
    order_receive_modal,
    order_refund_modal
    // orderInfo,
  },
  data() {
    return {
      id: this.$route.query.id,
      orderId: this.$route.query.id,
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
      //


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
  computed: {
    ...mapState(["defaultAvatar"]),
  },
  watch: {
    orderObj(data) {
      let { shouhuoInfo, status, pay_info, fahuo_info, peisong_type, shequ } = data;

      this.peisong_type = peisong_type;
      this.shequ = shequ;
      this.shouhuoInfo = shouhuoInfo;
      this.pay_info = pay_info;

      //订单状态码(-5待支付 -3售后处理中 -1无效 0待成团 2待发货 3待收货 4已收货)
      if (status != -5 && status != -1 && status != 0) {
        this.is_payed = true;
      }

      //配送方式
      let peisong_map = {
        1: "上门自提",
        2: "社区配送",
        3: "普通快递",
        4: "",
        5: "",
      };

      //社区购配送方式(1自提 2社区配送 3快递)

      this.peisong_type_text = peisong_map[peisong_type] || "";
      //门店配送订单需要显示配送员信息
      if (this.peisong_type_text == "同城配送") {
        this.is_mendian_peisong = true;
        this.peisong_info = fahuo_info;
      }

      //发货信息
      if (fahuo_info && fahuo_info.company) {
        this.fahuo_info = fahuo_info;
        this.is_fahuo = true; //已经发货
      }
    },
  },
  created() {
    this.setView();
  },
  methods: {
    emitConfirm() {
      this.setView();
    },
    setView() {
      this.query_order()
    },

    query_order() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_detail',
          id: this.id
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.info = data;
          let { payInfo, products, shouhuoInfo, fahuoInfo } = data;

          this.payInfo = payInfo;
          this.products = products;
          this.fahuoInfo = fahuoInfo;
          this.is_finish_pay = parseFloat(data.pricePayed) > 0;

          //
          this.shouhuoInfo = shouhuoInfo;
          if (shouhuoInfo) {
            let { country, province, city, area, address } = shouhuoInfo;
            this.full_receive_address = [country, province, city, area, address].filter(v => v).join(' ')
          }

          //
          //支付方式

          //凭证图片
          this.orderObj = data;
          this.detail = data;
        }
      });
    },
    to_review(item) {
      this.$router.push({
        path: '/order-review-submit',
        query: {
          orderId: this.orderId,
          inventoryId: item.id
        }
      });
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
  padding: 0;

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
      background: @theme;
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
  padding: 55px 0;

  .step-item {
    text-align: center;

    &.active {
      .step-number {
        .step-num {
          background: @theme;
          color: #fff;
        }

        .step-line {
          background: @theme;
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

        >div {
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

.order-product {}

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

    .btn-box {
      // margin-top: 10px;

      button {
        transition: 0.3s;
        min-width: 120px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 50px 50px 50px 50px;
        border: 1px solid @theme;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: @theme;

        &+button {
          margin-left: 20px;
        }

        &.btn-bg {
          background: @theme;
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

<style scoped lang="less" src="@/assets/h5css/shop/order-detail.less"></style>
<style scoped lang="less" src="@/assets/h5css/shop/orderInfo.less"></style>
