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
      <div v-if="activeTab === '1'" class="config-section">
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
      <div v-if="activeTab === '2'" class="config-section">
        <div class="components-placeholder">
          <p>元器件配置内容</p>
        </div>
      </div>

      <!-- 外观模块标签页 -->
      <div v-if="activeTab === '3'" class="config-section">
        <div class="appearance-placeholder">
          <p>外观模块配置内容</p>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="config-footer">
      <button class="prev-button" v-if="activeTab !== '1'" @click="prevStep"> <i class="el-icon-arrow-left"></i> </button>
      <button class="next-button" v-if="activeTab !== '3'" @click="nextStep">{{ tabs[activeTab - 1].label }} ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RobotConfigPanel",
  data() {
    return {
      activeTab: "1",
      selectedController: "xian-gong",
      tabs: [
        { key: "1", label: "控制器和雷达" },
        { key: "2", label: "元器件" },
        { key: "3", label: "外观模块" },
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
      if (this.activeTab === "1") {
        this.activeTab = "2";
      } else if (this.activeTab === "2") {
        this.activeTab = "3";
      }
    },
    prevStep() {
      if (this.activeTab === "2") {
        this.activeTab = "1";
      } else if (this.activeTab === "3") {
        this.activeTab = "2";
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "./RobotConfigPanel.less";
</style>
