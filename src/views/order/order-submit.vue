<template>
  <div class="page order-submit-page">
    <div class="inner w-1400">
      <div class="page-ctx two-column-layout">
        <!-- 左侧主列：表单信息 -->
        <div class="left-column">
          <div class="page-header">
            <h1 class="page-title">Please fill in the order information</h1>
          </div>
          <!-- Shipping Address -->
          <div class="sec-addr section-card">
            <div class="section-header">
              <div class="section-icon">
                <img src="@img/order/icon1.png" alt />
              </div>
              <div class="section-title">Shipping Address</div>
            </div>
            <div class="sec-ctx address-form" v-if="!address_list.length || showAddressForm">
              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  First Name:
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter first name"
                  v-model="addressForm.firstName"
                />
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  Last Name:
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter Last name"
                  v-model="addressForm.lastName"
                />
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  Phone Number:
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter Phone Number"
                  v-model="addressForm.phone"
                />
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  Email:
                </label>
                <input
                  type="email"
                  class="form-input"
                  placeholder="Please enter an email address"
                  v-model="addressForm.email"
                />
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  Detailed Address:
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="addressForm.address"
                />
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  City:
                </label>
                <template v-if="!cityList.length">
                  <el-input clearable v-model="addressForm.city" placeholder="Please enter"></el-input>
                </template>
                <template v-else>
                  <el-select
                    filterable
                    v-model="addressForm.cityId"
                    placeholder="Please select"
                    @change="changeCity"
                  >
                    <el-option
                      v-for="item in cityList"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  State:
                </label>
                <template v-if="!stateList.length">
                  <el-input clearable v-model="addressForm.state" placeholder="Please enter"></el-input>
                </template>
                <template v-else>
                  <el-select
                    filterable
                    v-model="addressForm.stateId"
                    placeholder="Please select"
                    @change="changeProv"
                  >
                    <el-option
                      v-for="item in stateList"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  Country:
                </label>
                <el-select
                  filterable
                  v-model="addressForm.countryId"
                  placeholder="Please select"
                  @change="changeCountry"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  Zip Code:
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="addressForm.zipCode"
                />
              </div>
              <div class="form-group toggle-group">
                <label class="toggle-label">
                  <el-switch
                    v-model="addressForm.setAsDefault"
                    active-color="#EC6A2B"
                    inactive-color="#999"
                  ></el-switch>
                  <span class="toggle-text">Set as default address</span>
                </label>
              </div>
              <div class="form-actions">
                <button class="btn-confirm" @click="confirmAddress()">CONFIRM</button>
                <button class="btn-cancel" @click="cancelAddressForm()">CANCEL</button>
              </div>
            </div>
            <div class="sec-ctx" v-else>
              <div class="address-list" v-if="address_list.length">
                <div
                  class="address-item"
                  v-for="(item, index) in address_list"
                  :key="index"
                  :class="{ active: item.id == address_select.id }"
                  @click="do_toggle_address(item)"
                >
                  <div class="address-top">
                    <div>
                      <span>Receiver:</span>
                      {{ item.firstName + item.lastName }}
                    </div>
                    <div>
                      <span>Location:</span>
                      {{ item.full_addr }}
                    </div>
                    <div>
                      <span>Detailed Address:</span>
                      {{ item.address }}
                    </div>
                    <div>
                      <span>Phone Number:</span>
                      {{ item.phone }}
                    </div>
                  </div>
                  <div class="address-bottom">
                    <div class="left">
                      <span
                        v-if="item.if_default == 1 || item.moren == 1"
                        class="moren"
                      >Default Address</span>
                    </div>
                  </div>
                  <img src="@img/order/addr-select.png" alt class="marker" />
                </div>
              </div>
              <div class="addr-add">
                <div class="empty-title" v-if="!address_list.length">No shipping address</div>
                <button class="btn btn-ripple" @click="open_addr_add()">+ Add Address</button>
              </div>
            </div>
          </div>

          <!-- Delivery Method -->
          <div class="sec-delivery section-card">
            <div class="section-header">
              <div class="section-icon">
                <img src="@img/order/icon2.png" alt />
              </div>
              <div class="section-title">Delivery Method</div>
            </div>
            <div class="sec-ctx">
              <div class="delivery-options">
                <label class="radio-option">
                  <input type="radio" name="delivery" value="express" v-model="deliveryMethod" />
                  <span>Express Mail</span>
                  <span class="delivery-price">
                    <img src="@img/order/delivery.png" alt />
                  </span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="delivery" value="pickup" v-model="deliveryMethod" />
                  <span>Pickup available at XXXaddress</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="sec-pay section-card">
            <div class="section-header">
              <div class="section-icon">
                <img src="@img/order/icon3.png" alt />
              </div>
              <div class="section-title">Payment Methods</div>
            </div>
            <div class="sec-ctx sec-ctx-type">
              <div class="payment-options">
                <label class="radio-option">
                  <input type="radio" name="payment" value="online" checked />
                  <span class="payment-title">Online Payment</span>
                  <div class="payment-logos">
                    <div
                      class="payment-logo"
                      :class="{ active: paymentType === 'online' }"
                      @click="handle_paypal_click('online')"
                    >
                      <img src="@img/order/paypal.png" alt />
                    </div>
                    <div
                      class="payment-logo"
                      :class="{ active: paymentType === 'stripe' }"
                      @click="handle_paypal_click('stripe')"
                    >
                      <img src="@img/order/stripe.png" alt />
                    </div>
                  </div>
                </label>
              </div>

              <!-- <div class="card-form" v-if="paymentType === 'online'">
                <div class="form-group">
                  <label class="form-label">
                    <span class="required">*</span>
                    <span>Cardholder's Name:</span>
                  </label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Please enter"
                    v-model="cardForm.cardholderName"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <span class="required">*</span>
                    <span>Card Number:</span>
                  </label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Please enter"
                    v-model="cardForm.cardNumber"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <span class="required">*</span>
                    <span>Expiry Date:</span>
                  </label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="MM/YY"
                    v-model="cardForm.expiryDate"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <span class="required">*</span>
                    <span>CVC/CVV:</span>
                  </label>
                  <input type="text" class="form-input" placeholder="CVC" v-model="cardForm.cvc" />
                </div>
                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="cardForm.saveCard" />
                    <span>
                      Save card for future purchases
                      <br />Your card details are protected using PCI DSS v3.2 security standards.
                    </span>
                  </label>
                </div>
              </div>-->
            </div>
          </div>

          <!-- Invoice -->
          <div class="sec-fapiao section-card">
            <div class="section-header">
              <div class="section-icon">
                <img src="@img/order/icon4.png" alt />
              </div>
              <div class="section-title">Invoice</div>
            </div>
            <div class="sec-ctx">
              <div class="invoice-toggles">
                <button
                  class="toggle-btn"
                  :class="{ active: fapiao_info.invoiceType == '' }"
                  @click="do_fapiao_type('')"
                >
                  Not
                  Required
                </button>
                <button
                  class="toggle-btn"
                  :class="{ active: fapiao_info.invoiceType == 1 }"
                  @click="do_fapiao_type(1)"
                >Receipt</button>
                <button
                  class="toggle-btn"
                  :class="{ active: fapiao_info.invoiceType == 2 }"
                  @click="do_fapiao_type(2)"
                >
                  Commercial
                  Invoice
                </button>
              </div>
              <div class="invoice-type-toggles" v-if="fapiao_info.invoiceType != ''">
                <button
                  class="toggle-btn"
                  :class="{ active: fapiao_info.titleType == 1 }"
                  @click="fapiao_info.titleType = 1"
                >Personal</button>
                <button
                  class="toggle-btn"
                  :class="{ active: fapiao_info.titleType == 2 }"
                  @click="fapiao_info.titleType = 2"
                >Company</button>
              </div>
              <div class="invoice-form" v-if="fapiao_info.invoiceType != ''">
                <!-- Personal 模式 -->
                <template v-if="fapiao_info.titleType == 1">
                  <div class="form-group">
                    <label class="form-label">Name:</label>
                    <input
                      type="text"
                      class="form-input"
                      placeholder="Please enter your name"
                      v-model="fapiao_info.title"
                    />
                  </div>
                </template>
                <!-- Company 模式 -->
                <template v-if="fapiao_info.titleType == 2">
                  <div class="form-group">
                    <label class="form-label">Company Name:</label>
                    <el-input
                      clearable
                      v-model="fapiao_info.title"
                      placeholder="Please fill in the name of the organization"
                    ></el-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Taxpayer Identification Code:</label>
                    <el-input
                      clearable
                      v-model="fapiao_info.shibiema"
                      placeholder="Please fill in the taxpayer identification code"
                    ></el-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Company Registered Address:</label>
                    <el-input
                      clearable
                      v-model="fapiao_info.companyAddress"
                      placeholder="Please fill in the registered address"
                    ></el-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Registration Phone Number:</label>
                    <el-input
                      clearable
                      v-model="fapiao_info.companyPhone"
                      placeholder="Please fill in the registration phone number"
                    ></el-input>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Coupon -->
          <div class="sec-coupon section-card">
            <div class="section-header">
              <div class="section-icon">
                <img src="@img/order/icon4.png" alt />
              </div>
              <div class="section-title">Coupon</div>
            </div>
            <div class="sec-ctx">
              <div class="coupon-toggles">
                <button
                  class="toggle-btn"
                  :class="{ active: couponTab === 'coupon' }"
                  @click="couponTab = 'coupon'"
                >Coupon</button>
                <button
                  class="toggle-btn"
                  :class="{ active: couponTab === 'promo' }"
                  @click="couponTab = 'promo'"
                >
                  Promo
                  Code
                </button>
              </div>
              <div class="coupon-cards" v-if="couponTab === 'coupon'">
                <div
                  class="coupon-card-item"
                  v-for="(item, index) in list_coupon"
                  :key="index"
                  :class="{ selected: coupon_select_id == item.id }"
                  @click="handleCouponSelect(item)"
                >
                  <div class="coupon-top">
                    <div class="currency">$</div>
                    <div class="amount">{{ item.jian }}</div>
                  </div>
                  <div class="coupon-bottom">
                    <div class="coupon-condition">Orders Over ${{ item.man }}</div>
                    <div class="validity-period">Expires {{ item.endTime }}</div>
                  </div>
                  <img src="@img/coupon/selectd.png" alt class="selectd" />
                </div>
              </div>
              <!-- Promo Code Section -->
              <div class="promo-code-section" v-if="couponTab === 'promo'">
                <div class="promo-code-label">Please enter the promo code :</div>
                <div class="promo-code-input-wrapper">
                  <input
                    type="text"
                    class="promo-code-input"
                    v-model="yh_code"
                    placeholder="Enter promo code"
                  />
                  <button class="promo-code-confirm-btn" @click="query_yh">CONFIRM</button>
                </div>
                <div
                  class="promo-code-discount"
                  v-if="money_yhq > 0 || (coupon_code_info && (coupon_code_info.discount_amount || coupon_code_info.jian))"
                >
                  <span class="discount-label">Discount code offset amount</span>
                  <span class="discount-amount">
                    {{ vuex_huobi }}{{ money_yhq || (coupon_code_info &&
                    (coupon_code_info.discount_amount || coupon_code_info.jian)) || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧列：订单摘要 -->
        <div class="right-column">
          <div class="order-summary">
            <!-- 商品列表 -->
            <div class="product-list">
              <div class="product-item" v-for="(item, index) in payment_products" :key="index">
                <div class="product-item-top">
                  <div class="product-icon">
                    <img :src="item.image" alt />
                  </div>
                  <div class="product-info">
                    <div class="product-name">{{ item.title }}</div>
                    <div
                      class="product-details"
                    >{{ item.keyVals || 'Color: green Size: M Style: 100/pack' }}</div>
                  </div>
                </div>

                <div class="product-quantity">
                  <div class="product-price">{{ vuex_huobi }}{{ item.priceSale }}</div>
                  <div class="product-quantity-actions">
                    <button class="qty-btn" @click="decreaseQuantity(item, index)">-</button>
                    <span class="qty-value">{{ item.num }}</span>
                    <button class="qty-btn" @click="increaseQuantity(item, index)">+</button>
                    <div
                      class="product-remove"
                      :class="{ disabled: payment_products.length <= 1 }"
                      @click="removeProduct(item, index)"
                    >
                      <img src="@img/order/icon-delete.png" alt />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 价格明细 -->
            <div class="price-breakdown">
              <div class="price-item total">
                <span class="price-label">Subtotal: {{ total_product_number }} items</span>
                <span class="price-value">{{ vuex_huobi }}{{ pay_info.goodsPrice || 0 }}</span>
              </div>
              <div class="price-item">
                <span class="price-label">Shipping</span>
                <span class="price-value">+{{ vuex_huobi }}{{ pay_info.foreignYunfei || 0 }}</span>
              </div>
              <div class="price-item" v-if="money_yhq > 0">
                <span class="price-label">Coupon</span>
                <span class="price-value">-{{ vuex_huobi }}{{ money_yhq || 0 }}</span>
              </div>
              <div class="price-item" v-if="order_zhekou_price > 0">
                <span class="price-label">Other Discounts</span>
                <span class="price-value">-20%</span>
              </div>
              <div class="price-item" v-if="Coupon_checked">
                <span class="price-label">Other discounts</span>
                <span class="price-value">-20%</span>
              </div>
              <div class="price-item total">
                <span class="price-label">Total Amount</span>
                <span class="price-value">{{ vuex_huobi }}{{ Coupon_checked ? Number(pay_info.orderPrice * 0.8).toFixed(2) : (pay_info.orderPrice) || 0 }}</span>
              </div>

              <div class="checkbox-group">
                <el-checkbox v-model="Coupon_checked"></el-checkbox>
                <span>Accept the order to be shipped within 30 days, get further 20% off.</span>
              </div>

              <div class="submit">
                <button class="btn-ripple btn-confirm" @click="do_submit()">CHECK OUT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增收货地址弹窗 -->
    <foreign_address_modal ref="foreign_address_modal" @confirm="confirm_add_address" />

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
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>

    <!-- 订单支付提示 -->
    <el-dialog
      class="modal-pay-tip"
      title="Order Reminder"
      :visible.sync="confirm_tip"
      width="30%"
      :before-close="handleClose"
      :append-to-body="true"
      :show-close="false"
    >
      <span>Confirm payment for the current order?</span>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple btn-cancel" @click="confirm_tip = false">Cancel</button>
        <button class="btn-ripple btn-confirm" @click="do_confirm_submit()">CONFIRM PAYMENT</button>
      </span>
    </el-dialog>

    <!-- 选择支付方式 -->
    <el-dialog
      class="modal-pay-tip"
      :visible.sync="payment_tip"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      center
    >
      <span>Payment method</span>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple btn-confirm" @click="pay_use_weixin()">WeChat</button>
        <button class="btn-ripple btn-confirm" @click="pay_use_zhifubao()">Alipay</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { SHOP_TYPE } from "@/config/env.js";

import foreign_address_modal from "@/components/address/foreign_address_modal.vue"; //新增地址

import balance_password_set_modal from "@/components/payment/balance_password_set_modal.vue";
import balance_pay_modal from "@/components/payment/balance_pay_modal.vue";
import balance_pay_disable_modal from "@/components/payment/balance_pay_disable_modal.vue";

import orderPayWxCode from "@/components/order/orderPayWxCode.vue";
import orderPayWaiting from "@/components/order/orderPayWaiting.vue";

import { mapState } from "vuex";

export default {
  name: "order-submit",
  components: {
    foreign_address_modal,

    balance_password_set_modal,
    balance_pay_modal,
    balance_pay_disable_modal,
    orderPayWxCode,
    orderPayWaiting
  },
  data() {
    return {
      is_order_test: true, //订单测试
      //
      from: "", //product-detail  ||  cart
      //
      address_select: {}, //地址
      pagination_address: {
        page: 1,
        pagenum: 20
      },
      coupon_selected: {}, //优惠券
      coupons_for_allow_use: [],
      remark: "",
      //
      payment_products: [],
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
      userCard: "", //卡余额
      //
      fapiao_info: {
        invoiceStatus: 0, //是否开票 0-不需要 1-需要发票
        invoiceType: "", //发票类型：1-普通发票 2-专用发票
        titleType: "1", //抬头：1-个人 2-单位
        title: "", //
        shibiema: "", //
        companyAddress: "", //
        companyPhone: "", //
        bankName: "", //
        bankNo: "" //
      },
      // 支付方式
      payTypeValue: 2,
      pay_type_value: "paypal",
      pay_method_list: [
        {
          value: "weixin",
          title: "微信支付",
          icon: require("@img/pay-method/type-weixin.png"),
          show: true
        },
        {
          value: "zhifubao",
          title: "支付宝支付",
          icon: require("@img/pay-method/type-zfb.png"),
          show: true
        },
        // { value: 'xianxia', title: '线下转款', icon: require('@img/pay-method/type-xianxia.png') },
        //{ value: 'paypal', title: 'PayPal', icon: require('@img/pay-method/type-paypal.png') },
        {
          value: "yue",
          title: "余额支付",
          icon: require("@img/pay-method/type-yue.png"),
          show: true
        }
        // {
        //   value: "duihuanka",
        //   title: "兑换卡支付",
        //   icon: require("@img/pay-method/type-yue.png"),
        //   show: false,
        // },
      ],

      //
      //
      //
      //
      //
      //
      //
      //
      //
      Coupon_checked: false, //是否接受折扣

      order_id: "", //是否已经创建过订单
      showCoupon: true, //

      if_use_jifen: true, //是否使用积分抵扣
      if_use_yongjin: true, //是否使用佣金扣减
      jifen_pay: {}, //积分抵扣信息
      currency: "￥", //货币

      money_yunfei: 0,
      order_price: 0, //总 订单金额

      yh_code: "",
      yh_code_info: {},

      remark: "",

      peisong_type: "快递配送",
      address_select: {},
      address: "", //选择的地址
      address_list: [], //地址列表
      payment_products: [], //要支付的商品信息
      list_coupon: [], //优惠券
      coupon_select_id: "", //选择的优惠券 id

      // 新样式相关数据
      showAddressForm: false,
      addressForm: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        country: "",
        countryId: "",
        stateId: "",
        cityId: "",
        zipCode: "",
        setAsDefault: false
      },
      // 地区选择相关数据（通过 users_getAreaList 接口获取）
      countryList: [],
      stateList: [],
      cityList: [],
      deliveryMethod: "express",
      paymentType: "online",
      paymentProvider: "",
      cardForm: {
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        saveCard: false
      },
      couponTab: "coupon",

      //

      is_pay_pass: 0, //是否设置余额支付密码
      payType: "",
      upload_limit_number: 6,
      dialogVisible: false,
      dialogImageUrl: "", //转账图片查看
      confirm_tip: false, //确认支付信息提示
      xianxia_file_list: [],

      peisong_list: ["快递配送", "上门自提"],
      ifCard: 0, //是否使用兑换
      payment_tip: false,

      // 优惠券/优惠码相关状态
      activeTab: "coupon", // 当前激活的标签页: 'coupon' | 'code'
      couponSubTab: "available", // 优惠券子标签: 'available' | 'unavailable'
      unavailable_coupons: [], // 不可用优惠券列表

      coupon_code_info: {
        //优惠码信息
      }
    };
  },
  computed: {
    ...mapState([""]),

    real_payment_money() {
      let money = parseFloat(
        (this.total_order_price - this.order_points_dixian_price).toFixed(2)
      );
      return money;
    },
    //

    coupon_select() {
      return this.list_coupon.find(v => v.id == this.coupon_select_id) || {};
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
          this.list_coupon.find(v => v.id == this.coupon_select_id) || {};
        money_yhq = yhq.jian || 0;
      }
      // this.query_pay_info();
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

    // 当前显示的优惠券列表
    currentCouponList() {
      if (this.couponSubTab === "available") {
        return this.list_coupon;
      } else {
        return this.unavailable_coupons;
      }
    }
  },
  watch: {
    coupon_select_id(val, oldval) {
      this.query_pay_info();
    }
  },
  created() {
    this.from = this.$route.query.from || "";
    this.getCacheProduct();

    // 通过 users_getAreaList 获取国家列表
    this.queryCountryData();

    //
    this.query_user();
    this.query_address();
    this.query_pay_info();
    // this.do_create_submit(0)
  },
  methods: {
    handle_paypal_click(type) {
      this.paymentType = type;
    },
    // 新样式相关方法
    confirmAddress() {
      // 表单验证
      if (!this.addressForm.firstName) {
        alertErr("Please enter first name");
        return;
      }
      if (!this.addressForm.lastName) {
        alertErr("Please enter last name");
        return;
      }
      if (!this.addressForm.phone) {
        alertErr("Please enter phone number");
        return;
      }
      const countryTitle = this.countryList.find(
        c => c.id == this.addressForm.countryId
      )?.title;
      if (!this.addressForm.countryId || !countryTitle) {
        alertErr("Please select country");
        return;
      }
      const stateTitle = this.stateList.length
        ? this.stateList.find(s => s.id == this.addressForm.stateId)?.title
        : this.addressForm.state;
      if (!stateTitle) {
        alertErr(
          this.stateList.length ? "Please select state" : "Please enter state"
        );
        return;
      }
      const cityTitle = this.cityList.length
        ? this.cityList.find(c => c.id == this.addressForm.cityId)?.title
        : this.addressForm.city;
      if (!cityTitle) {
        alertErr(
          this.cityList.length ? "Please select city" : "Please enter city"
        );
        return;
      }
      if (!this.addressForm.address) {
        alertErr("Please enter detailed address");
        return;
      }
      if (!this.addressForm.zipCode) {
        alertErr("Please enter zip code");
        return;
      }

      // 构建提交数据（Country/State/City 从 users_getAreaList 列表取 title 提交）
      let formData = {
        firstName: this.addressForm.firstName,
        lastName: this.addressForm.lastName,
        phone: this.addressForm.phone,
        company: this.addressForm.email || "",
        country: countryTitle,
        province: stateTitle,
        city: cityTitle,
        address: this.addressForm.address,
        zipCode: this.addressForm.zipCode,
        moren: this.addressForm.setAsDefault ? 1 : 0,
        addressType: 2 // 版本：1-国内 2-国外
      };

      // 提交地址
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_add",
          ...formData
        }
      }).then(res => {
        if (res.code == 200) {
          alert(res);
          // 刷新地址列表
          this.query_address();
          // 关闭表单
          this.showAddressForm = false;
          // 清空表单
          this.addressForm = {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            state: "",
            country: "",
            countryId: "",
            stateId: "",
            cityId: "",
            zipCode: "",
            setAsDefault: false
          };
          this.stateList = [];
          this.cityList = [];
        } else {
          alertErr(res.message || "Failed to add address");
        }
      });
    },
    cancelAddressForm() {
      // 清空表单
      this.addressForm = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        country: "",
        countryId: "",
        stateId: "",
        cityId: "",
        zipCode: "",
        setAsDefault: false
      };
      this.stateList = [];
      this.cityList = [];
      this.showAddressForm = false;
    },
    // 通过 users_getAreaList 获取国家列表
    queryCountryData() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_getAreaList"
        }
      }).then(res => {
        if (res.code == 200) {
          this.countryList = res.data || [];
        }
      });
    },
    // 选择国家
    changeCountry(id) {
      this.addressForm.state = "";
      this.addressForm.city = "";
      this.addressForm.stateId = "";
      this.addressForm.cityId = "";
      this.stateList = [];
      this.cityList = [];
      if (!id) return;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_getAreaList",
          parent_id: id
        }
      }).then(res => {
        if (res.code == 200) {
          this.stateList = res.data || [];
        }
      });
    },
    // 选择州/省
    changeProv(id) {
      this.addressForm.city = "";
      this.addressForm.cityId = "";
      this.cityList = [];
      if (!id) return;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_getAreaList",
          parent_id: id
        }
      }).then(res => {
        if (res.code == 200) {
          this.cityList = res.data || [];
        }
      });
    },
    // 选择城市
    changeCity(id) {
      // 仅更新 cityId，提交时从 cityList 取 title
    },
    selectPaymentProvider(provider) {
      this.paymentProvider = provider;
    },
    decreaseQuantity(item, index) {
      if (item.num > 1) {
        item.num--;
        this.updateProductQuantity();
      }
    },
    increaseQuantity(item, index) {
      item.num++;
      this.updateProductQuantity();
    },
    removeProduct(item, index) {
      // 如果只有一个商品，禁止删除
      if (this.payment_products.length <= 1) {
        alertErr("At least one product is required");
        return;
      }
      this.payment_products.splice(index, 1);
      this.updateProductQuantity();
    },
    // 更新商品数量后同步更新价格
    updateProductQuantity() {
      // 更新总商品数量
      let total_product_number = 0;
      this.payment_products.forEach(v => {
        total_product_number += parseInt(v.num);
      });
      this.total_product_number = total_product_number;

      // 更新缓存的产品信息
      sessionStorage.setItem(
        "cache_payment_products",
        JSON.stringify(this.payment_products)
      );

      // 重新查询价格信息
      this.query_pay_info();
    },
    //下单成功后 移除商品信息
    clearCacheProduct() {
      if (this.from == "cart") {
        //移除购物车中商品
        let guige_ids = this.payment_products.map(v => v.guige_id).join(",");
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "gouwuche_del",
            inventoryId: guige_ids //产品规格id(多个用,分开)
          }
        }).then(res => {
          if (res.code == 200 && this.$store && this.$store.dispatch) {
            this.$store.dispatch("query_cart");
          }
        });
      }
      sessionStorage.removeItem("cache_payment_products");
    },

    //获取缓存的产品信息
    getCacheProduct() {
      //本地产品数据
      let cache_payment_products = sessionStorage.getItem(
        "cache_payment_products"
      );
      if (cache_payment_products) {
        this.payment_products = JSON.parse(cache_payment_products);

        let total_product_number = 0;
        let total_product_price = 0;
        this.payment_products.forEach(v => {
          total_product_number += parseInt(v.num);
          total_product_price += v.price_sale * parseInt(v.num);
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
          action: "users_userInfo"
        }
      }).then(res => {
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
          ...this.pagination_address
          // shop_id: this.id,
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data;

          data.forEach(v => {
            if (SHOP_TYPE == "foreign") {
              //医买买
              v.full_addr = [v.country, v.province, v.city, v.area]
                .filter(v => !!v)
                .join("-");
              v.name_phone = `${v.firstName} ${v.lastName} (${v.phone})`;
            } else {
              v.full_addr = [v.country, v.province, v.city, v.area]
                .filter(v => !!v)
                .join("-");
              v.name_phone = `${v.name} (${v.phone})`;
            }
          });
          this.address_list = data;

          let obj = data.find(v => v.moren) || {};
          this.address_select = obj || {};
        }
      });
    },

    get_pay_info_params() {
      let product_items = this.payment_products.map(v => ({
        inventoryId: v.inventoryId,
        productId: v.productId,
        num: v.num
      }));
      let productInfo = JSON.stringify(product_items);

      let params = {
        productInfo: productInfo,
        addressId: this.address_select.id || "",
        yhqId: this.coupon_select_id || "" //优惠券记录ID
      };
      return params;
    },

    get_pay_params() {
      let product_items = this.payment_products.map(v => ({
        inventoryId: v.inventoryId,
        productId: v.productId,
        num: v.num
      }));
      let productInfo = JSON.stringify(product_items);

      let params = {
        productInfo: productInfo,
        addressId: this.address_select.id || "",
        peisongType: 1, //配送类型：1-快递物流 2-上门自提
        peisongTime: "", //配送时间
        yhqId: this.coupon_select_id, //优惠券记录ID
        tuanId: "", //参与拼团的团ID
        tuanType: "", //拼团类型：0-普通订单 1-普通团 2-社区团
        remark: "", //备注
        payType: this.paymentType == "online" ? 1 : 2,
        receiveType: this.paymentType == "online" ? 1 : 2,
        deliveryDiscount: this.Coupon_checked ? 1 : 0,
        ...this.fapiao_info
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
          ifCard: this.ifCard,
          ...params
        }
      }).then(res => {
        let { code, data, msg } = res;
        if (code == 200) {
          // let item = this.pay_method_list.find(item => item.value == 'duihuanka');
          // if(res.data.cardInfo!=false){
          //  item.show=true
          // }else{
          // item.show=false
          // }
          this.pay_info = data;
          this.jifen_pay = data.jifen_pay || {}; //积分信息
          console.log(data, "---r");
          this.userCard = data.userCard;
          //
          this.total_order_price = data.orderPrice || 0;
          //this.total_product_price = data.goods_price || 0;
          this.order_zhekou_bili = parseFloat(data.zhekou) || 10;
          this.order_zhekou_price = parseFloat(data.zhekouPrice) || 0;
          this.order_yunfei = data.yunfei || 0;

          this.format_coupon_view_info(data.yhqList);
          this.coupons_for_allow_use = data.yhqList || [];
          this.total_product_price = data.goods_price;

          if (this.coupon_selected.id) {
            this.total_order_price = (
              this.total_order_price - this.coupon_selected.jian
            ).toFixed(2);
          }

          if (data.yhqList.length) {
            this.list_coupon = data.yhqList.map(item => ({
              ...item,

              miaoshu: +item.man
                ? `满${+item.man}减${+item.jian}元`
                : `下单立减${+item.jian}元`,
              youxiaoqi:
                item.startTime.substr(0, 10) +
                " - " +
                item.endTime.substr(0, 10)
            }));
          }
          this.order_price = data.order_price;
          this.money_yunfei = +data.yunfei || 0;
          this.jifen_pay = data.jifen_pay;
        }
      });
    },

    // 格式化优惠券展示信息
    format_coupon_view_info(list) {
      console.log(list, "?");
      list.forEach(v => {
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
      if (value == "兑换卡支付") {
        this.ifCard = 1;
      } else {
        this.ifCard = 0;
      }
      this.query_pay_info();
      if (value == "余额支付") {
        if (this.vuex_user.is_pay_pass == 0) {
          //未设置支付密码
          this.$refs.balance_password_set_modal.init(this.vuex_user);
        } else if (this.total_balance < this.real_payment_money) {
          //余额不足提示
          this.$refs.balance_pay_disable_modal.init({
            money: this.real_payment_money
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
        ...this.form
      };
      delete params_info.phone;

      if (!this.address_select.id) {
        return alertErr("Please select a delivery address");
      }

      if (!this.pay_type_value) {
        return alertErr("Please select a payment method");
      }

      if (this.pay_type_value == "xianxia") {
        if (!this.xianxia_file_list.length) {
          this.scrollToTarget(".scroll-target-pingzheng");
          return alertErr("Please upload transfer voucher");
        }
      }

      if (this.pay_type_value == "balance") {
        if (this.total_balance < +this.real_payment_money) {
          return alertErr(
            "Insufficient balance, please choose another payment method"
          );
        }
        // if (!this.is_pay_pass) {
        //   alertErr("Please set balance payment password first");
        //   this.$refs.balance_password_set_modal.init(this.vuex_user);
        //   return;
        // }
      }

      if (this.fapiao_info.invoiceType == 1) {
        //普通发票
        if (!this.fapiao_info.titleType) {
          return alertErr("Please select invoice title type");
        }
        if (!this.fapiao_info.title) {
          return alertErr("Please enter invoice title");
        }
        // if (!this.fapiao_info.email) {
        //   return alertErr("Please enter email address");
        // }
        if (this.fapiao_info.titleType == 2) {
          if (!this.fapiao_info.shibiema) {
            return alertErr("Please enter tax identification number");
          }
        }
      } else if (this.fapiao_info.invoiceType == 2) {
        //增值税发票
        if (!this.fapiao_info.title) {
          return alertErr("Please enter the correct title name");
        }
        if (!this.fapiao_info.shibiema) {
          return alertErr("Please enter the correct tax identification number");
        }
        if (!this.fapiao_info.companyAddress) {
          return alertErr("Please enter company registration address");
        }
        if (!this.fapiao_info.companyPhone) {
          return alertErr("Please enter company registration phone");
        }
        // if (!this.fapiao_info.bankName) {
        //   return alertErr("Please enter bank name");
        // }
        // if (!this.fapiao_info.bankNo) {
        //   return alertErr("Please enter bank account");
        // }
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
        inline: "center"
      });
    },

    handleClose(done) {},

    // 预支付
    do_create_submit(val) {
      let params = this.get_pay_params();

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_getPayInfo",
          ifCard: val,
          ...params
        }
      }).then(res => {
        if (res.code == 200) {
          console.log(res, "-预支付");
          let item = this.pay_method_list.find(
            item => item.value == "duihuanka"
          );
          if (res.data.cardInfo != false) {
            item.show = true;
          } else {
            item.show = false;
          }
          this.query_pay_info();
        }
      });
    },
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

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_create",
          ...params
        }
      }).then(res => {
        if (res.code == 200) {
          let { id, orderNo } = res.data;
          this.order_id = id;
          this.do_order_pay();
        } else {
          alertErr(res.message);
        }
      });
    },

    //支付方式调取
    do_order_pay() {
      if (this.is_order_test) {
        this.pay_use_yue();
      } else {
        if (this.pay_type_value == "weixin") {
          this.pay_use_weixin();
        } else if (this.pay_type_value == "zhifubao") {
          this.pay_use_zhifubao();
        } else if (this.pay_type_value == "yue") {
          this.pay_use_yue();
        } else if (this.pay_type_value == "duihuanka") {
          this.pay_use_duihuan();
        } else if (this.pay_type_value == "xianxia") {
          this.pay_use_xianxia();
        } else if (this.pay_type_value == "paypal") {
          this.pay_use_paypal();
        }
      }
    },

    //微信支付 pc
    pay_use_weixin() {
      this.payment_tip = false;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "pay_wxScanCodePay", //pay_wxScanCodePay
          userId: localStorage.getItem("userId"),
          token: localStorage.getItem("token"),
          orderType: 1,
          orderId: this.order_id
        }
      }).then(res => {
        alert(res);
        if (res.code == 200) {
          let { data } = res.data;
          let info = {
            // ...res,
            qrcode: data.qrcode,
            order_id: this.order_id
          };
          this.$refs.orderPayWxCode.init(info);
          this.$refs.orderPayWxCode.qrcode = data.qrcode;
          this.$refs.orderPayWxCode.showModal = true;
          // this.showWaiting();
        } else {
        }
      });
    },

    pay_use_duihuan() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "pay_recharge",
          orderType: 1,
          orderId: this.order_id
        }
      }).then(res => {
        alert(res);
        if (res.code == 200) {
          console.log(res, "rrres");
          if (res.data.isOver == 0) {
            // this.payment_tip=true
            this.pay_use_weixin();
            // this.pay_use_zhifubao();
          } else {
            this.toPaySuccess();
          }
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
          orderId: this.order_id
        }
      }).then(res => {
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
      // alertErr('Alipay is not available yet');

      // this.showWaiting();
      this.payment_tip = false;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "pay_aliScanCodePay", // pay_aliScanCodePay
          orderType: 1,
          orderId: this.order_id
        }
      }).then(res => {
        // alert(res);
        if (res.code == 1) {
          let data = res.data;
          const { href } = this.$router.resolve({
            path: "/zfbPay",
            query: {
              htmlData: data
            }
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
        alertErr("Insufficient balance, please choose another payment method");
        return;
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_yuePay",
          orderId: this.order_id
        }
      }).then(res => {
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
        paypz: paypz
      }).then(res => {
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
          order_id: this.order_id
        },
        success: data => {
          //console.log("订单微信jsapi支付", data);
          let { timeStamp, nonceStr, signType, paySign } = data;

          wx.chooseWXPay({
            timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr, // 支付签名随机串，不长于 32 位
            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign, // 支付签名
            success: function(res) {
              that.toPaySuccess();
            },
            fail(err) {
              //console.log("支付失败了");
            }
          });
        },
        fail: err => {
          //console.log("支付失败", err);
        }
      });
    },

    showWaiting() {
      this.clearTimer();
      let that = this;

      this.$refs.orderPayWaiting.show = true;

      this.timer = setInterval(() => {
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "orders_detail",
            id: this.order_id
          }
        }).then(res => {
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
      let ids = this.payment_products.map(v => v.inventoryId);
      let id = ids.join();

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_del",
          inventoryId: inventoryId
        }
      }).then(res => {
        if (res.code == 200) {
          let list = this.list_shopcart;
          let ids = (inventoryId + "").split(",");
          //可能删除多项商品
          ids.forEach(inventoryId => {
            let index = list.findIndex(v => v.inventoryId == inventoryId);
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
      this.$refs.foreign_address_modal.init();
    },

    confirm_add_address() {
      this.query_address();
    },

    // 订单积分抵现
    order_jifen_dixian() {
      this.$api("orders_jifenPay", {
        order_id: this.order_id,
        jifen: this.use_jifen_num
      }).then(res => {
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
        order_id: this.order_id
      }).then(res => {
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
          from: "order-submit"
        }
      });
    },

    //输入积分时
    onInput_jifen() {
      //console.log("输入积分", +this.use_jifen_num);
      //console.log("最多可使用积分", +this.jifen_pay.jifen);

      if (this.use_jifen_num && +this.use_jifen_num > +this.jifen_pay.jifen) {
        alertErr(
          `Points entered exceed your available points (${this.jifen_pay.jifen}), please re-enter`
        );
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
      if (this.coupon_select_id == item.id) {
        this.coupon_select_id = "";
        return;
      }
      this.coupon_select_id = item.id;
    },

    //
    toPaySuccess() {
      this.toPayResult(1);
    },
    toPayFail() {
      // this.toPayResult(0)
      this.toRoute({
        path: "/order-detail",
        query: {
          from: "payment",
          id: this.order_id
        },
        mode: "reLaunch"
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
          is_pay: is_pay
        }
        // mode: 'redirectTo'
      });
    },

    // 发票切换
    do_fapiao_type(val) {
      this.fapiao_info.invoiceType = val;

      if (val === "") {
        this.fapiao_info.invoiceStatus = 0;
      } else if (val === 1) {
        //普通
        this.fapiao_info.invoiceStatus = 1;
        this.fapiao_info.titleType = 1; //个人
      } else if (val === 2) {
        //专用发票
        this.fapiao_info.invoiceStatus = 1;
        this.fapiao_info.titleType = 2; //企业
      }
    },

    // 切换优惠券/优惠码标签页
    switchTab(tab) {
      this.activeTab = tab;
      if (tab === "code") {
        // 切换到优惠码时，可以在这里添加相关逻辑
        this.coupon_select_id = "";
      }
    },

    // 切换优惠券可用/不可用子标签
    switchCouponSubTab(subTab) {
      this.couponSubTab = subTab;
      if (subTab === "unavailable" && this.unavailable_coupons.length === 0) {
        // 如果不可用优惠券列表为空，可以在这里请求数据
        this.loadUnavailableCoupons();
      }
    },

    // 加载不可用优惠券
    loadUnavailableCoupons() {
      // 这里可以调用API获取不可用优惠券
      // 暂时使用模拟数据
      this.unavailable_coupons = [
        // {
        //   id: "unavailable_1",
        //   title: "已过期优惠券",
        //   jian: 50,
        //   man: 200,
        //   endTime: "2024-01-01 00:00:00",
        //   status: "expired",
        // },
        // {
        //   id: "unavailable_2",
        //   title: "不满足条件优惠券",
        //   jian: 30,
        //   man: 1000,
        //   endTime: "2025-12-31 23:59:59",
        //   status: "not_met",
        // },
      ];
    },

    // 查询优惠码
    query_yh() {
      if (!this.yh_code.trim()) {
        this.$message.warning("Please enter a discount code");
        return;
      }

      // 调用API查询优惠码
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "yhq_checkYhqCode",
          code: this.yh_code.trim(),
          price: this.total_order_price
          // 可以添加其他必要参数，如订单金额等
        }
      })
        .then(res => {
          if (res.code == 200) {
            this.$message.success("Discount code verification successful");
            // 处理优惠码信息
            this.handlePromoCodeSuccess(res.data);
          } else {
            this.$message.error(
              res.msg || "Discount code is invalid or expired"
            );
          }
        })
        .catch(error => {
          this.$message.error(
            "Failed to query discount code, please try again"
          );
          console.error("查询优惠码失败:", error);
        });
    },

    // 处理优惠码验证成功
    handlePromoCodeSuccess(data) {
      // 这里可以处理优惠码验证成功后的逻辑
      // 比如更新订单金额、显示优惠信息等
      console.log("Discount code information:", data);

      // 可以在这里更新订单总金额
      if (data.discount_amount) {
        // 更新订单金额逻辑
        this.total_order_price = this.total_order_price - data.discount_amount;
      }

      this.coupon_code_info = data;
      this.coupon_select = data;
      this.coupon_select_id = data.id;
      this.query_pay_info();
    },

    // 不使用优惠码
    not_use_yh() {
      this.yh_code = "";
      // 重置相关状态
      this.$message.info("Discount code usage cancelled");
    }
  }
};
</script>

