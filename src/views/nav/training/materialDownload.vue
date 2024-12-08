<script>
export default {
  name: "materialDownload",
  data() {
    return {
      list: [],
      sortList: [],
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
      this.$api({
        url: 'download_list',
        method: 'post',
        data: {
          column_id: '530',
          ...this.pagination
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data;
          this.count = res.count;
        }
      })
    },
    goUrl(item) {
      this.$router.push(`${item.url}?id=${item.params.id}`)
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
    <div class="card" @click="goUrl({url: '/materialDownload-detail', params: {id: item.id}})"
         v-for="(item, index) in list" :key="index">
      <div class="card-right">
        <div class="card-header">
          <h3>{{ item.title }}</h3>
        </div>
        <p>{{ item.description }}</p>
      </div>
      <div class="download-btn">
      </div>
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

.pagination-box {
  margin-top: 40px;
}
</style>
