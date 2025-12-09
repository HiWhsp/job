<template>
  <div class="page">
    <div
      style="position: absolute; top: 0; left: 0; z-index: -100"
      id="tableGen"
    ></div>
    <div class="page-title">我的订单</div>

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
        <!-- <div class="dash-btn" @click="getList()">
          <img class="dashicon" src="@/assets/img/my/download.png" alt="" />
          导出信息
        </div> -->
        <div class="search-box">
          <input
            v-model="keyword"
            type="text"
            placeholder="输入商品名称、订单号"
          />
          <button @click="do_search()">搜索</button>
          <button @click="do_reset()">重置</button>
        </div>
      </div>

      <div class="page-sec">
        <!-- <orderList :list="orders" @confirm="emitConfirm"/> -->

        <div class="order-list-wrap">
          <div class="info-item" v-for="(item, index) in orders" :key="index">
            <div class="base-box flex-between">
              <div class="date">{{ item.createdTime }}</div>
              <div class="order-code">
                订单号：
                <span>{{ item.orderNo }}</span>
              </div>
              <div class="order-state" :class="'state-' + item.orderStatus">
                {{ item.statusInfo }}
              </div>
            </div>

            <div class="product-box">
              <div class="check" v-if="item.checkStatus == 2">
                <span>{{ item.checkNote }}</span>
              </div>
              <div class="product-list">
                <div
                  class="product-item flex"
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
                        <img :src="product_item.image" />
                      </div>
                    </el-image>
                  </div>
                  <div class="box-title">
                    <div
                      class="product-title"
                      @click="mix_to_product(product_item)"
                    >
                      {{ product_item.title }}
                    </div>
                    <div class="product-sku">
                      订货编码：{{ product_item.sn }}
                    </div>
                    <div class="product-sku">
                      商品型号：{{
                        product_item.addrows
                          ? product_item.addrows[0]
                            ? product_item.addrows[0].val
                            : "--"
                          : "--"
                      }}
                    </div>
                  </div>
                  <!-- <div class="box-sku">
                    <div class="product-sku">{{ product_item.keyVals }}</div>
                  </div> -->
                  <div class="box-price">
                    {{ vuex_huobi }} {{ product_item.priceSale }}
                  </div>
                  <div class="box-num">{{ product_item.num }}</div>
                  <div class="box-subtotal">
                    {{ vuex_huobi }} {{ product_item.priceSale }}
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
              <div class="heji">
                <div class="heji-num">
                  共 <b>{{ item.count_goods }}</b> 个商品
                </div>
                <div class="heji-money">
                  合计金额： <b>{{ item.price }} 元</b>
                </div>
              </div>

              <div class="btn-actions">
                <button class="btn-ripple fit-text" @click="toDetail(item)">
                  订单详情
                </button>
                <button
                  class="btn-ripple fit-text"
                  v-if="item.orderStatus >= 2"
                  @click="doDownloadContract(item)"
                >
                  下载合同文件
                </button>
                <button
                  v-if="item.ifCancel == 1"
                  class="btn-ripple fit-text btn-bg"
                  @click="doCancel(item)"
                >
                  取消订单
                </button>
                <button
                  v-if="item.ifPay == 1"
                  class="btn-ripple fit-text btn-bg"
                  @click="doOfflinePay(item)"
                >
                  上传支付凭证
                </button>
                <button
                  v-if="item.ifDel == 1"
                  class="btn-ripple fit-text btn-bg"
                  @click="doDelete(item)"
                >
                  删除订单
                </button>
                <button
                  v-if="item.ifReceive == 1"
                  class="btn-ripple fit-text btn-bg"
                  @click="doReceive(item)"
                >
                  确认收货
                </button>
                <button
                  v-if="item.orderStatus == 5"
                  class="btn-ripple fit-text btn-bg"
                  @click="doReview(item)"
                >
                  去评价
                </button>
                <button
                  v-if="item.orderStatus >= 5 && item.ifRefund == 0"
                  class="btn-ripple fit-text btn-bg"
                  @click="doRefund(item)"
                >
                  售后
                </button>
                <!-- <button v-if="item.is_aa == 1" class="btn-ripple fit-text btn-bg" @click="toDetail(item)">
            查看物流
          </button> -->
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

    <order_cancel_modal
      ref="order_cancel_modal"
      @confirm="emitConfirm"
      data-type="取消"
    />
    <order_delete_modal
      ref="order_delete_modal"
      @confirm="emitConfirm"
      data-type="删除"
    />
    <order_receive_modal
      ref="order_receive_modal"
      @confirm="emitConfirm"
      data-type="收货"
    />
    <order_refund_modal
      ref="order_refund_modal"
      @confirm="emitConfirm"
      data-type="售后"
    />
    <xianxia_submit ref="xianxia" @confirm="emitConfirm"></xianxia_submit>
  </div>
</template>

