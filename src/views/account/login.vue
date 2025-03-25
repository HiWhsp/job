<template>
  <div class="page">
    <modalTerms ref="modalTerms"/>
    <!--    <modalRich ref="modalRich"/>-->
    <div class="mask"></div>

    <div class="center">
      <div class="inner">
        <div class="input-wrap">
          <div class="tab-box">
            <div class="tab-item" :class="{'active': tabType == '供应商'}" @click="tabType = '供应商'">
              供应商
            </div>
            <div class="tab-item" :class="{'active': tabType == '采购商'}" @click="tabType = '采购商'">
              采购商
            </div>
          </div>

          <div class="input-box">
            <img alt="" src="@/assets/image/login/user.png"/>
            <input v-model="form.phone" placeholder="请输入手机号码" type="text"/>
          </div>
          <div class="input-box">
            <img alt="" src="@/assets/image/login/pass.png"/>
            <input v-model="form.password" placeholder="请输入密码" type="password"/>
          </div>
          <div class="flex" style="align-items: start;">
            <div class="input-box">
              <img alt="" src="@/assets/image/login/code.png"/>
              <input v-model="form.code" placeholder="请输入验证码" type="text"/>
            </div>
            <img alt="" src="@/assets/image/login/code-img.png" style="width: 98px; height: 44px; margin-left: 10px;">
          </div>


          <div class="agree-box">
              <span>
                <el-checkbox v-model="savePass">记住密码</el-checkbox>
              </span>
            <router-link to="retrieve">忘记密码</router-link>
          </div>

          <div class="btn-box">
            <button class="btn-ripple" @click="login_submit">登录</button>
          </div>

          <div v-if="tabType == '供应商'" class="register-box">
            <span> <router-link to="/register">没有账号，去注册</router-link> </span>
          </div>
        </div>
        <div class="terms-box">
          <el-checkbox v-model="agreed" style="margin-right: 5px;"></el-checkbox>
          我已阅读并同意 <span @click="terms_open(83)">《隐私政策》</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import CryptoJS from "crypto-js";

// import SmsLogin from "@/components/login/SmsLogin.vue"; //短信验证码
import modalTerms from "@/components/modals/modalTerms.vue"; //协议弹窗
// import modalRich from "@/components/modals/modalRich.vue"; //协议弹窗

import {mapState} from "vuex";

