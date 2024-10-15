<template>
  <div>
    <div class="banner-wrap">
      <img src="@/assets/img/chat-us/banner1.png" alt="" />
    </div>
    <div class="list-wrap">
      <div
        class="list-item"
        :class="{ active: activeIndex === index }"
        v-for="(item, index) in chatList"
        :key="index"
        @click="onClickChatItem(index)"
      >
        {{ item.text }}
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chatList: [
        {
          path: "/company-profile",
          text: "公司简介",
        },
        {
          path: "/company-news",
          text: "公司新闻",
        },
        {
          path: "/exhibition-information",
          text: "展会信息",
        },
        {
          path: "/contact-us",
          text: "联系我们",
        },
      ],
      activeIndex: -1,
    };
  },
  created() {
    const path = this.$route.path;
    this.activeIndex = this.chatList.findIndex((item) => item.path === path);
  },
  methods: {
    onClickChatItem(index) {
      this.activeIndex = index;
      this.$router.push({ path: this.chatList[index].path });
    },
  },
  watch: {
    $route(to, from) {
      const path = to.path;
      this.activeIndex = this.chatList.findIndex((item) => item.path === path);
    },
  }
};
</script>

<style lang="less" scoped>
.banner-wrap {
  width: 100%;
  height: 500px;
  img {
    width: 100%;
    height: 100%;
  }
}

.list-wrap {
  width: 100%;
  height: 80px;
  display: flex;
  gap: 86px;
  background-color: #f6f6f6;
  padding-left: 280px;
  .list-item {
    width: 81px;
    line-height: 81px;
    font-size: 18px;
    text-align: center;
    color: #333;
    cursor: pointer;
    &:hover {
      color: #27417c;
      border-bottom: 3px solid #27417c;
    }
    &.active {
      color: #27417c;
      border-bottom: 3px solid #27417c;
    }
  }
}
</style>
