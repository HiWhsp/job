<script>
export default {
  name: "list"
}
</script>

<template>
  <div>
    <div class="title">分析测试</div>
    <div class="tip">可出具CMA/CNAS报告</div>
    <div class="list">
      <div class="list-item" v-for="(i, index) in 6" :key="index" @click="$router.push('/analyze_detail')">
        <img src="../../../assets/img/base/appointment/play-img.png" alt="">
        <div class="title ellipsis-1">双束聚焦电子离子显微镜</div>
        <div class="desc ellipsis-1">高精度高分辨率，主要应用于SEM...描电子显微镜结构分析，微纳结构加工，TEM透射电镜样品、原子探针样品制备，材料和微结构在微米和纳米尺度的力学性能分
          析。
        </div>
        <div class="btn">立即预约</div>
        <div class="tip">
          <p>已测试<span>119677</span>次</p>
          <p>收到样品后平均<span>2.6-5.0</span>工作日完成</p>
          <p><span>99.1%</span>%对测试结果满意</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.title {
  font-weight: bold;
  font-size: 20px;
  color: #00479D;
}

.tip {
  margin-top: 21px;
  font-weight: 400;
  font-size: 16px;
  color: #333333;
}

.list {
  margin-top: 30px;
  .flex();
  flex-wrap: wrap;

  .list-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 260px;
    background: #FFFFFF;
    border-radius: 10px;
    padding: 14px 20px 20px 20px;
    box-sizing: border-box;
    margin-right: 18px;
    margin-bottom: 15px;
    transition: all 0.5s;

    &:hover {
      box-shadow: 0 0 20px rgba(16, 35, 62, 0.2);

      img {
        transform: scale(0.9);
        transition: all 0.5s;
      }
    }

    &:nth-child(4n) {
      margin-right: 0;
    }

    img {
      width: 100%;
      height: 200px;
      transition: all 0.5s;
    }

    .title {
      width: 100%;
      margin-top: 10px;
      font-weight: 500;
      font-size: 16px;
      color: #333333;
      text-align: center;
    }

    .desc {
      width: 100%;
      margin-top: 5px;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
    }

    .btn {
      margin-top: 20px;
      width: 100px;
      height: 40px;
      line-height: 40px;
      background: #00479D;
      border-radius: 20px;
      text-align: center;
      font-weight: 400;
      font-size: 16px;
      color: #FFFFFF;
      cursor: pointer;
    }

    .tip {
      margin-top: 15px;
      font-weight: 400;
      font-size: 12px;
      color: #999999;

      p {
        text-align: center;
        line-height: 21px;

        span {
          color: #FF8000;
        }
      }
    }
  }
}
</style>
