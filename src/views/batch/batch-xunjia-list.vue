<template>
  <div class="page">
    <div class="page-title">我的询价</div>

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
        <!-- <div class="search-box">
          <input v-model="keyword" type="text" placeholder="输入商品名称、订单号" />
          <button @click="do_search()">搜索</button>
          <button @click="do_reset()">重置</button>
        </div> -->
      </div>

      <div class="page-sec">
        <!-- <orderList :list="orders" @confirm="emitConfirm"/> -->

        <div class="order-list-wrap">
          <div class="info-item" v-for="(item, index) in orders" :key="index">
            <div class="basic-info flex-between">
              <div class="order-code">
                报价单号：
                <span>{{ item.xunjiaNo }}</span>
              </div>
              <div class="date">制单时间：{{ item.dtTime }}</div>
            </div>

            <div class="base-box flex-between">
              <div class="box-title">
                <div class="product-title">商品信息</div>
              </div>
              <!-- <div class="box-sku">
                    <div class="product-sku">{{ product_item.keyVals }}</div>
                  </div> -->
              <div class="order-state_">状态</div>
              <div class="box-num">数量</div>
              <div class="box-price">单价</div>

              <div class="box-subtotal">小计</div>
            </div>

            <div class="product-box">
              <div class="product-list">
                <div
                  class="product-item flex"
                  v-for="(product_item, product_index) in item.xunjiaDetail"
                  :key="product_index"
                >
                  <div
                    class="box-image cover"
                    @click="mix_to_product(product_item)"
                  >
                    <!-- <img :src="good.img" alt /> -->
                    <el-image :src="product_item.product.thumb">
                      <div slot="error" class="image-slot">
                        <img :src="product_item.product.thumb" />
                      </div>
                    </el-image>
                  </div>
                  <div class="box-title">
                    <div
                      class="product-title"
                      @click="mix_to_product(product_item)"
                    >
                      {{ product_item.sku }}
                    </div>
                    <div class="product-sku">{{ product_item.brand }}</div>
                  </div>
                  <!-- <div class="box-sku">
                    <div class="product-sku">{{ product_item.keyVals }}</div>
                  </div> -->
                  <div class="order-state" :class="'state-' + item.status">
                    {{ item.status == 0 ? "待提交" : "" }}
                    {{ item.status == 1 ? "待处理" : "" }}
                    {{ item.status == 2 ? "待采购确认" : "" }}
                    {{ item.status == 3 ? "已下单" : "" }}
                    {{ item.status == -1 ? "后台取消" : "" }}
                    {{ item.status == -2 ? "用户取消" : "" }}
                  </div>
                  <div class="box-num">x {{ product_item.num }}</div>
                  <div class="box-price">
                    {{ vuex_huobi }} {{ product_item.baojiaPrice }}
                  </div>

                  <div class="box-subtotal">
                    {{ vuex_huobi }}
                    {{ product_item.baojiaPrice * product_item.num }}
                  </div>
                  <!-- <div class="box-refund">
                    <div class="refund-act">
                      申请售后
                    </div>
                  </div> -->
                </div>
              </div>
            </div>

            <div class="info-heji">
              <div class="heji">报价有效期：{{ item.endTime }}</div>

              <div class="btn-actions">
                <button class="btn-ripple fit-text" @click="toDetail(item)">
                  订单详情
                </button>
                <div class="btn-ripple fit-text" @click="getList(item)">
                  下载报价单
                </div>

                <button
                  v-if="item.status == 0 || item.status == 1"
                  class="btn-ripple fit-text btn-bg"
                  @click="doCancel(item)"
                >
                  取消报价
                </button>
                <button
                  v-if="item.status == 0"
                  class="btn-ripple fit-text btn-bg"
                  @click="doSubmit(item)"
                >
                  提交报价
                </button>
                <button
                  v-if="item.status == 2"
                  class="btn-ripple fit-text btn-bg"
                  @click="doPay(item)"
                >
                  去订购
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="count"
          class="pagination-box"
          style="margin-top: 40px; text-align: right"
        >
          <el-pagination
            background
            layout="total, prev, pager, next"
            @current-change="on_current_change"
            :current-page.sync="pagination.page"
            :page-size="pagination.pageNum"
            :total="count"
          ></el-pagination>
        </div>

        <el-empty v-if="!count" description="没有查询到订单信息..."></el-empty>
      </div>
    </div>
    <batch_xunjia_popupVue
      name="popup"
      ref="popup"
      @confirm="doConfirm"
    ></batch_xunjia_popupVue>
    <order_cancel_modal
      ref="order_cancel_modal"
      @confirm="emitConfirm"
      data-type="取消"
    />
  </div>
