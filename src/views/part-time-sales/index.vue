<template>
  <div class="page">
    <div class="main-title flex">
      <span>APPLY TO BE THE COMMISSION-ONLY REPS</span>
    </div>

    <div class="page-ctx">
      <!-- 表单页面 -->
      <el-form :model="form" :rules="rules" ref="partTimeSalesForm" label-width="0">
        <!-- 上传身份证 -->
        <div class="form-section">
          <div class="section-title">
            <span class="title-text">ID information</span>
            <!-- <span class="required">*</span> -->
          </div>
          <div class="upload-group">
            <div class="upload-item">
              <div class="upload-area">
                <el-upload
                  class="upload-demo"
                  accept="image/*"
                  :name="UPLOAD_NAME"
                  :action="UPLOAD_ACTION"
                  :data="mix_upload_data"
                  :on-success="(res) => upload_on_success(res, 'identityFront')"
                  :before-upload="upload_before_upload"
                  :disabled="isUploadDisabled"
                >
                  <div class="upload-box id-box" v-if="!form.identityFront">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">Add Picture</div>
                  </div>
                  <div class="uploaded-image id-box" v-else>
                    <img :src="form.identityFront" alt="已上传图片" />
                    <div class="image-overlay">
                      <span class="reupload-text">重新上传</span>
                    </div>
                  </div>
                </el-upload>
              </div>
            </div>
            <!-- <div class="upload-item">
              <div class="upload-area">
                <el-upload
                  class="upload-demo"
                  accept="image/*"
                  :name="UPLOAD_NAME"
                  :action="UPLOAD_ACTION"
                  :data="mix_upload_data"
                  :on-success="(res) => upload_on_success(res, 'identityBack')"
                  :before-upload="upload_before_upload"
                  :disabled="isUploadDisabled"
                >
                  <div class="upload-box id-box" v-if="!form.identityBack">
                    <div class="upload-icon">+</div>
                    <div class="upload-text">上传身份证反面</div>
                  </div>
                  <div class="uploaded-image" v-else>
                    <img :src="form.identityBack" alt="已上传图片" />
                    <div class="image-overlay">
                      <span class="reupload-text">重新上传</span>
                    </div>
                  </div>
                </el-upload>
              </div>
            </div>-->
          </div>
        </div>
        <div class="form-section">
          <!-- <div class="section-title">
            <span class="title-text">ID Number :</span>
            <span class="required">*</span>
          </div>-->
          <el-form-item prop="identityId">
            <span class="form-label-text">ID Number :</span>
            <el-input v-model="form.identityId" placeholder="Please enter"></el-input>
          </el-form-item>
        </div>

        <!-- 销售地区 -->
        <div class="form-section">
          <div class="section-title">
            <span class="title-text">Sales Region</span>
            <!-- <span class="required">*</span> -->
          </div>
          <!-- prop="sales_site" -->
          <el-form-item v-for="(item,index) in area_select_list" :key="index">
            <div style="display: flex;margin-bottom: 20px;">
              0{{ index+1 }}&nbsp;&nbsp;
              <area_select
                ref="area_select"
                @change="(e)=>{
                changeSelectAddress(e,index)
              }"
              />
              <!-- <div class="btns_end" v-if="index==0" @click="handle_add">添加地区&nbsp;&nbsp;+</div>
              <div class="form_text" v-if="index==0">
                <div>最多可添加三个地区</div>
              </div>-->
              <div class v-if="index!=0">
                <i class="el-icon-remove-outline" @click="handle_clear(index)"></i>
              </div>
            </div>
          </el-form-item>
          <div class="btns_end" @click="handle_add">+&nbsp;&nbsp;Add Region</div>
          <div class="form_text">
            <div>Up to three regions could be added</div>
          </div>
        </div>

        <!-- 收款方式 -->
        <div class="form-section">
          <div class="section-title">
            <span class="title-text">Payment Method</span>
            <!-- <span class="required">*</span> -->
          </div>
          <el-form-item prop="receiveType">
            <img src="@/assets/img/order/paypal.png" class="paypal-img" alt />
            <img src="@/assets/img/order/stripe.png" class="paypal-img" alt />
          </el-form-item>
        </div>

        <!-- 银行卡信息 -->
        <div class="form-section">
          <div class="bank-info">
            <el-form-item prop="bankName">
              <span class="form-label-text form-label-text-right">Cardholder's Name :</span>
              <el-input v-model="form.bankName" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item prop="cardCode">
              <span class="form-label-text form-label-text-right">Card Number :</span>
              <el-input v-model="form.cardCode" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item prop="userName">
              <span class="form-label-text form-label-text-right">Expiry date :</span>
              <el-input v-model="form.userName" placeholder="MM/YY" clearable></el-input>
            </el-form-item>
            <el-form-item prop="userName">
              <span class="form-label-text form-label-text-right">CVC/CVV :</span>
              <el-input v-model="form.userName" placeholder="CVC" clearable></el-input>
            </el-form-item>
          </div>
        </div>

        <!-- 协议同意 -->
        <div class="form-section">
          <el-form-item prop="agreement">
            <el-checkbox v-model="form.agreement">
              Read and agree to the User Related Agreement
              <router-link class="agreement-link" to>User Related Agreement</router-link>
            </el-checkbox>
            <el-checkbox v-model="form.agreement">
              Agree to strictly abide by national laws and industry regulations in conducting sales activities and timely complete
              personal income tax declaration and payment on your own.
            </el-checkbox>
            <el-checkbox v-model="form.agreement">
              <div class="agreement-text">
                <p>Important note:</p>
                <p>
                  1. After successfully applying to become a part-time salesperson, you can act as an agent for all products on
                  the compliant sales platform.
                </p>
                <p>
                  2. After developing customers, you can follow the steps to "add customer information" in the "Member
                  Center" - "Customer Management" page.
                </p>
                <p>
                  3. After adding customer information and successful platform review, the customer becomes your managed
                  customer; You will receive a corresponding commission for any products purchased by the customer on
                  this platform.
                </p>
                <p>
                  4. Once your customer information is successfully established, no one else can submit to add the customer,
                  and the platform will ensure the unique service of the customer.
                </p>
                <p>5. If the customer information already exists on this platform, your customer information submission will also not be completed.</p>
                <p>6. If the customer you have bound fails to achieve any transactions within six natural months from the registration date, the customer will be automatically unbound.</p>
                <p>7. Customers who have been unbound will no longer belong to you, and any sales generated after unbinding will no longer be associated with your account.</p>
                <p>8. Within six months after unbinding, you will not be able to register the customer again unless you can submit the actual transaction order of the customer and the customer has not been registered by anyone else. You can contact the platform to bind the customer again for you.</p>
                <p>9. As a part-time salesperson, it is necessary to strictly comply with national laws and industry regulations to carry out sales activities and timely complete personal income tax declaration and payment on one's own.</p>
                <p>10. The platform conducts an annual evaluation of the part-time sales business status, and the final interpretation rights belong to the platform.</p>
              </div>
            </el-checkbox>
          </el-form-item>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-section">
          <el-button class="btn-submit" @click="do_submit()" :loading="loading">SUBMIT</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env.js";
