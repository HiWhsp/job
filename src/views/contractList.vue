<template>
  <div class="page-index">
    <div class="main-content w-1600" style="margin-top: 0; padding-top: 20px">
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
          <p class="latest-updates-title">最新动态</p>
          <div class="updates-list">
            <div
              class="update-item"
              v-for="(update, index) in latestUpdates"
              :key="index"
            >
              <span class="update-content"
                >{{ update.come == 1 ? "最新上传" : "最近下载" }} |
                {{ update.title }}</span
              >
              <span class="update-date">{{ update.created_at }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 合同文书区域 -->
      <div class="contract-section">
        <!-- 分类标签 -->
        <div class="category-tabs list-tab">
          <div
            class="tab-item"
            :class="{ active: activeCategory === '' }"
            @click="switchCategory('')"
          >
            全部
          </div>
          <div
            class="tab-item"
            :class="{ active: activeCategory === category.id }"
            v-for="category in vuex_category_tree"
            :key="category.key"
            @click="switchCategory(category.id)"
          >
            {{ category.title }}
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
            <div class="filter sort-box">
              <div class="item">
                <div class="text">共{{ currentContracts.length }}个</div>
              </div>
              <div class="item">
                <div class="text">{{ getCurrentCategoryName() }}</div>
              </div>
              <div
                class="item"
                v-for="(item, index) in sortList"
                :key="index"
                :class="orderByColumn == item.ziduan ? 'active' : ''"
                @click="onClickSort(item)"
              >
                <div class="text">{{ item.title }}</div>
                <div class="sanjiao-box" v-if="item.title != '综合排序'">
                  <div
                    class="top"
                    :class="
                      orderByColumn == item.ziduan && isAsc == 'asc'
                        ? 'active'
                        : ''
                    "
                  ></div>
                  <div
                    class="bottom"
                    :class="
                      orderByColumn == item.ziduan && isAsc == 'desc'
                        ? 'active'
                        : ''
                    "
                  ></div>
                </div>
              </div>
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

      <div class="advertising-section">
        <div class="advertising-banner">
          <img src="@img/index/advertising-banner.jpg" alt="" />
        </div>
      </div>
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
      activeCategory: "",
      categories: [],
      // 最新动态
      latestUpdates: [],
      // 合同文书
      contracts: {},
      isAsc: "", //升asc 降序desc
      orderByColumn: "ordering", //选择的排序方式
      sortList: [
        { title: "综合排序", ziduan: "ordering", orderType: 0, orderTyped: 0 },
        { title: "销量", ziduan: "orders", orderType: 1, orderTyped: 1 },
        { title: "价格", ziduan: "priceSale", orderType: 2, orderType: 3 },
      ],
      chosenSort: {
        title: "综合排序",
        ziduan: "ordering",
        orderType: 0,
        orderTyped: 0,
      },
    };
  },
  computed: {
    ...mapState(["vuex_index_banners"]),
    currentContracts() {
      if (this.activeCategory === "") {
        return (
          this.contracts || this.contracts.flatMap((item) => item.child) || []
        );
      }
      return (
        this.contracts.find((item) => item.id === this.activeCategory).child ||
        []
      );
    },
  },
  mounted() {
    this.getIndex();
  },
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
      const category = this.vuex_category_tree.find(
        (cat) => cat.id === this.activeCategory
      );
      return category ? category.title : "全部";
    },
    getIndex() {
      this.$api({
        url: "index",
        method: "get",
        data: {
          keyword: this.searchKeyword,
        },
      }).then((res) => {
        this.latestUpdates = res.data.recent;
        this.contracts = res.data.category_list;
      });
    },
    // 搜索
    handleSearch() {
      console.log("搜索关键词:", this.searchKeyword);
      // 这里可以添加搜索逻辑
      this.getIndex();
    },
    //排序方式
    onClickSort(item) {
      if (item.ziduan == this.orderByColumn) {
        this.isAsc = this.isAsc == "asc" ? "desc" : "asc";
      } else {
        this.isAsc = "asc";
      }
      this.orderByColumn = item.ziduan;

      let sortParams = {
        // orderByColumn: this.orderByColumn,
        // isAsc: this.isAsc,

        order1: this.orderByColumn,
        order2: this.orderByColumn != "ordering" ? this.isAsc : "",
      };
      this.chosenSort = item;
      this.getIndex();
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
