<template>
  <div class="page-container">
    <div class="search-bar">
      <div class="search-wrap">
        <el-input v-model="searchText" class="search-input" placeholder="输入关键字" />
        <el-button type="primary" @click="setView" @keyup.enter="setView">搜索</el-button>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="tab-bar">
        <div class="type-options">
          <div
            :class="{ active: activeTab === 0 }"
            class="tab-item"
            @click="activeTab = 0"
          >
            综合
          </div>
          <div
            :class="{ active: activeTab === 1 }"
            class="tab-item"
            @click="activeTab = 1"
          >
            文档类课程
          </div>
          <div
            :class="{ active: activeTab === 2 }"
            class="tab-item"
            @click="activeTab = 2"
          >
            视频类课程
          </div>
        </div>
        <div class="status-options">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="3">已学完</el-radio>
            <el-radio :label="1">未开始</el-radio>
            <el-radio :label="2">学习中</el-radio>
          </el-radio-group>
        </div>
      </div>

      <template v-for="item in productList">
        <div v-if="item.course_type === 1" class="course-list doc-list" :key="item.id">
          <div class="course-item" @click="toUrl(item)">
            <div class="course-box">
              <img class="icon" src="@/static/home/file3.png" />
              <div class="text">
                <div class="title">{{ item.title }}</div>
                <div class="desc ellipsis-1">{{ item.description }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="item.course_type === 2" class="video-list" :key="item.id">
          <div class="course-item" @click="toUrl(item)">
            <div class="course-box">
              <div class="text">
                <div class="title">
                  <img class="icon" src="@/static/home/file2.png" />
                  <span class="ellipsis-1">{{ item.title }}</span>
                </div>
                <div class="desc ellipsis-3">{{ item.description }}</div>
              </div>
              <img :src="item.thumb_url" class="image" />
            </div>
          </div>
        </div>
      </template>
      <el-empty v-if="productList.length === 0" description="暂无数据" />
    </div>
  </div>
</template>

<script>
export default {
  name: "course-list",
  data() {
    return {
      searchText: "", // 搜索词
      status: null, // 学习状态
      activeTab: 0, // 当前选中的tab 0全部 1文档 2视频
      productList: [], // 课程列表
    };
  },
  watch: {
    activeTab() {
      this.setView();
    },
    status() {
      this.setView();
    },
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "getCourseList",
        method: "get",
        data: {
          page: 1,
          limit: 10,
          course_type: this.activeTab,
          learn_type: this.status,
          keyword: this.searchText,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.productList = res.data.list;
        }
      });
    },
    toUrl(item) {
      this.$router.push({
        path: "/course-detail?id=" + item.id,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page-container {
  width: 1200px;
  min-height: 630px;
  margin: 0 auto;
  padding: 20px;

  .search-bar {
    display: flex;
    align-items: center;
    justify-content: center;

    .search-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 480px;
      height: 42px;
      background: #ffffff;
      border-radius: 8px 8px 8px 8px;
      border: 1px solid rgba(0, 0, 0, 0.14);

      .search-input {
        width: 350px;

        /deep/ .el-input__inner {
          height: 35px;
          border: none;
        }
      }

      .el-button {
        width: 88px;
        height: 36px;
        background: #175e3d;
        border-radius: 5px 5px 5px 5px;
        border: none;
        margin-right: 3px;
      }
    }
  }

  .tab-bar {
    margin-top: 42px;
    display: flex;
    justify-content: space-between;

    .type-options {
      display: flex;
      margin-bottom: 30px;

      .tab-item {
        cursor: pointer;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        margin-right: 40px;
        color: #1f253b;

        &:hover {
          color: #175e3d;
        }
      }

      .active {
        color: #175e3d;
        font-weight: bold;
      }
    }
  }

  .course-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .course-item {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      padding: 30px 40px;
      margin-bottom: 30px;
      width: 580px;
      height: 104px;
      background: #f7f7f7;

      .course-box {
        display: flex;

        .icon {
          width: 46px;
          height: 46px;
          margin-right: 26px;
        }

        .text {
          width: 420px;

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
    }
  }

  .video-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .course-item {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      padding: 30px 40px;
      width: 580px;
      height: 171px;
      background: #f7f7f7;
      border-radius: 0px 0px 0px 0px;

      .course-box {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .text {
          width: 310px;

          .title {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 18px;
            color: #000000;
            line-height: 20px;

            .icon {
              width: 20px;
              height: 20px;
              margin-right: 8px;
            }

            span {
              display: inline-block;
              width: 270px;
            }
          }

          .desc {
            height: 66px;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 14px;
            color: #929aa2;
            line-height: 22px;
          }
        }

        .image {
          width: 162px;
          height: 108px;
          border-radius: 0;
        }
      }
    }
  }
}
</style>
