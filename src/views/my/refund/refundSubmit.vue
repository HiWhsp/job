<template>
  <div class="page">
    <div class="main-title">申请售后</div>
    <!--    <div class="refund-step">-->
    <!--      <div class="step-box">-->
    <!--        <div class="step step-1 active">① 买家申请</div>-->
    <!--        <div class="step step-2 ">② 卖家处理</div>-->
    <!--        <div class="step step-3">③ 售后完成</div>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="refund-info page-ctx">
      <div class="center">
        <!-- 商品信息 -->
        <refundGoodsInfo :order="order"/>
      </div>

      <div class="form-wrap">
        <div class="form-box">
          <!--          <div class="input-box">-->
          <!--            <div class="label">服务类型</div>-->
          <!--            <div class="action">{{ refund_type_text }}</div>-->
          <!--          </div>-->

          <div class="input-box">
            <div class="label">{{ refund_type_text }}原因：<span style="color: #FF3D00;">*</span></div>
            <div class="action">
              <el-select v-model="reason" placeholder="请选择">
                <el-option v-for="item in list_reason_title" :key="item.item" :label="item.title"
                           :value="item.title"></el-option>
              </el-select>
            </div>
          </div>

          <!-- <div class="input-box shouhuo-box">
            <div class="label">换货地址</div>
            <div class="action">
              <div class="shouhuo">
                <div class="rec"><span class="text">收货人: </span> <span class="val"> 222</span></div>
                <div class="rec"><span class="text"> 地址:</span> <span class="val">333 </span></div>
                <div class="rec"><span class="text"> 手机号码: </span> <span class="val"> 444</span></div>
              </div>
            </div>
          </div> -->

          <div class="input-box" v-if="refund_type_text == '退货退款' || refund_type_text == '退款'">
            <div class="label">退款金额：<span style="color: #FF3D00;">*</span></div>
            <div class="action">
              <!-- {{ refundMoney }} -->
              <el-input placeholder="请输入退款金额" v-model="money"/>
            </div>
          </div>

          <div class="input-box remark-box">
            <div class="label">{{ refund_type_text }}说明：</div>
            <div class="action">
              <el-input type="textarea" :placeholder="`请输入${refund_type_text}信息`" v-model="remark"
                        :autosize="{ minRows: 6 }"/>
            </div>
          </div>
          <div class="input-box upload-box">
            <div class="label">上传凭证：</div>
            <div class="action">
              <el-upload class="upload-demo" list-type="picture-card" multiple accept="image/*" name="img"
                         action="https://wuhanjingmi.new.zhishangez.com//service.php?action=index_ossUpload"
                         :on-success="uploadSuccess_pingjia"
                         :before-upload="beforeUpload_pingjia" :data="uploadExtraData">
                <!-- <i class="el-icon-upload"></i> -->
                上传凭证
                <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </div>
          </div>

          <div class="submit-box">
            <button class="btn" @click="submit_refund">提交申请</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import refundGoodsInfo from "@/components/refund/refundGoodsInfo.vue"; //

import {mapState} from "vuex";

