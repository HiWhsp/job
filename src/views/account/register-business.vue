<template>
  <div class="page-register-business">
    <div class="page">
      <!-- 面包屑导航 -->
      <div class="breadcrumb w-1400">
        <span>Home / Login or Register</span>
      </div>

      <div class="page-ctx">
        <div class="page-inner w-1400">
          <h1 class="page-title">CREATE A BUSINESS ACCOUNT</h1>

          <div class="form-container">
            <!-- 左列：Business Information & Address Details -->
            <div class="form-column left-column">
              <h2 class="section-title">Business Information</h2>

              <div class="form-group">
                <label class="form-label">
                  Company
                  <span class="required">*</span>
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.company"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  First Name
                  <span class="required">*</span>
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
                  Last Name
                  <span class="required">*</span>
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
                  Job Title
                  <span class="required">*</span>
                </label>
                <select class="form-input" v-model="form.job_title">
                  <option value>Please select</option>
                  <option value="CEO">CEO</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Phone
                  <span class="required">*</span>
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
                  Company E-mail
                  <span class="required">*</span>
                </label>
                <input
                  type="email"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.company_email"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  Business Number
                  <span class="required">*</span>
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.companyNumber"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  Business Type
                  <span class="required">*</span>
                </label>
                <select class="form-input" v-model="form.companyIndustry">
                  <option value>Please select</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Main Products
                  <span class="required">*</span>
                </label>
                <select class="form-input" v-model="form.mainProducts">
                  <option value>Please select</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <!-- Receiving Hours -->
              <div class="form-group receiving-hours">
                <label class="form-label">Receiving Hours</label>
                <div class="hours-input-group">
                  <input
                    type="number"
                    class="form-input hours-input"
                    v-model="form.business_am"
                    min="1"
                    max="12"
                  />
                  <span class="hours-label">AM-</span>
                  <input
                    type="number"
                    class="form-input hours-input"
                    v-model="form.business_pm"
                    min="1"
                    max="12"
                  />
                  <span class="hours-label">PM</span>
                  <!-- <select class="form-input hours-select" v-model="form.receivingEndPeriod">
                    <option value="PM">PM</option>
                    <option value="AM">AM</option>
                  </select>-->
                </div>
              </div>

              <!-- Billing Address -->
              <h3 class="subsection-title">Billing Address</h3>

              <div class="form-group">
                <label class="form-label">
                  Billing Address
                  <span class="required">*</span>
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.billing_address"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  City
                  <span class="required">*</span>
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.billing_city"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  State
                  <span class="required">*</span>
                </label>
                <select class="form-input" v-model="form.billing_state">
                  <option value>Please select</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Country
                  <span class="required">*</span>
                </label>
                <select class="form-input" v-model="form.billing_country">
                  <option value>Please select</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Zip Code
                  <span class="required">*</span>
                </label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.billing_zipcode"
                />
              </div>

              <!-- Shipping Address Question -->
              <div class="form-group shipping-question">
                <label class="form-label">Is your shipping address same as your billing address?</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input type="radio" name="sameAddress" value="yes" v-model="form.sameAddress" />
                    <span>YES</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="sameAddress" value="no" v-model="form.sameAddress" />
                    <span>NO</span>
                  </label>
                </div>
              </div>

              <!-- Shipping Address (shown when NO is selected) -->
              <template v-if="form.sameAddress === 'no'">
                <h3 class="subsection-title">Shipping Address</h3>

                <div class="form-group">
                  <label class="form-label">
                    Shipping Address
                    <span class="required">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Please enter"
                    v-model="form.address"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    City
                    <span class="required">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Please enter"
                    v-model="form.city"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    State
                    <span class="required">*</span>
                  </label>
                  <select class="form-input" v-model="form.province">
                    <option value>Please select</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    Country
                    <span class="required">*</span>
                  </label>
                  <select class="form-input" v-model="form.country">
                    <option value>Please select</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="MX">Mexico</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    Zip Code
                    <span class="required">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Please enter"
                    v-model="form.zipcode"
                  />
                </div>
              </template>
            </div>

            <!-- 中列：Resale Permit Details -->
            <div class="form-column middle-column">
              <!-- <h2 class="section-title">Resale Permit Details</h2> -->

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.buyAndSell" />
                  <span>Buy & Sell</span>
                </label>
              </div>

              <div class="form-group">
                <label class="form-label">Do you have resale permit?</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input
                      type="radio"
                      name="hasResalePermit"
                      value="yes"
                      v-model="form.hasResalePermit"
                    />
                    <span>YES</span>
                  </label>
                  <label class="radio-label">
                    <input
                      type="radio"
                      name="hasResalePermit"
                      value="no"
                      v-model="form.hasResalePermit"
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>

              <div class="form-group" v-if="form.hasResalePermit === 'yes'">
                <label class="form-label">Seller's Permit Number:</label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.sellerPermitNumber"
                />
              </div>

              <div class="form-group certification-group">
                <label class="checkbox-label certification-label">
                  <input type="checkbox" v-model="form.seller_permit_num" />
                  <span>I hereby certify that I hold a valid Seller’s Permit Number issued pursuant to the sales and use tax law and I am qualified to resell the products that I purchase from MEDOOO website. It is understood that I am required by the sales and use tax law to report and pay tax, measured by the purchase price of such products or other authorized amount. This certificate covers all future orders and is deemed valid until canceled by in writing or as determined by state law. This certificate is considered valid upon all requested information is provided and is correct.</span>
                </label>
              </div>
            </div>

            <!-- 右列：Login and Password -->
            <div class="form-column right-column">
              <h2 class="section-title">Login and Password</h2>

              <div class="form-group">
                <label class="form-label">
                  Email
                  <span class="required">*</span>
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
                  Password
                  <span class="required">*</span>
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
                  Confirm Password
                  <span class="required">*</span>
                </label>
                <input
                  type="password"
                  class="form-input"
                  placeholder="Please enter"
                  v-model="form.twoPass"
                />
              </div>

              <div class="form-group terms-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.agreeTerms" />
                  <span>
                    By submitting this form, you agree to MEDOOO
                    <a
                      href="#"
                      @click.prevent="openTerms('terms')"
                    >Terms of Sale</a>
                    and
                    <a
                      href="#"
                      @click.prevent="openTerms('privacy')"
                    >Privacy Policy</a>.
                  </span>
                </label>
              </div>

              <button class="submit-btn" @click="do_submit()">SUBMIT</button>

              <div class="login-link">
                <router-link to="/login">Existing Account, Go Login</router-link>
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
  name: "register-business",
  data() {
    return {
      form: {
        // Business Information
        company_name: "",
        firstName: "",
        lastName: "",
        job_title: "",
        phone: "",
        company_email: "",
        company_number: "",
        company_industry: "",
        main_products: "",
        business_am: "9",
        business_pm: "5",
        // Billing Address
        billing_address: "",
        billing_city: "",
        billing_state: "",
        billing_country: "",
        billing_zipcode: "",
        // Shipping Address
        same_address: "no",
        shipping_address: "",
        shipping_city: "",
        shipping_state: "",
        shipping_country: "",
        shipping_zipcode: "",
        // Resale Permit
        buy_and_sell: true,
        has_resale_permit: "yes",
        seller_permit_number: "",
        seller_permit_certification: false,
        // Login
        email: "",
        pass: "",
        two_pass: "",
        agree_terms: true
      }
    };
  },
  computed: {
    ...mapState(["vuex_config"])
  },
  methods: {
    openTerms(type) {
      // 打开条款或隐私政策页面
      // if (type === "terms") {
      //   this.$router.push("/terms");
      // } else if (type === "privacy") {
      //   // 如果有隐私政策页面，跳转到那里
      //   // this.$router.push("/privacy");
      // }
    },
    do_submit() {
      // 验证必填字段
      if (!this.form.company_name) {
        alertErr("Please enter Company");
        return;
      }
      if (!this.form.first_name) {
        alertErr("Please enter First Name");
        return;
      }
      if (!this.form.last_name) {
        alertErr("Please enter Last Name");
        return;
      }
      if (!this.form.job_title) {
        alertErr("Please select Job Title");
        return;
      }
      if (!this.form.phone_number) {
        alertErr("Please enter Phone");
        return;
      }
      if (!this.form.company_email) {
        alertErr("Please enter Company E-mail");
        return;
      }
      if (!this.form.company_number) {
        alertErr("Please enter Business Number");
        return;
      }
      if (!this.form.company_industry) {
        alertErr("Please select Business Type");
        return;
      }
      if (!this.form.main_products) {
        alertErr("Please select Main Products");
        return;
      }
      if (!this.form.billing_address) {
        alertErr("Please enter Billing Address");
        return;
      }
      if (!this.form.billing_city) {
        alertErr("Please enter City");
        return;
      }
      if (!this.form.billing_state) {
        alertErr("Please select State");
        return;
      }
      if (!this.form.billing_country) {
        alertErr("Please select Country");
        return;
      }
      if (!this.form.billing_zipcode) {
        alertErr("Please enter Zip Code");
        return;
      }
      if (this.form.same_address === "no") {
        if (!this.form.shipping_address) {
          alertErr("Please enter Shipping Address");
          return;
        }
        if (!this.form.shipping_city) {
          alertErr("Please enter Shipping City");
          return;
        }
        if (!this.form.shipping_state) {
          alertErr("Please select Shipping State");
          return;
        }
        if (!this.form.shipping_country) {
          alertErr("Please select Shipping Country");
          return;
        }
        if (!this.form.shipping_zipcode) {
          alertErr("Please enter Shipping Zip Code");
          return;
        }
      }
      if (!this.form.email) {
        alertErr("Please enter Email");
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
      if (!this.form.agree_terms) {
        alertErr("Please agree to Terms of Sale and Privacy Policy");
        return;
      }

      // 提交表单数据
      let params = {
        action: "login_sellerReg",
        ...this.form
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
.page-register-business {
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
}

// 表单容器
.form-container {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  justify-content: space-between;
}

// 表单列
.form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #1e262e;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
}

.subsection-title {
  font-size: 24px;
  font-weight: bold;
  color: #1e262e;
  margin: 20px 0 15px 0;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 20px;
  color: #1e262e;
  margin-bottom: 8px;
  font-weight: 400;

  .required {
    color: #ff0000;
    margin-left: 2px;
  }
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #1e262e;
  box-sizing: border-box;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #999;
  }
}

// Receiving Hours
.receiving-hours {
  .hours-input-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hours-input {
    width: 60px;
    flex-shrink: 0;
  }

  .hours-label {
    font-size: 14px;
    color: #1e262e;
  }

  .hours-select {
    width: 60px;
    flex-shrink: 0;
  }
}

// Radio Group
.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 20px;
  color: #1e262e;

  input[type="radio"] {
    cursor: pointer;
  }

  span {
    user-select: none;
  }
}

// Checkbox Group
.checkbox-group {
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  gap: 8px;
  cursor: pointer;
  font-size: 20px;
  color: #1e262e;
  line-height: 1.5;

  input[type="checkbox"] {
    margin-top: 5px;
    cursor: pointer;
    flex-shrink: 0;
  }

  span {
    user-select: none;
  }
}

.certification-label {
  align-items: flex-start;

  span {
    line-height: 1.6;
  }
}

// Shipping Question
.shipping-question {
  margin-top: 20px;
  margin-bottom: 20px;
}

// Terms Group
.terms-group {
  margin-top: 20px;
  margin-bottom: 20px;

  a {
    color: #00306b;
    text-decoration: underline;

    &:hover {
      color: #00306b;
    }
  }
}

// Submit Button
.submit-btn {
  margin-left: 100px;
  width: 300px;
  height: 80px;
  background: #ec6a2b;
  border-radius: 10px 10px 10px 10px;

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

  a {
    color: #1e262e;
    font-size: 24px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .form-container {
    flex-direction: column;
  }

  .form-column {
    width: 100%;
  }
}
</style>

