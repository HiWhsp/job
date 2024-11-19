<script>
export default {
  name: "detail"
}
</script>

<template>
  <div class="content">
    <div class="status-item">
      <div class="status">
        <span>氧氮氢分析仪</span>
        <span>等待支付</span>
      </div>
      <div class="info">
        <div class="left"></div>
        <div class="right"></div>
      </div>
    </div>
    <div class="address-item"></div>
    <div class="order-item"></div>
    <div class="orderInfo-item"></div>
  </div>
</template>

<style scoped lang="less">
.content {
  .status-item {
    width: 100%;
    background-color: #fff;

    .status {
      display: flex;
      justify-content: space-between;
      padding: 0 55px 0;
      height: 89px;
      line-height: 89px;
      background: #DFEEFF;

      span {
        font-size: 20px;

        &:first-child {
          color: #333333;
          font-weight: 400;
        }

        &:last-child {
          color: #00479D;
        }
      }
    }

    .info {
      margin: 30px 0;
      padding: 0 40px;
    }
  }
}
</style>
