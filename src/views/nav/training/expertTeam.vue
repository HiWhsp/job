<script>
export default {
  name: "expertTeam"
}
</script>

<template>
  <div class="list-wrap">
    <div class="title">专家团队</div>
    <div class="card">
      <div class="item" v-for="item in 4">
        <img src="@/assets/img/base/appointment/expertTeam.png" alt="Machine Image">
        <p class="name">李先生</p>
        <p class="desc">这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介</p>
        <div class="btn">了解更多</div>
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
    display: flex;
    flex-wrap: wrap;

    .item {
      position: relative;
      padding: 40px 50px;
      width: 340px;
      height: 380px;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 39px;
      margin-bottom: 30px;

      &:nth-child(3n) {
        margin-right: 0;
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
      }
    }

    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }

    .name {
      font-weight: 400;
      font-size: 18px;
      color: #333333;
      margin-top: 15px;
    }

    .desc {
      font-weight: 400;
      font-size: 14px;
      color: #7E7E7E;
      margin-top: 15px;
    }

    .btn {
      cursor: pointer;
      width: 114px;
      height: 34px;
      background: #00479D;
      text-align: center;
      line-height: 34px;
      color: #fff;
      font-size: 14px;
      margin-top: 25px;
    }
  }
}
</style>
