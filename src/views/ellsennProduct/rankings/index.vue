<template>
  <div class="rankings-page">
    <!-- 年份切换导航 -->
    <div class="year-nav">
      <div class="year-tabs">
        <div
          v-for="year in years"
          :key="year"
          :class="['year-tab', { active: currentYear === year }]"
          @click="switchYear(year)"
        >
          {{ year }}
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-wrapper">
        <!-- 左侧榜单分类 -->
        <div class="category-sidebar">
          <h3 class="category-title">榜单分类</h3>
          <div class="category-list">
            <div
              v-for="(category, index) in categories"
              :key="index"
              :class="['category-item', { active: currentCategory === index }]"
              @click="switchCategory(index)"
            >
              {{ category.name }}
            </div>
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div class="content-area">
          <!-- 榜单标题 -->
          <div class="ranking-header">
            <div class="ranking-title">
              <h2>{{ currentYear }}年度最佳科技产业服务机构</h2>
              <p class="subtitle">（排名不分先后）</p>
            </div>

            <!-- 榜单图片展示 -->
            <div class="ranking-image">
              <div class="award-badge">
                <div class="crown-icon">👑</div>
                <h3 class="award-title">{{ currentYear }}最佳科技产业服务机构</h3>
                <div class="top-badge">最热企业TOP10</div>
              </div>

              <!-- 服务机构名称展示框 -->
              <div class="service-boxes">
                <div
                  v-for="(item, index) in currentRankingData"
                  :key="index"
                  class="service-box"
                >
                  <span class="service-name">{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Rankings",
  data() {
    return {
      currentYear: 2024,
      currentCategory: 0,
      years: [2025, 2024, 2023, 2022, 2021, 2020],
      categories: [
        { name: "2024年度最佳科技产业服务机构" },
        { name: "2024年度科技先锋投资人TOP10" },
        { name: "2024年度最佳科技投资家TOP30" },
        { name: "2024年度智慧科技推手TOP30" },
        { name: "2024年度最具成长科技产业服务合伙人TOP10" },
        { name: "2024年度最佳科技产业服务合伙人TOP10" },
        { name: "2024年度最佳科技产业政府引导基金TOP30" },
        { name: "2024年度科技先锋投资机构TOP10" },
        { name: "2024年度创新科技投资机构TOP10" },
        { name: "2024年度中国最佳科技数据投资机构TOP50" },
        { name: "2024年度中国最佳科技创业服务机构TOP50" },
        { name: "2024年度中国最佳早期科技投资机构TOP30" },
      ],
      rankingData: {
        2024: [
          { name: "服务机构名称服务机构名称" },
          { name: "服务机构名称服务机构名称" },
          { name: "服务机构名称服务机构名称" },
        ],
        2023: [
          { name: "2023年服务机构名称" },
          { name: "2023年服务机构名称" },
          { name: "2023年服务机构名称" },
        ],
        2022: [
          { name: "2022年服务机构名称" },
          { name: "2022年服务机构名称" },
          { name: "2022年服务机构名称" },
        ],
      },
    };
  },
  computed: {
    currentRankingData() {
      return this.rankingData[this.currentYear] || [];
    },
  },
  methods: {
    switchYear(year) {
      this.currentYear = year;
      // 这里可以添加数据加载逻辑
      this.loadRankingData(year);
    },
    switchCategory(index) {
      this.currentCategory = index;
      // 这里可以添加分类切换逻辑
    },
    loadRankingData(year) {
      // 模拟数据加载
      console.log(`加载${year}年度榜单数据`);
      // 实际项目中这里应该调用API获取数据
    },
  },
  mounted() {
    this.loadRankingData(this.currentYear);
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
