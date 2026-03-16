<template>
  <div class="page-head">
    <div class="head-sec">
      <div class="head-base">
        <div class="base-inner">
          <div class="base-box w-1400 flex-between">
            <!-- 没登录 -->
            <div class="base-left flex">
              <div class="web-title">
                <img src="@/assets/img/head/head-phone.png" alt="" />
                <span class="phone-number">+4000-000-0000</span>
                <span class="welcome-text">Hi, welcome to MEDOOO</span>
                <span class="login-out" v-if="vuex_user.phone" @click="logout">Logout</span>
              </div>
            </div>

            <div class="base-right flex">
              <div class="u-act">
                <img src="@/assets/img/head/CouponCenter.png" alt="" />
                <router-link to="/coupon-center">Coupon Center</router-link>
              </div>
              <span class="u-line"></span>
              <div class="u-act">
                <img src="@/assets/img/head/ContactUs.png" alt="" />
                <router-link to="/Contact">Contact Us</router-link>
              </div>
              <span class="u-line"></span>
              <div class="u-act">
                <img src="@/assets/img/head/LoginOrRegister.png" alt="" />
                <router-link to="/my-info">{{ vuex_user.phone ? vuex_user.phone : 'Login or Register' }}</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="head-search">
        <div class="search-inner">
          <div class="search-box w-1400">
            <div class="left-logo">
              <img src="@img/common/logo.png" @click="$router.push('/')" />
            </div>

            <div class="center-search">
              <div class="input-box">
                <input
                  type="text"
                  v-model="keyword"
                  @keyup.enter="do_search"
                  @focus="focusHandler"
                  placeholder="Input Keyword or Item"
                />
                <button class="btn btn-ripple" @click="do_search()">
                  <i class="el-icon-search"></i>
                </button>
              </div>
            </div>

            <div class="btns flex-between">
              <router-link to="/part-time-sales" class="link">
                <div class="btn-box">
                  <img src="@img/head/43838.png" alt="" />
                  <span class="text">Commission-only Reps</span>
                </div>
              </router-link>
              <router-link to="/supplier-onboarding" class="link">
                <div class="btn-box">
                  <img src="@img/head/43837.png" alt="" />
                  <span class="text">Become Supplier</span>
                </div>
              </router-link>
              <router-link to="/cart" class="link">
                <div class="btn-box">
                  <el-badge :value="vuex_cart_number" class="item" type="warning">
                    <img src="@img/head/cart.png" alt="" />
                  </el-badge>
                  <span class="text cart-text">cart</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="head-nav">
      <page_nav />
    </div>
  </div>
</template>

