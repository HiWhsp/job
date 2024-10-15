<template>
  <div class="page">
    <div class="inner">
      <div class="title">下单成功</div>
      <div class="main">
        <div class="icon-wrap">
          <img src="@/assets/img/productDetail/icon1.png" alt="" />
        </div>
        <div class="desc-wrap">下单成功</div>
        <div class="number-wrap">订单号：546456456123123</div>
        <div class="btn-wrap">
          <div class="btn btn1">查看订单</div>
          <div class="btn btn2">继续浏览</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.page {
  background: #f4f4f6;
  padding: 33px 260px 61px;
}

.inner {
  height: 517px;
  padding: 31px 34px 0 30px;
  background: #fff;
  .title {
    padding-bottom: 16px;
    font-size: 24px;
    color: #333333;
    line-height: 24px;
    border-bottom: 1px solid #d5d8de;
  }
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 74px;
    .icon-warp {
      width: 96px;
      height: 31px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .desc-wrap {
      margin: 24px 0 18px;
      font-size: 24px;
      color: #000000;
      line-height: 35px;
    }
    .number-wrap {
      font-size: 14px;
      color: #000000;
      line-height: 20px;
    }
    .btn-wrap {
      display: flex;
      margin-top: 33px;
      .btn {
        width: 128px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px 4px 4px 4px;
        cursor: pointer;
      }

      .btn1 {
        margin-right: 25px;
        background: #27417c;
        color: #fff;
      }
      .btn2 {
        background: #ffffff;
        border: 1px solid #27417c;
        color: @theme;
      }
    }
  }
}
</style>