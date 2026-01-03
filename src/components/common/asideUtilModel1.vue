<template>
  <div class="aside-util">
    <div class="inner">
      <div class="util_box active" v-if="this.$route.path == '/userIndex'" @click="$router.push('/userIndex')">
        <!-- <img src="@pro/index/user_icon.png" alt="" /> -->
        <div class="text">会员中心</div>
      </div>
      <div class="util_box" v-else @click="$router.push('/userIndex')">
        <!-- <img src="@pro/index/user_icon.png" alt="" /> -->
        <div class="text">会员中心</div>
      </div>

      <div class="util_box active" v-if="this.$route.path == '/myCart'" @click="$router.push('/myCart')">
        <!-- <img src="@pro/index/gwc_icon.png" alt="" /> -->
        <div class="text">购物车</div>
      </div>
      <div class="util_box" v-else @click="$router.push('/myCart')">
        <!-- <img src="@pro/index/gwc_icon.png" alt="" /> -->
        <div class="text">购物车</div>
      </div>

      <div class="util_box active" v-if="this.$route.path == '/zuji'" @click="$router.push('/zuji')">
        <!-- <img src="@pro/index/zuji_icon.png" alt="" /> -->
        <div class="text">历史足迹</div>
      </div>
      <div class="util_box" v-else @click="$router.push('/zuji')">
        <!-- <img src="@pro/index/zuji_icon.png" alt="" /> -->
        <div class="text">历史足迹</div>
      </div>

      <div class="util_box active" v-if="this.$route.path == '/shoucang'" @click="$router.push('/shoucang')">
        <!-- <img src="@pro/index/shouc_icon.png" alt="" /> -->
        <div class="text">我的收藏</div>
      </div>
      <div class="util_box" v-else @click="$router.push('/shoucang')">
        <!-- <img src="@pro/index/shouc_icon.png" alt="" /> -->
        <div class="text">我的收藏</div>
      </div>

      <div class="util_box active" v-if="this.$route.path == '/contactUs'" @click="$router.push('/contactUs')">
        <!-- <img src="@pro/index/xioaxi_ixon.png" alt="" /> -->
        <div class="text">我的建议</div>
      </div>
      <div class="util_box" v-else @click="$router.push('/contactUs')">
        <!-- <img src="@pro/index/xioaxi_ixon.png" alt="" /> -->
        <div class="text">我的建议</div>
      </div>
      <div class="util_box" @click="toTop">
        <!-- <img src="@pro/index/totop_icon.png" alt="" /> -->
        <div class="text">顶部</div>
      </div>

      <!-- <div class="user" @click="$router.push('/userIndex')">
        <img src="@pro/common/aside-user.png" alt="" />
        <div class="text">会员中心</div>
      </div>

      <div class="cart" @click="$router.push('/myCart')">
        <img src="@pro/common/aside-cart.png" alt="" />
        <div class="cart-text">购物车</div>
        <div class="cart-num">{{ vuex_cart_number }}</div>
      </div>

      <div class="shoucang" @click="$router.push('/shoucang')">
        <img src="@pro/common/aside-star.png" alt="" />
      </div>

      <div class="zuji" @click="$router.push('/zuji')">
        <img src="@pro/common/aside-zuji.png" alt="" />
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "aside-util",
  components: {},
  props: [],
  data() {
    return {
      hoverIndex: "",
      showToTop: false,
    };
  },
  computed: {
    ...mapState([""]),
  },

  methods: {
    toTop() {
      document.documentElement.scrollTop = 0;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.aside-util {
  position: fixed;
  z-index: 1000;
  bottom: 30px;
  right: 0;
  width: 60px;
  height: 360px;
  background: rgba(0, 0, 0, 0.6);

  .inner {
    width: 100%;
    .active {
      background: #f00;
    }
    .util_box {
      padding-top: 10px;
      width: 100%;
      height: 60px;
      cursor: pointer;
      border-bottom: 1px solid #fff;
      img {
        height: 21px;
        display: block;
        margin: 0 auto;
      }
      .text {
        font-size: 12px;

        font-weight: 500;
        margin-top: 5px;
        line-height: 17px;
        color: #ffffff;
      }
    }
  }
}
</style>
