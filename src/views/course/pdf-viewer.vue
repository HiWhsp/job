<script>
export default {
  name: "pdf-viewer",
  data() {
    return {
      id: "",
      index: "",
      detail: {},
      tableData: [],
      selectItem: {},
      startTime: null, // 记录开始学习时间
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.index = this.$route.query.index || 0;
    this.setView();
  },
  // 页面关闭前提交学习记录
  beforeDestroy() {    
    this.submitLearnRecord();
  },
  methods: {
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
          this.tableData = res.data.course_list;
          if (this.index) {
            this.selectItem = this.tableData[this.index];
          } else {
            this.selectItem = this.tableData[0];
          }
          // 记录开始学习时间
          this.startTime = new Date().getTime();
        }
      });
    },
    // 上下切换
    arrow(type) {      
      // 切换前提交当前学习记录
      this.submitLearnRecord();

      if (type == "up") {
        if (this.index > 0) {
          this.index--;
        } else {
          this.index = 0;
        }
      } else {
        if (this.index < this.tableData.length - 1) {
          this.index++;
        } else {
          this.index = this.tableData.length - 1;
        }
      }

      // 更新选中项并重新记录开始时间
      this.selectItem = this.tableData[this.index];
      this.startTime = new Date().getTime();

      if (
        ["pdf", "doc", "docx", "xls", "xlsx"].includes(
          this.tableData[this.index].file_path_url.split(".").pop()
        )
      ) {
        // 如果当前路由是pdf-viewer，则不进行跳转
        if (this.$route.path == "/pdf-viewer") {
          return;
        }
      } else {
        this.goUrl({
          url: "/video-viewer",
          query: { id: this.id, index: this.index },
        });
      }
    },
    goUrl(item) {
      this.$router.push({
        path: item.url,
        query: item.query,
      });
    },
    // 根据url判断是否是pdf
    isPdf(url) {
      if (url) {
        return url.endsWith(".pdf") || url.endsWith(".PDF");
      }
      return false;
    },
    // 处理PDF URL编码，解决文件名乱码问题
    getPdfUrl(url) {
      if (!url) return "";

      try {
        // 如果是相对路径，先转换为绝对路径
        if (url.startsWith("/")) {
          url = window.location.origin + url;
        }

        // 对URL进行编码，确保中文字符正确显示
        return encodeURI(url);
      } catch (error) {
        console.error("PDF URL编码错误:", error);
        return url;
      }
    },
    // 将时间格式 "05:00" 转换为秒数
    timeToSeconds(timeStr) {
      if (!timeStr) return 0;
      const parts = timeStr.split(":");
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    },
    // 提交学习记录
    submitLearnRecord() {      
      if (!this.startTime || !this.selectItem.id) return;

      const endTime = new Date().getTime();
      const currentLearnTime = Math.floor((endTime - this.startTime) / 1000); // 当前学习时长（秒）

      // 获取课程总时长（秒）
      const totalTime = this.timeToSeconds(this.selectItem.learn_time);

      // 计算当前学习进度百分比
      let currentSchedule = 0;
      if (totalTime > 0) {
        currentSchedule = Math.min(Math.floor((currentLearnTime / totalTime) * 100), 100);
      }

      this.recordMyCourseList(currentSchedule, currentLearnTime);
    },

    recordMyCourseList(schedule = 0, has_learn_time = 0) {
      this.$api({
        url: "addMyCourseLearnRecord",
        method: "post",
        data: {
          course_id: this.detail.id,
          course_list_id: this.selectItem.id,
          schedule:
            this.selectItem.my_course_record.schedule > schedule
              ? this.selectItem.my_course_record.schedule
              : schedule,
          has_learn_time: has_learn_time,
        },
      });
    },
  },
};
</script>

