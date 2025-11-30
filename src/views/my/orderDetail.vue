<template>
  <div class="order-detail-page">
    <!-- 顶部订单信息 -->
    <div class="order-header">
      <div class="header-info">
        <span class="order-number"
          >订单号: {{ orderDetail.order_no || orderDetail.id }}</span
        >
        <span class="order-time">下单时间: {{ orderDetail.create_time }}</span>
      </div>
    </div>

    <!-- 支付状态区域 -->
    <div class="payment-status-section">
      <div class="status-content" v-if="orderDetail.status === 'pending'">
        <div class="status-icon wallet-icon">
          <img src="@/assets/img/wait-pay.png" alt="" />
        </div>
        <div class="status-text">
          <div class="status-title">等待付款</div>
          <div class="status-tip">订单将于{{ countdownText }}后自动关闭</div>
        </div>
      </div>
      <div
        class="status-content"
        v-else-if="orderDetail.status === 'completed'"
      >
        <div class="status-icon success-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="status-text">
          <div class="status-title">已完成</div>
        </div>
      </div>
    </div>

    <!-- 订单信息区域 -->
    <div class="order-info-section">
      <div class="section-title">订单信息</div>
      <div class="info-list">
        <div class="info-item">
          <span class="info-label">订单编号:</span>
          <span class="info-value">{{
            orderDetail.order_no || orderDetail.id
          }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">下单时间:</span>
          <span class="info-value">{{
            formatDateTime(orderDetail.create_time)
          }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">支付方式</span>
          <span class="info-value">微信支付</span>
        </div>
      </div>
    </div>

    <!-- 文档信息区域 -->
    <div class="document-info-section">
      <div class="section-title">文档信息</div>
      <div class="document-list">
        <div class="document-item">
          <div class="document-title">{{ orderDetail.title }}</div>
          <div class="document-price">¥{{ orderDetail.price }}</div>
        </div>
      </div>
    </div>

    <!-- 底部合计和操作按钮 -->
    <div class="order-footer">
      <div class="total-section">
        <span class="total-label">合计:</span>
        <span
          class="total-amount"
          :class="{ 'completed-amount': orderDetail.status === 'completed' }"
        >
          ¥{{ orderDetail.total_amount || orderDetail.price }}
        </span>
      </div>
      <div class="action-buttons" v-if="orderDetail.status === 'pending'">
        <button class="action-btn cancel-btn" @click="handleCancelOrder">
          取消订单
        </button>
        <button class="action-btn pay-btn" @click="handlePayNow">
          立即支付
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderDetail",
  data() {
    return {
      orderDetail: {},
      countdown: 0, // 倒计时秒数
      countdownTimer: null,
    };
  },
  computed: {
    countdownText() {
      if (this.countdown <= 0) {
        return "0小时0分";
      }
      const hours = Math.floor(this.countdown / 3600);
      const minutes = Math.floor((this.countdown % 3600) / 60);
      return `${hours}小时${minutes}分`;
    },
  },
  mounted() {
    this.getOrderDetail();
  },
  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },
  methods: {
    async getOrderDetail() {
      try {
        const orderId = this.$route.query.id || this.$route.query.orderId;

        // 这里可以调用实际的API获取订单详情
        // const res = await this.$api({
        //   url: "orderDetail",
        //   method: "get",
        //   data: { orderId },
        // });
        // if (res.code === 200 && res.data) {
        //   this.orderDetail = res.data;
        //   if (this.orderDetail.status === 'pending') {
        //     this.startCountdown();
        //   }
        // }

        // 临时使用模拟数据
        if (orderId) {
          // 根据订单ID获取对应的订单数据
          const mockOrders = [
            {
              id: 1,
              order_no: "122522545265110200",
              title: "仁寿县关于进一步支持科技创新的若干政策",
              price: 199,
              total_amount: 199,
              create_time: "2020-12-28 12:24:30",
              status: "pending",
            },
            {
              id: 2,
              order_no: "JL202006301946182",
              title: "仁寿县关于进一步支持科技创新的若干政策",
              price: 199,
              total_amount: 199,
              create_time: "2020-10-24 14:46:00",
              status: "completed",
            },
          ];

          const order =
            mockOrders.find((o) => o.id == orderId) || mockOrders[0];
          this.orderDetail = { ...order };

          // 如果状态是待付款，启动倒计时
          if (this.orderDetail.status === "pending") {
            // 模拟24小时倒计时（86400秒）
            this.countdown = 86400;
            this.startCountdown();
          }
        } else {
          // 默认显示待付款订单
          this.orderDetail = {
            id: 1,
            order_no: "122522545265110200",
            title: "仁寿县关于进一步支持科技创新的若干政策",
            price: 199,
            total_amount: 199,
            create_time: "2020-12-28 12:24:30",
            status: "pending",
          };
          this.countdown = 86400;
          this.startCountdown();
        }
      } catch (error) {
        console.error("获取订单详情失败:", error);
        this.$message.error("获取订单详情失败");
      }
    },
    startCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
      }
      this.countdownTimer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.countdownTimer);
          // 倒计时结束，可以更新订单状态或提示用户
        }
      }, 1000);
    },
    formatDateTime(dateTime) {
      if (!dateTime) return "";
      // 将 "2020-12-28 12:24:30" 格式化为 "2020-12-28 12:24"
      return dateTime.substring(0, 16);
    },
    handleCancelOrder() {
      this.$confirm("确定要取消该订单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用取消订单API
          // this.$api({
          //   url: "cancelOrder",
          //   method: "post",
          //   data: { orderId: this.orderDetail.id },
          // }).then((res) => {
          //   if (res.code === 200) {
          //     this.$message.success("订单已取消");
          //     this.$router.back();
          //   }
          // });
          this.$message.success("订单已取消");
          this.$router.back();
        })
        .catch(() => {});
    },
    handlePayNow() {
      // 跳转到支付页面
      this.$router.push(`/pay-success?orderId=${this.orderDetail.id}`);
    },
  },
};
</script>

