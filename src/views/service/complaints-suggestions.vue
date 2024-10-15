<template>
  <div class="page">
    <div class="left">
      <div class="title">用激光工具改变生活</div>
      <div class="img-wrap">
        <img src="@/assets/img/service/left.png" alt="left" />
      </div>
      <div class="title-2">您还可以获得以下服务：</div>
      <div class="form">
        <div class="form-item">
          <div class="form-left">
            <img src="@/assets/img/service/gou.png" alt="gou" />
          </div>
          <div class="form-right">
            公司配备有专业的检测设备，检测对应国际标准。
          </div>
        </div>
        <div class="form-item">
          <div class="form-left">
            <img src="@/assets/img/service/gou.png" alt="gou" />
          </div>
          <div class="form-right">
            专业人员，通过售前支持和售后的维护来保障客户的权益。
          </div>
        </div>
        <div class="form-item">
          <div class="form-left">
            <img src="@/assets/img/service/gou.png" alt="gou" />
          </div>
          <div class="form-right">公司总部位于北京，可以更好的服务客户。</div>
        </div>
        <div class="form-item">
          <div class="form-left">
            <img src="@/assets/img/service/gou.png" alt="gou" />
          </div>
          <div class="form-right">为用户提供非标定制</div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="title">投诉建议</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        @submit="submitForm"
      >
        <el-form-item label="姓名" prop="name" style="padding: 0 251px 0 140px">
          <el-input placeholder="请输入姓名" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="phone"
          style="padding: 0 251px 0 140px"
        >
          <el-input
            placeholder="请输入电话"
            v-model="ruleForm.phone"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="公司名称"
          prop="companyName"
          style="padding: 0 251px 0 140px"
        >
          <el-input
            placeholder="请输入公司名称"
            v-model="ruleForm.companyName"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" style="padding: 0 251px 0 140px">
          <el-select
            v-model="ruleForm.region"
            placeholder="请选择活动区域"
            style="width: 100%"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="投诉问题"
          prop="question"
          style="padding: 0 251px 0 140px"
        >
          <el-input
            style="width: 514px"
            v-model="ruleForm.question"
            type="textarea"
            placeholder="请输入投诉问题"
            rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="submit-btn" @click="submitForm('ruleForm')">提交</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "complaints-suggestions",
  data() {
    return {
      ruleForm: {
        name: "",
        phone: "",
        companyName: "",
        type: "",
        question: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        companyName: [
          {
            required: true,
            message: "请输入公司名称",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change",
          },
        ],
        question: [
          {
            required: true,
            message: "请输入投诉问题",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
  
<style scoped lang="less">
.page {
  margin: 70px 260px 109px;
  display: flex;
  align-items: center;
}

.left {
  width: 592px;
  height: 628px;
  padding: 47px 0 0 57px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.16);
  border-radius: 8px 8px 8px 8px;
  .title {
    font-weight: bold;
    font-size: 24px;
    color: #27417c;
  }
  .img-wrap {
    width: 455px;
    height: 248px;
    margin-top: 36px;
  }
  .title-2 {
    margin-top: 25px;
    font-weight: bold;
    font-size: 18px;
    color: #333333;
  }
  .form {
    margin-top: 26px;
    display: flex;
    flex-direction: column;
    gap: 25px;
    .form-item {
      display: flex;
      gap: 6px;
      font-size: 16px;
      color: #333333;
      .form-left {
        width: 14px;
        height: 12px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.right {
  position: relative;
  right: 26px;
  width: 834px;
  height: 758px;
  padding-top: 65px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.16);
  border-radius: 8px 8px 8px 8px;
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 36px;
    color: #27417c;
  }
  .demo-ruleForm {
    margin-top: 59px;
  }
  .submit-btn {
    width: 231px;
    height: 40px;
    margin-left: 140px;
    background: #27417c;
    border-radius: 4px 4px 4px 4px;
    color: #ffffff;
    font-size: 14px;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
  }
}
</style>
  
  