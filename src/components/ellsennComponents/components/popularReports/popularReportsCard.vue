<template>
  <div class="layout">
    <div class="title">{{ data.title }}</div>
    <div class="info">{{ data.info }}</div>
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
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./popularReportsCard.less"></style>
