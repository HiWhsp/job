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
              v-model="phoneUpdateForm.oldPhone"
              placeholder="请输入旧密码"
              class="form-input"
            />
          </div>
        </div>
        <div class="update-form-item">
          <label>新密码：</label>
          <div class="input-box">
            <el-input
              v-model="phoneUpdateForm.newPhone"
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
          <el-button @click="cancel_phone_update">取消</el-button>
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
      this.emailUpdateForm = {
        oldEmail: "",
        newEmail: "",
        code: "",
      };
    },
    cancel_phone_update() {
      this.phoneUpdateForm = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    },
    confirm_phone_update() {
      // 验证手机号修改逻辑
      if (!this.phoneUpdateForm.newPhone || !this.phoneUpdateForm.code) {
        this.$message.error("请填写完整信息");
        return;
      }
      // 这里应该调用API验证并更新手机号
      this.my_info.mobile = this.phoneUpdateForm.newPhone;
      this.showPhoneUpdate = false;
      this.resetUpdateForms();
      this.$message.success("手机号更换成功");
    },
    open_email_update() {
      this.showEmailUpdate = true;
      this.emailUpdateForm.oldEmail = this.my_info.email;
    },
    cancel_email_update() {
      this.showEmailUpdate = false;
      this.emailUpdateForm = {
        oldEmail: "",
        newEmail: "",
        code: "",
      };
    },
    throttle_do_submit() {},
    do_submit() {
      this.loading = true;
      this.$api({
        url: "updateUser",
        method: "post",
        data: this.my_info,
      }).then((res) => {
        let { code, msg, data } = res;
        this.loading = false;
        if (code == 200) {
          this.$message.success("保存成功");
        }
      });
    },
  },
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
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
