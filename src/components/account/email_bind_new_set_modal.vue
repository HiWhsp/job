<template>
  <div class="modal-container">
    <el-dialog
      :title="null"
      width="920px"
      custom-class="modal-custom phone-change-modal"
      :close-on-click-modal="false"
      :visible.sync="show"
      :before-close="onModalClose"
      :show-close="true"
    >
      <!-- 自定义标题 -->
      <div slot="title" class="modal-title">
        <span class="title-text">Change Email：</span>
      </div>

      <div class="modal-inner">
        <div class="modal-ctx">
          <div class="input-box">
            <div class="label">Previous Email :</div>
            <div class="input-item">
              <el-input type="text" v-model="oldEmail" placeholder="Please enter" />
            </div>
          </div>

          <div class="input-box">
            <div class="label">New Email :</div>
            <div class="input-item">
              <el-input type="text" v-model="newEmail" placeholder="Please enter" />
            </div>
          </div>

          <div class="input-box">
            <div class="label">Verification code :</div>
            <div class="input-item">
              <el-input
                type="text"
                v-model="code"
                placeholder="Enter the verification code sent to your email"
              />
              <button class="btn-obtain" @click="query_code()" :disabled="disabledBtn">
                Obtain
                <span v-if="disabledBtn && time > 0">（{{ time }}）</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <button class="btn-confirm" @click="form_submit()">CONFIRM</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "modal-hetong",
  components: {},
  props: ["curr"],
  data() {
    return {
      show: false,

      oldEmail: "",
      newEmail: "",
      code: "",

      disabledBtn: false, //按钮是否可点击
      timer: null, //定时器 验证码
      timeTotal: 60, //验证码总时长
      time: 60 //验证码倒计时
    };
  },
  computed: {
    ...mapState({
      vuex_user: state => state.vuex_user || {}
    }),
    currentUserPhone() {
      return this.vuex_user?.phone || "";
    },
    currentUserEmail() {
      return this.vuex_user?.email || "";
    }
  },
  watch: {
    show(val) {
      if (!val) {
        this.oldEmail = "";
        this.newEmail = "";
        this.code = "";
        // 重置倒计时相关状态
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.time = this.timeTotal;
        this.disabledBtn = false;
      }
    }
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    query_code() {
      //console.log("发送验证码");
      let email = this.newEmail;
      if (this.timer) {
        alertErr("验证码发送频繁，请稍后再试");
        return;
      }
      let emailReg = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
      if (!emailReg.test(email)) {
        alertErr("请先输入正确的邮箱");
        return;
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "login_emailYzm",
          email: email
        }
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          alertSucc("The verification code has been sent to your email.");
          this.countdown();
        } else {
          clearInterval(this.timer);
          this.timer = null;
          this.disabledBtn = false;
        }
      });
    },

    //倒计时
    countdown() {
      let that = this;
      this.disabledBtn = true;
      // 重置倒计时时间
      this.time = this.timeTotal;

      this.timer = setInterval(() => {
        if (that.time > 0) {
          that.time--;
        } else {
          that.time = that.timeTotal;
          clearInterval(that.timer);
          that.timer = null;
          that.disabledBtn = false;
        }
      }, 1000);
    },

    init(text) {
      this.oldEmail = this.currentUserEmail;
      this.show = true;
    },
    onModalClose() {
      // 清除定时器
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.time = this.timeTotal;
      this.disabledBtn = false;
      this.show = false;
    },

    onConfirm() {
      this.show = false;
      this.$router.back();
    },

    form_submit() {
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
      let is_true_email = reg_email.test(this.newEmail);

      if (!is_true_email) {
        alertErr("请输入正确的邮箱");
        return;
      }
      if (!this.code) {
        alertErr("请输入验证码");
        return;
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_setNew",
          editType: "2", //类型：1-手机号 2-邮箱
          code: this.code,
          email: this.newEmail
        }
      }).then(res => {
        //console.log("修改密码", res);
        alert(res);
        let { code } = res;
        if (code == 200) {
          this.$emit("confirm");
          this.show = false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
// 标题样式
/deep/ .phone-change-modal {
  .modal-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-text {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      font-family: Poppins, Poppins;
    }
  }

  .el-dialog__headerbtn {
    top: 20px;
    right: 24px;
    font-size: 20px;
    color: #333;

    .el-dialog__close {
      font-size: 20px;
      color: #333;
    }
  }
}

/deep/ .modal-custom {
  .modal-inner {
    padding: 0;
  }

  .modal-ctx {
    .input-box {
      margin-bottom: 24px;
      position: relative;
      display: flex;
      align-items: center;

      .label {
        width: 220px;
        font-size: 17px;
        color: #1e262e;
        font-weight: 400;
        text-align: right;
        margin-right: 20px;
      }

      .input-item {
        flex: 1;
        display: flex;
        align-items: center;

        .el-input {
          .el-input__inner {
            height: 56px;
            line-height: 56px;
            padding: 0 16px;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            font-size: 17px;
            color: #333;
            background: #fbfbfb;

            &::placeholder {
              color: #999;
            }
          }
        }
      }
    }
  }
}

/deep/ .el-dialog__body {
  padding: 40px 60px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding: 0px 60px 50px;

  .btn-confirm {
    min-width: 200px;
    height: 50px;
    background: #ff6b35;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #e55a2b;
    }

    &:active {
      background: #cc4f24;
    }
  }
}

.btn-obtain {
  width: 105px;
  height: 56px;
  background: #00306b;
  border-radius: 0px 6px 6px 0px;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  line-height: 20px;
  text-align: center;

  &:hover:not(:disabled) {
    background: #002855;
  }

  &:active:not(:disabled) {
    background: #001f3f;
  }

  &:disabled {
    background: #ccc;
    color: #999;
    cursor: not-allowed;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/phone_bind_modal.less"></style>
