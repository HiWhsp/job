<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <!-- 弹框头部 -->
      <div class="modal-header">
        <h3 class="modal-title">修改密码</h3>
        <button class="close-btn" @click="closeModal">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="#666"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <!-- 弹框内容 -->
      <div class="modal-content">
        <!-- 旧密码部分 -->
        <div class="form-group">
          <label class="form-label">旧密码：</label>
          <input
            v-model="formData.oldPassword"
            type="password"
            class="form-input"
            placeholder="请输入旧密码"
          />
        </div>

        <!-- 新密码部分 -->
        <div class="form-group">
          <label class="form-label">新密码：</label>
          <input
            v-model="formData.newPassword"
            type="password"
            class="form-input"
            placeholder="请输入新密码"
          />
        </div>

        <!-- 重复新密码部分 -->
        <div class="form-group">
          <label class="form-label">重复新密码：</label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            class="form-input"
            placeholder="请重复输入新密码"
          />
        </div>
      </div>

      <!-- 弹框底部按钮 -->
      <div class="modal-footer">
        <button class="btn btn-confirm" @click="confirmChange">确定</button>
        <button class="btn btn-cancel" @click="closeModal">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangePasswordModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.resetForm();
      }
    },
  },
  methods: {
    resetForm() {
      this.formData = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    },
    closeModal() {
      this.$emit("close");
    },
    handleOverlayClick() {
      this.closeModal();
    },
    confirmChange() {
      // 验证表单数据
      if (!this.formData.oldPassword.trim()) {
        this.$message?.warning("请输入旧密码");
        return;
      }

      if (!this.formData.newPassword.trim()) {
        this.$message?.warning("请输入新密码");
        return;
      }

      if (this.formData.newPassword.length < 6) {
        this.$message?.warning("新密码长度不能少于6位");
        return;
      }

      if (this.formData.newPassword !== this.formData.confirmPassword) {
        this.$message?.warning("两次输入的新密码不一致");
        return;
      }

      if (this.formData.oldPassword === this.formData.newPassword) {
        this.$message?.warning("新密码不能与旧密码相同");
        return;
      }

      // 发送修改密码请求
      this.$emit("confirm", this.formData);
    },
  },
};
</script>

<style lang="less" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 8px;
  width: 590px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background: #f4f6fa;
  height: 60px;

  .modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #363130;
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }
  }
}

.modal-content {
  padding: 65px 100px 20px 100px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #5b5d60;
    width: 85px;
    text-align: right;
    margin-right: 24px;
  }

  .form-input {
    width: 250px;
    padding: 12px 16px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: #4e57d9;
      box-shadow: 0 0 0 2px rgba(78, 87, 217, 0.1);
    }

    &::placeholder {
      color: #bfbfbf;
    }
  }
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 0px 68px 96px 210px;

  .btn {
    padding: 10px 24px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;

    &.btn-cancel {
      background: white;
      color: #666;
      border: 1px solid #d9d9d9;

      &:hover {
        border-color: #4e57d9;
        color: #4e57d9;
      }
    }

    &.btn-confirm {
      background: linear-gradient(90deg, #4e57d9 0%, #519dff 100%);
      color: white;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(78, 87, 217, 0.3);
      }
    }
  }
}
</style>