<template>
  <div class="wrap">
    <div class="left">
      <div class="arrow">
        <div class="arrow-top" @click="arrow('up')">
          <img alt="" src="@/static/common/arrow-top.png" />
        </div>
        <div class="col"></div>
        <div class="arrow-bottom" @click="arrow('down')">
          <img alt="" src="@/static/common/arrow-bottom.png" />
        </div>
      </div>
      <div class="next-btn" @click="goUrl({ url: '/course-detail', query: { id: id } })">
        <img alt="" src="@/static/common/arrow-left.png" />
        <span>返回课程详情</span>
      </div>
      <div class="menu">
        <div class="index">第{{ index + 1 }}节</div>
        <div class="line">
          <div class="line-inner">{{ index + 1 }}</div>
        </div>
        <div class="text">第{{ index + 1 }}节: {{ selectItem.title }}</div>
      </div>
      <div class="content">
        <iframe
          v-if="isPdf(selectItem.file_path_url)"
          :src="selectItem.file_path_url"
          width="100%"
          height="100%"
        ></iframe>
        <!-- 展示docs文件 -->
        <iframe
          v-else
          width="100%"
          height="100%"
          :src="`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
            selectItem.file_path_url
          )}`"
        />
      </div>
    </div>
    <div class="right">
      <div class="tit-info">
        <p class="title">{{ detail.title }}</p>
        <p class="text">课时：{{ tableData.length }} 发布时间：{{ detail.created_at }}</p>
      </div>
      <div class="menu-right">
        <p>目录</p>
      </div>
      <div class="menu-list">
        <div class="col"></div>
        <div class="menu">
          <div
            v-for="(item, index) in tableData"
            :key="index"
            class="menu-item"
            :class="{ active: selectItem.id == item.id }"
          >
            <p class="index">第{{ index + 1 }}节</p>
            <div class="line"></div>
            <p class="text ellipsis-1">{{ item.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.wrap {
  display: flex;
  height: 100vh;
}

.left {
  position: relative;
  height: 100%;
  flex: 1;
  background-color: #424246;

  .arrow {
    position: absolute;
    left: 118px;
    width: 50px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .arrow-top,
    .arrow-bottom {
      cursor: pointer;
      width: 50px;
      height: 26px;
      background: #545662;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
      text-align: center;

      img {
        width: 24px;
        height: 24px;
      }
    }

    .col {
      height: 100%;
      width: 4px;
      background: #d8d8d8;
    }
  }

  .next-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 102px;
    height: 24px;
    background: #d8d8d8;
    margin-top: 15px;

    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #3d3d3d;

    img {
      width: 14px;
      height: 14px;
    }
  }

  .menu {
    display: flex;
    align-items: center;
    position: absolute;
    top: 50px;
    left: 65px;

    .index {
      width: 74px;
      height: 20px;
      line-height: 20px;
      background: #161616;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      text-align: center;
      color: #d6d6d6;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }

    .line {
      width: 28px;
      height: 28px;
      background: #bea069;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-left: -10px;

      .line-inner {
        width: 22px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background: #175e3d;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #ffffff;
        border-radius: 50%;
      }
    }

    .text {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #ffffff;
      margin-left: 20px;
    }
  }

  .content {
    position: absolute;
    top: 110px;
    left: 25px;
    width: 1532px;
    height: 760px;
    background: #ececec;
  }
}

.right {
  width: 348px;
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;

  .tit-info {
    width: 348px;
    height: 109px;
    background: #d5dde6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 20px;

    .title {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #1f253b;
    }

    .text {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #676767;
      margin-top: 20px;
    }
  }

  .menu-right {
    width: 348px;
    height: 44px;
    background: #eff3f7;
    line-height: 42px;
    padding-left: 20px;

    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 16px;
    color: @theme;

    p {
      width: 32px;
      border-bottom: 3px solid @theme;
    }
  }

  .menu-list {
    flex: 1;
    position: relative;

    .col {
      position: absolute;
      width: 1px;
      height: 100%;
      background: #d8d8d8;
      left: 59px;
    }

    .menu {
      position: relative;
      flex: 1;
      margin-top: 27px;
      margin-left: 13px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      margin-bottom: 27px;

      .index {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #999fa4;
      }

      .line {
        width: 15px;
        height: 15px;
        background: #ffffff;
        border: 1px solid #d3d3d3;
        border-radius: 50%;
        margin: 0 10px 0 8px;
      }

      .text {
        width: 200px;
        height: 18px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #3d3d3d;
      }

      &.active {
        .index {
          color: @theme;
        }

        .line {
          background-color: @theme;
        }

        .text {
          color: @theme;
        }
      }
    }
  }
}
</style>
