<template>
  <div class="page">
    <div class="inner w-1400">
      <pageBreadcrumb />
      <div class="page-ctx">
        <div class="sec-addr">
          <div class="sec-title">
            选择收货人地址
            <div class="addr-add">
              <button class="btn btn-ripple" @click="open_addr_add()">
                添加新地址
              </button>
            </div>
          </div>
          <div class="sec-ctx">
            <div class="address-list" v-if="address_list.length">
              <div
                class="address-item"
                v-for="(item, index) in address_list"
                :key="index"
                :class="{ active: item.id == address_select.id }"
                @click="do_toggle_address(item)"
              >
                <div class="address-top">{{ item.name_phone }}</div>
                <div class="address-bottom">
                  {{ item.full_addr }}
                </div>
                <img src="@img/order/addr-select.png" alt="" class="marker" />
              </div>
            </div>
            <el-empty description="暂无收件地址" v-else />
          </div>
        </div>

        <div class="sec-pay">
          <div class="sec-title flex">
            支付和配送信息
            <!-- <span
              v-if="vuex_user.type == 2"
              style="font-size: 16px; margin-left: 16px"
              >采购额度：{{ vuex_user.left_caigou_credit }}</span
            > -->
          </div>
          <div class="sec-ctx sec-ctx-type">
            <div class="pay-group">
              <div class="pay-items">
                <div class="pay-items-left">
                  <div
                    class="item"
                    v-for="(item, index) in pay_method_list"
                    :key="index"
                    @click="do_toggle_paytype(item)"
                    :class="{ checked: pay_type_value == item.value }"
                  >
                    <img
                      class="img-check check-0 check-img check-img-0"
                      src="@img/common/check0.png"
                      alt=""
                    />
                    <img
                      class="img-check check-1 check-img check-img-1"
                      src="@img/common/check1.png"
                      alt=""
                    />
                    <img class="marker-img" :src="item.icon" alt="" />
                    <span>{{ item.title }}</span>
                  </div>
                </div>

                <div class="wuli-info">
                  <div class="info-title">配送方式：</div>
                  <div class="info-item">
                    <div class="info-label">快递配送</div>
                  </div>
                </div>
              </div>
              <!-- 线下转款信息 -->
              <div class="xianxia-info" v-if="pay_type_value == 'pay2'">
                <div class="info-title">收款对公账户</div>
                <div class="info-item">
                  <div class="info-label">收款单位名称:</div>
                  <div class="info-val">
                    {{ offlineInfo.company || "--"
                    }}<img
                      src="@img/pay-method/copy.png"
                      alt=""
                      class="copy-img"
                      @click="copy_text(offlineInfo.company)"
                    />
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">收款单位账号:</div>
                  <div class="info-val">
                    {{ offlineInfo.bankNo || "--"
                    }}<img
                      src="@img/pay-method/copy.png"
                      alt=""
                      class="copy-img"
                      @click="copy_text(offlineInfo.bankNo)"
                    />
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">开户银行:</div>
                  <div class="info-val">
                    {{ offlineInfo.bankName || "--"
                    }}<img
                      src="@img/pay-method/copy.png"
                      alt=""
                      class="copy-img"
                      @click="copy_text(offlineInfo.bankName)"
                    />
                  </div>
                </div>
              </div>
              <div
                class="scroll-target-pingzheng"
                v-if="pay_type_value == 'pay2'"
                style="margin-left: 20px"
              >
                <div class="info-val">
                  <el-upload
                    class="upload-demo"
                    multiple
                    accept="image/*"
                    :limit="upload_limit_number"
                    :name="mix_upload_name"
                    :action="mix_upload_action"
                    :data="mix_upload_data"
                    :on-success="uploadSuccess_pingjia"
                    :before-upload="beforeUpload_pingjia"
                    :on-preview="handlePictureCardPreview"
                  >
                    <el-button type="primary">上传汇款截图</el-button>
                  </el-upload>
                </div>
              </div>
            </div>

            <div class="yue-info" v-if="payType == '余额支付'">
              <div class="info-item">
                <div class="info-label">可用余额：</div>
                <div class="info-val">{{ total_balance }}</div>
              </div>
              <div
                class="info-item"
                v-if="total_balance < this.real_payment_money"
              >
                <div class="info-label yue-warn-tip">
                  提示：您的余额不足，请选择其他支付方式
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 发票信息 -->
        <div class="sec-fapiao">
          <div class="sec-title">发票信息</div>
          <div class="fapiao-info">
            <div class="main-title">是否开票:</div>
            <div class="type-list">
              <div
                class="type-item"
                :class="{ active: fapiao_info.invoicType == '' }"
                @click="do_fapiao_type('')"
              >
                不开票
              </div>
              <div
                class="type-item"
                :class="{ active: fapiao_info.invoicType == 1 }"
                @click="do_fapiao_type(1)"
              >
                普通发票
              </div>
              <div
                class="type-item"
                :class="{ active: fapiao_info.invoicType == 2 }"
                @click="do_fapiao_type(2)"
              >
                专用发票
              </div>
            </div>
          </div>

          <div
            class="fapiao-box"
            data-title="普通发票"
            v-if="fapiao_info.invoicType == 1"
          >
            <div class="input-box">
              <div class="label">发票抬头类型:</div>
              <div class="val-box">
                <el-radio-group v-model="fapiao_info.titleType">
                  <el-radio label="1">个人</el-radio>
                  <el-radio label="2">企业</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="input-box">
              <div class="label">发票抬头:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.title"
                  placeholder="请填写准确的抬头名称"
                ></el-input>
              </div>
            </div>
            <div class="input-box" v-if="fapiao_info.titleType == 2">
              <div class="label">纳税人识别号:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.shibiema"
                  placeholder="请填写纳税人识别号"
                ></el-input>
              </div>
            </div>
          </div>

          <div
            class="fapiao-box"
            data-title="专用发票"
            v-if="fapiao_info.invoicType == 2"
          >
            <div class="input-box">
              <div class="label">发票抬头:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.title"
                  placeholder="请填写准确的抬头名称"
                ></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="label">纳税人识别号:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.shibiema"
                  placeholder="请填写准确的纳税人识别号"
                ></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="label">注册地址:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.companyAddress"
                  placeholder="请输入单位注册地址"
                ></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="label">注册电话:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.companyPhone"
                  placeholder="请输入单位注册电话"
                ></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="label">开户银行:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.bankName"
                  placeholder="请输入开户银行"
                ></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="label">银行账户:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.bankNo"
                  placeholder="请输入银行账户"
                ></el-input>
              </div>
            </div>
          </div>
          <el-button
            @click="openInvoice"
            v-if="this.fapiao_info.invoiceStatus != 0"
          >
            选择历史发票
          </el-button>
        </div>

        <div class="type-select" v-if="false">
          <div class="type-title">
            <div class="text">配送方式</div>
          </div>
          <div class="type-inner">
            <!-- <div class="select-1">
              <div class="title">配送方式</div>
              <div class="list">
                <button
                  class="item"
                  :class="peisong_type == item ? 'active' : ''"
                  v-for="(item, index) in peisong_list"
                  :key="index"
                  @click="peisong_toggle(item)"
                >
                  {{ item }}
                </button>
              </div>
            </div> -->

            <!-- <div class="ziti-box" v-if="peisong_type == '上门自提'">
            <div class="title">厂家信息</div>
            <div class="ziti-info">地址：{{ vuex_config.com_address }}</div>
            <div class="ziti-info">电话：{{ vuex_config.com_kefu }}</div>
          </div> -->

            <!-- <div class="select-1">
            <div class="title">配送时间</div>
            <div class="list">
              <el-date-picker v-model="select_date" type="date" placeholder="选择配送时间" value-format="yyyy-MM-dd" :picker-options="pickerOptions"> </el-date-picker>

              <el-select v-model="select_time" placeholder="请选择" style="margin-left: 30px">
                <el-option v-for="item in defaultContent" :key="item" :label="item" :value="item"> </el-option>
              </el-select>
            </div>
          </div> -->
          </div>
        </div>

        <div class="sec sec-product">
          <div class="sec-title">订单商品</div>
          <div class="sec-ctx">
            <div class="goods-list">
              <div class="list">
                <div class="goods-list-inner">
                  <!-- 标题 -->
                  <div class="list-title flex">
                    <div class="box-title">
                      <div class="title-text">产品</div>
                    </div>
                    <div class="box-unit">单价</div>
                    <div class="box-num">数量</div>
                    <div class="box-subtitle">小计</div>
                  </div>

                  <!-- 商品列表 -->
                  <div
                    class="item"
                    v-for="(item, index) in payment_products"
                    :key="index"
                  >
                    <div class="item-detail flex">
                      <div class="box-title flex">
                        <div class="poster-box">
                          <el-image :src="item.image">
                            <div slot="error" class="image-slot">
                              <img :src="item.image" />
                            </div>
                          </el-image>
                        </div>
                        <div class="title-box">
                          <div class="title-text ellipsis-2">
                            {{ item.title }}
                          </div>
                          <div class="box-sku">规格：{{ item.keyVals }}</div>
                        </div>
                      </div>

                      <div class="box-unit">
                        {{ vuex_huobi }}
                        {{ item.discountSale || item.priceSale }}
                      </div>
                      <div class="box-num">{{ item.num }}</div>
                      <div class="box-subtitle">
                        {{ vuex_huobi }}
                        {{
                          item.discountSale
                            ? (item.discountSale * item.num).toFixed(2)
                            : (item.priceSale * item.num).toFixed(2)
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="huizong flex">
                <!-- <div class="left">
                  <span class="text">整单备注：</span>
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6 }"
                    placeholder="请输入内容"
                    v-model="remark"
                  >
                  </el-input>
                </div> -->
                <div class="right">
                  <div class="item">
                    <!-- <span class="text">共：</span> -->
                    <b class="val">共 {{ total_product_number || 0 }} 件</b>
                  </div>
                  <div class="item">
                    <span class="text">商品总价：</span>
                    <b class="val"
                      >{{ vuex_huobi }} {{ pay_info.goodsPrice || 0 }}</b
                    >
                  </div>
                  <div class="item">
                    <span class="text">配送费：</span>
                    <b>{{ vuex_huobi }} {{ pay_info.yunfei || 0 }}</b>
                  </div>
                  <!-- <div class="item">
                  <span class="text">满减：</span>
                  <b>- {{ vuex_huobi }} {{ pay_info.foreignManjian || 0 }}</b>
                </div> -->
                  <div class="item total">
                    <span class="text">合计应付：</span>
                    <b>{{ vuex_huobi }} {{ pay_info.orderPrice }}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="bottom-btns">
          <button
            class="btn-ripple fit-text btn-1"
            @click="$router.push('/cart')"
          >
            返回购物车
          </button>
          <button class="btn-ripple fit-text btn-2" @click="do_submit()">
            去支付
          </button>
        </div>
      </div>
    </div>

    <!-- 新增收货地址弹窗 -->
    <address_modal ref="address_modal" @confirm="confirm_add_address" />
    <foreign_address_modal
      ref="foreign_address_modal"
      @confirm="confirm_add_address"
    />

    <!-- 余额支付弹窗 -->
    <balance_password_set_modal ref="balance_password_set_modal" />
    <!-- 余额支付弹窗 -->
    <balance_pay_modal ref="balance_pay_modal" />
    <!-- 余额支付失败弹窗 -->
    <balance_pay_disable_modal ref="balance_pay_disable_modal" />
    <!-- 微信支付弹窗 -->
    <orderPayWxCode ref="orderPayWxCode" :payment_money="real_payment_money" />
    <!-- 支付等待弹窗 -->
    <orderPayWaiting ref="orderPayWaiting" />

    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <invoice_history
      ref="invoice_history"
      @confirm="useInvoice"
    ></invoice_history>
    <!-- 订单支付提示 -->
    <el-dialog
      class="modal-pay-tip"
      title="订单提醒"
      :visible.sync="confirm_tip"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <span>确认支付当前订单？</span>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple btn-cancel" @click="confirm_tip = false">
          取 消
        </button>
        <button class="btn-ripple btn-confirm" @click="do_confirm_submit()">
          确认支付
        </button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { SHOP_TYPE } from "@/config/env.js";
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";
import address_modal from "@/components/address/address_modal.vue"; //新增地址
import foreign_address_modal from "@/components/address/foreign_address_modal.vue"; //新增地址
import invoice_history from "@/components/order/invoice_history.vue";
import balance_password_set_modal from "@/components/payment/balance_password_set_modal.vue";
import balance_pay_modal from "@/components/payment/balance_pay_modal.vue";
import balance_pay_disable_modal from "@/components/payment/balance_pay_disable_modal.vue";

import orderPayWxCode from "@/components/order/orderPayWxCode.vue";
import orderPayWaiting from "@/components/order/orderPayWaiting.vue";

import { mapState } from "vuex";

export default {
  name: "order-submit",
  components: {
    pageBreadcrumb,
    address_modal,
    foreign_address_modal,

    balance_password_set_modal,
    balance_pay_modal,
    balance_pay_disable_modal,
    orderPayWxCode,
    orderPayWaiting,
    invoice_history,
  },
  data() {
    return {
      is_order_test: false, //订单测试
      //
      from: "", //product-detail  ||  cart
      //
      // address_select: {}, //地址
      pagination_address: {
        page: 1,
        pagenum: 20,
      },
      coupon_selected: {}, //优惠券
      coupons_for_allow_use: [],
      remark: "",
      //
      // payment_products: [],
      total_product_number: 0,
      total_product_price: 0, //商品总金额
      total_order_price: 0, //订单总金额
      order_zhekou_bili: 10, //折扣比例 10折 默认不打折
      order_zhekou_price: 0, //折扣金额
      order_yunfei: 0, //运费金额
      order_points_dixian_price: 0, //积分抵现金额
      order_points_dixian_number: 0, //使用积分数量

      pay_info: {}, //预下单信息
      jifen_pay: {
        // if_open: 1,//是否开启积分抵现
        // jifen: "17",//可用积分
        // money: "1.70",//可抵扣金额
        // rule: 10//抵扣比例 rule 积分抵扣 1元
      }, //积分抵现信息
      //

      my_info: {}, //我的信息 包含 余额 佣金数值
      total_balance: 0,
      //
      fapiao_info: {
        invoiceStatus: 0, //是否开票 0-不需要 1-需要发票
        invoicType: "", //发票类型：1-普通发票 2-专用发票
        titleType: "1", //抬头：1-个人 2-单位
        title: "", //
        shibiema: "", //
        companyAddress: "", //
        companyPhone: "", //
        bankName: "", //
        bankNo: "", //
      },
      // 支付方式
      payTypeValue: 2,
      pay_type_value: "pay2",
      // pay_method_list: [
      //   {
      //     value: "pay1",
      //     title: "账期月结",
      //     icon: require("@img/pay-method/pay1.png"),
      //   },
      //   {
      //     value: "pay2",
      //     title: "对公转账",
      //     icon: require("@img/pay-method/pay2.png"),
      //   },
      // ],

      order_id: "", //是否已经创建过订单
      showCoupon: true, //

      if_use_jifen: true, //是否使用积分抵扣
      if_use_yongjin: true, //是否使用佣金扣减
      // jifen_pay: {}, //积分抵扣信息
      currency: "￥", //货币

      money_yunfei: 0,
      order_price: 0, //总 订单金额

      yh_code: "",
      yh_code_info: {},

      // remark: "",

      peisong_type: "快递配送",
      address_select: {},
      address: "", //选择的地址
      address_list: [], //地址列表
      payment_products: [], //要支付的商品信息
      list_coupon: [], //优惠券
      coupon_select_id: "", //选择的优惠券 id

      //

      is_pay_pass: 0, //是否设置余额支付密码
      payType: "",
      upload_limit_number: 6,
      dialogVisible: false,
      dialogImageUrl: "", //转账图片查看
      confirm_tip: false, //确认支付信息提示
      xianxia_file_list: [],

      peisong_list: ["快递配送", "上门自提"],
      offlineInfo: {},
    };
  },
  computed: {
    ...mapState(["vuex_user"]),
    

    pay_method_list() {
      if(this.vuex_user.payType.includes('1') && this.vuex_user.payType.includes('2')) {
        return [
          {
            value: "pay1",
            title: "账期月结",
            icon: require("@img/pay-method/pay1.png"),
          },
          {
            value: "pay2",
            title: "对公转账",
            icon: require("@img/pay-method/pay2.png"),
          },
        ];
      } else if(this.vuex_user.payType.includes('2')) {
        return [
          {
            value: "pay1",
            title: "账期月结",
            icon: require("@img/pay-method/pay1.png"),
          },
        ];
      } else if(this.vuex_user.payType.includes('1')) {
        return [
          {
            value: "pay2",
            title: "对公转账",
            icon: require("@img/pay-method/pay2.png"),
          },
        ];
      } else {
        return [];
      }
    },

    real_payment_money() {
      let money = parseFloat(
        (this.total_order_price - this.order_points_dixian_price).toFixed(2)
      );
      return money;
    },
    //

    coupon_select() {
      return this.list_coupon.find((v) => v.id == this.coupon_select_id) || {};
    },

    //使用积分支付要抵扣的积分
    use_jifen_num() {
      if (!this.if_use_jifen) {
        return 0;
      }

      // debugger

      //需要优先考虑选择优惠券后的积分数值变动
      let jifen = 0;
      let total_dixian_jifen = this.jifen_pay.jifen || 0; //最大可抵扣积分数值
      if (this.money_yhq) {
        if (this.jifen_pay.money && this.order_price) {
          //最大可抵扣金额 = （剩余待支付金额 = 订单金额 - 优惠金额） 与  可使用积分的最大抵扣金额

          let last_dixian_jifen =
            (this.order_price - this.money_yhq) * this.jifen_pay.rule;
          if (last_dixian_jifen < 0) {
            total_dixian_jifen = 0;
          } else {
            total_dixian_jifen =
              last_dixian_jifen < total_dixian_jifen
                ? last_dixian_jifen
                : total_dixian_jifen;
          }
        }
      }
      if (this.vuex_user.jifen && total_dixian_jifen) {
        if (this.vuex_user.jifen < total_dixian_jifen) {
          jifen = this.vuex_user.jifen;
        } else {
          jifen = total_dixian_jifen;
        }
      }

      return parseInt(jifen);
    },

    //优惠金额
    money_yhq() {
      let money_yhq = 0;
      if (this.coupon_select_id) {
        let yhq =
          this.list_coupon.find((v) => v.id == this.coupon_select_id) || {};
        money_yhq = yhq.jian || 0;
      }
      return money_yhq;
    },

    //积分抵现金额
    money_jifen_dixian() {
      let money = 0;
      if (this.use_jifen_num && this.jifen_pay.rule) {
        money = this.use_jifen_num / this.jifen_pay.rule;
      }
      return +money;
    },

    //佣金抵现金额
    money_yongjin_dixian() {
      if (!this.if_use_yongjin) {
        return 0;
      }
      if (!this.vuex_user.yongjin) {
        return 0;
      }
      // debugger
      let money_yongjin = 0;
      let money_last = 0; //剩余待支付金额
      if (this.order_price) {
        money_last =
          this.order_price - this.money_yhq - this.money_jifen_dixian;

        if (money_last > this.vuex_user.yongjin) {
          money_yongjin = this.vuex_user.yongjin;
        } else {
          money_yongjin = money_last;
        }
      }

      return money_yongjin.toFixed(2);
    },
  },
  watch: {},
  created() {
    this.from = this.$route.query.from || "";
    this.getCacheProduct();

    this.$api({
      url: "/service.php",
      method: "get",
      data: {
        action: "orders_getPlatformAccountList",
        page: 1,
        pagenum: 20,
      },
    }).then((res) => {
      if (res.code == 200) {
        this.offlineInfo = res.data.list[0] || {};
      }
    });
    //
    this.query_user();
    this.query_address();
    this.query_pay_info();
  },
  methods: {
    copy_text(text) {
      // 使用原生方法
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.$message.success("复制成功");
    },
    //下单成功后 移除商品信息
    clearCacheProduct() {
      if (this.from == "cart") {
        //移除购物车中商品
        let guige_ids = this.payment_products.map((v) => v.guige_id).join(",");
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "gouwuche_del",
            inventoryId: guige_ids, //产品规格id(多个用,分开)
          },
        }).then((res) => {
          if (res.code == 200) {
            this.$store.commit("set_vuex_cart_number", res.count);
          }
        });
      }
      sessionStorage.removeItem("cache_payment_products");
    },
    useInvoice(info) {
      this.fapiao_info = info;
    },
    openInvoice() {
      this.$refs.invoice_history.init();
    },
    //获取缓存的产品信息
    getCacheProduct() {
      //本地产品数据
      let cache_payment_products = sessionStorage.getItem(
        "cache_payment_products"
      );
      if (cache_payment_products) {
        this.payment_products = JSON.parse(cache_payment_products);
        console.log(this.payment_products);
        let total_product_number = 0;
        let total_product_price = 0;
        this.payment_products.forEach((v) => {
          total_product_number += parseInt(v.num);
          total_product_price += v.discountSale * parseInt(v.num);
        });
        this.total_product_number = total_product_number;
        this.total_product_price = total_product_price;
        console.log(total_product_price, "s数量11");
        this.$log("缓存 待下单产品", this.payment_products);
      } else {
      }
    },
    //获取缓存的地址信息
    query_user() {
      // this.$store.dispatch("query_user");
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.my_info = res.data;
          this.total_balance = parseFloat(this.my_info.money) || 0;
        }
      });
    },

    //获取地址列表
    query_address() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_lists",
          ...this.pagination_address,
          // shop_id: this.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;

          data.forEach((v) => {
            if (SHOP_TYPE == "foreign") {
              //标准商城
              v.full_addr = [v.country, v.province, v.city, v.area, v.address]
                .filter((v) => !!v)
                .join(",");
              v.name_phone = `${v.firstName} ${v.lastName} (${v.phone})`;
            } else {
              v.full_addr = [v.country, v.province, v.city, v.area, v.address]
                .filter((v) => !!v)
                .join(",");
              v.name_phone = `${v.name} (${v.phone})`;
            }
          });
          this.address_list = data;

          let obj = data.find((v) => v.if_default) || {};
          this.address_select = obj || {};
        }
      });
    },

    get_pay_info_params() {
      let product_items = this.payment_products.map((v) => ({
        inventoryId: v.inventoryId,
        productId: v.productId,
        num: v.num,
      }));
      let productInfo = JSON.stringify(product_items);

      let params = {
        productInfo: productInfo,
        addressId: this.address_select.id || "",
      };
      return params;
    },

    get_pay_params() {
      let product_items = this.payment_products.map((v) => ({
        inventoryId: v.inventoryId,
        productId: v.productId,
        num: v.num,
        remark: v.remark,
      }));
      let productInfo = JSON.stringify(product_items);

      let params = {
        peisongType: 1, //配送类型：1-快递物流 2-上门自提

        remark: this.remark, //备注
        addressId: this.address_select.id || "",
        productInfo: productInfo,
        payMethod: this.pay_type_value == "pay2" ? 1 : 2, // 支付方式
        payImg: this.xianxia_file_list.join(","), //汇款截图

        ...this.fapiao_info,
      };
      return params;
    },

    //根据下单商品获取确认订单信息
    query_pay_info() {
      let params = this.get_pay_info_params();

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_getPayInfo",
          ...params,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.pay_info = data;
          this.jifen_pay = data.jifen_pay || {}; //积分信息

          //
          this.total_order_price = data.order_price || 0;
          //this.total_product_price = data.goods_price || 0;
          this.order_zhekou_bili = parseFloat(data.zhekou) || 10;
          this.order_zhekou_price = parseFloat(data.zhekou_price) || 0;
          this.order_yunfei = data.yunfei || 0;

          // this.format_coupon_view_info(data.yhq_list)
          // this.coupons_for_allow_use = data.yhq_list || []
          // this.total_product_price = data.goods_price;

          if (this.coupon_selected.id) {
            this.total_order_price = (
              this.total_order_price - this.coupon_selected.jian
            ).toFixed(2);
          }

          // if (data.yhq_list.length) {
          //   this.list_coupon = data.yhq_list.map((item) => ({
          //     ...item,

          //     miaoshu: +item.man
          //       ? `满${+item.man}减${+item.jian}元`
          //       : `下单立减${+item.jian}元`,
          //     youxiaoqi:
          //       item.startTime.substr(0, 10) + " - " + item.endTime.substr(0, 10),
          //   }));
          // }
          // this.order_price = data.order_price;
          // this.money_yunfei = +data.yunfei || 0;
          // this.jifen_pay = data.jifen_pay;
        }
      });
    },

    // 格式化优惠券展示信息
    format_coupon_view_info(list) {
      list.forEach((v) => {
        // v.is_expand = false;
        v.man_price = parseFloat(v.man);
        v.jian_price = parseFloat(v.jian);
        v.tiaojian = v.man_price == 0 ? "无门槛" : `满${v.man_price}元可用`;
      });
    },

    do_toggle_paytype(item) {
      this.pay_type_value = item.value;
      this.payType = item.title;
      let value = item.title;
      if (value == "余额支付") {
        if (this.vuex_user.is_pay_pass == 0) {
          //未设置支付密码
          this.$refs.balance_password_set_modal.init(this.vuex_user);
        } else if (this.total_balance < this.real_payment_money) {
          //余额不足提示
          this.$refs.balance_pay_disable_modal.init({
            money: this.real_payment_money,
          });
        }
      }
    },

    yuePayPassSetCallback() {
      this.is_pay_pass = 1;
    },

    parentHandleModalAction(option = {}) {
      let type = option.type || "";
      if (type == "修改绑定") {
        this.$store.dispatch("query_user");
      }
    },

    //提交订单
    do_submit() {
      let params_info = {
        ...this.form,
      };
      delete params_info.phone;

      if (!this.address_select.id) {
        return alertErr("请选择收货地址");
      }

      if (!this.pay_type_value) {
        return alertErr("请选择支付方式");
      }

      if (this.pay_type_value == "pay2") {
        if (!this.xianxia_file_list.length) {
          this.scrollToTarget(".scroll-target-pingzheng");
          return alertErr("请上传转款凭证信息");
        }
      }

      if (this.pay_type_value == "yue") {
        // if (this.total_balance < +this.real_payment_money) {
        //   return alertErr("您的余额不足，请选择其他支付方式");
        // }
        if (
          Number(this.pay_info.orderPrice) >
          Number(this.vuex_user.left_caigou_credit)
        ) {
          return alertErr("无法下单，采购额度不足，请申请采购额度后下单。");
        }
        // if (!this.is_pay_pass) {
        //   alertErr("请先设置余额支付密码");
        //   this.$refs.balance_password_set_modal.init(this.vuex_user);
        //   return;
        // }
      }
      if (this.fapiao_info.invoicType == 1) {
        //普通发票
        if (!this.fapiao_info.titleType) {
          return alertErr("请选择发票抬头类型");
        }
        if (!this.fapiao_info.title) {
          return alertErr("请填写发票抬头");
        }
        if (this.fapiao_info.titleType == 2) {
          if (!this.fapiao_info.shibiema) {
            return alertErr("请填写纳税人识别号");
          }
        }
      } else if (this.fapiao_info.invoicType == 2) {
        //增值税发票
        if (!this.fapiao_info.title) {
          return alertErr("请填写准确的抬头名称");
        }
        if (!this.fapiao_info.shibiema) {
          return alertErr("请填写准确的纳税人识别号");
        }
        if (!this.fapiao_info.companyAddress) {
          return alertErr("请输入单位注册地址");
        }
        if (!this.fapiao_info.companyPhone) {
          return alertErr("请输入单位注册电话");
        }
        if (!this.fapiao_info.bankName) {
          return alertErr("请输入开户银行");
        }
        if (!this.fapiao_info.bankNo) {
          return alertErr("请输入银行账户");
        }
      }

      this.confirm_tip = true;
    },

    //滚动到指定位置 元素类名
    scrollToTarget(clsName) {
      // var element = document.querySelector(".wenxian-box");
      var element = document.querySelector(clsName);
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    },

    handleClose(done) {},

    //订单提交-支付
    do_confirm_submit() {
      this.confirm_tip = false;

      // let not_use_jifen = !this.if_use_jifen || this.vuex_user.jifen <= 0;
      // let not_use_yongjin = !this.if_use_yongjin || this.vuex_user.yongjin <= 0;
      // if (not_use_jifen && not_use_yongjin) {
      //   //不使用积分 不使用佣金  直接进行微信支付
      //   // alert(res);
      //   // this.to_pay_methods();
      // } else {
      //   this.order_pay_step();
      // }
      let params = this.get_pay_params();
      console.log(params, "xiadan");

      let invoice = JSON.parse(localStorage.getItem("invoice_history")) || [];
      if (this.fapiao_info.invoiceStatus != 0) {
        invoice.push(this.fapiao_info);
      }

      invoice = JSON.stringify(invoice);
      localStorage.setItem("invoice_history", invoice);
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_create",
          ...params,
        },
      }).then((res) => {
        if (res.code == 200) {
          let { id, orderNo } = res.data;
          this.order_id = id;
          this.toPaySuccess();
          // this.do_order_pay();
        }
      });
    },

    //支付方式调取
    do_order_pay() {
      if (this.is_order_test) {
        this.pay_use_yue();
      } else {
        this.toPaySuccess();
        return;
        if (this.pay_type_value == "weixin") {
          this.pay_use_weixin();
        } else if (this.pay_type_value == "zhifubao") {
          this.pay_use_zhifubao();
        } else if (this.pay_type_value == "yue") {
          this.pay_use_yue();
        } else if (this.pay_type_value == "xianxia") {
          this.pay_use_xianxia();
        } else if (this.pay_type_value == "paypal") {
          this.pay_use_paypal();
        }
      }
    },

    //微信支付 pc
    pay_use_weixin() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_wxScanCodePay",
          orderType: 1,
          orderId: this.order_id,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          let data = res.data;
          let info = {
            // ...res,
            qrcode: data.qrcode,
            order_id: this.order_id,
          };
          this.$refs.orderPayWxCode.init(info);
          // this.$refs.orderPayWxCode.qrcode = data.qrcode;
          // this.$refs.orderPayWxCode.showModal = true;
          // this.showWaiting();
        } else {
        }
      });
    },

    pay_use_yue() {
      // this.$refs.balance_pay_modal.init({
      //   order_id: this.order_id,
      //   money: this.real_payment_money,
      // });
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "pay_balance",
          orderType: 1,
          orderId: this.order_id,
        },
      }).then((res) => {
        console.log(res.code);

        alert(res);
        if (res.code == 200) {
          this.toPaySuccess();
        } else {
        }
      });
    },

    pay_use_paypal() {
      this.toPaySuccess();

      // this.$api({
      //   url: '/service.php',
      //   method: 'get',
      //   data: {
      //     action: 'pay_balance',
      //     orderType: 1,
      //     orderId: this.order_id,
      //   },
      // }).then((res) => {
      //   alert(res)
      //   if (res.code == 200) {
      //     this.toPaySuccess();
      //   } else {
      //   }
      // });
    },

    //pc 支付宝支付
    pay_use_zhifubao() {
      // alertErr('尚未开通支付宝支付');

      this.showWaiting();

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_aliScanCodePay",
          orderType: 1,
          orderId: this.order_id,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          let data = res.data;
          const { href } = this.$router.resolve({
            path: "/zfbPay",
            query: {
              htmlData: data,
            },
          });
          window.open(href, "_blank");

          // this.$router.push({
          //   path: "/zfbPay",
          //   query: {
          //     htmlData: data,
          //   },
          // });
        } else {
        }
      });
    },

    //余额支付
    order_payment_yue() {
      if (+this.vuex_user.money < +this.real_payment_money) {
        alertErr("您的余额不足，请选择其他支付方式");
        return;
      }

      this.$api("orders_yuePay", { order_id: this.order_id }).then((res) => {
        //console.log("余额支付", res);
        let { code, message } = res;

        if (code == 200) {
          this.toPaySuccess();
        } else {
        }
      });
    },

    //线下转款
    pay_use_xianxia() {
      // this.$api("orders_offlinePay", { order_id: this.order_id }).then((res) => {
      //   //console.log("货到付款支付", res);
      //   let { code, message } = res;

      //   if (code == 200) {
      //     this.toPaySuccess();
      //   } else {
      //     this.toFail();
      //   }
      // });

      let paypz = this.xianxia_file_list.join();
      this.$api("orders_uploadPz", {
        //
        order_id: this.order_id,
        paypz: paypz,
      }).then((res) => {
        //console.log("线下转款支付", res);
        let { code, message } = res;
        if (code == 200) {
          this.toPaySuccess();
        } else {
          this.toFail();
        }
      });
    },

    toFail() {
      this.$router.push(`/payFail?order_id=${this.order_id}`);
    },

    //订单微信jsapi支付
    orderPayWxJsapi() {
      let that = this;
      order.orders_wxPay({
        params: {
          order_id: this.order_id,
        },
        success: (data) => {
          //console.log("订单微信jsapi支付", data);
          let { timeStamp, nonceStr, signType, paySign } = data;

          wx.chooseWXPay({
            timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr, // 支付签名随机串，不长于 32 位
            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign, // 支付签名
            success: function (res) {
              that.toPaySuccess();
            },
            fail(err) {
              //console.log("支付失败了");
            },
          });
        },
        fail: (err) => {
          //console.log("支付失败", err);
        },
      });
    },

    showWaiting() {
      this.clearTimer();
      let that = this;

      this.$refs.orderPayWaiting.show = true;

      this.timer = setInterval(() => {
        this.$api("orders_detail", {
          id: this.order_id,
        }).then((res) => {
          let { code, data, msg } = res;
          if (data.status == 2 || data.status == 3) {
            that.toPaySuccess();
          }
        });
      }, 2000);
    },

    clearTimer() {
      //console.log("清除定时器");
      clearInterval(this.timer);
      this.timer = null;
    },
    //支付成功操作
    toPaySuccess() {
      if (this.mode == "yue") {
        this.$router.push(`/yue`);
      } else {
        this.$router.push(`/payment-success?order_id=${this.order_id}`);
      }
    },

    order_pay_step() {
      //支付步骤
      //优惠券

      //积分 1
      //佣金 2
      //其他 3
      if (this.if_use_jifen && this.use_jifen_num > 0) {
        this.order_jifen_dixian(); //积分抵现
      } else if (this.if_use_yongjin && this.money_yongjin_dixian) {
        this.order_yongjin_pay(); //佣金支付
      }
    },

    //购物车 删除支付的商品
    shopcart_delete_payment() {
      let ids = this.payment_products.map((v) => v.inventoryId);
      let id = ids.join();

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_del",
          inventoryId: inventoryId,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = this.list_shopcart;
          let ids = (inventoryId + "").split(",");
          //可能删除多项商品
          ids.forEach((inventoryId) => {
            let index = list.findIndex((v) => v.inventoryId == inventoryId);
            list.splice(index, 1);
          });

          this.do_update_vuex_cart_number();
        }
      });
    },

    //选择收货地址
    do_toggle_address(item) {
      this.address_select = item;
      this.query_pay_info();
    },
    //新增地址
    open_addr_add() {
      if (SHOP_TYPE == "foreign") {
        this.$refs.foreign_address_modal.init();
      } else {
        this.$refs.address_modal.init();
      }
    },

    confirm_add_address() {
      this.query_address();
    },

    // 订单积分抵现
    order_jifen_dixian() {
      this.$api("orders_jifenPay", {
        order_id: this.order_id,
        jifen: this.use_jifen_num,
      }).then((res) => {
        //console.log("积分抵现", res);
        let { code, is_over, message } = res;
        if (code == 200) {
          if (this.if_use_yongjin && this.money_yongjin_dixian) {
            this.order_yongjin_pay();
          } else {
            alert(res);
            if (is_over == 1) {
              //支付完成
              this.$router.push("/order-list");
            } else {
              this.to_pay_methods();
            }
          }
        }
      });
    },

    //订单佣金抵现
    order_yongjin_pay() {
      this.$api("orders_yuePay", {
        order_id: this.order_id,
      }).then((res) => {
        //console.log("余额抵扣", res);
        let { code, is_over } = res;
        if (code == 200) {
          alert(res);
          if (is_over == 1) {
            //支付完成
            this.$router.push("/order-list");
          } else {
            this.to_pay_methods();
          }
        }
      });
    },

    //订单创建成功
    to_pay_methods() {
      if (this.$route.query.from == "cart") {
        this.shopcart_delete_payment();
      }

      this.$router.push({
        path: "/payment-methods",
        query: {
          order_id: this.order_id,
          from: "order-submit",
        },
      });
    },

    //输入积分时
    onInput_jifen() {
      //console.log("输入积分", +this.use_jifen_num);
      //console.log("最多可使用积分", +this.jifen_pay.jifen);

      if (this.use_jifen_num && +this.use_jifen_num > +this.jifen_pay.jifen) {
        alertErr(`输入的积分大于${this.jifen_pay.jifen},请重新输入`);
        this.use_jifen_num = "";
      }
    },

    peisong_toggle(item) {
      // this.peisong_type = item;
      // if (item == "上门自提") {
      //   // if (this.address_select.id) {
      //   //   this.shouhuo_name = this.address_select.name;
      //   //   this.shouhuo_phone = this.address_select.phone;
      //   // }
      // }
    },

    //上传相关
    uploadSuccess_pingjia(res, file) {
      //console.log("上传结果", res);
      let { code, data, msg } = res;
      alert(res);
      if (code == 200) {
        this.xianxia_file_list.push(res.data);
      }
    },

    beforeUpload_pingjia(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },

    handlePictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      this.dialogImageUrl = file.response.data;
      this.dialogVisible = true;
    },

    //优惠券相关
    handleCouponSelect(item) {
      //console.log("优惠券", { ...item });
      this.coupon_select_id = item.id;
    },

    //
    // toPaySuccess() {
    //   this.toPayResult(1);
    // },
    toPayFail() {
      // this.toPayResult(0)
      this.toRoute({
        path: "/order-detail",
        query: {
          from: "payment",
          id: this.order_id,
        },
        mode: "reLaunch",
      });
    },

    //
    toPayResult(is_pay = 0) {
      // this.clearCacheProduct()
      this.toRoute({
        path: "/payment-success",
        query: {
          id: this.order_id,
          type: "order",
          is_pay: is_pay,
        },
        // mode: 'redirectTo'
      });
    },

    // 发票切换
    do_fapiao_type(val) {
      this.fapiao_info.invoicType = val;

      if (val === 0) {
        //普通
        this.fapiao_info.invoiceStatus = 1;
      } else if (val === 1) {
        //专用发票
        this.fapiao_info.invoiceStatus = 1;
        this.fapiao_info.titleType = "1"; //企业
      } else if (val === 2) {
        this.fapiao_info.invoiceStatus = 1;
      } else {
        this.fapiao_info.invoiceStatus = 0;
      }
    },
  },
};
</script>

