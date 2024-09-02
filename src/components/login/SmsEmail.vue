<template>
  <div class="sms-box">
    <div class="input-box">
      <!-- <span>密码</span> -->
      <img src="@img/other/icon-code.png" alt="" />
      <input type="text" placeholder="请输入验证码" v-model="form.code" />

      <div class="btn-validate-box" @click="getCode" :class="time != 60 ? 'disabled' : ''">
        获取验证码
        <span>（{{ time }}）</span>
      </div>
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
      let { email } = this.form;
      let reg_email = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      var isEmail = reg_email.test(email);

      if (!isEmail) {
        alertErr("请输入正确的邮箱账号");
        return;
      }

      this.retrieveByEmail();

      this.countdown();
    },

    //修改绑定邮箱
    retrieveByEmail() {
      this.$api("users_retrieveCode", {
        email: this.form.email,
      }).then((res) => {
        //console.log("验证码", res);
        let { code, message } = res;

        if (code == 200) {
        }
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
  margin-bottom: 40px;
  width: 100%;
  height: 50px;
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
  opacity: 1;
  border-radius: 4px;
  .flex-between();

  img {
    width: 36px;
  }

  input {
    flex: 2;
    height: 100%;
    padding-left: 20px;
    font-size: 16px;
    color: #000;
  }
}

.btn-validate-box {
  position: absolute;
  right: 0;
  .flex();
  cursor: pointer;
  color: #4CA5E4;

  &.disabled {
    color: #ccc;
  }
}
</style>
