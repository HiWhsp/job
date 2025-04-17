<script>
export default {
  name: "feedback",
  data() {
    return {
      ruleForm: {
        name: '',
        mobile: '',
        email: '',
        content: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
        ],
        mobile: [
          {required: true, message: '请输入联系电话', trigger: 'blur'},
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
        ],
        content: [
          {required: true, message: '请输入反馈内容', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    to_liulan() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api({
            url: 'addFeedBack',
            method: 'post',
            data: {
              ...this.ruleForm
            }
          }).then((res) => {
            let {code, data, msg} = res;
            if (code == 200) {
              this.$message({
                message: '信息反馈成功',
                type: 'success'
              })
              this.$refs.ruleForm.resetFields();
            }
          })
        }
      })
    },
    to_order() {
      this.$refs.ruleForm.resetFields();
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item><img src="@/static/home/home.png" alt="">当前位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>意见反馈</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="ctx-box">
      <div class="form-box">
        <div class="title">意见反馈</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="姓名：" prop="name">
            <el-input type="text" v-model="ruleForm.name" placeholder="输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="mobile">
            <el-input type="text" v-model="ruleForm.mobile" placeholder="输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input type="text" v-model="ruleForm.email" placeholder="输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="反馈内容：" prop="content">
            <el-input type="textarea" :rows="5" v-model="ruleForm.content" placeholder="输入内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="btns flex-center">
        <button class="btn-ripple fit-text btn-bg" @click="to_liulan()">
          提交
        </button>
        <button class="btn-ripple fit-text" @click="to_order()">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.nav-bar {
  margin-bottom: 20px;

  img {
    width: 14px;
    margin-right: 10px;
  }
}

.ctx-box {
  background: #fff;
  padding: 50px 0;

  .form-box {
    margin: 0 auto;
    width: 700px;

    .title {
      font-weight: 500;
      font-size: 28px;
      color: #585858;
      text-align: center;
      margin-bottom: 20px;
    }
  }

  .btns {
    margin-top: 50px;

    button {
      width: 200px;
      height: 45px;
      background: #FFFFFF;
      border-radius: 0px 0px 0px 0px;
      border: 1px solid @theme;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 17px;
      color: @theme;

      &.btn-bg {
        background: @theme;
        color: #FFFFFF;
      }

      & + button {
        margin-left: 16px;
      }

      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>