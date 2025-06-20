<template>
  <div class="page">
    <div class="main-title flex-between">
      <span>修改密码</span>
    </div>

    <div class="page-ctx">
      <div class="other">
        <div class="section-ctx">
          <div class="item">
            <span class="text">旧密码：</span>
            <span class="info">
              <el-input clearable type="password" v-model="form.old_password" class="" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">新密码：</span>
            <span class="info">
              <el-input
                clearable
                type="password"
                v-model="form.password"
                class=""
                placeholder="请输入6位以上，只能包含英文字母和数字"
                @input="handlePasswordInput"
              />
              <div class="password-rule">密码规则：6位以上，只能输入英文字母和数字</div>
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">重复新密码：</span>
            <span class="info">
              <el-input
                clearable
                type="password"
                v-model="form.confirm_password"
                class=""
                @input="handleConfirmPasswordInput"
              />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item btn-box">
            <span class="text" style="visibility: hidden">-</span>
            <div class="info">
              <el-button
                class="btn-ripple fit-text btn-cancel"
                @click="throttle_do_submit()"
                :loading="loading"
                >确认
              </el-button>
              <button class="btn-ripple fit-text btn-save" @click="do_clear()">
                清空
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "my-password",
  components: {},
  data() {
    return {
      form: {
        old_password: "",
        password: "",
        confirm_password: "",
      },
      loading: false,
    };
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
  },
  methods: {
    // 验证密码规则：6位以上，包含英文和数字
    validatePassword(password) {
      if (!password || password.length < 6) {
        return false;
      }
      // 检查是否包含英文字母
      const hasLetter = /[a-zA-Z]/.test(password);
      // 检查是否包含数字
      const hasNumber = /[0-9]/.test(password);

      return hasLetter && hasNumber;
    },

    // 处理新密码输入，只允许英文和数字
    handlePasswordInput(value) {
      // 过滤掉非英文和数字的字符
      const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");
      this.form.password = filteredValue;
    },

    // 处理确认密码输入，只允许英文和数字
    handleConfirmPasswordInput(value) {
      // 过滤掉非英文和数字的字符
      const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");
      this.form.confirm_password = filteredValue;
    },

    throttle_do_submit() {},
    do_submit() {
      if (!this.form.old_password) {
        alertErr("请输入旧密码");
        return;
      }
      if (!this.form.password) {
        alertErr("请输入新密码");
        return;
      }

      // 密码规则验证：6位以上，包含英文和数字
      if (!this.validatePassword(this.form.password)) {
        alertErr("新密码必须是6位以上，且包含英文和数字");
        return;
      }

      if (!this.form.confirm_password) {
        alertErr("请输入确认密码");
        return;
      }
      if (this.form.password != this.form.confirm_password) {
        alertErr("两次密码不一致");
        return;
      }

      this.loading = true;
      this.$api({
        url: "updatePassword",
        method: "post",
        data: {
          ...this.form,
        },
      })
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            this.do_clear();
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    do_clear() {
      this.form = {
        old_password: "",
        password: "",
        confirm_password: "",
      };
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;
  padding-top: 0;

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }

  .page-ctx {
    min-height: 600px;
    margin-top: 14px;
    padding: 80px 0;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;

    .section {
    }

    .item {
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .text {
        display: inline-block;
        min-width: 260px;
        text-align: right;
        font-size: 14px;
        color: #666;
      }

      .info {
        padding-left: 10px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        display: inline-block;
        min-width: 120px;

        input {
          // width: 400px;
          // height: 40px;
          // background: #ffffff;
          // border-radius: 4px 4px 4px 4px;
          // border: 1px solid #d4d4d4;
        }

        .el-input {
          width: 400px;
          // height: 40px;
        }

        .password-rule {
          margin-top: 5px;
          font-size: 12px;
          color: #999;
          line-height: 1.4;
        }
      }

      .action {
        margin-left: 20px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: @theme;

        span {
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
  }
}

.btn-box {
  margin-top: 46px;

  button {
  }

  .btn-save {
    width: 120px;
    height: 32px;
    background: #ffffff;
    border-radius: 5px;
    border: 1px solid @theme;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: @theme;
  }

  .btn-cancel {
    margin-right: 24px;
    width: 120px;
    height: 32px;
    background: @theme;
    border-radius: 5px;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/change-password.less"></style>
