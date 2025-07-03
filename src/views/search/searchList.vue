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
                <el-radio :label="''">全部</el-radio>
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
              <img :src="item.logo" :alt="item.companyName" />
            </div>
            <div class="result-content">
              <div class="result-header">
                <span class="result-tag" :class="item.type">{{
                  getTypeLabel(item.type)
                }}</span>
                <h3 class="result-title">{{ item.companyName }}</h3>
              </div>
              <div class="result-description">
                {{ item.describption }}
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
      searchResults: [],
      defaultLogo: "/src/assets/img/common/logo.png",
    };
  },
  computed: {
    filteredResults() {
      let results = this.searchResults;
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
      this.$api({
        url: "companyList",
        method: "get",
        data: {
          keyWord: this.keyword,
          companyType: this.selectedCategory,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.searchResults = data.list;
        } else {
          this.$message.error(msg);
        }
      });
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
      this.$router.push({
        path: "manufacturer-detail",
        query: {
          id: item.id,
        },
      });
    },
  },
};
</script>

<style lang="less" src="./searchList.less" scoped></style>