<style lang="less" scoped>
.order-detail-page {
  border-radius: 8px;

  // 顶部订单信息
  .order-header {
    padding: 20px 30px;
    background: #fff;
    border-radius: 4px;

    .header-info {
      display: flex;
      gap: 30px;
      font-size: 14px;
      color: #666;

      .order-number {
        color: #666;
      }

      .order-time {
        color: #666;
      }
    }
  }

  // 支付状态区域
  .payment-status-section {
    margin-top: 20px;
    padding: 30px;
    background: #fff;

    .status-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .status-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: #fff;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .status-text {
        flex: 1;

        .status-title {
          font-size: 20px;
          font-weight: bold;
          color: #333;
          margin-bottom: 6px;
        }

        .status-tip {
          font-size: 14px;
          color: #999;
        }
      }
    }
  }

  // 订单信息区域
  .order-info-section {
    padding: 30px;
    background: #fff;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      height: 44px;
      line-height: 44px;
      background: #f5f5f5;
      padding-left: 30px;
    }

    .info-list {
      padding: 18px 30px;
      border: 1px solid #e5e5e5;
      .info-item {
        display: flex;
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 24px;

        &:last-child {
          margin-bottom: 0;
        }

        .info-label {
          color: #666;
          width: 90px;
          flex-shrink: 0;
        }

        .info-value {
          color: #333;
          flex: 1;
        }
      }
    }
  }

  // 文档信息区域
  .document-info-section {
    padding: 0 30px;
    background: #fff;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      height: 44px;
      line-height: 44px;
      background: #f5f5f5;
      padding-left: 30px;
    }

    .document-list {
      padding: 18px 30px;
      border: 1px solid #e5e5e5;
      .document-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;

        .document-title {
          font-size: 16px;
          color: #333;
          flex: 1;
          line-height: 24px;
        }

        .document-price {
          font-size: 18px;
          font-weight: bold;
          color: #0081ff;
          flex-shrink: 0;
        }
      }
    }
  }

  // 底部合计和操作按钮
  .order-footer {
    padding: 10px 30px 50px 30px;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 20px;

    .total-section {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      height: 65px;
      line-height: 65px;
      background: #fafafa;
      .total-label {
        font-size: 16px;
        color: #666;
        margin-right: 8px;
      }

      .total-amount {
        font-size: 20px;
        font-weight: bold;
        color: #e0291f;

        &.completed-amount {
          color: #ff6600;
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 20px;

      .action-btn {
        width: 100px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid #0081ff;
        background: #fff;
        color: #0081ff;

        &.cancel-btn {
          &:hover {
            background: #f0f7ff;
          }
        }

        &.pay-btn {
          background: #0081ff;
          color: #fff;
          border-color: #0081ff;

          &:hover {
            background: #0066cc;
            border-color: #0066cc;
          }
        }
      }
    }
  }
}
</style>
