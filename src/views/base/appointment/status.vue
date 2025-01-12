<script>
export default {
  name: "status",
  data() {
    return {
      option: {
        paymentType: '', // 支付方式 1个人预存 2团体预存 3个人信用支付 4团体信用支付 5微信支付 6支付宝
        status: '', // 支付状态 1成功 2失败
        preOrderDetail: {}
      }
    }
  },
  computed: {
    detail() {
      let paymentType = this.option.paymentType
      let status = this.option.status
      switch (paymentType) {
        case '1':
          return status == 1 ? '请下载预约单，打印后随样品一同寄送！' : '余额不足，请前往充值！'
        case '2':
          return status == 1 ? '请下载预约单，打印后随样品一同寄送！' : '请耐心等待团长审核！'
        case '3':
          return status == 1 ? '请下载预约单，打印后随样品一同寄送！' : '个人信用额度不足，请尽快进行线下结算！'
        case '4':
          return status == 1 ? '请下载预约单，打印后随样品一同寄送！' : '团体信用额度不足，请尽快进行线下结算！'
      }
    }
  },
  mounted() {
    this.option = this.$route.query;
    this.preOrderDetail = JSON.parse(localStorage.getItem('preOrderDetail')) || {};
  },
  methods: {
    goUrl(url) {
      this.$router.push({path: url})
    },
    downLoad() {
      this.$api({
        url: 'download_order',
        method: 'post',
        data: {
          orderno: this.preOrderDetail.payInfo.orderno
        }
      }).then(res => {
        if (res.code === 200) {
          window.open(res.data.url, "_blank")
        }
      }).catch(err => {
        this.$message.error('下载失败')
      })
    }
  }
}
</script>

<template>
  <div class="container main">
    <div class="content">
      <img src="@/assets/img/base/appointment/pay-success.png" alt="" v-if="option.status == 1">
      <img src="@/assets/img/base/appointment/pay-error.png" alt="" v-if="option.status == 2">
      <p class="status-text">{{ option.status == 1 ? '支付成功' : '支付失败' }}</p>
      <p class="status-detail">{{ detail }}</p>
      <div class="btn-box" v-if="option.status == 1">
        <div class="btn" @click="goUrl('/order')">订单详情</div>
        <div class="btn back" @click="downLoad()">下载预约单</div>
        <div class="btn" @click="goUrl('/order')">申请发票</div>
        <div class="btn" @click="goUrl('/analyze_list?type=523')">继续预约</div>
      </div>
      <div class="btn-box" v-else>
        <div class="btn back">立即充值</div>
        <div class="btn back">返回</div>
        <div class="btn">取消</div>
      </div>
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
