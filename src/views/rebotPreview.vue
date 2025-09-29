<template>
  <div class="config-overview">
    <!-- 主要内容区域 -->
    <div class="overview-content">
      <!-- 左侧：配置列表 -->
      <div class="config-list-section">
        <!-- 头部区域 -->
        <div class="overview-header">
          <div class="header-left">
            <h1 class="overview-title">配置总览</h1>
          </div>
        </div>
        <div class="config-order-number">
          配置单号: <span>{{ configOrderNumber || "暂无" }}</span>
        </div>

        <!-- 配置项列表 -->
        <div class="config-items-list">
          <div
            v-for="(item, index) in configItems"
            :key="index"
            class="config-item-row"
          >
            <div class="item-thumbnail">
              <img :src="item.image" :alt="item.name" v-if="item.image" />
              <div class="no-image" v-else></div>
            </div>
            <div class="item-details">
              <div class="item-name">{{ item.firstTitle }}</div>
              <div class="item-model">{{ item.name }} {{ item.model }}</div>
            </div>
            <div class="item-params">参数信息：{{ item.params || "--" }}</div>
            <div class="item-progress">
              <div class="progress-bar">
                <img
                  src="@/assets/img/icon/progress1.png"
                  alt="progress"
                  v-if="item.progress == 1"
                />
                <img
                  src="@/assets/img/icon/progress2.png"
                  alt="progress"
                  v-if="item.progress == 2"
                />
                <img
                  src="@/assets/img/icon/progress3.png"
                  alt="progress"
                  v-if="item.progress == 3"
                />
                <img
                  src="@/assets/img/icon/progress4.png"
                  alt="progress"
                  v-if="item.progress == 4"
                />
                <img
                  src="@/assets/img/icon/progress4.png"
                  alt="progress"
                  v-if="item.progress == 5"
                />
              </div>
            </div>
            <div class="item-price">
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
            <div class="item-edit">
              <i class="el-icon-edit" @click="editItem(item)"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：价格信息 -->
      <div class="price-section">
        <div class="header-right">
          <div class="contact-info">
            <div class="contact-item">
              <i class="el-icon-phone"></i>
              <span>服务热线: 400-116-0626</span>
            </div>
            <div class="divider"></div>
            <div class="contact-item">
              <i class="el-icon-link"></i>
              <span>官网: https://www.robotphoenix.com</span>
            </div>
          </div>
        </div>
        <div class="reference-price">
          <div class="price-label">参考价格</div>
          <div class="price-value">{{ referencePrice }}</div>
          <button
            class="save-config-btn"
            @click="saveConfig"
            v-if="!configOrderNumber"
          >
            保存配置单
          </button>
          <button
            class="save-config-btn"
            @click="showDownloadDialog = true"
            v-else
          >
            下载配置单
          </button>
        </div>
        <div class="user-info">
          <div class="user-title">用户信息</div>
          <div class="user-info-item">
            <div class="user-info-item-label">姓名：</div>
            <div class="user-info-item-value">{{ userInfo.name }}</div>
          </div>
          <div class="user-info-item">
            <div class="user-info-item-label">手机号:</div>
            <div class="user-info-item-value">{{ userInfo.mobile }}</div>
          </div>
          <div class="user-info-item">
            <div class="user-info-item-label">邮箱:</div>
            <div class="user-info-item-value">{{ userInfo.email }}</div>
          </div>
          <div class="user-info-item">
            <div class="user-info-item-label">所属单位:</div>
            <div class="user-info-item-value">{{ userInfo.company }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 下载弹框 -->
    <DownloadDialog
      v-model="showDownloadDialog"
      :config-data="robotConfig"
      @download="handleDownload"
    />
  </div>
</template>

<script>
import DownloadDialog from "@/components/DownloadDialog.vue";
export default {
  name: "RobotPreview",
  components: {
    DownloadDialog,
  },
  data() {
    return {
      id: "",
      configOrderNumber: "",
      referencePrice: "¥ 19,888 起",
      configItems: [],
      userInfo: {},
      showDownloadDialog: false,
      robotConfig: {},
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.userInfo = JSON.parse(localStorage.getItem("robotUserInfo"));
    this.getRobotConfig();
  },
  methods: {
    getRobotConfig() {
      this.$api({
        url: "getProductSetting",
        method: "get",
        data: {
          id: this.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.loadConfigFromStorage(res.data.lists);
        }
      });
    },
    // 从localStorage加载配置数据
    loadConfigFromStorage(apiConfigItems) {
      try {
        const savedConfig = localStorage.getItem("robotConfig");
        if (savedConfig) {
          const configData = JSON.parse(savedConfig);
          console.log("加载的配置数据:", configData);
          console.log("接口返回的配置数据:", apiConfigItems);

          // 遍历接口返回的数组，找到选中值的原数据
          this.configItems = this.findSelectedItems(apiConfigItems, configData);
        } else {
          this.$message.warning("未找到保存的配置数据");
          // 如果没有localStorage数据，使用接口返回的数据
          this.configItems = apiConfigItems || [];
        }
      } catch (error) {
        console.error("加载配置数据失败:", error);
        this.$message.error("加载配置数据失败");
        // 出错时使用接口返回的数据
        this.configItems = apiConfigItems || [];
      }
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
                    console.log("tab", tab);

                    selectedItems.push({
                      activeTab: index,
                      firstTitle: firstLevel.title,
                      id: item.id,
                      name: item.title,
                      model: item.description,
                      image: item.thumb,
                      params: item.spec,
                      progress: item.delivery_time,
                      price_status: item.price_status,
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
                          params: item.spec,
                          progress: item.delivery_time,
                          price_status: item.price_status,
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
                              params: item.spec,
                              progress: item.delivery_time,
                              price_status: item.price_status,
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

    // 编辑配置项
    editItem(item) {
      console.log("item", item);
      this.$router.push({
        path: "/",
        query: {
          id: this.id,
          edit: true,
          index: item.activeTab,
        },
      });
    },

    // 保存配置
    saveConfig() {
      this.$alert("保存配置单", "确定要保存配置单吗？", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$api({
            url: "addProductSetting",
            method: "post",
            data: {
              ...this.userInfo,
              product_id: this.id,
              product_info: JSON.stringify(this.configItems),
            },
          }).then((res) => {
            if (res.code == 200) {
              this.$message.success("配置单保存成功");
              this.configOrderNumber = res.data.order_no;
              this.robotConfig = res.data;
              //   this.$router.push({
              //     path: "/",
              //     query: {
              //       id: this.id,
              //     },
              //   });
            }
          });
        },
      });
    },

    // 处理下载
    handleDownload(data) {},
  },
};
</script>

<style lang="less" scoped>
@import "./rebotPreview.less";
</style>
