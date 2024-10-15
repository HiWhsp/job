<template>
  <div class="page">
    <div class="page-title">
      <img
        src="@/assets/images/arrow-left.png"
        alt=""
        @click="$router.push('/login')"
      />
      <span>微信登录</span>
    </div>

    <div class="inner">
      <div class="logo-box">
        <img src="@/assets/images/h5-logo.png" alt="" style="width: 100px" />
      </div>
      <div class="btn-box">
        <button v-if="!wx_code_curr" @click="onWeChatLogin">
          微信授权登录
        </button>
        <button v-if="wx_code_curr && !has_bind_phone" @click="show = true">
          绑定手机号
        </button>
      </div>
    </div>
    <!-- <div class="footer">登录即同意 <router-link to="/terms?id=1"> 《网站服务条款》 </router-link></div> -->

    <div v-if="show" class="model">
      <div class="modelBox">
        <div class="modelBox_title">绑定手机号</div>

        <div class="modelBox_info">
          <div class="modelBox_info_title">手机号</div>
          <Input
            v-model="mobile"
            size="large"
            placeholder="请输入要修改的手机号"
            class="title-right"
            style="width: 344px; margin-left: 0px !important"
          />
        </div>

        <div class="modelBox_info">
          <div class="modelBox_info_title">验证码</div>
          <Input
            v-model="code"
            size="large"
            placeholder="请输入验证码"
            class="title-right"
            style="width: 344px; margin-left: 0px !important"
          />
          <div class="code cursor code-model" @click="codeActiveFn()">
            {{
              currentTime == 60 ? "获取验证码" : currentTime + "s 后重新获取"
            }}
          </div>
        </div>
        <div class="btn-box">
          <div
            class="but2 cursor"
            style="margin-top: 44px"
            @click="confirm_bind"
          >
            确认
          </div>
          <div
            class="but3 cursor"
            style="margin-top: 44px"
            @click="show = false"
          >
            取消
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WeChatLogin from "@/util/WeChatLogin";

import { h5_scan_login, send, bindMoble } from "@/api/user";

