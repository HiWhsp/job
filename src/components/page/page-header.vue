<template>
  <div class="page-head">
    <div class="head-base">
      <div class="base-inner">
        <div class="header w-1400">
          <!-- 没登录 -->
          <div class="left flex" v-if="!vuex_is_login">
            <div class="web-title">
              欢迎访问氿洲工品
            </div>
            <router-link class="login" to="/login">请登录</router-link>
            <router-link class="register" to="/register">免费注册</router-link>
          </div>
          <div class="left flex" v-if="vuex_is_login">
            <div class="web-title">
              欢迎访问氿洲工品
            </div>
            <span>
              <b class="user-index" @click="$router.push('/userIndex')">{{ baseInfo.name }}</b>
              <span class="text-1">{{ "您好！" }}</span>
            </span>
            <!-- <span class="logout" @click="logout">退出登录</span> -->
          </div>

          <div class="right">
            <!-- <div class="login-action" v-if="!vuex_is_login">
              <router-link class="login" to="/login">登录</router-link>
            </div>
            <div class="login-action" v-if="!vuex_is_login">
              <router-link class="register" to="/register">注册</router-link>
            </div> -->
            <div class="login-action" v-if="vuex_is_login">
              <span class="logout" @click="logout">退出登录</span>
            </div>
            <div>
              <router-link to="/order-list">我的订单</router-link>
              <i class="el-icon-caret-bottom"></i>
            </div>
            <div>
              <router-link to="/my-message">我的消息</router-link>
            </div>
            <div>
              <router-link to="/terms?id=1">购物指南</router-link>
            </div>

            <!-- <div
          v-if="$route.name != 'Login'"
          class="cart-box"
          @click="jump('shopcart')"
        >
          <img src="@fei/common/cart.png" alt />
          <router-link to="/shopcart">购物车</router-link>
          <b class="cart-num">{{ shopcart_count }}</b>
        </div> -->

            <!-- <div @mouseover="mouseover" @mouseout="mouseout" style="position: relative">
              <span @click="$router.push('/userIndex')"> 用户 </span>
              <i class="el-icon-caret-bottom"></i>
              <ul class="hide-box" v-show="showSiteMap">
                <li v-for="(item, index) in userMenu" :key="index">
                  <router-link :to="item.route"> {{ item.title }}</router-link>
                </li>
              </ul>
            </div> -->

            <!-- <div class="shoujiban" @mouseover="show_shoujiban = true" @mouseout="show_shoujiban = false">
              手机版
              <i class="el-icon-caret-bottom"></i>
              <div class="hide-box-contact" v-show="show_shoujiban">
                <img :src="vuex_config.phone_code" alt />
              </div>
            </div> -->

            <!-- <div class="language-box" @mouseover="mouseoverLang" @mouseout="mouseoutLang" style="position: relative">
              <span> 中文 </span>
              <i class="el-icon-caret-bottom"></i>
              <ul class="hide-box" v-show="showLanguage">
                <li v-for="(item, index) in list_lang" :key="index" @click="toggleLanguage(item.lang)">
                  <a href="javascript:void(0);">
                    {{ item.title }}
                  </a>
                </li>
              </ul>
            </div> -->

            <!-- <div
                class="contact"
                @mouseover="showContact = true"
                @mouseout="showContact = false"
              >
                联系客服
                <i class="el-icon-caret-bottom"></i>

                <div class="hide-box-contact" v-show="showContact">
                  <img :src="config.qrcode_lianxi" alt />
                </div>
              </div> -->
          </div>
        </div>
      </div>

    </div>

    <div class="head-search">
      <div class="header-box w-1400">
        <div class="header w-1400">
          <div class="left-logo">
            <img src="@/static/common/logo.png" @click="$router.push('/')" />
            <!-- <span @click="$router.push('/')">网站名</span> -->
          </div>

          <div class="center-search">
            <div class="search-wrap">
              <div class="search-box">
                <input type="text" v-model="keyword" @keyup.enter="click_search" placeholder="请输入要搜索的商品" />
                <button @click="click_search">
                  <!-- <i class="el-icon-search"></i> -->
                  搜索
                </button>
              </div>

              <div class="search-suggest">
                <!-- <b>热搜词:</b> -->
                <div class="suggest-list">
                  <div class="item" v-for="(item, index) in suggestKeywods" :key="index"
                    @click="click_search_suggest(item)">
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>

            <div class="cart-box">
              <router-link to="/shopcart">
                <img src="@/static/common/head-cart.png" alt="" />
                <span class="cart-text">购物车</span>
                <span class="cart-num">（{{ shopcart_count }}）</span>
              </router-link>
            </div>

          </div>

          <div class="right-phone flex-between">
            <div class="hotline-box flex">
              <img src="@/static/head/hotline.png" alt="">
              <div class="text-box">
                <div class="hotline-text">
                  咨询热线
                </div>
                <div class="hotline-phone">
                  15510765923
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="head-nav">
      <topNavModel1 />
    </div>
  </div>
</template>

<script>
import topNavModel1 from "@/components/common/topNavModel1.vue";

import { mapState } from "vuex";

export default {
  name: "HeaderIndex",
  components: {
    topNavModel1
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
      'vuex_product_cate_2',
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


    setView() {

    },
    mouseoutSearch() {

    },
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

      let keyword = (this.keyword || '').trim() || ""
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
      background: #F74747;
      color: #fff;
    }
  }
}
</style>

