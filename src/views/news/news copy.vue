<template>
  <div class="page">
    <!-- <pageTop :config="pageConfig" /> -->
    <!-- <news_banner /> -->

    <div class="inner">
      <div class="page-ctx w-1400">
        <div class="ctx-news">
          <div class="ctx-left">
            <!-- <div class="search-box">
            <img class="img-search" src="@img/keyword-search.png" alt="" />
            <input
              v-model="keyword"
              type="text"
              placeholder="请输入要搜索的关键词"
              @keyup.enter="setView"
            />
            <button class="btn-ripple" @click="setView">搜索</button>
          </div> -->

            <!-- Tab切换模块 -->
            <div class="tab-container">
              <el-tabs
                v-model="activeTabName"
                @tab-click="handleTabClick"
                class="custom-tabs"
                active-color="#7853B2"
              >
                <el-tab-pane
                  v-for="(tab, index) in tabList"
                  :key="tab.id || index"
                  :label="tab.name || tab.title"
                  :name="index.toString()"
                >
                </el-tab-pane>
              </el-tabs>
            </div>

            <div class="news-wrap" v-if="count">
              <div
                class="news-list"
                :class="{ 'card-layout': activeTab === 1 }"
              >
                <div
                  v-for="(item, index) in list_news"
                  :key="index"
                  class="news-item"
                  :class="{ 'card-item': activeTab === 1 }"
                >
                  <!-- 索引为0时的简洁布局 -->
                  <template v-if="activeTab === 0">
                    <div class="yellow-bar"></div>
                    <div class="item-content">
                      <div class="company-title" @click="handle_detial(item)">{{ item.title }}</div>
                      <div class="item-description">
                        {{ item.content }}
                      </div>
                    </div>
                    <div class="view-details">
                      <div class="detail-link" @click="handle_detial(item)">查看详情 ></div>
                      <!-- <router-link
                        :to="`/news-detail?id=${item.id}`"
                        class="detail-link"
                      >
                        查看详情 >
                      </router-link> -->
                    </div>
                  </template>

                  <!-- 索引为1时的卡片布局 -->
                  <template v-else>
                    <!-- 左侧图片 -->
                    <div class="card-image">
                      <el-image :src="item.thumb" fit="cover"></el-image>
                    </div>

                    <!-- 中间内容区域 -->
                    <div class="card-content">
                      <div class="card-title">{{ item.title }}</div>
                      <div class="card-description">
                        {{ item.content }}
                      </div>
                    </div>

                    <!-- 右侧操作按钮 -->
                    <div class="card-action">
                      <router-link
                        :to="`/news-detail?id=${item.id}`"
                        class="card-link"
                      >
                        查看详情 >
                      </router-link>
                    </div>
                  </template>
                </div>
              </div>
              <div class="pagination-box">
                <div class="pagination-info">共{{ count }}条</div>
                <div class="pagination-controls">
                  <!-- 上一页按钮 -->
                  <span
                    class="page-arrow prev"
                    :class="{ disabled: pagination.page <= 1 }"
                    @click="goToPage(pagination.page - 1)"
                  >
                    ‹
                  </span>

                  <!-- 页码按钮 -->
                  <span
                    v-for="page in getPageNumbers()"
                    :key="page"
                    class="page-number"
                    :class="{
                      active: page === pagination.page,
                      dots: page === '...',
                    }"
                    @click="page !== '...' ? goToPage(page) : null"
                  >
                    {{ page }}
                  </span>

                  <!-- 下一页按钮 -->
                  <span
                    class="page-arrow next"
                    :class="{ disabled: pagination.page >= getTotalPages() }"
                    @click="goToPage(pagination.page + 1)"
                  >
                    ›
                  </span>
                </div>
                <div class="goto-page">
                  <span>前往</span>
                  <input
                    type="number"
                    :value="pagination.page"
                    class="page-input"
                    @keyup.enter="jumpToPage"
                    @input="updateJumpPage"
                    :min="1"
                    :max="getTotalPages()"
                  />
                  <span>页</span>
                </div>
              </div>
            </div>
            <div class="empty-box" v-else>
              <el-empty description="没有查询到相关信息..."></el-empty>
            </div>
          </div>

          <div class="ctx-right">
            <!-- 更多服务标题 -->
            <div class="more-services-title">
              <!-- <span class="marker"></span> -->
              <img src="@img/other/news-tit.png" class="marker-img" alt="" />
              更多服务
            </div>

            <!-- 相邻分类 -->
            <div
              v-for="(category, categoryIndex) in otherCategories"
              :key="categoryIndex"
              class="category-section"
            >
              <!-- <div class="right-title flex">
                <span class="marker"></span>
                {{ category.name || category.title }}
              </div> -->

              <!-- 显示对应tab索引的名称 -->
              <div class="tab-info">
                <div class="tab-name flex">
                  <img :src="getCategoryTabThumb(category, activeTab)" alt="" class="ico">
                  {{ getTabNameByIndex(category, activeTab) }}
                </div>
                <!-- <div class="tab-index">
                  Tab索引: {{ activeTab }}
                </div> -->
              </div>

              <!-- 分类下的内容列表 -->
              <div class="category-content">
                <div
                  class="content-item"
                  v-for="(item, index) in getCategoryListData(category.id)"
                  :key="item.id || index"
                >
                  <div class="item-title"  @click="handle_detial(item)">{{ item.title }}</div>
                  <div class="item-desc">{{ item.content }}</div>
                  <!-- <div class="item-date">{{ item.dtTime?.substr(0, 10) }}</div> -->
                </div>

                <!-- 如果没有数据，显示加载中或空状态 -->
                <div
                  v-if="getCategoryListData(category.id).length === 0"
                  class="loading-item"
                >
                  <!-- <div class="item-title">加载中...</div> -->
                  <div class="item-desc">暂无数据...</div>
                </div>
              </div>
            </div>

            <!-- 如果没有相邻分类，显示提示 -->
            <div
              v-if="otherCategories.length === 0"
              class="no-categories"
              style="
                background: #fff;
                padding: 20px;
                text-align: center;
                color: #999;
              "
            >
              暂无相邻分类数据
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import news_banner from "./components/news_banner.vue";
// import news_right from "./components/news_right.vue";

