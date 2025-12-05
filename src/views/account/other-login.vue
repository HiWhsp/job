<template>
  <div class="page">
    <div class="page-bg">
      <img src="@img/login/login-bg.png" alt="" />
    </div>
    <div class="page-ctx">
      <div class="page-inner flex-between w-1400">
        <div class="form-box">
          <div class="input-wrap">
            <div class="tab-box">
              <div class="tab-item">会员登录</div>
            </div>
            <div class="qr-code-box-inner">使用微信扫码登录账号</div>
            <div class="qr-code-box"></div>
          </div>

          <div class="other-login" @click="do_other_login()">
            <img src="@img/login/qr-pc.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "otherLogin",
  components: {},
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
  mounted() {
    this.get_qr_code();
  },
  methods: {
    get_qr_code() {
      this.$api({
        url: "scan_qrcode",
        method: "get",
      }).then((res) => {
        // alert(res);
      });
    },
    do_other_login() {
      this.$router.push("/login");
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

  .page-inner {
    height: auto;
    background: transparent;
    align-items: center;
    position: absolute;
    right: 350px;

    .form-box {
      width: 480px;
      height: 408px;
      position: relative;
      min-height: 300px;
      background: #fff;
      box-shadow: 0px 10px 20px 1px rgba(83, 83, 83, 0.2);
      padding: 46px 47px;
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
        display: flex;
        .tab-item {
          font-weight: bold;
          font-size: 30px;
          color: #363130;
        }
      }

      .qr-code-box-inner {
        font-size: 14px;
        color: #333333;
        text-align: center;
        margin-bottom: 20px;
      }
      .qr-code-box {
        width: 200px;
        height: 200px;
        background: #ccc;
        margin: 0 auto;
      }

      .register-box {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-top: 70px;
        text-align: cetner;
        font-size: 14px;

        a {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 24px;
          color: #0081ff;
        }
        .forget {
          color: #363130;
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

.other-login {
  width: 64px;
  height: 64px;
  position: absolute;
  right: 20px;
  top: 20px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
