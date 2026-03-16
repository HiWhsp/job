<template>
  <div class="page">
    <div class="inner w-1400">
      <div class="pay-info">
        <div class="img-box">
          <img v-if="payState == '支付成功' || payState == '提交成功'" src="@img/payment/pay-succ.png" alt />
          <img v-else src="@img/payment/pay-fail.png" alt />
        </div>
        <div class="text-1">{{ payState }}</div>
        <div class="text-2" v-if="payState == '提交成功'">您的转账凭证已提交，请等待后台审核！</div>
        <div class="text-2">Order number：{{ info.orderNo }}</div>

        <div class="btns flex-center">
          <button class="btn-ripple fit-text btn-bg" @click="to_liulan()">Continue Shopping</button>
          <button class="btn-ripple fit-text" @click="to_order()">View Order</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "order-pay-done",
  components: {},
  data() {
    return {
      id: this.$route.query.id || this.$route.query.orderId,
      payState: "",
      info: {}
    };
  },
  computed: {
    ...mapState([""])
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    to_order() {
      this.$router.push("/order-list");
    },
    to_liulan() {
      this.$router.push("/");
    },
    setView() {
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
          if (data.statusInfo == "待支付") {
            this.payState = "Pending Payment";
          } else if (data.statusInfo == "待审核") {
            this.payState = "Submitted Successfully";
          } else {
            this.payState = "Successful";
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.page-title {
  text-align: left;
  padding-bottom: 16px;
  border-bottom: 1px solid #d5d8de;

  font-family: Poppins, Poppins;
  font-weight: bold;
  font-size: 24px;
  color: #333333;
}

.page {
  background: #ffffff;
  text-align: center;
  font-size: 14px;
  padding-bottom: 100px;

  .inner {
    // width: 100%;
    margin: 0 auto;
    min-height: 50vh;
    padding: 48px 0 80px;
    background: #fff;
  }

  .pay-info {
    margin-top: 50px;

    .img-box {
      img {
        width: 70px;
      }
    }

    .text-1 {
      margin-top: 27px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 24px;
      color: #1f1f1f;
    }

    .text-2 {
      margin-top: 21px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 16px;
      color: #1f1f1f;
    }

    .btns {
      margin-top: 50px;

      button {
        width: 300px;
        height: 80px;
        background: #ec6a2b;
        border-radius: 10px 10px 10px 10px;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 24px;
        color: #fff;

        &.btn-bg {
          background: #00306B;
          color: #ffffff;
        }

        & + button {
          margin-left: 16px;
        }
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/payment-success.less"></style>
