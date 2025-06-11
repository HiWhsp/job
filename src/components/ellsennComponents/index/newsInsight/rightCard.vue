<template>
  <div class="rightCard" @click="goToReportDetail(data)">
    <div class="rightCardTitle">{{ data.title }}</div>
    <div class="item-info">
      <span class="item-time">{{ data.created_time }}</span>
      <span class="item-status" v-for="(item, index) in data.tab" :key="index">{{
        item
      }}</span>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: ["data"],
  name: "rightCard",
  data() {
    return {};
  },
  methods: {
    goToReportDetail(item) {
      this.$router.push({
        path: "/newsInsightsDetail",
        query: {
          id: item.id,
        },
      });
    },
  },
};
</script>
<style scoped lang="less" src="./rightCard.less"></style>
