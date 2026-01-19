<template>
  <div class="page">
    <div class="page-title flex">MY ORDER</div>

    <div class="page-ctx">
      <div class="tab-box">
        <div class="search-box">
          <input v-model="keyword" type="text" placeholder="Search" />
          <button @click="do_search()">
            <img src="@img/order/order-search.png" alt />
          </button>
          <!-- <button @click="do_reset()">重置</button> -->
        </div>
        <div class="tab-list">
          <div
            v-for="(item, index) in tabList"
            :key="index"
            class="tab-item"
            :class="tabSelect.value == item.value ? 'active' : ''"
            @click="do_toggle_tab(item)"
          >
            {{ item.title }}
            <span class="number" v-if="number_info[item.number_key]">
              {{
              number_info[item.number_key]
              }}
            </span>
          </div>
        </div>
      </div>

      <div class="page-sec">
        <!-- <orderList :list="orders" @confirm="emitConfirm"/> -->

        <div class="order-list-wrap">
          <div class="info-item" v-for="(item, index) in orders" :key="index">
            <div class="base-box flex-between">
              <div class="date">{{ item.createdTime }}</div>
              <div class="order-code">
                {{ tabSelect.value == "refund" ? "Service code." : "Order No." }}
                <span>
                  {{
                  tabSelect.value == "refund" ? item.sn : item.orderNo
                  }}
                </span>
              </div>
              <div class="order-state" :class="'state-' + item.orderStatus">{{ item.statusInfo }}</div>
            </div>

            <div class="product-box">
              <div class="product-list">
                <div
                  class="product-item flex"
                  v-for="(product_item, product_index) in item.products"
                  :key="product_index"
                >
                  <div class="box-image cover" @click="mix_to_product(product_item)">
                    <!-- <img :src="good.img" alt /> -->
                    <el-image :src="product_item.image">
                      <div slot="error" class="image-slot">
                        <img :src="product_item.image" />
                      </div>
                    </el-image>
                  </div>
                  <div class="box-title">
                    <div
                      class="product-title"
                      @click="mix_to_product(product_item)"
                    >{{ product_item.title }}</div>
                    <div class="product-sku">{{ product_item.keyVals }}</div>
                  </div>
                  <!-- <div class="box-sku">
                    <div class="product-sku">{{ product_item.keyVals }}</div>
                  </div>-->
                  <div class="box-price">{{ vuex_huobi }} {{ product_item.priceSale }}/pack</div>
                  <div class="box-num">x {{ product_item.num }}</div>
                  <div class="box-subtotal">{{ vuex_huobi }} {{ product_item.priceSale }}</div>
                  <!-- <div
                    class="box-refund"
                    v-if="product_item.ifRefund == 0"
                    @click="doRefund(item, product_item)"
                  >
                    <div class="refund-act">申请售后</div>
                  </div>-->
                </div>
              </div>
            </div>

            <div class="info-heji">
              <div class="heji">
                <template v-if="tabSelect.value != 'refund'">
                  <div class="heji-num">
                    <b>{{ item.count_goods }}</b> Items in Total
                  </div>
                  <div class="heji-money">
                    Total amount
                    <b>{{ vuex_huobi }} {{ item.price }}</b>
                  </div>
                </template>
                <div class="heji-money" v-else>
                  申请服务：
                  <b>{{ item.typeInfo }}</b>
                </div>
              </div>

              <div class="btn-actions">
                <!-- <button class="btn-ripple fit-text">Cancel</button> -->

                <button
                  v-if="item.orderStatus == 5 && item.ifComment == 0"
                  class="btn-ripple fit-text"
                  @click="doReview(item)"
                >COMMENT</button>

                <button
                  v-if="item.ifCancel == 1&&tabSelect.value!='refund'"
                  class="btn-ripple fit-text btn-bg"
                  @click="doCancel(item)"
                >Cancel</button>

                <button class="btn-ripple fit-text btn-bg" @click="toDetail(item)">Order Details</button>

                <!-- <button
                  v-if="item.orderFahuoId&&item.orderStatus==3"
                  class="btn-ripple fit-text"
                  @click="toLogistics(item)"
                >查看物流</button>-->

                <button
                  v-if="item.ifPay == 1"
                  class="btn-ripple fit-text btn-bg-orange"
                  @click="doPay(item)"
                >Payment</button>
                <button
                  v-if="item.ifDel == 1"
                  class="btn-ripple fit-text btn-bg-orange"
                  @click="doDelete(item)"
                >Delete Order</button>
                <button
                  v-if="item.ifReceive == 1"
                  class="btn-ripple fit-text btn-bg-orange"
                  @click="doReceive(item)"
                >Confirm Receipt</button>

                <!-- <button
                  v-if="item.orderStatus >= 5"
                  class="btn-ripple fit-text btn-bg"
                  @click="doRefund(item)"
                >
                  售后
                </button>-->
                <!-- <button
                  v-if="item.orderStatus >= 5 && item.invoiceStatus == 0"
                  class="btn-ripple fit-text btn-bg"
                  @click="doInvoic(item)"
                >开发票</button>-->
              </div>
            </div>
          </div>
        </div>

        <div v-if="count" class="pagination-box" style="margin-top: 40px; text-align: center;">
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="on_current_change"
            :current-page.sync="pagination.page"
            :page-size="pagination.pageNum"
            :total="count"
          ></el-pagination>
        </div>
        <el-empty v-if="!count" description="没有查询到订单信息..."></el-empty>
      </div>
    </div>

    <order_cancel_modal ref="order_cancel_modal" @confirm="emitConfirm" data-type="取消" />
    <order_delete_modal ref="order_delete_modal" @confirm="emitConfirm" data-type="删除" />
    <order_receive_modal ref="order_receive_modal" @confirm="emitConfirm" data-type="收货" />
    <order_refund_modal ref="order_refund_modal" @confirm="emitConfirm" data-type="售后" />
    <order_invoic_modal ref="order_invoic_modal" @confirm="emitConfirm" data-type="发票" />
  </div>
