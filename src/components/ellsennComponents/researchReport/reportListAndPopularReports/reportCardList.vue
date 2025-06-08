<template>
  <div class="reportList">
    <div class="reportListTitle">
      共找到 <span>{{ list.length }}</span> 个报告
    </div>
    <report-card v-for="item in list" :data="item" :key="item.id"></report-card>
  </div>
</template>
<script>
import reportCard from "@/components/ellsennComponents/components/reportCard.vue";
export default {
  components: {
    reportCard,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  name: "reportList",
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./reportCardList.less"></style>
