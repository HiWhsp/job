<template>
  <div class="page">
    <!-- 图片预览 -->
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->

    <div class="main-title">
      <div>订单号：122522545265110200</div>
      <div>下单时间：2020-12-28 12:24:30</div>
      <!-- <button @click="$router.push('/order-list')">返回</button> -->
    </div>

    <div class="page-ctx">
      <div class="step-box">
        <div class="step-item active">
          <div class="step-number">
            <div class="step-line step-line-1"></div>
            <div class="step-num">1</div>
            <div class="step-line step-line-2"></div>
          </div>
          <div class="step-title">下单时间</div>
          <div class="step-date">
            {{ info.createdTime || "2022-11-20 15:15:40" }}
          </div>
        </div>

        <div class="step-item" :class="{ active: info.orderStatus >= 3 }">
          <div class="step-number">
            <div class="step-line step-line-3"></div>
            <div class="step-num">2</div>
            <div class="step-line step-line-4"></div>
          </div>
          <div class="step-title">审核</div>
          <div class="step-date" style="visibility: hidden">-</div>
        </div>
        <div class="step-item" :class="{ active: info.orderStatus >= 3 }">
          <div class="step-number">
            <div class="step-line step-line-3"></div>
            <div class="step-num">3</div>
            <div class="step-line step-line-4"></div>
          </div>
          <div class="step-title">发货</div>
          <div class="step-date" style="visibility: hidden">-</div>
        </div>
        <div class="step-item" :class="{ active: info.orderStatus >= 3 }">
          <div class="step-number">
            <div class="step-line step-line-3"></div>
            <div class="step-num">4</div>
            <div class="step-line step-line-4"></div>
          </div>
          <div class="step-title">收货</div>
          <div class="step-date" style="visibility: hidden">-</div>
        </div>
        <div class="step-item" :class="{ active: info.orderStatus >= 5 }">
          <div class="step-number">
            <div class="step-line step-line-5"></div>
            <div class="step-num">5</div>
            <div class="step-line step-line-6"></div>
          </div>
          <div class="step-title">已完成</div>
          <div class="step-date" style="visibility: hidden">-</div>
        </div>
      </div>

      <div class="order-other">
        <div class="title">订单信息</div>
        <div class="other">
          <!--     3: "快递配送",
        4: "门店自取",
        5: "同城配送", -->

          <!-- v-if="peisong_type_text == '普通快递'" -->
          <div class="item">
            <div class="item-title">收货人信息</div>
            <div class="item-content">
              <div class="name">
                <span>收货人：</span>
                <span>{{ shouhuoInfo["收件人"] || "张三" }}</span>
              </div>
              <div class="phone">
                <span>收货电话：</span>
                <span>{{ shouhuoInfo["手机号"] || "15931263145" }}</span>
              </div>
              <div class="address">
                <span>收货地址：</span>
                <div>
                  {{
                    full_receive_address ||
                    "详细地址详细地址详细地址详细地址详细地址详细地址 详细地址详细地址"
                  }}
                </div>
              </div>
              <!-- <div class="address">
              <span>邮编：</span>
              {{ shouhuoInfo.postCode }}
            </div> -->
            </div>
            <div class="item-title">支付及支付方式</div>
            <div class="item-content">
              <div class="name">
                <span>支付方式：</span>{{ shouhuoInfo["收件人"] || "对公转账" }}
              </div>
              <div class="phone">
                <span>下单时间：</span
                >{{ shouhuoInfo["手机号"] || "2022-10-22 12:30:24" }}
              </div>
              <div class="address">
                <span>支付凭证：</span>
                <div class="payment-voucher">
                  <img src="" alt="" />
                </div>
              </div>
              <!-- <div class="address">
              <span>邮编：</span>
              {{ shouhuoInfo.postCode }}
            </div> -->
            </div>
            <div class="item-title">配送信息</div>
            <div class="item-content">
              <div class="name">
                <span>配送方式：</span>
                {{ shouhuoInfo["收件人"] || "顺丰快递" }}
              </div>
              <div class="phone">
                <span>快递号</span>
                {{ shouhuoInfo["手机号"] || "456456456456456456" }}
              </div>
              <div class="">
                <span>发货时间：</span>
                {{ full_receive_address || "2022-10-22 12:30:24" }}
              </div>
              <!-- <div class="address">
              <span>邮编：</span>
              {{ shouhuoInfo.postCode }}
            </div> -->
            </div>
          </div>

          <!-- <div class="item">
            <div class="item-title">支付及支付方式</div>
            <div class="item-content">
              <div class="date" v-if="is_finish_pay">
                <span>支付方式：</span>
                <span class="val">{{ peisong_type_text }}</span>
              </div>

              <div class="data flex payImg">
                <span>支付凭证：</span>
                <img src="@/static/account/demo-code.png" alt="">
              </div>

              <div class="date">
                <span>下单时间：</span>
                {{ orderObj.createdTime }}
              </div>

              <!--              <div class="pay-type">-->
          <!--                <span>配送方式：</span>-->
          <!--                {{ fahuoInfo.expressName || '' }} {{ fahuoInfo.expressOrder || '' }}-->
          <!--              </div>-->

          <!-- <div class="date" v-if="orderObj.peisong_time">
              <span>配送时间:</span>
              {{ orderObj.peisong_time }}
            </div> -->
          <!-- </div> -->
          <!-- </div> -->

          <!--          <div class="item" v-if="peisong_type_text == '上门自提'">-->
          <!--            <div class="item-title">取货人信息</div>-->
          <!--            <div class="item-content">-->
          <!--              <div class="name">-->
          <!--                <span>取货人：</span>-->
          <!--                {{ shouhuoInfo.name }}-->
          <!--              </div>-->
          <!--              <div class="phone">-->
          <!--                <span>手机号码：</span>-->
          <!--                {{ shouhuoInfo.phone }}-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->

          <!--          <div class="item" v-if="peisong_type_text == '上门自提'">-->
          <!--            <div class="item-title">厂家信息</div>-->
          <!--            <div class="item-content">-->
          <!--              <div class="phone">-->
          <!--                <span>联系方式：</span>-->
          <!--                {{ shequ.phone }}-->
          <!--              </div>-->
          <!--              <div class="address">-->
          <!--                <span>厂家地址：</span>-->
          <!--                {{ shequ.address }}-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->

          <!-- 转款凭证 -->
          <!--          <div class="item" v-if="is_xianxia">-->
          <!--            <div class="item-title">转账凭证</div>-->
          <!--            <div class="item-content">-->
          <!--              <div class="wuliu-name">-->
          <!--                &lt;!&ndash; <span>转账凭证：</span> &ndash;&gt;-->

          <!--                <div class="pingzheng-box">-->
          <!--                  <div class="pingzheng-item" v-for="(item, index) in xianxia_imgs" :key="index">-->
          <!--                    <el-image style="width: 100px; height: 100px" :src="item" :preview-src-list="xianxia_imgs">-->
          <!--                    </el-image>-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->

          <!-- 物流信息 -->
          <div class="item" v-if="fahuo_info.expressName">
            <div class="item-title">物流信息</div>
            <div class="item-content">
              <div class="wuliu-name">
                <span>配送方式：</span>
                {{ fahuo_info.expressName }}
              </div>
              <div
                class="wuliu-code flex pointer"
                @click="copy(fahuo_info.expressOrder)"
              >
                <span>快递单号：</span>
                {{ fahuo_info.expressOrder }}
                <img src="@/static/account/copy.png" alt="" />
              </div>
            </div>
          </div>
          <!-- 物流信息 -->
          <div class="item" v-if="orderObj.remark">
            <div class="item-title">订单备注</div>
            <div class="item-content">
              <div class="wuliu-name">
                <span>备注：</span>
                {{ orderObj.remark }}
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
              <!--              <div class="date">{{ info.createdTime }}</div>-->
              <div class="order-code">
                商品信息
                <span>{{ info.orderNo }}</span>
              </div>
              <!--              <div class="order-state">{{ info.statusInfo }}</div>-->
            </div>
            <div class="info-good">
              <div class="list-good">
                <div
                  class="item"
                  v-for="(product_item, index) in info.products"
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
                      <div class="goods-sku">
                        {{ product_item.keyVals }}
                      </div>
                    </div>

                    <div class="box-sku">
                      <div class="goods-sku">
                        {{ vuex_huobi }}{{ product_item.price }}
                      </div>
                    </div>
                    <div class="box-num">{{ product_item.num }}</div>
                    <div class="box-price">
                      {{ vuex_huobi }} {{ product_item.priceSale }}
                    </div>
                  </div>

                  <div class="goods-action" v-if="info.orderStatus == 5">
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
          </div>

          <!-- 赠品信息 -->
          <div class="info-item">
            <div class="info-title">
              <!--              <div class="date">{{ info.createdTime }}</div>-->
              <div class="order-code" style="color: #666666">
                赠品信息
                <span>{{ info.orderNo }}</span>
              </div>
              <!--              <div class="order-state">{{ info.statusInfo }}</div>-->
            </div>
            <div class="info-good">
              <div class="list-good">
                <div
                  class="item"
                  v-for="(product_item, index) in info.products"
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
                      <div class="goods-sku">
                        {{ product_item.keyVals }}
                      </div>
                    </div>

                    <div class="box-sku">
                      <div class="goods-sku">
                        {{ vuex_huobi }}{{ product_item.price }}
                      </div>
                    </div>
                    <div class="box-num">{{ product_item.num }}</div>
                    <div class="box-price">
                      {{ vuex_huobi }} {{ product_item.priceSale }}
                    </div>
                  </div>

                  <div class="goods-action" v-if="info.orderStatus == 5">
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
          </div>

          <!-- 电子合同 -->
          <div class="electronic-contract-wrap">
            <div class="title">电子合同</div>
            <div class="electronic-contract-btn-wrap">
              <div class="btn-wrap">
                <div class="img-wrap">
                  <img src="@/assets/img/productDetail/download.png" alt="" />
                </div>
                <div class="btn-text">下载电子合同</div>
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
                    >{{ vuex_huobi }}{{ payInfo.goods || "2400.00" }}</span
                  >
                </div>
              </div>
              <div class="money-item">
                <span class="label">运费：</span>
                <div class="value">
                  <span class="money-num"
                    >{{ vuex_huobi
                    }}{{ payInfo.foreignYunfei || "20.00" }}</span
                  >
                </div>
              </div>
              <div class="money-item">
                <span class="label">满减：</span>
                <div class="value">
                  <span class="money-num"
                    >-{{ vuex_huobi
                    }}{{ payInfo.foreignManjian || "0.00" }}</span
                  >
                </div>
              </div>
              <div class="money-item">
                <span class="label">合计：</span>
                <div class="value">
                  <span class="money-num money-total"
                    >{{ vuex_huobi }}{{ info.price || "20.00" }}</span
                  >
                </div>
              </div>

              <!--              <div class="zhifufangshi-wrap" v-if="is_finish_pay">-->
              <!--                <span>支付方式：</span>-->
              <!--                <div class="zhifufangshi">-->
              <!--                  <div class="pay-item" v-if="payInfo.balance">-->
              <!--                    <span class="pay-title">余额支付</span>-->
              <!--                    <span class="pay-money"> -{{ vuex_huobi }}{{ payInfo.balance }}</span>-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--              </div>-->

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

          <!-- 订单操作 -->
          <div class="order-action-box">
            <div class="btn-box">
              <button class="btn-ripple fit-text" @click="doCancel(info)">
                取消订单
              </button>
              <button class="btn-ripple fit-text btn-bg" @click="doPay(info)">
                立即支付
              </button>
              <!-- <button
                class="btn-ripple fit-text btn-bg"
                @click="doDelete(info)"
              >
                删除订单
              </button>
              <button
                class="btn-ripple fit-text btn-bg"
                @click="doReceive(info)"
              >
                确认收货
              </button>
              <button
                class="btn-ripple fit-text btn-bg"
                @click="doRefund(info)"
              >
                售后
              </button> -->
            </div>
          </div>
        </div>
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
  </div>
