<template>
  <div class="page-head">
    <div class="head-search">
      <div class="header-box">
        <div class="header-layout">
          <div class="left-logo-content">
            <img
              class="left-logo-img"
              src="@img/common/ellsenn-logo.png"
              @click="$router.push('/')"
            />
            <!-- <span @click="$router.push('/')">网站名</span> -->
          </div>

          <div class="center-search">
            <div class="head-nav">
              <!-- 导航列表 -->
              <div class="nav-box nav-box-1">
                <div
                  data-title="导航样式1"
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
                    <i v-if="!!item.icon" class="nav-itm" :class="item.icon"></i>
                    <div
                      class="nav-dropdown"
                      v-show="
                        (item.children && showLanguage && item.title === '研究报告') ||
                        (item.children && showContact && item.title === '关于我们')
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
            <div
              class="user-box"
              v-if="vuex_user.id"
              @mouseenter="mouseenter"
              @mouseleave="mouseleave"
            >
              <img :src="vuex_user.image" alt="" />
              <div class="user-name" @click="toUserCenter">
                {{ vuex_user.name }}
              </div>

              <div
                v-show="showSiteMap"
                class="user-dropdown"
                @mouseenter="mouseenter"
                @mouseleave="mouseleave"
              >
                <div class="dropdown-item" @click="toUserCenter">个人中心</div>
                <div class="dropdown-item" @click="logout">退出</div>
              </div>
            </div>

            <el-button size="small " class="btn btn-login" @click="showLogin" v-else
              >登录</el-button
            >
            <el-button
              v-if="!vuex_user.id"
              size="small "
              type="primary"
              class="btn btn-register"
              @click="showRegister"
              >注册</el-button
            >
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

      list_lang: [
        { title: "中文", lang: "zh" },
        { title: "English", lang: "en" },
      ],

      keyword: "",
      //

      showSearch: false,
      keyword: "",
      search_suggest_list: [],
      disabledSearchQuery: false,
      searchLock: false, //锁定搜素
    };
  },

  computed: {
    userMenu() {
      return [
        { title: "我的主页", route: "userIndex" },
        { title: "我的订单", route: "myOrder" },
      ];
    },
    suggestKeywods() {
      let arr = [];
      if (this.vuex_config.reci) {
        arr = this.vuex_config.reci || [];
      }
      return arr;
    },

    page_nav_list() {
      let route_news = "";
      var arr = [
        {
          title: "研究报告",
          route: "/researchReport",
          icon: "el-icon-caret-bottom",
          children: [
            {
              title: "研究报告",
              route: "/researchReport",
            },
            {
              title: "研究报告",
              route: "/researchReport",
            },
          ],
        },
        { title: "新闻洞察", route: "/newsInsights" },
        { title: "维深测评", route: "/deepEvaluation" },
        { title: "产业活动", route: "/industrialActivities" },
        { title: "维深榜单", route: "/rankings" },
        {
          title: "关于我们",
          route: "/about",
          icon: "el-icon-caret-bottom",
          children: [
            {
              title: "公司简介",
              route: "/about?activeIndex=1",
            },
            {
              title: "公司历程",
              route: "/about?activeIndex=2",
            },
            {
              title: "公司新闻",
              route: "/about?activeIndex=3",
            },
            {
              title: "外部专业委员",
              route: "/about?activeIndex=4",
            },
            {
              title: "荣誉墙",
              route: "/about?activeIndex=5",
            },
            {
              title: "公司团队",
              route: "/about?activeIndex=6",
            },
            {
              title: "公司客户",
              route: "/about?activeIndex=7",
            },
            {
              title: "联系我们",
              route: "/about?activeIndex=8",
            },
            {
              title: "加入我们",
              route: "/about?activeIndex=8",
            },
          ],
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

  created() {
    this.keyword = this.$route.query.keyword || "";
    this.setView();
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
      if (item.title === "关于我们") {
        this.showContact = true;
      } else {
        this.showLanguage = true;
      }
    },
    mouseoutLang(item) {
      if (item.title === "关于我们") {
        this.showContact = false;
      } else {
        this.showLanguage = false;
      }
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
        path: "/search",
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
      this.$router.push({
        path: "/searchList",
      });
    },
    showLogin() {
      this.$showLogin({
        onLoginSuccess: (data) => {
          this.$store.commit("set_baseInfo", data);
          location.reload();
        },
      });
    },
    showRegister() {
      this.$showRegister();
    },
    logout() {
      this.$store.commit("clear_loginInfo");
      this.$router.push("/");
    },
    toUserCenter() {
      this.$router.push("/my-info");
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
</style>

<style scoped lang="less" src="./page-header-ellsenn.less"></style>

<style scoped lang="less" src="@/assets/h5css/zujian/pageHeader.less"></style>
