<template>
  <div class="page">
    <!-- 图片预览 -->
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->
    <div class="page-title flex-between">
      <span>订单详情</span>
      <button @click="$router.push('/order-list')">返回</button>
    </div>

    <div class="page-ctx">
      <div class="base-ctx">
        <div class="base-title">订单信息</div>
        <div class="base-items">
          <div class="base-item">
            <div class="info-title">收货人信息</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">收货人：</div>
                <div class="val">
                  {{
                    shouhuoInfo.name ||
                    shouhuoInfo.firstName + " " + shouhuoInfo.lastName
                  }}
                </div>
              </div>
              <div class="info-item">
                <div class="label">手机号码：</div>
                <div class="val">{{ shouhuoInfo.phone }}</div>
              </div>
              <div class="info-item">
                <div class="label">详细地址：</div>
                <div class="val">{{ full_receive_address }}</div>
              </div>
            </div>
          </div>

          <div class="base-item">
            <div class="info-title">支付及配送方式</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">支付方式：</div>
                <div class="val" v-if="payInfo.ifPay">
                  <span>余额</span>
                </div>
                <div class="val" v-else>
                  <span>对公转账</span>
                </div>
              </div>
              <div class="info-item">
                <div class="label">下单时间：</div>
                <div class="val">{{ info.createdTime }}</div>
              </div>
              <div class="info-item">
                <div class="label">配送方式：</div>
                <div class="val">{{ peisong_type_text || "暂无配送方式" }}</div>
              </div>
              <div class="info-item" v-if="xianxia_imgs.length > 0">
                <div class="label">汇款截图：</div>
                <div class="val">
                  <el-image
                    v-for="(item, index) in xianxia_imgs"
                    :key="index"
                    style="width: 50px; height: 50px; margin-right: 5px"
                    :src="item"
                    :preview-src-list="[xianxia_imgs]"
                  >
                  </el-image>
                </div>
              </div>
            </div>
          </div>

          <div
            class="base-item back"
            v-if="['待审核', '待支付'].includes(info.statusInfo)"
          >
            <div class="info-title">收款对公账户</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">收款单位名称：</div>
                <div class="val">
                  这里展示收款方名称
                  <img src="@/assets/img/pay-method/copy.png" alt="" />
                </div>
              </div>
              <div class="info-item">
                <div class="label">收款单位号码：</div>
                <div class="val">
                  4205 0111 6297 0918 8188
                  <img src="@/assets/img/pay-method/copy.png" alt="" />
                </div>
              </div>
              <div class="info-item">
                <div class="label">开户银行：</div>
                <div class="val">
                  这里展示收款方名称
                  <img src="@/assets/img/pay-method/copy.png" alt="" />
                </div>
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
                <div
                  class="item"
                  v-for="(product_item, index) in info.products"
                  :key="index"
                >
                  <div class="item-good flex">
                    <div
                      class="box-image cover"
                      @click="mix_to_product(product_item)"
                    >
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
                      <!-- <div class="box-sku">
                        <div class="goods-sku">订货编码：UA199</div>
                      </div> -->
                      <div class="box-sku">
                        <div class="goods-sku">
                          产品编号：{{ product_item.keyVals }}
                        </div>
                      </div>
                      <!-- <div class="box-sku">
                        <div class="goods-sku">
                          需求描述: {{ product_item.remark }}
                        </div>
                      </div> -->
                    </div>
                    <div class="box-price">
                      {{ vuex_huobi }} {{ product_item.priceSale }}
                    </div>
                    <div class="box-num">{{ product_item.num }}</div>
                    <div class="box-price">
                      {{ vuex_huobi }} {{ product_item.priceSale }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="info-heji">
              <!-- <div class="heji">合计： {{vuex_huobi}} {{ info.price }} 元</div> -->
              <div class="money-box">
                <div class="money-item">
                  <div class="label"></div>
                  <div class="value">
                    共 <b class="count">{{ total_product_number }}</b> 件
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">商品总价：</span>
                  <div class="value">
                    <span class="money-num"
                      >{{ vuex_huobi }}{{ payInfo.goods }}</span
                    >
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">配送费：</span>
                  <div class="value">
                    <span class="money-num"
                      >{{ vuex_huobi }}{{ payInfo.foreignYunfei || 0 }}</span
                    >
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">总计应付：</span>
                  <div class="value">
                    <span class="money-num money-total"
                      >{{ vuex_huobi }}{{ info.price }}</span
                    >
                  </div>
                </div>
                <!-- <div class="zhifufangshi-wrap" v-if="is_finish_pay">
                  <span>支付方式：</span>
                  <div class="zhifufangshi">
                    <div class="pay-item" v-if="payInfo.balance">
                      <span class="pay-title">余额支付</span>
                      <span class="pay-money">
                        -{{ vuex_huobi }}{{ payInfo.balance }}</span
                      >
                    </div>
                  </div>
                </div> -->
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
              <button
                v-if="info.ifCancel == 1"
                class="btn-ripple fit-text"
                @click="doCancel(info)"
              >
                取消订单
              </button>
              <button
                v-if="info.ifPay == 1"
                class="btn-ripple fit-text btn-bg"
                @click="doPay(info)"
              >
                去支付
              </button>
              <button
                v-if="info.ifPay == 1 && vuex_user.staffType == 1"
                class="btn-ripple fit-text btn-bg"
                @click="doOfflinePay(info)"
              >
                上传支付凭证
              </button>
              <button
                v-if="info.ifDel == 1"
                class="btn-ripple fit-text btn-bg"
                @click="doDelete(info)"
              >
                删除订单
              </button>
              <button
                v-if="info.ifReceive == 1"
                class="btn-ripple fit-text btn-bg"
                @click="doReceive(info)"
              >
                确认收货
              </button>
              <!-- <button
                v-if="info.orderStatus >= 5"
                class="btn-ripple fit-text btn-bg"
                @click="doRefund(info)"
              >
                售后
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <order_cancel_modal
      ref="order_cancel_modal"
      @confirm="emitConfirm"
      data-type="取消"
    />
    <order_delete_modal
      ref="order_delete_modal"
      @confirm="emitConfirm"
      data-type="删除"
    />
    <order_receive_modal
      ref="order_receive_modal"
      @confirm="emitConfirm"
      data-type="收货"
    />
    <order_refund_modal
      ref="order_refund_modal"
      @confirm="emitConfirm"
      data-type="售后"
    />
    <xianxia_submit ref="xianxia" @confirm="emitConfirm"></xianxia_submit>
  </div>
</template>

<script>
import order_cancel_modal from "@/components/order/order_cancel_modal.vue"; //取消订单
import order_delete_modal from "@/components/order/order_delete_modal.vue"; //删除
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //收货
import order_refund_modal from "@/components/order/order_refund_modal.vue"; //售后

// import orderInfo from "@/components/order/orderInfo.vue"; //
import { mapState } from "vuex";
import xianxia_submit from "@/components/order/xianxia_submit.vue";

export default {
  name: "order-detail",
  components: {
    xianxia_submit,
    order_cancel_modal,
    order_delete_modal,
    order_receive_modal,
    order_refund_modal,
    // orderInfo,
  },
  data() {
    return {
      id: this.$route.query.id,
      order_id: this.$route.query.id,
      info: {},
      payInfo: {},
      shouhuoInfo: {}, //收货人信息
      fahuoInfo: {}, //发货信息
      total_product_number: 0,
      products: [],
      full_receive_address: "",
      //
      is_finish_pay: false, //
      //
      is_jifen_goods: false,
      //

      orderObj: {}, //订单信息
      detail: {}, //订单信息

      pay_info: {}, //支付信息
      fahuo_info: {}, //发货信息
      invioceJson: {}, //发票
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
    ...mapState([""]),
  },
  watch: {
    orderObj(data) {
      let { shouhuoInfo, payInfo, peisongType, shequ, offlineJson } = data;

      this.peisong_type = peisongType;
      this.shequ = shequ;
      this.shouhuoInfo = shouhuoInfo;
      this.pay_info = payInfo;
      offlineJson.forEach((item) => {
        this.xianxia_imgs.push(item.images);
      });
      //配送方式
      let peisong_map = {
        1: "快递配送",
        2: "上门自提",
      };

      this.peisong_type_text = peisong_map[peisongType] || "";
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
      this.query_order();
    },

    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_detail",
          id: this.id,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.info = data;

          this.payInfo = data.payInfo;
          this.products = data.products;
          this.fahuoInfo = data.fahuoInfo;
          this.invioceJson = data.invioceJson || {};
          this.is_finish_pay = parseFloat(data.pricePayed) > 0;
          //
          this.shouhuoInfo = data.shouhuoInfo;
          if (data.shouhuoInfo) {
            let { country, province, city, area, address } = data.shouhuoInfo;
            this.full_receive_address = [country, province, city, area, address]
              .filter((v) => v)
              .join(" ");
          }
          this.products.forEach((item) => {
            this.total_product_number += item.num;
          });

          //
          //支付方式

          //凭证图片
          this.orderObj = data;
          this.detail = data;
        }
      });
    },

    doCancel(item) {
      this.$refs.order_cancel_modal.init(item);
    },
    doPay(item) {
      let data_format = item.products.map((v) => ({
        title: v.title,
        image: v.image,
        inventoryId: v.id,
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
          from: "order",
        },
      });
    },
    doDelete(item) {
      this.$refs.order_delete_modal.init(item);
    },
    doReceive(item) {
      this.$refs.order_receive_modal.init(item);
    },
    doRefund(item) {
      this.$refs.order_refund_modal.init(item);
    },
    doOfflinePay(item) {
      this.$refs.xianxia.init(item);
    },
    emitConfirmDelete() {
      this.$router.back();
    },
  },
};
</script>

