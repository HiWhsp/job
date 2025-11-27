<template>
  <el-dialog
    title="请填写您的信息"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose"
    custom-class="user-info-dialog"
  >
    <!-- 描述信息 -->
    <div class="dialog-description">
      提交后系统会自动将PDF配置单发送至您的邮箱，您也可以在提交后的页面直接下载。
    </div>

    <!-- 用户信息输入区域 -->
    <div class="dialog-content">
      <!-- 联系人 -->
      <div class="input-group">
        <div class="input-label">
          <i class="el-icon-user"></i>
          联系人
        </div>
        <el-input
          v-model="formData.name"
          placeholder="请输入联系人姓名"
          class="user-input"
        ></el-input>
      </div>

      <!-- 手机号 -->
      <div class="input-group">
        <div class="input-label">
          <i class="el-icon-phone"></i>
          手机号
        </div>
        <div class="input-wrapper">
          <el-input
            v-model="formData.mobile"
            @input="handleMobileInput"
            @blur="validateMobile"
            maxLength="11"
            placeholder="请输入手机号码"
            class="user-input"
          ></el-input>
          <div v-if="errors.mobile" class="error-message">
            {{ errors.mobile }}
          </div>
        </div>
      </div>

      <!-- 邮箱 -->
      <div class="input-group">
        <div class="input-label">
          <i class="el-icon-message"></i>
          邮箱
        </div>
        <div class="input-wrapper">
          <el-input
            v-model="formData.email"
            @input="validateEmail"
            @blur="validateEmail"
            placeholder="请输入邮箱地址"
            class="user-input"
          ></el-input>
          <div v-if="errors.email" class="error-message">
            {{ errors.email }}
          </div>
        </div>
      </div>

      <!-- 所属单位 -->
      <div class="input-group">
        <div class="input-label">
          <i class="el-icon-office-building"></i>
          所属单位
        </div>
        <el-input
          v-model="formData.company"
          placeholder="请输入所属单位"
          class="user-input"
        ></el-input>
      </div>

      <!-- 验证码 -->
      <div class="input-group captcha-group">
        <div class="input-label">
          <i class="el-icon-lock"></i>
          验证码
        </div>
        <div class="captcha-input-wrapper">
          <el-input
            v-model="captchaInput"
            placeholder="请输入验证码"
            class="captcha-input"
            @keyup.enter="handleSubmit"
          ></el-input>
          <div class="captcha-container">
            <canvas
              ref="captchaCanvas"
              width="80"
              height="50"
              aria-label="验证码"
              class="captcha-canvas"
              @click="refreshCaptcha"
            ></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" class="submit-button">
        提交
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "UserInfoDialog",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        name: "",
        mobile: "",
        email: "",
        company: "",
      },
      errors: {
        mobile: "",
        email: "",
        captcha: "",
      },
      captchaInput: "",
      currentCaptchaCode: "",
      canvasContext: null,
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  mounted() {
    this.initCaptcha();
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.initCaptcha();
        });
      }
    },
  },
  methods: {
    // 手机号输入处理（限制只能输入数字）
    handleMobileInput() {
      this.formData.mobile = this.formData.mobile.replace(/\D/g, "");
      this.validateMobile();
    },
    // 验证手机号
    validateMobile() {
      const mobile = this.formData.mobile;
      if (!mobile) {
        this.errors.mobile = "";
        return false;
      }
      if (mobile.length < 11) {
        this.errors.mobile = "手机号码长度不足11位";
        return false;
      }
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(mobile)) {
        this.errors.mobile = "请输入正确的手机号码格式";
        return false;
      }
      this.errors.mobile = "";
      return true;
    },
    // 验证邮箱
    validateEmail() {
      const email = this.formData.email;
      if (!email) {
        this.errors.email = "";
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.errors.email = "请输入正确的邮箱格式";
        return false;
      }
      this.errors.email = "";
      return true;
    },
    handleClose() {
      this.visible = false;
      this.resetForm();
    },
    handleSubmit() {
      // 表单验证
      if (!this.formData.name) {
        this.$message.error("请输入联系人姓名");
        return;
      }

      if (!this.formData.mobile) {
        this.$message.error("请输入手机号码");
        return;
      }
      // 验证手机号格式
      if (!this.validateMobile()) {
        this.$message.error(this.errors.mobile || "请输入正确的手机号码");
        return;
      }

      if (!this.formData.email) {
        this.$message.error("请输入邮箱地址");
        return;
      }
      // 验证邮箱格式
      if (!this.validateEmail()) {
        this.$message.error(this.errors.email || "请输入正确的邮箱格式");
        return;
      }

      if (!this.formData.company) {
        this.$message.error("请输入所属单位");
        return;
      }

      // 验证验证码
      if (!this.validateCaptcha()) {
        this.$message.error(this.errors.captcha || "验证码错误");
        return;
      }

      const submitData = {
        name: this.formData.name,
        mobile: this.formData.mobile,
        email: this.formData.email,
        company: this.formData.company,
      };

      this.$emit("submit", submitData);
      this.handleClose();
    },
    resetForm() {
      this.formData = {
        name: "",
        mobile: "",
        email: "",
        company: "",
      };
      this.errors = {
        mobile: "",
        email: "",
        captcha: "",
      };
      this.captchaInput = "";
      this.$nextTick(() => {
        this.refreshCaptcha();
      });
    },
    // 初始化验证码
    initCaptcha() {
      const canvas = this.$refs.captchaCanvas;
      if (!canvas) return;
      this.canvasContext = canvas.getContext("2d");
      this.refreshCaptcha();
    },
    // 生成随机数
    randInt(min, max) {
      const range = max - min + 1;
      const r = crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff;
      return Math.floor(r * range) + min;
    },
    // 生成验证码文本
    makeCode(length = 5) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
      let s = "";
      for (let i = 0; i < length; i++) {
        s += chars.charAt(this.randInt(0, chars.length - 1));
      }
      return s;
    },
    // 清空画布
    clearCanvas() {
      const canvas = this.$refs.captchaCanvas;
      if (!canvas || !this.canvasContext) return;
      this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      // 背景渐变
      const g = this.canvasContext.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      g.addColorStop(0, "#f8fafc");
      g.addColorStop(1, "#eef2f6");
      this.canvasContext.fillStyle = g;
      this.canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    },
    // 绘制噪点
    drawNoiseDots(count = 80) {
      const canvas = this.$refs.captchaCanvas;
      if (!canvas || !this.canvasContext) return;
      for (let i = 0; i < count; i++) {
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = `rgba(${this.randInt(
          50,
          200
        )},${this.randInt(50, 200)},${this.randInt(50, 200)},${(
          Math.random() * 0.6
        ).toFixed(2)})`;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 1.2; // 减小噪点大小
        this.canvasContext.arc(x, y, r, 0, Math.PI * 2);
        this.canvasContext.fill();
      }
    },
    // 绘制干扰线
    drawInterferenceLines(count = 4) {
      const canvas = this.$refs.captchaCanvas;
      if (!canvas || !this.canvasContext) return;
      for (let i = 0; i < count; i++) {
        this.canvasContext.beginPath();
        this.canvasContext.lineWidth = this.randInt(1, 1.5); // 减小线宽
        this.canvasContext.strokeStyle = `rgba(${this.randInt(
          30,
          150
        )},${this.randInt(30, 150)},${this.randInt(30, 150)},${(
          0.25 +
          Math.random() * 0.4
        ).toFixed(2)})`;
        const startY = Math.random() * canvas.height;
        this.canvasContext.moveTo(0, startY);
        const cpX = this.randInt(canvas.width * 0.2, canvas.width * 0.8);
        const cpY = this.randInt(0, canvas.height);
        const endY = Math.random() * canvas.height;
        const steps = 50; // 减少步数，提高性能
        let prevX = 0,
          prevY = startY;
        for (let t = 1; t <= steps; t++) {
          const tt = t / steps;
          const x = tt * canvas.width;
          const y =
            (1 - tt) * (1 - tt) * startY +
            2 * (1 - tt) * tt * cpY +
            tt * tt * endY;
          this.canvasContext.moveTo(prevX, prevY);
          this.canvasContext.lineTo(x, y);
          prevX = x;
          prevY = y;
        }
        this.canvasContext.stroke();
      }
    },
    // 绘制文本
    drawText(code) {
      const canvas = this.$refs.captchaCanvas;
      if (!canvas || !this.canvasContext) return;
      const len = code.length;
      const baseX = 5;
      const availableW = canvas.width - baseX * 2;
      const perW = availableW / len;

      for (let i = 0; i < len; i++) {
        const ch = code[i];
        // 根据 80x50 尺寸调整字体大小
        const fontSize = this.randInt(14, 20);
        const rotate = Math.random() * 0.4 - 0.2; // 减小旋转角度
        const color = `rgba(${this.randInt(30, 110)},${this.randInt(
          30,
          110
        )},${this.randInt(30, 110)},1)`;
        this.canvasContext.save();
        const centerX =
          baseX + perW * (i + 0.5) + (Math.random() * perW - perW / 2) * 0.15;
        const centerY = canvas.height / 2 + this.randInt(-3, 3);

        const channels = [
          { dx: this.randInt(-1, 1), dy: this.randInt(-1, 1) },
          { dx: this.randInt(-1, 1), dy: this.randInt(-1, 1) },
        ];

        this.canvasContext.translate(centerX, centerY);
        this.canvasContext.rotate(rotate);
        this.canvasContext.font = `${fontSize}px "Arial", sans-serif`;
        this.canvasContext.textBaseline = "middle";
        this.canvasContext.textAlign = "center";

        this.canvasContext.shadowColor = "rgba(0,0,0,0.12)";
        this.canvasContext.shadowBlur = 1;
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillText(ch, 0, 0);

        this.canvasContext.lineWidth = 0.5;
        this.canvasContext.strokeStyle = `rgba(0,0,0,0.06)`;
        this.canvasContext.strokeText(ch, 0, 0);

        this.canvasContext.restore();

        // 减少偏移层数，避免过于复杂
        for (let c = 0; c < channels.length; c++) {
          const { dx, dy } = channels[c];
          this.canvasContext.save();
          this.canvasContext.translate(centerX + dx * 1, centerY + dy * 1);
          this.canvasContext.rotate(rotate + (Math.random() * 0.04 - 0.02));
          this.canvasContext.font = `${fontSize}px "Arial", sans-serif`;
          this.canvasContext.textBaseline = "middle";
          this.canvasContext.textAlign = "center";
          this.canvasContext.globalAlpha = 0.1;
          this.canvasContext.fillText(ch, 0, 0);
          this.canvasContext.restore();
        }
      }
    },
    // 绘制网格
    drawGridFine() {
      const canvas = this.$refs.captchaCanvas;
      if (!canvas || !this.canvasContext) return;
      this.canvasContext.save();
      this.canvasContext.globalAlpha = 0.03;
      // 根据 80x50 尺寸调整网格间距
      for (let x = 0; x < canvas.width; x += 5) {
        this.canvasContext.fillRect(x, 0, 0.5, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += 5) {
        this.canvasContext.fillRect(0, y, canvas.width, 0.5);
      }
      this.canvasContext.restore();
    },
    // 渲染验证码
    renderCaptcha(code) {
      this.clearCanvas();
      this.drawGridFine();
      // 根据 80x50 尺寸减少噪点和干扰线数量
      this.drawNoiseDots(20);
      this.drawInterferenceLines(1 + this.randInt(0, 1)); // 1-2条干扰线
      this.drawText(code);
      this.drawNoiseDots(10);
    },
    // 生成并渲染验证码
    generateAndRender(length = 4) {
      // 80x50 尺寸较小，使用4位验证码更合适
      this.currentCaptchaCode = this.makeCode(length);
      this.renderCaptcha(this.currentCaptchaCode);
      this.captchaInput = "";
      this.errors.captcha = "";
    },
    // 刷新验证码
    refreshCaptcha() {
      this.generateAndRender(4);
    },
    // 验证验证码
    validateCaptcha() {
      const input = this.captchaInput.trim();
      if (!input) {
        this.errors.captcha = "请输入验证码";
        return false;
      }
      if (input.toLowerCase() !== this.currentCaptchaCode.toLowerCase()) {
        this.errors.captcha = "验证码错误";
        return false;
      }
      this.errors.captcha = "";
      return true;
    },
    // 语音读出验证码
    readAloud() {
      if (!("speechSynthesis" in window)) {
        this.$message.warning("当前浏览器不支持语音合成");
        return;
      }
      const text = this.currentCaptchaCode.split("").join(" ");
      const ut = new SpeechSynthesisUtterance(text);
      ut.rate = 0.9;
      ut.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(ut);
    },
  },
};
</script>