<style scoped lang="less">
// 新样式：两列布局
.order-submit-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 20px 0;

  .page-header {
    .page-title {
      font-size: 26px;
      font-weight: bold;
      color: #1e262e;
    }
  }

  .two-column-layout {
    display: flex;
    gap: 30px;
    align-items: flex-start;
  }

  .left-column {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid #e9e9e9;
    border-radius: 24px;
    padding: 40px;
    width: 998px;
  }

  .right-column {
    flex: 1;
    position: sticky;
  }

  // 部分卡片样式
  .section-card {
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;

    .section-header {
      display: flex;
      align-items: center;
      gap: 22px;

      .section-icon {
        width: 42px;
        height: 42px;
        background: #f5f5f5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #1e262e;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .section-title {
        width: 860px;
        height: 62px;
        background: #f5f5f5;
        border-radius: 10px 10px 0px 0px;

        font-family: Poppins, Poppins;
        font-weight: 500;
        font-size: 20px;
        color: #1e262e;
        line-height: 62px;
        padding: 0 30px;
        text-align: left;
      }
    }

    .sec-ctx {
      padding: 20px 20px 20px 45px;
      margin-left: 20px;
      border-left: 1px dashed #e9e9e9;
    }
  }

  // 表单样式
  .form-group {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;

    .form-label {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 20px;
      color: #1e262e;
      font-weight: 400;
      width: 220px;
      margin-right: 20px;

      .required {
        color: #ff0000;
        margin-right: 5px;
      }
    }

    .form-input {
      width: 460px;
      height: 56px;
      padding: 0 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 20px;
      color: #1f1f1f;
      box-sizing: border-box;

      &::placeholder {
        color: #999;
      }

      &:focus {
        outline: none;
        border-color: #999;
      }

      // el-input 和 el-select 样式
      /deep/ .el-input__inner {
        width: 100%;
        height: 56px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        color: #1f1f1f;
        padding: 0 12px;
        box-sizing: border-box;

        &::placeholder {
          color: #999;
        }

        &:focus {
          border-color: #999;
        }
      }

      /deep/ .el-input {
        width: 100%;
      }

      /deep/ .el-select {
        width: 100%;

        .el-input__inner {
          width: 100%;
          height: 56px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          color: #1f1f1f;
          padding: 0 12px;
          box-sizing: border-box;
        }
      }
    }

    .el-input {
      width: 460px;
      height: 56px;
    }

    /deep/ .el-input__inner {
      width: 460px;
      height: 56px;
    }
  }

  // 发票表单中的 el-input 样式
  .el-input {
    width: 460px;

    /deep/ .el-input__inner {
      width: 460px;
      height: 56px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      color: #1f1f1f;
      padding: 0 12px;
      box-sizing: border-box;

      &::placeholder {
        color: #999;
      }

      &:focus {
        border-color: #999;
      }
    }
  }

  .form-row {
    display: flex;
    gap: 15px;

    .form-group {
      flex: 1;
    }
  }

  .toggle-group {
    margin-top: 10px;
    margin-left: 250px;

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      input[type="checkbox"] {
        cursor: pointer;
      }

      .toggle-text {
        font-size: 20px;
        color: #1e262e;
      }
    }
  }

  .form-actions {
    display: flex;
    gap: 15px;
    margin-top: 20px;
    margin-left: 250px;

    .btn-confirm {
      width: 192px;
      height: 52px;
      background: #ec6a2b;
      color: #ffffff;
      border-radius: 6px 6px 6px 6px;

      font-family: Poppins, Poppins;
      font-weight: 600;
      font-size: 20px;
      color: #ffffff;
    }

    .btn-cancel {
      width: 192px;
      height: 52px;
      background: #00306b;
      color: #ffffff;
      border-radius: 6px 6px 6px 6px;
      font-family: Poppins, Poppins;
      font-weight: 600;
      font-size: 20px;
      color: #ffffff;
    }
  }

  // 配送方式
  .delivery-options {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .radio-option {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 20px;

      input[type="radio"] {
        cursor: pointer;
      }

      .delivery-price {
        margin-left: 500px;
        color: #1f1f1f;
        font-weight: 500;

        img {
          width: 31px;
          height: 31px;
        }
      }
    }
  }

  // 支付方式
  .payment-options {
    margin-bottom: 20px;

    .radio-option {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      margin-bottom: 15px;

      input[type="radio"] {
        cursor: pointer;
      }

      .payment-title {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  .payment-logos {
    display: flex;
    gap: 6px;
    margin-left: auto;

    .payment-logo {
      width: 112px;
      height: 54px;
      border: 2px solid transparent;
      border-radius: 6px;

      img {
        width: 100%;
        height: 100%;
      }

      &.active {
        border: 2px solid #ec6a2b;
      }
    }
  }

  .checkbox-group {
    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;

      input[type="checkbox"] {
        margin-top: 3px;
        cursor: pointer;
      }

      span {
        font-size: 14px;
        color: #1f1f1f;
      }
    }

    .checkbox-tip {
      margin-top: 8px;
      font-size: 12px;
      color: #666;
      margin-left: 24px;
    }
  }

  // 发票切换按钮
  .invoice-toggles,
  .invoice-type-toggles,
  .coupon-toggles {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .toggle-btn {
      padding: 0 25px;
      height: 50px;
      background: #ffffff;
      border: 1px solid #dbdbdb;
      border-radius: 25px;
      font-size: 20px;
      color: #5e5e5e;
      cursor: pointer;

      &.active {
        background: #feeedd;
        color: #ec6a2b;
        border-color: #ec6a2b;
      }

      &:hover {
        border-color: #ff6600;
      }
    }
  }

  // 优惠券卡片
  .coupon-cards {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;

    .coupon-card-item {
      position: relative;
      background-image: url("~@img/coupon/yhq-bg.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;

      width: 255px;
      height: 175px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.3s;

      &.selected {
        border-color: #ec6a2b;

        .selectd {
          display: block;
        }
      }

      // 上方：优惠券价值区域
      .coupon-top {
        height: 93px;
        display: flex;
        align-items: center;
        justify-content: center;

        .currency {
          font-size: 30px;
          font-family: Poppins, Poppins;
          font-weight: 600;
          color: #ffffff;
        }

        .amount {
          font-size: 40px;
          font-family: Poppins, Poppins;
          font-weight: 600;
          color: #ffffff;
        }
      }

      .coupon-bottom {
        height: 80px;
        padding: 10px 18px 15px 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .coupon-condition {
          font-size: 18px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          color: #00306b;
          text-align: left;
        }

        .validity-period {
          text-align: left;
          font-size: 16px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          color: #5e5e5e;
        }
      }

      .selectd {
        display: none;
        position: absolute;
        bottom: 0;
        right: 0;
        width: 28px;
        height: 28px;
      }
    }
  }

  .promo-code-section {
    padding: 20px 0;

    .promo-code-label {
      font-size: 14px;
      color: #5e5e5e;
      margin-bottom: 16px;
      text-align: left;
    }

    .promo-code-input-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .promo-code-input {
        height: 40px;
        padding: 0 16px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        font-size: 14px;
        color: #1e262e;
        background: #ffffff;
        outline: none;
        transition: all 0.3s;

        &:focus {
          border-color: #ec6a2b;
        }

        &::placeholder {
          color: #999;
        }
      }

      .promo-code-confirm-btn {
        min-width: 120px;
        height: 40px;
        background: #ec6a2b;
        color: #ffffff;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: #d85a1f;
        }

        &:active {
          transform: scale(0.98);
        }
      }
    }

    .promo-code-discount {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      text-align: left;

      .discount-label {
        font-size: 14px;
        color: #5e5e5e;
      }

      .discount-amount {
        font-size: 14px;
        color: #ec6a2b;
        font-weight: 600;
      }
    }
  }

  // 订单摘要
  .order-summary {
    background: #ffffff;
    border: 1px solid #efefef;
    border-radius: 24px 24px 24px 24px;
    padding: 30px;

    .summary-title {
      font-size: 20px;
      font-weight: bold;
      color: #1f1f1f;
      margin: 0 0 20px 0;
    }

    .product-list {
      margin-bottom: 20px;

      .product-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        padding: 15px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .product-item-top {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .product-icon {
          font-size: 24px;

          img {
            width: 80px;
            height: 80px;
            border-radius: 6px 6px 6px 6px;
            border: 1px solid #cecece;
          }
        }

        .product-info {
          flex: 1;
          text-align: left;

          .product-name {
            font-family: Poppins, Poppins;
            font-weight: 400;
            font-size: 20px;
            color: #1e262e;
            line-height: 28px;
          }

          .product-details {
            font-family: Poppins, Poppins;
            font-weight: 400;
            font-size: 18px;
            color: #5e5e5e;
            line-height: 25px;
          }
        }

        .product-quantity {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .product-price {
            font-family: Poppins, Poppins;
            font-weight: 600;
            font-size: 20px;
            color: #ec6a2b;
            line-height: 28px;
          }

          .product-quantity-actions {
            display: flex;
            align-items: center;
          }

          .qty-btn {
            width: 30px;
            height: 30px;
            border: 1px solid #ddd;
            background: #ffffff;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;

            &:hover {
              background: #f0f0f0;
            }
          }

          .qty-value {
            width: 40px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 18px;
            color: #1f1f1f;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
          }
        }

        .product-remove {
          font-size: 20px;
          cursor: pointer;
          margin-left: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.3s;

          img {
            width: 20px;
            height: 20px;
          }

          &.disabled {
            opacity: 0.3;
            cursor: not-allowed;
            pointer-events: none;
          }
        }
      }
    }

    .price-breakdown {
      margin-bottom: 20px;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;

      .price-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 14px;

        .price-label {
          font-size: 20px;
          color: #666;
        }

        .price-value {
          color: #1e262e;
          font-size: 20px;
        }

        &.total {
          margin-top: 10px;

          .price-value {
            font-size: 24px;
            font-weight: 600;
            color: #ec6a2b;
          }
        }
      }

      .checkbox-group {
        margin-top: 42px;
        font-size: 20px;
        color: #1e262e;
        display: flex;

        /deep/ .el-checkbox {
          margin-top: 5px;
          .el-checkbox__inner {
            border: 1px solid #ec6a2b !important;
          }
        }

        /deep/ .is-checked {
          .el-checkbox__inner {
            background: #ec6a2b !important;
          }
        }

        span {
          margin-left: 10px;
          display: inline-block;
          text-align: left;
          font-size: 20px;
          color: #1e262e;
          line-height: 28px;
        }
      }

      .submit {
        margin-top: 20px;

        .btn-confirm {
          margin-left: 20px;
          width: 300px;
          height: 95px;
          background: #ec6a2b;
          border-radius: 10px 10px 10px 10px;

          font-family: Poppins, Poppins;
          font-weight: 600;
          font-size: 24px;
          color: #ffffff;
          line-height: 18px;
        }
      }
    }

    .promo-message {
      display: flex;
      align-items: flex-start;
      gap: 5px;
      margin-bottom: 20px;
      padding: 10px;
      background: #fff8f0;
      border-radius: 4px;

      .promo-asterisk {
        color: #ff6600;
        font-size: 16px;
        font-weight: bold;
      }

      .promo-text {
        font-size: 12px;
        color: #666;
        line-height: 1.5;
      }
    }

    .checkout-btn {
      width: 100%;
      height: 50px;
      background: #ff6600;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #e55a00;
      }
    }
  }
}

