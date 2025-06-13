<script>
export default {
  name: "video-viewer",
  data() {
    return {
      id: "",
      index: "",
      totalDuration: "", // 视频总时长
      detail: {},
      tableData: [],
      selectItem: {},
    };
  },
  unmounted() {
    // 保存播放时长
    this.savePlayTime();
    // 移除事件监听器
    window.removeEventListener("beforeunload", this.savePlayTime);
  },
  beforeDestroy() {
    // 保存播放时长
    this.savePlayTime();
    // 移除事件监听器
    window.removeEventListener("beforeunload", this.savePlayTime);
  },
  mounted() {
    this.id = this.$route.query.id;
    this.index = this.$route.query.index || 0;
    this.setView();
    // 监听页面退出
    window.addEventListener("beforeunload", this.savePlayTime);
  },
  methods: {
    setView() {
      this.$api({
        url: "getCourse",
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
          // 恢复播放进度
          this.restorePlayTime();
        }
      });
    },
    // 上下切换
    arrow(type) {
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
      this.selectItem = this.tableData[this.index];
    },
    goUrl(item) {
      this.$router.push({
        path: item.url,
        query: item.query,
      });
    },
    // 禁止加速播放
    handleRateChange() {
      const video = this.$refs.videoPlayer;
      if (video.playbackRate !== 1) {
        video.playbackRate = 1; // 强制设置为正常速度
        this.$message.warning("禁止调整播放速度！");
      }
    },
    // 保存播放时长
    savePlayTime() {
      console.log(123);
      const video = this.$refs.videoPlayer;
      const playTime = video.currentTime.toFixed(0);
      const progress = this.totalDuration
        ? ((playTime / this.totalDuration) * 100).toFixed(0)
        : 0;
      this.sendToBackend(playTime, progress);
    },
    async sendToBackend(playTime, progress) {
      const schedule = progress > 100 ? 100 : progress;
      this.$api({
        url: "addMyCourseLearnRecord",
        method: "post",
        data: {
          course_id: this.id,
          course_list_id: this.selectItem.id,
          has_learn_time: playTime,
          schedule,
        },
      });
    },
    // 恢复播放进度
    restorePlayTime() {
      const savedTime = this.selectItem.my_course_record.has_learn_time;
      if (savedTime) {
        this.$refs.videoPlayer.currentTime = parseFloat(savedTime);
      }
    },
    // 获取视频总时长
    handleLoadedMetadata() {
      const video = this.$refs.videoPlayer;
      this.totalDuration = video.duration || 0; // 获取总时长，单位为秒
      if (isNaN(this.totalDuration) || !this.totalDuration) {
        console.warn("无法获取视频时长，可能视频未正确加载");
      }
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
        <div class="index">
          章节{{ index + 1 }}
          <div class="index-collapse">课时</div>
        </div>
        <div class="line">
          <div class="line-inner">{{ index + 1 }}</div>
        </div>
        <div class="text">第{{ index + 1 }}节: {{ selectItem.title }}</div>
      </div>
      <div class="content">
        <video
          id="video-player"
          ref="videoPlayer"
          :src="selectItem.file_path_url"
          controls
          @loadedmetadata="handleLoadedMetadata"
          @ratechange="handleRateChange"
        ></video>
        <div class="mock"></div>
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
            :class="{ active: selectItem.id == item.id }"
            class="menu-item"
          >
            <p class="index">第{{ index + 1 }}节</p>
            <div class="line"></div>
            <div class="text">
              <p class="title ellipsis-1">{{ item.title }}</p>
              <p class="time">
                <img alt="" src="@/static/common/video.png" />
                <span>{{ item.learn_time }}</span>
              </p>
            </div>
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
    left: 25px;

    .index {
      display: flex;
      justify-content: space-between;
      padding-left: 15px;
      width: 115px;
      height: 20px;
      line-height: 20px;
      background: #d8d8d8;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #3d3d3d;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;

      .index-collapse {
        width: 59px;
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

    #video-player {
      width: 100%;
      height: 100%;
    }

    .mock {
      width: 100%;
      height: 30px;
      bottom: 0;
      position: absolute;
    }
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
        display: flex;
        justify-content: space-between;
        width: 260px;
        height: 18px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #3d3d3d;

        .title {
          width: 200px;
        }

        .time {
          display: flex;
          align-items: center;

          img {
            width: 16px;
            height: 16px;
            margin-right: 5px;
          }
        }
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