<style scoped lang="less">
.page {
  .page-title {
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
      background: #2e4c87;
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 55px 0;

  .step-item {
    text-align: center;

    &.active {
      .step-number {
        .step-num {
          background: #2e4c87;
          color: #fff;
        }

        .step-line {
          background: #2e4c87;
        }
      }
    }

    .step-number {
      margin: 0 auto;
      display: flex;
      align-items: center;

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
        background: #edf6fd;
        border-radius: 50%;

        font-size: 20px;
        font-family: sans-serif;
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

    .btn_cb {
      width: 60px;
      height: 20px;
      margin: 0 auto;
      font-size: 12px;
      color: #fff;
      line-height: 20px;
      background: #2e4c87;
      cursor: pointer;
    }

    .step-date {
      height: 20px;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 12px;
      color: #808080;
    }
  }
}

.base-ctx {
  margin-bottom: 24px;
  min-height: 156px;
  background: #ffffff;
  border: 1px solid #e5e5e5;

  .base-title {
    text-align: left;
    padding-left: 24px;
    height: 48px;
    line-height: 48px;
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;

    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;

    color: #333333;
  }

  .base-items {
    align-items: center;
    display: flex;
    gap: 120px;
    padding: 20px 25px;

    .base-item {
      margin-bottom: 30px;
      text-align: left;

      // flex: 1;
      .info-title {
        font-size: 14px;
        font-family: sans-serif;
        font-weight: 400;
        color: #999999;
        margin-bottom: 10px;
      }

      .info-content {
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

        .info-item {
          display: flex;
          margin-bottom: 5px;

          .label {
            margin-right: 10px;
            width: 70px;
            color: #666;
          }

          .val {
            flex: 1;
            color: #000;
          }
        }
      }
    }

    .back {
      padding: 16px 20px;
      background: #fffdf1;
      .info-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 18px;
        color: #000000;
      }
      .info-content {
        .info-item {
          .label {
            width: 112px;
            text-align: right;
            color: #000;
            font-size: 16px;
          }
          .val {
            font-size: 16px;
            color: #000;
            display: flex;
            align-items: center;
            img {
              margin-left: 5px;
              width: 12px;
              height: 12px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}

.order-product {
}

.pingzheng-box {
  display: flex;
  align-items: center;
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
      color: #2e4c87;
      font-weight: bold;
    }
  }

  .zhifufangshi-wrap {
    margin-bottom: 0 !important;
    padding: 10px 0;
    width: 100%;
    border-top: 1px dashed #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .zhifufangshi {
      display: flex;
      align-items: center;

      .pay-item {
        display: flex;
        align-items: center;
        margin-left: 10px;

        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 24px;
        color: #2e4c87;

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
      border: 1px solid #f5f5f5;
      margin-bottom: 30px;
    }

    .info-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 24px;
      background: #f9f9f9;
      border-bottom: 1px solid #f5f5f5;

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
        // background: #2E4C87;
        color: #2e4c87;
        // color: #fff;
        font-size: 14px;
      }
    }

    .info-good {
      .list-good {
        .item {
          border-bottom: 1px solid #f5f5f5;

          &:last-child {
            border-bottom: none;
          }
        }

        .item-good {
          padding: 20px;
          border-bottom: 1px dashed #f5f5f5;

          &:last-child {
            border: none;
          }

          .box-image {
            width: 70px;
            height: 70px;
            cursor: pointer;
            border: 1px solid #f5f5f5;

            /deep/ img {
              width: 70px;
              height: 70px;
              object-fit: contain;
              object-fit: cover;
            }

            img {
              width: 70px;
              height: 70px;
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
              color: #333;
              font-size: 16px;
              font-weight: 500;

              &:hover {
                color: #2e4c87;
              }
            }
            .box-sku {
              text-align: left;
              min-width: 200px;
              color: #999;
              font-size: 16px;
            }
          }

          .box-num {
            text-align: center;
            min-width: 160px;
          }

          .box-price {
            text-align: center;
            min-width: 160px;

            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 14px;
            color: #ff0000;
          }
        }

        .goods-action {
          display: flex;
          align-items: center;
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
            background: #2e4c87;
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
    border-top: 1px solid #f5f5f5;
    //   display: flex;
    align-items: center;
    justify-content: space-between;
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
        color: #2e4c87;
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
            color: #ff0000;
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
        min-width: 200px;
        height: 48px;
        background: #ffffff;
        border-radius: 5px;
        border: 1px solid #dedede;
        font-weight: 400;
        font-size: 18px;
        color: #666666;

        & + button {
          margin-left: 20px;
        }

        &.btn-bg {
          background: #2e4c87;
          border: 1px solid #2e4c87;
          color: #fff;
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
