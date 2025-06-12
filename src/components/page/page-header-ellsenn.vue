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
                >
                  <template v-if="!item.route.includes('http')">
                    <router-link :to="item.route" class="nav-title">
                      {{ item.title }}
                    </router-link>
                    <i v-if="!!item.icon" class="nav-itm" :class="item.icon"></i>
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
            <div v-if="vuex_user.id" class="user-name" @click="toUserCenter">
              {{ vuex_user.name }}
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
            <el-button
              size="small "
              class="btn btn-login"
              @click="logout"
              v-if="vuex_user.id"
              >退出</el-button
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
        },
        { title: "新闻洞察", route: "/newsInsights" },
        { title: "维深测评", route: "/deepEvaluation" },
        { title: "产业活动", route: "/industrialActivities" },
        { title: "维深榜单", route: "/rankings" },
        {
          title: "关于我们",
          route: "/about",
          icon: "el-icon-caret-bottom",
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

    on_mouseover() {
      //this.show_fenlei = true;
      //获取配置信息
      //判断当前模板是否需要鼠标悬浮显示下拉导航
      if (this.$route.name != "index") {
        this.show_fenlei = true;
      } else {
        this.show_fenlei = false;
      }
    },
    on_mouseleave() {
      this.show_fenlei = false;
    },

    //语言切换
    toggleLanguage(lang_curr) {
      // let lang_prev = localStorage.getItem("lang") || "zh";
      // let lang_curr = "";
      // if (lang_prev == "zh") {
      //   lang_curr = "en";
      // } else if (lang_prev == "en") {
      //   lang_curr = "zh";
      // }

      if (localStorage.getItem("lang") == lang_curr) {
        return;
      }

      this.$store.commit("set_lang", lang_curr);
      this.$i18n.locale = lang_curr;

      location.reload();
    },

    jump(route) {
      // debugger
      this.$router.push("/" + route);
    },

    mouseover() {
      this.showSiteMap = true;
    },
    mouseout() {
      this.showSiteMap = false;
    },
    mouseoverLang() {
      this.showLanguage = true;
    },
    mouseoutLang() {
      this.showLanguage = false;
    },

    //

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
          this.$router.push("/");
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
