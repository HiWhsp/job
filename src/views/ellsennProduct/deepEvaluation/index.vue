<template>
  <div class="newsInsights">
    <top-search
      title="独家VR/AR/MR新闻"
      :onClick="onBtnClick"
      :list="list"
    ></top-search>
    <div class="container">
      <div class="layout">
        <div>
          <reportCardList :list="reportList" title="测评"></reportCardList>
        </div>
        <div>
          <popularReports
            title="热门推荐"
            :list="hotReportList"
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
      keyword: "",
      reportList: [],
      hotReportList: [],
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
        this.list = newVal.pingce;
      },
    },
  },
  mounted() {
    this.list = this.webConfig.pingce;
    this.getReportList();
    this.getHotReportList();
  },
  methods: {
    onBtnClick(i) {
      this.keyword = i;
      this.getReportList();
    },
    getReportList() {
      this.$api({
        url: "getArticleList",
        method: "get",
        data: {
          page: 1,
          limit: 10,
          type_id: 2,
          keyword: this.keyword,
        },
      }).then((res) => {
        this.reportList = res.data.list;
      });
    },
    getHotReportList() {
      this.$api({
        url: "getArticleList",
        method: "get",
        data: {
          page: 1,
          limit: 10,
          type_id: 2,
          is_hot: 1,
        },
      }).then((res) => {
        this.hotReportList = res.data.list;
      });
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
