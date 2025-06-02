<template>
  <div class="layout">
    <div class="layout-left">
      <card>
        <report-card-list></report-card-list>
      </card>
    </div>
    <div class="layout-right">
      <popularReports></popularReports>
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
  props: {},
  name: "reportListAndPopularReports",
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./index.less"></style>
