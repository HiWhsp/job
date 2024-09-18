<template>
  <div class="modal-container">
    <el-dialog title="余额支付" width="580px" custom-class="modal-wrap" :close-on-click-modal="true" :visible.sync="showModal" :before-close="onModal_close">
      <div class="modal-inner">
        <div class="img-box">
<!--          <img src="@/static/payment/pay-warn.png" alt="" />-->
        </div>
        <div class="tip">余额不足</div>
        <div class="texts">
          <div class="text">
            <div class="label">余额：</div>
            <div class="val">{{ baseInfo.yue }}</div>
          </div>
          <div class="text" style="margin-left: 50px">
            <div class="label">需支付：</div>
            <div class="val">{{ money }}</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="queding" @click="$router.push('/yueChongzhi')">去充值</button>
        <!-- <button class="quxiao" @click="showModal = false">取消</button> -->
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
      money: "",
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {
    showModal(val) {
      if(!val) {
        this.money = '';
      }
    }
  },

  methods: {
    init(data) {
      //console.log('余额不足提示', data)
      this.money = data.money;
      this.showModal = true;
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
    padding: 20px;

    padding-bottom: 0;

    .img-box {
      img {
        width: 63px;
      }
    }

    .tip {
      text-align: center;
      margin: 20px 0;
      font-size: 24px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #000000;
    }
    .texts {
      .flex-center();

      .text {
        .flex();
        .label {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular-, SourceHanSansCN-Regular;
          font-weight: normal;
          color: #000;
        }
        .val {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular-, SourceHanSansCN-Regular;
          font-weight: normal;
          color: @theme;
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
    // margin-right: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
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
