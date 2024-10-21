<template>
  <div class="lunbo-box">
    <div class="zhutu-wrap">
      <div class="zhutu-inner" @mouseover="showMaskModal = true" @mouseout="showMaskModal = false">
        <el-carousel ref="carousel" :autoplay="false" :interval="4000" @change="onCarouseChange" height="100%">
          <el-carousel-item v-for="item in imageViewList" :key="item">
            <div class="img-box">
              <el-image :src="item" :preview-src-list="imageViewList"></el-image>
            </div>
          </el-carousel-item>
        </el-carousel>

        <div class="collect-icon" @click="collect">
          <img src="@/assets/img/my/no-collect.png" v-if="ifShoucang == 0"/>
          <img src="@/assets/img/my/collect.png" v-if="ifShoucang == 1"/>
        </div>
      </div>
    </div>

    <!-- 缩略图 -->
    <div class="slt-wrap">
      <div class="lunbo-arrow arrow-left" @click="toPrev()">
        <img src="../../assets/img/productDetail/left.png" alt="">
      </div>
      <div class="lunbo-arrow arrow-right" @click="toNext()">
        <img src="../../assets/img/productDetail/right.png" alt="">
      </div>

      <div class="lunbo-slt-list">
        <div class="lunbo-slt-item cover hidden" v-for="(item, index) in imageList" :key="index" :class="{
                    active: item.index == activeSwipeIndex,
                    shown: Math.floor(item.index / 6) == shownGroupIndex,
                }" @click="onClickSwipeItem(item.index)">
          <img :src="item.image"/>
        </div>
      </div>
    </div>

    <!-- 下载 -->
    <div class="down">
      <div class="it flex flex-center pointer">
        <img src="@/assets/img/productDetail/download.png" alt="pdf">
        <span>产品说明书</span>
      </div>
    </div>

    <el-dialog title="操作提示" width="580px" custom-class="cus-modal-wrap" :close-on-click-modal="true"
               :visible.sync="show_modal">
      <div class="modal-inner">
        <div class="text-box">
          确认取消收藏当前商品?
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn btn-ripple fit-text btn-1" @click="show_modal = false">取消</button>
        <el-button class="btn btn-ripple fit-text btn-2 btn-bg" @click="throttle_do_confirm()">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "carouselComponent",
  components: {},
  props: ["imageList", "detail"],
  data() {
    return {
      show_modal: false, // 是否展示模态框
      showMaskModal: false, //是否展示模态框
      activeSwipeIndex: 0, //轮播图指示器
      ifShoucang: null
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
  watch: {
    detail() {
      this.ifShoucang = this.detail.ifShoucang;
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

    // 收藏
    collect() {
      if (this.ifShoucang) {
        this.show_modal = true;
      } else {
        this.throttle_do_confirm();
      }
    },

    throttle_do_confirm() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_operate",
          operateType: 1,
          operateSence: this.ifShoucang == 0 ? 0 : 1,
          productId: this.detail.productId,
        },
      }).then(res => {
        if (res.code == 200) {
          this.show_modal = false;
          this.$message.success(res.msg);
          this.ifShoucang = this.ifShoucang == 0 ? 1 : 0;
        }
      })
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-carousel {
  width: 100%;
  height: 100%;
}

/deep/ .el-carousel__container {
  height: 100%;
}

/deep/ .el-carousel__indicators {
  display: none;
}

.zhutu-wrap {
  width: 355px;

  .zhutu-inner {
    border: 1px solid #eee;
    overflow: hidden;
    width: 355px;
    height: 355px;
    margin: 0 auto;
    user-select: none;

    .collect-icon {
      position: absolute;
      top: 17px;
      right: 11px;
      width: 33px;
      height: 33px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 2;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  button {
    width: 120px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid @theme;

    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: @theme;

    & + button {
      margin-left: 16px;
    }
  }

  .btn-bg {
    background: @theme;
    color: #ffffff;
  }
}


.lunbo-box {
  position: relative;
  width: 355px;
  height: 355px;

  .img-box {
    .flex-center();
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    cursor: move;
    margin: 0 auto;
    width: 355px;
    height: 355px;
    background: #f8f8f8;
    background: #fff;
    padding: 0;

    img {
      width: 355px;
      height: 355px;
    }

    .el-image {
      width: 355px;
      height: 355px;

      /deep/ img {
        width: 355px;
        height: 355px;
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
  margin-left: 24px;
  margin-right: 24px;
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .lunbo-slt-item {
    width: 60px;
    height: 60px;
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
      border-radius: 8px;
      border: 2px solid @theme;
    }

    img {
      border-radius: 8px;
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
  background: #fff;
  border-radius: 50%;

  &.arrow-left {
    //left: 20px;
  }

  &.arrow-right {
    right: 0px;
  }

  i {
    color: #fff;
    font-size: 20px;
    font-size: 14px;
    color: #aaa;
  }
}

.down {
  margin-top: 22px;
  display: flex;

  .it {
    padding: 5px 10px;
    border-radius: 2px;
    border: 1px solid #E6E4E1;
    margin-right: 15px;

    img {
      width: 15px;
      height: 15px;
      margin-right: 3px;
    }

    span {
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 14px;
      color: #77797B;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/mobile/product-detail.less"></style>
