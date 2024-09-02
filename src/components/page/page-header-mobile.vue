<template>
  <div id="header" class="header-mobile" :class="headerTheme">
    <!-- 顶部导航 -->
    <div class="common-phone-header">
      <div class="common-phone-header-inner">
        <div class="menu-box" @click="expandSideNav = true">
          <img src="@img/h5/h5-menu.png" alt="" class="header-menu-phone" />
        </div>
        <a href="/" class="header-logo-box-phone" style="" v-if="!showHeaderSearch">
          <img src="@img/h5/logo.png" alt="" class="header-logo-phone" />
        </a>
        <div class="header-search-box-phone" :class="{ shown: showHeaderSearch }">
          <input
            ref="searchInput"
            type="search"
            placeholder="请输入"
            class="form-control header-search-input-phone"
            v-model="keyword"
            @keyup.enter="toSearch"
            @input="handleSearchInput"
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
                <img src="@img/h5/logo.png" class="side-logo" />
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
                    <img src="@img/h5/h5-arrow-right.png" alt="" class="arrow-right" />
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
      expand_level2_child: [],
      expand_level3_child: [],
      expand_level4_child: [],
      expand_level5_child: [],
      showHeaderSearch: false,

      // H5端

      // selectCate: 853,
      selectCate: "",

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
    ...mapState(["header_theme"]),

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
      let child_user = [
        {
          title: "个人主页",
          route: "/order-list",
          child: [],
        },

        {
          title: "订单中心",
          route: "",
          child: [
            {
              title: "我的订单",
              route: "/order-list",
            },
            {
              title: "评价晒单",
              route: "/my-review-list",
            },
          ],
        },

        {
          title: "我的活动",
          route: "",
          child: [
            {
              title: "我的收藏",
              route: "/favorite-list",
            },
            {
              title: "我的足迹",
              route: "/browse-history",
            },
            {
              title: "我的优惠券",
              route: "/myCoupon",
            },
            {
              title: "领券中心",
              route: "/couponCenter",
            },
          ],
        },

        {
          title: "账户资金",
          route: "",
          child: [
            {
              title: "在线充值",
              route: "/yueChongzhi",
            },
            {
              title: "余额明细",
              route: "/yueMingxi",
            },

            {
              title: "我的积分",
              route: "/pointsDetail",
            },
            {
              title: "积分商城",
              route: "/pointsMall",
            },
          ],
        },

        {
          title: "个人设置",
          route: "",
          child: [
            {
              title: "个人资料",
              route: "/my-info",
            },
            {
              title: "地址管理",
              route: "/address-list",
            },
            {
              title: "修改密码",
              route: "/change-password",
            },
            {
              title: "退出登录",
              route: "/logout",
            },
          ],
        },
      ];

 

      let child_about = this.child_about;
      let route_product = this.vuexTreeCates.length ? this.vuexTreeCates[0].route : '/'

      let arr = [
        { title: "首页", route: "/" },
        { title: "产品中心", route: route_product, child: this.vuexTreeCates },
        { title: "饮食与文化", route: '/culture', },
        { title: "市场活动", route: "/activities?id=25", child: this.activitiesCates },
        { title: "新闻中心", route: '/news?id=27', child: this.vuexNewsCates },
        { title: "关于我们", route: "/companyProfile", child: child_about },

        { title: "个人中心", route: "/order-list", child: child_user },
        { title: "购物车", route: "/cart", child: [] },
        { title: "登录/注册", route: "/login", child: [] },
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
    //一级分类
    clickMenuNav(item) {
      //console.log("导航", { ...item });

      let sub_list = item.child;

      if (sub_list && sub_list.length) {
        this.show_level = 2;
        this.expand_level2_child = sub_list;
      } else {
        this.expandSideNav = false;
        if (item.route == "logout") {
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
      if (sub_list && sub_list.length) {
        this.show_level = 3;
        this.expand_level3_child = sub_list;
      } else {
        this.expandSideNav = false;
        if (item.route == "logout") {
          this.logout();
          return;
        }
        this.$router.push(item.route);
      }
    },

    //3级分类
    clickMenuLevel3(item) {
      //console.log("分类信息", { ...item });

      // debugger;
      let sub_list = item.child || item.channels || [];
      if (sub_list && sub_list.length) {
        this.show_level = 4;
        this.expand_level4_child = sub_list;
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
      this.mix_logout();
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
      this.search_suggest_list = [];

      if (!this.keyword) {
        alertErr("请输入搜索关键字");
        return;
      }
      // if (this.selectCate) {
      //   this.$router.push("/product-search?id=" + this.selectCate + "&keyword=" + this.keyword);
      // } else {
      //   this.$router.push("/product-search?keyword=" + this.keyword);
      // }

      let query = {};
      if (this.selectCate) {
        query.id = this.selectCate;
      }

      query.keyword = this.keyword.trim() || "";
      query.ms = new Date().getTime();

      // this.toProductSearchPage(params);

      this.toggleSearchBox();

      this.$router.push({
        path: "/product-search",
        query: query,
      });
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
      this.kwywordSearch();
    },

    cutdown() {
      this.disabledSearchQuery = true;
      setTimeout(() => {
        this.disabledSearchQuery = false;
      }, 200);
    },

    kwywordSearch() {
      // search_suggest_list

      this.$api("product_searchPlist", {
        channel_id: this.selectCate || "",
        page: 1,
        pageNum: 8,
        keyword: this.keyword.trim() || "",
      }).then((res) => {
        //console.log("搜索相关");
        this.search_suggest_list = res.data.list.slice(0, 8);

        // setTimeout(() => {
        // this.disabledSearchQuery = false;
        // }, 500);
      });
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
    height: 32px;
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
      .ellipsis-1();
      line-height: 32px;
      height: 32px;
      padding: 0 5px;
      text-align: left;
      transition: 0.3s;

      &:hover {
        background: #f5f5f5;
      }

      a {
        .ellipsis-1();
        display: block;
        width: 100%;
        height: 100%;
        color: #888;
        font-size: 12px;
        &:hover {
          color: #4CA5E4;
        }
      }
    }
  }

  /* æœç´¢æ¡† */
  .header-search-box-phone {
    display: none;
    position: relative;

    &.shown {
      display: block;
    }
  }

  .header-search-input-phone {
    border-radius: 20px;
    height: 32px;
    border-width: 1px;
    border: 1px solid #666;
    padding: 0 10px;
    font-size: 14px;
    width: 200px;
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
    width: 50px;
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
    line-height: 45px;
    height: 45px;
    overflow: hidden;
  }

  .nav-item-inner span {
    display: flex;
    align-items: center;
    font-size: 14px;
    word-break: keep-all;
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
}
</style>
