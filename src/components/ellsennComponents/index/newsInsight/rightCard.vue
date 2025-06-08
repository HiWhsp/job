<template>
  <div class="rightCard">
    <div class="rightCardTitle">{{data.title}}</div>
    <div class="item-info">
      <span class="item-time">{{ data.created_time }}</span>
      <span class="item-status" v-for="(item, index) in data.tab" :key="index">{{ item }}</span>
    </div>
  </div> 
</template>
<script>
export default {
  components: {},
  props: ['data'],
  name: 'rightCard',
  data() {
    return {
    };
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./rightCard.less"></style>
