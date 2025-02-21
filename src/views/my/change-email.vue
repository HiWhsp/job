<template>
  <div class="container">
    <div class="title">修改邮箱</div>
    <div class="main-title">
      <p><span>身份验证</span></p>
    </div>

    <div class="page-ctx">
      <!-- 步骤条 -->
      <el-steps :active="nextIndex" align-center>
        <el-step title="身份验证"></el-step>
        <el-step title="验证新邮箱"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单部分 -->
      <div class="form-container" v-if="nextIndex === 1">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px">
          <el-form-item label="验证电子邮箱：" prop="email">
            <span>815625979@qq.com</span>
          </el-form-item>
          <el-form-item label="验证码：" prop="code">
            <div class="flex">
              <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
              <el-button style="margin-left: 10px">获取验证码</el-button>
            </div>
          </el-form-item>
        </el-form>

        <!-- 提交按钮 -->
        <el-button style="width: 100px;" type="primary" @click="goNext">下一步</el-button>
      </div>

      <div class="form-container" v-if="nextIndex === 2">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px">
          <el-form-item label="验证电子邮箱：" prop="email">
            <el-input v-model="form.email" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="code">
            <div class="flex">
              <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
              <el-button style="margin-left: 10px">获取验证码</el-button>
            </div>
          </el-form-item>
        </el-form>
        <!-- 提交按钮 -->
        <el-button style="width: 100px;" type="primary" @click="goNext">下一步</el-button>
      </div>

      <div class="form-container" v-if="nextIndex === 3">
        <img src="@/assets/image/common/success.png" alt="">
        <p class="tit">邮箱修改成功</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'change-password',
  data() {
    return {
      nextIndex: 1,
      form: {
        email: '815625979@qq.com',
        code: ''
      },
      rules: {
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    goNext() {
      if(this.nextIndex === 1) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.nextIndex++
          } else {
            return false
          }
        })
      } else if(this.nextIndex === 2) {
        this.nextIndex++
      }
    }
  }
}
</script>

<style lang="less">
.container {
  text-align: left;
  padding-bottom: 80px;

  .title {
    width: 64px;
    font-weight: 400;
    font-size: 16px;
    color: #000000;
    margin-bottom: 15px;
  }

  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    height: 52px;
    line-height: 52px;
    background: #FFFFFF;
    border: 1px solid rgba(29, 32, 136, 0.2);

    font-weight: 400;
    font-size: 14px;
    color: #2C3E50;

    p {
      span {
        margin-right: 20px;
      }
    }

    button {
      width: 124px;
      height: 30px;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 96px;
      line-height: 30px;
      color: #fff;
      font-size: 14px;
      // font-weight: bold;

      img {
        width: 20px;
      }

      .el-icon-circle-plus {
        font-size: 18px;
      }

      .add-text {
        margin-left: 5px;
      }
    }
  }

  .page-ctx {
    padding: 60px 240px;
    border: 1px solid #E5E5E5;
    border-top: none;
    display: flex;
    flex-direction: column;
  }

  .form-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #333;
    }

    .el-form-item {
      margin-bottom: 15px;

      .el-input {
        width: 200px;
      }

      .el-form-item__label {
        font-weight: bold;
      }
    }

    .el-button--primary {
      display: block;
      background-color: #000;
      border-color: #000;

      &:hover {
        background-color: #333;
        border-color: #333;
      }
    }

    img {
      width: 80px;
      height: 80px;
    }

    .tit {
      margin-top: 30px;
      font-weight: 400;
      font-size: 24px;
      color: #333333;
    }
    .desc {
      margin-top: 20px;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
    }
  }

  .el-steps {
    margin-bottom: 20px;
  }

  .el-step__head {
    color: #C0C4CC;
    border-color: #C0C4CC;
  }

  .el-step__title {
    color: #000;
    font-weight: 400;
  }

  .el-step__head.is-finish {
    color: #000;
    border-color: #000;

    .el-step__icon {
      background-color: #000;
      .el-step__icon-inner {
        color: #fff;
      }
    }
  }
  .el-step__title.is-finish {
    color: #000;
  }

}
</style>
