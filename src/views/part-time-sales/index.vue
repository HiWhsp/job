<template>
  <div class="page">
    <div class="main-title flex">
      <img src="@img/my/nav-5.png" alt="" />
      <span>成为兼职销售代表</span>
    </div>

    <div class="page-ctx">
      <!-- 表单页面 -->
      <el-form
        :model="form"
        :rules="rules"
        ref="partTimeSalesForm"
        label-width="0"
      >
        <!-- 上传身份证 -->
        <div class="form-section">
          <div class="section-title">
            <span class="title-text">上传身份证</span>
            <span class="required">*</span>
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
                    <div class="upload-text">上传身份证正面</div>
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
            <div class="upload-item">
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
            </div>
          </div>
        </div>
         <div class="form-section">
          <div class="section-title">
            <span class="title-text">身份证号</span>
            <span class="required">*</span>
          </div>
          <el-form-item prop="identityId">
            <el-input v-model="form.identityId" placeholder="请输入内容"></el-input>
          </el-form-item>
        </div>

        <!-- 销售地区 -->
        <div class="form-section">
          <div class="section-title">
            <span class="title-text">销售地区</span>
            <span class="required">*</span>
          </div>
          <!-- prop="sales_site" -->
          <el-form-item  v-for="(item,index) in area_select_list" :key="index" >
            <div style="display: flex;margin-bottom: 20px;">
              {{ index+1 }}.&nbsp;&nbsp;<area_select ref="area_select" @change="(e)=>{
                changeSelectAddress(e,index)
              }" />
              <div class="btns_end" v-if="index==0" @click="handle_add">添加地区&nbsp;&nbsp;+</div>
              <div class="form_text" v-if="index==0">
                <div>最多可添加三个地区</div>
              </div>
              <div class="" v-if="index!=0">
                <i class="el-icon-remove-outline" @click="handle_clear(index)"></i>
              </div>
            </div>
          </el-form-item>
        </div>

        <!-- 收款方式 -->
        <div class="form-section">
          <div class="section-title">
            <span class="title-text">收款方式</span>
            <span class="required">*</span>
          </div>
          <el-form-item prop="receiveType">
            <el-radio-group
              v-model="form.receiveType"
              @change="onReceiveTypeChange"
            >
              <el-radio :label="1">微信支付</el-radio>
              <el-radio :label="2">支付宝</el-radio>
              <el-radio :label="3">银行卡</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 银行卡信息 -->
        <div class="form-section" v-if="form.receiveType === 3">
          <div class="section-title">
            <span class="title-text">收款账号</span>
            <span class="required">*</span>
          </div>
          <div class="bank-info">
            <el-form-item prop="bankName">
              <el-input
                v-model="form.bankName"
                placeholder="请输入开户银行名称"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="cardCode">
              <el-input
                v-model="form.cardCode"
                placeholder="请输入开户银行账号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="请输入持卡人姓名"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <!-- 收款二维码 -->
        <div
          class="form-section"
          v-if="form.receiveType === 1 || form.receiveType === 2"
        >
          <div class="section-title">
            <span class="title-text">收款二维码</span>
            <span class="required">*</span>
          </div>
          <div class="upload-area">
            <el-upload
              class="upload-demo"
              accept="image/*"
              :name="UPLOAD_NAME"
              :action="UPLOAD_ACTION"
              :data="mix_upload_data"
              :on-success="(res) => upload_on_success(res, 'receiveQrcode')"
              :before-upload="upload_before_upload"
            >
              <div class="upload-box" v-if="!form.receiveQrcode">
                <div class="upload-icon">+</div>
                <div class="upload-text">
                  上传{{ form.receiveType === 1 ? "微信" : "支付宝" }}收款二维码
                </div>
              </div>
              <div class="uploaded-image" v-else>
                <img :src="form.receiveQrcode" alt="已上传图片" />
                <div class="image-overlay">
                  <span class="reupload-text">重新上传</span>
                </div>
              </div>
            </el-upload>
          </div>
        </div>

        <!-- 协议同意 -->
        <div class="form-section">
          <el-form-item prop="agreement">
            <el-checkbox v-model="form.agreement">
              已阅读并同意
              <!-- <a href="#" class="agreement-link">《医买买平台服务协议》</a> -->
               <router-link to="/terms?id=139">《医买买平台服务协议》</router-link>
               <router-link to="/terms?id=140">《隐私权政策》</router-link>
               <router-link to="/terms?id=141">《运营商协议》</router-link>
              <!-- <a href="#" class="agreement-link">《隐私权政策》</a> -->
              <!-- <a href="#" class="agreement-link">《运营商协议》</a> -->
            </el-checkbox>
          </el-form-item>
        </div>
        <div class="form-section-text">
          收款人信息需要和上传的身份证保持一致。本账号如需更换身份证和收款信息需联系工作人员确认后才可以操作。
        </div>

        <!-- 提交按钮 -->
        <div class="submit-section">
          <el-button class="btn-submit" @click="do_submit()" :loading="loading">
            提交
          </el-button>
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
    area_select,
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
        sales_site:'',//销售地区 区域id ,拼接
        agreement: true, // 协议同意
        identityId:'',
      },

      // 表单验证规则
      rules: {
        identityFront: [
          { required: true, message: "请上传身份证正面", trigger: "change" },
        ],
        identityBack: [
          { required: true, message: "请上传身份证反面", trigger: "change" },
        ],
        identityId: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
        ],
        sales_site: [
          { required: true, message: "请选择销售地区", trigger: "change" },
        ],
        receiveType: [
          { required: true, message: "请选择收款方式", trigger: "change" },
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
            trigger: "blur",
          },
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
            trigger: "blur",
          },
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
            trigger: "blur",
          },
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
            trigger: "change",
          },
        ],
        agreement: [
          { required: true, message: "请同意相关协议", trigger: "change" },
        ],
      },
      userInfo:{},
      area_select_list:[{
        province: '',
        city: '',
        area: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
      }],
    };
  },
  computed:{
     // 判断是否禁用上传功能
    isUploadDisabled() {
      console.log('this.userInfo.renzheng',this.userInfo.renzheng)
      return this.userInfo && this.userInfo.renzheng == 2;
    },
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
          action: "users_userInfo",
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.userInfo=data

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
          if(res.data.sales_site_json){
            this.area_select_list=JSON.parse(res.data.sales_site_json)
            this.area_select_list.forEach((e,i)=>{
              console.log('e',e)
               this.$nextTick(() => {
                console.log('this.$refs.area_select',this.$refs.area_select)
                this.$refs.area_select[i].init({
                  province: e.province,
                  city: e.city,
                  area: e.areaId,
                  provinceCode: e.province,
                  cityCode: e.city,
                  areaCode: e.areaId,
                });
              });
            })
           
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
    handle_add(){
      if(this.area_select_list.length!=3){
        this.area_select_list.push({
            province: '',//省
            city: '',//市
            area: '',//区
            provinceCode: '',
            cityCode: '',
            areaCode: '',
        })
      }
    },
    handle_clear(i){
      this.area_select_list.splice(i,1)
    },
    // 地区选择改变
    changeSelectAddress(data,i) {
      this.$log("回调data", data);
      this.$log("回调i", i);
      let { sheng, shi, qu } = data;
      let form={}
      if (sheng && shi && qu) {
        // 保存区级ID作为areaId
        form.areaId = qu.id;
        // 保存完整的地区名称
        form.areaName = `${sheng.title}-${shi.title}-${qu.title}`;
        // 保存省份和城市
        form.province = sheng.id || "";
        form.city = shi.id || "";
        this.area_select_list[i]=form
       
        console.log('sales_site',this.form.sales_site)
        // // 触发表单验证
        this.$nextTick(() => {
          // this.$refs.partTimeSalesForm.validateField("sales_site");
        });
      }
    },

    do_submit() {
      if(!this.form.agreement){
               this.$message.error('请阅读协议');
               return
          }
      // 使用el-form验证
      this.$refs.partTimeSalesForm.validate((valid) => {
        if (valid) {
          this.loading = true;

           let sales_site=[]
            this.area_select_list.forEach((e)=>{
              console.log('e',e)
              if(e.areaId){
                sales_site.push(e.areaId)
              }
            })
            if(sales_site.length!=this.area_select_list.length){
              this.$message.error('请完善销售地区');
              this.loading = false
              return
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
            identityId:this.form.identityId,
          };

          // 根据收款方式添加相应数据
          if (this.form.receiveType === 3) {
            // 银行卡
            submitData.receiveAccount = JSON.stringify({
              bank_name: this.form.bankName,
              card_code: this.form.cardCode,
              user_name: this.form.userName,
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
              sales_site_json:JSON.stringify(this.area_select_list),
              sales_site:sales_site.join(','),
              userType:2,

            },
          }).then((res) => {
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
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;
  padding-top: 20px;

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

    img {
      width: 22px;
      margin-right: 10px;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 40px 32px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.form-section {
  margin-bottom: 30px;

  .section-title {
    margin-bottom: 15px;
    display: flex;
    align-items: center;

    .title-text {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 1.4;
    }

    .required {
      color: #ff4d4f;
      margin-left: 4px;
      font-size: 16px;
    }
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
      width: 200px;
      height: 200px;
      border: 2px dashed #be9bdf;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #fff;

      &:hover {
        border-color: #7853b2;
        background: #f7efff;
      }

      .upload-icon {
        font-size: 40px;
        color: #be9bdf;
        margin-bottom: 12px;
      }

      .upload-text {
        font-size: 14px;
        color: #1F1F1F;
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
    .id-box {
      width: 319px;
      height: 201px;
      border: 1px solid #be9bdf;
      border-radius: 4px 4px 4px 4px;
    }
  }

  .el-form-item {
    margin-bottom: 0;

    .el-input {
      width: 400px;

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
      .el-checkbox__label {
        font-size: 14px;
        color: #606266;
        padding-left: 8px;

        .agreement-link {
          color: #7853b2;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #7853b2;
        border-color: #7853b2;
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
}
.form-section-texr{
  font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
}

.submit-section {
  margin-top: 60px;
  text-align: center;

  .btn-submit {
    width: 200px;
    height: 48px;
    background: #7853b2;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
    text-align: center;

    &:hover:not(:disabled) {
      background: #6b46a3;
    }

    &:disabled {
      background: #cccccc;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
  
}
.btns_end{
    width: 132px;
    height: 40px;
    background: #7853B2;
    border-radius: 4px 4px 4px 4px;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    margin-left: 34px;
}
.form_text{
  height: 40px;
  font-weight: 400;
  font-size: 14px;
  color: #505050;
  padding-left: 18px;
  display: flex;
  align-items: flex-end;

}
.el-icon-remove-outline{
  font-size: 30px;
  color: #6b46a3;
  margin-left: 30px;
  cursor: pointer;
}
</style>
