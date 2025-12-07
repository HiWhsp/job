<template>
  <div class="password-page">
    <h2 class="page-title">修改密码</h2>
    <div class="password-content">
      <div class="password-form">
        <!-- 旧密码 -->
        <div class="form-item">
          <label class="field-label">旧密码:</label>
          <el-input
            v-model="formData.oldPassword"
            type="password"
            placeholder="请输入旧密码"
            class="form-input"
            show-password
          ></el-input>
        </div>

        <!-- 新密码 -->
        <div class="form-item">
          <label class="field-label">新密码:</label>
          <el-input
            v-model="formData.newPassword"
            type="password"
            placeholder="请输入新密码"
            class="form-input"
            show-password
          ></el-input>
        </div>

        <!-- 重复新密码 -->
        <div class="form-item">
          <label class="field-label">重复新密码:</label>
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请重复输入新密码"
            class="form-input"
            show-password
          ></el-input>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="btn btn-confirm" @click="handleConfirm">确定</button>
        <button class="btn btn-cancel" @click="handleCancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyPassword",
  data() {
    return {
      formData: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    handleConfirm() {
      // 验证表单
      if (!this.validateForm()) {
        return;
      }

      // 提交修改密码请求
      this.submitPasswordChange();
    },
    validateForm() {
      // 验证旧密码
      if (!this.formData.oldPassword.trim()) {
        this.$message.warning("请输入旧密码");
        return false;
      }

      // 验证新密码
      if (!this.formData.newPassword.trim()) {
        this.$message.warning("请输入新密码");
        return false;
      }

      // 验证新密码长度
      if (this.formData.newPassword.length < 6) {
        this.$message.warning("新密码长度不能少于6位");
        return false;
      }

      // 验证两次新密码是否一致
      if (this.formData.newPassword !== this.formData.confirmPassword) {
        this.$message.warning("两次输入的新密码不一致");
        return false;
      }

      // 验证新密码不能与旧密码相同
      if (this.formData.oldPassword === this.formData.newPassword) {
        this.$message.warning("新密码不能与旧密码相同");
        return false;
      }

      return true;
    },
    async submitPasswordChange() {
      try {
        const res = await this.$api({
          url: "changePcPwd",
          method: "post",
          data: {
            old: this.formData.oldPassword,
            new: this.formData.newPassword,
          },
        });
        if (res.code === 200) {
          this.$message.success("密码修改成功");
          this.resetForm();
          // 可以选择退出登录，让用户重新登录
          // this.$router.push("/login");
        } else {
          this.$message.error(res.message || "密码修改失败");
        }
      } catch (error) {
        console.error("修改密码失败:", error);
        this.$message.error("修改密码失败，请重试");
      }
    },
    handleCancel() {
      // 重置表单
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    },
  },
};
</script>

<style lang="less" scoped>
.password-page {
  border-radius: 8px;
  padding: 0;

  .page-title {
    background: #fff;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    height: 56px;
    line-height: 56px;
    padding: 0 30px;
    margin: 0;
    border-radius: 8px 8px 0 0;
  }

  .password-content {
    padding: 30px;
    margin-top: 20px;
    background: #fff;
  }

  .password-form {
    .form-item {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .field-label {
        font-size: 14px;
        color: #666;
        width: 100px;
        flex-shrink: 0;
        text-align: right;
        margin-right: 20px;
      }

      .form-input {
        flex: 1;
        max-width: 400px;

        /deep/ .el-input__inner {
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 20px;
    margin-top: 40px;
    padding-top: 30px;
    padding-left: 120px;

    .btn {
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;

      &.btn-confirm {
        background: #0081ff;
        color: #fff;

        &:hover {
          background: #0066cc;
        }
      }

      &.btn-cancel {
        background: #fff;
        color: #0081ff;
        border: 1px solid #0081ff;

        &:hover {
          background: #f0f7ff;
        }
      }
    }
  }
}
</style>
