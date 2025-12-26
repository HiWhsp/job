<template>
  <div id="header" class="header-mobile" :class="headerTheme">
    <!-- 顶部导航 -->
    <div class="common-phone-header">
      <div class="common-phone-header-inner">
        <div class="menu-box" @click="expandSideNav = true">
          <img src="@img/h5/h5-menu.png" alt="" class="header-menu-phone" />
        </div>
        <a
          href="/"
          class="header-logo-box-phone"
          style=""
          v-if="!showHeaderSearch"
        >
          <img src="@img/common/logo.png" alt="" class="header-logo-phone" />
        </a>
        <div
          class="header-search-box-phone"
          :class="{ shown: showHeaderSearch }"
        >
          <input
            ref="searchInput"
            type="search"
            placeholder="请输入文档关键词"
            class="form-control header-search-input-phone"
            v-model="keyword"
            @keyup.enter="toSearch"
          />

          <div class="search-suggest-list" v-if="search_suggest_list.length">
            <div
              class="search-suggest-item"
              v-for="(item, index) in search_suggest_list"
              :key="index"
            >
              <router-link
                :to="'/product-detail/' + (item.skuId || item.inventoryId)"
                :alt="item.title"
                :title="item.title"
              >
                【{{ item.skuId }}】{{ item.title }}
              </router-link>
            </div>
          </div>
        </div>
        <div class="search-box" @click="toggleSearchBox(false)">
          <img src="@img/h5/h5-search.png" alt="" class="header-search-phone" />
        </div>
      </div>
    </div>

    <!-- 悬浮侧边栏 -->
    <div class="side-wrap">
      <div
        class="side-modal"
        :class="{ expand: expandSideNav }"
        @click="expandSideNav = false"
      ></div>
      <div class="side-container" :class="{ expand: expandSideNav }">
        <div class="side-wrap">
          <div class="side-inner">
            <div class="side-top">
              <div class="side-logo-box" @click="toHome">
                <!-- <a href="/"> -->
                <img src="@img/common/logo.png" class="side-logo" />
                <!-- </a> -->
              </div>
              <div class="side-close-box" @click="expandSideNav = false">
                <img src="@img/h5/h5-close.png" class="side-close" />
              </div>
            </div>
            <div class="side-bottom">
              <!-- 主导航 -->

              <!-- 一级导航 -->
              <div
                class="side-nav-list side-nav-list-main"
                v-if="show_level == 1"
                data-level="1"
              >
                <div
                  class="nav-item"
                  v-for="(item, index) in opt_nav"
                  :key="index"
                  @click="clickMenuNav(item)"
                >
                  <div class="nav-item-inner">
                    <span>{{ item.title }}</span>
                    <img
                      src="@img/h5/h5-arrow-right.png"
                      alt=""
                      class="arrow-right"
                    />
                  </div>
                </div>
              </div>

              <!-- 二级导航 -->
              <template v-if="show_level == 2">
                <div class="side-nav-list side-nav-list-level2" data-level="2">
                  <div class="nav-item" @click="level2Back">
                    <div class="nav-item-inner nav-item-inner-back">
                      <span>
                        <img
                          src="@img/h5/h5-arrow-left.png"
                          alt=""
                          class="side-back-img"
                        />返回</span
                      >
                    </div>
                  </div>

                  <!-- 二级导航 -->
                  <div
                    class="nav-item"
                    v-for="(level2, level2_index) in expand_level2_child"
                    :key="level2_index"
                    @click="clickMenuLevel2(level2)"
                  >
                    <div>
                      <div class="nav-item-inner">
                        <span>{{ level2.title }}</span>
                        <img
                          src="@img/h5/h5-arrow-right.png"
                          alt=""
                          class="arrow-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 3级导航 -->
              <template v-if="show_level == 3">
                <div class="side-nav-list side-nav-list-level2" data-level="3">
                  <div class="nav-item" @click="level3Back">
                    <div class="nav-item-inner nav-item-inner-back">
                      <span>
                        <img
                          src="@img/h5/h5-arrow-left.png"
                          alt=""
                          class="side-back-img"
                        />返回</span
                      >
                    </div>
                  </div>

                  <!-- 3级导航 -->
                  <div
                    class="nav-item"
                    v-for="(level3, level3_index) in expand_level3_child"
                    :key="level3_index"
                    @click="clickMenuLevel3(level3)"
                  >
                    <div>
                      <div class="nav-item-inner">
                        <span>{{ level3.title }}</span>
                        <img
                          src="@img/h5/h5-arrow-right.png"
                          alt=""
                          class="arrow-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 3级导航 -->
              <template v-if="show_level == 4">
                <div class="side-nav-list side-nav-list-level2" data-level="4">
                  <div class="nav-item" @click="level4Back">
                    <div class="nav-item-inner nav-item-inner-back">
                      <span>
                        <img
                          src="@img/h5/h5-arrow-left.png"
                          alt=""
                          class="side-back-img"
                        />返回</span
                      >
                    </div>
                  </div>

                  <!-- 3级导航 -->
                  <div
                    class="nav-item"
                    v-for="(level4, level4_index) in expand_level4_child"
                    :key="level4_index"
                    @click="clickMenuLevel4(level4)"
                  >
                    <div>
                      <div class="nav-item-inner">
                        <span>{{ level4.title }}</span>
                        <img
                          src="@img/h5/h5-arrow-right.png"
                          alt=""
                          class="arrow-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div>
            <!-- <div class="info-right">
                            <div class="log-box" v-if="!vuex_is_login">
                                <router-link class="login" to="/login">
                                    <img src="@static/common/head-user-login.png" alt="" class="user-login" @click="closeMod()" />
                                </router-link>
                                <router-link class="register" to="/register">
                                    <img src="@static/common/head-user-reg.png" alt="" class="user-reg" @click="closeMod()" />
                                </router-link>
                            </div>
                            <router-link class="shopcart" to="/cart">
                                <img src="@static/common/head-cart.png" alt="" class="cart-image" @click="closeMod()" />
                                <span class="cart-num">{{ shopcart_count || 0 }}</span>
                            </router-link>
                        </div> -->

            <!-- <div class="user-login-info flex" v-if="vuex_is_login">
                            <div class="avatar-box" @click="$router.push('/my-index')">
                                <img :src="mix_user_avatar || avatar_default" alt="" />
                            </div>
                            <div @click="closeMod()">
                                <router-link class="phone" to="/my-index">
                                    {{ mix_user_phone }}
                                </router-link>
                            </div>

                            <a class="logout" href="javascript:void(0)" @click="logout()">
                                退出
                              
                            </a>
                        </div> -->
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
      show_level: 1, //默认展示的导航分类级别
      expandSideNav: false,
      expand_level2_Login: [],
      expand_level2_child: [],
      expand_level3_child: [],
      expand_level4_child: [],
      expand_level5_child: [],
      showHeaderSearch: false,

      // H5端

      // selectCate: 853,
      selectCate: "",
      selectShow: false,
      selectList: [
        {
          id: 1,
          name: "产品",
        },
        {
          id: 2,
          name: "技术文档",
        },
        {
          id: 3,
          name: "网站内容",
        },
        {
          id: 4,
          name: "论文",
        },
      ],
      selectIndex: 0,
      active_product_cate_index: 0,
      // active_product_cate: {},
      active_haocai_cate: {},

      showSearch: false,
      keyword: "",
      selectType: "",

      options: [
        {
          title: "所有产品",
          id: "",
        },
      ],

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
      "userInfo",
      "avatar_default",
      "page_header_menu",
      "vuex_is_login",
    ]),

    options_product_cates() {
      if (!this.product_cates.length) {
        return [
          {
            title: "抗体",
            id: 853,
          },
        ];
      } else {
        return [
          {
            id: "",
            title: "所有产品",
          },
          ...this.product_cates,
        ];
      }
    },

    headerTheme() {
      return {
        ["theme-" + this.header_theme]: true,
      };
    },

    //3个主页
    is_page_home() {
      let ret = false;
      let route_arr = ["index"];
      if (route_arr.includes(this.$route.name)) {
        ret = true;
      }
      return ret;
    },
    // 主导航
    opt_nav() {
      //个人中心
      let child_user = this.vuex_is_login
        ? [
            {
              title: "个人中心",
              route: "",
              child: [
                {
                  title: "我的订单",
                  route: "/my/orders",
                },

                {
                  title: "下载记录",
                  route: "/my/downloads",
                },
                {
                  title: "个人资料",
                  route: "/my/profile",
                },
                {
                  title: "修改密码",
                  route: "/my/password",
                },
              ],
            },
          ]
        : [
            {
              title: "登录/注册",
              route: "",
              child: [
                {
                  title: "登录",
                  route: "/login",
                },
                {
                  title: "注册",
                  route: "/register",
                },
              ],
            },
          ];

      let arr = [
        {
          title: "首页",
          route: "/",
        },
        {
          title: "文档中心",
          route: "/contractList",
        },
        {
          title: "新闻资讯",
          route: "/news",
        },
        {
          title: "关于我们",
          route: "",
          child: [
            {
              title: "公司简介",
              route: "/about",
            },
            {
              title: "联系我们",
              route: "/contact",
            },
          ],
        },

        ...child_user,
      ];
      return arr;
    },

    active_product_cate() {
      return this.product_cates[this.active_product_cate_index];
    },
  },

  watch: {
    expandSideNav(val) {},

    $route(to, from) {
      //console.log("页面顶部 watch $route", to);
      // if (val) {
      //   this.keyword = val;
      // }
      this.searchLock = true;
      this.keyword = to.query.keyword || "";
      this.search_suggest_list = [];

      this.toggleSearchBox(true);
    },

    keyword(val) {
      if (val) {
        if (!this.searchLock) {
          this.handleSearchChange();
        }
      } else {
        this.search_suggest_list = [];
      }
    },
  },

  created() {
    this.keyword = this.$route.query.keyword || "";
    // this.setView();
  },

  methods: {
    // 获取产品导航

    //一级分类

    clickMenuNav(item) {
      //console.log("导航", { ...item });

      let sub_list = item.child;

      if (sub_list && sub_list.length) {
        this.show_level = 2;
        this.expand_level2_child = sub_list;
        this.expand_level2_Login = sub_list;

        this.expand_level2_child.forEach((el) => {
          el.l1Name = item.title;
          el.l1route = item.route;
        });
      } else {
        this.expandSideNav = false;
        if (item.title == "登出") {
          this.logout();
          return;
        }
        this.$router.push(item.route);
      }
    },

    //2级分类
    clickMenuLevel2(item) {
      //console.log("分类信息", { ...item });
      let sub_list = item.child;
      console.log(item, 1111);
      if (sub_list && sub_list.length) {
        this.show_level = 3;
        this.expand_level3_child = sub_list;
        if (item.l1Name == "服务") {
          this.$router.push(item.route);

          this.expand_level3_child.forEach((el) => {
            el.l1Name = item.l1Name;
          });
          return;
        }
      } else {
        this.expandSideNav = false;
        if (item.title == "登出") {
          this.logout();
          return;
        }

        // }
        this.$router.push(item.route);
        //
      }
    },

    //3级分类
    clickMenuLevel3(item) {
      //console.log("分类信息", { ...item });

      // debugger;
      let sub_list = item.child || item.channels || [];
      if (sub_list && sub_list.length) {
        console.log(item);
        this.show_level = 4;
        this.expand_level4_child = sub_list;
        if (item.l1Name == "服务") {
          this.$router.push(item.route);
          return;
        }
      } else {
        this.expandSideNav = false;
        if (item.route == "logout") {
          this.logout();
          return;
        }
        this.$router.push(item.route);
      }
    },
    //4级分类
    clickMenuLevel4(item) {
      //console.log("分类信息", { ...item });

      let sub_list = item.child;
      if (sub_list && sub_list.length) {
        this.show_level = 5;
        this.expand_level5_child = sub_list;
      } else {
        this.expandSideNav = false;
        if (item.route == "/logout") {
          this.logout();
          return;
        }
        this.$router.push(item.route);
      }
    },

    // 二级分类返回
    level2Back() {
      this.show_level = 1;
    },
    // 二级分类返回
    level3Back() {
      this.show_level = 2;
    },
    // 二级分类返回
    level4Back() {
      this.show_level = 3;
    },
    // 二级分类返回
    level5Back() {
      this.show_level = 4;
    },

    logout() {
      this.$store.commit("set_vuex_data", {
        k: "vuex_token",
        v: "",
      });
      this.$store.commit("set_vuex_data", {
        k: "vuex_userId",
        v: "",
      });
      this.$store.commit("set_vuex_data", {
        k: "vuex_isLogin",
        v: false,
      });
      this.$store.commit("set_vuex_data", {
        k: "vuex_userInfo",
        v: {},
      });
      alertSucc("已退出");
      this.$router.push({
        path: "/",
      });
      this.show_level = 1;
    },

    inputFun(text) {
      if (text == "聚焦") {
        this.inputWinShow = true;
        return;
      }

      if (text == "失去焦点") {
        setTimeout(() => {
          this.inputWinShow = false;
        }, 100);
        return;
      }
    },
    selectSearch(index) {
      this.selectIndex = index;
    },
    selectBtnFun(text) {
      if (text == "失去焦点") {
        setTimeout(() => {
          this.selectShow = false;
        }, 100);
        return;
      }
      if (text == "聚焦") {
        this.selectShow = true;
        return;
      }
    },

    toHome() {
      this.$router.push("/");
      this.expandSideNav = false;
    },

    toggleSearchBox(closed) {
      // debugger;
      if (closed) {
        this.showHeaderSearch = false;
      } else {
        this.showHeaderSearch = !this.showHeaderSearch;
      }

      this.$nextTick(() => {
        let $searchInput = document.querySelector(".header-search-input-phone");
        if (!this.showHeaderSearch) {
          $searchInput.blur();
        } else {
          $searchInput.focus();
        }
      });
    },

    toSearch() {
      this.$router.push({
        path: "/contractList",
        query: {
          category: "",
          search: this.keyword,
          hash: Math.random().toString(36).substring(2, 15),
        },
      });
      this.keyword = "";
    },

    handleSearchInput() {
      this.searchLock = false;
    },

    handleSearchChange() {
      //console.log("监视 change 事件", this.keyword);

      if (this.disabledSearchQuery) {
        return false;
      }

      this.cutdown();
      // this.kwywordSearch()
    },

    cutdown() {
      this.disabledSearchQuery = true;
      setTimeout(() => {
        this.disabledSearchQuery = false;
      }, 200);
    },

    // kwywordSearch() {
    //     // search_suggest_list

    //     this.$api('product_searchPlist', {
    //         channel_id: this.selectCate || '',
    //         page: 1,
    //         pageNum: 8,
    //         keyword: this.keyword.trim() || '',
    //     }).then((res) => {
    //         //console.log("搜索相关");
    //         this.search_suggest_list = res.data.list.slice(0, 8)

    //         // setTimeout(() => {
    //         // this.disabledSearchQuery = false;
    //         // }, 500);
    //     })
    // },

    closeMod() {
      this.expandSideNav = false;
    },
  },
};
</script>

