<template>
  <div class="modal-container">
    <!-- 弹窗 -->
    <el-dialog
      title="扫描下方二维码完成支付"
      width="500px"
      custom-class="modal-wrap modal-wx-pay"
      :close-on-click-modal="false"
      :visible.sync="showModal"
      :before-close="onModal_close"
    >
      <div class="modal-inner">
        <div class="pay-wrap">
          <!-- <div class="pay-tip">扫描下方微信二维码完成支付</div> -->
          <div class="pay-qrcode">
            <img :src="qrcode" alt />
          </div>

          <div class="pay-info">
            订单金额:
            <b>{{vuex_huobi}} {{ payment_money }}</b>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="quxiao" @click="cancelPay">取消</button>
        <button :disabled="!payDone" class="queding" @click="toPaySuccess">
          支付完成
        </button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import order from "@/shop-actions/order";

import { mapState } from "vuex";

export default {
  name: "commonShare",
  components: {},
  props: ["payment_money"],
  data() {
    return {
      order_id: "",
      showModal: false,
      qrcode: "",
      payDone: false,
      timer: null,
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {
    showModal(val) {
      if (val) {
        this.orders_detail(); //获取订单详情
      } else {
        this.timer_clear();
      }
    },
  },

  mounted() {
    // this.creatQrCode();
  },

  beforeDestroy() {
    this.timer_clear();
  },

  methods: {
    init(data) {
      this.order_id = data.order_id;
      this.qrcode = data.qrcode;

      this.showModal = true;
    },
    onModal_close() {
      // this.showModal = false;
      this.cancelPay();
    },
    cancelPay() {
      // this.showModal= false;
      // this.order_id =
      if (this.$route.name == "order-submit" || this.$route.name == "orderSubmit") {
        //创建订单页
        this.$router.push("/payment-success?order_id=" + this.order_id);
      } else {
        this.showModal = false;
      }
    },

    orders_detail() {
      this.timer = setInterval(() => {
        this.$api("orders_detail", {
          id: this.order_id,
        }).then((res) => {
          let { code, data, msg} = res;

          if (data.status == 2) {
            alertSucc("支付完成");
            this.payDone = true;
            this.timer_clear();

            setTimeout(() => {
              this.toPaySuccess();
            }, 2000);
          }
        });
      }, 3000);
    },
    timer_clear() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    toPaySuccess() {
      // this.$router.push(`/payment-success?order_id=${this.order_id}`);
      this.$router.push(`/payment-success?order_id=${this.order_id}`);
    },
  },
};
</script>

<style scoped lang="less">
.modal-wrap {
  .modal-inner {
    .pay-wrap {
      .pay-qrcode {
        text-align: center;
        img {
          width: 300px;
          height: 300px;
        }
      }

      .pay-info {
        b {
          color: @theme;
          font-size: 20px;
        }
      }
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  background: @theme;

  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  button {
    width: 170px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #eeeeee;
    font-size: 14px;
  }

  .quxiao {
    margin-right: 20px;
  }
  .queding {
    background: @theme;
    color: #fff;

    &:disabled {
      opacity: 0.3;
      cursor: no-drop;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/orderPayWxCode.less"></style>
