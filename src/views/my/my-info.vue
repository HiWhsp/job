<template>
  <div class="page">
    <div class="main-title flex">
      <span>MY PROFILE</span>
    </div>

    <div class="page-ctx">
      <!-- Tab导航 -->
      <div class="tab-nav">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'basic' }"
          @click="switchTab('basic')"
        >Basic Information</div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'password' }"
          @click="switchTab('password')"
        >Change password</div>
      </div>

      <!-- 基本信息tab内容 -->
      <div v-show="activeTab === 'basic'" class="tab-content">
        <div class="basic-info-wrapper">
          <!-- 头像部分 -->
          <div class="avatar-section">
            <div class="avatar-container">
              <el-upload
                class="avatar-uploader"
                accept="image/*"
                :show-file-list="false"
                :name="UPLOAD_NAME"
                :action="UPLOAD_ACTION"
                :data="mix_upload_data"
                :on-success="upload_on_success"
                :before-upload="upload_before_upload"
              >
                <div class="avatar-wrapper">
                  <img v-if="form.image" :src="form.image" class="user-avatar" />
                  <img v-else src="@img/my/avatar.png" class="user-avatar" />
                  <div class="avatar-change-overlay">Change</div>
                </div>
              </el-upload>
            </div>
          </div>

          <!-- 表单字段 -->
          <div class="form-fields">
            <div class="form-item">
              <span class="field-label">First Name</span>
              <div class="field-value">
                <el-input
                  clearable
                  type="text"
                  v-model="form.firstName"
                  placeholder="Please enter"
                />
              </div>
            </div>

            <div class="form-item">
              <span class="field-label">Last Name</span>
              <div class="field-value">
                <el-input clearable type="text" v-model="form.lastName" placeholder="Please enter" />
              </div>
            </div>

            <div class="form-item">
              <span class="field-label">Phone Number</span>
              <div class="field-value">
                <span class="field-display">{{ my_info.phone || form.phone || 'no phone' }}</span>
              </div>
              <button class="change-btn" @click="open_phone_update()">CHANGE</button>
            </div>

            <div class="form-item">
              <span class="field-label">Email</span>
              <div class="field-value">
                <span class="field-display">{{ form.email || my_info.email || 'no email' }}</span>
              </div>
              <button class="change-btn" @click="open_email_update()">CHANGE</button>
            </div>
          </div>

          <!-- 保存按钮 -->
          <div class="save-button-wrapper">
            <button
              class="btn-save-info"
              @click="throttle_do_submit()"
              :disabled="loading"
            >{{ loading ? '保存中...' : 'SAVE INFORMATION' }}</button>
          </div>
        </div>
      </div>

      <!-- 修改密码tab内容 -->
      <div v-show="activeTab === 'password'" class="tab-content">
        <div class="password-change-wrapper">
          <div class="password-form-fields">
            <div class="password-form-item">
              <span class="password-field-label">Old Password :</span>
              <div class="password-field-value">
                <el-input
                  clearable
                  type="password"
                  v-model="passwordForm.oldPass"
                  placeholder="Please enter"
                />
              </div>
            </div>

            <div class="password-form-item">
              <span class="password-field-label">New Password :</span>
              <div class="password-field-value">
                <el-input
                  clearable
                  type="password"
                  v-model="passwordForm.pass"
                  placeholder="Please enter"
                />
              </div>
            </div>

            <div class="password-form-item">
              <span class="password-field-label">Repeat New Password :</span>
              <div class="password-field-value">
                <el-input
                  clearable
                  type="password"
                  v-model="passwordForm.pass2"
                  placeholder="Please enter"
                />
              </div>
            </div>
          </div>

          <!-- 确认按钮 -->
          <div class="password-save-button-wrapper">
            <button
              class="btn-password-confirm"
              @click="throttle_do_password_submit()"
              :disabled="passwordLoading"
            >
              {{ passwordLoading ? '保存中...' : 'CONFIRM' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <phone_bind_new_set_modal
      ref="phone_bind_new_set_modal"
      data-title="绑定"
      @confirm="confirm_new"
    />
    <email_bind_new_set_modal
      ref="email_bind_new_set_modal"
      data-title="绑定邮箱"
      @confirm="confirm_new"
    />
  </div>
</template>

<script>
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env.js";

import phone_bind_new_set_modal from "@/components/account/phone_bind_new_set_modal.vue";
import email_bind_new_set_modal from "@/components/account/email_bind_new_set_modal.vue";

import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    phone_bind_new_set_modal,
    email_bind_new_set_modal
  },
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,

      my_info: {},
      form: {
        image: "",
        realName: "",
        address: "",
        nickname: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
      },
      loading: false,

      // Tab相关
      activeTab: "basic", // 当前激活的tab

      // 修改密码相关
      passwordForm: {
        editType: "1", // 修改类型：1-老密码验证 2-手机短信验证 3-邮箱验证码验证
        oldPass: "",
        pass: "", // 验证码 类型2/类型3-必传
        pass2: ""
      },
      passwordLoading: false
    };
  },
  computed: {
    ...mapState([""])
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.throttle_do_password_submit = this.mix_throttle(
      this.do_password_submit,
      1000
    );
    this.setView();
  },
  methods: {
    throttle_do_submit() {},
    throttle_do_password_submit() {},

    // Tab切换
    switchTab(tab) {
      this.activeTab = tab;
    },

    // 修改密码相关方法
    do_password_submit() {
      if (!this.passwordForm.oldPass) {
        alertErr("请输入旧密码");
        return;
      }
      if (!this.passwordForm.pass) {
        alertErr("请输入新密码");
        return;
      }
      if (!this.passwordForm.pass2) {
        alertErr("请输入确认密码");
        return;
      }
      if (this.passwordForm.pass != this.passwordForm.pass2) {
        alertErr("两次密码不一致");
        return;
      }

      this.passwordLoading = true;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_editPass",
          ...this.passwordForm
        }
      }).then(res => {
        alert(res).then(() => {
          this.passwordLoading = false;
        });
        if (res.code == 200) {
          this.do_password_clear();
        }
      });
    },

    do_password_clear() {
      this.passwordForm = {
        editType: "1",
        oldPass: "",
        pass: "",
        pass2: ""
      };
    },

    open_phone_update() {
      this.$refs.phone_bind_new_set_modal.init();
    },
    confirm_old_pass() {
      this.$refs.phone_bind_new_set_modal.init();
    },
    confirm_new() {
      this.query_user();
    },

    open_email_update() {
      this.$refs.email_bind_new_set_modal.init();
    },

    setView() {
      this.query_user();
    },
    query_user() {
      // this.$store.dispatch("query_user");
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo"
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data;
          this.my_info = data;

          // 处理姓名拆分（如果有realName，尝试拆分为firstName和lastName）
          let firstName = "";
          let lastName = "";
          if (data.realName) {
            const nameParts = data.realName.trim().split(/\s+/);
            if (nameParts.length > 1) {
              firstName = nameParts[0];
              lastName = nameParts.slice(1).join(" ");
            } else {
              lastName = data.realName;
            }
          }

          this.form = {
            image: data.image || "",
            realName: data.realName || "",
            address: data.address || "",
            nickname: data.nickname || "",
            firstName: data.firstName || firstName || "",
            lastName: data.lastName || lastName || "",
            email: data.email || "",
            phone: data.phone || ""
          };

          this.$store.commit("set_vuex_user", res.data);
        }
      });
    },

    do_submit() {
      this.loading = true;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_editInfo",
          ...this.form
        }
      }).then(res => {
        let { code, msg, data } = res;
        alert(res).then(() => {
          this.loading = false;
        });
        if (code == 200) {
          this.setView();
        }
      });
    },

    do_reset() {
      let firstName = "";
      let lastName = "";
      if (this.my_info.realName) {
        const nameParts = this.my_info.realName.trim().split(/\s+/);
        if (nameParts.length > 1) {
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(" ");
        } else {
          lastName = this.my_info.realName;
        }
      }

      this.form = {
        image: this.my_info.image || "",
        realName: this.my_info.realName || "",
        address: this.my_info.address || "",
        nickname: this.my_info.nickname || "",
        firstName: this.my_info.firstName || firstName || "",
        lastName: this.my_info.lastName || lastName || "",
        email: this.my_info.email || "",
        phone: this.my_info.phone || ""
      };
    },

    //上传相关
    upload_on_success(res, file) {
      //console.log("上传结果", res);
      let { code, data, msg } = res;
      alert(res);
      if (code == 200) {
        this.form.image = res.data;
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    }
  }
};
</script>

