<template>
  <div class="layout" @click="onBtnClick">
    <div class="title">{{ data.title }}</div>
    <div class="info">
      {{ data.release_time || data.created_time }} {{ data.author }}
      {{ data.category_name }}
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
        title: "2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告",
        info: "2025-04-22 梁昊 世界互联网大会",
      }),
    },
    url: {
      type: String,
      default: "",
    },
  },
  name: "popularReportsCard",
  data() {
    return {};
  },
  mounted() {
    console.log(this.data, "this.data");
  },
  methods: {
    onBtnClick() {
      this.$router.push({ path: this.url, query: { id: this.data.id } });
    },
  },
};
</script>
<style scoped lang="less" src="./popularReportsCard.less"></style>
