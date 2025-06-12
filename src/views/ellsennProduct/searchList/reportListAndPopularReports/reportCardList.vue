<template>
  <div class="reportList">
    <div class="searchResult">
      <el-input placeholder="请输入关键词" clearable v-model="searchValue"></el-input>
      <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
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
    <div class="reportListTitle" v-if="searchValue">
      找到与"<span>{{ searchValue }}</span
      >"相关的结果数约{{ totalItems }}个
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
  name: "reportList",
  data() {
    return {
      searchValue: "", // 搜索关键词
      filterIndex: "", // 0:全部 1:报告 2:资讯 3:活动
      filterTimeIndex: 0, // 0:按时间排序 1:按匹配度排序

      currentPage: 1, // 当前页
      limit: 10, // 每页条数
      totalItems: 0, // 总条数
      filterList: [
        {
          title: "全部",
          index: "",
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
      list: [],
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    search() {
      this.$api({
        url: "getSearch",
        data: {
          keyword: this.searchValue,
          type: this.filterIndex,
          sort: this.filterTimeIndex,
          page: this.currentPage,
          limit: this.limit,
        },
      }).then((res) => {
        this.list = res.data.list || [];
        this.totalItems = res.data.count;
      });
    },
    filterItemClick(index) {
      this.filterIndex = index;
      this.search();
    },
    filterItem(index) {
      this.filterTimeIndex = index;
      this.search();
    },
    handleSizeChange(size) {
      this.limit = size;
      this.search();
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
