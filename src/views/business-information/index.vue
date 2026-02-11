<template>
  <div class="page">
    <div class="main-title flex">
      <span>Business Information</span>
    </div>

    <div class="page-ctx">
      <!-- <div class="form-title">BUSINESS INFORMATION</div> -->

      <div class="form-container">
        <el-form :model="form" :rules="rules" ref="businessForm" label-width="0">
          <div class="form-columns">
            <!-- 左列：公司信息 -->
            <div class="form-column left-column">
              <div class="form-item">
                <label class="form-label">Company :</label>
                <el-form-item prop="company">
                  <el-input v-model="form.company" placeholder="Company" clearable></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">First Name :</label>
                <el-form-item prop="firstName">
                  <el-input v-model="form.firstName" placeholder="First Name" clearable></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Last Name :</label>
                <el-form-item prop="lastName">
                  <el-input v-model="form.lastName" placeholder="Last Name" clearable></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Job Title :</label>
                <el-form-item prop="job_title">
                  <el-select v-model="form.job_title" placeholder="Please select">
                    <el-option value="CEO" label="CEO">CEO</el-option>
                    <el-option value="Manager" label="Manager">Manager</el-option>
                    <el-option value="Director" label="Director">Director</el-option>
                    <el-option value="Other" label="Other">Other</el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Phone :</label>
                <el-form-item prop="phone">
                  <el-input v-model="form.phone" placeholder="Phone" clearable></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Company Email :</label>
                <el-form-item prop="company_email">
                  <el-input v-model="form.company_email" placeholder="Company Email" clearable></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Business Number :</label>
                <el-form-item prop="companyNumber">
                  <el-input v-model="form.companyNumber" placeholder="Business Number" clearable></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Business Type :</label>
                <el-form-item prop="companyIndustry">
                  <el-select v-model="form.companyIndustry" placeholder="Please select">
                    <el-option
                      v-for="(item, index) in vuex_top_title"
                      :key="index"
                      :value="item.title"
                      :label="item.title"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Main Products :</label>
                <el-form-item prop="companyType">
                  <el-select v-model="form.companyType" placeholder="Please select">
                    <el-option
                      v-for="(item, index) in vuex_category_tree"
                      :key="index"
                      :value="item.title"
                      :label="item.title"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Receiving Hours :</label>
                <el-form-item prop="receivingHours">
                  <div class="receiving-hours">
                    <el-input v-model="form.business_am" placeholder="9" class="hours-input"></el-input>
                    <span class="hours-text">AM-</span>
                    <el-input v-model="form.business_pm" placeholder="5" class="hours-input"></el-input>
                    <span class="hours-text">PM</span>
                  </div>
                </el-form-item>
              </div>
            </div>

            <!-- 右列：地址信息 -->
            <div class="form-column right-column">
              <div class="form-item">
                <label class="form-label">Billing Address :</label>
                <el-form-item prop="billing_address">
                  <el-input v-model="form.billing_address" placeholder="Billing Address" clearable></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">City :</label>
                <el-form-item prop="billing_city">
                  <el-input v-model="form.billing_city" placeholder="City" clearable></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">State :</label>
                <el-form-item prop="billing_state">
                  <template v-if="!billingProvinceList.length">
                    <el-input clearable v-model="form.billing_state" placeholder="Please enter"></el-input>
                  </template>
                  <template v-else>
                    <el-select filterable v-model="form.billing_state" placeholder="Please enter">
                      <el-option
                        v-for="item in billingProvinceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      ></el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Country :</label>
                <el-form-item prop="billing_country">
                  <el-select
                    filterable
                    v-model="form.billing_country"
                    placeholder="Please select"
                    @change="changeBillingCountry(form.billing_country)"
                  >
                    <el-option
                      v-for="item in countryList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Zip Code :</label>
                <el-form-item prop="billing_zipcode">
                  <el-input v-model="form.billing_zipcode" placeholder="Zip Code" clearable></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Shipping Address :</label>
                <el-form-item prop="address">
                  <el-input v-model="form.address" placeholder="Shipping Address" clearable></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">City :</label>
                <el-form-item prop="city">
                  <el-input v-model="form.city" placeholder="City" clearable></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">State :</label>
                <el-form-item prop="province">
                  <template v-if="!shippingProvinceList.length">
                    <el-input clearable v-model="form.province" placeholder="Please enter"></el-input>
                  </template>
                  <template v-else>
                    <el-select filterable v-model="form.province" placeholder="Please enter">
                      <el-option
                        v-for="item in shippingProvinceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      ></el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Country :</label>
                <el-form-item prop="country">
                  <el-select
                    filterable
                    v-model="form.country"
                    placeholder="Please select"
                    @change="changeShippingCountry(form.country)"
                  >
                    <el-option
                      v-for="item in countryList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Zip Code :</label>
                <el-form-item prop="zipcode">
                  <el-input v-model="form.zipcode" placeholder="Zip Code" clearable></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import countryData from "@/constant/countryData.js";

