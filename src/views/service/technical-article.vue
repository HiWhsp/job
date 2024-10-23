<template>
  <div class="page">
    <div class="filter-wrap">
      <el-select v-model="keyword" placeholder="请选择文章分类" class="select">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select v-model="keyword" placeholder="请选择文章分类" class="select">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
          v-model="keyword"
          placeholder="请输入关键词"
          class="input"
      ></el-input>
      <div class="search-btn" @click="search">搜索</div>
      <div class="reset-btn" @click="reset">重置</div>
    </div>
    <div class="article-list">
      <div class="article-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
        <div class="article-img">
          <img :src="item.thumb" alt=""/>
        </div>
        <div class="article-title-wrap pointer">
          <div class="article-title ellipsis-1">{{ item.title }}</div>
          <div class="article-sub-title">
            <div class="article-sub-title-img-wrap">
              <img src="@/assets/img/service/icon1.png" alt=""/>
            </div>
            <div>原理及产品介绍</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <el-pagination
          @current-change="changePage"
          :current-page.sync="pagination.page"
          :page-size="pagination.pageNum"
          layout="total, prev, pager, next, jumper"
          :total="count"
          size="large"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "technical-article",
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        }
      ],
      keyword: "",
      list: [], // 文章列表
      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
    };
  },
  mounted() {
    // 获取文章分类
    this.$api({
      url: '/service.php',
      method: 'get',
      data: {
        action: 'news_lists',
        channelId: 5
      },
    }).then(res => {
      if (res.code == 200) {
        this.list = res.data.list
        this.count = res.data.count
      }
    })
  },
  methods: {
    search() {
      console.log("search");
    },
    reset() {
      console.log("reset");
    },
    changePage(page) {
      this.pagination.page = page;
    },
    toDetail(item) {
      this.$router.push({
        path: `/technical-article-detail?id=${item.id}`,
      })
    }
  },
};
</script>

<style scoped lang="less">
.page {
  padding-bottom: 50px;
}

.filter-wrap {
  width: 100%;
  height: 123px;
  display: flex;
  padding: 41px 260px 42px;
  background: #fff;
}

.select {
  width: 350px;
  margin-right: 20px;
}

.input {
  width: 350px;
  margin-right: 44px;
}

.search-btn {
  width: 126px;
  height: 40px;
  margin-right: 14px;
  background: #27417c;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  color: #ffffff;
  line-height: 40px;
  text-align: center;
}

.reset-btn {
  width: 126px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #b2b2b2;
  cursor: pointer;
  font-size: 18px;
  color: #707070;
  line-height: 40px;
  text-align: center;
}

.article-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: 37px;
  column-gap: 37px;
  padding: 50px 260px 0;
  background: #f4f4f6;

  .article-item {
    width: 436px;
    background: #ffffff;
    border-radius: 10px 0px 10px 10px;

    .article-img {
      width: 100%;
      height: 292px;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .article-title-wrap {
      height: 110px;
    }

    .article-title {
      padding: 24px 26px 0;
      font-weight: 400;
      font-size: 20px;
      color: #333333;
      line-height: 26px;
    }

    .article-sub-title {
      padding: 21px 0 0 26px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #27417c;

      .article-sub-title-img-wrap {
        width: 13px;
        height: 14px;
        margin-right: 5px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.pagination {
  padding: 48px 0 59px;
  background: #f4f4f6;
  text-align: center;
}
</style>
