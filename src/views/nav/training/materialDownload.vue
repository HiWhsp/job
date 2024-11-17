<script>
export default {
  name: "materialDownload",
  data() {
    return {
      sortList: []
    }
  },
  methods: {
    goUrl() {
      this.$router.push({path: '/materialDownload-detail'})
    }
  }
}
</script>

<template>
  <div class="list-wrap">
    <div class="title">
      <span>资料下载</span>
      <div class="sort">
        <div class="sort-item" v-for="(item, index) in sortList" :key="index">分类名称</div>
      </div>
    </div>
    <div class="card" @click="goUrl()">
      <div class="card-right">
        <div class="card-header">
          <h3>X射线光电子能谱仪投入使用</h3>
        </div>
        <p>X射线光电子能谱仪（X-ray Photoelectron
          Spectroscopy）是根据光电子效应原理，实现材料的表面几个原子层（1-10nm厚的表面）的化学组成、价态、深层剖析及成像等综合分析与表征技术的研究。</p>
      </div>
      <div class="download-btn">
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
    justify-content: space-between;
    background-color: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px 50px;
    margin-bottom: 20px;

    .card-right {
      width: 840px;
      display: flex;
      flex-direction: column;

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
      cursor: pointer;
      width: 40px;
      height: 40px;
      background-image: url("~@/assets/img/base/appointment/down.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
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
      &:before {
        width: 100%;
      }

      h3 {
        color: #00479D !important;
      }

      .download-btn {
        background-image: url("~@/assets/img/base/appointment/down-active.png");
      }
    }
  }
}
</style>
