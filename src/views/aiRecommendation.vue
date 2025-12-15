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
          <ComponentList :components="myConfig" />
          <!-- <div class="components-list">
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
          </div> -->
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
      more: 0, // 是否是默认 0:否, 1:是
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
    this.more = this.$route.query.more || 0;
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
      // this.$router.push({
      //   path: "/",
      //   query: {
      //     id: this.$route.query.id,
      //     showOverlay: "false",
      //   },
      // });

      this.$router.push({
        path: "/rebotPreview",
        query: {
          id: this.$route.query.id,
        },
      });
    },

    resetMyConfig() {
      // localStorage.removeItem("robotConfig");
      this.$router.push({
        path: "/rebotPreview",
        query: {
          id: this.$route.query.id,
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
                            thirdLevel.id || thirdLevel.title,
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
      // 使用默认配置对比
      if (this.more == 1) {
        this.$router.push({
          path: "/aiRecommendation",
          query: {
            id: this.$route.query.id,
            compare: sorce, // 1:性价比优先, 2:配置均衡, 3:性能优先
          },
        });
        location.reload();
        return;
      } else {
        // 重置localStorage中的robotConfig
        localStorage.removeItem("robotConfig");
        this.$router.push({
          path: "/",
          query: {
            id: this.$route.query.id,
            compare: sorce, // 1:性价比优先, 2:配置均衡, 3:性能优先
          },
        });
      }
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
          // 将过滤后的数据转换为ComponentList需要的格式（扁平化child数组）
          // 类似 select1 = res.data.lists.map((item) => item.child).flat()
          this.myConfig = this.configItems.map((item) => item.child).flat();
          console.log(this.myConfig);
        }
      });
    },
    // 查找选中项的原数据，保留原始结构
    findSelectedItems(apiConfigItems, localStorageData) {
      if (!Array.isArray(apiConfigItems) || !Array.isArray(localStorageData)) {
        return [];
      }

      // 深度克隆原始数据
      const clonedData = JSON.parse(JSON.stringify(apiConfigItems));

      // 递归过滤 producntInfos
      const filterProducntInfos = (producntInfos) => {
        if (!Array.isArray(producntInfos)) {
          return [];
        }

        return producntInfos
          .map((item) => {
            // 在localStorage中查找匹配的选中项
            const localItem = localStorageData.find(
              (localItem) => localItem.product_type_goods_ids === item.id
            );

            if (!localItem) {
              return null; // 不在localStorage中，返回null用于过滤
            }

            // 创建新的item对象，保留原始结构
            const newItem = { ...item };

            // 如果是"其他"、"定制"或"定制logo"，更新相关字段
            if (
              item.title == "其他" ||
              item.title == "定制" ||
              item.title == "定制logo"
            ) {
              // 更新图片
              if (localItem.other && localItem.other.image) {
                newItem.thumb = localItem.other.image;
              }
              // 更新spec
              if (localItem.other) {
                newItem.spec = localItem.other;
              }
            } else {
              // 非定制类型，如果有other数据也更新
              if (localItem.other) {
                newItem.spec = localItem.other;
              }
            }

            return newItem;
          })
          .filter((item) => item !== null); // 过滤掉null值
      };

      // 递归处理子节点
      const processChild = (childArray) => {
        if (!Array.isArray(childArray)) {
          return [];
        }

        return childArray
          .map((childItem) => {
            const newChildItem = { ...childItem };

            // 处理当前节点的 producntInfos
            if (
              newChildItem.producntInfos &&
              Array.isArray(newChildItem.producntInfos)
            ) {
              newChildItem.producntInfos = filterProducntInfos(
                newChildItem.producntInfos
              );
            }

            // 递归处理子节点
            if (newChildItem.child && Array.isArray(newChildItem.child)) {
              newChildItem.child = processChild(newChildItem.child);
            }

            // 判断是否应该保留该节点
            // 如果有 producntInfos 且过滤后不为空，保留
            // 如果有 child 且过滤后不为空，保留
            const hasProducntInfos =
              newChildItem.producntInfos &&
              Array.isArray(newChildItem.producntInfos) &&
              newChildItem.producntInfos.length > 0;
            const hasChild =
              newChildItem.child &&
              Array.isArray(newChildItem.child) &&
              newChildItem.child.length > 0;

            // 如果既没有 producntInfos 也没有 child，则不保留该节点
            if (!hasProducntInfos && !hasChild) {
              return null;
            }

            return newChildItem;
          })
          .filter((item) => item !== null); // 过滤掉null值
      };

      // 处理顶层tabs
      return clonedData
        .map((tab) => {
          const newTab = { ...tab };

          if (newTab.child && Array.isArray(newTab.child)) {
            newTab.child = processChild(newTab.child);
          }

          // 如果tab的child过滤后为空，则不保留该tab
          if (
            !newTab.child ||
            !Array.isArray(newTab.child) ||
            newTab.child.length === 0
          ) {
            return null;
          }

          return newTab;
        })
        .filter((tab) => tab !== null); // 过滤掉null值
    },
    paramsText(firstTitle, name, params) {
      if (firstTitle == "颜色" && name == "定制") {
        return `${params.pantone ? `潘通色号: ${params.pantone}` : ""} ${
          params.ral ? `劳尔色号: ${params.ral}` : ""
        } ${
          params.rgba
            ? `RGBA色彩: ${
                params.rgba.includes("#") ? params.rgba : "#" + params.rgba
              }`
            : ""
        }`;
      }
      return params || "";
    },
    /**
     * 按照firstTitle分组并转换成目标格式
     * @param {Array} items 原始数据数组
     * @returns {Array} 分组后的数组，格式类似select1
     */
    groupByFirstTitle(items) {
      if (!Array.isArray(items) || items.length === 0) {
        return [];
      }

      // 使用Map来分组，key为firstTitle
      const groupedMap = new Map();

      items.forEach((item, index) => {
        const firstTitle = item.firstTitle || "";

        if (!groupedMap.has(firstTitle)) {
          // 创建新的分组
          groupedMap.set(firstTitle, {
            id: item.activeTab !== undefined ? item.activeTab : index,
            title: firstTitle,
            sort: groupedMap.size, // 使用当前分组数量作为sort
            producntInfos: [],
          });
        }

        // 将当前项转换为producntInfos格式
        const productInfo = {
          delivery_time: item.progress || "",
          delivery_title: item.delivery_title || "",
          description: item.model || "",
          glId: "", // 根据图二显示，glId为空字符串
          id: item.id || "",
          nonumber: item.nonumber || "",
          price_status: item.price_status || 0,
          spec: item.params || "",
          thumb: item.image || "",
          title: item.name || "",
        };

        // 添加到对应分组的producntInfos数组
        groupedMap.get(firstTitle).producntInfos.push(productInfo);
      });

      // 将Map转换为数组
      return Array.from(groupedMap.values());
    },
  },
};
</script>

<style lang="less" scoped>
@import "./aiRecommendation.less";
</style>
