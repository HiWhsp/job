<template>
  <div style="padding-bottom: 50px">
    <!--    操作区-->
    <div class="index-box-first-content flex">
      <div class="banner">
        <el-carousel height="100%">
          <el-carousel-item v-for="(it, i) in index_banners" :key="i">
            <img :src="it.image" alt="banner" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div class="card main">
      <div class="topMain">
        <div class="left">
          <div class="tit">HOT</div>
          <img alt="" src="@/static/home/HOT.png" />
        </div>
        <div class="right">
          <div class="tab">
            <div
              class="tab-item"
              :class="{ action: HOT_currentTab === 0 }"
              @click="switchHOTTab(0)"
            >
              推荐课程
            </div>
            <div
              class="tab-item"
              :class="{ action: HOT_currentTab === 1 }"
              @click="switchHOTTab(1)"
            >
              最热课程
            </div>
            <div
              class="tab-item"
              :class="{ action: HOT_currentTab === 2 }"
              @click="switchHOTTab(2)"
            >
              最新课程
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="course-grid" v-if="HOT_list.length">
          <div
            v-for="(course, index) in HOT_list"
            :key="index"
            class="course-card"
            style="background: #fff; box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.1)"
            @click="toProduct(course)"
          >
            <div class="course-img">
              <img :src="course.thumb" alt="" />
            </div>
            <div class="course-content">
              <div class="course-title ellipsis-2">{{ course.title }}</div>
            </div>
          </div>
        </div>
        <el-empty
          style="width: 100%"
          v-if="!HOT_list.length"
          description="暂无数据..."
        ></el-empty>
      </div>
    </div>

    <!--    最近学习-->
    <div class="card main">
      <div class="title">
        <h2>最近学习</h2>
        <img alt="" src="@/static/home/card-img.png" />
      </div>
      <div class="content">
        <div v-for="(item, index) in recent_list" :key="index" class="item">
          <div class="left">
            <div class="tit">
              <img
                v-if="item.course_info.course_type == 1"
                alt=""
                src="@/static/home/file3.png"
              />
              <img
                v-if="item.course_info.course_type == 2"
                alt=""
                src="@/static/home/file2.png"
              />
              <span>{{ item.course_info.title }}</span>
            </div>
            <div class="progress">
              <el-progress
                :format="format"
                :percentage="Number(item.course_schedule.split('%')[0]) || 0"
              ></el-progress>
            </div>
            <div class="desc">{{ item.course_info.description }}</div>
          </div>
          <div class="right" @click="toProduct(item)">继续学习</div>
        </div>
        <el-empty v-if="!recent_list.length" description="暂无数据..."></el-empty>
      </div>
    </div>

    <!--    部门课程-->
    <div class="card main">
      <div class="title">
        <h2>部门课程</h2>
        <img alt="" src="@/static/home/card-img.png" />
      </div>
      <div class="content">
        <!-- 标签栏 -->
        <div class="course-tabs">
          <div
            class="tab-item"
            :class="{ active: currentTab === 0 }"
            @click="switchTab(0)"
          >
            全部课程
          </div>
          <div
            v-for="(tab, index) in courseTabs"
            :key="index"
            :class="['tab-item', { active: currentTab === tab.id }]"
            @click="switchTab(tab.id)"
          >
            {{ tab.cat_name }}
          </div>
        </div>

        <!-- 课程卡片网格 -->
        <div class="course-grid">
          <div
            v-for="(course, index) in pdf_list"
            :key="index"
            class="course-card"
            @click="toProduct(course)"
          >
            <div class="course-img">
              <img :src="course.thumb" alt="" />
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

        <el-empty v-if="!pdf_list.length" description="暂无数据..."></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "index",
  data() {
    return {
      keyword: "",
      // 最近学习
      recent_list: [],
      // 文档类课程
      pdf_list: [],
      HOT_list: [],
      // 视频类课程
      video_list: [],
      // 部门课程标签
      courseTabs: [],
      currentTab: 0,
      HOT_currentTab: 0,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      index_banners: (state) => state.index_banners,
    }),
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      // 最近学习
      this.$api({
        url: "myRecentLearn",
        method: "get",
      }).then((res) => {
        this.recent_list = res.data;
      });
      // 分类
      this.$api({
        url: "getUserCourseCatLists",
        method: "get",
      }).then((res) => {
        this.courseTabs = res.data;
      });
      this.loadHOTCourses();
      this.loadAllCourses();
    },
    format(percentage) {
      return `已学习${percentage}%`;
    },
    toProduct(item) {
      const id = item.course_id || item.id;
      this.$router.push({
        path: "/course-detail?id=" + id,
      });
    },
    switchTab(index) {
      this.currentTab = index;
      this.loadAllCourses();
    },
    loadAllCourses() {
      // 文档类课程
      this.$api({
        url: "getNewCourseList",
        method: "get",
        data: {
          page: 1,
          limit: 8,
          course_cat_id: this.currentTab || "",
        },
      }).then((res) => {
        this.pdf_list = res.data.list;
      });
    },
    loadHOTCourses() {
      // HOT
      this.$api({
        url: "getNewCourseList",
        method: "get",
        data: {
          page: 1,
          limit: 8,
          isRecommend: this.HOT_currentTab === 0 ? 1 : "",
          isHot: this.HOT_currentTab === 1 ? 1 : "",
          isNew: this.HOT_currentTab === 2 ? 1 : "",
        },
      }).then((res) => {
        this.HOT_list = res.data.list;
      });
    },
    switchHOTTab(index) {
      this.HOT_currentTab = index;
      this.loadHOTCourses();
    },
  },
};
</script>

