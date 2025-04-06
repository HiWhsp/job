<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item><img src="@/static/home/home.png" alt="">当前位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>下单结果</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="inner">
      <!--      <div class="page-title">支付结果</div>-->
      <div class="pay-info">
        <div class="img-box">
          <img v-if="payState == '支付成功' || payState == '提交成功'" src="@/static/prod/nonstandard_add_success.png"
               alt/>
          <!--          <img v-else src="@/static/payment/pay-fail.png" alt/>-->
        </div>
        <div class="text-1">{{ payState }}</div>
        <div class="text-2" v-if="payState == '提交成功'">
          您的转账凭证已提交，请等待后台审核！
        </div>
        <div class="text-2">订单编号：{{ info.orderNo }}</div>
        <div class="text-2">下单时间：{{ info.createdTime }}</div>
        <div class="text-2">支付方式：{{ info.payType }}</div>
        <div class="btns flex-center">
          <button class="btn-ripple fit-text " @click="to_liulan()">
            继续购物
          </button>
          <button class="btn-ripple fit-text btn-bg" @click="to_order()">
            查看订单
          </button>
        </div>

        <!-- 线下转款信息 -->
        <div class="xianxia-info" v-if="info.payType == 7">
          <div class="title">收款对公账户</div>
          <div class="info-item">
            <div class="info-label">收款单位名称：</div>
            <div class="info-val">{{ bankList[0].company }}
              <img src="@/static/order/copy.png" alt="" @click="copyText(bankList[0].company)"></div>
          </div>
          <div class="info-item">
            <div class="info-label">收款单位号码：</div>
            <div class="info-val">{{ bankList[0].bankAccount }}
              <img src="@/static/order/copy.png" alt="" @click="copyText(bankList[0].bankAccount)"></div>
          </div>
          <div class="info-item">
            <div class="info-label">开户银行：</div>
            <div class="info-val">{{ bankList[0].bankName }}
              <img src="@/static/order/copy.png" alt="" @click="copyText(bankList[0].bankName)"></div>
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
    this.getBankList();
  },
  methods: {
    // 获取线下卡列
    getBankList() {
      this.$api('pay_getOfflineBanks').then(res => {
        if (res.code == 200) {
          this.bankList = res.data
        }
      })
    },
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
          if (data.statusInfo == "待支付") {
            this.payState = "支付失败";
          } else if (data.statusInfo == "待审核") {
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

<style scoped lang="less" src="@/assets/h5css/shop/payment-success.less"></style>
