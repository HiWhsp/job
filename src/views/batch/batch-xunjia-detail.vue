<template>
  <div class="page">
    <!-- 图片预览 -->
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->
    <div class="page-title flex-between">
      <span>询价单号 {{ info.xunjiaNo }}</span>
      <button @click="$router.push('/batch-xunjia-list')">返回</button>
    </div>

    <div class="page-ctx">
      <div class="step-box">
        <div class="step-info active">
          <div class="step-number">
            <div class="step-line step-line-1"></div>
            <div class="step-num">1</div>
            <div class="step-line step-line-2"></div>
          </div>
          <div class="step-title">提交报价</div>
          <div class="step-date">{{ info.dtTime }}</div>
        </div>
        <div
          class="step-info"
          :class="{ active: info.status >= 2 || info.status < 0 }"
        >
          <div class="step-number">
            <div class="step-line step-line-3"></div>
            <div class="step-num">2</div>
            <div class="step-line step-line-4"></div>
          </div>
          <div class="step-title">操作审核</div>
          <div class="step-date" style="visibility: hidden">-</div>
        </div>
        <div
          class="step-info"
          :class="{ active: info.status >= 3 || info.status < 0 }"
        >
          <div class="step-number">
            <div class="step-line step-line-5"></div>
            <div class="step-num">3</div>
            <div class="step-line step-line-6"></div>
          </div>
          <div class="step-title">
            {{
              info.status >= 0
                ? "订单完成"
                : info.status == -1
                ? "后台取消"
                : "用户取消"
            }}
          </div>
          <div class="step-date" style="visibility: hidden">-</div>
        </div>
      </div>

      <div class="base-ctx">
        <div class="base-title">订单信息</div>
        <div class="base-infos">
          <div class="base-info">
            <div class="info-content">
              <div class="info-group">
                <div class="info-info">
                  <div class="label">制单日期</div>
                </div>
                <div class="info-info">
                  <div class="label">{{ info.dtTime }}</div>
                </div>
              </div>
              <div class="info-group">
                <div class="info-info">
                  <div class="label">会员信息</div>
                </div>
                <div class="info-info">
                  <div class="label">{{ info.user.nickname }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="base-info">
            <div class="info-content">
              <div class="info-group">
                <div class="info-info">
                  <div class="label">最近报价完成时间</div>
                </div>
                <div class="info-info">
                  <div>{{ info.editTime || "--" }}</div>
                </div>
              </div>
              <div class="info-group">
                <div class="info-info">
                  <div class="label">会员编号</div>
                  <div class="val"></div>
                </div>
                <div class="info-info">
                  <div class="label">{{ info.user.id }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="base-info">
            <div class="info-content">
              <div class="info-group">
                <div class="info-info">
                  <div class="label">报价有效期</div>
                </div>
                <div class="info-info">
                  <div class="label">{{ info.endTime }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="base-info" v-if="invioceJson.invoiceType">
            <div class="info-title">发票信息</div>
            <div class="info-content">
              <div class="info-info">
                <div class="label">发票抬头:</div>
                <div class="val">{{ invioceJson.title }}</div>
              </div>
              <div class="info-info">
                <div class="label">纳税人识别号:</div>
                <div class="val">{{ invioceJson.shibiema }}</div>
              </div>
              <div class="info-info">
                <div class="label">注册地址:</div>
                <div class="val">{{ invioceJson.companyAddress }}</div>
              </div>
              <div class="info-info">
                <div class="label">注册电话:</div>
                <div class="val">{{ invioceJson.companyPhone }}</div>
              </div>
              <div class="info-info">
                <div class="label">开户银行:</div>
                <div class="val">{{ invioceJson.bankName }}</div>
              </div>
              <div class="info-info">
                <div class="label">银行账户:</div>
                <div class="val">{{ invioceJson.bankNo }}</div>
              </div>
            </div>
          </div>

          <!-- 物流信息 -->
          <div class="info" v-if="fahuo_info.company">
            <div class="info-title">发货信息</div>
            <div class="info-content">
              <div class="wuliu-name">
                <span>快递公司：</span>
                {{ fahuo_info.company }}
              </div>
              <div class="wuliu-code">
                <span>物流单号：</span>
                {{ fahuo_info.order_id }}
              </div>
            </div>
          </div>
          <!-- 物流信息 -->
          <div class="info" v-if="orderObj.remark">
            <div class="info-title">订单备注</div>
            <div class="info-content">
              <div class="wuliu-name">
                <span>备注：</span>
                {{ orderObj.remark }}
              </div>
            </div>
          </div>

          <div class="info" v-if="peisong_type_text == '上门自提'">
            <div class="info-title">厂家信息</div>
            <div class="info-content">
              <div class="phone">
                <span>联系方式：</span>
                {{ shequ.phone }}
              </div>
              <div class="address">
                <span>厂家地址：</span>
                {{ shequ.address }}
              </div>
            </div>
          </div>

          <!-- 转款凭证 -->
          <div class="info" v-if="is_xianxia">
            <div class="info-title">转账凭证</div>
            <div class="info-content">
              <div class="wuliu-name">
                <!-- <span>转账凭证：</span> -->
                <div class="pingzheng-box">
                  <div
                    class="pingzheng-info"
                    v-for="(info, index) in xianxia_imgs"
                    :key="index"
                  >
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="info"
                      :preview-src-list="xianxia_imgs"
                    >
                    </el-image>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单商品信息 -->
      <div class="order-product order-info">
        <div class="order-list-wrap">
          <!-- 商品信息 -->
          <div class="info-wrapper">
            <div class="info-info">
              <div class="info-title">
                <div class="box-title">商品详情</div>
                <div class="box-sku">状态</div>
                <div class="box-remark">平台备注</div>
                <div class="box-num">数量</div>
                <div class="box-price">单价</div>
                <div class="box-price">小计</div>
                <div class="box-date">订货日</div>
                <div class="box-date">报价完成时间</div>
              </div>
              <div class="info-good">
                <div class="list-good">
                  <div
                    class="info"
                    v-for="(product_info, index) in info.xunjiaDetail"
                    :key="index"
                  >
                    <div class="info-good flex">
                      <div
                        class="box-image cover"
                        @click="mix_to_product(product_info)"
                      >
                        <!-- <img :src="info.image" alt /> -->
                        <el-image :src="product_info.product.thumb">
                          <div slot="error" class="image-slot">
                            <img :src="product_info.product.thumb" />
                          </div>
                        </el-image>
                      </div>
                      <div class="box-title">
                        <div
                          class="title"
                          @click="mix_to_product(product_info)"
                        >
                          {{ product_info.sku }}
                        </div>
                        <div class="product-sku">{{ product_info.brand }}</div>
                      </div>
                      <div class="box-sku">
                        <div
                          class="order-state"
                          :class="'state-' + info.status"
                        >
                          {{ info.status == 0 ? "待提交" : "" }}
                          {{ info.status == 1 ? "待处理" : "" }}
                          {{ info.status == 2 ? "待采购确认" : "" }}
                          {{ info.status == 3 ? "已下单" : "" }}
                          {{ info.status == -1 ? "后台取消" : "" }}
                          {{ info.status == -2 ? "用户取消" : "" }}
                        </div>
                      </div>
                      <div class="box-remark">
                        <div>{{ product_info.remark || "--" }}</div>
                      </div>
                      <div class="box-num">x {{ product_info.num }}</div>
                      <div class="box-price">
                        {{ vuex_huobi }} {{ product_info.baojiaPrice }}
                      </div>

                      <div class="box-subtotal">
                        {{ vuex_huobi }}
                        {{ product_info.baojiaPrice * product_info.num }}
                      </div>
                      <div class="box-date">
                        <div>{{ product_info.dtTime }}</div>
                      </div>
                      <div class="box-date">
                        <div>{{ product_info.editTime || "--" }}</div>
                      </div>
                    </div>
                    <div class="goods-action" v-if="info.orderStatus == 5">
                      <!-- <button v-if="!is_jifen_goods && info.allow_actions.allow_refund" class="btn-goods-action" @click="refundApply(info)">申请售后</button> -->
                      <!-- <button v-if="info.ifshouhou" class="btn-goods-action disabled">已售后</button> -->
                      <!-- <button v-if="info.allow_actions.allow_logistics" class="btn-goods-action" @click="toRoute(`/orderLogistics?order_id=${order_id}&logistics_id=${fahuo_id}`)">查看物流</button> -->
                      <button
                        v-if="product_info.ifComment == 0"
                        class="btn-goods-action"
                        @click="to_review(product_info)"
                      >
                        商品评价
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 订单操作 -->
          <div class="order-action-box">
            <div class="btn-box">
              <button class="btn-ripple fit-text" @click="getList()">
                下载报价单
              </button>
              <button
                v-if="info.status == 0 || info.status == 1"
                class="btn-ripple fit-text btn-bg"
                @click="doCancel(info)"
              >
                取消报价
              </button>
              <button
                v-if="info.status == 0"
                class="btn-ripple fit-text btn-bg"
                @click="doSubmit(info)"
              >
                提交报价
              </button>
              <button
                v-if="info.status == 2"
                class="btn-ripple fit-text btn-bg"
                @click="doPay()"
              >
                去订购
              </button>
            </div>
          </div>
        </div>
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
import order_cancel_modal from "@/components/batch/batch_cancel_modal.vue"; //取消订单
import batch_xunjia_popupVue from "@/components/batch/batch_xunjia_popup.vue";

// import orderInfo from "@/components/order/orderInfo.vue"; //
import { mapState } from "vuex";

export default {
  name: "order-detail",
  components: {
    order_cancel_modal,
    batch_xunjia_popupVue,
    // orderInfo,
  },
  data() {
    return {
      id: this.$route.query.id,
      order_id: this.$route.query.id,
      info: {},
      payInfo: {},
      shouhuoInfo: {}, //收货人信息
      fahuoInfo: {}, //发货信息
      total_product_number: 0,
      products: [],
      full_receive_address: "",
      //
      is_finish_pay: false, //
      //
      is_jifen_goods: false,
      //

      orderObj: {}, //订单信息
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
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {
    orderObj(data) {
      let { shouhuoInfo, status, pay_info, fahuo_info, peisong_type, shequ } =
        data;

      this.peisong_type = peisong_type;
      this.shequ = shequ;
      // this.shouhuoInfo = shouhuoInfo;
      // this.pay_info = pay_info;

      //订单状态码(-5待支付 -3售后处理中 -1无效 0待成团 2待发货 3待收货 4已收货)
      if (status != -5 && status != -1 && status != 0) {
        this.is_payed = true;
      }

      //配送方式
      let peisong_map = {
        1: "上门自提",
        2: "社区配送",
        3: "普通快递",
        4: "",
        5: "",
      };

      //社区购配送方式(1自提 2社区配送 3快递)

      this.peisong_type_text = peisong_map[peisong_type] || "";
      //门店配送订单需要显示配送员信息
      if (this.peisong_type_text == "同城配送") {
        this.is_mendian_peisong = true;
        this.peisong_info = fahuo_info;
      }

      //发货信息
      if (fahuo_info && fahuo_info.company) {
        this.fahuo_info = fahuo_info;
        this.is_fahuo = true; //已经发货
      }
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
    doConfirm(params) {
      console.log(params);
      let infos = params;
      infos.xunjiaid = this.fullInfo.id;
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action:
            this.vuex_user.type == 1 ? "orders_create" : "orderC_createOrder",
          ...infos,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          // this.query_order();
          this.toRoute({
            path: "/order-detail",
            query: {
              id: res.data.id,
            },
          });
        }
      });
    },
    doSubmit() {
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "product_submitXunjia",
          filepath: this.info.filePath,
          id: this.info.id,
        },
      }).then((res) => {
        alert(res);
        this.query_order();
      });
    },
    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_xunjiaDetail",
          id: this.id,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.info = data;
          console.log(this.info);
          // this.payInfo = data.payInfo;
          this.products = data.products;
          // this.fahuoInfo = data.fahuoInfo;
          this.invioceJson = data.invioceJson || {};
          this.is_finish_pay = parseFloat(data.pricePayed) > 0;

          //
          // this.shouhuoInfo = data.shouhuoInfo;
          // if (data.shouhuoInfo) {
          //   let { country, province, city, area, address } = data.shouhuoInfo;
          //   this.full_receive_address = [country, province, city, area, address]
          //     .filter((v) => v)
          //     .join(" ");
          // }

          //
          //支付方式

          //凭证图片
          this.orderObj = data;
          this.detail = data;
        }
      });
    },
    to_review(info) {
      this.$router.push({
        path: "/order-review-submit",
        query: {
          orderId: this.order_id,
          inventoryId: info.id,
        },
      });
    },

    doCancel(info) {
      this.$refs.order_cancel_modal.init(info);
    },
    doPay() {
      this.$refs.popup.init(this.info.xunjiaDetail);
    },
    doDelete(info) {
      this.$refs.order_delete_modal.init(info);
    },
    doReceive(info) {
      this.$refs.order_receive_modal.init(info);
    },
    doRefund(info) {
      this.$refs.order_refund_modal.init(info);
    },
    getList() {
      window.location.href = this.info.filePath;
    },
    emitConfirmDelete() {
      this.$router.back();
    },
  },
};
</script>

