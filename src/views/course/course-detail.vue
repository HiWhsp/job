<template>
  <div class="course-detail-page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/course-list' }">全部课程</el-breadcrumb-item>
        <el-breadcrumb-item>{{ detail.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page">
      <div class="main-content">
        <!-- 课程头部信息 -->
        <div v-if="type === 'doc'" class="course-header">
          <div class="title">
            <img src="@/static/home/file3.png" />
            <span>{{ detail.title }}</span>
          </div>
          <div class="action">
            <div class="info">
              <span>课时：{{ detail.learn_time }}</span>
              <span>发布时间：{{ detail.created_at }}</span>
            </div>
            <div class="actions">
              <div class="share pointer" @click="collect">
                <img
                  v-if="detail.is_collect === 0"
                  alt=""
                  src="@/static/common/share0.png"
                />
                <img
                  v-if="detail.is_collect === 1"
                  alt=""
                  src="@/static/common/share1.png"
                />
                <span>收藏</span>
              </div>
              <el-button type="primary" @click="startLearn">开始学习 </el-button>
            </div>
          </div>
        </div>

        <div v-if="type === 'video'" class="course-header2">
          <img :src="detail.thumb_url" alt="" class="left" />
          <div class="right">
            <div class="title">
              <img src="@/static/home/file2.png" />
              <span>{{ detail.title }}</span>
            </div>
            <div class="action">
              <div class="info">
                <span>课时：{{ tableData.length }}</span>
                <span>发布时间：{{ detail.created_at }}</span>
              </div>
              <div class="actions">
                <div class="share pointer" @click="collect">
                  <img
                    v-if="detail.is_collect === 0"
                    alt=""
                    src="@/static/common/share0.png"
                  />
                  <img
                    v-if="detail.is_collect === 1"
                    alt=""
                    src="@/static/common/share1.png"
                  />
                  <span>收藏</span>
                </div>
                <el-button type="primary" @click="startLearn">开始学习 </el-button>
              </div>
            </div>
          </div>
        </div>
        <!-- 左侧主体 -->
        <div class="main-left">
          <!-- 标签页 -->
          <el-tabs value="intro">
            <el-tab-pane label="课程介绍" name="intro">
              <div class="section">
                <h3>课程介绍</h3>
                <div v-html="detail.content"></div>
              </div>
              <!-- 文档类型 -->
              <div v-if="type === 'doc'" class="section">
                <h3>目录</h3>
                <div class="tab-text">
                  <div class="tab-item1">目录</div>
                  <div class="tab-item3">进度</div>
                  <div class="tab-item4">操作</div>
                </div>
                <el-collapse accordion>
                  <el-collapse-item
                    v-for="(item, index) in tableData"
                    :key="index"
                    :name="index.toString()"
                  >
                    <template slot="title">
                      <div class="index-collapse">{{ item.title }}</div>
                      <div class="progress-collapse">
                        {{
                          item.my_course_record ? item.my_course_record.schedule || 0 : 0
                        }}%
                      </div>
                      <div class="action-collapse">
                        <span @click="toUrl(item, index)">学习</span>
                        <span>考试</span>
                      </div>
                    </template>
                    <div
                      v-if="Object.keys(item.test_question || {}).length"
                      class="catalog-detail"
                    >
                      <div class="title">
                        <p>{{ item.test_question.title }}</p>
                        <div class="start">{{ status(item) }}</div>
                      </div>
                      <div class="catalog-wrap">
                        <div class="item">
                          <span>考试次数：</span
                          ><span>{{ item.test_question.can_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>已考次数：</span
                          ><span>{{ item.test_question.has_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>剩余次数：</span
                          ><span>{{ item.test_question.limit_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>考试总分：</span
                          ><span>{{ item.test_question.total_point }}分</span>
                        </div>
                        <div class="item">
                          <span>考试时长：</span
                          ><span>{{ item.test_question.test_time }}分钟</span>
                        </div>
                      </div>
                      <div class="action">
                        <p>
                          考试起止时间：{{ item.test_question.start_time }} 到
                          {{ item.test_question.end_time }}
                        </p>
                        <el-button
                          type="primary"
                          @click="
                            goUrl({
                              url: '/my-exam-start',
                              query: {
                                id: item.my_test_question_primary_key,
                                question_id: item.test_question_id,
                                course_id: item.course_id,
                                course_list_id: item.id,
                              },
                            })
                          "
                          >开始考试
                        </el-button>
                      </div>
                    </div>
                    <el-empty v-else description="暂无考试内容..."></el-empty>
                  </el-collapse-item>
                </el-collapse>
              </div>

              <!-- 视频类型 -->
              <div v-if="type === 'video'" class="section">
                <h3>目录</h3>
                <div class="tab-text">
                  <div class="tab-item1">目录</div>
                  <div class="tab-item2">时长</div>
                  <div class="tab-item3">进度</div>
                  <div class="tab-item4">操作</div>
                </div>
                <el-collapse accordion>
                  <el-collapse-item
                    v-for="(item, index) in tableData"
                    :key="index"
                    :name="index.toString()"
                  >
                    <template slot="title">
                      <div class="index-collapse">{{ item.title }}</div>
                      <div class="video-time">
                        <img alt="" src="@/static/common/video.png" />
                        <span class="ellipsis-1">{{ item.learn_time }}</span>
                      </div>
                      <div class="progress-collapse">
                        {{
                          item.my_course_record ? item.my_course_record.schedule || 0 : 0
                        }}%
                      </div>
                      <div class="action-collapse">
                        <span @click="toUrl(item, index)">学习</span><span>考试</span>
                      </div>
                    </template>
                    <div
                      v-if="Object.keys(item.test_question || {}).length"
                      class="catalog-detail"
                    >
                      <div class="title">
                        <p>{{ item.test_question.title }}</p>
                        <div class="start">{{ status(item) }}</div>
                      </div>
                      <div class="catalog-wrap">
                        <div class="item">
                          <span>考试次数：</span
                          ><span>{{ item.test_question.can_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>已考次数：</span
                          ><span>{{ item.test_question.has_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>剩余次数：</span
                          ><span>{{ item.test_question.limit_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>考试总分：</span
                          ><span>{{ item.test_question.total_point }}分</span>
                        </div>
                        <div class="item">
                          <span>考试时长：</span
                          ><span>{{ item.test_question.test_time }}分钟</span>
                        </div>
                      </div>
                      <div class="action">
                        <p>
                          考试起止时间：{{ item.test_question.start_time }} 到
                          {{ item.test_question.end_time }}
                        </p>
                        <el-button
                          type="primary"
                          @click="
                            goUrl({
                              url: '/my-exam-start',
                              query: {
                                id: item.my_test_question_primary_key,
                                question_id: item.test_question_id,
                                course_id: item.course_id,
                                course_list_id: item.id,
                              },
                            })
                          "
                          >开始考试
                        </el-button>
                      </div>
                    </div>
                    <el-empty v-else description="暂无考试内容..."></el-empty>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <!-- 关联考试 -->
              <div
                v-for="(item, index) in detail.test_question_list"
                :key="index"
                class="section"
              >
                <h3>{{ item.title }}</h3>
                <div class="catalog-list">
                  <div class="title">
                    <p>{{ item.title }}</p>
                    <div class="start">{{ status(item) }}</div>
                  </div>
                  <div class="catalog-wrap">
                    <div class="item">
                      <span>考试次数：</span><span>{{ item.can_test_num }}次</span>
                    </div>
                    <div class="item">
                      <span>已考次数：</span><span>{{ item.has_test_num }}次</span>
                    </div>
                    <div class="item">
                      <span>剩余次数：</span><span>{{ item.limit_test_num }}次</span>
                    </div>
                    <div class="item">
                      <span>考试总分：</span><span>{{ item.total_point }}分</span>
                    </div>
                    <div class="item">
                      <span>考试时长：</span><span>{{ item.test_time }}分钟</span>
                    </div>
                  </div>
                  <div class="action">
                    <p>考试起止时间：{{ item.start_time }} 到 {{ item.end_time }}</p>
                    <el-button
                      type="primary"
                      @click="
                        goUrl({
                          url: '/my-exam-start',
                          query: {
                            question_id: item.id,
                            course_id: detail.id,
                            id: item.my_test_question_primary_key,
                          },
                        })
                      "
                      >开始考试
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="目录" name="catalog">
              <div v-if="type === 'doc'" class="section">
                <h3>目录</h3>
                <div class="tab-text">
                  <div class="tab-item1">目录</div>
                  <div class="tab-item3">进度</div>
                  <div class="tab-item4">操作</div>
                </div>
                <el-collapse accordion>
                  <el-collapse-item
                    v-for="(item, index) in tableData"
                    :key="index"
                    :name="index.toString()"
                  >
                    <template slot="title">
                      <div class="index-collapse">{{ item.title }}</div>
                      <div class="progress-collapse">
                        {{
                          item.my_course_record ? item.my_course_record.schedule || 0 : 0
                        }}%
                      </div>
                      <div class="action-collapse">
                        <span @click="toUrl(item, index)">学习</span>
                        <span>考试</span>
                      </div>
                    </template>
                    <div
                      v-if="Object.keys(item.test_question || {}).length"
                      class="catalog-detail"
                    >
                      <div class="title">
                        <p>{{ item.test_question.title }}</p>
                        <div class="start">{{ status(item) }}</div>
                      </div>
                      <div class="catalog-wrap">
                        <div class="item">
                          <span>考试次数：</span
                          ><span>{{ item.test_question.can_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>已考次数：</span
                          ><span>{{ item.test_question.has_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>剩余次数：</span
                          ><span>{{ item.test_question.limit_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>考试总分：</span
                          ><span>{{ item.test_question.total_point }}分</span>
                        </div>
                        <div class="item">
                          <span>考试时长：</span
                          ><span>{{ item.test_question.test_time }}分钟</span>
                        </div>
                      </div>
                      <div class="action">
                        <p>
                          考试起止时间：{{ item.test_question.start_time }} 到
                          {{ item.test_question.end_time }}
                        </p>
                        <el-button
                          type="primary"
                          @click="
                            goUrl({
                              url: '/my-exam-start',
                              query: {
                                id: item.my_test_question_primary_key,
                                question_id: item.test_question_id,
                                course_id: id,
                                course_list_id: item.id,
                              },
                            })
                          "
                          >开始考试
                        </el-button>
                      </div>
                    </div>
                    <el-empty v-else description="暂无考试内容..."></el-empty>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-if="type === 'video'" class="section">
                <h3>目录</h3>
                <div class="tab-text">
                  <div class="tab-item1">目录</div>
                  <div class="tab-item2">时长</div>
                  <div class="tab-item3">进度</div>
                  <div class="tab-item4">操作</div>
                </div>
                <el-collapse accordion>
                  <el-collapse-item
                    v-for="(item, index) in tableData"
                    :key="index"
                    :name="index.toString()"
                  >
                    <template slot="title">
                      <div class="index-collapse">{{ item.title }}</div>
                      <div class="video-time">
                        <img alt="" src="@/static/common/video.png" />
                        <span class="ellipsis-1">{{ item.learn_time }}</span>
                      </div>
                      <div class="progress-collapse">
                        {{
                          item.my_course_record ? item.my_course_record.schedule || 0 : 0
                        }}%
                      </div>
                      <div class="action-collapse">
                        <span @click="toUrl(item, index)">学习</span><span>考试</span>
                      </div>
                    </template>
                    <div
                      v-if="Object.keys(item.test_question || {}).length"
                      class="catalog-detail"
                    >
                      <div class="title">
                        <p>{{ item.test_question.title }}</p>
                        <div class="start">{{ status(item) }}</div>
                      </div>
                      <div class="catalog-wrap">
                        <div class="item">
                          <span>考试次数：</span
                          ><span>{{ item.test_question.can_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>已考次数：</span
                          ><span>{{ item.test_question.has_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>剩余次数：</span
                          ><span>{{ item.test_question.limit_test_num }}次</span>
                        </div>
                        <div class="item">
                          <span>考试总分：</span
                          ><span>{{ item.test_question.total_point }}分</span>
                        </div>
                        <div class="item">
                          <span>考试时长：</span
                          ><span>{{ item.test_question.test_time }}分钟</span>
                        </div>
                      </div>
                      <div class="action">
                        <p>
                          考试起止时间：{{ item.test_question.start_time }} 到
                          {{ item.test_question.end_time }}
                        </p>
                        <el-button
                          type="primary"
                          @click="
                            goUrl({
                              url: '/my-exam-start',
                              query: {
                                id: item.my_test_question_primary_key,
                                question_id: item.test_question_id,
                                course_id: item.course_id,
                                course_list_id: item.id,
                              },
                            })
                          "
                          >开始考试
                        </el-button>
                      </div>
                    </div>
                    <el-empty v-else description="暂无考试内容..."></el-empty>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-tab-pane>
            <el-tab-pane label="关联考试" name="exam">
              <div
                v-for="(item, index) in detail.test_question_list"
                :key="index"
                class="section"
              >
                <h3>{{ item.title }}</h3>
                <div class="catalog-list">
                  <div class="title">
                    <p>{{ item.title }}</p>
                    <div class="start">{{ status(item) }}</div>
                  </div>
                  <div class="catalog-wrap">
                    <div class="item">
                      <span>考试次数：</span><span>{{ item.can_test_num }}次</span>
                    </div>
                    <div class="item">
                      <span>已考次数：</span><span>{{ item.has_test_num }}次</span>
                    </div>
                    <div class="item">
                      <span>剩余次数：</span><span>{{ item.limit_test_num }}次</span>
                    </div>
                    <div class="item">
                      <span>考试总分：</span><span>{{ item.total_point }}分</span>
                    </div>
                    <div class="item">
                      <span>考试时长：</span><span>{{ item.test_time }}分钟</span>
                    </div>
                  </div>
                  <div class="action">
                    <p>考试起止时间：{{ item.start_time }} 到 {{ item.end_time }}</p>
                    <el-button
                      type="primary"
                      @click="
                        goUrl({
                          url: '/my-exam-start',
                          query: {
                            question_id: item.id,
                            course_id: detail.id,
                            id: item.my_test_question_primary_key,
                          },
                        })
                      "
                      >开始考试
                    </el-button>
                  </div>
                </div>
              </div>
              <el-empty
                v-if="detail.test_question_list && detail.test_question_list.length === 0"
                description="暂无关联考试..."
              ></el-empty>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 右侧推荐课程 -->
      <div class="main-right">
        <div class="recommend-header">
          <img alt="" src="@/static/account/tuijian.png" />
          <span>推荐课程</span>
        </div>
        <div class="recommend-list">
          <div
            v-for="(item, index) in hotList"
            :key="index"
            class="recommend-item pointer"
            @click="goUrl({ url: '/course-detail', query: { id: item.id } })"
          >
            <div class="title">
              <img v-if="item.course_type === 1" alt="" src="@/static/home/file3.png" />
              <img v-if="item.course_type === 2" alt="" src="@/static/home/file2.png" />
              <span class="ellipsis-1">{{ item.title }}</span>
            </div>
            <div class="date">{{ item.created_at }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "course-detail",
  data() {
    return {
      id: "", // 课程id
      type: "video", // 课程类型
      detail: {}, // 课程详情
      tableData: [], // 课程目录
      hotList: [], // 热门课程
    };
  },
  watch: {
    "$route.query.id"() {
      this.id = this.$route.query.id;
      this.setView();
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.setView();
  },
  methods: {
    status(item) {
      // 根据当前时间判断是否开始结束 取值 item.start_time 和 item.end_time / 或者 item.test_question.start_time 和 item.test_question.end_time
      const now = new Date();
      const start_time = new Date(item.start_time || item.test_question.start_time);
      const end_time = new Date(item.end_time || item.test_question.end_time);
      if (now >= start_time && now <= end_time) {
        return "进行中";
      }
      if (now < start_time) {
        return "未开始";
      }
      if (now > end_time) {
        return "已结束";
      }
    },

    setView() {
      this.$api({
        url: "getNewCourse",
        method: "get",
        data: {
          id: this.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.detail = res.data;
          this.type = res.data.course_type === 2 ? "video" : "doc";
          this.tableData = res.data.course_list;
        }
      });
      this.$api({
        url: "getCourseList",
        method: "get",
        data: {
          page: 1,
          limit: 5,
          course_type: 0,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.hotList = res.data.list;
        }
      });
    },
    // 收藏
    collect() {
      this.$api({
        url: "addCollect",
        method: "post",
        data: {
          course_id: this.id,
          status: this.detail.is_collect === 0 ? 1 : 2,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.detail.is_collect = this.detail.is_collect === 0 ? 1 : 0;
        }
      });
    },
    // 开始学习
    startLearn() {
      this.$api({
        url: "addMyCourses",
        method: "post",
        data: {
          course_id: this.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("已加入学习队列");
        }
      });
    },
    goUrl(item) {
      this.$router.push({
        path: item.url,
        query: item.query,
      });
    },
    toUrl(item, index) {
      if (
        ["pdf", "doc", "docx", "xls", "xlsx"].includes(
          item.file_path_url.split(".").pop()
        )
      ) {
        this.goUrl({
          url: "/pdf-viewer",
          query: { id: this.id, index },
        });
      } else {
        this.goUrl({
          url: "/video-viewer",
          query: { id: this.id, index },
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.course-detail-page {
  background-color: #f5f6f6;
  padding-bottom: 60px;

  .nav-bar {
    width: 1200px;
    margin: 0 auto;
    padding: 16px 0;
  }

  .page {
    width: 1200px;
    margin: 0 auto;
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .course-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
    width: 904px;
    height: 158px;
    background: #ffffff;

    .title {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: bold;

      img {
        width: 24px;
        margin-right: 10px;
      }
    }

    .action {
      display: flex;
      justify-content: space-between;
      align-items: end;
    }

    .info {
      font-size: 12px;
      color: #4e5969;

      span {
        margin-right: 10px;
      }
    }

    .actions {
      display: flex;
      align-items: center;

      .share {
        display: flex;
        align-items: center;

        img {
          width: 18px;
          height: 18px;
        }

        span {
          margin-left: 8px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #696d80;
        }
      }

      .el-button {
        margin-left: 10px;
        width: 94px;
        height: 34px;
        background: #175e3d;
        border-radius: 8px;
        border: none;
      }
    }
  }

  .course-header2 {
    display: flex;
    flex-direction: row;
    padding: 40px;
    width: 904px;
    height: 232px;
    background: #ffffff;

    .left {
      width: 264px;
      height: 149px;
      margin-right: 24px;
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: bold;

        img {
          width: 24px;
          margin-right: 10px;
        }
      }

      .action {
        display: flex;
        justify-content: space-between;
        align-items: end;
      }

      .info {
        font-size: 12px;
        color: #4e5969;

        span {
          margin-right: 10px;
        }
      }

      .actions {
        display: flex;
        align-items: center;

        .share {
          display: flex;
          align-items: center;

          img {
            width: 18px;
            height: 18px;
          }

          span {
            margin-left: 8px;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 16px;
            color: #696d80;
          }
        }

        .el-button {
          margin-left: 10px;
          width: 94px;
          height: 34px;
          background: #175e3d;
          border-radius: 8px;
          border: none;
        }
      }
    }
  }

  .main-content {
    display: flex;
    flex-direction: column;

    .main-left {
      margin-top: 20px;
      width: 904px;
      padding: 40px;
      background-color: #fff;

      /deep/ .el-tabs__item.is-active {
        color: @theme;
      }

      /deep/ .el-tabs__item:hover {
        color: @theme;
      }

      /deep/ .el-tabs__nav-wrap::after {
        background-color: transparent;
      }

      /deep/ .el-tabs__active-bar {
        background-color: @theme;
      }

      /deep/ .el-collapse-item__arrow {
        margin: 0 20px 0 0;
      }

      /deep/ .el-collapse {
        border-top: none;
      }

      .section {
        margin-bottom: 30px;

        .tab-text {
          display: flex;
          width: 822px;
          height: 68px;
          line-height: 68px;
          background: #f5f6f6;
          border-radius: 8px 8px 8px 8px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #77798d;
          padding: 0 21px;

          .tab-item1 {
            width: 420px;
          }

          .tab-item2 {
            width: 170px;
          }

          .tab-item3 {
            width: 170px;
            text-align: center;
          }

          .tab-item4 {
            width: 110px;
          }
        }

        h3 {
          position: relative;
          font-size: 18px;
          margin-bottom: 10px;
          padding-left: 10px;

          &:before {
            content: "";
            display: block;
            width: 3px;
            height: 18px;
            background: #175e3d;
            border-radius: 60px 60px 60px 60px;
            position: absolute;
            top: 5px;
            left: 0;
          }
        }

        .exam-card {
          background: #f6f9f6;
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
        }

        .catalog-detail {
          width: 730px;
          height: 169px;
          background: #f5f6f6;
          margin-left: 100px;
          padding: 25px;

          .title {
            display: flex;

            p {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 16px;
              color: #000825;
              margin-right: 8px;
            }

            .start {
              width: 52px;
              height: 21px;
              text-align: center;
              line-height: 21px;
              background-image: url("../../static/common/start.png");
              background-repeat: no-repeat;
              background-size: 100% 100%;

              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 12px;
              color: #ffffff;
            }
          }

          .catalog-wrap {
            display: flex;
            flex-wrap: wrap;
            margin-top: 18px;

            .item {
              width: 180px;

              span {
                font-family: Microsoft YaHei, Microsoft YaHei;
                font-weight: 400;
                font-size: 12px;
                color: #000825;
              }

              span:last-child {
                color: #175e3d;
              }
            }
          }

          .action {
            display: flex;
            align-items: end;
            justify-content: space-between;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #666666;

            .el-button {
              width: 122px;
              height: 31px;
              background: #175e3d;
              border-radius: 223px 223px 223px 223px;
              border: none;
              padding: 0;
              line-height: 31px;
            }
          }
        }

        .catalog-list {
          height: 150px;
          padding-bottom: 25px;
          border-bottom: 1px solid #e6e6e6;

          .title {
            display: flex;

            p {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 18px;
              color: #000825;
              margin-right: 8px;
            }

            .start {
              width: 60px;
              height: 25px;
              text-align: center;
              line-height: 25px;
              background-image: url("../../static/common/start.png");
              background-repeat: no-repeat;
              background-size: 100% 100%;

              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 12px;
              color: #ffffff;
            }
          }

          .catalog-wrap {
            display: flex;
            flex-wrap: wrap;

            .item {
              width: 240px;
              line-height: 30px;

              span {
                font-family: Microsoft YaHei, Microsoft YaHei;
                font-weight: 400;
                font-size: 12px;
                color: #000825;
              }

              span:last-child {
                color: #175e3d;
              }
            }
          }

          .action {
            display: flex;
            align-items: end;
            justify-content: space-between;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 14px;
            color: #666666;

            .el-button {
              width: 158px;
              height: 41px;
              background: #175e3d;
              border-radius: 223px 223px 223px 223px;
              border: none;
              padding: 0;
              line-height: 41px;
            }
          }
        }
      }

      .video-time {
        width: 170px;
        display: flex;
        align-items: center;

        img {
          width: 20px;
          height: 20px;
        }

        span {
          margin-left: 6px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
          height: 20px;
          line-height: 20px;
        }
      }

      .index-collapse {
        width: 445px;
      }

      .progress-collapse {
        width: 170px;
        text-align: center;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
      }

      .action-collapse {
        width: 100px;
        display: flex;
        justify-content: space-between;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: @theme;
      }
    }
  }

  .main-right {
    width: 276px;
    background: #ffffff;

    .recommend-header {
      height: 60px;
      display: flex;
      align-items: center;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #3d3d3d;
      padding-left: 20px;
      border-bottom: 1px dashed #d8d8d8;

      img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }
    }

    .recommend-item {
      margin: 0 21px;
      height: 80px;
      border-bottom: 1px solid #e2e2e2;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &:last-child {
        border-bottom: none;
      }

      .title {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #1e1e1e;
        display: flex;

        img {
          width: 22px;
          height: 22px;
          margin-right: 6px;
        }

        span {
          display: inline-block;
        }
      }

      .date {
        margin-top: 12px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #4e5969;
      }
    }
  }
}
</style>
