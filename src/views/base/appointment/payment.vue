<script>
export default {
  name: "payment",
  data() {
    return {
      isShow: false,
      preOrderDetail: {},
    }
  },
  mounted() {
    this.preOrderDetail = JSON.parse(localStorage.getItem('preOrderDetail')) || {};
  },
  methods: {

  }
}
</script>

<template>
  <div class="container main">
    <div class="title">
      <span>下单：{{ preOrderDetail.title }}</span>
      <div class="money-info">
        <p>合计费用: <span>{{ vuex_huobi }}{{ preOrderDetail.priceList.total }}</span></p>
        <i class="el-icon-arrow-down" :class="{'hide': isShow}" @click="isShow = !isShow"></i>
      </div>
    </div>
    <div class="content">
      <div class="tit">
        <img src="@/assets/img/base/appointment/wx-icon.png" alt="">
        <span class="name">微信支付</span>
        <span>请您及时付款，以便订单尽快处理！</span>
      </div>
      <div class="code-wrap">
        <p>扫一扫付款（元）</p>
        <div class="flex">
          <div class="left">
            <span>{{ preOrderDetail.payInfo.paymoney }}</span>
            <img class="code" :src="preOrderDetail.payInfo.qrcode" alt="">
            <img class="info" src="@/assets/img/base/appointment/sao.png" alt="">
          </div>
          <div class="right">
            <img src="@/assets/img/base/appointment/wx-sao.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 25px 0 70px;

  .title {
    display: flex;
    justify-content: space-between;
    line-height: 89px;
    background: #00479D;
    border-radius: 4px;
    font-weight: bold;
    font-size: 24px;
    color: #FFFFFF;
    padding: 0 35px;

    .money-info {
      .flex();
      font-weight: 400;
      font-size: 16px;
      color: #fff;

      span {
        color: #fff;
      }

      i {
        margin-left: 10px;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        transition: all 0.5s ease-in-out;

        &.hide {
          transform: rotate(180deg);
          transition: all 0.5s ease-in-out;
        }
      }
    }
  }

  .content {
    margin-top: 20px;
    height: 673px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;

    .tit {
      margin-top: 37px;
      width: 1150px;
      height: 89px;
      background: #FFFFFF;
      border: 1px solid #E6E6E6;
      display: flex;
      align-items: center;
      padding-left: 22px;

      img {
        width: 38px;
        height: 34px;
      }

      span {
        margin-left: 10px;

        &:last-child {
          font-weight: bold;
          font-size: 18px;
          color: #333333;
        }

        &.name {
          font-weight: 400;
          font-size: 21px;
          color: #000000;
        }
      }
    }

    .code-wrap {
      margin-top: 75px;
      display: flex;
      flex-direction: column;

      p {
        padding-left: 80px;
      }

      .left {
        display: flex;
        flex-direction: column;
        align-items: center;

        span {
          font-weight: 400;
          font-size: 24px;
          color: #FF4000;
          line-height: 40px;
        }

        .code {
          width: 234px;
          height: 243px;
        }

        .info {
          width: 226px;
          height: 77px;
        }
      }

      .right {
        img {
          width: 279px;
          height: 341px;
        }
      }
    }
  }
}
</style>