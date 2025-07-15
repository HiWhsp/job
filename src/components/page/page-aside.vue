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
          <div class="item-inner" v-if="item.title != 'Customer Service'">
            <img :src="item.icon" alt="" />
            <div class="item-title">{{ item.title }}</div>
          </div>
          <template v-if="item.title == 'Customer Service'">
            <el-popover placement="right" trigger="hover">
              <div class="pop-kefu">
                <div class="pop-kefu-inner">
                  <div class="kefu-tip">Please scan the QR code below with WeChat</div>
                  <img
                    class="kefu-code"
                    :src="vuex_config.file_url_pre + vuex_config.kefu_qrcode"
                  />
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
            <img src="@/assets/image/home/to-top.png" alt="" />
            <div class="item-title">Back to Top</div>
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
          title: "Personal Center",
          icon: require("@/assets/image/home/aside-info.png"),
        },
        {
          title: "Customer Service",
          icon: require("@/assets/image/home/aside-kefu.png"),
        },
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

    on_click_util(item) {
      document.documentElement.scrollTop = 0;
      let title = item.title;
      if (title == "Personal Center") {
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
  right: 15px;
  top: 50%;

  .inner {
  }
}

// 工具列表
.list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .item {
    width: 84px;
    height: 92px;
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    box-sizing: border-box;
    border: 1px solid #f5f5f5;
    .item-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .item-title {
        margin-top: 6px;
        font-family: Microsoft YaHei;
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        text-align: center;
        letter-spacing: normal;
        color: #757575;
      }
    }

    &:nth-child(1) {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    &:nth-child(2) {
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    &:nth-child(3) {
      margin-top: 10px;
      border-radius: 12px;
      .item-title {
        color: #33ae60;
      }
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
      width: 120px;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/common/pageAside.less"></style>
