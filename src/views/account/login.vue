<template>
  <div>
    <div class="page-top flex-center">
      <div class="w-1400 flex-between">
        <img src="@img/common/logo.png" class="logo" alt="" />
        <div class="column-flex-center">
          <div class="flex-center right">
            <img src="@img/foot/foot-mobile.png" alt="" />
            {{ vuex_config.comPhone }}
          </div>
          <div class="right-btn" @click="$router.push('/')">返回首页</div>
        </div>
      </div>
    </div>
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
                <div
                  @click="login_type = idx"
                  :class="['tab-item', { active: login_type == idx }]"
                  v-for="(it, idx) in ['手机号登录', '邮箱登录']"
                  :key="idx"
                >
                  {{ it }}
                </div>
              </div>
              <div class="input-box">
                <!-- <span>手机号</span> -->
                <div class="icon-box flex">
                  <img
                    class="icon-phone"
                    v-if="login_type == 0"
                    src="@img/login/phone.png"
                    alt=""
                  />
                  <img
                    class="icon-phone"
                    v-else
                    src="@img/login/email.png"
                    alt=""
                  />
                </div>
                <input
                  type="text"
                  :placeholder="`请输入${login_type == 0 ? '手机号' : '邮箱'}`"
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
                  :placeholder="`请输入${
                    login_type == 0 ? '密码' : '密码'
                  }`"
                  v-model="form.password"
                />
              </div>

              <div class="btn-box">
                <button class="btn-ripple" @click="do_submit()">登录</button>
              </div>

              <div class="pass-act-box flex-between">
                <div class="reg-box">
                  <span> 没有账号， </span>
                  <router-link to="/register">立即注册</router-link>
                </div>
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
      <div class="page-btm column-flex-center">
        <div v-html="vuex_config.comBeian" style="color: #fff"></div>
        <div class="contact-info flex-center">
          <div class="contact-item">公司地址：{{ vuex_config.comAddress }}</div>
          <div class="contact-item">联系人：{{ vuex_config.comDesc }}</div>
          <div class="contact-item">手机：{{ vuex_config.comPhone }}</div>
          <div class="contact-item">邮箱：{{ vuex_config.comEmail }}</div>
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
    terms_modal,
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
        code: "",
      },
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
          password: this.form.password,
        };
      else
        params = {
          action: "login_emailLogin",
          email: this.form.phone,
          loginType: 0,
          // code: this.form.password,
          password: this.form.password,

        };
      this.$api({
        url: "/service.php",
        method: "get",
        data: params,
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
.page-top {
  height: 107px;
  background: #ffffff;
  .logo {
    width: 203px;
  }
  .right {
    color: #1F1F1F;
    font-size: 20px;
    img {
      width: 28.52px;
      margin-right: 6px;
    }
  }
  .right-btn {
    width: 115px;
    height: 27px;
    border-radius: 14px 14px 14px 14px;
    border: 1px solid #7853b2;
    color: #7853b2;
    font-size: 14px;
    margin-top: 14px;
    text-align: center;
    line-height: 27px;
    cursor: pointer;
  }
}
.page {
  position: relative;

  .page-bg {
    img {
      width: 100%;
      // min-height: 665px;
    }
  }
  .page-btm {
    position: absolute;
    padding: 10px;
    width: 100%;
    bottom: 0;
    left: 0;
    color: #fff;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    /deep/a {
      color: #fff !important;
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
      width: 545px;
      height: 545px;
      background: #ffffff;
      box-shadow: 0px 10px 20px 1px rgba(83, 83, 83, 0.2);
      border: 1px solid transparent;
      padding: 60px 45px;
      opacity: 1;
      border-radius: 10px;
    }

    .input-wrap {
      margin: 0 auto;

      .tab-box {
        margin-bottom: 40px;
        display: flex;
        // justify-content: center;
        align-items: center;

        .tab-item {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 26px;
          padding-bottom: 14px;
          color: #1F1F1F;
          border-bottom: 4px solid #fff;

          &:first-child {
            // &:after {
            //   content: "";
            //   display: inline-block;
            // width: 2px;
            // height: 24px;
            // background-color: #ccc;
            // margin: 0 30px;
            // position: relative;
            // top: 3px;
            margin-right: 66px;
            // }
          }

          &.active {
            color: #7853b2;
            border-bottom: 4px solid #7853b2;
          }
        }
      }

      .input-box {
        margin-bottom: 22px;
        width: 100%;
        height: 57px;
        background: #ffffff;
        border: 1px solid #ccc;
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
          font-size: 16px;
          color: #9b9b9b;
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
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #505050;
          }
        }
      }

      .btn-box {
        margin-top: 42px;

        button {
          width: 456px;
          height: 57px;
          background: #7853b2;
          font-size: 20px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          border-radius: 8px 8px 8px 8px;
        }
      }

      .pass-act-box {
        margin-top: 24px;
        span {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 18px;
          color: #666;
        }
        a {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 18px;
          color: #7853b2;
          width: 86px;
          height: 32px;
          background: #f7efff;
          border-radius: 4px 4px 4px 4px;
          text-align: center;
          line-height: 32px;
        }
        .forget {
          color: #ffc208;
          background: #fff4d4;
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
          color: #009f39;
          border-bottom: 1px solid #009f39;
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
    color: #505050;

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
    color: #505050;

    &:hover {
      color: #009f39;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/login.less"></style>

<style scoped lang="less" src="@/assets/h5css/page/shipei2.less"></style>