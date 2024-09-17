<template>
    <div class="content">
        <div class="top flex">
            <div class="title">STAF直线滑轨采用行业唯一的共轨设计</div>
            <div class="info flex">
                <div class="desc"><span>发布时间：</span>2024-10-10</div>
                <div class="desc"><span>来源：</span>富俊机械</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "xinwen_detail"
}
</script>

<style scoped lang="less">
.content {
  padding: 62px 0 54px;
  background-color: #fff;
  .flex();
  flex-direction: column;
  align-items: center;

  .top {
    padding-bottom: 22px;
    width: 1500px;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid #C9C9C9;

    .title {
      font-family: Roboto, Roboto;
      font-weight: bold;
      font-size: 28px;
      color: #000;
    }

    .info {
      margin-top: 40px;

      .desc {
        margin-right: 46px;

        span {
          margin-right: 24px;
        }
      }
    }
  }
}
</style>