<template>
  <div class="page-container">
    <div class="search-bar">
      <div class="search-wrap">
        <el-input v-model="searchText" class="search-input" placeholder="输入关键字" />
        <el-button type="primary" @click="setView" @keyup.enter="setView">搜索</el-button>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- 课程目录 -->
      <div class="course-catalog">
        <div class="catalog-header">
          <h3>课程目录</h3>
        </div>

        <div class="catalog-content">
          <!-- 全部课程 -->
          <div
            class="catalog-item"
            :class="{ active: selectedCategory === 'all' }"
            @click="selectCategory('all')"
          >
            <span>全部课程</span>
          </div>

          <!-- 老师分类 -->
          <div class="catalog-section">
            <div class="section-header" @click="toggleSection('teacher')">
              <span>老师</span>
              <i
                class="el-icon-arrow-down"
                :class="{ 'is-reverse': openSections.teacher }"
              ></i>
            </div>
            <div class="section-content" v-show="openSections.teacher">
              <div
                class="catalog-item"
                :class="{ active: selectedCategory === 'doc' }"
                @click="selectCategory('doc')"
              >
                文员篇
              </div>
              <div
                class="catalog-item"
                :class="{ active: selectedCategory === 'driver' }"
                @click="selectCategory('driver')"
              >
                公务车驾驶员篇
              </div>
              <div
                class="catalog-item"
                :class="{ active: selectedCategory === 'admission' }"
                @click="selectCategory('admission')"
              >
                招生办人员篇
              </div>
              <div
                class="catalog-item"
                :class="{ active: selectedCategory === 'office' }"
                @click="selectCategory('office')"
              >
                办公室管理人员篇
              </div>
            </div>
          </div>

          <!-- 后勤 -->
          <div class="catalog-section">
            <div class="section-header" @click="toggleSection('logistics')">
              <span>后勤</span>
              <i class="el-icon-message" style="color: #ccc"></i>
            </div>
          </div>

          <!-- 行政 -->
          <div class="catalog-section">
            <div class="section-header" @click="toggleSection('admin')">
              <span>行政</span>
              <i class="el-icon-message" style="color: #ccc"></i>
            </div>
          </div>

          <!-- 人秘部 -->
          <div class="catalog-section">
            <div class="section-header" @click="toggleSection('hr')">
              <span>人秘部</span>
              <i class="el-icon-message" style="color: #ccc"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程内容区域 -->
      <div class="course-content">
        <!-- 学习状态筛选 -->
        <div class="status-filter">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="3">已学完</el-radio>
            <el-radio :label="1">未开始</el-radio>
            <el-radio :label="2">学习中</el-radio>
          </el-radio-group>
        </div>

        <!-- 统一的课程网格布局 -->
        <div class="course-grid" v-if="productList.length">
          <div
            v-for="(course, index) in productList"
            :key="index"
            class="course-card"
            @click="toUrl(course)"
          >
            <div class="course-img">
              <img :src="course.thumb_url || '/static/home/default-course.png'" alt="" />
            </div>
            <div class="course-content">
              <div class="course-title ellipsis-2">{{ course.title }}</div>
              <div class="course-stats">
                <span class="study-hours">课时: {{ course.learn_time || 3 }}</span>
                <span class="student-count">{{ course.studyNum || 512 }}人学习</span>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-if="productList.length === 0" description="暂无数据" />
      </div>
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
      selectedCategory: "all", // 选中的课程分类
      openSections: {
        // 控制课程目录的展开/收起
        teacher: true, // 默认展开老师分类
        logistics: false,
        admin: false,
        hr: false,
      },
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
      const requestData = {
        page: 1,
        limit: 10,
        course_type: this.activeTab,
        learn_type: this.status,
        keyword: this.searchText,
      };

      // 根据选中的分类添加过滤条件
      if (this.selectedCategory !== "all") {
        requestData.category = this.selectedCategory;
      }

      this.$api({
        url: "getCourseList",
        method: "get",
        data: requestData,
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
    selectCategory(category) {
      this.selectedCategory = category;
      this.setView(); // 根据选中的分类重新加载课程列表
    },
    toggleSection(section) {
      this.openSections[section] = !this.openSections[section];
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

  .content-wrapper {
    display: flex;
    margin-top: 42px;
    gap: 30px;
    align-items: flex-start;
  }

  .course-catalog {
    width: 220px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.1);
    flex-shrink: 0; // 防止被压缩

    .catalog-header {
      background: linear-gradient(135deg, #4a9b7e 0%, #6bb99d 100%);
      padding: 15px 20px;
      margin-bottom: 0;

      h3 {
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        margin: 0;
        padding: 0;
        border: none;
      }
    }

    .catalog-content {
      padding: 20px;
      background-color: #f5f5f5;

      .catalog-item {
        padding: 10px 0;
        cursor: pointer;
        font-size: 14px;
        color: #555;
        transition: color 0.3s ease;

        &:hover {
          color: #175e3d;
        }

        &.active {
          color: #175e3d;
          font-weight: bold;
        }
      }

      .catalog-section {
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 15px;

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-size: 15px;
          color: #333;
          font-weight: bold;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;

          .el-icon-arrow-down {
            transition: transform 0.3s ease;
          }

          .is-reverse {
            transform: rotate(180deg);
          }
        }

        .section-content {
          padding-top: 10px;
          .catalog-item {
            padding: 8px 0;
            font-size: 13px;
            color: #666;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
              color: #175e3d;
            }

            &.active {
              color: #175e3d;
              font-weight: bold;
            }
          }
        }
      }
    }
  }

  .course-content {
    flex: 1;
    min-width: 0; // 确保能够缩放
    display: flex;
    flex-direction: column;

    .status-filter {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;

      .el-radio-group {
        .el-radio {
          margin-right: 20px;
        }
      }
    }

    .course-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 40px;

      .course-card {
        background: linear-gradient(135deg, #4a9b7e 0%, #6bb99d 100%);
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
        overflow: hidden;
        box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.1);

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .course-img {
          height: 180px;
          width: 100%;
          position: relative;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .course-content {
          padding: 20px;
          color: #fff;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .course-title {
            font-weight: bold;
            font-size: 18px;
            color: #fff;
            line-height: 24px;
            margin-bottom: 20px;
            min-height: 48px;
          }

          .course-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);

            .study-hours {
              font-size: 14px;
            }

            .student-count {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
