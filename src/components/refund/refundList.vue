<template>
  <div class="order-list-wrap">
    <div class="info-item" v-for="(order, index) in list" :key="index">
      <div class="info-title">
        <div class="date">{{ order.dtTime }}</div>
        <div class="order-code">
          订单号：
          <span>{{ order.order_no }}</span>
        </div>
      </div>
      <div class="info-good">
        <div class="list-good">
          <div class="item-good">
            <div class="img-box">
              <img :src="order.products.image" alt />
            </div>
            <div class="title">{{ order.products.title }}</div>
            <div class="num">x {{ order.products.num }}</div>
            <div class="price">{{vuex_huobi}} {{ order.products.unit_price }}</div>
          </div>
        </div>
      </div>
      <div class="info-heji">
        <div class="btn-actions">
          <button class="order-detail" @click="$router.push(`/refundType?order_id=${order.order_id}&inventoryId=${order.inventoryId}`)">申请售后</button>
        </div>
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
.order-list-wrap {
  .info-item {
    border: 1px solid #cccccc;
    margin-bottom: 30px;
  }
  .info-title {
    .flex-between();
    height: 48px;
    padding: 0 15px;
    background: #f9f9f9;
    border-bottom: 1px solid #cccccc;

    .date {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #7d7d7d;
    }
    .order-code {
      flex: 2;
      text-align: left;
      padding-left: 20px;

      font-size: 14px;
      font-family: Microsoft YaHei;
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
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #999999;

      &.state2 {
        color: #4CA5E4;
        border-color: #4CA5E4;
      }
    }
  }
  .info-good {
    .list-good {
      .item-good {
        padding: 20px;
        border-bottom: 1px dashed #ccc;
        .flex();

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
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 20px;
          color: #333333;

          flex: 2;
        }
        .num {
          width: 100px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 20px;
          color: #999999;
        }
        .price {
          min-width: 100px;
          font-size: 16px;
          font-family: Microsoft YaHei;
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
    .flex-between();
    justify-content: flex-end;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;

    .order-detail {
      min-width: 96px;
      height: 30px;
      background: #4CA5E4;
      border: 1px solid #4CA5E4;
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
