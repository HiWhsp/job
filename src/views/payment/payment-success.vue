<template>
  <div class="page">
    <pageBreadcrumb :option="nav_option" />
    <div class="inner w-1200">
      <div class="pay-info">
        <div class="img-box">
          <img v-if="payState == '支付成功' || payState == '提交成功'" src="@/static/payment/pay-succ.png" alt />
          <img v-else src="@/static/payment/pay-fail.png" alt />
        </div>
        <div class="text-1">{{ payState }}</div>
        <div class="text-2" v-if="payState == '提交成功'">
          您的转账凭证已提交，请等待后台审核！
        </div>
        <div class="text-2">订单编号：{{ info.orderNo || '无' }}</div>
        <div class="text-2">下单时间：{{ info.orderNo || '无' }}</div>
        <div class="text-2">支付方式：{{ info.orderNo || '无' }}</div>
        <div class="text-2">获得积分：{{ info.orderNo || '无' }}</div>
        <div class="btns flex-center">
          <button class="btn-ripple fit-text " @click="to_liulan()">
            继续购物
          </button>
          <button class="btn-ripple fit-text btn-bg" @click="to_order()">
            查看订单
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";

export default {
  name: "order-pay-done",
  components: {pageBreadcrumb},
  data() {
    return {
      id: this.$route.query.id || this.$route.query.orderId,
      payState: "",
      info: {},
    };
  },
  computed: {
    ...mapState([""]),
    nav_option() {
      let channelId_arr = this.$route.query.ids ? this.$route.query.ids.split('-') : []
      let channelId = channelId_arr.pop()
      console.log(channelId)

      let cate_info = this.vuexFlatCates.find(v => v.id == channelId) || {}

      let option = [
        { route : '/product-reserve', title: '预约产品'},
        { route: '', title: '提交' }
      ]
      console.log(option)
      return option
    },
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    to_order() {
      this.$router.push('/order-list')
    },
    to_liulan() {
      this.$router.push('/product-reserve')
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
        let { code, data, msg } = res;
        if (code == 200) {
          this.info = data;
          if (data.status_info == "待支付") {
            this.payState = "支付失败";
          } else if (data.status_info == "待审核") {
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
  font-weight: bold;
  font-size: 24px;
  color: #333333;
}


.page {
  background: #1D1D1D;
  text-align: center;
  font-size: 14px;
  padding-bottom: 100px;


  .inner {
    margin: 0 auto;
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
      color: #fff;
    }

    .text-2 {
      margin-top: 21px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 14px;
      color: #fff;
    }

    .btns {
      margin-top: 50px;

      button {
        width: 200px;
        height: 45px;
        background: #000;
        border: 1px solid #7B7B7B;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 17px;
        color: #fff;

        &.btn-bg {
          background: #DF1626;
          border: none;
          color: #FFFFFF;
        }

        &+button {
          margin-left: 16px;
        }
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/payment-success.less"></style>
