<template>
  <div class="layout">
    <div class="layout-left">
      <card>
        <report-card-list :list="reportList"></report-card-list>
      </card>
    </div>
    <div class="layout-right">
      <popularReports :list="popularReportsList"></popularReports>
    </div>
  </div>
</template>
<script>
import card from "@/components/ellsennComponents/components/card.vue";
import popularReports from "@/components/ellsennComponents/components/popularReports/popularReports.vue";
import reportCardList from "./reportCardList.vue";
export default {
  components: {
    card,
    popularReports,
    reportCardList,
  },
  props: {
    reportList: {
      type: Array,
      default: () => [],
    },
    popularReportsList: {
      type: Array,
      default: () => [],
    },
  },
  name: "reportListAndPopularReports",
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./index.less"></style>
