<template>
  <div class="reportDetails">
    <div class="top">
      <div class="topContent">
        <page_breadcrumb :option="nav_option" />
        <report-info />
      </div>
    </div>
    <div class="bottom">
      <div class="bottomLayout">
        <div class="bottomLeft">
          <tab-card />
          <div>
            <make-comment></make-comment>
          </div>
        </div>
        <div class="bottomRight">
          <div class="bottomRightPurchaseOrDownloadReport">
            <purchaseOrDownloadReport></purchaseOrDownloadReport>
          </div>
          <div>
            <recommend> </recommend>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import makeComment from '@/components/ellsennComponents/components/makeComment/index.vue';
import page_breadcrumb from '@/components/page/page-breadcrumb.vue';
import purchaseOrDownloadReport from './purchaseOrDownloadReport.vue';
import recommend from './recommend.vue';
import reportInfo from './reportInfo.vue';
import tabCard from './tabCard.vue';
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
  name: 'reportDetails',
  data() {
    return {};
  },
  computed: {
    nav_option() {
      let option = [
        {
          route: '/researchReport',
          title: '研究报告',
          title2: 'researchReport',
        },
        {
          route: '',
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
