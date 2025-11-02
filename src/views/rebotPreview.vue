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
            <span class="overview-title-sub" @click="goHome"
              >返回上一页<i class="el-icon-arrow-right"></i
            ></span>
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
            <template v-if="item.image">
              <div class="item-thumbnail">
                <img :src="item.image" :alt="item.name" v-if="item.image" />
                <div class="no-image" v-else></div>
              </div>
              <div class="item-details">
                <div class="item-name">{{ item.firstTitle }}</div>
                <div class="item-model">{{ item.name }} {{ item.model }}</div>
              </div>
              <div class="item-params">参数信息：{{ paramsText(item) }}</div>
              <div class="item-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar-track">
                    <div
                      class="progress-bar-fill"
                      :style="{ width: item.progress * 20 + '%' }"
                    >
                      <span class="progress-slider"> </span>
                    </div>
                  </div>
                  <div class="progress-label">
                    {{ item.delivery_title }}
                  </div>
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
              <div class="item-edit" v-if="!configOrderNumber">
                <i class="el-icon-edit" @click="editItem(item)"></i>
              </div>
            </template>
            <template v-else>
              <div class="item-details">
                <div class="item-name">{{ item.firstTitle }}</div>
                <!-- <div class="item-model">{{ item.name }} {{ item.model }}</div> -->
              </div>
              <div class="item-params">
                <p>{{ item.name }}</p>
                <p>{{ paramsText(item) }}</p>
              </div>
              <div class="item-progress">
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
              <div class="item-edit" v-if="!configOrderNumber">
                <i class="el-icon-edit" @click="editItem(item)"></i>
              </div>
            </template>
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
            @click="showUserInfoDialog = true"
            v-if="!configOrderNumber"
          >
            保存配置单
          </button>
          <button
            class="save-config-btn"
            @click="showDownloadDialog = true"
            v-else
            :disabled="isGeneratingPDF"
          >
            {{ isGeneratingPDF ? "生成中..." : "下载配置单" }}
          </button>
        </div>
        <div class="user-info" v-if="userInfo.name">
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

    <div class="overview-content" id="download-content">
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
            <template v-if="item.image">
              <div class="item-thumbnail">
                <img :src="item.image" :alt="item.name" v-if="item.image" />
                <div class="no-image" v-else></div>
              </div>
              <div class="item-details">
                <div class="item-name">{{ item.firstTitle }}</div>
                <div class="item-model">{{ item.name }} {{ item.model }}</div>
              </div>
              <div class="item-params">参数信息：{{ paramsText(item) }}</div>
              <div class="item-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar-track">
                    <div
                      class="progress-bar-fill"
                      :style="{ width: item.progress * 20 + '%' }"
                    >
                      <span class="progress-slider"> </span>
                    </div>
                  </div>
                  <div class="progress-label">
                    {{ item.delivery_title }}
                  </div>
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
              <div class="item-edit" v-if="!configOrderNumber">
                <i class="el-icon-edit" @click="editItem(item)"></i>
              </div>
            </template>
            <template v-else>
              <div class="item-details">
                <div class="item-name">{{ item.firstTitle }}</div>
                <!-- <div class="item-model">{{ item.name }} {{ item.model }}</div> -->
              </div>
              <div class="item-params">
                <p>{{ item.name }}</p>
                <p>{{ paramsText(item) }}</p>
              </div>
              <div class="item-progress">
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
              <div class="item-edit" v-if="!configOrderNumber">
                <i class="el-icon-edit" @click="editItem(item)"></i>
              </div>
            </template>
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
        </div>
        <div class="user-info" v-if="userInfo.name">
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
      :is-generating-pdf="isGeneratingPDF"
      @close="
        () => {
          showDownloadDialog = false;
        }
      "
      @download="handleDownload"
    />

    <!-- 用户信息填写弹框 -->
    <UserInfoDialog
      v-model="showUserInfoDialog"
      @submit="handleUserInfoSubmit"
    />
  </div>
</template>

<script>
import DownloadDialog from "@/components/DownloadDialog.vue";
import UserInfoDialog from "@/components/UserInfoDialog.vue";
import html2canvas from "html2canvas";

