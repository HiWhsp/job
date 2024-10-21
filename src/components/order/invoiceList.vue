<template>
  <div class="order-list-wrap">
    <div class="info-item" v-for="(item, index) in list" :key="index">
      <div class="info-title">
        <div class="date">{{ item.dtTime }}</div>
        <div class="order-code">
          订单号：
          <span>{{ item.orderId }}</span>
        </div>
        <div class="order-state" :class="'state-' + item.status">
          {{ item.status === 1 ? '待开票' : '已开票' }}
        </div>
      </div>
      <div class="info-good">
        <div class="list-good">
          <div class="item-good flex">
            <div class="box-image cover">
              <el-image :src="JSON.parse(item.info)[0].image">
                <div slot="error" class="image-slot">
                  <img :src="JSON.parse(item.info)[0].image"/>
                </div>
              </el-image>
            </div>

            <div class="box-title">
              <div class="goods-title">{{
                  JSON.parse(item.info)[0].title
                }}
              </div>
              <div class="goods-sku">型号：{{ JSON.parse(item.info)[0].keyVals }}</div>
            </div>
            <div class="box-sku">
              <div class="goods-sku">{{ JSON.parse(item.info)[0].num }}</div>
            </div>
            <!--                        <div class="box-num">-->
            <!--                            {{ item.num }}-->
            <!--                        </div>-->
            <div class="box-price">{{ vuex_huobi }} {{ JSON.parse(item.info)[0].priceSale }}</div>
          </div>
        </div>
      </div>
      <div class="info-heji">
        <div class="heji">

        </div>

        <div class="btn-actions">
          <button class="btn-ripple fit-text " @click="toDetail(item)">
            发票详情
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "invoiceList",
  data() {
    return {}
  },
  props: ["list"],
  methods: {
    // 跳转发票详情
    toDetail(item) {
      this.toRoute({
        path: '/invoice-details',
        query: {
          id: item.id
        },
      })
    }
  }
}
</script>

<style scoped lang="less">
.order-list-wrap {
  .info-item {
    border: 1px solid #e5e5e5;
    margin-bottom: 30px;
  }

  .info-title {
    .flex-between();
    height: 48px;
    padding: 0 15px;
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;

    .date {
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }

    .order-code {
      flex: 2;
      text-align: left;
      padding-left: 20px;

      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;

      span {
        color: #333333;
      }
    }

    .order-state {
      padding: 3px 6px;
      // border: 1px solid #ccc;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;

      // 待付款
      &.state-1 {
        color: #EA3200;
      }

      &.state-2 {
        color: #EA3200;
      }
    }
  }

  .info-good {
    .list-good {
      .item-good {
        padding: 20px;
        border-bottom: 1px solid #e5e5e5;

        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 14px;
        color: #333333;

        &:last-child {
          border: none;
        }

        .box-image {
          width: 100px;
          height: 100px;
          cursor: pointer;
          border: 1px solid #F5F5F5;


          /deep/ img {
            width: 100px;
            height: 100px;
            object-fit: contain;
            object-fit: cover;
          }

          img {
            width: 100px;
            height: 100px;
            object-fit: contain;
            object-fit: cover;
          }
        }

        .box-title {
          flex: 1;
          text-align: left;
          padding-left: 15px;


          .goods-title {
            width: fit-content;
            cursor: pointer;
            color: #333;

            &:hover {
              color: @theme;
            }
          }

          .goods-sku {
            font-size: 14px;
            margin-top: 10px;
            color: #77797B;
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

          font-family: OPPOSans, OPPOSans;
          font-weight: bold;
          font-size: 14px;
          color: #333;
        }
      }
    }
  }

  .info-heji {
    padding: 15px;
    border-top: 1px solid #e5e5e5;
    .flex-between();
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;

    .heji {
      .flex();
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;

      .heji-num {
        margin-right: 30px;

        b {
          color: #EA3200;
        }
      }

      .heji-money {
        b {
          color: #EA3200;
        }
      }
    }

    .btn-actions {
      button {
        transition: 0.3s;
        min-width: 120px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #CECECE;
        font-weight: 400;
        font-size: 14px;
        color: #676767;

        & + button {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