<style scoped lang="less">
.header-mobile {
  display: none;
}

.common-phone-header {
  display: none;
}

.side-wrap {
  // display: none;
}

@media only screen and (max-width: 1199px) {
  /* body {
		padding: 0.9rem 0 1rem !important;
	} */
  .header-wrap {
    display: none;
  }

  .common-phone-header {
    display: block !important;
  }

  .side-wrap {
    display: block !important;
  }

  /* æ‰‹æœºå¯¼èˆª */
  .common-phone-header {
    position: fixed;
    z-index: 10000;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
  }

  .common-phone-header-inner {
    display: flex;
    height: 50px;
    border-bottom: 1px solid #eee;
    padding: 0 15px;
    justify-content: space-between;
    align-items: center;
  }

  .header-menu-phone {
    height: 30px;
  }

  .header-logo-phone {
    width: 160px;
  }

  .header-search-phone {
    height: 30px;
  }

  .search-suggest-list {
    // display: none;
    position: absolute;
    z-index: 100000;
    left: -40%;
    left: 0;
    right: -40%;
    right: 0;
    top: 32px;
    border: 1px solid #ddd;
    border-top: none;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;

    .search-suggest-item {
      line-height: 32px;
      height: 32px;
      padding: 0 5px;
      text-align: left;
      transition: 0.3s;

      &:hover {
        background: #f5f5f5;
      }

      a {
        display: block;
        width: 100%;
        height: 100%;
        color: #888;
        font-size: 12px;

        &:hover {
          color: #0b61af;
        }
      }
    }
  }

  .selectBox {
    width: 80px;
    height: 100%;
    padding: 0 5px;
    cursor: pointer;
    z-index: 9;
    position: relative;

    .text {
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      line-height: 20px;
      text-align: center;
      margin-right: 4px;
      position: relative;
    }

    .itemBoxInput {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
    }

    .icon {
      font-size: 14px;
      color: #d61818;
    }

    .selectBigBox {
      width: 100px;
      background: #ffffff;
      border-radius: 3px 3px 3px 3px;
      border: 1px solid #949494;
      position: absolute;
      top: 46px;
      left: 0;
      // display: none;
      padding: 4px 0;

      .itemBox {
        width: 100%;
        height: 30px;
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        line-height: 19px;
        text-align: left;
        padding: 0 10px;
        position: relative;

        &:hover,
        &.active {
          background: #ffdbdb;
        }
      }
    }

    // &:hover {
    //     .selectBigBox {
    //         display: block;
    //     }
    // }
  }

  /* æœç´¢æ¡† */
  .header-search-box-phone {
    display: none;
    position: relative;

    &.shown {
      display: flex;
      align-items: center;
    }
  }

  .header-search-input-phone {
    border-radius: 20px;
    height: 32px;
    border-width: 1px;
    border: 1px solid #666;
    padding: 0 10px;
    font-size: 14px;
    width: 150px;
  }

  /* ä¾§è¾¹æ å¯¼èˆª */
  .side-modal {
    display: none;
    position: fixed;
    z-index: 99999;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.5);

    &.expand {
      display: block;
    }
  }

  .side-container {
    display: block;
    overflow: hidden;
    width: 0%;
    // display: none;
    position: fixed;
    z-index: 100000;
    left: 0;
    top: 0;
    height: 100vh;
    background-color: #fff;
    color: #000;
    border-left: 1px solid #eee;
    // animation: ani_side 1s;
    transition: all 0.5s;

    &.expand {
      width: 80%;
    }
  }

  @keyframes ani_side {
    from {
      width: 0%;
    }

    to {
      width: 80%;
    }
  }

  .side-wrap {
    width: 100%;
  }

  .side-top {
    display: flex;
    height: 60px;
    padding: 0 15px 0 15px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  .side-logo {
    width: 160px;
  }

  .side-close {
    width: 24px;
  }

  .side-bottom {
    padding: 0;
  }

  .nav-item {
    padding: 0 15px;
  }

  .nav-item-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* padding: .27rem .48rem .27rem .72rem; */
    padding: 0;
    border-bottom: 1px solid #eee;
    line-height: 42px;
    height: 42px;
    overflow: hidden;
  }

  .nav-item-inner span,
  .phone,
  .logout {
    display: flex;
    align-items: center;
    font-size: 14px;
    word-break: keep-all;
    color: #000;
  }
  .logout {
    margin-left: 0.9rem;
  }
  .nav-item-inner .arrow-right {
    width: 20px;
  }

  .side-nav-list .nav-item a {
    color: #000;
    font-size: 13px;
    width: 100%;
    display: inline-block !important;
  }

  .side-nav-list .side-local-img {
    width: 0.3rem;
    margin-right: 0.2rem;
    vertical-align: text-bottom;
  }

  .side-nav-list-level2 {
    // display: none;
  }

  .side-nav-list-level2 .side-back-img {
    width: 15px;
    margin-right: 10px;
    vertical-align: text-bottom;
  }

  .side-nav-list-main .nav-item:first-child {
    /*display: none;*/
  }

  .side-nav-list-main .nav-item:last-child {
    /* display: none; */
  }

  /* äº§å“å¯¼èˆª */
  .nav-item-product-sub-list {
    /* padding-left: .3rem; */
    /* border-bottom: 1px solid #eee; */
  }

  .nav-item-product-sub-list > a > div {
    padding: 0.2rem 0 0.2rem 0.5rem;
    border-bottom: 1px solid #eee;
  }

  .nav-item-inner-product {
    /* border-bottom: none; */
  }

  .nav-item-product-sub-list {
    display: none;
  }

  .arrow-down {
    display: none;
  }
}

// pad端
@media screen and (min-width: 768px) and (max-width: 1199px) {
  .side-container {
    &.expand {
      width: 40%;
    }
  }

  .side-logo {
    width: 50px;
  }

  .side-close {
    width: 30px;
  }

  .nav-item-inner img {
    width: 30px;
  }

  .header-search-input-phone {
    width: 500px;
  }
}

@media screen and (max-width: 1199px) {
  .header-mobile {
    display: block;
  }

  .side-wrap {
    .info-right {
      display: flex;
      padding-left: 15px;
      padding-top: 15px;

      .log-box {
        a {
          margin-right: 10px;

          img {
            width: 30px;
            height: 30px;
          }
        }
      }

      .shopcart {
        img {
          width: 30px;
          height: 30px;
        }
      }
    }

    .user-login-info {
      height: 50px;
      padding-left: 15px;

      .avatar-box {
        display: none;
      }
    }
  }
}
</style>
