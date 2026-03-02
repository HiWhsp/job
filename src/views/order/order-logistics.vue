<template>
  <div class="page">
    <div class="main-title">
      <span>查看物流</span>
      <button @click="toBack">返回</button>
    </div>

    <div class="page-ctx">
      

      <!-- 订单商品信息 -->
      <div class="order-product order-info">
        <div class="order-list-wrap">
          <!-- 商品信息 -->
          <div class="info-item">
            <div class="info-title">
              <div class="date">{{ orderObj.createdTime || "2022-10-21 12:24:30" }}</div>
              <div class="order-code">
                订单号：
                <span>{{ orderObj.orderNo || "154545456456456" }}</span>
              </div>
              <!-- <div class="order-state">{{ orderObj.statusInfo || "已发货" }}</div> -->
            </div>
            <div class="info-good">
              <div class="list-good">
                <div
                  class="item"
                  v-for="(product_item, index) in (orderObj.products || [])"
                  :key="index"
                >
                  <div class="item-good flex">
                    <div class="box-image cover">
                      <img :src="product_item.image" alt />
                    </div>
                    <div class="box-title">
                      <div class="title">
                        {{ product_item.title }}
                      </div>
                      <div class="sku">{{ product_item.keyVals || product_item.key_vals }}</div>
                    </div>
                    <div class="box-unit-price">
                      {{ vuex_huobi }} {{ product_item.priceSale }}
                    </div>
                    <div class="box-num">x {{ product_item.num }}</div>
                    <div class="box-price">
                      {{ vuex_huobi }}
                      {{ product_item.priceSale * product_item.num }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
 

      <!-- 物流时间线 -->
      <div class="logistics-timeline">
        <div
          class="timeline-item"
          v-for="(item, index) in logisticsTimeline"
          :key="index"
        >
          <!-- 左侧：日期时间 -->
          <div class="timeline-left">
            <div class="timeline-date">{{ item.date }}</div>
            <div class="timeline-time">{{ item.time }}</div>
          </div>
          
          <!-- 中部：状态图标 -->
          <div class="timeline-center">
            <div class="timeline-icon" :class="{ 'dot-icon': item.isDot }">
              <img v-if="!item.isDot" :src="item.icon" alt="" />
            </div>
          </div>
          
          <!-- 右侧：描述信息 -->
          <div class="timeline-right">
            <div class="timeline-desc">{{ item.description }}</div>
            <div class="timeline-location" v-if="item.location">{{ item.location }}</div>
          </div>
        </div>
      </div>

      <div class="section-item section-goods wuliu-info" v-if="false">
        <div class="section-title">
          <div class="date">2022-10-21 12:24 : 30</div>
          <div class="code">订单号：154545456</div>
        </div>

        <div class="info-good">
          <div class="list-good">
            <div
              class="item"
              v-for="(item, index) in order.products"
              :key="index"
            >
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
                    {{ vuex_huobi }} {{ item.num }}
                  </template>
                  <template v-else>
                    {{ vuex_huobi }} {{ item.priceSale }}
                  </template>
                </div>
              </div>
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
      
      // 订单详情相关数据
      payInfo: {}, //支付信息
      total_product_number: 0, //商品总数量
      order_zhekou_bili: 10, //打几折
      order_zhekou_price: 0, //折扣价格

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

      // 物流时间线数据
      logisticsTimeline: [
      ],
    };
  },
  computed: {
    ...mapState([""]),

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
      console.log(arr);
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
    },

    // 生成物流时间线数据
    generateLogisticsTimeline(traces) {
      const timeline = [];

      // 使用传入的traces数据
      if (traces && traces.length > 0) {
        traces.forEach((item, index) => {
          let icon = null;
          let isDot = true; // 默认显示圆点

          // 根据物流状态选择图标
          if (
            item.AcceptStation.includes("下单") ||
            item.AcceptStation.includes("已下单")
          ) {
            icon = require("@img/order/log1.png");
            isDot = false;
          } else if (
            item.AcceptStation.includes("发货") ||
            item.AcceptStation.includes("已发货")
          ) {
            icon = require("@img/order/log2.png");
            isDot = false;
          } else if (
            item.AcceptStation.includes("揽收") ||
            item.AcceptStation.includes("已揽收")
          ) {
            icon = require("@img/order/log3.png");
            isDot = false;
          } else if (
            item.AcceptStation.includes("签收") ||
            item.AcceptStation.includes("已签收") ||
            item.AcceptStation.includes("收货")
          ) {
            icon = require("@img/order/log2.png");
            isDot = false;
          }

          // 格式化时间显示 - 分离日期和时间
          let dateStr = "08-18";
          let timeStr = "16:34";
          if (item.AcceptTime) {
            const date = new Date(item.AcceptTime);
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            dateStr = `${month}-${day}`;
            timeStr = `${hours}:${minutes}`;
          }

          timeline.push({
            icon: icon,
            isDot: isDot,
            date: dateStr,
            time: timeStr,
            description: item.AcceptStation,
            location: item.Location || "",
          });
        });
      } else {
        // 使用默认数据
        timeline.push(...this.logisticsTimeline);
      }

      this.logisticsTimeline = timeline;
    },

    // 返回按钮
    toBack() {
      this.$router.go(-1);
    },
    //获取物流详情
    get_wuliu_detail() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "express_getInfo",
          fahuo_id: this.fahuo_id,
        },
      }).then((res) => { 
        let { code, data, msg } =  res
        let traces = [
         
          {
            AcceptStation: "已发货",
            AcceptTime: this.order.fahuoInfo.fahuoTime,
            Location: "包裹正在等待揽收",
          },
           {
            Action: "0",
            AcceptStation: "已下单",
            AcceptTime: this.order.createdTime,
            Location: "商品已经下单",
          },
        ];
        if (code == 1) {
          this.detail_logistics = data;
          traces = [
             ...data.Traces.sort(
              (a, b) => new Date(b.AcceptTime) - new Date(a.AcceptTime)
            ),
            ...traces,
           
          ];
          this.wuliu_traces_list = traces || [];
          if (data.State == 0) {
            alertErr(data.Reason);
          } else {
            // 直接使用 res.data.Traces 生成物流时间线
          }
        }
        this.generateLogisticsTimeline(traces || []);
      });
    },
    //获取订单详情
    orders_detail() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_detail",
          id: this.order_id,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          // data.actions = this.getOrderActionsByStatus({
          //   ...data,
          // });

          // 计算商品总数量
          this.total_product_number = 0;
          if (data.products) {
            data.products.forEach((v) => {
              this.total_product_number += parseInt(v.num || 0);
            });
          }

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

          //支付信息
          this.payInfo = data.payInfo || {};
          
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
          this.get_wuliu_detail(); //物流详情
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
    display: flex;
    align-items: center;
    justify-content: space-between;
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
      background: #00306B;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 0;
    background: #fff;
  }

  // 订单头部信息
  .order-header {
    padding: 20px 24px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;

    .order-time {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }

    .order-number {
      font-size: 14px;
      color: #666;
    }
  }

  // 商品信息
  .product-info {
    padding: 20px 24px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;

    .product-item {
      display: flex;
      align-items: flex-start;

      .product-image {
        width: 80px;
        height: 80px;
        margin-right: 16px;
        border-radius: 4px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .product-details {
        flex: 1;

        .product-name {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .product-spec {
          font-size: 12px;
          color: #999;
          margin-bottom: 12px;
        }

        .product-price {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #333;

          .unit-price {
            margin-right: 16px;
          }

          .quantity {
            margin-right: 16px;
          }

          .total-price {
            font-weight: 500;
            color: #00306B;
          }
        }
      }
    }
  }

  // 物流时间线
  .logistics-timeline {
    padding: 20px 24px;
    background: #fff;

    .timeline-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      position: relative;

      &:not(:last-child)::after {
        content: "";
        position: absolute;
        left: 116px;
        top: 24px;
        transform: translateX(-50%);
        width: 1px;
        height: calc(100% + 4px);
        background: #707070;
        z-index: 0;
      }

      // 左侧：日期时间
      .timeline-left {
        width: 80px;
        text-align: center;
        margin-right: 16px;
        flex-shrink: 0;

        .timeline-date {
          font-size: 12px;
          color: #333;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .timeline-time {
          font-size: 11px;
          color: #999;
        }
      }

      // 中部：状态图标
      .timeline-center {
        width: 40px;
        display: flex;
        justify-content: center;
        margin-right: 16px;
        flex-shrink: 0;
        position: relative;
        z-index: 2;

        .timeline-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          // 实心圆点样式
          &.dot-icon {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #e5e5e5;
          }
        }
      }

      // 右侧：描述信息
      .timeline-right {
        flex: 1;
        padding-top: 2px;

        .timeline-desc {
          font-size: 14px;
          color: #333;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .timeline-location {
          font-size: 12px;
          color: #999;
          line-height: 1.3;
        }
      }
    }
  }

  // 订单商品信息样式
  .order-product {
    padding: 30px 80px;
    background: #fff;
    // border: 1px solid #e5e5e5;

    .order-list-wrap {
      .info-item {
        border: 1px solid #e5e5e5;
        margin-bottom: 0;
      }

      .info-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 48px;
        padding: 0 24px;
        background: #f5f5f5;
        border-bottom: 1px solid #e5e5e5;

        font-size: 14px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #1F1F1F;

        .date {
        }

        .order-code {
          flex: 2;
          text-align: left;
          padding-left: 20px;

          span {
          }
        }

        .order-state {
          color: #00306B;
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
            display: flex;
            align-items: center;

            &:last-child {
              border: none;
            }

            .box-image {
              width: 100px;
              height: 100px;
              border: 1px solid #f5f5f5;
              margin-right: 20px;

              img {
                width: 100px;
                height: 100px;
                object-fit: cover;
              }
            }

            .box-title {
              flex: 1;
              text-align: left;
              padding-left: 20px;

              .title {
                font-size: 14px;
                color: #333;
                margin-bottom: 8px;
              }
              .sku {
                color: #777;
                font-size: 12px;
              }
            }

            .box-unit-price {
              text-align: center;
              min-width: 120px;
              font-size: 14px;
              color: #1F1F1F;
            }

            .box-num {
              text-align: center;
              min-width: 80px;
              font-size: 14px;
              color: #1F1F1F;
            }

            .box-price {
              text-align: center;
              min-width: 120px;
              font-size: 14px;
              color: #1F1F1F;
            }
          }
        }
      }

      .info-heji {
        background: #fafafa;
        padding: 24px 40px;
        border-top: 1px solid #f5f5f5;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #666;

        .money-box {
          text-align: right;

          .count {
            font-weight: bold;
            color: #00306B;
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
              color: #1F1F1F;
            }

            .value {
              min-width: 100px;
              font-family: Arial, Arial;
              font-weight: 400;
              font-size: 14px;
              color: #1F1F1F;
            }

            .money-num {
              &.money-total {
                font-family: Arial, Arial;
                font-weight: bold;
                font-size: 20px;
                color: #00306B;
              }
            }
          }
        }
      }
    }
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
    display: flex;
    align-items: center;
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
    display: flex;
    align-items: center;
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
        display: flex;
        align-items: center;

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
          color: #505050;
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
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 10px;
        .btn-goods-action {
          padding-left: 10px;
          padding-right: 10px;
          margin-left: 10px;
          min-width: 96px;
          height: 30px;
          background: #00306B;
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
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    //   display: flex;
    align-items: center;
    justify-content: space-between;
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
        color: #505050;
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
