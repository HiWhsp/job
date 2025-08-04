<template>
  <div class="page">
    <!-- 图片预览 -->
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->
    <div class="page-title flex-between">
      <span>订单详情</span>
      <button @click="$router.push('/order-list')">返回</button>
    </div>

    <div class="page-ctx">
      <div class="step-box">
        <div class="step-item active">
          <div class="step-number">
            <div class="step-line step-line-1"></div>
            <div class="step-num">1</div>
            <div class="step-line step-line-2"></div>
          </div>
          <div class="step-title">采购员{{ info.orderUser }}提交下单</div>
          <div class="step-date">{{ info.createdTime }}</div>
        </div>
        <div class="step-item" :class="{ active: info.shenheStatus >= 20 }">
          <div class="step-number">
            <div class="step-line step-line-3"></div>
            <div class="step-num">2</div>
            <div class="step-line step-line-4"></div>
          </div>
          <div class="step-title">
            采购员{{ info.shenheCaigouJson.name }}审核通过
          </div>
          <div class="step-date">{{ info.shenheCaigouJson.time }}</div>
        </div>
        <div class="step-item" :class="{ active: info.shenheStatus >= 30 }">
          <div class="step-number">
            <div class="step-line step-line-3"></div>
            <div class="step-num">3</div>
            <div class="step-line step-line-4"></div>
          </div>
          <div class="step-title">
            采购经理{{ info.shenheManagerJson.name }}审核通过
          </div>
          <div class="step-date">{{ info.shenheManagerJson.time }}</div>
        </div>
        <div class="step-item" :class="{ active: info.shenheStatus >= 40 }">
          <div class="step-number">
            <div class="step-line step-line-5"></div>
            <div class="step-num">4</div>
            <div class="step-line step-line-6"></div>
          </div>
          <div class="step-title">
            采购总监{{ info.shenheDirectorJson.name }}审核通过
          </div>
          <div class="step-date">{{ info.shenheDirectorJson.time }}</div>
        </div>
      </div>

      <div class="base-ctx">
        <div class="base-title">订单信息</div>
        <div class="base-items">
          <!--     3: "快递配送",
        4: "门店自取",
        5: "同城配送", -->

          <!-- v-if="peisong_type_text == '普通快递'" -->
          <div class="base-item">
            <div class="info-title">收货人信息</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">收货人：</div>
                <div class="val">
                  {{
                    shouhuoInfo.name ||
                    shouhuoInfo.firstName + shouhuoInfo.lastName ||
                    ""
                  }}
                </div>
              </div>
              <div class="info-item">
                <div class="label">手机号码：</div>
                <div class="val">{{ shouhuoInfo.phone }}</div>
              </div>
              <div class="info-item">
                <div class="label">详细地址：</div>
                <div class="val">
                  {{
                    shouhuoInfo.country +
                    shouhuoInfo.province +
                    shouhuoInfo.city +
                    shouhuoInfo.area +
                    shouhuoInfo.address
                  }}
                </div>
              </div>
            </div>
          </div>

          <div class="base-item">
            <div class="info-title">支付方式</div>
            <div class="info-content">
              <div class="info-item" v-if="is_finish_pay">
                <div class="label">支付方式：</div>
                <div class="val">
                  <span v-if="payInfo.balance">余额</span>
                </div>
              </div>
              <div class="info-item">
                <div class="label">支付方式：</div>
                <div class="val">采购金额支付</div>
              </div>
              <div class="info-item">
                <div class="label">下单时间：</div>
                <div class="val">
                  {{ info.createdTime }}
                </div>
              </div>
              <!-- <div class="date" v-if="orderObj.peisong_time">
              <span>配送时间:</span>
              {{ orderObj.peisong_time }}
            </div> -->
            </div>
          </div>

          <div class="base-item" v-if="invioceJson.invoiceType">
            <div class="info-title">发票信息</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">发票抬头:</div>
                <div class="val">{{ invioceJson.title }}</div>
              </div>
              <div class="info-item">
                <div class="label">纳税人识别号:</div>
                <div class="val">{{ invioceJson.shibiema }}</div>
              </div>
              <div class="info-item">
                <div class="label">注册地址:</div>
                <div class="val">{{ invioceJson.companyAddress }}</div>
              </div>
              <div class="info-item">
                <div class="label">注册电话:</div>
                <div class="val">{{ invioceJson.companyPhone }}</div>
              </div>
              <div class="info-item">
                <div class="label">开户银行:</div>
                <div class="val">{{ invioceJson.bankName }}</div>
              </div>
              <div class="info-item">
                <div class="label">银行账户:</div>
                <div class="val">{{ invioceJson.bankNo }}</div>
              </div>
            </div>
          </div>

          <!-- 物流信息 -->
          <div class="item" v-if="fahuo_info.company">
            <div class="info-title">发货信息</div>
            <div class="info-content">
              <div class="wuliu-name">
                <span>快递公司：</span>
                {{ fahuo_info.company }}
              </div>
              <div class="wuliu-code">
                <span>快递单号：</span>
                {{ fahuo_info.order_id }}
              </div>
            </div>
          </div>
          
          <!-- 订单备注 -->
          <div class="base-item" v-if="orderObj.remark">
            <div class="info-title">订单备注</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">备注:</div>
                <div class="val">{{ orderObj.remark }}</div>
              </div>
              <!-- <div class="wuliu-name">
                  <span>备注：</span>
                  {{ orderObj.remark }}
                </div> -->
            </div>
          </div>

          <!-- 采购审核意见 -->
          <div class="base-item" v-if="info.shenheCaigouMsg">
            <div class="info-title">采购审核意见</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">意见:</div>
                <div class="val">{{ info.shenheCaigouMsg }}</div>
              </div>
            </div>
          </div>
          <!-- 经理审核意见 -->
          <div class="base-item" v-if="info.shenheManagerMsg">
            <div class="info-title">经理审核意见</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">意见:</div>
                <div class="val">{{ info.shenheManagerMsg }}</div>
              </div>
            </div>
          </div>
          <!-- 总监审核意见 -->
          <div class="base-item" v-if="info.shenheDirectorMsg">
            <div class="info-title">总监审核意见</div>
            <div class="info-content">
              <div class="info-item">
                <div class="label">意见:</div>
                <div class="val">{{ info.shenheDirectorMsg }}</div>
              </div>
            </div>
          </div>

          <div class="item" v-if="peisong_type_text == '上门自提'">
            <div class="info-title">取货人信息</div>
            <div class="info-content">
              <div class="name">
                <span>取货人：</span>
                {{ shouhuoInfo.name }}
              </div>
              <div class="phone">
                <span>手机号码：</span>
                {{ shouhuoInfo.phone }}
              </div>
            </div>
          </div>

          <div class="item" v-if="peisong_type_text == '上门自提'">
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
          <div class="item" v-if="is_xianxia">
            <div class="info-title">转账凭证</div>
            <div class="info-content">
              <div class="wuliu-name">
                <!-- <span>转账凭证：</span> -->
                <div class="pingzheng-box">
                  <div
                    class="pingzheng-item"
                    v-for="(item, index) in xianxia_imgs"
                    :key="index"
                  >
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="item"
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
          <div class="info-item">
            <div class="info-title">
              <div class="date">{{ info.createdTime }}</div>
              <div class="order-code">
                订单号：
                <span>{{ info.orderNo }}</span>
              </div>
              <div class="order-state">{{ info.statusInfo }}</div>
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
                      <!-- <img :src="item.image" alt /> -->
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
                    </div>
                    <div class="box-sku">
                      <div class="goods-sku">{{ product_item.keyVals }}</div>
                    </div>
                    <div class="box-remark">
                      <div class="goods-remark">{{ product_item.remark }}</div>
                    </div>
                    <div class="box-num">x {{ product_item.num }}</div>
                    <div class="box-price">
                      {{ vuex_huobi }} {{ product_item.priceSale }}
                    </div>
                  </div>
                  <div class="goods-action" v-if="info.orderStatus == 5"></div>
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
                      >{{ vuex_huobi }}{{ payInfo.goods.price }}</span
                    >
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">运费：</span>
                  <div class="value">
                    <span class="money-num"
                      >{{ vuex_huobi }}{{ payInfo.yunfei||0 }}</span
                    >
                  </div>
                </div>
                <div class="money-item">
                  <span class="label">应付金额：</span>
                  <div class="value">
                    <span class="money-num money-total"
                      >{{ vuex_huobi
                      }}{{
                        (
                          parseFloat(info.priceJson.goods.totalPrice) +
                          parseFloat(payInfo.yunfei||0)
                        ).toFixed(2)
                      }}</span
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
                <!-- <div class="money-item">
                      <span class="label">优惠券： </span>
                      <span class="money-num">- {{vuex_huobi}}{{ money_coupon }}</span>
                    </div>
                    <div class="money-item">
                      <span class="label">积分抵扣： </span>
                      <span class="money-num">- {{vuex_huobi}}{{ money_jifen_dixian }}</span>
                    </div>
                    <div class="money-item">
                      <span class="label">佣金： </span>
                      <span class="money-num">- {{vuex_huobi}}{{ money_yongjin_dixian }}</span>
                    </div> -->

                <!-- <div class="zhifufangshi-wrap" v-if="isPayed">
                      <span>支付方式：</span>
                      <div class="zhifufangshi">
                        <div class="pay-item" v-for="(pay, index) in shiji_list_pay_info" :key="index">
                          <span class="pay-title">{{ pay.title }} </span>
                          <span class="pay-money">{{vuex_huobi}}{{ pay.money }}</span>
                        </div>
                      </div>
                    </div> -->
              </div>
            </div>
          </div>

          <!-- 订单操作 -->
          <div class="order-action-box">
            <div class="btn-box">
              <button
                v-if="
                  (info.shenheStatus == 10 && vuex_user.staffType == 1) ||
                  (info.shenheStatus == 20 && vuex_user.staffType == 2) ||
                  (info.shenheStatus == 30 && vuex_user.staffType == 3)
                "
                class="btn-ripple fit-text"
                @click="openReject()"
              >
                审批驳回
              </button>
              <button
                v-if="
                  (info.shenheStatus == 10 && vuex_user.staffType == 1) ||
                  (info.shenheStatus == 20 && vuex_user.staffType == 2) ||
                  (info.shenheStatus == 30 && vuex_user.staffType == 3)
                "
                class="btn-ripple fit-text btn-bg"
                @click="shenheShow = true"
              >
                审批通过
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="审核意见" width="600px" :visible.sync="shenheShow">
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入审核意见"
        v-model="textarea"
      >
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shenheShow = false">取 消</el-button>
        <el-button type="primary" @click="doVerify(2)">确 定</el-button>
      </div>
    </el-dialog>
    <Stock_reject_reason ref="reject" @confirm="doReject"></Stock_reject_reason>
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
  </div>
