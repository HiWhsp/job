<template>
  <div class="page">
    <!--    <div class="page-title">我的订单</div>-->

    <div class="page-ctx">
      <div class="tab-box">
        <div class="tab-list">
          <div v-for="(item, index) in tabList" :key="index" :class="tabSelect.value == item.value ? 'active' : ''"
               class="tab-item" @click="do_toggle_tab(item)">
            {{ item.title }}
            <span v-if="item.num" class="number">{{ item.num }}</span>
          </div>
        </div>
        <!--        <div class="search-box">-->
        <!--          <input v-model="keyword" placeholder="输入商品名称、订单号" type="text"/>-->
        <!--          <button @click="do_search()">搜索</button>-->
        <!--          <button @click="do_reset()">重置</button>-->
        <!--        </div>-->
      </div>
      <div class="list-title">
        <div class="t1">产品</div>
        <div class="t2">订单金额</div>
        <div class="t3">订单状态</div>
        <div class="t4">操作</div>
      </div>
      <div class="page-sec">
        <div class="order-list-wrap">
          <div v-for="(item, index) in orders" :key="index" class="info-item">
            <div class="base-box flex-between">
              <div class="date">{{ item.createdTime }}</div>
              <div class="order-code">
                订单号：
                <span>{{ item.orderNo }}</span>
              </div>
            </div>

            <div class="product-box">
              <div class="product-list">
                <div v-for="(product_item, product_index) in item.products" :key="product_index"
                     class="product-item flex">
                  <div class="box-image cover" @click="mix_to_product(product_item)">
                    <!-- <img :src="good.img" alt /> -->
                    <el-image :src="product_item.image">
                      <div slot="error" class="image-slot">
                        <img :src="product_item.image"/>
                      </div>
                    </el-image>
                  </div>
                  <div class="box-title">
                    <div class="product-title" @click="mix_to_product(product_item)">{{ product_item.title }}</div>
                    <div class="product-sku">x {{ product_item.num }}</div>
                  </div>
                  <div class="box-price">CN {{ vuex_huobi }} {{ product_item.priceSale * product_item.num }}</div>
                  <div :class="'state-' + item.orderStatus" class="order-state">
                    {{ item.statusInfo }}
                  </div>
                  <div class="btn-actions">
                    <button class="btn-ripple fit-text " @click="toDetail(item)">
                      订单详情
                    </button>
                    <button v-if="item.ifCancel == 1" class="btn-ripple fit-text btn-bg" @click="doCancel(item)">
                      取消
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div v-if="count" class="pagination-box" style="margin-top: 40px; text-align: center;">
          <el-pagination :current-page.sync="pagination.page" :page-size="pagination.pageNum" :total="count"
                         background layout="total, prev, pager, next"
                         @current-change="on_current_change"></el-pagination>
        </div>

        <el-empty v-if="!count" description="没有查询到订单信息..."></el-empty>
      </div>

    </div>


    <order_cancel_modal ref="order_cancel_modal" data-type="取消" @confirm="emitConfirm"/>
    <order_delete_modal ref="order_delete_modal" data-type="删除" @confirm="emitConfirm"/>
    <order_receive_modal ref="order_receive_modal" data-type="收货" @confirm="emitConfirm"/>
    <order_refund_modal ref="order_refund_modal" data-type="售后" @confirm="emitConfirm"/>

  </div>
</template>

<script>
// import orderList from "@/components/order/orderList.vue"; //订单列表
import order_cancel_modal from "@/components/order/order_cancel_modal.vue"; //取消
import order_delete_modal from "@/components/order/order_delete_modal.vue"; //删除
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //收货
import order_refund_modal from "@/components/order/order_refund_modal.vue"; //售后


import {mapState} from "vuex";

