<template>
  <div class="page">
    <div
      style="position: absolute; top: 0; left: 0; z-index: -100"
      id="tableGen"
    ></div>
    <div class="page-title">我的账单</div>

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
          <input v-model="keyword" type="text" placeholder="输入订单号" />
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
                {{ item.billConfirmText }}
              </div>
            </div>

            <div class="product-box">
              <div class="product-list">
                <div
                  class="product-item flex"
                  v-for="(product_item, product_index) in item.productJson"
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
                  共 <b>{{ item.productNum }}</b> 个商品
                </div>
                <div class="heji-money">
                  合计金额： <b>{{ vuex_huobi }} {{ item.price }}</b>
                </div>
              </div>

              <div class="btn-actions">
                <button class="btn-ripple fit-text" @click="toDetail(item)">
                  账单详情
                </button>
                <button
                  class="btn-ripple fit-text"
                  @click="doDownload(item, 2)"
                  v-if="[2, 3, '2', '3'].includes(item.invoiceStatus)"
                >
                  下载开票凭证
                </button>
                <button
                  class="btn-ripple fit-text"
                  @click="doDownload(item, 1)"
                >
                  下载合同文件
                </button>
                <button
                  class="btn-ripple fit-text"
                  @click="doYiYi(item)"
                  v-if="item.billConfirm == 0"
                >
                  有异议
                </button>
                <button
                  class="btn-ripple fit-text btn-bg"
                  @click="doOfflinePay(item)"
                  v-if="item.billConfirm != 1"
                >
                  确认无误
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

        <el-empty v-if="!count" description="没有查询到账单信息..."></el-empty>
      </div>
    </div>

    <el-dialog :visible.sync="yiyi_show" width="30%" title="填写异议备注信息">
      <div class="yiyi-info">
        <div class="yiyi-title">备注说明：</div>
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8 }"
          placeholder="请输入内容"
          v-model="yiyi_info.remark"
        >
        </el-input>
        <div class="yiyi-btn">
          <button class="btn-ripple fit-text" @click="yiyi_show = false">
            取消
          </button>
          <button class="btn-ripple fit-text btn-bg" @click="doYiYiSubmit">
            提交
          </button>
        </div>
      </div>
    </el-dialog>

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
    <xianxia_submit3 ref="xianxia" @confirm="emitConfirm"></xianxia_submit3>
  </div>
</template>

<script>
// import orderList from "@/components/order/orderList.vue"; //订单列表
import order_cancel_modal from "@/components/order/order_cancel_modal.vue"; //取消
import order_delete_modal from "@/components/order/order_delete_modal.vue"; //删除
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //收货
import order_refund_modal from "@/components/order/order_refund_modal.vue"; //售后
import xianxia_submit3 from "@/components/order/xianxia_submit3.vue";
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
    xianxia_submit3,
  },
  data() {
    return {
      tabSelect: {
        title: "全部账单",
        value: -1,
      },
      //
      orderData: null,
      orders: [],
      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      keyword: "",
      yiyi_info: {},
      yiyi_show: false,
    };
  },
  computed: {
    ...mapState([""]),

    tabList() {
      //scene
      //筛选状态：0-全部 1-待支付 2-待发货 3-待收货 4-待核销 5-已完成 6-待评价 7-已取消
      //orderStatus
      //订单状态：-5-待支付  -1-已取消  2-待发货  3-待收货  4-待自提  5-已完成
      let orderData = this.orderData || {};
      let tabList = [
        { value: -1, title: "全部账单" },
        { value: 0, title: "待确认", num: orderData.billConfirm0Count || 0 },
        { value: 1, title: "已确认", num: orderData.billConfirm1Count || 0 },
        { value: 2, title: "有异议", num: orderData.billConfirm2Count || 0 },
      ];
      return tabList;
    },
  },
  mounted() {
    this.setView();
  },

  methods: {
    doYiYiSubmit() {
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "orders_billConfirm",
          orderId: this.yiyi_info.id,
          type: 2,
          billConfirmNote: this.yiyi_info.remark,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.yiyi_show = false;
          this.query_order();
        }
      });
    },
    emitConfirm() {
      this.query_order();
    },
    setView() {
      if (this.$route.query.status) {
        this.tabSelect =
          this.tabList.find((v) => v.value == this.$route.query.status) ||
          this.tabList[0];
      }

      this.query_order();
    },

    //订单列表
    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_getBillOrderList",
          ...this.pagination,
          billConfirm: this.tabSelect.value,
          orderNo: this.keyword,
        },
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          let list = data.list;
          this.orderData = data;

          this.orders = list;
          this.count = data.count;
        }
      });
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
        path: "/stock-censor-detail",
        query: {
          id: item.id,
        },
      });
    },
    doYiYi(item) {
      this.yiyi_info = item;
      this.yiyi_show = true;
    },
    doDownload(item, type) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      window.open(
        API_ROOT +
          `/service.php?action=orders_downloadAttach&token=${token}&userId=${userId}&id=${item.id}&type=${type}`,
        "_blank"
      );
    },
    doCancel(item) {
      this.$refs.order_cancel_modal.init(item);
    },
    doPay(item) {
      this.$router.push({
        path: "/payment-methods",
        query: {
          id: item.id,
        },
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
          action: "orders_getBillOrderList",
          billConfirm: this.tabSelect.value,
          orderNo: this.keyword,
          ...this.pagination,
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

/deep/ .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #f7f7f7;

  font-family: Poppins, Poppins;
  // font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 34px 50px 53px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 60px;

  button {
    width: 120px;
    height: 48px;
    background: #ffffff;
    border-radius: 5px;
    border: 1px solid #dedede;

    font-size: 18px;
    color: #666666;

    & + button {
      margin-left: 16px;
    }
  }

  .btn-bg {
    background: #f74747;
    color: #ffffff;
  }
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

.yiyi-info {
  .yiyi-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  .yiyi-btn {
    display: flex;
  }
  .yiyi-btn {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 20px;
    button {
      width: 100px;
      height: 32px;
      background: #ffffff;
      border-radius: 50px 50px 50px 50px;
      border-radius: 4px;
      border: 1px solid #d5dbe8;
    }
    .btn-bg {
      background: #f74747;
      color: #ffffff;
      border: 1px solid #f74747;
    }
  }
}
</style>
