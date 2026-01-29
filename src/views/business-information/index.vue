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
                  <el-input 
                    v-model="form.company" 
                    placeholder="Company"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">First Name :</label>
                <el-form-item prop="firstName">
                  <el-input 
                    v-model="form.firstName" 
                    placeholder="First Name"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Last Name :</label>
                <el-form-item prop="lastName">
                  <el-input 
                    v-model="form.lastName" 
                    placeholder="Last Name"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Job Title :</label>
                <el-form-item prop="jobTitle">
                  <el-input 
                    v-model="form.jobTitle" 
                    placeholder="Job Title"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Phone :</label>
                <el-form-item prop="phone">
                  <el-input 
                    v-model="form.phone" 
                    placeholder="Phone"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Company Email :</label>
                <el-form-item prop="companyEmail">
                  <el-input 
                    v-model="form.companyEmail" 
                    placeholder="Company Email"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Business Number :</label>
                <el-form-item prop="businessNumber">
                  <el-input 
                    v-model="form.businessNumber" 
                    placeholder="Business Number"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Business Type :</label>
                <el-form-item prop="businessType">
                  <el-input 
                    v-model="form.businessType" 
                    placeholder="Business Type"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Main Products :</label>
                <el-form-item prop="mainProducts">
                  <el-input 
                    v-model="form.mainProducts" 
                    placeholder="Main Products"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Receiving Hours :</label>
                <el-form-item prop="receivingHours">
                  <div class="receiving-hours">
                    <el-input 
                      v-model="form.receivingHoursStart" 
                      placeholder="9"
                      class="hours-input"
                    ></el-input>
                    <span class="hours-text">AM-</span>
                    <el-input 
                      v-model="form.receivingHoursEnd" 
                      placeholder="5"
                      class="hours-input"
                    ></el-input>
                    <span class="hours-text">PM</span>
                  </div>
                </el-form-item>
              </div>
            </div>

            <!-- 右列：地址信息 -->
            <div class="form-column right-column">
              <div class="form-item">
                <label class="form-label">Billing Address :</label>
                <el-form-item prop="billingAddress">
                  <el-input 
                    v-model="form.billingAddress" 
                    placeholder="Billing Address"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">City :</label>
                <el-form-item prop="billingCity">
                  <el-input 
                    v-model="form.billingCity" 
                    placeholder="City"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">State :</label>
                <el-form-item prop="billingState">
                  <el-input 
                    v-model="form.billingState" 
                    placeholder="State"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Country :</label>
                <el-form-item prop="billingCountry">
                  <el-input 
                    v-model="form.billingCountry" 
                    placeholder="Country"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Zip Code :</label>
                <el-form-item prop="billingZipCode">
                  <el-input 
                    v-model="form.billingZipCode" 
                    placeholder="Zip Code"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Shipping Address :</label>
                <el-form-item prop="shippingAddress">
                  <el-input 
                    v-model="form.shippingAddress" 
                    placeholder="Shipping Address"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">City :</label>
                <el-form-item prop="shippingCity">
                  <el-input 
                    v-model="form.shippingCity" 
                    placeholder="City"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">State :</label>
                <el-form-item prop="shippingState">
                  <el-input 
                    v-model="form.shippingState" 
                    placeholder="State"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Country :</label>
                <el-form-item prop="shippingCountry">
                  <el-input 
                    v-model="form.shippingCountry" 
                    placeholder="Country"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>

              <div class="form-item">
                <label class="form-label">Zip Code :</label>
                <el-form-item prop="shippingZipCode">
                  <el-input 
                    v-model="form.shippingZipCode" 
                    placeholder="Zip Code"
                    clearable
                  ></el-input>
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
export default {
  name: "business-information",
  data() {
    return {
      form: {
        company: "",
        firstName: "",
        lastName: "",
        jobTitle: "",
        phone: "",
        companyEmail: "",
        businessNumber: "",
        businessType: "",
        mainProducts: "",
        receivingHoursStart: "",
        receivingHoursEnd: "",
        billingAddress: "",
        billingCity: "",
        billingState: "",
        billingCountry: "",
        billingZipCode: "",
        shippingAddress: "",
        shippingCity: "",
        shippingState: "",
        shippingCountry: "",
        shippingZipCode: ""
      },
      rules: {
        // 可以根据需要添加验证规则
      }
    };
  },
  created() {
    this.getBusinessInfo();
  },
  methods: {
    getBusinessInfo() {
      // 获取企业信息
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_getBusinessInfo"
        }
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.form = { ...this.form, ...res.data };
        }
      });
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
