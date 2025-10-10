<template>
  <div class="order-detail-page">
    <!-- 头部橙色栏 -->
    <div class="header-bar">
      <div class="header-content">
        <h1 class="order-title">Camel-600 配置单({{ orderNumber }})</h1>
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
            <span class="value">{{ contactInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">手机号:</span>
            <span class="value">{{ contactInfo.phone }}</span>
          </div>
          <div class="info-item">
            <span class="label">邮箱:</span>
            <span class="value">{{ contactInfo.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">所属单位:</span>
            <span class="value">{{ contactInfo.unit }}</span>
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
                :src="item.icon"
                :alt="item.name"
                @error="handleImageError"
              />
            </div>
            <div class="config-info">
              <div class="config-name">{{ item.name }}</div>
              <div class="config-model">{{ item.model }}</div>
            </div>
            <div class="config-params">{{ item.params }}</div>

            <div class="config-delivery">
              <div class="delivery-progress">
                <img src="@/assets/img/icon/progress1.png" alt="progress" />
                <!-- <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: item.progress + '%' }"
                  ></div>
                </div> -->
                <!-- <div class="delivery-text">
                  <i class="el-icon-time"></i>
                  <span>{{ item.deliveryTime }}</span>
                </div> -->
              </div>
            </div>
            <div class="config-price">
              <img src="@/assets/img/icon/Group1.png" alt="price" />
            </div>
          </div>
        </div>
      </div>

      <!-- 前壳体组件 -->
      <div class="section front-casing">
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
      </div>

      <!-- 后壳体组件 -->
      <div class="section rear-casing">
        <h2 class="section-title">后壳体组件</h2>
        <div class="component-grid">
          <div class="component-item">
            <span class="component-name">急停按钮</span>
            <span class="component-value">自复位</span>
          </div>
          <div class="component-item">
            <span class="component-name">电源按键</span>
            <span class="component-value">自复位</span>
          </div>
          <div class="component-item">
            <span class="component-name">复位按键</span>
            <span class="component-value">自锁</span>
          </div>
          <div class="component-item">
            <span class="component-name">模式切换按键(A/M)</span>
            <span class="component-value">无</span>
          </div>
          <div class="component-item">
            <span class="component-name">触摸屏(4.3in)</span>
            <span class="component-value">欣睿达</span>
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
      </div>

      <!-- 元器件 -->
      <div class="section components">
        <h2 class="section-title">元器件</h2>
        <div class="component-grid">
          <div class="component-item">
            <span class="component-name">电源</span>
            <span class="component-value">翼菲电源</span>
          </div>
          <div class="component-item">
            <span class="component-name">读码器模块</span>
            <span class="component-value">大华</span>
          </div>
          <div class="component-item">
            <span class="component-name">无线模块</span>
            <span class="component-value">TP-LINK</span>
          </div>
          <div class="component-item">
            <span class="component-name">锂电池模块</span>
            <span class="component-value">金源环宇</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminOrderDetail",
  data() {
    return {
      orderNumber: "",
      contactInfo: {
        name: "张三",
        phone: "15931263145",
        email: "1743962256@qq.com",
        unit: "单位名称单位名称",
      },
      configItems: [
        {
          name: "控制器",
          model: "仙工 SRC-880",
          params: "参数信息XXXXXXXXX XXXXXXXXX",
          deliveryTime: "1周",
          progress: 20,
          icon: "@/assets/img/icon/Group1.png",
        },
        {
          name: "前激光雷达",
          model: "兴颂 xxox-xx-01",
          params: "参数信息XXXXXXXXX XXXXXXXXX",
          deliveryTime: "2周",
          progress: 40,
          icon: "@/assets/img/icon/Group2.png",
        },
        {
          name: "后激光雷达",
          model: "兴颂 xxx-xx-01",
          params: "参数信息XXXXXXXXX XXXXXXXXX",
          deliveryTime: "3周",
          progress: 60,
          icon: "@/assets/img/icon/Group3.png",
        },
        {
          name: "电机",
          model: "仙工 SRC-880",
          params: "参数信息XXXXXXXXX XXXXXXXXX",
          deliveryTime: "4周",
          progress: 80,
          icon: "@/assets/img/icon/Group4.png",
        },
        {
          name: "减速机",
          model: "中大力德",
          params: "参数信息XXXXXXXXX XXXXXXXXX",
          deliveryTime: "5周",
          progress: 100,
          icon: "@/assets/img/icon/Group1.png",
        },
      ],
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
        // this.orderDetail = res.data;
      });
    },
    handleClose() {
      this.$router.go(-1);
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
