<template>
  <div class="ai-recommendation">
    <!-- 顶部导航 -->
    <div class="ai-header">
      <button class="back-btn" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        返回
      </button>
      <h1 class="product-title">
        {{ compareSorce == 0 ? "AI推荐" : "对比配置" }} （{{ productName }}）
      </h1>
      <div class="progress-indicator"></div>
    </div>

    <!-- 三个配置板块 -->
    <div class="config-panels" v-if="compareSorce == 0">
      <!-- 性价比优先 -->
      <div class="config-panel">
        <div class="panel-header">
          <div class="panel-title">
            性价比优先
            <img
              src="@/assets/img/icon/success.png"
              alt=""
              @click.stop="selectProduct('cost-effective', 1)"
            />
            <div class="compare-btn" @click.stop="compare(1)">对比</div>
          </div>
        </div>

        <div class="panel-content">
          <ComponentList :components="select1" />
        </div>
      </div>

      <!-- 配置均衡 -->
      <div class="config-panel">
        <div class="panel-header">
          <div class="panel-title">
            配置均衡
            <img
              src="@/assets/img/icon/success.png"
              alt=""
              @click.stop="selectProduct('balanced', 2)"
            />
            <div class="compare-btn" @click.stop="compare(2)">对比</div>
          </div>
        </div>

        <div class="panel-content">
          <ComponentList :components="select2" />
        </div>
      </div>

      <!-- 性能优先 -->
      <div class="config-panel">
        <div class="panel-header">
          <div class="panel-title">
            性能优先
            <img
              src="@/assets/img/icon/success.png"
              alt=""
              @click.stop="selectProduct('performance', 3)"
            />
            <div class="compare-btn" @click.stop="compare(3)">对比</div>
          </div>
        </div>

        <div class="panel-content">
          <ComponentList :components="select3" />
        </div>
      </div>
    </div>
    <div class="config-panels panel-compare" v-else>
      <div class="config-panel">
        <div class="panel-header">
          <div class="panel-title">
            AI配置
            <img
              src="@/assets/img/icon/success.png"
              alt=""
              @click.stop="selectProduct('', compareSorce)"
            />
          </div>
        </div>

        <div class="panel-content">
          <ComponentList :components="selectCompare" />
        </div>
      </div>
      <div class="config-panel">
        <div class="panel-header">
          <div class="panel-title">
            我的配置
            <img
              src="@/assets/img/icon/success.png"
              alt=""
              @click.stop="resetMyConfig()"
            />
          </div>
        </div>

        <div class="panel-content">
          <div class="components-list">
            <div v-for="(item, index) in myConfig" :key="index">
              <div class="component-item-title">{{ item.firstTitle }}</div>

              <div class="component-item my-config-item">
                <template v-if="item.image">
                  <div class="component-icon">
                    <img :src="item.image" alt="" />
                  </div>
                  <div class="component-info">
                    <div class="component-name">
                      {{ item.name }}
                    </div>
                    <div class="component-leadtime">
                      {{ item.model }}
                    </div>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill">
                      <div class="progress-bar-container">
                        <div class="progress-bar-track">
                          <div
                            class="progress-bar-fill"
                            :style="{
                              width:
                                (item.progress * 20 > 100
                                  ? 100
                                  : item.progress * 20) + '%',
                            }"
                          >
                            <span class="progress-slider"> </span>
                          </div>
                        </div>
                        <div class="progress-label">
                          {{ item.delivery_title }}
                        </div>
                      </div>
                    </div>
                    <div class="coin-icon">
                      <img
                        src="@/assets/img/icon/Group1.png"
                        alt="price"
                        class="price-icon"
                        v-if="item.price_status == 1"
                      />
                      <img
                        src="@/assets/img/icon/Group2.png"
                        alt="price"
                        class="price-icon"
                        v-if="item.price_status == 2"
                      />
                      <img
                        src="@/assets/img/icon/Group3.png"
                        alt="price"
                        class="price-icon"
                        v-if="item.price_status == 3"
                      />
                      <img
                        src="@/assets/img/icon/Group4.png"
                        alt="price"
                        class="price-icon"
                        v-if="item.price_status == 4"
                      />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="component-info">
                    <div class="component-name">
                      {{ item.name }} {{ item.model }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
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
      compareSorce: 0, // 对比来源 0:无, 1:性价比优先, 2:配置均衡, 3:性能优先
      productName: "", // 产品名称
      myConfig: [], // 我的配置
      select1: [],
      select2: [],
      select3: [],
      // 存储完整的原始数据结构
      fullData1: [],
      fullData2: [],
      fullData3: [],
    };
  },
  computed: {
    selectCompare() {
      return this.compareSorce == 1
        ? this.select1
        : this.compareSorce == 2
        ? this.select2
        : this.select3;
    },
  },
  mounted() {
    this.compareSorce = this.$route.query.compare || 0;
    this.setView();
    if (this.compareSorce != 0) {
      this.setMyConfig();
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
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
        this.fullData1 = res.data.lists; // 保存完整数据结构
        this.select1 = res.data.lists.map((item) => item.child).flat();
        this.productName = res.data.info.title;
      });
      this.$api({
        url: "getProductAiSetting",
        method: "post",
        data: {
          id: this.$route.query.id,
          sorce: 2,
        },
      }).then((res) => {
        this.fullData2 = res.data.lists; // 保存完整数据结构
        this.select2 = res.data.lists.map((item) => item.child).flat();
        this.productName = res.data.info.title;
      });
      this.$api({
        url: "getProductAiSetting",
        method: "post",
        data: {
          id: this.$route.query.id,
          sorce: 3,
        },
      }).then((res) => {
        this.fullData3 = res.data.lists; // 保存完整数据结构
        this.select3 = res.data.lists.map((item) => item.child).flat();
        this.productName = res.data.info.title;
      });
    },

    // 选择产品
    selectProduct(panelType, sorce) {
      // 根据 panelType 选择对应的数据源
      let selectData = [];
      if (panelType === "cost-effective" || sorce == 1) {
        selectData = this.fullData1;
      } else if (panelType === "balanced" || sorce == 2) {
        selectData = this.fullData2;
      } else if (panelType === "performance" || sorce == 3) {
        selectData = this.fullData3;
      }

      // 生成格式化的数据，参考 RobotConfigPanel.vue 的 generateFormattedData 方法
      const formattedData = this.generateFormattedData(selectData);

      // console.log("格式化后的数据:", formattedData);

      // 存储到 localStorage
      localStorage.setItem("robotConfig", JSON.stringify(formattedData));

      // 跳转到预览页面
      this.$router.push({
        path: "/",
        query: {
          id: this.$route.query.id,
          showOverlay: "false",
        },
      });
    },

    resetMyConfig() {
      this.$router.push({
        path: "/",
        query: {
          id: this.$route.query.id,
          showOverlay: "false",
        },
      });
    },

    // 生成格式化数据（参考 RobotConfigPanel.vue 的 generateFormattedData 方法）
    generateFormattedData(tabs) {
      const result = [];

      // 直接遍历 tabs 数组
      tabs.forEach((tab) => {
        if (tab.child && Array.isArray(tab.child)) {
          // 第一层循环：遍历标签页的子项
          tab.child.forEach((firstLevel) => {
            // 检查第一层是否有 producntInfos（只有二级的情况）
            if (
              firstLevel.producntInfos &&
              Array.isArray(firstLevel.producntInfos)
            ) {
              firstLevel.producntInfos.forEach((item) => {
                result.push({
                  product_type_id: tab.id || tab.title,
                  product_type_two_id: firstLevel.id || firstLevel.title,
                  product_type_three_id: "",
                  product_type_goods_ids: item.id,
                  other: item.other,
                });
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
                    result.push({
                      product_type_id: tab.id || tab.title,
                      product_type_two_id: firstLevel.id || firstLevel.title,
                      product_type_three_id:
                        secondLevel.id || secondLevel.title,
                      product_type_goods_ids: item.id,
                      other: item.other,
                    });
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
                        result.push({
                          product_type_id: tab.id || tab.title,
                          product_type_two_id:
                            firstLevel.id || firstLevel.title,
                          product_type_three_id:
                            secondLevel.id || secondLevel.title,
                          product_type_goods_ids: item.id,
                          other: item.other,
                        });
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
    /**
     * 对比配置
     * @param sorce 1:性价比优先, 2:配置均衡, 3:性能优先
     */
    compare(sorce) {
      // 重置localStorage中的robotConfig
      localStorage.removeItem("robotConfig");
      this.$router.push({
        path: "/",
        query: {
          id: this.$route.query.id,
          compare: sorce, // 1:性价比优先, 2:配置均衡, 3:性能优先
        },
      });
    },
    /**
     * 设置我的配置
     */
    setMyConfig() {
      // 获取localStorage中的robotConfig
      const savedConfig = localStorage.getItem("robotConfig");
      // 获取全部配置信息
      this.$api({
        url: "getProductSetting",
        method: "get",
        data: {
          id: this.$route.query.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          // 遍历接口返回的数组，找到选中值的原数据
          this.configItems = this.findSelectedItems(
            res.data.lists,
            JSON.parse(savedConfig)
          );
          console.log(this.configItems);
          this.myConfig = this.configItems;
        }
      });
    },
    // 查找选中项的原数据
    findSelectedItems(apiConfigItems, localStorageData) {
      const selectedItems = [];
      // 遍历接口返回的配置项数组
      if (Array.isArray(apiConfigItems)) {
        apiConfigItems.forEach((tab, index) => {
          if (tab.child && Array.isArray(tab.child)) {
            // 遍历第一层子项
            tab.child.forEach((firstLevel) => {
              // 检查第一层是否有 producntInfos
              if (
                firstLevel.producntInfos &&
                Array.isArray(firstLevel.producntInfos)
              ) {
                firstLevel.producntInfos.forEach((item) => {
                  // 在localStorage中查找匹配的选中项
                  const matchedItem = localStorageData.find(
                    (localItem) => localItem.product_type_goods_ids === item.id
                  );

                  if (matchedItem) {
                    selectedItems.push({
                      activeTab: index,
                      firstTitle: firstLevel.title,
                      id: item.id,
                      name: item.title,
                      model: item.description,
                      image: item.thumb,
                      params:
                        item.title == "其他"
                          ? matchedItem.other.notes
                          : item.spec,
                      progress: item.delivery_time,
                      price_status: item.price_status,
                      delivery_title: item.delivery_title,
                    });
                  }
                });
              }

              // 遍历第二层子项
              if (firstLevel.child && Array.isArray(firstLevel.child)) {
                firstLevel.child.forEach((secondLevel) => {
                  if (
                    secondLevel.producntInfos &&
                    Array.isArray(secondLevel.producntInfos)
                  ) {
                    secondLevel.producntInfos.forEach((item) => {
                      // 在localStorage中查找匹配的选中项
                      const matchedItem = localStorageData.find(
                        (localItem) =>
                          localItem.product_type_goods_ids === item.id
                      );

                      if (matchedItem) {
                        selectedItems.push({
                          activeTab: index,
                          firstTitle: secondLevel.title,
                          id: item.id,
                          name: item.title,
                          model: item.description,
                          image: item.thumb,
                          params:
                            item.title == "其他"
                              ? matchedItem.other.notes
                              : item.spec,
                          progress: item.delivery_time,
                          price_status: item.price_status,
                          delivery_title: item.delivery_title,
                        });
                      }
                    });
                  }

                  // 遍历第三层子项
                  if (secondLevel.child && Array.isArray(secondLevel.child)) {
                    secondLevel.child.forEach((thirdLevel) => {
                      if (
                        thirdLevel.producntInfos &&
                        Array.isArray(thirdLevel.producntInfos)
                      ) {
                        thirdLevel.producntInfos.forEach((item) => {
                          // 在localStorage中查找匹配的选中项
                          const matchedItem = localStorageData.find(
                            (localItem) =>
                              localItem.product_type_goods_ids === item.id
                          );

                          if (matchedItem) {
                            selectedItems.push({
                              activeTab: index,
                              firstTitle: thirdLevel.title,
                              id: item.id,
                              name: item.title,
                              model: item.description,
                              image: item.thumb,
                              params:
                                item.title == "其他"
                                  ? matchedItem.other.notes
                                  : item.spec,
                              progress: item.delivery_time,
                              price_status: item.price_status,
                              delivery_title: item.delivery_title,
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
      }

      return selectedItems;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./aiRecommendation.less";
</style>
