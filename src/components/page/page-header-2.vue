<template>
  <div class="page-head">
    <div class="head-search">
      <div class="header-box w-1200">
        <div class="header w-1200 flex">
          <div class="left-logo" @click="$router.push('/')"></div>

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
                  </template>
                  <template v-else>
                    <div @click="jump_nav(item)">
                      <span
                        class="nav-title text"
                        :class="check_nav_class(item)"
                        >{{ item.title }}</span
                      >
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="right-box">
            <div class="cart-box">
              <router-link to="">
                <img src="@/assets/image/home/search.png" alt="" />
              </router-link>
              <router-link to="">
                <img src="@/assets/image/home/user.png" alt="" />
              </router-link>
              <router-link to="/shopcart">
                <img src="@/assets/image/home/cart.png" alt="" />
              </router-link>
              <router-link to="/shopcart" class="flex-center">
                <img class="en-icon" src="@/assets/image/home/en.png" alt="" />
                <span class="cart-text">中文</span>
                <img class="en-icon" src="@/assets/image/home/down-icon.png" alt="" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      "vuex_product_cate_1",
      "vuex_product_cate_2",
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
        { title: "首页", route: "/" },
        { title: "产品展示", route: "/service" },
        { title: "预约商品", route: "/xunjia" },
        { title: "工艺鉴赏", route: "/suggest" },
        { title: "联系我们", route: "/scene" },
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
      this.$store.commit("clear_loginInfo");
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
      this.$store.commit("clear_loginInfo");
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
      background: #f74747;
      color: #fff;
    }
  }
}
</style>

<style scoped lang="less">
.head-nav {
  background: #000;
}

.page-head {
  position: sticky;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  line-height: 110px;
  padding: 0;
  height: 110px;
  background: #000;
}

.left-logo {
  width: 200px;
  height: 40px;
  background-image: url("~@/assets/image/home/logo.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.header {
  justify-content: space-between;
}

.header-inner {
  position: relative;
  width: 1200px;
  height: 150px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo-wrap {
    display: flex;
    align-items: center;

    .logo-box {
      cursor: pointer;

      img {
        width: 141px;
        height: 82px;
      }
    }
  }

  .nav-wrap {
    flex: 1;
    margin-left: 60px;
    margin-right: 92px;
  }

  .nav-list {
    height: 100%;

    .nav-item {
      // flex: 1;
      text-align: center;

      &.nav-item-static {
        position: static;
      }

      .nav-link {
        position: relative;
        display: inline-block;
        height: 50px;
        line-height: 50px;
        font-family: Poppins, Poppins;
        font-weight: 600;
        font-size: 17px;
        color: #333333;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%);
          width: 0;
          height: 2px;
          background: #f74747;
          transition: 0.3s;
        }
      }

      &:hover {
        .nav-link::after {
          width: 36px;
        }
      }

      &.active {
        .nav-link {
          // font-weight: bold;
          color: #f74747;

          &::after {
            // width: 36px;
          }
        }
      }

      a {
        color: #222;
        width: 100%;
        font-size: 16px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333;
      }
    }
  }
}

.cart-box {
  display: flex;
  align-items: center;
  text-align: center;

  img {
    width: 24px;
    margin-right: 36px;
  }
  .en-icon {
    width: 20px;
    margin: 0;
  }
  .cart-text {
    color: #fff;
    margin: 0 8px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
  }
}

.user-act {
  width: 440px;
  width: fit-content;
}

.nav-box {
  display: flex;

  .nav-item {
    // flex: 1;
    margin-left: 48px;
    text-align: center;
    position: relative;
    cursor: pointer;
    // min-width: 108px;
    font-size: 16px;
    color: #000;
    color: #fff;
    height: 47px;
    line-height: 47px;

    .nav-title {
      font-size: 16px;
      color: #333;
      color: #fff;

      &.active {
        color: #f74747;
        font-weight: bold;
      }

      &.router-link-exact-active {
        color: #f74747;
        font-weight: bold;
      }
    }

    .text:hover {
      color: #f74747;
      font-weight: bold;
    }
  }
}

.info-right {
  display: flex;
  align-items: center;

  .log-box {
    display: flex;
    align-items: center;
  }

  a {
    color: #fff;
    display: flex;
    align-items: center;

    img {
      width: 30px;
      height: 30px;
    }
  }

  .user-login {
    width: 30px;
    height: 30px;
  }

  .user-reg {
    margin: 0 16px;
    width: 30px;
    height: 30px;
  }

  .cart-image {
    width: 30px;
    height: 30px;
  }

  .shopcart {
    position: relative;
    width: 30px;
    height: 30px;
    .flex-center();

    img {
      width: 30px;
      height: 30px;
    }

    .cart-num {
      .flex-center();
      position: absolute;
      right: -10px;
      top: -10px;
      min-width: 18px;
      min-height: 18px;
      padding: 0 3px;
      background: #ff3b30;
      border: 1px solid #ffffff;
      border-radius: 50%;
      font-size: 12px;
    }
  }
}

.user-login-info {
  position: absolute;
  right: 0;
  top: 12px;

  .avatar-box {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .phone {
    margin: 0 16px;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 16px;
    color: #999999;

    &:hover {
      color: #f74747;
    }
  }

  .logout {
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 16px;
    color: #999999;

    &:hover {
      color: #f74747;
    }
  }
}

@media screen and (max-width: 1600px) {
  .header-inner .nav-list .nav-item {
    margin-left: 10px;
    min-width: 80px;
  }

  .left-select {
    width: 160px !important;
  }
}

@media screen and (max-width: 1520px) {
  .header-inner .nav-list .nav-item {
    margin-left: 10px;
    min-width: 80px;
  }

  .left-select {
    width: 150px !important;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/zujian/pageHeader.less"></style>
