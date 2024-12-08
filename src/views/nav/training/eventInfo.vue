<script>
export default {
  name: "news",
  data() {
    return {
      list: [],
      pagination: {
        page: 1,
        limit: 5,
      },
      count: 0,
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      //   获取新闻列表
      this.$api({
        url: "article_list",
        method: "post",
        data: {
          column_id: 507,
          ...this.pagination
        }
      }).then(res => {
        if (res.code == 200) {
          this.count = res.count;
          this.list = res.data
        }
      })
    },
    getUrl(item) {
      this.$router.push(`${item.url}?id=${item.params.id}`)
    }
  }
}
</script>

<template>
  <div class="list-wrap">
    <div class="title">活动信息</div>
    <div class="card" v-for="(item, index) in list" :key="index"
         @click="getUrl({url: '/eventInfoDetail', params: { id: item.id }})">
      <div class="card-left">
        <img :src="item.thumb" alt="">
      </div>
      <div class="card-right">
        <div class="date-badge">{{ item.created_at }}</div>
        <div class="card-header">
          <h3>{{ item.title }}</h3>
        </div>
        <p>{{ item.description }}</p>
      </div>
      <!--      <div class="download-btn">-->
      <!--        <img src="@/assets/img/base/appointment/PDF.png" alt="">下载PDF-->
      <!--      </div>-->
    </div>
    <div class="pagination-box" v-if="count">
      <el-pagination
          background
          layout="total, prev, pager, next"
          :total="count"
          :current-page="pagination.page"
          :page-size="pagination.limit"
          @current-change="changePage"
      >
      </el-pagination>
    </div>
    <el-empty v-else description="暂无记录..."></el-empty>
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
    margin-bottom: 15px;

    .card-left {
      flex: 1;

      img {
        width: 100%;
        height: 200px;
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
        color: #00479D !important;
      }
    }
  }
}

.pagination-box {
  margin-top: 40px;
}
</style>
