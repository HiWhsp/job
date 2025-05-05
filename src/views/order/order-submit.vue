z`
<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item
          ><img
            alt=""
            src="@/static/home/home.png"
          />当前位置</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>下单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="inner">
      <div class="section">
        <div class="section-title">
          选择收货人地址
          <div class="btn-box p-l-30">
            <button class="btn-ripple" @click="open_addr_add()">
              + 新增地址
            </button>
          </div>
        </div>
        <div class="section-ctx">
          <div class="address-list">
            <div
              v-for="(item, index) in list_address"
              :key="index"
              :class="{ active: item.id == address_selected.id }"
              class="address-item"
              @click="do_toggle_address(item)"
            >
              <div class="address-top">{{ item.name_phone }}</div>
              <div class="address-bottom">
                {{ item.full_addr }}
              </div>
              <img alt="" class="marker" src="@/static/order/addr-select.png" />
            </div>
            <div v-if="list_address.length == 0" class="empty-dev">
              还没有收件地址
            </div>
          </div>
        </div>
      </div>

      <div class="section section-pay">
        <div class="section-title">支付和配送信息</div>
        <div class="section-ctx section-ctx-type p-l-30">
          <div class="pay-group">
            <div class="title">支付方式 ：</div>
            <div class="pay-items">
              <div
                v-for="(item, index) in payTypeOption"
                :class="{ checked: pay_type_value == item.value }"
                class="item"
                @click="do_toggle_paytype(item)"
              >
                <img
                  alt=""
                  class="img-check check-0 check-img check-img-0"
                  src="@/static/common/check0.png"
                />
                <img
                  alt=""
                  class="img-check check-1 check-img check-img-1"
                  src="@/static/common/check1.png"
                />
                <img :src="item.icon" alt="" class="marker-img" />
                <span>{{ item.title }}</span>
              </div>
            </div>
          </div>
          <!-- 线下转款信息 -->
          <div v-if="payType == '对公转账（含税）'" class="xianxia-info">
            <div class="title">收款对公账户</div>
            <!--            <div class="info-item">-->
            <!--              <div class="info-label">收款人信息：</div>-->
            <!--              <div class="info-val">{{ bankList[0].bankUser }}</div>-->
            <!--            </div>-->
            <div class="info-item">
              <div class="info-label">收款单位名称：</div>
              <div class="info-val">
                {{ bankList[0].company_name }}
                <img
                  alt=""
                  src="@/static/order/copy.png"
                  @click="copyText(bankList[0].company_name)"
                />
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">银行账户：</div>
              <div class="info-val">
                {{ bankList[0].account }}
                <img
                  alt=""
                  src="@/static/order/copy.png"
                  @click="copyText(bankList[0].account)"
                />
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">开户银行：</div>
              <div class="info-val">
                {{ bankList[0].bank }}
                <img
                  alt=""
                  src="@/static/order/copy.png"
                  @click="copyText(bankList[0].bank)"
                />
              </div>
            </div>
          </div>
          <div
            v-if="payType == '线下支付'"
            class="pay-img scroll-target-pingzheng"
          >
            <el-upload
              :on-success="handleSuccessImg"
              action="https://shalunxiehui.dx.hdapp.com.cn/api?action=index_ossUpload"
              list-type="picture-card"
              multiple
              name="img"
            >
              <div slot="default" class="flex upload__text">
                <p><i class="el-icon-plus"></i></p>
                <span>上传支付凭证</span>
              </div>
            </el-upload>
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="section section-product">
        <div class="section-title">订单商品</div>
        <div class="section-ctx">
          <div class="goods-list">
            <div class="list">
              <div
                v-for="(it, i) in payment_products"
                :key="i"
                class="goods-list-inner"
              >
                <div class="comp-title">
                  <img alt="" src="@/static/home/supplier.png" />
                  <span>{{ it.supply_user_info.name }}</span>
                </div>
                <!-- 标题 -->
                <div class="list-title flex p-l-30">
                  <div class="box-title">
                    <div class="title-text">产品信息</div>
                  </div>
                  <div class="box-unit">产品类目</div>
                  <div class="box-unit">产品规格</div>
                  <div class="box-unit">单价</div>
                  <div class="box-num">数量(吨)</div>
                  <div class="box-subtitle">小计</div>
                </div>
                <!-- 商品列表 -->
                <div
                  v-for="(item, index) in it.material_list"
                  :key="index"
                  class="item p-l-30"
                >
                  <div class="item-detail flex">
                    <div class="box-title flex">
                      <div class="poster-box">
                        <el-image :src="item.material_info.cover_url_full">
                          <div slot="error" class="image-slot">
                            <img :src="item.material_info.cover_url_full" />
                          </div>
                        </el-image>
                      </div>
                      <div class="title-box">
                        {{ item.material_info.material_type_info.name }}
                        <div class="box-sku">
                          {{ item.material_info.guige }}
                        </div>
                      </div>
                    </div>
                    <div class="box-unit">
                      {{ item.material_info.material_type_info.name }}
                    </div>
                    <div class="box-unit">{{ item.material_info.guige }}</div>
                    <div class="box-unit">
                      <p>
                        {{ vuex_huobi }}
                        {{ item.material_info.includeTaxPrice }}(含税)
                      </p>
                      <p>
                        {{ vuex_huobi }}
                        {{ item.material_info.noTaxPrice }}(不含税)
                      </p>
                    </div>
                    <div class="box-num">{{ item.cart_info.num }}</div>
                    <div class="box-subtitle">
                      {{ vuex_huobi }}
                      {{pay_type_value==1?(
                          item.material_info.includeTaxPrice *
                          +item.cart_info.num
                        ).toFixed(2):item.material_info.noTaxPrice *
                          +item.cart_info.num}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--      汇总信息-->
      <div class="huizong">
        <div class="item">
          <!-- <span class="text">共：</span> -->
          <b class="val">共 {{ total_product_number || 0 }} 吨</b>
        </div>
        <div class="item total">
          <span class="text">合计应付：</span>
          
          <b>{{ vuex_huobi }} {{ total_product_price }}</b>
          ({{pay_type_value==1?'含税':'不含税'}})
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
          提交订单
        </button>
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
      <img :src="dialogImageUrl" alt="" width="100%" />
    </el-dialog>

    <!-- 订单支付提示 -->
    <el-dialog
      :append-to-body="true"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :visible.sync="order_confirm_tip"
      class="modal-pay-tip"
      title="订单提醒"
      width="30%"
    >
      <span>确认支付当前订单？</span>
      <span slot="footer" class="dialog-footer">
        <button
          class="btn-ripple btn-cancel"
          @click="order_confirm_tip = false"
        >
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

import address_modal from "@/components/address/address_modal.vue"; //新增地址
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
      is_order_test: false, //订单测试
      from: "", //product-detail  ||  cart
      address_selected: {}, //地址
      pagination_address: {
        page: 1,
        pagenum: 20,
      },
      coupon_selected: {}, //优惠券
      coupons_for_allow_use: [],
      remark: "",
      //
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
      // 发票信息
      invoice_info: {
        invoiceStatus: 1, //是否开票 0-不需要 1-需要发票
        invoiceType: "1", //发票类型：1-普通发票 2-专用发票
        titleType: "1", //抬头：1-个人 2-单位
        title: "", // 公司名称
        shibiema: "", // 识别码
        companyAddress: "", // 注册地址
        companyPhone: "", // 注册电话
        bankName: "", // 开户银行
        bankNo: "", // 银行账号
        email: "", // 电子邮箱
        orderId: "", // 关联订单
      },
      // 支付方式
      pay_type_value: "2",
      Invoice_type_value: "0", // 开票类型
      payTypeOption: [
        {
          value: "1",
          title: "对公转账（含税）",
          icon: require("@/static/order/duihong.png"),
        },
        {
          value: "2",
          title: "银行卡转款（不含税）",
          icon: require("@/static/order/card.png"),
        },
      ],
      // 发票类型
      invoiceTypeOption: [
        { value: "0", title: "不开票", icon: "" },
        { value: "1", title: "普通发票", icon: "" },
        { value: "2", title: "专用发票", icon: "" },
      ],

      orderId: "", //是否已经创建过订单
      showCoupon: true, //

      if_use_jifen: true, //是否使用积分抵扣
      if_use_yongjin: true, //是否使用佣金扣减
      currency: "￥", //货币

      money_yunfei: 0,
      order_price: 0, //总 订单金额

      yh_code: "",
      yh_code_info: {},

      peisong_type: "快递配送",
      address: "", //选择的地址
      list_address: [], //地址列表
      payment_products: [], //要支付的商品信息
      list_coupon: [], //优惠券
      coupon_select_id: "", //选择的优惠券 id
      bankList: [], // 线下卡列表

      form: {
        real_name: "",
        phone: "",
        address: "",
        company: "",
        u_group: "",
        worker: "",
      },

      is_pay_pass: 0, //是否设置余额支付密码
      payType: "", // 支付类型
      invoiceType: "", // 发票类型
      upload_limit_number: 6,
      dialogVisible: false,
      dialogImageUrl: "", //转账图片查看
      order_confirm_tip: false, //确认支付信息提示
      xianxia_file_list: [],
    };
  },
  computed: {
    ...mapState(["if_calc_yunfei"]),

    real_payment_money() {
      let money = parseFloat(
        (this.total_order_price - this.order_points_dixian_price).toFixed(2)
      );
      return money;
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
      if (this.baseInfo.jifen && total_dixian_jifen) {
        if (this.baseInfo.jifen < total_dixian_jifen) {
          jifen = this.baseInfo.jifen;
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
  },
  watch: {},
  created() {
    this.from = this.$route.query.from || "";
    this.getCacheProduct();

    // 获取用户
    this.query_user();
    // 获取地址列表
    this.query_address();
    //获取线下卡列
    this.getBankList();
    this.query_pay_info();
  },
  methods: {
    //获取缓存的产品信息
    getCacheProduct() {
      //本地产品数据
      let cache_payment_products = sessionStorage.getItem(
        "cache_payment_products"
      );
      if (cache_payment_products) {
        this.payment_products = JSON.parse(cache_payment_products);
        this.payment_products.forEach((v) => {
          v.material_list.forEach((vv) => {
            this.total_product_number += +vv.cart_info.num;
            if(this.pay_type_value==1){
              this.total_product_price +=
              vv.cart_info.includeTaxPrice * +vv.cart_info.num;
            }else{
              this.total_product_price +=
              vv.cart_info.noTaxPrice * +vv.cart_info.num;
            }
            
          });
        });
      } else {
      }
    },

    //获取缓存的地址信息
    query_user() {
      this.$api({
        url: "userInfo",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          this.my_info = res.data.user_info;
          this.total_balance = parseFloat(this.my_info.money) || 0;
        }
      });
    },

    //获取地址列表
    query_address() {
      this.$api({
        url: "myAddressList",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data.list;

          data.forEach((v) => {
            v.full_addr = [v.province, v.city, v.area, v.address].join("-");
            v.name_phone = v.username + "(收)" + v.mobile;
          });
          console.log(data);
          this.list_address = data;

          let obj = data.find((v) => v.is_default) || {};
          this.address_selected = obj || {};
        }
      });
    },

    get_pay_params() {
      const list = [];
      this.payment_products.forEach((v) => {
        v.material_list.forEach((vv) => {
          list.push({
            id: vv.cart_info.material_id,
            num: vv.cart_info.num,
          });
        });
      });
      console.log(list,'1');
      
      let params = {
        supply_user_id: this.payment_products[0].supply_user_info.id,
        address_id: this.address_selected.id,
        pay_type: this.pay_type_value,
        supply_account_id: this.bankList[0].id,
        material_list: list,
      };
      return params;
    },

    //根据下单商品获取确认订单信息
    query_pay_info() {},

    do_toggle_paytype(item) {
      this.pay_type_value = item.value;
      this.payType = item.title;
      this.total_product_price=0
      this.getCacheProduct()
    },

    //提交订单
    do_submit() {
      if (!this.address_selected.id) {
        alertErr("请选择收货地址");
        return;
      }

      if (!this.pay_type_value) {
        alertErr("请选择支付方式");
        return;
      }

      this.order_confirm_tip = true;
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
      this.order_confirm_tip = false;
      let params = this.get_pay_params();

      this.$api({
        url: "createOrder",
        method: "post",
        data: {
          ...params,
        },
      }).then((res) => {
        if (res.code == 200) {
          let { id, order_id } = res.data;
          this.orderId = order_id;
          this.toPaySuccess();
        }
      });
    },

    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },

    //支付成功操作
    toPaySuccess() {
      if (this.mode == "yue") {
        this.$router.push(`/yue`);
      } else {
        this.$router.push(`/payment-success?id=${this.orderId}`);
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
      this.address_selected = item;
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

    //订单佣金抵现
    order_yongjin_pay() {
      this.$api("orders_yuePay", {
        orderId: this.orderId,
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
        path: "/orderSubmit",
        query: {
          orderId: this.orderId,
          from: "order-submit",
        },
      });
    },

    // 获取线下卡列
    getBankList() {
      this.$api({
        url: "supplyAccountList",
        method: "post",
        data: {
          supply_user_id: this.payment_products[0].supply_user_info.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.bankList = res.data.account_list;
        }
      });
    },

    // 上传凭证
    handleSuccessImg(response, file, fileList) {
      this.xianxia_file_list = fileList.map((item) => item.response.data);
    },
    copyText(text) {
      let input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message.success("复制成功");
      input.remove();
    },
  },
};
</script>

<style lang="less" scoped>
.nav-bar {
  margin-bottom: 20px;

  img {
    width: 14px;
    margin-right: 10px;
  }
}

.upload-box {
  padding: 20px 20px;
  text-align: left;
}

.btn-cancel {
  min-width: 100px;
  height: 40px;
  border: 1px solid @theme;
  color: @theme;
  font-size: 14px;
}

.btn-confirm {
  margin-left: 20px;
  min-width: 100px;
  height: 40px;
  background: @theme;
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
  text-align: center;
  font-size: 14px;

  .inner {
    width: @width;
    margin: 0 auto;
    padding: 40px;
    background: #fff;
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
      padding: 0 24px;

      .goods-list-inner {
        margin-top: 10px;

        &:first-child {
          margin-top: 0;
        }
      }

      .comp-title {
        height: 48px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        padding-left: 10px;
        border-bottom: 1px solid #999;

        img {
          width: 56px;
          height: 20px;
          margin-right: 10px;
        }

        span {
          font-weight: 500;
          font-size: 18px;
          color: #000000;
        }
      }

      .list-title {
        height: 50px;
        border-bottom: 1px solid #e5e5e5;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        line-height: 50px;
        font-style: normal;
        text-transform: none;

        .box-title {
          flex: 1;
          text-align: left;

          .title-text {
            //margin-left: 70px;
          }
        }

        .box-sku {
          width: 240px;
        }

        .box-unit {
          width: 200px;
        }

        .box-num {
          width: 200px;
        }

        .box-subtitle {
          width: 200px;
        }
      }

      .item {
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .item-detail {
          padding: 15px 0;
          //text-align: center;
          font-family: OPPOSans, OPPOSans;
          // font-weight: bold;
          font-size: 14px;
          color: #666666;

          .box-title {
            width: 240px;

            .poster-box {
              //margin-left: 70px;
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
            margin-top: 5px;
            width: 240px;
            font-size: 12px;
            font-family: Roboto, Roboto;
            font-weight: 400;
            color: #999999;
          }

          .box-unit {
            width: 200px;
            color: #333;
          }

          .box-num {
            width: 200px;
          }

          .box-subtitle {
            width: 200px;
            color: #333;
          }
        }
      }
    }
  }

  .bottom-btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;

    button {
      & + button {
        margin-left: 16px;
      }

      &.btn-1 {
        min-width: 200px;
        height: 45px;
        background: #ffffff;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid @theme;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: @theme;
      }

      &.btn-2 {
        width: 200px;
        height: 45px;
        background: @theme;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
      }

      &:hover {
        opacity: 0.8;
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

.ziti-wrap {
  margin-bottom: 40px;
  text-align: left;
  min-height: 127px;
  background: #ffffff;
  border: 1px solid #cccccc;

  .ziti-title {
    .flex-between();
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
      .flex();

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
      .flex();

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
            border: 1px solid @theme;
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
  //background: #FAFBFC;

  .order-action-inner {
    padding-bottom: 10px;
  }

  .section-item {
    margin-bottom: 20px;

    .sub-title {
      height: 50px;
      background: #fafbfc;
      padding-left: 30px;

      .text {
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: bold;
        color: #333333;
      }

      img {
        width: 16px;
        margin-left: 10px;
      }
    }
  }
}

// 新增
.section {
  padding-bottom: 40px;
  text-align: left;

  .section-title {
    display: flex;
    justify-content: space-between;
    height: 48px;
    line-height: 48px;
    background: #f5f5f5;
    padding-left: 24px;

    font-size: 20px;
    color: #333333;

    .btn-box {
      button {
        width: 133px;
        height: 48px;
        background: #044fa0;
        font-size: 16px;
        font-weight: normal;
        color: #fff;
      }
    }
  }

  .section-ctx {
    margin-top: 24px;

    .address-list {
      display: flex;
      flex-wrap: wrap;
      overflow-y: auto;
      width: 100%;
      height: 130px;

      .address-item {
        position: relative;
        width: 350px;
        height: 130px;
        background: #ffffff;
        border: 1px solid @theme;
        margin-top: 20px;
        margin-right: 45px;
        min-height: 130px;
        padding: 15px 20px;
        border-radius: 4px 4px 4px 4px;
        overflow: hidden;
        cursor: pointer;

        &:nth-child(3n) {
          margin-right: 0;
        }

        &:nth-child(-n + 3) {
          margin-top: 0;
        }

        &.active {
          border: 1px solid @theme;

          .marker {
            display: block;
            width: 28px;
            height: 28px;
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
          font-family: Roboto, Roboto;
          font-weight: 400;
          color: #000000;
        }

        .address-bottom {
          padding-top: 15px;
          font-size: 14px;
          font-family: Roboto, Roboto;
          font-weight: 400;
          color: #000;
        }
      }

      .empty-dev {
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        font-style: normal;
        text-transform: none;
      }
    }

    .invoice-info {
      padding-left: 120px;
      margin-top: 31px;

      .info-item {
        .flex();
        margin-top: 26px;

        .info-label {
          width: 100px;
          text-align: right;
          margin-right: 18px;
          color: #666;

          span {
            color: #ff5f00;
          }
        }
      }
    }
  }
}

.section-info {
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
          color: @theme;
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
.section-pay {
  .pay-group {
    .flex();

    .title {
      min-width: 120px;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #666666;
    }

    .pay-items {
      flex: 1;
      .flex();

      .item {
        .flex();
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
          height: 39px;
          margin: 0 10px;
        }

        span {
          font-size: 16px;
          font-family: Roboto, Roboto;
          font-weight: 400;
          color: #000000;
        }

        .invoice {
          width: 105px;
          height: 33px;
          line-height: 33px;
          background: #ffffff;
          border-radius: 2px 2px 2px 2px;
          border: 1px solid #d6d6d6;
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 16px;
          text-align: center;
          color: #333333;
          font-style: normal;
          text-transform: none;
        }
      }

      .checked {
        .invoice {
          border: 1px solid @theme;
          color: @theme;
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
        border: 1px solid @theme;
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: bold;
        color: @theme;
      }
    }
  }
}

.section-product {
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
      font-family: Roboto, Roboto;
      font-weight: bold;
      color: #333333;
    }

    img {
      width: 16px;
      margin-left: 15px;
    }
  }

  .yhq-select-info {
    height: 50px;
    line-height: 50px;
    background: #fafbfc;
    padding: 0 30px;

    .number {
      color: @theme;
      margin: 0 10px;
    }
  }

  .remark-box {
    .input-box {
      padding: 15px;
    }
  }
}

.section-ctx-type {
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
    .flex();
    align-items: flex-start;
    margin-bottom: 10px;

    .info-label {
      line-height: 32px;
      padding-right: 10px;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #666666;
    }

    .info-val {
      line-height: 32px;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #666666;

      img {
        width: 12px;
        height: 12px;
      }
    }

    .yue-warn-tip {
      color: @theme;
      font-size: 14px;
    }
  }
}

// 线下转款信息
.xianxia-info {
  margin-top: 32px;
  margin-left: 120px;
  padding: 12px 24px;
  width: 995px;
  background: #fef8ee;
  border: 1px solid #f1e2ca;

  .info-item {
    .flex();
    align-items: flex-start;
    margin-bottom: 10px;

    .info-label {
      line-height: 32px;
      padding-right: 10px;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #333;
    }

    .info-val {
      display: flex;
      align-items: center;
      line-height: 32px;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: @theme;

      img {
        width: 12px;
        height: 12px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
}

.pay-img {
  margin-top: 32px;
  margin-left: 120px;
}

.p-l-30 {
  padding-left: 30px;
}
</style>

<style lang="less" scoped src="@/assets/h5css/shop/order-submit.less"></style>

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

.upload__text {
  flex-direction: column;
  justify-content: center;
  height: 148px;

  span,
  p {
    line-height: 30px;
  }
}
</style>