</template>

<script>
// import orderList from "@/components/order/orderList.vue"; //订单列表
import order_cancel_modal from "@/components/order/order_cancel_modal.vue"; //取消
import order_delete_modal from "@/components/order/order_delete_modal.vue"; //删除
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //收货
import order_refund_modal from "@/components/order/order_refund_modal.vue"; //售后
import order_invoic_modal from "@/components/order/order_invoic_modal.vue"; //开发票

import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    // orderList,
    order_cancel_modal,
    order_delete_modal,
    order_receive_modal,
    order_refund_modal,
    order_invoic_modal
  },
  data() {
    return {
      tabSelect: {
        title: "全部",
        value: 0
      },
      number_info: {},
      //
      orders: [],
      pagination: {
        page: 1,
        pageNum: 10
      },
      count: 0,
      keyword: ""
    };
  },
  computed: {
    ...mapState([""]),

    tabList() {
      //scene
      //筛选状态：0-全部 1-待支付 2-待发货 3-待收货 4-待核销 5-已完成 6-待评价 7-已取消
      //orderStatus
      //订单状态：-5-待支付  -1-已取消  2-待发货  3-待收货  4-待自提  5-已完成
      let list = [
        { value: 0, title: "All Orders", number_key: "orderNum" },
        { value: 1, title: "Unpaid", number_key: "orderNeedPay" },
        { value: 2, title: "To be shipped", number_key: "orderNeedDelivery" },
        {
          value: 3,
          title: "Goods to be received",
          number_key: "orderNeedShouhuo"
        },
        // { value: 6, title: "待评价", number_key: "orderNeedComment" },
        { value: 5, title: "Completed", number_key: "" }
        // { value: 7, title: "已取消", number_key: "" }
        // { value: 6, title: "待审核",},
        // { value: "refund", title: "退款/售后", number_key: "" },
      ];
      return list;
    }
  },
  created() {
    this.setView();
  },

  methods: {
    emitConfirm() {
      this.query_order();
    },
    setView() {
      if (this.$route.query.status) {
        this.tabSelect =
          this.tabList.find(v => v.value == this.$route.query.status) ||
          this.tabList[0];
      }

      this.query_userIndex();
      this.query_order();
    },

    //用户主页数据
    query_userIndex() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo"
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data;
          this.number_info = {
            orderNeedComment: data.orderNeedComment || 0,
            orderNeedDelivery: data.orderNeedDelivery || 0,
            orderNeedHexiao: data.orderNeedHexiao || 0,
            orderNeedPay: data.orderNeedPay || 0,
            orderNeedShouhuo: data.orderNeedShouhuo || 0,
            // orderNum: data.orderNum || 0,
            orderRefundNum: data.orderRefundNum || 0
          };
        }
      });
    },

    //订单列表
    query_order() {
      let actioc =
        this.tabSelect.value == "refund" ? "refund_lists" : "orders_lists";
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: actioc,
          ...this.pagination,
          scene: this.tabSelect.value,

          keyword: this.keyword
        }
      }).then(res => {
        let { code, data } = res;
        if (code == 200) {
          let list = data.list;

          list.forEach(order => {
            order.isPay = order.value >= 0;
            order.actions = this.getOrderActions({
              ...order
            });

            let count_goods = 0;
            if (this.tabSelect.value == "refund")
              order.products = [order.products];
            order.products.forEach(product => {
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
      let { status, status_info, ifpingjia } = order;
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
          actions = [{ name: "取消订单", type: "quxiao" }];
        } else if (status_info == "待支付") {
          actions = [
            { name: "立即支付", type: "zhifu" },
            { name: "取消订单", type: "quxiao" }
          ];
        }
      } else if (status == -3) {
        //-3售后处理中
        actions = [{ name: "删除订单", type: "shanchu" }];
      } else if (status == -1) {
        //无效
        actions = [{ name: "删除订单", type: "shanchu" }];
      } else if (status == 0) {
        //0待成团
        actions = [{ name: "取消订单", type: "quxiao" }];
      } else if (status == 2) {
        //2待发货
        actions = [
          // { name: "取消订单", type: "quxiao" }
        ];
      } else if (status == 3) {
        //3待收货
        actions = [
          { name: "确认收货", type: "shouhuo" },
          { name: "查看物流", type: "wuliu" }
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
    toLogistics(item) {
      this.toRoute({
        path: "/order-logistics",
        query: {
          order_id: item.id,
          logistics_id: item.fahuo_id
        }
      });
    },
    toDetail(item) {
      // this.$router.push(`/order-detail?id=${item.id}`);
      if (this.tabSelect.value == "refund") {
        this.mix_toRoute({
          path: "/refund-service-detail",
          query: {
            id: item.id
          }
        });

        return;
      }
      this.toRoute({
        path: "/order-detail",
        query: {
          id: item.id
        }
      });
    },
    doCancel(item) {
      this.$refs.order_cancel_modal.init(item);
    },
    doPay(item) {
      this.$router.push({
        path: "/payment-methods",
        query: {
          id: item.id
        }
      });
    },
    doDelete(item) {
      this.$refs.order_delete_modal.init(item);
    },
    doReceive(item) {
      this.$refs.order_receive_modal.init(item);
    },
    doReview(item) {
      let ids = item.products.map(v => v.id).join(",");
      this.$router.push({
        path: "/order-review-submit",
        query: {
          orderId: this.order_id,
          inventoryId: ids,
          inventoryIds: ids
        }
      });
    },
    doRefund(item, product) {
      // this.$refs.order_refund_modal.init(item);
      console.log(item, product);
      this.$router.push({
        path: "/refund-type",
        query: {
          orderId: item.id,
          inventoryId: product.id
        }
      });
    },
    doInvoic(item) {
      item.type = 1;
      this.$refs.order_invoic_modal.init(item);
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
          `/order-logistics?order_id=${order_id}&logistics_id=${fahuo_id}`
        );
      } else if (name == "售后") {
        this.$router.push(`/refundFeedback?order_id=${order_id}`);
      }
    },

    //取消订单
    orders_qxOrder(order_id) {
      let order = this.list.find(v => v.id == order_id);

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
        params: { order_id },
        success: () => {
          this.updateView();
        }
      });
    },
    //订单支付
    order_payment(order_id) {
      this.$router.push(`/payment-methods?order_id=${order_id}`);
    },

    //订单确认收货
    order_qianshou(order_id) {
      let order = this.list.find(v => v.id == order_id);
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
      // this.$router.push(`/orderRefund?order_id=${order_id}`);
      this.$router.push({
        path: "/refund-type",
        query: {
          orderId: this.id
          // inventoryId:this.
        }
      });
    },
    jump_order_detail(order) {},

    open_link(link) {
      window.open(link, "_blank");
    }
  }
};
</script>

<style scoped lang="less">
.page {
  padding-bottom: 50px;

  .page-title {
    padding: 0 32px;
    text-align: left;
    height: 70px;
    line-height: 70px;
    background: #ffffff;
    font-size: 20px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #1e262e;
    img {
      width: 22px;
      margin-right: 10px;
    }
  }

  .page-ctx {
    margin-top: 14px;
    padding: 20px 0;
    background: #fff;
  }
}

.tab-box {
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  gap: 20px;
  padding: 0 26px;
  border-bottom: 1px solid #dedede;

  .tab-list {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
    .tab-item {
      position: relative;
      // min-width: 96px;
      height: 48px;
      line-height: 48px;
      cursor: pointer;
      margin-right: 40px;

      .number {
        color: #7853b2;
      }

      &.active {
        // background: #7853B2;
        // color: #fff;
        // font-weight: bold;
        // color: #009f39;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #ec6a2b;
        }
      }
    }
  }

  .search-box {
    display: flex;
    align-items: center;
    width: 308px;
    height: 56px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
    input {
      background: #fff;
      flex: 2;
      height: 100%;
      border-right: none;
      outline: none;
      padding-left: 10px;
      font-size: 20px;
      &:placeholder {
        color: #5e5e5e;
      }
    }

    button {
      width: 50px;
      height: 32px;
      color: #7d7d7d;

      &:last-child {
        border-left: 0;
      }

      img {
        width: 18px;
      }
    }
  }
}

