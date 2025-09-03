<template>
  <div class="page-index">
    <div class="main-content w-1600">
      <!-- 业务公告 -->
      <div class="announcement-section">
        <div class="announcement-banner">
          <div class="banner-content">
            <div class="announcement-text red-text">
              购买并下载本站合同范本，即可享受律师合同审核、签约指导及终生法律咨询服务，下载后添加律师微信（18696628883）即可获取上述服务；
            </div>
            <div class="announcement-text">
              提供<span>免费法律咨询服务</span>，专业团队为您答疑解惑，助您明确法律问题解决方案；
            </div>
            <div class="announcement-text">
              提供<span>免费律师中介服务</span>，为您推荐、匹配适合案件的资深专业律师。
            </div>
          </div>
        </div>

        <!-- 最新动态 -->
        <div class="latest-updates">
          <div class="updates-list">
            <div
              class="update-item"
              v-for="(update, index) in latestUpdates"
              :key="index"
            >
              <span class="update-content">{{ update.content }}</span>
              <span class="update-date">{{ update.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 面包屑导航 -->
      <div class="breadcrumb-section">
        <div class="breadcrumb">
          <span class="breadcrumb-item">首页</span>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-item">房屋租赁</span>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-item active">写字楼办公室房屋租赁合同</span>
        </div>
      </div>

      <!-- 合同内容区域 -->
      <div class="contract-content-section">
        <!-- 左侧文档预览区域 -->
        <div class="document-preview">
          <div class="document-container">
            <div class="document-page">
              <div class="document-content blurred"></div>
            </div>
          </div>
        </div>

        <!-- 右侧下载信息区域 -->
        <div class="download-info">
          <!-- 下载须知 -->
          <div class="download-notice">
            <h3 class="notice-title">下载须知</h3>
            <div class="notice-content">
              <p>
                1.
                购买本站合同范本，即可享受律师合同审核、签约指导及终生法律咨询服务，下载后添加律师微信（18696628883）即可获取上述服务；
              </p>
              <p>2. 本产品为电子文档，无实体发货，无快递配送；</p>
              <p>
                3.
                由于电子产品的可复制性，下载后不支持退换货，请确认需求后再购买；
              </p>
              <p>
                4.
                如有疑问，请先咨询律师微信（18696628883）后再下单，或直接向律师购买合同范本。
              </p>
            </div>
          </div>

          <!-- 文档详情 -->
          <div class="document-details">
            <div class="detail-list">
              <div class="detail-item">
                <span class="detail-label">软件：</span>
                <span class="detail-value">Word</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">格式：</span>
                <span class="detail-value">docx</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">大小：</span>
                <span class="detail-value">1MB</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">页数：</span>
                <span class="detail-value">共4页</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">版权范围：</span>
                <span class="detail-value">个人/企业</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button class="download-btn">
                <img src="@/assets/img/common/down.png" alt="" />
                <span>下载Word版本</span>
              </button>
              <button class="collect-btn">
                <img src="@/assets/img/common/collect.png" alt="" />
                <span>收藏</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="contract-section">
        <div class="section-title">
          <div
            class="section-title-text"
            :style="{
              backgroundImage: `url(${require('@img/index/icon2.png')})`,
            }"
          >
            相关合同文书
          </div>
        </div>
        <div class="contract-grid">
          <ContractCard
            v-for="contract in currentContracts"
            :key="contract.id"
            :contract="contract"
          />
          <el-empty
            style="width: 100%; height: 100%"
            description="暂无数据"
            v-if="currentContracts.length === 0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContractCard from "@/components/ContractCard.vue";
export default {
  name: "contractDetail",
  components: {
    ContractCard,
  },
  data() {
    return {
      latestUpdates: [
        {
          date: "2025-08-13",
          content: "最新上传 | 个人房屋租赁合同范本(实用)",
        },
        {
          date: "2025-08-13",
          content: "最新上传 | 个人房屋租赁合同范本(实用)",
        },
        {
          date: "2025-08-13",
          content: "最近下载 | 个人房屋租赁合同范本(实用)",
        },
        {
          date: "2025-08-13",
          content: "最近下载 | 个人房屋租赁合同范本(实用)",
        },
      ],
      contracts: {
        production: [
          { id: 1, title: "生产经营合同", viewCount: 123, collectCount: 123 },
          { id: 2, title: "生产经营合同", viewCount: 123, collectCount: 123 },
          { id: 3, title: "生产经营合同", viewCount: 123, collectCount: 123 },
          { id: 4, title: "生产经营合同", viewCount: 123, collectCount: 123 },
          { id: 5, title: "生产经营合同", viewCount: 123, collectCount: 123 },
        ],
      },
    };
  },
  computed: {
    currentContracts() {
      return this.contracts.production;
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
@import "./contractDetail.less";
</style>
