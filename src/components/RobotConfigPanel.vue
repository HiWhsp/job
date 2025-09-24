<template>
  <div class="robot-config-panel">
    <!-- 初始遮罩层 -->
    <div v-if="showOverlay" class="overlay-mask">
      <div class="overlay-content">
        <div class="overlay-buttons">
          <button class="overlay-btn ai-recommend-btn" @click="useAIRecommendation">
            使用AI推荐
          </button>
          <button class="overlay-btn custom-config-btn" @click="useCustomConfig">
            我自己选配
          </button>
        </div>
      </div>
    </div>

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
      <div v-if="activeTab === 1" class="config-section">
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
      <div v-if="activeTab === 2" class="config-section">
        <div class="section-title">电机</div>
        <div class="motor-grid">
          <div class="motor-item">
            <span class="motor-name">步科</span>
            <img src="@/assets/img/icon/Group1.png" alt="" />
          </div>
        </div>
        <div class="section-title">电机</div>
        <div class="motor-grid">
          <div class="motor-item">
            <span class="motor-name">步科</span>
            <img src="@/assets/img/icon/Group1.png" alt="" />
          </div>
        </div>
        <div class="section-title">电机</div>
        <div class="motor-grid">
          <div class="motor-item">
            <span class="motor-name">步科</span>
            <img src="@/assets/img/icon/Group1.png" alt="" />
          </div>
        </div>
        <div class="section-title">电机</div>
        <div class="motor-grid">
          <div class="motor-item">
            <span class="motor-name">步科</span>
            <img src="@/assets/img/icon/Group1.png" alt="" />
          </div>
          <div class="motor-item">
            <span class="motor-name">步科</span>
            <img src="@/assets/img/icon/Group1.png" alt="" />
          </div>
          <div class="motor-item">
            <span class="motor-name">步科</span>
            <img src="@/assets/img/icon/Group1.png" alt="" />
          </div>
        </div>
        <div class="section-title">电机</div>
        <div class="motor-grid">
          <div class="motor-item">
            <span class="motor-name">步科</span>
            <img src="@/assets/img/icon/Group1.png" alt="" />
          </div>
        </div>
      </div>

      <!-- 外观模块标签页 -->
      <div v-if="activeTab === 3" class="config-section">
        <div class="select-module">
          <div class="select-module-title">外壳</div>
          <div class="select-module-grid">
            <div class="section-title">颜色</div>
            <div class="color-grid">
              <div class="color-item">
                <div class="color-image"></div>
                <div class="color-info">
                  <div class="color-info-left">
                    <div class="color-brand">白银色</div>
                    <div class="color-model">RAL9003</div>
                  </div>
                  <div class="color-price">
                    <!-- <img src="@/assets/img/icon/Group1.png" alt="coin" /> -->
                  </div>
                </div>
              </div>
              <div class="color-item">
                <div class="color-image" :style="{ backgroundColor: color1 }">
                  <div class="color-picker-text" @click="colorPicker">
                    点击定制颜色
                  </div>
                </div>
                <div class="color-info">
                  <div class="color-info-left">
                    <div class="color-brand">定制颜色</div>
                    <!-- <div class="color-model">RAL9003</div> -->
                  </div>
                  <div class="color-price">
                    <img src="@/assets/img/icon/Group1.png" alt="coin" />
                  </div>
                </div>
              </div>
            </div>
            <div class="section-title">LOGO定制</div>
            <div class="logo-grid">
              <div class="logo-item">
                <div class="logo-image"></div>
                <div class="logo-info">
                  <div class="logo-info-left">
                    <div class="logo-brand">无logo</div>
                  </div>
                  <div class="logo-price">
                    <!-- <img src="@/assets/img/icon/Group1.png" alt="coin" /> -->
                  </div>
                </div>
              </div>
              <div class="logo-item">
                <div
                  class="logo-image"
                  :style="{ backgroundImage: `url(${logo1})` }"
                ></div>
                <div class="logo-info">
                  <div class="logo-info-left">
                    <div class="logo-brand">翼菲logo</div>
                  </div>
                  <div class="logo-price">
                    <!-- <img src="@/assets/img/icon/Group1.png" alt="coin" /> -->
                  </div>
                </div>
              </div>
              <div class="logo-item">
                <div class="logo-image">
                  <div class="logo-picker-text">点击定制logo</div>
                </div>
                <div class="logo-info">
                  <div class="logo-info-left">
                    <div class="logo-brand">定制logo</div>
                  </div>
                  <div class="logo-price">
                    <img src="@/assets/img/icon/Group1.png" alt="coin" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="select-module-title">前体壳组件</div>
          <div class="select-module-grid">
            <div class="section-title">急停按钮</div>
            <div class="motor-grid">
              <div class="motor-item">
                <span class="motor-name">自复位</span>
                <img src="@/assets/img/icon/Group1.png" alt="" />
              </div>
            </div>
            <div class="section-title">调试接口</div>
            <div class="motor-grid">
              <div class="motor-item">
                <span class="motor-name">无</span>
                <img src="@/assets/img/icon/Group1.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="config-footer">
      <button class="prev-button" v-if="activeTab !== 1" @click="prevStep">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button class="next-button" v-if="activeTab !== 3" @click="nextStep">
        {{ tabs[activeTab].label }} >
      </button>
      <button class="next-button" v-if="activeTab == 3" @click="submitRobot">
        总览 >
      </button>
    </div>
    
    

    <!-- 自定义弹框 -->
    <CustomDialog
      v-model="showDialog"
      :title="dialogTitle"
      @submit="handleDialogSubmit"
    />

    <!-- 颜色定制弹框 -->
    <ColorCustomDialog v-model="showColorDialog" @submit="handleColorSubmit" />

    <!-- 用户信息填写弹框 -->
    <UserInfoDialog
      v-model="showUserInfoDialog"
      @submit="handleUserInfoSubmit"
    />

    <!-- 下载弹框 -->
    <DownloadDialog
      v-model="showDownloadDialog"
      :config-data="robotConfig"
      @download="handleDownload"
    />
  </div>
