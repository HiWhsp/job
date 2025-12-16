<template>
  <div class="page-head" :class="{ scrolled: isScrolled }">
    <div class="head-sec">
      <div class="head-base">
        <div class="base-inner">
          <div class="base-box w-1400 flex-between">
            <!-- 没登录 -->
            <div class="base-left flex" v-if="!vuex_is_login"></div>
            <div class="base-left flex" v-if="vuex_is_login">
              <!-- <div class="web-title">欢迎访问北京信田</div>
              <span>
                <b class="user-index" @click="$router.push('/userIndex')">{{
                  vuex_user.name
                }}</b>
                <span class="text-1"
                  >{{
                    `您好 ${vuex_user.realName || vuex_user.nickname}（${
                      vuex_user.companyName
                    }）`
                  }}
                  <span style="user-select: none">&nbsp;</span>
                </span>
              </span>
              <span class="logout" @click="logout()">退出登录</span> -->
            </div>

            <div class="base-right flex">
              <div class="u-act">
                <el-dropdown @command="handleServiceCommand" trigger="hover">
                  <span class="el-dropdown-link">
                    服务中心
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="custom-order"
                      >非标定制</el-dropdown-item
                    >
                    <el-dropdown-item command="quick-buy"
                      >快速购物</el-dropdown-item
                    >
                    <el-dropdown-item command="product-consult"
                      >产品咨询与反馈</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <span class="u-line"></span>
              <div class="u-act">
                <router-link to="/download">下载中心</router-link>
              </div>
              <span class="u-line"></span>
              <div class="u-act">
                <router-link to="/help">帮助中心</router-link>
              </div>
              <span class="u-line"></span>
              <div class="u-act" style="cursor: pointer">
                <p @click="goUrl('http://www.xintiankeji.com/guanyu.html')">
                  关于我们
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="head-search">
        <div class="search-inner">
          <div class="search-box w-1400">
            <div class="left-logo">
              <img
                src="@img/common/logo.png"
                @click="$router.push('/')"
                v-if="!isScrolled"
              />
              <img
                src="@img/common/logo-scrolled.png"
                @click="$router.push('/')"
                v-else
              />
            </div>

            <div class="center-search">
              <div class="input-box">
                <button class="btn btn-ripple" @click="do_search()">
                  <i class="el-icon-search"></i>
                </button>
                <input
                  type="text"
                  v-model="keyword"
                  @keyup.enter="do_search"
                  placeholder="请输入您要搜索的关键字"
                />
              </div>
            </div>

            <div class="btns flex-between">
              <div class="btn" @click="$router.push('/product-cates')">
                <img
                  src="@img/head/icon1-scrolled.png"
                  alt=""
                  v-if="isScrolled"
                />
                <img src="@img/head/icon1.png" alt="" v-else />
                <span>产品中心</span>
              </div>
              <template v-if="!vuex_is_login">
                <div class="btn" @click="$router.push('/login')">
                  <img
                    src="@img/head/icon2-scrolled.png"
                    alt=""
                    v-if="isScrolled"
                  />
                  <img src="@img/head/icon2.png" alt="" v-else />
                  <span>登录 | 注册</span>
                </div>
              </template>
              <template v-if="vuex_is_login">
                <div class="btn" @click="$router.push('/my-info')">
                  <img
                    src="@img/head/icon2-scrolled.png"
                    alt=""
                    v-if="isScrolled"
                  />
                  <img src="@img/head/icon2.png" alt="" v-else />
                  <span>会员中心</span>
                </div>
              </template>
              <div class="btn" @click="$router.push('/cart')">
                <el-badge
                  :value="vuex_cart_number"
                  class="item"
                  v-if="vuex_cart_number > 0"
                >
                  <img
                    src="@img/head/icon3-scrolled.png"
                    alt=""
                    v-if="isScrolled"
                  />
                  <img src="@img/head/icon3.png" alt="" v-else />
                </el-badge>
                <img src="@img/head/icon3-scrolled.png" alt="" v-if="isScrolled && vuex_cart_number == 0" />
                <img
                  src="@img/head/icon3.png"
                  alt=""
                  v-if="vuex_cart_number == 0 && !isScrolled"
                />
                <span>购物车</span>
              </div>
              <div class="btn" @click="$router.push('/message-list')">
                <img
                  src="@img/head/icon4-scrolled.png"
                  alt=""
                  v-if="isScrolled"
                />
                <img src="@img/head/icon4.png" alt="" v-else />
                <span>系统消息</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "HeaderIndex",
  data() {
    return {
      showSiteMap: false, //个人中心 菜单
      showLanguage: false, //语言切换
      showContact: false, //联系我们
      show_shoujiban: false, //手机版
      isScrolled: false, // 滚动状态

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
      if (to.path != "/") {
        this.isScrolled = true;
      }
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

  mounted() {
    this.handleScroll();
    window.addEventListener("scroll", this.handleScroll);
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    goUrl(url) {
      window.open(url, "_blank");
    },
    // 处理服务中心下拉菜单命令
    handleServiceCommand(command) {
      switch (command) {
        case "custom-order":
          this.$router.push("/custom-order");
          break;
        case "quick-buy":
          this.$router.push("/quick-buy");
          break;
        case "product-consult":
          this.$router.push("/product-consult");
          break;
      }
    },

    // 处理滚动事件
    handleScroll() {
      if (this.$route.path != "/") {
        return;
      }
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.isScrolled = scrollTop > 100;
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
      // debugger
      if (this.$route.meta.requireAuth) {
        this.$router.push("/");
      }
    },

    //

    //搜索
    do_search() {
      window.location.href = `/product-list?keyword=${this.keyword || ""}`;
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

    logout() {
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

// 服务中心下拉菜单样式
.el-dropdown-menu {
  border-radius: 6px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
  border: 1px solid #e4e7ed !important;
  padding: 6px 0 !important;
  margin-top: 8px !important;

  .el-dropdown-menu__item {
    font-size: 14px !important;
    color: #606266 !important;
    padding: 8px 20px !important;
    line-height: 1.5 !important;

    &:hover {
      background-color: #f5f7fa !important;
      color: #5589ff !important;
    }

    &:focus {
      background-color: #f5f7fa !important;
      color: #5589ff !important;
    }
  }
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
      background: #5589ff;
      color: #fff;
    }
  }
}
</style>

<style scoped lang="less">
.head-sec {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.head-base {
  .base-inner {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .base-box {
      height: 40px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
      line-height: 0px;

      .base-left {
        float: left;
        min-width: 20%;
        text-align: left;

        .web-title {
          margin-right: 40px;
        }
        a {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #ffffff;
          &:hover {
            color: #5589ff;
          }
        }

        .login {
          margin-right: 20px;
        }
        .register {
        }
        .logout {
          cursor: pointer;
        }
      }

      .base-right {
        a {
          color: #ffffff;
        }

        .login-action {
          .login {
            color: #333;
            color: #ffffff;
          }

          .logout {
            color: #333;
            color: #ffffff;
          }
        }

        .icon {
          width: 16px;
          margin-right: 6px;
        }
        .u-my {
          height: 36px;
        }

        .u-line {
          margin: 0 15px;
          width: 1px;
          height: 16px;
          background: #bbbbbb;
        }

        .el-dropdown-link {
          color: #ffffff;
          cursor: pointer;
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 4px;

          &:hover {
            color: #5589ff;
          }
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
    height: auto;
    padding: 24px 0;
  }

  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-logo {
      cursor: pointer;
      justify-content: flex-start;

      img {
        height: 66px;
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

    .center-search {
      flex: 1;
      margin-left: 200px;

      .input-box {
        display: flex;
        align-items: center;
        width: 400px;
        height: 50px;
        overflow: hidden;
        border-radius: 24px;
        border: 1px solid #fff;

        input {
          flex: 1;
          height: 100%;
          height: 50px;
          border: none;
          outline: none;
          padding-left: 10px;
          padding-right: 10px;
          // border: 2px solid #333;
          font-size: 14px;
          font-family: Microsoft YaHei;
          color: #fff;
          background: transparent;
          &::placeholder {
            color: #fff;
          }
        }

        button {
          width: 60px;
          height: 50px;
          // border: 2px solid #333;
          border: none;
          outline: none;
          cursor: pointer;

          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 16px;
          color: #ffffff;

          i {
            color: #fff;
            font-size: 22px;
          }

          &:hover {
            filter: opacity(0.8);
          }

          img {
            width: 31px;
            height: 31px;
          }
        }
      }

      .reci-wrap {
        margin-top: 10px;
        height: 20px;
        display: flex;
        align-items: center;
        font-size: 12px;

        .reci-label {
          color: #000;
          display: inline-block;
          min-width: 40px;
        }

        .reci-list {
          display: flex;
          color: #9f9f9f;

          .reci {
            margin-right: 24px;
            cursor: pointer;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 14px;
            color: #c4c4c4;

            &:hover {
              color: #5589ff;
            }
          }
        }
      }
    }

    .btns {
      display: flex;
      align-items: center;
      gap: 50px;
      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        img {
          width: 30px;
          height: 30px;
        }
        span {
          font-size: 16px;
          font-weight: 500;
          color: #fff;
        }
      }
    }
  }
}

.page-head {
  position: fixed;
  z-index: 1024;
  top: 0;
  left: 0;
  right: 0;
  line-height: 0;
  padding: 0;
  // border-bottom: 4px solid #009a44;
  // box-shadow: 0px 3px 10px 1px rgba(0, 0, 0, 0.16);
  // background-image: url("~@img/head/head-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transition: background-color 0.3s ease;

  &.scrolled {
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    .head-base {
      background: #f3f3f3;
      .base-right .u-act a {
        color: #666;
      }
      .base-right .u-act p {
        color: #666;
      }
      .base-right .u-act .el-dropdown-link {
        color: #666;
        &:hover {
          color: #5589ff;
        }
      }
    }
    .head-search {
      background: #fff;
    }

    .center-search input {
      color: #666;
    }
    .center-search button {
      color: #666;
    }
    .center-search .input-box {
      border: 1px solid #e4e4e4;
    }
    .center-search .input-box button .el-icon-search {
      color: #999;
    }
    .center-search .input-box input {
      color: #000;
    }
    .center-search .input-box input::placeholder {
      color: #999;
    }

    .search-box .btns .btn span {
      color: #666;
    }
  }
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
          background: #5589ff;
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
          color: #5589ff;

          &::after {
            // width: 36px;
          }
        }
      }

      a {
        color: #222;
        width: 100%;
        font-size: 16px;
        font-family: sans-serif;
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
    border-bottom: 1px solid #999999;

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
        background: #5589ff;
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
          color: #5589ff;
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
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 16px;
    color: #999999;

    &:hover {
      color: #5589ff;
    }
  }

  .logout {
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 16px;
    color: #999999;

    &:hover {
      color: #5589ff;
    }
  }
}
.child-item {
  cursor: pointer;
}
</style>
