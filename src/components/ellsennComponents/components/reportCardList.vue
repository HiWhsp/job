<template>
  <div class="cardList">
    <!-- 列表区域 -->
    <div class="reportListTitle">共找到 <span>{{ list.length }}</span> 个{{ title }}</div>
    <div class="item" v-for="(item, index) in list" :key="index" @click="handleClick(item)">
      <div class="item-image">
        <img :src="item.thumb" alt="新闻图片" />
      </div>
      <div class="item-content">
        <div class="titleAndDes">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-description">{{ item.info }}</div>
        </div>
        <div class="item-meta">
          <span>{{ item.created_time }}</span>
          <span>{{ item.author }}</span>
          <el-tag type="info" v-for="tag in item.tag" :key="tag">{{ tag }}</el-tag>
        </div>
      </div>
    </div>

    <!-- 分页区域 -->
    <el-pagination
      v-if="list.length > 0"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="limit"
      layout="prev, pager, next"
      :total="totalItems"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "CardList",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '报告',
    },
  },
  data() {
    return {
      items: [],
      currentPage: 1,
      limit: 10,
      totalItems: this.list.length,
    };
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val;
      this.$emit('change', this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit('change', this.currentPage);
    },
    handleClick(item) {
      this.$router.push({
        path: '/newsInsightsDetail',
        query: {
          id: item.id,
        },
      });
    },
  },
};
</script>
<style scoped lang="less" src="./reportCardList.less"></style>
