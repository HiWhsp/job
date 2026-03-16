<template>
  <div class="page">
    <div class="main-title flex">
      <img src="@img/my/nav-7.png" alt="" />
      <span>销售业绩</span>
    </div>

    <div class="page-ctx">
      <!-- 业绩统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <img src="@img/my/nav-1.png" alt="" />
          </div>
          <div class="stat-content">
            <div class="stat-value">¥{{ totalSales }}</div>
            <div class="stat-label">总销售额</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <img src="@img/my/nav-2.png" alt="" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalOrders }}</div>
            <div class="stat-label">总订单数</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <img src="@img/my/nav-3.png" alt="" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalCustomers }}</div>
            <div class="stat-label">客户数量</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <img src="@img/my/nav-4.png" alt="" />
          </div>
          <div class="stat-content">
            <div class="stat-value">¥{{ commission }}</div>
            <div class="stat-label">佣金收入</div>
          </div>
        </div>
      </div>

      <!-- 业绩趋势图表 -->
      <div class="chart-section">
        <div class="section-title">
          <span>销售趋势</span>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <div class="chart-text">销售趋势图表</div>
            <div class="chart-desc">这里可以集成图表组件显示销售数据趋势</div>
          </div>
        </div>
      </div>

      <!-- 最近订单 -->
      <!-- <div class="recent-orders">
        <div class="section-title">
          <span>最近订单</span>
        </div>
        
        <div class="order-list">
          <div class="empty-info" v-if="!recentOrders.length">
            <div class="empty-img">
              <img src="@img/common/empty-img.png" alt="" />
            </div>
            <div class="empty-text">暂无订单数据</div>
          </div>
          
          <div class="order-table" v-else>
            <div class="table-header">
              <div class="header-cell">订单号</div>
              <div class="header-cell">客户</div>
              <div class="header-cell">订单金额</div>
              <div class="header-cell">佣金</div>
              <div class="header-cell">订单状态</div>
              <div class="header-cell">下单时间</div>
            </div>
            
            <div class="table-body">
              <div class="table-row" v-for="(item, index) in recentOrders" :key="index">
                <div class="table-cell">{{ item.orderNo }}</div>
                <div class="table-cell">{{ item.customerName }}</div>
                <div class="table-cell">¥{{ item.amount }}</div>
                <div class="table-cell">¥{{ item.commission }}</div>
                <div class="table-cell">
                  <span class="status-tag" :class="getStatusClass(item.status)">
                    {{ getStatusText(item.status) }}
                  </span>
                </div>
                <div class="table-cell">{{ item.createTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "sales-performance",
  data() {
    return {
      totalSales: " 0.00",
      totalOrders: 0,
      totalCustomers: 0,
      commission: "0.00",
      recentOrders: [
        {
          orderNo: "202401150001",
          customerName: "张三",
          amount: "580.00",
          commission: "58.00",
          status: 1,
          createTime: "2024-01-15 14:30"
        },
        {
          orderNo: "202401150002",
          customerName: "李四",
          amount: "320.00",
          commission: "32.00",
          status: 2,
          createTime: "2024-01-15 16:20"
        },
        {
          orderNo: "202401150003",
          customerName: "王五",
          amount: "1,200.00",
          commission: "120.00",
          status: 3,
          createTime: "2024-01-15 18:45"
        }
      ]
    };
  },
  created() {
    this.loadSalesData();
  },
  methods: {
    loadSalesData() {
      // 这里应该调用API获取销售数据
      // this.$api({
      //   url: "/service.php",
      //   method: "get",
      //   data: {
      //     action: "getSalesPerformance",
      //   },
      // }).then((res) => {
      //   if (res.code == 200) {
      //     this.totalSales = res.data.totalSales;
      //     this.totalOrders = res.data.totalOrders;
      //     this.totalCustomers = res.data.totalCustomers;
      //     this.commission = res.data.commission;
      //     this.recentOrders = res.data.recentOrders;
      //   }
      // });
    },
    
    getStatusClass(status) {
      const statusMap = {
        1: 'status-pending',
        2: 'status-processing', 
        3: 'status-completed',
        4: 'status-cancelled'
      };
      return statusMap[status] || 'status-default';
    },
    
    getStatusText(status) {
      const statusMap = {
        1: '待付款',
        2: '已付款',
        3: '已完成',
        4: '已取消'
      };
      return statusMap[status] || '未知';
    }
  }
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px; 

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Poppins, Poppins;
    font-weight: bold;
    color: #333333;

    img {
      width: 22px;
      margin-right: 10px;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 40px 32px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.section-title {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;

  .stat-card {
    display: flex;
    align-items: center;
    padding: 24px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;

    .stat-icon {
      width: 48px;
      height: 48px;
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #00306B;
      border-radius: 8px;

      img {
        width: 24px;
        height: 24px;
        filter: brightness(0) invert(1);
      }
    }

    .stat-content {
      flex: 1;

      .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: #1F1F1F;
      }
    }
  }
}

.chart-section {
  margin-bottom: 40px;

  .chart-container {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 40px;
    text-align: center;

    .chart-placeholder {
      .chart-text {
        font-size: 18px;
        color: #333333;
        margin-bottom: 8px;
      }

      .chart-desc {
        font-size: 14px;
        color: #1F1F1F;
      }
    }
  }
}

.recent-orders {
  .order-list {
    .empty-info {
      text-align: center;
      padding: 60px 0;
      
      .empty-img {
        margin-bottom: 20px;
        
        img {
          width: 120px;
          height: 120px;
          opacity: 0.5;
        }
      }
      
      .empty-text {
        font-size: 16px;
        color: #505050;
      }
    }
  }
}

.order-table {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  overflow: hidden;

  .table-header {
    display: flex;
    background: #f9f9f9;
    border-bottom: 1px solid #e5e5e5;

    .header-cell {
      flex: 1;
      padding: 16px 12px;
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      text-align: left;

      &:nth-child(1) { flex: 0 0 140px; } // 订单号
      &:nth-child(2) { flex: 0 0 100px; } // 客户
      &:nth-child(3) { flex: 0 0 100px; } // 订单金额
      &:nth-child(4) { flex: 0 0 100px; } // 佣金
      &:nth-child(5) { flex: 0 0 100px; } // 订单状态
      &:nth-child(6) { flex: 0 0 140px; } // 下单时间
    }
  }

  .table-body {
    .table-row {
      display: flex;
      border-bottom: 1px solid #e5e5e5;

      &:last-child {
        border-bottom: none;
      }

      .table-cell {
        flex: 1;
        padding: 16px 12px;
        font-size: 14px;
        color: #333333;
        text-align: left;
        line-height: 1.4;

        &:nth-child(1) { flex: 0 0 140px; } // 订单号
        &:nth-child(2) { flex: 0 0 100px; } // 客户
        &:nth-child(3) { flex: 0 0 100px; } // 订单金额
        &:nth-child(4) { flex: 0 0 100px; } // 佣金
        &:nth-child(5) { flex: 0 0 100px; } // 订单状态
        &:nth-child(6) { flex: 0 0 140px; } // 下单时间

        .status-tag {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;

          &.status-pending {
            background: #fff3cd;
            color: #856404;
          }

          &.status-processing {
            background: #d1ecf1;
            color: #0c5460;
          }

          &.status-completed {
            background: #d4edda;
            color: #155724;
          }

          &.status-cancelled {
            background: #f8d7da;
            color: #721c24;
          }
        }
      }
    }
  }
}
</style>










