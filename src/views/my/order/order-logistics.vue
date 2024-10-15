<template>
  <div class="page">
    <div class="main-title">
      <div>订单号：122522545265110200</div>
      <div>下单时间：2020-12-28 12:24:30</div>
    </div>
    <div class="page-ctx">
      <div class="order-list-wrap">
        <div class="info-item">
          <div class="info-title">
            <div class="order-code">
              商品信息
              <span>{{ info.orderNo }}</span>
            </div>
          </div>
          <div class="info-good">
            <div class="list-good">
              <div
                class="item"
                v-for="(product_item, index) in info.products"
                :key="index"
              >
                <div class="item-good flex">
                  <div
                    class="box-image cover"
                    @click="mix_to_product(product_item)"
                  >
                    <el-image :src="product_item.image">
                      <div slot="error" class="image-slot">
                        <img :src="product_item.image" />
                      </div>
                    </el-image>
                  </div>

                  <div class="box-title">
                    <div class="title" @click="mix_to_product(product_item)">
                      {{ product_item.title }}
                    </div>
                    <div class="goods-sku">
                      {{ product_item.keyVals }}
                    </div>
                  </div>

                  <div class="box-sku">
                    <div class="goods-sku">
                      {{ vuex_huobi }}{{ product_item.price }}
                    </div>
                  </div>
                  <div class="box-num">{{ product_item.num }}</div>
                  <div class="box-price">
                    {{ vuex_huobi }} {{ product_item.priceSale }}
                  </div>
                </div>

                <div class="goods-action" v-if="info.orderStatus == 5">
                  <!-- <button v-if="!is_jifen_goods && item.allow_actions.allow_refund" class="btn-goods-action" @click="refundApply(item)">申请售后</button> -->
                  <!-- <button v-if="item.ifshouhou" class="btn-goods-action disabled">已售后</button> -->
                  <!-- <button v-if="item.allow_actions.allow_logistics" class="btn-goods-action" @click="toRoute(`/orderLogistics?order_id=${order_id}&logistics_id=${fahuo_id}`)">查看物流</button> -->
                  <button
                    v-if="product_item.ifComment == 0"
                    class="btn-goods-action"
                    @click="to_review(product_item)"
                  >
                    商品评价
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="logistics-wrap">
        <div class="receive-wrap">
          <div class="time-wrap">08-18 16：34</div>
          <div class="status-wrap">
            <div class="status">收</div>
            <div class="line"></div>
          </div>
          <div class="address-wrap">
            [收货地址]北京市经济技术开发区地盛西路1号 数码庄园A2座
          </div>
        </div>

        <div class="signed-receive-wrap">
          <div class="time-wrap">08-18 16：34</div>
          <div class="status-wrap">
            <div class="status">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                t="1727487676836"
                class="icon"
                viewBox="0 0 1025 1024"
                version="1.1"
                p-id="4240"
                width="27"
                height="22"
              >
                <path
                  d="M345.781 890.168 0 544.571l77.181-77.187 268.601 268.234 601.781-601.786 77.186 77.366L345.781 890.168z"
                  fill="#ffffff"
                  p-id="4241"
                />
              </svg>
            </div>
            <div class="line"></div>
          </div>
          <div class="address-wrap">
            <div class="one">已签收</div>
            <div class="two">您的订单已签收，期待再次为您服务</div>
          </div>
        </div>

        <div class="pending-pickup-wrap">
          <div class="time-wrap">08-18 16：34</div>
          <div class="status-wrap">
            <div class="status">
              <img :src="process" alt="">
            </div>
            <div class="line"></div>
          </div>
          <div class="address-wrap">
            <div class="one">待取件</div>
            <div class="two">
              [自提柜]您的快件以存放至丰巢【自提柜】，请及时取件，有问题
              请联系派件员<span class="phone">15978457854</span>
            </div>
          </div>
        </div>

        <div class="in-delivery-wrap">
          <div class="time-wrap">08-18 16：34</div>
          <div class="status-wrap">
            <div class="status">
              <img :src="process" alt="">
            </div>
            <div class="line"></div>
          </div>
          <div class="address-wrap">
            <div class="one">派送中</div>
            <div class="two">
              派送中 西城区的王亮[<span class="phone">15978457854</span
              >]正在派件(95720为中通快递员外呼专属号 码，请放心接听)
            </div>
          </div>
        </div>

        <div class="in-transit-wrap">
          <div class="time-wrap">08-18 16：34</div>
          <div class="status-wrap">
            <div class="status">
              <img :src="process" alt="">
            </div>
            <div class="line"></div>
          </div>
          <div class="address-wrap">
            <div class="one">运输中</div>
            <div class="two">快件已到达北京</div>
          </div>
        </div>

        <div
          class="in-process-wrap"
          v-for="(item, index) in addressArr"
          :key="index"
        >
          <div class="time-wrap">{{ item.time }}</div>
          <div class="status-wrap">
            <div class="status">
              <div class="status-ball"></div>
            </div>
            <div class="line"></div>
            <div v-if="index === addressArr.length - 1" class="last-line"></div>
          </div>
          <div class="address-wrap">{{ item.address }}</div>
        </div>

        <div class="in-package-wrap">
          <div class="time-wrap">08-18 16：34</div>
          <div class="status-wrap">
            <div class="status">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                t="1727487676836"
                class="icon"
                viewBox="0 0 1025 1024"
                version="1.1"
                p-id="4240"
                width="27"
                height="22"
              >
                <path
                  d="M345.781 890.168 0 544.571l77.181-77.187 268.601 268.234 601.781-601.786 77.186 77.366L345.781 890.168z"
                  fill="#ffffff"
                  p-id="4241"
                />
              </svg>
            </div>
            <div class="line"></div>
          </div>
          <div class="address-wrap">
            <div class="one">已揽件</div>
            <div class="two">义乌快递100的玲玲[15024578745]已揽收</div>
          </div>
        </div>

        <div class="in-shipped-wrap">
          <div class="time-wrap">08-18 16：34</div>
          <div class="status-wrap">
            <div class="status">
              <img :src="process" alt="">
            </div>
            <div class="line"></div>
          </div>
          <div class="address-wrap">
            <div class="one">已发货</div>
            <div class="two">包裹正在等待揽收</div>
          </div>
        </div>

        <div class="in-order-wrap">
          <div class="time-wrap">08-18 16：34</div>
          <div class="status-wrap">
            <div class="status">
              <img :src="process" alt="">
            </div>
            <div class="line"></div>
          </div>
          <div class="address-wrap">
            <div class="one">已下单</div>
            <div class="two">商品已经下单</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import process from '@/assets/img/order/process.png'

