<template>
  <div class="industrialActivities">
    <top-search title="行业峰会 为行业聚能" :onClick="onBtnClick"></top-search>
    <div class="industrialActivitiesBottom">
      <div class="bottomContent">
        <!-- 活动介绍部分 -->

        <!-- 活动嘉宾部分 -->
        <activity-guests :guests="activityGuests"></activity-guests>

        <!-- 活动议程部分 -->
      </div>
    </div>
  </div>
</template>
<script>
import activityGuests from "@/components/ellsennComponents/components/activityGuests.vue";

export default {
  components: {
    activityGuests,
  },
  props: {},
  name: "industrialActivities",
  data() {
    return {
      // 活动详情数据
      activityDetails: {},

      // 活动嘉宾数据
      activityGuests: [],

      // 活动议程数据
      activityAgenda: [],
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
