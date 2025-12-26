<template>
  <div class="news-page">
    <div class="w-1600">
      <!-- 面包屑导航 -->
      <div class="breadcrumb-section">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-item">首页</router-link>
          <i class="el-icon-arrow-right breadcrumb-separator"></i>
          <router-link to="/news" class="breadcrumb-item">新闻资讯</router-link>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="news-content">
        <!-- 左侧主内容 -->
        <div class="news-main">
          <!-- 分类标签 -->
          <div class="category-tabs">
            <div
              class="tab-item"
              :class="{ active: activeTab == '' }"
              @click="switchTab('')"
            >
              全部
            </div>
            <div
              class="tab-item"
              :class="{ active: activeTab == item.id }"
              @click="switchTab(item.id)"
              v-for="(item, index) in vuex_category_tree"
              :key="index"
            >
              {{ item.title }}
            </div>
          </div>

          <!-- 文章列表 -->
          <div class="article-list">
            <div
              class="article-item"
              v-for="(article, index) in articles"
              :key="article.id || index"
              @click="handleArticleClick(article)"
            >
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-description">{{ article.description }}</p>
              <div class="article-date">
                {{ formatDate(article.date || article.created_at) }}
              </div>
            </div>
            <el-empty
              v-if="articles.length === 0"
              description="暂无新闻数据"
            ></el-empty>
          </div>

          <!-- 分页 -->
          <div class="pagination-section" v-if="articles.length > 0">
            <el-pagination
              :total="totalArticles"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="handlePageChange"
              layout="total, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="news-sidebar">
          <!-- 热门资讯 -->
          <div class="sidebar-section">
            <h3 class="sidebar-title"><span>热门</span>资讯</h3>
            <ul class="sidebar-list">
              <li
                class="sidebar-item"
                v-for="(item, index) in hotNews"
                :key="index"
                @click="handleArticleClick(item)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>

          <!-- 最新资讯 -->
          <div class="sidebar-section">
            <h3 class="sidebar-title"><span>最新</span>资讯</h3>
            <ul class="sidebar-list">
              <li
                class="sidebar-item"
                v-for="(item, index) in latestNews"
                :key="index"
                @click="handleArticleClick(item)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "News",
  data() {
    return {
      activeTab: "",
      currentPage: 1,
      pageSize: 10,
      totalArticles: 0,
      articles: [],
      hotNews: [],
      latestNews: [],
    };
  },
  computed: {
    ...mapState(["vuex_category_tree"]),
  },
  watch: {
    $route: {
      handler(newVal) {
        this.activeTab = newVal.query.type || "";
        this.getNewsList();
      },
      immediate: true,
    },
  },
  mounted() {
    this.getNewsList();
    this.getHotNews();
    this.getLatestNews();
  },
  methods: {
    switchTab(tab) {
    
      this.activeTab = tab;
      this.currentPage = 1;
      this.getNewsList();
   
    },
    async getNewsList() {
      try {
        const res = await this.$api({
          url: "getArticleList",
          method: "get",
          data: {
            page: this.currentPage,
            limit: this.pageSize,
            type_id: this.activeTab,
          },
        }).then((res) => {
          if (res.code === 200 && res.data && res.data.list) {
            this.articles = res.data.list;
            this.totalArticles = res.data.count || 0;
          }
        });
      } catch (error) {
        console.error("获取新闻列表失败:", error);
      }
    },
    async getHotNews() {
      try {
        // 这里可以调用实际的API获取热门新闻
        // const res = await this.$api({
        //   url: "hotNews",
        //   method: "get",
        // });
        // if (res.code === 200 && res.data) {
        //   this.hotNews = res.data;
        // }

        // 临时使用模拟数据
        this.hotNews = [
          { id: 1, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 2, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 3, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 4, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 5, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 6, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 7, title: "仁寿县关于进一步支持科技创新的若干政策" },
        ];
      } catch (error) {
        console.error("获取热门新闻失败:", error);
      }
    },
    async getLatestNews() {
      try {
        // 这里可以调用实际的API获取最新新闻
        // const res = await this.$api({
        //   url: "latestNews",
        //   method: "get",
        // });
        // if (res.code === 200 && res.data) {
        //   this.latestNews = res.data;
        // }

        // 临时使用模拟数据
        this.latestNews = [
          { id: 1, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 2, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 3, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 4, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 5, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 6, title: "仁寿县关于进一步支持科技创新的若干政策" },
          { id: 7, title: "仁寿县关于进一步支持科技创新的若干政策" },
        ];
      } catch (error) {
        console.error("获取最新新闻失败:", error);
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.getNewsList();
    },
    handleArticleClick(article) {
      // 跳转到新闻详情页
      this.$router.push(`/newsDetail?id=${article.id}`);
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./news.less";
</style>
<style lang="less" scoped src="./style/h5-news.less"></style>

