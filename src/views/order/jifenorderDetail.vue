<template>
  <div class="page">
    <div class="main-title">
      <span>订单详情</span>
      <button @click="$router.push('/order-list')">返回列表</button>
    </div>

    <div class="center">
      <orderInfo :order="orderObj" />
    </div>

    <div class="order-other">
      <div class="title">订单信息</div>
      <div class="other">
        <div class="item">
          <div class="item-title">收货人信息</div>
          <div class="item-content">
            <div class="name">
              <span>收货人：</span>
              {{shouhuo_info.name}}
            </div>
            <div class="phone">
              <span>手机号码：</span>
              {{shouhuo_info.phone}}
            </div>
            <div class="address">
              <span>详细地址：</span>
              {{shouhuo_info.address}}
            </div>
          </div>
        </div>
        <div class="item" v-if="is_payed">
          <div class="item-title">支付及送货方式</div>
          <div class="item-content">
            <div class="pay-type">
              <span>支付方式：</span>
              {{pay_info.weixin ? '微信支付' : ''}}
            </div>
            <!-- <div class="date">
              <span>付款时间:</span>2
            </div>
            <div class="peisong-type">
              <span>配送方式:</span>1
            </div>-->
          </div>
        </div>
      </div>

      <div class="other" v-if="is_fahuo">
        <div class="item">
          <div class="item-title">发货信息</div>
          <div class="item-content">
            <div class="name">
              <span>快递公司：</span>
              {{fahuo_info.company}}
            </div>
            <div class="物流单号">
              <span>手机号码：</span>
              {{fahuo_info.order_id}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import order from "@/shop-actions/order";

import orderInfo from "@/components/order/orderInfo.vue"; //
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    orderInfo,
  },
  data() {
    return {
      order_id: this.$route.query.order_id,
      orderObj: {}, //订单信息
      shouhuo_info: {}, //收货人信息
      pay_info: {}, //支付信息
      fahuo_info: {}, //发货信息
      is_payed: false, //是否已支付
      is_fahuo: false, //是否已发货
    };
  },
  computed: {
    ...mapState(["defaultAvatar"]),
  },
  watch: {
    orderObj(data) {
      let { shouhuo_info, status, pay_info,fahuo_info } = data;
      this.shouhuo_info = shouhuo_info;
      this.pay_info = pay_info;

      //订单状态码(-5待支付 -3售后处理中 -1无效 0待成团 2待发货 3待收货 4已收货)
      if (status != -5 && status != -1 && status != 0) {
        this.is_payed = true;
      }

      if(fahuo_info && fahuo_info.company) {
        this.fahuo_info = fahuo_info;
        this.is_fahuo = true;//已经发货
      }
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
          this.orderObj = data;
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

.page {
  padding-bottom: 80px;
  .main-title {
    .flex-between();
    margin-bottom: 20px;
    text-align: left;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 20px;
    color: #333333;

    button {
    }
  }
}

.order-other {
  min-height: 186px;
  background: #ffffff;
  border: 1px solid #cccccc;

  .title {
    text-align: left;
    padding-left: 20px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    border-bottom: 1px solid #ccc;

    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;

    color: #333333;
  }

  .other {
    .flex-between();
    padding: 20px 25px;

    .item {
      text-align: left;
      flex: 1;
      .item-title {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 20px;
        color: #333333;
        margin-bottom: 20px;
      }
      .item-content {
        min-height: 80px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #333333;

        > div {
          margin-bottom: 5px;
          span {
            display: inline-block;
            min-width: 80px;
          }
        }
      }
    }
  }
}
</style>
