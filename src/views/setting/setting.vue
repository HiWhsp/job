<template>
  <div class="page-wrap">
    <div class="page-inner">
      <div class="view-wrap">
        <div class="control-view" data-title="顶部操作栏">
          <div class="control-box">
            <div
              class="control"
              :class="{ active: active_tab == 'info' }"
              @click="active_tab = 'info'"
            >
              <div class="page-title">个人信息</div>
            </div>
            <div
              class="control"
              :class="{ active: active_tab == 'password' }"
              @click="active_tab = 'password'"
            >
              <div class="page-title">修改密码</div>
            </div>
          </div>
        </div>
        <div class="table-view" data-title="渲染表格">
          <div class="table-util-bar">
            <div class="table-title">
              {{ active_tab == "info" ? "个人信息" : "修改密码" }}
            </div>
            <!-- <div class="table-acts">
              <el-button type="primary" @click="do_add()"> 创建账号 </el-button>
            </div> -->
          </div>
          <div class="table-box" v-if="active_tab == 'info'">
            <div class="info-container">
              <!-- 基本信息 -->
              <div class="basic-info-section">
                <div class="section-title">基本信息</div>
                <div class="basic-info-content">
                  <div class="avatar-section">
                    <div class="account-info">
                      <div class="info-item">
                        <span class="info-label">头像:</span>
                        <span class="info-value">
                          <el-upload
                            class="avatar-uploader"
                            :action="mix_upload_action"
                            :data="upload_image_data"
                            :headers="mix_upload_headers"
                            :name="mix_upload_name"
                            :show-file-list="false"
                            :before-upload="handleAvatarChange"
                            :on-success="handleAvatarSuccess"
                          >
                            <el-avatar
                              :size="80"
                              :src="userInfo.image || defaultAvatar"
                              class="avatar-img"
                            >
                              <img :src="defaultAvatar" alt="默认头像" />
                            </el-avatar>
                          </el-upload>
                        </span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">账号:</span>
                        <span class="info-value">{{
                          userInfo.mobile || "--"
                        }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">部门:</span>
                        <span class="info-value">{{ departName || "--" }}</span>
                      </div>
                    </div>
                  </div>
                  <el-button
                    type="primary"
                    class="confirm-btn"
                    @click="handleConfirmModify"
                    >确认修改</el-button
                  >
                </div>
              </div>

              <!-- 员工信息 -->
              <div class="employee-info-section">
                <div class="section-title">员工信息</div>
                <div class="employee-info-content">
                  <div class="info-row">
                    <div class="info-field">
                      <span class="field-label">姓名</span>
                      <el-input
                        v-model="userInfo.real_name"
                        placeholder="请输入姓名"
                        class="field-input"
                      ></el-input>
                    </div>
                    <div class="info-field">
                      <span class="field-label">电话</span>
                      <el-input
                        v-model="userInfo.mobile"
                        placeholder="请输入电话"
                        class="field-input"
                      ></el-input>
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-field">
                      <span class="field-label">邮箱</span>
                      <el-input
                        v-model="userInfo.email"
                        placeholder="请输入邮箱"
                        class="field-input"
                      ></el-input>
                    </div>
                    <div class="info-field">
                      <span class="field-label">身份</span>
                      <el-input
                        v-model="userInfo.roleIdentity"
                        placeholder="身份"
                        class="field-input"
                        :disabled="true"
                      ></el-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="table-box" v-if="active_tab == 'password'">
            <div class="password-container">
              <div class="password-form">
                <div class="password-field">
                  <span class="password-label">旧密码</span>
                  <el-input
                    v-model="passwordForm.oldPassword"
                    type="password"
                    placeholder="请输入旧密码"
                    class="password-input"
                    show-password
                  ></el-input>
                </div>
                <div class="password-field">
                  <span class="password-label">新密码</span>
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    class="password-input"
                    show-password
                  ></el-input>
                </div>
                <div class="password-field">
                  <span class="password-label">重复新密码</span>
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请重复输入新密码"
                    class="password-input"
                    show-password
                  ></el-input>
                </div>
                <div class="password-actions">
                  <el-button class="cancel-btn" @click="handleCancelPassword"
                    >取消</el-button
                  >
                  <el-button
                    type="primary"
                    class="confirm-password-btn"
                    @click="handleConfirmPassword"
                    >确认</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "setting",
  data() {
    return {
      table_data: [],
      search_params: {
        page: 1,
        limit: 10,
        keyword: "",
      },
      origin_search_params: {},
      total: 0,

      is_select_all: false,
      active_tab: "info",
      userInfo: {},
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  computed: {
    upload_image_data() {
      return {
        action: "upload_uploadImg",
        token: this.mix_get_token(),
      };
    },
    ...mapState(["vuex_user", "vuex_depart_list", "defaultAvatar"]),
    departName() {
      if (!this.vuex_user.departId) return "";
      let depart = this.vuex_depart_list.find(
        (item) => item.id === this.vuex_user.departId
      );
      return depart ? depart.title : "";
    },
  },
  watch: {},
  mounted() {
    this.initUserInfo();
  },
  methods: {
    initUserInfo() {
      // 初始化用户信息
      this.$api({
        url: "/getUserInfo2",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          this.userInfo = res.data;
        }
      });
    },
    handleAvatarChange(file) {
      // 验证文件类型
      if (!file.type.startsWith("image/")) {
        this.$message.error("请选择图片文件");
        return false;
      }

      // 验证文件大小（可选，例如限制为 2MB）
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      return true;
    },
    handleConfirmModify() {
      // 确认修改用户信息
      this.$api({
        url: "/editUserInfo",
        method: "post",
        data: {
          ...this.userInfo,
          username: this.userInfo.real_name,
          real_name: this.userInfo.real_name,
          phone: this.userInfo.phone,
          email: this.userInfo.email,
          image: this.userInfo.image,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("修改成功");
            // 更新 vuex 中的用户信息
            this.$store.commit("set_vuex_user", {
              ...this.vuex_user,
              ...this.userInfo,
            });
          } else {
            this.$message.error(res.msg || "修改失败");
          }
        })
        .catch((err) => {
          this.$message.error("修改失败");
          console.error(err);
        });
    },
    handleCancelPassword() {
      // 取消修改密码，清空表单
      this.passwordForm = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    },
    handleConfirmPassword() {
      // 验证表单
      if (!this.passwordForm.oldPassword) {
        this.$message.error("请输入旧密码");
        return;
      }
      if (!this.passwordForm.newPassword) {
        this.$message.error("请输入新密码");
        return;
      }
      if (this.passwordForm.newPassword.length < 6) {
        this.$message.error("新密码长度不能少于6位");
        return;
      }
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.$message.error("两次输入的新密码不一致");
        return;
      }

      // 提交修改密码请求
      this.$api({
        url: "/changePwd",
        method: "post",
        data: {
          old: this.passwordForm.oldPassword,
          new: this.passwordForm.newPassword,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("密码修改成功");
            // 清空表单
            this.handleCancelPassword();
            setTimeout(() => {
              this.$store.commit("clearAdminInfo");
              this.$router.push("/login");
            }, 500);
          } else {
            this.$message.error(res.msg || "密码修改失败");
          }
        })
        .catch((err) => {
          this.$message.error("密码修改失败");
          console.error(err);
        });
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file);
      if (res.code == 200) {
        this.userInfo.image = res.data.path;
      } else {
        this.$message.error(res.msg || "头像上传失败");
      }
    },
  },
};
</script>

