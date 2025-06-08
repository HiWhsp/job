<template>
  <div class="reportList">
    <div class="searchResult">
      <el-input
        placeholder="请输入关键词"
        clearable
        v-model="searchValue"
      ></el-input>
      <el-button type="primary" @click="search" icon="el-icon-search"
        >搜索</el-button
      >
    </div>
    <div class="filter">
      <div class="filterItem">
        <div
          class="filterItemTitle"
          v-for="item in filterList"
          :key="item.index"
          :class="{ active: filterIndex === item.index }"
          @click="filterItemClick(item.index)"
        >
          {{ item.title }}
        </div>
      </div>
      <div class="filterItem">
        <div
          class="filterItemContent"
          :class="{ active: filterTimeIndex === 0 }"
          @click="filterItem(0)"
        >
          按时间排序
        </div>
        <div
          class="filterItemContent"
          :class="{ active: filterTimeIndex === 1 }"
          @click="filterItem(1)"
        >
          按匹配度排序
        </div>
      </div>
    </div>
    <div class="reportListTitle">
      找到与"<span>VR</span>"相关的结果数约198个
    </div>
    <report-card v-for="item in list" :data="item" :key="item.id"></report-card>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="limit"
      layout="prev, pager, next"
      :total="totalItems"
    ></el-pagination>
  </div>
</template>
<script>
import reportCard from "../reportCard.vue";
export default {
  components: {
    reportCard,
  },
  props: {
    list: {
      type: Array,
      default: () => [
        {
          id: 1,
          img: require("@img/ellsenn/test.png"),
          title: "2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告",
          sub: "2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告，主要包括行业下游产业链分析，行业各区域市场概况，行业主要优势企业分析，行业发展前景预测等内容。",
          status: "公共服务",
          time: "2025-04-22",
          name: "梁昊",
          tips: "世界互联网大会",
        },
        {
          id: 2,
          image: require("@img/ellsenn/test.png"),
          title: "Quest平台VR内容总营收已超22亿美元",
          description:
            "根据wellsenn XR跟踪统计测算，截至2023年底，Meta Quest平台VR内容累计营收近22亿美元。",
          date: "2025-04-22",
          source: "维深 Wellsenn XR",
          tags: ["拆解", "VR", "快讯"],
        },
        {
          id: 3,
          url: require('@img/ellsenn/i.png'),
          title: '2025年全球AI/AR智能眼镜智能制造高峰论坛',
          location: '北京XXXX万豪酒店',
          time: '2025-01-01 至 2025-04-03',
        },
      ],
    },
  },
  name: "reportList",
  data() {
    return {
      searchValue: "",
      filterIndex: 0,
      filterTimeIndex: 0,
      currentPage: 1,
      limit: 10,
      totalItems: 100,
      filterList: [
        {
          title: "全部",
          index: 0,
        },
        {
          title: "报告",
          index: 1,
        },
        {
          title: "资讯",
          index: 2,
        },
        {
          title: "活动",
          index: 3,
        },
      ],
    };
  },
  mounted() {},
  methods: {
    search() {
      console.log(this.searchValue, "search");
    },
    filterItemClick(index) {
      this.filterIndex = index;
    },
    filterItem(index) {
      this.filterTimeIndex = index;
    },
    handleSizeChange(size) {
      this.limit = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
  },
};
</script>
<style lang="less" scoped>
.searchResult {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  /deep/ .el-input__inner {
    border-color: #dcdfe6;
    border-radius: 0px;
  }
  /deep/ .el-button {
    width: 126px;
    border-radius: 0px;
    background-color: #005aac;
    border-color: #005aac;
  }
}

.filter {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #dcdfe6;
  .filterItem {
    display: flex;
    align-items: center;
    .filterItemTitle {
      margin-right: 50px;
      cursor: pointer;
      font-size: 16px;
      color: #3d3d3d;
      &:hover {
        color: #005aac;
      }
    }
    .active {
      color: #005aac;
      font-weight: bold;
    }
    .filterItemContent {
      font-size: 12px;
      color: #3d3d3d;
      cursor: pointer;
      margin-left: 20px;
      &:hover {
        color: #005aac;
      }
      &.active {
        color: #005aac;
        font-weight: bold;
      }
    }
  }
}
.pagination {
  text-align: center;
}
</style>
<style scoped lang="less" src="./reportCardList.less"></style>
