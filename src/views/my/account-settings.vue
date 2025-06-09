<template>
  <div class="page">
    <div class="main-title">
      <span>账号设置</span>
    </div>

    <div class="page-ctx" v-if="!showChangePhoneForm && !showChangePasswordForm">
      <div class="setting-item">
        <div class="item-label">手机</div>
        <div class="item-content">{{ vuex_user.mobile }}</div>
        <div class="item-action">
          <span class="action-link" @click="showChangePhone">换绑手机号</span>
        </div>
      </div>

      <div class="setting-item">
        <div class="item-label">密码</div>
        <div class="item-action">
          <span class="action-link" @click="showChangePassword">修改密码</span>
        </div>
      </div>

      <div class="setting-item">
        <div class="item-label">微信</div>
        <div class="item-content">未绑定微信，绑定后可直接扫码登录</div>
        <div class="item-action">
          <span class="action-btn">绑定</span>
        </div>
      </div>
    </div>

    <!-- 换绑手机号表单 -->
    <div class="change-phone-form" v-if="showChangePhoneForm">
      <div class="form-item">
        <div class="form-label">旧手机号：</div>
        <input
          type="text"
          class="form-input"
          placeholder="请输入旧手机号"
          v-model="oldPhone"
          disabled
        />
      </div>

      <div class="form-item">
        <div class="form-label">新手机号：</div>
        <input
          type="text"
          class="form-input"
          placeholder="请输入新手机号"
          v-model="newPhone"
          @input="() => (newPhone = newPhone.replace(/\D/g, ''))"
          maxLength="11"
        />
      </div>

      <div class="form-item">
        <div class="form-label">验证码：</div>
        <input
          type="text"
          class="form-input verification-input"
          placeholder="请输入验证码"
          v-model="verificationCode"
        />
        <button class="get-code-btn" @click="getVerificationCode">获取验证码</button>
      </div>

      <div class="form-buttons">
        <button class="confirm-btn" @click="confirmChange">确认</button>
        <button class="cancel-btn" @click="cancelChange">取消</button>
      </div>
    </div>

    <!-- 修改密码表单 -->
    <div class="change-password-form" v-if="showChangePasswordForm">
      <div class="form-item">
        <div class="form-label">旧密码：</div>
        <input
          type="text"
          class="form-input"
          placeholder="请输入旧密码"
          v-model="oldPassword"
        />
      </div>

      <div class="form-item">
        <div class="form-label">新密码：</div>
        <input
          type="text"
          class="form-input"
          placeholder="请输入新密码"
          v-model="newPassword"
        />
      </div>

      <div class="form-item">
        <div class="form-label">确认新密码：</div>
        <input
          type="text"
          class="form-input"
          placeholder="请输入确认新密码"
          v-model="confirmPassword"
        />
      </div>

      <div class="form-buttons">
        <button class="confirm-btn" @click="confirmChangePassword">确认</button>
        <button class="cancel-btn" @click="cancelChangePassword">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      showChangePhoneForm: false,
      showChangePasswordForm: false,
      oldPhone: "",
      newPhone: "",
      verificationCode: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  },
  computed: {
    ...mapState(["vuex_user"]),
  },
  watch: {
    vuex_user: {
      handler(newVal) {
        this.oldPhone = newVal.mobile;
      },
    },
  },
  mounted() {
    this.oldPhone = this.vuex_user.mobile;
  },
  methods: {
    showChangePhone() {
      this.showChangePhoneForm = true;
    },
    confirmChange() {
      if (!this.newPhone) {
        this.$message.warning("请输入新手机号");
        return;
      }
      if (!this.verificationCode) {
        this.$message.warning("请输入验证码");
        return;
      }
      if (this.newPhone == this.oldPhone) {
        this.$message.warning("新手机号不能与旧手机号相同");
        return;
      }
      this.$api({
        url: "changePhone",
        method: "post",
        data: {
          mobile: this.newPhone,
          old_moibile: this.oldPhone,
          code: this.verificationCode,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("换绑手机号成功");
        }
      });
    },
    // 确认换绑手机号
    showChangePassword() {
      this.showChangePasswordForm = true;
    },
    // 取消换绑手机号
    cancelChange() {
      this.showChangePhoneForm = false;
      // 清空表单数据
      this.oldPhone = "";
      this.newPhone = "";
      this.verificationCode = "";
    },

    // 确认修改密码
    confirmChangePassword() {
      if (!this.oldPassword) {
        this.$message.warning("请输入旧密码");
        return;
      }
      if (!this.newPassword) {
        this.$message.warning("请输入新密码");
        return;
      }
      if (this.newPassword != this.confirmPassword) {
        this.$message.warning("新密码与确认密码不一致");
        return;
      }
      this.$api({
        url: "resetpassword",
        method: "post",
        data: {
          old_password: this.oldPassword,
          password: this.newPassword,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("修改密码成功");
          this.showChangePasswordForm = false;
          this.oldPassword = "";
          this.newPassword = "";
          this.confirmPassword = "";
        }
      });
    },
    // 取消修改密码
    cancelChangePassword() {
      this.showChangePasswordForm = false;
    },
    // 获取验证码
    getVerificationCode() {
      this.$api({
        url: "send",
        method: "post",
        data: { mobile: this.newPhone, type: "change" },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("验证码发送成功");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }

  .page-ctx {
    min-height: 400px;
    margin-top: 14px;
    padding: 0;
    background: #fff;

    .setting-item {
      display: flex;
      align-items: center;
      padding: 40px 30px 0 40px;

      &:last-child {
        border-bottom: none;
      }

      .item-label {
        width: 60px;
        font-size: 16px;
        color: #000;
        font-weight: normal;
      }

      .item-content {
        font-size: 16px;
        color: #999999;
        margin-right: 20px;
      }

      .item-action {
        .action-link {
          font-size: 16px;
          color: #005aac;
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }
        }

        .action-btn {
          font-size: 16px;
          color: #005aac;
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }

  .change-phone-form,
  .change-password-form {
    margin-top: 14px;
    padding: 40px;
    background: #fff;

    .form-item {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      .form-label {
        width: 80px;
        font-size: 16px;
        color: #000;
        margin-right: 20px;
      }

      .form-input {
        width: 400px;
        height: 40px;
        padding: 0 15px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        font-size: 16px;
        outline: none;

        &:focus {
          border-color: #005aac;
        }

        &::placeholder {
          color: #999;
        }
      }

      .verification-input {
        margin-right: 15px;
      }

      .get-code-btn {
        width: 100px;
        height: 40px;
        background: none;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        color: #ff8800;
        font-size: 14px;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }
    }

    .form-buttons {
      display: flex;
      gap: 20px;
      margin-top: 40px;
      margin-left: 100px;

      .confirm-btn {
        width: 80px;
        height: 40px;
        background: #005aac;
        border: none;
        border-radius: 4px;
        color: #fff;
        font-size: 16px;
        cursor: pointer;

        &:hover {
          opacity: 0.9;
        }
      }

      .cancel-btn {
        width: 80px;
        height: 40px;
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        color: #666;
        font-size: 16px;
        cursor: pointer;

        &:hover {
          border-color: #005aac;
          color: #005aac;
        }
      }
    }
  }
  .change-password-form {
    .form-label {
      width: 100px !important;
    }
    .form-buttons {
      margin-left: 120px !important;
    }
  }
}
</style>
