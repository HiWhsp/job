<template>
  <div class="modal-container">
    <el-dialog title="验证手机号" width="596px" custom-class="modal-custom" :close-on-click-modal="false"
      :visible.sync="show" :before-close="onModalClose">

      <div class="modal-inner">
        <div class="modall-ctx">
          <!-- <div class="tip">密码要求至少包含字母，符号或数字中的两项且长度超过6位，</div> -->

          <div class="input-box flex">
            <div class="label">新手机号</div>
            <div class="input-item">
              <!-- <el-input type="text" v-model="phone" placeholder="手机号"> </el-input> -->
              {{ mix_user_phone }}
            </div>
          </div>
          <div class="input-box flex">
            <div class="label">验证码</div>
            <div class="input-item">
              <el-input type="text" v-model="code" placeholder="验证码"> </el-input>

              <button class="btn-send" @click="query_code()" :disabled="disabledBtn">
                获取验证码
                <span>（{{ time }}）</span>
              </button>
              <!-- <SmsLogin :form="form" /> -->
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple fit-text" @click="show = false">取消</button>
        <button class="btn-ripple fit-text btn-bg" @click="form_submit()">修改</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "modal-hetong",
  components: {

  },
  props: ["curr"],
  data() {
    return {
      show: false,

      phone: "",
      code: "",

      disabledBtn: false, //按钮是否可点击
      timer: null, //定时器 验证码
      timeTotal: 60, //验证码总时长
      time: 60, //验证码倒计时
    };
  },
  computed: {},
  watch: {
    show(val) {
      if (!val) {
        this.phone = "";
        this.code = "";
      }
    },
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    query_code() {
      //console.log("发送验证码");
      let phone = this.mix_user_phone;
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


      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "login_phoneYzm",
          phone: phone,
        }
      }).then((res) => {
        alert(res);
        if (res.code == 200) {

        } else {
          clearInterval(this.timer);
          this.timer = null;
          this.disabledBtn = false;
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

    init(text) {
      this.show = true;
    },
    onModalClose() {
      this.show = false;
    },

    onConfirm() {
      this.show = false;
      this.$router.back();
    },

    form_submit() {
      let reg_phone = /^1[3-9]\d{9}$/;
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
      let is_true_phone = reg_phone.test(this.phone);

      // if (!is_true_phone) {
      //   alertErr("请输入正确的手机号码");
      //   return;
      // }
      if (!this.code) {
        alertErr("请输入验证码");
        return;
      }

      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'users_checkOld',
          editType: '1',//类型：1-手机号 2-邮箱
          code: this.code,
        },
      }).then((res) => {
        //console.log("修改密码", res);
        alert(res)
        let { code, data } = res;
        if (code == 200) {
          this.$emit('confirm')
          this.show = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .modal-custom {
  .modal-inner {
    padding: 0;
  }



  .modall-ctx {
    .input-box {
      margin-bottom: 30px;
      position: relative;

      &.flex {
        display: flex;
        align-items: center;

        .label {
          margin-bottom: 0;
        }
      }

      .label {
        min-width: 80px;
        // margin-right: 20px;
        margin-bottom: 20px;
        font-size: 14px;
        color: #6e7285;
      }

      .input-item {
        display: flex;
        align-items: center;
      }

      .el-input {
        width: 300px;
      }
    }
  }

}




/deep/ .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #F7F7F7;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/  .el-dialog__body {
  padding: 36px 60px 36px 60px;
}

/deep/  .el-dialog__footer {
  text-align: center;
  padding-bottom: 50px;

  button {
    min-width: 120px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid @theme;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: @theme;

    &+button {
      margin-left: 20px;
    }
  }

  .btn-bg {
    background: @theme;
    color: #FFFFFF;
  }
}


.btn-send {
  // position: absolute;
  // right: -50px;
  // top: 10px;
  min-width: 90px;
  padding: 0 10px;
  height: 40px;
  background: #fff;
  color: @theme;
  font-size: 14px;
  margin-left: 15px;
  border-radius: 5px;

  &:disabled {
    background: #eee;
    color: #999;
    cursor: not-allowed;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/phone_bind_modal.less"></style>
