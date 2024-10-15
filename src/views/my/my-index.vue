<template>
  <div class="page">
    <div class="section-box">
      <div class="section-1">
        <div class="left">
          <div class="img-box">
            <div>
              <img src="@/static/order/user.png" alt />
            </div>
            <div class="name">
              {{ my_info.nickname || "郭菲菲" }}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="text-1">{{ my_info.phone || "15931263145" }}</div>
          <div class="text-2">
            <span>{{ my_info.levelTitle || "普通会员" }}</span>
          </div>
        </div>
      </div>

      <div class="section-2">
        <div class="list">
          <div class="item" @click="$router.push('/order-list?order_status=1')">
            <div class="val">
              <span>{{ my_info.orderNum || "0" }}</span>
            </div>
            <div class="label">全部订单</div>
          </div>
          <div class="item" @click="$router.push('/order-list?order_status=1')">
            <div class="val">
              <span>{{ user_index.order_num_1 || "0" }}</span>
            </div>
            <div class="label">待付款</div>
          </div>
          <div class="item" @click="$router.push('/order-list?order_status=3')">
            <div class="val">
              <span>{{ user_index.order_num_3 || "0" }}</span>
            </div>
            <div class="label">待收货</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-order">
      <div class="section-title">
        <div class="label">最近订单</div>
        <router-link to="/order-list" class="action">
          <span>全部订单</span>
          <img src="@/static/order/more.png" alt />
        </router-link>
      </div>

      <div class="order-box">
        <div class="empty-info" v-if="!list_order.length">
          <div class="empty-img">
            <img src="@/static/order/empty-img.png" alt="" />
          </div>
          <div class="empty-text">您还没有订单，赶快去逛逛吧！</div>
          <router-link to="/product-cates" class="empty-action">
            进入产品中心
          </router-link>
        </div>
        <div class="order-info" v-else>
          <orderList :list="list_order" @confirm="emitConfirm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderList from "@/components/order/orderList.vue"; //

export default {
  name: "servicePage",
  components: {
    orderList,
  },
  data() {
    return {
      pagination: {
        page: "1",
        pageNum: "8",
      },
      count: 0,

      my_info: {},
      user_index: {}, //用户首页数据
      list_order: [
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
        },
      ],
      list_goods: [],

      uploadImg: "",
      youhui_code: "",
      youhui_msg: "",
    };
  },
  computed: {
    // ...mapState([""]),
  },
  created() {
    this.setView();
  },
  methods: {
    emitConfirm() {
      this.query_order();
    },

    setView() {
      this.query_user();
      this.query_userIndex();
      this.query_order();
      this.query_goods();
    },
    //
    query_user() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.my_info = res.data;
        }
      });
    },

    //用户主页数据
    query_userIndex() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_index",
        },
      }).then((res) => {
        let { code, data } = res;
        if (res.code == 200) {
          this.user_index = res.data;
        }
      });
    },

    //订单查询
    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_lists",
          page: 1,
          pageNum: 2,
          scene: 0,
        },
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          this.list_order = data.list;
        }
      });
    },

    //商品信息
    query_goods() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          ...this.pagination,
        },
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          let { list, count, pages } = data;
          this.list_goods = list;
          this.count = count;
        }
      });
    },

    changeSugges() {
      if (this.count > this.pagination.pageNum * this.pagination.page) {
        this.pagination.page++;
        this.query_goods();
      } else {
        alertErr("没有更多了...");
      }
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .box-wrap .list .item:nth-child(4n) {
  margin-right: 0;
}

/deep/ .box-wrap .list .item:nth-child(5n) {
  margin-right: 10px;
}

/deep/ .box-wrap .list .item {
  margin-top: 10px;
}

/deep/ .box-wrap .list .item:nth-child(-n + 4) {
  margin-top: 10px;
}

.section-box {
  .flex();
}

.section-1 {
  .flex-center();
  position: relative;
  background: #ffffff url("~@/static/order/user-bg.png");
  background-size: 100% 100%;
  padding: 0 15px;
  width: 256px;
  height: 210px;

  .left {
    height: calc(100% - 48px);

    .img-box {
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .name {
      margin-top: 10px;
      text-align: center;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #ffffff;
    }
  }

  .right {
    .flex-between();
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    background: #ffffff;
    text-align: left;
    padding: 0 15px;
    border: 1px solid @theme;
    border-radius: 0 0 11px 11px;

    .text-1 {
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #333333;
    }

    .text-2 {
      .flex();

      img {
        width: 24px;
        margin-right: 5px;
      }

      span {
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #333333;
      }
    }
  }
}

.section-2 {
  flex: 1;

  .list {
    .flex-between();
    height: 185px;
    background: #ffffff;
    border: 1px solid #eee9e4;

    .item {
      text-align: center;
      width: 25%;
      padding: 10px 0;
      border-right: 1px solid #d5d8de;
      // margin-left: 40px;
      // margin-right: 40px;
      font-size: 16px;
      cursor: pointer;

      &:last-child {
        border-right: none;
      }

      .label {
        margin-top: 20px;
        font-size: 16px;
        font-family: Roboto, Roboto;
        font-weight: normal;
        color: #333333;
      }

      .val {
        span {
          // margin-left: 5px;
          font-size: 32px;
          font-family: Roboto, Roboto;
          font-weight: normal;
          color: @theme;
        }
      }
    }
  }
}

.page {
  padding: 0;
}

.section-title {
  border-bottom: 1px solid #dedede;
  .flex-between();
  height: 56px;
  padding: 0 32px;

  .label {
    font-size: 18px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    color: #333333;
  }

  .action {
    .flex();
    font-size: 14px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    color: @theme;
    cursor: pointer;

    img {
      width: 14px;
      margin-left: 10px;
    }
  }
}

.section-order {
  margin: 25px 0;
  background: #fff;

  .order-box {
    .empty-info {
      text-align: center;
      padding: 40px 0;

      // border-top: 1px solid #dedede;
      .empty-img {
        text-align: center;

        img {
          width: 190px;
        }
      }

      .empty-text {
        margin-top: 10px;
        margin-bottom: 20px;
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #999999;
      }

      .empty-action {
        font-size: 14px;
        color: @theme;
      }
    }
  }

  .order-info {
    padding: 24px 32px;
  }
}

.suggest-goods {
  background: #fff;

  .list-wrap {
    padding: 40px 30px;
  }

  /deep/ .product-list {
    .product-item {
      // margin-right: 23px;

      &:nth-child(4n) {
        // margin-right: 0;
      }

      &:nth-child(5) {
        // margin-top: 50px;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/my-index.less"></style>
