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
          <!-- 老师分类 -->
          <div
            class="catalog-section"
            v-for="(item, index) in courseCatList"
            :key="index"
          >
            <div
              class="section-header"
              @click="toggleSection(item.id)"
              :class="{
                active: selectedCategory === item.id || showSelect === item.id,
              }"
            >
              <span>{{ item.cat_name }}</span>
              <i
                class="el-icon-arrow-down"
                :class="{ 'is-reverse': showSelect === item.id }"
                v-if="item.child && item.child.length > 0"
              ></i>
            </div>
            <div
              class="section-content"
              v-show="item.child && item.child.length > 0 && showSelect === item.id"
            >
              <div
                v-for="(item2, index2) in item.child"
                :key="index2"
                class="catalog-item"
                :class="{ active: selectedCategory === item2.id }"
                @click="selectCategory(item2.id)"
              >
                {{ item2.cat_name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程内容区域 -->
      <div class="course-content">
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
      productList: [], // 课程列表
      selectedCategory: null, // 选中的课程分类
      showSelect: null,
      courseCatList: [], // 课程分类列表
    };
  },
  mounted() {
    this.$api({
      url: "getCourseCatLists",
      method: "get",
    }).then((res) => {
      if (res.code == 200) {
        this.courseCatList = res.data;
      }
    });
    this.setView();
  },
  methods: {
    setView() {
      const requestData = {
        page: 1,
        limit: 10,
        keyword: this.searchText,
        course_cat_id: this.selectedCategory,
      };

      this.$api({
        url: "getNewCourseList",
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
      if (this.selectedCategory === category) {
        this.selectedCategory = null;
      } else {
        this.selectedCategory = category;
      }
      this.setView(); // 根据选中的分类重新加载课程列表
    },
    toggleSection(id) {
      if (this.showSelect === id) {
        this.showSelect = null;
      } else {
        this.showSelect = id;
      }
      if (this.selectedCategory === id) {
        this.selectedCategory = null;
      } else {
        this.selectedCategory = id;
      }
      this.setView();
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
    gap: 42px;
    align-items: flex-start;
  }

  .course-catalog {
    width: 240px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.1);
    flex-shrink: 0; // 防止被压缩

    .catalog-header {
      background: #175e3d;
      padding: 15px 34px;
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
      padding: 18px 0;
      background: #f7f7f7;

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
        border-bottom: 1px solid #eee;

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-size: 16px;
          color: #333;
          padding: 13px 22px 13px 34px;
          &.active {
            background: #e2efe9;
            color: #175e3d;
            font-weight: bold;
          }

          .el-icon-arrow-down {
            transition: transform 0.3s ease;
          }

          .is-reverse {
            transform: rotate(180deg);
          }
        }

        .section-content {
          padding-left: 44px;
          .catalog-item {
            padding: 14px 0;
            font-size: 14px;
            color: #616161;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
              color: #175e3d;
            }

            &.active {
              color: #175e3d;
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

    .course-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 40px;

      .course-card {
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
        overflow: hidden;
        box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.1);
        background: #f7f7f7;
        width: 220px;
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .course-img {
          height: 140px;
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
          padding: 15px;
          color: #333333;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .course-title {
            font-size: 18px;
            color: #3d3d3d;
            line-height: 24px;
            margin-bottom: 20px;
            min-height: 48px;
          }

          .course-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            color: #8b8b8b;

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
