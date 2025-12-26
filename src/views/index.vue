<template>
  <div class="page-index">
    <div class="lunbo-box">
      <el-carousel trigger="click" :autoplay="true">
        <el-carousel-item
          v-for="(item, index) in vuex_index_banners"
          :key="index"
          @click.native="do_banner_click(item)"
        >
          <div
            class="banner-item-content"
            :style="{ backgroundImage: `url(${item.image})` }"
          >
            <p class="banner-item-title">{{ item.title }}</p>
            <p class="banner-item-description">{{ item.description }}</p>
            <div class="banner-item-btn">
              <span>了解更多</span>
              <i class="el-icon-right"></i>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="main-content w-1600">
      <!-- 精选文档 -->
      <div class="contract-section">
        <div class="head-title">
          <div class="left-title">
            <h2><span>精选</span>文档</h2>
            <span>来自专业机构的权威发布信息，值得信赖</span>
          </div>
          <div class="right-title">
            <div class="right-title">
              <!-- 左右切换按钮 -->
              <div class="carousel-box">
                <div class="left-btn" @click="handleLeftClick">
                  <i class="el-icon-arrow-left"></i>
                </div>
                <div class="right-btn" @click="handleRightClick">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="contract-grid">
          <!-- 使用轮播图来展示， 一行展示6个 -->
          <el-carousel
            ref="carousel"
            arrow="never"
            trigger="click"
            :autoplay="false"
          >
            <el-carousel-item
              v-for="(item, index) in selectedDocumentList"
              :key="index"
            >
              <div class="contract-grid-item">
                <ContractCard
                  v-for="(contract, index2) in item"
                  :key="index2"
                  :contract="contract"
                />
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!-- 免费下载 -->
      <div class="contract-section free-download-section">
        <div class="head-title">
          <div class="left-title">
            <h2><span>免费</span>下载</h2>
          </div>
          <div class="right-title-text btn-hover" @click="handleViewMore(0)">
            <span>更多</span>
            <i class="el-icon-right"></i>
          </div>
        </div>
        <div class="download-content">
          <div
            class="download-item"
            v-for="(item, index) in freeDownloadDocumentList"
            :key="index"
          >
            <img :src="item.thumb" alt="" />
            <div class="download-item-title ellipsis-2">
              {{ item.title }}
            </div>
            <div class="download-item-down" @click="downloadDocument(item)">
              <span>下载</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 文档列表 -->
      <div class="contract-section" style="margin-top: 57px">
        <div class="head-title">
          <div class="left-title">
            <h2><span>文档</span>列表</h2>
            <span>来自专业机构的权威发布信息，值得信赖</span>
          </div>
          <div class="type-list">
            <!-- 类型菜单 -->
            <div class="type-menu-wrapper">
              <div
                class="type-menu-arrow left-arrow"
                :class="{ disabled: !canScrollLeft }"
                @click="scrollTypeMenu('left')"
              >
                <i class="el-icon-arrow-left"></i>
              </div>
              <div class="type-menu-container">
                <div class="type-menu-list" ref="typeMenuList">
                  <div
                    class="type-menu-item"
                    :class="{ active: activeType === category.id }"
                    v-for="(category, index) in vuex_document_tree"
                    :key="index"
                    @click="switchType(category.id)"
                  >
                    {{ category.title }}
                  </div>
                </div>
              </div>
              <div
                class="type-menu-arrow right-arrow"
                :class="{ disabled: !canScrollRight }"
                @click="scrollTypeMenu('right')"
              >
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="contract-grid">
          <div class="contract-grid-item">
            <ContractCard
              v-for="(contract, index) in documentList"
              :key="index"
              :contract="contract"
            />
            <div class="empty-container">
              <el-empty
                v-if="documentList.length === 0"
                description="暂无数据"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 公司信息 -->
      <div class="company-info">
        <div class="company-info-content">
          <div class="company-info-left">
            <h2 class="company-name">{{ vuex_config.site_name }}</h2>
            <p class="company-slogan">致力于现代化企业体系服务</p>
            <p
              class="company-description"
              v-html="vuex_config.site_content"
            ></p>
            <div class="company-btn btn-hover" @click="handleLearnMore">
              <span>了解详情</span>
              <i class="el-icon-right"></i>
            </div>
          </div>
          <div class="company-info-right">
            <div class="company-image-placeholder">
              <img :src="vuex_config.site_img" alt="" />
            </div>
          </div>
        </div>
      </div>
      <!-- 新闻资讯 -->
      <div class="contract-section">
        <div class="head-title">
          <div class="left-title">
            <h2><span>新闻</span>资讯</h2>
            <span>我们从未停止探索</span>
          </div>
          <div class="right-title-text btn-hover" @click="handleViewMoreNews">
            <span>更多</span>
            <i class="el-icon-right"></i>
          </div>
        </div>
        <div class="news-list">
          <div class="news-grid">
            <div
              class="news-card"
              v-for="(news, index) in newsList"
              :key="index"
              @click="handleNewsClick(news)"
            >
              <div class="news-card-header">
                <span class="news-date">
                  <img src="@/assets/img/index/news-date.png" alt="" />{{
                    news.created_at
                  }}</span
                >
                <span class="news-tag"> 公司新闻 </span>
              </div>
              <h3 class="news-title ellipsis-2">{{ news.title }}</h3>
              <p class="news-description ellipsis-2">{{ news.description }}</p>
              <div class="news-footer">
                <span class="news-link">
                  了解详情
                  <i class="el-icon-right"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="news-more">
            <div class="more-btn btn-hover" @click="handleViewMoreNews">
              <span>查看更多</span>
              <i class="el-icon-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ContractCard from "@/components/ContractCard.vue";

