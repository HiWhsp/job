<template>
  <div class="report-container">
    <card>
      <div class="filter-layout">
        <div class="filter-label">
          <img src="@img/ellsenn/reportType.png" alt="" />报告类型
        </div>
        <div class="filter-item">
          <div class="filter-content">
            <el-checkbox
              v-model="reportTypeAll"
              @change="handleReportTypeAllChange"
              >全部</el-checkbox
            >
            <el-checkbox
              v-for="type in reportTypes"
              :key="type.value"
              :label="type.label"
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
              :key="industry.value"
              :label="industry.label"
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
              v-model="releaseTime"
              :label="item.label"
              @change="handleRadioChange"
              >{{ item.value }}</el-radio
            >
            <el-date-picker
              v-if="releaseTime === 'custom'"
              v-model="customDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
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
import card from '@/components/ellsennComponents/components/card.vue';
export default {
  name: 'reportFilter',
  components: {
    card,
  },
  data() {
    return {
      reportTypeAll: false,
      reportTypes: [
        { value: '拆解报告', label: '拆解报告', checked: false },
        { value: '销量报告', label: '销量报告', checked: false },
        { value: '技术报告', label: '技术报告', checked: false },
        { value: '调研报告', label: '调研报告', checked: false },
        { value: '应用报告', label: '应用报告', checked: false },
        { value: '定制研究', label: '定制研究', checked: false },
      ],
      industryAll: false,
      industries: [
        { value: '科技传媒', label: '科技传媒', checked: false },
        { value: '健康医疗', label: '健康医疗', checked: false },
        { value: '金融地产', label: '金融地产', checked: false },
        { value: '能源矿产', label: '能源矿产', checked: false },
        { value: '工业制造', label: '工业制造', checked: false },
        { value: '交通物流', label: '交通物流', checked: false },
        { value: '公共服务', label: '公共服务', checked: false },
        { value: '农林牧渔', label: '农林牧渔', checked: false },
      ],
      releaseList: [
        { value: '近三天', label: 'recentThreeDays' },
        { value: '近一周', label: 'recentWeek' },
        { value: '近一月', label: 'recentMonth' },
        { value: '近半年', label: 'recentHalfYear' },
        { value: '近一年', label: 'recentYear' },
        { value: '自定义', label: 'custom' },
      ],
      releaseTime: '',
      customDateRange: '',
    };
  },
  methods: {
    //报告类型全选
    handleReportTypeAllChange(val) {
      this.reportTypes.forEach((item) => {
        item.checked = val;
      });
    },
    //报告类型选择
    handleReportTypeChange() {
      console.log(this.reportTypes, 'this.reportTypes');
    },
    //行业全选
    handleIndustryAllChange(val) {
      this.industries.forEach((item) => {
        item.checked = val;
      });
    },
    //行业选择
    handleIndustryChange() {
      console.log(this.industries, 'this.industries');
    },
    //时间
    handleRadioChange() {
      console.log(this.releaseTime, 'this.releaseTime');
    },
    //时间区间
    handleDatePickerChange() {
      console.log(this.customDateRange, 'customDateRange');
    },
  },
};
</script>

<style scoped lang="less" src="./index.less"></style>
