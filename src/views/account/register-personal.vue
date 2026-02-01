<template>
  <div class="page-register-personal">
    <div class="page">
      <!-- 面包屑导航 -->
      <div class="breadcrumb w-1400">
        <span>Home / Login or Register</span>
      </div>

      <div class="page-ctx">
        <div class="page-inner w-1400">
          <h1 class="page-title">CREATE A PERSONAL ACCOUNT</h1>

          <div class="form-container">
            <div class="form-wrapper">
              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  First Name :
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.firstName"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  Last Name :
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.lastName"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  Email :
                </label>
                <input
                  type="email"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.email"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  Phone Number :
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.phone"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  Password :
                </label>
                <input
                  type="password"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.pass"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="required">*</span>
                  Cofirm Password :
                </label>
                <input
                  type="password"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.twoPass"
                />
              </div>

              <button class="submit-btn" @click="do_submit()">SUBMIT</button>

              <div class="login-link">
                <span>Existing Account,</span>
                <router-link to="/login">Go Login</router-link>
              </div>
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
  name: "register-personal",
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        pass: "",
        two_pass: ""
      }
    };
  },
  computed: {
    ...mapState(["vuex_config"])
  },
  methods: {
    do_submit() {
      // 验证必填字段
      if (!this.form.firstName) {
        alertErr("Please enter First Name");
        return;
      }
      if (!this.form.lastName) {
        alertErr("Please enter Last Name");
        return;
      }
      if (!this.form.email) {
        alertErr("Please enter Email");
        return;
      }
      // 验证邮箱格式
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
      if (!reg_email.test(this.form.email)) {
        alertErr("Please enter a valid email address");
        return;
      }
      if (!this.form.phone) {
        alertErr("Please enter Phone Number");
        return;
      }
      if (!this.form.pass) {
        alertErr("Please enter Password");
        return;
      }
      if (!this.form.two_pass) {
        alertErr("Please enter Confirm Password");
        return;
      }
      if (this.form.pass !== this.form.two_pass) {
        alertErr("Passwords do not match");
        return;
      }

      // 提交表单数据
      let params = {
        action: "login_emailReg",
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        email: this.form.email,
        phone: this.form.phone,
        pass: this.form.pass,
        two_pass: this.form.two_pass,
        userType: 0 // 个人用户
      };

      this.$api({
        url: "/service.php",
        method: "post",
        data: params
      }).then(res => {
        alert(res);
        if (res.code == 200) {
          this.$router.push("/login");
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.page-register-personal {
  background: #ffffff;
  min-height: 100vh;
}

.page {
  position: relative;
  padding: 0 0 40px;

  .page-ctx {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .page-inner {
    margin: 0 auto;
  }
}

// 面包屑导航
.breadcrumb {
  padding: 20px 0;
  color: #1e262e;
  font-size: 14px;
  margin: 0 auto;
  background: #fbfbfb;

  span {
    color: #666;
  }
}

// 页面标题
.page-title {
  font-size: 40px;
  font-weight: bold;
  color: #1e262e;
  margin: 20px 0 30px;
  text-align: left;
  text-transform: uppercase;
}

// 表单容器
.form-container {
  display: flex;
  justify-content: center;
}

.form-wrapper {
  width: 100%;
  max-width: 600px;
}

.form-group {
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.form-label {
  font-size: 20px;
  color: #1e262e;
  font-weight: 400;
  width: 200px;
  text-align: right;

  .required {
    color: #ff0000;
    margin-left: 2px;
  }
}

.form-input {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #1e262e;
  box-sizing: border-box;
  background: #f5f5f5;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #999;
    background: #ffffff;
  }
}

// Submit Button
.submit-btn {
  width: 300px;
  height: 80px;
  background: #ec6a2b;
  border-radius: 10px 10px 10px 10px;
  margin-left: 250px;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 24px;
  color: #ffffff;

  &:hover {
    background: #e55a00;
  }
}

// Login Link
.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 24px;
  color: #1e262e;
  margin-left: 150px;

  span {
    color: #1e262e;
  }

  a {
    color: #00306b;
    text-decoration: underline;

    &:hover {
      color: #00306b;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .form-label {
    min-width: auto;
    width: 100%;
  }

  .form-input {
    width: 100%;
  }

  .submit-btn {
    width: 100%;
  }
}
</style>