export default {
  name: "RobotPreview",
  components: {
    DownloadDialog,
    UserInfoDialog,
  },
  data() {
    return {
      id: "",
      configOrderNumber: "",
      referencePrice: "¥ 0",
      configItems: [],
      userInfo: {},
      showDownloadDialog: false, // 下载弹框
      showUserInfoDialog: false, // 用户信息填写弹框
      isGeneratingPDF: false, // PDF生成状态
      loading: false,
      robotConfig: {},
      downPdfUrl: "",
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.userInfo = JSON.parse(localStorage.getItem("robotUserInfo")) || {};
    this.getRobotConfig();
  },
  methods: {
    goHome() {
      this.$router.push({
        path: "/",
        query: {
          id: this.id,
          showOverlay: false,
          index: 2,
        },
      });
    },
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
          this.referencePrice = `¥ ${res.data.info.price} 起`;
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
                    if (
                      item.title == "其他" ||
                      item.title == "定制" ||
                      item.title == "定制logo"
                    ) {
                      selectedItems.push({
                        activeTab: index,
                        firstTitle: firstLevel.title,
                        id: item.id,
                        name: item.title,
                        model: item.description,
                        image: matchedItem.other.image || item.thumb,
                        params: matchedItem.other || item.spec,
                        progress: item.delivery_time,
                        price_status: item.price_status,
                        delivery_title: item.delivery_title,
                      });
                    } else {
                      selectedItems.push({
                        activeTab: index,
                        firstTitle: firstLevel.title,
                        id: item.id,
                        name: item.title,
                        model: item.description,
                        image: item.thumb,
                        params:
                          item.title == "其他" ||
                          item.title == "定制" ||
                          item.title == "定制logo"
                            ? matchedItem.other
                            : item.spec,
                        progress: item.delivery_time,
                        price_status: item.price_status,
                        delivery_title: item.delivery_title,
                      });
                    }
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
                        if (
                          item.title == "其他" ||
                          item.title == "定制" ||
                          item.title == "定制logo"
                        ) {
                          selectedItems.push({
                            activeTab: index,
                            firstTitle: secondLevel.title,
                            id: item.id,
                            name: item.title,
                            model: item.description,
                            image: matchedItem.other.image || item.thumb,
                            params: matchedItem.other || item.spec,
                            progress: item.delivery_time,
                            price_status: item.price_status,
                            delivery_title: item.delivery_title,
                          });
                        } else {
                          selectedItems.push({
                            activeTab: index,
                            firstTitle: secondLevel.title,
                            id: item.id,
                            name: item.title,
                            model: item.description,
                            image: item.thumb,
                            params:
                              item.title == "其他" ||
                              item.title == "定制" ||
                              item.title == "定制logo"
                                ? matchedItem.other
                                : item.spec,
                            progress: item.delivery_time,
                            price_status: item.price_status,
                            delivery_title: item.delivery_title,
                          });
                        }
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
                            if (
                              item.title == "其他" ||
                              item.title == "定制" ||
                              item.title == "定制logo"
                            ) {
                              selectedItems.push({
                                activeTab: index,
                                firstTitle: thirdLevel.title,
                                id: item.id,
                                name: item.title,
                                model: item.description,
                                image: matchedItem.other.image || item.thumb,
                                params: matchedItem.other || item.spec,
                                progress: item.delivery_time,
                                price_status: item.price_status,
                                delivery_title: item.delivery_title,
                              });
                            } else {
                              selectedItems.push({
                                activeTab: index,
                                firstTitle: thirdLevel.title,
                                id: item.id,
                                name: item.title,
                                model: item.description,
                                image: item.thumb,
                                params:
                                  item.title == "其他" ||
                                  item.title == "定制" ||
                                  item.title == "定制logo"
                                    ? matchedItem.other
                                    : item.spec,
                                progress: item.delivery_time,
                                price_status: item.price_status,
                                delivery_title: item.delivery_title,
                              });
                            }
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
      const loading = this.$loading({
        lock: true,
        text: "保存中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const configData = JSON.parse(localStorage.getItem("robotConfig"));
      configData.forEach((item) => {
        if (!item.other) {
          return;
        }
        if (item.other?.notes && item.other.notes instanceof Object) {
          item.other.notes =
            item.other.notes.pantone ||
            item.other.notes.ral ||
            item.other.notes.rgba;
        }
        // 如果item.other中的三个值如果为空则设置为空字符串
        if (!item.other?.notes) {
          item.other.notes = "";
        }
        if (!item.other?.brand) {
          item.other.brand = "";
        }
        if (!item.other?.image) {
          item.other.image = "";
        }
        if (!item.other?.brand) {
          item.other.brand = "";
        }
        if (!item.other?.image) {
          item.other.image = "";
        }
      });
      this.$api({
        url: "addProductSetting",
        method: "post",
        data: {
          ...this.userInfo,
          product_id: this.id,
          product_info: JSON.stringify(configData),
        },
      })
        .then((res) => {
          if (res.code == 200) {
            // this.$message.success("配置单保存成功");
            // localStorage.removeItem("robotConfig");
            localStorage.removeItem("robotUserInfo");
            this.configOrderNumber = res.data.order_no;
            this.robotConfig = res.data;
            this.showDownloadDialog = true;
            loading.close();
            setTimeout(() => {
              this.handleDownload("save");
            }, 1000);
          }
        })
        .catch((err) => {
          this.$message.error("配置单保存失败");
          loading.close();
        })
        .finally(() => {
          loading.close();
        });
    },

    // 用户信息提交
    handleUserInfoSubmit(data) {
      // 处理用户信息提交数据
      localStorage.setItem("robotUserInfo", JSON.stringify(data));
      this.userInfo = data;
      this.showUserInfoDialog = false;
      this.saveConfig();
    },

    // 处理下载
    async handleDownload(type) {
      if (this.isGeneratingPDF) {
        return; // 防止重复点击
      }

      if (this.downPdfUrl) {
        this.downPdf(this.downPdfUrl);
        return;
      }

      // 显示loading提示
      const downloadLoading = this.$loading({
        lock: true,
        text: "正在生成PDF，请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      try {
        this.isGeneratingPDF = true;
        // 获取要转换的元素
        const element = document.querySelector("#download-content");
        if (!element) {
          downloadLoading.close();
          this.$message.error("未找到配置列表元素");
          this.isGeneratingPDF = false;
          return;
        }

        // 使用html2canvas将DOM元素转换为canvas
        console.log("开始转换DOM元素为图片...", element);
        const canvas = await html2canvas(element, {
          allowTaint: true,
          useCORS: true,
          scale: 2, // 提高图片质量
          backgroundColor: "#ffffff",
          width: element.offsetWidth,
          height: element.offsetHeight,
        });
        console.log("Canvas生成完成，尺寸:", canvas.width, "x", canvas.height);

        // 将canvas转换为图片数据
        const imgData = canvas.toDataURL("image/png");
        console.log(
          "图片数据生成完成，大小:",
          Math.round(imgData.length / 1024),
          "KB"
        );

        // 检查jsPDF是否已加载
        if (typeof window.jspdf === "undefined") {
          downloadLoading.close();
          this.$message.error("PDF库未加载，请刷新页面重试");
          this.isGeneratingPDF = false;
          return;
        }

        const jsPDF = window.jspdf.jsPDF;

        // 创建PDF文档
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true,
        });
        console.log("PDF文档创建完成");

        // 计算图片在PDF中的尺寸
        const imgWidth = 190; // A4宽度减去边距
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pageHeight = 277; // A4高度减去边距

        // 如果图片高度超过一页，需要分页处理
        if (imgHeight <= pageHeight) {
          // 单页处理
          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        } else {
          // 多页处理
          let yPosition = 10;
          let remainingHeight = imgHeight;
          let sourceY = 0;
          const sourceHeight = canvas.height;
          const scaledSourceHeight = sourceHeight * (imgWidth / canvas.width);

          while (remainingHeight > 0) {
            const currentPageHeight = Math.min(pageHeight, remainingHeight);
            const sourceHeightForPage =
              (currentPageHeight / imgHeight) * sourceHeight;

            // 创建临时canvas来截取当前页的内容
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");
            tempCanvas.width = canvas.width;
            tempCanvas.height = sourceHeightForPage;

            tempCtx.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              sourceHeightForPage,
              0,
              0,
              canvas.width,
              sourceHeightForPage
            );

            const pageImgData = tempCanvas.toDataURL("image/png");
            pdf.addImage(
              pageImgData,
              "PNG",
              10,
              yPosition,
              imgWidth,
              currentPageHeight
            );

            remainingHeight -= currentPageHeight;
            sourceY += sourceHeightForPage;
            yPosition = 10; // 重置Y位置为下一页顶部

            if (remainingHeight > 0) {
              pdf.addPage();
            }
          }
        }

        // 生成PDF文件
        const pdfBlob = pdf.output("blob");
        console.log(
          "PDF文件生成完成，大小:",
          Math.round(pdfBlob.size / 1024),
          "KB"
        );

        // 创建FormData用于上传
        const formData = new FormData();
        formData.append(
          "file",
          pdfBlob,
          `配置单_${this.configOrderNumber || "unknown"}.pdf`
        );
        console.log("开始上传PDF文件...");

        // 上传PDF文件
        await this.uploadPDF(formData, type, downloadLoading);
      } catch (error) {
        console.error("生成PDF失败:", error);
        this.$message.error("生成PDF失败，请重试");
        downloadLoading.close();
      } finally {
        this.isGeneratingPDF = false;
        // 确保loading被关闭
        if (downloadLoading) {
          downloadLoading.close();
        }
      }
    },

    // 上传PDF文件
    async uploadPDF(formData, type, downloadLoading) {
      try {
        // 如果传入了loading实例，直接使用；否则创建新的loading
        if (!downloadLoading) {
          this.loading = this.$loading({
            lock: true,
            text: "正在上传PDF文件，请稍候...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
        }
        // 调用上传接口
        this.$axios
          .post("https://yifei.dx.hdapp.com.cn/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              token: localStorage.getItem("token") || "",
            },
          })
          .then((response) => {
            if (response.code === 200) {
              this.showDownloadDialog = false;
              if (response.data && response.data.path) {
                // 可以在这里添加下载链接的显示
                if (type !== "save") {
                  this.downPdfUrl = response.data.path;
                  this.downPdf(response.data.path);
                }
              }
              // 关闭loading（如果使用的是传入的loading，则由上层关闭）
              if (!downloadLoading && this.loading) {
                this.loading.close();
              }
              this.$api({
                url: "upPdf",
                method: "post",
                data: {
                  id: this.robotConfig.order_id,
                  pdfUrl: response.data.path,
                },
              });
            } else {
              // 关闭loading
              if (!downloadLoading && this.loading) {
                this.loading.close();
              } else if (downloadLoading) {
                downloadLoading.close();
              }
              this.$message.error(response.msg || "上传失败");
            }
          })
          .catch((error) => {
            // 关闭loading
            if (!downloadLoading && this.loading) {
              this.loading.close();
            } else if (downloadLoading) {
              downloadLoading.close();
            }
            throw error;
          });
      } catch (error) {
        console.error("上传PDF失败:", error);
        this.$message.error("上传PDF失败，请重试");
        // 关闭loading
        if (!downloadLoading && this.loading) {
          this.loading.close();
        } else if (downloadLoading) {
          downloadLoading.close();
        }
        throw error; // 重新抛出错误以便上层处理
      }
    },
    paramsText(item) {
      if (item.name == "其他") {
        return item.params.notes;
      } else if (item.firstTitle == "颜色" && item.name == "定制") {
        const notes = item.params.notes;
        if (notes) {
          return `${notes.pantone ? `潘通色号: ${notes.pantone}` : ""} ${
            notes.ral ? `劳尔色号: ${notes.ral}` : ""
          } ${
            notes.rgba
              ? `RGBA色彩: ${
                  notes.rgba.includes("#") ? notes.rgba : "#" + notes.rgba
                }`
              : ""
          }`;
        }
        return "";
      }
      if (item.firstTitle == "定制logo" && item.name == "定制logo") {
        return item.params.notes;
      }
      return item.params || "";
    },
    getTooltipContent(other) {
      if (!other) return "";

      let content = '<div class="tooltip-content">';
      // 如果有备注，添加备注信息
      if (other.notes) {
        const escapedNotes = this.escapeHtml(other.notes);
        content += `<div class="tooltip-notes" style="font-size: 12px; color: #ccc; margin-bottom: 4px; white-space: pre-wrap; word-break: break-word;">备注: ${escapedNotes}</div>`;
      }
      // 如果有图片，添加图片信息
      if (other.image) {
        const escapedImage = this.escapeHtml(other.image);
        content += `<img src="${escapedImage}" class="tooltip-image" style="max-width: 200px; max-height: 150px; border-radius: 4px; margin-bottom: 8px;" />`;
      }

      // 如果有品牌信息，添加品牌信息
      if (other.brand) {
        const escapedBrand = this.escapeHtml(other.brand);
        content += `<div class="tooltip-brand">品牌: ${escapedBrand}</div>`;
      }

      content += "</div>";
      return content;
    },
    // HTML 转义函数，防止 XSS 攻击
    escapeHtml(text) {
      if (!text) return "";
      const div = document.createElement("div");
      div.textContent = String(text);
      return div.innerHTML;
    },
    downPdf(url) {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const link = document.createElement("a");
          const objectUrl = URL.createObjectURL(blob);
          link.href = objectUrl;
          link.download = "配置单_" + this.configOrderNumber + ".pdf"; // 指定保存的文件名
          link.click();
          URL.revokeObjectURL(objectUrl);
        })
        .catch((err) => console.error("下载失败:", err));
    },
  },
};
</script>

<style lang="less" scoped>
@import "./rebotPreview.less";
</style>
