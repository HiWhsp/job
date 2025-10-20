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
            v-for="(item, index) in orderDetail.product_info"
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

      <!-- 前壳体组件 -->
      <!-- <div class="section front-casing">
        <h2 class="section-title">前壳体组件</h2>
        <div class="component-grid">
          <div class="component-item">
            <span class="component-name">急停按钮</span>
            <span class="component-value">自复位</span>
          </div>
          <div class="component-item">
            <span class="component-name">调试接口</span>
            <span class="component-value">无</span>
          </div>
          <div class="component-item">
            <span class="component-name">3D相机</span>
            <span class="component-value">奥比中光 XXXX-XXXX-1</span>
          </div>
          <div class="component-item">
            <span class="component-name">警示灯</span>
            <span class="component-value">有</span>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminOrderDetail",
  data() {
    return {
      orderNumber: "",
      orderDetail: {},
      contactInfo: {
        name: "张三",
        phone: "15931263145",
        email: "1743962256@qq.com",
        unit: "单位名称单位名称",
      },
      configItems: [], // 控制器和雷达
      configItems2: [], // 元器件
      configItems3: [], // 外观模组
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
