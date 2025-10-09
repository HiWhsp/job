<template>
  <div class="robot-config-panel">
    <!-- 初始遮罩层 -->
    <div v-if="showOverlay && !isEdit" class="overlay-mask">
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
    <div class="config-header" v-if="!isEdit">
      <div class="config-header-left">
        <h2 class="robot-title">AI推荐（{{ title }}）</h2>
        <span class="ai-recommend" @click="useAIRecommendation">AI 推荐</span>
      </div>
      <!-- 导航标签 -->
      <div class="config-tabs">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.id"
          :class="['tab-item', { active: activeTab === tab.id }]"
          @click="selectTab(tab, index)"
        >
          {{ tab.title }}
        </div>
      </div>
    </div>
    <div class="config-header" v-if="isEdit">
      <div class="config-header-left">
        <h2 class="robot-title">更改{{ editTitle }}</h2>
        <i class="el-icon-close" @click="editCancel"></i>
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
              :class="['controller-item', { selected: item.selected }]"
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
              :class="['motor-item', { selected: item.selected }]"
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
                    :class="['color-item', { selected: item3.selected }]"
                    @click="selectAppearanceItem(item3.id)"
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
                    :class="{ selected: item3.selected }"
                    v-for="item3 in item2.producntInfos"
                    :key="item3.id"
                    @click="selectAppearanceItem(item3.id)"
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
            <template v-else>
              <div v-for="item2 in item.child" :key="item2.id">
                <div class="section-title">{{ item2.title }}</div>
                <div class="motor-grid">
                  <div
                    v-for="item3 in item2.producntInfos"
                    :key="item3.id"
                    :class="['motor-item', { selected: item3.selected }]"
                    @click="selectAppearanceItem(item3.id)"
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
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="config-footer" v-if="!isEdit">
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
    <div class="config-footer2" v-if="isEdit">
      <div class="config-footer2-left">
        <p>￥{{ price }}</p>
        <p>价格根据订货量和配置而不同</p>
      </div>
      <button class="next-button" @click="editConfirm">确认修改</button>
    </div>

    <!-- 自定义弹框 -->
    <CustomDialog
      v-model="showDialog"
      :title="dialogTitle"
      @submit="handleDialogSubmit"
    />

    <!-- 颜色定制弹框 -->
    <ColorCustomDialog v-model="showColorDialog" @submit="handleColorSubmit" />
  </div>
</template>

<script>
import logo1 from "@/assets/img/common/logo2.png";
import CustomDialog from "./CustomDialog.vue";
import ColorCustomDialog from "./ColorCustomDialog.vue";

