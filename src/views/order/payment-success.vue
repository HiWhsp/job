<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item><img alt="" src="@/static/home/home.png">当前位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>下单结果</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="inner">
      <!--      <div class="page-title">支付结果</div>-->
      <div class="pay-info">
        <div class="img-box">
          <img alt
               src="@/static/prod/nonstandard_add_success.png"/>
          <!--          <img v-else src="@/static/payment/pay-fail.png" alt/>-->
        </div>
        <div class="text-1">{{ payState }}</div>
<!--        <div v-if="payState == '提交成功'" class="text-2">-->
<!--          您的转账凭证已提交，请等待后台审核！-->
<!--        </div>-->
        <div class="text-2">订单编号：{{ info.order_no }}</div>
        <div class="text-2">下单时间：{{ info.created_at }}</div>
        <div class="text-2">支付方式：{{ info.pay_type == 1 ? '对公转账（含税）' : '银行卡转款（不含税）' }}</div>
        <div class="btns flex-center">
          <button class="btn-ripple fit-text " @click="to_liulan()">
            继续购物
          </button>
          <button class="btn-ripple fit-text btn-bg" @click="to_order()">
            查看订单
          </button>
        </div>

        <!-- 线下转款信息 -->
        <div v-if="info.pay_type == 1" class="xianxia-info">
          <div class="title">收款对公账户</div>
          <div class="info-item">
            <div class="info-label">收款单位名称：</div>
            <div class="info-val">{{ info.pay_json.company_name }}
              <img alt="" src="@/static/order/copy.png" @click="copyText(info.pay_json.company_name)"></div>
          </div>
          <div class="info-item">
            <div class="info-label">收款单位号码：</div>
            <div class="info-val">{{ info.pay_json.account }}
              <img alt="" src="@/static/order/copy.png" @click="copyText(info.pay_json.account)"></div>
          </div>
          <div class="info-item">
            <div class="info-label">开户银行：</div>
            <div class="info-val">{{ info.pay_json.bank }}
              <img alt="" src="@/static/order/copy.png" @click="copyText(info.pay_json.bank)"></div>
          </div>
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
      bankList: []
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
    copyText(text) {
      let input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message.success('复制成功');
      input.remove();
    },
    to_order() {
      this.$router.push('/order-list')
    },
    to_liulan() {
      this.$router.push('/')
    },
    setView() {
      this.$api({
        url: 'orderDetail',
        method: 'post',
        data: {
          order_id: this.id
        },
      }).then((res) => {
        let {code, data, msg} = res;
        if (code == 200) {
          this.info = data.order_info;
          this.payState = "恭喜您下单成功！";
          // if (data.statusInfo == "待支付") {
          //   this.payState = "支付失败";
          // } else if (data.statusInfo == "待审核") {
          //   this.payState = "提交成功";
          // } else {
          //   this.payState = "支付成功";
          // }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page-title {
  text-align: left;
  padding-bottom: 16px;
  border-bottom: 1px solid #d5d8de;

  font-family: Poppins, Poppins;
  font-size: 24px;
  color: #333333;
}

.nav-bar {
  margin-bottom: 20px;

  img {
    width: 14px;
    margin-right: 10px;
  }
}

.page {
  text-align: center;
  font-size: 14px;

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
      margin-top: 6px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 14px;
      color: #000;
    }

    .btns {
      margin-top: 20px;

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

    // 线下转款信息
    .xianxia-info {
      margin: 36px auto;
      padding: 12px 24px;
      width: 400px;
      background: #FEF8EE;
      border: 1px solid #F1E2CA;

      .title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 18px;
        color: #000000;
        text-align: left;
      }

      .info-item {
        .flex();
        align-items: flex-start;

        .info-label {
          width: 110px;
          line-height: 32px;
          padding-right: 10px;
          font-size: 14px;
          font-family: Roboto, Roboto;;
          font-weight: 400;
          color: #333;
          text-align: right;
        }

        .info-val {
          display: flex;
          align-items: center;
          line-height: 32px;
          font-size: 14px;
          font-family: Roboto, Roboto;;
          font-weight: 400;
          color: #000;

          img {
            width: 12px;
            height: 12px;
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }
    }

  }
}
</style>

<style lang="less" scoped src="@/assets/h5css/shop/payment-success.less"></style>
