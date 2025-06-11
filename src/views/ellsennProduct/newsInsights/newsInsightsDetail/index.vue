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
                    <div class="shareIconItem">
                      <img src="@/assets/img/ellsenn/share/link.png" alt="" />
                    </div>
                    <div class="shareIconItem">
                      <img src="@/assets/img/ellsenn/share/wechat.png" alt="" />
                    </div>
                    <div class="shareIconItem">
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
            <div
              class="bottomLeftNextReportItem top-left"
              v-if="data.data && data.data.next"
            >
              <img :src="data.data.next.thumb" alt="" />
              <div class="bottomLeftNextReportItemTitle">
                <h2>{{ data.data.next.title }}</h2>
                <div class="bottomLeftNextReportItemTime">
                  {{ data.data.next.created_at }}
                </div>
              </div>
              <div class="btn">
                <i class="el-icon-back"></i>
                <span>上一篇</span>
              </div>
            </div>
            <div
              class="bottomLeftNextReportItem bottom-right"
              v-if="data.data && data.data.previous"
            >
              <img :src="data.data.previous.thumb" alt="" />
              <div class="bottomLeftNextReportItemTitle">
                <h2>{{ data.data.previous.title }}</h2>
                <div class="bottomLeftNextReportItemTime">
                  {{ data.data.previous.created_at }}
                </div>
              </div>
              <div class="btn">
                <span>下一篇</span>
                <i class="el-icon-right"></i>
              </div>
            </div>
          </div>
          <div class="bottomLeftMakeComment">
            <make-comment :id="id" :type="2"></make-comment>
          </div>
        </div>
        <div class="bottomRight">
          <div>
            <recommend :list="data.data ? data.data.recommend : []"></recommend>
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
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
