<template>
  <div class="wrap flex-center">
    <div class="page-left">
      <img src="@imgs/bg-login.jpg" alt="" />
    </div>
    <div class="page-right flex-center">
      <div class="inner-content">
        <div class="inner">
          <div class="title">忘记密码</div>
          <div class="input-box">
            <span class="label">账号</span>
            <input
              type="text"
              placeholder
              v-model="form.username"
              @keyup.enter="do_submit()"
            />
          </div>

          <div class="input-box">
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
          <div class="input-box">
            <span class="label">密码</span>
            <input
              type="password"
              placeholder
              v-model="form.password"
              @keyup.enter="do_submit()"
            />
          </div>

          <div class="btn-box">
            <el-button
              class="btn-ripple btn-ripple"
              :loading="loading"
              @click="throttle_do_submit()"
              >提交</el-button
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
        uuid: "",
      },

      // beian_info: '',
      verify_pic: "",

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
      if (!this.form.password) {
        alert("请输入密码");
        return;
      }

      this.loading = true;

      this.$api({
        url: "/login",
        method: "post",
        data: {
          username: this.form.username,
          password: this.form.password,
          code: this.form.code,
          uuid: this.form.uuid,
        },
      }).then((res) => {
        this.$logjson("登录", res);
        alert(res).then(() => {
          this.loading = false;
        });

        if (res.code == 200) {
          let token = res.token;
          this.$store.commit("set_vuex_token", token);
          //
          this.$api({
            url: "/getInfo",
            method: "get",
            data: {},
          }).then((res) => {
            console.log("动态获取用户信息", res);
            if (res.code == 200) {
              this.$store.commit("set_vuex_user", res);
              this.$router.push("/company-list");
              //

              // this.$store.commit("setAdminUserInfo", res.data);

              // localStorage.setItem("is_permission_refresh", 0)
              // if (res.data.isSup) {
              // 	//超级管理员
              // 	this.$router.push("/banner-list");
              // } else {
              // 	this.$router.push("/banner-list");
              // }
            } else {
              alert(res);
            }
          });
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
      let { phone, email } = this.form;
      let reg_email =
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      let reg_phone = /^1[3-9]\d{9}$/;

      let is_true_phone = reg_phone.test(phone);

      // debugger
      // var isEmail = reg_email.test(email);

      if (!is_true_phone) {
        alertErr("请输入正确的手机号");
        return;
      }

      this.retrieveByEmail();

      this.countdown();
    },

    //修改绑定邮箱
    retrieveByEmail() {
      this.$api("users_sendSms", {
        phone: this.form.phone,
      }).then((res) => {
        console.log("验证码", res);
        let { code, message } = res;
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
    img {
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
    opacity: 1;
    border-radius: 10px;
    padding: 30px 40px;

    .inner {
      width: 100%;
      height: 100%;

      .title {
        text-align: center;
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 24px;
        color: #000000;
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
          color: #C6C6C6;
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
      }

      .btn-box {
        margin-top: 40px;

        button {
          width: 400px;
          height: 60px;
          background: #000000;

          background: linear-gradient( 90deg, #452F86 0%, #A92B83 31%, #D14F8D 67%, #E38179 100%);

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
