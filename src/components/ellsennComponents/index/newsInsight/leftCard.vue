<template>
  <div class="leftCard">
    <div>
      <img class="leftCardImg" :src="data.thumb" alt="" />
    </div>
    <div class="leftContent">
      <div class="leftContent-title">{{ data.title }}</div>
      <div class="leftContent-info">
       {{data.info}}
      </div>
      <div class="leftContent-time">作者：{{ data.author }} <span>{{ data.created_time }}</span></div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: ['data'],
  name: 'leftCard',
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./leftCard.less"></style>
