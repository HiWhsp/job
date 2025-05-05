<template>
  <div class="page">
    <div class="left">
      <img src="@/static/account/logo.png" alt="">
      <img src="@/static/account/img1.png" alt="">
    </div>
    <div class="right">
      <h2>登录</h2>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="btn-ripple fit-text" @click="do_submit">登录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      form: {
        phone: '',
        password: '',
      },
      rules: {
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    do_submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api({
            url: 'login',
            method: 'post',
            data: {
              ...this.form,
            }
          }).then((res) => {
            alert(res).then(() => {
              this.loading = false;
            });
            if (res.code == 200) {
              this.$router.push({name: 'index'})
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  background-color: #F4F6F7;
  width: 100%;
  height: 100vh;
  padding: 0;
  position: relative;

}

.left {
  position: absolute;
  width: calc(100% - 524px);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img:nth-child(1) {
    width: 723px;
    height: 398px;
    border-bottom: 32px;
  }

  img:nth-child(2) {
    width: 795px;
    height: 80px;
  }
}

.right {
  position: absolute;
  right: 0;
  width: 524px;
  height: 100%;
  background: #FFFFFF;
  box-shadow: 0px 14px 20px 0px rgba(0, 0, 0, 0.1);
  padding: 0 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 700;
    font-size: 40px;
    color: #3D3D3D;
    margin-bottom: 86px;
  }

  .btn-ripple {
    margin-top: 50px;
    width: 100%;
    height: 65px;
    background: @theme;
    font-size: 22px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
    border-radius: 90px;
  }

  form {
    width: 100%;
  }

  /deep/ .el-input__inner {
    border: none;
    border-bottom: 1px solid #D8D8D8;
  }
}
</style>