<template>
  <div class="reportCard">
    <div class="cardCover">
      <img class="cardCoverImg" :src="dataItem.thumb" alt="" />
    </div>
    <div class="cardContent">
      <div class="cardContentRight">
        <div class="cardContentTitle ellipsis-2">{{ dataItem.title }}</div>
        <div class="cardContentStatus">{{ dataItem.copyright_type }}</div>
        <div class="cardContentTime">
          {{ dataItem.release_time }} {{ dataItem.copyright }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    dataItem: {
      type: Object,
      default: () => {},
    },
  },
  name: "reportCard",
  data() {
    return {
      statusEnum: { 0: "原创", 1: "网络", 2: "新闻" },
    };
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./card.less"></style>
