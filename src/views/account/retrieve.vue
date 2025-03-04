<template>
  <div class="container">
    <div class="center">
      <div class="title">忘记密码</div>
      <div class="form">
        <el-form label-width="90px" label-position="right" :model="formData" :rules="formRules" ref="form">
          <el-form-item label="手机号:" prop="phone">
            <el-input clearable v-model="formData.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="验证码:" prop="code">
            <sms_phone :form="formData"/>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input clearable v-model="formData.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="password_confirm">
            <el-input clearable v-model="formData.password_confirm" placeholder="请确认密码"></el-input>
          </el-form-item>
        </el-form>
        <div class="submit pointer" @click="submit">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
import sms_phone from "@/components/login/sms_phone.vue"; //短信验证码
export default {
  name: "register",
  components: {
    sms_phone
  },
  data() {
    return {
      type: '',
      form: {},
      formData: {},
      formRules: {
        phone: [{required: true, message: '请输入手机号', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        password_confirm: [{required: true, message: '请输入确认密码', trigger: 'blur'}],
      },
    }
  },
  watch: {
    $route: {
      handler: function (val) {
        if (val.query.type) {
          this.type = val.query.type;
        }
      },
      immediate: true
    }
  },
  methods: {
    //   提交
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api("retrieve", this.formData, "post").then(res => {
            if (res.code === 200) {
              this.$message.success("修改成功!");
              this.$router.push("/login");
            }
          });
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  height: 1038px;
  background-image: url("~@/assets/img/login/login-bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.center {
  position: absolute;
  right: 262px;
  top: 30%;
  margin-top: -192px;
  width: 541px;
  background: #FFFFFF;
  box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 12px 12px 12px 12px;
  padding: 30px 40px;

  .title {
    font-weight: bold;
    font-size: 18px;
    color: #00479D;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;

    &:after {
      content: '';
      display: block;
      width: 52px;
      height: 2px;
      margin-top: 10px;
      background-color: #00479D;
    }
  }

  .form {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .agreement {
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }

    .submit {
      color: #fff;
      width: 390px;
      height: 43px;
      text-align: center;
      line-height: 43px;
      background: #00479D;
      border-radius: 4px 4px 4px 4px;
      font-weight: 400;
      font-size: 16px;
      margin-top: 30px;
    }

    .register-box {
      width: 390px;
      .flex();
      justify-content: end;
      margin-top: 30px;

      a {
        font-weight: 400;
        font-size: 14px;
        color: #333333;

        span {
          color: #00479D;
        }
      }
    }

    .tip {
      font-weight: 400;
      font-size: 12px;
      color: #FF0000;
      line-height: 20px;
    }

    /deep/ .el-form-item__content {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