<style scoped lang="less">
.head-base {

  .hide-box {
    position: absolute;
    z-index: 100;
    background: #fff;
    min-width: 100px;
    padding-left: 5px;
    padding-right: 5px;
    border: 1px solid #ccc;
    top: 30px;
    left: 50%;
    transform: translate(-50%);

    li:hover {
      a {
        color: #333;
      }
    }
  }

  .header-box {
    background: #f5f5f5;
  }

  .header {

    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    margin: 0 auto;
    color: #c2c2c2;
    font-size: 12px;


  }
}

//
//
//
//



.head-base {
  background: #0C0A0A;

  .base-inner {
    .left {
      float: left;
      min-width: 20%;
      text-align: left;

      .web-title {
        margin-right: 20px;
        color: #fff;
      }


      .logout {
        color: #333;
        cursor: pointer;
      }

      .login {
        color: #fff;
        margin-right: 15px;
      }

      .register {
        color: #fff;
        margin-left: 10px;
        text-decoration: none;
        font-weight: bold;
      }

      .user-index {
        color: #333;
        cursor: pointer;

        &:hover {
          color: #333;
        }
      }


    }

    .right {
      float: right;
      display: flex;
      justify-content: flex-end;
      width: 60%;
      padding: 0 0;
      color: #333;
      color: #FFFFFF;

      a {
        color: #333;
        color: #FFFFFF;
      }

      .login-action {
        .login {
          color: #333;
          color: #FFFFFF;
        }

        .logout {
          color: #333;
          color: #FFFFFF;
        }
      }

      >div {
        margin-right: 20px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }
      }

      .shoujiban {
        position: relative;

        .hide-box-contact {
          position: absolute;
          left: 0;
          transform: translateX(-40px);

          z-index: 1000;
          width: 150px;
          height: 150px;
          border: 1px solid #eee;
          background: #fff;
          padding: 10px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .language-box {
        min-width: 60px;
      }

      .contact {
        position: relative;

        .hide-box-contact {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 1px solid #ccc;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .cart-box {
        display: flex;
        align-items: center;
        text-align: center;

        img {
          width: 14px;
          margin-right: 5px;
        }
      }

      .tri-icon {
        display: inline-box;
        width: 0;
        /*border-right: 2px solid #ccc;
      border-bottom: 2px solid #ccc;*/
      }

      .cart-num {
        margin-left: 5px;
      }

      .phone {
        color: #333;
        font-weight: bold;
        margin-left: 10px;
      }
    }
  }
}



.head-search {
  background: #0C0A0A;


  .header-box {
    height: auto;
    padding: 32px 0;
  }

  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;


    .left-logo {
      cursor: pointer;
      justify-content: flex-start;

      img {
        height: 56px;
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
      margin-left: 100px;
      display: flex;
      align-items: flex-start;

      .search-wrap {
        width: 428px;
      }

      .cart-box {
        margin-left: 20px;

        a {
          display: inline-block;
          .flex-center();
          width: 152px;
          height: 40px;
          background: #FFFFFF;
          border-radius: 0px 0px 0px 0px;
          border: 1px solid #DDDDDD;


          transition: .3s;

          &:hover {}

          img {
            width: 17px;
            margin-right: 11px;
          }

          span {
            font-family: MicrosoftYaHei, MicrosoftYaHei;
            font-weight: normal;
            font-size: 16px;
            color: #044FA0;
          }

          .cart-text {
            margin-right: 0;
          }
        }
      }
    }

    .right-phone {

      margin-left: 20px;

      .hotline-box {
        img {
          width: 40px;
        }

        .text-box {
          margin-left: 12px;
          line-height: 1.1;

          .hotline-text {
            font-family: MicrosoftYaHei;
            font-weight: normal;
            font-size: 14px;
            color: #747474;
          }

          .hotline-phone {
            margin-top: 5px;
            font-family: Avenir, Avenir;
            font-weight: 800;
            font-size: 24px;
            color: #F42424;
          }
        }
      }
    }
  }

  .center-search {
    .search-box {
      border: 1px solid #044FA0;
      display: flex;
      align-items: center;
      width: 428px;
      height: 40px;
      background: #ffffff;
      opacity: 1;
      background: #efefef;
      overflow: hidden;
      overflow: hidden;

      input {
        flex: 2;
        height: 100%;
        height: 40px;
        border: none;
        outline: none;
        background: #fff;
        padding-left: 30px;
        padding-right: 30px;
        // border: 2px solid #333;
        font-size: 14px;
        font-family: Microsoft YaHei;
        color: #000;
      }

      button {
        width: 85px;
        height: 40px;
        background: #044FA0;
        // border: 2px solid #333;
        border: none;
        outline: none;
        cursor: pointer;

        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 16px;
        color: #FFFFFF;

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

    .search-suggest {
      margin-top: 10px;
      display: flex;
      align-items: center;
      font-size: 12px;

      b {
        color: #000;
        display: inline-block;
        min-width: 40px;
      }

      .suggest-list {
        display: flex;
        color: #9f9f9f;

        .item {
          margin-left: 10px;
          cursor: pointer;

          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 26px;
          color: #9f9f9f;

          &:hover {
            color: #333;
            font-weight: bold;
          }
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
  position: sticky;
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
          background: #F74747;
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
          color: #F74747;

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
        .flex-center();
        position: absolute;
        right: 0;
        width: 40px;
        height: 40px;
        background: #F74747;
        border-radius: 0px 6px 6px 0px;
        font-weight: normal;
        font-size: 16px;
        color: #FFFFFF;
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
          color: #F74747;
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
      background: #FF3B30;
      border: 1px solid #FFFFFF;
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
      color: #F74747;
    }
  }

  .logout {
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 16px;
    color: #999999;

    &:hover {
      color: #F74747;
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
