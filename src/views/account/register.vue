<template>
  <div>
    <div class="page-top flex-center">
      <div class="w-1400 flex-between">
        <img src="@img/common/logo.png" class="logo" alt="" />
        <div class="column-flex-center">
          <div class="flex-center right">
            <img src="@img/foot/foot-mobile.png" alt="" />
            {{ vuex_config.comPhone }}
          </div>
          <div class="right-btn" @click="$router.push('/')">Back to homepage</div>
        </div>
      </div>
    </div>
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
                <div
                  @click="form.login_type = idx"
                  :class="['tab-item', { active: form.login_type == idx }]"
                  v-for="(it, idx) in ['Phone number registration', 'Email registration']"
                  :key="idx"
                >
                  {{ it }}
                </div>
              </div>

              <template>
                <div class="input-box">
                  <span>{{ form.login_type == 0 ? "Phone number" : "Email" }}</span>
                  <input
                    type="text"
                    :placeholder="`Please enter the phone number`"
                    v-model="form.phone"
                    v-if="form.login_type == 0"
                  />
                  <input
                    type="text"
                    v-else
                    :placeholder="`Please enter the email address`"
                    v-model="form.email"
                  />
                </div>

                <register_phone_code :form="form" />

                <div class="input-box">
                  <span>Set password</span>
                  <input
                    type="password"
                    placeholder="Please enter the password"
                    v-model="form.pass"
                  />
                </div>

                <div class="input-box" style=" margin-bottom: 0;">
                  <span>Confirm password</span>
                  <input
                    type="password"
                    placeholder="请再次输入密码"
                    v-model="form.pass2"
                  />
                </div>

                <!-- 身份选择模块 -->
                <div class="identity-box column-flex-center">
                  <span class="flex-center"
                    >身份选择<img
                      src="@img/common/down.png"
                      style="width: 10px; margin-left: 5px"
                      alt=""
                  /></span>
                  <div class="radio-group">
                    <el-radio-group v-model="form.userType">
                      <el-radio :label="0">个人用户</el-radio>
                      <el-radio :label="1">企业用户</el-radio>
                      <el-radio :label="2">兼职销售代表</el-radio>
                    </el-radio-group>
                  </div>
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
                    我已阅读并同意
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

      <div class="page-btm column-flex-center">
        <div v-html="vuex_config.comBeian" style="color: #fff"></div>
        <div class="contact-info flex-center">
          <div class="contact-item">公司地址：{{ vuex_config.comAddress }}</div>
          <div class="contact-item">联系人：{{ vuex_config.comDesc }}</div>
          <div class="contact-item">手机：{{ vuex_config.comPhone }}</div>
          <div class="contact-item">邮箱：{{ vuex_config.comEmail }}</div>
        </div>
      </div>

      <terms_modal ref="terms_modal" />
    </div>


    <el-dialog title="重要说明" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <div class="zysm">
        <div class="html" v-html="detail.content"></div>
        <div class="btns_flex">
          <div class="btns" @click="handleClose">确定</div>
        </div>
      </div>  
    </el-dialog>
  </div>
</template>

<script>
import register_phone_code from "@/components/account/register_phone_code.vue"; //短信验证码
import terms_modal from "@/components/account/terms_modal.vue"; //协议弹窗

import { mapState } from "vuex";

