<template>
  <div class="recommend">
    <div class="title">
      <span>
        <img class="titleImg" src="@img/ellsenn/slash.png" alt="">
      </span>
      <span class="titleText">相关推荐</span>
    </div>
    <div class="items">
      <div class="item" v-for="(item, index) in data" :key="index">
        <img :src="item.thumb" alt="" class="cover">
        <div class="content">
          <div class="title">{{ item.title }}</div>
          <div class="info">
            <span>{{ item.release_time }}</span>
            <span>{{ item.author }}</span>
            <span>{{ item.copyright }}</span>
          </div>
        </div>
      </div>
      <el-empty v-if="data.length === 0" description="暂无数据"></el-empty>
    </div>
  </div>
</template>
<script>

export default {
  components: {},
  props:{
    data: {
      type: Array,
      default: () => [],
    },
  },
  name:'recommend',
  data() {
    return {

    };
  },
  created() {

  },
  mounted() {

  },
}
</script>
<style scoped lang='less' src="./recommend.less">

</style>