export default {
  name: "login",
  components: {
    // SmsLogin,
    modalTerms,
    QRCode,
    // modalRich,
  },
  data() {
    return {
      mode: "供应商", //微信扫码
      tabType: "供应商", //登录方式 供应商 采购商
      agreed: false,
      savePass: true, //记住密码

      form: {
        type: "0", //类型：0-账号密码 登录     1-账号 验证码登录
        phone: "",
        password: "",
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
            if (res.code == 1) {
              // if (res.data.data.user != undefined && res.data.data.user.id) {
              //   clearInterval(this.interval_token);
              //   this.interval_token = null;
              //   let hasBindPhone = false; //是否绑定手机号
              //   if (hasBindPhone) {
              //     if (index == 0) {
              //       this.$store.dispatch("setToken_active", {
              //         admin_token: res.data.data.user.remember_token,
              //       });
              //       this.getUserInfoFn();
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
      this.$refs.modalTerms.init(id);
      // this.$refs.modalRich.init(id);
    },
    setView() {
      if (localStorage.getItem("save1")) {
        //console.log("回显密码");
        var save1 = localStorage.getItem("save1");
        var save2 = localStorage.getItem("save2");

        this.form.phone = this.decodeString(save1);
        this.form.password = this.decodeString(save2);
      }
    },

    //加密
    encodeString(code) {
      var secretKey = "com.beiyinlai.key";

      // //console.log("CryptoJS", CryptoJS);
      var secretKey = "com.beiyinlai.key";
      var afterEncrypt = CryptoJS.DES.encrypt(code, CryptoJS.enc.Utf8.parse(secretKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();
      //console.log("加密 afterEncrypt", afterEncrypt); //8/nZ2vZXxOzPhU7ZHBwz7w==

      return afterEncrypt;
    },

    //解密
    decodeString(code) {
      var secretKey = "com.beiyinlai.key";
      //console.log("CryptoJS", CryptoJS);

      var afterDecrypt = CryptoJS.DES.decrypt(code, CryptoJS.enc.Utf8.parse(secretKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);

      //console.log("解密 afterDecrypt", afterDecrypt); //encryptCode

      return afterDecrypt;
    },

    //
    login_submit() {
      // debugger;
      let {phone, password} = this.form;
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

        this.$api("users_phoneLogin", {
          type: 0, //0-账号密码 登录     1-账号 验证码登录
          phone: phone,
          password: password,
        }).then((res) => {
          //console.log("登录", res);
          let {code, data, message} = res;
          if (code == 0) {
            this.$message.error(res.message);
          } else if (code == 1) {
            if (this.savePass) {
              localStorage.setItem("save1", this.encodeString(this.form.phone));
              localStorage.setItem("save2", this.encodeString(this.form.password));
            } else {
              localStorage.setItem("save1", "");
              localStorage.setItem("save2", "");
            }

            this.$store.commit("set_baseInfo", data);
            this.$store.dispatch("getUserloginedInfo");

            // this.$router.push("/");
            this.$router.push("/myOrder");
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
          //console.log("登录", res);
          let {code, data, message} = res;

          if (code == 1) {
            this.$store.commit("set_baseInfo", data);
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

<style lang="less" scoped>
.page {
  width: 100%;
  position: relative;

  .mask {
    background: rgba(0, 0, 0, 0.6) url(../../static/account/login-bg.png) 100% 100% no-repeat;
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
      height: 490px;
      padding: 40px 40px 0;
      background: #ffffff;
      opacity: 1;
      border-radius: 10px;
      overflow: hidden;
      // margin: 0 auto;

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
    }

    .tab-box {
      margin-bottom: 30px;
      display: flex;

      .tab-item {
        cursor: pointer;
        text-align: center;
        width: 100px;
        font-size: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #666;
        margin-right: 40px;

        &.active {
          font-size: 24px;
          color: #044FA0;
        }

        &.active::after {
          content: "";
          display: block;
          width: 100%;
          height: 2px;
          margin-top: 10px;
          background: @theme;
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
      height: 44px;
      background: #F7F8FA;
      border: 1px solid #D4D4D4;
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
        width: 20px;
        height: 24px;
        margin-left: 15px;
      }

      input {
        flex: 2;
        height: 100%;
        padding-left: 16px;
        font-size: 14px;
        color: #000;
        background: #F7F8FA;

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
      .flex-between();

      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      color: #999999;

      /deep/ .el-checkbox__inner {
        border-color: @theme !important;
      }

      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        background: @theme !important;
      }

      /deep/ .el-checkbox__label {
        color: @theme !important;
      }

      a {
        color: @theme;
      }
    }

    .btn-box {
      margin-top: 24px;

      button {
        width: 100%;
        height: 44px;
        background: linear-gradient(90deg, #ff7327 0%, #ea5959 100%);
        background: #044FA0;
        font-size: 18px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
      }
    }

    .register-box {
      text-align: center;
      margin-top: 15px;
      font-size: 14px;

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
  padding-left: 40px;
  text-align: center;

  span {
    cursor: pointer;
    color: @theme;
  }
}

.qrcode-cit {
  flex-direction: column;

  .qrcode-box {
    text-align: center;
    width: 180px;
    height: 180px;
    margin-top: 25px;

    img {
      width: 180px;
      height: 180px;
    }
  }

  .title {
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    font-style: normal;
    text-transform: none;
  }

  .text-box {
    margin-top: 24px;
    .flex-center();

    /deep/ .el-checkbox__inner {
      border-color: @theme !important;
    }

    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
      background: @theme !important;
    }

    /deep/ .el-checkbox__label {
      color: @theme !important;
    }

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