<style lang="less" scoped>
.user-info-dialog {
  .dialog-description {
    color: #fff;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 20px;
    padding: 0 10px;
  }

  .dialog-content {
    .input-group {
      display: flex;
      align-items: flex-start;
      background: #e5e5e5;
      border-radius: 8px;
      min-height: 50px;
      margin-bottom: 25px;
      overflow: visible;

      .input-icon {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e5e5e5;
        color: #666;
        font-size: 18px;
      }

      .input-label {
        font-family: Microsoft JhengHei UI, Microsoft JhengHei UI;
        width: 170px;
        height: 50px;
        display: flex;
        align-items: center;
        color: #303030;
        font-size: 18px;
        font-weight: bold;
        padding-left: 18px;
        flex-shrink: 0;
        i {
          margin-right: 10px;
        }
      }

      .input-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0;
        position: relative;
      }

      .user-input {
        flex: 1;

        /deep/ .el-input__inner {
          background-color: #fff;
          border: none;
          border-radius: 8px;
          color: #303133;
          font-size: 14px;
          height: 50px;
          line-height: 50px;
          padding: 0 15px;
          transition: all 0.3s;

          &:focus {
            outline: none;
            box-shadow: none;
          }

          &::placeholder {
            color: #c0c4cc;
          }
        }

        &.is-error {
          /deep/ .el-input__inner {
            border: 2px solid #f56c6c;
            background-color: #fef0f0;
          }
        }
      }

      .error-message {
        position: absolute;
        bottom: -20px;
        left: 0;
        width: 100%;
        color: #f56c6c;
        font-size: 12px;
        line-height: 1.5;
        animation: slideDown 0.3s ease;
      }

      &.captcha-group {
        .captcha-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .captcha-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .captcha-canvas {
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          background: #fff;
        }

        .captcha-input-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .captcha-input {
          /deep/ .el-input__inner {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            color: #303133;
            font-size: 14px;
            height: 50px;
            line-height: 50px;
            padding: 0 15px;
            transition: all 0.3s;

            &:focus {
              outline: none;
              border-color: #37b182;
              box-shadow: 0 0 0 2px rgba(55, 177, 130, 0.1);
            }

            &::placeholder {
              color: #c0c4cc;
            }
          }
        }
      }
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dialog-footer {
    text-align: center;
    padding: 20px 0 0 0;

    .submit-button {
      width: 100%;
      height: 50px;
      background-color: #37b182;
      border-color: #37b182;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;

      &:hover {
        background-color: #2a9d73;
        border-color: #2a9d73;
      }

      &:focus {
        background-color: #37b182;
        border-color: #37b182;
      }
    }
  }
}

// 全局样式覆盖
:deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background-color: #303030;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
  border-bottom: none;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 0 20px 20px;
  border-top: none;
}

:deep(.el-dialog__headerbtn) {
  top: 15px;
  right: 15px;

  .el-dialog__close {
    color: #fff;
    font-size: 18px;

    &:hover {
      color: #c0c4cc;
    }
  }
}
</style>
