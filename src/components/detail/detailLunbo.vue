<template>
  <div class="lunbo-box">
    <div class="slt-wrap">
      <div class="lunbo-arrow arrow-left" @click="toPrev()">
        <i class="el-icon-arrow-up"></i>
      </div>
      <div class="lunbo-slt-list">
        <div
          class="lunbo-slt-item cover hidden"
          v-for="(item, index) in imageViewList"
          :key="index"
          :class="{
            active: index == activeSwipeIndex,
            shown: Math.floor(index / 4) == shownGroupIndex,
          }"
          @click="onClickSwipeItem(index)"
        >
          <img v-if="!item.videoUrl" :src="item.image" />
          <video
            v-else
            :src="item.videoUrl"
            muted
            loop
            :controls="false"
            style="object-fit: fill"
          ></video>
        </div>
      </div>
      <div class="lunbo-arrow arrow-right" @click="toNext()">
        <i class="el-icon-arrow-down"></i>
      </div>
    </div>

    <div class="zhutu-wrap">
      <div
        class="zhutu-inner"
        @mouseover="showMaskModal = true"
        @mouseout="showMaskModal = false"
      >
        <el-carousel
          ref="carousel"
          :autoplay="false"
          :interval="4000"
          @change="onCarouseChange"
        >
          <el-carousel-item v-for="(item, index) in imageViewList" :key="index">
            <div class="img-box">
              <el-image
                v-if="!item.videoUrl"
                :src="item.image"
                :preview-src-list="imgs"
              >
              </el-image>
              <video
                v-else
                ref="movie"
                class="video"
                muted
                autoplay
                loop
                :controls="false"
                style="object-fit: fill"
                @click="large(imageList.videoUrl, index)"
              >
                <source :src="imageList.videoUrl" type="video/mp4" />
              </video>
              <i
                v-show="item.videoUrl && isplay"
                class="el-icon-video-play"
                @click="handlePlay"
              ></i>
              <i
                v-show="item.videoUrl && !isplay"
                class="el-icon-video-pause"
                @click="handlePause"
              ></i>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!-- <div class="mask-modal" v-if="showMaskModal">
          <div class="mask-inner">
            <img :src="imageList[activeSwipeIndex]" alt />
          </div>
        </div> -->

    <!-- 缩略图 -->

    <el-dialog
      custom-class="cd-img"
      :visible.sync="centerDialogVisible"
      width="1200px"
      @close="close"
      center
    >
      <div class="img">
        <video
          width="100%"
          height="100%"
          ref="video"
          muted
          autoplay
          controls
          style="object-fit: fill"
        >
          <source :src="imgVideoList" type="video/mp4" />
        </video>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "carouselComponent",
  components: {},
  props: ["imageList"],
  data() {
    return {
      showMaskModal: false, //是否展示模态框
      activeSwipeIndex: 0, //轮播图指示器
      isplay: false, // 视频播放按键是否显示
      imgs: [],
      imgVideoList: [],
      centerDialogVisible: false,
      currentIndex: 0,
    };
  },
  computed: {
    imageViewList() {
      let imgList = this.imageList; //.images;
      // console.log('??',imgList)
      this.imgs = imgList && imgList.map((v) => v.image);
      // if (this.imageList.videoUrl != "") {
      //   imgList &&
      //     imgList.push({
      //       image: "",
      //       videoUrl: this.imageList.videoUrl,
      //       index: imgList.length,
      //     });
      // }
      return imgList;
    },

    shownGroupIndex() {
      return Math.floor(this.activeSwipeIndex / 6);
    },

    imageListShown() {
      let imgList = this.imageList.images;
      imgList &&
        imgList.push({
          image: "",
          videoUrl: this.imageList.videoUrl,
          index: imgList.length,
        });
      let group = Math.floor(this.activeSwipeIndex / 6);
      let start = this.activeSwipeIndex * group;
      let end = this.activeSwipeIndex * group + 6;
      console.log(start, end);

      return imgList.slice(start, end);
    },
  },
  mounted() {
    if (this.$refs.movie) {
      this.$refs.movie.addEventListener("play", this.handlePlay);
      this.$refs.movie.addEventListener("pause", this.handlePause);
    }
  },
  methods: {
    //幻灯片切换
    onCarouseChange(index_curr, index_prev) {
      //console.log(index_curr, index_prev);
      this.activeSwipeIndex = index_curr;
    },

    //手段切换幻灯片
    onClickSwipeItem(index) {
      this.$refs.carousel.setActiveItem(index);
    },

    toPrev() {
      this.$refs.carousel.prev();
    },
    toNext() {
      this.$refs.carousel.next();
    },
    // 播放
    handlePlay() {
      this.$refs.movie[0].play();
      this.isplay = false;
    },
    // 暂停
    handlePause() {
      this.$refs.movie[0].pause();
      this.isplay = true;
    },
    large(imgVideo, index) {
      // 图片放大

      if (imgVideo.length > 0) {
        this.imgVideoList = imgVideo;
        this.currentIndex = index;
        this.centerDialogVisible = true;
      }
    },
    close() {
      if (this.$refs.video !== undefined) {
        this.$refs.video.pause();
      }
    },
  },
};
</script>

