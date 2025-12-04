<template>
  <div class="page-index">
    <div class="lunbo-box">
      <el-carousel trigger="click" :autoplay="false">
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
          <div class="banner-content" v-html="yewuGonggaoWithoutStyle"></div>
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
                class="btn-hover"
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
            class="tab-item btn-hover"
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
        <div
          class="contract-list-section"
          v-for="(item, index) in contracts"
          :key="index"
        >
          <div class="section-title">
            <div
              class="section-title-text"
              v-if="index % 2 === 0"
              :style="{
                backgroundImage: `url(${require('@img/index/icon1.png')})`,
              }"
            >
              {{ item.title }}
            </div>
            <div
              class="section-title-text"
              v-if="index % 2 === 1"
              :style="{
                backgroundImage: `url(${require('@img/index/icon2.png')})`,
              }"
            >
              {{ item.title }}
            </div>
            <div class="view-more-btn">
              <el-button type="primary" @click="handleViewMore(item.id)">
                查看更多
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </div>
          </div>

          <div class="contract-grid">
            <template v-if="!searchKeyword">
              <ContractCard
                v-for="contract in item.child.slice(0, 5)"
                :key="contract.id"
                :contract="contract"
              />
            </template>
            <template v-else>
              <ContractCard
                v-for="contract in item.child"
                :key="contract.id"
                :contract="contract"
              />
            </template>
            <el-empty
              style="width: 100%; height: 100%"
              description="暂无数据"
              v-if="item.child.length === 0"
            />
          </div>

          <!-- <div class="advertising-section" v-if="item.title == '婚姻家庭'">
            <div class="advertising-banner">
              <img src="@img/index/advertising-banner.jpg" alt="" />
            </div>
          </div> -->
        </div>
        <el-empty
          style="width: 100%; height: 100%"
          description="暂无数据"
          v-if="contracts.length === 0"
        />
      </div>

      <div class="footer-section btn-hover" @click="handleViewMore(0)">
        查看更多合同文书
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
    };
  },
  computed: {
    ...mapState(["vuex_index_banners"]),
    // 去除富文本中的 style 样式
    yewuGonggaoWithoutStyle() {
      if (!this.vuex_config || !this.vuex_config.yewu_gonggao) {
        return "";
      }
      // 使用正则表达式去除所有 style 属性（包括单引号、双引号、以及各种空格情况）
      return this.vuex_config.yewu_gonggao.replace(/\s*style\s*=\s*(["'])[^"']*\1/gi, "");
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
      this.$router.push("/contractList?category=" + categoryKey);
      // this.activeCategory = categoryKey;
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
        if (this.searchKeyword) {
          let arr = [];
          res.data.category_list.forEach((item) => {
            if (item.child.length > 0) {
              arr.push(...item.child);
            }
          });
          console.log(arr);

          this.contracts = [
            {
              title: "为您推荐",
              child: arr,
            },
          ];
        } else {
          this.contracts = res.data.category_list;
        }
      });
    },
    // 搜索
    handleSearch() {
      console.log("搜索关键词:", this.searchKeyword);
      // 这里可以添加搜索逻辑
      this.getIndex();
    },
    // 查看更多
    handleViewMore(categoryId = '0') {
      this.$router.push("/contractList?category=" + categoryId || '0');
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
<style scoped lang="less" src="@/assets/h5css/index.less"></style>

