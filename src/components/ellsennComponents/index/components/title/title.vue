<template>
  <div class="compTitle">
    <div class="report-title">
      <div class="report-title-text">
        <img class="report-title-text-img" :src="icon" />
        <div>{{ title }}</div>
      </div>
      <div class="report-title-more" @click="goToUrl">
        <div class="report-title-more-text">更多</div>
        <img class="report-title-more-right" src="@img/ellsenn/tran.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: ["title", "icon", "url"],
  name: "compTitle",
  data() {
    return {};
  },
  methods: {
    goToUrl() {
      this.$router.push(this.url);
    },
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./index.less"></style>
