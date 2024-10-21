<template>
  <div class="page">
    <div class="main-title">售后订单</div>

    <div class="page-ctx">
      <div class="info-item" v-for="(item, index) in list_order" :key="index">
        <div class="info-title">
          <div class="date">{{ item.dtTime }}</div>
          <div class="order-code">
            订单号：
            <span>{{ item.order_no }}</span>
          </div>
        </div>
        <div class="info-good">
          <div class="list-good">
            <div
                class="item-good flex"
                v-for="(product_item, product_index) in item.products"
                :key="product_index"
            >
              <div
                  class="box-image cover"
                  @click="mix_to_product(product_item)"
              >
                <!-- <img :src="good.img" alt /> -->
                <el-image :src="product_item.image">
                  <div slot="error" class="image-slot">
                    <img :src="product_item.image"/>
                  </div>
                </el-image>
              </div>

              <div class="box-title">
                <div class="goods-title" @click="mix_to_product(product_item)">
                  {{ product_item.title }}
                </div>
                <div class="goods-sku">{{ product_item.keyVals }}</div>
              </div>
              <div class="box-sku">
                <div class="goods-sku">
                  {{ vuex_huobi }}{{ product_item.priceSale }}
                </div>
              </div>
              <div class="box-num">
                {{ product_item.num }}
              </div>
              <div class="box-price">
                {{ vuex_huobi }}
                {{ product_item.priceSale * product_item.num }}
              </div>
              <div class="apply-after-sale">
                <div @click="applyAfterSale(item)">申请售后</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="count" class="pagination-box">
        <el-pagination
            @current-change="changePage"
            :current-page.sync="pagination.page"
            :page-size="pagination.pageNum" layout="total, prev, pager, next, jumper"
            :total="count"
        >
        </el-pagination>
      </div>

      <el-empty v-if="!count" description="没有查询到售后信息..."></el-empty>
    </div>
  </div>
</template>

<script>
export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      list_order: [], // 售后订单列表
      count: 0,
      pagination: {
        page: 1,
        pageNum: 10,
      }
    };
  },

  computed: {},

  created() {
    this.query_shouhou_order();
  },

  methods: {
    //售后列表
    query_shouhou_order() {
      this.$api("refund_afterSaleList", {
        ...this.pagination,
      }).then((res) => {
        //console.log("退换货列表", res);
        let {code, data} = res;
        if (code == 200) {
          let {list} = data;
          this.list_order = list;
        }
      });
    },
    // 申请售后
    applyAfterSale() {
      this.$router.push({
        path: `apply-after-sales?order_id=${order.order_id}&inventoryId=${order.inventoryId}`,
      });
    },

    changePage() {
      this.query_shouhou_order();
    }
  },
};
</script>


<style scoped lang="less">
.page {
  padding: 0;

  .main-title {
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
    padding: 24px 32px;
    background: #fff;
  }
}

.info-item {
  border: 1px solid #f5f5f5;
  margin-bottom: 30px;
}

.info-title {
  .flex-between();
  height: 48px;
  padding: 0 24px;
  background: #f9f9f9;
  border-bottom: 1px solid #f5f5f5;

  font-size: 14px;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #333333;

  .order-code {
    flex: 2;
    text-align: left;
    padding-left: 20px;
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
        width: 100px;
        height: 100px;
        cursor: pointer;
        border: 1px solid #f5f5f5;

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
        padding-left: 40px;

        .title {
          width: fit-content;
          cursor: pointer;

          &:hover {
            color: #4ca5e4;
          }
        }

        .goods-title {
          width: 300px;
          height: 38px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          line-height: 18px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }

        .goods-sku {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          line-height: 16px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }

      .box-sku {
        margin-left: 52px;
      }

      .box-num {
        margin-left: 133px;
      }

      .box-price {
        margin-left: 104px;
        font-weight: bold;
        font-size: 13px;
        color: #333333;
      }

      .apply-after-sale {
        margin-left: 111px;
        font-weight: 400;
        font-size: 14px;
        color: #27417c;
        line-height: 24px;
        cursor: pointer;
      }
    }

    .goods-action {
      .flex();
      justify-content: flex-end;
      padding: 10px;

      .btn-goods-action {
        padding-left: 10px;
        padding-right: 10px;
        margin-left: 10px;
        min-width: 96px;
        height: 30px;
        background: #4ca5e4;
        font-size: 14px;
        font-family: Microsoft YaHei;
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
</style>
