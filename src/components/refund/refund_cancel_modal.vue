<template>
  <div class="modal-container">
    <el-dialog title="Cancel After-sale？" width="580px" custom-class="modal-wrap" :close-on-click-modal="false"
      :visible.sync="show_modal" :before-close="on_before_close">
      <div class="modal-inner">
        <div class="text-2">Confirm to cancel the after-sale application？</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="quxiao" @click="show_modal = false">Cancel</button>
        <button class="queding" @click="do_submit()">Confirm</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "modal-wuliu",
  components: {},
  // props: ["curr"],
  data() {
    return {
      show_modal: false,
      refund_id: ''
    };
  },
  computed: {
    // ...mapState([""]),
  },
  watch: {},
  mounted() {

  },
  methods: {
    init(info) {
      this.show_modal = true;
      this.refund_id = info.id;
    },
    do_submit() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'refund_qxRefund',
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
      font-size: 20px;
      color: #333333;
      margin-bottom: 20px;
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  background: #00306B;
  padding-top: 10px;

  .el-dialog__title {
    color: #fff;
  }

  .el-dialog__headerbtn {
    top: 15px;
    color: #fff;
  }
  .el-dialog__headerbtn .el-dialog__close {
    font-size: 20px;
    color: #fff;
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  button {
    width: 180px;
    height: 50px;
    background: #ff3d00;
    opacity: 1;
    border-radius: 10px;
  }

  .quxiao {
    font-size: 20px;
    background: #fff;
    color: #000;
    border: 1px solid #aaa;
  }

  .queding {
    margin-left: 20px;
    font-size: 20px;
    background: #00306B;
    color: #fff;
  }
}
</style>
