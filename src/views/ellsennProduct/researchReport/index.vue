<template>
  <div class="researchReport">
    <top-search
      title="专注XR产业独立研究机构"
      :onClick="onBtnClick"
      :list="list"
    ></top-search>
    <div class="researchReportBottom">
      <div class="bottomContent">
        <report-filter @search="search" ref="reportFilter"></report-filter>
        <report-list-and-popular-reports
          :reportList="reportList"
          :popularReportsList="popularReportsList"
        ></report-list-and-popular-reports>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import topSearch from "@/components/ellsennComponents/components/topSearch.vue";
import reportFilter from "@/components/ellsennComponents/researchReport/reportFilter/index.vue";
import reportListAndPopularReports from "@/components/ellsennComponents/researchReport/reportListAndPopularReports/index.vue";
import { log } from "util";
export default {
  components: {
    topSearch,
    reportFilter,
    reportListAndPopularReports,
  },
  props: {},
  name: "researchReport",
  data() {
    return {
      reportList: [],
      popularReportsList: [],
      searchData: {
        type_id: "",
        category_id: "",
        time_id: "",
        start_time: "",
        end_time: "",
      },
      list: [],
    };
  },
  computed: {
    ...mapState({
      webConfig: (state) => state.webConfig,
    }),
  },
  watch: {
    $route: {
      handler(newVal) {
        this.searchData.category_id = newVal.query.id;
        this.$refs.reportFilter.setQueryCondition(this.searchData.category_id);
      },
      deep: true,
    },
    webConfig: {
      handler(newVal) {
        this.list = newVal.report;
      },
      deep: true,
    },
  },
  mounted() {
    this.list = this.webConfig.report;
    this.getReportList();
    this.$api({
      url: "getReportList",
      method: "get",
      data: {
        is_hot: 1,
        page: 1,
        page_size: 6,
      },
    }).then((res) => {
      if (res.code == 200) {
        this.popularReportsList = res.data.list;
      }
    });
  },
  methods: {
    search(data) {
      this.searchData = data;
      this.getReportList();
    },
    getReportList() {
      this.$api({
        url: "getReportList",
        method: "get",
        data: this.searchData,
      }).then((res) => {
        if (res.code == 200) {
          this.reportList = res.data.list;
        }
      });
    },
    onBtnClick(i) {
      this.searchData.keyword = i;
      this.getReportList();
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
