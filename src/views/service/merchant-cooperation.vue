<template>
  <div class="page">
    <div class="title">合作优势</div>
    <div class="sub-title">用激光工具改变生活</div>

    <div class="advantage-list">
      <div class="advantage-item" v-for="(item, index) in 4" :key="index">
        <div class="img-wrap">
          <img src="@/assets/img/service/list-img.png" alt="" />
        </div>
        <div class="wrap">
          <div class="advantage-item-title">覆盖全球的销售及服务渠道</div>
          <div class="line"></div>
          <div class="advantage-item-desc">
            覆盖全球的销售及服务渠道， 为全球用户提供快速需求响应
            和贴身服务覆盖全球的销售及 服务渠道，为全球用户提供快
            速需求响应和贴身服务
          </div>
        </div>
      </div>
    </div>

    <div class="cooperation-wrap">
      <div class="cooperation-item">
        <div class="cooperation-title">合作流程</div>
        <div class="cooperation-sub-title">用激光工具改变生活</div>
        <div class="one-list">
          <div class="one-list-item">
            <div class="one-list-icon-img">
              <img src="@/assets/img/service/icon-1.png" alt="" />
            </div>
            <div class="one-list-item-desc-1">申请入驻</div>
            <div class="one-list-item-desc-2">提交申请资料</div>
          </div>
          <div class="one-list-item">
            <div class="one-list-icon-img">
              <img src="@/assets/img/service/icon-2.png" alt="" />
            </div>
            <div class="one-list-item-desc-1">专人接洽</div>
            <div class="one-list-item-desc-2">专门负责</div>
            <div class="one-list-item-desc-3">接洽与办理入驻相关手续</div>
          </div>
          <div class="one-list-item">
            <div class="one-list-icon-img">
              <img src="@/assets/img/service/icon-3.png" alt="" />
            </div>
            <div class="one-list-item-desc-1">申请入驻</div>
            <div class="one-list-item-desc-2">提交申请资料</div>
          </div>
        </div>
        <div class="two-list">
          <div class="two-list-item">
            <div class="two-top">
              <img src="@/assets/img/service/icon-4.png" alt="" />
            </div>
            <div class="two-bottom">公众号</div>
          </div>
          <div class="two-list-item two-list-center">
            <div class="two-top">
              <img src="@/assets/img/service/icon-5.png" alt="" />
            </div>
            <div class="two-bottom">微信客服</div>
          </div>
          <div class="last-list-item">
            <div class="last-top">
              <img src="@/assets/img/service/icon-6.png" alt="" />
            </div>
            <div class="last-bottom">联系电话</div>
            <div class="last-sub-bottom">027-87180496</div>
          </div>
        </div>
        <div class="btn-wrap">
          <div class="btn">立即入驻</div>
        </div>
      </div>
    </div>

    <div class="add-wrap">
      <div class="add-left">
        <div class="add-left-title">加入我们</div>
        <div class="add-left-desc">
          用我们的力量，放大您的优势， 成为合作伙伴，共享未来成果！
        </div>
        <div class="left-btn">了解华锐科仪</div>
      </div>
      <div class="add-right">
        <div class="mask"></div>
        <el-form
          class="application-form"
          :model="formData"
          :rules="formRules"
          label-width="118px"
          ref="applicationForm"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公司名称" prop="companyName">
                <el-input
                  style="width: 198px"
                  v-model="formData.companyName"
                  placeholder="请输入公司名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司地址" prop="companyAddress">
                <el-input
                  style="width: 198px"
                  v-model="formData.companyAddress"
                  placeholder="请输入公司地址"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系人" prop="contactPerson">
                <el-input
                  style="width: 198px"
                  v-model="formData.contactPerson"
                  placeholder="请输入联系人姓名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="contactPhone">
                <el-input
                  style="width: 198px"
                  v-model="formData.contactPhone"
                  placeholder="请输入联系电话"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="公司网址" prop="companyWebsite">
            <el-input
              style="width: 546px"
              v-model="formData.companyWebsite"
              placeholder="请输入公司网址"
            ></el-input>
          </el-form-item>
          <el-form-item label="营业执照" prop="companyImage">
            <div class="upload-wrap">
              <input type="file" />
            </div>
          </el-form-item>
          <el-form-item>
            <div class="apply-btn" @click="submitForm">马上申请</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "merchant-cooperation",
  data() {
    return {
      formData: {
        companyName: "",
        companyAddress: "",
        contactPerson: "",
        contactPhone: "",
        companyWebsite: "",
        companyImage: "",
      },
      formRules: {
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        companyAddress: [
          { required: true, message: "请输入公司地址", trigger: "blur" },
        ],
        contactPerson: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
        ],
        contactPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
        companyWebsite: [
          { required: true, message: "请输入公司网址", trigger: "blur" },
        ],
        companyImage: [
          { required: true, message: "请上传图片", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.applicationForm.validate((valid) => {
        if (valid) {
          console.log("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleImageSuccess() {},
    beforeImageUpload() {},
  },
};
</script>

<style scoped lang="less">
.title {
  margin-top: 61px;
  font-weight: bold;
  font-size: 36px;
  color: #333333;
  text-align: center;
}

.sub-title {
  margin-top: 14px;
  font-size: 16px;
  color: #52565a;
  text-align: center;
}

.advantage-list {
  margin: 58px 260px 79px;
  display: flex;
  gap: 22px;
  .advantage-item {
    width: 334px;
    height: 427px;
    background: #ffffff;
    box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.11);
    border-radius: 3px 3px 3px 3px;
    border: 1px solid #f3f3f3;
    .img-wrap {
      width: 100%;
      height: 190px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .wrap {
      padding: 0 28px;
      .advantage-item-title {
        margin: 32px 0 17px 0;
        font-size: 20px;
        color: #000000;
        font-weight: bold;
      }
      .line {
        width: 24px;
        height: 2px;
        background: #e6e6e6;
      }
      .advantage-item-desc {
        margin-top: 17px;
        font-size: 16px;
        color: #5e5e5e;
        font-weight: bold;
        line-height: 25px;
      }
    }
  }
}

.cooperation-wrap {
  width: 100%;
  height: 767px;
  padding-top: 64px;
  background: url("../../assets/img/service/cooperation-bg.png") no-repeat
    center center;
  background-size: 100% 100%;
  .cooperation-item {
    .cooperation-title {
      font-weight: bold;
      font-size: 36px;
      color: #ffffff;
      text-align: center;
    }
    .cooperation-sub-title {
      margin-top: 14px;
      font-size: 16px;
      color: #ffffff;
      text-align: center;
    }
    .one-list {
      margin: 62px 361px 0 375px;
      display: flex;
      gap: 403px;
      .one-list-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .one-list-icon-img {
          width: 95px;
          height: 95px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .one-list-item-desc-1 {
          margin-top: 28px;
          font-size: 18px;
          color: #ffffff;
          line-height: 25px;
          font-weight: bold;
          text-align: center;
        }
        .one-list-item-desc-2 {
          font-weight: bold;
          font-size: 14px;
          color: #ffffff;
          line-height: 25px;
          text-align: center;
        }
        .one-list-item-desc-3 {
          width: 154px;
          font-weight: bold;
          font-size: 14px;
          color: #ffffff;
          line-height: 25px;
          text-align: center;
        }
      }
    }
    .two-list {
      margin: 56px 361px 0 375px;
      display: flex;
      .two-list-item {
        .two-top {
          width: 111px;
          height: 111px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .two-bottom {
          margin-top: 16px;
          font-weight: bold;
          font-size: 16px;
          color: #ffffff;
          line-height: 25px;
          text-align: center;
        }
      }
      .two-list-center {
        margin-left: 408px;
        margin-right: 401px;
      }
      .last-list-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .last-top {
          width: 67px;
          height: 67px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .last-bottom {
          margin-top: 19px;
          font-weight: bold;
          font-size: 16px;
          color: #ffffff;
          line-height: 25px;
          text-align: center;
        }
        .last-sub-bottom {
          width: 145px;
          margin-top: 12px;
          font-weight: bold;
          font-size: 20px;
          color: #ffffff;
          line-height: 25px;
          text-align: center;
        }
      }
    }
    .btn-wrap {
      display: flex;
      justify-content: center;
      margin-top: 55px;
      .btn {
        width: 191px;
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ff7b23;
        border-radius: 3px 3px 3px 3px;
        font-size: 16px;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}

.add-wrap {
  background: url("../../assets/img/service/cooperation-bg-1.png") no-repeat
    center center;
  background-size: cover;
  width: 100%;
  height: 753px;
  padding: 127px 260px 149px 260px;
  display: flex;
  .add-left {
    .add-left-title {
      font-weight: bold;
      font-size: 43px;
      color: #27417c;
      line-height: 71px;
    }
    .add-left-desc {
      width: 280px;
      height: 66px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-size: 20px;
      color: #808080;
      line-height: 40px;
    }
    .left-btn {
      margin-top: 53px;
      width: 179px;
      height: 48px;
      background: #27417c;
      border-radius: 3px 3px 3px 3px;
      color: #fff;
      cursor: pointer;
      font-size: 20px;
      line-height: 48px;
      text-align: center;
    }
  }

  .mask {
    position: absolute;
    left: -14px;
    top: -13px;
    width: 723px;
    height: 477px;
    padding: 13px 14px 16px 16px;
    background: #ffffff;
    border-radius: 6px 6px 6px 6px;
    opacity: 0.27;
  }
  .add-right {
    position: relative;
    width: 693px;
    height: 448px;
    margin-left: 413px;
    background: #ffffff;
    border-radius: 6px 6px 6px 6px;
  }
}

.application-form {
  padding-top: 46px;
}

.upload-wrap {
  width: 90px;
  height: 90px;
  background: url("../../assets/img/service/upload.png");
  border-right: 1px solid #ccc;
  input {
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}

.apply-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 191px;
  height: 38px;
  background: #27417c;
  color: #fff;
  border-radius: 3px 3px 3px 3px;
  cursor: pointer;
}
</style>

<style>
.el-form-item__label {
  color: #000;
}
</style>
