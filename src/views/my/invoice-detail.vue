<template>
    <div class="page">
        <div class="main-title">
            <span>发票详情</span>
            <button @click="$router.push('/order-list')">返回</button>
        </div>

        <div class="page-ctx">

            <!-- 订单商品信息 -->
            <div class="order-product order-info">
                <div class="order-list-wrap">
                    <!-- 商品信息 -->
                    <div class="info-item">
                        <div class="info-title">
                            <div class="date">商品信息</div>
                        </div>
                        <div class="info-good">
                            <div class="list-good">
                                <div class="item">
                                    <div class="item-good flex">
                                        <div class="box-image cover">
                                            <el-image :src="info.image">
                                                <div slot="error" class="image-slot">
                                                    <img :src="info.image"/>
                                                </div>
                                            </el-image>
                                        </div>
                                        <div class="box-title">
                                            <div class="title">
                                                {{ info.title }}
                                            </div>
                                            <div class="box-sku">
                                                <div class="goods-sku">型号：{{ info.keyVals }}</div>
                                            </div>
                                        </div>

                                        <div class="box-num">1</div>
                                        <div class="box-price">{{ vuex_huobi }} {{ info.money }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="info-cont">
                            <div class="content">
                                <div class="it">
                                    <span>商品总价：</span>
                                </div>
                                <div class="it">
                                    <span>配送费：</span>
                                </div>
                                <div class="it">
                                    <span>优惠券：</span>
                                </div>
                                <div class="it">
                                    <span>合计应付：</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="order-other">
                <div class="title">开票信息</div>
                <div class="other">
                    <div class="item">
                        <div class="item-content">
                            <div class="it">
                                <span>发票类型：</span>
                                {{ info.invoicType == 1 ? '普通发票' : '专用发票' }}
                            </div>
                            <div class="it" v-if="info.titleType == 2 || info.invoicType == 2">
                                <span>发票抬头：</span>
                                {{ info.titleType == 1 ? '个人' : '单位' }}
                            </div>
                            <div class="it" v-if="info.titleType == 1">
                                <span>开票人：</span>
                                {{ info.invoicAdmin }}
                            </div>
                            <div class="it" v-if="info.titleType == 2">
                                <span>单位名称：</span>
                                {{ info.title }}
                            </div>
                            <div class="it" v-if="info.titleType == 2 || info.invoicType == 2">
                                <span>纳税人识别码：</span>
                                {{ info.shibiema }}
                            </div>
                            <div class="it" v-if="info.invoicType == 2">
                                <span>注册地址：</span>
                                {{ info.companyAddress }}
                            </div>
                            <div class="it" v-if="info.invoicType == 2">
                                <span>注册电话：</span>
                                {{ info.companyPhone }}
                            </div>
                            <div class="it" v-if="info.invoicType == 2">
                                <span>开户银行：</span>
                                {{ info.bankName }}
                            </div>
                            <div class="it" v-if="info.invoicType == 2">
                                <span>银行账户：</span>
                                {{ info.bankNo }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 订单操作 -->
            <div class="order-action-box">
                <div class="btn-box">
                    <button class="btn-ripple fit-text btn-bg" @click="doPay(info)">
                        下载发票
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "order-detail",
    data() {
        return {
            id: this.$route.query.id,
            order_id: this.$route.query.id,
            info: {},
            total_product_number: 0,
            products: [],
            full_receive_address: '',
            //
            is_finish_pay: false,//
            //
            is_jifen_goods: false,
            //


            orderObj: {}, //订单信息
            detail: {}, //订单信息

            pay_info: {}, //支付信息
            fahuo_info: {}, //发货信息
            peisong_info: {}, //门店配送信息
            peisong_type_text: "",
            peisong_type: "",

            is_payed: false, //是否已支付
            is_fahuo: false, //是否已发货
            is_mendian_peisong: false, //是否门店配送

            shequ: {},

            xianxia_imgs: [], //线下凭证信息
            is_xianxia: false, //是否线下转款
            pay_type: "", //支付方式
        };
    },
    computed: {
        ...mapState(["defaultAvatar"]),
    },
    watch: {
        orderObj(data) {
            let {shouhuoInfo, status, pay_info, fahuo_info, peisong_type, shequ} = data;

            this.peisong_type = peisong_type;
            this.shequ = shequ;
            this.shouhuoInfo = shouhuoInfo;
            this.pay_info = pay_info;

            //订单状态码(-5待支付 -3售后处理中 -1无效 0待成团 2待发货 3待收货 4已收货)
            if (status != -5 && status != -1 && status != 0) {
                this.is_payed = true;
            }

            //配送方式
            let peisong_map = {
                1: "上门自提",
                2: "社区配送",
                3: "普通快递",
                4: "",
                5: "",
            };

            //社区购配送方式(1自提 2社区配送 3快递)

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
        emitConfirm() {
            this.setView();
        },
        setView() {
            this.query_order()
        },

        query_order() {
            this.$api({
                url: '/service.php',
                method: 'post',
                data: {
                    action: 'invoices_detail',
                    id: this.id
                },
            }).then((res) => {
                let {code, data, msg} = res;
                this.info = {
                    "id": 4,
                    "userId": 1,
                    "orderId": 1,
                    "info": "",
                    "money": "0.00",
                    "status": 2,
                    "invoicType": 1,
                    "titleType": 2,
                    "title": "当了个当1111",
                    "shibiema": "1111",
                    "companyAddress": "111",
                    "companyPhone": "111",
                    "bankName": "111",
                    "bankNo": "1111",
                    "email": "",
                    "invoicUrl": null,
                    "invoicRemark": "",
                    "invoicTime": null,
                    "invoicAdmin": null,
                    "dtTime": null
                };
                if (code == 200) {
                    this.info = data
                }
            });
        },
        to_review(item) {
            this.$router.push({
                path: '/order-review-submit',
                query: {
                    orderId: this.order_id,
                    inventoryId: item.id
                }
            });
        },

        doCancel(item) {
            this.$refs.order_cancel_modal.init(item)
        },
        doPay(item) {
            this.$router.push({
                path: '/payment-methods',
                query: {
                    id: item.id
                }
            })
        },
        doDelete(item) {
            this.$refs.order_delete_modal.init(item)
        },
        doReceive(item) {
            this.$refs.order_receive_modal.init(item);
        },
        doRefund(item) {
            this.$refs.order_refund_modal.init(item);
        },

        emitConfirmDelete() {
            this.$router.back()
        },

    },
};
</script>

<style scoped lang="less">
.page {
  padding: 0;

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
      background: @theme;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 24px;
  padding: 24px 32px;
  background: #fff;
}

.step-box {
  .flex-center();
  padding: 55px 0;

  .step-item {
    text-align: center;

    &.active {
      .step-number {
        .step-num {
          background: @theme;
          color: #fff;
        }

        .step-line {
          background: @theme;
        }
      }
    }

    .step-number {
      margin: 0 auto;
      .flex();

      .step-line {
        width: 147px;
        height: 2px;
        background: #f5f5f5;

        &.step-line-1 {
          visibility: hidden;
        }

        &.step-line-6 {
          visibility: hidden;
        }
      }

      .step-num {
        width: 44px;
        height: 44px;
        line-height: 44px;
        background: #EDF6FD;
        border-radius: 50%;

        font-size: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #999999;
      }
    }

    .step-title {
      margin-top: 14px;
      margin-bottom: 10px;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
    }

    .step-date {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 12px;
      color: #808080;
    }
  }
}

.order-other {
  margin-bottom: 24px;
  min-height: 156px;
  background: #ffffff;
  border: 1px solid #F5F5F5;

  .title {
    text-align: left;
    padding-left: 24px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    border-bottom: 1px solid #F5F5F5;

    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;

    color: #333333;
  }

  .other {
    // .flex-between();
    display: flex;
    flex-wrap: wrap;
    padding: 20px 25px;

    .item {
      width: 50%;
      margin-bottom: 10px;
      text-align: left;
      padding-right: 40px;

      // flex: 1;
      .item-title {
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #999999;
        color: #333;
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

.order-product {
}

.pingzheng-box {
  .flex();
  flex-wrap: wrap;

  .pingzheng-item {
    border: 1px solid #eee;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}


.order-info {


  .money-yh {
    span {
      color: #04be02;
      font-weight: bold;
    }
  }

  .money-heji {
    span {
      color: @theme;
      font-weight: bold;
    }
  }

  .zhifufangshi-wrap {
    margin-bottom: 0 !important;
    padding: 10px 0;
    width: 100%;
    border-top: 1px dashed #e5e5e5;
    .flex();
    justify-content: flex-end;

    .zhifufangshi {
      .flex();

      .pay-item {
        .flex();
        margin-left: 10px;

        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 24px;
        color: @theme;

        .pay-title {
          margin-right: 5px;
        }

        .pay-money {
        }
      }
    }
  }

  .order-list-wrap {
    .info-item {
      border: 1px solid #F5F5F5;
      margin-bottom: 30px;
    }

    .info-title {
      .flex-between();
      height: 48px;
      padding: 0 24px;
      background: #f9f9f9;
      border-bottom: 1px solid #F5F5F5;

      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;

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
        // min-width: 96px;
        height: 30px;
        line-height: 30px;
        // background: @theme;
        color: @theme;
        // color: #fff;
        font-size: 14px;
      }
    }

    .info-good {
      .list-good {
        .item {
          border-bottom: 1px solid #F5F5F5;

          &:last-child {
            border-bottom: none;
          }
        }

        .item-good {
          padding: 20px;
          border-bottom: 1px dashed #F5F5F5;

          &:last-child {
            border: none;
          }


          .box-image {
            width: 100px;
            height: 100px;
            cursor: pointer;
            border: 1px solid #F5F5F5;


            /deep/ img {
              width: 100px;
              height: 100px;
              object-fit: contain;
              object-fit: cover;
            }

            img {
              width: 100px;
              height: 100px;
              object-fit: contain;
              object-fit: cover;
            }
          }

          .box-title {
            flex: 1;
            text-align: left;
            padding-left: 40px;


            .title {
              width: fit-content;
              cursor: pointer;

              &:hover {
                color: @theme;
              }
            }
          }

          .box-sku {
            margin-top: 10px;
            color: #77797B;
            min-width: 200px;
          }

          .box-num {
            text-align: center;
            min-width: 200px;
          }

          .box-price {
            text-align: center;
            min-width: 200px;
            font-weight: bold;
            font-size: 14px;
            color: #333;
          }
        }

        .goods-action {
          .flex();
          justify-content: flex-end;
          padding: 10px;

          button {
          }

          .btn-goods-action {
            padding-left: 10px;
            padding-right: 10px;
            margin-left: 10px;
            min-width: 96px;
            height: 30px;
            background: @theme;
            font-size: 14px;
            font-family: Microsoft YaHei;
            color: #ffffff;
            // border-radius: 14px;
            transition: 0.3s;
            border-radius: 4px;

            &:hover {
              opacity: 0.8;
            }

            &.disabled {
              background: #e5e5e5;
            }
          }
        }
      }
    }

    .info-cont {
      padding: 10px 30px;

      .content {
        .it {
          margin-bottom: 10px;
        }
      }
    }
  }

  // 商品信息汇总和订单操作

  .info-heji {
    background: #fafafa;
    padding: 24px 40px;
    border-top: 1px solid #F5F5F5;
    // .flex-between();
    align-items: flex-start;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #666;


    .money-box {
      text-align: right;

      .count {
        font-weight: bold;
        color: @theme;
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
          color: #666666;
        }

        .value {
          min-width: 180px;
          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
        }

        .money-num {

          &.money-total {
            font-family: Arial, Arial;
            font-weight: bold;
            font-size: 20px;
            color: #FF0000;
          }
        }
      }
    }
  }
}

.order-action-box {
  display: flex;
  justify-content: center;

  .btn-box {
    button {
      transition: 0.3s;
      width: 240px;
      height: 34px;
      background: #A66600;
      border-radius: 4px;
      font-weight: 400;
      font-size: 14px;
      color: #fff;

      & + button {
        margin-left: 20px;
      }

      &.btn-bg {
        background: @theme;
        color: #FFF;
      }

      &:hover {
        opacity: 0.7;
      }
    }


  }
}

</style>