export default {
  data() {
    return {
      info: {
        products: [
          {
            title: "激光平面窗口 Φ5.0mm 厚度=2.0mm",
            keyVals: "GCL-010158",
            price: "5000.00",
            priceSale: "5000.00",
            num: 1,
          },
          {
            title: "激光平面窗口 Φ5.0mm 厚度=2.0mm",
            keyVals: "GCL-010158",
            price: "5000.00",
            priceSale: "5000.00",
            num: 1,
          },
        ],
      },
      addressArr: [
        {
          time: "08-18 16：34",
          address: "快件已到达西城区",
        },
        {
          time: "08-18 16：34",
          address: "快件离开北京中转发往西城区",
        },
        {
          time: "08-18 16：34",
          address: "快件已到达北京",
        },
        {
          time: "08-18 16：34",
          address: "快件已到达金华中转部",
        },
        {
          time: "08-18 16：34",
          address: "快件离开义乌已发往北京",
        },
      ],
      process
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.page {
  width: 1160px;
  padding: 0 0 73px 0;

  .main-title {
    display: flex;
    gap: 26px;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    font-size: 16px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Roboto, Roboto-Bold, Roboto, Roboto;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: @theme;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 13px;
  padding: 24px 32px;
  background: #fff;
}

.order-list-wrap {
  .info-item {
    border: 1px solid #f5f5f5;
    margin-bottom: 22px;
  }

  .info-title {
    .flex-between();
    height: 48px;
    padding: 0 24px;
    background: #f9f9f9;
    border-bottom: 1px solid #f5f5f5;

    font-size: 14px;
    font-family: Roboto, Roboto-Bold, Roboto, Roboto;
    font-weight: bold;
    color: #333333;

    .date {
    }

    .order-code {
      flex: 2;
      text-align: left;
      //padding-left: 20px;

      span {
      }
    }

    .order-state {
      // min-width: 96px;
      height: 30px;
      line-height: 30px;
      // background: @theme;
      color: @theme;
      // color: #fff;
      font-size: 14px;
    }
  }

  .info-good {
    .list-good {
      .item {
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }
      }

      .item-good {
        padding: 20px;
        border-bottom: 1px dashed #f5f5f5;

        &:last-child {
          border: none;
        }

        .box-image {
          width: 81px;
          height: 81px;
          cursor: pointer;
          border: 1px solid #f5f5f5;

          /deep/ img {
            width: 81px;
            height: 81px;
            object-fit: contain;
            object-fit: cover;
          }

          img {
            width: 81px;
            height: 81px;
            object-fit: contain;
            object-fit: cover;
          }
        }

        .box-title {
          flex: 1;
          text-align: left;
          padding-left: 40px;

          .title {
            width: fit-content;
            cursor: pointer;
            color: #333;
            margin-bottom: 10px;

            &:hover {
              color: @theme;
            }
          }

          .goods-sku {
            color: #77797b;
          }
        }

        .box-sku {
          text-align: center;
          min-width: 200px;
        }

        .box-num {
          text-align: center;
          min-width: 200px;
        }

        .box-price {
          text-align: center;
          min-width: 200px;

          font-family: Roboto, Roboto;
          font-weight: bold;
          font-size: 14px;
          color: #333;
        }
      }

      .goods-action {
        .flex();
        justify-content: flex-end;
        padding: 10px;

        button {
        }

        .btn-goods-action {
          padding-left: 10px;
          padding-right: 10px;
          margin-left: 10px;
          min-width: 96px;
          height: 30px;
          background: @theme;
          font-size: 14px;
          font-family: Roboto, Roboto;
          color: #ffffff;
          // border-radius: 14px;
          transition: 0.3s;
          border-radius: 4px;

          &:hover {
            opacity: 0.8;
          }

          &.disabled {
            background: #e5e5e5;
          }
        }
      }
    }
  }

  .electronic-contract-wrap {
    margin-bottom: 16px;
    background: #f9f9f9;
    font-size: 14px;
    font-family: Roboto, Roboto-Bold, Roboto, Roboto;
    font-weight: bold;
    color: #333333;
    border: 1px solid #e5e5e5;
    .title {
      height: 48px;
      padding: 13px 0 0 29px;
      font-weight: bold;
      font-size: 14px;
      color: #333333;
      line-height: 21px;
    }
  }
  .electronic-contract-btn-wrap {
    height: 94px;
    padding: 31px 0 0 32px;
    background: #fff;
    .btn-wrap {
      width: 129px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #27417c;
      color: #fff;
      border-radius: 2px 2px 2px 2px;
      opacity: 0.7;
      .img-wrap {
        width: 15px;
        height: 15px;
        margin-right: 8px;
        background: #ffffff;
        img {
          width: 15px;
          height: 15px;
        }
      }
      .btn-text {
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;
      }
    }
  }
}

.logistics-wrap {
  margin-top: 72px;
  padding-bottom: 57px;
  .receive-wrap {
    display: flex;
    .time-wrap {
      width: 74px;
      height: 58px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-size: 22px;
      color: #848484;
      text-align: right;
    }
    .status-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .status {
        width: 65px;
        height: 65px;
        margin: 0 15px 0 16px;
        background: #27417c;
        border: 1px solid #27417c;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;
        line-height: 65px;
        text-align: center;
      }
      .line {
        width: 0px;
        height: 115px;
        border-right: 1px dashed #df3033;
      }
    }
    .address-wrap {
      width: 493px;
      height: 71px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 24px;
      color: #848484;
      line-height: 40px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }

  .signed-receive-wrap {
    display: flex;
    .time-wrap {
      width: 74px;
      height: 58px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-size: 22px;
      color: #848484;
      text-align: right;
    }
    .status-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .status {
        width: 65px;
        height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 15px 0 16px;
        background: #27417c;
        border: 1px solid #27417c;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
      .line {
        width: 0px;
        height: 115px;
        border-right: 1px solid #707070;
      }
    }
    .address-wrap {
      width: 493px;
      height: 71px;
      padding-top: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 24px;
      color: #848484;
      line-height: 40px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }

  .pending-pickup-wrap {
    display: flex;
    .time-wrap {
      width: 74px;
      height: 58px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-size: 22px;
      color: #848484;
      text-align: right;
    }
    .status-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .status {
        width: 65px;
        height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 15px 0 16px;
        border: 1px solid #707070;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
      .line {
        width: 0px;
        height: 115px;
        border-right: 1px solid #707070;
      }
    }
    .address-wrap {
      width: 688px;
      height: 71px;
      padding-top: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 24px;
      color: #848484;
      line-height: 40px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      .phone {
        color: red;
      }
    }
  }

  .in-delivery-wrap {
    display: flex;
    .time-wrap {
      width: 74px;
      height: 58px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-size: 22px;
      color: #848484;
      text-align: right;
    }
    .status-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .status {
        width: 65px;
        height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 15px 0 16px;
        border: 1px solid #707070;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
      .line {
        width: 0px;
        height: 115px;
        border-right: 1px solid #707070;
      }
    }
    .address-wrap {
      width: 688px;
      height: 71px;
      padding-top: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 24px;
      color: #848484;
      line-height: 40px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      .phone {
        color: red;
      }
    }
  }

  .in-transit-wrap {
    display: flex;
    .time-wrap {
      width: 74px;
      height: 58px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-size: 22px;
      color: #848484;
      text-align: right;
    }
    .status-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .status {
        width: 65px;
        height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 15px 0 16px;
        border: 1px solid #707070;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
      .line {
        width: 0px;
        height: 115px;
        border-right: 1px solid #707070;
      }
    }
    .address-wrap {
      width: 688px;
      height: 71px;
      padding-top: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 24px;
      color: #848484;
      line-height: 40px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      .phone {
        color: red;
      }
    }
  }

  .in-process-wrap {
    display: flex;
    align-items: center;
    .time-wrap {
      width: 74px;
      height: 58px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-size: 22px;
      color: #848484;
      text-align: right;
    }
    .status-wrap {
      position: relative;
      width: 65px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 15px 0 16px;
      border-radius: 50%;
      color: #fff;
      font-size: 24px;
      text-align: center;

      .status {
        position: absolute;
        width: 21px;
        height: 21px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        .status-ball {
          width: 10px;
          height: 10px;
          background: #848484;
          border-radius: 50%;
        }
      }
      .line {
        width: 0px;
        height: 115px;
        border-right: 1px solid #707070;
      }
      .last-line {
        position: absolute;
        top: 100%;
        width: 0px;
        height: 60px;
        border-right: 1px solid #707070;
      }
    }

    .address-wrap {
      width: 312px;
      height: 31px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 24px;
      color: #848484;
      line-height: 46px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }

  .in-package-wrap {
    display: flex;
    margin-top: 60px;
    .time-wrap {
      width: 74px;
      height: 58px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-size: 22px;
      color: #848484;
      text-align: right;
    }
    .status-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .status {
        width: 65px;
        height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 15px 0 16px;
        background: #27417c;
        border: 1px solid #27417c;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
      .line {
        width: 0px;
        height: 115px;
        border-right: 1px solid #707070;
      }
    }
    .address-wrap {
      width: 688px;
      height: 71px;
      padding-top: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 24px;
      color: #848484;
      line-height: 40px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      .phone {
        color: red;
      }
    }
  }

  .in-shipped-wrap {
    display: flex;
    .time-wrap {
      width: 74px;
      height: 58px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-size: 22px;
      color: #848484;
      text-align: right;
    }
    .status-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .status {
        width: 65px;
        height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 15px 0 16px;
        border: 1px solid #707070;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
      .line {
        width: 0px;
        height: 115px;
        border-right: 1px solid #707070;
      }
    }
    .address-wrap {
      width: 688px;
      height: 71px;
      padding-top: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 24px;
      color: #848484;
      line-height: 40px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      .phone {
        color: red;
      }
    }
  }

  .in-order-wrap {
    position: relative;
    top: -3px;
    display: flex;
    .time-wrap {
      width: 74px;
      height: 58px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-size: 22px;
      color: #848484;
      text-align: right;
    }
    .status-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .status {
        width: 65px;
        height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 15px 0 16px;
        border: 1px solid #707070;
        border-radius: 50%;
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
      .line {
        width: 0px;
        border-right: 1px solid #707070;
      }
    }
    .address-wrap {
      width: 688px;
      height: 71px;
      padding-top: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 24px;
      color: #848484;
      line-height: 40px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      .phone {
        color: red;
      }
    }
  }
}
</style>