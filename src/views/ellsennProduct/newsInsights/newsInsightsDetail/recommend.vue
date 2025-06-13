<template>
  <div class="recommend">
    <div class="title">
      <span>
        <img class="titleImg" src="@img/ellsenn/slash.png" alt="" />
      </span>
      <span class="titleText">相关推荐</span>
    </div>
    <div class="items">
      <div class="item" v-for="(item, index) in list" :key="index">
        <div class="content">
          <div class="tit ellipsis-2">{{ item.title }}</div>
          <div class="info">
            <span>{{ item.created_time }}</span>
            <span>{{ item.author }}</span>
          </div>
        </div>
      </div>
      <el-empty description="暂无数据" v-if="list.length === 0"></el-empty>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  name: "recommend",
  data() {
    return {
      recommendations: [
        {
          image: require("@img/ellsenn/test.png"),
          title: "VR/AR产业2024年第二季度销量跟踪报告",
          date: "2025-04-22",
          author: "梁昊",
          conference: "世界互联网大会",
        },
        {
          image: require("@img/ellsenn/test.png"),
          title: "VR/AR产业2024年第二季度销量跟踪报告",
          date: "2025-04-22",
          author: "梁昊",
          conference: "世界互联网大会",
        },
        {
          image: require("@img/ellsenn/test.png"),
          title: "VR/AR产业2024年第二季度销量跟踪报告",
          date: "2025-04-22",
          author: "梁昊",
          conference: "世界互联网大会",
        },
        {
          image: require("@img/ellsenn/test.png"),
          title: "VR/AR产业2024年第二季度销量跟踪报告",
          date: "2025-04-22",
          author: "梁昊",
          conference: "世界互联网大会",
        },
      ],
    };
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./recommend.less"></style>
