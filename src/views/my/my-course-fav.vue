<template>
  <div class="page">
    <div class="main-title">
      <span>我收藏的课程</span>
    </div>
    <div class="page-ctx">
      <template v-for="(item, index) in product_list">
        <div class="item" v-if="item.course_type == 1">
          <div class="left">
            <div class="tit">
              <img alt="" src="@/static/home/file3.png">
              <span>{{ item.title }}</span>
            </div>
            <div class="progress">
              <el-progress :format="format(item.learn_time)" :percentage="item.learn_time"></el-progress>
            </div>
            <div class="desc">{{ item.description }}</div>
          </div>
          <div class="right" @click="toProduct(item)">继续学习</div>
        </div>

        <div class="item2" v-if="item.course_type == 2">
          <img alt="" :src="item.thumb_url">
          <div class="left">
            <div class="tit">
              <span>{{ item.title }}</span>
            </div>
            <div class="progress">
              <el-progress :format="format(item.learn_time)" :percentage="item.learn_time"></el-progress>
            </div>
          </div>
          <div class="right" @click="toProduct(item)">继续学习</div>
        </div>
      </template>
      <el-empty v-if="!count" description="暂无数据..." ></el-empty>
    </div>
  </div>
</template>

<script>

export default {
  name: "my-course-fav",
  data() {
    return {
      count: 0,
      product_list: [],
    };
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'getCourseList',
        method: 'get',
        data: {
          page: 1,
          limit: 10,
          learn_type: 5,
        }
      }).then(res => {
        if (res.code == 200) {
          this.product_list = res.data.list;
          this.count = res.data.count;
        }
      })
    },
    toProduct(item) {
      this.$router.push({
        path: '/course-detail?id=' + item.id
      });
    },
    format(percentage) {
      return `已学习${percentage}%`;
    },
  },
};
</script>

<style lang="less" scoped>
.user-avatar {
  object-fit: cover;
}

.page {
  text-align: left;
  padding-bottom: 80px;
  padding-top: 0;

  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 14px;
    padding: 30px;
    background: #fff;

    .item {
      height: 161px;
      padding: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #E6E6E6;

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
            color: #1F253B;
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
          color: #929AA2;
        }
      }

      .right {
        width: 142px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #FFFFFF;
        border: 1px solid #175E3D;
        cursor: pointer;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #175E3D;
        border-radius: 6px;
      }
    }

    .item2 {
      display: flex;
      height: 161px;
      padding: 30px;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      border-bottom: 1px solid #E6E6E6;

      img {
        width: 160px;
        height: 90px;
      }

      .left {
        width: 600px;
        margin-left: 24px;

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
            color: #1F253B;
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
          color: #929AA2;
        }
      }

      .right {
        width: 142px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #FFFFFF;
        border: 1px solid #175E3D;
        cursor: pointer;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #175E3D;
        border-radius: 6px;
      }
    }
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;

  }
}
</style>
