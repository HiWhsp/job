<template>
  <div class="page-retrieve">
    <div class="page">
      <!-- 面包屑导航 -->
      <div class="breadcrumb w-1400">
        <span>Home / Login or Register</span>
      </div>

      <div class="page-ctx">
        <div class="page-inner">
          <!-- 忘记密码框 -->
          <div class="retrieve-container">
            <div class="retrieve-box">
              <h2 class="retrieve-title">FORGOT PASSWORD</h2>

              <div class="retrieve-form">
                <div class="form-group">
                  <label class="form-label">
                    <span class="required">*</span>
                    Email :
                  </label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Please enter"
                    v-model="form.email"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="required">*</span>
                    Verification Code :
                  </label>
                  <div class="form-input-group">
                    <input
                      type="text"
                      class="form-input code-input"
                      placeholder="Please enter"
                      v-model="form.code"
                    />
                    <button class="obtain-btn" :disabled="disabledBtn" @click="getCode">Obtain</button>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="required">*</span>
                    New Password :
                  </label>
                  <input
                    type="password"
                    class="form-input"
                    placeholder="Please enter"
                    v-model="form.pass"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="required">*</span>
                    Confirm Password :
                  </label>
                  <input
                    type="password"
                    class="form-input"
                    placeholder="Please enter"
                    v-model="form.confirm_pass"
                  />
                </div>

                <button class="submit-btn" @click="do_submit()">SUBMIT</button>
                <div class="go-login">
                  <router-link to="/login">Go Login</router-link>
                </div>
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
  name: "retrieve",
  components: {
    terms_modal
  },
  data() {
    return {
      is_agree: true,
      disabledBtn: false, //按钮是否可点击
      timer: null, //定时器 验证码
      timeTotal: 60, //验证码总时长
      time: 60, //验证码倒计时

      form: {
        email: "",
        resetType: 1, //忘记方式：0-手机验证码忘记 1-邮箱验证码忘记
        pass: "",
        code: "",
        confirm_pass: ""
      }
    };
  },
  computed: {
    ...mapState(["vuex_config"])
  },
  created() {},
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    terms_open(id) {
      this.$refs.terms_modal.init(id);
    },

    getCode() {
      if (this.timer) {
        alertErr("The verification code is sent too frequently, please try again later");
        return;
      }

      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;

      if (!reg_email.test(this.form.email)) {
        alertErr("Please enter the correct email");
        return;
      }
      if (this.disabledBtn) {
        return;
      }
      this.disabledBtn = true;
      this.query_code();
    },

    query_code() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "login_emailYzm",
          email: this.form.email
        }
      }).then(res => {
        alert(res);
        if (res.code == 200) {
          this.countdown();
        } else {
          this.disabledBtn = false;
        }
      });
    },

    //倒计时
    countdown() {
      let that = this;
      this.disabledBtn = true;

      this.timer = setInterval(() => {
        if (that.time > 0) {
          that.time--;
        } else {
          that.time = that.timeTotal;
          clearInterval(that.timer);
          that.timer = null;
          this.disabledBtn = false;
        }
      }, 1000);
    },

    do_submit() {
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;

      if (!reg_email.test(this.form.email)) {
        alertErr("Please enter the correct email");
        return;
      }
      if (!this.form.code) {
        alertErr("Please enter the verification code");
        return;
      }
      if (!this.form.pass) {
        alertErr("Please enter the password");
        return;
      }
      if (!this.form.confirm_pass) {
        alertErr("Please enter the confirm password");
        return;
      }
      if (this.form.pass !== this.form.confirm_pass) {
        alertErr("The two passwords entered are inconsistent");
        return;
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "login_resetPass",
          ...this.form
        }
      }).then(res => {
        alert(res);
        let { code, data, msg } = res;
        if (code == 200) {
          this.$router.push("/login");
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.page-retrieve {
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
    padding: 40px 0 150px 0;
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

// 忘记密码容器
.retrieve-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

// 忘记密码框
.retrieve-title {
  font-size: 40px;
  font-weight: bold;
  color: #1e262e;
  margin: 0 0 20px 0;
  text-align: center;
}

.retrieve-form {
  margin-top: 100px;
  width: 723px;
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
  font-size: 20px;
  color: #1f1f1f;
  margin-right: 10px;
  font-weight: 400;
  width: 210px;
  text-align: right;

  .required {
    color: #ff0000;
    margin-left: 2px;
  }
}

.form-input {
  width: 460px;
  height: 45px;
  padding: 0 15px;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  font-size: 14px;
  color: #1f1f1f;
  box-sizing: border-box;

  &::placeholder {
    color: #999;
    font-size: 20px;
  }

  &:focus {
    outline: none;
    border: 1px solid #dbdbdb;
  }
}

.form-input-group {
  display: flex;
  width: 460px;
  align-items: center;

  .form-input {
    width: 355px;
  }
}

.code-input {
  flex: 1;
}

.obtain-btn {
  height: 45px;
  padding: 0 20px;
  background: #00306b;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 20px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #0f2a47;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.submit-btn {
  width: 300px;
  height: 80px;
  background: #ec6a2b;
  border-radius: 10px 10px 10px 10px;
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  margin-left: 80px;

  &:hover {
    background: #e55a00;
  }
}

.go-login {
  text-align: center;
  margin-top: 15px;
  margin-left: 80px;
  font-family: Poppins, Poppins;
  font-weight: 400;

  a {
    color: #00306b;
    font-size: 20px;
    text-decoration: underline;

    &:hover {
      color: #0f2a47;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/retrieve.less"></style>

<style scoped lang="less" src="@/assets/h5css/page/shipei2.less"></style>