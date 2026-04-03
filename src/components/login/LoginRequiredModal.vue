<template>
  <transition name="login-required-fade">
    <div v-show="visible" class="login-required-mask" @click.self="close">
      <div class="login-required-dialog" role="dialog" aria-modal="true">
        <!-- <button type="button" class="login-required-close" aria-label="Close" @click="close">
          ×
        </button> -->
        <div class="login-required-body">
          <div class="login-required-icon-wrap">
            <img src="@img/common/login-success.png" alt="login-required-icon">
          </div>
          <p class="login-required-msg">{{ message }}</p>
        </div>
        <button type="button" class="login-required-btn" @click="onAction">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "LoginRequiredModal",
  model: {
    prop: "visible",
    event: "update:visible",
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "Please register and log in first",
    },
    buttonText: {
      type: String,
      default: "LOGIN OR REGISTER",
    },
    /** 点击主按钮后跳转的路由 path */
    loginPath: {
      type: String,
      default: "/login",
    },
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    onAction() {
      this.$emit("action");
      this.$emit("update:visible", false);
      if (this.$router && this.loginPath) {
        this.$router.push(this.loginPath);
      }
    },
  },
};
</script>

<style scoped lang="less">
.login-required-fade-enter-active,
.login-required-fade-leave-active {
  transition: opacity 0.2s ease;
}

.login-required-fade-enter,
.login-required-fade-leave-to {
  opacity: 0;
}

.login-required-fade-enter-active .login-required-dialog,
.login-required-fade-leave-active .login-required-dialog {
  transition: transform 0.2s ease;
}

.login-required-fade-enter .login-required-dialog,
.login-required-fade-leave-to .login-required-dialog {
  transform: scale(0.96);
}

@orange: #f1743a;

.login-required-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
}

.login-required-dialog {
  position: relative;
  width: 600px;
  height: 386px;
  padding: 105px 63px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
}

.login-required-close {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 32px;
  line-height: 1;
  color: #999;
  cursor: pointer;

  &:hover {
    color: #666;
  }
}

.login-required-body {
  display: flex;
  align-items: start;
  gap: 16px;
  margin-bottom: 28px;
  padding-right: 20px;
}

.login-required-icon-wrap {
  width: 33px;
  height: 33px;

  img {
    width: 100%;
    height: 100%;
  }
}

.login-required-msg {
  width: 411px;
  height: 63px;
  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 24px;
  color: #1E262E;
  line-height: 30px;
}

.login-required-btn {
  width: 224px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EC6A2B;
  border-radius: 6px 6px 6px 6px;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 20px;
  color: #FFFFFF;
}
</style>
