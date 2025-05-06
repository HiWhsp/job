<template>
  <div class="course-detail-page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">全部课程</el-breadcrumb-item>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page">
      <div class="main-content">
        <!-- 课程头部信息 -->
        <div class="course-header">
          <div class="title">
            <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f4c4.png"/>
            <span>教学常规，掌握教学方法和技巧</span>
          </div>
          <div class="info">
            <span>课程状态：已完成</span>
            <span>发布时间：2025-01-02</span>
          </div>
          <div class="actions">
            <el-button icon="el-icon-star-off" type="text">收藏</el-button>
            <el-button type="primary">开始学习</el-button>
          </div>
        </div>
        <!-- 左侧主体 -->
        <div class="main-left">
          <!-- 标签页 -->
          <el-tabs value="intro">
            <el-tab-pane label="课程介绍" name="intro">
              <div class="section">
                <h3>课程介绍</h3>
                <p>
                  教师在课堂中所面临的挑战包括教学计划、教学进度、教学目标等。本课程围绕教学常规展开，帮助教师理清教学重点，掌握教学技巧。</p>
                <p>课程目标：提升课堂效率、增强学生参与感、提升教师专业能力。</p>
              </div>
              <div class="section">
                <h3>目录</h3>
                <el-collapse accordion>
                  <el-collapse-item
                      v-for="(item, index) in tableData"
                      :key="index"
                      :name="index.toString()"
                      :title="item.title"
                  >
                    <div class="catalog-detail">
                      <p><strong>进度：</strong>{{ item.progress }}</p>
                      <el-button size="mini" type="primary">{{ item.action }}</el-button>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div class="section">
                <h3>主课程考试</h3>
                <div class="exam-card">
                  <p>考试名称：教师考试模拟</p>
                  <p>题数：100题，限时：120分钟</p>
                  <p>考试时间：2025-04-27 08:00 至 2025-04-30 08:00</p>
                  <el-button size="mini" type="success">开始考试</el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="目录" name="catalog"/>
            <el-tab-pane label="关联考试" name="exam"/>
          </el-tabs>
        </div>
      </div>
      <!-- 右侧推荐课程 -->
      <div class="main-right">
        <div class="recommend-header">
          <img alt="" src="@/static/account/tuijian.png">
          <span>推荐课程</span>
        </div>
        <div class="recommend-list">
          <div v-for="item in 5" :key="item" class="recommend-item">
            <div class="title">
              <img alt="" src="@/static/home/file3.png">
              <span>师德师风建设，强化职业道德</span>
            </div>
            <div class="date">2025-01-02</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'course-detail',
  data() {
    return {
      tableData: [
        {title: '第一节 - 教师规范与管理制度讲解', progress: '70%', action: '学习'},
        {title: '第二节 - 教学流程优化与策略', progress: '70%', action: '学习'},
        {title: '第三节 - 教学互动与反馈技巧', progress: '70%', action: '学习'},
        {title: '第四节 - 教师时间管理', progress: '70%', action: '学习'},
        {title: '第五节 - 教学效果评估', progress: '100%', action: '学习'},
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.course-detail-page {
  background-color: #F5F6F6;
  padding-bottom: 60px;

  .nav-bar {
    width: 1200px;
    margin: 0 auto;
    padding: 16px 0;
  }

  .page {
    width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    justify-content: space-between;
  }

  .course-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;

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

    .info {
      font-size: 12px;
      color: #999;

      span {
        margin-right: 10px;
      }
    }

    .actions {
      display: flex;
      align-items: center;

      .el-button {
        margin-left: 10px;
      }
    }
  }

  .main-content {
    display: flex;
    flex-direction: column;
    margin-top: 20px;

    .main-left {
      width: 75%;
      padding-right: 20px;

      .section {
        margin-bottom: 30px;

        h3 {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .exam-card {
          background: #f6f9f6;
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
        }

        .catalog-detail {
          padding: 10px 0;
          font-size: 14px;

          p {
            margin: 0 0 10px 0;
          }
        }
      }
    }
  }

  .main-right {
    width: 276px;
    background: #FFFFFF;

    .recommend-header {
      height: 60px;
      display: flex;
      align-items: center;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #3D3D3D;
      padding-left: 20px;
      border-bottom: 1px dashed #D8D8D8;


      img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }
    }

    .recommend-item {
      margin: 0 21px;
      height: 80px;
      border-bottom: 1px solid #E2E2E2;
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
        color: #1E1E1E;
        display: flex;

        img {
          width: 22px;
          height: 22px;
          margin-right: 6px;
        }
      }

      .date {
        margin-top: 12px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #4E5969;
      }
    }
  }
}
</style>
