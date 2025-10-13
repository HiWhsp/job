<template>
  <div class="app-container">
    <div class="top-bar">我的配置单{{ detail.product_title }}</div>

  </div>
</template>

<script>
export default {
  name: "h5rebotPreview",
  data() {
    return {
      id: this.$route.query.id,
      detail: {},
    };
  },
  mounted() {
    this.getRobotConfig();
  },
  methods: {
    getRobotConfig() {
      this.$api({
        url: "showProductSetting",
        method: "post",
        data: {
          id: this.id,
        },
      }).then((res) => {
        this.detail = res.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.app-container {
  width: 100vw;
  margin-top: -50px;
}
</style>
