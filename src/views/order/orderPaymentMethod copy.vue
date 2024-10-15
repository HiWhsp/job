<template>
  <div class="page">
    <orderPayWxCode ref="orderPayWxCode" :payment_money="payment_money" />
    <orderPayWaiting ref="orderPayWaiting" />

    <div class="inner">
      <div class="order-info">
        <div class="left">
          <img src="@img/pay/create-success.png" alt="" />
        </div>
        <div class="right">
          <div class="section-1">
            <div class="text-1">订单支付信息</div>
            <div class="text-2">
              <div class="item-1">
                应付总额：<b>{{vuex_huobi}}{{ payment_money }}</b>
              </div>
              <!-- <div class="item-2">
                订单详情
              </div>   -->
            </div>
          </div>

          <div class="line"></div>

          <div class="section-2" v-if="mode != 'yue'">
            <div class="text-1">
              <div class="title">订单号：</div>
              <div class="val order-no">{{ order.order_id }}</div>
            </div>
            <div class="text-1">
              <div class="title">收货信息：</div>
              <div class="val">{{ shouhuoText }}</div>
            </div>
            <div class="text-1">
              <div class="title">商品名称：</div>
              <div class="val">
                <div class="list">
                  <div class="item" v-for="(item, index) in order.products" :key="index">
                    {{ item.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="section-2" v-else>
            <div class="text-1">商品名称：余额充值</div>
          </div>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="type">
        <div class="type-title">
          <div class="text">选择以下支付方式付款</div>
        </div>
        <div class="type-inner">
          <div class="select-1">
            <!-- <div class="title">支付平台</div> -->
            <div class="list">
              <button class="item" :class="payType == item.title ? 'active' : ''" v-for="(item, index) in list_pay_type" :key="index" @click="select_payType(item)">
                <img :src="item.icon" alt="" />
              </button>
            </div>
          </div>
        </div>

        <div class="yue-box" v-if="payType == '余额'">
          <div class="text-1">使用余额</div>
          <div class="text-2">您当前可用余额为 {{vuex_huobi}}{{ baseInfo.yue }}</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="bottom">
        <button class="back" @click="$router.back()">取消支付</button>
        <button class="tijiao" :disabled="disabledPay" @click="order_payment">立即支付</button>
      </div>
    </div>
  </div>
</template>

<script>
import orderPayWxCode from "@/components/order/orderPayWxCode.vue";
import orderPayWaiting from "@/components/order/orderPayWaiting.vue";
import order from "@/shop-actions/order";

import { mapState } from "vuex";

export default {
  name: "order-pay-type",
  components: {
    orderPayWxCode,
    orderPayWaiting,
  },
  data() {
    return {
      order_id: this.$route.query.order_id,
      mode: this.$route.query.mode == "yue" ? "yue" : "",
      type: this.$route.query.mode == "yue" ? 0 : 1,

      showModal_wx: false, //微信支付弹窗
      show_pop: false,
      payType: "微信", //支付方式

      order: {}, //订单信息

      pay_info: {}, //支付信息
      payment_products: [], //要支付的商品信息
      currency: "￥", //货币
      list: [], //订单的商品列表
      product_info: [], //订单对应的创建订单所需信息
      orderMoney: 0,

      timer: null,
    };
  },
  computed: {
    ...mapState(["baseInfo"]),

    list_pay_type() {
      let arr = [
        // {
        //   title: "佣金支付",
        //   icon: require("@img/pay/paytype-yue.png"),
        //   notYue: true,
        // },
        // { title: "支付宝", icon: require("@img/pay/paytype-zfb.png") },
        { title: "微信", icon: require("@img/pay/paytype-wx.png") },
      ];
      if (this.mode == "yue") {
        arr = arr.filter((v) => !v.notYue);
      }

      return arr;
    },

    //购物车商品总金额
    payment_money() {
      let money = 0;
      if (this.mode == "yue") {
        money = sessionStorage.getItem("yue_money");
      } else {
        if (this.order) {
          money = this.order.price;

          if (this.order.pay_info && this.order.pay_info.jifen) {
            money -= this.order.pay_info.jifen;
          }
        }
      }
      if (money) {
        money = (+money).toFixed(2);
      }

      return money;
    },

    shouhuoText() {
      let ret = "";
      if (this.order) {
        let shouhuo_info = this.order.shouhuo_info;
        if (shouhuo_info) {
          let { address, name, phone, postCode } = shouhuo_info;

          ret = `${name} ${phone} ${address} ${postCode}`;
        }
      }
      return ret;
    },

    //是否可以支付
    disabledPay() {
      let ret = false;
      if (this.payType == "余额") {
        if (this.baseInfo.yue < this.payment_money) {
          ret = true;
        }
      }

      return ret;
    },
  },
  watch: {
    order(data) {
      if (data && order.price_need_pay) {
        this.pay_info = data.pay_info;
      }
    },
  },
  created() {
    this.$store.dispatch("query_user");
    this.setView();
  },

  beforeDestroy() {
    this.clearTimer();
  },

  methods: {
    clearTimer() {
      //console.log("清除定时器");
      clearInterval(this.timer);
      this.timer = null;
    },
    showWaiting() {
      this.clearTimer();
      let that = this;

      this.$refs.orderPayWaiting.show = true;

      this.timer = setInterval(() => {
        this.$api("orders_detail", {
          id: this.order_id,
        }).then((res) => {
          let { code, data, msg} = res;
          if (data.status == 2 || data.status == 3) {
            that.toPaySuccess();
          }
        });
      }, 2000);
    },

    setView() {
      this.$api("orders_detail", {
        id: this.order_id,
      }).then((res) => {
        let { code, data, msg} = res;
        if (code == 200) {
          this.order = data;

          if (this.mode != "yue") {
            if (data.status_info != "待支付") {
              alertErr("当前订单不是待支付状态!");
              this.$router.push("/order-list");
            }
          }
        }
      });
    },

    //选择收货地址
    select_payType(item) {
      this.payType = item.title;
    },

    //确认
    order_payment() {
      //console.log(this.payType);
      let payType = this.payType;

      if (this.disabledPay) {
        return;
      }

      if (!payType) {
        alertErr("请选择支付方式");
        return;
      }

      // return;

      if (payType == "微信") {
        // this.orderPayWxJsapi(); //订单微信jsapi支付
        this.order_payment_wx_pc(); // *********
      } else if (payType == "余额") {
        this.orderPay_yue();
      } else if (payType == "货到付款") {
        this.orderPay_huodaofukuan();
      } else if (payType == "线下转款") {
        this.orderPay_xianxia();
      } else if (payType == "支付宝") {
        this.global_zfb(); // *********
      } else if (payType == "银行卡支付") {
        this.orderPay_xinyongka();
      } else if (payType == "PayPal") {
      }
    },

    order_payment_wx_pc() {
      this.$api("orders_wxScanCodePay", {
        order_id: this.order_id,
      }).then((res) => {
        //console.log("pc 微信扫码", res);
        if (res.code == 200) {
          // this.$refs.orderPayWxCode.qrcode = data.qrcode;
          // this.$refs.orderPayWxCode.showModal = true;
          this.showWaiting();
        }
      });
    },

    //Global 微信JSAPI支付 pay_wxJspay
    global_wx() {
      // this.$api("pay_wxJspay", {
      //   order_id: this.order_id,
      //   type: this.type, //类型：0-充值  1-订单支付
      // }).then((res) => {
      //   //console.log("Global 微信JSAPI支付 pay_wxJspay", res);
      //   let { code, data, msg} = res;

      //   if (code == 200) {
      //     // location.href = data.url;
      //     window.open(data.url, "_blank");
      //   } else {
      //   }
      // });

      this.$api("pay_qrCodePay", {
        order_id: this.order_id,
        type: this.type, //类型：0-充值  1-订单支付
        source: 0, //	类型：0-支付宝  1-微信
      }).then((res) => {
        //console.log("Global 支付宝H5支付 pay_aliH5pay", res);
        let { code, data, msg} = res;
        if (code == 200) {
          // location.href = data.url;
          window.open(data.url, "_blank");
        } else {
        }
      });
    },

    //Global 支付宝H5支付 pay_aliH5pay
    global_zfb() {
      // this.$api("pay_aliH5pay", {
      //   order_id: this.order_id,
      //   type: this.type, //类型：0-充值  1-订单支付
      // }).then((res) => {
      //   //console.log("Global 支付宝H5支付 pay_aliH5pay", res);
      //   let { code, data, msg} = res;
      //   if (code == 200) {
      //     // location.href = data.url;
      //     window.open(data.url, "_blank");
      //   } else {
      //   }
      // });

      this.$api("pay_qrCodePay", {
        order_id: this.order_id,
        type: this.type, //类型：0-充值  1-订单支付
        source: 1, //	类型：0-支付宝 1-微信
      }).then((res) => {
        //console.log("Global 支付宝H5支付 pay_aliH5pay", res);
        let { code, data, msg} = res;
        if (code == 200) {
          // location.href = data.url;
          window.open(data.url, "_blank");
        } else {
        }
      });
    },

    //订单微信jsapi支付
    orderPayWxJsapi() {
      let that = this;
      order.orders_wxPay({
        params: {
          order_id: this.order_id,
        },
        success: (data) => {
          //console.log("订单微信jsapi支付", data);
          let { timeStamp, nonceStr, signType, paySign } = data;

          wx.chooseWXPay({
            timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr, // 支付签名随机串，不长于 32 位
            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign, // 支付签名
            success: function (res) {
              that.toPaySuccess();
            },
            fail(err) {
              //console.log("支付失败了");
            },
          });
        },
        fail: (err) => {
          //console.log("支付失败", err);
        },
      });
    },

    //余额支付
    orderPay_yue() {
      this.$api("orders_yuePay", { order_id: this.order_id }).then((res) => {
        //console.log("余额支付", res);
        let { code, message } = res;

        if (code == 200) {
          this.toPaySuccess();
        } else {
          this.$router.push(`/payFail?order_id=${this.order_id}`);
        }
      });
    },

    //货到付款
    orderPay_huodaofukuan() {
      this.$api("orders_cashOnDelivery", { order_id: this.order_id }).then((res) => {
        //console.log("货到付款支付", res);
        let { code, message } = res;

        if (code == 200) {
          this.toPaySuccess();
        } else {
          this.$router.push(`/payFail?order_id=${this.order_id}`);
        }
      });
    },
    //线下转款
    orderPay_xianxia() {
      this.$api("orders_offlinePay", { order_id: this.order_id }).then((res) => {
        //console.log("货到付款支付", res);
        let { code, message } = res;

        if (code == 200) {
          this.toPaySuccess();
        } else {
          this.$router.push(`/payFail?order_id=${this.order_id}`);
        }
      });
    },
    //银行卡支付
    //https://stripe.com/docs/testing
    orderPay_xinyongka() {
      this.$api("pay_stripeOrder", {
        order_id: this.order_id,
        type: this.type,
      }).then((res) => {
        //console.log("银行卡支付", res);
        let { code, data, msg} = res;

        // return
        if (code == 200) {
          // location.href = data.url;
          window.open(data.url, "_blank");
        } else {
          this.$router.push(`/payFail?order_id=${this.order_id}`);
        }
      });
    },

    //支付成功操作
    toPaySuccess() {
      if (this.mode == "yue") {
        this.$router.push(`/yue`);
      } else {
        this.$router.push(`/payment-success?order_id=${this.order_id}`);
      }
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
}

.page {
  text-align: center;
  font-size: 14px;

  .inner {
    width: @width;
    margin: 0 auto;

    padding: 20px 0 80px;
  }

  .type {
    margin-bottom: 40px;
    text-align: left;
    min-height: 127px;
    background: #ffffff;
    border: 1px solid #cccccc;

    .type-title {
      padding-left: 20px;
      padding-right: 20px;
      height: 48px;
      line-height: 48px;
      background: #f9f9f9;
      border-bottom: 1px solid #cccccc;
      border-top: none;
      font-size: 14px;
      font-weight: bold;
      color: #333333;
    }

    .type-inner {
      padding: 30px 20px;

      .select-1 {
        // .flex();

        & + .select-1 {
          margin-top: 30px;
        }
        .title {
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: bold;
          color: #333333;
        }
        .list {
          button {
            margin-right: 20px;
            width: 160px;
            height: 60px;
            border: 1px solid #ccc;
            background: #ffffff;
            overflow: hidden;
            &.active {
              border: 1px solid #ff9312;
            }

            img {
              height: 30px;
              object-fit: contain;
              vertical-align: bottom;
            }
          }
        }
      }
    }
  }

  .main-title {
    .flex-between();
    margin-bottom: 30px;
    text-align: left;

    .left {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ff1312;

      .num {
        margin-left: 10px;
      }
    }
    .right {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 24px;
      color: #333333;

      .el-select {
        width: 250px;
      }
    }
  }

  .bottom {
    .flex();
    justify-content: flex-end;
    button {
      width: 200px;
      height: 40px;
      background: #ffffff;
      border: 1px solid #cccccc;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      transition: 0.3s;
      border-radius: 45px;
      &:hover {
        opacity: 0.8;
      }

      &.tijiao {
        margin-left: 50px;
        color: #ffffff;
        background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
        border-color: #ff3d00;

        &:disabled {
          filter: grayscale(100%);
          cursor: not-allowed;
        }
      }
    }
  }
}

.order-info {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #cccccc;
  .flex();
  align-items: flex-start;

  .left {
    img {
      width: 80px;
    }
  }
  .right {
    flex: 2;
    padding-left: 40px;
    text-align: left;
  }
  .section-1 {
    padding-top: 50px;
    .flex-between();

    .text-1 {
      font-size: 22px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #333333;
    }
    .text-2 {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 13px;
      color: #333333;

      b {
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 13px;
        color: #f13f17;
      }
    }
  }

  .line {
    margin: 30px 50px 30px 0;
    border-top: 1px solid #eeeeee;
  }
  .section-2 {
    .text-1 {
      .flex();
      align-items: flex-start;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 30px;

      .title {
        color: #666;
      }
      .val {
        color: #333333;
      }
      .order-no {
        color: #ff9312;
      }
    }
  }
}

.yue-box {
  padding: 20px;
  .text-1 {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 30px;
    color: #333333;
  }
  .text-2 {
    margin-top: 15px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 30px;
    color: #666666;
  }
}
</style>