</template>

<script>
import order_cancel_modal from "@/components/order/order_cancel_modal.vue"; //取消订单
import order_delete_modal from "@/components/order/order_delete_modal.vue"; //删除
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //收货
import order_refund_modal from "@/components/order/order_refund_modal.vue"; //售后

// import orderInfo from "@/components/order/orderInfo.vue"; //
import { mapState } from "vuex";

export default {
  name: "order-detail",
  components: {
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
        products: [
          {
            title: "激光平面窗口 Φ5.0mm 厚度=2.0mm",
            keyVals: "GCL-010158",
            price: "5000.00",
            priceSale: "5000.00",
            num: 1,
          },
          {
            title: "激光平面窗口 Φ5.0mm 厚度=2.0mm",
            keyVals: "GCL-010158",
            price: "5000.00",
            priceSale: "5000.00",
            num: 1,
          },
        ],
      },
      payInfo: {},
      shouhuoInfo: {}, //收货人信息
      total_product_number: 0,
      products: [],
      full_receive_address: "",
      //
      is_finish_pay: false, //
      //
      is_jifen_goods: false,

      orderObj: {}, //订单信息

      pay_info: {}, //支付信息
      fahuo_info: {}, //发货信息
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
    ...mapState(["defaultAvatar"]),
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
          action: "orders_detail",
          id: this.id,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.info = data;
          let { payInfo, products, shouhuoInfo, fahuoInfo, payType } = data;

          this.payInfo = payInfo;
          this.products = products;
          this.fahuo_info = fahuoInfo;
          this.is_finish_pay = parseFloat(data.pricePayed) > 0;

          // 收货地址
          this.shouhuoInfo = shouhuoInfo;
          if (shouhuoInfo) {
            let { country, province, city, area, address } = shouhuoInfo;
            this.full_receive_address = [country, province, city, area, address]
              .filter((v) => v)
              .join(" ");
          }

          // 总数
          products.forEach((item) => {
            this.total_product_number += item.num;
          });

          //
          //支付方式
          let payType_map = {
            1: "微信支付",
            2: "支付宝支付",
            3: "货到付款",
            4: "线下支付",
            5: "月结支付",
          };
          this.peisong_type_text = payType_map[1] || "";

          //凭证图片
          this.orderObj = data;
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
    // 复制
    copy(text) {
      // 动态创建 textarea 标签
      const textarea = document.createElement("textarea");
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = "readonly";
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = text;
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea);
      // 选中值并复制
      textarea.select();
      const result = document.execCommand("Copy");
      if (result) {
        this.$message.success("复制成功");
      }
      document.body.removeChild(textarea);
    },
  },
};
</script>

