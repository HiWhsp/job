<template>
  <div class="modal-container">
    <el-dialog
      title="填写快递"
      width="500px"
      custom-class="modal-wrap"
      :close-on-click-modal="false"
      :visible.sync="showModal"
      :before-close="onModal_close"
    >
      <div class="modal-inner">
        <div class="text-2">
          <div class="label">快递公司</div>
          <input type="text" v-model="company" />
        </div>
        <div class="text-2">
          <div class="label">物流单号</div>
          <input type="text" v-model="code" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="queding" @click="submit_wuliu">提交</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import refund from "@/shop-actions/refund";

import { mapState } from "vuex";

export default {
  name: "modal-wuliu",
  components: {},
  props: ["curr"],
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
    submit_wuliu() {
      let { company, code } = this;
      if (!company) {
        alertErr("请输入物流公司");
        return;
      }
      if (!code) {
        alertErr("请输入快递单号");
        return;
      }

      refund.refund_addKuaidi({
        params: {
          id: this.$route.query.refund_id,
          kuaidi_company: company,
          kuaidi_orderId: code,
        },
        success: (data) => {
          this.$parent.updateView();
          this.showModal = false;
        },
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
      font-size: 14px;
      color: #333333;
      margin-bottom: 20px;

      .flex();

      .label {
        width: 100px;
      }
      input {
        flex: 2;
        border: 1px solid #eee;
        height: 30px;
        padding-left: 20px;
      }
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  background: #ea5959;

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
    border-radius: 45px;
  }

  .queding {
    background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
    color: #fff;
  }
}
</style>
