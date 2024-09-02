<template>
  <div class="modal-container">
    <el-dialog title="确认收货？" width="580px" custom-class="modal-wrap" :close-on-click-modal="false" :visible.sync="showModal" :before-close="onModal_close">
      <div class="modal-inner">
        <div class="text-2">确认收货后，此售后服务单将完成。</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="quxiao" @click="showModal = false">取消</button>
        <button class="queding" @click="refund_receive">确定</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "modal-wuliu",
  components: {},
  props: [""],
  data() {
    return {
      showModal: false,
      company: "",
      code: "",
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {},

  mounted() {
    // this.creatQrCode();
  },

  methods: {
    init(refund_id) {
      this.showModal = true;
      this.refund_id = refund_id;
    },

    refund_receive() {
      this.$api("refund_qrShouHuo", {
        id: this.refund_id,
      }).then((res) => {
        let { code, data, msg} = res;
        if (code == 200) {
          // this.$emit("updateView");
          this.$parent.setView();
          this.showModal = false;
        }
      });
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

    .text-1 {
      font-weight: bold;
      font-size: 20px;
      color: #ff3d00;
    }
    .text-2 {
      text-align: center;
      font-size: 14px;
      color: #333333;
      margin-bottom: 20px;
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
    width: 180px;
    height: 35px;
    background: #ff3d00;
    opacity: 1;
    border-radius: 15px;
  }

  .quxiao {
    background: #fff;
    color: #000;
    border: 1px solid #aaa;
  }

  .queding {
    margin-left: 20px;
    background: #4CA5E4;
    color: #fff;
  }
}
</style>
