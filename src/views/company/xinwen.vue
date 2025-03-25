<script>
export default {
  name: "xinwen",
  data() {
    return {
      current: 1,
      count: 0,
      dataList: [],
      params: {
        channelId: 50,
        page: 1,
        pageNum: 12,
        isIndex: 0,
        orderType: 0
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    go_url(item, index) {
      this.$router.push('/xinhun-detail?id=' + item.id)
    },
    getList() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'news_lists',
          ...this.params
        }
      }).then(res => {
        if (res.code == 200) {
          this.dataList = res.data.list;
          this.count = res.data.count;
        }
      })
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="item-wrap">
      <div class="item" v-for="(item, index) in dataList" :key="item.id" @click="go_url(item, index)">
        <img :src="item.thumb" alt="">
        <div class="info flex">
          <p class="title ellipsis-1">{{ item.title }}</p>
          <div class="desc flex flex-between">
            <div class="date flex"><img src="@/static/about/date.png" alt="">{{ item.dtTime }}</div>
            <div class="right">
              <img src="@/static/about/right.png" alt="" class="no-active">
              <img src="@/static/about/right-active.png" alt="" class="active">
            </div>
          </div>
        </div>
      </div>

      <div v-if="count" class="pagination-box" style="margin-top: 40px; text-align: right;">
        <el-pagination background layout="total, prev, pager, next" @current-change="getList"
                       :current-page.sync="params.page" :page-size="params.pageNum"
                       :total="count"></el-pagination>
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
    //justify-content: space-between;

    .item {
      width: 380px;
      height: 383px;
      background: #F8F8F8;
      margin-top: 31px;
      margin-right: 20px;

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

  .pagination-box {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
