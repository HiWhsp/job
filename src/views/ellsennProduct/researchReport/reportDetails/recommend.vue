<template>
  <div class="recommend">
    <div class="title">
      <span>
        <img class="titleImg" src="@img/ellsenn/slash.png" alt="">
      </span>
      <span class="titleText">相关推荐</span>
    </div>
    <div class="items">
      <div class="item" v-for="(item, index) in recommendations" :key="index">
        <img :src="item.image" alt="report cover" class="cover">
        <div class="content">
          <div class="title">{{ item.title }}</div>
          <div class="info">
            <span>{{ item.date }}</span>
            <span>{{ item.author }}</span>
            <span>{{ item.conference }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  components: {},
  props:{},
  name:'recommend',
  data() {
    return {
      recommendations: [
        {
          image: require('@img/ellsenn/test.png'),
          title: 'VR/AR产业2024年第二季度销量跟踪报告',
          date: '2025-04-22',
          author: '梁昊',
          conference: '世界互联网大会'
        },
        {
          image: require('@img/ellsenn/test.png'),
          title: 'VR/AR产业2024年第二季度销量跟踪报告',
          date: '2025-04-22',
          author: '梁昊',
          conference: '世界互联网大会'
        },
        {
          image: require('@img/ellsenn/test.png'),
          title: 'VR/AR产业2024年第二季度销量跟踪报告',
          date: '2025-04-22',
          author: '梁昊',
          conference: '世界互联网大会'
        },
        {
          image: require('@img/ellsenn/test.png'),
          title: 'VR/AR产业2024年第二季度销量跟踪报告',
          date: '2025-04-22',
          author: '梁昊',
          conference: '世界互联网大会'
        }
      ]
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