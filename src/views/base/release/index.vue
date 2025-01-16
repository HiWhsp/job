<script>
import breadcrumb from "@/components/breadcrumb/index.vue";
export default {
  name: "index",
  components: {breadcrumb},
  data() {
    return {
      ruleForm: {
        category: '', // 需求类别
        contact: '', // 联系人
        phone: '', // 联系电话
        email: '', // 联系邮箱
        num: '', // 样品数量
        budgetRange: '', // 预算范围
        cycle: '', // 完成周期
        file: '', // 附件
        desc: '', // 需求描述
      },
      rules: {
        category: [
          {required: true, message: '请输入需求类别', trigger: 'blur'},
        ],
        contact: [
          {required: true, message: '请输入联系人', trigger: 'blur'},
        ],
        phone: [
          {required: true, message: '请输入联系电话', trigger: 'blur'},
          {pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号", trigger: "blur"}
        ],
        email: [
          {required: true, message: '请输入联系邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        file: [
          {required: true, message: '请输入附件', trigger: 'blur'},
        ],
        desc: [
          {required: true, message: '请输入需求描述', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.resetForm();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    upload_on_success(res) {
      let {code, data, msg} = res;
      if (code == 200) {
        this.ruleForm.file = res.data.url;
      }
    }
  }
}
</script>

<template>
  <div class="container main">
    <breadcrumb
        :list="[{path: '/', name: '首页'}, { name: '发布需求'}]"></breadcrumb>
    <div class="title-wrap">
      <div class="title">发布需求</div>
      <div class="sub-title">尊敬的用户： 您好！欢迎提交需求给我们！平台会尽快与您联系！</div>
    </div>
    <div class="form">
      <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="需求类别" prop="category">
          <el-radio-group v-model="ruleForm.category" placeholder="请选择">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input type="text" v-model="ruleForm.contact" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input type="text" v-model="ruleForm.phone" placeholder="请输入联系电话" @input="() => (ruleForm.phone = ruleForm.phone.replace(/\D/g, ''))"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input type="text" v-model="ruleForm.email" placeholder="请输入联系邮箱"></el-input>
        </el-form-item>
        <el-form-item label="样品数量" prop="num">
          <el-input type="text" @input="() => (ruleForm.num = ruleForm.num.replace(/\D/g, ''))" v-model="ruleForm.num" placeholder="请输入样品数量"></el-input>
        </el-form-item>
        <el-form-item label="预算范围" prop="budgetRange">
          <el-input type="text" v-model="ruleForm.budgetRange" placeholder="请输入预算范围"></el-input>
        </el-form-item>
        <el-form-item label="完成周期" prop="cycle">
          <el-input type="text" v-model="ruleForm.cycle" placeholder="请输入完成周期"></el-input>
        </el-form-item>
        <el-form-item label="添加附件" prop="file">
          <el-upload class="upload-wrap" accept="image/*" :show-file-list="false" name="file"
                     :on-success="upload_on_success"
                     action="https://jxjsjc.dx.hdapp.com.cn/api/upload"
                     :data="mix_upload_data">
            <div class="upload" v-if="!ruleForm.file">
              <i class="el-icon-plus"></i>
              <span>上传附件</span>
            </div>
            <img :src="ruleForm.file" alt="" v-else>
          </el-upload>
        </el-form-item>
        <el-form-item label="需求描述" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc" rows="5" placeholder="请输入需求描述"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="margin-top: 30px; text-align: center;">
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
}
.title-wrap {
  background-color: #fff;
  padding: 50px 50px 0;
  text-align: center;
  .title {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    &::after {
      margin: 20px auto;
      height: 3px;
      background: @theme;
      content: "";
      display: block;
      width: 50%;
      max-width: 50px;
    }
  }
  .sub-title {
    font-size: 16px;
    color: #333;
  }
}
.form {
  background-color: #fff;
  padding: 50px 100px;

  .upload-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 100px;
    background: #FFFFFF;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #DEDEDE;

    .upload {
      width: 150px;
      height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    img {
      width: 150px;
      height: 100px;
    }
  }

  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
  /deep/ .el-form-item__label {
    padding: 0;
  }
  /deep/ .el-button--primary {
    background-color: @theme;
    border-color: @theme;
  }
}
</style>
