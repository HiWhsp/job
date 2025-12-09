<template>
  <div class="page">
    <!-- 图片预览 -->
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->
    <div class="page-title flex-between">
      <span>账单详情</span>
      <button @click="$router.push('/store-man')">返回</button>
    </div>

    <div class="page-ctx">
      <div class="base-ctx">
        <div class="base-title">
          <div class="date">{{ info.createdTime }}</div>
          <div class="order-code">
            订单号：
            <span>{{ info.orderNo }}</span>
          </div>
          <div class="order-state">
            {{
              info.billConfirm == 0
                ? "待确认"
                : info.billConfirm == 1
                ? "已确认"
                : "有异议"
            }}
          </div>
        </div>
        <div class="base-items">
          <div class="base-item">
            <div class="info-title">收货人信息</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">收货人：</div>
                <div class="val">
                  {{
                    shouhuoInfo.name ||
                    shouhuoInfo.firstName + " " + shouhuoInfo.lastName
                  }}
                </div>
              </div>
              <div class="info-item">
                <div class="label">手机号码：</div>
                <div class="val">{{ shouhuoInfo.phone }}</div>
              </div>
              <div class="info-item">
                <div class="label">详细地址：</div>
                <div class="val">{{ full_receive_address }}</div>
              </div>
            </div>
          </div>

          <div class="base-item">
            <div class="info-title">支付及支付方式</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">支付方式：</div>
                <div class="val">
                  {{
                    info.payMethod == 1
                      ? "对公转账"
                      : info.payMethod == 2
                      ? "账期月结"
                      : "无"
                  }}
                </div>
              </div>
              <div class="info-item">
                <div class="label">下单时间：</div>
                <div class="val">{{ info.createdTime }}</div>
              </div>
              <div class="info-item">
                <div class="label">配送方式：</div>
                <div class="val">
                  {{
                    fahuoInfo[1]
                      ? fahuoInfo[1].expressType == 1
                        ? "快递"
                        : "专送"
                      : "--"
                  }}
                </div>
              </div>
              <div class="info-item" v-if="info.payMethod == 1">
                <div class="label">汇款截图：</div>
                <div class="val">
                  <el-image
                    v-if="info.payImg"
                    :src="info.payImg"
                    style="width: 50px; height: 50px"
                    :preview-src-list="[info.payImg]"
                  />
                  <span v-else>无</span>
                </div>
              </div>
            </div>
          </div>

          <div class="base-item">
            <div class="info-title">收款对公账户</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">付款状态：</div>
                <div class="val">
                  {{ getPayStatusText(info.payStatus) }}
                </div>
              </div>
              <div class="info-item" v-if="info.payMethod == 2">
                <div class="label">应付款时间：</div>
                <div class="val">{{ info.nextPayDate }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 开票信息 -->
      <div class="base-ctx" v-if="invoiceList && invoiceList.length > 0">
        <div class="base-title">开票信息</div>
        <div class="table-content">
          <table class="info-table">
            <thead>
              <tr>
                <th>开票时间</th>
                <th>开票金额</th>
                <th>发票号</th>
                <th>开票凭证</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in invoiceList" :key="index">
                <td>{{ item.invoiceTime || "--" }}</td>
                <td>{{ vuex_huobi }}{{ item.money || "0.00" }}</td>
                <td>{{ item.invoiceCode || "--" }}</td>
                <td>
                  <el-image
                    v-if="item.invoiceUrl"
                    :src="item.invoiceUrl"
                    style="width: 50px; height: 50px; cursor: pointer"
                    :preview-src-list="[item.invoiceUrl]"
                    fit="cover"
                  />
                  <span v-else>--</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 付款记录 -->
      <div class="base-ctx" v-if="paymentList && paymentList.length > 0">
        <div class="base-title">付款记录</div>
        <div class="table-content">
          <table class="info-table">
            <thead>
              <tr>
                <th>付款时间</th>
                <th>付款金额</th>
                <th>付款凭证</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paymentList" :key="index">
                <td>
                  {{ item.createTime || "--" }}
                </td>
                <td>{{ vuex_huobi }}{{ item.money || "0.00" }}</td>
                <td>
                  <el-image
                    v-if="item.attach"
                    :src="item.attach"
                    style="width: 50px; height: 50px; cursor: pointer"
                    :preview-src-list="[item.attach]"
                    fit="cover"
                  />
                  <span v-else>--</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 订单商品信息 -->
      <div class="order-product order-info">
        <div class="order-list-wrap">
          <!-- 商品信息 -->
          <div class="info-item">
            <div class="info-title">
              <div class="date">商品信息</div>
            </div>
            <div class="info-good">
              <div class="list-good">
                <div
                  class="item"
                  v-for="(product_item, index) in products"
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
                      <div class="box-sku">
                        <div class="goods-sku">
                          订货编码：{{ product_item.sn }}
                        </div>
                      </div>
                      <div class="box-sku">
                        <div class="goods-sku">
                          商品型号：{{ product_item.keyVals }}
                        </div>
                      </div>
                      <div class="box-sku">
                        <div class="goods-sku">
                          需求描述: {{ product_item.remark || "--" }}
                        </div>
                      </div>
                    </div>
                    <div class="box-price">
                      {{ vuex_huobi }} {{ product_item.priceSale }}
                    </div>
                    <div class="box-num">{{ product_item.num }}</div>
                    <div class="box-price">
                      {{ vuex_huobi }} {{ product_item.priceSale }}
                    </div>
                  </div>
                  <!-- <div class="goods-action" v-if="info.orderStatus == 5"> -->
                  <div class="goods-action">
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

            <div class="info-heji">
              <!-- <div class="heji">合计： {{vuex_huobi}} {{ info.price }} 元</div> -->
              <div class="money-box">
                <div class="money-item">
                  <div class="label"></div>
                  <div class="value">
                    共 <b class="count">{{ total_product_number }}</b> 件
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">商品总价：</span>
                  <div class="value">
                    <span class="money-num"
                      >{{ vuex_huobi
                      }}{{ payInfo.goods ? payInfo.goods.totalPrice : 0 }}</span
                    >
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">配送费：</span>
                  <div class="value">
                    <span class="money-num"
                      >{{ vuex_huobi
                      }}{{ payInfo.yunfei ? payInfo.yunfei.price : 0 }}</span
                    >
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">总计应付：</span>
                  <div class="value">
                    <span class="money-num money-total"
                      >{{ vuex_huobi }}{{ info.price }}</span
                    >
                  </div>
                </div>
                <div class="zhifufangshi-wrap" v-if="is_finish_pay">
                  <span>支付方式：</span>
                  <div class="zhifufangshi">
                    <div class="pay-item" v-if="payInfo.balance">
                      <span class="pay-title">余额支付</span>
                      <span class="pay-money">
                        -{{ vuex_huobi }}{{ payInfo.balance }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 订单操作 -->
          <div class="order-action-box">
            <div class="btn-box">
              <button class="btn-ripple fit-text" @click="doDownload(2)">
                下载开票凭证
              </button>
              <button class="btn-ripple fit-text" @click="doDownload(1)">
                下载合同文件
              </button>
              <button
                class="btn-ripple fit-text"
                @click="doYiYi()"
                v-if="info.billConfirm == 0"
              >
                有异议
              </button>
              <button
                class="btn-ripple fit-text btn-bg"
                @click="doOfflinePay()"
                v-if="info.billConfirm != 1"
              >
                确认无误
              </button>
            </div>
          </div>
        </div>
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

    <xianxia_submit2 ref="xianxia" @confirm="emitConfirm"></xianxia_submit2>
  </div>
</template>

<script>
import { mapState } from "vuex";
import xianxia_submit2 from "@/components/order/xianxia_submit2.vue";

export default {
  name: "order-detail",
  components: {
    xianxia_submit2,
  },
  data() {
    return {
      id: this.$route.query.id,
      order_id: this.$route.query.id,
      info: {},
      payInfo: {},
      shouhuoInfo: {}, //收货人信息
      fahuoInfo: {}, //发货信息
      total_product_number: "",
      products: [],
      full_receive_address: "",
      //
      is_finish_pay: false, //
      //
      is_jifen_goods: false,
      //

      yiyi_info: {},
      yiyi_show: false,
      detail: {}, //订单信息

      pay_info: {}, //支付信息
      fahuo_info: {}, //发货信息
      invioceJson: {}, //发票
      peisong_info: {}, //门店配送信息
      peisong_type_text: "",
      peisong_type: "",

      is_payed: false, //是否已支付
      is_fahuo: false, //是否已发货
      is_mendian_peisong: false, //是否门店配送

      shequ: {},

      xianxia_imgs: [], //线下凭证信息
      is_xianxia: false, //是否线下转款
      pay_type: "", //支付方式
      invoiceList: [], //开票信息列表
      paymentList: [], //付款记录列表
    };
  },
  computed: {
    ...mapState([""]),
    getPayStatusText() {
      return (payStatus) => {
        switch (payStatus) {
          case -1:
            return "所有";
          case 0:
            return "待付款";
          case 1:
            return "部分付款";
          case 2:
            return "已付款";
        }
      };
    },
  },
  created() {
    this.setView();
  },
  methods: {
    emitConfirm() {
      this.setView();
    },
    setView() {
      this.query_order();
    },

    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_getBillOrderDetail",
          id: this.id,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.info = data.order;

          this.payInfo = JSON.parse(data.order.priceJson || "{}");
          this.products = JSON.parse(data.order.productJson || "[]");
          this.fahuoInfo = JSON.parse(data.order.fahuoJson || "{}");
          this.invioceJson = JSON.parse(data.order.invioceJson || "{}");

          this.products.forEach((item) => {
            this.total_product_number += item.num;
          });

          //
          this.shouhuoInfo = JSON.parse(data.order.shouhuoJson);
          if (this.shouhuoInfo) {
            let { country, province, city, area, address } = this.shouhuoInfo;
            this.full_receive_address = [country, province, city, area, address]
              .filter((v) => v)
              .join(" ");
          }

          this.invoiceList = data.invoice;
          this.paymentList = data.bill;

          //凭证图片
          this.detail = data.order;
        }
      });
    },
    to_review(item) {
      this.$router.push({
        path: "/order-review-submit",
        query: {
          orderId: this.order_id,
          inventoryId: item.id,
        },
      });
    },

    doDownload(type) {
      // this.$api({
      //   url: "/service.php",
      //   method: "get",
      //   data: {
      //     action: "orders_downloadAttach",
      //     id: this.info.id,
      //     type: type,
      //   },
      // }).then((res) => {
      // });
    },
    doYiYi() {
      this.yiyi_show = true;
    },
    doYiYiSubmit() {
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "orders_billConfirm",
          orderId: this.info.id,
          type: 2,
          billConfirmNote: this.yiyi_info.remark,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.yiyi_show = false;
          this.setView();
        }
      });
    },
    doOfflinePay() {
      this.$refs.xianxia.init(this.info);
    },
  },
};
</script>

