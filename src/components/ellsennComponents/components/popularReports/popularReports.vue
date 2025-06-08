<template>
  <div class="popularReports">
    <card>
      <div class="title">
        <img class="titleImg" src="@img/ellsenn/slash.png" alt="" />
        {{ title }}
      </div>
      <div class="content">
        <popular-reports-card
          v-for="(item, index) in list"
          :data="item"
          :key="index"
        ></popular-reports-card>
        <el-empty v-if="list.length === 0" description="暂无数据"></el-empty>
      </div>
    </card>
  </div>
</template>
<script>
import card from "@/components/ellsennComponents/components/card.vue";
import popularReportsCard from "@/components/ellsennComponents/components/popularReports/popularReportsCard.vue";
export default {
  components: {
    card,
    popularReportsCard,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "热门报告",
    },
  },
  name: "popularReports",
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./popularReports.less"></style>
