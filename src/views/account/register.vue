<template>
  <div class="page">
    <div class="page-bg">
      <img src="@img/login/login-bg.png" alt="" />
    </div>
    <div class="page-ctx">
      <div class="page-inner flex-between w-1400">
        <div class="page-poster">
          <!-- <img src="@img/login/poster.png" alt=""> -->
        </div>
        <div class="form-box">
          <div class="input-wrap">
            <div class="tab-box">
              <div class="tab-item active">注册</div>
            </div>
            <div class="input-box">
              <div class="icon-box flex">
                <p class="flex-between">
                  <span>手机号</span>
                </p>
              </div>
              <input
                type="text"
                placeholder="请输入用户名或手机号"
                v-model="form.phone"
              />
            </div>
            <register_phone_code :form="form" />
            <div class="input-box">
              <div class="icon-box flex">
                <p class="flex-between">
                  <span>设置密码</span>
                </p>
              </div>
              <input
                type="text"
                placeholder="请输入密码"
                v-model="form.pass"
              />
            </div>
            <div class="input-box">
              <div class="icon-box flex">
                <p class="flex-between">
                  <span>确认密码</span>
                </p>
              </div>
              <input
                type="text"
                placeholder="请输入密码"
                v-model="form.password_confirm"
              />
            </div>

            <div class="btn-box">
              <button class="btn-ripple" @click="do_submit()">注册</button>
            </div>

            <div class="register-box">
              <span>
                <router-link to="/login">已有账号，直接登录</router-link>
              </span>
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
import terms_modal from "@/components/account/terms_modal.vue"; //协议弹窗
import register_phone_code from "@/components/account/register_phone_code.vue"; //短信验证码
export default {
  name: "login",
  components: {
    register_phone_code,
    terms_modal,
  },
  data() {
    return {
      is_agree: false,

      mode: "账号密码", //微信扫码
      tabType: "PASS", //登录方式
      agreed: false,
      savePass: true, //记住密码

      form: {
        phone: "",
        pass: "",
        password_confirm: "",
        code: "",
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
      // let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;

      if (!this.is_agree) {
        alertErr("请阅读并勾选隐私政策");
        return;
      }
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
      if (!this.form.password_confirm) {
        alertErr("请输入确认密码");
        return;
      }
      if (this.form.pass !== this.form.password_confirm) {
        alertErr("密码不一致");
        return;
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "login_phoneReg",
          ...this.form,
        },
      }).then((res) => {
        if (res.code == 200) {
          setTimeout(() => {
            this.$router.push("/login");
          }, 1000);
        } else {
          alertErr(res.msg);
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
    height: auto;
    margin: 0 auto;
    background: transparent;
    align-items: center;
    position: relative;

    .form-box {
      position: relative;
      width: 400px;
      min-height: 300px;
      background: #f9fafc;
      box-shadow: 0px 2px 15px 1px rgba(79, 79, 79, 0.15);
      border: 1px solid transparent;
      padding: 46px 40px;
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
        border-bottom: 2px solid #b9b8b8;
        display: flex;
        .tab-item {
          font-family: Poppins, Poppins;
          font-size: 26px;
          color: #acacac;
          position: relative;
          padding: 0 10px;

          &.active {
            color: #333333;
            font-weight: 600;
            &:after {
              content: "";
              display: inline-block;
              width: 100%;
              height: 2px;
              background-color: #000;
              position: absolute;
              bottom: -11px;
              left: 0;
            }
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

        p {
          display: flex;
          width: 100px;
          padding: 0 17px;

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
          justify-content: space-between;
          width: 101px;
          height: 50px;
          .icon-phone {
            width: 15.63px;
          }
          .icon-pass {
            width: 17.49px;
          }
        }

        input {
          flex: 2;
          height: 100%;
          padding-left: 10px;
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

      .btn-box {
        margin-top: 30px;

        button {
          width: 100%;
          height: 44px;
          background: linear-gradient(90deg, #ff7327 0%, #ea5959 100%);
          background: #2e4c87;
          background: #2e4c87;
          font-size: 18px;
          font-family: sans-serif;
          font-weight: 400;
          color: #ffffff;
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
          color: #2e4c87;
        }
      }

      .register-box {
        text-align: center;
        margin-top: 20px;
        text-align: cetner;
        font-size: 14px;

        a {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 24px;
          color: #2e4c87;
          border-bottom: 1px solid #2e4c87;
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
  border-radius: 0 0 10px 10px;

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
    color: #2e4c87;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/login.less"></style>
