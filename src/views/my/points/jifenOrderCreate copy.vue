<template>
  <div class="page">
    <!-- 新增收货地址 -->
    <address_modal ref="address_modal" />

    <div class="inner">
      <!-- 收货人地址 -->
      <div class="dizhi-select">
        <div class="dizhi-title">
          <div class="text">收货人地址</div>
          <div class="add">
            <b @click="show_address_add">+新增收货地址</b>
          </div>
        </div>
        <div class="dizhi-inner">
          <div class="tip" v-if="!list_address.length">
            您还没有收货地址，
            <b @click="show_address_add">新增收货地址</b>
          </div>
          <div class="list" v-else>
            <div class="item" :class="select_address.id == item.id ? 'active' : ''" v-for="(item, index) in list_address" :key="index" @click="onSelectAddress(item)">
              <button class="name" :class="address == item.id ? 'active' : ''">
                {{ item.name }}
              </button>
              <div class="phone">{{ item.phone }}</div>
              <div class="address">{{ item.areaName }} {{ item.address }}</div>
              <button class="moren" v-if="item.if_default">默认</button>

              <div class="checked" v-if="address == item.id">已选择</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 收货人地址 -->
      <div class="type-select">
        <div class="type-title">
          <div class="text">配送方式</div>
        </div>
        <div class="type-inner">
          <div class="select-1">
            <div class="title">配送方式</div>
            <div class="list">
              <button class="item" :class="peisong_type == item ? 'active' : ''" v-for="(item, index) in opts_peisong" :key="index" @click="onSelect_peisong(item)">
                {{ item }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="goods-list">
        <div class="title">订单商品</div>
        <div class="list">
          <!-- 标题 -->
          <div class="list-title">
            <div class="title-1">商品</div>
            <div class="title-2">单价</div>
            <div class="title-3">数量</div>
            <div class="title-4">小计</div>
          </div>

          <!-- 商品列表 -->
          <div class="item" v-for="(item, index) in payment_products" :key="index">
            <div class="item-detail">
              <div class="item-1">
                <img :src="item.image" />
              </div>
              <div class="item-2">{{ item.title }}</div>
              <div class="item-3">{{ item.priceSale }} 积分</div>
              <div class="item-4">{{ item.num }}</div>
              <div class="item-5">{{ (item.priceSale * item.num).toFixed(2) }} 积分</div>
            </div>
          </div>
        </div>

        <div class="order-action">
          <div class="order-action-inner">
            <div class="section-item">
              <div class="section-title">订单备注</div>
              <div class="section-input">
                <el-input type="textarea" :autosize="{ minRows: 3 }" placeholder="请填写订单备注" v-model="remark"> </el-input>

                <!-- <textarea placeholder="请填写订单备注"></textarea> -->
              </div>
            </div>
          </div>
        </div>

        <div class="huizong">
          <!-- <div class="item">
            运费：
            <b>{{vuex_huobi}} {{ yunfei || 0 }}</b>
          </div> -->

          <div class="total">
            总计：
            <b> {{ payment_money }} 积分</b>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->

      <div class="bottom">
        <button class="back" @click="$router.back()">
          返回
        </button>
        <button class="tijiao" @click="confirm_exchange">确认兑换</button>
      </div>
    </div>
  </div>
</template>

<script>
import address_modal from "@/components/address/address_modal.vue"; //新增地址

import shopcart from "@/shop-actions/shopcart";
import address from "@/shop-actions/address";
import order from "@/shop-actions/order";

import { mapState } from "vuex";

export default {
  name: "create-order",
  components: {
    address_modal,
  },
  data() {
    return {
      order_id: "",
      use_jifen_num: "", //使用积分抵扣方式支付时 要是用的积分数量
      jifen_pay: {}, //积分抵扣信息
      currency: "￥", //货币

      peisong_type: "门店自取",

      select_address: {},
      yh_code: "",
      yh_code_info: {},
      yunfei: 0,
      remark: "",

      address: "", //选择的地址
      list_address: [], //地址列表
      payment_products: [], //要支付的商品信息
      list_coupon: [], //优惠券
      select_coupon: "", //选择的优惠券 id

      order_price: 0, //总 订单金额
    };
  },
  computed: {
    ...mapState(["baseInfo"]),

    opts_peisong() {
      let arr = ["同城配送", "门店自取"];

    
      return arr;
    },

    //商品总金额
    payment_money() {
      //需要计算 订单金额  优惠券金额  运费
      let money = 0;

      if (this.payment_products.length) {
        this.payment_products.forEach((v) => {
          money += +v.priceSale;
        });
      }

      return money.toFixed(2);
    },

    //优惠券优惠面额
    coupon_value() {
      return this.yhq_selected.title ? "- " + this.yhq_selected.jian : "";
    },
  },
  watch: {
    //监视选择的地址
    select_address() {
      this.orders_getPayInfo(); //根据下单商品获取确认订单信息
    },
    //配送方式变化 需要重新获取
    peisong_type() {
      this.orders_getPayInfo(); //根据下单商品获取确认订单信息
    },
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.get_payment_products();
      this.address_getList(); //获取地址列表
      // this.orders_getPayInfo(); //根据下单商品获取确认订单信息
    },

    get_payment_products() {
      //console.log("待付款商品 payment_products", JSON.parse(sessionStorage.getItem("jifen_payment_products")));

      this.payment_products = JSON.parse(sessionStorage.getItem("jifen_payment_products"));
    },
    //获取地址列表
    address_getList() {
      address.getList({
        params: {},
        success: (data) => {
          data.forEach((v) => {
            v.full_dizhi = v.areaName + " " + v.address;
          });
          this.list_address = data;
          if (data.length) {
            this.select_address = data.find((v) => v.if_default) || {};
          } else {
            this.orders_getPayInfo();
          }
        },
      });
    },

    //根据下单商品获取确认订单信息
    orders_getPayInfo() {
      let payment_products = JSON.parse(sessionStorage.getItem("jifen_payment_products"));
      // //console.log('payment_products', payment_products);
      let product_info = payment_products.map((v) => ({
        inventoryId: v.inventoryId,
        productId: v.productId,
        num: v.num,
      }));
      product_info = JSON.stringify(product_info);

      let peisong = this.get_peisong_type_num();

      order.orders_getPayInfo({
        params: {
          product_info,
          address_id: this.select_address.id || "",
          yh_code: this.yh_code, //优惠码
          peisong_type: peisong,
        },
        success: (data, res) => {
          // debugger
          //console.log("根据下单商品获取确认订单信息", data);
          //console.log("根据下单商品获取确认订单信息", res);
          if (res.code != 1) {
            alertErr(res.message);
          } else {
            this.yh_code_info = data.yhcode_info || {};
            let list_coupon = data.yhq_list || [];

            this.list_coupon = [{ title: "不使用" }, ...list_coupon];

            this.order_price = data.order_price;
            this.yunfei = +data.yunfei || 0;
            this.jifen_pay = data.jifen_pay;

            if (data.yhq_list && data.yhq_list.length) {
              this.set_yhq_list(data.yhq_list);
            }
          }
        },
      });
    },

    //提交订单
    submit_order() {
      //console.log("select_coupon", this.select_coupon);
      // return
      let product_info = this.payment_products.map((v) => ({
        inventoryId: v.inventoryId,
        productId: v.productId,
        num: v.num,
      }));

      let peisong_type = "";
      let peisong_map = {
        快递配送: "3",
        同城配送: "5",
        门店自取: "4",
      };
      peisong_type = peisong_map[this.peisong_type];

      let params = {
        address_id: this.select_address.id,
        product_info: JSON.stringify(product_info),
        yhq_id: this.select_coupon || "",
        remark: this.remark,
        peisong_type: peisong_type,
      };

      if (+this.yh_code_info.jian) {
        params.yh_code = this.yh_code; //优惠码
      }

      if (!this.peisong_type) {
        alertErr("请选择配送方式");
        return;
      }

      if (this.peisong_type != "门店自取") {
        if (!this.select_address.id) {
          alertErr("请选择收货地址");
          return;
        }
      } else {
        delete params.address_id;
      }

      let that = this;

      order.orders_create({
        params: params,
        success: (order_id) => {
          //console.log("orders_create", order_id);
          this.order_id = order_id;

          //订单积分抵现逻辑
          if (this.use_jifen_num > 0) {
            this.order_jifen_dixian();
          } else {
            debugger;
            if (that.$route.query.from == "cart") {
              //如果下单商品来自于购物车 需要删除购物车中的商品
              that.shopcart_delete_payment(that.createOrderSuccess);
            } else {
              that.createOrderSuccess();
            }
          }
        },
      });
    },

    //购物车 删除支付的商品
    shopcart_delete_payment() {
      let ids = this.payment_products.map((v) => v.inventoryId);
      let id = ids.join();
      this.shopcart_delete(id);
    },

    //购车车 删除商品
    shopcart_delete(id) {
      shopcart.delete({
        params: {
          inventoryId: id,
        },
        success: () => {},
      });
    },

    //优惠券
    set_yhq_list(data) {
      //console.log("优惠券信息11", data);
      if (data.length) {
        let coupons = data.map((v) => ({
          ...v,
          available: 1,
          id: v.id,
          name: v.title,
          condition: `满${v.man}元可用`,
          startAt: new Date(v.startTime.replace(/-/g, "/")).getTime() / 1000 || 1489104000,
          endAt: new Date(v.endTime.replace(/-/g, "/")).getTime() / 1000 || 1514592000,
          description: v.content, //描述信息，优惠券可用时展示
          reason: "", //不可用原因，优惠券不可用时展示
          value: v.jian, //折扣券优惠金额，单位分
          valueDesc: v.jian, //折扣券优惠金额文案
          unitDesc: "元",
        }));

        this.coupons = coupons;
        //console.log("优惠券数据", coupons);
      }
    },

    //显示地址添加
    show_address_add() {
      // debugger;
      this.$refs.address_modal.showAdd = true;
    },

    //选择收货地址
    onSelectAddress(item) {
      this.select_address = item;
    },

    // 订单积分抵现
    order_jifen_dixian() {
      this.$api("orders_jifenPay", {
        order_id: this.order_id,
        jifen: this.use_jifen_num,
      }).then((res) => {
        //console.log("积分抵现", res);
        let { code, message } = res;
        if (code == 200) {
          this.createOrderSuccess();
        }
      });
    },

    //订单创建成功
    createOrderSuccess() {
      this.$router.push({
        path: "/payment-methods",
        query: {
          order_id: this.order_id,
        },
      });
    },

    //购物车 删除支付的商品
    shopcart_delete_payment(callback) {
      let ids = this.payment_products.map((v) => v.inventoryId);
      let id = ids.join();

      shopcart.delete({
        params: {
          inventoryId: id,
        },
        success: () => {
          callback();
        },
      });
    },

    //选择配送方式
    onSelect_peisong(item) {
      let val = item;
      let index = this.opts_peisong.findIndex((v) => v == item);

      //console.log(val, index);
      // debugger;
      if (val == "同城配送") {
        if (this.select_address && !this.select_address.areaName) {
          alertErr("请先选择收货地址");
          return;
        }
        // debugger;
        if (this.select_address && this.select_address.areaName && !this.select_address.areaName.includes("伯明翰")) {
          alertErr("只有伯明翰地区支持同城配送");
          return;
        }
      }

      this.peisong_type = val;
      this.show_peisong = false;
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

    //获取配送方式
    get_peisong_type_num() {
      let peisong_type = "";
      let peisong_map = {
        快递配送: "3",
        同城配送: "5",
        门店自取: "4",
      };
      peisong_type = peisong_map[this.peisong_type];

      return peisong_type;
    },
    //使用优惠码时需要查询优惠信息
    query_yh() {
      this.orders_getPayInfo();
    },
    //不使用优惠码
    not_use_yh() {
      this.yh_code_info = {};
    },

    confirm_exchange() {
      // this.compare_jifen();
      this.use_jifen();
    },

    //使用积分兑换下单
    use_jifen() {
      //console.log("支付信息", this.payment_products);
      var inventoryId = this.payment_products.map((v) => v.inventoryId).join();
      let num = this.payment_products[0].num;

      let peisong_type = "";
      let peisong_map = {
        快递配送: "3",
        同城配送: "5",
        门店自取: "4",
      };

      peisong_type = peisong_map[this.peisong_type];

      let params = {
        inventoryId: inventoryId,
        num: num,
        address_id: this.select_address.id,
        remark: this.beizhu,
        peisong_type: peisong_type,
      };

      if (!this.peisong_type) {
        alertErr("请选择配送方式");
        return;
      }

      // debugger
      if (this.peisong_type != "门店自取") {
        if (!this.select_address.id) {
          alertErr("请选择收货地址");
          return;
        }
      } else {
        delete params.address_id;
      }

      this.$api("money_jifenOrder", params).then((res) => {
        //console.log("积分下单结果", res);
        let { code, order_id, message } = res;
   
        if (code == 200) {
          this.$router.push({
            path: "/jifen-payment-success",
            query: {
              order_id: order_id,
              mode: "jifen",
            },
          });
        }
      });
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
}

.page {
  text-align: center;
  font-size: 14px;

  .inner {
    width: @width;
    margin: 0 auto;

    padding: 20px 0 80px;
  }

  .main-title {
    .flex-between();
    margin-bottom: 30px;
    text-align: left;

    .left {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ff1312;

      .num {
        margin-left: 10px;
      }
    }
    .right {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 24px;
      color: #333333;

      .el-select {
        width: 250px;
      }
    }
  }

  .goods-list {
    border: 1px solid #cccccc;
    margin-bottom: 40px;
    text-align: left;
    .title {
      padding-left: 20px;
      height: 48px;
      line-height: 48px;
      background: #f9f9f9;
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
        padding: 15px;

        .flex();
        border-bottom: 1px solid #ddd;
        .title-1 {
          flex: 2;
          text-align: left;
          padding-left: 10px;
        }
        .title-2 {
          width: 150px;
        }
        .title-3 {
          width: 150px;
        }
        .title-4 {
          width: 150px;
        }
      }
      .item {
        border-bottom: 1px solid #eee;
        &:last-child {
          border-bottom: none;
        }

        .item-detail {
          padding: 15px;
          text-align: center;
          font-size: 16px;
          color: #333333;

          .flex();

          .item-1 {
            width: 100px;
            img {
              width: 100px;
              height: 100px;
            }
          }
          .item-2 {
            flex: 2;
            padding-left: 20px;
            text-align: left;
          }
          .item-3 {
            width: 150px;
          }
          .item-4 {
            width: 150px;
          }
          .item-5 {
            width: 150px;
            color: #e6170b;
          }
        }
      }
    }

    .huizong {
      padding: 20px;
      padding-top: 0;
      background: #f9f9f9;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      // line-height: 30px;
      color: #333333;

      .item {
        margin-bottom: 10px;
        text-align: right;

        b {
          font-weight: normal;
          font-size: 20px;
          color: #333;
        }
      }
      .total {
        text-align: right;

        b {
          font-weight: bold;
          font-size: 20px;
          color: #f13f17;
        }
      }
    }
  }

  .bottom {
    .flex-between();
    button {
      width: 240px;
      height: 60px;
      border-radius: 30px;
      background: #ffffff;
      border: 1px solid #cccccc;
      font-size: 20px;
      font-weight: bold;
      color: #333333;
      transition: 0.3s;
      &:hover {
        opacity: 0.8;
      }

      &.tijiao {
        color: #ffffff;
        background: linear-gradient(to right, #ff9312 0, #ea5959 100%);
        border-color: #ff3d00;
      }
    }
  }
}

// 地址选择

.dizhi-select {
  margin-bottom: 40px;
  text-align: left;
  min-height: 127px;
  background: #ffffff;
  border: 1px solid #cccccc;

  .dizhi-title {
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

    .add {
      b {
        font-weight: bold;
        color: #4CA5E4;
        cursor: pointer;
      }
    }
  }

  .dizhi-inner {
    padding: 30px 20px;

    .tip {
      font-size: 14px;
      color: #7d7d7d;
      b {
        color: #ff3d00;
        cursor: pointer;
      }
    }
    .list {
      padding-left: 0;

      .item {
        cursor: pointer;
        font-size: 14px;
        color: #7d7d7d;
        margin-bottom: 5px;
        padding: 10px;
        padding-left: 30px;
        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          background-color: #eee;
        }

        &.active {
          background: #ddd;
        }

        .flex();

        .name {
          width: 120px;
          height: 30px;
          background: #ffffff;
          border: 1px solid #cccccc;

          &.active {
            // border: 1px solid #ff3d00;
          }
        }
        .phone {
          margin: 0 15px;
        }
        .address {
        }
        .moren {
          margin-left: 20px;
          min-width: 40px;
          height: 24px;
          line-height: 24px;
          background: #f29f25;
          font-size: 12px;
          color: #ffffff;
        }

        .checked {
          flex: 2;
          color: #4CA5E4;
          text-align: right;
        }
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
          width: 96px;
          height: 30px;
          line-height: 30px;
          background: #ffffff;
          border: 1px solid #cccccc;
          &.active {
            border: 1px solid #4CA5E4;
          }
        }
      }
    }
  }
}

// 订单优惠等
.order-action {
  background: #f9f9f9;
  padding: 20px;
  .order-action-inner {
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }

  .section-item {
    margin-bottom: 20px;
  }
  .section-title {
    margin-bottom: 10px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 30px;
    color: #333333;
  }
  .section-tip {
    margin-bottom: 10px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 30px;
    color: #666666;
  }
  .section-input {
    margin-bottom: 10px;
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
      width: 240px;
    }
    .el-select {
      width: 240px;
    }
    .el-textarea {
      width: 460px;
    }
  }
}
</style>
