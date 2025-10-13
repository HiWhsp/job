<script>
import { mapState } from "vuex";
import { SHOP_TYPE } from "@/config/env.js";

import address_modal from "@/components/address/address_modal.vue"; //新增地址
import foreign_address_modal from "@/components/address/foreign_address_modal.vue"; //新增地址

import balance_password_set_modal from "@/components/payment/balance_password_set_modal.vue";
import balance_pay_modal from "@/components/payment/balance_pay_modal.vue";
import balance_pay_disable_modal from "@/components/payment/balance_pay_disable_modal.vue";

import orderPayWxCode from "@/components/order/orderPayWxCode.vue";
import orderPayWaiting from "@/components/order/orderPayWaiting.vue";
export default {
  name: "batch_xunjia_popup",
  components: {
    address_modal,
    foreign_address_modal,

    balance_password_set_modal,
    balance_pay_modal,
    balance_pay_disable_modal,
    orderPayWxCode,
    orderPayWaiting,
  },
  data() {
    return {
      info: {},
      show: false,
      is_order_test: false, //订单测试
      //
      from: "", //product-detail  ||  cart
      //
      address_select: {}, //地址
      pagination_address: {
        page: 1,
        pagenum: 20,
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
      pay_type_value: "paypal",
      pay_method_list: [
        {
          value: "weixin",
          title: "微信支付",
          icon: require("@img/pay-method/type-weixin.png"),
        },
        {
          value: "zhifubao",
          title: "支付宝支付",
          icon: require("@img/pay-method/type-zfb.png"),
        },
        // { value: 'xianxia', title: '线下转款', icon: require('@img/pay-method/type-xianxia.png') },
        //{ value: 'paypal', title: 'PayPal', icon: require('@img/pay-method/type-paypal.png') },
        {
          value: "yue",
          title: "余额支付",
          icon: require("@img/pay-method/type-yue.png"),
        },
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

      order_id: "", //是否已经创建过订单
      showCoupon: true, //

      if_use_jifen: true, //是否使用积分抵扣
      if_use_yongjin: true, //是否使用佣金扣减
      jifen_pay: {}, //积分抵扣信息
      currency: "￥", //货币

      money_yunfei: 0,
      order_price: 0, //总 订单金额
      goodsPrice: 0,
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

      //

      is_pay_pass: 0, //是否设置余额支付密码
      payType: "",
      upload_limit_number: 6,
      dialogVisible: false,
      dialogImageUrl: "", //转账图片查看
      confirm_tip: false, //确认支付信息提示
      xianxia_file_list: [],

      peisong_list: ["快递配送", "上门自提"],
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
  methods: {
    init(info) {
      this.payment_products = info;
      this.show = true;
      for (let i = 0; i < this.payment_products.length; i++) {
        this.total_product_number += parseInt(this.payment_products[i].num);
        this.goodsPrice += parseFloat(this.payment_products[i].product.price);
      }
      if (this.payment_products[0].xunjiaId) {
        console.log("xunjiaid detected!");
      }
      this.query_user();
      this.query_address();
    },
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
      let product_items = [];
      if (this.payment_products[0].xunjiaId) {
        product_items = this.payment_products.map((v) => ({
          inventoryId: v.inventoryId,
          productId: v.productId,
          num: v.num,
          xunjiaDetailId: v.id,
        }));
      } else {
        product_items = this.payment_products.map((v) => ({
          inventoryId: v.inventoryId,
          productId: v.productId,
          num: v.num,
          piliangDetailId: v.id,
        }));
      }
      let productInfo = JSON.stringify(product_items);

      let params = {
        productInfo: productInfo,
        addressId: this.address_select.id || "",
        peisongType: 1, //配送类型：1-快递物流 2-上门自提
        peisongTime: "", //配送时间
        yhqId: "", //优惠券记录ID
        tuanId: "", //参与拼团的团ID
        tuanType: "", //拼团类型：0-普通订单 1-普通团 2-社区团
        remark: "", //备注

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
    onModalClose() {},
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

      if (this.pay_type_value == "xianxia") {
        if (!this.xianxia_file_list.length) {
          this.scrollToTarget(".scroll-target-pingzheng");
          return alertErr("请上传转款凭证信息");
        }
      }

      if (this.pay_type_value == "balance") {
        if (this.total_balance < +this.real_payment_money) {
          return alertErr("您的余额不足，请选择其他支付方式");
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
      this.do_confirm_submit();
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
      console.log(params);
      this.$emit("confirm", params);
      this.show = false;
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
    // 发票切换
    do_fapiao_type(val) {
      this.fapiao_info.invoicType = val;

      if (val === 0) {
        //普通
        this.fapiao_info.invoiceStatus = 1;
      } else if (val === 1) {
        //专用发票
        this.fapiao_info.invoiceStatus = 1;
        this.fapiao_info.titleType = 2; //企业
      } else {
        this.fapiao_info.invoiceStatus = 0;
      }
    },
    onbeforeclose() {
      this.show_modal = false;
    },
  },
};
</script>
<template>
  <div>
    <div class="modal-container">
      <el-dialog
        title="确认订单"
        width="768px"
        custom-class="modal-custom"
        :close-on-click-modal="false"
        :visible.sync="show"
        :before-close="onbeforeclose"
      >
        <div class="page-ctx">
          <div class="sec-addr">
            <div class="sec-title">选择收货人地址</div>
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
              <div class="addr-add">
                <div class="empty-title" v-if="!address_list.length">
                  还没有收件地址
                </div>
                <button class="btn btn-ripple" @click="open_addr_add()">
                  + 新增地址
                </button>
              </div>
            </div>
          </div>

          <div class="sec-pay">
            <div class="sec-title">支付信息</div>
            <div class="sec-ctx sec-ctx-type">
              <div class="pay-group">
                <div class="title">支付方式：</div>
                <div class="pay-items">
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

              <!-- 线下转款信息 -->
              <div class="xianxia-info" v-if="payType == '线下转款'">
                <div class="info-item">
                  <div class="info-label">收款单位名称:</div>
                  <div class="info-val">{{ vuex_config.offline_company }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">收款单位账号:</div>
                  <div class="info-val">{{ vuex_config.offline_code }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">开户银行:</div>
                  <div class="info-val">{{ vuex_config.offline_bank }}</div>
                </div>
                <div class="info-item scroll-target-pingzheng">
                  <div class="info-label">转账凭证:</div>
                  <div class="info-val">
                    <el-upload
                      class="upload-demo"
                      list-type="picture-card"
                      multiple
                      accept="image/*"
                      :limit="upload_limit_number"
                      :name="upload_col_name"
                      :action="mix_upload_action"
                      :data="mix_upload_data"
                      :on-success="uploadSuccess_pingjia"
                      :before-upload="beforeUpload_pingjia"
                      :on-preview="handlePictureCardPreview"
                    >
                      <i class="el-icon-plus"></i>

                      <!-- <div class="el-upload__tip" slot="tip">
                    <div class="tip-text-1">添加图片</div>
                    <div class="tip-text-2">
                      最多
                      <b class="number">6</b>
                      张
                    </div>
                  </div> -->
                    </el-upload>
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
            <div class="sec-ctx" style="padding-top: 24px">
              <div class="goods-list">
                <!-- <div class="title">订单商品</div> -->
                <div class="list">
                  <div class="goods-list-inner">
                    <!-- 标题 -->
                    <div class="list-title flex">
                      <div class="box-title">
                        <div class="title-text">产品标题</div>
                      </div>
                      <div class="box-sku">规格</div>
                      <div class="box-unit">价格</div>
                      <div class="box-num">数量</div>
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
                            <el-image :src="item.product.thumb">
                              <div slot="error" class="image-slot">
                                <img :src="item.product.thumb" />
                              </div>
                            </el-image>
                          </div>
                          <div class="title-box">
                            {{ item.product.title }}
                          </div>
                        </div>
                        <div class="box-sku">
                          {{ item.guige }}
                        </div>
                        <div class="box-unit">
                          {{ vuex_huobi }}
                          {{
                            item.xunjiaId
                              ? item.product.baojiaPrice
                              : item.product.price
                          }}
                        </div>
                        <div class="box-num">{{ item.num }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="order-action">
                  <div class="order-action-inner">
                    <div class="sec-item" v-if="list_coupon.length">
                      <div
                        class="sub-title"
                        @click="showCoupon = !showCoupon"
                        :class="{ 'expand-0': !showCoupon }"
                      >
                        <div class="text">使用优惠</div>
                        <img src="@img/common/pay-arrow-top.png" alt="" />
                      </div>
                      <!-- <div class="sec-input">
                    <el-select v-model="coupon_select_id" placeholder="请选择优惠券">
                      <el-option v-for="item in list_coupon" :key="item.id" :label="`${item.title} 【${item.miaoshu}】`" :value="item.id"> </el-option>
                    </el-select>
                  </div> -->

                      <div class="yhq-list" v-if="showCoupon">
                        <div
                          class="yhq-item"
                          v-for="(item, index) in list_coupon"
                          :key="index"
                          :class="{ active: coupon_select_id == item.id }"
                          @click="handleCouponSelect(item)"
                        >
                          <img
                            src="@img/address/dizhi-check-1.png"
                            alt=""
                            class="marker"
                          />

                          <div class="yhq-top">
                            <div class="yhq-1">
                              <div class="text-1">
                                {{ vuex_huobi }}{{ +item.jian }}
                              </div>
                              <div class="text-2">满{{ +item.man }}</div>
                            </div>
                            <div class="yhq-2">
                              有效期至
                              {{ item.endTime && item.endTime.substr(0, 10) }}
                            </div>
                          </div>
                          <div class="yhq-bottom">
                            <div class="yhq-3">[{{ item.title }}]</div>
                          </div>
                        </div>
                      </div>

                      <div class="yhq-select-info">
                        <b>金额抵用</b>
                        <template v-if="coupon_select.id">
                          <b class="number"
                            >{{ vuex_huobi }}{{ +coupon_select.jian }}</b
                          >, 使用【{{ coupon_select.title }}】优惠券 1张，优惠
                          {{ +coupon_select.jian }} 元
                        </template>
                        <template v-else> 无 </template>
                      </div>
                    </div>

                    <div class="sec-item" v-if="false">
                      <div class="sub-title">使用积分</div>
                      <div class="sec-tip" v-if="jifen_pay.jifen">
                        可用积分：{{ +vuex_user.jifen || 0 }}, 本单最多可用
                        {{ jifen_pay.jifen }} 积分抵扣 {{ currency
                        }}{{ jifen_pay.money }}
                      </div>
                      <div class="sec-tip" v-else>当前没有可抵扣的积分</div>

                      <div class="sec-btn-actions">
                        <button
                          class="btn"
                          :class="{ active: if_use_jifen }"
                          @click="if_use_jifen = true"
                        >
                          使用积分
                        </button>
                        <button
                          class="btn"
                          :class="{ active: !if_use_jifen }"
                          @click="if_use_jifen = false"
                        >
                          不使用积分
                        </button>
                      </div>
                      <div class="use-jifen-num">
                        本单将扣减积分 <b>{{ use_jifen_num }}</b>
                      </div>
                      <!-- <div class="sec-input" v-if="jifen_pay.jifen">
                <el-input type="number" :disabled="jifen_pay.jifen <= 0" v-model="use_jifen_num" @input="onInput_jifen" placeholder="请填写要抵扣的积分"></el-input>
              </div> -->
                    </div>

                    <div class="sec-item" v-if="false">
                      <div class="sub-title">使用佣金</div>
                      <div class="sec-tip">
                        可用佣金：{{ +vuex_user.yongjin || 0 }}
                      </div>
                      <div class="sec-btn-actions">
                        <button
                          class="btn"
                          :class="{ active: if_use_yongjin }"
                          @click="if_use_yongjin = true"
                        >
                          使用佣金
                        </button>
                        <button
                          class="btn"
                          :class="{ active: !if_use_yongjin }"
                          @click="if_use_yongjin = false"
                        >
                          不使用佣金
                        </button>
                      </div>
                      <div class="use-jifen-num">
                        本单将扣减佣金 <b>{{ money_yongjin_dixian }}</b>
                      </div>
                      <!-- <div class="sec-input" v-if="jifen_pay.jifen">
                <el-input type="number" :disabled="jifen_pay.jifen <= 0" v-model="use_jifen_num" @input="onInput_jifen" placeholder="请填写要抵扣的积分"></el-input>
              </div> -->
                    </div>

                    <!-- 
            <div class="sec-item">
              <div class="sec-title">优惠码</div>
              <div class="sec-input">
                <el-input v-model="yh_code" placeholder="请填写优惠码"></el-input>
              </div>
              <div class="sec-tip">优惠码填写完成后, 请点击下方使用按钮查询优惠信息。</div>
              <div class="sec-input">
                <div class="btn-actions">
                  <el-button size="small" type="warning" @click="query_yh">使用优惠</el-button>
                  <el-button size="small" type="warning" @click="not_use_yh">不使用</el-button>
                </div>
              </div>
            </div>
          -->
                    <div class="sec-item remark-box" v-if="false">
                      <div class="sub-title">
                        <b> 订单备注 </b>
                      </div>
                      <div class="sec-input input-box">
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 3 }"
                          placeholder="请填写订单备注"
                          v-model="remark"
                        >
                        </el-input>
                        <!-- <textarea placeholder="请填写订单备注"></textarea> -->
                      </div>
                    </div>
                  </div>
                </div>

                <div class="huizong">
                  <!-- <div class="item">
            积分抵扣：
            <b>{{vuex_huobi}} {{ jifen_pay.money || 0 }}</b>
          </div> -->
                  <!-- <div class="order-tip">
            {{ vuex_config.yunfei_msg }}
          </div> -->

                  <div class="item">
                    <!-- <span class="text">共：</span> -->
                    <b class="val">共 {{ total_product_number || 0 }} 件</b>
                  </div>
                  <div class="item">
                    <span class="text">商品总价：</span>
                    <b class="val">{{ vuex_huobi }} {{ goodsPrice || 0 }}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="bottom-btns">
            <button class="btn-ripple fit-text btn-1" @click="show = false">
              取消
            </button>
            <button class="btn-ripple fit-text btn-2" @click="do_submit()">
              确认
            </button>
          </div>
        </div>
      </el-dialog>
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
  </div>
</template>
<style scoped lang="less">
.upload-box {
  padding: 20px 20px;
  text-align: left;
}

.btn-cancel {
  min-width: 100px;
  height: 40px;
  border: 1px solid #F74747;
  color: #F74747;
  font-size: 14px;
}

.btn-confirm {
  margin-left: 20px;
  min-width: 100px;
  height: 40px;
  background: #F74747;
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
  background: #ffffff;
  text-align: center;
  font-size: 14px;

  .inner {
    margin: 0 auto;
    padding: 40px 0 100px 0;
    background: #fff;
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
        background: #f5f5f5;
        padding: 15px 0;

        font-family: OPPOSans, OPPOSans;
        // font-weight: bold;
        font-size: 14px;
        color: #666666;

        // border-bottom: 1px solid #ddd;
        .box-title {
          flex: 4;
          text-align: left;

          .title-text {
            margin-left: 70px;
          }
        }

        .box-sku {
          width: 64px;
        }

        .box-unit {
          width: 64px;
        }

        .box-num {
          width: 64px;
        }

        .box-subtitle {
          width: 64px;
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
            width: 64px;

            font-size: 12px;
            font-family: sans-serif;
            font-weight: 400;
            color: #999999;
          }

          .box-unit {
            width: 64px;
            color: #ff0000;
          }

          .box-num {
            width: 64px;
          }

          .box-subtitle {
            width: 64px;
            color: #ff0000;
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
        border: 1px solid #F74747;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 17px;
        color: #F74747;
      }

      &.btn-2 {
        width: 200px;
        height: 45px;
        background: #F74747;
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
            border: 1px solid #F74747;
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
      color: #F74747;
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
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 24px;
    color: #333333;
  }

  .sec-ctx {
    padding-top: 45px;
  }
}

.sec-addr {
  padding-bottom: 55px;
  text-align: left;

  .sec-title {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #d5d8de;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 24px;
    color: #333333;
  }

  .sec-ctx {
  }

  .address-list {
    display: flex;
    flex-wrap: wrap;

    .address-item {
      position: relative;
      margin-top: 20px;
      margin-right: 30px;
      margin-bottom: 20px;
      width: 440px;
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
      &:nth-child(-n + 3) {
        margin-top: 0;
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
    margin-top: 32px;
    padding-left: 32px;

    .empty-title {
      margin-bottom: 40px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }

    .btn {
      min-width: 124px;
      height: 32px;
      background: #ffffff;
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #F74747;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #F74747;
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
          color: #F74747;
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
  padding-bottom: 55px;
  text-align: left;

  .sec-title {
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid #d5d8de;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 24px;
    color: #333333;
  }

  .sec-ctx {
  }

  .pay-group {
    display: flex;
    align-items: center;
    padding-left: 32px;

    .title {
      // min-width: 120px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #666666;
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
          font-family: sans-serif;
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
        border: 1px solid #F74747;
        font-size: 14px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #F74747;
      }
    }
  }
}

.sec-product {
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
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
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
        border-color: #F74747;

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
            font-family: Microsoft YaHei-Bold, Microsoft YaHei;
            font-weight: bold;
            color: #F74747;
          }

          .text-2 {
            margin-left: 5px;
            font-size: 12px;
            font-family: sans-serif;
            font-weight: 400;
            color: #333333;
          }
        }

        .yhq-2 {
          margin-top: 10px;
          font-size: 12px;
          font-family: sans-serif;
          font-weight: 400;
          color: #999999;
        }
      }

      .yhq-bottom {
        height: 32px;
        line-height: 32px;
        padding: 0 15px;
        font-size: 12px;
        font-family: sans-serif;
        font-weight: 400;
        color: #F74747;
      }
    }
  }

  .yhq-select-info {
    height: 50px;
    line-height: 50px;
    background: #fafbfc;
    padding: 0 30px;

    .number {
      color: #F74747;
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
    }

    .yue-warn-tip {
      color: #F74747;
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
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 24px;
    color: #333333;
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
          // color: #FFA58D;
          border: 1px solid #ffa58d;
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