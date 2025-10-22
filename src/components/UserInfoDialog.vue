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
      },
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
      };
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
