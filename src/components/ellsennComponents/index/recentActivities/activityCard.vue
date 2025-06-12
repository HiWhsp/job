<template>
  <div class="activityCard" @click="handleActivityClick">
    <div>
      <img class="topImg" :src="data.thumb" alt="" />
    </div>
    <div class="cardContent">
      <div class="activeTitle">{{ data.title }}</div>
      <div class="activeTime">
        <img class="activeIcon" src="@img/ellsenn/time.png" alt="" />
        <div>活动时间：{{ data.start_time }}至{{ data.end_time }}</div>
      </div>
      <div class="activeLocation">
        <img class="activeIcon" src="@img/ellsenn/location.png" alt="" />
        <div class="activeLocationText">
          活动地点：{{ data.location }}
          <img src="@/assets/home/icon1.png" alt="" />
        </div>
      </div>
    </div>
    <div class="status">{{ statusText }}</div>
  </div>
</template>
<script>
export default {
  components: {},
  props: ["data"],
  name: "activityCard",
  data() {
    return {};
  },
  computed: {
    // 根据start_time-end_time 判断活动状态 进行中 结束 未开始
    statusText() {
      const now = new Date();
      const startTime = new Date(this.data.start_time);
      const endTime = new Date(this.data.end_time);
      if (now >= startTime && now <= endTime) {
        return "进行中";
      } else if (now > endTime) {
        return "已结束";
      } else {
        return "未开始";
      }
    },
  },
  mounted() {},
  methods: {
    handleActivityClick() {
      this.$router.push({
        path: "/industrialActivitiesDetail",
        query: { id: this.data.id },
      });
    },
  },
};
</script>
<style scoped lang="less" src="./activityCard.less"></style>
