<template>
  <div class="pay-success-page">
    <div class="w-1600">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">首页</router-link>
        <i class="el-icon-arrow-right breadcrumb-separator"></i>
        <router-link to="/contractList" class="breadcrumb-item">文档中心</router-link>
        <i class="el-icon-arrow-right breadcrumb-separator"></i>
        <span class="breadcrumb-item current">{{ categoryName || "常用表格及模版" }}</span>
      </div>

      <!-- 支付成功内容 -->
      <div class="success-content">
        <!-- 成功图标 -->
        <div class="success-icon">
          <i class="el-icon-check"></i>
        </div>

        <!-- 成功标题 -->
        <h1 class="success-title">下单成功</h1>

        <!-- 订单号 -->
        <div class="order-number">
          订单号:{{ orderNumber || "546456456123123" }}
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button class="download-btn" @click="handleDownload">
            下载文件
          </button>
          <button class="continue-btn" @click="handleContinue">
            继续下载
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaySuccess",
  data() {
    return {
      orderNumber: "",
      categoryName: "",
    };
  },
  mounted() {
    // 从路由参数获取订单号
    this.orderNumber = this.$route.query.orderId || "";
    this.categoryName = this.$route.query.category || "";
    
    // 如果没有订单号，可以从其他地方获取（如localStorage、store等）
    if (!this.orderNumber) {
      // this.orderNumber = localStorage.getItem('lastOrderId') || '';
    }
  },
  methods: {
    // 下载文件
    handleDownload() {
      // 跳转到下载页面或执行下载操作
      if (this.orderNumber) {
        // 可以调用下载API
        // this.$api({
        //   url: "downloadFile",
        //   method: "post",
        //   data: {
        //     orderId: this.orderNumber,
        //   },
        // }).then((res) => {
        //   // 处理下载
        // });
        this.$message.success("开始下载文件");
      } else {
        this.$message.warning("订单号不存在");
      }
    },
    // 继续下载
    handleContinue() {
      // 跳转到文档列表或首页
      this.$router.push("/contractList");
    },
  },
};
</script>

<style lang="less" scoped>
.pay-success-page {
  margin-top: 114px;
  padding: 40px 0;
  min-height: calc(100vh - 114px);
  background: #f4f4f6;
}

// 面包屑导航
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 40px;
  font-size: 14px;

  .breadcrumb-item {
    color: #666;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #0081ff;
    }

    &.current {
      color: #333;
      cursor: default;
    }
  }

  .breadcrumb-separator {
    font-size: 12px;
    color: #999;
  }
}

// 支付成功内容
.success-content {
  background: #fff;
  border-radius: 8px;
  padding: 80px 40px;
  text-align: center;
  width: 100%;

  // 成功图标
  .success-icon {
    width: 80px;
    height: 80px;
    background: #52c41a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 30px;
    color: #fff;
    font-size: 48px;
    font-weight: bold;
  }

  // 成功标题
  .success-title {
    font-size: 32px;
    font-weight: bold;
    color: #333;
    margin: 0 0 20px 0;
  }

  // 订单号
  .order-number {
    font-size: 16px;
    color: #666;
    margin-bottom: 40px;
  }

  // 操作按钮
  .action-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;

    .download-btn {
      padding: 14px 40px;
      background: #0081ff;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #0066cc;
      }

      &:active {
        transform: scale(0.98);
      }
    }

    .continue-btn {
      padding: 14px 40px;
      background: #fff;
      color: #0081ff;
      border: 2px solid #0081ff;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #f0f7ff;
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }
}
</style>

