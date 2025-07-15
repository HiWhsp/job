<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    width="500px"
    class="auth-modal"
    @close="handleClose"
  >
    <div class="auth-container">
      <!-- Login Section -->
      <div class="auth-section login-section" v-if="activeTab === 'login'">
        <div class="auth-header">
          <h2>Login</h2>
        </div>

        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="auth-form">
          <el-form-item prop="account">
            <el-input
              v-model="loginForm.account"
              placeholder="Phone/Email"
              size="large"
            ></el-input>
          </el-form-item>

          <el-form-item prop="code" v-if="type === 'code'">
            <div class="code-input-group">
              <el-input
                v-model="loginForm.code"
                placeholder="Verification Code"
                size="large"
              ></el-input>
              <el-button
                plain
                size="large"
                :disabled="codeDisabled"
                @click="getVerifyCode('login')"
                class="code-btn"
              >
                {{ codeText }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item prop="password" v-if="type === 'password'">
            <div class="code-input-group">
              <el-input
                v-model="loginForm.password"
                placeholder="Password"
                size="large"
                show-password
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="loginForm.agree">
              I have read and agree to the <span class="link-text" @click="userAgreement('User Agreement')"
                >Agreement</span
              > and <span class="link-text" @click="userAgreement('Privacy Policy')"
                >Privacy Policy</span
              >
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="width: 100%"
              :loading="loginLoading"
              @click="submitLogin"
            >
              Login
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-footer">
          <div class="forgot-password">
            <span @click="forgotPassword" class="link-text">Forgot Password?</span>
            <span @click="passwordLogin" class="link-text" v-if="type === 'code'"
              >Password Login</span
            >
            <span @click="type = 'code'" class="link-text" v-if="type === 'password'"
              >Code Login</span
            >
          </div>
        </div>
      </div>
      <div class="auth-section login-section" v-if="activeTab === 'forgetPassword'">
        <div class="auth-header">
          <h2>Forgot Password</h2>
        </div>

        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="auth-form">
          <el-form-item prop="account">
            <el-input
              v-model="loginForm.account"
              placeholder="Phone/Email"
              size="large"
            ></el-input>
          </el-form-item>

          <el-form-item prop="code">
            <div class="code-input-group">
              <el-input
                v-model="loginForm.code"
                placeholder="Verification Code"
                size="large"
              ></el-input>
              <el-button
                plain
                size="large"
                :disabled="codeDisabled"
                @click="getVerifyCode('password')"
                class="code-btn"
              >
                {{ codeText }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item prop="password">
            <div class="code-input-group">
              <el-input
                v-model="loginForm.password"
                placeholder="New Password"
                size="large"
                show-password
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="width: 100%"
              :loading="loginLoading"
              @click="submitForgetPassword"
            >
              Reset Password
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-footer">
          <div class="forgot-password">
            <span @click="activeTab = 'login'" class="link-text">Back to Login</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { router } from "@/router";
export default {
  name: "AuthModal",
  props: {
    defaultTab: {
      type: String,
      default: "login",
    },
  },
  data() {
    return {
      type: "code",
      visible: false,
      activeTab: "login",
      loginLoading: false,
      registerLoading: false,
      codeDisabled: false,
      codeText: "Get Code",

      loginForm: {
        account: "",
        code: "",
        agree: false,
      },

      registerForm: {
        username: "",
        phone: "",
        code: "",
        password: "",
        realName: "",
        company: "",
        email: "",
      },

      loginRules: {
        account: [
          { required: true, message: "Please enter phone number or email", trigger: "blur" },
          {
            pattern: /^(1[3-9]\d{9})|(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)$/,
            message: "Please enter a valid phone number or email format",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "Please enter password", trigger: "blur" },
          { min: 6, max: 20, message: "Password length should be 6-20 characters", trigger: "blur" },
        ],
        code: [
          { required: true, message: "Please enter verification code", trigger: "blur" },
          { min: 4, max: 6, message: "Verification code length should be 4-6 characters", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    userAgreement(type) {
      window.open("/protocol?type=" + type, "_blank");
    },

    show(tab = "login") {
      this.activeTab = tab;
      this.visible = true;
      this.resetForms();
    },

    hide() {
      this.visible = false;
    },

    handleClose() {
      this.hide();
      this.$emit("close");
    },

    switchTab(tab) {
      this.activeTab = tab;
      this.resetForms();
    },

    resetForms() {
      this.$nextTick(() => {
        if (this.$refs.loginForm) {
          this.$refs.loginForm.resetFields();
        }
      });
    },

    getVerifyCode(type) {
      const account = this.loginForm.account;
      if (!account) {
        this.$message.warning("Please enter phone number or email first");
        return;
      }
      if (account.includes("@")) {
        if (type == "password") {
          type = 4;
        } else {
          type = 6;
        }
      } else {
        if (type == "password") {
          type = 3;
        } else {
          type = 5;
        }
      }
      this.$api({
        url: "sendCode",
        method: "post",
        data: { account, type },
      }).then((res) => {
        if (res.code == 200) {
          this.startCountdown();
          this.$message.success("Verification code sent successfully");
          this.$emit("get-code", { type, account });
        }
      });
    },

    startCountdown() {
      let count = 60;
      this.codeDisabled = true;
      this.codeText = `${count}s`;

      const timer = setInterval(() => {
        count--;
        if (count > 0) {
          this.codeText = `${count}s`;
        } else {
          this.codeDisabled = false;
          this.codeText = "Get Code";
          clearInterval(timer);
        }
      }, 1000);
    },

    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (!this.loginForm.agree) {
            this.$message.warning("Please agree to the User Agreement first");
            return;
          }

          this.loginLoading = true;

          this.$api({
            url: "web_login",
            method: "post",
            data: {
              account: this.loginForm.account,
              password: this.loginForm.password,
              code: this.loginForm.code,
              type: this.loginForm.account.includes("@") ? 2 : 1,
            },
          })
            .then((res) => {
              if (res.code == 200) {
                this.loginLoading = false;
                this.$message.success("Login successful");
                this.hide();
                this.$emit("login-success", res.data);
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.loginLoading = false;
            });
        }
      });
    },

    forgotPassword() {
      this.activeTab = "forgetPassword";
    },

    passwordLogin() {
      this.type = "password";
      this.$emit("password-login");
    },

    submitForgetPassword() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (!this.loginForm.password) {
            this.$message.warning("Please enter new password first");
            return;
          }
          // Remove spaces from password
          this.loginForm.password = this.loginForm.password.replace(/\s/g, "");
          if (this.loginForm.password.length < 6 || this.loginForm.password.length > 20) {
            this.$message.warning("Password length should be 6-20 characters");
            return;
          }
          this.loginLoading = true;
          this.$api({
            url: "findPassword",
            method: "post",
            data: {
              account: this.loginForm.account,
              password: this.loginForm.password,
              captcha: this.loginForm.code,
              type: this.loginForm.account.includes("@") ? 2 : 1,
            },
          })
            .then((res) => {
              if (res.code == 200) {
                this.loginLoading = false;
                this.$message.success("Password reset successful");
                this.activeTab = "login";
              } else {
                this.loginLoading = false;
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.loginLoading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.auth-modal {
  .el-dialog__header {
    display: none;
  }

  /deep/ .el-dialog__body {
    padding: 0;
  }
}

.auth-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
}

.auth-section {
  flex: 1;
  padding: 0px 60px 40px;
}

.auth-header {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
  margin-bottom: 10px;

  h2 {
    font-size: 26px;
    color: #060606;
    font-weight: 600;
    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 2px;
      background: #33ae60;
    }
  }

  p {
    color: #999;
    font-size: 14px;
  }
}

.switch-link {
  color: #33ae60;
  cursor: pointer;
  text-decoration: underline;
}

.auth-form {
  margin-top: 40px;

  .el-form-item {
    margin-bottom: 20px;
  }

  /deep/ .el-input__inner {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    background-color: #f9f9f9;
    border: none;

    &:focus {
      border: none;
    }
  }
}

.code-input-group {
  display: flex;
  align-items: center;
}

.el-button--large {
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  background: #f9f9f9 !important;
  border: none;
  color: #33ae60 !important;
  &:hover {
    background: #f9f9f9 !important;
    color: #33ae60 !important;
  }
}

.auth-footer {
  text-align: center;
  margin-top: 30px;

  .forgot-password {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;

    span {
      color: #33ae60;
      text-decoration: none;
    }
  }

  .other-login {
    p {
      color: #666;
      margin-bottom: 15px;
      font-size: 14px;
      position: relative;
      &::after {
        content: "";
        display: block;
        width: 140px;
        height: 1px;
        background: rgba(216, 216, 216, 0.5);
        position: absolute;
        top: 50%;
        left: 0;
      }
      &::before {
        content: "";
        display: block;
        width: 140px;
        height: 1px;
        background: rgba(216, 216, 216, 0.5);
        position: absolute;
        top: 50%;
        right: 0;
      }
    }

    .social-login {
      display: flex;
      justify-content: center;

      .social-item {
        width: 46px;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.register-footer {
  text-align: center;
  margin-top: 20px;

  .agreement-text {
    color: #9f9f9f;
    font-size: 12px;
    line-height: 1.5;
  }
}

.link-text {
  color: #33ae60;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #000;
  }
}

.el-checkbox {
  .el-checkbox__label {
    color: #666;
    font-size: 14px;
  }
}

.el-button--primary {
  font-size: 18px;
  height: 50px;
  background: #33ae60 !important;
  border: none !important;
  &:hover {
    background: #33ae60 !important;
  }
}

.el-checkbox {
  /deep/.el-checkbox__inner {
    border: 1px solid #33ae60;
    background: #fff !important;
  }
  /deep/.el-checkbox__input.is-checked .el-checkbox__inner {
    background: #33ae60 !important;
  }

  /deep/ .el-checkbox__label {
    color: #000 !important;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .auth-container {
    margin: 0;
    border-radius: 0;
  }

  .auth-section {
    padding: 20px;
  }

  .auth-form {
    max-width: 100%;
  }

  .code-btn {
    width: 100px;
    font-size: 12px;
  }
}
</style>
