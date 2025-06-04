<template>
  <div class="reportDetails">
    <div class="top">
      <div class="topContent">
        <page_breadcrumb :option="nav_option" />
        <!-- <report-info /> -->
      </div>
    </div>
    <div class="bottom">
      <div class="bottomLayout">
        <div class="bottomLeft">
          <div class="bottomLeftTitle">
            <div class="bottomLeftTitleText">
              2025年全球及中国蛋白检测行业规模现状及未来展望（附市场规模、细分结构及重点企业）「图」
            </div>
            <div class="bottomLeftTitleAuthor">
              <div class="bottomLeftTitleAuthorItem">作者用户名</div>
              <div class="bottomLeftTitleAuthorItem">2025-06-04 10:00:00</div>
              <div class="bottomLeftTitleAuthorItem">
                <div class="bottomLeftTitleAuthorItemIcon">拆解</div>
                <div class="bottomLeftTitleAuthorItemIcon">VR</div>
                <div class="bottomLeftTitleAuthorItemIcon">快讯</div>
              </div>
              <div class="bottomLeftTitleAuthorBottom">
                <div class="collect">收藏</div>
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
          <div class="bottomLeftMakeComment">
            <make-comment></make-comment>
          </div>
        </div>
        <div class="bottomRight">
          <div>
            <recommend> </recommend>
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
    return {};
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
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./index.less"></style>
