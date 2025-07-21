<template>
  <div class="reportDetails">
    <div class="top">
      <div class="topContent">
        <page_breadcrumb :option="nav_option" />
      </div>
    </div>
    <div class="bottom">
      <div class="bottomLayout">
        <div class="bottomLeft">
          <div class="bottomLeftTitle">
            <div class="bottomLeftTitleText">
              {{ data.data ? data.data.title : "" }}
            </div>
            <div class="bottomLeftTitleAuthor">
              <div class="bottomLeftTitleAuthorLeft">
                <div class="bottomLeftTitleAuthorItem">
                  {{ data.data ? data.data.author : "" }}
                </div>
                <div class="bottomLeftTitleAuthorItem">
                  {{ data.data ? data.data.created_at : "" }}
                </div>
                <div class="bottomLeftTitleAuthorItem">
                  <div
                    class="bottomLeftTitleAuthorItemIcon"
                    v-for="item in data.data ? data.data.tag : []"
                    :key="item"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>

              <div class="bottomLeftTitleAuthorBottom">
                <div class="collect" @click="handleCollect">
                  <img
                    src="@/assets/img/ellsenn/share/collect.png"
                    alt=""
                    v-if="data.data ? data.data.isCollection == 0 : false"
                  />
                  <img
                    src="@/assets/img/ellsenn/share/collect-active.png"
                    alt=""
                    v-else
                  />
                  收藏
                </div>
                <div class="share">
                  分享：
                  <div class="shareIcon">
                    <div class="shareIconItem" @click="handleShare('link')">
                      <img src="@/assets/img/ellsenn/share/link.png" alt="" />
                    </div>
                    <div class="shareIconItem" @click="handleShare('wechat')">
                      <img src="@/assets/img/ellsenn/share/wechat.png" alt="" />
                    </div>
                    <div class="shareIconItem" @click="handleShare('weibo')">
                      <img src="@/assets/img/ellsenn/share/weibo.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bottomLeftContent">
            <div class="VueMarkdown" v-html="data.data ? data.data.content : ''"></div>
          </div>
          <div class="bottomLeftNextReport">
            <div class="bottomLeftNextReportItem top-left">
              <div class="bottomNextReportItem" v-if="data.next && data.next.id">
                <img :src="data.next.thumb" alt="" />
                <div class="bottomLeftNextReportItemTitle">
                  <h2 class="ellipsis-2">{{ data.next.title }}</h2>
                  <div class="bottomLeftNextReportItemTime">
                    {{ data.next.created_at }}
                  </div>
                </div>
              </div>

              <div class="btn" @click="handleNext" v-if="data.next && data.next.id">
                <i class="el-icon-back"></i>
                <span>上一篇</span>
              </div>
              <el-empty description="暂无更多" v-else></el-empty>
            </div>
            <div class="bottomLeftNextReportItem bottom-right">
              <div class="bottomNextReportItem" v-if="data.previous && data.previous.id">
                <img :src="data.previous.thumb" alt="" />
                <div class="bottomLeftNextReportItemTitle">
                  <h2 class="ellipsis-2">{{ data.previous.title }}</h2>
                  <div class="bottomLeftNextReportItemTime">
                    {{ data.previous.created_at }}
                  </div>
                </div>
              </div>
              <div
                class="btn"
                @click="handlePrevious"
                v-if="data.previous && data.previous.id"
              >
                <span>下一篇</span>
                <i class="el-icon-right"></i>
              </div>
              <el-empty description="暂无更多" v-else></el-empty>
            </div>
          </div>
          <div class="bottomLeftMakeComment">
            <make-comment :id="id" :type="2"></make-comment>
          </div>
        </div>
        <div class="bottomRight">
          <div>
            <recommend :list="data.data ? data.related : []"></recommend>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import makeComment from "@/components/ellsennComponents/components/makeComment/index.vue";
import page_breadcrumb from "@/components/page/page-breadcrumb.vue";
import purchaseOrDownloadReport from "./purchaseOrDownloadReport.vue";
import recommend from "./recommend.vue";
import reportInfo from "./reportInfo.vue";
import tabCard from "./tabCard.vue";
export default {
  components: {
    page_breadcrumb,
    reportInfo,
    tabCard,
    makeComment,
    purchaseOrDownloadReport,
    recommend,
  },
  props: {},
  name: "reportDetails",
  data() {
    return {
      id: "",
      data: {},
    };
  },
  computed: {
    nav_option() {
      let option = [
        {
          route: "/newsInsights",
          title: "新闻洞察",
          title2: "newsInsights",
        },
        {
          route: "",
          title: this.$route.meta.title,
          title: this.$route.meta.title,
        },
      ];
      return option;
    },
  },
  watch: {
    $route: {
      handler() {
        this.id = this.$route.query.id;
        this.getData();
      },
      immediate: true,
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getData();
  },
  methods: {
    getData() {
      this.$api({
        url: "getArticle",
        method: "get",
        data: {
          id: this.id,
        },
      }).then((res) => {
        this.data = res.data;
      });
    },
    handleCollect() {
      this.$api({
        url: "addCollect",
        method: "post",
        data: {
          p_id: this.id,
          type: 2,
          status: this.data.data.isCollection == 0 ? 1 : 0,
        },
      }).then((res) => {
        this.getData();
      });
    },
    handleNext() {
      this.$router.push({
        path: "/newsInsightsDetail",
        query: { id: this.data.next.id },
      });
    },
    handlePrevious() {
      this.$router.push({
        path: "/newsInsightsDetail",
        query: { id: this.data.previous.id },
      });
    },
    handleShare(type) {
      if (type == "link") {
        // 复制链接
        navigator.clipboard.writeText(window.location.href);
        this.$message.success("复制成功");
      } else if (type == "wechat") {
        // 微信分享
        navigator.clipboard.writeText(window.location.href);
        this.$message.success("复制成功");
      } else if (type == "weibo") {
        // 微博分享
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(this.data.data ? this.data.data.title : "");
        window.open(
          `https://service.weibo.com/share/share.php?url=${url}&title=${title}`,
          "_blank"
        );
      }
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
