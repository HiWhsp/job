<template>
  <div class="page">
    <!-- <modalTerms ref="modalTerms" /> -->
    <terms_modal ref="terms_modal" />
    <div class="mask"></div>

    <div class="center page-inner flex-between">
      <div class="page-poster">
        <img src="@/static/login/poster.png" alt="">
      </div>


      <div class="inner form-box">


        <div class="input-wrap">
          <div class="tab-box">
            <div class="tab-item">
              重置密码
            </div>

          </div>

          <template>
            <div class="input-box">
              <span>手机号</span>
              <input type="text" placeholder="请输入手机号码" v-model="form.phone" />
            </div>

            <!-- 验证码 -->
            <sms_phone :form="form" />

            <div class="input-box" v-if="tabType == 'PASS'">
              <span>新密码</span>
              <input type="password" placeholder="请输入新密码" v-model="form.pass" />
            </div>
            <div class="input-box" v-if="tabType == 'PASS'">
              <span>确认密码</span>
              <input type="password" placeholder="请输入确认密码" v-model="form.confirm_pass" />
            </div>

            <div class="btn-box">
              <button class="btn-ripple" @click="do_submit()">确定</button>
            </div>

            <div class="register-box">
              <span> <router-link to="/login">返回登录 ></router-link> </span>
            </div>

            <div class="terms-box">
              <span class="terms-check" @click="is_agree = !is_agree">
                <img v-if="is_agree" src="@/static/common/check1.png" alt="">
                <img v-else src="@/static/common/check0.png" alt="">
                登录注册即表示同意
              </span>
              <span class="terms-text" @click="terms_open(92)">《隐私政策》</span>
            </div>

          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sms_phone from "@/components/login/sms_phone.vue"; //短信验证码
// import SmsLogin from "@/components/login/SmsLogin.vue"; //短信验证码
// import modalTerms from "@/components/modals/modalTerms.vue"; //协议弹窗
import terms_modal from "@/components/account/terms_modal.vue"; //协议弹窗

import { mapState } from "vuex";

export default {
  name: "login",
  components: {
    sms_phone,
    // modalTerms,
    terms_modal,
  },
  data() {
    return {
      is_agree: true,


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
      this.$refs.terms_modal.init(id);
    },
    setView() { },

    //
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

      this.$api("users_changePass", {
        ...this.form,
      }).then((res) => {
        //console.log("找回密码", res);
        let { code, data, msg} = res;
        if (code == 200) {
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
  // background: rgba(255, 76, 41, 0.95);

  // .mask {

  //   background-size: cover;
  //   position: absolute;
  //   content: "";
  //   left: 0;
  //   bottom: 0;
  //   width: 100%;
  //   height: 100%;
  //   // opacity: 0.1;
  //   pointer-events: none;
  // }

  .page-inner {}

  .page-poster {
    margin-left: 46px;

    img {
      width: 664px;
      height: 664px;
    }
  }



  .center {
    height: 780px;
    width: @width;
    margin: 0 auto;
    background: transparent;
    align-items: center;
    position: relative;



    .inner {
      position: relative;
      width: 560px;
      min-height: 520px;
      background: #F9FAFC;
      box-shadow: 0px 2px 15px 1px rgba(79, 79, 79, 0.15);
      border: 1px solid rgba(76, 165, 228, 0.1);

      padding: 40px 40px 100px;
      opacity: 1;
      border-radius: 10px;



      .mode-toggle {
        position: absolute;
        right: 12px;
        top: 12px;

        img {
          width: 64px;
          cursor: pointer;
        }
      }

      .left {}

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
        width: 95px;

        border-right: 1px solid #ccc;
        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 14px;
        color: #7D7D7D;

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
        color: #4CA5E4;
      }
    }

    .btn-box {
      margin-top: 60px;
      margin-top: 30px;

      button {
        width: 100%;
        height: 44px;
        background: linear-gradient(90deg, #ff7327 0%, #ea5959 100%);
        background: #4CA5E4;
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

      a {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: #4CA5E4;
        border-bottom: 1px solid #4CA5E4;
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
      color: #4CA5E4;
    }
  }
}


</style>

<style scoped lang="less" src="@/assets/h5css/page/retrieve.less"></style>
