<template>
  <div class="page">
    <modalTerms ref="modalTerms" />

    <div class="mask"></div>
    <div class="center">
      <div class="inner">
        <!-- <div class="left"></div> -->
        <div class="right">
          <div class="input-wrap">
            <div class="tab-box">
              <div class="tab-item" :class="tabType == 'PASS' ? 'active' : ''" @click="tabType = 'PASS'">注册</div>
              <!-- <div
                class="tab-item"
                :class="tabType == 'CODE' ? 'active' : ''"
                @click="tabType = 'CODE'"
              >
                验证码登录
              </div> -->
            </div>

            <div class="input-box">
              <!-- <span>账号</span> -->
              <!-- <img src="@img/other/icon-email.png" alt="" /> -->
              <input type="text" placeholder="请输入手机号码" v-model="form.phone" />
            </div>

            <!-- 验证码 -->
            <sms_phone :form="form" />

            <div class="input-box">
              <!-- <span>账号</span> -->
              <!-- <img src="@img/other/icon-email.png" alt="" /> -->
              <input type="text" placeholder="请输入邀请人" v-model="form.invite_id" />
            </div>

            <div class="input-box">
              <!-- <span>密码</span> -->
              <!-- <img src="@img/other/icon-lock.png" alt="" /> -->
              <input type="password" placeholder="请输入密码" v-model="form.pass" />
            </div>

            <div class="input-box">
              <!-- <span>密码</span> -->
              <!-- <img src="@img/other/icon-lock.png" alt="" /> -->
              <input type="password" placeholder="请输入确认密码" v-model="form.confirm_pass" />
            </div>

            <div class="agree-box">
              <!-- <span>
                <el-checkbox v-model="agreed">
                  我已阅读并同意
                  <router-link to="/"> 《用户协议》 </router-link>
                  与 <router-link to="/"> 《隐私政策》 </router-link>
                </el-checkbox>
              </span> -->

              <el-checkbox v-model="agreed">
                我已阅读并同意
                <span @click="terms_open(92)">《用户协议》</span> 与 <span @click="terms_open(29)">《隐私政策》</span>
              </el-checkbox>

              <!-- <router-link to="/">回到主页 ></router-link> -->
              <!-- <span class="action"> 已有账号，去<router-link to="/login">登录 ></router-link> </span> -->
            </div>

            <div class="btn-box">
              <button :disabled="!agreed" @click="onSubmit">注册</button>
            </div>

            <div class="register-box">
              <!-- <router-link to="register">快捷登录方式</router-link> -->
            </div>

            <div class="fix-bottom-box">已有账号？<router-link to="/login">登录</router-link></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sms_phone from "@/components/login/sms_phone.vue"; //短信验证码
import modalTerms from "@/components/modals/modalTerms.vue"; //协议弹窗

import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    sms_phone,
    modalTerms,
  },
  data() {
    return {
      tabType: "PASS", //登录方式
      agreed: false, //是否统一协议内容

      form: {
        phone: "", //36267862@qq.com
        code: "",
        pass: "", //123456
        confirm_pass: "",
        invite_id: "",
      },
    };
  },
  computed: {
    ...mapState([""]),
  },
  created() {
    this.setView();
  },

  methods: {
    terms_open(id) {
      this.$refs.modalTerms.init(id);
    },

    setView() {},

    //
    onSubmit() {
      // debugger;
      let { phone, code, pass, confirm_pass, invite_id } = this.form;

      let reg_phone = /^1[3-9]\d{9}$/;
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
      let is_true_phone = reg_phone.test(phone);

      // //需要校验的条件
      if (!is_true_phone) {
        alertErr("请输入正确的手机号码");
        return;
      }

      if (!code) {
        alertErr("请输入验证码");
        return;
      }

      if (!pass) {
        alertErr("请输入密码");
        return;
      }
      if (!confirm_pass) {
        alertErr("请输入确认密码");
        return;
      }
      if (pass != confirm_pass) {
        alertErr("两次密码不一致");
        return;
      }

      if (this.tabType == "PASS") {
        this.$api("users_phoneRegister", {
          phone,
          code,
          pass,
          confirm_pass,
        }).then((res) => {
          //console.log("注册", res);
          let { code, data, msg} = res;
          if (code == 0) {
          } else if (code == 200) {
            // this.$store.commit("set_baseInfo", data);
            // this.$store.dispatch("getUserloginedInfo");
            this.$router.push("/login");
          }
        });
      } else {
        if (!code) {
          alertErr("请输入短信验证码");
          return;
        }

        this.$api("users_codeLogin", {
          phone,
          code,
        }).then((res) => {
          //console.log("登录", res);
          let { code, data, msg} = res;
          if (code == 200) {
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


<style scoped lang="less">
/deep/ .sms-box {
  input {
    padding-left: 0;
  }
  img {
    display: none;
  }
}

.page {
  background: rgba(255, 76, 41, 0.95);

  .mask {
    background-size: cover;
    position: absolute;
    content: "";
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0.1;
    pointer-events: none;
  }

  .center {
    background: transparent;
    position: relative;
    height: 100vh;
    .flex();
    .inner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 650px;
      height: 664px;
      background: #ffffff;
      opacity: 1;
      border-radius: 10px;

      background: #fff;
      margin: 0 auto;
      .flex-center();

      .left {
      }
      .right {
        padding: 0 40px 30px 40px;
      }
    }

    .tab-box {
      margin-bottom: 40px;
      .flex-center();

      .tab-item {
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #cccccc;
        cursor: pointer;

        font-size: 30px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 30px;
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

    /deep/ .input-box {
      margin-bottom: 15px !important;
    }
    .input-box {
      margin-bottom: 15px;
      width: 100%;
      height: 50px;
      background: #ffffff;
      border-bottom: 1px solid #eeeeee;
      opacity: 1;
      border-radius: 4px;
      .flex-between();

      span {
        display: inline-block;
        width: 90px; /*no */
        border-right: 1px solid #ccc;

        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: #999999;
      }

      img {
        width: 36px;
      }

      input {
        flex: 2;
        height: 100%;
        padding-left: 20px;
        padding-left: 0;
        font-size: 16px;
        color: #000;
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
        color: #f29f25;
      }

      .action {
        color: #777;
      }

      span {
        cursor: pointer;
        &:hover {
          color: #4CA5E4;
        }
      }
    }

    .btn-box {
      margin-top: 50px;
      button {
        width: 100%;
        height: 50px;
        background: linear-gradient(90deg, #ff7327 0%, #ea5959 100%);
        opacity: 1;
        // border-radius: 50px;

        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 24px;
        color: #ffffff;

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }

    .register-box {
      margin-top: 30px;
      text-align: cetner;
      a {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: #999999;
      }
    }

    .fix-bottom-box {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      line-height: 60px;
      background: #f3f3f3;
      opacity: 1;
      border-radius: 0px 0px 10px 10px;

      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      a {
        color: #ff4c29;
      }
    }
  }
}
</style>
