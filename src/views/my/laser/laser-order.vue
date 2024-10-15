<template>
  <div class="page">
    <div class="main-title">售后订单</div>

    <div class="page-ctx">
      <div class="tab-box">
        <div class="tab-list">
          <div
            v-for="(item, index) in tabList"
            :key="index"
            class="tab-item"
            :class="tabSelect.value == item.value ? 'active' : ''"
            @click="do_toggle_tab(item)"
          >
            {{ item.title }}
            <span class="number" v-if="item.num">{{ item.num }}</span>
          </div>
        </div>
        <div class="search-box">
          <input v-model="keyword" type="text" placeholder="输入名称、订单号" />
          <div class="search-wrap">
            <img src="@/static/order/search.png" alt="" />
          </div>
        </div>
      </div>

      <div class="order-list-wrap">
        <div class="info-item" v-for="(item, index) in list" :key="index">
          <div class="info-title">
            <div class="order-code">
              2022-10-21 12:24:30
              <span style="margin-left: 40px"
                >订单号：{{ item.orderNo || "154545456456456" }}</span
              >
            </div>
            <div class="order-state" :class="'state-' + item.orderStatus">
              待付款
            </div>
          </div>
          <div class="info-good">
            <div class="list-good">
              <div class="row">
                <div class="col">加工材料：不锈钢</div>
                <div class="col">加工类型：标记</div>
              </div>
              <div class="row">
                <div class="col">尺寸：长：20CM 宽：20CM 高：20CM</div>
                <div class="col">加工数量：200</div>
              </div>
              <div class="remark">
                <div class="left">备注：</div>
                <div>备注信息备注信息备注信息备注信息备注信息备注信息
                备注信息备注信息备注信息备注信息备注信息备注信息
                备注信息备注信息备注信息备注信息备注信息备注信息
                备注信息备注信息备注信息备注信息备注信息备注信息
                备注信息备注信息备注信息</div>
              </div>
            </div>
          </div>
          <div class="desc-wrap">
            <div class="total-price">
              合计金额 <span class="num">￥10000.00</span>
            </div>
            <div class="btn-wrap">
              <div
                class="btn"
                @click="onRouteTo('after-sale-refund-detail')"
              >
                取消订单
              </div>
              <div
                class="order-detail btn"
                @click="onRouteTo('laser-detail')"
              >
              订单详情
              </div>
              <div
                class="go-pay btn"
                @click="onRouteTo('after-sale-refund-detail')"
              >
              去支付
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="pagination-box"
        style="margin-top: 37px; text-align: right; text-align: center"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      tabSelect: {
        title: "全部",
        value: 0,
      },
      keyword: "",
      user_index: {},
      pagination: {
        page: 1,
        pageNum: 10,
      },
      list: [
        {
          createdTime: "2022-10-21 12:24:30",
          orderNo: "154545456456456",
          orderStatus: "-5",
          statusInfo: "待付款",
          products: [
            {
              image: "",
              title: "激光平面窗口 Φ5.0mm 厚度=2.0mm",
              keyVals: "GCL-010158",
              num: 1,
              priceSale: "5000.00",
            },
          ],
          count_goods: 2,
          price: "10000.00",
          ifPay: 1,
          ifCancel: 1,
        },
        {
          createdTime: "2022-10-21 12:24:30",
          orderNo: "154545456456456",
          orderStatus: "-5",
          statusInfo: "待付款",
          products: [
            {
              image: "",
              title: "激光平面窗口 Φ5.0mm 厚度=2.0mm",
              keyVals: "GCL-010158",
              num: 1,
              priceSale: "5000.00",
            },
          ],
          count_goods: 2,
          price: "10000.00",
          ifPay: 1,
          ifCancel: 1,
        },
      ],
      pagination: {
        page: 1,
        pageNum: 10,
      },
      currentPage4: 1,
    };
  },

  computed: {
    tabList() {
      //scene
      //筛选状态：0-全部 1-待支付 2-待发货 3-待收货 4-待核销 5-已完成 6-待评价 7-已取消
      //orderStatus
      //订单状态：-5-待支付  -1-已取消  2-待发货  3-待收货  4-待自提  5-已完成
      let user_index = {} || this.user_index;
      let tabList = [
        { value: 0, title: "全部订单" },
        { value: 1, title: "待付款", num: user_index.order_num_1 || 1 },
        { value: 2, title: "待加工", num: user_index.order_num_4 || 1 },
        { value: 3, title: "待完成", num: user_index.order_num_4 || 1 },
        { value: 4, title: "已完成", num: user_index.order_num_4 || 1 },
      ];
      return tabList;
    },
  },

  created() {},

  methods: {
    do_toggle_tab(item) {
      this.tabSelect = item;
      this.pagination.page = 1;
      this.query_order();
    },
    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_lists",
          ...this.pagination,
          scene: this.tabSelect.value,
          // keyword: this.keyword,
        },
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          let list = data.list;

          list.forEach((order) => {
            order.isPay = order.value >= 0;
            order.actions = this.getOrderActions({
              ...order,
            });

            let count_goods = 0;
            order.products.forEach((product) => {
              count_goods = count_goods + +product.num;
            });
            order.count_goods = count_goods;
          });

          this.orders = list;
          this.count = data.count;
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    onRouteTo(path) {
      this.$router.push({
        name: path,
        query: {
          status: "return-refund-success",
        },
      });
    },
  },
};
</script>
  
  
  <style scoped lang="less">
