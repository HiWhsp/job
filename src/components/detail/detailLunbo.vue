<template>
  <div class="lunbo-box">
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
          <el-carousel-item v-for="item in imageViewList" :key="item">
            <div class="img-box">
              <el-image :src="item" :preview-src-list="imageViewList">
              </el-image>
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
    <div class="slt-wrap">
      <div class="lunbo-arrow arrow-left" @click="toPrev()">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="lunbo-arrow arrow-right" @click="toNext()">
        <i class="el-icon-arrow-right"></i>
      </div>

      <div class="lunbo-slt-list">
        <div
          class="lunbo-slt-item cover hidden"
          v-for="(item, index) in imageList"
          :key="index"
          :class="{
            active: item.index == activeSwipeIndex,
            shown: Math.floor(item.index / 4) == shownGroupIndex,
          }"
          @click="onClickSwipeItem(item.index)"
        >
          <img :src="item.image" />
        </div>
      </div>
    </div>
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
    };
  },
  computed: {
    imageViewList() {
      return this.imageList.map((v) => v.image);
    },

    shownGroupIndex() {
      return Math.floor(this.activeSwipeIndex / 6);
    },

    imageListShown() {
      let group = Math.floor(this.activeSwipeIndex / 6);
      let start = this.activeSwipeIndex * group;
      let end = this.activeSwipeIndex * group + 6;
      return this.imageList.slice(start, end);
    },
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
  },
};
</script>

<style scoped lang="less">
/deep/ .el-carousel {
  width: 400px;
  height: 400px;
}

/deep/ .el-carousel__container {
  height: 100%;
}

/deep/ .el-carousel__indicators {
  display: none;
}

.zhutu-wrap {
  width: 512px;
  padding: 0 0px;

  .zhutu-inner {
    border: 1px solid #eee;
    overflow: hidden;
    width: 512px;
    height: 512px;
    margin: 0 auto;
    user-select: none;
  }
}

.lunbo-box {
  position: relative;
  width: 512px;
//   height: 400px;
  // border: 1px solid #eee;
  // padding-top: 20px;

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
  margin-left: 30px;
  margin-right: 30px;
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .lunbo-slt-item {
    width: 76px;
    height: 76px;
    padding: 0;
    cursor: pointer;
    border: 1px solid transparent;
    margin-right: 10px;
    border: 1px solid #dddddd;

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
      border: 1px solid #2E4C87;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.slt-wrap {
  position: relative;
}

.lunbo-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 3;
  cursor: pointer;
  top: 50%;
  transform: translate(0, -50%);

  //   height: 74p  rgba(0, 0, 0, 0.3);
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 50%;
  border: 1px solid #aaa;
  border: 1px solid transparent;

  &.arrow-left {
    left: 0px;
  }

  &.arrow-right {
    right: 0px;
  }

  i {
    color: #fff;
    font-size: 20px;
    font-size: 14px;
    font-size: 24px;
    color: #aaa;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/mobile/product-detail.less"></style>