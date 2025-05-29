<template>
  <div class="reportList">
    <report-card v-for="item in list" :data="item"></report-card>
  </div>
</template>
<script>
import reportCard from '@/components/ellsennComponents/components/reportCard.vue';
export default {
  components: {
    reportCard,
  },
  props: {
    list: {
      type: Array,
      default: () => [
        {
          img: require('@img/ellsenn/test.png'),
          title: '2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告',
          sub: '2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告，主要包括行业下游产业链分析，行业各区域市场概况，行业主要优势企业分析，行业发展前景预测等内容。',
          status: '公共服务',
          time: '2025-04-22',
          name: '梁昊',
          tips: '世界互联网大会',
        },
        {
          img: require('@img/ellsenn/test.png'),
          title: '2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告',
          sub: '2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告，主要包括行业下游产业链分析，行业各区域市场概况，行业主要优势企业分析，行业发展前景预测等内容。',
          status: '公共服务',
          time: '2025-04-22',
          name: '梁昊',
          tips: '世界互联网大会',
        },
      ],
    },
  },
  name: 'reportList',
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./reportCardList.less"></style>
