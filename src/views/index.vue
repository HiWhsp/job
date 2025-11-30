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
      <!-- 精选文档 -->
      <div class="contract-section">
        <div class="head-title">
          <div class="left-title">
            <h2><span>合同</span>文档</h2>
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
            <el-carousel-item v-for="i in 3" :key="i">
              <div class="contract-grid-item">
                <ContractCard
                  v-for="(contract, index) in displayContracts"
                  :key="index"
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
          <div class="download-item" v-for="i in 3" :key="i">
            <img alt="" />
            <div class="download-item-title ellipsis-2">
              仁寿县关于进一步支持科技创新的若干政策
            </div>
            <div class="download-item-down">
              <span>下载</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 精选文档 -->
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
                    :class="{ active: activeType === '' || activeType === 0 }"
                    @click="switchType('')"
                  >
                    全部
                  </div>
                  <div
                    class="type-menu-item"
                    :class="{ active: activeType === category.id }"
                    v-for="(category, index) in [
                      ...vuex_category_tree,
                      ...vuex_category_tree,
                      ...vuex_category_tree,
                    ]"
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
              v-for="(contract, index) in filteredContracts"
              :key="contract.id || index"
              :contract="contract"
            />
          </div>
        </div>
      </div>
      <!-- 公司信息 -->
      <div class="company-info">
        <div class="company-info-content">
          <div class="company-info-left">
            <h2 class="company-name">四川响梵信息科技有限公司</h2>
            <p class="company-slogan">致力于现代化企业体系服务</p>
            <p class="company-description">
              四川响梵信息科技有限公司成立于2023年,是一家致力于现代企业体系制度服务的企业,主要对企业制度体系建设、科技创新、政策咨询、科技成果积累、专项资金申报、会议展览、招投标代理、人力资源等内容进行服务。
            </p>
            <div class="company-btn btn-hover" @click="handleLearnMore">
              <span>了解详情</span>
              <i class="el-icon-right"></i>
            </div>
          </div>
          <div class="company-info-right">
            <div class="company-image-placeholder"></div>
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
              v-for="(news, index) in displayNews"
              :key="index"
              @click="handleNewsClick(news)"
            >
              <div class="news-card-header">
                <span class="news-date">
                  <img src="@/assets/img/index/news-date.png" alt="" />{{
                    news.date
                  }}</span
                >
                <span class="news-tag">
                  {{ news.category }}
                </span>
              </div>
              <h3 class="news-title ellipsis-2">{{ news.title }}</h3>
              <p class="news-description ellipsis-2">{{ news.description }}</p>
              <div class="news-footer">
                <span class="news-link" @click.stop="handleNewsDetail(news)">
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
      // 合同文书
      contracts: [],
      // 文档列表的当前选中类型
      activeType: "",
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
    vuex_category_tree: {
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
    contracts: {
      handler() {
        this.$nextTick(() => {
          this.checkScrollButtons();
        });
      },
    },
  },
  computed: {
    ...mapState(["vuex_index_banners", "vuex_category_tree"]),
    // 显示前6个合同，如果不足6个则用默认值填充
    displayContracts() {
      const defaultContract = {
        title: "生产经营合同",
        thumb: "",
        view_num: 0,
        collect_num: 0,
        is_collect: 0,
        id: 0,
      };
      const contracts = this.contracts.slice(0, 6);
      // 如果不足6个，用默认值填充
      while (contracts.length < 6) {
        contracts.push({ ...defaultContract, id: contracts.length });
      }
      return contracts;
    },
    // 根据选中的类型过滤合同列表
    filteredContracts() {
      if (!this.activeType || this.activeType === "") {
        return this.contracts;
      }
      return this.contracts.filter(
        (contract) => contract.category_id === this.activeType
      );
    },
    // 显示前4条新闻
    displayNews() {
      return this.newsList.slice(0, 4);
    },
  },
  mounted() {
    this.getIndex();
    this.getNewsList();
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

    async getIndex() {
      try {
        const res = await this.$api({
          url: "contractList",
          method: "get",
          data: {
            page: 1,
            pageSize: 100, // 获取更多数据用于筛选
            category_id: this.activeType || "",
          },
        });
        if (res.code === 200 && res.data && res.data.list) {
          this.contracts = res.data.list;
          // 数据加载完成后检查滚动按钮状态
          this.$nextTick(() => {
            this.checkScrollButtons();
          });
        }
      } catch (error) {
        console.error("获取合同列表失败:", error);
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
      // 可以跳转到公司详情页面或执行其他操作
      console.log("了解详情");
    },
    // 获取新闻列表
    async getNewsList() {
      try {
        // 这里可以调用实际的API获取新闻数据
        // const res = await this.$api({
        //   url: "newsList",
        //   method: "get",
        //   data: {
        //     page: 1,
        //     pageSize: 4,
        //   },
        // });
        // if (res.code === 200 && res.data && res.data.list) {
        //   this.newsList = res.data.list;
        // }

        // 临时使用模拟数据
        this.newsList = [
          {
            id: 1,
            date: "2024-05-07",
            category: "公司新闻",
            tagColor: "#0081ff",
            title: "仁寿县关于进一步支持科技创新的若干政策标题文字",
            description:
              "业制度体系建设、科技创新、政策咨询、辅助完成知识产权积累、专项资金申报、会议展览、招投标采购、人力资源等内容进行服务。",
          },
          {
            id: 2,
            date: "2024-05-06",
            category: "行业动态",
            tagColor: "#52c41a",
            title: "企业制度体系建设的重要性与实践",
            description:
              "现代企业制度体系建设是企业发展的基础，包括组织架构、管理制度、流程规范等多个方面，需要系统性的规划和实施。",
          },
          {
            id: 3,
            date: "2024-05-05",
            category: "政策解读",
            tagColor: "#ff9800",
            title: "科技创新政策最新解读与分析",
            description:
              "随着国家对科技创新的重视程度不断提升，相关政策也在不断完善和优化，企业需要及时了解并合理运用这些政策。",
          },
          {
            id: 4,
            date: "2024-05-04",
            category: "公司新闻",
            tagColor: "#0081ff",
            title: "专项资金申报指南与注意事项",
            description:
              "专项资金申报是企业获得政府支持的重要途径，需要准备充分的材料，了解申报流程和要求，提高申报成功率。",
          },
        ];
      } catch (error) {
        console.error("获取新闻列表失败:", error);
      }
    },
    // 新闻卡片点击
    handleNewsClick(news) {
      console.log("点击新闻:", news);
      // 可以跳转到新闻详情页
      // this.$router.push(`/news-detail/${news.id}`);
    },
    // 新闻详情
    handleNewsDetail(news) {
      console.log("查看新闻详情:", news);
      // 可以跳转到新闻详情页
      // this.$router.push(`/news-detail/${news.id}`);
    },
    // 查看更多新闻
    handleViewMoreNews() {
      // 可以跳转到新闻列表页
      this.$router.push("/news-list");
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
      this.getIndex();
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
