<template>
  <div class="researchReport">
    <top-search
      title="专注XR产业独立研究机构"
      :onClick="onBtnClick"
    ></top-search>
    <div class="researchReportBottom">
      <div class="bottomContent">
        <report-filter></report-filter>
        <report-list-and-popular-reports></report-list-and-popular-reports>
      </div>
    </div>
  </div>
</template>
<script>

import topSearch from '@/components/ellsennComponents/components/topSearch.vue';
import reportFilter from '@/components/ellsennComponents/researchReport/reportFilter/index.vue';
import reportListAndPopularReports from '@/components/ellsennComponents/researchReport/reportListAndPopularReports/index.vue';
export default {
  components: {
    topSearch,
    reportFilter,
    reportListAndPopularReports
  },
  props: {},
  name: 'researchReport',
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    onBtnClick(i) {
      console.log(i, 'onBtnClick');
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
