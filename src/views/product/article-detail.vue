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

        <div class="article-body" v-html="articleContent"></div>
      </div>

      <!-- 右侧通知公告 -->
      <div class="notice-sidebar">
        <div class="notice-header">
          <h3><img src="@/assets/image/icon/good.png" alt="" /> Notices & Announcements</h3>
        </div>
        <div class="notice-list">
          <div
            class="notice-item ellipsis-1"
            v-for="notice in vuex_config.newsList || []"
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
      articleTitle: "",
      author: "Jiangyin Lian'an",
      publishDate: "",
      articleContent: "",
      noticeList: [],
    };
  },
  watch: {
    $route: {
      handler(newVal) {
        if (newVal.query.id) {
          this.noticeList.forEach((item) => {
            if (item.id == newVal.query.id) {
              this.articleTitle = item.title;
              this.publishDate = item.created_at;
              this.articleContent = item.content;
            }
          });
        }
      },
    },
  },
  mounted() {
    this.loadArticleDetail();
  },
  methods: {
    loadArticleDetail() {
      // Get article ID from route parameters
      const articleId = this.$route.query.id;
      this.$api({
        url: "index",
        method: "get",
      }).then((res) => {
        if (res.code === 200) {
          this.noticeList = res.data.newsList;
          if (articleId) {
            this.noticeList.forEach((item) => {
              if (item.id == articleId) {
                this.articleTitle = item.title;
                this.publishDate = item.created_at;
                this.articleContent = item.content;
              }
            });
          } else {
            this.articleTitle = this.noticeList[0].title;
            this.publishDate = this.noticeList[0].created_at;
            this.articleContent = this.noticeList[0].content;
          }
        }
      });
    },
    goToNotice(noticeId) {
      // Navigate to notice detail page
      this.$router.push(`/article-detail?id=${noticeId}`);
    },
  },
};
</script>

<style lang="less" scoped src="./article-detail.less"></style>
