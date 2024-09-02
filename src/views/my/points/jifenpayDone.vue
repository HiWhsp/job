<template>
  <div class="page">
    <div class="inner">
      <div class="pay-info">
        <!-- 成功 -->
        <div class="img-box">
          <img src="@img/pay2/success.png" alt />
        </div>
        <div class="text-1">{{ payState }}！</div>
        <div class="text-2">恭喜您兑换成功！</div>
        <!-- 操作按钮 -->
        <div class="bottom">
          <button class="btn-ripple back" @click="$router.push('/order-list')">
            个人中心
          </button>
          <button class="btn-ripple tijiao" @click="$router.push('/pointsDetail')">
            我的积分
          </button>
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
      order_id: this.$route.query.order_id,
      payState: "",
    };
  },
  computed: {
    ...mapState(["defaultAvatar"]),
  },
  watch: {
    address(val) {
      //console.log("当前地址", val);
    },
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api("orders_detail", {
        id: this.order_id,
      }).then((res) => {
        let { code, data, msg} = res;
        if (code == 200) {
          this.detail = data;
          if (data.status >= 2) {
            this.payState = "兑换成功";
          } else {
            this.payState = "兑换失败";
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: center;
  font-size: 14px;

  .inner {
    width: @width;
    margin: 0 auto;
    min-height: 50vh;

    padding: 20px 0 80px;
  }

  .pay-info {
    margin-top: 50px;
    .img-box {
      img {
        width: 60px;
      }
    }
    .text-1 {
      margin: 20px 0;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 53px;
      color: #000000;
    }
    .text-2 {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 53px;
      color: #999999;
    }
    .bottom {
      margin-top: 60px;
      .flex-center();
      button {
        width: 170px;
        height: 40px;
        background: #ffffff;
        border: 1px solid #cccccc;
        font-size: 14px;
        color: #7d7d7d;

        transition: 0.3s;
        &:hover {
          opacity: 0.8;
        }

        &.tijiao {
          margin-left: 20px;
          color: #ffffff;
          background: #ff3d00;
          border-color: #ff3d00;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/jifen-payment-success.less"></style>
