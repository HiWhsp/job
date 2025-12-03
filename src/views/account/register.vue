<template>
  <div class="page">
    <div class="page-ctx">
      <div class="page-inner flex-center w-1400">
        <div class="form-box">
          <div class="input-wrap">
            <div class="tab-box">
              <div class="tab-item">用户注册</div>
            </div>

            <template>
              <div class="input-box">
                <span>姓名：</span>
                <input
                  type="text"
                  placeholder="请输入姓名"
                  v-model="form.name"
                />
              </div>
              <div class="input-box">
                <span>邮箱：</span>
                <input
                  type="text"
                  placeholder="请输入邮箱"
                  v-model="form.email"
                />
              </div>
              <div class="input-box tip">
                <span>公司名称：</span>
                <input
                  type="text"
                  placeholder="请输入公司名称"
                  v-model="form.company"
                />
              </div>
              <div class="input-box">
                <span>职位：</span>
                <input
                  type="text"
                  placeholder="请输入职位"
                  v-model="form.position"
                />
              </div>

              <div class="input-box">
                <span>联系地址：</span>
                <area_select ref="area_select" @change="changeSelectAddress" />
              </div>
              <div class="input-box">
                <span>详细地址：</span>
                <input
                  type="text"
                  placeholder="请输入详细地址"
                  v-model="form.address"
                />
              </div>

              <div class="input-box">
                <span>手机号：</span>
                <input
                  type="text"
                  placeholder="请输入手机号"
                  v-model="form.phone"
                />
              </div>

              <div class="input-box">
                <register_phone_code :form="form" />
              </div>

              <div class="input-box">
                <span>设置密码</span>
                <input
                  type="password"
                  placeholder="请输入密码"
                  v-model="form.pass"
                />
              </div>

              <div class="input-box">
                <span>确认密码</span>
                <input
                  type="password"
                  placeholder="请输入密码"
                  v-model="form.repass"
                />
              </div>
              <div class="btn-box">
                <button class="btn-ripple" @click="do_submit()">注册</button>
              </div>

              <div class="terms-box">
                <div class="terms-box-inner">
                  <span class="terms-check" @click="is_agree = !is_agree">
                    <img v-if="is_agree" src="@img/common/check1.png" alt="" />
                    <img v-else src="@img/common/check0.png" alt="" />
                    我已阅读并同意
                  </span>
                  <span class="terms-text" @click="terms_open(92)"
                    >《隐私协议》</span
                  >
                </div>

                <div class="register-box">
                  <span>
                    <router-link to="/login">已有账号，直接登录</router-link>
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <register_type_modal
      data-title="注册类型"
      ref="register_type_modal"
      @confirm="switchMode"
    />

    <terms_modal ref="terms_modal" />
  </div>
</template>

<script>
import register_type_modal from "@/components/account/register_type_modal.vue";
import register_phone_code from "@/components/account/register_phone_code.vue"; //短信验证码
import terms_modal from "@/components/account/terms_modal.vue"; //协议弹窗
import area_select from "@/components/address/area_select.vue";
import { mapState } from "vuex";

export default {
  name: "login",
  components: {
    register_type_modal,
    register_phone_code,
    terms_modal,
    area_select,
  },
  data() {
    return {
      is_agree: true,

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
  },
  mounted() {},

  methods: {
    terms_open(id) {
      this.$refs.terms_modal.init(id);
    },
    switchMode(info) {
      console.log(info);
      this.form.type = info;
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
      if (!this.form.repass) {
        alertErr("请输入确认密码");
        return;
      }
      if (this.form.pass != this.form.repass) {
        alertErr("两次密码不一致");
        return;
      }
      console.log(this.form);
      // return
      // if (this.form.type == 2 && this.form.company.length === 0) {
      //   alertErr("请输入企业名称");
      //   return;
      // }
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "login_userReg",
          ...this.form,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          this.$router.push("/login");
        }
      });
    },

    //更新当前父组件数据
    changeSelectAddress(data) {
      this.$log("更新省市区数据", data);
      let { sheng, shi, qu } = data;
      this.form.province = sheng.id;
      this.form.city = shi.id;
      this.form.areaId = qu.id;

      // this.form.provinceCode = sheng.id;
      // this.form.cityCode = shi.id;
      // this.form.areaCode = qu.id;
      // debugger
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
  background: #f3f3f3;

  .page-ctx {
    display: flex;
    align-items: center;
    padding: 60px 0;
  }

  .page-poster {
    margin-left: 46px;

    img {
      width: 664px;
      height: 664px;
    }
  }

  .page-inner {
    margin: 0 auto;
    background: transparent;
    align-items: center;
    position: relative;

    .form-box {
      position: relative;
      width: fit-content;
    }

    .input-wrap {
      margin: 0 auto;

      .tab-box {
        margin-bottom: 40px;
        display: flex;
        justify-content: center;
        align-items: center;

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

      .input-box {
        margin-bottom: 20px;
        width: 650px;
        height: 50px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        padding-right: 110px;
        position: relative;
        .sms-box {
          width: 550px;
          height: 100%;
        }

        span {
          text-align: center;
          display: inline-block;
          width: 105px;
          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 16px;
          color: #272536;
        }

        input {
          width: 480px;
          height: 100%;
          padding-left: 16px;
          font-size: 14px;
          color: #000;

          &::-webkit-input-placeholder {
            font-size: 16px;
            font-family: sans-serif;
            font-weight: 400;
            color: #bebebe;
          }
        }

        .sanji-wrap {
          flex: 2;
        }
      }
      .tip {
        &:after {
          content: "请输入公司全称";
          color: #f74747;
          position: absolute;
          right: 0;
          top: 10px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 24px;
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
          color: #f74747;
        }
      }

      .btn-box {
        margin-top: 40px;
        margin-left: 100px;
        margin-right: 110px;

        button {
          width: 100%;
          height: 44px;
          background: linear-gradient(90deg, #ff7327 0%, #ea5959 100%);
          background: #f74747;
          font-size: 18px;
          font-family: sans-serif;
          font-weight: 400;
          color: #ffffff;
        }
      }

      .register-box {
        text-align: center;
        font-size: 14px;

        a {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 24px;
          color: #f74747;
          border-bottom: 1px solid #f74747;
        }
      }
    }
  }
}

.terms-box {
  margin-top: 40px;
  margin-left: 100px;
  margin-right: 110px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    color: #e5222b;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/register.less"></style>
