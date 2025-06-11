<template>
  <div class="report-container">
    <div class="report-content">
      <comp-title
        title="精品报告"
        :icon="require('@img/ellsenn/report.png')"
        :url="'/researchReport'"
      ></comp-title>
      <div class="report-top-menu">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in tabList"
            :key="index"
            :label="item.title"
            :name="item.id + ''"
          >
            <div class="report-card-list">
              <report-card
                v-for="(item, index) in dataList"
                :dataItem="item"
                :key="index"
              ></report-card>
            </div>
            <el-empty v-if="dataList.length === 0" description="暂无数据" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import compTitle from "../components/title/title.vue";
import reportCard from "./card.vue";
export default {
  components: {
    reportCard,
    compTitle,
  },
  props: {},
  name: "report",
  data() {
    return {
      tabList: [],
      activeName: "1",
      dataList: [],
    };
  },
  mounted() {
    this.$api({
      url: "getReportConfig",
      method: "get",
    }).then((res) => {
      if (res.code == 200) {
        this.tabList = res.data.category_data;
        this.activeName = this.tabList[0].id + "";
      }
    });
    this.getReportList();
  },
  methods: {
    handleClick(tab, event) {
      this.getReportList();
    },
    getReportList() {
      this.$api({
        url: "getReportList",
        method: "get",
        data: {
          page: 1,
          limit: 12,
          category_id: this.activeName,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.dataList = res.data.list;
        }
      });
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
