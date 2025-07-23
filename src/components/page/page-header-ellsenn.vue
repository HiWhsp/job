<template>
  <div class="page-head">
    <div class="head-search">
      <div class="header-box">
        <div class="header-layout">
          <div class="left-logo-content">
            <img
              class="left-logo-img"
              src="@/assets/image/home/logo.png"
              @click="$router.push('/')"
            />
            <!-- <span @click="$router.push('/')">Website Name</span> -->
          </div>

          <div class="center-search">
            <div class="head-nav">
              <!-- 导航列表 -->
              <div class="nav-box nav-box-1">
                <div
                  data-title="Navigation Style 1"
                  class="nav-item nav-item-type-1"
                  v-for="(item, index) in page_nav_list"
                  :key="index"
                  @mouseenter="mouseoverLang(item)"
                  @mouseleave="mouseoutLang(item)"
                >
                  <template v-if="!item.route.includes('http')">
                    <router-link :to="item.route" class="nav-title">
                      {{ item.title }}
                    </router-link>
                    <i v-if="!!item.icon" class="nav-item-icon" :class="item.icon"></i>
                    <div
                      class="nav-dropdown"
                      v-show="
                        (item.children && showLanguage && item.title === 'Feedback') ||
                        (item.children &&
                          showContact &&
                          item.title === 'Business Cooperation')
                      "
                      @mouseenter="mouseoverLang"
                      @mouseleave="mouseoutLang"
                    >
                      <div
                        class="nav-dropdown-item"
                        v-for="(item, index) in item.children"
                        :key="index"
                      >
                        <router-link :to="item.route">
                          {{ item.title }}
                        </router-link>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div @click="jump_nav(item)">
                      <span class="nav-title text" :class="check_nav_class(item)">{{
                        item.title
                      }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="right-box">
            <div class="right-box-icon" @click="toSearch">
              <i class="el-icon-search"></i>
            </div>
            <div class="inter-login" @click="toLang">
              <img src="@/assets/image/icon/inter.png" alt="" />
              <span>Chinese</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索弹框 -->
    <div class="search-modal" v-show="showSearchModal" @click="closeSearchModal">
      <div class="search-modal-content" @click.stop>
        <div class="search-modal-header">
          <div class="search-input-wrapper">
            <i class="el-icon-search search-icon"></i>
            <input
              type="text"
              class="search-input"
              placeholder="Please enter keywords"
              v-model="searchKeyword"
              @keyup.enter="performSearch"
              @input="onSearchInput"
              ref="searchInput"
            />
            <div class="search-close" @click="closeSearchModal">Exit</div>
          </div>
        </div>

        <div class="search-modal-body">
          <!-- 搜索历史 -->
          <div class="search-section" v-if="searchHistory.length > 0">
            <div class="section-header">
              <span class="section-title">Search History</span>
              <i class="el-icon-delete section-clear" @click="clearSearchHistory"></i>
            </div>
            <div class="search-tags">
              <span
                class="search-tag"
                v-for="(item, index) in searchHistory"
                :key="index"
                @click="selectSearchItem(item)"
              >
                {{ item }}
              </span>
            </div>
          </div>

          <!-- 热门搜索 -->
          <div class="search-section">
            <div class="section-header">
              <span class="section-title">Hot Search</span>
              <i
                class="el-icon-refresh-right section-refresh"
                @click="refreshHotSearch"
              ></i>
            </div>
            <div class="hot-search-list">
              <div
                class="hot-search-item"
                v-for="(item, index) in hotSearchList"
                :key="index"
                @click="selectSearchItem(item)"
              >
                <span class="hot-search-number">
                  {{ index + 1 }}
                </span>
                <span class="hot-search-text">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="head-nav">
        <topNavModel1 />
      </div> -->
  </div>
</template>

<script>
import topNavModel1 from "@/components/common/topNavModel1.vue";
export default {
  name: "HeaderIndex",
  components: {
    topNavModel1,
  },
  data() {
    return {
      showSiteMap: false, //个人中心 菜单
      showLanguage: false, //语言切换
      showContact: false, //联系我们
      show_shoujiban: false, //手机版

      tabList: [],

      list_lang: [
        { title: "Chinese", lang: "zh" },
        { title: "English", lang: "en" },
      ],

      keyword: "",
      //

      showSearch: false,
      keyword: "",
      search_suggest_list: [],
      disabledSearchQuery: false,
      searchLock: false, //锁定搜素

      // 搜索弹框相关数据
      showSearchModal: false,
      searchKeyword: "",
      searchHistory: [],
      hotSearchList: [],
    };
  },

  computed: {
    page_nav_list() {
      var arr = [
        {
          title: "Home",
          route: "/",
        },
        { title: "Messages", route: "/my-message" },
        { title: "Help", route: "/help" },
        {
          title: "Feedback",
          route: "/feedback",
          icon: "el-icon-caret-bottom",
          children: [
            {
              title: "Company Profile",
              route: "/about?activeIndex=1",
            },
            {
              title: "Company History",
              route: "/about?activeIndex=2",
            },
            {
              title: "Company News",
              route: "/about?activeIndex=3",
            },
            {
              title: "External Professional Committee",
              route: "/about?activeIndex=4",
            },
            {
              title: "Honor Wall",
              route: "/about?activeIndex=5",
            },
            {
              title: "Company Team",
              route: "/about?activeIndex=6",
            },
            {
              title: "Company Clients",
              route: "/about?activeIndex=7",
            },
            {
              title: "Contact Us",
              route: "/about?activeIndex=8",
            },
            {
              title: "Join Us",
              route: "/about?activeIndex=9",
            },
          ],
        },
        {
          title: "Business",
          route: "/cooperation",
          icon: "el-icon-caret-bottom",
          children: [
            {
              title: "Company Profile",
              route: "/about?activeIndex=1",
            },
            {
              title: "Company History",
              route: "/about?activeIndex=2",
            },
            {
              title: "Company News",
              route: "/about?activeIndex=3",
            },
            {
              title: "External Professional Committee",
              route: "/about?activeIndex=4",
            },
            {
              title: "Honor Wall",
              route: "/about?activeIndex=5",
            },
            {
              title: "Company Team",
              route: "/about?activeIndex=6",
            },
            {
              title: "Company Clients",
              route: "/about?activeIndex=7",
            },
            {
              title: "Contact Us",
              route: "/about?activeIndex=8",
            },
            {
              title: "Join Us",
              route: "/about?activeIndex=9",
            },
          ],
        },
        {
          title: "Personal",
          route: "/my-info",
        },
      ];
      return arr;
    },
  },

  watch: {
    $route(to, from) {
      if (to.name == "product-search") {
        if (to.query.id) {
        }
      }
      this.searchLock = true;
      this.keyword = to.query.keyword;
    },
  },

  mounted() {
    this.keyword = this.$route.query.keyword || "";
    this.setView();
    this.loadSearchHistory();
  },

  methods: {
    check_nav_class(item) {
      let item_route = item.route;
      if (item_route[0] == "/") {
        item_route = item_route.substr(1);
      }
      let obj = {
        active: item_route == this.$route.name,
        active: item.route == this.$route.path,
      };
      return obj;
    },

    jump_nav(item) {
      console.log({ ...item });
      if (item.route.includes("http")) {
        window.open(item.route, "_blank");
      }
    },

    mouseenter(e) {
      this.showSiteMap = true;
    },
    mouseleave(e) {
      this.showSiteMap = false;
    },

    mouseoverLang(item) {
      // if (item.title === "商务合作") {
      //   this.showContact = true;
      // } else if (item.title === "意见反馈") {
      //   this.showLanguage = true;
      // }
    },
    mouseoutLang(item) {
      // if (item.title === "商务合作") {
      //   this.showContact = false;
      // } else if (item.title === "意见反馈") {
      //   this.showLanguage = false;
      // }
    },

    //搜索
    click_search() {
      this.handleSearch(this.keyword);
    },
    //热搜
    click_search_suggest(item) {
      this.keyword = item;
      this.handleSearch(item);
    },
    handleSearch(keyword) {
      this.$router.push({
        path: "/searchList",
        query: {
          keyword: keyword,
        },
      });
    },

    //自定义 banner跳转
    jump_banner(item) {
      console.log({ ...item });
      let url = item.url;
      if (!url) {
        return;
      }
      window.open(url, "_blank");
    },
    ///

    setView() {},
    mouseoutSearch() {},
    handleSearchInput() {
      this.searchLock = false;
    },

    toHome() {
      if (this.$route.name != "index") {
        this.$router.push("/");
      } else {
        document.documentElement.scrollTop = 0;
      }
    },

    checkClass(item) {
      let pagePath = this.$route.fullPath;

      let obj = {
        active: item.route == pagePath || item.title == this.$route.meta.root,
        "nav-item-static": "/product-cates" == item.path,
      };
      return obj;
    },

    toSearch() {
      this.showSearchModal = true;
      this.searchKeyword = "";
      this.loadSearchHistory();
      this.$nextTick(() => {
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus();
        }
      });
    },

    // 关闭搜索弹框
    closeSearchModal() {
      this.showSearchModal = false;
      this.searchKeyword = "";
    },

    // 执行搜索
    performSearch() {
      if (!this.searchKeyword.trim()) {
        return;
      }
      this.saveSearchHistory(this.searchKeyword);
      this.handleSearch(this.searchKeyword);
      this.closeSearchModal();
    },

    // 选择搜索项
    selectSearchItem(keyword) {
      this.searchKeyword = keyword;
      this.performSearch();
    },

    // 搜索输入处理
    onSearchInput() {
      // 可以在这里添加搜索建议逻辑
    },

    // 加载搜索历史
    loadSearchHistory() {
      const history = localStorage.getItem("searchHistory");
      if (history) {
        this.searchHistory = JSON.parse(history).slice(0, 10); // 最多显示10个
      }
      this.hotSearchList = JSON.parse(this.vuex_config.remen || "[]");
    },

    // 保存搜索历史
    saveSearchHistory(keyword) {
      let history = this.searchHistory || [];
      // 如果已存在，先移除
      history = history.filter((item) => item !== keyword);
      // 添加到开头
      history.unshift(keyword);
      // 最多保存10个
      history = history.slice(0, 10);
      this.searchHistory = history;
      localStorage.setItem("searchHistory", JSON.stringify(history));
    },

    // 清空搜索历史
    clearSearchHistory() {
      this.searchHistory = [];
      localStorage.removeItem("searchHistory");
    },

    // 刷新热门搜索
    refreshHotSearch() {
      // 这里可以调用API获取最新的热门搜索
      // 暂时使用模拟数据
      this.$api({
        url: "index",
        method: "get",
      }).then((res) => {
        console.log(res);
        let { code, data, msg } = res;
        if (code == 200) {
          this.hotSearchList = JSON.parse(data.remen);
          this.$message.success("Refreshed");
        }
      });
    },

    logout() {
      this.$store.commit("clear_loginInfo");
      this.$router.push("/");
    },
    toUserCenter() {
      this.$router.push("/my-info");
    },
    toLang() {
      window.open("https://jyla.dx.hdapp.com.cn/", "_self");
    },
  },
};
</script>

