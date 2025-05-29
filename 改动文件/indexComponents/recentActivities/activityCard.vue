<template>
  <div class="activityCard">
    <div>
      <img  class="topImg" :src="data.url" alt="" />
    </div>
    <div class="cardContent">
      <div class="activeTitle">{{ data.title }}</div>
      <div class="activeTime">
        <img class='activeIcon' src="~@img/time.png" alt="" />
        <div>活动时间：{{ data.time }}</div>
      </div>
      <div class="activeLocation">
        <img class='activeIcon' src="~@img/location.png" alt="" />
        <div>活动地点：{{ data.location }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: ['data'],
  name: 'activityCard',
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./activityCard.less"></style>