.page {
  padding: 0;

  .main-title {
    margin-bottom: 13px;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    font-weight: bold;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    color: #333333;
  }

  .page-ctx {
    padding: 24px 32px;
    background: #fff;
  }
}

.tab-box {
  padding-right: 20px;
  .flex-between();
  background: #ffffff;
  // border: 1px solid #cccccc;

  .tab-list {
    .flex();
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;

    .tab-item {
      position: relative;
      // min-width: 96px;
      height: 48px;
      line-height: 48px;
      cursor: pointer;
      margin-right: 40px;

      .number {
        color: @theme;
      }

      &.active {
        // background: @theme;
        // color: #fff;
        font-weight: bold;
        color: @theme;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: @theme;
        }
      }
    }
  }

  .search-box {
    .flex();
    min-width: 260px;
    height: 32px;
    background: #fff;

    input {
      background: #fff;
      flex: 2;
      height: 100%;
      border: 1px solid #b8c4d1;
      outline: none;
      padding-left: 10px;
      font-size: 12px;
    }

    button {
      width: 50px;
      height: 32px;
      background: #ffffff;
      border: 1px solid #e2e2e2;
      color: #7d7d7d;

      &:last-child {
        border-left: 0;
      }
    }
  }
}

.order-list-wrap {
  margin-top: 34px;
  .info-item {
    border: 1px solid #e5e5e5;
    margin-bottom: 20px;
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
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      color: #27417c;
      padding: 3px 6px;
      font-size: 14px;
      font-weight: 400;
    }
  }

  .info-good {
    .list-good {
      height: 170px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      border-bottom: 1px solid #e5e5e5;
      padding: 17px 21px 0 29px;
      font-size: 14px;
      color: #333333;
      line-height: 24px;
      .row {
        .flex();
        .col {
          width: 444px;
        }
      }
    }
    .remark {
      display: flex;
      gap: 6px;
      .left {
        width: 42px;
        flex-shrink: 0;
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
          color: #ea3200;
        }
      }

      .heji-money {
        b {
          color: #ea3200;
        }
      }
    }

    .btn-actions {
      button {
        transition: 0.3s;
        min-width: 120px;
        height: 32px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid @theme;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: @theme;

        & + button {
          margin-left: 20px;
        }

        &:hover {
          opacity: 0.7;
        }

        &.btn-bg {
          background: @theme;
          color: #ffffff;
        }
      }
    }
  }
}

.desc-wrap {
  position: relative;
  height: 61px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 39px;
  padding-left: 29px;
  padding-right: 25px;
  .total-price {
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    .num {
      color: #ea3200;
    }
  }
  .btn-wrap {
    .flex();
    gap: 10px;
    .btn {
      width: 104px;
      height: 32px;
      line-height: 30px;
      text-align: center;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #27417c;
      font-size: 14px;
      color: #27417c;
      cursor: pointer;
    }
    .go-pay {
      border: 1px solid #27417c;
      background: #27417c;
      color: #ffffff;
    }
  }
}
</style>
  
  <style lang="less" scoped>
.goods-sku {
  margin: 15px 0;
}

.search-box {
  position: relative;
}

.search-wrap {
  position: absolute;
  right: 13px;
  top: 7px;
}
</style>
  