<template>
  <div class="modal-container">
    <el-dialog
      title="余额密码设置"
      width="580px"
      custom-class="modal-wrap modal-yue-set-pass"
      :close-on-click-modal="false"
      :visible.sync="showModal"
      :before-close="onModal_close"
    >
      <div class="modal-inner">
        <div class="tip">请完成余额支付密码设置，否则无法使用余额支付完成下单操作。</div>

        <div class="form-box">
          <div class="input-box">
            <span class="label">手机号</span>
            <!-- <input type="text" placeholder="请输入手机号码" v-model="form.phone" /> -->
            <span class="val">
              {{ baseInfo.phone }}
            </span>
          </div>

          <!-- 验证码 -->
          <sms_phone :form="form" />
          <!-- <div class="sms-box">
            <div class="input-box">
              <span class="label">验证码</span>
              <input type="text" placeholder="请输入验证码" v-model="form.code" />
              <button :disabled="disabledBtn" class="btn-validate-box" @click="getCode" :class="time != 60 ? 'disabled' : ''">
                获取验证码
                <span>（{{ time }}）</span>
              </button>
            </div>
          </div> -->

          <div class="input-box">
            <span class="label">设置密码</span>
            <input type="password" placeholder="密码" v-model="form.paypass" />
          </div>

          <div class="input-box">
            <span class="label">确认密码</span>
            <input type="password" placeholder="确认密码" v-model="form.paypass2" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple quxiao" @click="showModal = false">取消</button>
        <button class="btn-ripple queding" @click="confirm_set">确认</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import sms_phone from "@/components/login/sms_phone.vue"; //短信验证码

import { mapState } from "vuex";

export default {
  name: "commonShare",
  components: {
    sms_phone,
  },
  props: ["curr"],
  data() {
    return {
      showModal: false,
      // showModal: true,

      form: {
        phone: "",
        code: "",
        paypass: "",
        paypass2: "",
      },

      // 验证码
      disabledBtn: false, //按钮是否可点击
      timer: null, //定时器 验证码
      timeTotal: 60, //验证码总时长
      time: 60, //验证码倒计时
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.form = {
          phone: "",
          code: "",
          paypass: "",
          paypass2: "",
        };
      }
    },
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = null;
  },

  methods: {
    init(data) {
      //console.log("设置余额密码", { ...data });
      this.form = {
        ...this.form,
        phone: data.phone,
      };

      this.showModal = true;
    },

    onModal_close() {
      this.showModal = false;
    },
    //确认收货
    confirm_set() {
      if (!this.form.code) {
        alertErr("请输入验证码");
        return;
      }
      if (!this.form.paypass) {
        alertErr("请输入支付密码");
        return;
      }
      if (!this.form.paypass2) {
        alertErr("请输入确认密码");
        return;
      }
      if (this.form.paypass != this.form.paypass2) {
        alertErr("两次密码不一致");
        return;
      }

      this.$api("users_payPass", {
        code: this.form.code,
        paypass: this.form.paypass,
      }).then((res) => {
        let { code, data, msg} = res;
        if (code == 200) {
          this.$parent.yuePayPassSetCallback();
          this.showModal = false;
        }
      });

      // debugger
      // order.orders_qrshouhuo({
      //   params: {
      //     orderId: this.order.id
      //   },
      //   success: () => {
      //     this.$parent.updateView();
      //     this.showModal = false;
      //   }
      // });
    },

    getCode() {
      if (this.timer) {
        alertErr("验证码发送频繁，请稍后再试");
        return;
      }

      //console.log("发送验证码");
      let { phone, email } = this.form;
      let reg_email = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      let reg_phone = /^1[3-9]\d{9}$/;

      let is_true_phone = reg_phone.test(phone);
      // var isEmail = reg_email.test(email);

      debugger;

      if (!is_true_phone) {
        alertErr("请输入正确的手机号");
        return;
      }

      this.retrieveByEmail();

      this.countdown();
    },

    //修改绑定邮箱
    retrieveByEmail() {
      this.$api("users_sendSms", {
        phone: this.form.phone,
      }).then((res) => {
        //console.log("验证码", res);
        let { code, message } = res;
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
/deep/ .sms-box .label {
  width: 120px; /*no */
  color: #333;
}

.modal-wrap {
  .modal-inner {
    padding: 20px;
    padding: 0 20px;
    text-align: left;

    .tip {
      color: #4CA5E4;
      margin-bottom: 20px;
    }
  }
}

.input-wrap {
  width: 400px;
  margin: 0 auto;
}
.input-box {
  position: relative;
  margin-bottom: 20px;
  width: 100%;
  height: 50px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  .flex();
  overflow: hidden;

  .label {
    display: inline-block;
    width: 120px; /*no */
    border-right: 1px solid #ccc;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: #333;
    text-indent: 1em;
  }

  .val {
    text-align: left;
    padding-left: 16px;
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
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #d7d7d7;
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  // background: #4CA5E4;
  background: #f7f7f7;
  text-align: left;

  .el-dialog__title {
    color: #fff;
    color: #333;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    color: #333;
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  button {
    width: 128px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #eeeeee;
    font-size: 14px;
  }

  .quxiao {
    margin-right: 24px;
    // margin-right: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #4CA5E4;
    border: 1px solid #4CA5E4;
  }
  .queding {
    background: #4CA5E4;
    color: #fff;
  }
}

.btn-validate-box {
  background: transparent;
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

<style scoped lang="less" src="@/assets/h5css/modals/balance_password_set_modal.less"></style>
