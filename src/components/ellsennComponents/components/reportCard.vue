<template>
  <div class="layout">
    <div class="left">
      <img class="left-img" :src="data.img" alt="" />
    </div>
    <div class="right">
      <div class="title">{{ data.title }}</div>
      <div class="sub">{{ data.sub }}</div>
      <div class="right-bottom">
        <div class="right-bottom-info">
          <div class="right-bottom-info-status">{{ data.status }}</div>
          <div class="right-bottom-info-item">{{ data.time }}</div>
          <div class="right-bottom-info-item">{{ data.name }}</div>
          <div class="right-bottom-info-item">{{ data.tips }}</div>
        </div>
        <div class="right-bottom-btn-group">
          <div class="right-bottom-btn right-bottom-btn-download">
            下载 <img src="@img/ellsenn/pdf.png" alt="" />
            <img src="@img/ellsenn/word.png" alt="" />
          </div>
          <div
            class="right-bottom-btn right-bottom-btn-primary"
            @click="onBtnClick"
          >
            在线阅读
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({
        img: require("@img/ellsenn/test.png"),
        title: "2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告",
        sub: "2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告，主要包括行业下游产业链分析，行业各区域市场概况，行业主要优势企业分析，行业发展前景预测等内容。",
        status: "公共服务",
        time: "2025-04-22",
        name: "梁昊",
        tips: "世界互联网大会",
      }),
    },
  },
  name: "reportCard",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    onBtnClick() {
      this.$router.push({
        path: "/reportDetails",
        query: {
          id: this.data.id,
        },
      });
    },
  },
};
</script>
<style scoped lang="less" src="./reportCard.less"></style>
