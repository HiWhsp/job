<template>
  <div class="aside">
    <div class="list flex flex-between">
      <div class="item flex" v-for="(item, index) in list_util" :key="index" @mouseenter="on_mouseenter(index + 1)" @mouseleave="on_mouseleave">
        <img :src="item.icon" alt="">
        <p>{{ item.title }}</p>
      </div>
      <div class="item flex" v-if="showTop" @click="toTop()">
        <div class="item-inner flex">
          <img src="../../static/home/up-row.png" alt=""/>
          <p>顶部</p>
        </div>
      </div>
    </div>
    <div class="modal" v-show="hoverIndex == 1">
      <div class="qrcode"></div>
      <p>微信咨询 李先生</p>
    </div>

    <div class="pop-kefu" v-show="hoverIndex == 2">
      <p>业务咨询： </p>
      <p>13953657709 李先生</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "common-aside",
  components: {},
  props: [],
  data() {
    return {
      hoverIndex: "",
      list_util: [
        {title: "微信咨询", icon: require("../../static/home/wexin.png")},
        {title: "电话咨询", icon: require("../../static/home/dianhua.png")},
        {title: "在线咨询", icon: require("../../static/home/im.png")},
      ],

      showTop: false,
    };
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
  },
};
</script>

<style scoped lang="less">
.aside {
  z-index: 10000;
  position: fixed;
  right: 50px;
  bottom: 150px;
}

// 工具列表
.list {
  flex-direction: column;
  width: 63px;
  background: #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  padding: 0 5px;

  .item {
    position: relative;
    cursor: pointer;
    width: 60px;
    height: 62px;
    background: #ffffff;
    transition: 0.3s;
    flex-direction: column;
    justify-content: center;
    border-bottom: 1px solid #eee;;

    &:hover {
      opacity: 0.6;
    }

    img {
      height: 20px;
      width: 22px;
    }

  }
}

.item-inner {
  flex-direction: column;

  img {
    width: 13.52px !important;
    height: 7.39px !important;
    margin-bottom: 5px;
  }
}

// 弹窗
.modal {
  position: absolute;
  border: 1px solid #eee;
  top: -68px;
  right: 65px;
  width: 110px;
  height: 130px;
  background: #fff;
  padding: 10px;

  .qrcode {
    width: 87px;
    height: 85px;
    background: #333333;
    border-radius: 0px 0px 0px 0px;
  }

  p {
    font-size: 12px;
    color: #333333;
    margin-top: 10px;
  }
}

// 联系客服
.pop-kefu {
  position: absolute;
  top: 72px;
  right: 65px;
  background: #fff;
  padding: 7px;

  width: 132px;
  height: 52px;
  border-radius: 0px 0px 0px 0px;

  font-weight: 400;
  font-size: 12px;
  color: #333333;
  font-style: normal;
  text-transform: none;
  p:last-child {
    margin-top: 8px;
  }
}
</style>
