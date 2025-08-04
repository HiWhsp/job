<template>
  <div class="modal-container">
    <el-dialog
      title="审核驳回"
      width="596px"
      custom-class="modal-custom"
      :close-on-click-modal="false"
      :visible.sync="show"
      :before-close="onModalClose"
    >
      <div class="modal-inner">
        <div class="modal-ctx">
          <form action="">
            <div class="input-box">
              <label for="accPass">驳回原因：</label>
              <textarea
                id="accPass"
                name="accPass"
                type="password"
                placeholder="请输入驳回原因"
                v-model="remark"
              />
            </div>
          </form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple fit-text btn-bg" @click="form_submit()">
          确定
        </button>
        <button class="btn-ripple fit-text" @click="show = false">取消</button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
import { mapState } from "vuex";

export default {
  name: "reg-type-modal",
  components: {},
  // props: [""],
  data() {
    return {
      show: false,
      remark: "",
      passwdConfirm: "",
      passWarn: "",
      info: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    init(info) {
      this.show = true;
      this.info = info;
      console.log(info);
    },
    onModalClose() {
      this.show = false;
    },

    onConfirm() {
      this.show = false;
      this.$router.back();
    },

    form_submit() {
      this.$emit("confirm", this.remark);
      this.show = false;
    },
  },
};
</script>
  
  <style scoped lang="less">
/deep/ .modal-custom {
  .modal-inner {
    padding: 0;
  }

  .modal-ctx {
    form {
      .input-box {
        display: flex;
        margin-bottom: 8px;
        label {
          font-size: 16px;
          margin-bottom: 8px;
          color: #333;
          margin-right: 16px;
          flex-shrink: 0;
          margin-top: 16px;
        }
        textarea {
          border: 1px solid #eeeeee;
          height: 128px;
          border-radius: 4px;
          width: 100%;
          font-size: 16px;
          padding: 16px;
          resize: none;
        }
      }
      .passError {
        height: 18px;
        color: red;
      }
    }
  }
}

/deep/ .el-dialog__header {
  text-align: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #f7f7f7;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 70px 60px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 50px;

  button {
    min-width: 120px;
    height: 32px;
    background: #ffffff;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid #3B64FC;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #3B64FC;

    & + button {
      margin-left: 20px;
    }
  }

  .btn-bg {
    background: #3B64FC;
    color: #ffffff;
  }
}

.btn-send {
  // position: absolute;
  // right: -50px;
  // top: 10px;
  min-width: 90px;
  padding: 0 10px;
  height: 40px;
  background: #fff;
  color: #3B64FC;
  font-size: 14px;
  margin-left: 15px;
  border-radius: 5px;

  &:disabled {
    background: #eee;
    color: #999;
    cursor: not-allowed;
  }
}
</style>
  
  <style scoped lang="less" src="@/assets/h5css/modals/phone_bind_modal.less"></style>