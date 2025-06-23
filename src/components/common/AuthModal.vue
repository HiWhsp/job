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
      <!-- 登录部分 -->
      <div class="auth-section login-section" v-if="activeTab === 'login'">
        <div class="auth-header">
          <h2>登录</h2>
        </div>

        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="auth-form">
          <el-form-item prop="account">
            <el-input
              v-model="loginForm.account"
              placeholder="手机号码/邮箱"
              size="large"
            ></el-input>
          </el-form-item>

          <el-form-item prop="code" v-if="type === 'code'">
            <div class="code-input-group">
              <el-input
                v-model="loginForm.code"
                placeholder="验证码"
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
                placeholder="密码"
                size="large"
                show-password
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="loginForm.agree">
              已阅读并同意<span class="link-text">用户协议</span>和<span class="link-text"
                >隐私收集</span
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
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-footer">
          <div class="forgot-password">
            <span @click="forgotPassword" class="link-text">忘记密码？</span>
            <span @click="passwordLogin" class="link-text" v-if="type === 'code'"
              >密码登录</span
            >
            <span @click="type = 'code'" class="link-text" v-if="type === 'password'"
              >验证码登录</span
            >
          </div>
        </div>
      </div>

      <!-- 注册部分 -->
      <div class="auth-section register-section" v-if="activeTab === 'register'">
        <div class="auth-header">
          <h2>注册</h2>
          <p>
            （已有账号？<span @click="switchTab('login')" class="switch-link"
              >点击登录</span
            >）
          </p>
        </div>

        <el-form
          :model="registerForm"
          :rules="registerRules"
          ref="registerForm"
          class="auth-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入昵称"
              size="large"
            ></el-input>
          </el-form-item>

          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              size="large"
            ></el-input>
          </el-form-item>

          <el-form-item prop="code">
            <div class="code-input-group">
              <el-input
                v-model="registerForm.code"
                placeholder="验证码"
                size="large"
              ></el-input>
              <el-button
                plain
                size="large"
                :disabled="codeDisabled"
                @click="getVerifyCode('register')"
                class="code-btn"
              >
                {{ codeText }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item prop="realName">
            <el-input
              v-model="registerForm.realName"
              placeholder="请输入真实姓名"
              size="large"
            ></el-input>
          </el-form-item>

          <el-form-item prop="company">
            <el-input
              v-model="registerForm.company"
              placeholder="请输入公司全称"
              size="large"
            ></el-input>
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱地址"
              size="large"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="width: 100%"
              :loading="registerLoading"
              @click="submitRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-footer">
          <p class="agreement-text">
            注册即表示你已阅读并同意
            <span class="link-text">《注册协议与隐私政策》</span>
          </p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
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
      codeText: "获取验证码",

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
          { required: true, message: "请输入手机号码或邮箱", trigger: "blur" },
          {
            pattern: /^(1[3-9]\d{9})|(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)$/,
            message: "请输入正确的手机号码或邮箱格式",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "密码长度为6-20位", trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 6, message: "验证码长度为4-6位", trigger: "blur" },
        ],
      },

      registerRules: {
        username: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 2, max: 20, message: "昵称长度为2-20个字符", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号格式",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 6, message: "验证码长度为4-6位", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "密码长度为6-20位", trigger: "blur" },
        ],
        realName: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
        company: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
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
        if (this.$refs.registerForm) {
          this.$refs.registerForm.resetFields();
        }
      });
    },

    getVerifyCode(type) {
      const form = type === "login" ? this.loginForm : this.registerForm;
      const account = type === "login" ? form.account : form.phone;

      if (!account) {
        this.$message.warning(
          type === "login" ? "请先输入手机号码或邮箱" : "请先输入手机号"
        );
        return;
      }
      this.$api({
        url: "send",
        method: "post",
        data: { mobile: account, type: type },
      }).then((res) => {
        if (res.code == 200) {
          this.startCountdown();
          this.$message.success("验证码已发送");
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
          this.codeText = "获取验证码";
          clearInterval(timer);
        }
      }, 1000);
    },

    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (!this.loginForm.agree) {
            this.$message.warning("请先同意用户协议");
            return;
          }

          this.loginLoading = true;

          this.$api({
            url: "web_login",
            method: "post",
            data: {
              username: this.loginForm.account,
              password: this.loginForm.password,
              code: this.loginForm.code,
              type: this.type === "code" ? 2 : 1,
            },
          })
            .then((res) => {
              if (res.code == 200) {
                this.loginLoading = false;
                this.$message.success("登录成功");
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

    submitRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.registerLoading = true;

          this.$api({
            url: "register",
            method: "post",
            data: {
              name: this.registerForm.username,
              mobile: this.registerForm.phone,
              password: this.registerForm.password,
              real_name: this.registerForm.realName,
              company_title: this.registerForm.company,
              email: this.registerForm.email,
              code: this.registerForm.code,
            },
          }).then((res) => {
            if (res.code == 200) {
              this.registerLoading = false;
              this.$message.success("注册成功");
              this.hide();
              this.$emit("register-success", this.registerForm);
            }
          });
        }
      });
    },

    forgotPassword() {
      this.$message.info("忘记密码功能");
      this.$emit("forgot-password");
    },

    passwordLogin() {
      this.type = "password";
      this.$emit("password-login");
    },

    wechatLogin() {
      this.$message.info("微信登录功能");
      this.$emit("wechat-login");
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
  color: #000;
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
