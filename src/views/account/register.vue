<template>
  <div class="page">
    <terms_modal ref="terms_modal" />
    <pageBreadcrumb :option="nav_option" />

    <div class="page-ctx">
      <div class="center page-inner flex-between">
        <div class="inner form-box">
          <div class="input-wrap">
            <div class="tab-box">
              <div class="tab-item">
                注册
              </div>
            </div>

            <template>
              <div class="input-box">
                <span>手机号</span>
                <input type="text" placeholder="请输入手机号码" v-model="form.phone" />
              </div>

              <mobile_sms :form="form" />

              <div class="input-box">
                <span>设置密码</span>
                <input type="password" placeholder="请输入密码" v-model="form.pass" />
              </div>

              <div class="input-box">
                <span>确认密码</span>
                <input type="password" placeholder="请输入密码" v-model="form.pass2" />
              </div>

              <div class="terms-box">
                <span class="terms-check" @click="is_agree = !is_agree">
                  <img v-if="is_agree" src="@/assets/image/common/check1.png" alt="">
                  <img v-else src="@/static/common/check0.png" alt="">
                  我已阅读并同意
                </span>
                <span class="terms-text" @click="terms_open(92)">《隐私政策》</span>
              </div>

              <div class="btn-box">
                <button class="btn-ripple" @click="do_submit()">确定</button>
              </div>

              <div class="register-box">
                <span> <router-link to="/login">已有账号，去登录</router-link> </span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mobile_sms from "@/components/login/mobile_sms.vue"; //短信验证码
import utilForm from "@/util/utilForm.js";
import terms_modal from "@/components/account/terms_modal.vue"; //协议弹窗

import { mapState } from "vuex";
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";

export default {
  name: "login",
  components: {
    pageBreadcrumb,
    mobile_sms,
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
      },
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
        { route : '/product-cates', title: '注册'},
        { route: '', title: cate_info.title || '' }
      ]
      console.log(option)
      return option
    },
  },
  created() { },

  methods: {
    terms_open(id) {
      this.$refs.terms_modal.init(id);
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

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "login_phoneReg",
          ...this.form
        }
      }).then((res) => {
        alert(res)
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
    height: 543px;
    display: flex;
    align-items: center;
    background-color: #1F1C1F;
  }

  .page-poster {
    margin-left: 46px;

    img {
      width: 664px;
      height: 664px;
    }
  }

  .center {
    margin: 0 auto;
    align-items: center;
    position: relative;

    .inner {
      position: relative;


      width: 560px;


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
        font-weight: 500;
        font-size: 32px;
        color: #fff;


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
      border: 1px solid #7B7B7B;
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
        color: #fff;
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
        color: #fff;
        background-color: transparent;

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
      display: flex;
      align-items: center;
      justify-content: space-between;

      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 24px;
      color: #999999;

      a {
        color: #DF1626;
      }
    }

    .btn-box {
      margin-top: 20px;

      button {
        width: 100%;
        height: 44px;
        background: #DF1626;
        font-size: 18px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
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
        color: #fff;
        border-bottom: 1px solid #fff;
      }
    }
  }
}


.terms-box {
  display: flex;
  align-items: center;
  text-align: center;
  line-height: 24px;

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
      color: #F74747;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/register.less"></style>
