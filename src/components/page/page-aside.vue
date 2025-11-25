<template>
  <div class="aside">
    <div class="inner">
      <div class="list">
        <div
          class="item"
          v-for="(item, index) in list_util"
          :key="index"
          @mouseenter="on_mouseenter(item)"
          @mouseleave="on_mouseleave(item)"
          @click="on_click_util(item)"
        >
          <div class="item-inner" v-if="item.title != '微信'" @click="goUrl(item.path)">
            <img :src="item.icon" alt="" />
            <div class="item-title">{{ item.title }}</div>
          </div>
          <template v-if="item.title == '微信'">
            <el-popover placement="right" trigger="hover">
              <div class="pop-kefu">
                <div class="pop-kefu-inner">
                  <img
                    class="kefu-code"
                    :src="vuex_config.weixin_qr"
                  />
                  <div class="kefu-tip">扫一扫，咨询专业律师</div>
                </div>
              </div>

              <div class="item-inner" slot="reference">
                <img :src="item.icon" alt="" />
                <div class="item-title">{{ item.title }}</div>
              </div>
            </el-popover>
          </template>
        </div>
        <div class="item" v-if="showTop" @click="toTop()">
          <div class="item-inner">
            <img src="@/assets/img/common/to-top.png" alt="" />
            <div class="item-title">回顶部</div>
          </div>
        </div>
      </div>
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
        {
          title: "我的下载",
          icon: require("@/assets/img/common/down-icon.png"),
          path: "/my?tab=2",
        },
        {
          title: "微信",
          icon: require("@/assets/img/common/wechat-icon.png"),
        },
        // {
        //   title: "在线客服",
        //   icon: require("@/assets/img/common/aside-kefu.png"),
        //   path: "/",
        // },
      ],

      showTop: false,
    };
  },
  computed: {
    ...mapState([""]),
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
    goUrl(path) {
      this.$router.push(path);
    },

    on_click_util(item) {
      document.documentElement.scrollTop = 0;
      let title = item.title;
      if (title == "个人中心") {
        this.$router.push("/my-info");
      }
    },
  },
};
</script>

<style scoped lang="less">
.aside {
  z-index: 10000;
  position: fixed;
  right: 0px;
  top: 40%;
}

// 工具列表
.list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 79px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
  border-radius: 8px 8px 8px 8px;
  .item {
    height: 100px;
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid #e8e8e8;
    .item-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .item-title {
        margin-top: 10px;
        font-size: 14px;
        font-weight: normal;
        text-align: center;
        color: #7b7b7b;
      }
    }
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      opacity: 0.6;
    }

    img {
      height: 32px;
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
      width: 176px;
      height: 176px;
    }
  }
}
</style>