.upload-box {
  padding: 20px 20px;
  text-align: left;
}

.modal-pay-tip {
  /deep/ .el-dialog__header {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    background: #f5f5f5;
    font-size: 20px;
    color: #1e262e;
    font-weight: 600; 
    line-height: 28px;
  }
  /deep/ .el-dialog__body {
    padding: 20px 20px;
    span {
      font-size: 20px;
      color: #1e262e;
      font-weight: 400; 
      line-height: 28px;
    }
  }
  .btn-cancel {
    width: 140px;
    height: 52px;
    background-color: #00306b;
    color: #ffffff;
    font-size: 20px;
    font-weight: 600;
    border-radius: 8px;
  }

  .btn-confirm {
    height: 52px;
    background: #ec6a2b;
    color: #ffffff;
    font-size: 20px;
    font-weight: 600;
    border-radius: 8px;
    margin-left: 10px;
    padding: 0 20px;
  }
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
  background: #fbfbfb;
  text-align: center;
  font-size: 14px;
  padding-top: 24px;

  .inner {
    margin: 0 auto;
    padding: 0 0 100px 0;
  }

  .page-title {
    margin-bottom: 30px;
    text-align: left;
    margin-left: 10px;

    .left {
      font-size: 16px;
      font-family: Poppins, Poppins;
      font-weight: bold;
      color: #333;

      .num {
        margin-left: 10px;
      }
    }
  }

  .goods-list {
    // border: 1px solid #cccccc;
    // margin-bottom: 40px;
    text-align: left;

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
      .list-title {
        font-size: 14px;
        text-align: center;
        height: 48px;
        background: #f9f9f9;
        padding: 15px 0;

        font-family: Poppins, Poppins;
        // font-weight: bold;
        font-size: 16px;
        color: #1f1f1f;

        // border-bottom: 1px solid #ddd;
        .box-title {
          flex: 1;
          text-align: left;

          .title-text {
            margin-left: 70px;
          }
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
      }

      .item {
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .item-detail {
          padding: 15px 0;
          text-align: center;
          font-family: Poppins, Poppins;
          // font-weight: bold;
          font-size: 18px;
          color: #1f1f1f;

          .box-title {
            flex: 1;

            .poster-box {
              margin-left: 70px;
              margin-right: 16px;
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
            width: 240px;

            font-size: 12px;
            font-family: Poppins, Poppins;
            font-weight: 400;
            color: #505050;
          }

          .box-unit {
            width: 240px;
            color: #00306b;
          }

          .box-num {
            width: 240px;
          }

          .box-subtitle {
            width: 240px;
            color: #00306b;
            font-weight: bold;
          }
        }
      }
    }

    .huizong {
      padding: 24px 45px;
      background: #f9f9f9;

      .item {
        margin-bottom: 16px;
        text-align: right;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 14px;
        color: #1f1f1f;

        &:last-child {
          margin-bottom: 0;
        }

        b {
          display: inline-block;
          min-width: 185px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 14px;
          color: #1f1f1f;
        }
      }

      .total {
        text-align: right;

        b {
          font-family: Poppins, Poppins;
          font-weight: bold;
          font-size: 20px;
          color: #00306b;
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
        border: 1px solid #00306b;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 17px;
        color: #00306b;
      }

      &.btn-2 {
        width: 200px;
        height: 45px;
        background: #00306b;
        border-radius: 0px 0px 0px 0px;
        font-family: Poppins, Poppins;
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
            border: 1px solid #00306b;
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
    font-size: 24px;
    color: #1f1f1f;
    padding-left: 34px;
  }

  .sec-tip {
    margin-bottom: 5px;
    font-size: 14px;
    font-family: Poppins, Poppins;
    font-weight: 400;
    line-height: 25px;
    color: #1f1f1f;
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
      color: #00306b;
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
    padding-bottom: 16px;
    border-bottom: 1px solid #d5d8de;
    font-family: Poppins, Poppins;

    font-size: 24px;
    color: #1f1f1f;
    padding-left: 34px;
  }
}

.sec-addr {
  text-align: left;

  .sec-title {
    margin-bottom: 20px;
    padding-bottom: 16px;
    font-family: Poppins, Poppins;
    font-weight: 400;

    font-size: 24px;
    color: #1f1f1f;
    padding-left: 34px;
  }

  .sec-ctx {
    padding: 0 34px;
  }

  .address-list {
    display: flex;
    flex-wrap: wrap;

    .address-item {
      position: relative;
      margin-bottom: 20px;
      width: 100%;
      min-height: 190px;
      padding: 20px;
      background: #ffffff;
      border: 1px solid #e5e5e5;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;

      &.active {
        border: 2px solid #00306b;

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
        padding-bottom: 20px;

        > div {
          margin-bottom: 10px;
          color: #333333;

          &:last-child {
            margin-bottom: 0;
          }

          span {
            font-size: 14px;
            font-family: Poppins, Poppins;
            font-weight: 400;
            color: #1f1f1f;
          }
        }
      }

      .address-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #eeeeee;
        padding-top: 20px;

        .left {
          .moren {
            display: inline-block;
            height: 30px;
            padding: 0 10px;
            line-height: 30px;
            text-align: center;
            background: #00306b;
            font-size: 14px;
            color: #ffffff;
            border-radius: 4px;
          }
        }
      }
    }
  }

  .addr-add {
    margin-top: 32px;
    padding-left: 32px;

    .empty-title {
      margin-bottom: 40px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }

    .btn {
      min-width: 124px;
      height: 52px;
      background: #ffffff;
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #00306b;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 20px;
      color: #fff;
      padding: 0 20px;
      background: #00306b;
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
        color: #1f1f1f;

        span {
          color: #00306b;
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
  text-align: left;

  .sec-title {
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid #d5d8de;
    font-family: Poppins, Poppins;
    font-weight: 400;

    font-size: 24px;
    color: #1f1f1f;
    padding-left: 34px;
  }

  .sec-ctx {
  }

  .pay-group {
    display: flex;
    align-items: center;
    padding-left: 32px;

    .title {
      // min-width: 120px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 16px;
      color: #1f1f1f;
    }

    .pay-items {
      padding-left: 20px;
      flex: 1;
      display: flex;
      align-items: center;

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
          font-family: Poppins, Poppins;
          font-weight: 400;
          color: #000000;
        }
      }
    }

    .peisong-items {
      .item {
        text-align: center;
        width: 144px;
        height: 40px;
        line-height: 40px;
        background: #ffffff;
        border-radius: 3px 3px 3px 3px;
        border: 1px solid #00306b;
        font-size: 14px;
        font-family: Poppins, Poppins;
        font-weight: bold;
        color: #00306b;
      }
    }
  }
}

.sec-product {
  .sec-ctx {
    padding: 0 34px;
  }

  .sub-title {
    padding-left: 30px;
    height: 50px;
    background: #fafbfc;
    cursor: pointer;

    &.expand-0 {
      margin-bottom: 15px;
    }

    .text {
      font-size: 14px;
      font-family: Poppins, Poppins;
      font-weight: bold;
      color: #333333;
    }

    img {
      width: 16px;
      margin-left: 15px;
    }
  }

  .yhq-list {
    display: flex;
    flex-wrap: wrap;
    padding: 15px;

    .yhq-item {
      position: relative;
      margin-right: 24px;
      width: 220px;
      height: auto;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #e5e5e5;
      cursor: pointer;

      &.active {
        border-color: #00306b;

        .marker {
          display: block;
        }
      }

      .marker {
        position: absolute;
        right: 0;
        bottom: 0;
        display: none;
      }

      .yhq-top {
        height: auto;
        background: #fdf2ef;
        padding: 10px 15px;

        .yhq-1 {
          display: flex;
          align-items: center;
          align-items: flex-end;

          .text-1 {
            font-size: 24px;
            font-family: Poppins, Poppins;
            font-weight: bold;
            color: #00306b;
          }

          .text-2 {
            margin-left: 5px;
            font-size: 12px;
            font-family: Poppins, Poppins;
            font-weight: 400;
            color: #333333;
          }
        }

        .yhq-2 {
          margin-top: 10px;
          font-size: 12px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          color: #505050;
        }
      }

      .yhq-bottom {
        height: 32px;
        line-height: 32px;
        padding: 0 15px;
        font-size: 12px;
        font-family: Poppins, Poppins;
        font-weight: 400;
        color: #00306b;
      }
    }
  }

  .yhq-select-info {
    height: 50px;
    line-height: 50px;
    background: #fafbfc;
    padding: 0 30px;

    .number {
      color: #00306b;
      margin: 0 10px;
    }
  }

  .remark-box {
    .input-box {
      padding: 15px;
    }
  }
}

.sec-ctx-type {
  padding-left: 32px;
  padding-left: 0;
}

// 余额信息
.yue-info {
  margin-top: 32px;
  padding: 24px 120px;
  padding: 24px 32px;
  // padding-bottom: 0;
  border: 1px dashed #ccc;

  .info-item {
    display: flex;
    align-items: center;
    align-items: flex-start;
    margin-bottom: 10px;

    .info-label {
      line-height: 32px;
      padding-right: 10px;
      font-size: 14px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      color: #1f1f1f;
    }

    .info-val {
      line-height: 32px;
      font-size: 14px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      color: #1f1f1f;
    }

    .yue-warn-tip {
      color: #00306b;
      font-size: 14px;
    }
  }
}

// 线下转款信息
.xianxia-info {
  margin-top: 32px;
  padding: 24px 120px;
  padding: 24px 32px;
  // padding-bottom: 0;
  border: 1px dashed #ccc;

  .info-item {
    display: flex;
    align-items: center;
    align-items: flex-start;
    margin-bottom: 10px;

    .info-label {
      line-height: 32px;
      padding-right: 10px;
      font-size: 14px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      color: #1f1f1f;
    }

    .info-val {
      line-height: 32px;
      font-size: 14px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      color: #1f1f1f;
    }
  }
}

.sec-fapiao {
  padding-bottom: 55px;
  text-align: left;

  .sec-title {
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid #d5d8de;
    font-family: Poppins, Poppins;
    font-weight: 400;

    font-size: 24px;
    color: #1f1f1f;
    padding-left: 34px;
  }

  .sec-ctx {
  }

  .fapiao-info {
    padding-left: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 30px;

    .main-title {
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 16px;
      color: #1f1f1f;
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

        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 16px;
        color: #333333;

        &.active {
          color: #00306b;
          border: 1px solid #00306b;
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
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 14px;
        color: #1f1f1f;

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

// 优惠券/优惠码样式
.coupon-tabs {
  .tab-header {
    display: flex;
    height: 48px;
    margin-bottom: 20px;
    background: #f9f9f9;
    border: 1px solid #cccccc;

    .tab-item {
      width: 131px;
      height: 48px;
      text-align: center;
      line-height: 48px;
      font-size: 16px;
      cursor: pointer;
      background: #f9f9f9;
      transition: all 0.3s ease;
      color: #1f1f1f;
      border-bottom: 1px solid #cccccc;

      &.active {
        color: #ffffff;
        background: #00306b;
      }
    }
  }

  .tab-content {
    padding: 0 20px;

    .sub-tabs {
      display: flex;
      margin-bottom: 20px;

      .sub-tab-item {
        padding: 12px 0;
        font-size: 14px;
        color: #999;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 0.3s ease;
        position: relative;
        margin-right: 80px;

        &.active {
          color: #00306b;
          border-bottom-color: #00306b;
        }

        &:hover {
          color: #00306b;
        }
      }
    }

    .coupon-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;

      .coupon-card {
        position: relative;
        width: 307px;
        height: 106px;
        border: 1px solid #d6d6d6;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        background: #fff;

        &:hover {
          border-color: #00306b;
        }

        &.active {
          border-color: #00306b;
          box-shadow: 0 2px 8px rgba(120, 83, 178, 0.2);
        }

        &.unavailable {
          opacity: 0.6;
          background: #f9f9f9;

          .coupon-content {
            .coupon-amount {
              color: #999;
            }

            .coupon-condition,
            .coupon-expire {
              color: #ccc;
            }
          }
        }

        .coupon-check {
          position: absolute;
          right: -1px;
          bottom: -1px;
          width: 32px;
          height: 32px;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .coupon-content {
          padding: 12px 16px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .coupon-amount {
            display: flex;
            align-items: baseline;
            margin-right: 17px;

            .currency {
              font-size: 14px;
              color: #be9bdf;
              font-weight: 500;
            }

            .amount {
              font-size: 24px;
              color: #be9bdf;
              font-weight: bold;
              margin-left: 2px;
            }
          }

          .coupon-condition {
            font-size: 14px;
            color: #1f1f1f;
          }

          .coupon-expire {
            font-size: 12px;
            color: #1f1f1f;
            margin-right: 12px;
          }

          .coupon-rules {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #999;

            .info-icon {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #ccc;
              color: #fff;
              font-size: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 4px;
              font-style: normal;
            }
          }
        }
      }
    }

    .no-coupon {
      text-align: center;
      padding: 40px 0;
      color: #999;
      font-size: 14px;
    }
  }
}

.discount-summary {
  padding: 15px 40px;
  height: 50px;

  margin: 40px 0;
  background: #fafbfc;

  .summary-item {
    display: flex;
    align-items: center;

    .label {
      font-size: 14px;
      color: #333;
    }

    .value {
      font-size: 14px;
      color: #00306b;
      font-weight: 500;
    }
  }
}

.invoice-form {
  .form-label {
    width: 310px !important;
    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 20px;
    color: #1e262e;
    line-height: 18px;
    margin-right: 0px !important;
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
        font-size: 16px;
        font-weight: bold;
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

.el-dialog {
  .el-dialog__body {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
