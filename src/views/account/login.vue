<template>
  <div class="page">
    <terms_modal ref="terms_modal"/>
    <div class="page-ctx">
      <div class="center page-inner flex-between">
        <div class="inner form-box">
          <div class="input-wrap">
            <div class="tab-box">
              <div class="tab-item">
                登录
              </div>
            </div>
            <div class="input-box">
              <p>手机号</p>
              <input type="text" placeholder="Account number" v-model="form.phone"/>
            </div>
            <div class="input-box">
              <p>密码</p>
              <input type="password" placeholder="Password" v-model="form.password"/>
            </div>

            <div class="pass-act-box">
              <span class="save">
                <el-checkbox v-model="savePass">记住密码</el-checkbox>
              </span>
              <router-link to="retrieve" class="forget">忘记密码</router-link>
            </div>
            <div class="terms-box">
<!--              <span class="terms-check" @click="is_agree = !is_agree">-->
<!--                <img v-if="is_agree" src="@/static/common/check1.png" alt="">-->
<!--                <img v-else src="@/static/common/check0.png" alt="">-->
<!--                登录注册即表示同意-->
<!--              </span>-->

              <el-checkbox v-model="is_agree">登录注册即表示同意<span class="terms-text" @click="terms_open(92)">《隐私政策》</span></el-checkbox>
            </div>
            <div class="btn-box">
              <button class="btn-ripple" @click="do_submit()">登录</button>
            </div>

            <div class="register-box">
              <router-link to="/register">没有账号? <span>去注册</span></router-link>
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

import {mapState} from "vuex";
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";

export default {
  name: "login",
  components: {
    pageBreadcrumb,
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
    nav_option() {
      let channelId_arr = this.$route.query.ids ? this.$route.query.ids.split('-') : []
      let channelId = channelId_arr.pop()
      console.log(channelId)

      let cate_info = this.vuexFlatCates.find(v => v.id == channelId) || {}

      let option = [
        {route: '/product-cates', title: '登录'},
        {route: '', title: cate_info.title || ''}
      ]
      console.log(option)
      return option
    },
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
  background-color: #fff;

  .page-bg {
    img {
      width: 100%;
      min-height: 665px;
    }
  }

  .page-ctx {
    display: flex;
    align-items: center;
    justify-content: center;
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

    .inner {
      position: relative;

      width: 560px;
      min-height: 520px;

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

      .left {
      }

      .right {

      }
    }

    .tab-box {
      margin-bottom: 40px;
      .flex-center();

      .tab-item {
        font-family: Poppins, Poppins;
        font-weight: 500;
        font-size: 26px;
        color: #000;


        &:first-child {

        }

        &.active {
          color: #333333;
        }
      }
    }

    .input-wrap {
      margin: 0 auto;
    }

    .input-box {
      margin-bottom: 20px;
      width: 100%;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      p {
        display: inline-block;
        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 14px;
        color: #4C4C4C;
        margin-bottom: 10px;
      }

      img {
        width: 36px;
      }

      input {
        padding-left: 24px;
        width: 478px;
        height: 63px;
        background: #F0F1F2;
        border: 1px solid rgba(0, 0, 0, 0.22);
        color: #B5B5B5;

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
      display: flex;
      align-items: center;
      justify-content: space-between;

      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 24px;
      color: #999999;


      .save {
        color: #999999;
      }

      .forget {
        color: #D41C17;
      }
    }

    .btn-box {
      margin-top: 18px;
      padding-bottom: 30px;

      button {
        width: 100%;
        height: 44px;
        background: #000;
        font-size: 18px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: bold;
        color: #ffffff;
      }
      border-bottom: 1px solid #E0E0E0;
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
        color: #3D3D3D;
      }
      span {
        color: #A9151C;
        border-bottom: 1px solid #A9151C;
      }
    }
  }
}

.terms-box {
  margin-top: 50px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #999;
  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #000 !important;
    border-color: #000 !important;
  }

  /deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #000 !important;
  }

  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #000 !important;
  }

  .terms-text {
    cursor: pointer;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #000;

    &:hover {
      color: #F74747;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/login.less"></style>
