<template>
  <div class="page">
    <div class="page-bg">
      <img src="@img/login/login-bg.jpg" alt="" />
    </div>
    <div class="page-ctx">
      <div class="page-inner flex-center w-1400">
        <div class="form-box">
          <div class="input-wrap">
            <div class="tab-box">
              <div class="tab-item">手机号注册</div>
            </div>

            <template>
              <div class="input-box">
                <span>手机号</span>
                <input
                  type="text"
                  placeholder="请输入手机号"
                  v-model="form.phone"
                />
              </div>

              <div class="input-box">
                <register_phone_code :form="form" />
              </div>

              <div class="input-box">
                <span>设置密码</span>
                <input
                  type="password"
                  placeholder="请输入密码"
                  v-model="form.pass"
                />
              </div>

              <div class="input-box">
                <span>确认密码</span>
                <input
                  type="password"
                  placeholder="请输入密码"
                  v-model="form.pass2"
                />
              </div>
              <div class="btn-box">
                <button class="btn-ripple btn-hover" @click="do_submit()">注册</button>
              </div>

              <div class="register-box">
                <span>
                  <router-link to="/login">已有账号，直接登录</router-link>
                </span>
              </div>

              <div class="terms-box">
                <div class="terms-box-inner">
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
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">Copyright(C) 法律文书网 All Rights Reserved</div>

    <terms_modal ref="terms_modal" />
  </div>
</template>

<script>
import register_phone_code from "@/components/account/register_phone_code.vue"; //短信验证码
import terms_modal from "@/components/account/terms_modal.vue"; //协议弹窗

import { mapState } from "vuex";

export default {
  name: "register",
  components: {
    register_phone_code,
    terms_modal,
  },
  data() {
    return {
      is_agree: true,

      form: {
        phone: "",
        code: "",
        pass: "",
        pass2: "",
        invite_id: "",
        type: 1,
      },
    };
  },
  computed: {
    ...mapState(["logo"]),
  },
  mounted() {},

  methods: {
    terms_open(id) {
      this.$refs.terms_modal.init(id);
    },
    switchMode(info) {
      console.log(info);
      this.form.type = info;
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
      if (!this.form.pass2) {
        alertErr("请输入确认密码");
        return;
      }
      if (this.form.pass != this.form.pass2) {
        alertErr("两次密码不一致");
        return;
      }
      this.$api({
        url: "register",
        method: "post",
        data: {
          mobile: this.form.phone,
          code: this.form.code,
          password: this.form.pass,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          this.$router.push("/login");
        }
      });
    },

    //条款
    onClick_shengming() {
      this.$router.push("/banquan");
    },
    onClick_yinsi() {
      this.$router.push("/yinsi");
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
      background: #fff;
      box-shadow: 0px 10px 20px 1px rgba(83, 83, 83, 0.2);
      padding: 46px 45px;
      opacity: 1;
      border-radius: 10px;
    }

    .input-wrap {
      margin: 0 auto;

      .tab-box {
        margin-bottom: 40px;
        display: flex;
        justify-content: center;
        align-items: center;

        .tab-item {
          font-family: Poppins, Poppins;
          font-weight: 600;
          font-size: 26px;
          color: #333333;

          &.active {
            color: #333333;
          }
        }
      }

      .input-box {
        margin-bottom: 20px;
        width: 550px;
        height: 50px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        position: relative;

        border: 1px solid #cccccc;
        .sms-box {
          width: 550px;
          height: 100%;
        }

        span {
          text-align: center;
          display: inline-block;
          width: 100px;
          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 16px;
          color: #999;
          border-right: 1px solid #eee;
        }

        input {
          flex: 1;
          height: 100%;
          padding-left: 16px;
          font-size: 14px;
          color: #000;
          border: none;

          &::-webkit-input-placeholder {
            font-size: 16px;
            font-weight: 400;
            color: #d7d7d7;
          }
          &:focus {
            outline: none;
          }
        }
      }
      .tip {
        &:after {
          content: "请输入公司全称";
          color: #f74747;
          position: absolute;
          right: 0;
          top: 10px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 24px;
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
        margin-top: 40px;

        button {
          width: 100%;
          height: 55px;
          background: linear-gradient(90deg, #4e57d9 0%, #519dff 100%);
          font-size: 20px;
          font-weight: 400;
          color: #ffffff;
          border: none;
        }
      }

      .register-box {
        text-align: center;
        font-size: 14px;
        margin-top: 30px;
        margin-bottom: 38px;

        a {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 24px;
          color: #f74747;
          border-bottom: 1px solid #f74747;
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
  height: 45px;
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
    font-size: 14px;
    color: #f74747;
  }
}
</style>
<style scoped lang="less" src="@/assets/h5css/login.less"></style>

<style scoped lang="less" src="@/assets/h5css/register.less"></style>
