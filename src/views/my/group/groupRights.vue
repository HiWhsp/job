<script>
export default {
  name: "groupRights"
}
</script>

<template>
  <div class="container">
    <div class="section-title">
      <div class="label">我的团体</div>
    </div>
    <div class="content">
      <p class="title">团体权益</p>
      <div class="list">
        <div class="item" v-for="item in 10" :key="item">
          <img :src="require(`@/assets/img/my/group/${item}.png`)" alt="">
          <span class="text">免费试样-临时</span>
          <span class="desc">这里是二级文案</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  background-color: #fff;
  padding-top: 0;
}

.section-title {
  border-bottom: 1px solid #dedede;
  .flex-between();
  height: 56px;
  padding: 0 32px;

  .label {
    font-size: 18px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    color: #333333;
  }

  .search {
    width: 400px;

    .el-input {
      border: 1px solid #00479D;
    }

    /deep/ .el-input__inner {
      border-radius: 0;
      border: none;
    }

    /deep/ .el-input-group__append {
      cursor: pointer;
      background: #00479D;
      color: #fff;
      border-radius: 0;
      border: none;
    }
  }
}

.content {
  margin-top: 50px;

  .title {
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    color: #282828;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 50px;

    .item {
      width: 120px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 80px;
      margin-bottom: 50px;

      img {
        width: 100px;
        height: 100px;
      }

      .text {
        font-weight: bold;
        font-size: 18px;
        color: #333333;
      }

      .desc {
        margin-top: 15px;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }
    }
  }
}
</style>
