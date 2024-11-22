<script>
export default {
  name: "status",
  data() {
    return {}
  },
  methods: {
    goUrl({url}) {
      this.$router.push({path: url})
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="main-title">
      <div class="left">我的积分</div>
    </div>
    <div class="content">
      <img src="@/assets/img/base/appointment/pay-success.png" alt="">
      <!--      <img src="@/assets/img/base/appointment/pay-error.png" alt="" v-if="option.status == 2">-->
      <p class="status-text">下单成功</p>
      <p class="status-detail">订单号 1234567777788888</p>
      <div class="btn-box">
        <div class="btn" @click="goUrl({url: '/exchangeOrder'})">查看订单</div>
        <div class="btn back" @click="goUrl({url: '/pointMall'})">继续浏览</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 50px 160px;
  background-color: #fff;

  .main-title {
    padding-bottom: 20px;
    border-bottom: 1px solid #D5D8DE;
    font-weight: 400;
    font-size: 24px;
    color: #333333;
  }

  .content {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    color: #333333;
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
