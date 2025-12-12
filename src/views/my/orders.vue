<template>
  <div class="orders-page">
    <h2 class="page-title">我的订单</h2>

    <div class="order-tabs-box">
      <!-- 订单状态标签 -->
      <div class="order-tabs">
        <div
          class="tab-item"
          v-for="tab in orderTabs"
          :key="tab.value"
          :class="{ active: activeTab === tab.value }"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 订单列表 -->
      <div class="order-list">
        <div
          class="order-item"
          v-for="(order, index) in ordersList"
          :key="order.id || index"
        >
          <!-- 订单头部 -->
          <div class="order-header">
            <div class="order-info">
              <span class="order-time">{{ order.create_time }}</span>
              <span class="order-number">订单号: {{ order.order_no }}</span>
            </div>
            <span class="order-status">
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <!-- 订单内容 -->
          <div class="order-content">
            <div class="order-item-info">
              <div class="item-title">{{ order.title }}</div>
              <div class="item-price">¥{{ order.price }}</div>
            </div>
          </div>

          <!-- 订单底部 -->
          <div class="order-footer">
            <div class="order-total">
              合计金额
              <span class="total-amount"
                >¥{{ order.total_amount || order.price }}</span
              >
            </div>
            <div class="order-actions">
              <button
                class="action-btn cancel-btn"
                v-if="order.status === 'pending'"
                @click="handleCancelOrder(order)"
              >
                取消订单
              </button>
              <button
                class="action-btn detail-btn"
                @click="handleOrderDetail(order)"
              >
                订单详情
              </button>
              <button
                class="action-btn pay-btn"
                v-if="order.status === 'pending'"
                @click="handlePayOrder(order)"
              >
                去支付
              </button>
            </div>
          </div>
        </div>

        <el-empty
          v-if="ordersList.length === 0"
          description="暂无订单数据"
        ></el-empty>
      </div>

      <!-- 分页 -->
      <div class="pagination-section" v-if="ordersList.length > 0">
        <el-pagination
          :total="totalOrders"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyOrders",
  data() {
    return {
      activeTab: 0,
      currentPage: 1,
      pageSize: 10,
      totalOrders: 0,
      ordersList: [],
      orderTabs: [
        { label: "全部订单", value: 0 },
        { label: "待付款", value: 1 },
        { label: "已完成", value: 2 },
        { label: "已取消", value: -1 },
      ],
    };
  },
  computed: {},
  mounted() {
    this.getOrders();
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
      this.currentPage = 1;
      this.getOrders();
    },
    async getOrders() {
      try {
        const res = await this.$api({
          url: "pcOrderList",
          method: "get",
          data: {
            page: this.currentPage,
            limit: this.pageSize,
            status: this.activeTab,
          },
        });
        if (res.code === 200 && res.data) {
          this.ordersList = res.data.list;
          this.totalOrders = res.data.count || 0;
        }
      } catch (error) {
        console.error("获取订单列表失败:", error);
      }
    },
    handleCancelOrder(order) {
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
          //   data: { orderId: order.id },
          // }).then((res) => {
          //   if (res.code === 200) {
          //     this.$message.success("订单已取消");
          //     this.getOrders();
          //   }
          // });
          this.$message.success("订单已取消");
          this.getOrders();
        })
        .catch(() => {});
    },
    handleOrderDetail(order) {
      // 跳转到订单详情页
      this.$router.push(`/my/order-detail?id=${order.id}`);
    },
    handlePayOrder(order) {
      // 跳转到支付页面
      this.$router.push(`/pay-success?orderId=${order.id}`);
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style lang="less" scoped>
.orders-page {
  border-radius: 8px;

  .page-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    height: 56px;
    padding: 0 30px;
    line-height: 56px;
    margin-bottom: 20px;
    background: #fff;
  }

  .order-tabs-box {
    background: #fff;
    padding: 20px 30px;
  }

  // 订单状态标签
  .order-tabs {
    background: #fff;

    display: flex;
    gap: 40px;
    margin-bottom: 30px;

    .tab-item {
      font-size: 16px;
      color: #666;
      cursor: pointer;
      padding-bottom: 8px;
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        color: #0081ff;
      }

      &.active {
        color: #0081ff;
        font-weight: 500;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #0081ff;
        }
      }
    }
  }

  // 订单列表
  .order-list {
    background: #fff;

    .order-item {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      // 订单头部
      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e8e8e8;
        height: 44px;
        line-height: 44px;
        background: #f5f5f5;
        padding: 0 30px;

        .order-info {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: #666;

          .order-time {
            color: #666;
          }

          .order-number {
            color: #666;
          }
        }

        .order-status {
          font-size: 14px;
          font-weight: 500;
          color: #ea3200;

          &.status-pending {
            color: #ea3200;
          }

          &.status-completed {
            color: #52c41a;
          }

          &.status-cancelled {
            color: #999;
          }
        }
      }

      // 订单内容
      .order-content {
        height: 112px;
        padding-left: 30px;
        display: flex;
        .order-item-info {
          display: flex;
          flex-direction: column;
          justify-content: center;

          .item-title {
            font-size: 16px;
            color: #333;
          }

          .item-price {
            margin-top: 17px;
            font-size: 18px;
            font-weight: bold;
            color: #0081ff;
          }
        }
      }

      // 订单底部
      .order-footer {
        height: 76px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;
        border-top: 1px solid #e8e8e8;

        .order-total {
          font-size: 16px;
          color: #666;

          .total-amount {
            font-size: 18px;
            font-weight: bold;
            color: #e0291f;
            margin-left: 8px;
          }
        }

        .order-actions {
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

            &.cancel-btn,
            &.detail-btn {
              background: #fff;
              color: #0081ff;

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
  }

  // 分页
  .pagination-section {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }
}
</style>
