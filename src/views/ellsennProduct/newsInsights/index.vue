<template>
  <div class="newsInsights">
    <top-search title="独家VR/AR/MR新闻" :onClick="onBtnClick"></top-search>
    <div class="container">
      <div class="layout">
        <div>
          <reportCardList></reportCardList>
        </div>
        <div>
          <popularReports title="热门新闻"></popularReports>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import popularReports from '@/components/ellsennComponents/components/popularReports/popularReports.vue';
import reportCardList from '@/components/ellsennComponents/components/reportCardList';
import topSearch from '@/components/ellsennComponents/components/topSearch.vue';
export default {
  components: {
    topSearch,
    reportCardList,
    popularReports
  },
  props: {},
  name: 'newsInsights',
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
