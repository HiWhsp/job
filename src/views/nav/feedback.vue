<script>
export default {
  name: "feedback",
  data() {
    return {
      ruleForm: {

      },
      rules: {}
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
            <el-input type="text" v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone">
            <el-input type="text" v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input type="text" v-model="ruleForm.email"></el-input>
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