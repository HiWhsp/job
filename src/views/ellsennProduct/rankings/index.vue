<template>
  <div class="rankings-page">
    <!-- 年份切换导航 -->
    <div class="year-nav">
      <div class="year-tabs">
        <div
          v-for="(year, index) in years"
          :key="year.year"
          :class="['year-tab', { active: currentYear === year.year }]"
          @click="switchYear(year, index)"
        >
          {{ year.year }}
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
              :class="['category-item', { active: selectedCategory.id === category.id }]"
              @click="switchCategory(category, index)"
            >
              {{ category.title }}
            </div>
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div class="content-area">
          <!-- 榜单标题 -->
          <div class="ranking-header">
            <div class="ranking-title">
              <h2>{{ selectedCategory.title }}</h2>
              <p class="subtitle">（排名不分先后）</p>
            </div>

            <!-- 榜单图片展示 -->
            <div class="ranking-image">
              <div class="award-badge">
                <img :src="selectedCategory.image" alt="" />
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
      selectedCategory: {},
      years: [],
      categories: [],
      rankingData: {},
    };
  },
  computed: {
    currentRankingData() {
      return this.rankingData[this.currentYear] || [];
    },
  },
  methods: {
    switchYear(year, index) {
      this.currentYear = year.year;
      this.categories = year.data;
      this.selectedCategory = this.categories[0];
    },
    switchCategory(category) {
      this.selectedCategory = category;
    },
    loadRankingData(year) {
      this.$api({
        url: "getRankingList",
        method: "get",
      }).then((res) => {
        if (res.code === 200) {
          this.years = res.data;
          this.currentYear = res.data[0].year;
          this.categories = res.data[0].data;
          this.selectedCategory = this.categories[0];
        }
      });

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
