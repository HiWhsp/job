<template>
  <div class="modal-container">
    <el-dialog title="余额支付" width="580px" custom-class="modal-wrap" :close-on-click-modal="false" :visible.sync="showModal" :before-close="onModal_close">
      <div class="modal-inner">
        <div class="item">
          <div class="label">余额：</div>
          <div class="val">
            <div class="money">¥ {{ baseInfo.yue }}</div>
          </div>
        </div>
        <div class="item">
          <div class="label">需支付：</div>
          <div class="val">
            <div class="money">¥ {{ money }}</div>
          </div>
        </div>
        <div class="item">
          <div class="label">支付密码：</div>
          <div class="val">
            <input type="password" v-model="paypass" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="quxiao" @click="cancelPay">取消</button>
        <button class="queding" @click="order_payment_yue">确认支付</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "commonShare",
  components: {},
  props: ["curr"],
  data() {
    return {
      showModal: false,
      // showModal: true,

      paypass: "",
      money: "",
      order_id: "",
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.order_id = "";
        this.money = "";
        this.paypass = "";
      }
    },
  },

  methods: {
    init(data) {
      this.showModal = true;
      this.money = data.money;
      this.order_id = data.order_id;
    },
    onModal_close() {
      this.showModal = false;
      //console.log("余额支付关闭 onModal_close");

      this.cancelPay();
    },

    cancelPay() {
      // this.showModal= false;
      // this.order_id =
      if (this.$route.name == "order-submit") {
        //创建订单页
        this.$router.push("/payment-success?order_id=" + this.order_id);
      } else {
        this.showModal = false;
      }
    },

    //余额支付
    order_payment_yue() {
      // if (+this.baseInfo.money < +this.money_daizhifu) {
      //   alertErr("您的余额不足，请选择其他支付方式");
      //   return;
      // }
      if (!this.paypass) {
        alertErr("请输入您的余额支付密码");
        return;
      }

      this.$api("orders_yuePay", {
        order_id: this.order_id,
        pay_pass: this.paypass,
      }).then((res) => {
        //console.log("余额支付", res);
        let { code, message } = res;

        if (code == 200) {
          this.toPaySuccess();
        } else {
          alert(res);
          this.$router.push(`/payment-success?order_id=${this.order_id}`);
        }
      });
    },

    //支付成功操作
    toPaySuccess() {
      this.$router.push(`/payment-success?order_id=${this.order_id}`);
    },
  },
};
</script>


<style scoped lang="less">
.modal-wrap {
  .modal-inner {
    padding: 20px;

    .item {
      .flex();
      margin-bottom: 20px;

      .label {
        min-width: 100px;
        text-align: right;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #666666;
      }
      .val {
        .money {
          font-size: 20px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: @theme;
        }

        input {
          padding: 0 20px;
          width: 350px;
          height: 48px;
          background: #ffffff;
          border-radius: 3px 3px 3px 3px;
          opacity: 1;
          border: 1px solid #e5e5e5;
        }
      }
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  // background: @theme;
  background: #f7f7f7;
  text-align: left;

  .el-dialog__title {
    color: #fff;
    color: #333;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    color: #333;
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  button {
    width: 128px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #eeeeee;
    font-size: 14px;
  }

  .quxiao {
    margin-right: 24px;
    color: @theme;
    border: 1px solid @theme;
  }
  .queding {
    // margin-right: 24px;
    background: @theme;
    color: #fff;
  }
}
</style>
