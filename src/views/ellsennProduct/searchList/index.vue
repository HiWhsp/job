<template>
  <div class="researchReport">
    <div class="researchReportBottom">
      <div class="bottomContent">
        <report-list-and-popular-reports></report-list-and-popular-reports>
      </div>
    </div>
  </div>
</template>
<script>

import reportListAndPopularReports from './reportListAndPopularReports/index.vue';
export default {
  components: {
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
<style lang="less" scoped>
.bottomContent {
  margin-top: 34px;
}
</style>
<style scoped lang="less" src="./index.less"></style>