<script>
// import orderList from "@/components/order/orderList.vue"; //订单列表
import order_cancel_modal from "@/components/order/order_cancel_modal.vue"; //取消
import order_delete_modal from "@/components/order/order_delete_modal.vue"; //删除
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //收货
import order_refund_modal from "@/components/order/order_refund_modal.vue"; //售后
import xianxia_submit from "@/components/order/xianxia_submit.vue";
import { mapState } from "vuex";
import TableExport from "tableexport";
import { API_ROOT } from "@/config/env.js";
export default {
  name: "servicePage",
  components: {
    // orderList,
    order_cancel_modal,
    order_delete_modal,
    order_receive_modal,
    order_refund_modal,
    xianxia_submit,
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
        { value: 0, title: "全部订单" },
        { value: 1, title: "待付款", num: user_index.order_num_1 || 0 },
        { value: 2, title: "待发货", num: user_index.order_num_2 || 0 },
        { value: 3, title: "待收货", num: user_index.order_num_3 || 0 },
        // { value: 4, title: "待核销", num: user_index.order_num_4 || 0 },
        { value: 6, title: "待评价", num: user_index.order_num_4 || 0 },
        { value: 5, title: "已完成", num: user_index.order_num_4 || 0 },
        { value: 7, title: "已取消", num: user_index.order_num_4 || 0 },
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
          action: "orders_lists",
          ...this.pagination,
          scene: this.tabSelect.value,
          keyword: this.keyword,
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
            order.products && order.products.forEach((product) => {
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
    doOfflinePay(item) {
      this.$refs.xianxia.init(item);
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
        path: "/order-detail",
        query: {
          id: item.id,
        },
      });
    },
    doCancel(item) {
      this.$refs.order_cancel_modal.init(item);
    },
    doPay(item) {
      // this.$router.push({
      //   path: "/payment-methods",
      //   query: {
      //     id: item.id,
      //   },
      // });
    },
    doDelete(item) {
      this.$refs.order_delete_modal.init(item);
    },
    doReceive(item) {
      this.$refs.order_receive_modal.init(item);
    },
    doReview(item) {
      this.$router.push({
        path: "/order-review-submit",
        query: {
          orderId: item.id,
          inventoryId: item.products[0].id,
        },
      });
    },
    doRefund(item) {
      this.toRoute({
        path: "/refund-type",
        query: {
          orderId: item.id,
          inventoryId: item.products[0].productId,
        },
      });
    },
    doDownloadContract(item) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      window.open(API_ROOT + `/service.php?action=orders_downloadAttach&token=${token}&userId=${userId}&id=${item.id}&type=1`, "_blank");
    },

    // updateView() {
    //   this.$parent.updateView();
    // },

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
    async getList() {
      this.showLoading();
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_orderExport",
          orderStatus:
            this.tabSelect.value == 0 ? "" : this.tabSelect.value || "",
        },
      }).then(async (res) => {
        console.log(res);
        if (res.code == 200) {
          window.location.href = res.data;
        }
        this.hideLoading();
        // download.excel(res, 'report.xls')
      });
      if (false) {
        this.$api({
          url: "/service.php",
          method: "post",
          data: {
            action: "orders_daochu",
            orderStatus:
              this.tabSelect.value == 0 ? "" : this.tabSelect.value || "",
          },
        }).then((res) => {
          document.getElementById("tableGen").innerHTML = res;
          let exporttable = TableExport(
            document.getElementById("tableGen").children[0],
            {
              exportButtons: false,

              filename: "我的订单",

              sheetname: "Sheet1",
              type: "excel",
            }
          );
          let tabledata = exporttable.getExportData();
          console.log(tabledata);
          var xlsxData = Object.values(tabledata)[0].xlsx;
          console.log(xlsxData);
          exporttable.export2file(
            xlsxData.data,
            xlsxData.mimeType,
            xlsxData.filename,
            xlsxData.fileExtension,
            xlsxData.merges,
            xlsxData.RTL,
            xlsxData.sheetname
          );

          // alert(res)
        });
      }
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
.dash-btn {
  display: flex;
  align-items: center;
  margin-left: 16px;
  color: #f74747;
  font-size: 14px;
  font-weight: normal;
  cursor: pointer;
  .dashicon {
    height: 18px;
    margin-right: 4px;
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
        color: #f74747;
      }

      &.active {
        // background: #F74747;
        // color: #fff;
        font-weight: bold;
        color: #f74747;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #f74747;
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
    display: inline-block;
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

  .base-box {
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
      color: #999999;
      color: #f74747;

      // 待付款
      &.state--5 {
        // background: #ff4c29;
        // border-color: #ff4c29;
        // color: #fff;
      }

      &.state-2 {
        color: #f74747;
        border-color: #f74747;
      }
    }
  }

  .product-box {
    .check {
      margin: 20px 20px 0 20px;
      background: #ffece7;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      span {
        color: #f74747;
        font-size: 14px;
        font-weight: bold;
      }
    }
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
          width: 70px;
          height: 70px;
          cursor: pointer;
          border: 1px solid #f5f5f5;

          /deep/ img {
            width: 70px;
            height: 70px;
            object-fit: contain;
            object-fit: cover;
          }

          img {
            width: 70px;
            height: 70px;
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
            color: #333;
            font-size: 16px;
            font-weight: bold;

            &:hover {
              color: #f74747;
            }
          }

          .product-sku {
            font-size: 16px;
            min-width: 200px;
            color: #999;
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
          color: #eb0f19;
        }
      }

      .heji-money {
        b {
          color: #eb0f19;
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
        border: 1px solid #d5dbe8;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #333;

        & + button {
          margin-left: 20px;
        }

        &:hover {
          opacity: 0.7;
        }

        &.btn-bg {
          background: #f74747;
          color: #ffffff;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/order-list.less"></style>

<style scoped lang="less" src="@/assets/h5css/shop/orderList.less"></style>
