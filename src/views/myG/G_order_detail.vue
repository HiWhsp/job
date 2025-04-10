<template>
  <div class="page">
    <div class="main-title">
      <span>查看订单详情</span>
      <button @click="$router.push('/order-list')">返回</button>
    </div>
    <div class="page-ctx">
      <div class="order-other">
        <div class="title">订单信息</div>
        <div class="other">
          <div class="item">
            <div class="item-title">收货人信息</div>
            <div class="item-content">
              <div class="name">
                <span>收货人：</span>
                {{ shouhuoInfo['username'] }}
              </div>
              <div class="phone">
                <span>手机号码：</span>
                {{ shouhuoInfo['mobile'] }}
              </div>
              <div class="address">
                <span>详细地址：</span>
                {{ full_receive_address }}
              </div>
            </div>
          </div>
          <div v-if="peisong_type_text" class="item">
            <div class="item-title">支付及支付方式</div>
            <div class="item-content">
              <div class="date">
                <span>支付方式：</span>
                <span class="val">{{ peisong_type_text }}</span>
              </div>
              <div class="date">
                <span>下单时间：</span>
                {{ payInfo.created_at }}
              </div>
              <div class="pay-type">
                <span>配送方式：</span>
                供应商自有物流
                <!--                {{ fahuoInfo.expressName || '' }} {{ fahuoInfo.expressOrder || '' }}-->
              </div>
              <div class="date">
                <span>付款方式：</span>
                {{
                  info.order_info.jiesuan_type == 1 ? `货到付款 ${(info.order_info.jiesuan_days)}` : info.order_info.jiesuan_type == 2 ?
                      `款到发货 ${(info.order_info.jiesuan_end_time)}` : ''
                }}
              </div>
              <div class="data flex payImg">
                <span>支付凭证：</span>
                <!--                <div class="pingzheng-item" v-for="(item, index) in info.order_info.pay_prove_url" :key="index">-->
                <el-image :preview-src-list="[info.order_info.pay_prove_url_full]"
                          :src="info.order_info.pay_prove_url_full"
                          style="width: 100px; height: 100px">
                </el-image>
                <!--                </div>-->
              </div>
            </div>
          </div>
          <!-- 对公信息 -->
          <div v-if="info.pay_type == 1" class="item back-card">
            <div class="item-title">收款对公账户</div>
            <div class="item-content">
              <div class="date">
                <span>收款单位名称：</span>
                <span class="val">{{ bankList[0] ? bankList[0].company_name : '' }}</span>
                <img alt="" src="@/static/order/copy.png"
                     @click="copyText(bankList[0] ? bankList[0].company_name : '')">
              </div>
              <div class="date">
                <span>收款单位号码：</span>
                <span class="val">{{ bankList[0] ? bankList[0].account : '' }}</span>
                <img alt="" src="@/static/order/copy.png" @click="copyText(bankList[0] ? bankList[0].account : '')">
              </div>
              <div class="date">
                <span>开户银行：</span>
                <span class="val">{{ bankList[0] ? bankList[0].bank : '' }}</span>
                <img alt="" src="@/static/order/copy.png" @click="copyText(bankList[0] ? bankList[0].bank : '')">
              </div>
            </div>
          </div>

          <!-- 转款凭证 -->
          <!--          <div class="item" v-if="is_xianxia">-->
          <!--            <div class="item-title">转账凭证</div>-->
          <!--            <div class="item-content">-->
          <!--              <div class="wuliu-name">-->
          <!--                &lt;!&ndash; <span>转账凭证：</span> &ndash;&gt;-->

          <!--                <div class="pingzheng-box">-->
          <!--                  <div class="pingzheng-item" v-for="(item, index) in xianxia_imgs" :key="index">-->
          <!--                    <el-image style="width: 100px; height: 100px" :src="item" :preview-src-list="xianxia_imgs">-->
          <!--                    </el-image>-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->

          <!-- 物流信息 -->
          <div v-if="fahuo_info.expressName" class="item">
            <div class="item-title">物流信息</div>
            <div class="item-content">
              <div class="wuliu-name">
                <span>配送方式：</span>
                {{ fahuo_info.expressName }}
              </div>
              <div class="wuliu-code flex pointer" @click="copy(fahuo_info.expressOrder)">
                <span>快递单号：</span>
                {{ fahuo_info.expressOrder }}
                <img alt="" src="@/static/account/copy.png">
              </div>
            </div>
          </div>
          <!-- 物流信息 -->
          <div v-if="orderObj.remark" class="item">
            <div class="item-title">订单备注</div>
            <div class="item-content">
              <div class="wuliu-name">
                <span>备注：</span>
                {{ orderObj.remark }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单商品信息 -->
      <div class="order-product order-info">
        <div class="order-list-wrap">
          <!-- 商品信息 -->
          <div class="info-item">
            <div class="info-title">
              <!--              <div class="date">{{ info.createdTime }}</div>-->
              <div class="order-code">
                订单号：
                <span>{{ info.order_info ? info.order_info.order_no : '' }}</span>
              </div>
              <!--              <div class="order-name">-->
              <!--                <img src="@/static/home/supplier.png" alt="">-->
              <!--                <span>{{ info.order_info ? info.order_info.supply_user_info.name : '' }}</span>-->
              <!--              </div>-->
              <div class="order-payType">
                {{
                  info.order_info.jiesuan_type == 1 ? `货到付款 ${(info.order_info.jiesuan_days)}` : info.order_info.jiesuan_type == 2 ?
                      `款到发货 ${(info.order_info.jiesuan_end_time)}` : ''
                }}
              </div>
              <div class="order-state">{{ orderStatusInfo(info.order_info.order_status) }}</div>
            </div>
            <div class="info-good">
              <div class="list-good">
                <div v-for="(product_item, index) in products" :key="index" class="item">
                  <div class="item-good flex">
                    <div class="box-image cover" @click="mix_to_product(product_item)">
                      <el-image :src="product_item.material_coverurl_full">
                        <div slot="error" class="image-slot">
                          <img :src="product_item.material_coverurl_full"/>
                        </div>
                      </el-image>
                    </div>

                    <div class="box-title">
                      <div class="title" @click="mix_to_product(product_item)">
                        {{ product_item.material_name }}
                      </div>
                      <div class="goods-sku">规格: {{ product_item.guige }}</div>
                    </div>
                    <div class="box-num">{{ product_item.num }}</div>
                    <div class="box-price">{{ vuex_huobi }} {{ product_item.single_price }}</div>
                    <div class="box-price">{{ vuex_huobi }} {{ product_item.subtotal }}</div>
                  </div>

                  <div v-if="info.orderStatus == 5" class="goods-action">
                    <button v-if="product_item.ifComment == 0" class="btn-goods-action"
                            @click="to_review(product_item)">
                      商品评价
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="info-heji">
            <!-- <div class="heji">合计： {{vuex_huobi}} {{ info.price }} 元</div> -->
            <div class="heji">
              <div class="heji-num">
                共 <b class="count">{{ total_product_number }}</b> 件
              </div>
              <div class="heji-money">
                合计金额： <b>{{ vuex_huobi }}{{ info.order_info.all_price }}</b>元
              </div>
            </div>
<!--            <div class="money-box">-->
<!--              <div class="money-item">-->
<!--                <div class="label"></div>-->
<!--                <div class="value">共 <b class="count">{{ total_product_number }}</b> 件</div>-->
<!--              </div>-->
<!--              <div class="money-item">-->
<!--                <span class="label">合计应付：</span>-->
<!--                <div class="value">-->
<!--                  <span class="money-num money-total">{{ vuex_huobi }}{{ info.order_info.all_price }}</span>-->
<!--                </div>-->
<!--                （含税）-->
<!--              </div>-->
<!--            </div>-->
          </div>

          <!-- 订单操作 -->
          <div class="order-action-box">
            <div class="btn-box">
              <!--              <button class="btn-ripple fit-text " @click="doCancel(info)">-->
              <!--                取消订单-->
              <!--              </button>-->
              <!--              <button v-if="orderObj.statusInfo == '待支付'" class="btn-ripple fit-text btn-bg" @click="doPay(info)">-->
              <!--                去支付-->
              <!--              </button>-->
              <!--              <button class="btn-ripple fit-text btn-bg" @click="doDelete(info)">-->
              <!--                删除订单-->
              <!--              </button>-->
              <button v-if="info.order_info.order_status == 2" class="btn-ripple fit-text btn-bg"
                      @click="doReceive(info.order_info)">
                发货
              </button>
              <!--              <button class="btn-ripple fit-text btn-bg" @click="uploadPay(info)">-->
              <!--                上传支付凭证-->
              <!--              </button>-->
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :before-close="handleClose" :visible.sync="uploadPayModal" title="上传支付凭证"
               width="500px">
      <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          class="upload-demo"
          drag
          multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">可添加JPG、PNG、PDF文件，大小限制10M以内</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadPayModal = false">取 消</el-button>
        <el-button type="primary" @click="uploadPayModal = false">确 定</el-button>
      </div>
    </el-dialog>


    <order_cancel_modal ref="order_cancel_modal" data-type="取消" @confirm="emitConfirm"/>
    <order_delete_modal ref="order_delete_modal" data-type="删除" @confirm="emitConfirm"/>
    <order_receive_modal ref="order_receive_modal" data-type="收货" @confirm="emitConfirm"/>
    <order_refund_modal ref="order_refund_modal" data-type="售后" @confirm="emitConfirm"/>

  </div>
</template>

<script>
import order_cancel_modal from "@/components/order/order_cancel_modal.vue"; //取消订单
import order_delete_modal from "@/components/order/order_delete_modal.vue"; //删除
import order_receive_modal from "@/components/order/order_receive_modal.vue"; //收货
import order_refund_modal from "@/components/order/order_refund_modal.vue"; //售后

// import orderInfo from "@/components/order/orderInfo.vue"; //
import {mapState} from "vuex";

export default {
  name: "order-detail",
  components: {
    order_cancel_modal,
    order_delete_modal,
    order_receive_modal,
    order_refund_modal
    // orderInfo,
  },
  data() {
    return {
      id: this.$route.query.id,
      orderId: this.$route.query.id,
      info: {},
      payInfo: {},
      shouhuoInfo: {}, //收货人信息
      total_product_number: 0,
      products: [],
      full_receive_address: '',
      //
      is_finish_pay: false,//
      //
      is_jifen_goods: false,

      orderObj: {}, //订单信息

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
      bankList: [], // 线下卡列表
      uploadPayModal: false
    };
  },
  computed: {
    ...mapState(["defaultAvatar"]),
    orderStatusInfo() {
      return (status) => {
        switch (status) {
          case -1:
            return "取消";
          case 0:
            return "已下单"
          case 1:
            return "待支付";
          case 2:
            return "待发货";
          case 3:
            return "待收货";
          case 4:
            return "已支付";
          case 5:
            return "已完成(确认收货)";
        }
      }
    }
  },
  created() {
    this.setView();
  },
  methods: {
    uploadPay(info) {
      this.uploadPayModal = true
    },
    handleClose() {
      this.uploadPayModal = false
    },
    // 获取线下卡列
    getBankList() {
      this.$api({
        url: 'supplyAccountList',
        method: 'post',
        data: {
          supply_user_id: this.info.order_info.supply_user_info.id
        }
      }).then(res => {
        if (res.code == 200) {
          this.bankList = res.data.account_list
        }
      })
    },
    emitConfirm() {
      this.setView();
    },
    setView() {
      this.query_order()
    },

    query_order() {
      this.$api({
        url: 'supplyOrderDetail',
        method: 'post',
        data: {
          order_id: this.id
        },
      }).then((res) => {
        let {code, data, msg} = res;
        if (code == 200) {
          this.info = data;
          let {order_info, orderDetail} = data;

          this.payInfo = order_info.pay_json;
          this.products = orderDetail;
          // this.fahuo_info = fahuoInfo;
          // this.is_finish_pay = parseFloat(data.pricePayed) > 0;

          // 收货地址
          this.shouhuoInfo = order_info.address_json;
          if (order_info.address_json) {
            let {province, city, area, address} = order_info.address_json;
            this.full_receive_address = [province, city, area, address].filter(v => v).join(' ')
          }

          // 总数
          this.products.forEach((item) => {
            this.total_product_number += Number(item.num);
          })

          //
          //支付方式
          let payType_map = {
            1: "对公转账(含税)",
            2: "银行卡转账(不含税)"
          };
          this.peisong_type_text = payType_map[order_info.pay_type] || "";

          //凭证图片
          this.orderObj = data;

          this.getBankList();
        }
      });
    },
    to_review(item) {
      this.$router.push({
        path: '/review-submit',
        query: {
          orderId: this.orderId,
          inventoryId: item.id
        }
      });
    },

    doCancel(item) {
      this.$refs.order_cancel_modal.init(item)
    },
    doPay(item) {
      this.$router.push({
        path: '/orderSubmit',
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
      // this.$refs.order_refund_modal.init(item);
      this.$router.push({
        path: '/refundType',
        query: {
          orderId: this.info.id,
          inventoryId: this.info.id
        }

      })
    },

    emitConfirmDelete() {
      this.$router.back()
    },
    // 复制
    copy(text) {
      // 动态创建 textarea 标签
      const textarea = document.createElement("textarea");
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = "readonly";
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = text;
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea);
      // 选中值并复制
      textarea.select();
      const result = document.execCommand("Copy");
      if (result) {
        this.$message.success('复制成功')
      }
      document.body.removeChild(textarea);
    },
    copyText(text) {
      let input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message.success('复制成功');
      input.remove();
    }
  },
};
</script>

<style lang="less" scoped>
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
    font-family: Roboto, Roboto-Bold, Roboto, Roboto;
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
  margin-top: 10px;
  padding: 24px 32px;
  background: #fff;
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
    font-family: Roboto, Roboto;
    font-weight: bold;

    color: #333333;
  }

  .other {
    // .flex-between();
    display: flex;
    flex-wrap: wrap;
    padding: 20px 25px;

    .item {
      width: 340px;
      margin-bottom: 10px;
      text-align: left;
      padding-right: 40px;

      // flex: 1;
      .item-title {
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #999999;
        margin-bottom: 24px;
      }

      .item-content {
        min-height: 20px;
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        line-height: 20px;
        color: #666;

        .payImg {
          align-items: start;
        }

        .wuliu-code {
          align-items: center;

          img {
            margin-left: 5px;
            width: 16px;
            height: 16px;
          }
        }

        > div {
          margin-bottom: 10px;

          span {
            display: inline-block;
            // min-width: 80px;
          }

          img {
            width: 50px;
            height: 50px;
          }
        }
      }
    }

    .back-card {
      background: #F8E9D2;
      padding: 16px 20px;

      .item-title {
        font-weight: 500;
        font-size: 18px;
        color: #000000;
        margin-bottom: 14px;
      }

      .item-content {
        color: #000;

        .date {
          display: flex;
          align-items: center;
        }

        span:first-child {
          width: 110px;
          text-align: right;
        }

        .val {
          text-align: left;
        }

        img {
          width: 12px !important;
          height: 12px !important;
          margin-left: 10px;
          cursor: pointer;
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
        font-family: Roboto, Roboto;
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
      //margin-bottom: 30px;
    }

    .info-title {
      .flex-between();
      height: 48px;
      padding: 0 24px;
      background: #f9f9f9;
      border-bottom: 1px solid #F5F5F5;

      font-size: 14px;
      font-family: Roboto, Roboto-Bold, Roboto, Roboto;
      font-weight: bold;
      color: #333333;

      .date {
      }

      .order-code {
        text-align: left;
        //padding-left: 20px;
        span {
        }
      }

      .order-name {
        font-weight: 500;
        font-size: 16px;
        color: #000000;

        img {
          width: 56px;
          height: 20px;
          margin-right: 10px;
        }
      }

      .order-payType {
        font-weight: 400;
        font-size: 14px;
        color: #FF0000;
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
              color: #333;
              margin-bottom: 10px;

              &:hover {
                color: @theme;
              }
            }

            .goods-sku {
              color: #77797B;
            }
          }

          .box-sku {
            text-align: center;
            min-width: 200px;
          }

          .box-num {
            text-align: center;
            min-width: 200px;
          }

          .box-price {
            text-align: center;
            min-width: 200px;

            font-family: Roboto, Roboto;
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
            font-family: Roboto, Roboto;
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
  }

  // 商品信息汇总和订单操作

  .info-heji {
    padding: 15px;
    border: 1px solid #f5f5f5;
    border-top: none;
    .flex-between();
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;

    .heji {
      .flex();
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;

      .heji-num {
        margin-right: 30px;

        b {
          color: #EA3200;
        }
      }

      .heji-money {
        b {
          color: #EA3200;
        }
      }
    }
  }

  .order-action-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;

    .btn-box {
      // margin-top: 10px;

      button {
        transition: 0.3s;
        min-width: 120px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid @theme;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: @theme;

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
}

.upload-demo {
  text-align: center;
}
</style>

<style lang="less" scoped src="@/assets/h5css/shop/order-detail.less"></style>
<style lang="less" scoped src="@/assets/h5css/shop/orderInfo.less"></style>
