<script>
export default {
  name: "detail"
}
</script>

<template>
  <div>
    <div class="top-box">
      <div class="img">
        <img src="@/assets/img/base/appointment/play-img.png" alt="">
      </div>
      <div class="info">
        <p class="title">双束聚焦电子离子显微镜</p>
        <p><span>仪器型号</span> <span>FETecnal F20, TF30, JEOL JEM 200F, FETalos F00</span></p>
        <p><span>预约次数</span> <span>608854次</span></p>
        <p><span>服务周期</span> <span>收到样品后平均2.6-5.0工作日完成</span></p>
        <p><span>好评率</span> <span>98.6%</span></p>
        <div class="btn">立即预约</div>
      </div>
    </div>
    <div class="detail">
      <div class="title">详细描述</div>
      <div class="content">
        asdfadsfas
      </div>
      <div class="prev">
        <div class="last">上一个 XPS X射线光电子能谱仪</div>
        <div class="next">下一个 XPS X射线光电子能谱仪</div>
      </div>
    </div>
    <div class="tip-box">
      <div class="title">其他设备</div>
      <div class="content">
        <div class="it" v-for="i in 4">
          <div class="img-box">
            <img src="@/assets/img/base/appointment/play-img.png" alt="">
          </div>
          <p>双束聚焦电子离子显微镜</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.top-box {
  height: 343px;
  padding: 35px;
  background-color: #fff;
  .flex();

  .img {
    width: 448px;
    height: 100%;
    border: 1px solid #eee;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .info {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 60px;

    .title {
      font-weight: bold;
      font-size: 24px;
      color: #333333;
    }

    p {
      font-weight: 400;
      font-size: 14px;
      color: #636363;

      span:first-child {
        display: inline-block;
        width: 90px;
      }

      span:last-child {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }
    }

    .btn {
      width: 148px;
      height: 45px;
      background: #00479D;
      text-align: center;
      line-height: 45px;
      color: #fff;
      font-size: 19px;
    }
  }
}

.detail {
  margin-top: 20px;
  background-color: #fff;

  .title {
    padding: 0 30px;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #E8E8E8;
    font-weight: 500;
    font-size: 18px;
    color: #00479D;
  }

  .content {
    padding: 30px;
  }

  .prev {
    display: flex;
    justify-content: space-between;
    padding: 30px;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    cursor: pointer;
  }
}
.tip-box {
  margin-top: 20px;
  background-color: #fff;

  .title {
    padding: 0 30px;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #E8E8E8;
    font-weight: 500;
    font-size: 18px;
    color: #00479D;
  }
  .content {
    padding: 30px;
    display: flex;
    .it {
      width: 246px;
      margin-right: 19px;
      &:last-child {
        margin-right: 0;
      }
      .img-box {
        height: 234px;
        border: 1px solid #E8E8E8;
        img {
          height: 100%;
        }
      }
      p {
        margin-top: 15px;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        text-align: center;
      }
    }
  }
}
</style>
