<template>
  <div class="meetingRegistration">
    <div class="top">
      <div class="topContent">
        <page_breadcrumb :option="nav_option" />
      </div>
    </div>
    <div class="bottom">
      <div class="container">
        <!-- 顶部选项卡 -->
        <div class="tabs">
          <div class="tab-item active">
            <div class="tab-circle">
              <img src="@/assets/img/pay/order.png" alt="" />
            </div>
            <div class="tab-text">确认订单信息</div>
          </div>
          <div class="tab-item active">
            <div class="tab-circle">
              <img src="@/assets/img/pay/card-a.png" alt="" />
            </div>
            <div class="tab-text">支付订单</div>
          </div>
        </div>

        <!-- 订单提交成功提示 -->
        <div class="success-notice">
          <div class="success-icon">
            <img src="@/assets/img/pay/success.png" alt="" />
          </div>
          <div class="success-content">
            <div class="success-title">订单提交成功，去付款~</div>
            <div class="success-subtitle">请在48小时内完成支付，超时后订单将自动取消</div>
          </div>
          <div class="success-amount">
            <span class="amount-label">应付金额：</span>
            <span class="amount-value">¥{{ amount }}</span>
          </div>
        </div>

        <!-- 订单详情 -->
        <div class="order-details">
          <div class="order-info">
            <div class="order-number">订单编号：{{ order_no }}</div>
            <div class="product-name">商品名称：{{ title }}</div>
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="payment-section">
          <div class="payment-title">支付方式</div>
          <div class="payment-methods">
            <div
              class="payment-method"
              :class="{ active: selectedPayment === 'alipay' }"
              @click="selectPayment('alipay')"
            >
              <div class="payment-radio">
                <div class="radio-dot" v-if="selectedPayment === 'alipay'"></div>
              </div>
              <div class="payment-icon alipay-icon">
                <img src="@/assets/img/pay/alipay.png" alt="支付宝" />
              </div>
              <div class="payment-text">支付宝支付</div>
            </div>
            <div
              class="payment-method"
              :class="{ active: selectedPayment === 'wechat' }"
              @click="selectPayment('wechat')"
            >
              <div class="payment-radio">
                <div class="radio-dot" v-if="selectedPayment === 'wechat'"></div>
              </div>
              <div class="payment-icon wechat-icon">
                <img src="@/assets/img/pay/wechat.png" alt="微信支付" />
              </div>
              <div class="payment-text">微信支付</div>
            </div>
          </div>
        </div>

        <!-- 支付按钮区域 -->
        <div class="payment-footer">
          <div class="payment-total">
            <span class="total-label">需付金额：</span>
            <span class="total-amount">¥{{ amount }}</span>
          </div>
          <button class="pay-button" @click="handlePay">立即支付</button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="15%" @close="dialogVisible = false">
      <div class="qrcode-title">请使用微信扫码支付</div>
      <img :src="wx_qrcode" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import page_breadcrumb from "@/components/page/page-breadcrumb.vue";
export default {
  name: "pay",
  components: {
    page_breadcrumb,
  },
  data() {
    return {
      dialogVisible: false,
      wx_qrcode: "",
      order_no: this.$route.query.order_no,
      amount: this.$route.query.amount,
      title: this.$route.query.title,
      selectedPayment: "alipay", // 默认选择支付宝
      formData: {
        name: "",
        phone: "",
        company: "",
        position: "",
      },
    };
  },
  destroyed() {
    clearInterval(this.timer);
  },
  computed: {
    nav_option() {
      let option = [
        {
          route: "/newsInsights",
          title: "产业活动",
          title2: "meetingRegistration",
        },
        {
          route: "",
          title: this.$route.meta.title,
          title: this.$route.meta.title,
        },
      ];
      return option;
    },
  },
  methods: {
    selectPayment(type) {
      this.selectedPayment = type;
    },
    handlePay() {
      // 这里可以调用支付接口
      if (!this.selectedPayment) {
        this.$message.warning("请选择支付方式");
        return;
      }
      if (!this.order_no) {
        this.$message.warning("订单号不能为空");
        return;
      }
      if (this.selectedPayment == "alipay") {
        // this.$api({
        //   url: "alipay",
        //   method: "post",
        //   data: {
        //     orderno: this.order_no,
        //   },
        // });
      } else {
        this.$api({
          url: "pay",
          method: "post",
          data: {
            order_no: this.order_no,
            type: 1,
          },
        }).then((res) => {
          if (res.code == 200) {
            this.dialogVisible = true;
            this.wx_qrcode = res.data.pay_qrcode;
            // 每10秒轮询一次
            this.timer = setInterval(() => {
              this.getPayStatus();
            }, 5000);
          }
        });
      }
    },
    getPayStatus() {
      this.$api({
        url: "checkPay",
        method: "get",
        data: { orderno: this.order_no, type: 1 },
      }).then((res) => {
        if (res.code == 200) {
          if (res.data.is_pay) {
            clearInterval(this.timer);
            localStorage.setItem("hexiaoma", res.data.hexiaoma);
            this.$message.success("支付成功");
            this.$router.push("/paySuccess");
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped src="./pay.less"></style>
