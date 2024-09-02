<template>
  <div class="lunbo-box">
    <!-- 主图 -->
    <div
      class="carousel-wrap"
      @mouseover="showMaskModal = true"
      @mouseout="showMaskModal = false"
    >
      <el-carousel
        ref="carousel"
        :autoplay="false"
        :interval="4000"
        @change="onCarouseChange"
      >
        <el-carousel-item v-for="item in swiperImgs" :key="item">
          <!-- :style="item | getBgImage" -->
          <div class="img-box">
            <!-- <img :src="item" /> -->

            <el-image :src="item" :preview-src-list="swiperImgs"> </el-image>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- <div class="mask-modal" v-if="showMaskModal">
      <div class="mask-inner">
        <img :src="swiperImgs[activeSwipeIndex]" alt />
      </div>
    </div> -->

    <!-- 缩略图 -->
    <div class="lunbo-img-list">
      <div
        class="lunbo-img-item cover"
        :class="index == activeSwipeIndex ? 'active' : ''"
        v-for="(item, index) in swiperImgs"
        :key="index"
        @click="onClickSwipeItem(index)"
      >
        <img :src="item" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "carouselComponent",
  components: {},
  props: ["swiperImgs"],

  data() {
    return {
      showMaskModal: false, //是否展示模态框
      activeSwipeIndex: 0, //轮播图指示器
    };
  },
  filters: {
    getBgImage(src) {
      return `backgroundImage: url(${src})`;
    },
  },
  computed: {},
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
  },
};
</script>

<style scoped lang="less">
/deep/ .el-carousel {
  width: 400px;
  width: 960px;
  height: 400px;
  border: 1px solid #eee;
}
/deep/ .el-carousel__container {
  height: 100%;
}
/deep/ .el-carousel__indicators {
  display: none;
}

.lunbo-box {
  position: relative;

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
    padding: 20px;

    img {
      max-width: 100%;
      max-height: 100%;
      max-width: 450px;
      max-height: 450px;
      // visibility: hidden;
    }

    .el-image {
      max-width: 100%;
      max-height: 100%;
      max-width: 450px;
      max-height: 450px;

      /deep/ img {
        max-width: 450px;
        max-height: 450px;
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

  .lunbo-img-list {
    width: 100%;
    margin-top: 25px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    .lunbo-img-item {
      width: 100px;
      height: 100px;
      padding: 0.02rem;
      cursor: pointer;
      border: 1px solid transparent;
      margin-right: 20px;

      &.active {
        border: 1px solid #4CA5E4;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/zujian/carouselComponent.less"></style>