<style scoped lang="less">
.page {
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

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #f74747;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 24px;
  padding: 24px 32px;
  background: #fff;
}

.step-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 55px 0;

  .step-item {
    text-align: center;

    &.active {
      .step-number {
        .step-num {
          background: #f74747;
          color: #fff;
        }

        .step-line {
          background: #f74747;
        }
      }
    }

    .step-number {
      margin: 0 auto;
      display: flex;
      align-items: center;

      .step-line {
        width: 147px;
        height: 2px;
        background: #f5f5f5;

        &.step-line-1 {
          visibility: hidden;
        }

        &.step-line-6 {
          visibility: hidden;
        }
      }

      .step-num {
        width: 44px;
        height: 44px;
        line-height: 44px;
        background: #edf6fd;
        border-radius: 50%;

        font-size: 20px;
        font-family: sans-serif;
        font-weight: 400;
        color: #999999;
      }
    }

    .step-title {
      margin-top: 14px;
      margin-bottom: 10px;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
    }

    .btn_cb {
      width: 60px;
      height: 20px;
      margin: 0 auto;
      font-size: 12px;
      color: #fff;
      line-height: 20px;
      background: #f74747;
      cursor: pointer;
    }

    .step-date {
      height: 20px;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 12px;
      color: #808080;
    }
  }
}