<script>
import page_nav from "./page_nav.vue";

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
        { title: "退出登录", route: "/exit" },
      ],
      search_show: false,
      search_list: [],
    };
  },

  computed: {
    ...mapState(["vuex_user"]),

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
    if (this.vuex_user.auditCount > 0) {
      this.$notify.info({
        title: "",
        message: "有您待审批的订单,请审批",
        duration: 0,
      });
    }
  },

  methods: {
    handleBlur() {
      this.search_show = false;
    },
    focusHandler() {
      let search_list = JSON.parse(localStorage.getItem("search_list")) || [];
      this.search_list = search_list;
      if (this.search_list.length) {
        this.search_show = true;
      }
    },
    handle_search_list(title, index) {
      console.log("title", title);
      this.keyword = title;
      this.search_show = false;
      this.search_list.splice(index, 1);
      this.do_search();
    },
    //跳转待审核
    toAudit() {
      if (this.vuex_user.staffType > 1) {
        this.$router.push({
          path: "stock-censor",
          query: {
            value: 1,
          },
        });
      } else {
        this.$router.push({
          path: "stock-censor-my",
          query: {
            value: 1,
          },
        });
      }
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
    navtoRoute(item) {
      if (item.route != "/exit") {
        this.toRoute(item.route);
      } else {
        this.logout();
      }
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
      this.$router.push("/login");
    },

    //

    //搜索
    do_search() {
      let search_list = this.search_list;
      const found = search_list.some((item) => item.title === this.keyword);
      if (!found) {
        if (search_list.length < 5) {
          search_list.unshift({
            title: this.keyword,
          });
        } else {
          search_list.unshift({
            title: this.keyword,
          });
          search_list.splice(5, 1);
        }
      }
      localStorage.setItem("search_list", JSON.stringify(search_list));
      window.location.href = `/product-cates?keyword=${this.keyword || ""}`;
      // this.$router.push({
      //   path: "/product-cates",
      //   query: {
      //     keyword: this.keyword,
      //   },
      // });
    },
    //热搜
    do_search_reci(item) {
      this.keyword = item.title;
      window.location.href = `/product-cates?keyword=${item.title}`;
      // this.$router.push({
      //   path: "/product-cates",
      //   query: {
      //     keyword: this.keyword,
      //   },
      // });
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

    do_logout() {
      this.$store.commit("remove_vuex_user");
      // if (this.$route.meta.requireAuth) {
      //   this.$router.push("/login");
      // }
      this.$router.push("/index");
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
    font-family: sans-serif;
    font-weight: 400;
    color: #000000;

    &:hover {
      background: #00306B;
      color: #fff;
    }
  }
}
</style>

<style scoped lang="less">
.head-sec {
  background: #fff;
}
.head-base {
  .base-inner {
    background: #fff;
    border-bottom: 1px solid #eeeeee;
    .base-box {
      height: 54px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 14px;
      line-height: 0px;

      .base-left {
        float: left;
        display: flex;
        align-items: center;
        .web-title {
          display: flex;
          align-items: center;
          img {
            width: 28px;
            height: 28px;
          }
          .phone-number {
            font-family: Poppins, Poppins;
            font-weight: 600;
            font-size: 18px;
            color: #ec6a2b;
            margin-right: 17px;
            margin-left: 8px;
            line-height: 25px;
          }
          .welcome-text {
            font-family: Poppins, Poppins;
            font-weight: 400;
            font-size: 18px;
            color: #5e5e5e;
            line-height: 25px;
          }
          .login-out {
            cursor: pointer;
            color: #5e5e5e;
            font-size: 18px;
            font-family: Poppins, Poppins;
            font-weight: 400;
            line-height: 25px;
            margin-left: 20px;
          }
        }
      }

      .base-right {
        display: flex;
        align-items: center;
        a {
          color: #5e5e5e;
        }

        .u-act {
          display: flex;
          align-items: center;
          img {
            width: 28px;
            height: 28px;
            margin-right: 8px;
          }
        }

        .u-line {
          margin: 0 15px;
          width: 1px;
          height: 20px;
          background: #5e5e5e;
        }
      }
      .audit-count {
        display: flex;
        align-items: center;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        margin: 0 15px;
        cursor: pointer;
        background: #eb0f19;
      }
    }
  }
}

.head-search {
  // background: #0c0a0a;
  .search-inner {
    height: 128px;
    padding: 26px 0;
    display: flex;
    align-items: center;
  }

  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-logo {
      cursor: pointer;
      justify-content: flex-start;

      img {
        width: 143px;
        cursor: pointer;
      }

      span {
        margin-left: 10px;
        font-size: 30px;
        font-family: Poppins, Poppins;
        font-weight: 400;
        line-height: 30px;
        color: #333333;
      }
    }

    .center-search {
      height: 56px;
      flex: 1;
      margin-left: 128px;

      .input-box {
        border: 2px solid #00306b;
        display: flex;
        align-items: center;
        width: 542px;
        height: 56px;
        background: #efefef;
        border-radius: 40px;
        position: relative;

        input {
          flex: 1;
          height: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: #fff;
          padding-left: 20px;
          padding-right: 30px;
          font-size: 16px;
          font-family: Poppins, Poppins;
          color: #5e5e5e;
          border-radius: 40px 0 0 40px;
          &::placeholder {
            color: #999;
          }
        }

        button {
          width: 82px;
          height: 56px;
          background: #00306b;
          border-radius: 0 40px 40px 0;
          i {
            color: #fff;
            font-size: 24px;
          }
        }
      }
    }

    .btns {
      margin-left: 40px;
      gap: 20px;

      .link {
        background: #ffffff;
        transition: 0.3s;
        border-radius: 4px;
        .btn-box {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        & + .link {
          margin-left: 10px;
        }

        img {
          width: 35px;
          height: 35px;
          margin-right: 11px;
        }

        .text {
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 20px;
          color: #00306b;
        }

        .cart-text {
          color: #1e262e;
        }
      }
    }
  }
}

.head-nav {
  
}

.page-head {
  // position: sticky;
  z-index: 1024;
  top: 0;
  left: 0;
  right: 0;
  line-height: 0;
  padding: 0;
  // border-bottom: 4px solid #009a44;
  // box-shadow: 0px 3px 10px 1px rgba(0, 0, 0, 0.16);
  background: #fff;
}

.header-inner {
  position: relative;
  width: 1400px;
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
          background: #00306B;
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
          color: #00306B;

          &::after {
            // width: 36px;
          }
        }
      }

      a {
        color: #222;
        width: 100%;
        font-size: 16px;
        font-family: Poppins, Poppins;
        font-weight: 400;
        color: #333;
      }
    }
  }
}

.user-act {
  width: 440px;
  width: fit-content;
}

.center-search-wrap {
  position: relative;
  margin-right: 25px;

  &:hover {
    .search-suggest-list {
      display: block;
    }
  }

  .center-search {
    width: 270px;
    border-bottom: 1px solid #505050;

    display: flex;
    align-items: center;
    align-items: stretch;

    border-radius: 5px;
    position: relative;
    overflow: hidden;

    .search-box {
      // border: 1px solid #aaa;
      display: flex;
      align-items: center;
      overflow: hidden;
      // height: 100%;

      input {
        display: block;
        width: 317px;
        height: 38px;
        padding-left: 10px;

        &::-webkit-input-placeholder {
          font-weight: normal;
          font-size: 14px;
          color: #909090;
        }
      }

      .btn-search {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 0;
        width: 40px;
        height: 40px;
        background: #00306B;
        border-radius: 0px 6px 6px 0px;
        font-weight: normal;
        font-size: 16px;
        color: #ffffff;
        background: transparent;

        &:hover {
          opacity: 1 !important;
        }

        .img-search {
          width: 20px;
          height: 20px;
          cursor: pointer;
          transition: 0.3s;
          margin-right: 11px;

          &:hover {
            opacity: 0.85;
          }
        }
      }
    }
  }

  .search-suggest-list {
    display: none;
    position: absolute;
    z-index: 100;
    left: 0;
    right: 0;
    top: 43px;
    border: 1px solid #ddd;
    border-top: none;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;

    .search-suggest-item {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 3.5rem;
      height: 3.5rem;
      padding: 0 5px;
      text-align: left;
      transition: 0.3s;

      &:hover {
        background: #f5f5f5;
      }

      a {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
        width: 100%;
        height: 100%;
        color: #888;
        font-size: 1.3rem;

        &:hover {
          color: #00306B;
        }
      }
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
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 30px;
      height: 30px;
    }

    .cart-num {
      display: flex;
      justify-content: center;
      align-items: center;
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
    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 16px;
    color: #505050;

    &:hover {
      color: #00306B;
    }
  }

  .logout {
    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 16px;
    color: #505050;

    &:hover {
      color: #00306B;
    }
  }
}
.child-item {
  cursor: pointer;
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
