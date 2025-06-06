<template>
  <div class="company-news">
    <div class="content">
      <h2>公司新闻</h2>
      <div class="news-list">
        <!-- 主要新闻 -->
        <div class="main-news">
          <div class="news-image">
            <img
              src="@/assets/img/ellsenn/i.png"
              alt="2025年中国数据中心管理软件行业发展现状及未来趋势"
            />
          </div>
          <div class="news-content">
            <h3 class="ellipsis-1">
              2025年中国数据中心管理软件行业发展现状及现状及现状及
            </h3>
            <p class="news-summary ellipsis-3">
              随着云计算、大数据、人工智能等新兴技术的快速发速发速发速发展，数据中心作为数字经济的重要基础设施，其管理软件市场也迎来了前所未有的发展机遇。本文将深入分析2025年中国数据中心管理软件行业的发展现状及未来趋势。
            </p>
          </div>
        </div>

        <!-- 侧边新闻列表 -->
        <div class="side-news">
          <div class="news-item">
            <div class="news-info">
              <h4>2025年中国数据中心管理软件行业发展现状及未来趋势</h4>
              <span class="news-date">2025-05-08</span>
            </div>
            <div class="news-thumb">
              <img src="@/assets/img/ellsenn/i.png" alt="新闻图片" />
            </div>
          </div>

          <div class="news-item">
            <div class="news-info">
              <h4>新闻标题名称新闻标题名称新闻标题名称新闻标题名称新闻标题名称</h4>
              <span class="news-date">2025-05-08</span>
            </div>
            <div class="news-thumb">
              <img src="@/assets/img/ellsenn/i.png" alt="新闻图片" />
            </div>
          </div>

          <div class="news-item">
            <div class="news-info">
              <h4>新闻标题名称新闻标题名称新闻标题名称新闻标题名称新闻标题名称</h4>
              <span class="news-date">2025-05-08</span>
            </div>
            <div class="news-thumb">
              <img src="@/assets/img/ellsenn/i.png" alt="新闻图片" />
            </div>
          </div>
        </div>
      </div>
      <div class="news-list-wrap">
        <div class="news-item">
          <div class="news-thumb">
            <img src="@/assets/img/ellsenn/i.png" alt="新闻图片" />
          </div>
          <div class="news-info">
            <h4>2025年中国数据中心管理软件行业发展现状及未来趋势</h4>
            <p class="news-summary ellipsis-3">
              随着云计算、大数据、人工智能等新兴技术的快速发展，数据中心作为数字经济的重要基础设施，其管理软件市场也迎来了前所未有的发展机遇。
            </p>
            <span class="news-date">2025-05-08</span>
          </div>
        </div>
        <div class="news-item">
          <div class="news-thumb">
            <img src="@/assets/img/ellsenn/i.png" alt="新闻图片" />
          </div>
          <div class="news-info">
            <h4>2025年中国数据中心管理软件行业发展现状及未来趋势</h4>
            <p class="news-summary ellipsis-3">
              随着云计算、大数据、人工智能等新兴技术的快速发展，数据中心作为数字经济的重要基础设施，其管理软件市场也迎来了前所未有的发展机遇。
            </p>
            <span class="news-date">2025-05-08</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyNews",
  data() {
    return {
      newsList: [
        {
          id: 1,
          title: "2025年中国数据中心管理软件行业发展现状及未来趋势",
          date: "2025-05-08",
          summary:
            "随着云计算、大数据、人工智能等新兴技术的快速发展，数据中心作为数字经济的重要基础设施，其管理软件市场也迎来了前所未有的发展机遇。",
          image: "/images/news/main-news.jpg",
          isMain: true,
        },
        {
          id: 2,
          title: "新闻标题名称新闻标题名称新闻标题名称新闻标题名称新闻标题名称",
          date: "2025-05-08",
          image: "/images/news/news-1.jpg",
        },
        {
          id: 3,
          title: "新闻标题名称新闻标题名称新闻标题名称新闻标题名称新闻标题名称",
          date: "2025-05-08",
          image: "/images/news/news-2.jpg",
        },
        {
          id: 4,
          title: "新闻标题名称新闻标题名称新闻标题名称新闻标题名称新闻标题名称",
          date: "2025-05-08",
          image: "/images/news/news-3.jpg",
        },
        {
          id: 5,
          title: "新闻标题名称新闻标题名称新闻标题名称新闻标题名称新闻标题名称",
          date: "2025-05-23",
          image: "/images/news/news-4.jpg",
        },
      ],
    };
  },
  methods: {
    handleNewsClick(news) {
      // 处理新闻点击事件
      console.log("点击新闻:", news.title);
    },
  },
};
</script>

<style scoped lang="less" src="./CompanyNews.less"></style>