import { mapState } from "vuex";

export default {
  name: "news",
  components: {
    news_banner,
    // news_right,
  },
  data() {
    return {
      cid: this.$route.query.id,
      pagination: {
        page: 1,
        pageNum: 10,
      },
      jumpPageInput: 1, // 跳转页面的输入值
      count: 0,
      list_news: [],
      suggest_news: [],
      first_suggest: {},
      //
      keyword: "",
      tab: [],
      // Tab切换相关
      activeTab: 0,
      activeTabName: "0", // el-tabs需要的字符串类型
      tabList: [],
      // 存储每个分类的tab数据
      categoryTabsData: {},
    };
  },
  computed: {
    ...mapState(["vuex_news_cates"]),
    // 获取相邻的两个分类（不包含当前分类）
    otherCategories() {
      console.log("vuex_news_cates:", this.vuex_news_cates);
      console.log("this.cid:", this.cid, "type:", typeof this.cid);

      if (!this.vuex_news_cates || !this.cid) {
        console.log("数据不完整，返回空数组");
        return [];
      }

      // 尝试不同的ID匹配方式
      // const currentIndex = this.vuex_news_cates.findIndex((cate) => {
      //   console.log(
      //     "比较:",
      //     cate.id,
      //     "===",
      //     this.cid,
      //     "结果:",
      //     cate.id == this.cid
      //   );
      //   return cate.id == this.cid; // 使用 == 而不是 === 来处理类型转换
      // });

      const currentIndex =[]
      this.vuex_news_cates.forEach((e)=>{
        if(e.id!=this.$route.query.id){
          e.child.forEach((v)=>{
            
            // currentIndex.push(v)
          })
            currentIndex.push(e)

        }
      })

      console.log("当前分类索引:", currentIndex);

      // if (currentIndex === -1) {
      //   console.log("未找到当前分类");
      //   return [];
      // }

      // const adjacentCategories = [];

      // // 获取前一个分类
      // if (currentIndex > 0) {
      //   adjacentCategories.push(this.vuex_news_cates[currentIndex - 1]);
      // }

      // // 获取后一个分类
      // if (currentIndex < this.vuex_news_cates.length - 1) {
      //   adjacentCategories.push(this.vuex_news_cates[currentIndex + 1]);
      // }

      // console.log("相邻分类:", adjacentCategories);

      // return adjacentCategories;
      return currentIndex
    },
    // 根据当前tab索引获取对应分类的tab名称
    currentTabName() {
      if (!this.tabList || this.tabList.length === 0) return "";
      return (
        this.tabList[this.activeTab]?.name ||
        this.tabList[this.activeTab]?.title ||
        ""
      );
    },
  },
  watch: {
    $route(to, from) {
      this.initParams();
      this.setView();
    },
    // 监听相邻分类变化，自动获取tab数据（参考左侧setView逻辑）
    otherCategories: {
      handler(newCategories) {
        if (newCategories && newCategories.length > 0) {
          newCategories.forEach((category) => {
            // 参考左侧setView方法，先获取tab数据，然后获取列表数据
            this.getCategoryTabs(category.id);
          });
        }
      },
      immediate: true,
    },
    // 监听当前tab变化，更新相邻分类的数据列表（参考左侧getList逻辑）
    activeTab: {
      handler(newTabIndex) {
        if (this.otherCategories && this.otherCategories.length > 0) {
          this.otherCategories.forEach((category) => {
            // 参考左侧getList方法，根据当前tab索引获取数据
            this.getCategoryList(category.id, newTabIndex);
          });
        }
      },
      immediate: true,
    },
  },
  created() {
    this.query_suggest();
    this.setView();
  },

  methods: {
    handle_detial(item){
      this.$router.push({
        path:'/news-detail',
        query:{
          id:item.id
        },
      })
    },
    initParams() {
      this.cid = this.$route.query.id;
      console.log(this.cid, " this.cid ");
      this.pagination.page = 1;
    },
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_channel",
          channelId: this.cid,
        },
      }).then((res) => {
        if (res.code == 200) {
          console.log("!!!!!", res.data);
          this.tab = res.data;
          this.tabList = res.data; // 将API数据赋值给tabList
          this.activeTab = 0; // 默认选中第一个tab
          this.activeTabName = "0"; // 同步activeTabName
          this.getList();
        }
      });
    },
    getList() {
      // 获取当前选中tab的id
      const currentTabId =
        this.tabList.length > 0 && this.tabList[this.activeTab]
          ? this.tabList[this.activeTab].id
          : this.cid;

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          channelId: currentTabId, // 使用当前选中tab的id
          keyword: "",
          ...this.pagination,
          isIndex: 0, //类型：0-全部 1-推荐
          contentLen: "100", //
          orderType: 0, //排序情况：0-自然排序 1-最新
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;

          this.list_news = data.list;
          this.count = data.count;
        }
      });
    },
    query_suggest() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          ...this.pagination,
          isIndex: 1, //类型：0-全部 1-推荐
          contentLen: "100", //
          orderType: 0, //排序情况：0-自然排序 1-最新
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.suggest_news = data.list;
          this.first_suggest = data.list[0];
          // this.count = data.count;
        }
      });
    },

    on_current_change(value) {
      this.pagination.page = value;
      this.setView();
    },

    // Tab切换方法
    switchTab(index) {
      this.activeTab = index;
      this.activeTabName = index.toString();
      this.pagination.page = 1; // 重置页码
      console.log(
        "切换到tab:",
        this.tabList[index],
        "id:",
        this.tabList[index]?.id
      );
      this.getList(); // 重新获取数据
    },

    // el-tabs点击事件处理
    handleTabClick(tab) {
      const index = parseInt(tab.name);
      this.activeTab = index;
      this.pagination.page = 1; // 重置页码
      console.log(
        "切换到tab:",
        this.tabList[index],
        "id:",
        this.tabList[index]?.id
      );
      this.getList(); // 重新获取数据
    },

    // 根据分类和tab索引获取对应的tab名称
    getTabNameByIndex(category, tabIndex) {
      const categoryId = category.id;
      const tabsData = this.categoryTabsData[categoryId];

      if (tabsData && tabsData[tabIndex]) {
        return tabsData[tabIndex].name || tabsData[tabIndex].title;
      }
      return `Tab ${tabIndex + 1}`;
    },

    // 根据分类和tab索引获取对应的tab缩略图
    getCategoryTabThumb(category, tabIndex) {
      const categoryId = category.id;
      const tabsData = this.categoryTabsData[categoryId];

      if (tabsData && tabsData[tabIndex] && tabsData[tabIndex].thumb) {
        return tabsData[tabIndex].thumb;
      }
      // 如果没有缩略图，返回默认图片
      return require('@img/other/news-ico3.png');
    },

    // 获取分类的tab数据（参考左侧setView方法）
    getCategoryTabs(categoryId) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_channel",
          channelId: categoryId,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.$set(this.categoryTabsData, categoryId, res.data);
            console.log(`分类 ${categoryId} 的tab数据:`, res.data);
            // 获取tab数据后，立即获取对应tab的数据列表
            this.getCategoryList(categoryId);
          }
        })
        .catch((error) => {
          console.error(`获取分类 ${categoryId} 的tab数据失败:`, error);
        });
    },

    // 获取分类的数据列表（参考左侧getList方法）
    getCategoryList(categoryId, tabIndex = null) {
      const tabsData = this.categoryTabsData[categoryId];
      if (!tabsData || tabsData.length === 0) return;

      // 如果没有指定tabIndex，使用当前激活的tab索引
      const currentTabIndex = tabIndex !== null ? tabIndex : this.activeTab;

      // 获取当前选中tab的id（参考左侧getList逻辑）
      const currentTabId =
        tabsData.length > 0 && tabsData[currentTabIndex]
          ? tabsData[currentTabIndex].id
          : categoryId;

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          channelId: currentTabId, // 使用当前选中tab的id
          keyword: "",
          page: 1,
          pageNum: 3, // 只获取3条数据用于右侧显示
          isIndex: 0, //类型：0-全部 1-推荐
          contentLen: "100", //
          orderType: 0, //排序情况：0-自然排序 1-最新
        },
      })
        .then((res) => {
          if (res.code == 200) {
            let data = res.data;
            const dataKey = `${categoryId}_${currentTabIndex}`;
            this.$set(this.categoryTabsData, dataKey + "_list", data.list);
            console.log(
              `分类 ${categoryId} tab ${currentTabIndex} 的数据列表:`,
              data.list
            );
          }
        })
        .catch((error) => {
          console.error(
            `获取分类 ${categoryId} tab ${currentTabIndex} 的数据列表失败:`,
            error
          );
        });
    },

    // 获取分类的数据列表
    getCategoryListData(categoryId) {
      const dataKey = `${categoryId}_${this.activeTab}_list`;
      return this.categoryTabsData[dataKey] || [];
    },

    // 获取总页数
    getTotalPages() {
      return Math.ceil(this.count / this.pagination.pageNum);
    },

    // 获取页码数组
    getPageNumbers() {
      const totalPages = this.getTotalPages();
      const currentPage = this.pagination.page;
      const pageNumbers = [];

      if (totalPages <= 7) {
        // 如果总页数小于等于7，显示所有页码
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // 如果总页数大于7，显示省略号
        if (currentPage <= 4) {
          // 当前页在前4页
          for (let i = 1; i <= 5; i++) {
            pageNumbers.push(i);
          }
          pageNumbers.push("...");
          pageNumbers.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
          // 当前页在后4页
          pageNumbers.push(1);
          pageNumbers.push("...");
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pageNumbers.push(i);
          }
        } else {
          // 当前页在中间
          pageNumbers.push(1);
          pageNumbers.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pageNumbers.push(i);
          }
          pageNumbers.push("...");
          pageNumbers.push(totalPages);
        }
      }

      return pageNumbers;
    },

    // 跳转到指定页面
    goToPage(page) {
      if (
        page < 1 ||
        page > this.getTotalPages() ||
        page === this.pagination.page
      ) {
        return;
      }
      this.pagination.page = page;
      this.jumpPageInput = page;
      this.getList();
    },

    // 更新跳转页面输入值
    updateJumpPage(event) {
      this.jumpPageInput = parseInt(event.target.value) || 1;
    },

    // 跳转到输入框指定的页面
    jumpToPage() {
      const page = Math.max(
        1,
        Math.min(this.jumpPageInput, this.getTotalPages())
      );
      this.goToPage(page);
    },
  },
};
</script>

