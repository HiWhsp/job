<template>
  <div class="page">
    <div class="page-bg">
      <img src="@img/login/login-bg.png" alt="" />
    </div>
    <div class="page-ctx">
      <div class="page-inner flex-between w-1400">
        <div class="form-box">
          <div class="input-wrap">
            <div class="tab-box">
              <div class="tab-item">会员登录</div>
            </div>
            <div class="input-box">
              <div class="icon-box">手机号</div>
              <input
                type="text"
                placeholder="请输入手机号"
                v-model="form.phone"
              />
            </div>
            <div class="input-box">
              <div class="icon-box">密码</div>
              <input
                type="password"
                placeholder="请输入密码"
                v-model="form.password"
              />
            </div>

            <div class="forget-box">
              <el-checkbox v-model="is_agree">记住密码</el-checkbox>
              <span>
                <router-link to="retrieve" class="forget">忘记密码</router-link>
              </span>
            </div>

            <div class="btn-box">
              <button class="btn-ripple btn-hover" @click="do_submit()">
                登录
              </button>
            </div>

            <div class="register-box">
              <span>
                <router-link to="/register">没有账号，去注册</router-link>
              </span>
            </div>
          </div>

          <div class="other-login" @click="do_other_login()">
            <img src="@img/login/qr-code.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  components: {},
  data() {
    return {
      is_agree: true,

      mode: "账号密码", //微信扫码
      tabType: "PASS", //登录方式
      agreed: false,
      savePass: true, //记住密码

      form: {
        loginType: "0", //登录方式：1-手机验证码登录 0-手机密码登录
        phone: "",
        password: "",
        code: "",
      },
    };
  },
  computed: {
    // ...mapState([""]),
  },
  created() {
    this.form.phone = localStorage.getItem("login_phone") || "";
    this.form.password = localStorage.getItem("login_password") || "";
  },
  methods: {
    do_submit() {
      let reg_phone = /^1[3-9]\d{9}$/;
      // let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;

      // if (!this.is_agree) {
      //   alertErr("请阅读并勾选协议条款");
      //   return;
      // }
      if (!reg_phone.test(this.form.phone)) {
        alertErr("请输入正确的手机号");
        return;
      }
      if (!this.form.password) {
        alertErr("请输入密码");
        return;
      }

      this.$api({
        url: "web_login",
        method: "post",
        data: {
          mobile: this.form.phone,
          password: this.form.password,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          if (this.is_agree) {
            localStorage.setItem("login_password", this.form.password);
            localStorage.setItem("login_phone", this.form.phone);
          }
          localStorage.setItem("token", res.data.token);
          this.$store.commit("set_vuex_user", res.data);
          this.$store.dispatch("query_user_auth_info");
          this.$router.push("/");
        } else {
        }
      });
    },
    do_other_login() {
      this.$router.push("/other-login");
    },
  },
};
</script>

<style scoped lang="less">
.page {
  position: relative;

  .page-bg {
    height: 100vh;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .page-ctx {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
  }

  .page-inner {
    height: auto;
    background: transparent;
    align-items: center;
    position: absolute;
    right: 350px;

    .form-box {
      position: relative;
      min-height: 300px;
      background: #fff;
      box-shadow: 0px 10px 20px 1px rgba(83, 83, 83, 0.2);
      padding: 46px 47px;
      opacity: 1;
      border-radius: 10px;
    }

    .input-wrap {
      width: 100%;
      margin: 0 auto;

      .tab-box {
        padding-bottom: 10px;
        margin-bottom: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex;
        .tab-item {
          font-weight: bold;
          font-size: 30px;
          color: #363130;
        }
      }

      .input-box {
        margin-bottom: 20px;
        width: 457px;
        height: 50px;
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;

        p {
          display: flex;
          width: 100px;
          padding: 0 25px;

          border-right: 1px solid #ccc;
          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #7d7d7d;
          span {
            font-size: 16px;
          }
        }

        .icon-box {
          width: 90px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin: 10px 0;
          border-right: 1px solid #ccc;
          .icon-phone {
            width: 15.63px;
          }
          .icon-pass {
            width: 17.49px;
          }
        }

        input {
          flex: 1;
          height: 100%;
          padding-left: 15px;
          font-size: 14px;
          color: #000;
          border: none;

          &::-webkit-input-placeholder {
            font-size: 14px;
            font-family: sans-serif;
            font-weight: 400;
            color: #9b9b9b;
          }
          &:focus {
            outline: none;
          }
        }
      }

      .btn-box {
        margin-top: 30px;

        button {
          width: 455px;
          height: 57px;
          background: linear-gradient(90deg, #4e57d9 0%, #519dff 100%);
          border-radius: 8px 8px 8px 8px;
          font-size: 20px;
          font-weight: 400;
          color: #fff;
          border: none;
        }
      }

      .pass-act-box {
        margin-top: 24px;
        span {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #666;
        }
        a {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #f74747;
        }
      }

      .forget-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        .el-checkbox {
          font-size: 14px;
          color: #363130;
        }
        a {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 24px;
          color: #0081ff;
        }
      }

      .register-box {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-top: 70px;
        text-align: cetner;
        font-size: 14px;

        a {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 24px;
          color: #0081ff;
        }
        .forget {
          color: #363130;
        }
      }
    }
  }

  .copyright {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
    color: #363130;
    height: 70px;
    line-height: 70px;
  }
}

.terms-box {
  position: absolute;
  height: 40px;
  background: #f5f6f8;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: flex-start;
  padding-left: 20px;
  text-align: center;

  .terms-check {
    cursor: pointer;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 12px;
    color: #999999;

    img {
      margin-right: 10px;
      width: 18px;
      height: 18px;
    }
  }

  .terms-text {
    cursor: pointer;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 12px;
    color: #f74747;
  }
}

.other-login {
  width: 64px;  
  height: 64px;
  position: absolute;
  right: 20px;
  top: 20px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="less" scoped src="./style/h5-login.less"></style>
