<template>
  <div class="page">
    <div class="page-bg">
      <img src="@img/login/login-bg.jpg" alt="" />
    </div>

    <div class="page-ctx">
      <div class="page-inner flex-between w-1400">
        <div class="page-poster">
          <!-- <img src="@img/login/poster.png" alt=""> -->
        </div>

        <div class="form-box">
          <div class="input-wrap">
            <div class="tab-box">
              <div class="tab-item">忘记密码</div>
            </div>

            <div class="input-box">
              <span>手机号</span>
              <input
                type="text"
                placeholder="请输入手机号码"
                v-model="form.phone"
              />
            </div>

            <retrieve_phone_code :form="form" />

            <div class="input-box" v-if="tabType == 'PASS'">
              <span>新密码</span>
              <input
                type="password"
                placeholder="请输入新密码"
                v-model="form.pass"
              />
            </div>
            <div class="input-box" v-if="tabType == 'PASS'">
              <span>确认密码</span>
              <input
                type="password"
                placeholder="请输入确认密码"
                v-model="form.confirm_pass"
              />
            </div>

            <div class="btn-box">
              <button class="btn-ripple" @click="do_submit()">确定</button>
            </div>

            <div class="register-box flex-center">
              <div class="log-box flex" @click="$router.push('/login')">
                <!-- <img src="@img/login/back.png" alt="" /> -->
                <span class="log-text" to="/login">返回登录</span>
              </div>
            </div>

            <div class="terms-box">
              <span class="terms-check" @click="is_agree = !is_agree">
                <img v-if="is_agree" src="@img/common/check1.png" alt="" />
                <img v-else src="@img/common/check0.png" alt="" />
                我已阅读并同意
              </span>
              <span class="terms-text" @click="terms_open(92)"
                >《隐私政策》</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <terms_modal ref="terms_modal" />
  </div>
</template>

<script>
import retrieve_phone_code from "@/components/account/retrieve_phone_code.vue"; //短信验证码
import terms_modal from "@/components/account/terms_modal.vue"; //协议弹窗
import { mapState } from "vuex";

export default {
  name: "retrieve",
  components: {
    retrieve_phone_code,
    terms_modal,
  },
  data() {
    return {
      is_agree: true,

      mode: "账号密码", //微信扫码
      tabType: "PASS", //登录方式
      agreed: false,

      form: {
        phone: "",
        resetType: 0, //忘记方式：0-手机验证码忘记 1-邮箱验证码忘记
        pass: "",
        code: "",
        confirm_pass: "",
        // email: "",
      },
    };
  },
  computed: {
    // ...mapState([""]),
  },
  created() {},

  methods: {
    terms_open(id) {
      this.$refs.terms_modal.init(id);
    },

    do_submit() {
      let reg_phone = /^1[3-9]\d{9}$/;
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;

      if (!reg_phone.test(this.form.phone)) {
        alertErr("请输入正确的手机号");
        return;
      }
      if (!this.form.code) {
        alertErr("请输入验证码");
        return;
      }
      if (!this.form.pass) {
        alertErr("请输入密码");
        return;
      }
      if (!this.form.confirm_pass) {
        alertErr("请输入确认密码");
        return;
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "login_resetPass",
          ...this.form,
        },
      }).then((res) => {
        alert(res);
        let { code, data, msg } = res;
        if (code == 200) {
          this.$router.push("/login");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  position: relative;

  .page-bg {
    img {
      width: 100%;
      min-height: 665px;
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

  .page-poster {
    margin-left: 46px;

    img {
      width: 664px;
      height: 664px;
    }
  }

  .page-inner {
    margin: 0 auto;
    background: transparent;
    align-items: center;
    position: relative;

    .form-box {
      position: relative;
      width: fit-content;
      min-height: 300px;
      background: #f9fafc;
      box-shadow: 0px 2px 15px 1px rgba(79, 79, 79, 0.15);
      border: 1px solid transparent;
      padding: 25px 40px;
      border-radius: 10px;
      padding-bottom: 70px;
    }

    .input-wrap {
      width: 400px;
      margin: 0 auto;

      .tab-box {
        padding-bottom: 10px;
        margin-bottom: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 2px solid #b9b8b8;

        .tab-item {
          font-family: Poppins, Poppins;
          font-weight: 600;
          font-size: 26px;
          color: #333333;
          position: relative;

          &:after {
            content: "";
            display: inline-block;
            width: 100%;
            height: 3px;
            background-color: #000;
            position: absolute;
            bottom: -12px;
            left: 0;
          }
        }
      }

      .input-box {
        margin-bottom: 20px;
        width: 100%;
        height: 50px;
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;

        span {
          text-align: center;
          display: inline-block;
          width: 100px;
          border-right: 1px solid #ccc;
          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #7d7d7d;
          // text-indent: 1em;
        }

        img {
          width: 36px;
        }

        input {
          flex: 2;
          height: 100%;
          padding-left: 16px;
          font-size: 14px;
          color: #000;

          &::-webkit-input-placeholder {
            font-size: 14px;
            font-family: sans-serif;
            font-weight: 400;
            color: #d7d7d7;
          }
        }
      }

      .agree-box {
        text-align: left;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: #999999;

        a {
          color: #f74747;
        }
      }

      .btn-box {
        margin-top: 60px;
        margin-top: 30px;

        button {
          width: 100%;
          height: 44px;
          background: linear-gradient(90deg, #ff7327 0%, #ea5959 100%);
          background: #f74747;
          font-size: 18px;
          font-family: sans-serif;
          font-weight: 400;
          color: #ffffff;
        }
      }

      .register-box {
        margin-top: 20px;
        text-align: center;
        font-size: 14px;

        .log-box {
          cursor: pointer;
          padding-bottom: 3px;
          // border-bottom: 1px solid #ff5f00;

          img {
            margin-right: 8px;
          }
        }

        .log-text {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 24px;
          color: #f74747;
          // border-bottom: 1px solid #F74747;
        }
      }
    }
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
</style>

<style scoped lang="less" src="@/assets/h5css/page/retrieve.less"></style>
