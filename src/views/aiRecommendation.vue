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

        <div class="components-list">
          <div v-for="(item, index) in select1" :key="index">
            <div class="component-item-title">{{ item.title }}</div>
            <div
              class="component-item"
              v-for="(value, i) in item.producntInfos"
              :key="i"
            >
              <div class="component-icon">
                <img :src="value.thumb" alt="" />
              </div>
              <div class="component-info">
                <div class="component-name">
                  {{ value.title }} {{ value.description }}
                </div>
                <div class="component-leadtime">
                  {{ value.delivery_time }}周
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill">
                  <img
                    src="@/assets/img/icon/progress1.png"
                    alt="progress"
                    v-if="value.delivery_time == 1"
                  />
                  <img
                    src="@/assets/img/icon/progress2.png"
                    alt="progress"
                    v-if="value.delivery_time == 2"
                  />
                  <img
                    src="@/assets/img/icon/progress3.png"
                    alt="progress"
                    v-if="value.delivery_time == 3"
                  />
                  <img
                    src="@/assets/img/icon/progress4.png"
                    alt="progress"
                    v-if="value.delivery_time == 4"
                  />
                  <img
                    src="@/assets/img/icon/progress4.png"
                    alt="progress"
                    v-if="value.delivery_time == 5"
                  />
                </div>
                <div class="coin-icon">
                  <img
                    src="@/assets/img/icon/Group1.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 1"
                  />
                  <img
                    src="@/assets/img/icon/Group2.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 2"
                  />
                  <img
                    src="@/assets/img/icon/Group3.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 3"
                  />
                  <img
                    src="@/assets/img/icon/Group4.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 4"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="sub-components">
            <div class="sub-component-title">前壳体组件</div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
          </div> -->
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

        <div class="components-list">
          <div v-for="(item, index) in select2" :key="index">
            <div class="component-item-title">{{ item.title }}</div>
            <div
              class="component-item"
              v-for="(value, i) in item.producntInfos"
              :key="i"
            >
              <div class="component-icon">
                <img :src="value.thumb" alt="" />
              </div>
              <div class="component-info">
                <div class="component-name">
                  {{ value.title }} {{ value.description }}
                </div>
                <div class="component-leadtime">
                  {{ value.delivery_time }}周
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill">
                  <img
                    src="@/assets/img/icon/progress1.png"
                    alt="progress"
                    v-if="value.delivery_time == 1"
                  />
                  <img
                    src="@/assets/img/icon/progress2.png"
                    alt="progress"
                    v-if="value.delivery_time == 2"
                  />
                  <img
                    src="@/assets/img/icon/progress3.png"
                    alt="progress"
                    v-if="value.delivery_time == 3"
                  />
                  <img
                    src="@/assets/img/icon/progress4.png"
                    alt="progress"
                    v-if="value.delivery_time == 4"
                  />
                  <img
                    src="@/assets/img/icon/progress4.png"
                    alt="progress"
                    v-if="value.delivery_time == 5"
                  />
                </div>
                <div class="coin-icon">
                  <img
                    src="@/assets/img/icon/Group1.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 1"
                  />
                  <img
                    src="@/assets/img/icon/Group2.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 2"
                  />
                  <img
                    src="@/assets/img/icon/Group3.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 3"
                  />
                  <img
                    src="@/assets/img/icon/Group4.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 4"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="sub-components">
            <div class="sub-component-title">前壳体组件</div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
          </div> -->
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

        <div class="components-list">
          <div v-for="(item, index) in select3" :key="index">
            <div class="component-item-title">{{ item.title }}</div>
            <div
              class="component-item"
              v-for="(value, i) in item.producntInfos"
              :key="i"
            >
              <div class="component-icon">
                <img :src="value.thumb" alt="" />
              </div>
              <div class="component-info">
                <div class="component-name">
                  {{ value.title }} {{ value.description }}
                </div>
                <div class="component-leadtime">
                  {{ value.delivery_time }}周
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill">
                  <img
                    src="@/assets/img/icon/progress1.png"
                    alt="progress"
                    v-if="value.delivery_time == 1"
                  />
                  <img
                    src="@/assets/img/icon/progress2.png"
                    alt="progress"
                    v-if="value.delivery_time == 2"
                  />
                  <img
                    src="@/assets/img/icon/progress3.png"
                    alt="progress"
                    v-if="value.delivery_time == 3"
                  />
                  <img
                    src="@/assets/img/icon/progress4.png"
                    alt="progress"
                    v-if="value.delivery_time == 4"
                  />
                  <img
                    src="@/assets/img/icon/progress4.png"
                    alt="progress"
                    v-if="value.delivery_time == 5"
                  />
                </div>
                <div class="coin-icon">
                  <img
                    src="@/assets/img/icon/Group1.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 1"
                  />
                  <img
                    src="@/assets/img/icon/Group2.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 2"
                  />
                  <img
                    src="@/assets/img/icon/Group3.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 3"
                  />
                  <img
                    src="@/assets/img/icon/Group4.png"
                    alt="price"
                    class="price-icon"
                    v-if="value.price_status == 4"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="sub-components">
            <div class="sub-component-title">前壳体组件</div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AIRecommendation",
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
