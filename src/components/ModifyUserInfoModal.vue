<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <!-- 弹框头部 -->
      <div class="modal-header">
        <h3 class="modal-title">修改个人信息</h3>
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
        <!-- 头像部分 -->
        <div class="form-group">
          <label class="form-label" style="margin-bottom: 48px">头像：</label>
          <div class="avatar-section">
            <div class="avatar-preview">
              <img :src="formData.image" alt="用户头像" />
            </div>
            <el-upload
              class="avatar-uploader"
              :action="uploadAction"
              :data="uploadData"
              name="file"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :before-upload="beforeAvatarUpload"
              accept="image/*"
            >
              <button class="change-avatar-btn">
                更换头像
              </button>
            </el-upload>
          </div>
        </div>

        <!-- 手机号部分 -->
        <div class="form-group">
          <label class="form-label">手机号：</label>
          <div class="phone-display">{{ formData.mobile }}</div>
        </div>

        <!-- 昵称部分 -->
        <div class="form-group">
          <label class="form-label">昵称：</label>
          <input
            v-model="formData.username"
            type="text"
            class="form-input"
            placeholder="请输入昵称"
          />
        </div>
      </div>

      <!-- 弹框底部按钮 -->
      <div class="modal-footer">
        <button class="btn btn-confirm" @click="confirmModify">确定</button>
        <button class="btn btn-cancel" @click="closeModal">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  API_ROOT
} from '@/config/env.js'
export default {
  name: "ModifyUserInfoModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: Object,
      default: () => ({
        avatar: "@/assets/img/common/avatar.png",
        phone: "15251252154",
        nickname: "",
      }),
    },
  },
  data() {
    return {
      formData: {
        avatar: "",
        phone: "",
        nickname: "",
      },
    };
  },
  computed: {
    // 上传接口地址
    uploadAction() {
      return API_ROOT + "/api/upload";
    },
    // 上传参数
    uploadData() {
      return {
        userId: localStorage.getItem("userId") || "",
        token: localStorage.getItem("token") || "",
      };
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initFormData();
      }
    },
    userInfo: {
      handler(newVal) {
        if (newVal) {
          this.initFormData();
        }
      },
      deep: true,
    },
  },
  methods: {
    initFormData() {
      this.formData = {
        ...this.userInfo,
      };
    },
    closeModal() {
      this.$emit("close");
    },
    handleOverlayClick() {
      this.closeModal();
    },
    // 上传前验证
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 1;

      if (!isImage) {
        this.$message?.warning('只能上传图片文件!');
        return false;
      }
      if (!isLt5M) {
        this.$message?.warning('图片大小不能超过 1MB!');
        return false;
      }
      return true;
    },
    
    // 上传成功回调
    handleAvatarSuccess(response, file) {
      if (response.code === 200 && response.data && response.data.path) {
        // 上传成功，更新头像
        this.formData.image = response.data.path;
        // 通知父组件头像已更新
        this.$emit('avatar-updated', response.data.path);
        this.$message?.success('头像上传成功');
      } else {
        this.$message?.error(response.message || '上传失败');
      }
    },
    
    // 上传失败回调
    handleAvatarError(error, file) {
      console.error('上传失败:', error);
      this.$message?.error('头像上传失败，请重试');
    },
    confirmModify() {
      // 验证表单数据
      if (!this.formData.username.trim()) {
        this.$message?.warning("请输入昵称");
        return;
      }

      // 发送修改请求
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
  padding: 65px 140px 34px 140px;
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
    width: 80px;
    text-align: right;
    margin-right: 24px;
  }

  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .avatar-preview {
      width: 88px;
      height: 88px;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    .avatar-uploader {
      .change-avatar-btn {
        padding: 8px 16px;
        background: linear-gradient(90deg, #4e57d9 0%, #519dff 100%);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(78, 87, 217, 0.3);
        }
      }
    }
  }

  .phone-display {
    padding: 12px 16px;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    font-size: 14px;
    color: #666;
  }

  .form-input {
    width: 150px;
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
  padding: 0px 140px 96px 245px;

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
