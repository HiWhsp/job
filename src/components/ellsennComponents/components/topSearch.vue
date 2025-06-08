<template>
  <div class="topSearch">
    <div class="topSearchWrap">
      <div class="topSearchLeft">
        <div class="topSearchLogo">
          <img class="topSearchLogoImg" src="@img/ellsenn/logo.png" alt="" />
        </div>
        <div class="topSearchText">{{ title }}</div>
      </div>
      <div class="topSearchRight">
        <div class="topSearchRightSearch">
          <el-input
            class="topSearchRightSearchInput"
            v-model="input"
            placeholder="请输入关键词"
          >
          </el-input>
          <el-button
            class="topSearchRightSearchBtn"
            type="primary"
            @click="onBtnClick"
            >搜索</el-button
          >
        </div>
        <div class="tagGroup">
          <div class="tagGroupText">热门搜索：</div>

          <div class="tagItem" v-for="(item, index) in list" :key="index" @click="onTagClick(item)">
            {{ item }}
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
    /**
     * 热门搜索列表
     */
    list: {
      type: Array,
      default: () => [],
    },
    /**
     * 按钮触发事件
     */
    onClick: {
      type: Function,
      default: () => {},
    },
    /**
     * 标题
     */
    title: {
      type: String,
      default: '专注XR产业独立研究机构',
    },
  },
  name: 'topSearch',
  data() {
    return {
      input: '',
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 触发回调函数，将inputValue传递给父组件
    onBtnClick() {
      this.onClick(this.input);
    },
    onTagClick(item) {
      this.input = item;
      this.onBtnClick();
    },
  },
};
</script>
<style scoped lang="less" src="./topSearch.less"></style>