export default {
  name: "servicePage",
  components: {
    // orderList,
    order_cancel_modal,
    order_delete_modal,
    order_receive_modal,
    order_refund_modal,
  },
  data() {
    return {
      tabSelect: {
        title: '全部',
        value: 0,
      },
      //
      orders: [],
      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      keyword: "",
      user_index: {},
    };
  },
  computed: {
    ...mapState([""]),

    tabList() {
      //scene
      //筛选状态：0-全部 1-待支付 2-待发货 3-待收货 4-待核销 5-已完成 6-待评价 7-已取消
      //orderStatus
      //订单状态：-5-待支付  -1-已取消  2-待发货  3-待收货  4-待自提  5-已完成
      let user_index = {} || this.user_index;
      let tabList = [
        {value: 0, title: "全部订单"},
        {value: 1, title: "待付款", num: user_index.order_num_1 || 0},
        {value: 2, title: "待发货", num: user_index.order_num_2 || 0},
        {value: 3, title: "待收货", num: user_index.order_num_3 || 0},
        // { value: 4, title: "待核销", num: user_index.order_num_4 || 0 },
        {value: 6, title: "待评价", num: user_index.order_num_4 || 0},
        {value: 5, title: "已完成", num: user_index.order_num_4 || 0},
        {value: 7, title: "已取消", num: user_index.order_num_4 || 0},
        // { value: 6, title: "待审核", num: user_index.order_num_6 || 0 },
      ];
      return tabList;
    },
  },
  created() {
    this.setView();
  },

  methods: {
    emitConfirm() {
      this.query_order()
    },
    setView() {
      if (this.$route.query.status) {
        this.tabSelect = this.tabList.find(v => v.value == this.$route.query.status) || this.tabList[0]
      }

      this.query_userIndex();
      this.query_order();
    },

    //用户主页数据
    query_userIndex() {
      this.$api("users_index").then((res) => {
        let {code, data} = res;
        if (code == 200) {
          this.user_index = data;
        }
      });
    },

    //订单列表
    query_order() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_lists',
          ...this.pagination,
          scene: this.tabSelect.value,
          // keyword: this.keyword,
        },
      }).then((res) => {
        let {code, data} = res;
        if (code == 200) {
          let list = data.list

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

    //根据订单状态获取订单操作结果
    getOrderActions(order) {
      let {status, status_info, ifpingjia} = order;
      let actions = [];
      // let actions = [
      //   { name: "取消订单",type: 'quxiao' },
      //   { name: "立即支付",type: 'zhifu' },
      //   { name: "确认收货",type: 'shouhuo' },
      //   { name: "评价订单",type: 'pingjia' },
      //   { name: "申请售后",type: 'shouhou' },
      //   { name: "删除订单",type: 'shanchu' },
      //   { name: "再次购买",type: 'goumai' },
      // ];

      if (status == -5) {
        //待支付
        if (status_info == "无效") {
          actions = [{name: "取消订单", type: "quxiao"}];
        } else if (status_info == "待支付") {
          actions = [
            {name: "立即支付", type: "zhifu"},
            {name: "取消订单", type: "quxiao"},
          ];
        }
      } else if (status == -3) {
        //-3售后处理中
        actions = [{name: "删除订单", type: "shanchu"}];
      } else if (status == -1) {
        //无效
        actions = [{name: "删除订单", type: "shanchu"}];
      } else if (status == 0) {
        //0待成团
        actions = [{name: "取消订单", type: "quxiao"}];
      } else if (status == 2) {
        //2待发货
        actions = [
          // { name: "取消订单", type: "quxiao" }
        ];
      } else if (status == 3) {
        //3待收货
        actions = [
          {name: "确认收货", type: "shouhuo"},
          {name: "查看物流", type: "wuliu"},
        ];
      } else if (status == 4) {
        //4已收货
        if (ifpingjia) {
          actions = [
            // { name: "删除订单", type: "shanchu" },
            // { name: "查看物流", type: "wuliu" },
            // { name: "售后", type: "shouhou" },
          ];
        } else {
          actions = [
            // { name: "删除订单", type: "shanchu" },
            // { name: "查看物流", type: "wuliu" },
            // { name: "售后", type: "shouhou" },
            //  { name: "评价", type: 'pingjia' }
          ];
        }
      }
      return actions;
    },

    do_toggle_tab(item) {
      this.tabSelect = item;
      this.pagination.page = 1;
      this.query_order();
    },


    //分页
    on_current_change() {
      this.query_order();
    },

    //搜索
    do_search() {
      this.query_order();
    },

    //重置
    do_reset() {
      this.keyword = "";
      this.pagination.page = 1;
      this.query_order();
    },

    updateView() {
      this.query_order();
    },


    toDetail(item) {
      // this.$router.push(`/order-detail?id=${item.id}`);
      this.toRoute({
        path: '/order-detail',
        query: {
          id: item.id
        },
      })
    },
    doCancel(item) {
      this.$refs.order_cancel_modal.init(item)
    },
    doPay(item) {
      this.$router.push({
        path: '/payment-methods',
        query: {
          id: item.id
        }
      })
    },
    doDelete(item) {
      this.$refs.order_delete_modal.init(item)
    },
    doReceive(item) {
      this.$refs.order_receive_modal.init(item);
    },
    doReview(item) {
    },
    doRefund(item) {
      this.$refs.order_refund_modal.init(item);
    },


    updateView() {
      this.$parent.updateView();
    },

    //处理订单行为
    handleOrderAction(action, order_id, order) {

      let fahuo_id = order.fahuo_id || "";
      //console.log({ ...action });
      let name = action.name;
      if (name == "取消订单") {
        this.orders_qxOrder(order_id);
      } else if (name == "删除订单") {
        this.orders_del(order_id);
      } else if (name == "立即支付") {
        this.order_payment(order_id);
      } else if (name == "确认收货") {
        this.order_qianshou(order_id);
      } else if (name == "评价") {
        this.jump_pingjia(order_id);
      } else if (name == "申请售后") {
        this.jump_shouhou(order_id);
      } else if (name == "查看物流") {
        this.$router.push(
            `/orderLogistics?order_id=${order_id}&logistics_id=${fahuo_id}`
        );
      } else if (name == "售后") {
        this.$router.push(`/refundFeedback?order_id=${order_id}`);
      }
    },

    //取消订单
    orders_qxOrder(order_id) {
      let order = this.list.find((v) => v.id == order_id);


      // order.orders_qxOrder({
      //   params: { order_id },
      //   success: () => {
      //     this.updateView();
      //   }
      // });
    },
    //删除订单
    orders_del(order_id) {
      order.orders_del({
        params: {order_id},
        success: () => {
          this.updateView();
        },
      });
    },
    //订单支付
    order_payment(order_id) {
      this.$router.push(`/payment-methods?order_id=${order_id}`);
    },

    //订单确认收货
    order_qianshou(order_id) {
      let order = this.list.find((v) => v.id == order_id);
      this.$refs.order_receive_modal.showModal = true;
      this.$refs.order_receive_modal.order = order;
      //console.log("订单信息", { ...order });
    },

    //订单评价
    jump_pingjia(order_id) {
      this.$router.push(`/order-review-submit?order_id=${order_id}`);
    },
    //订单售后申请
    jump_shouhou(order_id) {
      this.$router.push(`/orderRefund?order_id=${order_id}`);
    },
    jump_order_detail(order) {

    },

    open_link(link) {
      window.open(link, "_blank");
    },


  },
};
</script>

<style lang="less" scoped>
/deep/ .order-list-wrap {
  margin-top: 15px;
}

.list-title {
  margin-top: 15px;
  display: flex;
  height: 62px;
  line-height: 62px;
  background: #F4F4F4;
  padding: 0 20px;

  font-weight: 400;
  font-size: 16px;
  color: #000000;

  .t1 {
    flex: 1;
  }

  .t2, .t3 {
    width: 200px;
    text-align: center;
  }

  .t4 {
    width: 200px;
  }
}

.page {
  padding-bottom: 50px;

  .page-title {
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
}

.tab-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E4E7ED;

  .tab-list {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #000;

    .tab-item {
      position: relative;
      height: 30px;
      cursor: pointer;
      margin-right: 40px;

      .number {
        color: #000;
      }

      &.active {
        font-weight: bold;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #000;
        }
      }
    }
  }

  .search-box {
    display: flex;
    align-items: center;
    min-width: 260px;
    height: 32px;

    input {
      background: transparent;
      flex: 2;
      height: 100%;
      border: 1px solid #656565;
      border-right: none;
      outline: none;
      padding-left: 10px;
      font-size: 12px;
      color: #ccc;
    }

    button {
      width: 50px;
      height: 32px;
      border: 1px solid #656565;
      color: #ccc;

      &:last-child {
        border-left: 0;
      }
    }
  }
}

