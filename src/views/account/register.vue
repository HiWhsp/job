<template>
  <div class="page">
    <div class="page-bg">
      <img src="@img/login/login-bg.jpg" alt="" />
    </div>

    <div class="page-ctx">
      <div class="page-inner page-inner flex-between w-1400">
        <div class="page-poster">
          <!-- <img src="@img/login/poster.png" alt=""> -->
        </div>

        <div class="form-box">
          <div class="input-wrap">
            <div class="tab-box">
              <div class="tab-item">
                {{ form.type == 1 ? "会员" : "企业" }}注册
              </div>
            </div>

            <template>
              <div class="input-box">
                <span>手机号</span>
                <input
                  type="text"
                  placeholder="请输入手机号码"
                  v-model="form.phone"
                />
              </div>

              <register_phone_code :form="form" />

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
              <div class="input-box" v-if="form.type == 2">
                <span>企业名称</span>
                <input
                  type="text"
                  placeholder="请输入企业名称"
                  v-model="form.company"
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
                  登录注册即表示同意
                </span>
                <span class="terms-text" @click="terms_open(92)"
                  >《会员注册协议》</span
                >
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <register_type_modal
      data-title="注册类型"
      ref="register_type_modal"
      @confirm="switchMode"
    />

    <terms_modal ref="terms_modal" />
  </div>
</template>

<script>
import register_type_modal from "@/components/account/register_type_modal.vue"; //短信验证码
import register_phone_code from "@/components/account/register_phone_code.vue"; //短信验证码
import terms_modal from "@/components/account/terms_modal.vue"; //协议弹窗

import { mapState } from "vuex";

export default {
  name: "login",
  components: {
    register_type_modal,
    register_phone_code,
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
  mounted() {
    let type = this.$route.query.type;
    console.log(type);
    if (type !== undefined) {
      this.form.type = type;
    } else {
      this.$refs.register_type_modal.init("");
    }
  },

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
      if (this.form.type == 2 && this.form.company.length === 0) {
        alertErr("请输入企业名称");
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
    height: 780px;
    margin: 0 auto;
    background: transparent;
    align-items: center;
    position: relative;

    .form-box {
      position: relative;
      width: fit-content;
      min-height: 520px;
      background: #f9fafc;
      box-shadow: 0px 2px 15px 1px rgba(79, 79, 79, 0.15);
      border: 1px solid rgba(76, 165, 228, 0.1);

      padding: 40px 40px 70px;
      opacity: 1;
      border-radius: 10px;
    }

    .input-wrap {
      width: 400px;
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
          text-align: center;
          display: inline-block;
          width: 90px;
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
          color: #3B64FC;
        }
      }

      .btn-box {
        margin-top: 40px;

        button {
          width: 100%;
          height: 44px;
          background: linear-gradient(90deg, #ff7327 0%, #ea5959 100%);
          background: #3B64FC;
          font-size: 18px;
          font-family: sans-serif;
          font-weight: 400;
          color: #ffffff;
        }
      }

      .register-box {
        text-align: center;
        margin-top: 20px;
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

<style scoped lang="less" src="@/assets/h5css/page/register.less"></style>