import area_select from "@/components/address/area_select.vue";

export default {
  name: "part-time-sales",
  components: {
    area_select
  },
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,
      loading: false,

      // 表单数据
      form: {
        identityFront: "", // 身份证正面
        identityBack: "", // 身份证反面
        province: "", // 省份
        city: "", // 省份
        areaId: "", // 销售地区ID
        areaName: "", // 销售地区名称
        receiveType: 1, // 收款方式：1=微信，2=支付宝，3=银行卡
        receiveAccount: "", // 收款账号（银行卡）
        receiveQrcode: "", // 收款二维码
        bankName: "", // 开户银行名称
        cardCode: "", // 开户银行账号
        userName: "", // 持卡人姓名
        sales_site: "", //销售地区 区域id ,拼接
        agreement: true, // 协议同意
        identityId: ""
      },

      // 表单验证规则
      rules: {
        identityFront: [
          { required: true, message: "请上传身份证正面", trigger: "change" }
        ],
        identityBack: [
          { required: true, message: "请上传身份证反面", trigger: "change" }
        ],
        identityId: [
          { required: true, message: "请输入身份证号", trigger: "blur" }
        ],
        sales_site: [
          { required: true, message: "请选择销售地区", trigger: "change" }
        ],
        receiveType: [
          { required: true, message: "请选择收款方式", trigger: "change" }
        ],
        bankName: [
          {
            validator: (rule, value, callback) => {
              if (this.form.receiveType === 3 && !value) {
                callback(new Error("请输入开户银行名称"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        cardCode: [
          {
            validator: (rule, value, callback) => {
              if (this.form.receiveType === 3 && !value) {
                callback(new Error("请输入开户银行账号"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        userName: [
          {
            validator: (rule, value, callback) => {
              if (this.form.receiveType === 3 && !value) {
                callback(new Error("请输入持卡人姓名"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        receiveQrcode: [
          {
            validator: (rule, value, callback) => {
              if (
                (this.form.receiveType === 1 || this.form.receiveType === 2) &&
                !value
              ) {
                callback(new Error("请上传收款二维码"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        agreement: [
          { required: true, message: "请同意相关协议", trigger: "change" }
        ]
      },
      userInfo: {},
      area_select_list: [
        {
          province: "",
          city: "",
          area: "",
          provinceCode: "",
          cityCode: "",
          areaCode: ""
        }
      ]
    };
  },
  computed: {
    // 判断是否禁用上传功能
    isUploadDisabled() {
      console.log("this.userInfo.renzheng", this.userInfo.renzheng);
      return this.userInfo && this.userInfo.renzheng == 2;
    }
  },
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.query_user();
  },
  methods: {
    query_user() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo"
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data;
          this.userInfo = data;

          this.form.identityFront = data.identityFront || "";
          this.form.identityBack = data.identityBack || "";
          this.form.province = data.province || "";
          this.form.city = data.city || "";
          this.form.areaId = data.areaId || "";
          this.form.areaName = data.areaName || "";
          this.form.receiveType = data.receiveType || "";
          this.form.receiveQrcode = data.receiveQrcode || "";
          this.form.identityId = data.identityId || "";

          // if (data.province && data.areaId) {
          //   this.$nextTick(() => {
          //     this.$refs.area_select.init({
          //       province: data.province,
          //       city: data.city,
          //       area: data.areaId,
          //       provinceCode: data.province,
          //       cityCode: data.city,
          //       areaCode: data.areaId,
          //     });
          //   });
          // }
          if (res.data.sales_site_json) {
            this.area_select_list = JSON.parse(res.data.sales_site_json);
            this.area_select_list.forEach((e, i) => {
              console.log("e", e);
              this.$nextTick(() => {
                console.log("this.$refs.area_select", this.$refs.area_select);
                this.$refs.area_select[i].init({
                  province: e.province,
                  city: e.city,
                  area: e.areaId,
                  provinceCode: e.province,
                  cityCode: e.city,
                  areaCode: e.areaId
                });
              });
            });
          }

          if (data.receiveAccount) {
            try {
              let obj = JSON.parse(data.receiveAccount);
              this.form.bankName = obj.bank_name || "";
              this.form.cardCode = obj.card_code || "";
              this.form.userName = obj.user_name || "";
            } catch (error) {}
          }
        }
      });
    },
    throttle_do_submit() {},

    // 收款方式改变
    onReceiveTypeChange(value) {
      // 清空相关字段
      this.form.receiveQrcode = "";
      this.form.bankName = "";
      this.form.cardCode = "";
      this.form.userName = "";
    },
    handle_add() {
      if (this.area_select_list.length != 3) {
        this.area_select_list.push({
          province: "", //省
          city: "", //市
          area: "", //区
          provinceCode: "",
          cityCode: "",
          areaCode: ""
        });
      }
    },
    handle_clear(i) {
      this.area_select_list.splice(i, 1);
    },
    // 地区选择改变
    changeSelectAddress(data, i) {
      this.$log("回调data", data);
      this.$log("回调i", i);
      let { sheng, shi, qu } = data;
      let form = {};
      if (sheng && shi && qu) {
        // 保存区级ID作为areaId
        form.areaId = qu.id;
        // 保存完整的地区名称
        form.areaName = `${sheng.title}-${shi.title}-${qu.title}`;
        // 保存省份和城市
        form.province = sheng.id || "";
        form.city = shi.id || "";
        this.area_select_list[i] = form;

        console.log("sales_site", this.form.sales_site);
        // // 触发表单验证
        this.$nextTick(() => {
          // this.$refs.partTimeSalesForm.validateField("sales_site");
        });
      }
    },

    do_submit() {
      if (!this.form.agreement) {
        this.$message.error("请阅读协议");
        return;
      }
      // 使用el-form验证
      this.$refs.partTimeSalesForm.validate(valid => {
        if (valid) {
          this.loading = true;

          let sales_site = [];
          this.area_select_list.forEach(e => {
            console.log("e", e);
            if (e.areaId) {
              sales_site.push(e.areaId);
            }
          });
          if (sales_site.length != this.area_select_list.length) {
            this.$message.error("请完善销售地区");
            this.loading = false;
            return;
          }

          // 构建提交数据
          let submitData = {
            identityFront: this.form.identityFront,
            identityBack: this.form.identityBack,
            province: this.form.province, // 只保存区级ID
            city: this.form.city, // 只保存区级ID
            areaId: this.form.areaId, // 只保存区级ID
            receiveType: this.form.receiveType,
            agreement: this.form.agreement,
            identityId: this.form.identityId
          };

          // 根据收款方式添加相应数据
          if (this.form.receiveType === 3) {
            // 银行卡
            submitData.receiveAccount = JSON.stringify({
              bank_name: this.form.bankName,
              card_code: this.form.cardCode,
              user_name: this.form.userName
            });
          } else {
            // 微信或支付宝
            submitData.receiveQrcode = this.form.receiveQrcode;
          }

          this.$api({
            url: "/service.php",
            method: "get",
            data: {
              action: "users_renzheng",
              ...submitData,
              sales_site_json: JSON.stringify(this.area_select_list),
              sales_site: sales_site.join(","),
              userType: 2
            }
          }).then(res => {
            let { code, msg, data } = res;
            alert(res).then(() => {
              this.loading = false;
            });
            if (code == 200) {
              this.query_user();
              // this.$router.push("/my-index");
            }
          });
        } else {
          return false;
        }
      });
    },

    // 上传相关
    upload_on_success(res, field) {
      let { code, data, msg } = res;
      alert(res);
      if (code == 200) {
        this.form[field] = res.data;
        // 触发表单验证
        // this.$nextTick(() => {
        //   this.$refs.partTimeSalesForm.validateField(field);
        // });
      }
    },

    upload_before_upload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5; // 文件大小限制5M
      if (!isLt5M) {
        alertErr("上传文件大小不能超过 5MB!");
        return false;
      }

      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        alertErr("上传文件只能是 JPG/PNG 格式!");
        return false;
      }

      return true;
    }
  }
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

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
    padding: 40px 32px 110px;
    background: #fff;
  }
}

.form-section {
  margin-bottom: 30px;

  .section-title {
    margin-bottom: 15px;
    display: flex;
    align-items: center;

    .title-text {
      font-size: 22px;
      font-weight: 600;
      color: #1e262e;
      line-height: 1.4;
      font-family: Poppins, Poppins;
    }

    .required {
      color: #ff4d4f;
      margin-left: 4px;
      font-size: 16px;
    }
  }

  .form-label-text {
    margin-right: 15px;
    font-size: 20px;
    color: #1e262e;
    text-align: right;
    font-weight: 400;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  }
  .form-label-text-right {
    width: 200px;
    display: inline-block;
  }

  .upload-group {
    display: flex;
    gap: 20px;

    .upload-item {
      // flex: 1;
    }
  }

  .upload-area {
    // width: 200px;

    .upload-box {
      width: 335px;
      height: 211px;
      border: 1px solid #d1d1d1;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f5f5f5;

      .upload-icon {
        font-size: 40px;
        color: #d1d1d1;
      }

      .upload-text {
        font-size: 18px;
        color: #5e5e5e;
        text-align: center;
      }
    }

    .uploaded-image {
      position: relative;
      width: 200px;
      height: 200px;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;

        .reupload-text {
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
        }
      }

      &:hover .image-overlay {
        opacity: 1;
      }
    }
  }

  .el-form-item {
    margin-bottom: 0;

    .el-input {
      width: 400px;

      /deep/ .el-input__inner {
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        font-size: 20px;
        color: #999;
        height: 56px;
        line-height: 56px;
        background: #fbfbfb;

        &:focus {
          border-color: #7853b2;
        }
      }
    }

    // 地区选择组件样式
    .sanji-box {
      .el-select {
        width: 120px;
        margin-right: 15px;

        &:last-child {
          margin-right: 0;
        }

        .el-input__inner {
          border: 1px solid #d4d4d4;
          border-radius: 4px;
          font-size: 14px;
          color: #606266;
          height: 40px;
          line-height: 40px;

          &:focus {
            border-color: #7853b2;
          }
        }
      }
    }

    .el-radio-group {
      .el-radio {
        margin-right: 30px;
        margin-bottom: 0;

        .el-radio__label {
          font-size: 14px;
          color: #606266;
          padding-left: 8px;
        }

        .el-radio__input.is-checked .el-radio__inner {
          background-color: #7853b2;
          border-color: #7853b2;
        }

        .el-radio__input.is-checked + .el-radio__label {
          color: #7853b2;
        }
      }
    }

    .el-checkbox {
      display: flex;
      margin-bottom: 20px;
      /deep/ .el-checkbox__label {
        font-size: 18px;
        color: #1e262e !important;
        width: 1080px;
        white-space: pre-wrap;
        line-height: 24px;
        padding-left: 20px;

        .agreement-link {
          color: #ec6a2b;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      /deep/ .el-checkbox__inner {
        width: 28px;
        height: 28px;
        &:after {
          width: 10px;
          height: 15px;
          left: 7px;
          border: 3px solid #ffffff;
          border-top: none;
          border-left: none;
        }
      }

      .agreement-text {
        width: 100%;
        height: 100%;
        background: #fbfbfb;
        border-radius: 15px 15px 15px 15px;
        padding: 17px 20px;
        box-sizing: border-box;
        font-size: 18px;
        color: #1e262e;
        line-height: 30px;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
  }

  .bank-info {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .el-form-item {
      .el-input {
        width: 400px;
      }
    }
  }

  .paypal-img {
    width: 110px;
    height: 54px;
    border-radius: 6px 6px 6px 6px;
    margin-right: 6px;
  }
}
.form-section-texr {
  font-size: 16px;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #333333;
}

.submit-section {
  margin-top: 60px;
  text-align: center;

  .btn-submit {
    width: 300px;
    height: 80px;
    background: #ec6a2b;
    border-radius: 10px 10px 10px 10px;
    border: none;
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
    text-align: center;

    &:hover:not(:disabled) {
      background: #ec6a2b;
    }

    &:disabled {
      background: #ec6a2b;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
.btns_end {
  width: 206px;
  height: 56px;
  background: #ec6a2b;
  border-radius: 6px 6px 6px 6px;
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  line-height: 56px;
  cursor: pointer;
}
.form_text {
  height: 40px;
  font-weight: 400;
  font-size: 20px;
  color: #5e5e5e;
  margin-top: 10px;
}
.el-icon-remove-outline {
  font-size: 30px;
  color: #6b46a3;
  margin-left: 30px;
  cursor: pointer;
}
</style>
