<script>
export default {
    name: "xinwen"
}
</script>

<template>
    <div class="content">
        <div class="item-wrap">
            <div class="item" v-for="item in 9" :key="item">
                <img src="@/static/about/5.png" alt="">
                <div class="info flex">
                    <p class="title ellipsis-1">STAF直线滑轨采用行业唯一的共轨设计</p>
                    <div class="desc flex flex-between">
                        <div class="date flex"><img src="@/static/about/date.png" alt="">2024-10-10</div>
                        <div class="right">
                            <img src="@/static/about/right.png" alt="" class="no-active">
                            <img src="@/static/about/right-active.png" alt="" class="active">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.content {
  padding: 46px 0 56px;

  .item-wrap {
    width: 1200px;
    margin: 0 auto;
    .flex();
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      width: 380px;
      height: 383px;
      background: #F8F8F8;
      margin-top: 31px;

      img {
        width: 380px;
        height: 250px;
      }

      .info {
        padding: 21px 26px 29px 18px;
        height: 133px;
        box-sizing: border-box;
        background-color: #F8F8F8;
        flex-direction: column;
        align-items: start;
        justify-content: space-between;
        cursor: pointer;

        .title {
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 20px;
          color: #333333;
        }

        .desc {
          width: 100%;

          .date {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 16px;
            color: #8D8D8D;

            img {
              width: 17px;
              height: 17px;
              margin-right: 10px;
            }
          }

          .right {
            width: 35px;
            height: 35px;
            background-color: @theme;
            border-radius: 50%;

            img {
              width: 100%;
              height: 100%;
            }

            .active {
              display: none;
            }
          }
        }
      }

      .info:hover {
          .title {
              color: #F4A116;
          }
        .right {
          .no-active {
            display: none;
          }

          .active {
            display: block;
          }
        }
      }
    }
  }
}
</style>
