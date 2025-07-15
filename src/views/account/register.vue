<template>
  <div class="register-page">
    <div class="top-box">
      <div class="top-box-left">
        <img src="@/assets/image/home/logo.png" alt="" />
      </div>
    </div>
    <div class="content-box">
      <div class="register-form">
        <h2 class="register-title">Register</h2>

        <el-form
          :model="registerForm"
          :rules="rules"
          ref="registerForm"
          label-width="120px"
          class="register-form-content"
        >
          <div class="service-area">Select Registration Type</div>
          <el-form-item label="Type" prop="type">
            <el-select
              v-model="registerForm.type"
              placeholder="Please select"
              class="form-input"
            >
              <el-option label="Mobile Phone" :value="1"></el-option>
              <el-option label="Email" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Username" prop="account" v-if="registerForm.type == 1">
            <el-input
              v-model="registerForm.account"
              placeholder="Please enter username"
              class="form-input"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="Email" prop="account" v-if="registerForm.type == 2">
            <el-input
              v-model="registerForm.account"
              placeholder="Please enter email"
              class="form-input"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="Code" prop="verifyCode">
            <div class="verify-code-row">
              <el-input
                v-model="registerForm.verifyCode"
                placeholder="Please enter verification code"
                class="verify-input"
              >
              </el-input>
              <el-button type="success" class="verify-btn" @click="getVerifyCode"
                >Get Code</el-button
              >
            </div>
          </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="Please enter password"
              class="form-input"
            >
            </el-input>
          </el-form-item>

          <div class="service-area">Select Demander/Service Provider</div>

          <el-form-item label="Type" prop="userType">
            <el-select
              v-model="registerForm.userType"
              placeholder="Please select"
              class="form-input"
            >
              <el-option label="Demander" value="1"></el-option>
              <el-option label="Service Provider" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="success" class="register-btn" @click="handleRegister"
              >Submit</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bottom-box">
      <p>
        {{ vuex_config.banquan }}
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
          { required: true, message: "Please enter mobile phone or email", trigger: "blur" },
          {
            pattern: /^(1[3-9]\d{9}|[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)$/,
            message: "Please enter correct mobile phone or email format",
            trigger: "blur",
          },
        ],
        // verifyCode: [{ required: true, message: "Please enter verification code", trigger: "blur" }],
        password: [
          { required: true, message: "Please enter password", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "Password length should be 6 to 20 characters",
            trigger: "blur",
          },
        ],
        userType: [
          // { required: true, message: "Please select demander/service provider", trigger: "change" },
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
              serviceType: this.registerForm.userType,
            },
          }).then((res) => {
            if (res.code == 200) {
              this.$message.success("Registration successful");
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
        this.$message.error("Please enter mobile phone/email");
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
          this.$message.success("Verification code sent successfully");
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
