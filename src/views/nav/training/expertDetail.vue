<script>
export default {
  name: "expertTeam_detail"
}
</script>

<template>
  <div class="container">
    <div class="top-box">
      <img src="@/assets/img/base/appointment/expertTeam.png" alt="">
      <div class="text">
        <p class="name">郭菲菲</p>
        <p>
          这里是专家简介这里是专家简介，这里是专家简介这里是专家简介这里是专家简介，这里是专家简介这里是专家简介这里是专家简介，这里是专家简介</p>
      </div>
    </div>
    <div class="desc">
      <div class="tit">详细描述</div>
      <div class="detail">
        这里是专家简介这里是专家简介，这里是专家简介这里是专家简介这里是专家简介，这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介，这里是专家简介这里是专家简介这里是专家简介，这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介，这里是专家简介这里是专家简介这里是专家简介，这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家简介这里是专家
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 75px;
  background-color: #fff;

  .top-box {
    display: flex;
    align-items: center;

    img {
      width: 147px;
      height: 147px;
      border-radius: 50%;
    }

    .text {
      margin-left: 80px;

      p {
        font-weight: 400;
        font-size: 15px;
        color: #666666;
      }

      .name {
        margin-bottom: 30px;
        font-weight: 400;
        font-size: 22px;
        color: #000000;
      }
    }
  }

  .desc {
    margin-top: 100px;

    .tit {
      font-weight: 400;
      font-size: 20px;
      color: #00479D;
      padding-bottom: 20px;
      border-bottom: 1px solid #707070;
    }

    .detail {
      margin-top: 40px;

      font-weight: 400;
      font-size: 15px;
      color: #666666;
    }
  }
}
</style>
