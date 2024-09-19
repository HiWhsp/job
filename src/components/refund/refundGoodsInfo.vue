<template>
    <div class="goods-info">
        <div class="info-title">
            <div class="date">{{ order.dtTime }}</div>
            <div class="order-code">
                订单号：
                <span>{{ order.order_id }}</span>
            </div>
            <div class="order-state">{{ order.status_info }}</div>
        </div>
        <div class="info-good">
            <div class="list-good">
                <div class="item">
                    <div class="item-good">
                        <div class="img-box">
                            <img :src="refund_goods.image" alt/>
                        </div>
                        <div class="title">
                            {{ refund_goods.title }}
                            <div class="desc">型号：{{ refund_goods.keyVals }}</div>
                        </div>
                        <div class="num">
                            {{ refund_goods.num }}
                        </div>
                        <div class="price">
                            {{
                            currency
                            }}{{
                            currency != "积分"
                                ? refund_goods.priceSale
                                : refund_goods.jifen
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "refundGoodsInfo",
    props: ["order"],
    data() {
        return {};
    },
    computed: {
        //要售后的商品
        refund_goods() {
            let obj = {};
            if (this.order && this.order.products) {
                obj = this.order.products.find(
                    (v) => v.id == this.$route.query.inventoryId
                );
            }
            return obj;
        },
        currency() {
            let ret = "￥";
            if (this.order.if_jifen) {
                ret = "积分";
            }
            return ret;
        },
    },
    methods: {},
};
</script>


<style scoped lang="less">
.goods-info {
  .info-title {
    .flex-between();
    height: 48px;
    padding: 0 15px;
    background: #f9f9f9;

    .date {
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      color: #7d7d7d;
    }

    .order-code {
      flex: 2;
      text-align: left;
      padding-left: 20px;

      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      color: #7d7d7d;

      span {
        color: #333333;
      }
    }

    .order-state {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #999999;
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
          flex: 1;

          .desc {
            margin-top: 10px;
            color: #77797B;
          }
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
          width: 150px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 20px;
          color: #333333;
        }
      }

      .goods-action {
        .flex();
        justify-content: flex-end;
        padding: 10px;

        .btn-goods-action {
          margin-left: 10px;
          width: 96px;
          height: 30px;
          background: @theme;
          font-size: 14px;
          font-family: Microsoft YaHei;
          color: #ffffff;
          border-radius: 14px;
          transition: 0.3s;

          &:hover {
            opacity: 0.8;
          }

          &.disabled {
            background: #ccc;
          }
        }
      }
    }
  }
}
</style>