<style scoped lang="less">
.upload-box {
  padding: 20px 20px;
  text-align: left;
}

.btn-cancel {
  min-width: 100px;
  height: 40px;
  border: 1px solid #f74747;
  color: #f74747;
  font-size: 14px;
}

.btn-confirm {
  margin-left: 20px;
  min-width: 100px;
  height: 40px;
  background: #f74747;
  color: #fff;
  font-size: 14px;
}

.img-check {
  cursor: pointer;

  &.check-0 {
    display: block;
  }

  &.check-1 {
    display: none;
  }
}

.checked {
  cursor: pointer;

  .check-0 {
    display: none !important;
  }

  .check-1 {
    display: block !important;
  }
}

.page {
  background: #f3f3f3;
  text-align: center;
  font-size: 14px;

  .inner {
    margin: 0 auto;
    padding: 20px 0 100px 0;
  }

  .page-ctx {
    margin-top: 20px;
    background: #fff;
    padding: 45px 40px;
  }

  .page-title {
    margin-bottom: 30px;
    text-align: left;

    .left {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333;

      .num {
        margin-left: 10px;
      }
    }
  }

  .goods-list {
    padding: 0 20px;

    .title {
      padding-left: 20px;
      height: 48px;
      line-height: 48px;
      background: #f5f5f5;
      border-bottom: 1px solid #cccccc;
      font-size: 14px;
      font-weight: bold;
      color: #333333;
    }

    .list {
      padding-left: 19px;
      margin-bottom: 10px;
      border-left: 1px dashed #707070;

      .list-title {
        font-size: 14px;
        text-align: center;
        height: 48px;

        font-size: 14px;
        color: #666666;

        border-bottom: 1px solid #ddd;
        .box-title {
          flex: 1;
          text-align: left;
        }

        .box-sku {
          width: 240px;
        }

        .box-unit {
          width: 240px;
        }

        .box-num {
          width: 240px;
        }

        .box-subtitle {
          width: 240px;
        }
        .box-remark {
          width: 240px;
        }
      }

      .item {
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .item-detail {
          padding: 15px 0;
          text-align: center;
          font-family: OPPOSans, OPPOSans;
          // font-weight: bold;
          font-size: 14px;
          color: #666666;

          .box-title {
            flex: 1;

            .poster-box {
              margin-right: 16px;
            }

            .title-box {
              .title-text {
                font-size: 16px;
                font-weight: 500;
                color: #333333;
              }

              .box-sku {
                font-size: 14px;
                color: #999999;
                text-align: left;
              }
            }

            img {
              width: 70px;
              height: 70px;
            }

            .el-image {
              width: 70px;
              height: 70px;
            }
          }

          .box-sku {
            // width: 180px;

            font-size: 12px;
            font-family: sans-serif;
            font-weight: 400;
            color: #999999;
          }

          .box-unit {
            width: 240px;
            color: #ff0000;
          }

          .box-num {
            width: 240px;
          }

          .box-subtitle {
            width: 240px;
            color: #ff0000;
          }
          .box-remark {
            width: 240px;
          }
        }
      }
    }

    .huizong {
      padding: 24px 45px;
      background: #f9f9f9;
      justify-content: end;
      .left {
        width: 40%;
        .text {
          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
          display: block;
          margin: 0 0 5px 5px;
        }
      }
      .right {
        .item {
          margin-bottom: 16px;
          text-align: right;
          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 14px;
          color: #666666;

          &:last-child {
            margin-bottom: 0;
          }

          b {
            display: inline-block;
            min-width: 185px;
            font-family: Arial, Arial;
            font-weight: 400;
            font-size: 14px;
            color: #666666;
          }
        }

        .total {
          text-align: right;

          b {
            font-family: Arial, Arial;
            font-weight: bold;
            font-size: 20px;
            color: #ff0000;
          }
        }
      }
    }
  }

  .bottom-btns {
    display: flex;
    justify-content: flex-end;

    button {
      & + button {
        margin-left: 16px;
      }

      &.btn-1 {
        min-width: 200px;
        height: 45px;
        background: #ffffff;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid #f74747;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 17px;
        color: #f74747;
      }

      &.btn-2 {
        width: 200px;
        height: 45px;
        background: #f74747;
        border-radius: 0px 0px 0px 0px;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 17px;
        color: #ffffff;
      }

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.ziti-wrap {
  margin-bottom: 40px;
  text-align: left;
  min-height: 127px;
  background: #ffffff;
  border: 1px solid #cccccc;

  .ziti-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    border-bottom: 1px solid #cccccc;
    border-top: none;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
  }

  .ziti-ctx {
    padding: 30px 20px;

    .ziti-info {
      margin-bottom: 15px;
      display: flex;
      align-items: center;

      span {
        display: inline-block;
        min-width: 100px;
      }

      .el-input {
        width: auto;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// 支付配送方式选择

.type-select {
  margin-bottom: 40px;
  text-align: left;
  min-height: 127px;
  background: #ffffff;
  border: 1px solid #cccccc;

  .type-title {
    padding-left: 20px;
    padding-right: 20px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    border-bottom: 1px solid #cccccc;
    border-top: none;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
  }

  .type-inner {
    padding: 30px 20px;

    .select-1 {
      display: flex;
      align-items: center;

      & + .select-1 {
        margin-top: 30px;
      }

      .title {
        font-size: 14px;
        font-weight: bold;
        color: #333333;
      }

      .list {
        padding-left: 20px;

        button {
          margin-right: 20px;
          min-width: 96px;
          height: 30px;
          line-height: 30px;
          background: #ffffff;
          border: 1px solid #cccccc;

          &.active {
            border: 1px solid #f74747;
          }
        }
      }
    }

    .ziti-box {
      padding-top: 10px;

      .title {
        font-weight: bold;
      }

      .ziti-info {
        margin-top: 10px;
      }
    }
  }
}

// 订单优惠等
.order-action {
  background: #f9f9f9;
  background: #fff;
  padding: 0 0;

  .order-action-inner {
    // border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }

  .sec-item {
    margin-bottom: 20px;
  }

  .sec-title {
    margin-bottom: 5px;
    font-family: Poppins, Poppins;
    font-weight: bold;
    font-size: 24px;
    color: #333333;
  }

  .sec-tip {
    margin-bottom: 5px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 25px;
    color: #666666;
  }

  .sec-input {
    margin-top: 5px;
    margin-bottom: 5px;

    input {
      display: inline-block;
      width: 240px;
      height: 35px;
      background: #ffffff;
      border: 1px solid #cccccc;
      opacity: 1;
      border-radius: 4px;
      padding-left: 15px;
    }

    textarea {
      border: 1px solid #cccccc;
      outline: none;
      width: 460px;
      min-height: 100px;
      background: #fff;
      resize: none;
      padding: 10px 15px;
      border-radius: 4px;
    }

    .el-input {
      width: 340px;
    }

    .el-select {
      width: 340px;
    }

    .el-textarea {
      width: 460px;
      width: 100%;
    }
  }

  .use-jifen-num {
    margin-top: 10px;
    margin-bottom: 10px;

    b {
      color: #f74747;
    }
  }

  .sec-btn-actions {
    display: flex;
    align-items: center;

    .btn {
      width: 160px;
      height: 32px;
      margin-right: 20px;
      font-size: 16px;
      font-weight: bold;
      background: #e1e1e1;
      color: #333333;

      &.active {
        background: #009a44;
        color: #ffffff;
      }
    }
  }
}

// 新增
.sec {
  padding-bottom: 55px;
  text-align: left;

  .sec-title {
    font-size: 20px;
    font-weight: 500;
    color: #333333;
    height: 48px;
    line-height: 48px;
    padding-left: 24px;
    background: #f5f5f5;

    margin-left: 58px;
    position: relative;
    &:before {
      content: "";
      display: block;
      width: 38px;
      height: 38px;
      background: url("~@/assets/img/pay-method/sec4.png") no-repeat center
        center;
      background-size: 100% 100%;
      position: absolute;
      left: -58px;
      top: 5px;
    }
  }

  .sec-ctx {
    margin-top: 10px;
    padding-top: 10px;
  }
}

.sec-addr {
  padding-bottom: 55px;
  text-align: left;

  .sec-title {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 20px;
    color: #333333;
    background: #f5f5f5;
    height: 48px;
    line-height: 48px;
    padding-left: 24px;
    display: flex;
    justify-content: space-between;
    margin-left: 58px;
    position: relative;

    &:before {
      content: "";
      display: block;
      width: 38px;
      height: 38px;
      background: url("~@/assets/img/pay-method/sec1.png") no-repeat center
        center;
      background-size: 100% 100%;
      position: absolute;
      left: -58px;
      top: 5px;
    }
  }

  .sec-ctx {
    margin-top: 10px;
    margin-left: 19px;
    padding-left: 40px;
    border-left: 1px dashed #707070;
  }

  .address-list {
    display: flex;
    flex-wrap: wrap;

    .address-item {
      position: relative;
      margin-top: 20px;
      margin-right: 30px;
      width: 400px;
      min-height: 130px;
      padding: 15px 20px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 2px solid #d5d8de;
      overflow: hidden;
      cursor: pointer;

      &:nth-child(3n) {
        margin-right: 0;
      }

      &.active {
        border: 2px solid #ff0000;

        .marker {
          display: block;
        }
      }

      .marker {
        position: absolute;
        right: -1px;
        bottom: -1px;
        display: none;
      }

      .address-top {
        padding-bottom: 15px;
        border-bottom: 1px solid #d5d8de;
        font-size: 14px;
        font-family: sans-serif;
        font-weight: 400;
        color: #000000;
      }

      .address-bottom {
        padding-top: 15px;
        font-size: 14px;
        font-family: sans-serif;
        font-weight: 400;
        color: #999999;
      }
    }
  }

  .addr-add {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .btn {
      width: 133px;
      height: 40px;
      background: #e5222b;
      color: #fff;
      font-size: 16px;
      font-weight: 500;
    }
  }
}

.sec-info {
  .input-list {
    display: flex;
    flex-wrap: wrap;

    .input-item {
      width: 440px;
      margin-top: 34px;
      margin-right: 40px;

      &:nth-child(3n) {
        margin-right: 0;
      }

      &:nth-child(-n + 3) {
        margin-top: 0;
      }

      .label {
        margin-bottom: 16px;
        font-size: 14px;
        font-weight: normal;
        color: #666666;

        span {
          color: #f74747;
        }
      }

      .val {
        .img-address-edit {
          margin-left: 15px;
          width: 16px;
          cursor: pointer;
        }
      }
    }
  }
}

// 支付配送
.sec-pay {
  padding-bottom: 20px;
  text-align: left;

  .sec-title {
    font-size: 20px;
    font-weight: 500;
    color: #333333;
    height: 48px;
    line-height: 48px;
    background: #f5f5f5;
    margin-bottom: 20px;
    padding-left: 20px;

    margin-left: 58px;
    position: relative;

    &:before {
      content: "";
      display: block;
      width: 38px;
      height: 38px;
      background: url("~@/assets/img/pay-method/sec2.png") no-repeat center
        center;
      background-size: 100% 100%;
      position: absolute;
      left: -58px;
      top: 5px;
    }
  }

  .sec-ctx {
  }

  .pay-group {
    display: flex;
    padding-left: 12px;

    .title {
      // min-width: 120px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #666666;
    }

    .pay-items {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .pay-items-left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .item {
        display: flex;
        align-items: center;
        margin-right: 60px;
        cursor: pointer;

        .check-img {
          width: 21px;
        }

        .check-img-1 {
          display: none;
        }

        .marker-img {
          width: 39px;
          margin: 0 10px;
        }

        span {
          font-size: 16px;
          font-family: sans-serif;
          font-weight: 400;
          color: #000000;
        }
      }
    }

    .wuli-info {
      display: flex;
      align-items: center;
      height: 40px;
      margin-bottom: 30px;

      .info-title {
        font-size: 16px;
        font-weight: 500;
        color: #666666;
      }

      .info-item {
        display: flex;
        align-items: center;
        align-items: flex-start;

        .info-label {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }
      }
    }
  }
}

.sec-product {
}

.sec-ctx-type {
  margin-left: 19px;
  padding-left: 40px;
  border-left: 1px dashed #707070;
}

// 线下转款信息
.xianxia-info {
  padding: 16px 22px;
  width: 400px;
  height: 167px;
  background: #fffdf1;
  border: 1px solid #f8e9d2;

  .info-title {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 18px;
    color: #000000;
    margin-bottom: 14px;
  }

  .info-item {
    display: flex;
    align-items: center;
    align-items: flex-start;

    .info-label {
      line-height: 32px;
      padding-right: 10px;
      font-size: 14px;
      font-family: sans-serif;
      font-weight: 400;
      color: #666666;
    }

    .info-val {
      line-height: 32px;
      font-size: 14px;
      font-family: sans-serif;
      font-weight: 400;
      color: #666666;
      display: flex;
      align-items: center;
      img {
        width: 12px;
        height: 12px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
}

.scroll-target-pingzheng {
  /deep/ .el-button--primary {
    background: #f74747;
    border: 1px solid #f74747;
    color: #fff;
  }
}

.sec-fapiao {
  padding-bottom: 20px;
  text-align: left;

  .sec-title {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 500;
    color: #333333;
    height: 48px;
    line-height: 48px;
    padding-left: 24px;
    background: #f5f5f5;

    margin-left: 58px;
    position: relative;

    &:before {
      content: "";
      display: block;
      width: 38px;
      height: 38px;
      background: url("~@/assets/img/pay-method/sec3.png") no-repeat center
        center;
      background-size: 100% 100%;
      position: absolute;
      left: -58px;
      top: 5px;
    }
  }

  .sec-ctx {
  }

  .fapiao-info {
    padding-left: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 20px;
    padding-left: 19px;
    border-left: 1px dashed #707070;
    margin-left: 19px;

    .main-title {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #666666;
    }

    .type-list {
      margin-left: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      .type-item {
        width: 105px;
        height: 33px;
        background: #ffffff;
        border: 1px solid #eeeeee;

        line-height: 33px;
        text-align: center;
        margin-right: 20px;
        cursor: pointer;

        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #333333;

        &.active {
          color: #e5222b;
          border: 1px solid #e5222b;
        }

        &:hover {
        }
      }
    }
  }

  .fapiao-box {
    width: 600px;

    .input-box {
      display: flex;
      align-items: center;
      height: 40px;
      margin-bottom: 16px;
      .label {
        width: 216px;
        text-align: right;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #666666;

        &::before {
          content: "*";
          color: #f00;
          margin-right: 4px;
        }
      }
      .val-box {
        flex: 1;
        margin-left: 16px;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/order-submit.less"></style>

<style lang="less">
@media screen and (max-width: 1199px) {
  .modal-pay-tip {
    .el-dialog {
      width: 80% !important;

      .el-dialog__header {
        height: 40px;
        line-height: 40px;
        padding-left: 15px;
      }

      .el-dialog__title {
        font-size: 16px;
      }

      .el-dialog__headerbtn {
        top: 10px;
        right: 10px;
      }

      .el-dialog__headerbtn .el-dialog__close {
        font-size: 24px;
      }

      .el-dialog__body {
        padding: 30px 20px;
        font-size: 14px;
      }

      .el-dialog__footer {
        padding-bottom: 25px;
        display: flex;
        justify-content: center;
      }

      .btn-cancel {
        height: 32px;
      }

      .btn-confirm {
        height: 32px;
      }
    }
  }
}
</style>
