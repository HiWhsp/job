<template>
  <div class="page-container">
    <div class="search-bar">
      <el-input placeholder="输入关键字" v-model="searchText" class="search-input" />
      <el-button type="primary">搜索</el-button>
      <div class="status-options">
        <el-radio-group v-model="status">
          <el-radio :label="'done'">已学完</el-radio>
          <el-radio :label="'not-started'">未开始</el-radio>
          <el-radio :label="'in-progress'">学习中</el-radio>
        </el-radio-group>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="tab-bar">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="综合" name="all" />
          <el-tab-pane label="文档类课程" name="doc" />
          <el-tab-pane label="视频类课程" name="video" />
        </el-tabs>
      </div>

      <div class="course-list">
        <div class="course-item" v-for="i in 10" :key="i">
          <div class="course-box">
            <img :src="getIcon(i)" class="icon" />
            <div class="text">
              <div class="title">师德师风建设，强化职业道德</div>
              <div class="desc">课程简介内容、课程简介内容、课程简介内容……</div>
            </div>
          </div>
          <div class="course-action">
            <el-button type="success" size="mini">教育技术学导论</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'course-list',
  data() {
    return {
      searchText: '',
      status: '',
      activeTab: 'all',
    };
  },
  methods: {
    getIcon(index) {
      const icons = [
        'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f4c4.png', // word
        'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f4d1.png', // pdf
        'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f4d6.png', // book
      ];
      return icons[index % icons.length];
    },
  },
};
</script>

<style lang="less" scoped>
.page-container {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .search-input {
      width: 300px;
      margin-right: 10px;
    }

    .status-options {
      margin-left: auto;
    }
  }

  .tab-bar {
    margin-bottom: 20px;
  }

  .course-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .course-item {
      width: 48%;
      display: flex;
      justify-content: space-between;
      background: #f9f9f9;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      .course-box {
        display: flex;

        .icon {
          width: 50px;
          height: 50px;
          margin-right: 15px;
        }

        .text {
          .title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
          }

          .desc {
            color: #888;
            font-size: 14px;
          }
        }
      }

      .course-action {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
