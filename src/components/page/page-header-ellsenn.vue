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
            <div class="right-box-icon">
              <i class="el-icon-search"></i>
            </div>

            <el-button size="small " class="btn btn-login">登录</el-button>
            <el-button size="small " type="primary" class="btn btn-register"
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

import { mapState } from "vuex";

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
    ...mapState([
      //
    ]),

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
      if (this.vuex_news_cates.length) {
        route_news = "/news?cid=" + this.vuex_news_cates[0].id;
      }
      var arr = [
        { title: "研究报告", route: "/researchReport", icon: "el-icon-caret-bottom" },
        { title: "新闻洞察", route: "/newsInsights" },
        { title: "维深测评", route: "/deepEvaluation" },
        { title: "产业活动", route: "/industrialActivities" },
        { title: "维深榜单", route: "/rankings" },
        {
          title: "关于我们",
          route: "/product-brand",
          icon: "el-icon-caret-bottom",
        },
        { title: "内容资讯", route: route_news },
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

    goCart() {
      this.$router.push({ path: "/cart" });
    },
    goOrderAll() {
      this.$router.push({ path: "/orderAll" });
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

    goModule(name) {
      if (name == "index") {
        this.$router.push({ path: "/" });
      } else if (name == "my") {
        this.$router.push({ path: "/info" });
      } else if (name == "login") {
        this.$router.push({ path: "login" });
      }
    },
    logout() {
      this.$store.commit("remove_vuex_user");
      // debugger
      if (this.$route.meta.requireAuth) {
        this.$router.push("/");
      }
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
      // if (!this.keyword) {
      //   alertErr("请输入搜索关键字");
      //   return;
      // }
      let query = {};
      if (this.selectCate) {
        query.id = this.selectCate;
      }

      let keyword = (this.keyword || "").trim() || "";
      query.keyword = keyword;
      query.ms = new Date().getTime();
      this.$router.push({
        path: "/product-search",
        query: query,
      });
    },

    logout() {
      this.$store.commit("remove_vuex_user");
      // if (this.$route.meta.requireAuth) {
      //   this.$router.push("/login");
      // }
      this.$router.push("/login");
      alertSucc("退出成功");
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
