<template>
  <div class="page">
    <div class="main-title">申请售后</div>

    <div class="page-ctx">
      <div class="payment-success-btn-wrap">
        <div class="payment-success-btn">
          <img src="@/assets/img/refund/payment-success.png" alt="" />
        </div>
      </div>
      <div class="success-title">申请成功</div>
      <div class="success-sub-title">已申请成功，请耐心等待平台审核</div>
      <div class="btn-wrap">
        <div class="left-btn btn">返回商城</div>
        <div class="right-btn btn" @click="onRouteTo()">查看详情</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "servicePage",
  components: {},
  data() {
    return {};
  },

  computed: {},

  created() {},

  methods: {
    onRouteTo() {
      let path;
      if (this.$route.query.status === "0") {
        path = "after-sale-order";
      } else if (this.$route.query.status === "1") {
        path = "after-sale-refund-return";
      } else if (this.$route.query.status === "2") {
        path = "after-sale-exchange-goods";
      } else {
        path = "after-sale-refund-detail";
      }
      console.log("path", path);
      this.$router.push({
        path,
      });
    },
  },
};
</script>


<style scoped lang="less">
.page {
  padding: 0;

  .main-title {
    margin-bottom: 20px;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    font-weight: bold;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    color: #333333;
  }

  .page-ctx {
    height: 711px;
    padding: 24px 32px;
    background: #fff;
  }
}

.payment-success-btn-wrap {
  display: flex;
  justify-content: center;
  margin-top: 112px;
  .payment-success-btn {
    width: 60px;
    height: 60px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.success-title {
  margin: 20px 0 0 0;
  text-align: center;
  font-size: 16px;
  color: #000000;
  line-height: 53px;
}

.success-sub-title {
  font-size: 14px;
  color: #999999;
  line-height: 30px;
  text-align: center;
}

.btn-wrap {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  gap: 20px;
  .btn {
    width: 170px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #ffffff;
    border: 1px solid #eeeeee;
    cursor: pointer;
  }
  .right-btn {
    background: #27417c;
    color: #fff;
  }
}
</style>
