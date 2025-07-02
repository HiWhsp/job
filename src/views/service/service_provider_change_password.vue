<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>修改密码</span>
      </div>
    </div>

    <div class="page-ctx">
      <div class="phone-update-form">
        <div class="update-form-item">
          <label>旧密码：</label>
          <div class="input-box">
            <el-input
              v-model="phoneUpdateForm.oldPassword"
              placeholder="请输入旧密码"
              class="form-input"
            />
          </div>
        </div>
        <div class="update-form-item">
          <label>新密码：</label>
          <div class="input-box">
            <el-input
              v-model="phoneUpdateForm.newPassword"
              placeholder="请输入新密码"
              class="form-input"
            />
          </div>
        </div>
        <div class="update-form-item">
          <label>确认新密码：</label>
          <div class="input-box">
            <el-input
              v-model="phoneUpdateForm.confirmPassword"
              placeholder="请输入确认密码"
              class="form-input-code"
            />
          </div>
        </div>
        <div class="update-form-actions">
          <el-button type="primary" @click="confirm_phone_update">确认</el-button>
          <el-button @click="resetUpdateForms">取消</el-button>
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
      if (!this.phoneUpdateForm.newPassword || !this.phoneUpdateForm.confirmPassword) {
        this.$message.error("请填写完整信息");
        return;
      }
      this.$api({
        url: "editUserPassword",
        method: "post",
        data: this.phoneUpdateForm,
      }).then((res) => {
        let { code, msg, data } = res;
        if (code == 200) {
          this.$message.success("密码修改成功");
          this.resetUpdateForms();
        }
      });
    },
  },
};
</script>

<style scoped lang="less" src="../my/my-info.less"></style>
<style scoped lang="less">
.update-form-item {
  label {
    width: 100px !important;
  }
}
</style>