</template>

<script>
// import orderList from "@/components/order/orderList.vue"; //订单列表
import order_cancel_modal from "@/components/batch/batch_cancel_modal.vue"; //取消
import batch_xunjia_popupVue from "@/components/batch/batch_xunjia_popup.vue";
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    // orderList,
    order_cancel_modal,
    batch_xunjia_popupVue,
  },
  data() {
    return {
      tabSelect: {
        title: "全部",
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
        { value: 0, id: "", title: "全部报价" },
        { value: 1, id: 0, title: "待提交", num: user_index.order_num_0 || 0 },
        { value: 2, id: 1, title: "待处理", num: user_index.order_num_1 || 0 },
        {
          value: 3,
          id: 2,
          title: "待采购确认",
          num: user_index.order_num_2 || 0,
        },
        { value: 4, id: 3, title: "已下单", num: user_index.order_num_3 || 0 },
        {
          value: 5,
          id: -1,
          title: "后台取消",
          num: user_index.order_num_m1 || 0,
        },
        {
          value: 6,
          id: -2,
          title: "用户取消",
          num: user_index.order_num_m2 || 0,
        },
      ];
      return tabList;
    },
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
          this.tabList.find((v) => v.value == this.$route.query.status) ||
          this.tabList[0];
      }

      // this.query_userIndex();
      this.query_order();
    },

    //用户主页数据
    query_userIndex() {
      this.$api("users_index").then((res) => {
        let { code, data } = res;
        if (code == 200) {
          this.user_index = data;
        }
      });
    },

    //订单列表
    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_userXunjiaList",
          ...this.pagination,
          status: this.tabSelect.id,
          // keyword: this.keyword,
        },
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          let list = data.list;
          console.log(list);
          list.forEach((order) => {
            order.isPay = order.value >= 0;
            order.actions = this.getOrderActions({
              ...order,
            });

            let count_goods = 0;
            order.xunjiaDetail.forEach((product) => {
              count_goods = count_goods + +product.num;
            });
            order.count_goods = count_goods;
          });

          this.orders = list;
          this.count = data.count;
          this.getCount();
        }
      });
    },
    async getCount() {
      let count0 = this.orders.filter((v) => v.status == 0).length;
      let count1 = this.orders.filter((v) => v.status == 1).length;
      let count2 = this.orders.filter((v) => v.status == 2).length;
      let count3 = this.orders.filter((v) => v.status == 3).length;
      let countm1 = this.orders.filter((v) => v.status == -1).length;
      let countm2 = this.orders.filter((v) => v.status == -2).length;
      this.user_index = {
        order_num_0: count0,
        order_num_1: count1,
        order_num_2: count2,
        order_num_3: count3,
        order_num_m1: countm1,
        order_num_m2: countm2,
      };
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
            { name: "取消订单", type: "quxiao" },
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
          { name: "查看物流", type: "wuliu" },
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
        path: "/batch-xunjia-detail",
        query: {
          id: item.id,
        },
      });
    },
    doCancel(item) {
      this.$refs.order_cancel_modal.init(item);
    },
    doPay(item) {
      this.$refs.popup.init(item.xunjiaDetail);
    },
    doSubmit(item) {
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "product_submitXunjia",
          filepath: item.filePath,
          id: item.id,
        },
      }).then((res) => {
        alert(res);
        this.query_order();
      });
    },
    doConfirm(params) {
      console.log(params);
      let infos = params;
      infos.xunjiaid = this.fullInfo.id;
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          ...infos,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          this.query_order();
        }
      });
    },
    doDelete(item) {
      this.$refs.order_delete_modal.init(item);
    },
    doReceive(item) {
      this.$refs.order_receive_modal.init(item);
    },
    doReview(item) {},
    doRefund(item) {
      this.toRoute({
        path: "/refund-type",
        query: {
          orderId: item.id,
          inventoryId: item.products[0].productId,
        },
      });
    },
    getList(item) {
      window.location.href = item.filePath;
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
        params: { order_id },
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
    jump_order_detail(order) {},

    open_link(link) {
      window.open(link, "_blank");
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
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

  .page-ctx {
    margin-top: 14px;
    padding: 24px 32px;
    background: #fff;
  }
}

.tab-box {
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  // border: 1px solid #cccccc;

  .tab-list {
    display: flex;
    align-items: center;
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
        color: #3B64FC;
      }

      &.active {
        // background: #3b64fc;
        // color: #fff;
        font-weight: bold;
        color: #3B64FC;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #3B64FC;
        }
      }
    }
  }

  .search-box {
    display: flex;
    align-items: center;
    min-width: 260px;
    height: 32px;
    background: #f9f9f9;

    input {
      background: #f9f9f9;
      flex: 2;
      height: 100%;
      border: 1px solid #e2e2e2;
      border-right: none;
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
  .info-item {
    border: 1px solid #e5e5e5;
    margin-bottom: 30px;
  }
  .basic-info {
    height: 48px;
    padding: 0 15px;
    .order-code {
      flex: 2;
      text-align: left;

      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;

      span {
        color: #333333;
      }
    }
    .date {
      color: #999999;
    }
  }
  .base-box {
    height: 48px;
    padding: 0 15px;
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;
    .order-state_ {
      padding: 3px 6px;
      // border: 1px solid #ccc;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      min-width: 96px;
      // color: #999999;
    }

    .box-title {
      flex: 1;
      text-align: left;
      // padding-left: 40px;

      .product-title {
        width: fit-content;
        cursor: pointer;
      }
    }

    .box-sku {
      text-align: center;
      min-width: 200px;
    }

    .box-num {
      text-align: center;
      min-width: 150px;
    }

    .box-price {
      text-align: center;
      min-width: 150px;

      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
    }
    .box-subtotal {
      text-align: center;
      min-width: 150px;

      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
    }
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
        .order-state {
          padding: 3px 6px;
          // border: 1px solid #ccc;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 20px;
          margin-left: 16px;
          color: #999999;
          color: #3B64FC;
          min-width: 96px;
          // 待付款
          &.state--5 {
            // background: #ff4c29;
            // border-color: #ff4c29;
            // color: #fff;
          }

          &.state-2 {
            color: #3B64FC;
            border-color: #3B64FC;
          }
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

          .product-title {
            width: fit-content;
            cursor: pointer;

            &:hover {
              color: #3B64FC;
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
        }

        .box-price {
          text-align: center;
          min-width: 150px;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #777;
        }
        .box-subtotal {
          text-align: center;
          min-width: 150px;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #777;
        }
        .box-refund {
          .refund-act {
            text-align: center;
            min-width: 150px;

            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 14px;
            color: #ff0000;
          }
        }
      }
    }
  }

  .info-heji {
    padding: 15px;
    border-top: 1px solid #e5e5e5;
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
      font-family: sans-serif;
      font-weight: 400;
      color: #333333;

      .heji-num {
        margin-right: 30px;

        b {
          color: #3B64FC;
        }
      }

      .heji-money {
        b {
          color: #3B64FC;
        }
      }
    }

    .btn-actions {
      button {
        transition: 0.3s;
        min-width: 120px;
        height: 32px;
        background: #ffffff;
        border-radius: 50px 50px 50px 50px;
        border-radius: 4px;
        border: 1px solid #3B64FC;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #3B64FC;

        & + button {
          margin-left: 20px;
        }

        &:hover {
          opacity: 0.7;
        }

        &.btn-bg {
          background: #3B64FC;
          color: #ffffff;
        }
      }
    }
  }
}
.btn-ripple {
  vertical-align: bottom;
  transition: 0.3s;
  min-width: 12rem;
  height: 3.2rem;
  background: #ffffff;
  border-radius: 5rem 5rem 5rem 5rem;
  border-radius: 0.4rem;
  border: 1px solid #3B64FC;
  font-family: Arial, Arial;
  font-weight: 400;
  font-size: 1.4rem;
  color: #3B64FC;
  margin-left: 20px;
}
.btn-ripple:not(:disabled):hover {
  opacity: 1;
  position: relative;
  overflow: hidden;
}
.btn-ripple:not(:disabled):hover:before {
  animation: ani_ripple 0.75s;
  z-index: 1;
  content: "";
  position: absolute;
  display: block;
  transition: all 0.6s;
  width: 100%;
  height: 0;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  padding-top: 100%;
  transform: translateX(-50%) translateY(-50%);
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/order-list.less"></style>

<style scoped lang="less" src="@/assets/h5css/shop/orderList.less"></style>
