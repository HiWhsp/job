<template>
  <div class="search-list-page">
    <!-- 主要内容区域 -->
    <div class="search-content">
      <!-- 左侧筛选栏 -->
      <div class="filter-sidebar">
        <div class="filter-section">
          <h3 class="filter-title">筛选</h3>

          <div class="filter-group">
            <div class="filter-label">类别</div>
            <div class="filter-options">
              <el-radio-group v-model="selectedCategory">
                <el-radio :label="0">全部</el-radio>
                <el-radio :label="1">系统厂商</el-radio>
                <el-radio :label="2">配套厂商</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧搜索区域 -->
      <div class="search-results">
        <!-- 搜索框 -->
        <div class="search-header">
          <div class="search-box">
            <i class="el-icon-search"></i>
            <el-input clearable v-model="keyword" placeholder="请输入搜索内容" />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
        </div>

        <!-- 搜索结果统计 -->
        <div class="search-stats">找到全部相关内容：{{ totalCount }}</div>

        <!-- 搜索结果列表 -->
        <div class="results-list">
          <div
            class="result-item"
            v-for="(item, index) in filteredResults"
            :key="index"
            @click="handleItemClick(item)"
          >
            <div class="result-logo">
              <img :src="item.logo || defaultLogo" :alt="item.name" />
            </div>
            <div class="result-content">
              <div class="result-header">
                <span class="result-tag" :class="item.type">{{
                  getTypeLabel(item.type)
                }}</span>
                <h3 class="result-title">{{ item.name }}</h3>
              </div>
              <div class="result-description">
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty description="暂无数据" v-if="filteredResults.length === 0" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchList",
  data() {
    return {
      keyword: "",
      selectedCategory: "",
      searchResults: [
        {
          id: 1,
          name: "施耐德电气",
          type: "enterprise",
          logo: "/src/assets/img/common/logo.png",
          description:
            "作为全球技术领先的企业导向，我们助力世界各地的经济化、自动化数字化技术并应用于智能工业、具有创新性的数字化解决方案，面向未来的数字化中心，智能制造以及数据管理等，依托于全球的分布式专长，我们提供AI赋能的数字化解决方案全生命周期工业上智能化网络化方案...",
        },
        {
          id: 2,
          name: "施耐德电气",
          type: "enterprise",
          logo: "/src/assets/img/common/logo.png",
          description:
            "作为全球技术领先的企业导向，我们助力世界各地的经济化、自动化数字化技术并应用于智能工业、具有创新性的数字化解决方案，面向未来的数字化中心，智能制造以及数据管理等，依托于全球的分布式专长，我们提供AI赋能的数字化解决方案全生命周期工业上智能化网络化方案...",
        },
        {
          id: 3,
          name: "施耐德电气",
          type: "enterprise",
          logo: "/src/assets/img/common/logo.png",
          description:
            "作为全球技术领先的企业导向，我们助力世界各地的经济化、自动化数字化技术并应用于智能工业、具有创新性的数字化解决方案，面向未来的数字化中心，智能制造以及数据管理等，依托于全球的分布式专长，我们提供AI赋能的数字化解决方案全生命周期工业上智能化网络化方案...",
        },
        {
          id: 4,
          name: "施耐德电气",
          type: "enterprise",
          logo: "/src/assets/img/common/logo.png",
          description:
            "作为全球技术领先的企业导向，我们助力世界各地的经济化、自动化数字化技术并应用于智能工业、具有创新性的数字化解决方案，面向未来的数字化中心，智能制造以及数据管理等，依托于全球的分布式专长，我们提供AI赋能的数字化解决方案全生命周期工业上智能化网络化方案...",
        },
        {
          id: 5,
          name: "施耐德电气",
          type: "enterprise",
          logo: "/src/assets/img/common/logo.png",
          description:
            "作为全球技术领先的企业导向，我们助力世界各地的经济化、自动化数字化技术并应用于智能工业、具有创新性的数字化解决方案，面向未来的数字化中心，智能制造以及数据管理等，依托于全球的分布式专长，我们提供AI赋能的数字化解决方案全生命周期工业上智能化网络化方案...",
        },
      ],
      defaultLogo: "/src/assets/img/common/logo.png",
    };
  },
  computed: {
    filteredResults() {
      let results = this.searchResults;

      // 根据关键词筛选
      if (this.keyword) {
        results = results.filter(
          (item) =>
            item.name.toLowerCase().includes(this.keyword.toLowerCase()) ||
            item.description.toLowerCase().includes(this.keyword.toLowerCase())
        );
      }

      // 根据类别筛选
      if (this.selectedCategory) {
        results = results.filter((item) => item.type === this.selectedCategory);
      }

      return results;
    },
    totalCount() {
      return this.filteredResults.length;
    },
  },
  mounted() {
    // 从URL参数获取关键词
    this.keyword = this.$route.query.keyword || "";
    this.performSearch();
  },
  watch: {
    "$route.query.keyword"(newKeyword) {
      this.keyword = newKeyword || "";
      this.performSearch();
    },
    selectedCategory() {
      this.performSearch();
    },
  },
  methods: {
    handleSearch() {
      this.$router.push({
        path: "/searchList",
        query: {
          keyword: this.keyword,
        },
      });
    },
    performSearch() {
      // 这里可以调用API进行搜索
      console.log("搜索关键词:", this.keyword);
      console.log("选择类别:", this.selectedCategory);
    },
    getTypeLabel(type) {
      const typeMap = {
        enterprise: "企业",
        system: "系统厂商",
        parts: "配件厂商",
      };
      return typeMap[type] || "企业";
    },
    handleItemClick(item) {
      // 处理点击事件，可以跳转到详情页
      console.log("点击了:", item);
    },
  },
};
</script>

<style lang="less" src="./searchList.less" scoped></style>
