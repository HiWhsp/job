<template>
  <div class="page-head">
    <div class="section-nav">
      <div class="header-inner">
        <div class="logo-wrap">
          <div class="logo-box" @click="toHome()">
            <img src="@/static/common/head-logo.png" />
          </div>
        </div>

        <div class="nav-wrap">
          <div class="nav-list flex-between">
            <div class="nav-item" v-for="(item, index) in nav_list" :key="index" :class="checkClass(item)">
              <!-- 无子导航 -->
              <template v-if="!item.child || !item.child.length">
                <router-link class="nav-link" :to="item.route">
                  {{ item.title }}
                </router-link>
              </template>

              <!-- 有子导航 -->
              <template v-else>
                <el-popover popper-class="w-nav-popover" placement="top" title="" width="150" trigger="hover"
                  content="">
                  <router-link slot="reference" class="nav-link" :to="item.route">
                    {{ item.title }}
                  </router-link>

                  <div class="pop-child" v-if="item.child">
                    <router-link :to="sub.route" class="child-item" v-for="(sub, index) in item.child" :key="index">
                      {{ sub.title }}
                    </router-link>
                  </div>
                </el-popover>
              </template>
            </div>
          </div>
        </div>

        <div class="user-act flex">
          <div class="center-search-wrap">
            <div class="center-search">
              <div class="search-box">
                <input v-model="keyword" type="text" placeholder="请输入搜索关键词" @keyup.enter="toSearch"
                  @input="handleSearchInput" />
                <button class="btn-search " @click="toSearch()">
                  <img class="img-search" src="@/static/common/head-search.png" alt="" />
                </button>
              </div>
            </div>
            <!-- 搜索建议 -->
            <!-- <div class="search-suggest-list" v-if="search_suggest_list.length">
            <div class="search-suggest-item" v-for="(item, index) in search_suggest_list" :key="index">
              <router-link :to="'/product-detail/' + (item.skuId || item.inventoryId)" :alt="item.title"
                :title="item.title">
                【{{ item.skuId }}】 {{ item.title }}
              </router-link>
            </div>
          </div> -->
          </div>

          <div class="info-right">
            <div class="log-box">
              <router-link class="login" to="/login">
                <img src="@/static/common/head-user-login.png" alt="" class="user-login">
              </router-link>
              <router-link class="register" to="/register">
                <img src="@/static/common/head-user-reg.png" alt="" class="user-reg">
              </router-link>
            </div>
            <router-link class="shopcart" to="/cart">
              <img src="@/static/common/head-cart.png" alt="" class="cart-image">
              <span class="cart-num">{{ shopcart_count || 0 }}</span>
            </router-link>
          </div>
        </div>

        <div class="user-login-info flex" v-if="vuex_is_login">
          <div class="avatar-box" @click="$router.push('/my-index')">
            <img :src="mix_user_avatar || avatar_default" alt="">
          </div>
          <router-link class="phone" to="/my-index">
            {{ mix_user_phone }}
          </router-link>
          <a class="logout" href="javascript:void(0)" @click="logout()"> 退出 </a>
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
      "userInfo",
      "avatar_default",
    ]),

    // 主导航
    nav_list() {
      let arr = [
        { title: "首页", route: "/" },
        { title: this.vuex_product_cate_1.title || 'Cream Charger', route: this.vuex_product_cate_1.route || '/product-cates?id=780', child: [] },
        { title: this.vuex_product_cate_2.title || "Cream Dispenser", route: this.vuex_product_cate_2.route || '/product-cates?id=780', child: [] },
        { title: "关于我们", route: '/about', child: [] },
        { title: "联系我们", route: "/contact", child: [] },
      ];
      return arr;
    },

    // 个人中心导航
    opt_user_center_nav() {
      let arr = [
        { title: "我的订单", route: "/order-list" },
        { title: "我的佣金", route: "/myCommission" },
        { title: "个人资料", route: "/my-info" },
      ];
      if (this.vuex_is_login) {
        arr.push({ title: "退出账号", route: "" });
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
      background: #4CA5E4;
      color: #fff;
    }
  }
}
</style>

<style scoped lang="less">
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
  width: 1520px;
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
          background: #4CA5E4;
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
          color: #4CA5E4;

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

    .flex();
    align-items: stretch;

    border-radius: 5px;
    position: relative;
    overflow: hidden;


    .search-box {
      // border: 1px solid #aaa;
      .flex();
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
        background: #4CA5E4;
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
      .ellipsis-1();
      line-height: 3.5rem;
      height: 3.5rem;
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
        font-size: 1.3rem;

        &:hover {
          color: #4CA5E4;
        }
      }
    }
  }

}


.info-right {
  .flex();


  .log-box {
    .flex();
  }


  a {
    color: #fff;
    .flex();

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
      color: #4CA5E4;
    }
  }

  .logout {
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 16px;
    color: #999999;

    &:hover {
      color: #4CA5E4;
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
