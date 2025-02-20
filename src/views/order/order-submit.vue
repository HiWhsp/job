<template>
  <div class="checkout-container">
    <div class="w-1400">
      <el-row :gutter="20">
        <!-- 左侧部分 -->
        <el-col :span="16">
          <!-- 收货地址 -->
          <div class="card">
            <h3>收货地址</h3>
            <div class="section-ctx">
              <div class="address-list">
                <div class="address-item" v-for="(item, index) in list_address" :key="index"
                     :class="{ active: item.id == address_selected.id }" @click="do_toggle_address(item)">
                  <div class="address-top">{{ item.lastName || item.firstName }}</div>
                  <div class="address-bottom">
                    {{ item.full_addr }}
                  </div>
                  <div class="address-phone">{{ item.phone }}</div>
                  <img src="@/static/order/addr-select.png" alt="" class="marker"/>
                  <div class="moren" v-if="item.moren">默认地址</div>
                </div>
              </div>
              <div class="btn-box">
                <button class="btn-ripple" @click="open_addr_add()">使用新地址</button>
              </div>
            </div>
          </div>

          <!-- 账单信息 -->
          <div class="card">
            <h3>账单明细</h3>
            <el-form ref="form" :model="form" label-width="100px" label-position="top">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="名字">
                    <el-input v-model="form.firstName"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="姓氏">
                    <el-input v-model="form.lastName"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="电话">
                <el-input v-model="form.phone"/>
              </el-form-item>
              <el-form-item label="国家/地区">
                <el-select v-model="form.country" placeholder="选择国家">
                  <el-option label="中国" value="China"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="地址">
                <el-input v-model="form.address"/>
              </el-form-item>
              <el-form-item label="邮政编码">
                <el-input v-model="form.postCode"/>
              </el-form-item>
            </el-form>
          </div>

          <!-- 额外信息 -->
          <div class="card">
            <h3>附加信息</h3>
            <el-input type="textarea" v-model="form.notes" :rows="5" placeholder="请输入备注信息"/>
          </div>
        </el-col>
        <!-- 右侧订单详情 -->
        <el-col :span="8">
          <div class="order-summary">
            <h3>您的订单</h3>
            <div class="product">
              <div class="title">产品</div>
              <div v-for="item in payment_products" :key="item.id" class="cart-item">
                <el-image :src="item.image" class="cart-image"></el-image>
                <div class="cart-info">
                  <p class="cart-title">{{ item.title }}</p>
                  <p class="cart-price">{{ item.num }} x CN ￥{{ item.priceSale }}</p>
                </div>
              </div>
              <div class="summary">
                <p>小计: <span>¥{{ subtotal }}</span></p>
                <p>折扣: <span>¥{{ discount }}</span></p>
                <p>运费: <span>¥{{ shipping }}</span></p>
                <h4>总计: <span>¥{{ total }}</span></h4>
              </div>
            </div>


            <!-- 支付方式 -->
            <div class="pay-type">
              <div class="title">支付方式</div>
              <div class="pay-items">
                <div class="item" v-for="(item, index) in pay_method_list" @click="do_toggle_paytype(item)"
                     :class="{ checked: pay_type_value == item.value }">
                  <img class="img-check check-0 check-img check-img-0" src="@/assets/image/common/check0.png" alt=""/>
                  <img class="img-check check-1 check-img check-img-1" src="@/assets/image/common/check1.png" alt=""/>
                  <span>{{ item.title }}</span>

                  <img class="marker-img" :src="item.icon" alt=""/>
                </div>
              </div>
            </div>

            <!-- 立即支付 -->
            <el-button type="danger" class="pay-btn" @click="do_submit">立即支付</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 订单支付提示 -->
    <el-dialog class="modal-pay-tip" title="订单提醒" :visible.sync="order_confirm_tip" width="30%"
               :close-on-click-modal="false" :append-to-body="true">
      <span>确认支付当前订单？</span>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple btn-cancel" @click="order_confirm_tip = false">
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
import {SHOP_TYPE} from "@/config/env";

