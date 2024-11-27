<script>
export default {
  name: "status",
  data() {
    return {
      option: {
        paymentType: '', // 支付方式 1个人预存 2团体预存 3个人信用支付 4团体信用支付 5微信支付 6支付宝
        status: '' // 支付状态 1成功 2失败
      }
    }
  },
  mounted() {
    this.option = this.$route.query
  },
  methods: {}
}
</script>

<template>
  <div class="container main">
    <div class="content">
      <img src="@/assets/img/base/appointment/pay-success.png" alt="">
      <p class="status-text">入驻申请提交成功</p>
      <p class="status-detail">我们会在1个工作日内联系您，请您耐心等待！</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 35px 0 50px;

  .content {
    background-color: #fff;
    height: 673px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  img {
    max-width: 320px;
    max-height: 225px;
  }

  .status-text {
    margin-top: 30px;
    font-weight: bold;
    font-size: 20px;
    color: #282828;
  }

  .status-detail {
    margin-top: 20px;
    font-weight: 400;
    font-size: 14px;
    color: #FF0000;
  }

  .btn-box {
    display: flex;
    align-items: center;

    .btn {
      cursor: pointer;
      width: 133px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 3px;
      border: 1px solid #00479D;
      font-weight: 400;
      font-size: 14px;
      color: #00479D;
      margin-right: 20px;
      margin-top: 50px;
    }

    .back {
      background-color: #00479D;
      color: #fff;
    }
  }
}
</style>
