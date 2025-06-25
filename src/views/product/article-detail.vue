<template>
  <div class="article-detail-container">
    <div class="content-wrapper">
      <!-- 左侧文章详情 -->
      <div class="article-content">
        <div class="article-header">
          <h1 class="article-title">{{ articleTitle }}</h1>
          <div class="article-meta">
            <span class="author">{{ author }}</span>
            <span class="date">{{ publishDate }}</span>
          </div>
        </div>

        <div class="article-body"></div>
      </div>

      <!-- 右侧通知公告 -->
      <div class="notice-sidebar">
        <div class="notice-header">
          <h3><img src="@/assets/image/icon/good.png" alt="" /> 通知公告</h3>
        </div>
        <div class="notice-list">
          <div
            class="notice-item"
            v-for="notice in noticeList"
            :key="notice.id"
            @click="goToNotice(notice.id)"
          >
            {{ notice.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticleDetail",
  data() {
    return {
      articleTitle:
        "通知公告名称，通知公告名称，通知公告名称，通知公告名称，通知公告名称。",
      author: "江阴联安",
      publishDate: "2025-02-21 19:27",
      articleSummary: "图文详情展示，图文详情展示，图文详情展示",
      articleContent:
        "2月20日晚间，阿里巴巴发布最新一季财报，其中，B2B跨境电商业务的国际商品GMV同比增长18%，近7年GMV累积增长25倍。在当晚的财报分析师会议上，相关负责人表示将继续强化，未来几年B2B的结构性机会。",
      articleImage: "/src/assets/img/common/article-image.jpg", // 示例图片路径
      noticeList: [
        { id: 1, title: "通知公告标题文案内容限制的内容..." },
        { id: 2, title: "通知公告标题文案内容限制的内容..." },
        { id: 3, title: "通知公告标题文案内容限制的内容..." },
        { id: 4, title: "通知公告标题文案内容限制的内容..." },
        { id: 5, title: "通知公告标题文案内容限制的内容..." },
        { id: 6, title: "通知公告标题文案内容限制的内容..." },
        { id: 7, title: "通知公告标题文案内容限制的内容..." },
        { id: 8, title: "通知公告标题文案内容限制的内容..." },
      ],
    };
  },
  mounted() {
    this.loadArticleDetail();
  },
  methods: {
    loadArticleDetail() {
      // 从路由参数获取文章ID
      const articleId = this.$route.params.id;
      // 这里可以调用API获取文章详情
      console.log("加载文章详情:", articleId);
    },
    goToNotice(noticeId) {
      // 跳转到通知详情页
      this.$router.push(`/notice/${noticeId}`);
    },
  },
};
</script>

<style lang="less" scoped src="./article-detail.less"></style>
