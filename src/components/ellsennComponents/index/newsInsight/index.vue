<template>
  <div class="newsInsight">
    <div class="newsContent">
      <div class="newsLeft">
        <comp-title
          title="新闻洞察"
          :icon="require('@img/ellsenn/report.png')"
          :url="'/newsInsights'"
        ></comp-title>
        <left-card
          v-for="(item, index) in leftCardList"
          :data="item"
          :key="index"
        ></left-card>
        <el-empty description="暂无数据" v-if="leftCardList.length === 0"></el-empty>
      </div>
      <div class="newsRight">
        <comp-title
          title="维深测评"
          :icon="require('@img/ellsenn/report.png')"
          :url="'/deepEvaluation'"
        ></comp-title>
        <right-card
          v-for="(item, index) in rightCardList"
          :data="item"
          :key="index"
        ></right-card>
        <el-empty description="暂无数据" v-if="rightCardList.length === 0"></el-empty>
      </div>
    </div>
  </div>
</template>
<script>
import compTitle from "../components/title/title.vue";
import leftCard from "./leftCard.vue";
import rightCard from "./rightCard.vue";
export default {
  components: {
    compTitle,
    rightCard,
    leftCard,
  },
  props: {},
  name: "newsInsight",
  data() {
    return {
      leftCardList: [],
      rightCardList: [],
    };
  },
  mounted() {
    this.getNewsInsight(1);
    this.getNewsInsight(2);
  },
  methods: {
    getNewsInsight(type) {
      this.$api({
        url: "getArticleList",
        method: "get",
        data: {
          type_id: type,
          page: 1,
          limit: type == 1 ? 3 : 4,
        },
      }).then((res) => {
        if (res.code == 200) {
          this[`${type == 1 ? "left" : "right"}CardList`] = res.data.list;
        }
      });
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
