<template>
  <div class="rightCard">
    <div class="rightCardTitle">{{data.title}}</div>
    <div class="item-info">
      <span class="item-time">{{ data.time }}</span>
      <span class="item-status">{{ statusEnum[data.status] }}</span>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: ['data'],
  name: 'rightCard',
  data() {
    return {
      statusEnum: { 0: '消费品', 1: '消费品', 2: '新闻' },
    };
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./rightCard.less"></style>