export default {
  data() {
    return {
      selectedAddress: 0,
      addresses: [
        {detail: "光托中国北京东直门外大街", phone: "+86 15810590312"},
        {detail: "光托中国北京朝阳区", phone: "+86 15810590312"}
      ],
      form: {
        firstName: "",
        lastName: "",
        phone: "",
        country: "",
        address: "",
        notes: ""
      },
      cartItems: [
        {
          image: "https://via.placeholder.com/50",
          name: "Calsonic Skyline GT-R",
          price: "348.00"
        },
        {
          image: "https://via.placeholder.com/50",
          name: "Calsonic Skyline GT-R",
          price: "348.00"
        }
      ],
      subtotal: 696.0,
      discount: 5.0,
      shipping: 0.0,

      order_confirm_tip: false,
      from: '',
      address_selected: {}, //选择的地址
      list_address: [], //地址列表

      payment_products: [], //要支付的商品信息
      // 支付方式
      payTypeValue: 2,
      pay_type_value: '',
      pay_method_list: [
        {value: 'weixin', title: '微信支付', icon: require('@img/pay-method/type-weixin.png')},
        {value: 'zhifubao', title: '支付宝支付', icon: require('@img/pay-method/type-zfb.png')},
        // { value: 'xianxia', title: '线下转款', icon: require('@img/pay-method/type-xianxia.png') },
        //{ value: 'paypal', title: 'PayPal', icon: require('@img/pay-method/type-paypal.png') },
        {value: 'yue', title: '余额支付', icon: require('@img/pay-method/type-yue.png')},
      ],
    };
  },
  computed: {
    total() {
      return this.subtotal - this.discount + this.shipping;
    }
  },
  created() {
    this.from = this.$route.query.from || '';
    this.getCacheProduct();
    this.query_address();
  },
  methods: {
    //获取缓存的产品信息
    getCacheProduct() {
      //本地产品数据
      let cache_payment_products = sessionStorage.getItem('cache_payment_products');
      if (cache_payment_products) {
        this.payment_products = JSON.parse(cache_payment_products)

        let total_product_number = 0;
        let total_product_price = 0;
        this.payment_products.forEach(v => {
          total_product_number += parseInt(v.num)
          total_product_price += v.price_sale * parseInt(v.num)
        })
        this.total_product_number = total_product_number;
        this.total_product_price = total_product_price;
        this.$log('缓存 待下单产品', this.payment_products)
      } else {

      }
    },
    //获取地址列表
    query_address() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'userAddress_lists',
          ...this.pagination_address,
          // shop_id: this.id,
        },
      }).then(res => {
        if (res.code == 200) {
          let data = res.data

          data.forEach((v) => {
            if (SHOP_TYPE == 'foreign') {//东莞市锋扬礼品
              v.full_addr = [v.country, v.province, v.city, v.area, v.address].filter(v => !!v).join(',');
              v.name_phone = `${v.firstName} ${v.lastName} (${v.phone})`
            } else {
              v.full_addr = [v.country, v.province, v.city, v.area, v.address].filter(v => !!v).join(',');
              v.name_phone = `${v.name} (${v.phone})`
            }
          });
          this.list_address = data;

          let obj = data.find((v) => v.moren) || {};
          this.address_selected = obj || {};
        }
      })
    },

    //选择收货地址
    do_toggle_address(item) {
      this.address_selected = item;
      // this.query_pay_info()
    },

    //新增地址
    open_addr_add() {
      if (SHOP_TYPE == 'foreign') {
        this.$refs.foreign_address_modal.init();
      } else {
        this.$refs.address_modal.init();
      }
    },

    //根据下单商品获取确认订单信息
    query_pay_info() {
      let params = this.get_pay_info_params();

      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_getPayInfo',
          ...params
        },
      }).then((res) => {
        let {code, data, msg} = res;
        if (code == 200) {
          this.pay_info = data;
          this.jifen_pay = data.jifen_pay || {}; //积分信息

          //
          this.total_order_price = data.order_price || 0
          //this.total_product_price = data.goods_price || 0;
          this.order_zhekou_bili = parseFloat(data.zhekou) || 10
          this.order_zhekou_price = parseFloat(data.zhekou_price) || 0
          this.order_yunfei = data.yunfei || 0;


          // this.format_coupon_view_info(data.yhq_list)
          // this.coupons_for_allow_use = data.yhq_list || []
          // this.total_product_price = data.goods_price;

          if (this.coupon_selected.id) {
            this.total_order_price = (this.total_order_price - this.coupon_selected.jian).toFixed(2)
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
    get_pay_info_params() {
      let product_items = this.payment_products.map(v => ({
        "inventoryId": v.inventoryId,
        "productId": v.productId,
        "num": v.num
      }))
      let productInfo = JSON.stringify(product_items)

      let params = {
        productInfo: productInfo,
        addressId: this.address_selected.id || '',
      }
      return params
    },

    do_toggle_paytype(item) {
      this.pay_type_value = item.value
      this.payType = item.title
      let value = item.title
      if (value == "余额支付") {
        if (this.baseInfo.is_pay_pass == 0) {
          //未设置支付密码
          this.$refs.balance_password_set_modal.init(this.baseInfo);
        } else if (this.total_balance < this.real_payment_money) {
          //余额不足提示
          this.$refs.balance_pay_disable_modal.init({
            money: this.real_payment_money,
          });
        }
      }

    },

    //提交订单
    do_submit() {
      let params_info = {
        ...this.form,
      };
      delete params_info.phone;

      if (!this.address_selected.id) {
        alertErr("请选择收货地址");
        return;
      }

      if (!this.pay_type_value) {
        alertErr("请选择支付方式");
        return;
      }

      if (this.pay_type_value == "balance") {
        if (this.total_balance < +this.real_payment_money) {
          alertErr("您的余额不足，请选择其他支付方式");
          return;
        }
      }

      this.order_confirm_tip = true;
    },

    //订单提交-支付
    do_confirm_submit() {
      this.order_confirm_tip = false;

      let params = this.get_pay_params();

      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_create',
          ...params,
        },
      }).then((res) => {
        if (res.code == 200) {
          let { id, orderNo } = res.data;
          this.order_id = id;
          this.do_order_pay();
        }
      });
    },

    get_pay_params() {
      let product_items = this.payment_products.map(v => ({
        "inventoryId": v.inventoryId,
        "productId": v.productId,
        "num": v.num
      }))
      let productInfo = JSON.stringify(product_items)

      let params = {
        invoiceStatus: 0,//是否开票 0-不需要 1-需要发票
        productInfo: productInfo,
        addressId: this.address_selected.id || '',
        peisongType: 1,//配送类型：1-快递物流 2-上门自提
        peisongTime: '',//配送时间
        yhqId: '',//优惠券记录ID
        tuanId: '',//参与拼团的团ID
        tuanType: '',//拼团类型：0-普通订单 1-普通团 2-社区团
        remark: '',//备注

      }
      return params
    },

    //支付方式调取
    do_order_pay() {
      if (this.is_order_test) {
        this.pay_use_yue()
      } else {
        if (this.pay_type_value == "weixin") {
          this.order_payment_wx_pc();
        } else if (this.pay_type_value == "zhifubao") {
          this.order_payment_zfb();
        } else if (this.pay_type_value == "yue") {
          this.pay_use_yue()
        } else if (this.pay_type_value == "paypal") {
          this.pay_use_paypal();
        }
      }
    },

    //微信支付 pc
    order_payment_wx_pc() {
      this.$api("orders_wxScanCodePay", {
        order_id: this.order_id,
      }).then((res) => {
        //console.log("pc 微信扫码", res);
        // alert(res);
        let { code, data } = res;
        if (res.code == 200) {
          let info = {
            // ...res,
            qrcode: data.qrcode,
            order_id: this.order_id,
          };
          this.$refs.orderPayWxCode.init(info);
          // this.$refs.orderPayWxCode.qrcode = data.qrcode;
          // this.$refs.orderPayWxCode.showModal = true;
          // this.showWaiting();
        }
      });
    },

    //pc 支付宝支付
    order_payment_zfb() {
      // alertErr('尚未开通支付宝支付');

      this.showWaiting();

      this.$api("orders_aliScanCodePay", {
        order_id: this.order_id,
      }).then((res) => {
        //console.log("支付宝支付", res);
        let { code, msg, data } = res;
        if (code == 200) {
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
        }
      });
    },

    //余额支付
    pay_use_yue() {
      // this.$refs.balance_pay_modal.init({
      //   order_id: this.order_id,
      //   money: this.real_payment_money,
      // });

      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'pay_balance',
          orderType: 1,
          orderId: this.order_id,
        },
      }).then((res) => {
        alert(res)
        let { code, message } = res;
        if (code == 200) {
          this.toPaySuccess();
        } else {
        }
      });
    },

    toFail() {
      this.$router.push(`/payFail?order_id=${this.order_id}`);
    },

    //
    toPaySuccess() {
      this.toPayResult(1)
    },

    //
    toPayResult(is_pay = 0) {
      this.toRoute({
        path: '/payment-success',
        query: {
          id: this.order_id,
          type: 'order',
          is_pay: is_pay,
        },
      })
    },
  }
};
</script>

