<template>
  <div class="page">
    <!-- <modalTerms ref="modalTerms" /> -->
    <terms_modal ref="terms_modal" />
    <!-- <div class="mask"></div> -->

    <div class="page-ctx">
      <div class="center page-inner flex-between">
        <div class="page-poster">
          <img src="@/static/login/poster.png" alt="">
        </div>

        <div class="inner form-box">

          <div class="input-wrap">
            <div class="tab-box">
              <div class="tab-item">
                Log in
              </div>
            </div>
            <div class="input-box">
              <span>手机号</span>
              <input type="text" placeholder="请输入手机号" v-model="form.phone" />
            </div>
            <div class="input-box">
              <span>密码</span>
              <input type="password" placeholder="请输入密码" v-model="form.password" />
            </div>

            <div class="pass-act-box">
              <span class="save">
                <el-checkbox v-model="savePass">记住密码</el-checkbox>
              </span>
              <router-link to="retrieve" class="forget">忘记密码</router-link>
            </div>

            <div class="btn-box">
              <button class="btn-ripple" @click="do_submit()">登录</button>
            </div>

            <div class="register-box">
              <span> <router-link to="/register">没有账号，去注册 ></router-link> </span>
            </div>

            <div class="terms-box">
              <span class="terms-check" @click="is_agree = !is_agree">
                <img v-if="is_agree" src="@/static/common/check1.png" alt="">
                <img v-else src="@/static/common/check0.png" alt="">
                登录注册即表示同意
              </span>
              <span class="terms-text" @click="terms_open(92)">《隐私政策》</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// import SmsLogin from "@/components/login/SmsLogin.vue"; //短信验证码
// import modalTerms from "@/components/modals/modalTerms.vue"; //协议弹窗
import terms_modal from "@/components/account/terms_modal.vue"; //协议弹窗

import { mapState } from "vuex";

export default {
  name: "login",
  components: {
    // SmsLogin,
    // modalTerms,

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

      interval_wx_scan: null,


    };
  },
  computed: {
    ...mapState(["logo"]),
  },

  watch: {
    mode(val) {
      if (val == "微信扫码") {
        this.queryWxQrcode();
      } else {
        this.clearIntervalWx();
      }
    },
  },
  created() {
    this.setView();
  },

  beforeDestroy() {
    this.clearIntervalWx();
  },

  methods: {
    //移除轮询
    clearIntervalWx() {
      clearInterval(this.interval_wx_scan);
      this.interval_wx_scan = null;
    },

    //获取微信二维码地址
    queryWxQrcode() {
      this.$api("jssdk_getCodeUrl", {}).then((res) => {
        this.wx_scaner_marker = res.marker;

        this.generateImage();
      });
    },

    //生成微信二维码
    generateImage() {
      this.$refs.qrCodeUrl.innerHTML = "";

      let qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: this.wx_scaner_marker, // 需要转换为二维码的内容
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      //console.log(qrcode);

      this.interval_wx_scan = setInterval(function () {
        that.checkScanWxcode();
      }, 2000);
    },

    //查询微信二维码
    checkScanWxcode() {
      this.$api("users_codeLogin", {
        wx_scaner_marker: this.wx_scaner_marker, //扫码者标识
      })
        .then((res) => {
          if (res.code == 200) {
            // if (res.data.data.user != undefined && res.data.data.user.id) {
            //   clearInterval(this.interval_token);
            //   this.interval_token = null;
            //   let hasBindPhone = false; //是否绑定手机号
            //   if (hasBindPhone) {
            //     if (index == 0) {
            //       this.$store.dispatch("setToken_active", {
            //         admin_token: res.data.data.user.remember_token,
            //       });
            //     }
            //   } else {
            //     if (index == 0) {
            //       this.scan_qrcode();
            //       this.$Notice.error({
            //         title: "提示",
            //         desc: "绑定手机号后请重新扫码登录",
            //       });
            //       this.$Message.error("绑定手机号后请重新扫码登录");
            //     } else {
            //       this.bd_mobile = true;
            //       this.$Message.error("请先绑定手机号后重新扫码登录");
            //     }
            //   }
            // }
          }
        })
        .catch((err) => {
          // reject(err)
          //console.log(err);
        });
    },

    terms_open(id) {
      this.$refs.terms_modal.init(id);
    },
    setView() {

    },

    //
    do_submit() {
      if (!this.is_agree) {
        alertErr('请阅读并勾选协议条款')
        return
      }

      // debugger;
      let { phone, password } = this.form;
      let reg_phone = /^1[3-9]\d{9}$/;
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;

      //手机号密码登录
      if (this.tabType == "PASS") {
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
            ...this.form
          }
        })
          .then((res) => {
            alert(res)
            if (res.code == 200) {
              this.$store.commit("set_baseInfo", res.data);
              this.$store.dispatch("getUserloginedInfo");
              this.$router.push("/order-list");
            } else {

            }
          });
      } else {
        //手机号验证码登录
        if (!code) {
          alertErr("请输入短信验证码");
          return;
        }

        this.$api("users_codeLogin", {
          phone,
          code,
        }).then((res) => {
          alert(res)
          if (res.code == 200) {
            this.$store.commit("set_baseInfo", res.data);
            this.$store.dispatch("getUserloginedInfo");

            this.$router.push("/");
          }
        });
      }
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
        transition: 0.3s;

        &:hover {
          opacity: 0.7;
        }

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

    .pass-act-box {
      text-align: left;
      margin-top: 26px;
      .flex-between();

      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 24px;
      color: #999999;


      .save {
        color: #999999;
      }

      .forget {
        color: #4CA5E4;
      }
    }

    .btn-box {
      margin-top: 60px;

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
      text-align: center;
      margin-top: 20px;
      text-align: cetner;
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

<style scoped lang="less" src="@/assets/h5css/page/login.less"></style>
