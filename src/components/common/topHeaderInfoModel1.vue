<template>
  <div class="header-box">
    <div class="header w-1400">
      <!-- 没登录 -->
      <div class="left" v-if="!vuex_is_login">您好，欢迎您来本站购物!</div>

      <div class="left" v-if="vuex_is_login">
        <span style="color: #f00" @click="$router.push('user')">{{
          vuex_user.name
        }}</span
        >您好，欢迎您来本站购物!

        <span class="logout" @click="logout">安全退出</span>
      </div>

      <div class="right" v-if="vuex_is_login">
        <router-link to="shoucang">收藏夹</router-link>
        <router-link to="userIndex">会员中心</router-link>
        <router-link to="/">帮助中心</router-link>
      </div>

      <div class="right" v-if="!vuex_is_login">
        <router-link class="login" to="/login">
          <!-- <img src="@pro/account/login.png" alt /> -->
          您好，请登录
        </router-link>
        <router-link class="register" to="/register">
          <!-- <img src="@pro/account/register.png" alt /> -->
          免费注册
        </router-link>
        <router-link to="shoucang">我的订单</router-link>
        <router-link to="userIndex">个人中心</router-link>
        <router-link to="/">客户服务</router-link>

        <!-- <div class="phone">
          <img src="@pro/header/phone.png" alt />
          <span>{{ vuex_config.com_kefu }}</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      showSiteMap: false, //个人中心 菜单
      showContact: false, //联系我们
      show_shoujiban: false, //手机版

      userMenu: [
        { title: "我的主页", route: "userIndex" },
        { title: "我的订单", route: "myOrder" },
        { title: "我的售后", route: "refund-list" },
        { title: "我的评价", route: "myComments" },
        { title: "优惠券", route: "myYhq" },
        { title: "收货地址", route: "myAddress" },
        { title: "个人资料", route: "userInfo" },
      ],
    };
  },

  computed: {
    ...mapState([
      "config",
      "navMap",
    ]),
    ...mapGetters(["cartListNum"]),

    //用户导航
    filter_userMenu() {
      let navList = this.userMenu;

      return navList;
    },
  },
  created() {},

  methods: {
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
      // this.$router.push({ path: "/login" });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.hide-box {
  position: absolute;
  z-index: 100;
  background: #fff;
  min-width: 100px;
  border: 1px solid #ccc;
  top: 30px;
  left: 0;
}
.hide-box li:hover {
  color: #369;
}

.header-box {
  display: flex;
  justify-content: center;
  background: #f5f5f5;
  // padding: 10px 0;
  height: 36px;
  line-height: 36px;
}
.header {

  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    font-size: 13px;
    color: #666666;
    span {
      cursor: pointer;
    }
    .login {
      margin-left: 17px;
      font-size: 14px;
      color: #585858;

      &:hover {
        color: #f00;
      }
    }
    .register {
      margin-left: 17px;
      font-size: 14px;
      color: #585858;

      &:hover {
        color: #f00;
      }
    }
    span {
      margin: 0 5px;
    }
    a {
      font-size: 13px;
      color: #f00;
      margin: 0 5px;
    }
  }

  .right {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #848484;
    span {
      margin: 0 5px;
    }
    a {
      font-size: 14px;
      
      font-weight: 500;
      margin-left: 20px;
      color: #101000;
    }
    .redActive {
      color: #f00;
    }
    .phone {
      display: flex;
      align-items: center;
      font-size: 18px;
      color: #f00;
      margin-left: 15px;
      img {
        margin-right: 5px;
      }
    }
  }
}
.logout {
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    color: #f00;
  }
}

.account {
  cursor: pointer;
  b {
    color: #999;
  }
  &:hover {
    b {
      color: #f00;
    }
  }
}
</style>