export default {
  name: "business-information",
  data() {
    return {
      form: {
        company: "",
        firstName: "",
        lastName: "",
        job_title: "",
        phone: "",
        company_email: "",
        companyNumber: "",
        companyIndustry: "",
        companyType: "",
        business_am: "9",
        business_pm: "5",
        billing_address: "",
        billing_city: "",
        billing_state: "",
        billing_country: "",
        billing_zipcode: "",
        address: "",
        city: "",
        province: "",
        country: "",
        zipcode: ""
      },
      rules: {
        // 可以根据需要添加验证规则
      },
      countryList: [],
      allProvinceList: [],
      billingProvinceList: [],
      shippingProvinceList: [],
    };
  },
  computed: {
    ...mapState(["vuex_top_title", "vuex_category_tree"])
  },
  created() {
    this.countryList = countryData.countryList || [];
    this.allProvinceList = countryData.provinceList || [];
    this.getBusinessInfo();
  },
  methods: {
    getBusinessInfo() {
      // 获取企业信息
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo"
        }
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.form = { ...this.form, ...res.data };
          // 初始化省份列表
          if (this.form.billing_country) {
            this.changeBillingCountry(this.form.billing_country);
          }
          if (this.form.country) {
            this.changeShippingCountry(this.form.country);
          }
        }
      });
    },
    changeBillingCountry(val) {
      let country_info = this.countryList.find(v => v.label === val);
      let country_id = country_info ? country_info.value : "";
      this.billingProvinceList = this.allProvinceList.filter(
        v => v.country_id === country_id && v.label
      );
      if (this.billingProvinceList.length) {
        this.form.billing_state = "";
      }
    },
    changeShippingCountry(val) {
      let country_info = this.countryList.find(v => v.label === val);
      let country_id = country_info ? country_info.value : "";
      this.shippingProvinceList = this.allProvinceList.filter(
        v => v.country_id === country_id && v.label
      );
      if (this.shippingProvinceList.length) {
        this.form.province = "";
      }
    },
    saveBusinessInfo() {
      this.$refs.businessForm.validate(valid => {
        if (valid) {
          this.$api({
            url: "/service.php",
            method: "post",
            data: {
              action: "users_saveBusinessInfo",
              ...this.form
            }
          }).then(res => {
            if (res.code == 200) {
              this.$message.success("保存成功");
            } else {
              this.$message.error(res.msg || "保存失败");
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;
  min-height: 100vh;
  padding-left: 0;
  padding-right: 0;

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 70px;
    line-height: 70px;
    background: #ffffff;
    font-size: 20px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #1e262e;
  }

  .page-ctx {
    margin-top: 24px;
    padding: 40px 60px;
    background: #ffffff;
    border-radius: 4px;

    .form-title {
      font-size: 20px;
      font-weight: bold;
      color: #1e262e;
      margin-bottom: 40px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      text-align: left;
    }

    .form-container {
      .form-columns {
        display: flex;
        gap: 80px;
        align-items: flex-start;

        .form-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;

          .form-item {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .form-label {
              font-size: 20px;
              color: #1e262e;
              font-weight: 400;
              margin-bottom: 4px;
              text-align: left;
            }

            .el-form-item {
              margin-bottom: 0;

              .el-input {
                width: 100%;

                /deep/ .el-input__inner {
                  height: 56px;
                  border: 1px solid #e0e0e0;
                  border-radius: 4px;
                  font-size: 20px;
                  color: #1e262e;
                  padding: 0 16px;
                  background: #ffffff;

                  &::placeholder {
                    color: #999999;
                    font-size: 20px;
                  }

                  &:hover {
                    border-color: #c0c0c0;
                  }
                }
              }

              /deep/ .el-select {
                width: 100%;

                .el-input__inner {
                  height: 56px;
                  border: 1px solid #e0e0e0;
                  border-radius: 4px;
                  font-size: 20px;
                  color: #1e262e;
                  padding: 0 16px;
                  background: #ffffff;

                  &::placeholder {
                    color: #999999;
                    font-size: 20px;
                  }

                  &:hover {
                    border-color: #c0c0c0;
                  }
                }
              }
            }

            .receiving-hours {
              display: flex;
              align-items: center;
              gap: 8px;

              .hours-input {
                width: 60px;

                .el-input__inner {
                  height: 56px;
                  text-align: center;
                  padding: 0 8px;
                }
              }

              .hours-text {
                font-size: 20px;
                color: #1e262e;
                white-space: nowrap;
                font-weight: 400;
              }
            }
          }
        }
      }
    }
  }
}
</style>
