<script>
export default {
  name: "search",
  data() {
    return {
      list: [],
      pagination: {
        page: 1,
        limit: 10
      },
      count: 0,
      keyword: ''
    }
  },
  watch: {
    "$route.query.hash"() {
      if (this.keyword) {
        this.getList();
      }
    }
  },
  mounted() {
    this.keyword = this.$route.query.keyword
    if (this.keyword) {
      this.getList();
    }
  },
  methods: {
    // 获取列表
    getList() {
      this.$api({
        url: 'cms_product_list',
        method: 'post',
        data: {
          keyword: this.keyword,
          ...this.pagination
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data;
          this.count = res.count;
        }
      })
    },
    goUrl(id) {
      this.$router.push('/analyze_detail?id=' + id)
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="main">
      <div class="tip">已为您找到相关结果约为{{ count }}个</div>
      <div class="list">
        <div class="list-item" v-for="(it, index) in list" :key="it.id">
          <img :src="it.thumb" alt="">
          <div class="title ellipsis-1">{{ it.title }}</div>
          <div class="desc ellipsis-1">{{ it.description }}</div>
          <div class="btn" @click="goUrl(it.id)">立即预约</div>
          <div class="tip">
            <p>已测试<span>{{ it.orders || 0 }}</span>次</p>
            <p v-html="it.period"></p>
            <p><span>{{ it.comments }}</span>%对测试结果满意</p>
          </div>
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
      <el-empty v-else description="暂无记录,请重新输入关键词..."></el-empty>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  background-color: #fff;
  padding-bottom: 50px;
}

.title {
  font-weight: bold;
  font-size: 20px;
  color: #00479D;
}

.tip {
  margin-top: 21px;
  font-weight: 400;
  font-size: 16px;
  color: #333333;
}

.list {
  margin-top: 30px;
  .flex();
  flex-wrap: wrap;

  .list-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 260px;
    background: #FFFFFF;
    border-radius: 10px;
    padding: 14px 20px 20px 20px;
    box-sizing: border-box;
    margin-right: 18px;
    margin-bottom: 15px;
    transition: all 0.5s;

    &:hover {
      box-shadow: 0 0 20px rgba(16, 35, 62, 0.2);

      img {
        transform: scale(0.9);
        transition: all 0.5s;
      }
    }

    &:nth-child(4n) {
      margin-right: 0;
    }

    img {
      width: 100%;
      height: 200px;
      transition: all 0.5s;
    }

    .title {
      width: 100%;
      margin-top: 10px;
      font-weight: 500;
      font-size: 16px;
      color: #333333;
      text-align: center;
    }

    .desc {
      width: 100%;
      margin-top: 5px;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
    }

    .btn {
      margin-top: 20px;
      width: 100px;
      height: 40px;
      line-height: 40px;
      background: #00479D;
      border-radius: 20px;
      text-align: center;
      font-weight: 400;
      font-size: 16px;
      color: #FFFFFF;
      cursor: pointer;
    }

    .tip {
      margin-top: 15px;
      font-weight: 400;
      font-size: 12px;
      color: #999999;

      p {
        text-align: center;
        line-height: 21px;

        span {
          color: #FF8000;
        }
      }
    }
  }
}

.pagination-box {
  margin-top: 40px;
}
</style>
