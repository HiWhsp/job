<template>
  <div class="page">
    <div class="inner">
      <div class="page-title">支付结果</div>
      <div class="pay-info">
        <div class="img-box">
          <img v-if="payState == '支付成功' || payState == '提交成功'" src="@/static/prod/nonstandard_add_success.png" alt/>
<!--          <img v-else src="@/static/payment/pay-fail.png" alt/>-->
        </div>
        <div class="text-1">{{ payState }}</div>
        <div class="text-2" v-if="payState == '提交成功'">
          您的转账凭证已提交，请等待后台审核！
        </div>
        <div class="text-2">订单号：{{ info.orderNo }}</div>

        <div class="btns flex-center">
          <button class="btn-ripple fit-text btn-bg" @click="to_order()">
            查看订单
          </button>
          <button class="btn-ripple fit-text" @click="to_liulan()">
            继续浏览
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "order-pay-done",
  components: {},
  data() {
    return {
      id: this.$route.query.id || this.$route.query.orderId,
      payState: "",
      info: {},
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    to_order() {
      this.$router.push('/order-list')
    },
    to_liulan() {
      this.$router.push('/')
    },
    setView() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_detail',
          id: this.id
        },
      }).then((res) => {
        let {code, data, msg} = res;
        if (code == 200) {
          this.info = data;
          if (data.status_info == "待支付") {
            this.payState = "支付失败";
          } else if (data.status_info == "待审核") {
            this.payState = "提交成功";
          } else {
            this.payState = "支付成功";
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page-title {
  text-align: left;
  padding-bottom: 16px;
  border-bottom: 1px solid #d5d8de;

  font-family: Poppins, Poppins;
  font-size: 24px;
  color: #333333;
}


.page {
  background: #FFFFFF;
  text-align: center;
  font-size: 14px;
  width: 100%;

  .inner {
    width: @width;
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
        width: 80px;
      }
    }

    .text-1 {
      margin-top: 27px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 24px;
      color: #000000;
    }

    .text-2 {
      margin-top: 21px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
    }

    .btns {
      margin-top: 50px;

      button {
        width: 200px;
        height: 45px;
        background: #FFFFFF;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid @theme;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 17px;
        color: @theme;

        &.btn-bg {
          background: @theme;
          color: #FFFFFF;
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
