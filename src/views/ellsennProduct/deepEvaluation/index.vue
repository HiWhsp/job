<template>
  <div class="deepEvaluation">
    <top-search title="独家VR/AR/MR新闻" :onClick="onBtnClick"></top-search>
    <div class="container">
      <div class="layout">
        <div>
          <reportCardList></reportCardList>
        </div>
        <div>
          <popularReports title="热门推荐"></popularReports>
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
  props:{},
  name:'deepEvaluation',
  data() {
    return {

    };
  },
  created() {

  },
  mounted() {

  },
}
</script>
<style scoped lang='scss'>

</style>