<style lang="less" scoped>
.checkout-container {
  background: #fff;
  padding-bottom: 50px;
}

.card {
  padding: 20px;

  h3 {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 700;
    font-size: 20px;
    color: #2C3E50;
    margin-bottom: 15px;
  }
}

.address-list {
  display: flex;
  flex-wrap: wrap;
  height: 220px;
  overflow: auto;

  .address-item {
    position: relative;
    margin-bottom: 20px;
    margin-right: 30px;
    width: 376px;
    height: 192px;
    border: 1px solid #D2D2D2;
    overflow: hidden;
    cursor: pointer;

    &:nth-child(2n) {
      margin-right: 0;
    }

    &:nth-child(-n + 2) {
      margin-top: 0;
    }

    &.active {
      .marker {
        display: block;
      }
    }

    .marker {
      position: absolute;
      right: -1px;
      bottom: -1px;
      display: none;
      width: 42px;
      height: 38px;
    }

    .address-top {
      border-bottom: 1px dashed #D2D2D2;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #3D3D3D;
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      display: flex;
    }

    .address-bottom {
      flex: 1;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #3D3D3D;
      height: 90px;
      padding: 0 20px;
      display: flex;
      align-items: center;
    }

    .address-phone {
      border-top: 1px dashed #D2D2D2;
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      font-weight: 400;
      font-size: 14px;
      color: #3D3D3D;
    }

    .moren {
      width: 88px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #000000;
      color: #fff;
      position: absolute;
      top: 0;
      right: 10px;
    }
  }
}

