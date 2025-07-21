<template>
  <div class="newsInsights">
    <top-search title="独家VR/AR/MR新闻" :onClick="onBtnClick" :list="list"></top-search>
    <div class="container">
      <div class="layout">
        <div>
          <reportCardList
            :list="newsList"
            @change="getNewsList"
            title="新闻"
          ></reportCardList>
        </div>
        <div>
          <popularReports
            title="热门新闻"
            :list="hotNewsList"
            :url="'/newsInsightsDetail'"
          ></popularReports>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import popularReports from "@/components/ellsennComponents/components/popularReports/popularReports.vue";
import reportCardList from "@/components/ellsennComponents/components/reportCardList";
import topSearch from "@/components/ellsennComponents/components/topSearch.vue";
export default {
  components: {
    topSearch,
    reportCardList,
    popularReports,
  },
  props: {},
  name: "newsInsights",
  data() {
    return {
      list: [],
      newsList: [],
      hotNewsList: [],
      keyword: "",
    };
  },
  computed: {
    ...mapState({
      webConfig: (state) => state.webConfig,
    }),
  },
  watch: {
    webConfig: {
      handler(newVal) {
        this.list = newVal.news;
      },
    },
  },
  mounted() {
    this.list = this.webConfig.news;
    this.getNewsList();
    this.$api({
      url: "getArticleList",
      method: "get",
      data: {
        page: 1,
        limit: 6,
        is_hot: 1,
        type_id: 1,
      },
    }).then((res) => {
      this.hotNewsList = res.data.list;
    });
  },
  methods: {
    onBtnClick(i) {
      this.keyword = i;
      this.getNewsList();
    },
    getNewsList(page) {
      this.$api({
        url: "getArticleList",
        method: "get",
        data: {
          page: page || 1,
          limit: 10,
          keyword: this.keyword,
          type_id: 1,
        },
      }).then((res) => {
        this.newsList = res.data.list;
      });
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
