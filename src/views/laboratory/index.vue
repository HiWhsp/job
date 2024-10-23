<template>
    <div class="container">
        <div class="button-container">
            <div class="circle">
                <div class="c1"></div>
                <div class="c2"></div>
                <div class="c3"></div>
            </div>
            <div class="custom-button pointer" @click="$router.push('/company-profile') ">
                企业简介
                <img src="@/assets/img/allCommodities/right-a.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Laboratory'
}
</script>

<style lang="less" scoped>
.container {
  width: 1920px;
  height: 960px;
  background-image: url('../../assets/img/background/laboratory_back.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;

  .button-container {
    position: absolute;
    top: 28%; // 调整位置
    left: 48%; // 调整位置
    display: flex;
    align-items: center;

    .circle {
      position: absolute;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      left: -55px;

      .c1 {
        position: absolute;
        width: 40px;
        height: 40px;
        background: #27417C;
        border-radius: 50%;
        opacity: 0.29;
      }

      .c2 {
        position: absolute;
        width: 20px;
        height: 20px;
        background: #27417C;
        border-radius: 50%;
      }

      .c3 {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #FFFFFF;
        border-radius: 50%;
      }
    }

    .custom-button {
      width: 214px;
      height: 61px;
      background: #27417C;
      border-radius: 4px 4px 4px 4px;
      opacity: 0.85;
      color: #fff;
      font-size: 16px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;


      &::before {
        content: '';
        position: absolute;
        top: 20px;
        left: -10px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 10px solid #27417C;;
      }


      .arrow {
        font-size: 24px;
        font-weight: bold;
        margin-left: 10px;
        background-color: rgba(255, 255, 255, 0.2);
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
    }
  }
}
</style>