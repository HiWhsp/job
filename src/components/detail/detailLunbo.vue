<template>
  <div class="lunbo-box">
    <div class="zhutu-wrap">
      <div class="zhutu-inner" @mouseover="showMaskModal = true" @mouseout="showMaskModal = false">
        <el-carousel ref="carousel" :autoplay="false" :interval="4000" @change="onCarouseChange">
          <el-carousel-item v-for="item in imageViewList" :key="item">
            <div class="img-box">
              <el-image :src="item" :preview-src-list="imageViewList"></el-image>
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
        <div class="lunbo-slt-item cover hidden" v-for="(item, index) in imageList" :key="index" :class="{
                    active: item.index == activeSwipeIndex,
                    shown: Math.floor(item.index / 4) == shownGroupIndex,
                }" @click="onClickSwipeItem(item.index)">
          <img :src="item.image"/>
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
  width: 582px;
  height: 389px;
}

/deep/ .el-carousel__container {
  height: 100%;
}

/deep/ .el-carousel__indicators {
  display: none;
}

.zhutu-wrap {
  width: 582px;

  .zhutu-inner {
    overflow: hidden;
    width: 582px;
    height: 389px;
    margin: 0 auto;
    user-select: none;
  }
}


.lunbo-box {
  position: relative;
  width: 582px;
  height: 490px;
  // padding-top: 20px;

  .img-box {
    .flex-center();
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
  height: 92px;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .lunbo-slt-item {
    width: 138px;
    height: 92px;
    padding: 0;
    cursor: pointer;
    margin-right: 10px;

    &.hidden {
      display: none;
    }

    &.shown {
      display: block;
    }

    &:nth-child(4n) {
      margin-right: 0;
    }

    &.active {
      border: 1px solid #F74747;
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
  .flex-center();
  position: absolute;
  z-index: 3;
  cursor: pointer;
  top: 50%;
  transform: translate(0, -50%);

  width: 24px;
  height: 24px;
  //background: #fff;
  border-radius: 50%;
  //border: 1px solid #aaa;

  &.arrow-left {
    left: -40px;
  }

  &.arrow-right {
    right: -40px;
  }

  i {
    color: #fff;
    font-size: 24px;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/mobile/product-detail.less"></style>
