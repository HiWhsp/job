<template>
  <div class="wrap flex-center">
    <div class="page-left">
      <img src="@/assets/logo.png" alt="">
      <img src="@imgs/bg-login.png" alt=""/>
    </div>
    <div class="page-right flex-center">
      <div class="inner-content">
        <div class="inner">
          <div class="title">登录</div>
          <div class="input-box">
            <span class="label">账号</span>
            <input
                type="text"
                placeholder
                v-model="form.username"
                @keyup.enter="do_submit()"
            />
          </div>
          <div class="input-box" v-if="login_type == 2">
            <span class="label">密码</span>
            <input
                type="password"
                placeholder
                v-model="form.password"
                @keyup.enter="do_submit()"
            />
          </div>

          <div class="input-box" v-if="login_type == 1">
            <span class="label">验证码</span>
            <input
                type="text"
                placeholder
                v-model="form.code"
                @keyup.enter="do_submit()"
            />

            <button
                :disabled="disabledBtn"
                class="btn-validate-box"
                @click="getCode"
                :class="time != 60 ? 'disabled' : ''"
            >
              获取验证码
              <span>（{{ time }}）</span>
            </button>
          </div>
          <div class="links flex-between">
            <div class="link">
              <span @click="change_login_type()">{{
                  login_type == 1 ? "验证码登录" : "密码登录"
                }}</span>
            </div>
            <div class="link">
              <router-link to="/retireve">忘记密码</router-link>
            </div>
          </div>

          <div class="btn-box">
            <el-button
                class="btn-ripple btn-ripple"
                :loading="loading"
                @click="throttle_do_submit()"
            >登录
            </el-button
            >
          </div>
        </div>
      </div>

      <div class="footer-box">
        <!-- <a href="https://beian.miit.gov.cn/" target="_blank">备案号</a> -->
        <div class="html-box">
          <a href="https://beian.miit.gov.cn/" target="_blank"
          >Copyright © 2025 上海浦项通讯技术有限公司</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sms_phone from "@/components/login/sms_phone.vue";

export default {
  name: "login",
  components: {
    sms_phone,
  },
  data() {
    return {
      form: {
        username: "", //admin
        password: "", //yjd@2025...
        code: "", //
      },

      login_type: 2, //1:验证码登录 2:密码登录

      loading: false,

      disabledBtn: false, //按钮是否可点击
      timer: null, //定时器 验证码
      timeTotal: 60, //验证码总时长
      time: 60, //验证码倒计时
    };
  },
  computed: {},

  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    do_submit() {
      // let { phone, password } = this.form;
      // let phoneReg = /^1[3-9]\d{9}$/;
      if (!this.form.username) {
        alert("请输入账号");
        return;
      }

      if (this.login_type === 2 && !this.form.password) {
        alert("请输入密码");
        return;
      }

      if (this.login_type === 1 && !this.form.code) {
        alert("请输入验证码");
        return;
      }

      this.loading = true;

      this.$api({
        url: "web_login",
        method: "post",
        data: {
          mobile: this.form.username,
          password: this.form.password,
          code: this.form.code,
        },
      }).then((res) => {
        this.$logjson("登录", res);
        alert(res).then(() => {
          this.loading = false;
        });

        if (res.code == 200) {
          let token = res.data.token;
          this.$store.commit("set_vuex_token", token);
          this.$store.dispatch("appInit");
          this.$router.push("/baojiadan-list");
        } else {
          this.query_code();
        }
      });
    },

    getCode() {
      if (this.timer) {
        alertErr("验证码发送频繁，请稍后再试");
        return;
      }

      console.log("发送验证码");
      let {username} = this.form;
      let reg_phone = /^1[3-9]\d{9}$/;

      let is_true_phone = reg_phone.test(username);


      if (!is_true_phone) {
        alertErr("请输入正确的手机号");
        return;
      }

      this.retrieveByEmail();

      this.countdown();
    },

    //修改绑定邮箱
    retrieveByEmail() {
      this.$api({
        url: "api/send",
        method: 'post',
        data: {
          mobile: this.form.username
        }
      }).then((res) => {
        console.log("验证码", res);
        let {code, message} = res;
      });
    },

    change_login_type() {
      this.login_type = this.login_type == 1 ? 2 : 1;
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
  },
};
</script>

<style scoped lang="less">
.wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  align-items: stretch;

  .page-left {
    width: 50%;

    img:first-child {
      position: absolute;
      top: 50%;
      left: 15%;
    }

    img:last-child {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .page-right {
    width: 50%;
    position: relative;
  }

  .inner-content {
    width: 480px;
    // height: 420px;
    border-radius: 10px;
    padding: 30px 40px;

    .inner {
      width: 100%;
      height: 100%;

      .title {
        text-align: center;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 32px;
        color: #333333;
      }

      .input-box {
        position: relative;
        margin-top: 40px;
        border-radius: 4px;
        width: 424px;
        height: 48px;
        background: #f7f8fa;
        border: 1px solid #eaeaea;

        display: flex;

        align-items: center;

        justify-content: space-between;

        .label {
          display: inline-block;
          width: 100px;
          /*no */
          border-right: 1px solid #EEEEEE;

          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 20px;
          color: #666666;
          // text-align: center;
          text-indent: 2em;
        }

        input {
          flex: 2;
          height: 100%;
          padding-left: 20px;
          font-size: 16px;
          color: #000;
          border: none;
          background: #f7f8fa;
        }

        .btn-validate-box {
          background: #f7f8fa;
          position: absolute;
          right: 0;
          display: flex;
          align-items: center;
          cursor: pointer;
          color: @theme_color;

          &.disabled {
            color: #ccc;
          }
        }
      }

      .agree-box {
        text-align: left;
        margin: 40px 0;
        display: flex;

        align-items: center;

        justify-content: space-between;

        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: #999999;

        a {
          color: #000;
        }
      }

      .links {
        margin-top: 30px;
        cursor: pointer;

        .link {
          color: @theme_color;

          a {
            color: @theme_color;
          }
        }
      }

      .btn-box {
        margin-top: 80px;

        button {
          width: 400px;
          height: 60px;
          background: #000000;

          background: linear-gradient(90deg, #452F86 0%, #A92B83 31%, #D14F8D 67%, #E38179 100%);

          font-size: 18px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 24px;
          color: #ffffff;
          letter-spacing: 5px;
        }
      }
    }
  }
}

.footer-box {
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  bottom: 20px;
  height: 35px;
  line-height: 35px;
  //   background: rgba(0, 0, 0, 0.5);

  a {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #7e7e7e;

    &:hover {
      color: coral;
    }
  }

  /deep/ a {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #7e7e7e;

    &:hover {
      color: coral;
    }
  }
}
</style>
