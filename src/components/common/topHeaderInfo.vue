<template>
  <div class="header-box">
    <div class="header">
      <!-- 没登录 -->
      <!-- <div class="left" v-if="!vuex_is_login">
        <router-link class="login" to="/login">请登录</router-link>
        <router-link class="register" to="/register">免费注册</router-link>
      </div> -->

      <div class="left" v-if="vuex_is_login">
        <span>
          <b class="user-index" @click="$router.push('/memberCenter')">{{
            baseInfo.name
          }}</b>
          <span class="text-1">您好！</span>
        </span>
        <!-- <span class="logout" @click="logout">退出登录</span> -->
      </div>

      <div class="right">
        <div class="login-action" v-if="!vuex_is_login">
          <router-link class="login" to="/login">请登录</router-link>
        </div>
        <div class="login-action" v-if="!vuex_is_login">
          <router-link class="register" to="/register">免费注册</router-link>
        </div>

        <div class="login-action" v-if="vuex_is_login">
          <span class="logout" @click="logout">退出登录</span>
        </div>

        <div>
          <router-link to="/order-list">我的订单</router-link>
        </div>

        <!-- <div
          v-if="$route.name != 'Login'"
          class="cart-box"
          @click="jump('cart')"
        >
          <img src="/common/cart.png" alt />
          <router-link to="/cart">购物车</router-link>
          <b class="cart-num">{{ shopcart_count }}</b>
        </div> -->

        <div
          @mouseover="mouseover"
          @mouseout="mouseout"
          style="position: relative"
        >
          <span @click="$router.push('/memberCenter')"> 个人中心 </span>

          <i class="el-icon-caret-bottom"></i>

          <ul class="hide-box" v-show="showSiteMap">
            <li v-for="(item, index) in userMenu" :key="index">
              <router-link :to="item.route"> {{ item.title }}</router-link>
            </li>
          </ul>
        </div>

        <div
          class="shoujiban"
          @mouseover="show_shoujiban = true"
          @mouseout="show_shoujiban = false"
        >
          手机版
          <!-- <i class="el-icon-caret-bottom"></i> -->

          <div class="hide-box-contact" v-show="show_shoujiban">
            <img :src="webConfig.phone_code" alt />
            <!-- <img src="/common/shouji-qrcode.png" alt /> -->
          </div>
        </div>

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
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      showSiteMap: false, //个人中心 菜单
      showContact: false, //联系我们
      show_shoujiban: false, //手机版

      userMenu: [
        { title: "我的主页", route: "memberCenter" },
        { title: "我的订单", route: "order-list" },
        { title: "我的评价", route: "my-review-list" },
        { title: "售后/退款", route: "myRefund" },
        { title: "积分商城", route: "jifen" },
        { title: "我的余额", route: "yue" },
        { title: "我的收藏", route: "favorite-list" },
        { title: "优惠券", route: "myCoupon" },
        { title: "收货地址", route: "address-list" },
        { title: "关于我们", route: "setting" },
        { title: "规则中心", route: "shopRule" },
        { title: "联系我们", route: "contact" },
      ],
    };
  },

  computed: {
    ...mapState([
      "baseInfo",
      "shopcart_count",
      "webConfig",
      "is_common",
    ]),
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
      this.$store.commit("clear_loginInfo");
      // debugger
      if (this.$route.meta.requireAuth) {
        this.$router.push("/");
      }
    },
  },
};
</script>


<style scoped lang="less">
.hide-box {
  position: absolute;
  z-index: 100;
  background: #fff;
  min-width: 100px;
  border: 1px solid #ccc;
  top: 30px;
  left: 50%;
  transform: translate(-50%);

  li:hover {
    a {
      color: #4CA5E4;
    }
  }
}

.header-box {
  background: #f5f5f5;
}
.header {
  max-width: @width;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  margin: 0 auto;
  color: #c2c2c2;
  font-size: 12px;

  .left {
    float: left;
    min-width: 20%;
    text-align: left;

    .logout {
      color: #4CA5E4;
      cursor: pointer;
    }
    .login {
      color: #ff3d00;
    }
    .register {
      color: #6c6c6c;
      margin-left: 10px;
      text-decoration: none;
      font-weight: bold;
    }

    .user-index {
      color: #4CA5E4;
      cursor: pointer;

      &:hover {
        color: #4CA5E4;
      }
    }

    .text-1 {
      margin-left: 10px;
      color: #000;
    }
  }

  .right {
    float: right;
    display: flex;
    justify-content: flex-end;
    width: 60%;
    padding: 0 0;
    color: #333;

    a {
      color: #333;
    }

    .login-action {
      .login {
        color: #4CA5E4;
      }

      .logout {
        color: #4CA5E4;
      }
    }

    > div {
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
      .flex();
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
      color: #4CA5E4;
      font-weight: bold;
      margin-left: 10px;
    }
  }
}
</style>
