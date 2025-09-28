<template>
  <div class="robot-config-panel">
    <!-- 初始遮罩层 -->
    <div v-if="showOverlay" class="overlay-mask">
      <div class="overlay-content">
        <div class="overlay-buttons">
          <button
            class="overlay-btn ai-recommend-btn"
            @click="useAIRecommendation"
          >
            使用AI推荐
          </button>
          <button
            class="overlay-btn custom-config-btn"
            @click="useCustomConfig"
          >
            我自己选配
          </button>
        </div>
      </div>
    </div>

    <!-- 标题区域 -->
    <div class="config-header">
      <div class="config-header-left">
        <h2 class="robot-title">{{ title }}</h2>
        <span class="ai-recommend">AI 推荐</span>
      </div>
      <!-- 导航标签 -->
      <div class="config-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-item', { active: activeTab === tab.id }]"
        >
          {{ tab.title }}
        </div>
      </div>
    </div>

    <!-- 配置内容区域 -->
    <div class="config-content">
      <!-- 控制器和雷达标签页 -->
      <div v-if="activeTab === 1" class="config-section">
        <!-- 控制器部分 -->
        <div v-for="controller in controllers" :key="controller.id">
          <div class="section-title">{{ controller.title }}</div>
          <div class="controller-grid">
            <div
              v-for="item in controller.producntInfos"
              :key="item.id"
              :class="[
                'controller-item',
                { selected: selectedController == item.id },
              ]"
              @click="selectController(item.id)"
            >
              <div class="controller-image">
                <img :src="item.thumb" alt="controller" />
              </div>
              <div class="controller-info">
                <div class="controller-info-left">
                  <div class="controller-brand">{{ item.title }}</div>
                  <div class="controller-model">{{ item.description }}</div>
                </div>
                <div class="controller-price">
                  <img
                    src="@/assets/img/icon/Group1.png"
                    alt="coin"
                    v-if="item.price_status == '1'"
                  />
                  <img
                    src="@/assets/img/icon/Group2.png"
                    alt="coin"
                    v-if="item.price_status == '2'"
                  />
                  <img
                    src="@/assets/img/icon/Group3.png"
                    alt="coin"
                    v-if="item.price_status == '3'"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 元器件标签页 -->
      <div v-if="activeTab === 2" class="config-section">
        <div v-for="item in controllers" :key="item.id">
          <div class="section-title">{{ item.title }}</div>
          <div class="motor-grid">
            <div
              v-for="item in item.producntInfos"
              :key="item.id"
              :class="['motor-item', { selected: selectedMotor == item.id }]"
              @click="selectMotor(item.id)"

            >
              <span class="motor-name">{{ item.title }}</span>
              <img
                src="@/assets/img/icon/Group1.png"
                alt=""
                v-if="item.price_status == '1'"
              />
              <img
                src="@/assets/img/icon/Group2.png"
                alt=""
                v-if="item.price_status == '2'"
              />
              <img
                src="@/assets/img/icon/Group3.png"
                alt=""
                v-if="item.price_status == '3'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 外观模块标签页 -->
      <div v-if="activeTab === 3" class="config-section">
        <div class="select-module">
          <div v-for="item in controllers" :key="item.id">
            <div class="select-module-title">{{ item.title }}</div>
            <div class="select-module-grid" v-if="item.title == '外壳'">
              <div v-for="item2 in item.child" :key="item2.id">
                <div class="section-title">{{ item2.title }}</div>
                <div class="color-grid" v-if="item2.title !== 'Logo定制'">
                  <div
                    v-for="item3 in item2.producntInfos"
                    :key="item3.id"
                    class="color-item"
                  >
                    <div class="color-image" v-if="item3.spec !== '定制'"></div>
                    <div
                      class="color-image"
                      :style="{ backgroundColor: color1 }"
                      v-else
                    >
                      <div class="color-picker-text" @click="colorPicker">
                        点击定制颜色
                      </div>
                    </div>
                    <div class="color-info">
                      <div class="color-info-left">
                        <div class="color-brand">{{ item3.title }}</div>
                        <div class="color-model">{{ item3.description }}</div>
                      </div>
                      <div class="color-price">
                        <img
                          src="@/assets/img/icon/Group1.png"
                          alt="coin"
                          v-if="item3.price_status == '1'"
                        />
                        <img
                          src="@/assets/img/icon/Group2.png"
                          alt="coin"
                          v-if="item3.price_status == '2'"
                        />
                        <img
                          src="@/assets/img/icon/Group3.png"
                          alt="coin"
                          v-if="item3.price_status == '3'"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="logo-grid" v-if="item2.title == 'Logo定制'">
                  <div
                    class="logo-item"
                    v-for="item3 in item2.producntInfos"
                    :key="item3.id"
                  >
                    <div
                      class="logo-image"
                      v-if="item3.title === '无logo'"
                    ></div>
                    <div
                      class="logo-image"
                      :style="{ backgroundImage: `url(${logo1})` }"
                      v-if="item3.title === '翼菲logo'"
                    ></div>
                    <div class="logo-image" v-if="item3.title === '定制logo'">
                      <div class="logo-picker-text">点击定制logo</div>
                    </div>
                    <div class="logo-info">
                      <div class="logo-info-left">
                        <div class="logo-brand">{{ item3.title }}</div>
                      </div>
                      <div class="logo-price">
                        <img
                          src="@/assets/img/icon/Group1.png"
                          alt="coin"
                          v-if="item3.price_status == '1'"
                        />
                        <img
                          src="@/assets/img/icon/Group2.png"
                          alt="coin"
                          v-if="item3.price_status == '2'"
                        />
                        <img
                          src="@/assets/img/icon/Group3.png"
                          alt="coin"
                          v-if="item3.price_status == '3'"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-for="item2 in item.child" :key="item2.id">
              <div class="section-title">{{ item2.title }}</div>
              <div class="motor-grid">
                <div
                  v-for="item3 in item2.producntInfos"
                  :key="item3.id"
                  class="motor-item"
                >
                  <span class="motor-name">{{ item3.title }}</span>
                  <img
                    src="@/assets/img/icon/Group1.png"
                    alt=""
                    v-if="item3.price_status == '1'"
                  />
                  <img
                    src="@/assets/img/icon/Group2.png"
                    alt=""
                    v-if="item3.price_status == '2'"
                  />
                  <img
                    src="@/assets/img/icon/Group3.png"
                    alt=""
                    v-if="item3.price_status == '3'"
                  />
                </div>
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
      <button
        class="next-button"
        v-if="activeTab < tabs.length"
        @click="nextStep"
      >
        {{ activeTabTitle }} >
      </button>
      <button
        class="next-button"
        v-if="activeTab == tabs.length"
        @click="submitRobot"
      >
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
  props: {
    detail: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
  },
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
      selectedController: "",
      selectedMotor: "",
      color1: "#303030",
      logo1: logo1,
      showDialog: false,
      dialogTitle: "弹窗标题",
      activeTabTitle: "",
      showColorDialog: false,
      showUserInfoDialog: false,
      showDownloadDialog: false,
      robotConfig: {},
      tabs: [], // 标签页
      controllers: [], // 控制器
    };
  },
  watch: {
    detail() {
      this.tabs = this.detail;
      this.controllers = this.tabs[0].child;
      this.activeTabTitle = this.tabs[1]
        ? this.tabs[1].title
        : this.tabs[0].title;
    },
  },
  methods: {
    // 使用AI推荐
    useAIRecommendation() {
      this.$router.push("/aiRecommendation");
    },

    // 使用自定义配置
    useCustomConfig() {
      this.showOverlay = false;
      console.log("显示自定义配置页面");
    },

    selectMotor(motorId) {
      this.selectedMotor = motorId;
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
      if (this.activeTab <= this.tabs.length) {
        this.activeTab++;
      } else {
        this.activeTab = this.tabs.length;
      }

      this.activeTabTitle = this.tabs[this.activeTab]
        ? this.tabs[this.activeTab].title
        : this.tabs[this.activeTab - 1].title;
      this.controllers = this.tabs[this.activeTab - 1].child;
    },
    prevStep() {
      if (this.activeTab > 1) {
        this.activeTab--;
      } else {
        this.activeTab = 1;
      }

      this.activeTabTitle = this.tabs[this.activeTab].title;
      this.controllers = this.tabs[this.activeTab - 1].child;
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
