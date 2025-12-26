<template>
  <div class="profile-page">
    <h2 class="page-title">个人资料</h2>
    <div class="profile-content">
      <!-- 基本信息 -->
      <div class="info-section">
        <div class="section-title">基本信息</div>
        <div class="basic-info">
          <!-- 头像 -->
          <div class="avatar-section">
            <label class="field-label">头像</label>
            <div class="avatar-wrapper">
              <img
                :src="userInfo.image || defaultAvatar"
                alt="头像"
                class="avatar-img"
              />
              <el-upload
                class="avatar-uploader"
                :action="mix_upload_action"
                :data="mix_upload_data"
                :name="mix_upload_name"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false"
                accept="image/*"
              >
                <div class="avatar-overlay">
                  <span class="overlay-text">修改头像</span>
                </div>
              </el-upload>
            </div>
          </div>

          <!-- 手机号 -->
          <div class="phone-section">
            <label class="field-label">手机</label>
            <div class="phone-value">{{ userInfo.mobile || "--" }}</div>
          </div>
        </div>
      </div>

      <!-- 个人信息 -->
      <div class="info-section">
        <div class="section-title">个人信息</div>
        <div class="personal-info">
          <div class="form-item">
            <label class="field-label">
              <span class="required-star">*</span>
              姓名
            </label>
            <el-input
              v-model="formData.name"
              placeholder="请输入姓名"
              class="form-input"
            ></el-input>
          </div>
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
  name: "MyProfile",
  data() {
    return {
      defaultAvatar: require("@/assets/img/common/avatar.png"),
      userInfo: {
        avatar: "",
        phone: "15931263145",
        name: "",
      },
      formData: {
        name: "",
      },
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      try {
        const res = await this.$api({
          url: "getPcUserInfo",
          method: "get",
        });
        if (res.code === 200 && res.data) {
          this.userInfo = res.data;
          this.formData.name = res.data.username || "";
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    },
    // 上传前验证
    beforeAvatarUpload(file) {
      // 验证文件类型
      if (!file.type.startsWith("image/")) {
        this.$message.warning("只能上传图片文件");
        return false;
      }

      // 验证文件大小（1MB）
      if (file.size > 1024 * 1024) {
        this.$message.warning("图片大小不能超过1MB");
        return false;
      }
      return true;
    },  
    handleAvatarSuccess(response, file) {
      if (response.code === 200 && response.data) {
        this.userInfo.image = response.data.path;
        this.$message.success("头像上传成功");
      } else {
        this.$message.error(response.message || "上传头像失败");
      }
    },
    handleAvatarError(error, file) {
      console.error("上传头像失败:", error);
      this.$message.error("上传头像失败");
    },
    handleConfirm() {
      // 验证必填字段
      if (!this.formData.name.trim()) {
        this.$message.warning("请输入姓名");
        return;
      }

      // 提交表单
      this.submitForm();
    },
    async submitForm() {
      try {
        // 这里可以调用实际的API保存用户信息
        const res = await this.$api({
          url: "updatePcUser",
          method: "post",
          data: {
            username: this.formData.name,
            image: this.userInfo.image || "",
          },
        });
        if (res.code === 200) {
          this.$message.success("保存成功");
          this.getUserInfo();
        }
      } catch (error) {
        console.error("保存失败:", error);
        this.$message.error("保存失败");
      }
    },
    handleCancel() {
      // 重置表单
      this.getUserInfo();
    },
  },
};
</script>

<style lang="less" scoped>
.profile-page {
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

  .profile-content {
    padding: 30px;
    margin-top: 20px;
    background: #fff;
  }

  .info-section {
    padding-top: 30px;
    margin-bottom: 30px;
    border-top: 1px solid #e8e8e8;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
    }

    .basic-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 40px;
      padding-left: 100px;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 20px;
      .field-label {
        font-size: 14px;
        color: #666;
        width: 60px;
        flex-shrink: 0;
      }
      .avatar-wrapper {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-uploader {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;

          /deep/ .el-upload {
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
          }

          /deep/ .el-upload:hover {
            border: none;
          }

          .avatar-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            width: 100%;
            height: 100%;
            cursor: pointer;

            .overlay-text {
              color: #fff;
              font-size: 14px;
            }
          }
        }

        &:hover .avatar-overlay {
          opacity: 1;
        }
      }
    }

    .phone-section {
      display: flex;
      align-items: center;
      gap: 20px;

      .field-label {
        font-size: 14px;
        color: #666;
        width: 60px;
        flex-shrink: 0;
      }

      .phone-value {
        font-size: 14px;
        color: #333;
      }
    }

    .personal-info {
      .form-item {
        display: flex;
        align-items: center;
        gap: 20px;

        .field-label {
          font-size: 14px;
          color: #666;
          width: 80px;
          flex-shrink: 0;
          display: flex;
          align-items: center;

          .required-star {
            color: #e0291f;
            margin-right: 4px;
          }
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
  }

  .action-buttons {
    display: flex;
    gap: 20px;
    padding-top: 30px;
    padding-left: 100px;

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
<style lang="less" scoped src="./style/h5-profile.less"></style>
