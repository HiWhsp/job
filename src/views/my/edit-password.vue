<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>Change Password</span>
      </div>
    </div>

    <div class="page-ctx">
      <div class="phone-update-form">
        <div class="update-form-item">
          <label>Old Password:</label>
          <div class="input-box">
            <el-input
              v-model="phoneUpdateForm.oldPassword"
              placeholder="Please enter old password"
              class="form-input"
            />
          </div>
        </div>
        <div class="update-form-item">
          <label>New Password:</label>
          <div class="input-box">
            <el-input
              v-model="phoneUpdateForm.newPassword"
              placeholder="Please enter new password"
              class="form-input"
            />
          </div>
        </div>
        <div class="update-form-item">
          <label>Confirm New Password:</label>
          <div class="input-box">
            <el-input
              v-model="phoneUpdateForm.confirmPassword"
              placeholder="Please confirm password"
              class="form-input-code"
            />
          </div>
        </div>
        <div class="update-form-actions">
          <el-button type="primary" @click="confirm_phone_update"
            >Confirm</el-button
          >
          <el-button @click="resetUpdateForms">Cancel</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "servicePage",
  data() {
    return {
      loading: false,
      phoneUpdateForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    resetUpdateForms() {
      this.phoneUpdateForm = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    },
    confirm_phone_update() {
      // 验证手机号修改逻辑
      if (
        !this.phoneUpdateForm.newPassword ||
        !this.phoneUpdateForm.confirmPassword
      ) {
        this.$message.error("Please fill in complete information");
        return;
      }
      this.$api({
        url: "editUserPassword",
        method: "post",
        data: this.phoneUpdateForm,
      }).then((res) => {
        let { code, msg, data } = res;
        if (code == 200) {
          this.$message.success("Password changed successfully");
          this.resetUpdateForms();
        }
      });
    },
  },
};
</script>

<style scoped lang="less" src="./my-info.less"></style>
<style scoped lang="less">
.update-form-item {
  label {
    width: 100px !important;
  }
}
</style>