<style lang="less" scoped>
.el-carousel {
  height: 100%;
}

.main {
  width: 1200px;
  margin: 0 auto;
}

.index-box-first-content {
  // 轮播图
  .banner {
    width: 100%;
    height: 550px;
    border-radius: 4px 4px 4px 4px;
    background-color: #c4005b;

    img {
      width: 100%;
      height: 100%;
    }

    /deep/ .is-active {
      .el-carousel__button {
        background: #f8c268;
      }
    }

    /deep/ .el-carousel__button {
      width: 20px;
      height: 6px;
      background: #ffffff;
      border-radius: 0px 0px 0px 0px;
      opacity: 0.7;
    }
  }
}

.card {
  margin-top: 86px;

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 34px;
      color: #1c1f21;
      margin-bottom: 10px;
    }

    img {
      width: 375px;
      height: 12px;
    }
  }

  .content {
    margin-top: 60px;

    // 课程标签栏样式
    .course-tabs {
      display: flex;
      gap: 20px;
      margin-bottom: 40px;
      justify-content: center;

      .tab-item {
        padding: 10px 20px;
        cursor: pointer;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 14px;
        color: #666;
        transition: all 0.3s ease;

        &.active {
          background: #165e3d;
          color: #fff;
          border-color: #165e3d;
        }

        &:hover {
          background: #165e3d;
          color: #fff;
          border-color: #165e3d;
        }
      }
    }

    // 课程卡片网格样式
    .course-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 40px;

      .course-card {
        background: #f7f7f7;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .course-img {
          height: 180px;
          width: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }

        .course-content {
          font-size: 18px;
          color: #666;
          padding: 20px;
          .course-title {
            height: 48px;
          }

          .course-stats {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .study-hours {
              font-size: 12px;
              color: #999;
            }

            .student-count {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }

    .item {
      height: 161px;
      background: #f7f7f7;
      padding: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .left {
        width: 600px;

        .tit {
          display: flex;
          align-items: center;

          img {
            width: 24px;
            height: 24px;
          }

          span {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 18px;
            color: #1f253b;
            margin-left: 8px;
          }
        }

        .progress {
          display: flex;
          margin: 25px 0;

          .el-progress {
            width: 100%;
            display: flex;
            align-items: center;
          }

          /deep/ .el-progress__text {
            width: 100px;
            color: @theme !important;
          }

          /deep/ .el-progress-bar__inner {
            background-color: @theme;
          }
        }

        .desc {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #929aa2;
        }
      }

      .right {
        width: 142px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #ffffff;
        border: 1px solid #175e3d;
        cursor: pointer;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #175e3d;
      }
    }

    .item2 {
      display: flex;

      .left {
        padding: 50px;
        width: 516px;
        background: #f3fdf9;

        .tit {
          span {
            color: #929aa2;
            font-size: 14px;
            border-bottom: 1px solid @theme;
          }
        }

        .text {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 24px;
          color: #1f253b;
          margin: 20px 0;
        }

        .desc {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #929aa2;
        }

        .btn {
          cursor: pointer;
          color: #fff;
          font-size: 16px;
          text-align: center;
          line-height: 48px;
          width: 138px;
          height: 48px;
          background: #175e3d;
          margin-top: 75px;
        }
      }

      .right {
        width: 684px;

        .li-item {
          display: flex;
          padding: 29px 40px;
          height: 104px;
          background-color: #fff;
          cursor: pointer;

          &:hover {
            background: #f7f7f7;
          }

          img {
            width: 46px;
            height: 46px;
          }

          .info {
            margin-left: 26px;

            .text {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 18px;
              color: #000000;
            }

            .desc {
              width: 532px;
              margin-top: 4px;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 14px;
              color: #929aa2;
            }
          }
        }
      }
    }

    .item3 {
      display: flex;

      .left {
        width: 516px;

        img {
          width: 100%;
          height: 344px;
        }

        .info {
          background-color: #f7f7f7;
          height: 153px;
          padding: 25px;
        }

        .tit {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 22px;
          color: #000000;
        }

        .desc {
          margin-top: 12px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #929aa2;
          height: 60px;
        }
      }

      .right {
        width: 684px;

        .li-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 34px;
          margin-left: 40px;
          padding-bottom: 34px;
          border-bottom: 1px solid #ebebeb;

          &:first-child {
            margin-top: 0;
          }

          img {
            width: 162px;
            height: 108px;
          }

          .info {
            width: 390px;

            .text {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 18px;
              color: #000000;
            }

            .desc {
              margin-top: 10px;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 14px;
              color: #929aa2;
            }
          }
        }
      }
    }
  }
}

.topMain {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    .tit {
      font-weight: bold;
      font-size: 34px;
      color: #175e3d;
      line-height: 48px;
    }
    img {
      width: 41px;
      height: 11px;
    }
  }

  .right {
    .tab {
      display: flex;
      gap: 20px;
      .tab-item {
        cursor: pointer;
        font-size: 16px;
        color: #666;
        &.action {
          color: #175e3d;
          font-weight: bold;

          &::after {
            content: "";
            display: block;
            width: 100%;
            height: 2px;
            margin-top: 10px;
            background: #175e3d;
          }
        }
      }
    }
  }
}
</style>
