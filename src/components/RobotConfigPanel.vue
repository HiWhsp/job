<template>
  <div class="robot-config-panel">
    <!-- 标题区域 -->
    <div class="config-header">
      <div class="config-header-left">
        <h2 class="robot-title">Camel-600</h2>
        <span class="ai-recommend">AI 推荐</span>
      </div>
      <!-- 导航标签 -->
      <div class="config-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-item', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>

    <!-- 配置内容区域 -->
    <div class="config-content">
      <!-- 控制器和雷达标签页 -->
      <div v-if="activeTab === 'controller'" class="config-section">
        <!-- 控制器部分 -->
        <div class="section-title">控制器</div>
        <div class="controller-grid">
          <div
            v-for="controller in controllers"
            :key="controller.id"
            :class="[
              'controller-item',
              { selected: selectedController === controller.id },
            ]"
            @click="selectController(controller.id)"
          >
            <div class="controller-image">
              <img :src="controller.image" alt="controller" />
            </div>
            <div class="controller-info">
              <div class="controller-info-left">
                <div class="controller-brand">{{ controller.brand }}</div>
                <div class="controller-model">{{ controller.model }}</div>
              </div>
              <div class="controller-price">
                <img src="@/assets/img/icon/Group1.png" alt="coin" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 元器件标签页 -->
      <div v-if="activeTab === 'components'" class="config-section">
        <div class="components-placeholder">
          <p>元器件配置内容</p>
        </div>
      </div>

      <!-- 外观模块标签页 -->
      <div v-if="activeTab === 'appearance'" class="config-section">
        <div class="appearance-placeholder">
          <p>外观模块配置内容</p>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="config-footer">
      <button class="next-button" @click="nextStep">元器件 ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RobotConfigPanel",
  data() {
    return {
      activeTab: "controller",
      selectedController: "xian-gong",
      tabs: [
        { key: "controller", label: "控制器和雷达" },
        { key: "components", label: "元器件" },
        { key: "appearance", label: "外观模块" },
      ],
      controllers: [
        { id: "xian-gong", brand: "仙工", model: "SRC-800" },
        { id: "yi-fei", brand: "翼非", model: "RAC-200" },
        { id: "rui-xin", brand: "睿芯行", model: "XXXX-XXXX-01" },
        { id: "other", brand: "其他", model: "" },
      ],
    };
  },
  methods: {
    selectController(controllerId) {
      this.selectedController = controllerId;
    },
    nextStep() {
      // 切换到下一个标签页或执行下一步操作
      if (this.activeTab === "controller") {
        this.activeTab = "components";
      } else if (this.activeTab === "components") {
        this.activeTab = "appearance";
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "./RobotConfigPanel.less";
</style>