export default {
  name: "RobotConfigPanel",
  props: {
    id: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
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
  },
  data() {
    return {
      isEdit: false, // 是否是编辑状态
      editTitle: "", // 编辑标题
      editIndex: 0, // 编辑索引
      showOverlay: true, // 初始显示遮罩层
      activeTab: 1, // 当前激活的标签页
      color1: "#303030", // 颜色
      logo1: logo1, // logo
      showDialog: false, // 自定义配置弹框
      dialogTitle: "弹窗标题", // 弹窗标题
      showColorDialog: false, // 颜色定制弹框
      robotConfig: {}, // 机器人配置
      tabs: [], // 标签页
      controllers: [], // 控制器
      activeTabTitle: "", // 当前激活的标签页标题
    };
  },
  watch: {
    detail() {
      this.editIndex = this.$route.query.index || 0;
      this.tabs = this.detail;
      this.controllers = this.tabs[this.editIndex].child;
      this.activeTabTitle = this.tabs[1]
        ? this.tabs[1].title
        : this.tabs[0].title;
      // 为所有item添加selected属性
      this.initializeSelectedState();
      // 加载本地保存的配置
      this.loadConfigFromStorage();

      this.isEdit = this.$route.query.edit == "true";

      this.editTitle = this.tabs[this.editIndex].title;
    },
  },
  methods: {
    // 初始化选中状态
    initializeSelectedState() {
      if (this.controllers && this.controllers.length > 0) {
        this.controllers.forEach((controller) => {
          if (controller.producntInfos) {
            controller.producntInfos.forEach((item) => {
              this.$set(item, "selected", false);
            });
          }
          if (controller.child) {
            controller.child.forEach((child) => {
              if (child.producntInfos) {
                child.producntInfos.forEach((item) => {
                  this.$set(item, "selected", false);
                });
              }
            });
          }
        });
      }
    },

    // 使用AI推荐
    useAIRecommendation() {
      this.$router.push("/aiRecommendation?id=" + this.id);
    },

    // 使用自定义配置
    useCustomConfig() {
      this.showOverlay = false;
      console.log("显示自定义配置页面");
    },

    // 选择电机
    selectMotor(motorId) {
      // 找到当前电机所在的组，只在该组内进行单选
      this.controllers.forEach((controller) => {
        if (controller.producntInfos) {
          // 检查当前点击的item是否在这个组中
          const targetItem = controller.producntInfos.find(
            (item) => item.id === motorId
          );
          if (targetItem) {
            // 先取消当前组内所有item的选中状态
            controller.producntInfos.forEach((item) => {
              this.$set(item, "selected", false);
            });

            // 然后选中当前点击的电机
            this.$set(targetItem, "selected", true);
          }
        }
      });
    },

    // 选择控制器
    selectController(controllerId) {
      // 找到当前控制器所在的组，只在该组内进行单选
      this.controllers.forEach((controller) => {
        if (controller.producntInfos) {
          // 检查当前点击的item是否在这个组中
          const targetItem = controller.producntInfos.find(
            (item) => item.id === controllerId
          );
          if (targetItem) {
            // 先取消当前组内所有item的选中状态
            controller.producntInfos.forEach((item) => {
              this.$set(item, "selected", false);
            });

            // 然后选中当前点击的控制器
            this.$set(targetItem, "selected", true);
          }
        }
      });

      if (controllerId === "other") {
        this.dialogTitle = "其他选项配置";
        this.showDialog = true;
      }
    },

    // 选择外观模块item
    selectAppearanceItem(itemId) {
      // 找到对应的item并切换选中状态
      this.controllers.forEach((controller) => {
        if (controller.child) {
          controller.child.forEach((child) => {
            if (child.producntInfos) {
              // 检查当前点击的item是否在这个子组中
              const targetItem = child.producntInfos.find(
                (item) => item.id === itemId
              );
              if (targetItem) {
                // 先取消当前子组内所有item的选中状态
                child.producntInfos.forEach((item) => {
                  this.$set(item, "selected", false);
                });

                // 然后选中当前点击的item
                this.$set(targetItem, "selected", true);
              }
            }
          });
        }
      });
    },

    // 从localStorage加载配置数据
    loadConfigFromStorage() {
      try {
        const savedConfig = localStorage.getItem("robotConfig");
        if (savedConfig) {
          const configData = JSON.parse(savedConfig);
          console.log("从localStorage加载配置数据:", configData);

          // 恢复选中的item状态 - 根据localStorage的数据结构进行匹配
          if (
            configData &&
            Array.isArray(configData) &&
            configData.length > 0
          ) {
            // 遍历保存的配置数据
            configData.forEach((savedItem) => {
              const productTypeId = savedItem.product_type_id;
              const productTypeTwoId = savedItem.product_type_two_id;
              const productTypeThreeId = savedItem.product_type_three_id;
              const productTypeGoodsIds = savedItem.product_type_goods_ids;

              // 找到对应的tab
              const targetTab = this.tabs.find(
                (tab) => tab.id && tab.id.toString() == productTypeId
              );

              if (
                targetTab &&
                targetTab.child &&
                Array.isArray(targetTab.child)
              ) {
                // 找到对应的二级分类
                const targetFirstLevel = targetTab.child.find(
                  (firstLevel) =>
                    (firstLevel.id &&
                      firstLevel.id.toString() == productTypeTwoId) ||
                    (firstLevel.title && firstLevel.title === productTypeTwoId)
                );

                if (targetFirstLevel) {
                  // 如果有三级分类
                  if (productTypeThreeId && productTypeThreeId !== "") {
                    if (
                      targetFirstLevel.child &&
                      Array.isArray(targetFirstLevel.child)
                    ) {
                      const targetSecondLevel = targetFirstLevel.child.find(
                        (secondLevel) =>
                          (secondLevel.id &&
                            secondLevel.id.toString() == productTypeThreeId) ||
                          (secondLevel.title &&
                            secondLevel.title === productTypeThreeId)
                      );

                      if (
                        targetSecondLevel &&
                        targetSecondLevel.producntInfos &&
                        Array.isArray(targetSecondLevel.producntInfos)
                      ) {
                        // 找到对应的商品并设置选中状态
                        const targetItem = targetSecondLevel.producntInfos.find(
                          (item) => item.id.toString() == productTypeGoodsIds
                        );
                        if (targetItem) {
                          this.$set(targetItem, "selected", true);
                        }
                      }
                    }
                  } else {
                    // 没有三级分类，直接在二级分类中查找
                    if (
                      targetFirstLevel.producntInfos &&
                      Array.isArray(targetFirstLevel.producntInfos)
                    ) {
                      const targetItem = targetFirstLevel.producntInfos.find(
                        (item) => item.id.toString() == productTypeGoodsIds
                      );
                      if (targetItem) {
                        this.$set(targetItem, "selected", true);
                      }
                    }
                  }
                }
              }
            });
          }

          // 恢复颜色和logo（如果configData中有这些字段）
          if (configData.color) {
            this.color1 = configData.color;
          }
          if (configData.logo) {
            this.logo1 = configData.logo;
          }

          // this.$message.success("已加载本地保存的配置");
        }
      } catch (error) {
        // console.error("加载配置数据失败:", error);
      }
    },
    // 提交
    submitRobot() {
      // 生成指定格式的数据
      const formattedData = this.generateFormattedData();
      console.log("格式化后的数据:", formattedData);
      // 存储到localStorage
      localStorage.setItem("robotConfig", JSON.stringify(formattedData));
      // this.$message.success("配置已保存到本地");


      this.$router.push("/rebotPreview?id=" + this.id);

    },

    // 生成指定格式的数据
    generateFormattedData() {
      const result = [];

      // 直接遍历 tabs 数组
      this.tabs.forEach((tab) => {
        if (tab.child && Array.isArray(tab.child)) {
          // 第一层循环：遍历标签页的子项
          tab.child.forEach((firstLevel) => {
            // 检查第一层是否有 producntInfos（只有二级的情况）
            if (
              firstLevel.producntInfos &&
              Array.isArray(firstLevel.producntInfos)
            ) {
              firstLevel.producntInfos.forEach((item) => {
                if (item.selected === true) {
                  result.push({
                    product_type_id: tab.id || tab.title,
                    product_type_two_id: firstLevel.id || firstLevel.title,
                    product_type_three_id: "",
                    product_type_goods_ids: item.id,
                    other: {
                      // image: item.thumb || "",
                      // notes: item.description || "",
                      // brand: item.title || "",
                    },
                  });
                }
              });
            }

            // 第二层循环：遍历第一层的子项
            if (firstLevel.child && Array.isArray(firstLevel.child)) {
              firstLevel.child.forEach((secondLevel) => {
                // 检查第二层是否有 producntInfos（三级的情况）
                if (
                  secondLevel.producntInfos &&
                  Array.isArray(secondLevel.producntInfos)
                ) {
                  secondLevel.producntInfos.forEach((item) => {
                    if (item.selected === true) {
                      result.push({
                        product_type_id: tab.id || tab.title,
                        product_type_two_id: firstLevel.id || firstLevel.title,
                        product_type_three_id:
                          secondLevel.id || secondLevel.title,
                        product_type_goods_ids: item.id,
                        other: {
                          // image: item.thumb || "",
                          // notes: item.description || "",
                          // brand: item.title || "",
                        },
                      });
                    }
                  });
                }

                // 第三层循环：遍历第二层的子项
                if (secondLevel.child && Array.isArray(secondLevel.child)) {
                  secondLevel.child.forEach((thirdLevel) => {
                    // 检查第三层是否有 producntInfos（四级的情况）
                    if (
                      thirdLevel.producntInfos &&
                      Array.isArray(thirdLevel.producntInfos)
                    ) {
                      thirdLevel.producntInfos.forEach((item) => {
                        if (item.selected === true) {
                          result.push({
                            product_type_id: tab.id || tab.title,
                            product_type_two_id:
                              firstLevel.id || firstLevel.title,
                            product_type_three_id:
                              secondLevel.id || secondLevel.title,
                            product_type_goods_ids: item.id,
                            other: {
                              // image: item.thumb || "",
                              // notes: item.description || "",
                              // brand: item.title || "",
                            },
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });

      return result;
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
    selectTab(tab, index) {
      this.activeTab = index + 1;
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
      // this.$message.success("配置已保存");
    },
    // 颜色定制提交
    handleColorSubmit(data) {
      console.log("颜色定制数据:", data);
      // 处理颜色定制数据
      if (data.rgba) {
        // 如果输入了RGBA，更新颜色值
        this.color1 = data.rgba;
      }
      // this.$message.success("颜色配置已保存");
    },
    // 用户信息提交
    handleUserInfoSubmit(data) {
      console.log("用户信息提交数据:", data);
      // 处理用户信息提交数据
      localStorage.setItem("robotUserInfo", JSON.stringify(data));
      this.$message.success("用户信息保存成功");
      // 跳转到机器人预览页面
      this.$router.push("/rebotPreview?id=" + this.id);
    },
    editConfirm() {
      const formattedData = this.generateFormattedData();
      console.log("格式化后的数据:", formattedData);
      // 存储到localStorage
      localStorage.setItem("robotConfig", JSON.stringify(formattedData));
      this.$message.success("修改成功");
      this.$router.push("/rebotPreview?id=" + this.id);
    },
    editCancel() {
      this.$router.push("/rebotPreview?id=" + this.id);
    },
  },
};
</script>

<style lang="less" scoped>
@import "./RobotConfigPanel.less";
</style>