export default {
  name: "login",
  components: {
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
        login_type: 0,
        phone: "",
        code: "",
        pass: "",
        pass2: "",
        invite_id: "",
        email: "",
        userType: 0, // 新增：用户类型，0=普通用户/个人用户，1=企业用户，2=兼职销售代表
      },
      dialogVisible:false,
      detail:{},
    };
  },

  watch: {
    "form.userType"() {
      console.log('监听')
      if(this.form.userType==2){
        this.dialogVisible=true
      }
    }
  },
  computed: {
    ...mapState(["logo", "vuex_config"]),
  },
  created() {
    this.get_zysm()
  },

  methods: {
    get_zysm(){
      this.$api({
            url: "/service.php",
            method: "get",
            data: {
                action: "news_detail",
                id:143,
            },
        }).then((res) => {
            if (res.code == 200) {
              console.warn("新闻详情", res);
              this.detail=res.data.info
            }
        });
    },
    handleClose(){
      this.dialogVisible=false
    },
    terms_open(id) {
      this.$refs.terms_modal.init(id);
    },

    do_submit() {
      let reg_phone = /^1[3-9]\d{9}$/;
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
      const isemail = this.form.login_type == 1;

      if (!reg_phone.test(this.form.phone) && !isemail) {
        alertErr("请输入正确的手机号");
        return;
      }
      if (!reg_email.test(this.form.email) && isemail) {
        alertErr("请输入正确的邮箱");
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
      let params = {};
      if (isemail)
        params = {
          action: "login_emailReg",
          email: this.form.email,
          code: this.form.code,
          pass: this.form.pass,
          pass2: this.form.pass2,
          userType: this.form.userType,
        };
      else
        params = {
          action: "login_phoneReg",
          phone: this.form.phone,
          code: this.form.code,
          pass: this.form.pass,
          pass2: this.form.pass2,
          userType: this.form.userType,
        };
      this.$api({
        url: "/service.php",
        method: "get",
        data: params,
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
.page-top {
  height: 107px;
  background: #ffffff;
  .logo {
    width: 203px;
  }
  .right {
    color: #1F1F1F;
    font-size: 20px;
    img {
      width: 28.52px;
      margin-right: 6px;
    }
  }
  .right-btn {
    width: 115px;
    height: 27px;
    border-radius: 14px 14px 14px 14px;
    border: 1px solid #00306B;
    color: #00306B;
    font-size: 14px;
    margin-top: 14px;
    text-align: center;
    line-height: 27px;
    cursor: pointer;
  }
}

.page {
  position: relative;

  .page-bg {
    img {
      width: 100%;
      min-height: 665px;
    }
  }

  .page-btm {
    position: absolute;
    padding: 10px;
    width: 100%;
    bottom: 0;
    left: 0;
    color: #fff;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    /deep/a {
      color: #fff !important;
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
    height: auto;
    margin: 0 auto;
    background: transparent;
    align-items: center;
    position: relative;

    .form-box {
      position: relative;
      width: fit-content;
      min-height: 520px;
      background: #f9fafc;
      background: #ffffff;
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
        // justify-content: center;
        align-items: center;

        .tab-item {
          font-family: Poppins, Poppins;
          font-weight: bold;
          font-size: 26px;
          padding-bottom: 14px;
          color: #1F1F1F;
          border-bottom: 4px solid #fff;

          &:first-child {
            // &:after {
            //   content: "";
            //   display: inline-block;
            // width: 2px;
            //   height: 24px;
            //   background-color: #ccc;
            //   margin: 0 30px;
            //   position: relative;
            //   top: 3px;
            margin-right: 66px;
            // }
          }

          &.active {
            color: #00306B;
            border-bottom: 4px solid #00306B;
          }
        }
      }
      .sms-box {
        /deep/.input-box {
          border: 1px solid #cccccc;
        }
      }
      .input-box {
        margin-bottom: 20px;
        width: 100%;
        height: 50px;
        background: #ffffff;
        border: 1px solid #ccc;
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
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 16px;
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
            font-family: Poppins, Poppins;
            font-weight: 400;
            color: #d7d7d7;
          }
        }
       
      }

      .identity-box {
        margin-bottom: 20px;
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        span {
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 16px;
          color: #7d7d7d;
          width: 90px;
          padding-top: 15px;
        }

        .radio-group {
          flex: 2;
          padding-left: 16px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-top: 3px;

          /deep/.el-radio {
            margin-bottom: 15px;
            height: 20px;
            line-height: 20px;

            .el-radio__label {
              font-family: Poppins, Poppins;
              font-weight: 400;
              font-size: 16px;
              color: #7d7d7d;
              padding-left: 8px;
            }

            .el-radio__input.is-checked .el-radio__inner {
              border-color: #00306B;
              background: #00306B;
            }

            .el-radio__input.is-checked + .el-radio__label {
              color: #00306B;
            }

            .el-radio__inner {
              width: 16px;
              height: 16px;
            }
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
        font-family: Poppins, Poppins;
        font-weight: 400;
        line-height: 24px;
        color: #505050;

        a {
          color: #009f39;
        }
      }

      .btn-box {
        margin-top: 30px;

        button {
          border-radius: 8px;
          width: 100%;
          height: 57px;
          background: #00306B;
          font-size: 20px;
          font-family: Poppins, Poppins;
          font-weight: 400;

          color: #ffffff;
        }
      }

      .register-box {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;

        a {
          font-size: 16px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          line-height: 24px;
          color: #00306B;
          border-bottom: 1px solid #00306B;
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
    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 12px;
    color: #505050;

    img {
      margin-right: 10px;
      width: 18px;
      height: 18px;
    }
  }

  .terms-text {
    cursor: pointer;
    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 12px;
    color: #505050;

    &:hover {
      color: #009f39;
    }
  }
}
.zysm{
   /deep/.html{
      li{
        list-style: auto !important;
      }
    }
  .btns_flex{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
   
    .btns{
      width: 150px;
      height: 46px;
      background: #00306B;
      border-radius: 4px 4px 4px 4px;
      font-weight: 400;
      font-size: 18px;
      color: #FFFFFF;
      text-align: center;
      line-height: 46px;
      cursor: pointer;
    }

  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/register.less"></style>


<style scoped lang="less" src="@/assets/h5css/page/shipei2.less"></style>