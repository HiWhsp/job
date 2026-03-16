<template>
  <div class="service-list">
    <div class="service-item" v-for="(order, index) in list" :key="index">
      <div class="base-box flex">
        <div class="refund-type">
          {{ order.type_info }}
        </div>
        <div class="date">{{ order.dtTime }}</div>
        <div class="order-code">
          服务编码：
          <span>{{ order.sn }}</span>
        </div>
        <div class="order-state" :class="'state' + order.status">
          {{ order.status_info }}
        </div>
      </div>
      <div class="product-box">
        <div class="product-list">


          <div class="product-item flex">
            <div class="box-pic">
              <div class="img-box">
                <img :src="order.products.image" alt />
              </div>
            </div>
            <div class="box-title">
              <div class="title">{{ order.products.title }}</div>
              <div class="sku">{{ order.products.keyVals }}</div>
            </div>
            <div class="box-price">
              <div class="price">
                {{ order.is_jifen ? "积分" : "￥" }}
                {{ order.is_jifen ? order.products.jifen : order.products.priceSale }}
              </div>
            </div>
            <div class="box-num">
              <div class="num">x {{ order.products.num }}</div>
            </div>
            <div class="box-xiaoji">
              <div class="price">{{ vuex_huobi }} {{ order.products.priceSale * order.products.num }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="actions-box">
        <button class="btn btn-ripple" @click="$router.push(`/refund-service-detail?refund_id=${order.id}`)">售后详情</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "orderList",
  components: {},
  props: ["list"],
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>


<style scoped lang="less">
.service-list {
  .service-item {
    border: 1px solid #cccccc;
    margin-bottom: 30px;
  }

  .base-box {
    height: 48px;
    padding: 0 15px;
    background: #f9f9f9;
    border-bottom: 1px solid #cccccc;

    .refund-type {
      min-width: 80px;
      text-align: left;
      color: #00306B;
    }

    .date {
      font-size: 14px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      line-height: 20px;
      color: #7d7d7d;
    }

    .order-code {
      flex: 2;
      text-align: left;
      padding-left: 20px;

      font-size: 14px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      line-height: 20px;
      color: #7d7d7d;

      span {
        color: #333333;
      }
    }

    .order-state {
      padding: 3px 6px;
      border: 1px solid #ccc;
      font-size: 14px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      line-height: 20px;
      color: #505050;

      &.state2 {
        color: #00306B;
        border-color: #00306B;
      }
    }
  }


  .product-box {
    .product-list {
      .product-item {
        padding: 20px;
        border-bottom: 1px dashed #ccc;


        &:last-child {
          border: none;
        }

        .img-box {
          width: 100px;

          img {
            width: 100px;
            height: 100px;
          }
        }

        .title {
          text-align: left;
          padding-left: 20px;
          font-size: 14px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          line-height: 20px;
          color: #333333;

          flex: 2;
        }

        .num {
          width: 100px;
          font-size: 16px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          line-height: 20px;
          color: #505050;
        }

        .price {
          min-width: 100px;
          font-size: 16px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          line-height: 20px;
          color: #333333;
        }
      }
    }
  }

  .info-heji {
    padding: 15px;
    border-top: 1px solid #ccc;
      display: flex;
  align-items: center;
  justify-content: space-between;
    justify-content: flex-end;
    font-size: 14px;
    font-family: Poppins, Poppins;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;

    .order-detail {
      min-width: 96px;
      height: 30px;
      background: #00306B;
      border: 1px solid #00306B;
      font-size: 14px;
      color: #fff;
      transition: 0.3s;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
