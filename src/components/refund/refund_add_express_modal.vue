<template>
  <div class="modal-container">
    <el-dialog title="输入邮寄信息" width="600px" custom-class="modal-wrap" :close-on-click-modal="false"
      :visible.sync="show_modal" :before-close="on_before_close">
      <div class="modal-inner">
        <div class="company-item">
          <div class="label">快递公司：</div>
          <div class="input-box">
            <el-input clearable type="text" v-model="params.kuaidiCompany" placeholder="请输入您邮寄商品的快递公司" />
          </div>
        </div>
        <div class="company-item">
          <div class="label">物流单号：</div>
          <div class="input-box">
            <el-input clearable type="text" v-model="params.kuaidiOrderId" placeholder="请输入您邮寄商品的快递单号" />
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="btns flex-center">
          <button class="btn btn-ripple btn-bg" @click="do_submit_wuliu()">提交</button>
          <button class="btn btn-ripple" @click="show_modal = false">取消</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "refund_add_express_modal",
  components: {},
  // props: [""],
  data() {
    return {
      show_modal: false,
      params: {
        id: '',
        kuaidiCompany: '',
        kuaidiOrderId: ''
      }
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
      this.params.id = info.id
      this.show_modal = true
    },
    do_submit_wuliu() {
      if (!this.params.kuaidiCompany) {
        return alertErr("请输入快递公司");
      }
      if (!this.params.kuaidiOrderId) {
        return alertErr("请输入快递单号");
      }

      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'refund_addKuaidi',
          ...this.params
        },
      }).then(res => {
        alert(res)
        if (res.code == 200) {
          this.$emit('confirm')
          this.show_modal = false
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
    padding: 10px 40px;

    .company-item {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }


      .label {
        width: 100px;
        text-align: right;
        font-size: 14px;
        color: #333333;
      }

      .input-box {
        flex: 1;

        input {
          width: 100%;
          border: 1px solid #eee;
          height: 40px;
          padding-left: 20px;
          font-family: OPPPSans;
          font-weight: 400;
          font-size: 14px;
          color: #676767;
        }
      }

    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  background: #ea5959;
  background: #eee;

  .el-dialog__title {
    color: #000;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #000;
  }
}

/deep/ .el-dialog__footer {
  text-align: center;


  .btn {
    margin: 0 10px;
    width: 104px;
    height: 40px;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #009F39;
    font-family: OPPPSans;
    font-weight: 400;
    font-size: 14px;
    color: #009F39;
  }

  .btn-bg {
    width: 104px;
    height: 40px;
    background: #009F39;
    border-radius: 4px 4px 4px 4px;
    font-family: OPPPSans;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
  }


}
</style>