.btn-box {
  button {
    min-width: 124px;
    min-height: 32px;
    background: #000;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #7B7B7B;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular-, SourceHanSansCN-Regular;
    font-weight: normal;
    color: #fff;
  }
}

.order-summary {
  margin-top: 30px;
  padding: 18px 25px;
  background: #F8F8F8;
  border: 1px solid #EEEEEE;

  h3 {
    font-weight: 700;
    font-size: 20px;
    color: #2C3E50;
    margin-bottom: 15px;
  }

  .product {
    background: #FFFFFF;

    .title {
      height: 48px;
      line-height: 48px;
      padding: 0 20px;
      font-size: 16px;
      color: #000;
    }

    .product-img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }

    .cart-item {
      padding: 18px 20px;
      display: flex;
      align-items: center;
      border-top: 1px solid #eee;

      .cart-image {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }

      .cart-info {
        flex: 1;

        .cart-title {
          font-size: 14px;
          font-weight: bold;
        }

        .cart-price {
          font-size: 14px;
          color: #000;
        }
      }

      .remove-btn {
        font-size: 18px;
        color: #000;
        cursor: pointer;
      }
    }

    .summary {
      padding: 0 20px;
      border-top: 1px solid #eee;
      font-size: 16px;

      p {
        height: 47px;
        line-height: 47px;
        display: flex;
        justify-content: space-between;
        color: #000;
        border-bottom: 1px solid #eee;
      }

      h4 {
        height: 86px;
        line-height: 86px;
        font-size: 20px;
        color: #000;
        display: flex;
        justify-content: space-between;
      }
    }
  }


}

.pay-type {
  margin-top: 20px;
  background: #FFFFFF;

  .title {
    height: 48px;
    line-height: 48px;
    padding: 0 20px;
    font-size: 16px;
    color: #000;
  }

  .pay-items {
    flex: 1;
    display: flex;
    flex-direction: column;

    .item {
      padding: 0 20px;
      height: 64px;
      line-height: 64px;
      display: flex;
      align-items: center;
      cursor: pointer;
      border-bottom: 1px solid #eee;

      &:last-child {
        border: none;
      }

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
        margin-left: 10px;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #3D3D3D;
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
  }
}

.pay-btn {
  margin-top: 30px;
  width: 100%;
  height: 48px;
  background: #D41C17;
  border-radius: 0px 0px 0px 0px;
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
</style>
