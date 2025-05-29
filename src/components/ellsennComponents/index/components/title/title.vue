<template>
  <div class="compTitle">
    <div class="report-title">
      <div class="report-title-text">
        <img class="report-title-text-img" :src="icon"  />
        <div>{{ title }}</div>
      </div>
      <div class="report-title-more">
        <div class="report-title-more-text">更多</div>
        <img class="report-title-more-right" src="@img/ellsenn/tran.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: ['title','icon'],
  name: 'compTitle',
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src='./index.less'>
</style>