.page-sec {
  padding: 0 26px;
}

.goods-sku {
  margin: 15px 0;
}

.check-url {
  // margin: 15px 0;

  span {
    cursor: pointer;
    display: inlin-block;
    padding: 2px 4px;
    background: coral;
    color: #fff;
  }
}

.order-list-wrap {
  margin-top: 30px;
  .info-item {
    border: 1px solid #e5e5e5;
    margin-bottom: 30px;
  }

  .base-box {
    height: 65px;
    padding: 0 15px;
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;

    .date {
      font-size: 20px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #1f1f1f;
    }

    .order-code {
      flex: 2;
      text-align: left;
      padding-left: 20px;

      font-size: 20px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #1f1f1f;

      span {
        color: #1f1f1f;
      }
    }

    .order-state {
      padding: 3px 6px;
      // border: 1px solid #ccc;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #ec6a2b;

      // 待付款
      &.state--5 {
        // background: #ff4c29;
        // border-color: #ff4c29;
        // color: #fff;
      }

      &.state-2 {
        color: #ec6a2b;
        border-color: #7853b2;
      }
    }
  }

  .product-box {
    .product-list {
      .product-item {
        padding: 20px;
        border-bottom: 1px dashed #ccc;

        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 14px;
        color: #333333;

        &:last-child {
          border: none;
        }

        .box-image {
          width: 114px;
          height: 114px;
          cursor: pointer;
          border: 1px solid #f5f5f5;

          /deep/ img {
            width: 114px;
            height: 114px;
            object-fit: contain;
            object-fit: cover;
          }

          img {
            width: 114px;
            height: 114px;
            object-fit: contain;
            object-fit: cover;
          }
        }

        .box-title {
          flex: 1;
          text-align: left;
          padding-left: 12px;

          .product-title {
            width: fit-content;
            cursor: pointer;
            font-size: 20px;
            font-family: Microsoft YaHei-Bold, Microsoft YaHei;
            font-weight: bold;
            color: #1e262e;

            &:hover {
              color: #7853b2;
            }
          }

          .product-sku {
            font-size: 20px;
            margin-top: 20px;
            min-width: 200px;
            color: #5e5e5e;
          }
        }

        .box-sku {
          text-align: center;
          min-width: 200px;
        }

        .box-num {
          text-align: center;
          min-width: 150px;
          font-size: 20px;
          color: #5e5e5e;
        }

        .box-price {
          text-align: center;
          min-width: 150px;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 20px;
          color: #5e5e5e;
        }
        .box-subtotal {
          text-align: center;
          min-width: 150px;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 20px;
          color: #5e5e5e;
        }
        .box-refund {
          .refund-act {
            text-align: center;
            min-width: 150px;

            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 14px;
            color: #5b339a;
          }
        }
      }
    }
  }

  .info-heji {
    height: 103px;
    padding: 15px;
    border-top: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #1e262e;

    .heji {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #1e262e;

      .heji-num {
        margin-right: 30px;

        b {
          color: #ec6a2b;
        }
      }

      .heji-money {
        b {
          color: #ec6a2b;
        }
      }
    }

    .btn-actions {
      button {
        transition: 0.3s;
        height: 52px;
        line-height: 52px;
        background: #ffffff;
        border-radius: 6px;
        border: 1px solid #ec6a2b;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 22px;
        color: #ec6a2b;
        padding: 0 20px;

        & + button {
          margin-left: 20px;
        }

        &:hover {
          opacity: 0.7;
        }

        &.btn-bg {
          background: #00306b;
          color: #ffffff;
          border-color: #00306b;
        }
        &.btn-bg-orange {
          background: #ec6a2b;
          color: #ffffff;
          border-color: #ec6a2b;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/order-list.less"></style>

<style scoped lang="less" src="@/assets/h5css/shop/orderList.less"></style>

<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
