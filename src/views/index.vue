<template>
  <div class="page-index">
    <div class="lunbo-box">
      <el-carousel trigger="click" :autoplay="true">
        <el-carousel-item
          v-for="(item, index) in vuex_index_banners"
          :key="index"
          @click.native="do_banner_click(item)"
        >
          <img :src="item.image" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>

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

      <!-- 合同文书区域 -->
      <div class="contract-section">
        <div class="section-header">
          <h2>
            <img src="@img/index/contract-icon.png" alt="" />
            合同文书：
          </h2>
          <div class="search-box">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索精品合同模板"
              class="search-input"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
              ></el-button>
            </el-input>
          </div>
        </div>

        <!-- 分类标签 -->
        <div class="category-tabs">
          <div
            class="tab-item"
            :class="{ active: activeCategory === category.key }"
            v-for="category in categories"
            :key="category.key"
            @click="switchCategory(category.key)"
          >
            {{ category.name }}
          </div>
        </div>

        <!-- 合同列表 -->
        <div class="contract-list-section">
          <div class="section-title">
            <div
              class="section-title-text"
              v-if="Math.random() > 0.5"
              :style="{
                backgroundImage: `url(${require('@img/index/icon1.png')})`,
              }"
            >
              {{ getCurrentCategoryName() }}
            </div>
            <div
              class="section-title-text"
              v-else
              :style="{
                backgroundImage: `url(${require('@img/index/icon2.png')})`,
              }"
            >
              {{ getCurrentCategoryName() }}
            </div>
            <div class="view-more-btn">
              <el-button type="primary">
                查看更多
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </div>
          </div>

          <div class="contract-grid">
            <ContractCard
              v-for="contract in currentContracts"
              :key="contract.id"
              :contract="contract"
              @view="handleViewContract"
              @collect="handleCollectContract"
            />
            <el-empty
              style="width: 100%; height: 100%"
              description="暂无数据"
              v-if="currentContracts.length === 0"
            />
          </div>
        </div>
      </div>

      <div class="advertising-section">
        <div class="advertising-banner">
          <img src="@img/index/advertising-banner.png" alt="" />
        </div>
      </div>
      <div class="footer-section">查看更多合同文书</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ContractCard from "@/components/ContractCard.vue";

export default {
  components: {
    ContractCard,
  },
  data() {
    return {
      searchKeyword: "",
      activeCategory: "production",
      categories: [
        { key: "all", name: "全部" },
        { key: "transaction", name: "买卖交易" },
        { key: "lease", name: "商务租赁" },
        { key: "consumption", name: "生活消费" },
        { key: "labor", name: "劳动人事" },
        { key: "decoration", name: "家装家居" },
        { key: "marriage", name: "婚姻家庭" },
        { key: "construction", name: "建设工程" },
        { key: "management", name: "公司管理" },
        { key: "agriculture", name: "农资农业" },
        { key: "litigation", name: "诉讼文书" },
        { key: "certificate", name: "证明文件" },
        { key: "latest", name: "最新上传" },
      ],
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
        transaction: [
          { id: 6, title: "买卖合同", viewCount: 89, collectCount: 67 },
          { id: 7, title: "买卖合同", viewCount: 89, collectCount: 67 },
          { id: 8, title: "买卖合同", viewCount: 89, collectCount: 67 },
          { id: 9, title: "买卖合同", viewCount: 89, collectCount: 67 },
          { id: 10, title: "买卖合同", viewCount: 89, collectCount: 67 },
        ],
        lease: [
          { id: 11, title: "租赁合同", viewCount: 156, collectCount: 98 },
          { id: 12, title: "租赁合同", viewCount: 156, collectCount: 98 },
          { id: 13, title: "租赁合同", viewCount: 156, collectCount: 98 },
          { id: 14, title: "租赁合同", viewCount: 156, collectCount: 98 },
          { id: 15, title: "租赁合同", viewCount: 156, collectCount: 98 },
        ],
      },
    };
  },
  computed: {
    ...mapState(["vuex_index_banners"]),
    currentContracts() {
      if (this.activeCategory === "all") {
        return Object.values(this.contracts).flat();
      }
      return this.contracts[this.activeCategory] || [];
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 轮播图点击
    do_banner_click(item) {
      if (item.url) {
        window.open(item.url, "_blank");
      } else if (item.inventoryId) {
        this.$router.push(
          "/product-detail/" + (item.skuId || item.inventoryId)
        );
      }
    },
    // 切换分类
    switchCategory(categoryKey) {
      this.activeCategory = categoryKey;
    },
    // 获取当前分类名称
    getCurrentCategoryName() {
      const category = this.categories.find(
        (cat) => cat.key === this.activeCategory
      );
      return category ? category.name : "全部";
    },
    // 搜索
    handleSearch() {
      console.log("搜索关键词:", this.searchKeyword);
      // 这里可以添加搜索逻辑
    },
    // 查看合同
    handleViewContract(contract) {
      console.log("查看合同:", contract);
      // 这里可以添加查看合同的逻辑
    },
    // 收藏合同
    handleCollectContract(contract) {
      console.log("收藏合同:", contract);
      // 这里可以添加收藏合同的逻辑
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