<style scoped lang="less">
.page {
  width: 100%;
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
    width: 100%;
    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #3B64FC;
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
  width: 100%;
}

.step-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 55px 0;

  .step-info {
    text-align: center;

    &.active {
      .step-number {
        .step-num {
          background: #3B64FC;
          color: #fff;
        }

        .step-line {
          background: #3B64FC;
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

    .step-date {
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
  border: 1px solid #f5f5f5;

  .base-title {
    text-align: left;
    padding-left: 24px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    border-bottom: 1px solid #f5f5f5;

    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;

    color: #333333;
  }

  .base-infos {
    //   display: flex;
    align-items: flex-start;
    justify-content: space-between;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 25px;

    .base-info {
      width: calc(100% / 3);
      margin-bottom: 30px;
      text-align: left;
      padding-right: 40px;

      // flex: 1;
      .info-title {
        font-size: 14px;
        font-family: sans-serif;
        font-weight: 400;
        color: #999999;
        color: #333;
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
        .info-group {
          margin-top: 16px;
        }

        .info-info {
          display: flex;
          margin-bottom: 5px;
          .label {
            margin-right: 10px;
            width: fit-content;
          }

          .val {
            flex: 1;
          }
        }
      }
    }
  }
}

.order-product {
}

.pingzheng-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .pingzheng-info {
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
      color: #3B64FC;
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

      .pay-info {
        display: flex;
        align-items: center;
        margin-left: 10px;

        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 24px;
        color: #3B64FC;

        .pay-title {
          margin-right: 5px;
        }

        .pay-money {
        }
      }
    }
  }

  .order-list-wrap {
    .info-wrapper {
      position: relative;
      width: 100%;
      height: 480px;
      overflow: auto;
    }
    .info-info {
      position: absolute;
      top: 0;
      bottom: 0;
      border: 1px solid #f5f5f5;
      margin-bottom: 30px;
      // overflow-x: auto;
      // max-width: 70vw;
    }

    .info-title {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      height: 48px;
      padding: 0 24px;
      background: #f9f9f9;
      border-bottom: 1px solid #f5f5f5;
      // width: 150%;
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

        span {
        }
      }

      .order-state {
        // min-width: 96px;
        height: 30px;
        line-height: 30px;
        // background: #3b64fc;
        color: #3B64FC;
        // color: #fff;
        font-size: 14px;
      }
      .box-title {
        // flex: 1;
        text-align: left;
        width: 700px;
      }

      .box-sku {
        text-align: center;
        width: 100px;
      }
      .box-remark {
        width: 256px;
        text-align: center;
      }
      .box-num {
        text-align: center;
        width: 100px;
      }
      .box-date {
        text-align: center;
        width: 256px;
      }
      .box-price,
      .box-subtotal {
        text-align: center;
        width: 200px;
      }
    }

    .info-good {
      // width: 120%;
      box-sizing: border-box;
      .list-good {
        box-sizing: border-box;
        .info {
          border-bottom: 1px solid #f5f5f5;

          &:last-child {
            border-bottom: none;
          }
        }

        .info-good {
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
            // flex: 1;
            text-align: left;
            padding-left: 40px;
            width: 600px;
            .title {
              width: fit-content;
              cursor: pointer;

              &:hover {
                color: #3B64FC;
              }
            }
          }

          .box-sku {
            text-align: center;
            width: 100px;
          }
          .box-remark {
            width: 256px;
            text-align: center;
          }
          .box-num {
            text-align: center;
            width: 100px;
          }
          .box-date {
            text-align: center;
            width: 256px;
          }
          .box-price,
          .box-subtotal {
            text-align: center;
            width: 200px;

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
            background: #3B64FC;
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
        color: #3B64FC;
      }

      .money-info {
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
        min-width: 120px;
        height: 32px;
        background: #ffffff;
        border-radius: 50px 50px 50px 50px;
        border: 1px solid #3B64FC;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #3B64FC;

        & + button {
          margin-left: 20px;
        }

        &.btn-bg {
          background: #3B64FC;
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

<style scoped lang="less" src="@/assets/h5css/shop/order-detail.less"></style>
<style scoped lang="less" src="@/assets/h5css/shop/orderInfo.less"></style>
