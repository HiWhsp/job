<template>
  <div class="modal-container">
    <el-dialog title="确认收货？" width="580px" custom-class="modal-wrap" :close-on-click-modal="false" :visible.sync="show_modal" :before-close="on_before_close">
      <div class="modal-inner">
        <div class="text-2">确认收货后，此售后服务单将完成。</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="quxiao" @click="show_modal = false">取消</button>
        <button class="queding" @click="do_refund_receive()">确定</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "modal-wuliu",
  // components: {},
  // props: [""],
  data() {
    return {
      show_modal: false,
    };
  },
  computed: {
    // ...mapState([""]),
  },
  watch: {},

  mounted() {
    // this.creatQrCode();
  },

  methods: {
    init(info) {
      this.show_modal = true;
      this.refund_id = info.id;
    },

    do_refund_receive() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'refund_qrShouHuo',
          id: this.refund_id,
        },
      }).then(res => {
        alert(res)
        if (res.code == 200) {
          this.$emit("confirm");
          this.show_modal = false;
        }
      })
    },

    on_before_close() {
      this.show_modal = false;
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
  background: #7853B2;

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
    background: #7853B2;
    color: #fff;
  }
}
</style>