.base-ctx {
  margin-bottom: 24px;
  min-height: 156px;
  background: #ffffff;
  border: 1px solid #e5e5e5;

  .base-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    .order-state {
      height: 30px;
      line-height: 30px;
      color: #f74747;
      font-size: 14px;
    }
  }

  .base-items {
    align-items: center;
    justify-content: space-between;
    display: flex;
    padding: 20px 25px;

    .base-item {
      margin-bottom: 30px;
      text-align: left;

      // flex: 1;
      .info-title {
        font-size: 14px;
        font-family: sans-serif;
        font-weight: 400;
        color: #999999;
        margin-bottom: 10px;
      }

      .info-content {
        min-height: 20px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #666;

        > div {
          margin-bottom: 5px;

          span {
            display: inline-block;
            // min-width: 80px;
          }
        }

        .info-item {
          display: flex;
          margin-bottom: 5px;

          .label {
            margin-right: 10px;
            width: 90px;
            color: #666;
          }

          .val {
            flex: 1;
            color: #000;
          }
        }
      }
    }

    .back {
      padding: 16px 20px;
      background: #fffdf1;
      .info-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 18px;
        color: #000000;
      }
      .info-content {
        .info-item {
          .label {
            width: 112px;
            text-align: right;
            color: #000;
            font-size: 16px;
          }
          .val {
            font-size: 16px;
            color: #000;
            display: flex;
            align-items: center;
            img {
              margin-left: 5px;
              width: 12px;
              height: 12px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}

.table-content {
  .info-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    font-family: Microsoft YaHei;
    color: #333333;

    thead {
      padding: 0 16px;
      th {
        padding: 12px 24px;
        text-align: left;
        font-weight: bold;
        border-bottom: 1px solid #e5e5e5;
        color: #333333;
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid #f5f5f5;

        &:hover {
          background: #fafafa;
        }

        td {
          padding: 12px 24px;
          color: #666666;
          vertical-align: middle;

          &:first-child {
            color: #333333;
          }
        }
      }
    }
  }

  .empty-data {
    padding: 40px 0;
    text-align: center;
    color: #999999;
    font-size: 14px;
  }
}

.order-product {
}

.pingzheng-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .pingzheng-item {
    border: 1px solid #eee;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}

.order-info {
  .money-yh {
    span {
      color: #04be02;
      font-weight: bold;
    }
  }

  .money-heji {
    span {
      color: #f74747;
      font-weight: bold;
    }
  }

  .zhifufangshi-wrap {
    margin-bottom: 0 !important;
    padding: 10px 0;
    width: 100%;
    border-top: 1px dashed #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .zhifufangshi {
      display: flex;
      align-items: center;

      .pay-item {
        display: flex;
        align-items: center;
        margin-left: 10px;

        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 24px;
        color: #f74747;

        .pay-title {
          margin-right: 5px;
        }

        .pay-money {
        }
      }
    }
  }

  .order-list-wrap {
    .info-item {
      border: 1px solid #f5f5f5;
      margin-bottom: 30px;
    }

    .info-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 24px;
      background: #f9f9f9;
      border-bottom: 1px solid #f5f5f5;

      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;

      .date {
      }

      .order-code {
        flex: 2;
        text-align: left;
        padding-left: 20px;
      }

      .order-state {
        height: 30px;
        line-height: 30px;
        color: #f74747;
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

            .title {
              width: fit-content;
              cursor: pointer;
              color: #333;
              font-size: 16px;
              font-weight: 500;

              &:hover {
                color: #f74747;
              }
            }
            .box-sku {
              text-align: left;
              min-width: 200px;
              color: #999;
              font-size: 16px;
            }
          }

          .box-num {
            text-align: center;
            min-width: 160px;
          }

          .box-price {
            text-align: center;
            min-width: 160px;

            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 14px;
            color: #ff0000;
          }
        }

        .goods-action {
          display: flex;
          align-items: center;
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
            background: #f74747;
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
  }

  // 商品信息汇总和订单操作

  .info-heji {
    background: #fafafa;
    padding: 24px 40px;
    border-top: 1px solid #f5f5f5;
    //   display: flex;
    align-items: center;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #666;

    .money-box {
      text-align: right;

      .count {
        font-weight: bold;
        color: #f74747;
      }

      .money-item {
        margin-bottom: 16px;
        display: flex;
        justify-content: flex-end;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
        }

        .value {
          min-width: 180px;
          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
        }

        .money-num {
          &.money-total {
            font-family: Arial, Arial;
            font-weight: bold;
            font-size: 20px;
            color: #ff0000;
          }
        }
      }
    }
  }

  .order-action-box {
    display: flex;
    justify-content: flex-end;

    .btn-box {
      // margin-top: 10px;

      button {
        transition: 0.3s;
        min-width: 200px;
        height: 48px;
        background: #ffffff;
        border-radius: 5px;
        border: 1px solid #dedede;
        font-weight: 400;
        font-size: 18px;
        color: #666666;

        & + button {
          margin-left: 20px;
        }

        &.btn-bg {
          background: #e5222b;
          border: 1px solid #e5222b;
          color: #fff;
        }

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
}
</style>
