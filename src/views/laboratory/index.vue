<template>
    <div class="container">
      <div class="button-container">
        <div class="circle">
            <!-- <div></div> -->
        </div>
        <button class="custom-button">
          材料测试
          <div class="arrow">›</div>
        </button>
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
      left: 46%; // 调整位置
      display: flex;
      align-items: center;
  
      .circle {
        position: relative;
        display: inline-block;
        width: 15px;
        height: 15px;


        /* 创建第一层颜色（最外层） */
        .circle::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%; /* 使元素成为圆形 */
        background-color: #476DB6; /* 第一层颜色 */
       }

        /* 创建第二层颜色 */
        .circle::after {
        content: "";
        position: absolute;
        top: 2px; /* 调整位置，使其内缩 */
        left: 2px;
        bottom: 2px;
        right: 2px;
        border-radius: 50%; /* 使元素成为圆形 */
        background-color:#27417C; /* 第二层颜色 */
        }

        /* 创建第三层颜色（最内层） */
        // .circle > div {
        // display: block;
        // margin: 4px; /* 内层边距 */
        // width: calc(100% - 8px); /* 计算宽度，使其内缩 */
        // height: calc(100% - 8px);
        // border-radius: 50%; /* 使元素成为圆形 */
        // background-color:#FFFFFF; /* 第三层颜色 */
        // }
  
        }

      .custom-button {
        background-color:#27417C;
        color: white;
        border: none;
        padding: 10px 20px;
        font-weight: 400;
        font-size: 16px;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 180px;
        height: 50px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
  
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -10px;
          width: 0;
          height: 0;
          border-top: 25px solid transparent;
          border-bottom: 25px solid transparent;
          border-left: 10px solid rgba(0, 72, 151, 0.8);
        }
  
        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: -10px;
          width: 0;
          height: 0;
          border-top: 25px solid transparent;
          border-bottom: 25px solid transparent;
          border-left: 10px solid rgba(0, 72, 151, 0.8);
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