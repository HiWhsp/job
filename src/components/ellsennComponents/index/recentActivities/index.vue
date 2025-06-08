<template>
  <div class="recentActivities">
    <div class="recentActivitiesContent">
      <comp-title
        title="近期活动"
        :icon="require('@img/ellsenn/icon.png')"
        :url="'/industrialActivities'"
      ></comp-title>

      <div class="activeContent">
        <activity-card
          v-for="(item, index) in activityList"
          :key="index"
          :data="item"
        ></activity-card>
        <el-empty
          style="width: 1200px;"
          description="暂无数据"
          v-if="activityList.length === 0"
        ></el-empty>
      </div>
    </div>
  </div>
</template>
<script>
import compTitle from "../components/title/title.vue";
import activityCard from "./activityCard.vue";
export default {
  components: {
    compTitle,
    activityCard,
  },
  props: {},
  name: "recentActivities",
  data() {
    return {
      activityList: [],
    };
  },
  mounted() {
    this.getActivityList();
  },
  methods: {
    getActivityList() {
      this.$api({
        url: "getProductActivitiesList",
        method: "get",
        data: {
          page: 1,
          limit: 6,
          is_home: 1,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.activityList = res.data.list;
        }
      });
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