</template>

<script>
import Stock_reject_reason from "../../components/stock/stock_reject_reason";
import order_cancel_modal from "@/components/order/order_cancel_modal.vue"; //取消订单
import order_delete_modal from "@/components/order/order_delete_modal.vue"; //删除
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //收货
import order_refund_modal from "@/components/order/order_refund_modal.vue"; //售后

// import orderInfo from "@/components/order/orderInfo.vue"; //
import { mapState } from "vuex";

export default {
  name: "order-detail",
  components: {
    Stock_reject_reason,
    order_cancel_modal,
    order_delete_modal,
    order_receive_modal,
    order_refund_modal,
    // orderInfo,
  },
  data() {
    return {
      id: this.$route.query.id,
      order_id: this.$route.query.id,
      info: {
        shenheManagerJson: {},
        shenheDirectorJson: {},
        priceJson: {},
        shouhuoJson: {},
        payJson: [],
        fahuo: {},
        children: [],
      },
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
      shouhuoInfo: {},
      is_payed: false, //是否已支付
      is_fahuo: false, //是否已发货
      is_mendian_peisong: false, //是否门店配送

      shequ: {},

      xianxia_imgs: [], //线下凭证信息
      is_xianxia: false, //是否线下转款
      pay_type: "", //支付方式
      remark: "",
      textarea: "",
      shenheShow: false,
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {
    orderObj(data) {
      let { shouhuoJson, status, pay_info, fahuo_info, peisong_type, shequ } =
        data;

      this.peisong_type = peisong_type;
      this.shequ = shequ;
      this.shouhuoInfo = shouhuoJson;
      this.pay_info = pay_info;

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
    let blacklist = [0];
    if (blacklist.indexOf(this.vuex_user.staffType) > 0) {
      alert("权限不足");
      this.toRoute("/index");
    }
    this.setView();
  },
  methods: {
    emitConfirm() {
      this.setView();
    },
    setView() {
      this.query_order();
    },
    doVerify(mode) {
      let stat = "";
      if (this.vuex_user.staffType == 1) {
        if (mode == 1) {
          stat = 11;
        }
        if (mode == 2) {
          stat = 20;
        }
      }
      if (this.vuex_user.staffType == 2) {
        if (mode == 1) {
          stat = 21;
        }
        if (mode == 2) {
          stat = 30;
        }
      }
      if (this.vuex_user.staffType == 3) {
        if (mode == 1) {
          stat = 31;
        }
        if (mode == 2) {
          stat = 40;
        }
      }
      this.$api({
        url: "service.php",
        method: "post",
        data: {
          action:
            this.vuex_user.staffType == 1
              ? "orderC_cShenhe"
              : this.vuex_user.staffType == 2
              ? "orderC_mShenhe"
              : this.vuex_user.staffType == 3
              ? "orderC_dShenhe"
              : "",
          shenheCaigouMsg: this.vuex_user.staffType == 1 ? this.textarea : "",
          shenheManagerMsg: this.vuex_user.staffType == 2 ? this.textarea : "",
          shenheDirectorMsg: this.vuex_user.staffType == 3 ? this.textarea : "",
          id: this.info.id,
          status: stat,
          remark: this.remark,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          this.query_order();
        }
      });
      this.shenheShow=false
    },
    openReject() {
      this.$refs.reject.init({});
    },
    doReject(info) {
      console.log(info);
      this.remark = info;
      this.doVerify(1);
    },
    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orderC_shenheDetail",
          id: this.id,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          console.log(data);
          this.info = data;

          this.payInfo = data.priceJson;
          this.products = data.productJson;
          this.fahuoInfo = data.fahuo;
          this.invioceJson = data.invioceJson || {};
          this.is_finish_pay = parseFloat(data.pricePayed) > 0;
          for (let i = 0; i < this.products.length; i++) {
            this.total_product_number += this.products[i].num;
          }
          //
          this.shouhuoInfo = data.shouhuoJson;
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
    to_review(item) {
      this.$router.push({
        path: "/order-review-submit",
        query: {
          orderId: this.order_id,
          inventoryId: item.id,
        },
      });
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
    doRefund(item) {
      this.$refs.order_refund_modal.init(item);
    },

    emitConfirmDelete() {
      this.$router.back();
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
      background: #3b64fc;
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
          background: #3b64fc;
          color: #fff;
        }

        .step-line {
          background: #3b64fc;
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

  .base-items {
    //   display: flex;
    align-items: center;
    justify-content: space-between;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 25px;

    .base-item {
      width: 50%;
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

        .info-item {
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
      color: #3b64fc;
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
        color: #3b64fc;

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

        span {
        }
      }

      .order-state {
        // min-width: 96px;
        height: 30px;
        line-height: 30px;
        // background: #3B64FC;
        color: #3b64fc;
        // color: #fff;
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

            .title {
              width: fit-content;
              cursor: pointer;

              &:hover {
                color: #3b64fc;
              }
            }
          }

          .box-remark {
            text-align: center;
            min-width: 200px;
          }

          .box-sku {
            text-align: center;
            min-width: 200px;
          }

          .box-num {
            text-align: center;
            min-width: 200px;
          }

          .box-price {
            text-align: center;
            min-width: 200px;

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
            background: #3b64fc;
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
        color: #eb0f19;
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
        min-width: 120px;
        height: 32px;
        background: #ffffff;
        border-radius: 50px 50px 50px 50px;
        border: 1px solid #3b64fc;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #3b64fc;

        & + button {
          margin-left: 20px;
        }

        &.btn-bg {
          background: #3b64fc;
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
