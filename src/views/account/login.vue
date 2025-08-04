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
              <div class="tab-item">登录账号</div>
            </div>
            <div class="input-box">
              <!-- <span>手机号</span> -->
              <div class="icon-box flex">
                <img class="icon-phone" src="@img/login/phone.png" alt="" />
              </div>
              <input
                type="text"
                placeholder="请输入手机号"
                v-model="form.phone"
              />
            </div>
            <div class="input-box">
              <!-- <span>密码</span> -->
              <div class="icon-box flex">
                <img class="icon-pass" src="@img/login/pass.png" alt="" />
              </div>
              <input
                type="password"
                placeholder="请输入密码"
                v-model="form.password"
              />
            </div>

            <div class="btn-box">
              <button class="btn-ripple" @click="do_submit()">登录</button>
            </div>

            <div class="pass-act-box flex-between">
<!--              <div class="reg-box">-->
<!--                <span> 没有账号， </span>-->
<!--                <router-link to="/register">立即注册</router-link>-->
<!--              </div>-->
              <!-- <span class="save">
                <el-checkbox v-model="savePass">记住密码</el-checkbox>
              </span> -->
              <router-link to="retrieve" class="forget">忘记密码</router-link>
            </div>

            <!-- <div class="register-box">
              <span>
                <router-link to="/register">没有账号，去注册 ></router-link>
              </span>
            </div> -->

            <!-- <div class="terms-box">
              <span class="terms-check" @click="is_agree = !is_agree">
                <img v-if="is_agree" src="@img/common/check1.png" alt="" />
                <img v-else src="@img/common/check0.png" alt="" />
                登录注册即表示同意
              </span>
              <span class="terms-text" @click="terms_open(92)"
                >《隐私政策》</span
              >
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <terms_modal ref="terms_modal" />
  </div>
</template>

<script>
import terms_modal from "@/components/account/terms_modal.vue"; //协议弹窗

import { mapState } from "vuex";

export default {
  name: "login",
  components: {
    terms_modal,
  },
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
  created() {},
  methods: {
    terms_open(id) {
      this.$refs.terms_modal.init(id);
    },

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
        url: "/service.php",
        method: "get",
        data: {
          action: "login_phoneLogin",
          ...this.form,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          this.$store.commit("set_vuex_user", res.data);
          this.$store.dispatch("query_user_auth_info");
          this.$router.push("/");
        } else {
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
      width: fit-content;
      min-height: 300px;
      background: #f9fafc;
      box-shadow: 0px 2px 15px 1px rgba(79, 79, 79, 0.15);
      border: 1px solid transparent;
      padding: 46px 40px;
      opacity: 1;
      border-radius: 10px;
    }

    .input-wrap {
      width: 400px;
      margin: 0 auto;

      .tab-box {
        margin-bottom: 46px;
        display: flex;
        justify-content: center;
        align-items: center;

        .tab-item {
          font-family: Poppins, Poppins;
          font-weight: 600;
          font-size: 26px;
          color: #333333;

          &:first-child {
            // &:after {
            //   content: "";
            //   display: inline-block;
            //   width: 2px;
            //   height: 24px;
            //   background-color: #ccc;
            //   margin: 0 30px;
            //   position: relative;
            //   top: 3px;
            // }
          }

          &.active {
            color: #333333;
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
          display: inline-block;
          width: 95px;

          border-right: 1px solid #ccc;
          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #7d7d7d;
          text-indent: 1em;
        }

        .icon-box {
          justify-content: flex-end;
          width: 32px;
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
          background: #3B64FC;
          background: #3B64FC;
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
          color: #3B64FC;
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
          color: #3B64FC;
          border-bottom: 1px solid #3B64FC;
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
    color: #999999;

    &:hover {
      color: #3B64FC;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/login.less"></style>