<style scoped lang="less">
.el-dialog__wrapper {
  overflow: hidden !important;
}
/deep/.el-dialog {
  background: transparent !important;
  box-shadow: 0 0 0 transparent;
  .el-dialog__header {
    position: fixed;
    top: 5%;
    right: 2%;
    z-index: 9999;
    .el-dialog__headerbtn {
      .el-dialog__close {
        background-color: #7e848f;
        border-radius: 50%;
        color: #fff;
        padding: 0.25rem;
        font-size: 3.25rem;
      }
    }
  }
  .el-dialog__body {
    padding: 0;
    vertical-align: bottom;
  }
  .img {
    width: 100%;
    position: relative;
    .el-button {
      position: absolute;
      top: 50%;
    }
  }
}
/deep/ .el-carousel {
  width: 624px;
  height: 624px;
  border-radius: 24px;
}

/deep/ .el-carousel__container {
  height: 100%;
}

/deep/ .el-carousel__indicators {
  display: none;
}

.zhutu-wrap {
  width: 624px;
  height: 624px;
  padding: 0 0px;

  .zhutu-inner {
    border: 1px solid #eee;
    overflow: hidden;
    width: 624px;
    height: 624px;
    border-radius: 24px;
    margin: 0 auto;
    user-select: none;
  }
}

.lunbo-box {
  width: 783px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    cursor: move;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    background: #f8f8f8;
    background: #fff;
    padding: 0;

    img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 24px;
    }
    video {
      width: 100%;
      height: 100%;
    }

    .el-image {
      max-width: 100%;
      max-height: 100%;

      /deep/ img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }

  .mask-modal {
    position: absolute;
    z-index: 10000;
    left: 401px;
    top: 0;
    background-color: #eee;
    border: 1px solid #bbb;

    .mask-inner {
      width: 700px;
      height: 700px;

      img {
        width: 100%;
        max-height: 100%;
      }
    }
  }
}

.lunbo-slt-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  flex: 1;
  padding: 16px 0;
  gap: 10px;

  .lunbo-slt-item {
    width: 120px;
    height: 120px;
    padding: 0;
    cursor: pointer;
    border: 1px solid #CECECE;

    &.hidden {
      display: none;
    }

    &.shown {
      display: block;
    }

    &:nth-child(6n) {
      margin-right: 0;
    }

    &.active {
      border: 1px solid #009f39;
    }

    img {
      width: 100%;
      height: 100%;
    }
    video {
      width: 100%;
      height: 100%;
    }
  }
}

.slt-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 624px;
}

.lunbo-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  cursor: pointer;
  width: 121px;
  height: 39px;
  background: #f1f1f1;
  border-radius: 6px 6px 6px 6px;

  &:hover {
    background: #EC6A2B;
    i {
      color: #fff;
    }
  }

  i {
    font-size: 24px;
    color: #1E262E;
  }
}
</style>

<style
  scoped
  lang="less"
  src="@/assets/h5css/mobile/product-detail.less"
></style>

<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
