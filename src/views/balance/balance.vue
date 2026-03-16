<template>
  <div class="page">
    <div class="banner-wrap">
      <img :src="banners[0].image" alt="" />
    </div>

    <div class="inner w-1400">
      <div class="page-ctx">
        <div class="chongzhi-wrap">
          <div class="chongzhi-box">
            <div class="chongzhi-title">选择充值金额</div>
            <div class="chongzhi-items">
              <div
                class="item"
                v-for="(item, index) in recharge_list"
                :key="index"
                :class="{ selected: recharge_select.id == item.id }"
                @click="toggle_recharge(item)"
              >
                <div class="item-info">
                  <div class="text">充</div>
                  <div class="value">{{ item.man }}</div>
                  <div class="text">送</div>
                  <div class="song">{{ item.zeng }}</div>
                </div>
              </div>
            </div>
            <div class="pay-title">支付信息</div>
            <div class="pay-type flex">
              <div class="label">支付方式：</div>
              <div class="values">
                <div class="pay-items">
                  <div
                    class="item"
                    v-for="(item, index) in type_list"
                    :key="index"
                    :class="{ selected: type_select.value == item.value }"
                    @click="toggle_type(item)"
                  >
                    <div class="check-box">
                      <img
                        class="check-0"
                        src="@img/common/radio0.png"
                        alt=""
                      />
                      <img
                        class="check-1"
                        src="@img/common/radio1.png"
                        alt=""
                      />
                    </div>
                    <div class="icon-box">
                      <img :src="item.icon" alt="" />
                    </div>
                    <div class="title">{{ item.title }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-box flex-center">
              <div
                class="btn btn-ripple fit-text"
                @click="throttle_do_submit()"
              >
                立即支付
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- 微信支付弹窗 -->
    <orderPayWxCode ref="orderPayWxCode" :payment_money="recharge_select.man" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import orderPayWxCode from "@/components/order/orderPayWxCode.vue";

export default {
  name: "category",
  components: {
    orderPayWxCode,
  },
  data() {
    return {
      recharge_list: [],
      recharge_select: {},
      recharge_money: "",

      type_list: [
        {
          value: "weixin",
          title: "微信支付",
          icon: require("@img/pay-method/type-weixin.png"),
        },
        // {
        //   value: "zhifubao",
        //   title: "支付宝支付",
        //   icon: require("@img/pay-method/type-zfb.png"),
        // },
      ],
      type_select: { value: "weixin", title: "微信支付" },
    };
  },
  computed: {
    ...mapState(["vuex_map_banners"]),
    banners() {
      return this.vuex_map_banners["充值中心"] || [];
    },
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.setView();
  },
  methods: {
    setView() {
      this.query_recharge_money();
    },

    query_recharge_money() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "money_investActivity",
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = res.data.ruleInfo;
          list.forEach((v, index) => {
            v.id = index + 1;
          });
          // list.push({
          //   id: -1,
          //   man: "自定义",
          //   zeng: "",
          //   is_custom: true,
          //   jifen: "",
          //   yhq: "",
          // });
          this.recharge_list = list || [];
        }
      });
    },

    toggle_recharge(item) {
      this.recharge_select = item;
    },
    toggle_type(item) {
      this.type_select = item;
    },

    do_submit() {
      if (!this.vuex_is_login) {
        alertErr("Please log in first");
        this.$router.push("/login");
        return
      } 
      if (!this.recharge_select.id) {
        alert("请选择充值金额");
        return;
      }
      let money = this.recharge_select.man;
      money = parseFloat(money);
         this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "pay_wxScanCodePay", //pay_wxScanCodePay
          userId: localStorage.getItem("userId"),
          token: localStorage.getItem("token"),
          orderType: 2,
          price: money,
          // orderId: this.order_id,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          let { data } = res.data;
          let info = {
            // ...res,
            qrcode: data.qrcode,
            order_id: this.order_id,
          };
          this.$refs.orderPayWxCode.init(info);
          this.$refs.orderPayWxCode.qrcode = data.qrcode;
          this.$refs.orderPayWxCode.showModal = true;
          // this.showWaiting();
        } else {
        }
      });
      // this.$api({
      //   url: "/service.php",
      //   method: "get",
      //   data: {
      //     action: "pay_weixin",
      //     orderType: 2, //订单类型：1-商品订单 2-余额充值
      //     price: money,
      //   },
      // }).then((res) => {
      //   if (res.code == 200) {
      //     // alertSucc('充值成功！')
      //     this.use_weixin_pay(res.data);
      //   } else {
      //     alertErr(res.message||res.msg);
      //   }
      // });
    },
    use_weixin_pay() {},
  },
};
</script>

<style scoped lang="less">
.page {
  background: #ffffff;
  background: #f4f4f4;
  text-align: left;

  .banner-wrap {
    img {
      width: 100%;
    }
  }
  .inner {
    .page-ctx {
      padding-top: 20px;
      padding-bottom: 50px;
    }
  }
}

.chongzhi-wrap {
  position: relative;
  z-index: 2;
  margin-top: -100px;
  width: 1400px;
  background: #ffffff;
  padding: 36px 70px 98px;
  .chongzhi-box {
    .chongzhi-title {
      text-align: center;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 24px;
      color: #333333;
    }
    .chongzhi-items {
      margin-top: 47px;
      margin-bottom: 60px;
      display: flex;
      flex-wrap: wrap;

      .item {
        margin-right: 74px;
        margin-bottom: 20px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 260px;
        height: 165px;
        background: #fcfcfc;
        border-radius: 8px 8px 8px 8px;
        border: 1px solid #d6d6d6;
        &:nth-child(4n) {
          margin-right: 0;
        }

        &.selected {
          background: rgba(0, 159, 57, 0.04);
          border: 1px solid #009f39;
        }

        .item-info {
          display: flex;
          align-items: flex-end;
          line-height: 1;

          .text {
            font-family: Poppins, Poppins;
            font-weight: 400;
            font-size: 16px;
            color: #333333;
          }
          .value {
            margin: 0 3px;
            font-family: Poppins, Poppins;
            font-weight: bold;
            font-size: 40px;
            color: #e84427;
          }
          .song {
            font-family: Poppins, Poppins;
            font-weight: 400;
            font-size: 16px;
            color: #333333;
          }
        }
      }
    }
    .pay-title {
      border-bottom: 1px solid #d5d8de;
      padding-bottom: 16px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 24px;
      color: #333333;
    }
    .pay-type {
      margin-top: 32px;
      .label {
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 16px;
        color: #1F1F1F;
      }
      .values {
        margin-left: 16px;
        .pay-items {
          display: flex;
          .item {
            cursor: pointer;
            margin-right: 80px;
            display: flex;
            align-items: center;

            &.selected {
              .check-0 {
                display: none;
              }
              .check-1 {
                display: inline-block !important;
              }
            }

            .check-box {
              margin-right: 10px;
              img {
                width: 21px;
                height: 21px;
              }
              .check-1 {
                display: none;
              }
            }
            .icon-box {
              margin-right: 10px;
              img {
                width: 39px;
                height: 39px;
              }
            }
            .title {
              font-family: Poppins, Poppins;
              font-weight: 400;
              font-size: 16px;
              color: #000000;
            }
          }
        }
      }
    }
    .btn-box {
      margin-top: 46px;
      .btn {
        width: 191px;
        height: 46px;
        background: #009f39;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 18px;
        color: #ffffff;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/shipei.less"></style>