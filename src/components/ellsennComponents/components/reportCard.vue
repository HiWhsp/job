<template>
  <div class="layout">
    <div class="left">
      <img class="left-img" :src="data.thumb" alt="" />
    </div>
    <div class="right">
      <div class="title">{{ data.title }}</div>
      <div class="sub">{{ data.info }}</div>
      <div class="right-bottom">
        <div class="right-bottom-info">
          <div class="right-bottom-info-status">{{ data.copyright_type }}</div>
          <div class="right-bottom-info-item">{{ data.release_time }}</div>
          <div class="right-bottom-info-item">{{ data.author }}</div>
          <div class="right-bottom-info-item">{{ data.category_name }}</div>
        </div>
        <div class="right-bottom-btn-group">
          <div class="right-bottom-btn right-bottom-btn-download">
            下载 <img src="@img/ellsenn/pdf.png" alt="" @click="onDownloadClick('pdf')" />
            <img src="@img/ellsenn/word.png" alt="" @click="onDownloadClick('word')" />
          </div>
          <div
            class="right-bottom-btn right-bottom-btn-primary"
            @click="onBtnClick"
          >
            在线阅读
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  name: "reportCard",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    onBtnClick() {
      this.$router.push({
        path: "/reportDetails",
        query: {
          id: this.data.id,
        },
      });
    },
    onDownloadClick(type) {
      window.open(this.data[type + '_file'], '_blank');
    },
  },
};
</script>
<style scoped lang="less" src="./reportCard.less"></style>
