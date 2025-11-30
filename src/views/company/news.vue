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
              :class="{ active: activeTab === 'all' }"
              @click="switchTab('all')"
            >
              全部
            </div>
            <div
              class="tab-item"
              :class="{ active: activeTab === 'company' }"
              @click="switchTab('company')"
            >
              公司新闻
            </div>
            <div
              class="tab-item"
              :class="{ active: activeTab === 'industry' }"
              @click="switchTab('industry')"
            >
              行业动态
            </div>
          </div>

          <!-- 文章列表 -->
          <div class="article-list">
            <div
              class="article-item"
              v-for="(article, index) in filteredArticles"
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
              v-if="filteredArticles.length === 0"
              description="暂无新闻数据"
            ></el-empty>
          </div>

          <!-- 分页 -->
          <div class="pagination-section" v-if="filteredArticles.length > 0">
            <el-pagination
              :total="totalArticles"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="handlePageChange"
              layout="prev, pager, next"
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
export default {
  name: "News",
  data() {
    return {
      currentCategory: "1",
      activeTab: "all",
      currentPage: 1,
      pageSize: 10,
      totalArticles: 0,
      articles: [],
      hotNews: [],
      latestNews: [],
    };
  },
  computed: {
    filteredArticles() {
      let filtered = this.articles;

      if (this.activeTab === "company") {
        filtered = filtered.filter((item) => item.category === "公司新闻");
      } else if (this.activeTab === "industry") {
        filtered = filtered.filter((item) => item.category === "行业动态");
      }

      // 分页
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return filtered.slice(start, end);
    },
  },
  watch: {
    $route: {
      handler(newVal) {
        if(newVal.query.type) {
          if (newVal.query.type == "1") {
            this.activeTab = "company";
          } else if (newVal.query.type == "2") {
            this.activeTab = "industry";
          }
        } else {
          this.activeTab = "all";
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.initCategory();
    this.getNewsList();
    this.getHotNews();
    this.getLatestNews();
  },
  methods: {
    initCategory() {
      const category = this.$route.query.type;
      if (category == "1") {
        this.activeTab = "company";
      } else if (category == "2") {
        this.activeTab = "industry";
      } else {
        this.activeTab = "all";
      }
    },
    switchTab(tab) {
      this.activeTab = tab;
      this.currentPage = 1;
      this.getNewsList();
    },
    async getNewsList() {
      try {
        // 这里可以调用实际的API获取新闻数据
        // const res = await this.$api({
        //   url: "newsList",
        //   method: "get",
        //   data: {
        //     page: this.currentPage,
        //     pageSize: this.pageSize,
        //     category: this.activeTab === 'all' ? '' : (this.activeTab === 'company' ? '公司新闻' : '行业动态'),
        //   },
        // });
        // if (res.code === 200 && res.data && res.data.list) {
        //   this.articles = res.data.list;
        //   this.totalArticles = res.data.total || 0;
        // }

        // 临时使用模拟数据
        this.articles = [
          {
            id: 1,
            title: "Windows Server 2012 在桌面上显示我的电脑",
            description:
              "四川响梵信息科技有限公司成立于2023年7月,注册资本100万元,本公司是一家致力于现代化企业体系服务的企业,主要对企业制度体系建设、科技创新、政策咨询、辅助完成知识产权积累、专项资金申报、会议展览、招投标采购、人力资源等内容进行服务。公司已辅助多家企业完成企业技术中心、工程中心...",
            date: "2025-11-20",
            category: "公司新闻",
          },
          {
            id: 2,
            title: "Windows Server 2012 在桌面上显示我的电脑",
            description:
              "四川响梵信息科技有限公司成立于2023年7月,注册资本100万元,本公司是一家致力于现代化企业体系服务的企业,主要对企业制度体系建设、科技创新、政策咨询、辅助完成知识产权积累、专项资金申报、会议展览、招投标采购、人力资源等内容进行服务。公司已辅助多家企业完成企业技术中心、工程中心...",
            date: "2025-11-20",
            category: "公司新闻",
          },
          {
            id: 3,
            title: "Windows Server 2012 在桌面上显示我的电脑",
            description:
              "四川响梵信息科技有限公司成立于2023年7月,注册资本100万元,本公司是一家致力于现代化企业体系服务的企业,主要对企业制度体系建设、科技创新、政策咨询、辅助完成知识产权积累、专项资金申报、会议展览、招投标采购、人力资源等内容进行服务。公司已辅助多家企业完成企业技术中心、工程中心...",
            date: "2025-11-20",
            category: "行业动态",
          },
          {
            id: 4,
            title: "Windows Server 2012 在桌面上显示我的电脑",
            description:
              "四川响梵信息科技有限公司成立于2023年7月,注册资本100万元,本公司是一家致力于现代化企业体系服务的企业,主要对企业制度体系建设、科技创新、政策咨询、辅助完成知识产权积累、专项资金申报、会议展览、招投标采购、人力资源等内容进行服务。公司已辅助多家企业完成企业技术中心、工程中心...",
            date: "2025-11-20",
            category: "公司新闻",
          },
          {
            id: 5,
            title: "Windows Server 2012 在桌面上显示我的电脑",
            description:
              "四川响梵信息科技有限公司成立于2023年7月,注册资本100万元,本公司是一家致力于现代化企业体系服务的企业,主要对企业制度体系建设、科技创新、政策咨询、辅助完成知识产权积累、专项资金申报、会议展览、招投标采购、人力资源等内容进行服务。公司已辅助多家企业完成企业技术中心、工程中心...",
            date: "2025-11-20",
            category: "行业动态",
          },
        ];
        this.totalArticles = this.articles.length;
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
