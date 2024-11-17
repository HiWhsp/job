<script>
export default {
  name: "success",
  data() {
    return {}
  },
  mounted() {
    this.option = this.$route.query
  },
  methods: {
    goUrl() {
      this.$router.push({
        path: '/forum'
      })
    }
  }
}
</script>

<template>
  <div class="container main">
    <div class="content">
      <img src="@/assets/img/base/appointment/pay-success.png" alt="">
      <p class="status-text">发帖成功</p>
      <p class="status-detail">请耐心等待管理员审核！</p>
      <div class="btn-box">
        <div class="btn" @click="goUrl">查看帖子</div>
        <div class="btn back" @click="goUrl">继续发帖</div>
        <div class="btn" @click="goUrl">返回论坛</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 35px 0 50px;

  .content {
    background-color: #fff;
    height: 673px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  img {
    max-width: 320px;
    max-height: 225px;
  }

  .status-text {
    margin-top: 30px;
    font-weight: bold;
    font-size: 20px;
    color: #282828;
  }

  .status-detail {
    margin-top: 20px;
    font-weight: 400;
    font-size: 14px;
    color: #FF0000;
  }

  .btn-box {
    display: flex;
    align-items: center;

    .btn {
      cursor: pointer;
      width: 133px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 3px;
      border: 1px solid #00479D;
      font-weight: 400;
      font-size: 14px;
      color: #00479D;
      margin-right: 20px;
      margin-top: 50px;
    }

    .back {
      background-color: #00479D;
      color: #fff;
    }
  }
}
</style>