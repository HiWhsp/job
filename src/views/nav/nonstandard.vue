<script>
import {after} from "lodash/function";

export default {
  name: "nonstandard",
  data() {
    return {
      formLabelAlign: {
        company: '',
        address: '',
        name: '',
        phone: '',
        images: '',
        feedType: '非标定制',
        content: ''
      },
      rules: {
        company: [{required: true, message: '请输入公司名称', trigger: 'blur'}],
        name: [{required: true, message: '请输入联系人', trigger: 'blur'}],
        phone: [{required: true, message: '请输入联系方式', trigger: 'blur'}],
        content: [{required: true, message: '请输入内容要求', trigger: 'blur'}],
        images: [{required: true, message: '请上传设计图纸', trigger: 'blur'}]
      }
    }
  },
  methods: {
    // 提交
    submit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$api("feedback_add", {
            ...this.formLabelAlign
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success("提交成功");
              this.$refs['ruleForm'].resetFields();
            }
          })
        }
      })
    },
    //上传相关
    upload_on_success(res, file) {
      let {code, data, msg} = res;
      alert(res);
      if (code == 200) {
        this.formLabelAlign.images = res.data;
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },
  }

}
</script>

<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>非标定制</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-wrap">
      <div class="title flex flex-center">
        <img src="../../static/home/19655.png" alt="">
        <p>非标定制</p>
        <img src="../../static/home/19656.png" alt="">
      </div>
      <div class="form-content">
        <el-form ref="ruleForm" :label-position="'top'" label-width="100px" :model="formLabelAlign"
                 :rules="rules">
          <div class="item flex flex-between">
            <el-form-item label="公司名称" prop="company" class="type">
              <el-input v-model="formLabelAlign.company" placeholder="请输入公司名称"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="name" class="type">
              <el-input v-model="formLabelAlign.name" placeholder="请输入联系人名称"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone" class="type">
              <el-input v-model="formLabelAlign.phone" placeholder="请输入联系方式"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="内容要求" prop="content" class="textarea type">
              <el-input type="textarea" :rows="5" placeholder="请输入内容"
                        v-model="formLabelAlign.content">
              </el-input>
            </el-form-item>
          </div>
          <div class="item flex flex-between">
            <el-form-item label="上传设计图纸" prop="images" class="type">
              <el-upload class="upload-wrap" accept="image/*" :show-file-list="false" name="img"
                         action="https://fjjx.dx.hdapp.com.cn/service.php?action=index_ossUpload"
                         :data="mix_upload_data" :on-success="upload_on_success"
                         :before-upload="upload_before_upload">
                <img v-if="formLabelAlign.images" :src="formLabelAlign.images" class="user-avatar"/>
                <img v-else src="@/assets/img/index/upload.png" class="user-avatar"/>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="btn" @click="submit">
        提交定制
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.content-wrap {
  width: 1200px;
  min-height: 764px;
  background: #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  padding: 24px 60px 54px;
  margin-top: 20px;

  .title {
    height: 37px;

    img {
      width: 31px;
      height: 22px;
    }

    p {
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 36px;
      color: #333333;
      font-style: normal;
      text-transform: none;
      margin: 0 25px;
    }
  }

  .form-content {
    margin-top: 55px;

    .item {
      margin-bottom: 10px;

      .el-form-item {
        margin-bottom: 0;
      }

      /deep/ .el-form-item__label {
        padding: 0;
      }

      /deep/ .el-form-item__content {
        width: 324px;
      }

      /deep/ .el-input__inner {
        width: 324px;
      }

      .type {
        /deep/ .el-form-item__label:before {
          content: '';
        }

        /deep/ .el-form-item__label:after {
          content: '*';
          color: #F56C6C;
          margin-left: 0.4rem;
        }
      }

      .textarea {
        /deep/ .el-form-item__content {
          width: 1080px;
          height: 114px;
        }
      }
    }
  }

  .btn {
    margin-top: 35px;
    width: 191px;
    height: 46px;
    background: @theme;
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 46px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    border-radius: 4px 4px 4px 4px;
  }
}

.user-avatar {
  width: 90px;
  height: 90px;
}
</style>
