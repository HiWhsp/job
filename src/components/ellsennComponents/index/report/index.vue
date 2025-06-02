<template>
  <div class="report-container">
    <div class="report-content">
      <!-- <div class="report-title">
        <div class="report-title-text">
          <img class="report-title-text-img" src="./img/report.png" />
          <div>精品报告</div>
        </div>
        <div class="report-title-more">
          <div class="report-title-more-text">更多</div>
          <img class="report-title-more-right" src="./img/tran.png" />
        </div>
      </div> -->
      <comp-title
        title="精品报告"
        :icon="require('@img/ellsenn/report.png')"
      ></comp-title>
      <div class="report-top-menu">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in tabList"
            :key="index"
            :label="item.label"
            :name="item.name"
          >
            <div class="report-card-list">
              <report-card
                v-for="(item, index) in dataList"
                :dataItem="item"
                :key="index"
              ></report-card>
            </div>
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
      tabList: [
        { label: "拆解报告", name: "disassemblyReport" },
        { label: "销量报告", name: "salesVolumeReport" },
        { label: "技术报告", name: "technicalReport" },
        { label: "调研报告", name: "researchReport" },
        { label: "应用报告", name: "application Report" },
        { label: "定制研究", name: "customizedResearch" },
      ],
      activeName: "disassemblyReport",
      dataList: [
        {
          url: require("@img/ellsenn/test.png"),
          title: "VR/AR产业2024年第二季度销量跟踪报告",
          status: 1,
          time: "2024-08-07",
        },
        {
          url: require("@img/ellsenn/test.png"),
          title: "VR/AR产业2024年第二季度销量跟踪报告",
          status: 2,
          time: "2024-08-07",
        },
        {
          url: require("@img/ellsenn/test.png"),
          title: "VR/AR产业2024年第二季度销量跟踪报告",
          status: 3,
          time: "2024-08-07",
        },
        {
          url: require("@img/ellsenn/test.png"),
          title: "VR/AR产业2024年第二季度销量跟踪报告",
          status: 2,
          time: "2024-08-07",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(this.activeName, "activeNameactiveName");
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
