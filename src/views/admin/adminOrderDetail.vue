<template>
  <div class="order-detail-page">
    <!-- 头部橙色栏 -->
    <div class="header-bar">
      <div class="header-content">
        <h1 class="order-title">
          {{ orderDetail.product_title }} 配置单({{ orderDetail.order_no }})
        </h1>
        <div class="close-btn" @click="handleClose">
          <i class="el-icon-close"></i>
        </div>
      </div>
    </div>
    <div class="header-info">
      <div class="phone-info">
        <i class="el-icon-phone"></i>
        <span>手机号: 400-116-0626</span>
      </div>
      <div class="website-info">
        <i class="el-icon-link"></i>
        <span>官网: https://www.robotphoenix.com</span>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 联系人信息 -->
      <div class="section contact-info">
        <h2 class="section-title">联系人信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">联系人:</span>
            <span class="value">{{ orderDetail.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">手机号:</span>
            <span class="value">{{ orderDetail.mobile }}</span>
          </div>
          <div class="info-item">
            <span class="label">邮箱:</span>
            <span class="value">{{ orderDetail.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">所属单位:</span>
            <span class="value">{{ orderDetail.company }}</span>
          </div>
        </div>
      </div>

      <!-- 配置详情 -->
      <div class="section config-details">
        <h2 class="section-title">配置详情</h2>
        <div class="config-list">
          <div
            v-for="(item, index) in configItems"
            :key="index"
            class="config-item"
          >
            <div class="config-icon">
              <img
                :src="item.producntInfos.thumb"
                :alt="item.name"
                @error="handleImageError"
              />
            </div>
            <div class="config-info">
              <div class="config-name">{{ item.product_type_two_title }}</div>
              <div class="config-model">
                {{ item.producntInfos.title }}
                {{ item.producntInfos.description }}
              </div>
              <div class="config-model" v-if="item.producntInfos.nonumber">
                物料编号：{{ item.producntInfos.nonumber }}
              </div>
            </div>
            <div class="config-params">
              参数信息: {{ item.producntInfos.spec }}
              {{ item.other && item.other.notes ? item.other.notes : "" }}
              <template v-if="item.other && item.other.image">
                <img
                  v-for="(fileUrl, index) in getImageFiles(item.other.image)"
                  :key="index"
                  :src="fileUrl"
                  alt="image"
                  @click="handleImageClick(fileUrl)"
                  style="max-width: 200px; max-height: 150px; margin: 4px; cursor: pointer;"
                />
                <span
                  v-for="(fileUrl, index) in getNonImageFiles(item.other.image)"
                  :key="'file-' + index"
                  class="download-file"
                  @click="handleFileDownload(fileUrl)"
                  style="margin-left: 8px; cursor: pointer; color: #409EFF; text-decoration: underline;"
                >下载文件{{ getNonImageFiles(item.other.image).length > 1 ? index + 1 : '' }}</span>
              </template>
            </div>

            <div class="config-delivery">
              <div class="delivery-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar-track">
                    <div
                      class="progress-bar-fill"
                      :style="{
                        width:
                          (item.producntInfos.delivery_time * 20 > 100
                            ? 100
                            : item.producntInfos.delivery_time * 20) + '%',
                      }"
                    >
                      <span class="progress-slider"> </span>
                    </div>
                  </div>
                  <div class="progress-label">
                    {{ item.producntInfos.delivery_title }}
                  </div>
                </div>
              </div>
            </div>
            <div class="config-price">
              <img
                src="@/assets/img/icon/Group1.png"
                v-if="item.producntInfos.price_status == 1"
                alt="price"
              />
              <img
                src="@/assets/img/icon/Group2.png"
                v-if="item.producntInfos.price_status == 2"
                alt="price"
              />
              <img
                src="@/assets/img/icon/Group3.png"
                v-if="item.producntInfos.price_status == 3"
                alt="price"
              />
              <img
                src="@/assets/img/icon/Group4.png"
                v-if="item.producntInfos.price_status == 4"
                alt="price"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 外观模组 -->
      <div class="section rear-casing">
        <h2 class="section-title">外观模组</h2>
        <div class="component-grid">
          <div
            class="component-item"
            v-for="(item, index) in configItems3"
            :key="index"
          >
            <span class="component-name">{{
              item.product_type_two_title
            }}</span>
            <span class="component-value"
              >{{ item.producntInfos.title }} {{ item.other && item.other.notes ? item.other.notes : '' }}
              <template v-if="item.other && item.other.image">
                <img
                  v-for="(fileUrl, index) in getImageFiles(item.other.image)"
                  :key="index"
                  :src="fileUrl"
                  alt="image"
                  @click="handleImageClick(fileUrl)"
                  style="max-width: 200px; max-height: 150px; margin: 4px; cursor: pointer;"
                />
                <span
                  v-for="(fileUrl, index) in getNonImageFiles(item.other.image)"
                  :key="'file-' + index"
                  class="download-file"
                  @click="handleFileDownload(fileUrl)"
                  style="margin-left: 8px; cursor: pointer; color: #409EFF; text-decoration: underline;"
                >下载文件{{ getNonImageFiles(item.other.image).length > 1 ? index + 1 : '' }}</span>
              </template>
            </span>
          </div>
        </div>
      </div>

      <div
        v-for="(items, key) in configItems3MultipleData"
        :key="key"
        class="section rear-casing"
      >
        <h2 class="section-title">{{ items[0].product_type_two_title }}</h2>
        <div class="component-grid">
          <div
            class="component-item"
            v-for="(item, index) in items"
            :key="index"
          >
            <span class="component-name">{{
              item.product_type_three_title
            }}</span>
            <span class="component-value">{{
              item.producntInfos.title
            }} {{ item.other && item.other.notes ? item.other.notes : '' }}
            <template v-if="item.other && item.other.image">
              <img
                v-for="(fileUrl, index) in getImageFiles(item.other.image)"
                :key="index"
                :src="fileUrl"
                alt="image"
                @click="handleImageClick(fileUrl)"
                style="max-width: 200px; max-height: 150px; margin: 4px; cursor: pointer;"
              />
              <span
                v-for="(fileUrl, index) in getNonImageFiles(item.other.image)"
                :key="'file-' + index"
                class="download-file"
                @click="handleFileDownload(fileUrl)"
                style="margin-left: 8px; cursor: pointer; color: #409EFF; text-decoration: underline;"
              >下载文件{{ getNonImageFiles(item.other.image).length > 1 ? index + 1 : '' }}</span>
            </template>
          </span>
          </div>
        </div>
      </div>

      <!-- 元器件 -->
      <div class="section components">
        <h2 class="section-title">元器件</h2>
        <div class="component-grid">
          <div
            class="component-item"
            v-for="(item, index) in configItems2"
            :key="index"
          >
            <span class="component-name">{{
              item.product_type_two_title
            }}</span>
            <span class="component-value">{{ item.producntInfos.title }} {{ item.other && item.other.notes ? item.other.notes : '' }}
              <template v-if="item.other && item.other.image">
                <img
                  v-for="(fileUrl, index) in getImageFiles(item.other.image)"
                  :key="index"
                  :src="fileUrl"
                  alt="image"
                  @click="handleImageClick(fileUrl)"
                  style="max-width: 200px; max-height: 150px; margin: 4px; cursor: pointer;"
                />
                <span
                  v-for="(fileUrl, index) in getNonImageFiles(item.other.image)"
                  :key="'file-' + index"
                  class="download-file"
                  @click="handleFileDownload(fileUrl)"
                  style="margin-left: 8px; cursor: pointer; color: #409EFF; text-decoration: underline;"
                >下载文件{{ getNonImageFiles(item.other.image).length > 1 ? index + 1 : '' }}</span>
              </template>
            </span>
          </div>
        </div>
      </div>

      <div class="download-btn">
        <el-button type="primary" @click="handleDownload">下载配置单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminOrderDetail",
  data() {
    return {
      orderNumber: "", // 订单号
      orderDetail: {}, // 订单详情
      contactInfo: {}, // 联系人信息
      configItems: [], // 控制器与雷达
      configItems2: [], // 元器件
      configItems3: [], // 外观模组
      configItems3MultipleData: [], // 多个的外观模组
    };
  },
  methods: {
    getOrderDetail() {
      this.$api({
        url: "showProductSetting",
        method: "post",
        data: {
          id: this.orderNumber,
        },
      }).then((res) => {
        this.orderDetail = res.data;
        res.data.product_info.forEach((item) => {
          if (
            item.product_type_title === "控制器与雷达" ||
            item.product_type_title === "控制器和雷达"
          ) {
            this.configItems.push(item);
          } else if (item.product_type_title === "元器件") {
            this.configItems2.push(item);
          } else if (
            item.product_type_title === "外观模块" ||
            item.product_type_title === "外观模组"
          ) {
            this.configItems3.push(item);
          }
        });

        const groupedData = {};
        this.configItems3.forEach((item) => {
          // 通过product_type_two_title分类
          const key = item.product_type_two_title;
          if (!groupedData[key]) {
            groupedData[key] = [];
          }
          groupedData[key].push(item);
        });
        // 打印分组后的数据再通过value数组的长度分类, 单一的放一个数组, 多个的放一个数组
        const singleData = [];
        const multipleData = [];
        Object.values(groupedData).forEach((value) => {
          if (value.length === 1) {
            singleData.push(...value);
          } else {
            multipleData.push(value);
          }
        });
        this.configItems3 = [...singleData];
        this.configItems3MultipleData = [...multipleData];
        console.log(this.configItems3MultipleData);
      });
    },
    handleClose() {
      this.$router.push({
        path: "/myAdminOrder",
      });
    },
    handleImageError(event) {
      // 图片加载失败时显示默认图标
      event.target.src = require("@/assets/img/common/logo.png");
    },
    handleImageClick(image) {
      window.open(image, "_blank");
    },
    handleFileDownload(fileUrl) {
      window.open(fileUrl, "_blank");
    },
    handleDownload() {
      window.open(this.orderDetail.pdfUrl, "_blank");
    },
    // 判断是否为图片
    isImage(image) {
      if (!image) return false;
      const pureUrl = image.split("?")[0].toLowerCase();
      return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(pureUrl);
    },
    // 获取文件列表（支持多个文件，逗号分隔）
    getFileList(image) {
      if (!image) return [];
      return image.split(",").map((url) => url.trim()).filter((url) => url);
    },
    // 获取图片文件列表
    getImageFiles(image) {
      if (!image) return [];
      const files = this.getFileList(image);
      return files.filter((fileUrl) => this.isImage(fileUrl));
    },
    // 获取非图片文件列表（用于下载）
    getNonImageFiles(image) {
      if (!image) return [];
      const files = this.getFileList(image);
      return files.filter((fileUrl) => !this.isImage(fileUrl));
    },
  },
  mounted() {
    // 从路由参数获取订单号
    if (this.$route.query.order_no) {
      this.orderNumber = this.$route.query.order_no;
    }
    this.getOrderDetail();
  },
};
</script>

<style lang="less" scoped>
@import "./adminOrderDetail.less";
</style>
