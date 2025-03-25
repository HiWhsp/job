<template>
  <div class="sms-box">
    <div class="input-box validate-box">
      <span class="text">验证码</span>

      <input type="text" v-model="form.code" />
      <span class="get-code" @click="onSendPhoneCode" :disabled="disabledBtn">
        获取验证码
        <span>（{{ time }}）</span>
      </span>
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
      timeTotal: 120, //验证码总时长
      time: 120, //验证码倒计时
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    onSendPhoneCode() {
      //console.log("发送验证码");
      let phone = this.form.phone;
      if (this.timer) {
        alertErr("验证码发送频繁，请稍后再试");
        return;
      }
      let phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(phone)) {
        alertErr("请先输入正确的手机号码");
        return;
      }
      this.countdown();

      this.$api("users_registerSendSms", {
        phone: phone,
      }).then((res) => {
        //console.log("验证码", res);
        let { code, message } = res;

        if (code == 200) {
          // this.$emit("updateCode", data);
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
  border: 1px solid #eeeeee;
  opacity: 1;
  border-radius: 4px;

  .flex-between();

  .text {
    display: inline-block;
    width: 90px; /*no */
    border-right: 1px solid #ccc;

    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: #999999;
  }
  input {
    flex: 2;
    height: 100%;
    padding-left: 20px;
    font-size: 16px;
    color: #000;
  }
  .get-code {
    right: 0;
    position: absolute;
    cursor: pointer;
    color: #ff1312;
    margin-right: 10px;

    &:hover {
      opacity: 0.8;
    }

    &[disabled] {
      opacity: 0.4;
    }
  }
}

button {
  height: 41px;
  border-radius: 5px;
  color: #ff1312;

  &:disabled {
    background: #eee;
    color: #999;
  }
}
</style>
