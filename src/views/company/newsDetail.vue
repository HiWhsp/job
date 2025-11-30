<template>
  <div class="news-detail-page">
    <div class="w-1600">
      <!-- 面包屑导航 -->
      <div class="breadcrumb-section">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-item">首页</router-link>
          <i class="el-icon-arrow-right breadcrumb-separator"></i>
          <router-link to="/news" class="breadcrumb-item">新闻资讯</router-link>
          <i class="el-icon-arrow-right breadcrumb-separator"></i>
          <span class="breadcrumb-item current">{{ news.category || "公司新闻" }}</span>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="news-content">
        <!-- 左侧主内容 -->
        <div class="news-main">
          <!-- 标题 -->
          <h1 class="news-title">{{ news.title || "Windows Server 2012 在桌面上显示我的电脑" }}</h1>
          
          <!-- 元信息 -->
          <div class="news-meta">
            <span class="meta-item">发布时间: {{ formatDate(news.created_at || news.date) || "2022-10-10" }}</span>
            <span class="meta-item">来源: {{ news.source || "确" }}</span>
          </div>
          
          <!-- 分隔线 -->
          <div class="divider"></div>
          
          <!-- 内容 -->
          <div class="news-content-text" v-html="news.content || news.description || defaultContent"></div>
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
  name: "NewsDetail",
  data() {
    return {
      news: {},
      hotNews: [],
      latestNews: [],
      defaultContent: "这里是新闻内容...",
    };
  },
  mounted() {
    this.getNewsDetail();
    this.getHotNews();
    this.getLatestNews();
  },
  methods: {
    // 获取新闻详情
    async getNewsDetail() {
      try {
        const newsId = this.$route.query.id;
        if (newsId) {
          // 这里可以调用实际的API获取新闻详情
          // const res = await this.$api({
          //   url: "newsDetail",
          //   method: "get",
          //   data: {
          //     id: newsId,
          //   },
          // });
          // if (res.code === 200 && res.data) {
          //   this.news = res.data;
          // }

          // 临时使用模拟数据
          this.news = {
            id: newsId,
            title: "Windows Server 2012 在桌面上显示我的电脑",
            content: "这里是新闻的详细内容...",
            date: "2022-10-10",
            created_at: "2022-10-10",
            category: "公司新闻",
            source: "确",
          };
        }
      } catch (error) {
        console.error("获取新闻详情失败:", error);
      }
    },
    // 获取热门新闻
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
    // 获取最新新闻
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
    // 点击文章
    handleArticleClick(article) {
      this.$router.push(`/newsDetail?id=${article.id}`);
    },
    // 格式化日期
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
@import "./newsDetail.less";
</style>
