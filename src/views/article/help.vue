<template>
  <div class="page">
    <pageBreadcrumb :option="nav_option" />
    <div class="inner">
      <div class="page-ctx w-1400">
        <div class="help-container">
          <!-- 左侧导航 -->
          <div class="help-sidebar">
            <div class="sidebar-title">帮助中心</div>
            <div class="sidebar-nav">
              <div
                class="nav-item"
                :class="{ active: activeTab === 'shopping' }"
                @click="activeTab = 'shopping'"
              >
                购物须知
              </div>
              <div
                class="nav-item"
                :class="{ active: activeTab === 'offline' }"
                @click="activeTab = 'offline'"
              >
                线下采购
              </div>
              <div
                class="nav-item"
                :class="{ active: activeTab === 'exchange' }"
                @click="activeTab = 'exchange'"
              >
                换货须知
              </div>
            </div>
          </div>

          <!-- 右侧内容 -->
          <div class="help-content">
            <div class="content-title">
              <div class="title-bar"></div>
              {{ getCurrentTitle() }}
            </div>

            <div class="content-body">
              <!-- 购物须知内容 -->
              <div v-if="activeTab === 'shopping'" class="content-section">
                <div class="section-item">
                  <div class="section-title">付款价格</div>
                  <div class="section-desc">
                    产品均为含13%税(票)价格,商城支持微信、支付宝、余额、银行转账支付方式
                  </div>
                </div>

                <div class="section-item">
                  <div class="section-title">开具发票</div>
                  <div class="section-desc">
                    订单提交时请申请发票,开票金额为实际支付金额。【增值税电子普通发票】在发货后48小时内开出,请在收票邮箱中领取。
                  </div>
                </div>

                <div class="section-item">
                  <div class="section-title">在线客服</div>
                  <div class="section-desc">
                    客服在线时间:周一至周五9:00-17:00(节假日除外)
                    联系电话:010-62628881
                  </div>
                </div>
              </div>

              <!-- 线下采购内容 -->
              <div v-if="activeTab === 'offline'" class="content-section">
                <div class="section-item">
                  <div class="section-title">线下采购流程</div>
                  <div class="section-desc">
                    请先联系我们的销售团队，预约线下采购时间。我们将为您安排专业的销售顾问进行一对一服务。
                  </div>
                </div>

                <div class="section-item">
                  <div class="section-title">联系方式</div>
                  <div class="section-desc">
                    销售热线: 010-62628881 | 邮箱: sales@company.com | 地址:
                    北京市朝阳区xxx大厦
                  </div>
                </div>
              </div>

              <!-- 换货须知内容 -->
              <div v-if="activeTab === 'exchange'" class="content-section">
                <div class="section-item">
                  <div class="section-title">换货条件</div>
                  <div class="section-desc">
                    商品需在收货后7天内申请换货，商品需保持原包装完整，无使用痕迹。
                  </div>
                </div>

                <div class="section-item">
                  <div class="section-title">换货流程</div>
                  <div class="section-desc">
                    1. 联系客服申请换货 2. 客服审核通过后安排退货 3.
                    收到退货后安排重新发货
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";
export default {
  name: "help",
  components: {
    pageBreadcrumb,
  },
  data() {
    return {
      nav_option: [{ title: "帮助中心", route: "/help" }],
      activeTab: "shopping", // 默认激活购物须知
    };
  },
  methods: {
    getCurrentTitle() {
      const titleMap = {
        shopping: "购物须知",
        offline: "线下采购",
        exchange: "换货须知",
      };
      return titleMap[this.activeTab] || "购物须知";
    },
  },
};
</script>

<style scoped lang="less">
.page {
  background-color: #f5f5f5;

  .inner {
    min-height: 700px;
    padding-top: 24px;
    padding-bottom: 30px;
  }
}

.bread-box {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e4e4e4;
  background: #fff;
}

.page-ctx {
  margin: 0 auto;
}

.help-container {
  display: flex;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  gap: 20px;
}

.help-sidebar {
  width: 260px;
  background: #fff;

  .sidebar-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    height: 58px;
    line-height: 58px;
    text-align: center;
  }

  .sidebar-nav {
    padding: 0;

    .nav-item {
      padding: 16px 20px;
      cursor: pointer;
      color: #333;
      font-size: 14px;
      transition: all 0.3s ease;
      position: relative;
      border-left: 4px solid transparent;

      &:hover {
        background-color: #f8f9fa;
      }

      &.active {
        background-color: #e3f2fd;
        color: #2e4c87;
        border-left: 4px solid #2e4c87;
        font-weight: 500;
      }
    }
  }
}

.help-content {
  flex: 1;
  padding: 0;
  background: #fff;

  .content-title {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    color: #000;
    padding: 24px 0 20px;
    border-bottom: 1px solid #e4e4e4;
    margin: 0 40px;

    .title-bar {
      width: 4px;
      height: 20px;
      background-color: #2E4C87;
      margin-right: 12px;
    }
  }

  .content-body {
    padding: 20px 40px;

    .content-section {
      .section-item {
        margin-bottom: 32px;

        &:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 12px;
        }

        .section-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          padding-left: 0;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .help-container {
    flex-direction: column;
  }

  .help-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e4e4e4;

    .sidebar-nav {
      display: flex;
      overflow-x: auto;

      .nav-item {
        white-space: nowrap;
        min-width: 120px;
        text-align: center;
        border-left: none;
        border-bottom: 3px solid transparent;

        &.active {
          border-left: none;
          border-bottom-color: #1976d2;
        }
      }
    }
  }

  .help-content {
    .content-body {
      padding: 20px;
    }
  }
}
</style>
