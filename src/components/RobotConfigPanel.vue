<template>
  <div class="robot-config-panel">
    <!-- 初始遮罩层 -->
    <div
      v-if="showOverlay && !isEdit && compareSorce == 0"
      class="overlay-mask"
    >
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
        <h2 class="robot-title" @click="goRobotDetail">
          {{ title }}
          <!-- <i class="el-icon-arrow-right"></i> -->
        </h2>
        <span class="ai-recommend" @click="useAIRecommendation">AI 推荐</span>
      </div>
      <!-- 导航标签 -->
      <div class="config-tabs">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.id"
          :class="['tab-item', { active: activeTabTitle == tab.title }]"
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
      <div
        v-if="
          activeTabTitle === '控制器与雷达' || activeTabTitle === '控制器和雷达'
        "
        class="config-section"
      >
        <!-- 控制器部分 -->
        <div v-for="controller in controllers" :key="controller.id">
          <div class="section-title">{{ controller.title }}</div>
          <div class="controller-grid">
            <div
              v-for="item in controller.producntInfos"
              :key="item.id"
              :class="['controller-item', { selected: item.selected }]"
              @click="selectController(item.id, item)"
            >
              <el-tooltip
                v-if="
                  item.title === '其他' &&
                  item.other &&
                  (item.other.image || item.other.notes)
                "
                placement="left"
                effect="dark"
              >
                <div class="controller-image">
                  <img
                    :src="item.thumb || vuex_avatar_default"
                    alt="controller"
                  />
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
                <div
                  slot="content"
                  v-html="getTooltipContent(item.other)"
                ></div>
              </el-tooltip>
              <template v-else>
                <div class="controller-image">
                  <img
                    :src="item.thumb || vuex_avatar_default"
                    alt="controller"
                  />
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
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 元器件标签页 -->
      <div v-if="activeTabTitle === '元器件'" class="config-section">
        <div v-for="item in controllers" :key="item.id">
          <div class="section-title">{{ item.title }}</div>
          <div class="motor-grid" v-if="!item.child">
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
          <div v-else>
            <div v-for="item2 in item.child" :key="item2.id">
              <div class="section-title">{{ item2.title }}</div>
              <div class="motor-grid" v-if="!item2.child">
                <div
                  v-for="item3 in item2.producntInfos"
                  :key="item3.id"
                  :class="['motor-item', { selected: item3.selected }]"
                  @click="selectMotor(item3.id)"
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

      <!-- 外观模块标签页 -->
      <div v-if="activeTabTitle === '外观模块'" class="config-section">
        <div class="select-module">
          <div v-for="item in controllers" :key="item.id">
            <div class="select-module-title">{{ item.title }}</div>
            <div class="select-module-grid" v-if="item.title == '外壳'">
              <div v-for="item2 in item.child" :key="item2.id">
                <div class="section-title">{{ item2.title }}</div>
                <div class="color-grid" v-if="item2.title == '颜色'">
                  <div
                    v-for="item3 in item2.producntInfos"
                    :key="item3.id"
                    :class="['color-item', { selected: item3.selected }]"
                    @click="selectAppearanceItem(item3.id)"
                  >
                    <el-tooltip
                      v-if="
                        item3.title.includes('定制') &&
                        item3.other &&
                        (item3.other.image || item3.other.notes)
                      "
                      placement="left"
                      effect="dark"
                    >
                      <div
                        slot="content"
                        v-html="getColorTooltipContent(item3.other)"
                      ></div>
                      <div>
                        <div
                          class="color-image"
                          :style="{ backgroundColor: color1 }"
                          @click="colorPicker(item3)"
                        >
                          <div class="color-picker-text">点击定制颜色</div>
                        </div>
                        <div class="color-info">
                          <div class="color-info-left">
                            <div class="color-brand">{{ item3.title }}</div>
                            <div class="color-model">
                              {{ item3.description }}
                            </div>
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
                    </el-tooltip>
                    <template v-else>
                      <div
                        class="color-image"
                        v-if="!item3.title.includes('定制')"
                      ></div>
                      <div
                        class="color-image"
                        :style="{ backgroundColor: color1 }"
                        v-else
                        @click="colorPicker(item3)"
                      >
                        <div class="color-picker-text">点击定制颜色</div>
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
                    </template>
                  </div>
                </div>

                <div
                  class="logo-grid"
                  v-if="item2.title == 'logo定制' || item2.title == 'Logo定制'"
                >
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
                    <el-tooltip
                      v-if="
                        item3.title.includes('定制') &&
                        item3.other &&
                        (item3.other.image || item3.other.notes)
                      "
                      placement="left"
                      effect="dark"
                    >
                      <div
                        slot="content"
                        v-html="getTooltipContent(item3.other)"
                      ></div>
                      <div
                        class="logo-image"
                        v-if="item3.title === '定制logo'"
                        @click="logoPicker(item3)"
                      >
                        <img
                          :src="item3.other.image"
                          alt=""
                          v-if="item3.other.image"
                        />
                        <div class="logo-picker-text" v-else>点击定制logo</div>
                      </div>
                    </el-tooltip>
                    <template v-else>
                      <div
                        class="logo-image"
                        v-if="item3.title === '定制logo'"
                        @click="logoPicker(item3)"
                      >
                        <img
                          :src="item3.other.image"
                          alt=""
                          v-if="item3.other.image"
                        />
                        <div class="logo-picker-text" v-else>点击定制logo</div>
                      </div>
                    </template>
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
      <button class="prev-button" v-if="activeTab !== 0" @click="prevStep">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button
        class="next-button"
        v-if="activeTab < tabs.length - 1"
        @click="nextStep"
      >
        {{ activeTabTitle }} >
      </button>
      <button
        class="next-button"
        v-if="activeTab == tabs.length - 1 && compareSorce == 0"
        @click="submitRobot"
      >
        总览 >
      </button>
      <button
        class="next-button"
        v-if="activeTab == tabs.length - 1 && compareSorce != 0"
        @click="compareRobot"
      >
        对比 >
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
      ref="customDialog"
      v-model="showDialog"
      :title="dialogTitle"
      @submit="handleDialogSubmit"
    />

    <!-- 颜色定制弹框 -->
    <ColorCustomDialog
      ref="colorCustomDialog"
      v-model="showColorDialog"
      :item="currentOtherItem"
      @submit="handleColorSubmit"
    />

    <!-- 隐藏的文件输入元素 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileUpload"
    />
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
      activeTab: 0, // 当前激活的标签页
      color1: "#303030", // 颜色
      logo1: logo1, // logo
      showDialog: false, // 自定义配置弹框
      dialogTitle: "弹窗标题", // 弹窗标题
      showColorDialog: false, // 颜色定制弹框
      robotConfig: {}, // 机器人配置
      tabs: [], // 标签页
      controllers: [], // 控制器
      activeTabTitle: "", // 当前激活的标签页标题
      currentOtherItem: null, // 当前选中的"其他"选项
      compareSorce: 0, // 对比来源 0:无, 1:性价比优先, 2:配置均衡, 3:性能优先
    };
  },
  watch: {
    detail() {
      this.showOverlay = this.$route.query.showOverlay == 'false' ? false : true;
      this.compareSorce = this.$route.query.compare || 0;
      this.editIndex = this.$route.query.index || 0;
      this.tabs = this.detail;
      this.controllers = this.tabs[this.editIndex].child;
      this.activeTabTitle = this.tabs[this.editIndex || 0]
        ? this.tabs[this.editIndex || 0].title
        : this.tabs[this.editIndex || 0].title;
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
      if (this.tabs && this.tabs.length > 0) {
        this.tabs.forEach((tab) => {
          // 递归处理所有层级的 producntInfos
          this.initializeProducntInfos(tab);
        });
      }
    },

    // 递归初始化 producntInfos 的辅助方法
    initializeProducntInfos(item) {
      // 如果当前项有 producntInfos，则初始化它们
      if (item.producntInfos && Array.isArray(item.producntInfos)) {
        item.producntInfos.forEach((product) => {
          this.$set(product, "selected", false);
          if (product.title === "其他" || product.title.includes("定制")) {
            this.$set(product, "other", {
              image: null,
              notes: null,
              brand: null,
            });
          }
        });
      }

      // 如果当前项有子项，递归处理子项
      if (item.child && Array.isArray(item.child)) {
        item.child.forEach((child) => {
          this.initializeProducntInfos(child);
        });
      }
    },

    // 使用AI推荐
    useAIRecommendation() {
      this.$router.push("/aiRecommendation?id=" + this.id);
    },

    goRobotDetail() {
      // this.$router.push("/robotDetail?id=" + this.id);
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
        if (controller.child) {
          controller.child.forEach((child) => {
            if (child.producntInfos) {
              const targetItem = child.producntInfos.find(
                (item) => item.id === motorId
              );
              if (targetItem) {
                child.producntInfos.forEach((item) => {
                  this.$set(item, "selected", false);
                });
                this.$set(targetItem, "selected", true);
              }
            }
          });
        } else if (controller.producntInfos) {
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
    selectController(controllerId, item) {
      let targetItem = null;

      // 找到当前控制器所在的组，只在该组内进行单选
      this.controllers.forEach((controller) => {
        if (controller.producntInfos) {
          // 检查当前点击的item是否在这个组中
          const foundItem = controller.producntInfos.find(
            (item) => item.id === controllerId
          );
          if (foundItem) {
            targetItem = foundItem; // 保存找到的item
            // 先取消当前组内所有item的选中状态
            controller.producntInfos.forEach((item) => {
              this.$set(item, "selected", false);
            });

            // 然后选中当前点击的控制器
            this.$set(targetItem, "selected", true);
          }
        }
      });

      if (item.title === "其他" || item.title === "其他配件") {
        this.currentOtherItem = targetItem; // 保存当前选中的"其他"选项
        this.dialogTitle = "其他选项配置";
        this.showDialog = true;

        // 如果有已保存的数据，回显到弹框中
        this.$nextTick(() => {
          if (this.$refs.customDialog && targetItem.other) {
            this.$refs.customDialog.setFormData(targetItem.other);
          }
        });
      }
    },

    // 选择外观模块item
    selectAppearanceItem(itemId) {
      let targetItem = null; // 提升到方法最开始

      // 找到对应的item并切换选中状态
      this.controllers.forEach((controller) => {
        if (controller.child) {
          controller.child.forEach((child) => {
            if (child.producntInfos) {
              // 检查当前点击的item是否在这个子组中
              const foundItem = child.producntInfos.find(
                (item) => item.id === itemId
              );
              if (foundItem) {
                targetItem = foundItem; // 保存找到的item
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

      // 如果是"其他"选项，打开弹框
      if (
        targetItem &&
        (targetItem.title === "其他" || targetItem.title === "其他配件")
      ) {
        this.currentOtherItem = targetItem; // 保存当前选中的"其他"选项
        this.dialogTitle = "其他选项配置";
        this.showDialog = true;

        // 如果有已保存的数据，回显到弹框中
        this.$nextTick(() => {
          if (this.$refs.customDialog && targetItem.other) {
            this.$refs.customDialog.setFormData(targetItem.other);
          }
        });
      }
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
                          if (
                            targetItem.title === "其他" ||
                            targetItem.title.includes("定制")
                          ) {
                            this.$set(targetItem, "other", savedItem.other);
                          }
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
                        if (
                          targetItem.title === "其他" ||
                          targetItem.title.includes("定制")
                        ) {
                          this.$set(targetItem, "other", savedItem.other);
                        }
                      }
                    }
                  }
                }
              }
            });
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
    /**
     * 对比机器人
     */
    compareRobot() {
      // 生成指定格式的数据
      const formattedData = this.generateFormattedData();
      console.log("格式化后的数据:", formattedData);
      // 存储到localStorage
      localStorage.setItem("robotConfig", JSON.stringify(formattedData));
      // 跳转到对比页面
      this.$router.push("/aiRecommendation?id=" + this.id + "&compare=" + this.compareSorce);
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
                    other: item.other,
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
                        other: item.other,
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
                            other: item.other,
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
        this.activeTab = this.tabs.length - 1;
      }

      this.activeTabTitle = this.tabs[this.activeTab]
        ? this.tabs[this.activeTab].title
        : this.tabs[this.activeTab].title;
      this.controllers = this.tabs[this.activeTab].child;
    },
    prevStep() {
      if (this.activeTab > 0) {
        this.activeTab--;
      } else {
        this.activeTab = 0;
      }

      this.activeTabTitle = this.tabs[this.activeTab].title;
      this.controllers = this.tabs[this.activeTab].child;
    },
    selectTab(tab, index) {
      this.activeTab = index;
      this.activeTabTitle = this.tabs[this.activeTab].title;
      this.controllers = this.tabs[this.activeTab].child;
    },
    // 颜色选择
    colorPicker(item) {
      this.currentOtherItem = item;
      this.$refs.colorCustomDialog.setFormData(item.other);
      this.showColorDialog = true;
    },

    // Logo选择（文件上传）
    logoPicker(item) {
      this.currentOtherItem = item;
      this.showDialog = true;
      this.dialogTitle = "Logo定制";
      this.$refs.customDialog.setFormData(item.other);
      // 触发文件选择
      // this.$refs.fileInput.click();
    },

    // 处理文件上传
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 检查文件类型
      if (!file.type.startsWith("image/")) {
        this.$message.error("请选择图片文件");
        return;
      }

      // 检查文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error("图片大小不能超过5MB");
        return;
      }

      // 显示上传中提示
      const loading = this.$loading({
        lock: true,
        text: "正在上传Logo...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      // 创建FormData对象
      const formData = new FormData();
      formData.append("file", file);

      // 调用上传接口
      this.$axios
        .post("https://yifei.dx.hdapp.com.cn/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token") || "",
          },
        })
        .then((response) => {
          loading.close();
          console.log(response);

          if (response.code === 200 && response.data && response.data.path) {
            // 上传成功，将图片路径保存到当前选中项的other.image中
            if (this.currentOtherItem) {
              this.$set(this.currentOtherItem, "other", {
                ...this.currentOtherItem.other,
                image: response.data.path,
              });
              this.$message.success("Logo上传成功");
            }
          } else {
            this.$message.error(
              "上传失败：" + (response.message || "未知错误")
            );
          }
        })
        .catch((error) => {
          loading.close();
          console.error("上传失败:", error);
          this.$message.error("上传失败，请重试");
        });

      // 清空input的值，以便可以重复选择同一个文件
      event.target.value = "";
    },

    // 弹框提交
    handleDialogSubmit(data) {
      // 将弹框数据赋值到当前选中的"其他"选项的other对象中
      if (this.currentOtherItem) {
        this.$set(this.currentOtherItem, "other", {
          notes: data.notes || null,
          brand: data.brand || null,
          image:
            data.images && data.images.length > 0 ? data.images[0].url : null,
        });

        console.log("已更新other对象:", this.currentOtherItem.other);
        // this.$message.success("其他选项配置已保存");
      }

      // 重置当前选中的"其他"选项
      this.currentOtherItem = null;
    },

    // 颜色定制提交
    handleColorSubmit(data) {
      console.log("颜色定制数据:", data);
      // 处理颜色定制数据
      this.$set(this.currentOtherItem, "other", {
        notes: data || null,
        brand: null,
        image: null,
      });
      // this.$message.success("颜色配置已保存");
    },

    editConfirm() {
      const formattedData = this.generateFormattedData();
      console.log("格式化后的数据:", formattedData);
      // 存储到localStorage
      localStorage.setItem("robotConfig", JSON.stringify(formattedData));
      // this.$message.success("修改成功");
      this.$router.push("/rebotPreview?id=" + this.id);
    },
    editCancel() {
      this.$router.push("/rebotPreview?id=" + this.id);
    },

    getTooltipContent(other) {
      if (!other) return "";

      let content = '<div class="tooltip-content">';
      // 如果有备注，添加备注信息
      if (other.notes) {
        content += `<div class="tooltip-notes" style="font-size: 12px; color: #ccc; margin-bottom: 4px;">备注: ${other.notes}</div>`;
      }
      // 如果有图片，添加图片信息
      if (other.image) {
        content += `<img src="${other.image}" class="tooltip-image" style="max-width: 200px; max-height: 150px; border-radius: 4px; margin-bottom: 8px;" />`;
      }

      // 如果有品牌信息，添加品牌信息
      if (other.brand) {
        content += `<div class="tooltip-brand">品牌: ${other.brand}</div>`;
      }

      content += "</div>";
      return content;
    },
    getColorTooltipContent(other) {
      if (!other) return "";

      let content = '<div class="tooltip-content">';
      // 如果有备注，添加备注信息
      if (other.notes) {
        content += `<div class="tooltip-notes" style="font-size: 12px; color: #ccc; margin-bottom: 4px;">
            <p style="margin-bottom: 4px;">潘通色号: ${other.notes.pantone}</p>
            <p style="margin-bottom: 4px;">劳尔色号: ${other.notes.ral}</p>
            <p>RGBA色彩: ${other.notes.rgba}</p>
          </div>`;
      }
      content += "</div>";
      return content;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./RobotConfigPanel.less";
</style>
