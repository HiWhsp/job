<template>
  <div class="report-container">
    <card>
      <div class="filter-layout">
        <div class="filter-label">
          <img src="@img/ellsenn/reportType.png" alt="" />报告类型
        </div>
        <div class="filter-item">
          <div class="filter-content">
            <el-checkbox v-model="reportTypeAll" @change="handleReportTypeAllChange"
              >全部</el-checkbox
            >
            <el-checkbox
              v-for="type in reportTypes"
              :key="type.id"
              :label="type.title"
              v-model="type.checked"
              @change="handleReportTypeChange"
            ></el-checkbox>
          </div>
        </div>
      </div>
      <div class="filter-layout">
        <div class="filter-label">
          <img src="@img/ellsenn/IndustryClassification.png" alt="" />行业分类
        </div>
        <div class="filter-item">
          <div class="filter-content">
            <el-checkbox v-model="industryAll" @change="handleIndustryAllChange"
              >全部</el-checkbox
            >
            <el-checkbox
              v-for="industry in industries"
              :key="industry.id"
              :label="industry.title"
              v-model="industry.checked"
              @change="handleIndustryChange"
            ></el-checkbox>
          </div>
        </div>
      </div>
      <div class="filter-layout">
        <div class="filter-label">
          <img src="@img/ellsenn/releaseTime.png" alt="" />发布时间
        </div>
        <div class="filter-item">
          <div class="filter-content">
            <el-radio
              v-for="item in releaseList"
              :key="item.id"
              v-model="releaseTime"
              :label="item.id"
              @change="handleRadioChange"
              >{{ item.title }}</el-radio
            >
            <el-date-picker
              v-model="customDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="handleDatePickerChange"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import card from "@/components/ellsennComponents/components/card.vue";
export default {
  name: "reportFilter",
  components: {
    card,
  },
  props: {
    url: {
      type: String,
      default: "getReportConfig",
    },
  },
  data() {
    return {
      reportTypeAll: false,
      reportTypes: [],
      industryAll: false,
      industries: [],
      releaseList: [],
      releaseTime: "",
      customDateRange: "",
    };
  },
  mounted() {
    this.getQueryCondition();
  },
  methods: {
    // 获取查询条件
    getQueryCondition() {
      this.$api({
        url: this.url,
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          this.reportTypes = res.data.category_data;
          this.industries = res.data.type_data;
          this.releaseList = res.data.create_time_data;
        }
      });
    },
    //报告类型全选
    handleReportTypeAllChange(val) {
      this.reportTypes.forEach((item) => {
        item.checked = val;
      });
      this.search();
    },
    //报告类型选择
    handleReportTypeChange() {
      if (this.reportTypeAll) {
        this.reportTypes.forEach((item) => {
          // 只有当前点击的选中，其他都取消
          if (!item.checked) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      }
      this.reportTypeAll = false;
      this.search();
      this.$forceUpdate();
    },
    //行业全选
    handleIndustryAllChange(val) {
      this.industries.forEach((item) => {
        item.checked = val;
      });
      this.search();
    },
    //行业选择
    handleIndustryChange() {
      if (this.industryAll) {
        this.industries.forEach((item) => {
          if (!item.checked) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      }
      this.industryAll = false;
      this.search();
      this.$forceUpdate();
    },
    //时间
    handleRadioChange() {
      this.customDateRange = "";
      this.search();
    },
    //时间区间
    handleDatePickerChange() {
      this.search();
    },
    // 查询
    search() {
      this.$emit("search", {
        category_id: this.reportTypeAll
          ? ""
          : this.reportTypes.filter((item) => item.checked).length > 0
          ? this.reportTypes
              .filter((item) => item.checked)
              .map((item) => item.id)
              .join(",")
          : "",
        type_id: this.industryAll
          ? ""
          : this.industries.filter((item) => item.checked).length > 0
          ? this.industries
              .filter((item) => item.checked)
              .map((item) => item.id)
              .join(",")
          : "",
        time_id: this.releaseTime ? this.releaseTime : "",
        start_time: this.customDateRange ? this.customDateRange[0] : "",
        end_time: this.customDateRange ? this.customDateRange[1] : "",
      });
    },
  },
};
</script>

<style scoped lang="less" src="./index.less"></style>