export default {
  name: "Index",
  components: {
    ContractCard,
  },
  data() {
    return {
      searchKeyword: "",
      activeCategory: "",
      // 精选文档
      selectedDocumentList: [],
      // 文档列表
      documentList: [],
      // 文档列表的当前选中类型
      activeType: "",
      // 免费下载文档
      freeDownloadDocumentList: [],
      // 类型菜单滚动相关
      canScrollLeft: false,
      canScrollRight: false,
      scrollTimer: null,
      resizeTimer: null,
      // 新闻资讯
      newsList: [],
    };
  },
  watch: {
    vuex_document_tree: {
      handler() {
        this.$nextTick(() => {
          this.checkScrollButtons();
          // 如果还没有初始化监听，则初始化
          if (this.$refs.typeMenuList) {
            this.initTypeMenuScroll();
          }
        });
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState(["vuex_index_banners", "vuex_config", "vuex_document_tree"]),
  },
  mounted() {
    // 获取首页数据
    this.getIndex();
    this.getList();
    // 获取新闻列表
    this.getNewsList();
    // 初始化类型菜单滚动
    this.$nextTick(() => {
      this.initTypeMenuScroll();
    });
  },
  beforeDestroy() {
    // 移除滚动监听
    this.removeTypeMenuScrollListeners();
    // 清理定时器
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
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

    // 下载文档
    downloadDocument(item) {
      window.open(item.url, "_blank");
    },

    // 获取首页数据
    async getIndex() {
      // 获取精选文档
      try {
        const res = await this.$api({
          url: "pcDocumentList",
          method: "get",
          data: {
            page: 1,
            limit: 100, // 获取更多数据用于筛选
            ifSelected: 1,
          },
        });
        if (res.code === 200 && res.data && res.data.list) {
          // 按照6个一组，分成多组
          this.selectedDocumentList = res.data.list.reduce(
            (acc, curr, index) => {
              if (index % 6 === 0) {
                acc.push([]);
              }
              acc[acc.length - 1].push(curr);
              return acc;
            },
            []
          );
          // 数据加载完成后检查滚动按钮状态
          this.$nextTick(() => {
            this.checkScrollButtons();
          });
        }
      } catch (error) {
        console.error("获取文档列表失败:", error);
      }
      // 免费下载文档
      try {
        const res = await this.$api({
          url: "pcDocumentList",
          method: "get",
          data: {
            page: 1,
            limit: 7,
            ifFree: 1,
          },
        });
        if (res.code === 200 && res.data && res.data.list) {
          this.freeDownloadDocumentList = res.data.list;
        }
      } catch (error) {
        console.error("获取免费下载文档列表失败:", error);
      }
      this.activeType = this.vuex_document_tree[0].id;
      this.getList();
    },
    async getList() {
      try {
        const res = await this.$api({
          url: "pcDocumentList",
          method: "get",
          data: {
            page: 1,
            limit: 12,
            typeId: this.activeType,
          },
        });
        if (res.code === 200 && res.data && res.data.list) {
          this.documentList = res.data.list;
        }
      } catch (error) {
        console.error("获取文档列表失败:", error);
      }
    },
    // 搜索
    handleSearch() {
      console.log("搜索关键词:", this.searchKeyword);
      // 这里可以添加搜索逻辑
      this.getIndex();
    },
    // 查看更多
    handleViewMore(categoryId = "0") {
      this.$router.push("/contractList?category=" + categoryId || "0");
    },
    // 了解详情
    handleLearnMore() {
      this.$router.push("/about");
    },
    // 获取新闻列表
    async getNewsList() {
      // 获取新闻
      try {
        const res = await this.$api({
          url: "getArticleList",
          method: "get",
          data: {
            page: 1,
            limit: 4,
          },
        });
        if (res.code === 200 && res.data && res.data.list) {
          this.newsList = res.data.list;
        }
      } catch (error) {
        console.error("获取新闻列表失败:", error);
      }
    },
    // 新闻卡片点击
    handleNewsClick(news) {
      this.$router.push("/newsDetail?id=" + news.id);
    },
    // 查看更多新闻
    handleViewMoreNews() {
      // 可以跳转到新闻列表页
      this.$router.push("/news");
    },
    // 左切换
    handleLeftClick() {
      this.$refs.carousel.prev();
    },
    // 右切换
    handleRightClick() {
      this.$refs.carousel.next();
    },
    // 切换类型
    switchType(typeId) {
      this.activeType = typeId;
      this.getList();
    },
    // 初始化类型菜单滚动
    initTypeMenuScroll() {
      // 延迟检查，确保DOM完全渲染
      setTimeout(() => {
        this.checkScrollButtons();
      }, 100);
      // 添加滚动监听
      const list = this.$refs.typeMenuList;
      if (list) {
        list.addEventListener("scroll", this.handleTypeMenuScroll);
        // 监听窗口大小变化
        window.addEventListener("resize", this.handleTypeMenuResize);
      }
    },
    // 移除类型菜单滚动监听
    removeTypeMenuScrollListeners() {
      const list = this.$refs.typeMenuList;
      if (list) {
        list.removeEventListener("scroll", this.handleTypeMenuScroll);
      }
      window.removeEventListener("resize", this.handleTypeMenuResize);
    },
    // 处理类型菜单滚动事件（使用防抖）
    handleTypeMenuScroll() {
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.scrollTimer = setTimeout(() => {
        this.checkScrollButtons();
      }, 50);
    },
    // 处理窗口大小变化（使用防抖）
    handleTypeMenuResize() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(() => {
        this.checkScrollButtons();
      }, 200);
    },
    // 滚动类型菜单
    scrollTypeMenu(direction) {
      const list = this.$refs.typeMenuList;
      if (!list) return;

      // 如果箭头处于禁用状态，不执行滚动
      if (direction === "left" && !this.canScrollLeft) return;
      if (direction === "right" && !this.canScrollRight) return;

      // 根据列表可见宽度计算滚动距离，每次滚动约80%的可见宽度
      const scrollAmount = list.clientWidth * 0.8;
      const currentScroll = list.scrollLeft;
      let targetScroll;

      if (direction === "left") {
        targetScroll = Math.max(0, currentScroll - scrollAmount);
      } else {
        const maxScroll = list.scrollWidth - list.clientWidth;
        targetScroll = Math.min(maxScroll, currentScroll + scrollAmount);
      }

      list.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });

      // 使用 requestAnimationFrame 来更精确地检查滚动状态
      const checkAfterScroll = () => {
        requestAnimationFrame(() => {
          this.checkScrollButtons();
          // 如果还在滚动中，继续检查
          if (Math.abs(list.scrollLeft - targetScroll) > 1) {
            setTimeout(checkAfterScroll, 50);
          }
        });
      };
      setTimeout(checkAfterScroll, 100);
    },
    // 检查滚动按钮状态
    checkScrollButtons() {
      const list = this.$refs.typeMenuList;
      if (!list) {
        this.canScrollLeft = false;
        this.canScrollRight = false;
        return;
      }

      // 检查列表的实际宽度和可见宽度
      const scrollLeft = list.scrollLeft;
      const scrollWidth = list.scrollWidth;
      const clientWidth = list.clientWidth;

      // 使用小阈值来避免浮点数精度问题
      const threshold = 2;

      // 如果内容宽度大于可见宽度，说明可以滚动
      const canScroll = scrollWidth > clientWidth + threshold;

      this.canScrollLeft = canScroll && scrollLeft > threshold;
      this.canScrollRight =
        canScroll && scrollLeft < scrollWidth - clientWidth - threshold;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
<style lang="less" scoped src="./style/h5-style.less"></style>
