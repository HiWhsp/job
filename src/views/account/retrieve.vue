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
              <button class="btn-ripple btn-hover" @click="do_submit()">确定</button>
            </div>

            <div class="register-box flex-center">
              <div class="log-box flex" @click="$router.push('/login')">
                <img src="@img/login/back.png" alt="" />
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
                >《会员注册协议》</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="copyright">Copyright(C) 法律文书网 All Rights Reserved</div>
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
        url: "findPassword",
        method: "post",
        data: {
          mobile: this.form.phone,
          password: this.form.pass,
          cofirm_password: this.form.confirm_pass,
          code: this.form.code,
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
    position: absolute;
    right: 350px;

    .form-box {
      position: relative;
      width: fit-content;
      min-height: 300px;
      background: #fff;
      box-shadow: 0px 10px 20px 1px rgba(83, 83, 83, 0.2);
      padding: 46px 47px;
      border-radius: 10px;
    }

    .input-wrap {
      margin: 0 auto;

      .tab-box {
        padding-bottom: 10px;
        margin-bottom: 30px;
        display: flex;
        justify-content: center;
        align-items: center;

        .tab-item {
          font-weight: bold;
          font-size: 30px;
          color: #363130;
        }
      }

      .input-box {
        margin-bottom: 20px;
        width: 450px;
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
          border: none;

          &::-webkit-input-placeholder {
            font-size: 14px;
            font-family: sans-serif;
            font-weight: 400;
            color: #d7d7d7;
          }
          &:focus {
            outline: none;
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
          height: 55px;
          background: linear-gradient(90deg, #4e57d9 0%, #519dff 100%);
          font-size: 20px;
          font-family: sans-serif;
          font-weight: 400;
          color: #ffffff;
          border: none;
        }
      }

      .register-box {
        margin-top: 20px;
        text-align: center;
        font-size: 14px;

        .log-box {
          cursor: pointer;
          padding-bottom: 4px;
          border-bottom: 1px solid #e0291f;
          margin-top: 30px;
          margin-bottom: 30px;
          img {
            margin-right: 8px;
          }
        }

        .log-text {
          font-size: 16px;
          font-weight: 400;
          color: #e0291f;
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
    font-size: 14px;
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
<style scoped lang="less" src="@/assets/h5css/login.less"></style>

<style scoped lang="less" src="@/assets/h5css/register.less"></style>
<style scoped  lang="less">
@media screen and (max-width:750px){
  .page .page-inner .input-wrap .register-box .log-text{
    font-size: 0.8rem;
  }
  .page-poster{
    display: none;
  }
  .page .page-inner .input-wrap .register-box .log-box{
    margin: 1rem 0;
  }
}
</style>