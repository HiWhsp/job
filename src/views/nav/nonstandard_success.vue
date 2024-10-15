<script>
export default {
  name: "nonstandard_success",
  data() {
    return {}
  },
  methods: {
    goUrl(url) {
      this.$router.push(url);
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="success">
      <img src="../../static/prod/nonstandard_add_success.png" alt="">
      <p class="title">提交成功</p>
      <p class="desc">您填写的信息已提交到后台，等待管理员联系</p>
      <div class="btn pointer" @click="goUrl('/nonstandard')">
        继续提交
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.success {
  .flex();
  flex-direction: column;
  margin-top: 107px;

  img {
    width: 80px;
    height: 80px;
  }

  .title {
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 24px;
    color: #000000;
    font-style: normal;
    text-transform: none;
    margin-top: 23px;
  }

  .desc {
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 14px;
    color: #000000;
    font-style: normal;
    text-transform: none;
    margin-top: 18px;
  }

  .btn {
    width: 128px;
    height: 40px;
    background: #FFFFFF;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid @theme;
    text-align: center;
    line-height: 40px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 14px;
    color: @theme;
    font-style: normal;
    text-transform: none;
    margin-top: 34px;
  }
}
</style>
