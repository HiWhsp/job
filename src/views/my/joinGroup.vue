<script>
export default {
  name: "joinGroup",
}
</script>

<template>
  <div class="section-order">
    <div class="section-title">
      <div class="label">我的团体</div>
      <div class="search">
        <el-input placeholder="请输入负责人手机号/邮箱/团号/完整的团体名称">
          <template slot="append">搜索</template>
        </el-input>
      </div>
    </div>

    <div class="order-box">
      <div class="empty-info">
        <div class="empty-img">
          <img src="@/assets/img/my/empty-img.png" alt=""/>
        </div>
        <div class="empty-text">暂无加入任何团体，快去加入团体/创建团体吧</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
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

.section-order {
  background: #fff;

  .order-box {
    min-height: 620px;

    .empty-info {
      text-align: center;
      padding: 40px 0;

      // border-top: 1px solid #dedede;
      .empty-img {
        text-align: center;

        img {
          width: 190px;
        }
      }

      .empty-text {
        margin-top: 10px;
        margin-bottom: 20px;
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #999999;
      }
    }
  }
}
</style>
