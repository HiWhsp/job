<template>
  <div class="industrialActivities">
    <top-search title="行业峰会 为行业聚能" :onClick="onBtnClick"></top-search>
    <div class="industrialActivitiesBottom">
      <div class="bottomContent">
        <report-filter></report-filter>
        <div class="activeContent">
          <activity-card
            v-for="(item, index) in activityList"
            :data="item"
            :key="index"
          ></activity-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import topSearch from "@/components/ellsennComponents/components/topSearch.vue";
import activityCard from "@/components/ellsennComponents/index/recentActivities/activityCard.vue";
import reportFilter from "@/components/ellsennComponents/researchReport/reportFilter/index.vue";
export default {
  components: {
    topSearch,
    reportFilter,
    activityCard,
  },
  props: {},
  name: "industrialActivities",
  data() {
    return {
      activityList: [
        {
          url: require("@img/ellsenn/i.png"),
          title: "2025年全球AI/AR智能眼镜智能制造高峰论坛",
          location: "北京XXXX万豪酒店",
          time: "2025-01-01 至 2025-04-03",
        },
        {
          url: require("@img/ellsenn/i.png"),
          title: "2025年全球AI/AR智能眼镜智能制造高峰论坛",
          location: "北京XXXX万豪酒店",
          time: "2025-01-01 至 2025-04-03",
        },
        {
          url: require("@img/ellsenn/i.png"),
          title: "2025年全球AI/AR智能眼镜智能制造高峰论坛",
          location: "北京XXXX万豪酒店",
          time: "2025-01-01 至 2025-04-03",
        },
        {
          url: require("@img/ellsenn/i.png"),
          title: "2025年全球AI/AR智能眼镜智能制造高峰论坛",
          location: "北京XXXX万豪酒店",
          time: "2025-01-01 至 2025-04-03",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    onBtnClick() {
      console.log("onBtnClick");
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
