<template>
  <div class="page">
    <modalTerms ref="modalTerms"/>
    <!--    <modalRich ref="modalRich" />-->
    <div class="mask"></div>

    <div class="center">
      <div class="inner">
        <!--        <div class="mode-toggle">-->
        <!--          <img v-if="mode == '账号密码'" @click="mode = '微信扫码'" src="../../static/account/login-qrcode.png" alt="" />-->
        <!--          <img v-if="mode == '微信扫码'" @click="mode = '账号密码'" src="../../static/account/login-pc.png" alt="" />-->
        <!--        </div>-->

        <div class="input-wrap">
          <div class="tab-box">
            <div
                class="tab-item"
                :class="tabType == 'PASS' ? 'active' : ''"
                @click="tabType = 'PASS'"
            >
              重置密码
            </div>
            <!-- <div
                class="tab-item"
                :class="tabType == 'CODE' ? 'active' : ''"
                @click="tabType = 'CODE'"
              >
                验证码登录
              </div> -->
          </div>

          <template>
            <div class="input-box">
              <span>手机号</span>
              <!-- <img src="@img/other/icon-email.png" alt="" /> -->
              <input type="text" placeholder="请输入手机号码" v-model="form.phone"/>
            </div>

            <!-- 验证码 -->
            <sms_phone :form="form"/>

            <div class="input-box" v-if="tabType == 'PASS'">
              <span>新密码</span>
              <!-- <img src="@img/other/icon-lock.png" alt="" /> -->
              <input type="password" placeholder="请输入新密码" v-model="form.pass"/>
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
              <button class="btn-ripple" @click="retrieve_submit">确定</button>
            </div>

            <div class="register-box flex flex-center">
              <span> <router-link to="/login"><img src="../../static/account/left-row.png" alt="">返回登录</router-link> </span>
            </div>

<!--            <div class="terms-box">-->
<!--              登录注册即表示同意 <span @click="terms_open(83)">《隐私政策》</span>-->
<!--            </div>-->
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sms_phone from "@/components/login/sms_phone.vue"; //短信验证码
// import SmsLogin from "@/components/login/SmsLogin.vue"; //短信验证码
import modalTerms from "@/components/modals/modalTerms.vue"; //协议弹窗
// import modalRich from "@/components/modals/modalRich.vue"; //协议弹窗

import {mapState} from "vuex";

export default {
  name: "login",
  components: {
    sms_phone,
    modalTerms,
    // modalRich,
  },
  data() {
    return {
      mode: "账号密码", //微信扫码
      tabType: "PASS", //登录方式
      agreed: false,

      form: {
        type: "1",
        phone: "",
        code: "",
        pass: "",
        confirm_pass: "",
        source: 1, //类型：0-邮箱验证  1-短信验证  2-不需要验证
      },
    };
  },
  computed: {
    ...mapState(["logo"]),
  },
  created() {
    this.setView();
  },

  methods: {
    terms_open(id) {
      this.$refs.modalRich.init(id);
    },
    setView() {
    },

    //
    retrieve_submit() {
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

      this.$api("users_changePass", {
        ...this.form,
      }).then((res) => {
        //console.log("找回密码", res);
        let {code, data, message} = res;
        if (code == 1) {
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
  width: 100%;
  position: relative;

  .mask {
    background: url(../../static/account/login-bg.png) 100% 100% no-repeat;
    background-size: cover;
    position: absolute;
    content: "";
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    // opacity: 0.1;
    pointer-events: none;
  }

  .center {
    height: 780px;
    width: @width;
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    background: transparent;
    align-items: center;
    position: relative;

    .inner {
      position: relative;
      width: 480px;
      min-height: 520px;

      padding: 40px;
      background: #ffffff;
      opacity: 1;
      border-radius: 10px;
      overflow: hidden;
      background: #fff;
      // margin: 0 auto;

      .mode-toggle {
        position: absolute;
        right: 12px;
        top: 12px;

        img {
          width: 64px;
          cursor: pointer;
        }
      }

      .left {
      }

      .right {
        // width: 480px;
        // height: 480px;
        // background: #ffffff;
        // box-shadow: 0px 10px 20px rgba(1, 100, 98, 0.2);
        // opacity: 1;
        // border-radius: 10px;

        // padding: 40px 40px 30px 40px;
      }
    }

    .tab-box {
      margin-bottom: 40px;
      .flex-center();

      .tab-item {
        font-size: 24px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
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

    .input-wrap {
      width: 400px;
      margin: 0 auto;
    }

    .input-box {
      margin-bottom: 20px;
      width: 100%;
      height: 50px;
      background: #ffffff;
      border: 1px solid #eeeeee;
      border-radius: 4px;
      .flex-between();
      overflow: hidden;

      span {
        display: inline-block;
        width: 90px; /*no */
        border-right: 1px solid #eee;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: #999999;
        text-indent: 1em;
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
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #d7d7d7;
        }
      }
    }

    .agree-box {
      text-align: left;
      margin-top: 20px;
      .flex-between();

      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 24px;
      color: #999999;

      a {
        color: @theme;
      }
    }

    .btn-box {
      margin-top: 60px;
      margin-top: 30px;

      button {
        width: 100%;
        height: 44px;
        background: linear-gradient(90deg, #ff7327 0%, #ea5959 100%);
        background: @theme;
        font-size: 18px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
      }
    }

    .register-box {
      margin-top: 30px;
      text-align: center;
      font-size: 14px;
      img {
        width: 17.5px;
        height: 12px;
        margin-bottom: 6px;
        margin-right: 5px;
      }

      a {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: @theme;
        border-bottom: 1px solid @theme;
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
  // padding-left: 40px;
  text-align: center;

  span {
    cursor: pointer;

    &:hover {
      color: @theme;
    }
  }
}

.qrcode-cit {
  .qrcode-box {
    img {
      width: 240px;
      height: 240px;
    }
  }

  .text-box {
    margin-top: 24px;
    .flex-center();

    img {
      width: 32px;
      margin-right: 10px;
    }

    .text {
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/retrieve.less"></style>
