<template>
  <div class="page">
    <div class="list-wrap">
      <div class="list-item" v-for="(item, index) in news_list" :key="index" @click="toDetail(item)">
        <div class="img-wrap">
          <img :src="item.thumb" alt="" />
        </div>
        <div class="title-wrap">{{ item.title }}</div>
        <div class="desc-wrap">
          <div class="left">
            <div class="icon-wrap">
              <img :src="item.thumb" alt="" />
            </div>
            <div class="time">{{ item.dtTime }}</div>
          </div>
          <div class="right" >
            <div class="text">了解详情</div>
            <div class="next-wrap">
              <img src="@/assets/img/chat-us/icon1.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="10"
        layout="total,  prev, pager, next, jumper"
        :total="count"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 0,

      news_list: [],
      count: 0
    };
  },
  created() {
    this.setView()
  },
  methods: {
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          channelId: 8,
          page: 1,
          pageSize: 4,
        },
      }).then(res => {
        if(res.code == 200) {
          this.news_list = res.data.list;
          this.count = res.data.count
        }
      })
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    toDetail(item) {
      this.$router.push({
        path: 'company-news-detail',
        query: {
          id: item.id
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
.page {
  background: #f4f4f6;
  padding-bottom: 73px;
}

.list-wrap {
  padding: 57px 260px 50px;
  display: flex;
  row-gap: 20px;
  column-gap: 36px;
  flex-wrap: wrap;
  .list-item {
    width: 436px;
    background: #fff;
    .img-wrap {
      width: 436px;
      height: 292px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title-wrap {
      padding: 24px 26px 29px;
      border-bottom: 1px solid #e5e5e5;
      font-size: 20px;
      color: #333333;
      line-height: 36px;
    }
    .desc-wrap {
      height: 62px;
      padding: 0 22px 0 19px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        gap: 9px;
        .icon-wrap {
          width: 15px;
          height: 15px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .time {
          font-size: 16px;
          color: #757575;
        }
      }
      .right {
        display: flex;
        align-items: center;
        gap: 13px;
        cursor: pointer;
        .text {
          font-size: 18px;
          color: #757575;
        }
        .next-wrap {
          width: 20px;
          height: 16px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.center {
  text-align: center;
}
</style>
