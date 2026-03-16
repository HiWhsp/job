<template>
  <div class="page">
    <!-- 图片预览 -->
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>-->
    <div class="page-title flex-between">
      <div class="flex-center">
        <!-- <img
          src="@img/my/nav-1.png"
          style="width: 15px; margin-right: 10px"
          alt=""
        />-->
        <span>Order Details</span>
      </div>
      <!-- <button @click="$router.push('/order-list')">返回</button> -->
    </div>

    <div class="page-ctx">
      <!-- <div class="step-box" v-if="info.statusInfo != '订单已取消'">
        <div class="step-item active">
          <div class="step-number">
            <div class="step-line step-line-1"></div>
            <div class="step-num"><img src="@img/order/detail1.png" alt=""></div>
            <div class="step-line step-line-2"></div>
          </div>
          <div class="step-title">商品下单</div>
          <div class="step-date">{{ info.createdTime }}</div>
        </div>
        <div class="step-item" :class="{ active: info.orderStatus >= 3 }">
          <div class="step-number">
            <div class="step-line step-line-3"></div>
            <div class="step-num">
              <img src="@img/order/detail2-act.png" v-if=" info.orderStatus >= 3 " alt="">
              <img src="@img/order/detail2.png" v-else alt="">
            </div>
            <div class="step-line step-line-4"></div>
          </div>
          <div class="step-title">商品发货</div>
          <div class="step-date">{{ info.fahuoInfo.fahuoTime }}</div>
        </div>
        <div class="step-item" :class="{ active: info.orderStatus >= 5 }">
          <div class="step-number">
            <div class="step-line step-line-5"></div>
            <div class="step-num">
               <img src="@img/order/detail3-act.png" v-if=" info.orderStatus >= 5 " alt="">
              <img src="@img/order/detail3.png" v-else alt="">
            </div>
            <div class="step-line step-line-6"></div>
          </div>
          <div class="step-title">商品收货</div>
          <div class="step-date">{{ info.shouhuoTime }}</div>
        </div>
      </div>
      <div class="step-box" v-else>
        <div class="step-item">
          <img src="@img/mine/delImg.png" alt="" />
          <div class="step-title">订单取消</div>
          <div class="step-date">{{ info.createdTime }}</div>
        </div>
      </div>-->

      <div class="base-ctx">
        <div class="base-title">Order Information</div>
        <div class="base-items">
          <div class="base-item">
            <div class="info-title">Consignee Information</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">Consignee：</div>
                <div class="val">
                  {{
                  shouhuoInfo.name ||
                  shouhuoInfo.firstName + " " + shouhuoInfo.lastName
                  }}
                </div>
              </div>
              <div class="info-item">
                <div class="label">Receiving phone number：</div>
                <div class="val">{{ shouhuoInfo.phone }}</div>
              </div>
              <div class="info-item">
                <div class="label">Shipping address：</div>
                <div class="val">{{ full_receive_address }}</div>
              </div>
            </div>
          </div>

          <div class="base-item">
            <div class="info-title">Payment and Delivery Methods</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">Payment method：</div>
                <div class="val">
                  <span v-if="payTypeText">{{ payTypeText }}</span>
                  <span v-else>-</span>
                </div>
              </div>
              <div class="info-item">
                <div class="label">Ordering time：</div>
                <div class="val">{{ info.createdTime }}</div>
              </div>
              <div class="info-item">
                <div class="label">Order numbe：</div>
                <div class="val">{{ info.orderNo }}</div>
              </div>
              <div class="info-item">
                <div class="label">Delivery method：</div>
                <div class="val">{{ '-' }}</div>
              </div>
            </div>
          </div>

          <div class="base-item" v-if="invioceJson && invioceJson.title">
            <div class="info-title">Invoice Information</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">Invoice title:</div>
                <div class="val">{{ invioceJson.title }}</div>
              </div>
              <div class="info-item">
                <div class="label">Taxpayer identification number:</div>
                <div class="val">{{ invioceJson.shibiema }}</div>
              </div>
              <div class="info-item">
                <div class="label">Registered address:</div>
                <div class="val">{{ invioceJson.companyAddress }}</div>
              </div>
              <div class="info-item">
                <div class="label">Registered phone:</div>
                <div class="val">{{ invioceJson.companyPhone }}</div>
              </div>
              <div class="info-item">
                <div class="label">Opening bank:</div>
                <div class="val">{{ invioceJson.bankName }}</div>
              </div>
              <div class="info-item">
                <div class="label">Bank account:</div>
                <div class="val">{{ invioceJson.bankNo }}</div>
              </div>
            </div>
          </div>

          <!-- 物流信息 -->
          <div class="base-item" v-if="fahuo_info.expressName">
            <div class="info-title">Logistics Information</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">Express company：</div>
                <div class="val">{{ fahuo_info.expressName }}</div>
              </div>
              <div class="info-item">
                <div class="label">Express number：</div>
                <div class="val">{{ fahuo_info.expressNo + fahuo_info.expressOrder }}</div>
              </div>
              <div class="info-item">
                <div class="label">Shipping time：</div>
                <div class="val">{{ fahuo_info.fahuoTime }}</div>
              </div>
            </div>
          </div>

          <!-- 物流信息 -->
          <div class="item" v-if="orderObj.remark">
            <div class="info-title">Order remarks</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">Remarks：</div>
                <div class="val">{{ orderObj.remark }}</div>
              </div>
            </div>
          </div>

          <div class="item" v-if="peisong_type_text == '上门自提'">
            <div class="info-title">Pickup person information</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">Pickup person：</div>
                <div class="val">{{ shouhuoInfo.name }}</div>
              </div>
              <div class="info-item">
                <div class="label">Receiving phone number：</div>
                <div class="val">{{ shouhuoInfo.phone }}</div>
              </div>
            </div>
          </div>

          <div class="item" v-if="peisong_type_text == '上门自提'">
            <div class="info-title">Factory information</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">Contact information：</div>
                <div class="val">{{ shequ.phone }}</div>
              </div>
              <div class="info-item">
                <div class="label">Factory address：</div>
                <div class="val">{{ shequ.address }}</div>
              </div>
            </div>
          </div>

          <!-- 转款凭证 -->
          <div class="item" v-if="is_xianxia">
            <div class="info-title">Transfer voucher</div>
            <div class="info-content">
              <div class="wuliu-name">
                <!-- <span>转账凭证：</span> -->
                <div class="pingzheng-box">
                  <div class="pingzheng-item" v-for="(item, index) in xianxia_imgs" :key="index">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="item"
                      :preview-src-list="xianxia_imgs"
                    ></el-image>
                  </div>
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
              Commodity Information
              <!-- <div class="date">{{ info.createdTime }}</div>
              <div class="order-code">
                订单号：
                <span>{{ info.orderNo }}</span>
              </div>
              <div class="order-state">{{ info.statusInfo }}</div>-->
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
                      <div
                        class="title"
                        @click="mix_to_product(product_item)"
                      >{{ product_item.title }}</div>
                      <div class="sku">{{ product_item.keyVals }}</div>
                    </div>
                    <!-- <div class="box-sku">
                      <div class="goods-sku">{{ product_item.keyVals }}</div>
                    </div>-->
                    <div class="box-unit-price">{{ vuex_huobi }} {{ product_item.priceSale }}</div>
                    <div class="box-num">x {{ product_item.num }}</div>
                    <div class="box-price">
                      {{ vuex_huobi }}
                      {{ product_item.priceSale * product_item.num }}
                    </div>
                  </div>
                  <!-- <div class="goods-action" v-if="info.orderStatus == 5">
                    <button
                      v-if="product_item.ifComment == 0"
                      class="btn-goods-action"
                      @click="to_review(product_item)"
                    >商品评价</button>
                  </div>-->
                </div>
              </div>
            </div>

            <div class="info-heji">
              <!-- <div class="heji">合计： {{vuex_huobi}} {{ info.price }} 元</div> -->
              <div class="money-box">
                <div class="money-item">
                  <div class="label"></div>
                  <div class="value">
                    <b class="count">{{ total_product_number }}</b> Pieces in Total
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">Total price of goods:：</span>
                  <div class="value">
                    <span class="money-num">{{ vuex_huobi }}{{ payInfo.goods }}</span>
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">Discount of coupon:：</span>
                  <span class="value">{{ vuex_huobi }}{{ payInfo.yhq || "" }}</span>
                </div>
                <div class="money-item" v-if="order_zhekou_bili != 10">
                  <span class="label">Discount of member:：</span>
                  <div class="value">
                    <span class="money-num">{{ order_zhekou_bili }}折</span>
                  </div>
                </div>
                <div class="money-item" v-if="order_zhekou_bili != 10">
                  <span class="label">Discount：</span>
                  <div class="value">
                    <span class="money-num">￥{{ payInfo.goods - order_zhekou_price || 0 }}</span>
                  </div>
                </div>

                <!-- <div class="money-item">
                  <span class="label">满减：</span>
                  <div class="value">
                    <span class="money-num"
                      >{{ vuex_huobi }}{{ payInfo.foreignManjian }}</span
                    >
                  </div>
                </div>-->

                <div class="money-item" v-if="payInfo.foreignYunfei > 0">
                  <span class="label">Freight:：</span>
                  <div class="value">
                    <span class="money-num">{{ vuex_huobi }}{{ payInfo.foreignYunfei }}</span>
                  </div>
                </div>

                <div class="money-item">
                  <span class="label">Total Amount：</span>
                  <div class="value">
                    <span class="money-num money-total">{{ vuex_huobi }}{{ info.price }}</span>
                  </div>
                </div>

                <!-- <div class="zhifufangshi-wrap" v-if="is_finish_pay">
                  <span>支付方式：</span>
                  <div class="zhifufangshi">
                    <div class="pay-item" v-if="payInfo.applet > 0">
                      <span class="pay-title">微信支付</span>
                      <span class="pay-money">
                        -{{ vuex_huobi }}{{ payInfo.applet }}</span
                      >
                    </div>
                    <div class="pay-item" v-if="payInfo.balance > 0">
                      <span class="pay-title">余额支付</span>
                      <span class="pay-money">
                        -{{ vuex_huobi }}{{ payInfo.balance }}</span
                      >
                    </div>
                    <div class="pay-item" v-if="payInfo.commission > 0">
                      <span class="pay-title">佣金支付</span>
                      <span class="pay-money">
                        -{{ vuex_huobi }}{{ payInfo.commission }}</span
                      >
                    </div>
                    <div class="pay-item" v-if="is_xianxia">
                      <span class="pay-title">线下支付</span>
                      <span class="pay-money">
                        -{{ vuex_huobi }}{{ payInfo.balance }}</span
                      >
                    </div>
                    <div class="pay-item" v-if="payInfo.jifen">
                      <span class="pay-title">积分抵现</span>
                      <span class="pay-money">
                        -{{ vuex_huobi }}{{ payInfo.jifen }}</span
                      >
                    </div>
                  </div>
                </div>-->

                <!-- <div class="money-item">
                      <span class="label">积分抵扣： </span>
                      <span class="money-num">- {{vuex_huobi}}{{ money_jifen_dixian }}</span>
                    </div>
                    <div class="money-item">
                      <span class="label">佣金： </span>
                      <span class="money-num">- {{vuex_huobi}}{{ money_yongjin_dixian }}</span>
                </div>-->

                <!-- <div class="zhifufangshi-wrap" v-if="isPayed">
                      <span>支付方式：</span>
                      <div class="zhifufangshi">
                        <div class="pay-item" v-for="(pay, index) in shiji_list_pay_info" :key="index">
                          <span class="pay-title">{{ pay.title }} </span>
                          <span class="pay-money">{{vuex_huobi}}{{ pay.money }}</span>
                        </div>
                      </div>
                </div>-->
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
              >Cancel Order</button>
              <button
                v-if="info.ifPay == 1"
                class="btn-ripple fit-text btn-bg-orange"
                @click="doPay(info)"
              >Payment</button>
              <button
                v-if="info.ifDel == 1"
                class="btn-ripple fit-text btn-bg"
                @click="doDelete(info)"
              >Delete Order</button>
              <button
                v-if="info.ifReceive == 1"
                class="btn-ripple fit-text btn-bg"
                @click="doReceive(info)"
              >Confirm Receipt</button>
              <!-- <button
                v-if="info.orderStatus >= 5"
                class="btn-ripple fit-text btn-bg"
                @click="doRefund(info)"
              >
                售后
              </button>-->
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

