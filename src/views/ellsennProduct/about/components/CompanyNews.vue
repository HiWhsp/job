<template>
  <div class="company-news">
    <div class="content">
      <h2>公司新闻</h2>
      <div class="news-list">
        <!-- 主要新闻 -->
        <div
          class="main-news"
          v-for="item in [newsList[0]]"
          :key="item.id"
          @click="handleNewsClick(item)"
        >
          <div class="news-image">
            <img :src="item.thumb" :alt="item.title" />
          </div>
          <div class="news-content">
            <h3 class="ellipsis-1">
              {{ item.title }}
            </h3>
            <p class="news-summary ellipsis-3">
              {{ item.info }}
            </p>
          </div>
        </div>

        <!-- 侧边新闻列表 -->
        <div class="side-news">
          <div
            class="news-item"
            v-for="item in newsList.slice(1, 4)"
            :key="item.id"
            @click="handleNewsClick(item)"
          >
            <div class="news-info">
              <h4>{{ item.title }}</h4>
              <span class="news-date">{{ item.created_time }}</span>
            </div>
            <div class="news-thumb">
              <img :src="item.thumb" alt="新闻图片" />
            </div>
          </div>
        </div>
      </div>
      <div class="news-list-wrap">
        <div
          class="news-item"
          v-for="item in newsList.slice(4, 10)"
          :key="item.id"
          @click="handleNewsClick(item)"
        >
          <div class="news-thumb">
            <img :src="item.thumb" alt="新闻图片" />
          </div>
          <div class="news-info">
            <h4>{{ item.title }}</h4>
            <p class="news-summary ellipsis-3">{{ item.info }}</p>
            <span class="news-date">{{ item.created_time }}</span>
          </div>
        </div>
      </div>
      <!-- 分页区域 -->
      <el-pagination
        style="text-align: center"
        v-if="total > 0"
        class="pagination"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
      <el-empty v-else description="暂无数据" />
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyNews",
  data() {
    return {
      total: 0,
      currentPage: 1,
      newsList: [],
    };
  },
  mounted() {
    this.getNewsList();
  },
  methods: {
    handleNewsClick(news) {
      this.$router.push("/newsInsightsDetail?id=" + news.id);
    },
    getNewsList() {
      this.$api({
        url: "getArticleList",
        method: "get",
        params: {
          page: this.currentPage,
          limit: 10,
          type_id: 3,
        },
      }).then((res) => {
        this.newsList = res.data.list;
        this.total = res.data.count;
      });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getNewsList();
    },
  },
};
</script>

<style scoped lang="less" src="./CompanyNews.less"></style>
