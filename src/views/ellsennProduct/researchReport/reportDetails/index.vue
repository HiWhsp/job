<template>
  <div class="reportDetails">
    <div class="top">
      <div class="topContent">
        <page_breadcrumb :option="nav_option" />
        <report-info :data="reportInfo.report" :contacts="reportInfo.contacts" />
      </div>
    </div>
    <div class="bottom">
      <div class="bottomLayout">
        <div class="bottomLeft">
          <tab-card :data="reportInfo.report" />
          <div>
            <make-comment
              :id="reportInfo.report ? reportInfo.report.id : ''"
              :type="1"
            ></make-comment>
          </div>
        </div>
        <div class="bottomRight">
          <div class="bottomRightPurchaseOrDownloadReport">
            <purchaseOrDownloadReport :data="reportInfo"></purchaseOrDownloadReport>
          </div>
          <div>
            <recommend :data="reportInfo.related_recommendations"></recommend>
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
      reportId: "",
      reportInfo: {},
    };
  },
  computed: {
    nav_option() {
      let option = [
        {
          route: "/researchReport",
          title: "研究报告",
          title2: "researchReport",
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
    this.reportId = this.$route.query.id;
    this.getReportInfo();
  },
  methods: {
    getReportInfo() {
      this.$api({
        url: "getReportDetail",
        method: "get",
        data: {
          id: this.reportId,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.reportInfo = res.data;
        }
      });
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
