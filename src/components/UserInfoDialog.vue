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
        <el-input
          v-model="formData.mobile"
          placeholder="请输入手机号码"
          class="user-input"
        ></el-input>
      </div>

      <!-- 邮箱 -->
      <div class="input-group">
        <div class="input-label">
          <i class="el-icon-message"></i>
          邮箱
        </div>
        <el-input
          v-model="formData.email"
          placeholder="请输入邮箱地址"
          class="user-input"
        ></el-input>
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
    handleClose() {
      this.visible = false;
      this.resetForm();
    },
    handleSubmit() {
      // 简单的表单验证
      if (!this.formData.name) {
        this.$message.error("请输入联系人姓名");
        return;
      }
      if (!this.formData.mobile) {
        this.$message.error("请输入手机号码");
        return;
      }
      if (!this.formData.email) {
        this.$message.error("请输入邮箱地址");
        return;
      }
      if (!this.formData.company) {
        this.$message.error("请输入所属单位");
        return;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        this.$message.error("请输入正确的邮箱格式");
        return;
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(this.formData.mobile)) {
        this.$message.error("请输入正确的手机号码");
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
      align-items: center;
      background: #e5e5e5;
      border-radius: 8px;
      height: 50px;
      margin-bottom: 15px;
      overflow: hidden;

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
        i {
          margin-right: 10px;
        }
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

          &:focus {
            outline: none;
            box-shadow: none;
          }

          &::placeholder {
            color: #c0c4cc;
          }
        }
      }
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
