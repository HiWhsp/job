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
          <div class="component-item-title">控制器</div>
          <div class="component-item">
            <div class="component-icon"></div>
            <div class="component-info">
              <div class="component-name">仙工 SCR-880</div>
              <div class="component-leadtime">1周</div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill">
                <img src="@/assets/img/icon/progress1.png" alt="" />
              </div>
              <div class="coin-icon">
                <img src="@/assets/img/icon/Group1.png" alt="" />
              </div>
            </div>
          </div>
          <div class="component-item-title">外壳</div>
          <div class="component-item">
            <div class="component-icon"></div>
            <div class="component-info">
              <div class="component-name">银白色 RAL9301</div>
              <!-- <div class="component-leadtime">1周</div> -->
            </div>
            <div class="progress-bar">
              <div class="progress-fill">
                <img src="@/assets/img/icon/progress1.png" alt="" />
              </div>
              <div class="coin-icon">
                <img src="@/assets/img/icon/Group1.png" alt="" />
              </div>
            </div>
          </div>
          <div class="component-item">
            <div class="component-icon"></div>
            <div class="component-info">
              <div class="component-name">银白色 RAL9301</div>
              <!-- <div class="component-leadtime">1周</div> -->
            </div>
            <div class="progress-bar">
              <div class="progress-fill">
                <img src="@/assets/img/icon/progress1.png" alt="" />
              </div>
              <div class="coin-icon">
                <img src="@/assets/img/icon/Group1.png" alt="" />
              </div>
            </div>
          </div>

          <div class="sub-components">
            <div class="sub-component-title">前壳体组件</div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
          </div>
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
          <div class="component-item-title">控制器</div>
          <div class="component-item">
            <div class="component-icon"></div>
            <div class="component-info">
              <div class="component-name">仙工 SCR-880</div>
              <div class="component-leadtime">1周</div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill">
                <img src="@/assets/img/icon/progress1.png" alt="" />
              </div>
              <div class="coin-icon">
                <img src="@/assets/img/icon/Group1.png" alt="" />
              </div>
            </div>
          </div>
          <div class="component-item-title">外壳</div>
          <div class="component-item">
            <div class="component-icon"></div>
            <div class="component-info">
              <div class="component-name">银白色 RAL9301</div>
              <!-- <div class="component-leadtime">1周</div> -->
            </div>
            <div class="progress-bar">
              <div class="progress-fill">
                <img src="@/assets/img/icon/progress1.png" alt="" />
              </div>
              <div class="coin-icon">
                <img src="@/assets/img/icon/Group1.png" alt="" />
              </div>
            </div>
          </div>
          <div class="component-item">
            <div class="component-icon"></div>
            <div class="component-info">
              <div class="component-name">银白色 RAL9301</div>
              <!-- <div class="component-leadtime">1周</div> -->
            </div>
            <div class="progress-bar">
              <div class="progress-fill">
                <img src="@/assets/img/icon/progress1.png" alt="" />
              </div>
              <div class="coin-icon">
                <img src="@/assets/img/icon/Group1.png" alt="" />
              </div>
            </div>
          </div>

          <div class="sub-components">
            <div class="sub-component-title">前壳体组件</div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
          </div>
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
          <div class="component-item-title">控制器</div>
          <div class="component-item">
            <div class="component-icon"></div>
            <div class="component-info">
              <div class="component-name">仙工 SCR-880</div>
              <div class="component-leadtime">1周</div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill">
                <img src="@/assets/img/icon/progress1.png" alt="" />
              </div>
              <div class="coin-icon">
                <img src="@/assets/img/icon/Group1.png" alt="" />
              </div>
            </div>
          </div>
          <div class="component-item-title">外壳</div>
          <div class="component-item">
            <div class="component-icon"></div>
            <div class="component-info">
              <div class="component-name">银白色 RAL9301</div>
              <!-- <div class="component-leadtime">1周</div> -->
            </div>
            <div class="progress-bar">
              <div class="progress-fill">
                <img src="@/assets/img/icon/progress1.png" alt="" />
              </div>
              <div class="coin-icon">
                <img src="@/assets/img/icon/Group1.png" alt="" />
              </div>
            </div>
          </div>
          <div class="component-item">
            <div class="component-icon"></div>
            <div class="component-info">
              <div class="component-name">银白色 RAL9301</div>
              <!-- <div class="component-leadtime">1周</div> -->
            </div>
            <div class="progress-bar">
              <div class="progress-fill">
                <img src="@/assets/img/icon/progress1.png" alt="" />
              </div>
              <div class="coin-icon">
                <img src="@/assets/img/icon/Group1.png" alt="" />
              </div>
            </div>
          </div>

          <div class="sub-components">
            <div class="sub-component-title">前壳体组件</div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
            <div class="sub-component-item">
              <span class="sub-component-name">急停按钮：</span>
              <span class="sub-component-value">自复位</span>
            </div>
          </div>
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
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    selectPanel(panelType) {
      this.selectedPanel = panelType;
    },
    confirmSelection() {
      console.log("选择的配置类型:", this.selectedPanel);
      // 这里可以添加确认选择的逻辑
      this.$message.success("配置选择成功！");
    },
  },
};
</script>

<style lang="less" scoped>
@import "./aiRecommendation.less";
</style>
