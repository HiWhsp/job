<template>
  <div class="container">
    <div class="center">
      <div class="title">注册账户</div>
      <div class="form">
        <el-form label-width="80px" label-position="right" :data="formData" :rules="formRules">
          <el-form-item label="手机号:" prop="phone">
            <el-input clearable v-model="form.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="验证码:" prop="code">
            <sms_phone :form="form"/>
          </el-form-item>
          <el-form-item label="姓名:" prop="code">
            <el-input clearable v-model="form.nickName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="身份:" prop="code">
            <el-select v-model="form.sheng" placeholder="请选择" clearable>
              <el-option v-for="item in list_sheng" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
            <span class="tip">*身份后期不能修改，请谨慎选择！</span>
          </el-form-item>
          <el-form-item label="学校-院系:" prop="code" v-if="form.sheng === 1">
            <div class="flex">
              <el-input clearable v-model="form.nickName" placeholder="请填写学校"
                        style="margin-right: 15px;"></el-input>
              <el-input clearable v-model="form.nickName" placeholder="请填写院系"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="医院:" prop="code" v-if="form.sheng === 2">
            <el-input clearable v-model="form.nickName" placeholder="请填写医院"></el-input>
          </el-form-item>
          <el-form-item label="企业:" prop="code" v-if="form.sheng === 3">
            <el-input clearable v-model="form.nickName" placeholder="请填写企业"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="code">
            <el-input clearable v-model="form.nickName" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="code">
            <el-input clearable v-model="form.nickName" placeholder="请确认密码"></el-input>
          </el-form-item>
        </el-form>

        <!--        协议-->
        <div class="agreement">
          <el-checkbox v-model="agreement"></el-checkbox>
          <span style="margin-left: 10px;">已阅读并同意《用户注册协议》</span>
        </div>
        <div class="submit">注册</div>
        <div class="register-box">
          <router-link to="/register">已有 账号？<span>马上登录</span></router-link>
        </div>
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
      agreement: false,
      form: {},
      list_sheng: [
        {id: 1, title: "教职工"},
        {id: 2, title: "医院"},
        {id: 3, title: "企业"},
      ],
      formData: [],
      formRules: {},
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  height: 1038px;
  background-image: url("~@/assets/img/login/login-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.center {
  position: absolute;
  right: 262px;
  top: 50%;
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