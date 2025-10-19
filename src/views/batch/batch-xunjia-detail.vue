<template>
  <div class="page">
    <!-- 图片预览 -->
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->
    <div class="page-title flex-between">
      <span>询价单详情</span>
    </div>

    <div class="page-ctx">
      <!-- <div class="step-box">
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
      </div> -->

      <div class="base-ctx">
        <div class="base-title">
          <div class="data">{{ info.dtTime }}</div>
          <div class="data">询价单号：{{ info.xunjiaNo }}</div>
        </div>
        <div class="page-ctx">
          <div class="result-wrap">
            <div class="result-top">
              <div class="result-left">
                <div class="left-title">原始文件列</div>
                <div class="data-list">
                  <div
                    class="data-item"
                    v-for="(item, index) in info.xunjiaDetail"
                    :key="index"
                  >
                    <div class="check-box">
                      <input
                        type="checkbox"
                        :value="item.id"
                        v-model="checkedItem"
                      />
                    </div>
                    <div class="info-box">
                      <div class="xuhao">{{ index }}</div>
                      <div class="title">
                        编号 {{ item.brand }} 名称：{{
                          item.product_name || "空"
                        }}
                      </div>
                      <div class="num">数量：{{ item.num }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="result-right">
                <div class="right-title">
                  <div class="title">匹配结果列：商品信息</div>
                  <div class="title2">单价</div>
                  <div class="title2">状态</div>
                  <div class="title2">数量/操作</div>
                </div>
                <div class="match-list">
                  <div
                    class="match-item-loop"
                    v-for="(item, index) in info.xunjiaDetail"
                    :key="index"
                  >
                    <div class="match-item" v-if="info.xunjiaDetail">
                      <div class="poster-box">
                        <img :src="item.product.thumb" alt="" />
                      </div>
                      <div class="title-box">
                        <div class="title">
                          {{ item.product.title || "空" }}
                        </div>
                        <div class="brand-box">
                          <div class="brand">品牌名称：泰得力</div>
                          <div class="sku">订货编码：UA199</div>
                        </div>
                      </div>
                      <div class="price-box">
                        <span class="price"
                          >{{ vuex_huobi }}{{ item.product.price }}</span
                        >
                      </div>
                      <div class="order-state" :class="'state-' + info.status">
                        {{ info.status == 0 ? "待提交" : "" }}
                        {{ info.status == 1 ? "待处理" : "" }}
                        {{ info.status == 2 ? "待采购确认" : "" }}
                        {{ info.status == 3 ? "已下单" : "" }}
                        {{ info.status == -1 ? "后台取消" : "" }}
                        {{ info.status == -2 ? "用户取消" : "" }}
                      </div>

                      <div class="num-box">
                        <el-input-number
                          v-model="item.num"
                          :min="1"
                          label="描述文字"
                        ></el-input-number>
                        <div class="btn-box">
                          <button class="btn-ripple btn-sc">加入购物车</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="result-bottom">
              <div class="bottom-action-box">
                <div class="left-acts flex">
                  <div class="all-select">
                    <el-checkbox
                      v-model="checked_all"
                      @change="on_change_checked_all"
                      >{{ checked_all ? "反选" : "全选" }}</el-checkbox
                    >
                  </div>
                  <div class="delete-box">
                    <span
                      data-fn="do_cart_remove_select"
                      @click="do_cart_remove_select_tip()"
                      >删除选中</span
                    >
                  </div>
                  <div class="num-box flex">
                    <div class="num-item">
                      <span class="label">总需求数：</span>
                      <span class="value">{{ info.length }}件</span>
                    </div>
                    <div class="num-item">
                      <span class="label">已报价：</span>
                      <span class="value">{{ info.length }}件</span>
                    </div>
                    <div class="num-item">
                      <span class="label">待报价：</span>
                      <span class="value">{{ 0 }}件</span>
                    </div>
                  </div>
                </div>
                <div class="right-acts flex">
                  <div class="total-number">
                    已选中：
                    <b>{{ checkedItem.length }}</b>
                  </div>

                  <button
                    :disabled="jiesuanDisabled"
                    class="btn-ripple btn-sc"
                    @click="doConfirm()"
                  >
                    去询价
                  </button>
                  <button
                    :disabled="jiesuanDisabled"
                    class="btn-ripple btn-cart"
                    @click="toCart()"
                  >
                    加入购物车
                  </button>
                </div>
              </div>
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

      checkedItem: [],
      checkedAttr: [],
      checked_all: false,
      jiesuanDisabled: false,
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
          for (let i = 0; i < this.info.xunjiaDetail.length; i++) {
            this.checkedAttr.push(this.info.xunjiaDetail[i].id);
          }
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

    on_change_checked_all() {
      // 判断全选复选框是否选中
      if (this.checked_all) {
        // 如果全选复选框被选中,则重新给选项复选框赋值,即选中所有的选项复选框
        this.checkedItem = this.checkedAttr;
      } else {
        // 如果全选复未选框被选中,则设置为空值,即未选中所有的选项复选框
        this.checkedItem = [];
      }
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
      background: #2E4C87;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  .result-wrap {
    position: relative;
    z-index: 2;
    background: #ffffff;
  }
  .result-top {
    display: flex;
    align-items: flex-start;

    .result-left {
      .left-title {
        height: 48px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        line-height: 48px;
      }
      .data-list {
        .data-item {
          margin-bottom: 20px;
          background: #f7f7f7;
          width: 315px;
          padding: 10px;
          display: flex;
          align-items: flex-start;
          height: 113px;
          border-top: 1px solid #2E4C87;
          .check-box {
            width: 35px;
            text-align: center;
          }
          .info-box {
            flex: 1;
            .xuhao {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 12px;
              color: #2E4C87;
            }
            .title {
              margin: 10px 0;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 12px;
              color: #333333;
            }
            .num {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 12px;
              color: #333333;
            }
          }
        }
      }
    }
    .result-right {
      margin-left: 47px;
      flex: 1;
      .right-title {
        height: 48px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        line-height: 48px;
        display: flex;
        align-items: center;
        margin-right: 80px;
        .title {
          flex: 1;
        }
        .title2 {
          width: 100px;
          text-align: center;
        }
      }

      .match-item {
        margin-bottom: 0;
        background: #fff;
        width: 100%;
        padding: 20px 0;
        display: flex;
        align-items: flex-start;
        height: 133px;
        border-top: 1px solid #2E4C87;

        .poster-box {
          width: 80px;
          height: 80px;
          img {
            width: 80px;
            height: 80px;
          }
        }
        .title-box {
          margin-left: 18px;
          flex: 1;
          .title {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
          }
          .brand-box {
            width: 300px;
            .brand {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 14px;
              color: #999;
            }
            .sku {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 14px;
              color: #999;
            }
          }
        }
        .price-box {
          text-align: center;
          width: 100px;
          margin-top: 10px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
        .order-state {
          text-align: center;
          width: 100px;
          color: #333;
          font-size: 14px;
          margin-top: 10px;
        }
      }
      .num-box {
        .btn-sc {
          margin-top: 10px;
          cursor: pointer;
          width: 180px;
          height: 46px;
          background: #fff2f2;
          border: 1px solid #2E4C87;

          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #2E4C87;
          transition: 0.3s;
          user-select: none;

          &:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
        }
      }
    }
  }
  .bottom-action-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 40px;
    height: 86px;
    background: #fafbfc;
    // border: 1px solid #eeeeee;
    // box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
    opacity: 1;
    margin-top: 40px;
    padding-left: 16px;
    .all-select {
      cursor: pointer;
      min-width: 120px;
      width: fit-content;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
    }

    .delete-box {
      cursor: pointer;
      width: fit-content;
      margin-right: 16px;
      span {
        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 14px;
        color: #666666;

        &:hover {
          color: #2E4C87;
        }
      }
    }

    .clear-box {
      cursor: pointer;
      margin-left: 64px;
      flex: 2;
      text-align: left;

      span {
        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 14px;
        color: #666666;

        &:hover {
          color: #2E4C87;
        }
      }
    }

    .num-box {
      .num-item {
        margin-right: 30px;
        .label {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 12px;
          color: #666666;
        }
        .value {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 12px;
          color: #2E4C87;
        }
      }
    }

    .total-number {
      width: fit-content;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;

      b {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 20px;
        color: #f13f17;
      }
    }

    .total-price {
      margin-left: 60px;
      margin-right: 60px;
      width: fit-content;

      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;

      b {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 20px;
        color: #f13f17;
      }
    }
    .btn-sc {
      margin-left: 20px;
      cursor: pointer;
      width: 191px;
      height: 46px;
      background: #ff9900;

      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      transition: 0.3s;
      user-select: none;

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
    .btn-cart {
      margin-left: 20px;
      cursor: pointer;
      width: 191px;
      height: 46px;
      background: #2E4C87;

      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      transition: 0.3s;
      user-select: none;

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
  }
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
          background: #2E4C87;
          color: #fff;
        }

        .step-line {
          background: #2E4C87;
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
  margin-top: 10px;
  background: #ffffff;
  padding: 20px 34px;

  .base-title {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 24px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    color: #333;
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
      color: #2E4C87;
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
        color: #2E4C87;

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
                color: #2E4C87;
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
            background: #2E4C87;
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
        color: #2E4C87;
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
        border: 1px solid #2E4C87;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #2E4C87;

        & + button {
          margin-left: 20px;
        }

        &.btn-bg {
          background: #2E4C87;
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
