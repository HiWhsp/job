<script>
export default {
  name: "policy",
  data() {
    return {

    }
  },
  methods: {}
}
</script>

<template>
  <div class="content">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item><img src="@/static/home/home.png" alt="">当前位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>隐私协议</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="item-wrap">
      <div class="title">隐私协议</div>
      <div class="content"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.content {
  padding: 20px 0 56px;
  width: 1400px;
  margin: 0 auto;

  .nav-bar {
    margin-bottom: 20px;

    img {
      width: 14px;
      margin-right: 10px;
    }
  }

  .item-wrap {
    width: 1400px;
    background: #fff;
    padding: 48px 30px 50px;

    .title {
      font-family: Roboto, Roboto;
      font-weight: bold;
      font-size: 24px;
      color: #383635;
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #DDDDDD;
    }
    .content {
      margin-top: 40px;
    }
  }
}
</style>