<style scoped lang="less">
.user-avatar {
  object-fit: cover;
}

.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 70px;
    line-height: 70px;
    background: #ffffff;
    font-size: 20px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    img {
      width: 22px;
      margin-right: 10px;
    }

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #7853b2;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 0;
    background: #fff;
  }

  // Tab导航样式
  .tab-nav {
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 32px;

    .tab-item {
      padding: 16px 24px;
      font-size: 20px;
      color: #333;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;

      &:hover {
        color: #ec6a2b;
      }

      &.active {
        color: #ec6a2b;
        border-bottom-color: #ec6a2b;
        font-weight: 500;
      }
    }
  }

  .tab-content {
    padding: 80px 100px;

    .basic-info-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }

    // 头像部分样式
    .avatar-section {
      margin-bottom: 40px;
      display: flex;
      justify-content: center;

      .avatar-container {
        position: relative;
        display: inline-block;

        .avatar-uploader {
          cursor: pointer;
        }

        .avatar-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          .user-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            background: #e5e5e5;
          }

          .avatar-change-overlay {
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 18px;
            font-weight: 500;
            cursor: pointer;
          }
        }
      }
    }

    // 表单字段样式
    .form-fields {
      .form-item {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 24px;

        width: 608px;
        height: 56px;
        border-radius: 6px 6px 6px 6px;
        border: 1px solid #dbdbdb;

        .field-label {
          width: 200px;
          font-size: 20px;
          color: #333333;
          font-weight: 400;
          text-align: center;
          border-right: 1px solid #dbdbdb;
        }

        .field-value {
          flex: 1;
          margin-left: 20px;

          .field-display {
            display: inline-block;
            flex: 1;
            margin-left: 20px;
            font-size: 20px;
            color: #333333;
            font-weight: 400;
            text-align: center;
          }

          .el-input {
            width: 100%;

            ::v-deep .el-input__inner {
              border: none;
              padding: 12px 16px;
              font-size: 20px;
              color: #333;
            }
          }
        }

        .change-btn {
          position: absolute;
          right: -200px;
          top: 0;
          width: 192px;
          height: 56px;
          line-height: 56px;
          background: #00306b;
          border-radius: 6px 6px 6px 6px;
          color: #fff;
          font-size: 20px;
          font-weight: bold;

          &:hover {
            background: #1548c4;
          }

          &:active {
            background: #0f3a9f;
          }
        }
      }
    }

    // 保存按钮样式
    .save-button-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 60px;

      .btn-save-info {
        width: 300px;
        height: 80px;
        background: #ec6a2b;
        border-radius: 10px 10px 10px 10px;

        font-family: Poppins, Poppins;
        font-weight: 600;
        font-size: 24px;
        color: #ffffff;

        &:hover:not(:disabled) {
          background: #e55a2b;
        }

        &:active:not(:disabled) {
          background: #cc4f24;
        }

        &:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      }
    }

    // 修改密码样式
    .password-change-wrapper {
      max-width: 800px;
      margin: 0 auto;

      .password-form-fields {
        .password-form-item {
          display: flex;
          align-items: center;
          margin-bottom: 24px;

          .password-field-label {
            width: 220px;
            font-size: 17px;
            color: #1e262e;
            font-weight: 400;
            text-align: right;
            margin-right: 20px;
          }

          .password-field-value {
            flex: 1;

            .el-input {
              width: 100%;

              ::v-deep .el-input__inner {
                height: 56px;
                line-height: 56px;
                padding: 0 16px;
                border: 1px solid #e5e5e5;
                border-radius: 6px;
                font-size: 17px;
                color: #333;
                background: #fbfbfb;

                &::placeholder {
                  color: #999;
                }
              }
            }
          }
        }
      }

      .password-save-button-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 60px;

        .btn-password-confirm {
          min-width: 200px;
          height: 50px;
          background: #ff6b35;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s;

          &:hover:not(:disabled) {
            background: #e55a2b;
          }

          &:active:not(:disabled) {
            background: #cc4f24;
          }

          &:disabled {
            background: #ccc;
            color: #999;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;

    .section-title {
      margin-bottom: 50px;
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #1f1f1f;
    }

    .upload-box {
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
    }

    .item {
      margin-bottom: 32px;
      display: flex;
      align-items: center;

      .text {
        display: inline-block;
        min-width: 134px;
        text-align: right;
        font-size: 14px;
        color: #666;
      }

      .info {
        padding-left: 10px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        display: inline-block;
        min-width: 120px;

        .el-input {
          width: 400px;
          // height: 40px;
        }
      }

      .action {
        margin-left: 20px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #7853b2;

        span {
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
  }
}

.btn-box {
  button {
    width: 76px;
    height: 40px;
  }

  .btn-save {
    width: 120px;
    height: 32px;
    background: #ffffff;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid #7853b2;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #7853b2;
  }

  .btn-cancel {
    margin-left: 20px;
    width: 120px;
    height: 32px;
    background: #7853b2;
    border-radius: 50px 50px 50px 50px;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/my-info.less"></style>

<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
