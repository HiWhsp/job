<template>
  <div class="page">
    <!-- 新增收货地址 -->
    <addressAdd ref="addressAdd" />

    <div class="inner">
      <div class="section">
        <div class="section-title">选择收货人地址</div>
        <div class="section-ctx">
          <div class="address-list">
            <div
              class="address-item"
              v-for="(item, index) in list_address"
              :key="index"
              :class="{ active: item.id == select_address.id }"
              @click="handleSelectAddress(item)"
            >
              <div class="address-top">{{ item.areaName }}（{{ item.name }}收）</div>
              <div class="address-bottom">
                {{ item.areaName }} {{ item.address }} {{ item.phone }}
              </div>
              <img src="@/static/address/dizhi-check-1.png" alt="" class="marker" />
            </div>
          </div>
          <div class="btn-box">
            <button class="btn-ripple" @click="handleAddressOpen">使用新地址</button>
          </div>
        </div>
      </div>

      <div class="section section-huizong">
        <div class="section-title">订单商品</div>
        <div class="section-ctx">
          <div class="goods-list">
            <!-- <div class="title">订单商品</div> -->
            <div class="list">
              <!-- 标题 -->
              <div class="list-title">
                <div class="title-1">积分商品</div>
                <!-- <div class="title-2">规格</div> -->
                <div class="title-2">积分</div>
                <div class="title-3">数量</div>
                <div class="title-4">小计</div>
              </div>

              <!-- 商品列表 -->
              <div class="item" v-for="(item, index) in payment_products" :key="index">
                <div class="item-detail">
                  <div class="item-1">
                    <img :src="item.image" />
                  </div>
                  <div class="item-2">
                    <div class="goods-title">
                      {{ item.title }}
                    </div>
                    <!-- <div class="goods-guige">
                      {{ item.key_vals }}
                    </div> -->
                  </div>
                  <!-- <div class="item-3">{{ item.key_vals == "无" || !item.key_vals ? "默认" : item.key_vals }}</div> -->
                  <div class="item-3">{{ item.jifen }}</div>
                  <div class="item-4">{{ item.num }}</div>
                  <div class="item-5">{{ +(item.jifen * item.num).toFixed(2) }}</div>
                </div>
              </div>
            </div>

            <div class="order-action" v-if="false">
              <div class="order-action-inner">
                <div class="section-item remark-box">
                  <div class="sub-title">
                    <b> 备注信息 </b>
                  </div>
                  <div class="section-input input-box">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3 }"
                      placeholder="请填写备注"
                      v-model="remark"
                    >
                    </el-input>
                    <!-- <textarea placeholder="请填写订单备注"></textarea> -->
                  </div>
                </div>
              </div>
            </div>

            <div class="huizong">
              <div class="item">
                <!-- <span class="text">共：</span> -->
                <b class="val">共 {{ total_number || 0 }} 件</b>
              </div>
              <div class="total">
                <span class="text">所需积分：</span>
                <b>{{ +payment_money }}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="bottom-btns">
        <button class="btn-ripple back" @click="$router.back()">返回</button>
        <button class="btn-ripple tijiao" @click="confirm_exchange">确认兑换</button>
      </div>
    </div>
  </div>
</template>

<script>
import addressAdd from "@/components/address/addressAdd.vue"; //新增地址

import { mapState } from "vuex";

export default {
  name: "create-order",
  components: {
    addressAdd,
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
          money += +v.jifen * v.num;
        });
      }

      return money.toFixed(2);
    },

    //优惠券优惠面额
    coupon_value() {
      return this.yhq_selected.title ? "- " + this.yhq_selected.jian : "";
    },

    total_number() {
      let number = 0;
      if (this.payment_products.length) {
        this.payment_products.forEach((v) => {
          number += +v.num;
        });
      }
      return number;
    },
  },
  watch: {
    //监视选择的地址
    select_address() {
      // this.orders_getPayInfo(); //根据下单商品获取确认订单信息
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
      //console.log(
      //   "待付款商品 payment_products",
      //   JSON.parse(sessionStorage.getItem("jifen_payment_products"))
      // );

      try {
        if (sessionStorage.getItem("jifen_payment_products")) {
          this.payment_products = JSON.parse(sessionStorage.getItem("jifen_payment_products"));
        }
      } catch (error) {}
    },
    //获取地址列表
    address_getList() {
      this.$api("userAddress_lists").then((res) => {
        let { code, data } = res;
        if (code == 200) {
          data.forEach((v) => {
            v.full_dizhi = v.areaName + " " + v.address;
            // v.selected =  v.if_default
          });

          this.list_address = data;

          let obj = data.find((v) => v.if_default) || {};
          this.select_address = obj || {};

          this.$store.commit("set_vuex_data", {
            key: "default_address",
            val: obj,
          });
        }
      });
    },

    //显示地址添加
    show_address_add() {
      // debugger;
      this.$refs.address_modal.showAdd = true;
    },

    //选择收货地址
    handleSelectAddress(item) {
      this.select_address = item;
    },
    handleAddressOpen() {
      this.$refs.address_modal.showAdd = true;
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
      // let peisong_map = {
      //   快递配送: "3",
      //   同城配送: "5",
      //   门店自取: "4",
      // };
      // peisong_type = peisong_map[this.peisong_type];

      let params = {
        inventoryId: inventoryId,
        num: num,
        address_id: this.select_address.id,
        // remark: this.beizhu,
        // peisong_type: peisong_type,
      };

      // if (!this.peisong_type) {
      //   alertErr("请选择配送方式");
      //   return;
      // }

      // debugger
      // if (this.peisong_type != "门店自取") {

      // } else {
      //   delete params.address_id;
      // }

      if (!this.select_address.id) {
        alertErr("请选择收货地址");
        return;
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
        } else {
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
      // padding-top: 0;
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

.section {
  padding-bottom: 55px;
  text-align: left;
  .section-title {
    padding-bottom: 16px;
    border-bottom: 1px solid #d5d8de;
    font-size: 24px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  }
  .section-ctx {
    padding-top: 32px;
    .address-list {
      display: flex;
      flex-wrap: wrap;
      .address-item {
        position: relative;
        margin-top: 20px;
        margin-right: 40px;
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
          border: 2px solid #4CA5E4;

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

        .address-top {
          padding-bottom: 15px;
          border-bottom: 1px solid #d5d8de;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #000000;
        }
        .address-bottom {
          padding-top: 15px;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #999999;
        }
      }
    }

    .btn-box {
      margin-top: 32px;
      button {
        width: 124px;
        height: 32px;
        background: #ffffff;
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #b9b9b9;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular-, SourceHanSansCN-Regular;
        font-weight: normal;
        color: #666666;
      }
    }
  }
}

// 操作按钮
.bottom-btns {
  display: flex;
  justify-content: flex-end;
  button {
    width: 191px;
    height: 46px;
    // border-radius: 30px;
    background: #ffffff;
    border: 1px solid #cccccc;
    font-size: 16px;
    font-weight: 400;
    color: #4CA5E4;

    transition: 0.3s;
    &:hover {
      opacity: 0.8;
    }

    &.back {
      margin-right: 24px;
      border: 1px solid #4CA5E4;
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #4CA5E4;
    }

    &.tijiao {
      color: #ffffff;
      background: #4CA5E4;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/jifenorder-submit.less"></style>
