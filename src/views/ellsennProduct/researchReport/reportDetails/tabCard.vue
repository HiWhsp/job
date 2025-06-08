<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="核心亮点" name="first">
        <verticalLineTitle tabTitle="核心亮点"> </verticalLineTitle>
        <div class="firstTab">{{ data.core_highlights }}</div>
      </el-tab-pane>
      <el-tab-pane label="研究方法" name="second">
        <verticalLineTitle tabTitle="研究方法"> </verticalLineTitle>
        <div class="firstTab">{{ data.research_method }}</div>
      </el-tab-pane>
      <el-tab-pane label="数据来源" name="third">
        <verticalLineTitle tabTitle="数据来源"> </verticalLineTitle>
        <div class="firstTab">{{ data.data_sources }}</div>
      </el-tab-pane>
      <el-tab-pane :label="`评论 (${data.commentNum})`" name="fourth">
        <make-comment></make-comment>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import verticalLineTitle from "@/components/ellsennComponents/components/verticalLineTitle.vue";
import makeComment from "@/components/ellsennComponents/components/makeComment/index.vue";
export default {
  components: {
    verticalLineTitle,
    makeComment,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  name: "tabCard",
  data() {
    return {
      activeName: "first",
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
<style scoped lang="less" src="./tabCard.less"></style>
