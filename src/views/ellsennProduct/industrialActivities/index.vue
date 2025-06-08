<template>
  <div class="industrialActivities">
    <top-search title="行业峰会 为行业聚能" :onClick="onBtnClick"></top-search>
    <div class="industrialActivitiesBottom">
      <div class="bottomContent">
        <report-filter @search="search"></report-filter>
        <div class="activeContent">
          <activity-card
            v-for="(item, index) in activityList"
            :data="item"
            :key="index"
          ></activity-card>
        </div>
      </div>
      <!-- 分页区域 -->
      <el-pagination
        v-if="activityList.length > 0"
        class="pagination"
        @current-change="handleCurrentChange"
        :current-page="searchData.page"
        :page-size="searchData.limit"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import topSearch from "@/components/ellsennComponents/components/topSearch.vue";
import activityCard from "@/components/ellsennComponents/index/recentActivities/activityCard.vue";
import reportFilter from "@/components/ellsennComponents/researchReport/reportFilter/index.vue";
export default {
  components: {
    topSearch,
    reportFilter,
    activityCard,
  },
  props: {},
  name: "industrialActivities",
  data() {
    return {
      searchData: {
        type_id: "",
        category_id: "",
        time_id: "",
        start_time: "",
        end_time: "",
        page: 1,
        limit: 10,
      },
      total: 0,
      activityList: [],
    };
  },
  mounted() {
    this.getReportList();
  },
  methods: {
    search(data) {
      this.searchData = data;
      this.getReportList();
    },
    getReportList() {
      this.$api({
        url: "getProductActivitiesList",
        method: "get",
        data: this.searchData,
      }).then((res) => {
        if (res.code == 200) {
          this.activityList = res.data.list;
          this.total = res.data.count;
        }
      });
    },
    onBtnClick() {
      this.searchData.keyword = i;
      this.getReportList();
    },
    handleCurrentChange(page) {
      this.searchData.page = page;
      this.getReportList();
    },
    handleActivityClick(item) {
      this.$router.push({
        path: "/ellsennProduct/industrialActivities/detail",
        query: { id: item.id },
      });
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
