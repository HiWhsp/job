<template>
  <div class="cardList">
    <!-- 列表区域 -->
    <div class="reportListTitle">共找到 <span>1256</span> 个报告</div>
    <div class="item" v-for="(item, index) in displayedItems" :key="index">
      <div class="item-image">
        <img :src="item.image" alt="新闻图片" />
      </div>
      <div class="item-content">
        <div class="titleAndDes">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-description">{{ item.description }}</div>
        </div>
        <div class="item-meta">
          <span>{{ item.date }}</span>
          <span>{{ item.source }}</span>
          <el-tag type="info" v-for="tag in item.tags" :key="tag">{{ tag }}</el-tag>
        </div>
      </div>
    </div>

    <!-- 分页区域 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="totalItems"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "CardList",
  data() {
    return {
      items: [],
      currentPage: 1,
      pageSize: 5,
      totalItems: 0,
    };
  },
  computed: {
    displayedItems() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.items.slice(start, end);
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // 模拟接口获取数据
      setTimeout(() => {
        const mockData = [
          {
            image: require("@img/ellsenn/test.png"),
            title: "Quest平台VR内容总营收已超22亿美元",
            description:
              "根据wellsenn XR跟踪统计测算，截至2023年底，Meta Quest平台VR内容累计营收近22亿美元。",
            date: "2025-04-22",
            source: "维深 Wellsenn XR",
            tags: ["拆解", "VR", "快讯"],
          },
          {
            image: require("@img/ellsenn/test.png"),
            title: "Quest平台VR内容总营收已超22亿美元",
            description:
              "根据wellsenn XR跟踪统计测算，截至2023年底，Meta Quest平台VR内容累计营收近22亿美元。",
            date: "2025-04-22",
            source: "维深 Wellsenn XR",
            tags: ["拆解", "VR", "快讯"],
          },
          {
            image: require("@img/ellsenn/test.png"),
            title: "Quest平台VR内容总营收已超22亿美元",
            description:
              "根据wellsenn XR跟踪统计测算，截至2023年底，Meta Quest平台VR内容累计营收近22亿美元。",
            date: "2025-04-22",
            source: "维深 Wellsenn XR",
            tags: ["拆解", "VR", "快讯"],
          },
          {
            image: require("@img/ellsenn/test.png"),
            title: "Quest平台VR内容总营收已超22亿美元",
            description:
              "根据wellsenn XR跟踪统计测算，截至2023年底，Meta Quest平台VR内容累计营收近22亿美元。",
            date: "2025-04-22",
            source: "维深 Wellsenn XR",
            tags: ["拆解", "VR", "快讯"],
          },
          {
            image: require("@img/ellsenn/test.png"),
            title: "Quest平台VR内容总营收已超22亿美元",
            description:
              "根据wellsenn XR跟踪统计测算，截至2023年底，Meta Quest平台VR内容累计营收近22亿美元。",
            date: "2025-04-22",
            source: "维深 Wellsenn XR",
            tags: ["拆解", "VR", "快讯"],
          },
          {
            image: require("@img/ellsenn/test.png"),
            title: "Quest平台VR内容总营收已超22亿美元",
            description:
              "根据wellsenn XR跟踪统计测算，截至2023年底，Meta Quest平台VR内容累计营收近22亿美元。",
            date: "2025-04-22",
            source: "维深 Wellsenn XR",
            tags: ["拆解", "VR", "快讯"],
          },
          {
            image: require("@img/ellsenn/test.png"),
            title: "Quest平台VR内容总营收已超22亿美元",
            description:
              "根据wellsenn XR跟踪统计测算，截至2023年底，Meta Quest平台VR内容累计营收近22亿美元。",
            date: "2025-04-22",
            source: "维深 Wellsenn XR",
            tags: ["拆解", "VR", "快讯"],
          },
          {
            image: require("@img/ellsenn/test.png"),
            title: "Quest平台VR内容总营收已超22亿美元",
            description:
              "根据wellsenn XR跟踪统计测算，截至2023年底，Meta Quest平台VR内容累计营收近22亿美元。",
            date: "2025-04-22",
            source: "维深 Wellsenn XR",
            tags: ["拆解", "VR", "快讯"],
          },
          // 其他列表项...
        ];
        this.items = mockData;
        this.totalItems = mockData.length;
      }, 1000);
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>
<style scoped lang="less" src="./reportCardList.less"></style>
