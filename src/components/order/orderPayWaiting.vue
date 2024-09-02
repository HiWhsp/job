<template>
  <div class="modal-container">
    <el-dialog
      title="操作提示"
      width="500px"
      custom-class="modal-wrap"
      :close-on-click-modal="true"
      :visible.sync="show"
      :before-close="onModal_close"
    >
      <div class="modal-inner">
        <div class="text-box">
          <img src="@/static/product/product-add-success.png" alt />
          支付结果查询中，请稍后...
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="quxiao" @click="show = false">取消</button>
        <button class="queding" @click="modalConfirm">确认</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "order-pay-waiting",
  components: {},
  props: ["curr"],
  data() {
    return {
      show: false,
      order: {},
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {},

  methods: {
    onModal_close() {
      this.$parent.clearTimer();
      this.show = false;
    },
    //确认收货
    modalConfirm() {
      this.show = false;
    },
  },
};
</script>


<style scoped lang="less">
.modal-wrap {
  .modal-inner {
    padding: 20px;
    .img-box {
      img {
        width: 150px;
        height: 150px;

        & > img {
          margin-left: 20px;
        }
      }
    }
    .text-box {
      margin-top: 20px;
      flex: 2;
      text-align: center;
      .flex-center();
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #333333;

      img {
        width: 25px;
        margin-right: 10px;
      }
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  background: #4CA5E4;

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
    border-radius: 40px;
  }

  .quxiao {
    margin-right: 20px;
  }
  .queding {
    background: linear-gradient(90deg, #ff9312 0%, #ea5959 100%);
    color: #fff;
  }
}
</style>
