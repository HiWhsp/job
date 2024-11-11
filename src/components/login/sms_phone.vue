<template>
  <div class="sms-box">
    <div class="input-box">
      <img src="@/assets/img/login/code.png" alt="">
      <el-input type="text" placeholder="请输入验证码" v-model="form.code"/>

      <button
          :disabled="disabledBtn"
          class="btn-validate-box"
          @click="getCode"
          :class="time != 60 ? 'disabled' : ''"
      >
        <span>{{ time == 60 ? "获取验证码" : time }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sms",
  props: ["form"],
  data() {
    return {
      disabledBtn: false, //按钮是否可点击
      timer: null, //定时器 验证码
      timeTotal: 60, //验证码总时长
      time: 60, //验证码倒计时
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    getCode() {
      if (this.timer) {
        alertErr("验证码发送频繁，请稍后再试");
        return;
      }

      //console.log("发送验证码");
      let {phone, email} = this.form;
      let reg_email = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      let reg_phone = /^1[3-9]\d{9}$/;

      let is_true_phone = reg_phone.test(phone);

      // debugger
      // var isEmail = reg_email.test(email);
      if (!is_true_phone) {
        alertErr("请输入正确的手机号");
        return;
      }

      this.retrieveByEmail();
      this.countdown();
    },

    //修改绑定邮箱
    retrieveByEmail() {
      this.$api("login_phoneYzm", {
        phone: this.form.phone,
      }).then((res) => {
        //console.log("验证码", res);
        let {code, message} = res;
      });
    },

    //倒计时
    countdown() {
      let that = this;
      this.disabledBtn = true;

      this.timer = setInterval(() => {
        if (that.time > 0) {
          that.time--;
        } else {
          that.time = that.timeTotal;
          clearInterval(that.timer);
          that.timer = null;
          this.disabledBtn = false;
        }
      }, 1000);
    },
  },
};
</script>

<style scoped lang="less">
.input-box {
  position: relative;
  //margin-bottom: 20px;
  width: 100%;
  height: 40px;
  border-radius: 4px;
  .flex-between();
  overflow: hidden;

  img {
    position: absolute;
    width: 22px;
    height: 24px;
    z-index: 2;
    left: 16px;
  }


  /deep/ .el-input__inner {
    flex: 2;
    height: 40px;
    font-size: 14px;
    color: #606266;
    padding-left: 50px;
    border: 1px solid #DCDFE6;
  }
}

.btn-validate-box {
  .flex();
  justify-content: center;
  width: 117px;
  height: 40px;
  background: #FFFFFF;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #00479D;
  margin-left: 15px;
  color: #00479D;
  &.disabled {
    color: #ccc;
  }
}
</style>
