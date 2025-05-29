<template>
  <div class="page-head">
    <div class="head-sec">
      <div class="head-search">
        <div class="search-inner">
          <div class="search-box w-1400">
            <div class="left-logo">
              <img src="@img/common/logo.png" @click="$router.push('/')" />
            </div>
            <div class="back-box">
              <div class="icon-box">
                <img src="@img/foot/foot-mobile.png" alt="" />
              </div>
              <div class="btn-box">
                <div class="mobile">
                  {{ vuex_config.comPhone }}
                </div>
                <div class="btn btn-ripple fit-text" @click="$router.push('/')">返回首页</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="head-nav">
      <page_nav />
    </div> -->
  </div>
</template>
  
  <script>
import page_nav from "@/components/page/page-nav.vue";

import { mapState } from "vuex";

export default {
  name: "HeaderIndex",
  components: {
    page_nav,
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

      user_menus: [
        { title: "我的订单", route: "/order-list" },
        { title: "我的售后", route: "/refund-list" },
        { title: "我的收藏", route: "/favorite-list" },
        { title: "我的足迹", route: "/browse-history" },
        { title: "地址管理", route: "/address-list" },
        { title: "我的发票", route: "/invoice-list" },
        { title: "个人信息", route: "/my-info" },
        { title: "修改密码", route: "/change-password" },
        { title: "退出登录", route: "" },
      ],
    };
  },

  computed: {
    ...mapState([
      //
    ]),

    keyword_list() {
      let arr = [];
      if (this.vuex_config.hotSearch) {
        try {
          arr = JSON.parse(this.vuex_config.hotSearch);
        } catch (error) {}
      }
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
    do_search() {
      this.$router.push({
        path: "/product-cates",
        query: {
          keyword: this.keyword,
        },
      });
    },
    //热搜
    do_search_reci(item) {
      this.keyword = item.title;
      this.$router.push({
        path: "/product-cates",
        query: {
          keyword: this.keyword,
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
  
  
  
  <style scoped lang="less">
.head-sec {
}

.head-search {
  // background: #0c0a0a;
  .search-inner {
    height: auto;
    padding: 30px 0;
  }

  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-logo {
      cursor: pointer;
      justify-content: flex-start;

      img {
        height: 59px;
        cursor: pointer;
      }

      span {
        margin-left: 10px;
        font-size: 30px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 30px;
        color: #333333;
      }
    }

    .back-box {
      display: flex;
      align-items: flex-start;
      .icon-box {
        img {
          width: 28.52px;
        }
      }
      .btn-box {
        margin-left: 6px;
        .mobile {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 15px;
          color: #ff7600;
        }
        .btn {
          margin-top: 13px;
          width: 92px;
          height: 27px;
          background: #ffffff;
          border-radius: 14px 14px 14px 14px;
          border: 1px solid #009f39;

          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #009f39;
        }
      }
    }
  }
}

//
//
//
//
//

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
  