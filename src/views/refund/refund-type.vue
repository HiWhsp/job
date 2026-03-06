<template>
  <div class="page">
    <div class="page-title">After-sale service</div>

    <div class="page-ctx">
      <div class="refund-info ">
        <!-- 商品信息 -->
        <!-- <refundGoodsInfo :order="order" /> -->
        <div class="refund-product-detail">
          <div class="refund-item">
            <div class="product-box">
              <div class="product-list">
                <div class="product-item flex" v-for="(product_item, product_index) in order.products"
                  :key="product_index">
                  <div class="box-pic">
                    <div class="img-box">
                      <img :src="product_item.image" alt />
                    </div>
                  </div>
                  <div class="box-title">
                    <div class="title">{{ product_item.title }}</div>
                    <div class="sku">{{ product_item.keyVals }}</div>
                  </div>
                  <div class="box-price">
                    <div class="price">
                      {{ vuex_huobi }}
                      {{ order.is_jifen ? product_item.jifen : product_item.priceSale }}
                    </div>
                  </div>
                  <div class="box-num">
                    <div class="num">x {{ product_item.num }}</div>
                  </div>
                  <div class="box-xiaoji">
                    <div class="price">{{ vuex_huobi }} {{ product_item.priceSale * product_item.num }}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- 服务类型 -->
        <div class="service-box">
          <div class="service-title">Select service type</div>
          <div class="service-list">
            <!-- 退换货类型(1-退款 2-退货退款) -->
            <div class="service-item" @click="to_refund_submit('1')">
              <div class="img-box">
                <img src="@img/refund/refund-tuikuan.png" alt />
              </div>
              <div class="text-box">
                <div class="type">I want a refund (no return required)</div>
                <div class="desc">Not receiving the goods, or negotiating with the seller to agree not to return the
                  goods but only to refund them</div>
              </div>
            </div>
            <div class="service-item" @click="to_refund_submit('2')">
              <div class="img-box">
                <img src="@img/refund/refund-tuihuo.png" alt />
              </div>
              <div class="text-box">
                <div class="type">I want a return and refund</div>
                <div class="desc">Received goods, need to return received goods</div>
              </div>
            </div>
          </div>
        </div>

        <div class="refund-submit-box" v-if="type !== null">
          <refund_submit :orderId="orderId" :inventoryId="inventoryId" :type="type" :actualRefundAmount="actualRefundAmount" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from "vuex";
import refund_submit from './refund-submit.vue'
export default {
  name: "page-refund-type",
  components: {
    refund_submit
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      inventoryId: this.$route.query.inventoryId,
      order: {},
      type: null, //1-退款 2-退货退款
      actualRefundAmount: 0,
    };
  },
  computed: {
    ...mapState([""]),
  },
  created() {
    this.actualRefundAmount = localStorage.getItem('actualRefundAmount');
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
          this.order.products = this.order.products.filter(
            v => v.id == this.inventoryId
          );
        }
      });
    },

    to_refund_submit(type) {
      //退换货类型(1-退款   2-退货退款  3-换货)
      this.type = type;
      // this.mix_toRoute({
      //   path: '/refund-submit',
      //   query: {
      //     orderId: this.orderId,
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
      background: #f9f9f9;

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
        color: #505050;
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
            width: 114px;

            .img-box {
              width: 114px;
              height: 114px;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
          }

          .box-title {
            flex: 1;
            padding-left: 20px;

            .title {
              font-family: Poppins, Poppins;
              font-weight: 400;
              font-size: 20px;
              color: #1E262E;
              line-height: 30px;
            }

            .sku {
              font-family: Poppins, Poppins;
              font-weight: 400;
              font-size: 20px;
              color: #5E5E5E;
              line-height: 28px;
              margin-top: 10px;
            }
          }

          .box-price {
            min-width: 160px;
            text-align: center;

            .price {
              font-family: Poppins, Poppins;
              font-weight: 600;
              font-size: 20px;
              color: #5E5E5E;
              line-height: 28px;
            }
          }


          .box-num {
            width: 80px;
            text-align: center;

            .num {
              font-family: Poppins, Poppins;
              font-weight: 600;
              font-size: 20px;
              color: #1E262E;
              line-height: 18px;
            }
          }

          .box-xiaoji {
            min-width: 180px;
            text-align: center;

            .price {
              font-family: Poppins, Poppins;
              font-weight: 600;
              font-size: 20px;
              color: #1E262E;
              line-height: 28px;
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
    font-family: Poppins, Poppins;
    font-weight: 600;
    font-size: 20px;
    color: #1E262E;
    line-height: 35px;
    margin-bottom: 20px;
  }

  .service-list {
    display: flex;
    align-items: center;

    .service-item {
      display: flex;
      width: 490px;
      height: 174px;
      background: #FFFFFF;
      border: 1px solid #D4D4D4;
      border-radius: 4px;
      padding: 25px;
      cursor: pointer;
      transition: 0.3s;

      margin-right: 16px;

      &:last-child {
        margin-right: 0;
      }

      .img-box {
        img {
          width: 48px;
        }
      }

      .text-box {
        text-align: left;
        padding-left: 20px;
        flex: 2;

        .type {
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 20px;
          color: #333333;
        }

        .desc {
          margin-top: 14px;
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #999;
        }
      }
    }
  }
}
</style>
<style scoped lang="less" src="@/assets/h5css/modals/refundList.less"></style>