<style scoped lang="less">
.page {
  width: 1160px;
  padding: 0;

  .main-title {
    display: flex;
    gap: 26px;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    font-size: 16px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Roboto, Roboto-Bold, Roboto, Roboto;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: @theme;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 13px;
  padding: 24px 32px;
  background: #fff;
}

.step-box {
  .flex-center();
  padding: 55px 0;

  .step-item {
    text-align: center;

    &.active {
      .step-number {
        .step-num {
          background: @theme;
          color: #fff;
        }

        .step-line {
          background: @theme;
        }
      }
    }

    .step-number {
      margin: 0 auto;
      .flex();

      .step-line {
        width: 80px;
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
        background: #f1f4fa;
        border-radius: 50%;

        font-size: 20px;
        font-family: Roboto, Roboto-Regular, Roboto, Roboto;
        font-weight: 400;
        color: #999999;
      }
    }

    .step-title {
      margin-top: 14px;
      margin-bottom: 10px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 14px;
      color: #808080;
    }

    .step-date {
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 12px;
      color: #808080;
    }
  }
}

.order-other {
  margin-bottom: 24px;
  min-height: 156px;
  background: #ffffff;
  border: 1px solid #f5f5f5;

  .title {
    text-align: left;
    padding-left: 24px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    border-bottom: 1px solid #f5f5f5;

    font-size: 14px;
    font-family: Roboto, Roboto;
    font-weight: bold;

    color: #333333;
  }

  .other {
    // .flex-between();
    display: flex;
    flex-wrap: wrap;
    padding: 20px 25px;

    .item {
      text-align: left;
      padding-right: 40px;

      // flex: 1;
      .item-title {
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #999999;
        margin-bottom: 24px;
      }

      .item-content {
        min-height: 20px;
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        line-height: 20px;
        color: #666;

        .payImg {
          align-items: start;
        }

        .wuliu-code {
          align-items: center;

          img {
            margin-left: 5px;
            width: 16px;
            height: 16px;
          }
        }
        .address {
          display: flex;
          .payment-voucher {
            width: 81px;
            height: 81px;
            background: #333333;
            border-radius: 4px 4px 4px 4px;
            box-sizing: border-box;
            img {
              width: 100%;
              height: 100%;
            }
          }
          > div {
            width: 336px;
          }
        }

        > div {
          margin-bottom: 10px;

          span {
            display: inline-block;
            width: 70px;
            margin-right: 28px;
            // min-width: 80px;
          }

          img {
            width: 50px;
            height: 50px;
          }
        }
      }
    }
  }
}

.order-product {
}

.pingzheng-box {
  .flex();
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
      color: @theme;
      font-weight: bold;
    }
  }

  .zhifufangshi-wrap {
    margin-bottom: 0 !important;
    padding: 10px 0;
    width: 100%;
    border-top: 1px dashed #e5e5e5;
    .flex();
    justify-content: flex-end;

    .zhifufangshi {
      .flex();

      .pay-item {
        .flex();
        margin-left: 10px;

        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: bold;
        line-height: 24px;
        color: @theme;

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
      margin-bottom: 22px;
    }

    .info-title {
      .flex-between();
      height: 48px;
      padding: 0 24px;
      background: #f9f9f9;
      border-bottom: 1px solid #f5f5f5;

      font-size: 14px;
      font-family: Roboto, Roboto-Bold, Roboto, Roboto;
      font-weight: bold;
      color: #333333;

      .date {
      }

      .order-code {
        flex: 2;
        text-align: left;
        //padding-left: 20px;

        span {
        }
      }

      .order-state {
        // min-width: 96px;
        height: 30px;
        line-height: 30px;
        // background: @theme;
        color: @theme;
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
            width: 81px;
            height: 81px;
            cursor: pointer;
            border: 1px solid #f5f5f5;

            /deep/ img {
              width: 81px;
              height: 81px;
              object-fit: contain;
              object-fit: cover;
            }

            img {
              width: 81px;
              height: 81px;
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
              margin-bottom: 10px;

              &:hover {
                color: @theme;
              }
            }

            .goods-sku {
              color: #77797b;
            }
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

            font-family: Roboto, Roboto;
            font-weight: bold;
            font-size: 14px;
            color: #333;
          }
        }

        .goods-action {
          .flex();
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
            background: @theme;
            font-size: 14px;
            font-family: Roboto, Roboto;
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

    .electronic-contract-wrap {
      margin-bottom: 16px;
      background: #f9f9f9;
      font-size: 14px;
      font-family: Roboto, Roboto-Bold, Roboto, Roboto;
      font-weight: bold;
      color: #333333;
      border: 1px solid #e5e5e5;
      .title {
        height: 48px;
        padding: 13px 0 0 29px;
        font-weight: bold;
        font-size: 14px;
        color: #333333;
        line-height: 21px;
      }
    }
    .electronic-contract-btn-wrap {
      height: 94px;
      padding: 31px 0 0 32px;
      background: #fff;
      .btn-wrap {
        width: 129px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #27417c;
        color: #fff;
        border-radius: 2px 2px 2px 2px;
        opacity: 0.7;
        .img-wrap {
          width: 15px;
          height: 15px;
          margin-right: 8px;
          background: #ffffff;
          img {
            width: 15px;
            height: 15px;
          }
        }
        .btn-text {
          font-weight: 400;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
        }
      }
    }
  }

  // 商品信息汇总和订单操作

  .info-heji {
    background: #fafafa;
    padding: 24px 40px;
    border-top: 1px solid #f5f5f5;
    // .flex-between();
    align-items: flex-start;
    font-size: 14px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    line-height: 20px;
    color: #666;

    .money-box {
      text-align: right;

      .count {
        font-weight: bold;
        color: #666;
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
    margin-top: 25px;

    .btn-box {
      // margin-top: 10px;

      button {
        transition: 0.3s;
        min-width: 120px;
        height: 32px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid @theme;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: @theme;

        & + button {
          margin-left: 20px;
        }

        &.btn-bg {
          background: @theme;
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
