<template>
  <div class="ai-recommendation">
    <!-- 顶部导航 -->
    <div class="ai-header">
      <button class="back-btn" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        返回
      </button>
      <h1 class="product-title">Camel-600</h1>
      <div class="progress-indicator"></div>
    </div>

    <!-- 三个配置板块 -->
    <div class="config-panels">
      <!-- 性价比优先 -->
      <div
        class="config-panel"
        :class="{ active: selectedPanel === 'cost-effective' }"
        @click="selectPanel('cost-effective')"
      >
        <div class="panel-header">
          <div class="panel-title">
            性价比优先
            <img src="@/assets/img/icon/success.png" alt="" />
          </div>
        </div>

        <div class="panel-content">
          <ComponentList :components="select1" />
        </div>
      </div>

      <!-- 配置均衡 -->
      <div
        class="config-panel"
        :class="{ active: selectedPanel === 'cost-effective' }"
        @click="selectPanel('cost-effective')"
      >
        <div class="panel-header">
          <div class="panel-title">
            配置均衡
            <img src="@/assets/img/icon/success.png" alt="" />
          </div>
        </div>

        <div class="panel-content">
          <ComponentList :components="select2" />
        </div>
      </div>

      <!-- 性能优先 -->
      <div
        class="config-panel"
        :class="{ active: selectedPanel === 'cost-effective' }"
        @click="selectPanel('cost-effective')"
      >
        <div class="panel-header">
          <div class="panel-title">
            性能优先
            <img src="@/assets/img/icon/success.png" alt="" />
          </div>
        </div>

        <div class="panel-content">
          <ComponentList :components="select3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentList from "@/components/ComponentList.vue";

export default {
  name: "AIRecommendation",
  components: {
    ComponentList,
  },
  data() {
    return {
      selectedPanel: "cost-effective", // 默认选中性价比优先
      select1: {},
      select2: {},
      select3: {},
    };
  },
  mounted() {
    this.setView();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    selectPanel(panelType) {
      this.selectedPanel = panelType;
    },
    setView() {
      this.$api({
        url: "getProductAiSetting",
        method: "post",
        data: {
          id: this.$route.query.id,
          sorce: 1,
        },
      }).then((res) => {
        this.select1 = res.data.lists.map((item) => item.child).flat();
      });
      this.$api({
        url: "getProductAiSetting",
        method: "post",
        data: {
          id: this.$route.query.id,
          sorce: 2,
        },
      }).then((res) => {
        this.select2 = res.data.lists.map((item) => item.child).flat();
      });
      this.$api({
        url: "getProductAiSetting",
        method: "post",
        data: {
          id: this.$route.query.id,
          sorce: 3,
        },
      }).then((res) => {
        this.select3 = res.data.lists.map((item) => item.child).flat();
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./aiRecommendation.less";
</style>
