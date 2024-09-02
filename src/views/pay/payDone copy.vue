<template>
  <div class="page">
    <div class="inner">
      <div class="section-title">
        支付成功
      </div>
      <div class="pay-info">
        <!-- 成功 -->
        <div class="img-box">
          <img src="@img/pay-done.png" alt />
        </div>
        <div class="text-1">支付成功！</div>
        <div class="text-2">订单号：546456456123123</div>
        <!-- 操作按钮 -->
        <div class="bottom">
          <button class="tijiao" @click="$router.push('/order-detail?order_id=' + order_id)">查看订单</button>
          <button class="back" @click="$router.push('/category')">继续浏览</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import order from "@/shop-actions/order";

import { mapState } from "vuex";

export default {
  name: "order-pay-done",
  components: {},
  data() {
    return {
      order_id: this.$route.query.order_id,
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
      this.orders_detail(); //获取订单详情
    },

    //获取订单详情
    orders_detail() {
      order.orders_detail({
        params: {
          id: this.order_id,
        },
        success: (data) => {
          //console.log("orders_detail", data);
        },
      });
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
}

.section-title {
  text-align: left;
  padding-bottom: 16px;
  border-bottom: 1px solid #d5d8de;
  font-size: 24px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #333333;
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
  }

  .pay-info {
    margin-top: 50px;
    .img-box {
      img {
        width: 80px;
      }
    }
    .text-1 {
      margin: 20px 0;
      font-size: 24px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #000000;
    }
    .text-2 {
      font-size: 14px;
      font-family: SourceHanSansCN-Regular-, SourceHanSansCN-Regular;
      font-weight: normal;
      color: #000000;
    }
    .bottom {
      margin-top: 30px;
      .flex-center();
      button {
        width: 170px;
        height: 40px;
        background: #ffffff;
        border: 1px solid #cccccc;
        font-size: 14px;
        color: #7d7d7d;
        transition: 0.3s;
        border-radius: 4px 4px 4px 4px;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        &:hover {
          opacity: 0.8;
        }

        &.tijiao {
          margin-right: 30px;
          color: #ffffff;
          background: #4CA5E4;
        }

        &.back {
          border: 1px solid #4CA5E4;
          color: #4CA5E4;
        }
      }
    }
  }
}
</style>
