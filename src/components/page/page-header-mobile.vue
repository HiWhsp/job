<template>
  <div id="header" class="header-mobile" :class="headerTheme">
    <!-- 顶部导航 -->
    <div class="common-phone-header">
      <div class="common-phone-header-inner">
        <div class="menu-box" @click="expandSideNav = true">
          <img src="@img/h5/h5-menu.png" alt="" class="header-menu-phone" />
        </div>

        <div class="header-left" v-if="!showHeaderSearch">
          <div class="logo">
            <div class="logo-emblem">
              <img src="@img/common/logo.png" alt="" />
            </div>
          </div>
          <div class="brand-name">法律文书网</div>
        </div>
       

      </div>
    </div>

    <!-- 悬浮侧边栏 -->
    <div class="side-wrap">
      <div class="side-modal" :class="{ expand: expandSideNav }" @click="expandSideNav = false"></div>
      <div class="side-container" :class="{ expand: expandSideNav }">
        <div class="side-wrap">
          <div class="side-inner">
            <div class="side-top">
              <div class="side-logo-box" @click="toHome">
                <!-- <a href="/"> -->
                <img src="@img/common/logo.png" class="side-logo" />
                <!-- </a> -->
              </div>
              <div @click="goUrl('/login')" v-if="!isLogin && !vuex_user.id" style="font-size: 0.8rem;width: 8rem;">
                登录/注册</div>
              <div v-else style="font-size: 0.8rem;width: 8rem;">
                <div class="user-info" slot="reference">
                  <img src="@img/common/avatar.png" alt="" />
                  <span>{{ vuex_user.mobile || "13333333333" }}</span>
                </div>
              </div>
              <div class="side-close-box" @click="expandSideNav = false">
                <img src="@img/h5/h5-close.png" class="side-close" />
              </div>
            </div>
            <div class="side-bottom">
              <!-- 主导航 -->

              <!-- 一级导航 -->
              <div class="side-nav-list side-nav-list-main" v-if="show_level == 1" data-level="1">
                <div class="nav-item" v-for="(item, index) in opt_nav" :key="index" @click="clickMenuNav(item)">
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
                        <img src="@img/h5/h5-arrow-left.png" alt="" class="side-back-img" />返回</span>
                    </div>
                  </div>

                  <!-- 二级导航 -->
                  <div class="nav-item" v-for="(level2, level2_index) in expand_level2_child" :key="level2_index"
                    @click="clickMenuLevel2(level2)">
                    <div>
                      <div class="nav-item-inner">
                        <span>{{ level2.title }}</span>
                        <img src="@img/h5/h5-arrow-right.png" alt="" class="arrow-right" />
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
                        <img src="@img/h5/h5-arrow-left.png" alt="" class="side-back-img" />返回</span>
                    </div>
                  </div>

                  <!-- 3级导航 -->
                  <div class="nav-item" v-for="(level3, level3_index) in expand_level3_child" :key="level3_index"
                    @click="clickMenuLevel3(level3)">
                    <div>
                      <div class="nav-item-inner">
                        <span>{{ level3.title }}</span>
                        <img src="@img/h5/h5-arrow-right.png" alt="" class="arrow-right" />
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
                        <img src="@img/h5/h5-arrow-left.png" alt="" class="side-back-img" />返回</span>
                    </div>
                  </div>

                  <!-- 3级导航 -->
                  <div class="nav-item" v-for="(level4, level4_index) in expand_level4_child" :key="level4_index"
                    @click="clickMenuLevel4(level4)">
                    <div>
                      <div class="nav-item-inner">
                        <span>{{ level4.title }}</span>
                        <img src="@img/h5/h5-arrow-right.png" alt="" class="arrow-right" />
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
    <!-- 悬浮2 -->
    <div class="side-wrap">
      <div class="side-modal" :class="{ expand: expand2SideNav }" @click="expand2SideNav = false"></div>
      <div class="side-container" :class="{ expand: expand2SideNav }">
        <div class="side-wrap">
          <div class="side-inner">
            <div class="side-top">
              <div class="side-logo-box" @click="toHome">
                <!-- <a href="/"> -->
                <img src="@img/h5/new-logo.jpg" class="side-logo" />
                <!-- </a> -->
              </div>
              <div class="side-close-box" @click="expand2SideNav = false">
                <img src="@img/h5/h5-close.png" class="side-close" />
              </div>
            </div>
            <div class="side-bottom">
              <!-- 主导航 -->

              <!-- 一级导航 -->
              <div class="side-nav-list side-nav-list-main" data-level="1">
                <div class="nav-item" v-for="(item, index) in opt2_nav" :key="index" @click="clickMenuNav(item)">
                  <div class="nav-item-inner">
                    <span>{{ item.title }}</span>
                    <img src="@img/h5/h5-arrow-right.png" alt="" class="arrow-right" />
                  </div>
                </div>
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
      show_level: 1, //默认展示的导航分类级别
      expandSideNav: false,
      expand2SideNav: false,
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
      isLogin: false,
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



      let listArr = [{
        title: '首页',
        route: '/'
      }, {
        title: '关于我们',
        route: '/about'
      }, {
        title: '业务范围',
        route: '/business'
      }, {
        title: '联系我们',
        route: '/contact',
      }, {
        title: '个人中心',
        child: [
          {
            title: '我的订单',
            route: '/my?tab=1',
          },
          {
            title: '我的下载',
            route: '/my?tab=2',
          },
          {
            title: '我的收藏',
            route: '/my?tab=3',
          },
        ]
      }]

      // return arr;
      return listArr;
    },
    opt2_nav() {
      let listArr = [{
        title: "个人中心",
        route: "/my-info",
        role: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      }, {
        title: "会员中心",
        route: "/vip-center",
        role: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      },
      {
        title: "我的发布",
        route: "/my-publish-list",
        role: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      },
      {
        title: "我的标源",
        route: "/my-bid-list-daiyan",
        role: [1, 2, 3, 4]
      },
      {
        title: "财务管理",
        route: "/my-finances",
        role: [1, 2, 3, 4]
      },
      {
        title: "佣金分销",
        route: "/my-commission",
        role: [1, 2, 3, 4, 8]
      },
      {
        title: "我的收藏",
        route: "/my-collection",
        role: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      },
      {
        title: "我的关注",
        route: "/my-follows",
        role: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      },
      {
        title: "排名竞价",
        route: "/my-rank-bid",
        role: [1, 2, 3, 4]
      },
      {
        title: "我的消息",
        route: "/my-message",
        role: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      },
      {
        title: "退出登录",
        route: "logout",
      },
      ]

      // return arr;
      return listArr;
    },

    active_product_cate() {
      return this.product_cates[this.active_product_cate_index];
    },
  },

  watch: {
    expandSideNav(val) { },

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
  mounted() {

    if (["/login", "/register", "/retrieve"].includes(location.pathname)) {
      this.isLogin = true;
    }

  },


  methods: {
    goUrl(path) {
      this.$router.push(path);
      this.expandSideNav = false
    },
    handleNavClick(path) {
      if (path === "/" && location.pathname === "/") {
        this.searchText = "";
        window.location.reload();
        return;
      }
      this.$router.push(path);
    },
    goServe() {
      if (this.checkLogin()) {
        this.expand2SideNav = true
      } else {
        this.$openLoginDialog()
      }

    },
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
          this.expand2SideNav = false
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


    handleSearch() {
      // 这里可以添加搜索逻辑
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
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 32px;
      height: 32px;
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
        font-size: 12px;

        &:hover {
          color: #1958C7;
        }
      }
    }
  }

  /* æœç´¢æ¡† */
  .header-search-box-phone {
    flex: 1;
    display: none;
    position: relative;
    text-align: center;

    &.shown {
      display: block;
    }
  }

  .header-search-input-phone {
    border-radius: 0.5rem;
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

  .nav-item-product-sub-list>a>div {
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

@media screen and (max-width: 768px) {
  .common-phone-header-inner {
    height: 3rem;
  }
}

@media screen and (max-width:750px) {
  .header-left {
    display: flex;
    align-items: center;

    img {
      width: 2rem;
      height: 2rem;
    }

    .brand-name {
      font-size: 1rem;
      color: #d32f2f;
      font-weight: bold;
    }
  }

  .user-info {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    border-radius: 25px;
    width: 135px;
    height: 36px;

    font-weight: bold;
    font-size: 12px;
    color: #4e57d9;

    img {
      width: 2rem;
      height: 2rem;
    }
  }
}
</style>
