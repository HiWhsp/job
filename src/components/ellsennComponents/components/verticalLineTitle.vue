<template>
  <div class="tabTitle">
    <div class='divider'></div>
    <div>{{ tabTitle }}</div>
  </div>
</template>
<script>
export default {
  components: {},
  props: ['tabTitle'],
  name: 'tabTitle',
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./verticalLineTitle.less"></style>