<style scoped lang="less">
.control-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 20px;

  .control {
    flex: 1;
    height: 72px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .page-title {
      font-family: PingFang SC, PingFang SC;
      font-weight: bold;
      font-size: 16px;
      color: #3377fe;
    }

    &.active {
      background: #3377fe;
      .page-title {
        color: #ffffff;
      }
    }
  }
}

.info-container {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;

  .section-title {
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
    margin-bottom: 20px;
  }

  // 基本信息部分
  .basic-info-section {
    margin-bottom: 40px;

    .basic-info-content {
      display: flex;
      align-items: flex-start;
      position: relative;
      padding-left: 100px;

      .avatar-section {
        display: flex;
        align-items: flex-start;
        gap: 24px;

        .avatar-uploader {
          cursor: pointer;

          /deep/ .el-avatar {
            transition: all 0.3s;
            img {
              width: 80px;
              height: 80px;
              object-fit: cover;
            }
          }
        }

        .account-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 8px;

          .info-item {
            display: flex;
            align-items: center;
            gap: 8px;

            .info-label {
              font-family: PingFang SC, PingFang SC;
              font-size: 14px;
              color: #000;
              font-weight: 400;
              margin-right: 40px;
            }

            .info-value {
              font-family: PingFang SC, PingFang SC;
              font-size: 14px;
              color: #333333;
              font-weight: 400;
            }
          }
        }
      }

      .confirm-btn {
        top: 30px;
        left: 380px;
        position: absolute;
        background: #3377fe;
        border-color: #3377fe;
        font-family: PingFang SC, PingFang SC;
        font-size: 14px;
        padding: 10px 24px;
      }
    }
  }

  // 员工信息部分
  .employee-info-section {
    .employee-info-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-left: 100px;

      .info-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;

        .info-field {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .field-label {
            font-family: PingFang SC, PingFang SC;
            font-size: 14px;
            color: #666666;
            font-weight: 400;
          }

          .field-input {
            /deep/ .el-input__inner {
              background: #f5f5f5;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              font-family: PingFang SC, PingFang SC;
              font-size: 14px;
              color: #333333;
              padding: 10px 12px;

              &:focus {
                border-color: #3377fe;
                background: #ffffff;
              }

              &:disabled {
                background: #f5f5f5;
                color: #999999;
              }
            }
          }
        }
      }
    }
  }
}

// 修改密码页面样式
.password-container {
  padding: 40px 24px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;

  .password-form {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .password-field {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .password-label {
        font-family: PingFang SC, PingFang SC;
        font-size: 14px;
        color: #333333;
        font-weight: 400;
      }

      .password-input {
        /deep/ .el-input__inner {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-family: PingFang SC, PingFang SC;
          font-size: 14px;
          color: #333333;
          padding: 10px 12px;
          height: 40px;

          &:focus {
            border-color: #3377fe;
            background: #ffffff;
          }
        }
      }
    }

    .password-actions {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 20px;

      .cancel-btn {
        background: #ffffff;
        border: 1px solid #3377fe;
        color: #3377fe;
        font-family: PingFang SC, PingFang SC;
        font-size: 14px;
        padding: 10px 32px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: #f0f7ff;
        }
      }

      .confirm-password-btn {
        background: #3377fe;
        border-color: #3377fe;
        color: #ffffff;
        font-family: PingFang SC, PingFang SC;
        font-size: 14px;
        padding: 10px 32px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: #2d6ae0;
          border-color: #2d6ae0;
        }
      }
    }
  }
}
</style>