<style lang="less">
.w-nav-popover .popper__arrow {
  display: none !important;
}

.w-nav-popover {
  padding: 0 !important;
  margin-top: 2px !important;
  // border: none !important;
}

.pop-child {
  .child-item {
    text-align: center;
    display: block;
    height: 40px;
    line-height: 40px;

    background: #fff;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #000000;

    &:hover {
      background: #009f39;
      color: #fff;
    }
  }
}

// 搜索弹框样式
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;

  .search-modal-content {
    width: 600px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .search-modal-header {
      padding: 25px 30px;
      background-color: #f4f4f4;
      border-bottom: 1px solid #f0f0f0;

      .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        padding: 12px 0;

        .search-icon {
          color: #000;
          font-size: 16px;
          margin-right: 12px;
          width: 30px;
          height: 30px;
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #737272;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 16px;
          color: #333;
          border-right: 1px solid #d1d1d6;
          margin-right: 15px;

          &::placeholder {
            color: #6c6c6c;
          }
        }

        .search-close {
          color: #666;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
      }
    }

    .search-modal-body {
      padding: 30px;
      max-height: 400px;
      overflow-y: auto;

      .search-section {
        margin-bottom: 24px;

        &:last-child {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;

          .section-title {
            font-size: 14px;
            font-weight: 500;
            color: #333;
          }

          .section-clear,
          .section-refresh {
            color: #999;
            cursor: pointer;
            font-size: 16px;
            transition: color 0.2s;

            &:hover {
              color: #666;
            }
          }
        }

        .search-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .search-tag {
            height: 28px;
            line-height: 28px;
            display: inline-block;
            padding: 0 24px;
            background: #f4f4f4;
            border-radius: 16px;
            font-size: 14px;
            color: #3d3d3d;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              background: #e9ecef;
              color: #000;
            }
          }
        }

        .hot-search-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          .hot-search-item {
            display: flex;
            align-items: center;
            padding: 8px;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              background: #f4f4f4;
              border-radius: 16px;
            }

            .hot-search-number {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 20px;
              height: 20px;
              font-size: 12px;
              color: #999;
              margin-right: 12px;

              &.top-three {
                background: #ff6b6b;
                color: #fff;
                border-radius: 50%;
                font-weight: 500;
              }
            }

            .hot-search-text {
              font-size: 14px;
              color: #333;
              flex: 1;
            }
          }
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="./page-header-ellsenn.less"></style>

<style scoped lang="less" src="@/assets/h5css/zujian/pageHeader.less"></style>