<style scoped lang="less">
.page {
  .inner {
    background: #f3f3f3;
    padding: 24px 0;
  }
}

.page-ctx {
  margin: 0 auto;
  padding-top: 0;
  padding-bottom: 20px;
  text-align: left;
}
/deep/.is-top {
  margin: 0 !important;
  line-height: 60px;
  &::after{
    background: none;
  }
}
.ctx-news {
  display: flex;
  align-items: flex-start;

  .ctx-left {
    flex: 1;
    overflow: hidden;
    margin-right: 24px;

    // Tab切换样式
    .tab-container {
      background: #ffffff;
      border-radius: 4px 4px 0 0;

      .custom-tabs {
        padding: 20px 60px 0;
        .el-tabs__header {
          margin: 0 !important;
          border-bottom: 1px solid #e8e8e8;
        }

        .el-tabs__nav-wrap {
          padding: 0;
        }

        .el-tabs__nav {
          display: flex;
          width: 100%;
        }

        // 确保覆盖Element UI的默认样式
        .el-tabs__item.is-active {
          color: #7853b2 !important;
        }

        .el-tabs__item:hover {
          color: #7853b2 !important;
        }

        .el-tabs__item {
          flex: 1;
          text-align: center;
          font-size: 16px;
          color: #1F1F1F !important;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          padding: 16px 24px;
          height: auto;
          line-height: 1.4;

          &:hover {
            color: #7853b2 !important;
            background: #f8f8f8;
          }

          &.is-active {
            color: #7853b2 !important;
            border-bottom-color: #7853b2 !important;
            background: #ffffff;
            font-weight: bold;
          }
        }

        .el-tabs__active-bar {
          background-color: #7853b2 !important;
          height: 3px;
        }

        .el-tabs__content {
          display: none; // 隐藏内容区域，因为我们不需要显示tab内容
        }
      }
    }

    .cate-title {
      font-weight: normal;
      font-size: 32px;
      color: #333333;
    }

    .news-list {
      background: #ffffff;
      border-radius: 0 0 4px 4px;
      padding: 0;

      // 卡片布局样式
      &.card-layout {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .news-item {
        display: flex;
        align-items: flex-start;
        padding: 20px;
        border-bottom: 1px solid #f0f0f0;
        position: relative;
        transition: background-color 0.3s ease;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          // background-color: #f8f8f8;
          .company-title {
            color: #5b339a;
          }
        }

        // 卡片项样式
        &.card-item {
          flex-direction: row;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
          background: #ffffff;
          border-radius: 8px;
          // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            background-color: #ffffff;
          }
        }

        .yellow-bar {
          width: 6px;
          height: 20px;
          background: #FCB000;
          margin-right: 10px;
          flex-shrink: 0;
          border-radius: 3px;
        }

        .item-content {
          flex: 1;

          .company-title {
            font-size: 20x;
            font-weight: bold;
            color: #1F1F1F;
            margin-bottom: 8px;
            line-height: 1.4;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
              color: #7853b2;
            }
          }

          .item-description {
            font-size: 14px;
            color: #1F1F1F;
            line-height: 1.6;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .view-details {
          text-align: right;
          a {
            color: #7853b2;
          }
          .detail-link {
            color: #7853b2;

            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s ease;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;

            &:hover {
              color: #ffffff;
              background-color: #7853b2;
              text-decoration: none;
            }
          }
        }
        // 卡片图片
        .card-image {
          width: 200px;
          height: 140px;
          flex-shrink: 0;
          margin-right: 20px;
          border-radius: 4px;
          overflow: hidden;

          .el-image {
            width: 100%;
            height: 100%;
          }
        }

        // 卡片内容
        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-right: 20px;

          .card-title {
            font-size: 20px;
            font-weight: bold;
            color: #282828;
            margin-bottom: 20px;
            line-height: 1.4;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
              color: #7853b2;
            }
          }

          .card-description {
            font-size: 14px;
            color: #777777;
            line-height: 24px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 50px;
          }
        }

        // 卡片操作按钮
        .card-action {
          flex-shrink: 0;
          display: flex;
          align-items: center;

          .card-link {
            color: #7853b2;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s ease;
            padding: 8px 16px;
            // border: 1px solid #7853b2;
            border-radius: 4px;
            display: inline-block;

            &:hover {
              color: #ffffff;
              background-color: #7853b2;
              text-decoration: none;
            }
          }
        }
      }
    }
  }

  .ctx-right {
    width: 300px;
    flex-shrink: 0;

    .more-services-title {
      display: flex;
      align-items: center;
      padding: 26px;
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      background: #fff;
      border-bottom: 1px solid #d5d8de;
      .marker-img {
        margin-right: 10px;
        width: 20px;
      }
      .marker {
        width: 4px;
        height: 18px;
        background: #7853b2;
        margin-right: 8px;
      }
    }

    .category-section {
      background: #ffffff;
      border-radius: 4px;
      // margin-bottom: 20px;
      padding: 20px;

      .right-title {
        align-items: center;
        margin-bottom: 15px;
        font-size: 16px;
        font-weight: bold;
        color: #333333;

        .marker {
          width: 4px;
          height: 16px;
          background: #7853b2;
          margin-right: 8px;
        }
      }

      .tab-info {
        // padding: 12px;
        border-radius: 4px;
        margin-bottom: 24px;

        .tab-name {
          font-weight: bold;
          color: #1F1F1F;
          font-size: 16px; 
          .ico{
            width: 30px;
            margin-right: 10px;
          }
        }

        .tab-index {
          font-size: 12px;
          color: #505050;
        }
      }

      .category-content {
        .content-item {
          // padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .item-title {
            font-size: 16px;
            color: #1F1F1F;
            margin-bottom: 5px; 
             display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
          }

          .item-desc {
            font-size: 14px;
            color: #999;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 5px;
          }

          .item-date {
            font-size: 11px;
            color: #505050;
          }
        }

        .loading-item {
          padding: 12px 0;
          text-align: center;
          color: #505050;
          font-style: italic;
        }
      }
    }
  }
}

