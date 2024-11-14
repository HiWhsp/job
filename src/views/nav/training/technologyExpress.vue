<script>
export default {
  name: "technologyExpress"
}
</script>

<template>
  <div class="list-wrap">
    <div class="title">分析测试</div>
    <div class="card">
      <div class="card-left">
        <img src="@/assets/img/base/appointment/express.png" alt="Machine Image">
      </div>
      <div class="card-right">
        <div class="date-badge">2024-01-03</div>
        <div class="card-header">
          <h3>X射线光电子能谱仪投入使用</h3>
        </div>
        <p>X射线光电子能谱仪（X-ray Photoelectron
          Spectroscopy）是根据光电子效应原理，实现材料的表面几个原子层（1-10nm厚的表面）的化学组成、价态、深层剖析及成像等综合分析与表征技术的研究。</p>
      </div>
      <div class="download-btn">
        <img src="@/assets/img/base/appointment/PDF.png" alt="">下载PDF
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.title {
  font-weight: bold;
  font-size: 20px;
  color: #00479D;
  margin-bottom: 30px;
}
.list-wrap {
  .card {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;

    .card-left {
      flex: 1;

      img {
        width: 100%;
        height: auto;
        border-radius: 5px;
      }
    }

    .card-right {
      flex: 2;
      padding: 0 20px;
      display: flex;
      flex-direction: column;

      .date-badge {
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
        width: 114px;
        height: 30px;
        line-height: 30px;
        background: #707070;
        border-radius: 0px 0px 0px 15px;
        color: #fff;
        font-size: 14px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.5s;

        h3 {
          font-weight: 400;
          font-size: 18px;
          color: #333333;
        }
      }

      p {
        margin-top: 15px;
        font-weight: 400;
        font-size: 14px;
        color: #7E7E7E;
      }
    }

    .download-btn {
      width: 100px;
      height: 35px;
      background: #FFFFFF;
      border-radius: 3px 3px 3px 3px;
      border: 1px solid #999999;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 14px;
        height: 12px;
        margin-right: 5px;
      }
    }

    &:before {
      content: "";
      left: 0;
      height: 3px;
      background: #00479D;
      transition: all 0.5s;
      position: absolute;
      bottom: 0;
      width: 0;
    }

    &:hover {
      .date-badge {
        transition: all 0.5s;
        background-color: #00479D;
      }
      &:before {
        width: 100%;
      }
      h3 {
        color: #00479D!important;
      }
    }
  }
}
</style>
