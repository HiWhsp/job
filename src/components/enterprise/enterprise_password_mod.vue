<template>
  <div class="modal-container">
    <el-dialog
      title="修改密码"
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
              <label for="accPass">输入密码</label>
              <input
                id="accPass"
                name="accPass"
                type="password"
                v-model="passwd"
              />
            </div>
            <div class="input-box">
              <label for="accPassC">确认密码</label>
              <input
                id="accPassC"
                name="accPassC"
                type="password"
                v-model="passwdConfirm"
              />
            </div>
            <p class="passError">{{ passWarn }}</p>
          </form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple fit-text" @click="show = false">取消</button>
        <button class="btn-ripple fit-text btn-bg" @click="form_submit()">
          修改
        </button>
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
      passwd: "",
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
      if (this.passwd !== this.passwdConfirm) {
        alert("两次的密码不匹配");
        return;
      } else if (
        this.passwd.length < 8 ||
        !isNaN(this.passwd) ||
        this.passwd.length - this.passwd.replace(/[0-9]/g, "").length === 0
      ) {
        this.passWarn = "密码要求：最低8个字符且为数字与字母/特殊符号的组合";
        return;
      }
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userC_editPassword",
          id: this.info.id,
          password: this.passwd,
        },
      }).then((res) => {
        //console.log("修改密码", res);
        alert(res);
        let { code, data } = res;
        if (code == 200) {
          this.$emit("confirm");
          this.show = false;
        }
      });
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
        flex-direction: column;
        margin-bottom: 8px;
        label {
          font-size: 16px;
          margin-bottom: 8px;
          color: #333;
        }
        input {
          border: 1px solid #eeeeee;
          height: 40px;
          border-radius: 4px;
          font-size: 16px;
          padding-left: 16px;
          padding-right: 16px;
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