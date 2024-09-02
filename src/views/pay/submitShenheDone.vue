<template>
  <div class="page">
    <PopKefu ref="PopKefu"/>
    <div class="inner">
      <div class="pay-info">
        <!-- 成功 -->
        <div class="img-box">
          <img src="@img/pay2/success.png" alt />
        </div>
        <div class="text-1">提交结果！</div>

        <div class="text-2">恭喜您提交成功！</div>
        <!-- 操作按钮 -->
        <div class="bottom">
          <button class="tijiao" @click="$router.push('/order-detail?order_id=' + order_id)">订单详情</button>
          <button style="margin-left: 30px;" class="back" @click="contact_kefu">联系客服审核</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PopKefu from "@/components/common/PopKefu.vue"; //提货码

import order from "@/shop-actions/order";

import { mapState } from "vuex";

export default {
  name: "order-pay-done",
  components: {
    PopKefu
  },
  data() {
    return {
      order_id: this.$route.query.order_id,
    };
  },
  computed: {
    ...mapState(["defaultAvatar", 'kefu_weixin']),
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


    contact_kefu() {
      this.$refs.PopKefu.show = true;
    }
  },
};
</script>


<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
}

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
