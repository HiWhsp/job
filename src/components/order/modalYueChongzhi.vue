<template>
  <div class="modal-container">
    <el-dialog
      class="modal-yue-chongzhi"
      title="微信支付"
      width="580px"
      custom-class="modal-wrap modal-yue-chongzhi"
      :close-on-click-modal="true"
      :visible.sync="showModal"
      :before-close="onModal_close"
    >
      <div class="modal-inner">
        <div class="img-box">
          <img :src="info.qrcode" alt="" />
        </div>
        <div class="money">
          {{vuex_huobi}} <b>{{ info.money }}</b>
        </div>
        <div class="text-box">打开微信扫一扫进行支付</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="quxiao btn-ripple" @click="showModal = false">取消</button>
        <button
          class="queding btn-ripple"
          :disabled="!payDone"
          style="margin-left: 30px"
          @click="showModal = false"
        >
          完成支付
        </button>
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
      info: {},
      timerQuery: null,
      payDone: false,
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.clearQueryPay();
      } else {
      }
    },
  },

  beforeDestroy() {
    this.clearQueryPay();
  },

  methods: {
    init(data) {
      this.info = data;
      this.showModal = true;

      this.queryPayStatus();
    },

    queryPayStatus() {
      this.timerQuery = setInterval(() => {
        this.$api("money_checkScan", {
          orderId: this.info.orderId,
        }).then((res) => {
          let { code, data, msg} = res;
          if (code == 200) {
            if (res.data.status == 1) {
              //状态：0-未支付  1-已支付
              alertSucc("支付成功");
              this.clearQueryPay();
              this.payDone = true;

              this.$parent.yuePayDone();
            }
          }
        });
      }, 3000);
    },
    clearQueryPay() {
      clearInterval(this.timerQuery);
      this.timerQuery = null;
    },

    onModal_close() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped lang="less">
.modal-wrap {
  .modal-inner {
    padding: 0;
    .flex-center();
    flex-direction: column;
    font-size: 14px;

    .img-box {
      border: 1px solid #ddd;
      img {
        width: 200px;
      }
    }
    .money {
      margin-top: 20px;
      font-size: 16px;
      color: @theme;
      b {
        font-size: 24px;
      }
    }
    .text-box {
      margin-top: 20px;
      font-size: 16px;
      color: #333;
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
    // margin-right: 20px;
    color: @theme;
    border: 1px solid @theme;
  }
  .queding {
    // margin-right: 24px;
    background: @theme;
    color: #fff;

    &:disabled {
      background: #bbb;
      cursor: not-allowed;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/modalYueChongzhi.less"></style>