import { mapState } from "vuex";

export default {
  name: "order-detail",
  components: {
    order_cancel_modal,
    order_delete_modal,
    order_receive_modal,
    order_refund_modal
  },
  data() {
    return {
      id: this.$route.query.id,
      order_id: this.$route.query.id,
      info: {},
      payInfo: {},
      invioceJson: {}, //发票信息
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
      order_zhekou_bili: 10, //打几折
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
      pay_type: "" //支付方式
    };
  },
  computed: {
    ...mapState([""]),
    // 支付类型：0-待支付 1-微信支付 2-余额支付 3-佣金支付 4-线下支付 5-积分支付
    payTypeText() {
      const map = {
        0: "Pending payment",
        1: "WeChat Pay",
        2: "Balance",
        3: "Commission",
        4: "Offline payment",
        5: "Points payment"
      };
      const type = this.detail && this.detail.payType;
      return map[type] !== undefined ? map[type] : (type !== undefined && type !== null && type !== "" ? String(type) : "");
    }
  },
  watch: {
    orderObj(data) {
      let {
        shouhuoInfo,
        status,
        pay_info,
        fahuoInfo,
        peisong_type,
        shequ
      } = data;
      console.log(data, fahuoInfo, "xin");

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
        5: ""
      };

      //社区购配送方式(1自提 2社区配送 3快递)

      this.peisong_type_text = peisong_map[peisong_type] || "";
      //门店配送订单需要显示配送员信息
      if (this.peisong_type_text == "同城配送") {
        this.is_mendian_peisong = true;
        this.peisong_info = fahuo_info;
      }

      //发货信息
      if (fahuoInfo && fahuoInfo.expressName) {
        this.fahuo_info = fahuoInfo;
        this.is_fahuo = true; //已经发货
      }
    }
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
          id: this.id
        }
      }).then(res => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.info = data;
          this.payInfo = data.payInfo;
          this.products = data.products;
          this.products.forEach(v => {
            this.total_product_number += parseInt(v.num);
          });
          //
          this.fahuoInfo = data.fahuoInfo;
          this.invioceJson = data.invioceJson || {};
          this.is_finish_pay = parseFloat(data.pricePayed) > 0;
          //
          this.shouhuoInfo = data.shouhuoInfo;
          if (data.shouhuoInfo) {
            let { country, province, city, area, address } = data.shouhuoInfo;
            this.full_receive_address = [country, province, city, area, address]
              .filter(v => v)
              .join(" ");
          }
          //凭证图片
          this.orderObj = data;
          this.detail = data;
        }
      });
    },
    to_review(item) {
      this.$router.push({
        path: "/order-review-submit",
        query: {
          orderId: this.order_id,
          inventoryId: item.id
        }
      });
    },

    doCancel(item) {
      this.$refs.order_cancel_modal.init(item);
    },
    doPay(item) {
      this.$router.push({
        path: "/payment-methods",
        query: {
          id: item.id
        }
      });
    },
    doDelete(item) {
      this.$refs.order_delete_modal.init(item);
    },
    doReceive(item) {
      this.$refs.order_receive_modal.init(item);
    },
    doRefund(item) {
      console.log(item, "item");
      this.$router.push({
        path: "/refund-type",
        query: {
          orderId: this.id
          // inventoryId:item.
        }
      });
      // this.$refs.order_refund_modal.init(item);
    },

    emitConfirmDelete() {
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="less">
.page {
  .page-title {
    padding: 0 26px;
    text-align: left;
    height: 70px;
    line-height: 70px;
    background: #ffffff;
    font-size: 20px;
    font-family: Poppins, Poppins;
    font-weight: bold;
    color: #1e262e;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #00306B;
      color: #00306B;
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
          background: #fcb000;
          color: #fff;
        }

        .step-line {
          background: #fcb000;
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
        background: #f1f1f1;

        &.step-line-1 {
          visibility: hidden;
        }

        &.step-line-6 {
          visibility: hidden;
        }
      }

      .step-num {
        width: 58px;
        height: 58px;
        background: #fff5d6;
        border-radius: 50%;

        font-size: 20px;
        font-family: Poppins, Poppins;
        font-weight: 400;
        color: #505050;
        img {
          margin: 16px auto;
          width: 26px;
        }
      }
    }

    .step-title {
      margin-top: 14px;
      margin-bottom: 10px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
    }

    .step-date {
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 12px;
      color: #808080;
      height: 14px;
    }
  }
}