.pagination-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 0 0 4px 4px;
  gap: 20px;

  .pagination-info {
    font-size: 14px;
    color: #1F1F1F;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;

    .page-arrow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      color: #1F1F1F;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(.disabled) {
        border-color: #7853b2;
        color: #7853b2;
      }

      &.disabled {
        color: #ccc;
        cursor: not-allowed;
        border-color: #f0f0f0;
      }
    }

    .page-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      color: #1F1F1F;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(.dots) {
        border-color: #7853b2;
        color: #7853b2;
      }

      &.active {
        background: #7853b2;
        border-color: #7853b2;
        color: #ffffff;
      }

      &.dots {
        border: none;
        cursor: default;
        color: #505050;
        font-size: 14px;
        padding: 0 4px;
      }
    }
  }

  .goto-page {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #1F1F1F;

    .page-input {
      width: 50px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      outline: none;

      &:focus {
        border-color: #7853b2;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/news.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/news.less"></style>

<!-- 全局样式覆盖Element UI的tab颜色 -->
<style lang="less">
.custom-tabs {
  border-bottom: 1px solid #d5d8de;
  padding: 23px 63px;
  .el-tabs__item {
    color: #1F1F1F !important;
    font-size: 16px;
    font-weight: bold;

    &:hover {
      color: #7853b2 !important;
    }

    &.is-active {
      color: #7853b2 !important;
    }
  }

  .el-tabs__active-bar {
    background-color: #7853b2 !important;
  }
}

/* 使用深度选择器确保样式穿透 */
.custom-tabs ::v-deep .el-tabs__item {
  color: #1F1F1F !important;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    color: #7853b2 !important;
  }

  &.is-active {
    color: #7853b2 !important;
  }
}

.custom-tabs ::v-deep .el-tabs__active-bar {
  background-color: #7853b2 !important;
}
</style>