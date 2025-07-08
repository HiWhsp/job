<template>
  <div class="register-page">
    <div class="top-box">
      <div class="top-box-left">
        <img src="@/assets/image/home/logo.png" alt="" />
      </div>
    </div>
    <div class="content-box">
      <div class="register-form">
        <h2 class="register-title">注册</h2>

        <el-form
          :model="registerForm"
          :rules="rules"
          ref="registerForm"
          label-width="120px"
          class="register-form-content"
        >
          <div class="service-area">选择注册类型</div>
          <el-form-item label="注册类型" prop="type">
            <el-select
              v-model="registerForm.type"
              placeholder="请选择"
              class="form-input"
            >
              <el-option label="手机号" :value="1"></el-option>
              <el-option label="邮箱" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="用户名" prop="account" v-if="registerForm.type == 1">
            <el-input
              v-model="registerForm.account"
              placeholder="请输入用户名"
              class="form-input"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="account" v-if="registerForm.type == 2">
            <el-input
              v-model="registerForm.account"
              placeholder="请输入邮箱"
              class="form-input"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="verifyCode">
            <div class="verify-code-row">
              <el-input
                v-model="registerForm.verifyCode"
                placeholder="请输入验证码"
                class="verify-input"
              >
              </el-input>
              <el-button type="success" class="verify-btn" @click="getVerifyCode"
                >获取验证码</el-button
              >
            </div>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              class="form-input"
            >
            </el-input>
          </el-form-item>

          <div class="service-area">选择需求方/服务方</div>

          <el-form-item label="需求方/服务方" prop="userType">
            <el-select
              v-model="registerForm.userType"
              placeholder="请选择"
              class="form-input"
            >
              <el-option label="需求方" value="2"></el-option>
              <el-option label="服务方" value="3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="success" class="register-btn" @click="handleRegister"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bottom-box">
      <p>
        京ICP证080169号京ICP备09003304号-2京公网安备11010502034458号电子公告服务专项备案
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      registerForm: {
        account: "",
        verifyCode: "",
        password: "",
        userType: "",
        type: 1, // 1手机 2邮箱
      },
      agreeService: false,
      rules: {
        account: [
          { required: true, message: "请输入手机号或邮箱", trigger: "blur" },
          {
            pattern: /^(1[3-9]\d{9}|[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)$/,
            message: "请输入正确的手机号或邮箱格式",
            trigger: "blur",
          },
        ],
        // verifyCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        userType: [
          // { required: true, message: "请选择常驻地/服务方", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.$api({
            url: "register",
            method: "post",
            data: {
              account: this.registerForm.account,
              password: this.registerForm.password,
              captcha: this.registerForm.verifyCode,
              type: this.registerForm.type,
              userType: this.registerForm.userType,
            },
          }).then((res) => {
            if (res.code == 200) {
              this.$message.success("注册成功");
              this.$router.push("/login?is_register=1");
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    getVerifyCode() {
      if (!this.registerForm.account) {
        this.$message.error("请输入手机号/邮箱");
        return;
      }
      this.$api({
        url: "sendCode",
        method: "post",
        data: {
          account: this.registerForm.account,
          type: this.registerForm.account.includes("@") ? 2 : 1,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("验证码发送成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.register-page {
  width: 100%;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top-box {
    width: 100%;
    height: 50px;
    background: #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: center;
    .top-box-left {
      width: 1200px;
      margin: 0 auto;
      img {
        width: 99px;
        height: 29px;
      }
    }
  }
  .content-box {
    width: 1200px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .register-form {
      .register-title {
        text-align: center;
        font-size: 36px;
        font-weight: 500;
        color: #000;
        margin-bottom: 40px;
      }

      .register-form-content {
        .el-form-item {
          margin-bottom: 25px;

          .el-form-item__label {
            font-size: 14px;
            color: #333;
            font-weight: normal;
          }

          .form-input {
            width: 100%;

            /deep/ .el-input__inner {
              height: 45px;
              line-height: 45px;
              border: 1px solid #dcdfe6;
              border-radius: 4px;
              font-size: 14px;

              &::placeholder {
                color: #c0c4cc;
              }

              &:focus {
                border-color: #67c23a;
              }
            }
          }

          .verify-code-row {
            display: flex;

            .verify-input {
              /deep/ .el-input__inner {
                height: 45px;
                line-height: 45px;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                font-size: 14px;
                border-right: none;
                border-radius: 4px 0 0 4px;

                &::placeholder {
                  color: #c0c4cc;
                }

                &:focus {
                  border-color: #67c23a;
                }
              }
            }

            .verify-btn {
              width: 120px;
              height: 45px;
              background: #fff;
              border-color: #dcdfe6;
              font-size: 14px;
              border-left: none;
              border-radius: 0 4px 4px 0;
              color: #33ae60;
            }
          }
        }

        .service-area {
          position: relative;
          margin-top: 40px;
          margin-bottom: 20px;
          font-family: Microsoft YaHei;
          font-size: 18px;
          font-weight: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #222222;
          padding-left: 10px;
          &::before {
            position: absolute;
            top: 3px;
            left: 0;
            content: "";
            width: 2px;
            height: 18px;
            background: #33ae60;
            border-radius: 50%;
            display: inline-block;
            margin-right: 10px;
          }
        }

        .register-btn {
          width: 100%;
          height: 50px;
          background: #33ae60;
          border-color: #33ae60;
          font-size: 16px;
          font-weight: 500;
          margin-top: 20px;

          &:hover {
            background: #33ae60;
            border-color: #33ae60;
          }
        }
      }
    }
  }
  .bottom-box {
    width: 100%;
    height: 56px;
    background: #ffffff;
    box-shadow: 0px -1px 0px 0px #e9e9e9;
    p {
      font-family: Microsoft YaHei;
      font-size: 12px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #3d3d3d;
      text-align: center;
      line-height: 56px;
    }
  }
}
</style>