.goods-sku {
  margin: 15px 0;
}

.check-url {
  // margin: 15px 0;

  span {
    cursor: pointer;
    display: inline-block;
    padding: 2px 4px;
    background: coral;
    color: #000;
  }
}


.order-list-wrap {
  .info-item {
    border: 1px solid #E4E7ED;
    margin-bottom: 17px;
  }

  .base-box {
    height: 48px;
    padding: 0 15px;
    border-bottom: 1px solid #E4E7ED;

    .date {
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #000;
    }

    .order-code {
      flex: 2;
      text-align: left;
      padding-left: 20px;

      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #000;

      span {
        color: #000;
      }
    }
  }

  .product-box {
    .product-list {
      .product-item {
        padding: 20px;

        font-weight: 400;
        font-size: 14px;
        color: #333333;
        border-top: 1px solid #4D4D4D;

        &:first-child {
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
          padding-left: 40px;


          .product-title {
            width: fit-content;
            cursor: pointer;
            color: #000;

            &:hover {
              color: #F74747;
            }
          }

          .product-sku {
            margin-top: 20px;
            min-width: 200px;
            color: #777;
          }
        }

        .box-sku {
          text-align: center;
          min-width: 200px;
        }

        .box-num {
          text-align: center;
          min-width: 150px;
          color: #000;
        }

        .box-price {
          text-align: center;
          width: 200px;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #000;
        }

        .box-subtotal {
          text-align: center;
          min-width: 150px;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #000;
        }


        .order-state {
          margin: 0 55px;
          width: 90px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          color: #fff;
          font-size: 12px;
          background: #000000;
          border: 1px solid #CCCCCC;
        }

        .btn-actions {
          width: 200px;

          button {
            height: 32px;
            font-weight: 400;
            font-size: 14px;
            color: #666666;
            text-decoration: underline;

            & + button {
              margin-left: 20px;
            }

            &:hover {
              opacity: 0.7;
            }
          }
        }
      }
    }
  }

  .info-heji {
    padding: 15px;
    border-top: 1px solid #4D4D4D;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;

    .heji {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;

      .heji-num {
        margin-right: 30px;
        color: #000;

        b {
          font-weight: bold;
        }
      }

      .heji-money {
        color: #000;

        b {
          font-weight: bold;
        }
      }
    }
  }
}
</style>

<style lang="less" scoped src="@/assets/h5css/shop/order-list.less"></style>

<style lang="less" scoped src="@/assets/h5css/shop/orderList.less"></style>