import { mapState, mapActions } from "vuex";
export default {
  name: "weChat-login",
  components: {},
  data() {
    return {
      show: false,
      // show: true,
      mobile: "",
      code: "",
      currentTime: 60,

      wx_code_curr: "",
      has_bind_phone: false,

      _token: "",
    };
  },
  computed: {},
  created() {
    this.setView();
  },

  methods: {
    ...mapActions(["getUserInfo"]),

    onWeChatLogin() {
      WeChatLogin.handleAuthorize();
    },

    async setView() {
      //console.log("0 wxChatLogin setView");

      /**
       * 首次进入页面判断是否需要微信授权登录
       *    通过邀请链接进入 需要授权
       *    通过商品链接进入 不需要授权
       *
       * 用户没有授权登陆过
       *    授权前
       *    授权后
       *        有邀请人
       *        无邀请人
       *
       * 用户授权登陆过
       *    code 未过期
       *    code 已过期
       *
       */

      /**  授权过程：
       * => 获取授权前 www.a.com?fromId=1
       * => 授权中间页 微信链接
       * => 获取授权后 www.a.com?fromId=1&code=2&state=isWxAuthorize
       */

      // 检测是浏览器端还是微信端
      let ua = navigator.userAgent.toLowerCase();
      let isLocalhost =
        location.href.includes("localhost") ||
        location.href.includes("192.168.1"); //是否为本地测试
      if (
        !isLocalhost &&
        String(ua.match(/MicroMessenger/i)) === "micromessenger"
      ) {
        this.$store.commit("set_isWechat", true);

        //获取链接参数绑定邀请人
        let searchObj = new URLSearchParams(location.search);
        this.wx_code_curr = searchObj.get("code") || "";

        //console.log("1 wx_code_curr", this.wx_code_curr);

        //分销绑定邀请人
        let res_wx_login = null;
        if (location.href.includes("code")) {
          let res = await h5_scan_login({
            code: this.wx_code_curr,
            token: "",
          });
          //console.log("2 code登录后res", res);

          // res_wx_login = res.data;
          let info = res.data.data.user || {};
          //console.log("2 code登录后info", info);

          //console.log("3 设置token");
          this.$store.commit("setToken", info.remember_token);
          this._token = info.remember_token;

          // if (res_wx_login && res_wx_login.code == 200) {
          //console.log("4 查询用户信息判断绑定手机号情况");

          // this.getUserInfo().then((res) => {
          this.has_bind_phone = info.mobile;
          if (!this.has_bind_phone) {
            //console.log("5 未绑定手机 ");

            this.show = true;
          } else {
            //console.log("5 已绑定手机 跳转主页");
            this.$router.push({
              name: this.$config.homeName,
            });
          }
          // });
        }

        if (!this.wx_code_curr) {
          // //授权前
          // //有登陆信息
          // if (localStorage.getItem("token")) {
          //   let resUser = await this.$api("users_userInfo");
          //   if (resUser && resUser.code == 1) {
          //     this.$store.commit("set_isLogin", true);
          //     this.$store.commit("set_baseInfo", resUser.data);
          //     this.$store.dispatch("appInit"); //重新初始化
          //   } else {
          //     //登录过期
          //     WeChatLogin.handleAuthorize();
          //   }
          // } else {
          //   //没有登录信息 授权登录
          //   WeChatLogin.handleAuthorize();
          // }
        } else {
          // this.$store.commit("set_wx_code", this.wx_code_curr);
          // //授权后已拿到code
          // let resUser = await this.$api("getUserInfo");
          // if (resUser && resUser.code == 200) {
          //   if (resUser.code == 1) {
          //     // this.$store.commit("set_isLogin", true);
          //     // this.$store.commit("set_baseInfo", resUser.data);
          //     // this.$store.dispatch("appInit"); //重新初始化
          //   } else {
          //     // this.$store.commit("set_isLogin", false);
          //     // this.$store.commit("clear_loginInfo", false);
          //     // this.$store.dispatch("appInit"); //重新初始化
          //   }
          // }
        }
      } else {
        // debugger;
        this.$store.commit("set_isWechat", false);
        // this.$store.dispatch("appInit");
      }
    },

    //绑定手机号
    confirm_bind() {
      //console.log("提交绑定 _token", this._token);

      if (this.mobile == "") {
        this.show = true;
        return this.$Message.error("请输入手机号");
      }

      if (
        this.mobile.trim().length != 11 ||
        !/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.mobile)
      ) {
        this.show = true;
        return this.$Message.error("手机号格式不正确");
      }

      if (this.code == "") {
        this.show = true;
        return this.$Message.error("请输入验证码");
      }

      bindMoble({
        token: this._token,
        mobile: this.mobile,
        code: this.code,
      })
        .then((res) => {
          //console.log("绑定手机号", res);
          let data = res.data;
          //console.log(data.code == 200);

          if (data.code == 200) {
            this.$router.push({
              name: this.$config.homeName,
            });

            // 重新调取获取用户信息的接口
            // this.getUserInfo().then((res) => {
            //   this.$router.push({
            //     name: this.$config.homeName,
            //   });
            // });
          } else {
            this.$Message.error(data.msg);
          }
        })
        .catch((err) => {
          // reject(err)
          //console.log(err);
        });
    },

    //获取验证码
    codeActiveFn() {
      // 验证码发送
      let that = this;
      // eslint-disable-next-line eqeqeq
      if (this.mobile == "") {
        return this.$Message.error("请输入手机号");
      }
      // eslint-disable-next-line eqeqeq
      if (
        this.mobile.trim().length != 11 ||
        !/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.mobile)
      ) {
        return this.$Message.error("手机号格式不正确");
      }
      let currentTime = that.currentTime;
      send({
        mobile: this.mobile,
      })
        .then((res) => {
          let data = res.data;
          // eslint-disable-next-line eqeqeq
          //console.log(data.code == 200);
          // eslint-disable-next-line eqeqeq
          if (data.code == 200) {
            let interval = setInterval(function () {
              that.currentTime = currentTime--;
              if (currentTime <= 0) {
                clearInterval(interval);
                that.currentTime = 60;
              }
            }, 1000);
          } else {
            this.$Message.error(data.msg);
          }
        })
        .catch((err) => {
          // reject(err)
          //console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  .page-title {
    border-bottom: 1px solid #eee;
    height: 47px;
    line-height: 47px;
    position: relative;
    display: flex;
    justify-content: center;
    img {
      position: absolute;
      left: 20px;
      width: 20px;
      height: 20px;
      top: 13px;
    }
    span {
      font-size: 16px;
      color: #333;
    }
  }

  .inner {
    .logo-box {
      text-align: center;
      margin-top: 50px;
      margin-bottom: 100px;
      img {
        width: 100px;
        height: 100px;
      }
    }
    .btn-box {
      text-align: center;
      button {
        outline: none;
        border: none;
        width: 180px;
        height: 40px;
        background: #1d2088;
        opacity: 1;
        border-radius: 4px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }

  .footer {
    margin-top: 50px;
    text-align: center;
    font-size: 12px;

    a {
      color: #1d2088;
    }
  }
}

// 绑定手机号弹窗

.but2 {
  width: 76px;
  height: 40px;
  background: #1d2088;
  border-radius: 4px 4px 4px 4px;
  margin-top: 64px;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #ffffff;
}
.but3 {
  width: 76px;
  height: 40px;
  background: #ffffffff;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #1d2088;
  margin-top: 64px;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #1d2088;
  margin-left: 24px;
}

.model {
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 999;
  background: rgba(0, 0, 0, 0.6);
  top: 0px;
  left: 0px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  display: -webkit-flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.btn-box {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.modelBox {
  width: 90% !important;
  background: #fff;
}

.modelBox_title {
  margin: 0 auto !important;
  padding: 15px;
  text-align: center;
  font-size: 16px;
}

.modelBox_info {
  margin-top: 20px !important;
  display: flex;
  align-items: center;
  position: relative;
}

.modelBox_info_title {
  width: fit-content !important;
  min-width: 5em;
  margin-right: 1em;
  text-align: left;
  padding-left: 1em;
}
.title-right {
  flex: 1;
  padding-right: 20px;
  position: relative;
}

.code {
  position: absolute !important;
  right: 30px !important;
  left: inherit !important;
}

.but2 {
  height: 36px;
  margin-top: 20px !important;
}
.but3 {
  height: 36px;
  margin-top: 20px !important;
}

.model {
  // height: auto;
}

// 会费缴纳
.priceBox_price {
  font-size: 16px !important;
  margin-bottom: 0 !important;
}

.priceBox {
  height: auto;
  transform: scale(1);
  padding: 10px 5px;
  margin-top: 15px;
  width: 48% !important;
}
.priceBox:nth-child(-n + 2) {
  margin-top: 0;
}

.huifei-box {
  margin-left: 0 !important;
  padding: 10px 5px;
  justify-content: space-between;
}

.priceBox_title {
  font-size: 12px !important;
  margin: 0 !important;
}
.priceBox_info {
  margin: 0 !important;
}

.TabspayBox {
  margin-top: 0 !important;
}

.payinfo_lable_title {
  font-size: 14px;
}

.payBox {
  margin-top: 0;
  border: none !important;
  height: auto !important;
}
.pay-type-box {
}

.pay-info-box {
  margin-left: 0 !important;
  padding-right: 15px;
}

.ivu-upload {
  margin-top: 10px !important;
}

.pay-yingfu {
  margin-left: 0 !important;
}

.pay_yf {
  display: none;
}
.pay_active {
  font-size: 18px !important;
}

.h5-wx-pay {
  padding: 10px 20px;
}

.modelBox_info_right {
  font-size: 14px !important;
}

/deep/ .ivu-upload {
  margin-left: 0 !important;
}

.edit-btn-group {
  margin: 0 auto;
  text-align: center;
  justify-content: center;
}

/deep/ .modify::before {
  z-index: 1 !important;
}
</style>
