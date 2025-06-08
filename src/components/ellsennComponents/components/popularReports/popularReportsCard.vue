<template>
  <div class="layout">
    <div class="title">{{ data.title }}</div>
    <div class="info">{{ data.release_time || data.created_time }} {{ data.author }} {{ data.category_name }}</div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({
        title: '2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告',
        info: '2025-04-22 梁昊 世界互联网大会',
      }),
    },
  },
  name: 'popularReportsCard',
  data() {
    return {};
  },
  mounted() {
    console.log(this.data, 'this.data');
  },
};
</script>
<style scoped lang="less" src="./popularReportsCard.less"></style>
