<template>
  <div class="popularReports">
    <card>
      <div class="title">{{ title }}</div>
      <div class="content">
        <popular-reports-card
          v-for="item in list"
          :data="item"
        ></popular-reports-card>
      </div>
    </card>
  </div>
</template>
<script>
import card from '@/components/ellsennComponents/components/card.vue';
import popularReportsCard from '@/components/ellsennComponents/components/popularReports/popularReportsCard.vue';
export default {
  components: {
    card,
    popularReportsCard,
  },
  props: {
    list: {
      type: Array,
      default: () => [
        {
          title: '2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告',
          info: '2025-04-22 梁昊 世界互联网大会',
        },
        {
          title: '2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告',
          info: '2025-04-22 梁昊 世界互联网大会',
        },
      ],
    },
    title: {
      type: String,
      default: '热门报告',
    },
  },
  name: 'popularReports',
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./popularReports.less"></style>
