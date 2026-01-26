<template>
  <div class="page-login">
    <div class="page">
      <!-- 面包屑导航 -->
      <div class="breadcrumb w-1400">
        <span>Home / Login or Register</span>
      </div>

      <div class="page-ctx">
        <div class="page-inner">
          <!-- 登录框 -->
          <div class="login-container">
            <div class="login-box">
              <h2 class="login-title">LOGIN</h2>

              <div class="login-form">
                <div class="form-group">
                  <label class="form-label">
                    <span class="required">*</span>
                    Email :
                  </label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Please enter"
                    v-model="form.phone"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="required">*</span>
                    Password :
                  </label>
                  <input
                    type="password"
                    class="form-input"
                    placeholder="Please enter"
                    v-model="form.password"
                  />
                </div>

                <button class="login-btn" @click="do_submit()">LOGIN</button>
                <div class="forgot-password">
                  <router-link to="retrieve">Forgot Password?</router-link>
                </div>
              </div>
            </div>

            <!-- 新用户提示 -->
            <div class="new-user-text">New user, please register!</div>

            <!-- 注册选项 -->
            <div class="register-options">
              <div class="register-option">
                <h3 class="register-title">BUSINESS</h3>
                <button
                  class="register-btn business-btn"
                  @click="goToRegister('business')"
                >CREATE A BUSINESS ACCOUNT</button>
              </div>
              <div class="register-option">
                <h3 class="register-title">PERSONAL</h3>
                <button
                  class="register-btn personal-btn"
                  @click="goToRegister('personal')"
                >CREATE A PERSONAL ACCOUNT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <terms_modal ref="terms_modal" />
    </div>
  </div>
</template>

<script>
import terms_modal from "@/components/account/terms_modal.vue"; //协议弹窗
import { mapState } from "vuex";

export default {
  name: "login",
  components: {
    terms_modal
  },
  data() {
    return {
      is_agree: true,

      mode: "账号密码", //微信扫码
      tabType: "PASS", //登录方式
      agreed: false,
      savePass: true, //记住密码
      login_type: 0, //手机号登录
      form: {
        loginType: "0", //登录方式：1-手机验证码登录 0-手机密码登录
        phone: "",
        password: "",
        code: ""
      }
    };
  },
  computed: {
    // ...mapState([""]),
  },
  created() {},
  mounted() {
    console.log("路由信息", this.$route);
  },
  methods: {
    terms_open(id) {
      this.$refs.terms_modal.init(id);
    },

    goToRegister(type) {
      // 跳转到注册页面，可以传递类型参数
      if (type === 'business') {
        this.$router.push({
          path: "/register-business"
        });
      } else if (type === 'personal') {
        this.$router.push({
          path: "/register-personal"
        });
      } else {
        this.$router.push({
          path: "/register",
          query: { type: type }
        });
      }
    },

    do_submit() {
      let reg_phone = /^1[3-9]\d{9}$/;
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;

      // if (!this.is_agree) {
      //   alertErr("请阅读并勾选协议条款");
      //   return;
      // }
      const isphone = this.login_type == 0;
      if (!reg_phone.test(this.form.phone) && isphone) {
        alertErr("请输入正确的手机号");
        return;
      }
      if (!reg_email.test(this.form.phone) && !isphone) {
        alertErr("请输入正确的邮箱");
        return;
      }
      if (!this.form.password) {
        alertErr(`请输入${isphone ? "密码" : "邮箱验证码"}`);
        return;
      }
      let params = {};
      if (isphone)
        params = {
          action: "login_phoneLogin",
          phone: this.form.phone,
          loginType: 0,
          password: this.form.password
        };
      else
        params = {
          action: "login_emailLogin",
          email: this.form.phone,
          loginType: 0,
          // code: this.form.password,
          password: this.form.password
        };
      this.$api({
        url: "/service.php",
        method: "get",
        data: params
      }).then(res => {
        alert(res);
        if (res.code == 200) {
          this.$store.commit("set_vuex_user", res.data);
          this.$store.dispatch("query_user_auth_info");
          this.$router.push("/");
        } else {
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.page-login {
  background: #fbfbfb;
  min-height: 100vh;
}

.page {
  position: relative;

  .page-btm {
    padding: 10px;
    width: 100%;
    color: #fff;
    font-size: 14px;
  }

  .page-ctx {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background-color: #fff;
  }

  .page-inner {
    width: 100%;
    margin: 0 auto;
  }
}

// 面包屑导航
.breadcrumb {
  padding: 20px 0;
  color: #1f1f1f;
  font-size: 14px;

  span {
    color: #666;
  }
}

// 登录容器
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

// 登录框

.login-title {
  font-size: 40px;
  font-weight: bold;
  color: #1e262e;
  margin: 0 0 20px 0;
  text-align: center;
}

.login-form {
  width: 723px;
  height: 351px;
  background: #ffffff;
  border-radius: 10px 10px 10px 10px;
  border: 1px solid #d9d9d9;
  padding: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.form-group {
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  width: 100%;
}

.form-label {
  display: block;
  font-size: 16px;
  color: #1f1f1f;
  margin-right: 15px;
  font-weight: 400;
  width: 120px;
  text-align: right;

  .required {
    color: #ff0000;
    margin-left: 2px;
  }
}

.form-input {
  width: 100%;
  height: 45px;
  padding: 0 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #1f1f1f;
  box-sizing: border-box;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #999;
  }
}

.login-btn {
  width: 192px;
  height: 52px;
  background: #ec6a2b;
  border-radius: 6px 6px 6px 6px;

  font-size: 20px;
  color: #ffffff;

  &:hover {
    background: #e55a00;
  }
}

.forgot-password {
  text-align: center;
  margin-top: 15px;

  font-family: Poppins, Poppins;
  font-weight: 400;

  a {
    color: #1e262e;

    font-size: 20px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// 新用户提示
.new-user-text {
  text-align: center;
  color: #1f1f1f;
  font-size: 16px;
  margin: 20px 0 40px 0;
}

// 注册选项
.register-options {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  width: 100%;
  max-width: 1000px;
}

.register-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 350px;
}

.register-title {
  font-size: 40px;
  font-weight: bold;
  color: #1E262E;
  margin: 0 0 20px 0;
}

.register-btn {
  width: 100%;
  height: 50px;
  background: #00306B;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.business-btn,
.personal-btn {
  background: #1a3a5f;

  &:hover {
    background: #0f2a47;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/login.less"></style>

<style scoped lang="less" src="@/assets/h5css/page/shipei2.less"></style>