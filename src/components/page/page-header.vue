<template>
  <div class="page-head">
    <div class="head-sec">
      <div class="head-base">
        <div class="base-inner">
          <div class="base-box w-1400 flex-between">
            <!-- 没登录 -->
            <div class="base-left flex" v-if="!vuex_is_login">
              <div class="web-title">您好, 欢迎进入中科星选</div>
              <!-- <router-link class="login" to="/login">请登录</router-link>
              <router-link class="register" to="/register"
                >免费注册</router-link
              > -->
            </div>
            <div class="base-left flex" v-if="vuex_is_login">
              <div class="web-title">欢迎访问氿洲工品</div>
              <span>
                您好,
                <b class="user-index" @click="$router.push('/userIndex')">{{
                  vuex_user.name
                }}</b>
                欢迎进入中科星选
              </span>
              <!-- <span class="logout" @click="logout()">退出登录</span> -->
            </div>

            <div class="base-right flex">
              <!-- <div class="login-action" v-if="!vuex_is_login">
              <router-link class="login" to="/login">登录</router-link>
            </div>
            <div class="login-action" v-if="!vuex_is_login">
              <router-link class="register" to="/register">注册</router-link>
            </div> -->

              <div class="u-act">
                <router-link to="/help">收藏夹</router-link>
                <!-- <i class="el-icon-caret-bottom"></i> -->
              </div>
              <span class="u-line"></span>
              <template v-if="1 || vuex_is_login">
                <el-popover
                  popper-class="w-nav-popover"
                  placement="top"
                  title=""
                  width="150"
                  trigger="hover"
                  content=""
                >
                  <router-link
                    slot="reference"
                    class="u-act u-my flex"
                    to="/order-list"
                  >
                    <span class="logout"> 会员中心 </span>
                    <!-- <i class="el-icon-caret-bottom"></i> -->
                  </router-link>

                  <div class="pop-child">
                    <router-link
                      :to="sub.route"
                      class="child-item"
                      v-for="(sub, index) in user_menus"
                      :key="index"
                      @click.native="menuClick(sub.title)"
                    >
                      {{ sub.title }}
                    </router-link>
                  </div>
                </el-popover>
              </template>

              <span class="u-line"></span>
              <div class="u-act">
                <router-link to="/help">联系我们</router-link>
                <!-- <i class="el-icon-caret-bottom"></i> -->
              </div>
              <!-- <span class="u-line"></span>
              <div class="u-act">
                <a href="" class="flex-center">
                  <img class="icon" src="@img/head/mobile.png" alt="" />
                  <span>{{ vuex_config.comPhone }}</span>
                </a>
              </div> -->
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
                  @keyup.enter="do_search()"
                  placeholder="请输入关键词"
                />
                <button class="btn btn-ripple" @click="do_search()">
                  <!-- <i class="el-icon-search"></i> -->
                   <img src="@img/head/search.png" alt="">
                  搜索
                </button>
              </div>

              <!-- <div class="reci-wrap">
                <div class="reci-label">热搜词:</div>
                <div class="reci-list">
                  <div
                    class="reci"
                    v-for="(item, index) in keyword_list"
                    :key="index"
                    @click="do_search_reci(item)"
                  >
                    {{ item.title }}
                  </div>
                </div>
              </div> -->
            </div>

            <div class="btns flex-between">
              <router-link to="/cart" class="link bg">
                <div class="btn-box">
                  <img src="@img/head/cart.png" alt="" />
                  <span class="text">购物车</span>
                  <span class="cart-num fit-text">{{ vuex_cart_number }}</span>
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

    menuClick(title){
      if(title=="退出登录"){
        this.logout()
      }
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
    font-family: OPPPSans;
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

.head-base {
  background: #f4f4f4;
  border-bottom: 1px solid #eee;
  .base-inner {
    .base-box {
      height: 40px;
      font-family: OPPPSans;
      font-weight: 400;
      font-size: 14px;
      color: #585858;
      line-height: 0px;

      .base-left {
        float: left;
        min-width: 20%;
        text-align: left;

        .web-title {
          margin-right: 40px;
        }
        a {
          font-family: OPPPSans;
          font-weight: 400;
          font-size: 14px;
          color: #ffffff;
          &:hover {
            color: #009f39;
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
          color: #222222;
        }

        .login-action {
          .login {
            color: #222222;
          }

          .logout {
            color: #222222;
          }
        }

        .icon {
          width: 16px;
          margin-right: 6px;
        }

        .u-act {
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
      }
    }
  }
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
        font-family: OPPPSans;
        font-weight: 400;
        line-height: 30px;
        color: #333333;
      }
    }

    .center-search {
      // height: 80px;
      flex: 1;
      margin-left: 145px;

      .input-box {
        border: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        width: 600px;
        height: 44px;
        background: #efefef;
        overflow: hidden;

        input {
          flex: 1;
          height: 100%;
          height: 44px;
          border: none;
          outline: none;
          background: #fff;
          padding-left: 20px;
          padding-right: 30px;
          // border: 2px solid #333;
          font-size: 14px;
          font-family: OPPPSans;
          color: #000;
        }

        button {
          width: 105px;
          height: 44px;
          background: #009f39;
          // border: 2px solid #333;
          border: none;
          outline: none;
          cursor: pointer;

          font-family: OPPPSans;
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
            margin-right: 6px;
            width: 18px;
            height: 18px;
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
            font-family: OPPPSans;
            font-weight: 400;
            font-size: 14px;
            color: #c4c4c4;

            &:hover {
              color: #009f39;
            }
          }
        }
      }
    }

    .btns {
      .link {
        .btn-box {
          border-radius: 20px;
          width: 129px;
          height: 35px;
          background: #ff7600;
          border: 1px solid #ff7600;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &:hover {
          opacity: 0.75;
        }

        img {
          width: 22px;
          margin-right: 6px;
        }

        .text {
          font-family: OPPPSans;
          font-weight: normal;
          font-size: 16px;
          color: #ffffff;
        }

        .cart-num {
          position: absolute;
          right: -10px;
          top: -5px;
          min-width: 23px;
          height: 18px;
          background: #ffaa2a;
          border-radius: 9px 9px 9px 9px;

          font-family: OPPPSans;
font-weight: normal;
font-size: 12px;
color: #FFFFFF;
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

.head-nav {
  background: #202020;
}

.page-head {
  //position: sticky;
  z-index: 100;
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
        font-family: OPPPSans;
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
          background: #009f39;
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
          color: #009f39;

          &::after {
            // width: 36px;
          }
        }
      }

      a {
        color: #222;
        width: 100%;
        font-size: 16px;
        font-family: OPPPSans;
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
        background: #009f39;
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
          color: #009f39;
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
    font-family: OPPPSans;
    font-weight: 400;
    font-size: 16px;
    color: #999999;

    &:hover {
      color: #009f39;
    }
  }

  .logout {
    font-family: OPPPSans;
    font-weight: 400;
    font-size: 16px;
    color: #999999;

    &:hover {
      color: #009f39;
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
