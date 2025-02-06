<template>
  <div class="aside-util">
    <div class="inner">
      <div class="user" @click="$router.push('/userIndex')">
        <!-- <img src="@pro/common/aside-user.png" alt="" /> -->
        <div class="text">账号</div>
      </div>

      <div class="cart" @click="$router.push('/myCart')">
        <!-- <img src="@pro/common/aside-cart.png" alt="" /> -->
        <div class="cart-text">购物车</div>
        <div class="cart-num">{{ shopcart_count }}</div>
      </div>

      <div class="shoucang" @click="$router.push('/shoucang')">
        <!-- <img src="@pro/common/aside-star.png" alt="" /> -->
      </div>

      <div class="zuji" @click="$router.push('/zuji')">
        <!-- <img src="@pro/common/aside-zuji.png" alt="" /> -->
      </div>
    </div>

    <div class="top-box" @click="toTop">
      <!-- <img src="@pro/common/aside-top.png" alt="" /> -->
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
    ...mapState(["shopcart_count"]),
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
  top: 0;
  right: 0;
  bottom: 0;
  width: 36px;
  background: #000;
  color: #fff;

  .flex-center();

  .top-box {
    position: absolute;
    bottom: 12px;
    right: 0;
    width: 36px;
    cursor: pointer;
    padding: 10px 0;

    &:hover {
      background: #bc223a;
    }

    img {
      width: 19px;
      height: 15px;
    }
  }

  .inner {
    width: 36px;
    .user {
      cursor: pointer;
      padding: 10px 0;
      img {
        width: 16px;
      }
      .text {
        margin-top: 5px;
        font-size: 12px;
      }

      &:hover {
        background: #bc223a;
      }
    }
    .cart {
      cursor: pointer;
      background: #bc223a;
      padding: 20px 0;

      img {
        width: 16px;
      }
      .cart-text {
        // margin: 10px 0;
        writing-mode: vertical-lr;
        width: 100%;
        line-height: 36px;
        font-size: 12px;
        padding: 10px 0;
        letter-spacing: 2px;
      }
      .cart-num {
        margin: 0 auto;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: #ffffff;
        border-radius: 50%;
        color: #bc223a;
      }

      &:hover {
        background: #bc223a;
      }
    }
    .shoucang {
      padding: 10px 0;
      cursor: pointer;
      // margin-top: 10px;
      img {
        width: 19px;
      }
      &:hover {
        background: #bc223a;
      }
    }
    .zuji {
      padding: 10px 0;
      cursor: pointer;
      // margin-top: 10px;
      img {
        width: 17px;
      }

      &:hover {
        background: #bc223a;
      }
    }
  }
}
</style>
