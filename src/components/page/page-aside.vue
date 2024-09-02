<template>
  <div class="aside">
    <div class="inner">
      <div class="list">
        <div class="item" v-if="showTop" @click="toTop()">
          <div class="item-inner">
            <img src="@img/to-top.png" alt="" />
          </div>
        </div>

        <!-- <div class="item" v-for="(item, index) in list_util" :key="index" @mouseenter="on_mouseenter(item)" @mouseleave="on_mouseleave(item)" @click="on_click_util(item)">
          <div class="item-inner" v-if="item.title != '客服'">
            <div class="cart-num" v-if="item.title == '购物车'">
              {{ shopcart_count }}
            </div>
            <img :src="item.icon" alt="" />
          </div>

          <template v-if="item.title == '客服'">
            <el-popover placement="right" trigger="hover">
              <div class="pop-kefu">
                <div class="pop-kefu-inner">
                  <div class="kefu-tip">请微信扫描下方二维码</div>
                  <img class="kefu-code" :src="webConfig.kefu_code" />
                </div>
              </div>

              <div class="item-inner" slot="reference">
                <img :src="item.icon" alt="" />
              </div>
            </el-popover>
          </template>
        </div> -->
      </div>
    </div>

    <div class="modal" v-show="hoverIndex == 2 || hoverIndex == 3">
      <template v-if="hoverIndex == 2">
        <div class="text-box">
          <div class="text">联系方式</div>
          <div class="phone">{{ "xxxxx" }}</div>
        </div>
      </template>
      <template v-if="hoverIndex == 3">
        <div class="img-box">
          <!-- <img :src="fixInfo.wechat" alt /> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "common-aside",
  components: {},
  props: [],
  data() {
    return {
      hoverIndex: "",
      list_util: [
        // { title: "购物车", icon: require("@img/other/aside-shopcart.png") },
        // { title: "客服", icon: require("@img/other/aside-kefu.png") },
        // { title: "收藏", icon: require("@img/other/aside-favourite.png") },
      ],

      showTop: false,
    };
  },
  computed: {
    ...mapState(["shopcart_count", "webConfig"]),
  },
  watch: {},

  mounted() {
    this.watchPageScroll();
  },

  methods: {
    watchPageScroll() {
      var that = this;
      if (document && document.documentElement) {
        document.addEventListener("scroll", that.scrollEvent);
      }
    },

    scrollEvent() {
      var that = this;
      var scrollTop = document.documentElement.scrollTop;
      var clientHeight = document.documentElement.clientHeight;

      if (scrollTop >= 400) {
        this.showTop = true;
      } else {
        this.showTop = false;
      }
      // //console.log("滚动监听", new Date(), scrollTop);
    },

    toTop() {
      document.documentElement.scrollTop = 0;
    },

    on_mouseenter(item) {
      //console.log("鼠标移入", item);
      this.hoverIndex = item;
    },
    on_mouseleave(item) {
      //console.log("鼠标移出", item);
      this.hoverIndex = "";
    },

    on_click_util(item) {
      //console.log("点击", item);

      document.documentElement.scrollTop = 0;

      return;

      let title = item.title;

      if (title == "回到顶部") {
        document.documentElement.scrollTop = 0;
      } else if (title == "购物车") {
        this.$router.push("/cart");
      }
      //  else if (title == "客服") {
      //   this.$router.push("/contact");
      // }
    },
  },
};
</script>

<style scoped lang="less">
.aside {
  z-index: 10000;
  position: fixed;
  right: 50px;
  bottom: 150px;

  // height: 151.45px;
  // height: 50px;
  background: #cccccc;
  border-radius: 0;

  .inner {
  }
}

// 工具列表
.list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .item {
    position: relative;
    cursor: pointer;
    .flex-center();
    // width: 50px;
    // height: 50px;
    // transition: 0.3s;

    width: 60px;
    height: 60px;
    background: #ffffff;
    box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.1);
    border-radius: 4px 4px 4px 4px;

    &:nth-child(1) {
      background: #ff9312;
    }
    &:nth-child(1) {
      background: #fff;
    }
    &:nth-child(2) {
      background: #ea5959;
    }
    &:nth-child(3) {
      background: #f13f17;
    }

    &:hover {
      opacity: 0.6;
    }

    img {
      height: 32px;
    }

    .cart-num {
      position: absolute;
      top: 0;
      right: 0;
      width: 19px;
      height: 19px;
      background: #ffffff;
      border: 1px solid #ff9312;
      border-radius: 50%;
      font-size: 10px;
      color: #ff9312;
    }
  }
}

// 弹窗
.modal {
  position: absolute;
  border: 1px solid #eee;
  top: 70px;
  right: 49px;
  width: 130px;
  height: 130px;
  background: #fff;
  padding: 7px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;

  img {
    width: 100%;
    height: 100%;
  }

  .text-box {
    font-size: 16px;
    .text {
    }
    .phone {
      margin-top: 30px;
    }
  }
}

// 联系客服
.pop-kefu {
  .pop-kefu-inner {
    text-align: center;
    .kefu-tip {
      text-align: center;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .kefu-code {
      width: 200px;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/common/pageAside.less"></style>
