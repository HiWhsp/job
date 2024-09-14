<template>
  <div class="page">
    <div class="nav-box">
      <div class="title flex">
        <p class="tit">关于富俊</p>
        <p class="desc">运动组件采购商城</p>
      </div>
      <div class="nav flex">
        <div class="item pointer" :class="{'active': current === 1}">公司简介</div>
        <div class="col"></div>
        <div class="item pointer">新闻资讯</div>
        <div class="col"></div>
        <div class="item pointer">联系我们</div>
      </div>
    </div>
    <div class="content">
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'companyProfile',
  data() {
    return {
      current: 1
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  background-color: #fff;
  padding: 0;

  .nav-box {
    position: relative;
    height: 550px;
    background-image: url("../../static/about/about-top.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .title {
      flex-direction: column;
      justify-content: center;
      text-align: center;
      height: 100%;

      .tit {
        font-family: Roboto, Roboto;
        font-weight: bold;
        font-size: 28px;
        color: #FFFFFF;
      }

      .desc {
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 18px;
        color: #C2BEB9;
      }
    }

    .nav {
      position: absolute;
      bottom: 0;
      width: 1200px;
      height: 75px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 0px 0px 0px 0px;
      margin-left: -600px;
      left: 50%;
      justify-content: center;

      .item {
        position: relative;
        color: #fff;
        font-family: Roboto, Roboto;
        font-weight: bold;
        font-size: 18px;
      }

      .item.active {
        color: #F4A116;
      }

      .item.active::after {
        content: "";
        position: absolute;
        width: 68px;
        height: 3px;
        background: #F4A116;
        bottom: -20px;
        left: 3px;
      }

      .col {
        width: 0px;
        height: 17px;
        border: 1px solid #FFFFFF;
        opacity: 0.5;
        margin: 0 62px;
      }
    }
  }
}
</style>
