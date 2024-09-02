<template>
  <div class="page">
    <div class="main-title">
      <span>查看物流</span>
      <button @click="toBack">返回</button>
    </div>

    <div class="page-ctx">
      <div class="section-danhao">
        <div class="section-title">
          <div class="date">运单号码：{{ fahuo_info.order_id }}</div>
          <div class="code">物流公司： {{ fahuo_info.company }}</div>
        </div>
        <div class="section-wuliu">
          <!-- 商品实际物流信息 -->
          <div class="real-wuliu">
            <div class="real-wuliu-inner">
              <div
                class="wuliu-item"
                v-for="(item, index) in wuliu_traces_list"
                :key="index"
              >
                <div class="wuliu-title">
                  {{ item.AcceptStation }}
                </div>
                <div class="wuliu-time">
                  {{ item.AcceptTime }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="order-other">
          <div class="title">订单信息</div>
          <div class="other">
            <!--     3: "快递配送",
        4: "门店自取",
        5: "同城配送", -->

            <div class="item">
              <div class="item-title">收货人信息</div>
              <div class="item-content">
                <div class="name">
                  <span>收货人：</span>
                  {{ shouhuo_info.name }}
                </div>
                <div class="phone">
                  <span>手机号码：</span>
                  {{ shouhuo_info.phone }}
                </div>
                <div class="address">
                  <span>详细地址：</span>
                  {{ shouhuo_info.address }}
                </div>
                <!-- <div class="address">
              <span>邮编：</span>
              {{ shouhuo_info.postCode }}
            </div> -->
              </div>
            </div>

            <div class="item">
              <div class="item-title">支付及配送方式</div>
              <div class="item-content">
                <div class="date" v-if="orderObj.status >= 1">
                  <span>支付方式：</span>
                  <span class="val" v-if="is_xianxia"> 线下转款 </span>
                  <span class="val" v-else> {{ pay_type || "-" }} </span>
                </div>

                <div class="date">
                  <span>下单时间：</span>
                  {{ orderObj.dtTime }}
                </div>

                <div class="pay-type">
                  <span>配送方式：</span>
                  {{ "普通快递" }}
                </div>

                <!-- <div class="date" v-if="orderObj.peisong_time">
              <span>配送时间:</span>
              {{ orderObj.peisong_time }}
            </div> -->
              </div>
            </div>

            <!-- 转款凭证 -->
            <div class="item" v-if="is_xianxia">
              <div class="item-title">转账凭证</div>
              <div class="item-content">
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

            <!-- 物流信息 -->
            <div class="item" v-if="fahuo_info.company">
              <div class="item-title">发货信息</div>
              <div class="item-content">
                <div class="wuliu-name">
                  <span>快递公司：</span>
                  {{ fahuo_info.company }}
                </div>
                <div class="wuliu-code">
                  <span>物流单号：</span>
                  {{ fahuo_info.order_id }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单商品信息 -->
      <div class="order-product">
        <orderInfo :order="orderObj" />
      </div>

      <div class="section-item section-goods wuliu-info" v-if="false">
        <div class="section-title">
          <div class="date">2022-10-21 12:24 : 30</div>
          <div class="code">订单号：154545456</div>
        </div>

        <div class="info-good">
          <div class="list-good">
            <div class="item" v-for="(item, index) in order.products" :key="index">
              <div class="item-good">
                <div class="img-box cover">
                  <img :src="item.image" alt />
                </div>
                <div class="title">
                  <div class="text">{{ item.title }}</div>
                  <div class="guige">{{ item.key_vals }}</div>
                </div>
                <div class="num">
                  x {{ item.id == 9 || item.id == 10 ? 1 : item.num }}
                </div>
                <div class="price">
                  <template v-if="item.id == 9 || item.id == 10">
                    {{vuex_huobi}} {{ item.num }}
                  </template>
                  <template v-else> {{vuex_huobi}} {{ item.priceSale }} </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单流程 -->
        <div class="order-liucheng-box" v-if="false">
          <div class="state-box">
            <div class="state-item" v-for="(item, index) in list_step" :key="index">
              <div class="img-box">
                <img :src="item.is_active ? item.icon2 : item.icon" alt="" />
              </div>
              <div class="line-box" v-if="index != list_step.length - 1">
                <img v-if="item.is_active" src="@img/order/line-active.png" alt="" />
                <img v-else src="@img/order/line.png" alt="" />
              </div>
            </div>
          </div>
          <div class="text-box">
            <div class="text-item" v-for="(item, index) in list_step" :key="index">
              <div class="text">{{ item.title }}</div>
              <!-- <div class="hidden" v-if="index != 7"></div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderInfo from "@/components/order/orderInfo.vue"; //
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    orderInfo,
  },
  data() {
    return {
      order_id: this.$route.query.order_id || "", //订单id
      fahuo_id: this.$route.query.logistics_id || "", //物流id
      orderObj: {}, //订单信息
      order: {}, //订单信息

      wuliu_traces_list: [
        {
          AcceptStation: "发货状态3",
          AcceptTime: "2022-12-13  14:00",
        },
        {
          AcceptStation: "发货状态2",
          AcceptTime: "2022-12-12  15:00",
        },
        {
          AcceptStation: "发货状态1",
          AcceptTime: "2022-12-10  14:00",
        },
      ], //物流跟踪列表
      detail_logistics: {}, //物流结果详情

      shouhuo_info: {}, //收货人信息
      pay_info: {}, //支付信息
      fahuo_info: {}, //发货信息
      peisong_info: {}, //门店配送信息
      peisong_type_text: "",

      is_payed: false, //是否已支付
      is_fahuo: false, //是否已发货
      is_mendian_peisong: false, //是否门店配送

      xianxia_imgs: [], //线下凭证信息
      is_xianxia: false, //是否线下转款
      pay_type: "", //支付方式
    };
  },
  computed: {
    ...mapState(["defaultAvatar"]),

    //订单流程
    list_step() {
      let logistics_state = this.detail_logistics.State || "";
      let arr = [
        {
          title: "待揽件",
          icon: require("@img/order/step1.png"),
          icon2: require("@img/order/step1-active.png"),
        }, //
        {
          title: "运输",
          icon: require("@img/order/step2.png"),
          icon2: require("@img/order/step2-active.png"),
        }, //卖家
        {
          title: "配送",
          icon: require("@img/order/step3.png"),
          icon2: require("@img/order/step3-active.png"),
        }, //
        {
          title: "签收",
          icon: require("@img/order/step4.png"),
          icon2: require("@img/order/step4-active.png"),
        }, //
      ];

      // 物流状态：2-在途中,3-签收,4-问题件
      if (logistics_state < 2) {
        arr[0].is_active = true;
      } else if (logistics_state == 2) {
        arr[0].is_active = true;
        arr[1].is_active = true;
      } else if (logistics_state == 3) {
        arr[0].is_active = true;
        arr[1].is_active = true;
        arr[2].is_active = true;
      } else if (logistics_state >= 3) {
        arr[0].is_active = true;
        arr[1].is_active = true;
        arr[2].is_active = true;
        arr[3].is_active = true;
      }

      arr.forEach((item, index) => {
        if (index == 0) {
          item.is_active = true;
        }
      });

      return arr;
    },

    //物流状态
    logistics_state() {
      // 物流状态：2-在途中,3-签收,4-问题件
    },
  },
  watch: {
    orderObj(data) {
      let { shouhuo_info, status, pay_info, fahuo_info, peisong_type } = data;

      this.shouhuo_info = shouhuo_info;
      this.pay_info = pay_info;

      //订单状态码(-5待支付 -3售后处理中 -1无效 0待成团 2待发货 3待收货 4已收货)
      if (status != -5 && status != -1 && status != 0) {
        this.is_payed = true;
      }

      //配送方式
      let peisong_map = {
        3: "快递配送",
        4: "门店自取",
        5: "同城配送",
      };
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
    this.setView();
  },
  methods: {
    setView() {
      this.orders_detail(); //获取订单详情
      this.get_wuliu_detail(); //物流详情
    },
    //获取物流详情
    get_wuliu_detail() {
      // this.$api("express_getInfo", {
      //   fahuo_id: this.fahuo_id,
      // }).then((res) => {
      //   let { code, data, msg} = res;
      //   if (code == 200) {
      //     this.detail_logistics = data;
      //     this.wuliu_traces_list = data.Traces || [];
      //     if (data.State == 0) {
      //       alertErr(data.Reason);
      //     }
      //   }
      // });
    },
    //获取订单详情
    orders_detail() {
      this.$api("orders_detail", {
        id: this.order_id,
      }).then((res) => {
        let { code, data, msg} = res;
        if (code == 200) {
          data.actions = this.getOrderActionsByStatus({
            ...data,
          });

          data.products.forEach((v) => {
            v.allow_actions = this.mix_getOrderProductsAllowActions(data, v);
          });

          //积分商品
          if (data.if_jifen) {
            this.is_jifen_goods = true;
          }
          //订单状态
          if (data.pay_type == 6) {
            if (data.status == -5) {
              data.statusInfo = "待审核";
            }
          }

          //支付方式
          if (data.pay_info) {
            let pay_list = [];
            let pay_type = "";
            if (data.pay_info.yue) {
              pay_list.push({
                title: "余额",
                money: data.pay_info.yue,
              });
            }
            if (data.pay_info.yhq) {
              pay_list.push({
                title: "优惠券",
                money: data.pay_info.yhq,
              });
            }
            if (data.pay_info.weixin) {
              pay_list.push({
                title: "微信",
                money: data.pay_info.weixin,
              });
            }
            if (data.pay_info.alipay) {
              pay_list.push({
                title: "支付宝",
                money: data.pay_info.alipay,
              });
            }

            if (pay_list.length) {
              this.pay_type = pay_list.map((v) => v.title).join();
            }
          }

          //凭证图片
          if (data.paypz && data.paypz.paypz) {
            this.is_xianxia = true;
            this.xianxia_imgs = data.paypz.paypz.split(",");
          }

          this.orderObj = data;
          this.order = data;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  padding-bottom: 80px;
  .main-title {
    .flex-between();
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
      background: #4CA5E4;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 24px 32px;
    background: #fff;
  }
}

.order-liucheng-box {
  border-top: 1px solid #eee;
  padding: 30px 70px 0;
  .state-box {
    display: flex;
    justify-content: space-between;

    .state-item {
      display: flex;
      align-items: center;
      .img-box {
        img {
          width: 70px;
          height: 70px;
        }
      }
      .line-box {
        margin-left: 6px;
        img {
          width: 174px;
        }
      }
    }
  }

  .text-box {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    margin-left: -93px;
    margin-right: -93px;

    .text-item {
      flex: 1;
      width: 115px;
      text-align: center;
      color: #999;
      .text {
      }
      // .hidden {
      //   width: 53px;
      // }
    }
  }
}

.section-danhao {
  .section-title {
    .flex();
    padding-left: 24px;
    text-align: left;
    height: 44px;
    line-height: 44px;
    background: #f5f5f5;
    border: 1px solid #e5e5e5;

    font-size: 14px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    .code {
      margin-left: 30px;
    }
  }
}

.section-goods {
  .section-title {
    .flex();
    padding-left: 24px;
    text-align: left;
    height: 44px;
    line-height: 44px;
    background: #f5f5f5;
    border: 1px solid #e5e5e5;

    font-size: 14px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    .code {
      margin-left: 30px;
    }
  }
}

// 物流
.real-wuliu {
  // width: 902px;
  min-height: 228px;
  background: #f9f9f9;
  margin: 20px auto;
  padding: 20px;
  text-align: left;

  .real-wuliu-inner {
    border-left: 1px solid #ddd;
    padding-left: 20px;
    position: relative;
  }

  .wuliu-item {
    margin-bottom: 10px;
    font-size: 14px;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      transform: translate(-50%, 8px);
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #ccc;
    }

    .wuliu-title {
      color: #333;
      margin-bottom: 5px;
    }
    .wuliu-time {
      color: #999;
    }

    &:last-child {
      .wuliu-title {
        color: coral;
        font-weight: bold;
      }
      .wuliu-time {
        color: coral;
      }
    }
  }
}

.wuliu-info {
  margin-bottom: 20px;
  min-height: 186px;
  background: #ffffff;
  border: 1px solid #cccccc;
  .info-good {
    .list-good {
      .item {
        border-bottom: 1px solid #ddd;
        &:last-child {
          border-bottom: none;
        }
      }
      .item-good {
        padding: 20px;
        border-bottom: 1px dashed #ccc;
        .flex();

        &:last-child {
          border: none;
        }

        .img-box {
          width: 100px;
          img {
            width: 100px;
            height: 100px;
          }
        }
        .title {
          text-align: left;
          padding-left: 20px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 20px;
          color: #333333;

          flex: 2;

          .guige {
            margin-top: 20px;
          }
        }
        .num {
          width: 100px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 20px;
          color: #999999;
        }
        .price {
          text-align: right;
          width: 150px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 20px;
          color: #333333;
        }
      }

      .goods-action {
        .flex();
        justify-content: flex-end;
        padding: 10px;
        .btn-goods-action {
          padding-left: 10px;
          padding-right: 10px;
          margin-left: 10px;
          min-width: 96px;
          height: 30px;
          background: #4CA5E4;
          font-size: 14px;
          font-family: Microsoft YaHei;
          color: #ffffff;
          border-radius: 14px;
          transition: 0.3s;

          &:hover {
            opacity: 0.8;
          }
          &.disabled {
            background: #ccc;
          }
        }
      }
    }
  }
}

.section-item {
  min-height: 186px;
  background: #ffffff;
  border: 1px solid #e5e5e5;

  .section-title {
    text-align: left;
    padding-left: 20px;
    height: 44px;
    line-height: 44px;
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;

    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;

    color: #333333;
  }

  .section-other {
    .flex-between();
    padding: 20px 25px;

    .item {
      text-align: left;
      flex: 1;
      .item-title {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 20px;
        color: #333333;
        margin-bottom: 20px;
      }
      .item-content {
        min-height: 80px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #333333;

        > div {
          margin-bottom: 5px;
          span {
            display: inline-block;
            // min-width: 80px;
          }
        }
      }
    }
  }
}

.order-other {
  margin-bottom: 24px;
  min-height: 156px;
  background: #ffffff;
  border: 1px solid #e5e5e5;

  .title {
    text-align: left;
    padding-left: 24px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    border-bottom: 1px solid #e5e5e5;

    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;

    color: #333333;
  }

  .other {
    // .flex-between();
    display: flex;
    padding: 20px 25px;

    .item {
      margin-bottom: 10px;
      text-align: left;
      flex: 1;
      .item-title {
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #999999;
        margin-bottom: 10px;
      }
      .item-content {
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
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/orderLogistics.less"></style>