.base-ctx {
  margin-bottom: 24px;
  min-height: 156px;
  background: #ffffff;
  border: 1px solid #dedede;

  .base-title {
    text-align: left;
    padding-left: 24px;
    height: 65px;
    line-height: 65px;
    background: #f5f5f5;

    font-size: 20px;
    font-family: Poppins, Poppins;
    font-weight: bold;

    color: #333333;
  }

  .base-items {
    display: flex;
    flex-direction: column;
    // align-items: center;
    // justify-content: space-between;
    // padding: 20px 25px;

    .base-item {
      width: 100%;
      text-align: left;
      padding: 20px;
      border-bottom: 1px solid #dedede;
      &:last-child {
        border-bottom: none;
      }

      .info-title {
        font-family: Poppins, Poppins;
        font-weight: 600;
        font-size: 20px;
        color: #1e262e;
        margin-bottom: 10px;
      }

      .info-content {
        font-size: 20px;
        font-family: Poppins, Poppins;
        font-weight: 400;
        line-height: 30px;
        color: #5e5e5e;

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
            width: 308px;
            margin-right: 10px;
            text-align: right;
          }

          .val {
            flex: 1;
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
      color: #00306B;
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
        font-family: Poppins, Poppins;
        font-weight: bold;
        line-height: 24px;
        color: #00306B;

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
      border: 1px solid #e5e5e5;
      margin-bottom: 30px;
    }

    .info-title {
      height: 65px;
      line-height: 65px;
      padding: 0 20px;
      background: #f5f5f5;
      border-bottom: 1px solid #e5e5e5;

      font-size: 20px;
      font-family: Poppins, Poppins;
      font-weight: bold;
      color: #1f1f1f;

      .order-code {
        flex: 2;
        text-align: left;
        padding-left: 20px;
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
            width: 114px;
            height: 114px;
            cursor: pointer;
            border: 1px solid #f5f5f5;

            /deep/ img {
              width: 114px;
              height: 114px;
              object-fit: contain;
              object-fit: cover;
            }

            img {
              width: 114px;
              height: 114px;
              object-fit: contain;
              object-fit: cover;
            }
          }

          .box-title {
            flex: 1;
            text-align: left;
            padding-left: 12px;

            .title {
              font-family: Poppins, Poppins;
              font-weight: 400;
              font-size: 20px;
              color: #1e262e;
              line-height: 30px;

              &:hover {
                color: #00306B;
              }
            }
            .sku {
              margin-top: 20px;
              font-family: Poppins, Poppins;
              font-weight: 400;
              font-size: 20px;
              color: #5e5e5e;
              line-height: 28px;
            }
          }

          .box-sku {
            text-align: center;
            min-width: 200px;
          }

          .box-unit-price {
            width: 204px;
            font-family: Poppins, Poppins;
            font-weight: 600;
            font-size: 20px;
            color: #5e5e5e;
            line-height: 28px;
          }

          .box-num {
            width: 114px;
            font-family: Poppins, Poppins;
            font-weight: 600;
            font-size: 20px;
            color: #1e262e;
            line-height: 18px;
          }

          .box-price {
            width: 256px;
            font-family: Poppins, Poppins;
            font-weight: 600;
            font-size: 20px;
            color: #1e262e;
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
            background: #00306B;
            font-size: 14px;
            font-family: Poppins, Poppins;
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
    font-family: Poppins, Poppins;
    font-weight: 400;
    line-height: 20px;
    color: #666;

    .money-box {
      text-align: right;

      // .count {
      //   font-weight: bold;
      //   color: #00306B;
      // }

      .money-item {
        margin-bottom: 16px;
        display: flex;
        justify-content: flex-end;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 20px;
          color: #1f1f1f;
        }

        .value {
          min-width: 100px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 20px;
          color: #1f1f1f;
        }

        .money-num {
          // &.money-total {
          //   font-family: Poppins, Poppins;
          //   font-weight: bold;
          //   font-size: 20px;
          //   color: #00306B;
          // }
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
        height: 80px;
        width: 300px;
        background: #ffffff;
        border-radius: 10px;
        border: 1px solid #EC6A2B;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 24px;
        color: #EC6A2B;

        & + button {
          margin-left: 20px;
        }

        &.btn-bg {
          background: #EC6A2B;
          color: #fff;
        }

        &.btn-bg-orange {
          background: #EC6A2B;
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


<style scoped lang="less" src="@/assets/h5css/page/shipei2.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei4.less"></style>