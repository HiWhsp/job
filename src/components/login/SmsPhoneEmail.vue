<template>
  <div class="sms-box">
    <div class="input-box validate-box">
      <input type="text" placeholder="验证码" v-model="form.code" />
      <div class="btn-validate-box">
        <el-button @click="onSendPhoneCode" :disabled="disabledBtn">
          获取验证码
          <span>（{{ time }}）</span>
        </el-button>
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
    onSendPhoneCode() {
      if (this.timer) {
        alertErr("验证码发送频繁，请稍后再试");
        return;
      }

      //console.log("发送验证码");
      let { phone } = this.form;
      var reg_phone = /^1[3-9]\d{9}$/;
      let reg_email = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      var isPhoneNumber = reg_phone.test(phone);
      var isEmail = reg_email.test(phone);

      if (!phone) {
        alertErr("请输入手机号或邮箱账号");
        return;
      }
      if (!isPhoneNumber && !isEmail) {
        alertErr("请输入正确的手机号或邮箱账号");
        return;
      }

      if (isPhoneNumber) {
        this.retrieveByPhone();
    
      } else if (isEmail) {
       
        this.retrieveByEmail();
      }

      this.countdown();
    },

    //修改绑定用户名
    retrieveByPhone() {
      this.$store
        .dispatch("sendSMS", {
          phone: this.form.phone,
        })
        .then((res) => {
          //console.log("发送手机验证码", res);
          let { code, message } = res.data;
     
          if (code == 0) {
            // this.$router.push('/change-password');
          }
        });
    },

    //修改绑定邮箱
    retrieveByEmail() {
      this.$store
        .dispatch("send_email", {
          email: this.form.phone,
        })
        .then((res) => {
          //console.log("发送邮箱验证码", res);
          let { code, message } = res.data;
      
          if (code == 0) {
            // this.$router.push('/change-password');
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
  margin-top: 0; /*no*/
  margin-bottom: 0; /*no*/
  border-bottom: 1px solid #eee;
  padding: 20px 0 14px; /*no*/

  input {
    border: none;

    font-size: 15px; /*no*/
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #8c8c8c;
  }

  &.validate-box {
    display: flex;
    justify-content: space-between;

    input {
      align-self: flex-end;
      height: 15px; /*no*/
    }

    .btn-validate-box {
      cursor: pointer;

      button {
        height: 41px; /*no*/
        background: #000000;
        border-radius: 5px; /*no*/
        color: #fff;

        &:disabled {
          background: #eee;
          color: #999;
        }
      }
    }
  }
}
</style>