</template>

<script>
import logo1 from "@/assets/img/common/logo2.png";
import CustomDialog from "./CustomDialog.vue";
import ColorCustomDialog from "./ColorCustomDialog.vue";
import UserInfoDialog from "./UserInfoDialog.vue";
import DownloadDialog from "./DownloadDialog.vue";

export default {
  name: "RobotConfigPanel",
  components: {
    CustomDialog,
    ColorCustomDialog,
    UserInfoDialog,
    DownloadDialog,
  },
  data() {
    return {
      showOverlay: true, // 初始显示遮罩层
      activeTab: 1,
      selectedController: "xian-gong",
      color1: "#303030",
      logo1: logo1,
      showDialog: false,
      dialogTitle: "弹窗标题",
      showColorDialog: false,
      showUserInfoDialog: false,
      showDownloadDialog: false,
      robotConfig: {},
      tabs: [
        { key: 1, label: "控制器和雷达" },
        { key: 2, label: "元器件" },
        { key: 3, label: "外观模块" },
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
    // 使用AI推荐
    useAIRecommendation() {
      this.$router.push('/aiRecommendation');
    },
    
    // 使用自定义配置
    useCustomConfig() {
      this.showOverlay = false;
      console.log('显示自定义配置页面');
    },
    
    selectController(controllerId) {
      this.selectedController = controllerId;
      if (controllerId === "other") {
        this.dialogTitle = "其他选项配置";
        this.showDialog = true;
      }
    },
    // 提交
    submitRobot() {
      this.showUserInfoDialog = true;
    },
    nextStep() {
      // 切换到下一个标签页或执行下一步操作
      if (this.activeTab === 1) {
        this.activeTab = 2;
      } else if (this.activeTab === 2) {
        this.activeTab = 3;
      }
    },
    prevStep() {
      if (this.activeTab === 2) {
        this.activeTab = 1;
      } else if (this.activeTab === 3) {
        this.activeTab = 2;
      }
    },
    // 颜色选择
    colorPicker() {
      this.showColorDialog = true;
    },
    // 弹框提交
    handleDialogSubmit(data) {
      console.log("弹框提交的数据:", data);
      // 这里可以处理提交的数据，比如发送到服务器
      this.$message.success("配置已保存");
    },
    // 颜色定制提交
    handleColorSubmit(data) {
      console.log("颜色定制数据:", data);
      // 处理颜色定制数据
      if (data.rgba) {
        // 如果输入了RGBA，更新颜色值
        this.color1 = data.rgba;
      }
      this.$message.success("颜色配置已保存");
    },
    // 用户信息提交
    handleUserInfoSubmit(data) {
      console.log("用户信息提交数据:", data);
      // 处理用户信息提交数据
      this.$message.success("用户信息提交成功");

      // 收集当前机器人配置数据
      this.robotConfig = {
        selectedController: this.selectedController,
        color: this.color1,
        logo: this.logo1,
        userInfo: data,
        timestamp: new Date().toISOString(),
      };

      // 显示下载弹框
      this.showDownloadDialog = true;
    },
    // 处理下载
    handleDownload(data) {
      console.log("下载配置单:", data);
      // 这里可以实现实际的下载逻辑
      // 比如生成PDF文件并下载
      this.$message.success("配置单下载完成");
    },
  },
};
</script>

<style lang="less" scoped>
@import "./RobotConfigPanel.less";
</style>
