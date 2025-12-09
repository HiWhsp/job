<template>
  <div class="page">
    <div class="page-title">售后服务</div>

    <div class="page-ctx">
      <div class="refund-info ">
        <!-- 商品信息 -->
        <!-- <refundGoodsInfo :order="order" /> -->
        <div class="refund-product-detail">
          <div class="refund-item">
            <div class="base-box flex">
              商品信息
              <!-- <div class="date">{{ order.dtTime }}</div>
            <div class="order-code">
              订单号：
              <span>{{ order.order_id }}</span>
            </div>
            <div class="order-state">{{ order.status_info }}</div> -->
            </div>
            <div class="product-box">
              <div class="product-list">
                <div class="product-item flex">
                  <div class="box-pic">
                    <div class="img-box">
                      <img :src="product_info.image" alt />
                    </div>
                  </div>
                  <div class="box-title">
                    <div class="title">{{ product_info.title }}</div>
                    <div class="sku">{{ product_info.keyVals }}</div>
                  </div>
                  <div class="box-price">
                    <div class="price">
                      {{ order.is_jifen ? "积分" : "￥" }}
                      {{ order.is_jifen ? product_info.jifen : product_info.priceSale }}
                    </div>
                  </div>
                  <div class="box-num">
                    <div class="num">x {{ product_info.num }}</div>
                  </div>
                  <div class="box-xiaoji">
                    <div class="price">{{ vuex_huobi }} {{ product_info.priceSale * product_info.num }}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- 服务类型 -->
        <div class="service-box">
          <div class="service-title">选择服务类型</div>
          <div class="service-list">
            <!-- 退换货类型(1-退款 2-退货退款 3-换货) -->
            <div class="service-item" @click="to_refund_submit('1')">
              <div class="img-box">
                <img src="@img/refund/refund-tuikuan.png" alt />
              </div>
              <div class="text-box">
                <div class="type">仅退款</div>
                <div class="desc">与卖家协商同意只退款</div>
              </div>
            </div>
            <div class="service-item" @click="to_refund_submit('2')">
              <div class="img-box">
                <img src="@img/refund/refund-tuihuo.png" alt />
              </div>
              <div class="text-box">
                <div class="type">退货退款</div>
                <div class="desc">退还收到的货物并退款</div>
              </div>
            </div>
            <div class="service-item" @click="to_refund_submit('3')">
              <div class="img-box">
                <img src="@img/refund/refund-huanhuo.png" alt />
              </div>
              <div class="text-box">
                <div class="type">换货</div>
                <div class="desc">买家退货后商家补发新货</div>
              </div>
            </div>
            <div class="service-item" @click="to_refund_submit('4')">
              <div class="img-box">
                <img src="@img/refund/refund-weixiu.png" alt />
              </div>
              <div class="text-box">
                <div class="type">维修</div>
                <div class="desc">买家退货商家维修后寄回</div>
              </div>
            </div>
          </div>
        </div>
        <refundSubmit v-if="type" :type="type" :orderId="orderId" :inventoryId="inventoryId" />
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from "vuex";
import refundSubmit from './refund-submit.vue'
export default {
  name: "page-refund-type",
  components: {
    refundSubmit
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      inventoryId: this.$route.query.inventoryId,
      type: '',
      order: {},
      product_info: {}
    };
  },
  computed: {
    ...mapState([""]),
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_detail',
          id: this.orderId
        },
      }).then((res) => {
        if (res.code == 200) {
          this.order = res.data;
          this.product_info = res.data.products.find(v => v.id == this.inventoryId) || {}
        }
      });
    },

    to_refund_submit(type) {
      //退换货类型(1-退款   2-退货退款  3-换货 4-维修 )
      this.type = type;
      // this.mix_toRoute({
      //   path: '/refund-submit',
      //   query: {
      //     orderId: this.orderId,
      //     inventoryId: this.inventoryId,
      //     type: type,
      //   }
      // })
    },
  },
};
</script>


<style scoped lang="less">
.page {

  .page-title {
    margin-bottom: 20px;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }

  .page-ctx {
    padding: 30px 36px;
    min-height: 370px;
    background: #fff;
  }
}

.refund-product-detail {
  .refund-item {
    border: 1px solid #eee;

    .base-box {
      height: 48px;
      padding: 0 15px;
      background: #f5f5f5;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #333333;

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
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #999999;
      }
    }

    .product-box {
      .product-list {

        .product-item {
          padding: 20px;
          border-bottom: 1px dashed #ccc;

          &:last-child {
            border-bottom: none;
          }

     

          .box-pic {
            width: 100px;

            .img-box {
              width: 100px;

              img {
                width: 100px;
                height: 100px;
              }
            }
          }

          .box-title {
            flex: 1;
            padding-left: 20px;

            .title {
              text-align: left;
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #333333;
            }

            .sku {
              margin-top: 20px;
              text-align: left;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #999;
            }
          }

          .box-price {
            min-width: 100px;

            .price {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #666;
            }
          }


          .box-num {
            width: 100px;

            .num {

              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #666;
            }
          }

          .box-xiaoji {
            min-width: 100px;

            .price {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #666;
            }
          }


        }

      }
    }
  }
}

// 售后类型
.service-box {
  // border-top: 1px solid #eee;
  padding-top: 20px;

  .service-title {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 30px;
    color: #333333;
    margin-bottom: 20px;
    text-align: left;
  }

  .service-list {
      display: flex;
  align-items: center;
  justify-content: space-between;

    .service-item {
      display: flex;
      align-items: center;
      flex: 1;
      height: 120px;
      background: #ffffff;
      border: 1px solid #eeeeee;
      opacity: 1;
      border-radius: 4px;
      padding-left: 20px;
      cursor: pointer;
      transition: 0.3s;

      margin-right: 16px;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        background: #eee;
        // background: #FF9312;
      }



      .img-box {
        img {
          width: 48px;
        }
      }

      .text-box {
        text-align: left;
        padding-left: 16px;
        flex: 2;

        .type {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 20px;
          color: #333333;
        }

        .desc {
          margin-top: 10px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;

          color: #9f9f9f;
        }
      }
    }
  }
}
</style>
