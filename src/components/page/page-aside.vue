<template>
  <div class="page-aside">
    <div
      v-for="item in asideItems"
      :key="item.key"
      class="aside-item"
      :class="[
        item.key === 'top' ? 'back-top' : '',
        item.key === 'top' && showBackTop ? 'is-show' : '',
      ]"
      v-show="item.key !== 'top' || showBackTop"
      @click="handleClick(item)"
    >
      <img :src="item.icon" :alt="item.label" />
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "page-aside",
  data() {
    return {
      showBackTop: false,
      asideItems: [
        {
          key: "consult",
          label: "产品咨询",
          icon: require("@img/other/aside1.png"),
          route: "/product-consult",
        },
        {
          key: "online",
          label: "在线留言",
          icon: require("@img/other/aside2.png"),
          route: "/online-message",
        },
        {
          key: "custom",
          label: "非标定制",
          icon: require("@img/other/aside3.png"),
          route: "/custom-order",
        },
        {
          key: "quick",
          label: "快速采购",
          icon: require("@img/other/aside4.png"),
          route: "/quick-buy",
        },
        {
          key: "top",
          label: "回到顶部",
          icon: require("@img/other/aside5.png"),
        },
      ],
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.showBackTop = window.scrollY > 200;
    },
    handleClick(item) {
      if (item.key === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (item.route) {
        this.$router.push(item.route);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.page-aside {
  position: fixed;
  right: 20px;
  bottom: 120px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);

  .aside-item {
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-bottom: 2px solid #F4F4F4;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    }

    img {
      width: 28px;
      height: 28px;
      margin-bottom: 10px;
    }

    span {
      font-size: 14px;
      color: #333;
    }

    &.back-top {
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.3s ease;

      &.is-show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
    }
  }
}
</style>