export default {
  name: "servicePage",
  components: {
    refundGoodsInfo,
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      inventoryId: this.$route.query.inventoryId,
      refund_type: this.$route.query.refund_type,

      currency: "",
      orderObj: {}, //
      order: {}, //

      images: [], //评价图片
      reason: "",
      remark: "",
      money: "",

      //图片预览
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  computed: {

    refund_type_text() {
      //退换货类型(1-退款   2-退货退款  3-换货)
      let map = {
        1: "退款",
        2: "退货退款",
        3: "换货",
      };
      return map[this.refund_type];
    },

    //售后原因
    list_reason_title() {
      const obj = Object.assign({}, this.$store.state.webConfig)
      const name = obj.tuihuanReason ? JSON.parse(obj.tuihuanReason) : [];
      return name;
    },

    //要售后的商品
    refund_goods() {
      let obj = {};
      if (this.order && this.order.products) {
        obj = this.order.products[0];
      }
      return obj;
    },

    //退款金额
    refundMoney() {
      if (this.currency == "积分") {
        return (this.orderObj.pay_info && this.orderObj.pay_info.jifen) || 0;
      } else {
        let money = this.refund_goods.priceSale * this.refund_goods.num;

        return money || 0;
      }
    },
  },
  mounted() {
    console.log(this.$store.state.webConfig)

    this.setView();
  },
  methods: {
    setView() {
      this.$api("orders_detail", {
        id: this.orderId,
      }).then((res) => {
        //console.log("订单详情", res);
        let {code, data, msg} = res;
        if (code == 200) {
          this.order = data;
          this.orderObj = data;
          if (data && data.if_jifen) {
            this.currency = "积分";
          }
        }
      });
    },

    //提交评价
    submit_refund() {
      let {reason, remark} = this;

      let urlArrStr = "";
      if (this.images) {
        urlArrStr = this.images.join("|");
      }

      //退换货类型(1-退款   2-退货退款  3-换货)
      let params = {
        orderId: this.orderId,
        inventoryId: this.inventoryId,
        type: this.refund_type,
        num: this.refund_goods.num,

        reason: this.reason,
        remark: this.remark,
        uploadedfile1: urlArrStr,
        money: this.refundMoney,
      };
      //console.log("要提交的信息", params);
      // return;

      if (!reason) {
        alertErr("请选择售后原因");
        return;
      }
      if (this.refund_type == 2) {
        if (!this.money) {
          alertErr("请输入退款金额");
          return;
        }
        if (this.money > this.refund_goods.priceSale) {
          alertErr("退款金额应小于等于商品金额");
          return;
        }
      }

      if (!remark) {
        alertErr("请填写详细说明");
        return;
      }

      // debugger;
      this.$api("refund_add", params).then((res) => {
        //console.log("申请退货退款", res);
        let {code, msg} = res;
        if (code == 200) {
          this.$router.push("/refund-list");
        } else {
          alertErr(msg);
        }
      });
    },

    //上传相关
    uploadSuccess_pingjia(res, file) {
      //console.log("上传结果", res);
      let {code, data, msg} = res;
      // alert(res);
      if (code == 200) {
        this.images.push(res.data);
      }
    },

    beforeUpload_pingjia(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
}

/deep/ .info-heji {
  display: none !important;
}


.page {
  padding-bottom: 50px;
  padding-top: 0;

  .main-title {
    margin-bottom: 20px;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
  }

  .page-ctx {
    padding: 24px 32px;
    background: #fff;
  }

}


.refund-step {
  .step-box {
    width: 100%;
    margin: 0 auto;
    font-size: 14px;
    .flex();

    .step {
      flex: 1;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: #eee;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        opacity: 0.75;
      }

      &.step-1 {
        clip-path: polygon(0% 0%, 97% 0%, 100% 50%, 97% 100%, 0% 100%);
      }

      &.step-2 {
        clip-path: polygon(0% 0%, 97% 0%, 100% 50%, 97% 100%, 0% 100%, 3% 50%);
      }

      &.step-3 {
        // clip-path: polygon(0% 0%, 97% 0%, 100% 50%, 97% 100%, 0% 100%, 3% 50%);
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 3% 50%);
      }

      &.active {
        background: @theme;
        color: #fff;
      }
    }
  }
}

.refund-info {

}

.form-wrap {
  margin-top: 30px;
  text-align: left;

  .input-box {
    margin-bottom: 25px;
    .flex();
    font-size: 14px;

    &.shouhuo-box {
      align-items: flex-start;
    }

    &.remark-box {
      align-items: flex-start;
    }

    &.upload-box {
      align-items: flex-start;
    }

    .label {
      min-width: 120px;
    }

    .action {
      width: 455px;

      .el-input {
        width: 100%;
      }

      .el-select {
        width: 100%;
      }

      .shouhuo {
        .rec {
          .flex();

          .text {
            min-width: 75px;
          }

          .val {
          }
        }
      }
    }
  }

  .submit-box {
    margin-top: 40px;
    padding-left: 120px;

    .btn {
      width: 240px;
      height: 40px;
      background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
      background: @theme;
      border-radius: 30px;
      border-radius: 0;

      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 36px;
      color: #ffffff;
    }
  }
}
</style>
