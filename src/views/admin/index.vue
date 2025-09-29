<template>
  <div class="admin-login-page">
    <!-- 头部栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-text">
            <img src="@/assets/img/common/logo.png" alt="" />
          </div>
          <span class="page-title">历史订单查询</span>
        </div>
        <div class="header-right">
          <div class="user-info">
            <i class="el-icon-s-custom"></i>
            <span class="user-name">Name</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="login-form-container">
        <div class="login-form">
          <h2 class="form-title">查询验证</h2>

          <!-- 邮箱输入框 -->
          <div class="input-group">
            <div class="input-wrapper">
              <i class="input-icon">
                <img src="@/assets/img/icon/email.png" alt="" />
              </i>
              <input
                type="email"
                v-model="formData.email"
                placeholder="请输入您生成配置时填写的邮箱"
                class="form-input"
              />
            </div>
          </div>

          <!-- 验证码输入框 -->
          <div class="input-group">
            <div class="input-wrapper">
              <i class="input-icon">
                <img src="@/assets/img/icon/pass.png" alt="" />
              </i>
              <input
                type="text"
                v-model="formData.verificationCode"
                placeholder="请输入验证码"
                class="form-input verification-input"
              />
              <button
                class="send-btn"
                @click="sendVerificationCode"
                :disabled="isSendingCode"
              >
                {{ isSendingCode ? "发送中..." : "发送" }}
              </button>
            </div>
          </div>

          <!-- 登录按钮 -->
          <button
            class="login-btn"
            @click="handleLogin"
            :disabled="!isFormValid"
          >
            登录
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "AdminLogin",
  data() {
    return {
      formData: {
        email: "",
        verificationCode: "",
      },
      isSendingCode: false,
      countdown: 0,
    };
  },
  computed: {
    isFormValid() {
      return this.formData.email && this.formData.verificationCode;
    },
  },
  methods: {
    // 发送验证码
    async sendVerificationCode() {
      if (!this.formData.email) {
        this.$message.error("请先输入邮箱地址");
        return;
      }

      if (!this.validateEmail(this.formData.email)) {
        this.$message.error("请输入有效的邮箱地址");
        return;
      }

      this.isSendingCode = true;

      try {
        const res = await this.$api({
          url: "sendEmail",
          method: "post",
          data: {
            email: this.formData.email,
          },
        });
        if (res.code === 200) {
          this.$message.success("验证码已发送到您的邮箱");
          this.startCountdown();
        } else {
          this.$message.error("发送验证码失败，请重试");
        }
      } catch (error) {
        this.$message.error("发送验证码失败，请重试");
      } finally {
        this.isSendingCode = false;
      }
    },

    // 开始倒计时
    startCountdown() {
      this.countdown = 60;
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    },

    // 验证邮箱格式
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // 处理登录
    async handleLogin() {
      if (!this.isFormValid) {
        this.$message.error("请填写完整信息");
        return;
      }

      try {
        const res = await this.$api({
          url: "login",
          method: "post",
          data: this.formData,
        });
        if (res.code === 200) {
          this.$message.success("登录成功");
        } else {
          this.$message.error("登录失败，请检查验证码是否正确");
        }

        // 保存登录状态
        localStorage.setItem("adminToken", "mock_token");
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            email: this.formData.email,
            name: "Admin User",
          })
        );

        // 跳转到管理页面
        this.$router.push("/admin/dashboard");
      } catch (error) {
        this.$message.error("登录失败，请检查验证码是否正确");
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
